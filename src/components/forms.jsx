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

export const AGE_GROUPS = [
  ['under_16', 'Under 16'],
  ['16_17', '16–17'],
  ['18_24', '18–24'],
  ['25_plus', '25 or older'],
];

export const MUN_EXPERIENCE = [
  ['none', 'This is my first MUN'],
  ['1_2', '1–2 conferences'],
  ['3_plus', '3 or more conferences'],
];

/** Turns a Supabase/Postgres error into something a delegate can understand. */
export function friendlyError(error, kind = 'application') {
  const msg = `${error?.message || ''}`;
  if (error?.code === '23505') {
    return kind === 'staff'
      ? 'An application for this position has already been submitted with this email address.'
      : 'An application has already been submitted with this email address. If you need to change something, please contact us.';
  }
  if (msg.includes('registration_not_open')) return 'Registration is not open yet.';
  if (msg.includes('registration_closed')) return 'Registration is now closed.';
  if (msg.includes('staff_applications_closed')) return 'Staff applications are currently closed.';
  if (error?.code === '23514') return 'Some of the information you entered is not valid. Please check the form and try again.';
  return 'Something went wrong and your application was not sent. Please try again in a moment, or contact us if it keeps happening.';
}
