import { PageHero } from '../components/ui.jsx';
import { useSettings } from '../lib/content.jsx';
import { useI18n } from '../lib/i18n.jsx';
import { usePageMeta } from '../lib/util.js';

// NOTE FOR THE TEAM: this is a plain-language starting point, not legal advice.
// Review it (especially the retention paragraph) before launch. Arabic text should be reviewed by a native speaker too.

export default function Privacy() {
  const { settings } = useSettings();
  const { t } = useI18n();
  usePageMeta(t('pv.eyebrow'), t('pv.meta'));

  return (
    <>
      <PageHero eyebrow={t('pv.eyebrow')} title={t('pv.title')} />
      <section className="bg-transparent py-10 sm:py-16 md:py-20 text-white">
        <div className="container-x max-w-3xl space-y-6 sm:space-y-8 leading-relaxed text-navy-100 rounded-3xl border border-white/10 bg-[#021742]/35 backdrop-blur-sm p-5 sm:p-8 md:p-12 shadow-soft">
          {[1, 2, 3, 4].map((n) => (
            <div key={n}>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-white">{t(`pv.${n}.t`)}</h2>
              <p className="mt-2 text-sm sm:text-base text-navy-200">{t(`pv.${n}.d`)}</p>
            </div>
          ))}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-white">{t('pv.5.t')}</h2>
            <p className="mt-2 text-sm sm:text-base text-navy-200">
              {t('pv.5.d')}{' '}
              {settings.contact_email ? (
                <>
                  {t('pv.5.email')}{' '}
                  <a href={`mailto:${settings.contact_email}`} className="ltr-text font-semibold text-sky-300 underline decoration-sky-400 underline-offset-2">
                    {settings.contact_email}
                  </a>
                  .
                </>
              ) : (
                t('pv.5.page')
              )}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
