import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal.jsx';
import { EmptyState, PageHero } from '../components/ui.jsx';
import { useRows, useSettings } from '../lib/content.jsx';
import { formatDate, formatMoney, getFeeTable, getRegistrationState } from '../lib/fees.js';
import { useI18n } from '../lib/i18n.jsx';
import { lines, safeUrl, usePageMeta } from '../lib/util.js';

function Block({ title, children }) {
  return (
    <Reveal>
      <section className="card h-full">
        <h2 className="text-2xl font-bold text-navy-950">{title}</h2>
        <div className="mt-2 h-1 w-10 rounded bg-gold-500" />
        <div className="mt-4 leading-relaxed text-navy-800">{children}</div>
      </section>
    </Reveal>
  );
}

export default function Delegates() {
  const { settings } = useSettings();
  const { t, tr, st, lang } = useI18n();
  const schedule = useRows('schedule_items');
  const docs = useRows('documents');
  const reg = getRegistrationState(settings);
  const fees = getFeeTable(settings);

  usePageMeta(t('common.delegateInfo'), t('dp.meta'));

  const days = [...new Set(schedule.data.map((s) => tr(s, 'day')))];
  const kindLabel = (k) => t(['handbook', 'background_guide'].includes(k) ? `dp.kind.${k}` : 'dp.kind.other');

  return (
    <>
      <PageHero eyebrow={t('common.delegateInfo')} title={t('dp.title')} intro={t('dp.intro')} />

      <section className="py-16">
        <div className="container-x grid gap-6 md:grid-cols-2">
          <Block title={t('dp.what')}>
            <p className="whitespace-pre-line">{st('what_is_mun')}</p>
          </Block>
          <Block title={t('dp.who')}>
            <p className="whitespace-pre-line">{st('who_can_participate')}</p>
          </Block>
          <Block title={t('dp.happens')}>
            <p className="whitespace-pre-line">{st('what_happens')}</p>
          </Block>
          <Block title={t('dp.prepare')}>
            <ul className="list-disc space-y-1.5 ps-5">
              {lines(st('what_to_prepare')).map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </Block>
          <Block title={t('dp.dress')}>
            <p className="whitespace-pre-line">{st('dress_code')}</p>
          </Block>
          <Block title={t('dp.receive')}>
            <p className="whitespace-pre-line">{st('what_delegates_receive')}</p>
          </Block>
        </div>

        {/* Fees */}
        <div className="container-x mt-12">
          <Reveal>
            <div className="overflow-hidden rounded-2xl border border-navy-100 shadow-soft">
              <div className="hero-bg px-6 py-5 text-white sm:px-8">
                <h2 className="text-2xl font-bold">{t('dp.fees')}</h2>
                <p className="mt-1 text-sm text-navy-100">
                  {settings.registration_opens
                    ? t('dp.opens', { date: formatDate(settings.registration_opens, lang) })
                    : t('dp.datesSoon')}{' '}
                  {t('dp.inclusive')}
                </p>
              </div>
              <div className="grid divide-y divide-navy-100 bg-white sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {fees.map((f) => {
                  const current = reg.state === 'open' && reg.phase === f.phase;
                  return (
                    <div key={f.phase} className={`p-6 text-center ${current ? 'bg-gold-100/60' : ''}`}>
                      <p className="text-sm font-semibold uppercase tracking-wide text-navy-600">{t(`phase.${f.phase}`)}</p>
                      <p className="mt-2 font-serif text-4xl font-bold text-navy-950">{formatMoney(f.amount)}</p>
                      <p className="mt-2 text-sm text-navy-700">
                        {f.until ? t('dp.until', { date: formatDate(f.until, lang) }) : t('dp.tbc')}
                      </p>
                      {current && (
                        <span className="mt-3 inline-block rounded-full bg-gold-500 px-3 py-1 text-xs font-bold text-navy-950">
                          {t('dp.current')}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>
          <div className="mt-6 text-center">
            <Link to="/register" className="btn-gold">
              {reg.state === 'open' ? t('dp.registerNow') : t('dp.regStatus')}
            </Link>
          </div>
        </div>

        {/* Schedule */}
        <div className="container-x mt-16">
          <Reveal>
            <h2 className="text-3xl font-bold text-navy-950">{t('dp.schedule')}</h2>
            <div className="mt-3 h-1 w-14 rounded bg-gold-500" />
          </Reveal>
          <div className="mt-8">
            {days.length === 0 ? (
              <EmptyState title={t('dp.schedule.t')} text={t('dp.schedule.d')} />
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {days.map((day) => (
                  <Reveal key={day}>
                    <div className="card h-full">
                      <h3 className="text-xl font-bold text-navy-950">{day}</h3>
                      <ul className="mt-4 space-y-4">
                        {schedule.data
                          .filter((s) => tr(s, 'day') === day)
                          .map((s) => (
                            <li key={s.id} className="flex gap-4">
                              <span className="ltr-text w-16 shrink-0 font-semibold text-gold-700">{s.start_time}</span>
                              <span>
                                <span className="block font-semibold text-navy-900">{tr(s, 'title')}</span>
                                {tr(s, 'description') && <span className="block text-sm text-navy-700">{tr(s, 'description')}</span>}
                              </span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Documents */}
        <div className="container-x mt-16">
          <Reveal>
            <h2 className="text-3xl font-bold text-navy-950">{t('dp.docs')}</h2>
            <div className="mt-3 h-1 w-14 rounded bg-gold-500" />
          </Reveal>
          <div className="mt-8">
            {docs.data.length === 0 ? (
              <EmptyState title={t('dp.docs.t')} text={t('dp.docs.d')} />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {docs.data.map((d) => (
                  <Reveal key={d.id}>
                    <a
                      href={safeUrl(d.file_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card flex h-full items-start gap-4 transition hover:-translate-y-1 hover:border-gold-500"
                    >
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-navy-900 text-xs font-bold text-gold-300">
                        PDF
                      </span>
                      <span>
                        <span className="block text-xs font-semibold uppercase tracking-wide text-gold-700">{kindLabel(d.kind)}</span>
                        <span className="block text-lg font-bold text-navy-950">{tr(d, 'title')}</span>
                        {tr(d, 'description') && <span className="mt-1 block text-sm text-navy-700">{tr(d, 'description')}</span>}
                      </span>
                    </a>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="container-x mt-16">
          <div className="rounded-2xl bg-navy-50 p-8 text-center">
            <h2 className="text-2xl font-bold text-navy-950">{t('dp.question.t')}</h2>
            <p className="mt-2 text-navy-700">{t('dp.question.d')}</p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link to="/faq" className="btn-navy">
                {t('common.faq')}
              </Link>
              <Link to="/contact" className="btn-outline-dark">
                {t('common.contactUs')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
