-- SYRMUN v1.1 migration: Arabic columns + remove "June" from the dates text.
-- Run once in Supabase > SQL Editor > New query. Safe to run again.

alter table public.board_members   add column if not exists name_ar text, add column if not exists position_ar text, add column if not exists bio_ar text;
alter table public.committees      add column if not exists name_ar text, add column if not exists description_ar text, add column if not exists mandate_ar text,
                                   add column if not exists topics_ar text, add column if not exists issues_ar text, add column if not exists chair_ar text, add column if not exists vice_chair_ar text;
alter table public.announcements   add column if not exists title_ar text, add column if not exists body_ar text;
alter table public.schedule_items  add column if not exists day_ar text, add column if not exists title_ar text, add column if not exists description_ar text;
alter table public.documents       add column if not exists title_ar text, add column if not exists description_ar text;
alter table public.sponsors        add column if not exists name_ar text;
alter table public.faqs            add column if not exists question_ar text, add column if not exists answer_ar text, add column if not exists category_ar text;
alter table public.staff_positions add column if not exists title_ar text, add column if not exists description_ar text, add column if not exists requirements_ar text;

-- Dates: if a "June 2027" text was saved from the admin panel, replace it.
update public.settings
   set value = '2027 · dates to be confirmed', updated_at = now()
 where key = 'conference_dates_text' and value ilike '%june%';

-- Starter FAQ answer that mentioned June.
update public.faqs
   set answer = 'SYRMUN is the Syria Model United Nations: a two-day Model UN conference taking place in Damascus, Syria in 2027 (dates to be confirmed).'
 where question = 'What is SYRMUN?' and answer ilike '%June 2027%';
