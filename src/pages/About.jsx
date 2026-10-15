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

      <section className="py-16">
        <div className="container-x grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="card h-full border-t-4 border-t-gold-500">
              <p className="eyebrow">{t('about.mission')}</p>
              <p className="mt-3 text-lg leading-relaxed text-navy-800">{st('about_mission')}</p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="card h-full border-t-4 border-t-navy-900">
              <p className="eyebrow">{t('about.vision')}</p>
              <p className="mt-3 text-lg leading-relaxed text-navy-800">{st('about_vision')}</p>
            </div>
          </Reveal>
        </div>

        <div className="container-x mt-14">
          <Reveal>
            <p className="eyebrow">{t('about.goals.eyebrow')}</p>
            <h2 className="mt-2 text-3xl font-bold text-navy-950">{t('about.goals.title')}</h2>
            <div className="mt-4 h-1 w-14 rounded bg-gold-500" />
          </Reveal>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {lines(st('about_goals')).map((goal, i) => (
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
            <h2 className="text-3xl font-bold">{t('about.cta.title')}</h2>
            <p className="mx-auto mt-3 max-w-xl text-navy-100">{t('about.cta.text')}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
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
