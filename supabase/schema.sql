-- =====================================================================
-- SYRMUN 2027 — database schema
-- Run once in: Supabase > SQL Editor > New query > paste > Run
-- Safe to re-run (uses IF NOT EXISTS / ON CONFLICT / DROP POLICY IF EXISTS).
-- =====================================================================

-- ---------- Admins -------------------------------------------------
-- Only people listed here can use the admin panel. Add them with make_admin.sql.
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

drop policy if exists "admins read self" on public.admins;
create policy "admins read self" on public.admins
  for select to authenticated using (user_id = auth.uid());
-- (no insert/update/delete policies: admins can only be added from the SQL editor)

-- ---------- Settings (key/value) ----------------------------------
-- Everything in here is PUBLIC. Never store secrets in this table.
create table if not exists public.settings (
  key        text primary key,
  value      text not null default '',
  updated_at timestamptz not null default now()
);
alter table public.settings enable row level security;

drop policy if exists "settings public read" on public.settings;
create policy "settings public read" on public.settings
  for select to anon, authenticated using (true);
drop policy if exists "settings admin write" on public.settings;
create policy "settings admin write" on public.settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

insert into public.settings (key, value) values
  ('registration_enabled', 'true'),
  ('fee_early',   '10'),
  ('fee_regular', '12'),
  ('fee_late',    '15'),
  ('staff_applications_open', 'true'),
  ('instagram_url', 'https://www.instagram.com/syrmun/')
on conflict (key) do nothing;

-- Read a setting (empty string counts as "not set").
create or replace function public.setting(k text)
returns text
language sql stable security definer
set search_path = public
as $$
  select nullif(btrim(value), '') from public.settings where key = k;
$$;
revoke all on function public.setting(text) from public;

-- ---------- Public content tables ---------------------------------
create table if not exists public.board_members (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name       text not null,
  position   text not null,
  bio        text,
  photo_url  text,
  sort_order int  not null default 0,
  published  boolean not null default true
);

create table if not exists public.committees (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  name         text not null,
  abbreviation text,
  description  text,
  mandate      text,
  topics       text,   -- one topic per line
  issues       text,
  chair        text,
  vice_chair   text,
  guide_url    text,   -- background guide
  sort_order   int  not null default 0,
  published    boolean not null default true
);

create table if not exists public.announcements (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title      text not null,
  body       text,
  sort_order int  not null default 0,
  published  boolean not null default true
);

create table if not exists public.sponsors (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  kind        text not null default 'partner' check (kind in ('sponsor', 'partner')),
  logo_url    text,
  website_url text,
  sort_order  int  not null default 0,
  published   boolean not null default true
);

create table if not exists public.faqs (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  question   text not null,
  answer     text not null,
  category   text not null default 'General',
  sort_order int  not null default 0,
  published  boolean not null default true
);

create table if not exists public.staff_positions (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  title        text not null,
  description  text,
  requirements text,
  deadline     date,
  sort_order   int  not null default 0,
  published    boolean not null default true
);

create table if not exists public.documents (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  title       text not null,
  description text,
  kind        text not null default 'other' check (kind in ('handbook', 'background_guide', 'other')),
  file_url    text not null,
  sort_order  int  not null default 0,
  published   boolean not null default true
);

create table if not exists public.schedule_items (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  day         text not null,          -- e.g. "Day 1"
  start_time  text,                   -- e.g. "09:00"
  title       text not null,
  description text,
  sort_order  int  not null default 0,
  published   boolean not null default true
);

