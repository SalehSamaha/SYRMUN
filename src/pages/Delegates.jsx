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
      <section className="card h-full rounded-2xl border border-white/10 bg-[#021742]/35 backdrop-blur-sm p-6 sm:p-8 shadow-soft">
        <h2 className="text-2xl font-bold font-serif text-white">{title}</h2>
        <div className="mt-2 h-[2px] w-10 bg-gradient-to-r from-sky-400 to-white" />
        <div className="mt-4 leading-relaxed text-navy-100">{children}</div>
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

      <section className="bg-transparent py-20 text-white">
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
            <ul className="list-disc space-y-1.5 ps-5 text-navy-100">
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
        <div className="container-x mt-16">
          <Reveal>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#021742]/35 backdrop-blur-sm shadow-soft">
              <div className="border-b border-white/10 bg-white/5 px-6 py-5 text-white sm:px-8">
                <h2 className="text-2xl font-bold font-serif">{t('dp.fees')}</h2>
                <p className="mt-1 text-sm text-navy-200">
                  {settings.registration_opens
                    ? t('dp.opens', { date: formatDate(settings.registration_opens, lang) })
                    : t('dp.datesSoon')}{' '}
                  {t('dp.inclusive')}
                </p>
              </div>
              <div className="grid divide-y divide-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {fees.map((f) => {
                  const current = reg.state === 'open' && reg.phase === f.phase;
                  return (
                    <div key={f.phase} className={`p-6 text-center ${current ? 'bg-sky-500/10' : ''}`}>
                      <p className="text-xs font-semibold uppercase tracking-wider text-sky-300">{t(`phase.${f.phase}`)}</p>
                      <p className="mt-2 font-serif text-4xl font-bold text-white tabular-nums">{formatMoney(f.amount)}</p>
                      <p className="mt-2 text-sm text-navy-200">
                        {f.until ? t('dp.until', { date: formatDate(f.until, lang) }) : t('dp.tbc')}
                      </p>
                      {current && (
                        <span className="mt-3 inline-block rounded-md border border-sky-400/30 bg-sky-400/15 px-3 py-1 text-xs font-bold text-sky-200">
                          {t('dp.current')}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>
          <div className="mt-8 text-center">
            <Link to="/register" className="btn-gold">
              {reg.state === 'open' ? t('dp.registerNow') : t('dp.regStatus')}
            </Link>
          </div>
        </div>

        {/* Schedule */}
        <div className="container-x mt-20">
          <Reveal>
            <h2 className="text-3xl font-bold font-serif text-white">{t('dp.schedule')}</h2>
            <div className="mt-3 h-[2px] w-14 bg-gradient-to-r from-sky-400 to-white" />
          </Reveal>
          <div className="mt-8">
            {days.length === 0 ? (
              <EmptyState title={t('dp.schedule.t')} text={t('dp.schedule.d')} />
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {days.map((day) => (
                  <Reveal key={day}>
                    <div className="card h-full rounded-2xl border border-white/10 bg-[#021742]/35 backdrop-blur-sm p-6 shadow-soft">
                      <h3 className="text-xl font-bold font-serif text-white">{day}</h3>
                      <ul className="mt-4 space-y-4">
                        {schedule.data
                          .filter((s) => tr(s, 'day') === day)
                          .map((s) => (
                            <li key={s.id} className="flex gap-4">
                              <span className="ltr-text w-16 shrink-0 font-mono font-semibold text-sky-300">{s.start_time}</span>
                              <span>
                                <span className="block font-semibold text-white">{tr(s, 'title')}</span>
                                {tr(s, 'description') && <span className="block text-sm text-navy-200">{tr(s, 'description')}</span>}
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
        <div className="container-x mt-20">
          <Reveal>
            <h2 className="text-3xl font-bold font-serif text-white">{t('dp.docs')}</h2>
            <div className="mt-3 h-[2px] w-14 bg-gradient-to-r from-sky-400 to-white" />
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
                      className="card flex h-full items-start gap-4 rounded-2xl border border-white/10 bg-[#021742]/35 backdrop-blur-sm p-6 shadow-soft transition hover:-translate-y-1 hover:border-sky-400/40 hover:bg-[#021742]/50"
                    >
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 font-mono text-xs font-bold text-sky-300">
                        PDF
                      </span>
                      <span>
                        <span className="block text-xs font-semibold uppercase tracking-wider text-sky-300/80">{kindLabel(d.kind)}</span>
                        <span className="block text-lg font-bold text-white">{tr(d, 'title')}</span>
                        {tr(d, 'description') && <span className="mt-1 block text-sm text-navy-200">{tr(d, 'description')}</span>}
                      </span>
                    </a>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="container-x mt-20">
          <div className="rounded-2xl border border-white/10 bg-[#021742]/35 backdrop-blur-sm p-8 sm:p-10 text-center shadow-soft">
            <h2 className="text-2xl font-bold font-serif text-white">{t('dp.question.t')}</h2>
            <p className="mt-2 text-navy-200">{t('dp.question.d')}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link to="/faq" className="btn-navy">
                {t('common.faq')}
              </Link>
              <Link to="/contact" className="btn-outline">
                {t('common.contactUs')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
