import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal.jsx';
import { PageHero } from '../components/ui.jsx';
import { useSettings } from '../lib/content.jsx';
import { lines, usePageMeta } from '../lib/util.js';

export default function About() {
  const { settings } = useSettings();
  usePageMeta('About', 'The purpose, vision, mission and goals of SYRMUN, the Syria Model United Nations.');

  return (
    <>
      <PageHero
        eyebrow="About SYRMUN"
        title="An affordable, welcoming and memorable MUN experience"
        intro="SYRMUN is the Syria Model United Nations — a two-day conference in Damascus, designed to be professional enough for experienced delegates and welcoming enough for people attending their first."
      />

      <section className="py-16">
        <div className="container-x grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="card h-full border-t-4 border-t-gold-500">
              <p className="eyebrow">Our mission</p>
              <p className="mt-3 text-lg leading-relaxed text-navy-800">{settings.about_mission}</p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="card h-full border-t-4 border-t-navy-900">
              <p className="eyebrow">Our vision</p>
              <p className="mt-3 text-lg leading-relaxed text-navy-800">{settings.about_vision}</p>
            </div>
          </Reveal>
        </div>

        <div className="container-x mt-14">
          <Reveal>
            <p className="eyebrow">Our goals</p>
            <h2 className="mt-2 text-3xl font-bold text-navy-950">What we are working towards</h2>
            <div className="mt-4 h-1 w-14 rounded bg-gold-500" />
          </Reveal>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {lines(settings.about_goals).map((goal, i) => (
              <Reveal key={goal} delay={i * 60}>
                <li className="flex gap-4 rounded-2xl border border-navy-100 p-5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold-500 font-serif font-bold text-navy-950">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed text-navy-800">{goal}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>

        <div className="container-x mt-16">
          <div className="hero-bg rounded-3xl px-6 py-12 text-center text-white sm:px-12">
            <h2 className="text-3xl font-bold">Take part in the first SYRMUN</h2>
            <p className="mx-auto mt-3 max-w-xl text-navy-100">
              Whether you are a seasoned delegate or this is your very first conference, there is a place for you.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/register" className="btn-gold">
                Register as a delegate
              </Link>
              <Link to="/delegates" className="btn-outline">
                Delegate information
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
