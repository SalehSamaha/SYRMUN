import Reveal from '../components/Reveal.jsx';
import { EmptyState, PageHero, Spinner } from '../components/ui.jsx';
import { useRows } from '../lib/content.jsx';
import { useI18n } from '../lib/i18n.jsx';
import { lines, safeUrl, usePageMeta } from '../lib/util.js';

function Person({ role, name }) {
  if (!name) return null;
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-sky-300">{role}</dt>
      <dd className="font-semibold text-white">{name}</dd>
    </div>
  );
}

export default function Committees() {
  const { data, loading } = useRows('committees');
  const { t, tr } = useI18n();
  usePageMeta(t('common.committees'), t('cp.meta'));

  return (
    <>
      <PageHero eyebrow={t('common.committees')} title={t('cp.title')} intro={t('cp.intro')} />
      <section className="bg-transparent py-10 sm:py-16 md:py-20 text-white">
        <div className="container-x">
          {loading ? (
            <Spinner />
          ) : data.length === 0 ? (
            <EmptyState title={t('committees.empty.t')} text={t('committees.empty.d')} />
          ) : (
            <>
              <nav aria-label={t('common.committees')} className="mb-5 sm:mb-10 flex flex-wrap gap-1.5 sm:gap-2">
                {data.map((c) => (
                  <a
                    key={c.id}
                    href={`#${c.id}`}
                    className="inline-flex min-h-[38px] items-center rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs sm:text-sm font-semibold text-white transition hover:border-sky-300 hover:bg-white/10 hover:text-sky-200"
                  >
                    {c.abbreviation || tr(c, 'name')}
                  </a>
                ))}
              </nav>

              <div className="space-y-4 sm:space-y-8">
                {data.map((c) => {
                  const topics = lines(tr(c, 'topics'));
                  const guide = safeUrl(c.guide_url);
                  const chair = tr(c, 'chair');
                  const vice = tr(c, 'vice_chair');
                  return (
                    <Reveal key={c.id}>
                      <article id={c.id} className="scroll-mt-20 sm:scroll-mt-24 rounded-2xl border border-white/10 bg-[#021742]/35 backdrop-blur-sm overflow-hidden shadow-soft">
                        <div className="border-b border-white/10 bg-white/5 flex flex-wrap items-center gap-2 sm:gap-3 px-3.5 py-3 sm:px-8 sm:py-5 text-white">
                          {c.abbreviation && (
                            <span className="rounded-md border border-sky-400/30 bg-sky-400/10 px-2 py-0.5 sm:px-2.5 sm:py-1 text-xs font-bold tracking-wider text-sky-200">
                              {c.abbreviation}
                            </span>
                          )}
                          <h2 className="text-lg sm:text-2xl font-bold font-serif">{tr(c, 'name')}</h2>
                        </div>
                        <div className="grid gap-4 sm:gap-6 p-3.5 sm:p-6 lg:p-8 lg:grid-cols-3">
                          <div className="space-y-4 sm:space-y-6 lg:col-span-2">
                            {tr(c, 'description') && (
                              <div>
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-sky-300">{t('cp.about')}</h3>
                                <p className="mt-1.5 whitespace-pre-line text-xs sm:text-base leading-relaxed text-navy-100">{tr(c, 'description')}</p>
                              </div>
                            )}
                            {tr(c, 'mandate') && (
                              <div>
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-sky-300">{t('cp.mandate')}</h3>
                                <p className="mt-1.5 whitespace-pre-line text-xs sm:text-base leading-relaxed text-navy-100">{tr(c, 'mandate')}</p>
                              </div>
                            )}
                            {topics.length > 0 && (
                              <div>
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-sky-300">
                                  {topics.length > 1 ? t('cp.topics') : t('cp.topic')}
                                </h3>
                                <ul className="mt-1.5 list-disc space-y-1 ps-5 text-xs sm:text-base text-navy-100">
                                  {topics.map((topic) => (
                                    <li key={topic}>{topic}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {tr(c, 'issues') && (
                              <div>
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-sky-300">{t('cp.issues')}</h3>
                                <p className="mt-1.5 whitespace-pre-line text-xs sm:text-base leading-relaxed text-navy-100">{tr(c, 'issues')}</p>
                              </div>
                            )}
                          </div>
                          <aside className="space-y-3.5 sm:space-y-5 rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-3.5 sm:p-5">
                            <dl className="grid grid-cols-2 gap-2 sm:block sm:space-y-4">
                              <Person role={t('cp.chair')} name={chair} />
                              <Person role={t('cp.vice')} name={vice} />
                              {!chair && !vice && <p className="col-span-2 text-xs sm:text-sm text-navy-300">{t('cp.chairsTbc')}</p>}
                            </dl>
                            {guide ? (
                              <a href={guide} target="_blank" rel="noopener noreferrer" className="btn-navy w-full min-h-[44px]">
                                {t('common.backgroundGuide')}
                              </a>
                            ) : (
                              <p className="text-xs sm:text-sm text-navy-300">{t('cp.guideSoon')}</p>
                            )}
                          </aside>
                        </div>
                      </article>
                    </Reveal>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
