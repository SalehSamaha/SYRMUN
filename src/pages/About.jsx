import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal.jsx';
import { PageHero } from '../components/ui.jsx';
import { useI18n } from '../lib/i18n.jsx';
import { lines, usePageMeta } from '../lib/util.js';

export default function About() {
  const { t, st } = useI18n();
  usePageMeta(t('nav.about'), t('about.meta'));

  return (
    <>
      <PageHero eyebrow={t('about.eyebrow')} title={t('about.title')} intro={t('about.intro')} />

      <section className="bg-transparent py-20 text-white">
        <div className="container-x grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="card h-full rounded-2xl border border-white/10 bg-[#021742]/35 backdrop-blur-sm p-6 shadow-soft">
              <p className="eyebrow">{t('about.mission')}</p>
              <p className="mt-3 text-lg leading-relaxed text-navy-100">{st('about_mission')}</p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="card h-full rounded-2xl border border-white/10 bg-[#021742]/35 backdrop-blur-sm p-6 shadow-soft">
              <p className="eyebrow">{t('about.vision')}</p>
              <p className="mt-3 text-lg leading-relaxed text-navy-100">{st('about_vision')}</p>
            </div>
          </Reveal>
        </div>

        <div className="container-x mt-16">
          <Reveal>
            <p className="eyebrow">{t('about.goals.eyebrow')}</p>
            <h2 className="mt-2 text-3xl font-bold font-serif text-white sm:text-4xl">{t('about.goals.title')}</h2>
            <div className="mt-4 h-[2px] w-14 bg-gradient-to-r from-sky-400 to-white" />
          </Reveal>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {lines(st('about_goals')).map((goal, i) => (
              <Reveal key={goal} delay={i * 60}>
                <li className="flex gap-4 rounded-2xl border border-white/10 bg-[#021742]/35 backdrop-blur-sm p-5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-sky-400/30 bg-sky-400/10 font-serif font-bold text-sky-200">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed text-navy-100">{goal}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>

        <div className="container-x mt-20">
          <div className="rounded-3xl border border-white/10 bg-[#021742]/35 backdrop-blur-sm px-6 py-14 text-center text-white sm:px-12 shadow-soft">
            <h2 className="text-3xl font-bold font-serif sm:text-4xl">{t('about.cta.title')}</h2>
            <p className="mx-auto mt-3 max-w-xl text-base text-navy-200 sm:text-lg">{t('about.cta.text')}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/register" className="btn-gold">
                {t('cta.open')}
              </Link>
              <Link to="/delegates" className="btn-outline">
                {t('common.delegateInfo')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
