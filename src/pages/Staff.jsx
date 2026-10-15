import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AGE_GROUPS, ErrorBox, Field, friendlyError, Honeypot } from '../components/forms.jsx';
import Reveal from '../components/Reveal.jsx';
import { EmptyState, PageHero } from '../components/ui.jsx';
import { useRows, useSettings } from '../lib/content.jsx';
import { formatDate } from '../lib/fees.js';
import { useI18n } from '../lib/i18n.jsx';
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

const GENERAL = 'General volunteer';

export default function Staff() {
  const { settings } = useSettings();
  const { t, tr, st, lang } = useI18n();
  const positions = useRows('staff_positions');
  const [form, setForm] = useState(EMPTY);
  const [trap, setTrap] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(null);

  usePageMeta(t('common.joinTeam'), t('st.meta'));

  const open = settings.staff_applications_open === 'true';
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (!form.position.trim()) return setError(t('err.position'));
    if (form.full_name.trim().length < 2) return setError(t('err.name'));
    if (!isEmail(form.email)) return setError(t('err.email'));
    if (!form.consent) return setError(t('err.consent'));

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
    if (err) return setError(friendlyError(err, 'staff', t));
    finish();
  }

  return (
    <>
      <PageHero eyebrow={t('st.eyebrow')} title={t('st.title')} intro={st('staff_intro')} />

      <section className="py-16">
        <div className="container-x">
          <h2 className="text-3xl font-bold text-navy-950">{t('st.open')}</h2>
          <div className="mt-3 h-1 w-14 rounded bg-gold-500" />
          <div className="mt-8">
            {positions.data.length === 0 ? (
              <EmptyState title={t('st.empty.t')} text={t('st.empty.d')} />
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {positions.data.map((p) => (
                  <Reveal key={p.id}>
                    <article className="card h-full">
                      <h3 className="text-xl font-bold text-navy-950">{tr(p, 'title')}</h3>
                      {p.deadline && (
                        <p className="mt-1 text-sm font-semibold text-gold-700">{t('st.applyBy', { date: formatDate(p.deadline, lang) })}</p>
                      )}
                      {tr(p, 'description') && (
                        <>
                          <h4 className="mt-4 text-xs font-semibold uppercase tracking-wide text-navy-500">{t('st.resp')}</h4>
                          <p className="mt-1 whitespace-pre-line text-navy-800">{tr(p, 'description')}</p>
                        </>
                      )}
                      {tr(p, 'requirements') && (
                        <>
                          <h4 className="mt-4 text-xs font-semibold uppercase tracking-wide text-navy-500">{t('st.req')}</h4>
                          <p className="mt-1 whitespace-pre-line text-navy-800">{tr(p, 'requirements')}</p>
                        </>
                      )}
                    </article>
                  </Reveal>
                ))}
              </div>
            )}
          </div>

          <div className="mt-16" id="apply">
            <h2 className="text-3xl font-bold text-navy-950">{t('st.apply')}</h2>
            <div className="mt-3 h-1 w-14 rounded bg-gold-500" />
            <div className="mt-8">
              {done ? (
                <div className="card mx-auto max-w-2xl border-t-4 border-t-gold-500">
                  <h3 className="text-2xl font-bold text-navy-950">{t('reg.ok.t')}</h3>
                  <p className="mt-3 text-navy-800">
                    {t('st.ok.body1')} <strong className="ltr-text break-all">{done.email}</strong>. {t('st.ok.body2')}
                  </p>
                  <p className="mt-4 text-sm text-navy-600">
                    {t('st.ok.ref')} <span className="ltr-text font-mono font-bold text-navy-950">{done.reference}</span>
                  </p>
                  <Link to="/" className="btn-navy mt-6">
                    {t('common.backHome')}
                  </Link>
                </div>
              ) : !open ? (
                <EmptyState title={t('st.closed.t')} text={t('st.closed.d')} />
              ) : (
                <form onSubmit={submit} noValidate className="card mx-auto max-w-2xl space-y-5 !p-6 sm:!p-8">
                  <Honeypot value={trap} onChange={setTrap} />

                  <Field label={t('st.position')} htmlFor="position" required>
                    {positions.data.length > 0 ? (
                      <select id="position" className="field" value={form.position} onChange={set('position')} required>
                        <option value="">{t('st.selectPos')}</option>
                        {positions.data.map((p) => (
                          <option key={p.id} value={p.title}>
                            {tr(p, 'title')}
                          </option>
                        ))}
                        <option value={GENERAL}>{t('st.general')}</option>
                      </select>
                    ) : (
                      <input id="position" className="field" maxLength={160} value={form.position} onChange={set('position')} placeholder={t('st.placeholder')} required />
                    )}
                  </Field>

                  <Field label={t('f.fullName')} htmlFor="s_name" required>
                    <input id="s_name" className="field" autoComplete="name" maxLength={120} value={form.full_name} onChange={set('full_name')} required />
                  </Field>
                  <Field label={t('f.email')} htmlFor="s_email" required>
                    <input id="s_email" type="email" dir="ltr" className="field text-start" autoComplete="email" maxLength={254} value={form.email} onChange={set('email')} required />
                  </Field>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label={t('f.institution')} htmlFor="s_inst">
                      <input id="s_inst" className="field" maxLength={160} value={form.institution} onChange={set('institution')} />
                    </Field>
                    <Field label={t('f.age')} htmlFor="s_age">
                      <select id="s_age" className="field" value={form.age_group} onChange={set('age_group')}>
                        <option value="">{t('f.select')}</option>
                        {AGE_GROUPS.map(([v, k]) => (
                          <option key={v} value={v}>
                            {t(k)}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  <Field label={t('st.exp')} htmlFor="s_exp" hint={t('st.expHint')}>
                    <textarea id="s_exp" rows={4} maxLength={1500} className="field" value={form.experience} onChange={set('experience')} />
                  </Field>
                  <Field label={t('st.why')} htmlFor="s_why">
                    <textarea id="s_why" rows={4} maxLength={1500} className="field" value={form.motivation} onChange={set('motivation')} />
                  </Field>
                  <Field label={t('st.avail')} htmlFor="s_avail" hint={t('st.availHint')}>
                    <textarea id="s_avail" rows={2} maxLength={500} className="field" value={form.availability} onChange={set('availability')} />
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
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
