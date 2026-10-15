import { Link } from 'react-router-dom';
import Countdown from '../components/Countdown.jsx';
import Reveal from '../components/Reveal.jsx';
import BoardCard from '../components/BoardCard.jsx';
import { EmptyState, FaqList, SectionHeading } from '../components/ui.jsx';
import { useRows, useSettings } from '../lib/content.jsx';
import { getRegistrationState } from '../lib/fees.js';
import { lines, usePageMeta } from '../lib/util.js';

const WHY = [
  ['Build real skills', 'Public speaking, negotiation, research and writing — practised in a real committee setting.'],
  ['Welcoming to beginners', 'First conference? You are exactly who we are designing SYRMUN for.'],
  ['Affordable', 'We are keeping fees low so that cost is not the reason someone misses out.'],
  ['Professional', 'Committees run by an Executive Board with clear rules of procedure.'],
];

const EXPERIENCE = [
  ['Two days of committee sessions', 'Formal debate, informal negotiation and resolution drafting.'],
  ['Prepared with you', 'Background guides and a Delegate Handbook so you arrive ready.'],
  ['Meet your fellow delegates', 'Around 40–60 delegates in one room, working on shared problems.'],
  ['In Damascus', 'A two-day conference held in Damascus, Syria, in June 2027.'],
];

export default function Home() {
  const { settings } = useSettings();
  const committees = useRows('committees');
  const board = useRows('board_members');
  const faqs = useRows('faqs');
  const news = useRows('announcements', { orderBy: 'created_at', ascending: false });
  const reg = getRegistrationState(settings);

  usePageMeta(
    null,
    'SYRMUN 2027 is a two-day Model United Nations conference in Damascus, Syria, in June 2027. An affordable, welcoming and professional MUN experience.',
  );

  const ctaLabel =
    reg.state === 'open' ? 'Register as a delegate' : reg.state === 'closed' ? 'Registration closed' : 'Registration opening soon';

  return (
    <>
      {/* HERO */}
      <section className="hero-bg text-white">
        <div className="container-x py-20 sm:py-28">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded-full border border-gold-500/50 bg-gold-500/10 px-4 py-1.5 font-medium text-gold-300">
              {settings.venue_text}
            </span>
            <span className="rounded-full border border-white/20 px-4 py-1.5 text-navy-100">{settings.conference_dates_text}</span>
          </div>
          <img src="/logo.svg" alt="" width="72" height="72" className="mt-8 h-16 w-16 sm:h-[72px] sm:w-[72px]" />
          <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] sm:text-7xl">
            SYRMUN <span className="text-gold-400">2027</span>
          </h1>
          <p className="mt-2 font-serif text-xl text-navy-100 sm:text-2xl">Syria Model United Nations</p>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-navy-100">
            A two-day Model United Nations conference bringing together around 40–60 delegates to debate, negotiate and
            collaborate. {settings.tagline}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/register" className="btn-gold">
              {ctaLabel}
            </Link>
            <Link to="/about" className="btn-outline">
              Learn about SYRMUN
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
            <p className="eyebrow">Latest announcements</p>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {news.data.slice(0, 3).map((a) => (
                <Reveal key={a.id}>
                  <article className="h-full rounded-xl bg-white p-5 shadow-soft">
                    <time className="text-xs font-semibold uppercase tracking-wide text-navy-500">
                      {a.created_at ? new Date(a.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                    </time>
                    <h3 className="mt-1 text-lg font-bold text-navy-950">{a.title}</h3>
                    {a.body && <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-navy-700">{a.body}</p>}
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
          <SectionHeading
            eyebrow="What is SYRMUN?"
            title="A first conference built to be welcoming, professional and affordable"
            intro="SYRMUN — the Syria Model United Nations — is a Model UN conference in Damascus. Delegates take on the roles of diplomats, research real issues and work together to find solutions, guided by an experienced Executive Board."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map(([title, text], i) => (
              <Reveal key={title} delay={i * 80}>
                <div className="card h-full border-t-4 border-t-gold-500">
                  <h3 className="text-lg font-bold text-navy-950">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy-700">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* COMMITTEES */}
      <section className="bg-navy-50 py-20">
        <div className="container-x">
          <SectionHeading eyebrow="Committees" title="Where the debate happens" />
          <div className="mt-10">
            {committees.data.length === 0 ? (
              <EmptyState
                title="Committees will be announced soon"
                text="We are finalising the committees and topics. Check back here, or follow us on social media for the announcement."
              />
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
                      <h3 className="mt-3 text-xl font-bold text-navy-950">{c.name}</h3>
                      {lines(c.topics)[0] && <p className="mt-2 text-sm text-navy-700">{lines(c.topics)[0]}</p>}
                      <span className="mt-4 inline-block text-sm font-semibold text-gold-700">View committee →</span>
                    </Link>
                  </Reveal>
                ))}
              </div>
            )}
            {committees.data.length > 0 && (
              <div className="mt-8 text-center">
                <Link to="/committees" className="btn-navy">
                  All committees
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="py-20">
        <div className="container-x">
          <SectionHeading eyebrow="The experience" title="What delegates can expect" center />
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {EXPERIENCE.map(([title, text], i) => (
              <Reveal key={title} delay={i * 70}>
                <div className="flex gap-4 rounded-2xl border border-navy-100 p-6">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-navy-900 font-serif font-bold text-gold-300">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-navy-950">{title}</h3>
                    <p className="mt-1 text-navy-700">{text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/delegates" className="btn-outline-dark">
              Delegate information
            </Link>
          </div>
        </div>
      </section>

      {/* BOARD */}
      <section className="bg-navy-50 py-20">
        <div className="container-x">
          <SectionHeading eyebrow="Executive Board" title="Meet the team running SYRMUN" />
          <div className="mt-10">
            {board.data.length === 0 ? (
              <EmptyState title="Executive Board to be announced" text="We will introduce the team here soon." />
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
                  Full Executive Board
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container-x max-w-3xl">
          <SectionHeading eyebrow="FAQ" title="Frequently asked questions" center />
          <div className="mt-10">
            <FaqList items={faqs.data.slice(0, 6)} />
            <div className="mt-8 text-center">
              <Link to="/faq" className="btn-outline-dark">
                See all questions
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-bg py-16 text-white">
        <div className="container-x text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Ready to be part of SYRMUN 2027?</h2>
          <p className="mx-auto mt-3 max-w-xl text-navy-100">
            Register as a delegate, or apply to join the organising team.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/register" className="btn-gold">
              {ctaLabel}
            </Link>
            <Link to="/staff" className="btn-outline">
              Join the team
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
