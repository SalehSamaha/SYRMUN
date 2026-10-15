# SYRMUN 2027 website

React + Vite + Tailwind front end, Supabase (database, login, file storage), hosted on Vercel.

## Run it on your laptop

```bash
cd ~/Desktop/syrmun-website
npm install
npm run dev          # http://localhost:5173
```
Without a `.env` file the site runs in **preview mode** (sample content, nothing saved). To connect the database, copy `.env.example` to `.env` and fill in the two values.

## One-time setup

### 1. Supabase (database)
1. supabase.com → New project.
2. **SQL Editor → New query**, paste all of `supabase/schema.sql`, Run.
3. **Authentication → Users → Add user → Create new user**: an organiser's email + strong password, tick *Auto Confirm User*.
4. Put that email into `supabase/make_admin.sql` and run it in the SQL Editor. Repeat per organiser.
5. **Authentication → Sign In / Providers → Email**: turn OFF "Allow new users to sign up".
6. **Project Settings → API**: copy the *Project URL* and the *anon public* key. Never use the `service_role` key here.

### 2. GitHub + Vercel (hosting)
```bash
cd ~/Desktop/syrmun-website
git init && git add -A && git commit -m "SYRMUN website v1"
git branch -M main
git remote add origin https://github.com/YOUR-USER/syrmun-website.git
git push -u origin main
```
Then vercel.com → Add New → Project → import the repo (Vite is auto-detected). Add environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, then Deploy. Every later `git push` redeploys.

### 3. Fill in content
Open `https://YOUR-SITE/admin`, sign in, then in **Settings & fees** set the official email, check the Instagram link, dates, fees and payment instructions. Add the Executive Board, committees, etc.

## Updating later
Text, people, committees, prices, dates, files: change in `/admin`, no code.
Design/code: edit, then `git add -A && git commit -m "..." && git push`.

## Backups
Supabase free plan has no downloadable automatic backups. Until you upgrade, download the applications CSV (Admin → Delegates → Download CSV) weekly and before big changes.

## Notes
- Dates are Damascus time and include the whole last day.
- Settings and published content are public. Never put secrets there.
- The Privacy page is a plain-language starting point, not legal advice; have it reviewed.
