import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal.jsx';
import { PageHero } from '../components/ui.jsx';
import { useSettings } from '../lib/content.jsx';
import { useI18n } from '../lib/i18n.jsx';
import { safeUrl, usePageMeta } from '../lib/util.js';

export default function Contact() {
  const { settings } = useSettings();
  const { t } = useI18n();
  usePageMeta(t('nav.contact'), t('ct.meta'));

  const socials = [
    ['Instagram', settings.instagram_url],
    ['TikTok', settings.tiktok_url],
    ['X', settings.x_url],
    ['LinkedIn', settings.linkedin_url],
    ['YouTube', settings.youtube_url],
  ].filter(([, url]) => safeUrl(url));

  return (
    <>
      <PageHero eyebrow={t('nav.contact')} title={t('ct.title')} intro={t('ct.intro')} />
      <section className="py-16">
        <div className="container-x grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="card h-full">
              <p className="eyebrow">{t('ct.email')}</p>
              {settings.contact_email ? (
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="ltr-text mt-3 block break-all font-serif text-2xl font-bold text-navy-950 underline decoration-gold-500 underline-offset-4"
                >
                  {settings.contact_email}
                </a>
              ) : (
                <p className="mt-3 text-navy-700">{t('ct.noEmail')}</p>
              )}
              <p className="mt-4 text-sm text-navy-600">{t('ct.reply')}</p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="card h-full">
              <p className="eyebrow">{t('ct.follow')}</p>
              {socials.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-3">
                  {socials.map(([name, url]) => (
                    <a key={name} href={safeUrl(url)} target="_blank" rel="noopener noreferrer" className="btn-navy">
                      {name}
                    </a>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-navy-700">{t('ct.noSocial')}</p>
              )}
              <p className="mt-4 text-sm text-navy-600">{t('ct.announce')}</p>
            </div>
          </Reveal>

          <Reveal className="md:col-span-2">
            <div className="rounded-2xl bg-navy-50 p-8 text-center">
              <h2 className="text-2xl font-bold text-navy-950">{t('ct.quick.t')}</h2>
              <p className="mt-2 text-navy-700">{t('ct.quick.d')}</p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <Link to="/faq" className="btn-navy">
                  {t('common.faq')}
                </Link>
                <Link to="/delegates" className="btn-outline-dark">
                  {t('common.delegateInfo')}
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
