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
      <section className="py-14">
        <div className="container-x max-w-3xl space-y-8 leading-relaxed text-navy-800">
          {[1, 2, 3, 4].map((n) => (
            <div key={n}>
              <h2 className="text-2xl font-bold text-navy-950">{t(`pv.${n}.t`)}</h2>
              <p className="mt-2">{t(`pv.${n}.d`)}</p>
            </div>
          ))}
          <div>
            <h2 className="text-2xl font-bold text-navy-950">{t('pv.5.t')}</h2>
            <p className="mt-2">
              {t('pv.5.d')}{' '}
              {settings.contact_email ? (
                <>
                  {t('pv.5.email')}{' '}
                  <a href={`mailto:${settings.contact_email}`} className="ltr-text font-semibold underline decoration-gold-500 underline-offset-2">
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
