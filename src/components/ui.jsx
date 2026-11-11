import Reveal from './Reveal.jsx';
import { useI18n } from '../lib/i18n.jsx';
import { Ornament } from './art.jsx';

/** Editorial banner at the top of inner pages with subtle glass scrim. */
export function PageHero({ eyebrow, title, intro }) {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#021742]/20 backdrop-blur-sm text-white">
      <div className="container-x relative z-10 py-7 sm:py-16 md:py-20">
        {eyebrow && <p className="eyebrow !text-sky-300">{eyebrow}</p>}
        <h1 className="mt-2.5 sm:mt-3 max-w-3xl text-2xl xs:text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">{title}</h1>
        {intro && <p className="mt-2 sm:mt-5 max-w-2xl text-xs sm:text-lg leading-relaxed text-navy-100">{intro}</p>}
      </div>
    </section>
  );
}

export function SectionHeading({ eyebrow, title, intro, center = false }) {
  return (
    <Reveal className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="mt-1.5 sm:mt-2 text-xl sm:text-3xl md:text-4xl font-bold leading-tight text-white">{title}</h2>
      <Ornament center={center} className="!mt-2 sm:!mt-4" />
      {intro && <p className="mt-2 sm:mt-5 text-xs sm:text-lg leading-relaxed text-navy-200">{intro}</p>}
    </Reveal>
  );
}

export function EmptyState({ title, text }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/15 bg-[#021742]/30 backdrop-blur-sm px-4 py-8 sm:px-6 sm:py-12 text-center">
      <p className="font-serif text-lg sm:text-xl font-semibold text-white">{title}</p>
      {text && <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm text-navy-200">{text}</p>}
    </div>
  );
}

export function Spinner() {
  const { t } = useI18n();
  return (
    <div className="flex justify-center py-8 sm:py-12" role="status" aria-label={t('common.loading')}>
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-sky-400" />
    </div>
  );
}

/** Accordion list of questions with refined glass cards and touch-friendly header. */
export function FaqList({ items }) {
  const { tr } = useI18n();
  return (
    <div className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-[#021742]/35 backdrop-blur-sm shadow-soft">
      {items.map((f) => (
        <details key={f.id} className="group px-4 py-3.5 sm:px-6 sm:py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 sm:gap-4 font-semibold text-white min-h-[44px]">
            <span className="text-sm sm:text-base">{tr(f, 'question')}</span>
            <span
              aria-hidden="true"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/20 bg-white/5 text-lg leading-none text-sky-300 transition group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="mt-2.5 whitespace-pre-line text-xs sm:text-sm leading-relaxed text-navy-200">{tr(f, 'answer')}</p>
        </details>
      ))}
    </div>
  );
}

