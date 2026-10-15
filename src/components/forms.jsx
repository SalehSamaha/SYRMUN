export function Field({ label, htmlFor, required, hint, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="label">
        {label}
        {required && (
          <span className="text-gold-700" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-navy-500">{hint}</p>}
    </div>
  );
}

/** Hidden field that real people never fill in; bots usually do. */
export function Honeypot({ value, onChange }) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
      <label>
        Leave this field empty
        <input type="text" name="website" tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
      </label>
    </div>
  );
}

export function ErrorBox({ children }) {
  if (!children) return null;
  return (
    <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
      {children}
    </div>
  );
}

// [value stored in the database, translation key]
export const AGE_GROUPS = [
  ['under_16', 'age.under_16'],
  ['16_17', 'age.16_17'],
  ['18_24', 'age.18_24'],
  ['25_plus', 'age.25_plus'],
];

export const MUN_EXPERIENCE = [
  ['none', 'exp.none'],
  ['1_2', 'exp.1_2'],
  ['3_plus', 'exp.3_plus'],
];

/** Turns a Supabase/Postgres error into something a delegate can understand (in their language). */
export function friendlyError(error, kind, t) {
  const msg = `${error?.message || ''}`;
  if (error?.code === '23505') return t(kind === 'staff' ? 'err.dupStaff' : 'err.dupDelegate');
  if (msg.includes('registration_not_open')) return t('err.notOpen');
  if (msg.includes('registration_closed')) return t('err.closed');
  if (msg.includes('staff_applications_closed')) return t('err.staffClosed');
  if (error?.code === '23514') return t('err.invalid');
  return t('err.generic');
}
