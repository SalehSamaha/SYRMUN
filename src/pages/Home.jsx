import { Link } from 'react-router-dom';
import { Icon } from '../components/art.jsx';
import Countdown from '../components/Countdown.jsx';
import Reveal from '../components/Reveal.jsx';
import BoardCard from '../components/BoardCard.jsx';
import { EmptyState, FaqList, SectionHeading } from '../components/ui.jsx';
import { useRows, useSettings } from '../lib/content.jsx';
import { formatMoney, getFeeTable, getRegistrationState } from '../lib/fees.js';
import { useI18n } from '../lib/i18n.jsx';
import { dateLocale } from '../lib/translations.js';
import { lines, usePageMeta } from '../lib/util.js';

const WHY = [
  ['why.1', 'mic'],
  ['why.2', 'heart'],
  ['why.3', 'tag'],
  ['why.4', 'scale'],
];
const EXPERIENCE = [
  ['exp.1', 'calendar'],
  ['exp.2', 'book'],
  ['exp.3', 'users'],
  ['exp.4', 'pin'],
];

export default function Home() {
  const { settings } = useSettings();
  const { t, tr, st, lang } = useI18n();
  const committees = useRows('committees');
  const board = useRows('board_members');
  const faqs = useRows('faqs');
  const news = useRows('announcements', { orderBy: 'created_at', ascending: false });
  const reg = getRegistrationState(settings);
  const lowestFee = Math.min(...getFeeTable(settings).map((f) => f.amount).filter((n) => Number.isFinite(n)));
  const stats = [
    ['calendar', '2', t('stats.days')],
    ['users', '40–60', t('stats.delegates')],
    ['pin', t('stats.cityVal'), t('stats.city')],
    ['dollar', Number.isFinite(lowestFee) ? formatMoney(lowestFee) : '—', t('stats.fees')],
  ];

  usePageMeta(null, t('home.metaDesc'));

  const ctaLabel = reg.state === 'open' ? t('cta.open') : reg.state === 'closed' ? t('cta.closed') : t('cta.soon');

  return (
    <>
      {/* HERO SECTION — Cinematic Editorial Marquee Floating over Architectural Video */}
      <section className="relative overflow-hidden text-white">
        <div className="container-x relative z-10 pt-6 pb-10 sm:pt-24 sm:pb-20">
          <div className="max-w-3xl">
            {/* Mobile-Exclusive Visual Brand Lockup */}
            <div className="flex sm:hidden items-center gap-3 mb-5 rounded-2xl border border-white/10 bg-[#021742]/40 backdrop-blur-md p-3 shadow-soft">
              <img src="/logo.png" alt="SYRMUN" width={44} height={44} className="shrink-0 drop-shadow-[0_4px_12px_rgba(56,189,248,0.35)]" />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-sky-300">
                  <span>{st('venue_text')}</span>
                  <span aria-hidden="true" className="text-white/40">·</span>
                  <span>2027</span>
                </div>
                <p className="truncate text-xs font-medium text-navy-200">{st('conference_dates_text')}</p>
              </div>
            </div>

            {/* Desktop Unboxed Metadata Header (Anti-Slop Zero-Pill discipline) */}
            <div className="hidden sm:flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs font-medium tracking-wider text-sky-200/90 uppercase">
              <span>{st('venue_text')}</span>
              <span aria-hidden="true" className="text-white/40">·</span>
              <span>{st('conference_dates_text')}</span>
              <span aria-hidden="true" className="text-white/40">·</span>
              <span>{t('hero.sub')}</span>
            </div>

            <h1
              className="mt-2 sm:mt-6 text-3xl xs:text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.08] sm:leading-[1.05]"
              dir="ltr"
              style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}
            >
              SYRMUN <span className="text-gold-gradient font-serif">2027</span>
            </h1>

            <p className="mt-2 sm:mt-4 font-serif text-base sm:text-2xl text-sky-100/90">
              {t('hero.sub')}
            </p>

            <p className="mt-2.5 sm:mt-5 max-w-2xl text-xs sm:text-lg leading-relaxed text-navy-100/90">
              {t('hero.intro')} <span className="hidden sm:inline">{st('tagline')}</span>
            </p>

            <div className="mt-5 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-4">
              <Link to="/register" className="btn-gold w-full sm:w-auto text-center min-h-[48px] text-sm sm:text-base font-bold shadow-lg">
                {ctaLabel}
              </Link>
              <Link to="/about" className="btn-outline w-full sm:w-auto text-center min-h-[44px] text-sm font-semibold">
                {t('hero.learn')}
              </Link>
            </div>

            <div className="mt-6 sm:mt-12">
              <Countdown date={settings.conference_start} />
            </div>
          </div>

          {/* Institutional KPI Strip in Translucent Hairline Glass */}
          <dl className="mt-7 sm:mt-16 grid grid-cols-2 gap-2 sm:gap-4 pb-2 sm:pb-4 sm:grid-cols-4">
            {stats.map(([icon, value, label]) => (
              <div
                key={label}
                className="flex items-center gap-2 sm:gap-3.5 rounded-xl sm:rounded-2xl border border-white/10 bg-[#021742]/45 backdrop-blur-sm p-2.5 sm:p-4 shadow-soft transition hover:border-sky-400/30 hover:bg-[#021742]/50"
              >
                <span className="grid h-8 w-8 sm:h-10 sm:w-10 shrink-0 place-items-center rounded-lg sm:rounded-xl border border-white/10 bg-white/5 text-sky-300">
                  <Icon name={icon} className="h-4 w-4 sm:h-5 sm:w-5" />
                </span>
                <div className="min-w-0">
                  <dd className="truncate font-serif text-sm sm:text-lg font-bold leading-tight text-white tabular-nums">{value}</dd>
                  <dt className="truncate text-[10px] sm:text-xs text-navy-200">{label}</dt>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ANNOUNCEMENTS */}
      {news.data.length > 0 && (
        <section className="border-y border-white/10 bg-transparent">
          <div className="container-x py-8">
            <p className="eyebrow !text-sky-300">{t('home.news')}</p>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {news.data.slice(0, 3).map((a) => (
                <Reveal key={a.id}>
                  <article className="h-full rounded-2xl border border-white/10 bg-[#021742]/35 backdrop-blur-sm p-5 shadow-soft transition hover:border-sky-400/40">
                    <time className="text-xs font-semibold uppercase tracking-wider text-sky-300/80">
                      {a.created_at
                        ? new Date(a.created_at).toLocaleDateString(dateLocale(lang), { day: 'numeric', month: 'long', year: 'numeric' })
                        : ''}
                    </time>
                    <h3 className="mt-1.5 text-lg font-bold text-white">{tr(a, 'title')}</h3>
                    {tr(a, 'body') && <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-navy-200">{tr(a, 'body')}</p>}
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* WHAT IS SYRMUN / WHY */}
      <section className="bg-transparent py-10 sm:py-20 md:py-24">
        <div className="container-x">
          <SectionHeading eyebrow={t('home.what.eyebrow')} title={t('home.what.title')} intro={t('home.what.intro')} />
          <div className="mt-6 sm:mt-12 grid gap-3 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map(([k, icon], i) => (
              <Reveal key={k} delay={i * 80}>
                <div className="card-lift h-full rounded-2xl border border-white/10 bg-[#021742]/35 backdrop-blur-sm p-3.5 sm:p-6 shadow-soft transition hover:border-sky-400/40 hover:bg-[#021742]/50 flex flex-row sm:flex-col items-start gap-3 sm:gap-0">
                  <span className="sm:mb-4 grid h-10 w-10 sm:h-12 sm:w-12 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-sky-300 shadow-soft">
                    <Icon name={icon} className="h-5 w-5 sm:h-6 sm:w-6" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm sm:text-lg font-bold text-white">{t(`${k}.t`)}</h3>
                    <p className="mt-1 sm:mt-2 text-xs sm:text-sm leading-relaxed text-navy-200">{t(`${k}.d`)}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* COMMITTEES */}
      <section className="border-y border-white/10 bg-transparent py-10 sm:py-20 md:py-24">
        <div className="container-x">
          <SectionHeading eyebrow={t('common.committees')} title={t('home.committees.title')} />
          <div className="mt-6 sm:mt-12">
            {committees.data.length === 0 ? (
              <EmptyState title={t('committees.empty.t')} text={t('committees.empty.d')} />
            ) : (
              <div className="grid gap-3 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {committees.data.slice(0, 6).map((c, i) => (
                  <Reveal key={c.id} delay={i * 60}>
                    <Link
                      to={`/committees#${c.id}`}
                      className="card-lift block h-full rounded-2xl border border-white/10 bg-[#021742]/35 backdrop-blur-sm p-4 sm:p-6 shadow-soft transition hover:-translate-y-1 hover:border-sky-400/40 hover:bg-[#021742]/50"
                    >
                      <div className="flex items-center justify-between gap-2">
                        {c.abbreviation && (
                          <span className="rounded-md border border-sky-400/30 bg-sky-400/10 px-2 py-0.5 sm:px-2.5 sm:py-1 text-xs font-semibold tracking-wider text-sky-200">
                            {c.abbreviation}
                          </span>
                        )}
                        <span className="sm:hidden text-xs font-semibold uppercase tracking-wider text-sky-300">
                          {t('committees.view')}
                        </span>
                      </div>
                      <h3 className="mt-2.5 sm:mt-3 text-base sm:text-xl font-bold text-white">{tr(c, 'name')}</h3>
                      {lines(tr(c, 'topics'))[0] && (
                        <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm leading-relaxed text-navy-200 line-clamp-2">
                          {lines(tr(c, 'topics'))[0]}
                        </p>
                      )}
                      <span className="hidden sm:inline-block mt-4 sm:mt-5 text-xs font-semibold uppercase tracking-wider text-sky-300 hover:text-sky-200">
                        {t('committees.view')}
                      </span>
                    </Link>
                  </Reveal>
                ))}
              </div>
            )}
            {committees.data.length > 0 && (
              <div className="mt-6 sm:mt-10 text-center">
                <Link to="/committees" className="btn-outline w-full sm:w-auto min-h-[44px]">
                  {t('committees.all')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="bg-transparent py-10 sm:py-20 md:py-24">
        <div className="container-x">
          <SectionHeading eyebrow={t('exp.eyebrow')} title={t('exp.title')} center />
          <div className="mt-6 sm:mt-12 grid gap-3 sm:gap-6 sm:grid-cols-2">
            {EXPERIENCE.map(([k, icon], i) => (
              <Reveal key={k} delay={i * 70}>
                <div className="card-lift flex items-start sm:items-center gap-3 sm:gap-4 rounded-2xl border border-white/10 bg-[#021742]/35 backdrop-blur-sm p-3.5 sm:p-6 shadow-soft transition hover:border-sky-400/40 hover:bg-[#021742]/50">
                  <span className="grid h-9 w-9 sm:h-12 sm:w-12 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-sky-300">
                    <Icon name={icon} className="h-4 w-4 sm:h-6 sm:w-6" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm sm:text-lg font-bold text-white">{t(`${k}.t`)}</h3>
                    <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm leading-relaxed text-navy-200">{t(`${k}.d`)}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-6 sm:mt-12 text-center">
            <Link to="/delegates" className="btn-outline w-full sm:w-auto min-h-[44px]">
              {t('common.delegateInfo')}
            </Link>
          </div>
        </div>
      </section>

      {/* BOARD */}
      <section className="border-y border-white/10 bg-transparent py-10 sm:py-20 md:py-24">
        <div className="container-x">
          <SectionHeading eyebrow={t('common.execBoard')} title={t('home.board.title')} />
          <div className="mt-6 sm:mt-12">
            {board.data.length === 0 ? (
              <EmptyState title={t('board.empty.t')} text={t('board.empty.d')} />
            ) : (
              <div className="grid gap-3 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {board.data.slice(0, 4).map((m, i) => (
                  <Reveal key={m.id} delay={i * 70}>
                    <BoardCard member={m} />
                  </Reveal>
                ))}
              </div>
            )}
            {board.data.length > 4 && (
              <div className="mt-6 sm:mt-10 text-center">
                <Link to="/board" className="btn-outline w-full sm:w-auto min-h-[44px]">
                  {t('board.full')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-transparent py-10 sm:py-20 md:py-24">
        <div className="container-x max-w-3xl">
          <SectionHeading eyebrow={t('common.faq')} title={t('home.faq.title')} center />
          <div className="mt-6 sm:mt-12">
            <FaqList items={faqs.data.slice(0, 6)} />
            <div className="mt-6 sm:mt-10 text-center">
              <Link to="/faq" className="btn-outline w-full sm:w-auto min-h-[44px]">
                {t('home.faq.all')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="border-t border-white/10 bg-transparent py-10 sm:py-20 md:py-24 text-white">
        <div className="container-x">
          <div className="rounded-3xl border border-white/10 bg-[#021742]/40 backdrop-blur-md px-4 py-8 sm:px-12 sm:py-16 text-center text-white shadow-soft">
            <h2 className="text-xl sm:text-4xl md:text-5xl font-bold font-serif">{t('home.cta.title')}</h2>
            <p className="mx-auto mt-2 sm:mt-4 max-w-xl text-xs sm:text-lg text-navy-200 leading-relaxed">{t('home.cta.text')}</p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-2.5 sm:gap-4">
              <Link to="/register" className="btn-gold w-full sm:w-auto min-h-[48px] text-sm sm:text-base font-bold shadow-lg">
                {ctaLabel}
              </Link>
              <Link to="/staff" className="btn-outline w-full sm:w-auto min-h-[44px] text-sm font-semibold">
                {t('common.joinTeam')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

