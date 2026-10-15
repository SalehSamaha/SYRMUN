import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AGE_GROUPS, ErrorBox, Field, friendlyError, Honeypot, MUN_EXPERIENCE } from '../components/forms.jsx';
import { PageHero, Spinner } from '../components/ui.jsx';
import { useRows, useSettings } from '../lib/content.jsx';
import { formatDate, formatMoney, getRegistrationState } from '../lib/fees.js';
import { useI18n } from '../lib/i18n.jsx';
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
  const { t } = useI18n();
  return (
    <div className="card mx-auto max-w-2xl text-center">
      <h2 className="text-2xl font-bold text-navy-950">{title}</h2>
      <p className="mt-3 text-navy-700">{text}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link to="/delegates" className="btn-navy">
          {t('common.delegateInfo')}
        </Link>
        <Link to="/contact" className="btn-outline-dark">
          {t('common.contactUs')}
        </Link>
      </div>
    </div>
  );
}

function Success({ reference, email, reg, settings }) {
  const { t, st } = useI18n();
  return (
    <div className="mx-auto max-w-2xl">
      <div className="card border-t-4 border-t-gold-500">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-gold-500 text-2xl font-bold text-navy-950" aria-hidden="true">
          ✓
        </div>
        <h2 className="mt-4 text-3xl font-bold text-navy-950">{t('reg.ok.t')}</h2>
        <p className="mt-3 text-lg leading-relaxed text-navy-800">{t('reg.ok.thanks')}</p>

        <div className="mt-6 rounded-xl border border-gold-500/40 bg-gold-100/50 p-5">
          <p className="font-semibold text-navy-950">{t('reg.ok.notAccepted')}</p>
          <p className="mt-1 text-sm leading-relaxed text-navy-800">
            {t('reg.ok.body1')} <strong className="ltr-text break-all">{email}</strong> {t('reg.ok.body2')}
          </p>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-navy-50 p-4">
            <dt className="text-xs font-semibold uppercase tracking-wide text-navy-500">{t('reg.ok.ref')}</dt>
            <dd className="ltr-text mt-1 font-mono text-xl font-bold text-navy-950">{reference}</dd>
            <dd className="mt-1 text-xs text-navy-600">{t('reg.ok.refHint')}</dd>
          </div>
          {reg.amount != null && (
            <div className="rounded-xl bg-navy-50 p-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-navy-500">
                {t('reg.ok.fee', { label: t(`phase.${reg.phase}`) })}
              </dt>
              <dd className="mt-1 text-xl font-bold text-navy-950">{formatMoney(reg.amount)}</dd>
              <dd className="mt-1 text-xs text-navy-600">{t('reg.ok.feeHint')}</dd>
            </div>
          )}
        </dl>

        <div className="mt-6">
          <h3 className="text-lg font-bold text-navy-950">{t('reg.ok.payment')}</h3>
          <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-navy-800">{st('payment_instructions')}</p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/delegates" className="btn-navy">
            {t('common.delegateInfo')}
          </Link>
          <Link to="/" className="btn-outline-dark">
            {t('common.backHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Register() {
  const { settings, loaded } = useSettings();
  const { t, tr, lang } = useI18n();
  const committees = useRows('committees');
  const [form, setForm] = useState(EMPTY);
  const [trap, setTrap] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(null);

  usePageMeta(t('nav.register'), t('reg.meta'));

  const reg = getRegistrationState(settings);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setError('');

    if (form.full_name.trim().length < 2) return setError(t('err.name'));
    if (!isEmail(form.email)) return setError(t('err.email'));
    if (!form.consent) return setError(t('err.consent'));

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

    if (err) return setError(friendlyError(err, 'delegate', t));
    finish();
  }

  let body;
  if (!loaded) body = <Spinner />;
  else if (done) body = <Success {...done} settings={settings} />;
  else if (reg.state === 'not_open')
    body = (
      <Closed
        title={t('reg.notopen.t')}
        text={
          settings.registration_opens && settings.registration_enabled === 'true'
            ? t('reg.notopen.date', { date: formatDate(settings.registration_opens, lang) })
            : t('reg.notopen.nodate')
        }
      />
    );
  else if (reg.state === 'closed') body = <Closed title={t('reg.closed.t')} text={t('reg.closed.d')} />;
  else
    body = (
      <form onSubmit={submit} noValidate className="card mx-auto max-w-2xl space-y-5 !p-6 sm:!p-8">
        <div className="rounded-xl bg-navy-50 p-4 text-sm text-navy-800">
          <p>
            <strong>{t('reg.feeBox', { amount: '\u200E' + formatMoney(reg.amount) + '\u200E', label: t(`phase.${reg.phase}`) })}</strong>
          </p>
        </div>

        <Honeypot value={trap} onChange={setTrap} />

        <Field label={t('f.fullName')} htmlFor="full_name" required>
          <input id="full_name" className="field" autoComplete="name" maxLength={120} value={form.full_name} onChange={set('full_name')} required />
        </Field>

        <Field label={t('f.email')} htmlFor="email" required hint={t('f.emailHint')}>
          <input id="email" type="email" dir="ltr" className="field text-start" autoComplete="email" maxLength={254} value={form.email} onChange={set('email')} required />
        </Field>

        <Field label={t('f.institution')} htmlFor="institution" hint={t('f.institutionHint')}>
          <input id="institution" className="field" maxLength={160} value={form.institution} onChange={set('institution')} />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={t('f.age')} htmlFor="age_group">
            <select id="age_group" className="field" value={form.age_group} onChange={set('age_group')}>
              <option value="">{t('f.select')}</option>
              {AGE_GROUPS.map(([v, k]) => (
                <option key={v} value={v}>
                  {t(k)}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t('f.experience')} htmlFor="mun_experience">
            <select id="mun_experience" className="field" value={form.mun_experience} onChange={set('mun_experience')}>
              <option value="">{t('f.select')}</option>
              {MUN_EXPERIENCE.map(([v, k]) => (
                <option key={v} value={v}>
                  {t(k)}
                </option>
              ))}
            </select>
          </Field>
        </div>

        {committees.data.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2">
            {[
              ['committee_pref_1', 'f.pref1'],
              ['committee_pref_2', 'f.pref2'],
            ].map(([key, label]) => (
              <Field key={key} label={t(label)} htmlFor={key}>
                <select id={key} className="field" value={form[key]} onChange={set(key)}>
                  <option value="">{t('f.noPref')}</option>
                  {committees.data.map((c) => (
                    <option key={c.id} value={c.name}>
                      {tr(c, 'name')}
                    </option>
                  ))}
                </select>
              </Field>
            ))}
          </div>
        )}

        <Field label={t('f.notes')} htmlFor="notes" hint={t('f.notesHint')}>
          <textarea id="notes" rows={4} maxLength={1000} className="field" value={form.notes} onChange={set('notes')} />
        </Field>

        <label className="flex items-start gap-3 text-sm leading-relaxed text-navy-800">
          <input type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-gold-600" checked={form.consent} onChange={set('consent')} />
          <span>
            {t('f.consent1')}{' '}
            <Link to="/privacy" className="font-semibold underline decoration-gold-500 underline-offset-2">
              {t('f.privacyPage')}
            </Link>
            .
          </span>
        </label>

        <ErrorBox>{error}</ErrorBox>

        <button type="submit" className="btn-gold w-full" disabled={busy}>
          {busy ? t('f.sending') : t('f.submit')}
        </button>
      </form>
    );

  return (
    <>
      <PageHero eyebrow={t('reg.eyebrow')} title={t('reg.title')} intro={t('reg.intro')} />
      <section className="py-14">
        <div className="container-x">{body}</div>
      </section>
    </>
  );
}
