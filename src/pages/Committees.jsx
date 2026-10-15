import Reveal from '../components/Reveal.jsx';
import { EmptyState, PageHero, Spinner } from '../components/ui.jsx';
import { useRows } from '../lib/content.jsx';
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
  usePageMeta('Committees', 'The committees, topics and background guides for SYRMUN 2027.');

  return (
    <>
      <PageHero
        eyebrow="Committees"
        title="Committees & topics"
        intro="Every committee at SYRMUN 2027, with its mandate, topics and Chairs. Background guides are linked here as soon as they are published."
      />
      <section className="py-16">
        <div className="container-x">
          {loading ? (
            <Spinner />
          ) : data.length === 0 ? (
            <EmptyState
              title="Committees will be announced soon"
              text="We are finalising the committees and topics. Check back here, or follow us on social media."
            />
          ) : (
            <>
              <nav aria-label="Committees" className="mb-10 flex flex-wrap gap-2">
                {data.map((c) => (
                  <a
                    key={c.id}
                    href={`#${c.id}`}
                    className="rounded-full border border-navy-200 px-4 py-1.5 text-sm font-semibold text-navy-800 transition hover:border-gold-500 hover:bg-gold-100/50"
                  >
                    {c.abbreviation || c.name}
                  </a>
                ))}
              </nav>

              <div className="space-y-8">
                {data.map((c) => {
                  const topics = lines(c.topics);
                  const guide = safeUrl(c.guide_url);
                  return (
                    <Reveal key={c.id}>
                      <article id={c.id} className="card scroll-mt-24 !p-0 overflow-hidden">
                        <div className="hero-bg flex flex-wrap items-center gap-3 px-6 py-5 text-white sm:px-8">
                          {c.abbreviation && (
                            <span className="rounded-full bg-gold-500 px-3 py-1 text-xs font-bold tracking-widest text-navy-950">
                              {c.abbreviation}
                            </span>
                          )}
                          <h2 className="text-2xl font-bold">{c.name}</h2>
                        </div>
                        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-3">
                          <div className="space-y-5 lg:col-span-2">
                            {c.description && (
                              <div>
                                <h3 className="text-sm font-semibold uppercase tracking-wide text-gold-700">About the committee</h3>
                                <p className="mt-2 whitespace-pre-line leading-relaxed text-navy-800">{c.description}</p>
                              </div>
                            )}
                            {c.mandate && (
                              <div>
                                <h3 className="text-sm font-semibold uppercase tracking-wide text-gold-700">Mandate</h3>
                                <p className="mt-2 whitespace-pre-line leading-relaxed text-navy-800">{c.mandate}</p>
                              </div>
                            )}
                            {topics.length > 0 && (
                              <div>
                                <h3 className="text-sm font-semibold uppercase tracking-wide text-gold-700">
                                  {topics.length > 1 ? 'Topics' : 'Topic'}
                                </h3>
                                <ul className="mt-2 list-disc space-y-1 pl-5 text-navy-800">
                                  {topics.map((t) => (
                                    <li key={t}>{t}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {c.issues && (
                              <div>
                                <h3 className="text-sm font-semibold uppercase tracking-wide text-gold-700">The issues</h3>
                                <p className="mt-2 whitespace-pre-line leading-relaxed text-navy-800">{c.issues}</p>
                              </div>
                            )}
                          </div>
                          <aside className="space-y-5 rounded-xl bg-navy-50 p-5">
                            <dl className="space-y-4">
                              <Person role="Chair" name={c.chair} />
                              <Person role="Vice-Chair" name={c.vice_chair} />
                              {!c.chair && !c.vice_chair && (
                                <p className="text-sm text-navy-600">Chairs to be confirmed.</p>
                              )}
                            </dl>
                            {guide ? (
                              <a href={guide} target="_blank" rel="noopener noreferrer" className="btn-navy w-full">
                                Background guide
                              </a>
                            ) : (
                              <p className="text-sm text-navy-600">Background guide coming soon.</p>
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
