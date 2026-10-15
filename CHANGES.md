# SYRMUN website — changes

## v1.0.0 — 2026-10-14 (first delivery)

**Public site** (React + Vite + Tailwind, navy / white / gold, mobile-first)
- Home: hero, countdown (turns on when you set the first conference day), announcements, what/why, committees, experience, Executive Board, FAQ, call to action
- About, Executive Board, Committees (one section per committee), Delegate information (fees, schedule, handbook downloads), Register, Join the Team (staff applications), Sponsors & Partners, FAQ, Contact, Privacy, 404
- Registration shows the correct fee automatically (early / regular / late) and says "not open yet" / "closed" by date
- Confirmation screen clearly says **received is not accepted**, with a reference number

**Admin panel** at `/admin` (login required, organisers only)
- Delegate and staff applications: filter, search, change status, payment status, internal notes, CSV download, delete
- Edit Executive Board, committees, announcements, schedule, handbook/background-guide uploads, sponsors, FAQ, staff positions
- Settings & fees: prices, opening / early / regular / closing dates, conference dates, email, social links, page texts

**Database / security** (`supabase/schema.sql`)
- Row-level security on every table; the public can only submit applications and read published content
- Applications are private: only admins can read them
- Status, payment and fee on a new application are forced by the database (a delegate cannot submit themselves as "accepted" or change the price)
- Registration window and fee are enforced by the database as well as the page
- Duplicate emails blocked; field lengths and values validated
- File uploads (images, PDFs up to 15 MB) restricted to admins

**Checks run before delivery**
- `npm run build` passes
- `npm test`: 8 fee/date tests pass
- 13 SQL security checks pass on a local Postgres (permissions, forced values, window enforcement, SQL fee logic matches the page's)
- Browser run at desktop and phone sizes: no console errors, no sideways scrolling, registration flow clicked through (preview mode)
- NOT tested against a real Supabase project (none available here): login, uploads and real submissions need a first test by you after setup

**Not included yet (deliberately)**
- Online payments (we discuss this first, as the brief says)
- Automatic emails to applicants (changing a status does not email anyone)
- Arabic / RTL version
