import Reveal from './Reveal.jsx';
import { useI18n } from '../lib/i18n.jsx';

/** Navy banner at the top of inner pages. */
export function PageHero({ eyebrow, title, intro }) {
  return (
    <section className="hero-bg text-white">
      <div className="container-x py-16 sm:py-20">
        {eyebrow && <p className="eyebrow !text-gold-400">{eyebrow}</p>}
        <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">{title}</h1>
        {intro && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-navy-100">{intro}</p>}
      </div>
    </section>
  );
}

export function SectionHeading({ eyebrow, title, intro, center = false }) {
  return (
    <Reveal className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="mt-2 text-3xl font-bold leading-tight text-navy-950 sm:text-4xl">{title}</h2>
      <div className={`mt-4 h-1 w-14 rounded bg-gold-500 ${center ? 'mx-auto' : ''}`} />
      {intro && <p className="mt-5 text-lg leading-relaxed text-navy-700">{intro}</p>}
    </Reveal>
  );
}

export function EmptyState({ title, text }) {
  return (
    <div className="rounded-2xl border border-dashed border-navy-200 bg-navy-50/50 px-6 py-12 text-center">
      <p className="font-serif text-xl font-semibold text-navy-900">{title}</p>
      {text && <p className="mx-auto mt-2 max-w-md text-navy-600">{text}</p>}
    </div>
  );
}

export function Spinner() {
  const { t } = useI18n();
  return (
    <div className="flex justify-center py-12" role="status" aria-label={t('common.loading')}>
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-navy-100 border-t-gold-500" />
    </div>
  );
}

/** Accordion list of questions. */
export function FaqList({ items }) {
  const { tr } = useI18n();
  return (
    <div className="divide-y divide-navy-100 rounded-2xl border border-navy-100 bg-white shadow-soft">
      {items.map((f) => (
        <details key={f.id} className="group px-5 py-4 sm:px-6">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-navy-900">
            <span>{tr(f, 'question')}</span>
            <span
              aria-hidden="true"
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-navy-200 text-lg leading-none text-gold-600 transition group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="mt-3 whitespace-pre-line leading-relaxed text-navy-700">{tr(f, 'answer')}</p>
        </details>
      ))}
    </div>
  );
}
