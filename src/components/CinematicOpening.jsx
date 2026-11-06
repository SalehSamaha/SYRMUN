import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Countdown from './Countdown.jsx';
import ArchitecturalEmblem from './ArchitecturalEmblem.jsx';
import { useI18n } from '../lib/i18n.jsx';

/** Pinned, scroll-scrubbed opening. The reveal reverses naturally on scroll-up. */
export default function CinematicOpening({ settings, ctaLabel }) {
  const sectionRef = useRef(null);
  const frameRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const { t, st, lang } = useI18n();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;
    const update = () => {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(() => {
        const sectionTop = section.getBoundingClientRect().top + window.scrollY;
        const stickyHeight = Math.max(1, window.innerHeight - 64);
        const scrollRange = Math.max(1, section.offsetHeight - stickyHeight);
        setProgress(Math.min(1, Math.max(0, (window.scrollY - sectionTop) / scrollRange)));
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  const introOpacity = 1 - Math.min(1, progress / 0.32);
  const emblemOpacity = Math.min(1, Math.max(0, (progress - 0.08) / 0.25));
  const finalOpacity = Math.min(1, Math.max(0, (progress - 0.68) / 0.22));
  const stageScale = 0.82 + progress * 0.42;

  return (
    <section ref={sectionRef} className="relative h-[190svh] text-white" aria-label="SYRMUN 2027 cinematic introduction">
      <div className="sticky top-16 flex h-[calc(100svh-4rem)] min-h-[540px] items-center justify-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_48%,rgba(27,91,169,0.2),transparent_58%)]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-200/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[#030d1e]/75" />
        </div>
        <div className="container-x relative z-10 flex h-full w-full flex-col items-center justify-center text-center">
          <div
            className="absolute inset-x-0 top-[12%] flex flex-col items-center"
            style={{ opacity: introOpacity, transform: `translateY(${progress * -42}px)`, pointerEvents: progress > 0.34 ? 'none' : 'auto' }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.42em] text-sky-200/70 sm:text-xs">
              {st('venue_text')} <span className="mx-2 text-sky-300/40">/</span> {st('conference_dates_text')}
            </p>
            <h1 className="mt-8 text-6xl font-extrabold leading-none tracking-[-0.07em] sm:text-8xl md:text-[9rem]" dir="ltr">
              SYRMUN<span className="font-serif text-sky-300">.</span>
            </h1>
            <p className="mt-4 font-serif text-3xl text-white/85 sm:text-5xl">2027</p>
            <p className="mt-6 max-w-xl font-serif text-lg leading-relaxed text-sky-100/80 sm:text-2xl">{t('hero.sub')}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/register" className="btn-gold">{ctaLabel}</Link>
              <Link to="/about" className="btn-outline">{t('hero.learn')}</Link>
            </div>
            <div className="mt-8 w-56"><Countdown date={settings.conference_start} /></div>
          </div>

          <div
            className="relative flex w-full max-w-[620px] items-center justify-center"
            style={{ opacity: emblemOpacity, transform: `translate3d(0,${progress * -7}px,0) scale(${stageScale})`, transformOrigin: 'center center' }}
          >
            <ArchitecturalEmblem className="w-full" scrollProgress={progress} />
          </div>

          <div
            className="pointer-events-none absolute inset-x-0 bottom-[12%] flex flex-col items-center"
            style={{ opacity: finalOpacity, transform: `translateY(${(1 - finalOpacity) * 24}px)` }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.5em] text-sky-200/60">Riyadh · Saudi Arabia</p>
            <p className="mt-3 font-serif text-3xl tracking-wide text-white sm:text-5xl">SYRMUN 2027</p>
            <p className="mt-3 text-xs uppercase tracking-[0.35em] text-sky-100/50">
              {lang === 'ar' ? 'حيث تصنع الأصوات المستقبل' : 'Where voices shape tomorrow'}
            </p>
          </div>

          <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-3 whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.32em] text-sky-100/45">
            <span className="h-px w-8 bg-sky-200/40" />
            {lang === 'ar' ? 'مرّر لاكتشاف' : 'Scroll to reveal'}
            <span className="h-px w-8 bg-sky-200/40" />
          </div>
        </div>
      </div>
    </section>
  );
}
