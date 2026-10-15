-- =====================================================================
-- Make someone an admin of the SYRMUN panel.
--
-- 1. In Supabase > Authentication > Users > "Add user" > "Create new user"
--    (enter their email + a strong password, tick "Auto Confirm User").
-- 2. Replace the email below with theirs, then run this in the SQL Editor.
--
-- Repeat for each team member who needs access.
-- =====================================================================

insert into public.admins (user_id)
select id from auth.users where lower(email) = lower('PUT-ADMIN-EMAIL-HERE@example.com')
on conflict do nothing;

-- Check who the admins are:
-- select u.email from public.admins a join auth.users u on u.id = a.user_id;
