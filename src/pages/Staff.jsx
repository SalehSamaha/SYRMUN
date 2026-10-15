import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AGE_GROUPS, ErrorBox, Field, friendlyError, Honeypot } from '../components/forms.jsx';
import Reveal from '../components/Reveal.jsx';
import { EmptyState, PageHero } from '../components/ui.jsx';
import { useRows, useSettings } from '../lib/content.jsx';
import { formatDate } from '../lib/fees.js';
import { supabase } from '../lib/supabase.js';
import { isEmail, uuid, usePageMeta } from '../lib/util.js';

const EMPTY = {
  position: '',
  full_name: '',
  email: '',
  institution: '',
  age_group: '',
  experience: '',
  motivation: '',
  availability: '',
  consent: false,
};

export default function Staff() {
  const { settings } = useSettings();
  const positions = useRows('staff_positions');
  const [form, setForm] = useState(EMPTY);
  const [trap, setTrap] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(null);

  usePageMeta('Join the team', 'Apply to join the SYRMUN 2027 secretariat and volunteer team.');

  const open = settings.staff_applications_open === 'true';
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (!form.position.trim()) return setError('Please choose or enter the position you are applying for.');
    if (form.full_name.trim().length < 2) return setError('Please enter your full name.');
    if (!isEmail(form.email)) return setError('Please enter a valid email address.');
    if (!form.consent) return setError('Please tick the box to confirm you agree to us storing your details.');

    const id = uuid();
    const finish = () => setDone({ reference: id.slice(0, 8).toUpperCase(), email: form.email.trim() });
    if (trap || !supabase) return finish();

    setBusy(true);
    const clean = (v) => (v && String(v).trim() ? String(v).trim() : null);
    const { error: err } = await supabase.from('staff_applications').insert({
      id,
      position: form.position.trim(),
      full_name: form.full_name.trim(),
      email: form.email.trim(),
      institution: clean(form.institution),
      age_group: clean(form.age_group),
      experience: clean(form.experience),
      motivation: clean(form.motivation),
      availability: clean(form.availability),
      consent: true,
    });
    setBusy(false);
    if (err) return setError(friendlyError(err, 'staff'));
    finish();
  }

  return (
    <>
      <PageHero eyebrow="Secretariat & staff" title="Help us run SYRMUN" intro={settings.staff_intro} />

      <section className="py-16">
        <div className="container-x">
          <h2 className="text-3xl font-bold text-navy-950">Open positions</h2>
          <div className="mt-3 h-1 w-14 rounded bg-gold-500" />
          <div className="mt-8">
            {positions.data.length === 0 ? (
              <EmptyState title="Positions will be announced soon" text="We will list the available roles, responsibilities and deadlines here." />
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {positions.data.map((p) => (
                  <Reveal key={p.id}>
                    <article className="card h-full">
                      <h3 className="text-xl font-bold text-navy-950">{p.title}</h3>
                      {p.deadline && (
                        <p className="mt-1 text-sm font-semibold text-gold-700">Apply by {formatDate(p.deadline)}</p>
                      )}
                      {p.description && (
                        <>
                          <h4 className="mt-4 text-xs font-semibold uppercase tracking-wide text-navy-500">Responsibilities</h4>
                          <p className="mt-1 whitespace-pre-line text-navy-800">{p.description}</p>
                        </>
                      )}
                      {p.requirements && (
                        <>
                          <h4 className="mt-4 text-xs font-semibold uppercase tracking-wide text-navy-500">Requirements</h4>
                          <p className="mt-1 whitespace-pre-line text-navy-800">{p.requirements}</p>
                        </>
                      )}
                    </article>
                  </Reveal>
                ))}
              </div>
            )}
          </div>

          <div className="mt-16" id="apply">
            <h2 className="text-3xl font-bold text-navy-950">Apply</h2>
            <div className="mt-3 h-1 w-14 rounded bg-gold-500" />
            <div className="mt-8">
              {done ? (
                <div className="card mx-auto max-w-2xl border-t-4 border-t-gold-500">
                  <h3 className="text-2xl font-bold text-navy-950">Application received</h3>
                  <p className="mt-3 text-navy-800">
                    Thank you. We will review your application and contact you at <strong className="break-all">{done.email}</strong>.
                    Receiving your application does not mean you have been accepted.
                  </p>
                  <p className="mt-4 text-sm text-navy-600">
                    Reference: <span className="font-mono font-bold text-navy-950">{done.reference}</span>
                  </p>
                  <Link to="/" className="btn-navy mt-6">
                    Back to home
                  </Link>
                </div>
              ) : !open ? (
                <EmptyState title="Staff applications are closed" text="Thank you for your interest. Please contact us if you would still like to help." />
              ) : (
                <form onSubmit={submit} noValidate className="card mx-auto max-w-2xl space-y-5 !p-6 sm:!p-8">
                  <Honeypot value={trap} onChange={setTrap} />

                  <Field label="Position" htmlFor="position" required>
                    {positions.data.length > 0 ? (
                      <select id="position" className="field" value={form.position} onChange={set('position')} required>
                        <option value="">Select a position…</option>
                        {positions.data.map((p) => (
                          <option key={p.id} value={p.title}>
                            {p.title}
                          </option>
                        ))}
                        <option value="General volunteer">General volunteer</option>
                      </select>
                    ) : (
                      <input id="position" className="field" maxLength={160} value={form.position} onChange={set('position')} placeholder="e.g. General volunteer" required />
                    )}
                  </Field>

                  <Field label="Full name" htmlFor="s_name" required>
                    <input id="s_name" className="field" autoComplete="name" maxLength={120} value={form.full_name} onChange={set('full_name')} required />
                  </Field>
                  <Field label="Email address" htmlFor="s_email" required>
                    <input id="s_email" type="email" className="field" autoComplete="email" maxLength={254} value={form.email} onChange={set('email')} required />
                  </Field>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="School or institution" htmlFor="s_inst">
                      <input id="s_inst" className="field" maxLength={160} value={form.institution} onChange={set('institution')} />
                    </Field>
                    <Field label="Age group" htmlFor="s_age">
                      <select id="s_age" className="field" value={form.age_group} onChange={set('age_group')}>
                        <option value="">Select…</option>
                        {AGE_GROUPS.map(([v, l]) => (
                          <option key={v} value={v}>
                            {l}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  <Field label="Relevant experience" htmlFor="s_exp" hint="MUN, organising events, volunteering, design, writing… (max 1500 characters)">
                    <textarea id="s_exp" rows={4} maxLength={1500} className="field" value={form.experience} onChange={set('experience')} />
                  </Field>
                  <Field label="Why would you like to join the team?" htmlFor="s_why">
                    <textarea id="s_why" rows={4} maxLength={1500} className="field" value={form.motivation} onChange={set('motivation')} />
                  </Field>
                  <Field label="Availability" htmlFor="s_avail" hint="When can you work with the team before and during the conference?">
                    <textarea id="s_avail" rows={2} maxLength={500} className="field" value={form.availability} onChange={set('availability')} />
                  </Field>

                  <label className="flex items-start gap-3 text-sm leading-relaxed text-navy-800">
                    <input type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-gold-600" checked={form.consent} onChange={set('consent')} />
                    <span>
                      I agree that SYRMUN may store the information I submit in order to process my application, as described on
                      the{' '}
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
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
