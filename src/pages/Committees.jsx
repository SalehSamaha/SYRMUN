import Reveal from '../components/Reveal.jsx';
import { EmptyState, PageHero, Spinner } from '../components/ui.jsx';
import { useRows } from '../lib/content.jsx';
import { useI18n } from '../lib/i18n.jsx';
import { lines, safeUrl, usePageMeta } from '../lib/util.js';

function Person({ role, name }) {
  if (!name) return null;
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-navy-500">{role}</dt>
      <dd className="font-semibold text-navy-900">{name}</dd>
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
      <section className="py-16">
        <div className="container-x">
          {loading ? (
            <Spinner />
          ) : data.length === 0 ? (
            <EmptyState title={t('committees.empty.t')} text={t('committees.empty.d')} />
          ) : (
            <>
              <nav aria-label={t('common.committees')} className="mb-10 flex flex-wrap gap-2">
                {data.map((c) => (
                  <a
                    key={c.id}
                    href={`#${c.id}`}
                    className="rounded-full border border-navy-200 px-4 py-1.5 text-sm font-semibold text-navy-800 transition hover:border-gold-500 hover:bg-gold-100/50"
                  >
                    {c.abbreviation || tr(c, 'name')}
                  </a>
                ))}
              </nav>

              <div className="space-y-8">
                {data.map((c) => {
                  const topics = lines(tr(c, 'topics'));
                  const guide = safeUrl(c.guide_url);
                  const chair = tr(c, 'chair');
                  const vice = tr(c, 'vice_chair');
                  return (
                    <Reveal key={c.id}>
                      <article id={c.id} className="card scroll-mt-24 !p-0 overflow-hidden">
                        <div className="hero-bg flex flex-wrap items-center gap-3 px-6 py-5 text-white sm:px-8">
                          {c.abbreviation && (
                            <span className="rounded-full bg-gold-500 px-3 py-1 text-xs font-bold tracking-widest text-navy-950">
                              {c.abbreviation}
                            </span>
                          )}
                          <h2 className="text-2xl font-bold">{tr(c, 'name')}</h2>
                        </div>
                        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-3">
                          <div className="space-y-5 lg:col-span-2">
                            {tr(c, 'description') && (
                              <div>
                                <h3 className="text-sm font-semibold uppercase tracking-wide text-gold-700">{t('cp.about')}</h3>
                                <p className="mt-2 whitespace-pre-line leading-relaxed text-navy-800">{tr(c, 'description')}</p>
                              </div>
                            )}
                            {tr(c, 'mandate') && (
                              <div>
                                <h3 className="text-sm font-semibold uppercase tracking-wide text-gold-700">{t('cp.mandate')}</h3>
                                <p className="mt-2 whitespace-pre-line leading-relaxed text-navy-800">{tr(c, 'mandate')}</p>
                              </div>
                            )}
                            {topics.length > 0 && (
                              <div>
                                <h3 className="text-sm font-semibold uppercase tracking-wide text-gold-700">
                                  {topics.length > 1 ? t('cp.topics') : t('cp.topic')}
                                </h3>
                                <ul className="mt-2 list-disc space-y-1 ps-5 text-navy-800">
                                  {topics.map((topic) => (
                                    <li key={topic}>{topic}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {tr(c, 'issues') && (
                              <div>
                                <h3 className="text-sm font-semibold uppercase tracking-wide text-gold-700">{t('cp.issues')}</h3>
                                <p className="mt-2 whitespace-pre-line leading-relaxed text-navy-800">{tr(c, 'issues')}</p>
                              </div>
                            )}
                          </div>
                          <aside className="space-y-5 rounded-xl bg-navy-50 p-5">
                            <dl className="space-y-4">
                              <Person role={t('cp.chair')} name={chair} />
                              <Person role={t('cp.vice')} name={vice} />
                              {!chair && !vice && <p className="text-sm text-navy-600">{t('cp.chairsTbc')}</p>}
                            </dl>
                            {guide ? (
                              <a href={guide} target="_blank" rel="noopener noreferrer" className="btn-navy w-full">
                                {t('common.backgroundGuide')}
                              </a>
                            ) : (
                              <p className="text-sm text-navy-600">{t('cp.guideSoon')}</p>
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
