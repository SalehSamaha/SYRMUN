import { Link } from 'react-router-dom';
import Countdown from '../components/Countdown.jsx';
import Reveal from '../components/Reveal.jsx';
import BoardCard from '../components/BoardCard.jsx';
import { EmptyState, FaqList, SectionHeading } from '../components/ui.jsx';
import { useRows, useSettings } from '../lib/content.jsx';
import { getRegistrationState } from '../lib/fees.js';
import { useI18n } from '../lib/i18n.jsx';
import { dateLocale } from '../lib/translations.js';
import { lines, usePageMeta } from '../lib/util.js';

const WHY = ['why.1', 'why.2', 'why.3', 'why.4'];
const EXPERIENCE = ['exp.1', 'exp.2', 'exp.3', 'exp.4'];

export default function Home() {
  const { settings } = useSettings();
  const { t, tr, st, lang } = useI18n();
  const committees = useRows('committees');
  const board = useRows('board_members');
  const faqs = useRows('faqs');
  const news = useRows('announcements', { orderBy: 'created_at', ascending: false });
  const reg = getRegistrationState(settings);

  usePageMeta(null, t('home.metaDesc'));

  const ctaLabel = reg.state === 'open' ? t('cta.open') : reg.state === 'closed' ? t('cta.closed') : t('cta.soon');

  return (
    <>
      {/* HERO */}
      <section className="hero-bg text-white">
        <div className="container-x py-20 sm:py-28">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded-full border border-gold-500/50 bg-gold-500/10 px-4 py-1.5 font-medium text-gold-300">
              {st('venue_text')}
            </span>
            <span className="rounded-full border border-white/20 px-4 py-1.5 text-navy-100">{st('conference_dates_text')}</span>
          </div>
          <img src="/logo.png" alt="" width="112" height="112" className="mt-8 h-24 w-24 sm:h-28 sm:w-28" />
          <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] sm:text-7xl" dir="ltr" style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
            SYRMUN <span className="text-gold-400">2027</span>
          </h1>
          <p className="mt-2 font-serif text-xl text-navy-100 sm:text-2xl">{t('hero.sub')}</p>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-navy-100">
            {t('hero.intro')} {st('tagline')}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/register" className="btn-gold">
              {ctaLabel}
            </Link>
            <Link to="/about" className="btn-outline">
              {t('hero.learn')}
            </Link>
          </div>
          <div className="mt-12">
            <Countdown date={settings.conference_start} />
          </div>
        </div>
      </section>

      {/* ANNOUNCEMENTS */}
      {news.data.length > 0 && (
        <section className="border-b border-navy-100 bg-gold-100/40">
          <div className="container-x py-8">
            <p className="eyebrow">{t('home.news')}</p>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {news.data.slice(0, 3).map((a) => (
                <Reveal key={a.id}>
                  <article className="h-full rounded-xl bg-white p-5 shadow-soft">
                    <time className="text-xs font-semibold uppercase tracking-wide text-navy-500">
                      {a.created_at
                        ? new Date(a.created_at).toLocaleDateString(dateLocale(lang), { day: 'numeric', month: 'long', year: 'numeric' })
                        : ''}
                    </time>
                    <h3 className="mt-1 text-lg font-bold text-navy-950">{tr(a, 'title')}</h3>
                    {tr(a, 'body') && <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-navy-700">{tr(a, 'body')}</p>}
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* WHAT IS SYRMUN / WHY */}
      <section className="py-20">
        <div className="container-x">
          <SectionHeading eyebrow={t('home.what.eyebrow')} title={t('home.what.title')} intro={t('home.what.intro')} />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((k, i) => (
              <Reveal key={k} delay={i * 80}>
                <div className="card h-full border-t-4 border-t-gold-500">
                  <h3 className="text-lg font-bold text-navy-950">{t(`${k}.t`)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy-700">{t(`${k}.d`)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* COMMITTEES */}
      <section className="bg-navy-50 py-20">
        <div className="container-x">
          <SectionHeading eyebrow={t('common.committees')} title={t('home.committees.title')} />
          <div className="mt-10">
            {committees.data.length === 0 ? (
              <EmptyState title={t('committees.empty.t')} text={t('committees.empty.d')} />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {committees.data.slice(0, 6).map((c, i) => (
                  <Reveal key={c.id} delay={i * 60}>
                    <Link to={`/committees#${c.id}`} className="card block h-full transition hover:-translate-y-1 hover:border-gold-500">
                      {c.abbreviation && (
                        <span className="rounded-full bg-navy-900 px-3 py-1 text-xs font-bold tracking-widest text-gold-300">
                          {c.abbreviation}
                        </span>
                      )}
                      <h3 className="mt-3 text-xl font-bold text-navy-950">{tr(c, 'name')}</h3>
                      {lines(tr(c, 'topics'))[0] && <p className="mt-2 text-sm text-navy-700">{lines(tr(c, 'topics'))[0]}</p>}
                      <span className="mt-4 inline-block text-sm font-semibold text-gold-700">{t('committees.view')}</span>
                    </Link>
                  </Reveal>
                ))}
              </div>
            )}
            {committees.data.length > 0 && (
              <div className="mt-8 text-center">
                <Link to="/committees" className="btn-navy">
                  {t('committees.all')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="py-20">
        <div className="container-x">
          <SectionHeading eyebrow={t('exp.eyebrow')} title={t('exp.title')} center />
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {EXPERIENCE.map((k, i) => (
              <Reveal key={k} delay={i * 70}>
                <div className="flex gap-4 rounded-2xl border border-navy-100 p-6">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-navy-900 font-serif font-bold text-gold-300">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-navy-950">{t(`${k}.t`)}</h3>
                    <p className="mt-1 text-navy-700">{t(`${k}.d`)}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/delegates" className="btn-outline-dark">
              {t('common.delegateInfo')}
            </Link>
          </div>
        </div>
      </section>

      {/* BOARD */}
      <section className="bg-navy-50 py-20">
        <div className="container-x">
          <SectionHeading eyebrow={t('common.execBoard')} title={t('home.board.title')} />
          <div className="mt-10">
            {board.data.length === 0 ? (
              <EmptyState title={t('board.empty.t')} text={t('board.empty.d')} />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {board.data.slice(0, 4).map((m, i) => (
                  <Reveal key={m.id} delay={i * 70}>
                    <BoardCard member={m} />
                  </Reveal>
                ))}
              </div>
            )}
            {board.data.length > 4 && (
              <div className="mt-8 text-center">
                <Link to="/board" className="btn-navy">
                  {t('board.full')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container-x max-w-3xl">
          <SectionHeading eyebrow={t('common.faq')} title={t('home.faq.title')} center />
          <div className="mt-10">
            <FaqList items={faqs.data.slice(0, 6)} />
            <div className="mt-8 text-center">
              <Link to="/faq" className="btn-outline-dark">
                {t('home.faq.all')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-bg py-16 text-white">
        <div className="container-x text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">{t('home.cta.title')}</h2>
          <p className="mx-auto mt-3 max-w-xl text-navy-100">{t('home.cta.text')}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/register" className="btn-gold">
              {ctaLabel}
            </Link>
            <Link to="/staff" className="btn-outline">
              {t('common.joinTeam')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
