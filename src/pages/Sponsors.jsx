import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal.jsx';
import { EmptyState, PageHero } from '../components/ui.jsx';
import { useRows, useSettings } from '../lib/content.jsx';
import { useI18n } from '../lib/i18n.jsx';
import { safeUrl, usePageMeta } from '../lib/util.js';

function LogoCard({ item }) {
  const { t, tr } = useI18n();
  const name = tr(item, 'name');
  const logo = safeUrl(item.logo_url);
  const href = safeUrl(item.website_url);
  const inner = (
    <div className="flex h-full min-h-[8rem] flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-[#021742]/35 backdrop-blur-sm p-6 text-center shadow-soft transition hover:border-sky-400/40 hover:-translate-y-1 hover:bg-[#021742]/50">
      {logo ? (
        <img src={logo} alt={name} loading="lazy" className="max-h-20 w-auto max-w-full object-contain" />
      ) : (
        <span className="font-serif text-xl font-bold text-white">{name}</span>
      )}
      {logo && <span className="text-sm font-semibold text-navy-200">{name}</span>}
    </div>
  );
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={t('sp.newTab', { name })}>
      {inner}
    </a>
  ) : (
    inner
  );
}

function Group({ title, items }) {
  if (items.length === 0) return null;
  return (
    <div className="mt-14">
      <Reveal>
        <h2 className="text-2xl font-bold font-serif text-white">{title}</h2>
        <div className="mt-3 h-[2px] w-10 bg-gradient-to-r from-sky-400 to-white" />
      </Reveal>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((s) => (
          <Reveal key={s.id}>
            <LogoCard item={s} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export default function Sponsors() {
  const { settings } = useSettings();
  const { t } = useI18n();
  const { data } = useRows('sponsors');
  usePageMeta(t('sp.eyebrow'), t('sp.meta'));

  const sponsors = data.filter((d) => d.kind === 'sponsor');
  const partners = data.filter((d) => d.kind === 'partner');

  return (
    <>
      <PageHero eyebrow={t('sp.eyebrow')} title={t('sp.title')} intro={t('sp.intro')} />
      <section className="bg-transparent py-20 text-white">
        <div className="container-x">
          {data.length === 0 ? (
            <EmptyState title={t('sp.empty.t')} text={t('sp.empty.d')} />
          ) : (
            <>
              <Group title={t('sp.sponsors')} items={sponsors} />
              <Group title={t('sp.partners')} items={partners} />
            </>
          )}

          <Reveal className="mt-20">
            <div className="rounded-3xl border border-white/10 bg-[#021742]/35 backdrop-blur-sm px-6 py-14 text-center text-white sm:px-12 shadow-soft">
              <h2 className="text-3xl font-bold font-serif sm:text-4xl">{t('sp.cta.t')}</h2>
              <p className="mx-auto mt-3 max-w-xl text-base text-navy-200 sm:text-lg">{t('sp.cta.d')}</p>
              <div className="mt-8 flex justify-center">
                {settings.contact_email ? (
                  <a href={`mailto:${settings.contact_email}?subject=SYRMUN%20partnership`} className="btn-gold">
                    {t('sp.emailUs')} <span className="ltr-text">{settings.contact_email}</span>
                  </a>
                ) : (
                  <Link to="/contact" className="btn-gold">
                    {t('common.getInTouch')}
                  </Link>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
