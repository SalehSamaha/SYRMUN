// Registration fee + window logic.
// All dates are plain "YYYY-MM-DD" strings stored in the settings table and are
// interpreted in Damascus time (UTC+03:00). A date means "until the END of that day".
// The database enforces the same rules (see supabase/schema.sql, registration_state()).

export const TZ_OFFSET = '+03:00';

const toDate = (d, time) => {
  if (!d) return null;
  const dt = new Date(`${d}T${time}${TZ_OFFSET}`);
  return Number.isNaN(dt.getTime()) ? null : dt;
};

export const startOfDay = (d) => toDate(d, '00:00:00');
export const endOfDay = (d) => toDate(d, '23:59:59');

const toNumber = (value, fallback) => {
  if (value === '' || value == null) return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

export const PHASES = {
  early: { label: 'Early bird', feeKey: 'fee_early', fallback: 10 },
  regular: { label: 'Regular', feeKey: 'fee_regular', fallback: 12 },
  late: { label: 'Late', feeKey: 'fee_late', fallback: 15 },
};

const feeFor = (settings, phase) => {
  const p = PHASES[phase];
  return toNumber(settings[p.feeKey], p.fallback);
};

/**
 * @returns {{state: 'not_open'|'closed'|'open', phase: string|null, label: string|null, amount: number|null}}
 */
export function getRegistrationState(settings, now = new Date()) {
  const enabled = (settings.registration_enabled ?? 'true') === 'true';
  const opens = startOfDay(settings.registration_opens);
  const earlyEnd = endOfDay(settings.early_bird_ends);
  const regularEnd = endOfDay(settings.regular_ends);
  const closes = endOfDay(settings.registration_closes);

  if (!enabled || (opens && now < opens)) {
    return { state: 'not_open', phase: null, label: null, amount: null };
  }
  if (closes && now > closes) {
    return { state: 'closed', phase: null, label: null, amount: null };
  }

  let phase;
  if (earlyEnd && now <= earlyEnd) phase = 'early';
  else if (regularEnd && now <= regularEnd) phase = 'regular';
  else if (!earlyEnd && !regularEnd) phase = 'regular'; // no tiers configured: flat regular fee
  else phase = 'late';

  return { state: 'open', phase, label: PHASES[phase].label, amount: feeFor(settings, phase) };
}

/** Rows for displaying the fee schedule. */
export function getFeeTable(settings) {
  return [
    { phase: 'early', label: PHASES.early.label, amount: feeFor(settings, 'early'), until: settings.early_bird_ends || '' },
    { phase: 'regular', label: PHASES.regular.label, amount: feeFor(settings, 'regular'), until: settings.regular_ends || '' },
    { phase: 'late', label: PHASES.late.label, amount: feeFor(settings, 'late'), until: settings.registration_closes || '' },
  ];
}

/** "2027-03-01" -> "1 March 2027" / Arabic "1 مارس 2027" (no timezone shifting, Western digits). */
export function formatDate(d, lang = 'en') {
  if (!d) return '';
  const dt = new Date(`${d}T12:00:00Z`);
  if (Number.isNaN(dt.getTime())) return '';
  const locale = lang === 'ar' ? 'ar-u-nu-latn' : 'en-GB';
  return dt.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

export const formatMoney = (n) => (n == null ? '' : `$${Number.isInteger(n) ? n : n.toFixed(2)}`);
