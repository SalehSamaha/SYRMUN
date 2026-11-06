import { Link } from 'react-router-dom';
import { Icon } from '../components/art.jsx';
import Countdown from '../components/Countdown.jsx';
import Reveal from '../components/Reveal.jsx';
import BoardCard from '../components/BoardCard.jsx';
import CinematicOpening from '../components/CinematicOpening.jsx';
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
      <CinematicOpening settings={settings} ctaLabel={ctaLabel} />

      <div className="syr-marquee relative z-10 overflow-hidden border-y border-white/10 bg-[#03122d]/35 py-4 backdrop-blur-sm" aria-label="SYRMUN 2027">
        <div className="syr-marquee-track flex w-max items-center gap-8 whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.34em] text-sky-100/55">
          {Array.from({ length: 4 }, (_, i) => (
            <span key={i} className="flex items-center gap-8">
              <span>SYRMUN 2027</span><span className="text-sky-300">✦</span>
              <span>WHERE VOICES SHAPE TOMORROW</span><span className="text-sky-300">✦</span>
              <span>RIYADH · SAUDI ARABIA</span><span className="text-sky-300">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* INSTITUTIONAL SNAPSHOT */}
      <section className="relative z-10 border-b border-white/10 bg-[#03122d]/25 py-5 backdrop-blur-sm">
        <div className="container-x grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map(([icon, value, label]) => (
            <div key={label} className="flex items-center gap-3 border-s border-white/10 ps-3 first:border-0 first:ps-0">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-sky-200/15 bg-sky-300/[0.06] text-sky-200">
                <Icon name={icon} className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <dd className="truncate font-serif text-lg font-bold leading-tight text-white tabular-nums">{value}</dd>
                <dt className="truncate text-[10px] uppercase tracking-wider text-navy-200/75">{label}</dt>
              </div>
            </div>
          ))}
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
      <section className="bg-transparent py-24">
        <div className="container-x">
          <SectionHeading eyebrow={t('home.what.eyebrow')} title={t('home.what.title')} intro={t('home.what.intro')} />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map(([k, icon], i) => (
              <Reveal key={k} delay={i * 80}>
                <div className="card-lift h-full rounded-2xl border border-white/10 bg-[#021742]/35 backdrop-blur-sm p-6 shadow-soft transition hover:border-sky-400/40 hover:bg-[#021742]/50">
                  <span className="mb-4 grid h-12 w-12 place-items-center rounded-xl border border-white/10 bg-white/5 text-sky-300 shadow-soft">
                    <Icon name={icon} />
                  </span>
                  <h3 className="text-lg font-bold text-white">{t(`${k}.t`)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy-200">{t(`${k}.d`)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* COMMITTEES */}
      <section className="border-y border-white/10 bg-transparent py-24">
        <div className="container-x">
          <SectionHeading eyebrow={t('common.committees')} title={t('home.committees.title')} />
          <div className="mt-12">
            {committees.data.length === 0 ? (
              <EmptyState title={t('committees.empty.t')} text={t('committees.empty.d')} />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {committees.data.slice(0, 6).map((c, i) => (
                  <Reveal key={c.id} delay={i * 60}>
                    <Link
                      to={`/committees#${c.id}`}
                      className="card-lift block h-full rounded-2xl border border-white/10 bg-[#021742]/35 backdrop-blur-sm p-6 shadow-soft transition hover:-translate-y-1 hover:border-sky-400/40 hover:bg-[#021742]/50"
                    >
                      {c.abbreviation && (
                        <span className="rounded-md border border-sky-400/30 bg-sky-400/10 px-2.5 py-1 text-xs font-semibold tracking-wider text-sky-200">
                          {c.abbreviation}
                        </span>
                      )}
                      <h3 className="mt-3 text-xl font-bold text-white">{tr(c, 'name')}</h3>
                      {lines(tr(c, 'topics'))[0] && <p className="mt-2 text-sm leading-relaxed text-navy-200">{lines(tr(c, 'topics'))[0]}</p>}
                      <span className="mt-5 inline-block text-xs font-semibold uppercase tracking-wider text-sky-300 hover:text-sky-200">
                        {t('committees.view')} →
                      </span>
                    </Link>
                  </Reveal>
                ))}
              </div>
            )}
            {committees.data.length > 0 && (
              <div className="mt-10 text-center">
                <Link to="/committees" className="btn-outline">
                  {t('committees.all')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="bg-transparent py-24">
        <div className="container-x">
          <SectionHeading eyebrow={t('exp.eyebrow')} title={t('exp.title')} center />
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {EXPERIENCE.map(([k, icon], i) => (
              <Reveal key={k} delay={i * 70}>
                <div className="card-lift flex gap-4 rounded-2xl border border-white/10 bg-[#021742]/35 backdrop-blur-sm p-6 shadow-soft transition hover:border-sky-400/40 hover:bg-[#021742]/50">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-sky-300">
                    <Icon name={icon} />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-white">{t(`${k}.t`)}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-navy-200">{t(`${k}.d`)}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link to="/delegates" className="btn-outline">
              {t('common.delegateInfo')}
            </Link>
          </div>
        </div>
      </section>

      {/* BOARD */}
      <section className="border-y border-white/10 bg-transparent py-24">
        <div className="container-x">
          <SectionHeading eyebrow={t('common.execBoard')} title={t('home.board.title')} />
          <div className="mt-12">
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
              <div className="mt-10 text-center">
                <Link to="/board" className="btn-outline">
                  {t('board.full')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-transparent py-24">
        <div className="container-x max-w-3xl">
          <SectionHeading eyebrow={t('common.faq')} title={t('home.faq.title')} center />
          <div className="mt-12">
            <FaqList items={faqs.data.slice(0, 6)} />
            <div className="mt-10 text-center">
              <Link to="/faq" className="btn-outline">
                {t('home.faq.all')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="border-t border-white/10 bg-transparent py-24 text-white">
        <div className="container-x text-center">
          <h2 className="text-3xl font-bold font-serif sm:text-5xl">{t('home.cta.title')}</h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-navy-200 leading-relaxed sm:text-lg">{t('home.cta.text')}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
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

