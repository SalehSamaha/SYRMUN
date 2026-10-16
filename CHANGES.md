# SYRMUN website — changes

## v1.1.1 — 2026-10-16
- New logo (the laurel-and-temple SYR MUN badge) in the header, home hero, admin panel, browser tab icon and phone/app icons (`public/logo.png`, `favicon.png`, `icon-192.png`, `icon-512.png`). Old SVG logo removed.
- To change it again later, replace those four PNG files (keep the names).

## v1.1.0 — 2026-10-15

**Dates**
- "June 2027" removed everywhere. The site now says **2027 · dates to be confirmed** (Arabic: 2027 · ستُعلن المواعيد لاحقًا). Countdown stays off until you enter the first conference day in Admin > Settings.
- When the dates are confirmed, change "Dates (as shown on the site)" in Admin > Settings & fees (English and Arabic boxes).

**English / Arabic button**
- A language button in the top bar (and next to the menu icon on phones) switches the whole public site between English and Arabic, with right-to-left layout. The choice is remembered in the visitor's browser (default: English).
- All fixed text is translated (menus, forms, errors, confirmation screens, privacy page, 404…). Translations live in `src/lib/translations.js`.
- Text you edit in the admin panel (committees, board, FAQ, schedule, settings texts…) now has an extra "— Arabic (العربية)" box under each field. If the Arabic box is empty, visitors see the English text.
- Applications are still stored in whatever language the delegate typed. Committee choices are saved in English so your admin list stays consistent.
- The admin panel itself stays in English.

**Database update required (existing project)**
- Run `supabase/migration_v1.1_arabic.sql` once (adds the Arabic columns, replaces a saved "June 2027" date text and the starter FAQ answer). Safe to run twice. `schema.sql` includes the same changes for fresh projects.

**Please have a native Arabic speaker review** the Arabic texts, especially the Privacy page and anything legal-sounding. They are machine-quality drafts.

**Tests**: new `tests/i18n.test.js` (every key has both languages, placeholders match, no "June", every key used in code exists). SQL migration tested on a copy of the live v1 schema.

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