-- Same two policies on every content table:
--   public can read published rows; admins can do everything.
do $$
declare t text;
begin
  foreach t in array array[
    'board_members','committees','announcements','sponsors',
    'faqs','staff_positions','documents','schedule_items'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "public read" on public.%I', t);
    execute format('create policy "public read" on public.%I for select to anon, authenticated using (published or public.is_admin())', t);
    execute format('drop policy if exists "admin write" on public.%I', t);
    execute format('create policy "admin write" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;

-- ---------- Registration window + fee (single source of truth) -----
-- Dates in settings are "YYYY-MM-DD", interpreted in Damascus time (UTC+03),
-- and mean "until the end of that day". Mirrors src/lib/fees.js.
create or replace function public.registration_state(at timestamptz default now())
returns table (state text, phase text, amount numeric)
language plpgsql stable security definer
set search_path = public
as $$
declare
  enabled     boolean     := coalesce(public.setting('registration_enabled'), 'true') = 'true';
  opens       timestamptz := (public.setting('registration_opens')  || ' 00:00:00+03')::timestamptz;
  early_end   timestamptz := (public.setting('early_bird_ends')     || ' 23:59:59+03')::timestamptz;
  regular_end timestamptz := (public.setting('regular_ends')        || ' 23:59:59+03')::timestamptz;
  closes      timestamptz := (public.setting('registration_closes') || ' 23:59:59+03')::timestamptz;
  f_early     numeric := coalesce(public.setting('fee_early'),   '10')::numeric;
  f_regular   numeric := coalesce(public.setting('fee_regular'), '12')::numeric;
  f_late      numeric := coalesce(public.setting('fee_late'),    '15')::numeric;
begin
  if not enabled or (opens is not null and at < opens) then
    return query select 'not_open'::text, null::text, null::numeric;
  elsif closes is not null and at > closes then
    return query select 'closed'::text, null::text, null::numeric;
  elsif early_end is not null and at <= early_end then
    return query select 'open'::text, 'early'::text, f_early;
  elsif regular_end is not null and at <= regular_end then
    return query select 'open'::text, 'regular'::text, f_regular;
  elsif early_end is null and regular_end is null then
    return query select 'open'::text, 'regular'::text, f_regular;
  else
    return query select 'open'::text, 'late'::text, f_late;
  end if;
end;
$$;
revoke all on function public.registration_state(timestamptz) from public;

-- ---------- Delegate applications ---------------------------------
create table if not exists public.delegate_applications (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  full_name        text not null check (char_length(full_name) between 2 and 120),
  email            text not null check (char_length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  institution      text check (char_length(institution) <= 160),
  age_group        text check (age_group in ('under_16', '16_17', '18_24', '25_plus')),
  committee_pref_1 text check (char_length(committee_pref_1) <= 120),
  committee_pref_2 text check (char_length(committee_pref_2) <= 120),
  mun_experience   text check (mun_experience in ('none', '1_2', '3_plus')),
  notes            text check (char_length(notes) <= 1000),
  consent          boolean not null default false check (consent),
  -- managed by the team only (forced to defaults for public submissions):
  status           text not null default 'received'
                   check (status in ('received', 'under_review', 'accepted', 'waitlisted', 'rejected', 'withdrawn')),
  payment_status   text not null default 'unpaid' check (payment_status in ('unpaid', 'paid', 'waived')),
  fee_phase        text,
  fee_amount       numeric(8, 2),
  admin_notes      text
);
create unique index if not exists delegate_applications_email_key
  on public.delegate_applications (lower(email));

create or replace function public.delegate_before_insert()
returns trigger
language plpgsql security definer
set search_path = public
as $$
declare r record;
begin
  if not public.is_admin() then
    select * into r from public.registration_state();
    if r.state = 'not_open' then raise exception 'registration_not_open' using errcode = 'P0001'; end if;
    if r.state = 'closed'   then raise exception 'registration_closed'   using errcode = 'P0001'; end if;
    new.status         := 'received';
    new.payment_status := 'unpaid';
    new.admin_notes    := null;
    new.fee_phase      := r.phase;
    new.fee_amount     := r.amount;
  end if;
  return new;
end;
$$;
drop trigger if exists delegate_before_insert on public.delegate_applications;
create trigger delegate_before_insert before insert on public.delegate_applications
  for each row execute function public.delegate_before_insert();

alter table public.delegate_applications enable row level security;
drop policy if exists "public apply" on public.delegate_applications;
create policy "public apply" on public.delegate_applications
  for insert to anon, authenticated with check (true);
drop policy if exists "admin manage" on public.delegate_applications;
create policy "admin manage" on public.delegate_applications
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------- Staff / volunteer applications ------------------------
create table if not exists public.staff_applications (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  position     text not null check (char_length(position) <= 160),
  full_name    text not null check (char_length(full_name) between 2 and 120),
  email        text not null check (char_length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  institution  text check (char_length(institution) <= 160),
  age_group    text check (age_group in ('under_16', '16_17', '18_24', '25_plus')),
  experience   text check (char_length(experience) <= 1500),
  motivation   text check (char_length(motivation) <= 1500),
  availability text check (char_length(availability) <= 500),
  consent      boolean not null default false check (consent),
  status       text not null default 'received'
               check (status in ('received', 'under_review', 'interview', 'accepted', 'rejected', 'withdrawn')),
  admin_notes  text
);
create unique index if not exists staff_applications_email_position_key
  on public.staff_applications (lower(email), lower(position));

create or replace function public.staff_before_insert()
returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    if coalesce(public.setting('staff_applications_open'), 'true') <> 'true' then
      raise exception 'staff_applications_closed' using errcode = 'P0001';
    end if;
    new.status      := 'received';
    new.admin_notes := null;
  end if;
  return new;
end;
$$;
drop trigger if exists staff_before_insert on public.staff_applications;
create trigger staff_before_insert before insert on public.staff_applications
  for each row execute function public.staff_before_insert();

alter table public.staff_applications enable row level security;
drop policy if exists "public apply" on public.staff_applications;
create policy "public apply" on public.staff_applications
  for insert to anon, authenticated with check (true);
drop policy if exists "admin manage" on public.staff_applications;
create policy "admin manage" on public.staff_applications
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------- File storage (images, handbooks, background guides) ----
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-files', 'site-files', true, 15728640,
  array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'application/pdf']
)
on conflict (id) do nothing;

drop policy if exists "site-files admin insert" on storage.objects;
create policy "site-files admin insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'site-files' and public.is_admin());
drop policy if exists "site-files admin update" on storage.objects;
create policy "site-files admin update" on storage.objects
  for update to authenticated using (bucket_id = 'site-files' and public.is_admin());
drop policy if exists "site-files admin delete" on storage.objects;
create policy "site-files admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'site-files' and public.is_admin());

-- ---------- Starter FAQ (edit/delete from the admin panel) ---------
insert into public.faqs (question, answer, category, sort_order)
select * from (values
  ('What is SYRMUN?',
   'SYRMUN is the Syria Model United Nations: a two-day Model UN conference taking place in Damascus, Syria in 2027 (dates to be confirmed).',
   'General', 1),
  ('Do I need previous MUN experience?',
   'No. SYRMUN is designed to be welcoming to first-time delegates as well as experienced ones. You will be asked about your experience on the registration form so we can support you properly.',
   'Registration', 2),
  ('How do I register?',
   'Use the Register page to submit the online form. You will see a confirmation with a reference number as soon as your application is received.',
   'Registration', 3),
  ('Is "application received" the same as "accepted"?',
   'No. "Received" means we have your application. A delegate is only confirmed once the organising team has reviewed it and marked it as accepted. You will be told when your status changes.',
   'Registration', 4),
  ('How much does it cost?',
   'Registration fees depend on when you register: early bird, regular and late rates apply. See the Delegates page for the current prices and deadlines.',
   'Fees', 5),
  ('How many delegates will attend?',
   'The first conference is planned for approximately 40-60 delegates.',
   'General', 6),
  ('When will the committees and topics be announced?',
   'Committees, topics and background guides will be published on the Committees page as soon as they are finalised.',
   'Committees', 7),
  ('How can my school, organisation or company support SYRMUN?',
   'Please get in touch through the Contact page or the Sponsors & Partners page. We would be glad to hear from you.',
   'Partners', 8)
) as v(question, answer, category, sort_order)
where not exists (select 1 from public.faqs);


-- ---------- Arabic versions of editable content (v1.1) --------------
-- Each editable text field has an optional "<field>_ar" twin. If it is empty the
-- website shows the English text. Safe to run more than once.
alter table public.board_members   add column if not exists name_ar text, add column if not exists position_ar text, add column if not exists bio_ar text;
alter table public.committees      add column if not exists name_ar text, add column if not exists description_ar text, add column if not exists mandate_ar text,
                                   add column if not exists topics_ar text, add column if not exists issues_ar text, add column if not exists chair_ar text, add column if not exists vice_chair_ar text;
alter table public.announcements   add column if not exists title_ar text, add column if not exists body_ar text;
alter table public.schedule_items  add column if not exists day_ar text, add column if not exists title_ar text, add column if not exists description_ar text;
alter table public.documents       add column if not exists title_ar text, add column if not exists description_ar text;
alter table public.sponsors        add column if not exists name_ar text;
alter table public.faqs            add column if not exists question_ar text, add column if not exists answer_ar text, add column if not exists category_ar text;
alter table public.staff_positions add column if not exists title_ar text, add column if not exists description_ar text, add column if not exists requirements_ar text;
