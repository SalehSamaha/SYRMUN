import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AGE_GROUPS, ErrorBox, Field, friendlyError, Honeypot, MUN_EXPERIENCE } from '../components/forms.jsx';
import { PageHero, Spinner } from '../components/ui.jsx';
import { useRows, useSettings } from '../lib/content.jsx';
import { formatDate, formatMoney, getRegistrationState } from '../lib/fees.js';
import { supabase } from '../lib/supabase.js';
import { isEmail, uuid, usePageMeta } from '../lib/util.js';

const EMPTY = {
  full_name: '',
  email: '',
  institution: '',
  age_group: '',
  committee_pref_1: '',
  committee_pref_2: '',
  mun_experience: '',
  notes: '',
  consent: false,
};

function Closed({ title, text }) {
  return (
    <div className="card mx-auto max-w-2xl text-center">
      <h2 className="text-2xl font-bold text-navy-950">{title}</h2>
      <p className="mt-3 text-navy-700">{text}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link to="/delegates" className="btn-navy">
          Delegate information
        </Link>
        <Link to="/contact" className="btn-outline-dark">
          Contact us
        </Link>
      </div>
    </div>
  );
}

function Success({ reference, email, reg, settings }) {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="card border-t-4 border-t-gold-500">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-gold-500 text-2xl font-bold text-navy-950" aria-hidden="true">
          ✓
        </div>
        <h2 className="mt-4 text-3xl font-bold text-navy-950">Application received</h2>
        <p className="mt-3 text-lg leading-relaxed text-navy-800">
          Thank you — we have received your application for SYRMUN 2027.
        </p>

        <div className="mt-6 rounded-xl border border-gold-500/40 bg-gold-100/50 p-5">
          <p className="font-semibold text-navy-950">Received is not the same as accepted.</p>
          <p className="mt-1 text-sm leading-relaxed text-navy-800">
            Your place is not confirmed yet. The organising team will review your application and contact you at{' '}
            <strong className="break-all">{email}</strong> once a decision has been made.
          </p>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-navy-50 p-4">
            <dt className="text-xs font-semibold uppercase tracking-wide text-navy-500">Your reference</dt>
            <dd className="mt-1 font-mono text-xl font-bold text-navy-950">{reference}</dd>
            <dd className="mt-1 text-xs text-navy-600">Keep this if you contact us about your application.</dd>
          </div>
          {reg.amount != null && (
            <div className="rounded-xl bg-navy-50 p-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-navy-500">Fee ({reg.label})</dt>
              <dd className="mt-1 text-xl font-bold text-navy-950">{formatMoney(reg.amount)}</dd>
              <dd className="mt-1 text-xs text-navy-600">Payable only after your application is accepted.</dd>
            </div>
          )}
        </dl>

        <div className="mt-6">
          <h3 className="text-lg font-bold text-navy-950">Payment</h3>
          <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-navy-800">{settings.payment_instructions}</p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/delegates" className="btn-navy">
            Delegate information
          </Link>
          <Link to="/" className="btn-outline-dark">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Register() {
  const { settings, loaded } = useSettings();
  const committees = useRows('committees');
  const [form, setForm] = useState(EMPTY);
  const [trap, setTrap] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(null);

  usePageMeta('Register', 'Register as a delegate for SYRMUN 2027.');

  const reg = getRegistrationState(settings);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setError('');

    if (form.full_name.trim().length < 2) return setError('Please enter your full name.');
    if (!isEmail(form.email)) return setError('Please enter a valid email address.');
    if (!form.consent) return setError('Please tick the box to confirm you agree to us storing your details.');

    const id = uuid();
    const finish = () => setDone({ reference: id.slice(0, 8).toUpperCase(), email: form.email.trim(), reg });

    // Bots fill the hidden field: pretend it worked, send nothing.
    if (trap) return finish();

    // Preview mode (no database): show the success screen without saving anything.
    if (!supabase) return finish();

    setBusy(true);
    const clean = (v) => (v && String(v).trim() ? String(v).trim() : null);
    const { error: err } = await supabase.from('delegate_applications').insert({
      id,
      full_name: form.full_name.trim(),
      email: form.email.trim(),
      institution: clean(form.institution),
      age_group: clean(form.age_group),
      committee_pref_1: clean(form.committee_pref_1),
      committee_pref_2: clean(form.committee_pref_2),
      mun_experience: clean(form.mun_experience),
      notes: clean(form.notes),
      consent: true,
    });
    setBusy(false);

    if (err) return setError(friendlyError(err));
    finish();
  }

  let body;
  if (!loaded) body = <Spinner />;
  else if (done) body = <Success {...done} settings={settings} />;
  else if (reg.state === 'not_open')
    body = (
      <Closed
        title="Registration is not open yet"
        text={
          settings.registration_opens && settings.registration_enabled === 'true'
            ? `Registration opens on ${formatDate(settings.registration_opens)}. Follow our social media to hear first.`
            : 'Registration will open soon. Follow our social media to hear first.'
        }
      />
    );
  else if (reg.state === 'closed')
    body = <Closed title="Registration is closed" text="Thank you for your interest in SYRMUN 2027. If you have a question, please get in touch." />;
  else
    body = (
      <form onSubmit={submit} noValidate className="card mx-auto max-w-2xl space-y-5 !p-6 sm:!p-8">
        <div className="rounded-xl bg-navy-50 p-4 text-sm text-navy-800">
          <p>
            <strong>Current fee: {formatMoney(reg.amount)}</strong> ({reg.label}). Nothing is paid now — you will be told how
            to pay once your application has been accepted.
          </p>
        </div>

        <Honeypot value={trap} onChange={setTrap} />

        <Field label="Full name" htmlFor="full_name" required>
          <input id="full_name" className="field" autoComplete="name" maxLength={120} value={form.full_name} onChange={set('full_name')} required />
        </Field>

        <Field label="Email address" htmlFor="email" required hint="We will use this to contact you about your application.">
          <input id="email" type="email" className="field" autoComplete="email" maxLength={254} value={form.email} onChange={set('email')} required />
        </Field>

        <Field label="School or institution" htmlFor="institution" hint="Leave blank if not applicable.">
          <input id="institution" className="field" maxLength={160} value={form.institution} onChange={set('institution')} />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Age group" htmlFor="age_group">
            <select id="age_group" className="field" value={form.age_group} onChange={set('age_group')}>
              <option value="">Select…</option>
              {AGE_GROUPS.map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Previous MUN experience" htmlFor="mun_experience">
            <select id="mun_experience" className="field" value={form.mun_experience} onChange={set('mun_experience')}>
              <option value="">Select…</option>
              {MUN_EXPERIENCE.map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </Field>
        </div>

        {committees.data.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="First committee preference" htmlFor="committee_pref_1">
              <select id="committee_pref_1" className="field" value={form.committee_pref_1} onChange={set('committee_pref_1')}>
                <option value="">No preference</option>
                {committees.data.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Second committee preference" htmlFor="committee_pref_2">
              <select id="committee_pref_2" className="field" value={form.committee_pref_2} onChange={set('committee_pref_2')}>
                <option value="">No preference</option>
                {committees.data.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        )}

        <Field label="Anything else we should know?" htmlFor="notes" hint="Optional. Please do not include sensitive personal information.">
          <textarea id="notes" rows={4} maxLength={1000} className="field" value={form.notes} onChange={set('notes')} />
        </Field>

        <label className="flex items-start gap-3 text-sm leading-relaxed text-navy-800">
          <input type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-gold-600" checked={form.consent} onChange={set('consent')} />
          <span>
            I agree that SYRMUN may store the information I submit in order to process my application, as described on the{' '}
            <Link to="/privacy" className="font-semibold underline decoration-gold-500 underline-offset-2">
              Privacy page
            </Link>
            .
          </span>
        </label>

        <ErrorBox>{error}</ErrorBox>

        <button type="submit" className="btn-gold w-full" disabled={busy}>
          {busy ? 'Sending…' : 'Submit application'}
        </button>
      </form>
    );

  return (
    <>
      <PageHero
        eyebrow="Delegate registration"
        title="Register for SYRMUN 2027"
        intro="It takes about two minutes. We only ask for what we need to run the conference."
      />
      <section className="py-14">
        <div className="container-x">{body}</div>
      </section>
    </>
  );
}
