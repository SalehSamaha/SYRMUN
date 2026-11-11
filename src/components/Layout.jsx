import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import ArchitecturalBackground from './ArchitecturalBackground.jsx';
import { scrollToTop, startSmoothScroll } from '../lib/smoothScroll.js';
import Logo from './Logo.jsx';
import { useSettings } from '../lib/content.jsx';
import { useI18n } from '../lib/i18n.jsx';
import { isConfigured } from '../lib/supabase.js';
import { safeUrl } from '../lib/util.js';

const NAV = [
  ['/about', 'nav.about'],
  ['/committees', 'nav.committees'],
  ['/board', 'nav.board'],
  ['/delegates', 'nav.delegates'],
  ['/staff', 'nav.staff'],
  ['/sponsors', 'nav.sponsors'],
  ['/contact', 'nav.contact'],
];

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    scrollToTop();
  }, [pathname]);
  return null;
}

function LangButton({ className = '' }) {
  const { t, toggle, lang } = useI18n();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t('lang.switchAria')}
      lang={lang === 'ar' ? 'en' : 'ar'}
      className={`rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-sky-300 hover:bg-white/10 hover:text-sky-200 ${className}`}
    >
      {t('lang.switchLabel')}
    </button>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { t } = useI18n();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open, handle Escape key
  useEffect(() => {
    if (open) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      const onKeyDown = (e) => {
        if (e.key === 'Escape') setOpen(false);
      };
      window.addEventListener('keydown', onKeyDown);
      return () => {
        document.body.style.overflow = prevOverflow;
        window.removeEventListener('keydown', onKeyDown);
      };
    }
    document.body.style.overflow = '';
  }, [open]);

  const link = ({ isActive }) =>
    `min-h-[44px] flex items-center rounded-full px-3 py-2 text-sm font-medium transition ${
      isActive ? 'text-sky-300 font-semibold' : 'text-navy-100 hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#02143b]/85 backdrop-blur-md text-white">
      <div className="container-x flex h-16 items-center justify-between gap-2">
        <Link to="/" aria-label={t('nav.home')} className="min-h-[44px] flex items-center focus:outline-none">
          <Logo size={36} className="sm:scale-100" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label={t('nav.main')}>
          {NAV.map(([to, key]) => (
            <NavLink key={to} to={to} className={link}>
              {t(key)}
            </NavLink>
          ))}
          <LangButton className="ms-2 !min-h-[40px] !px-3.5 !py-2" />
          <Link to="/register" className="btn-gold ms-2 !min-h-[40px] !px-5 !py-2">
            {t('nav.register')}
          </Link>
        </nav>

        {/* Mobile Header Controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <LangButton className="!min-h-[44px] !px-3 !py-2 text-xs sm:text-sm font-semibold" />
          <button
            type="button"
            className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-white/20 bg-white/5 active:bg-white/15 text-white transition hover:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
            aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative flex h-3.5 w-5 flex-col justify-between" aria-hidden="true">
              <span className={`block h-0.5 w-full bg-white transition-all duration-300 ${open ? 'translate-y-[6px] rotate-45' : ''}`} />
              <span className={`block h-0.5 w-full bg-white transition-opacity duration-200 ${open ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`block h-0.5 w-full bg-white transition-all duration-300 ${open ? '-translate-y-[6px] -rotate-45' : ''}`} />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Full-screen Drawer */}
      {open && (
        <div
          id="mobile-navigation"
          className="h-[calc(100dvh-4rem)] w-full overflow-y-auto bg-[#02143b]/98 backdrop-blur-2xl border-t border-white/10 lg:hidden flex flex-col justify-between"
          aria-label={t('nav.mobile')}
          role="dialog"
          aria-modal="true"
        >
          <div className="container-x flex flex-col py-3">
            <nav className="flex flex-col divide-y divide-white/10" aria-label={t('nav.mobile')}>
              {NAV.map(([to, key]) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `min-h-[50px] flex items-center justify-between py-3.5 text-base sm:text-lg font-medium transition active:bg-white/5 ${
                      isActive ? 'text-sky-300 font-bold' : 'text-navy-100 hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span>{t(key)}</span>
                      {isActive ? (
                        <span className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
                      ) : (
                        <span className="text-white/30 text-sm">→</span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="container-x border-t border-white/10 py-5 bg-[#02102f]/80 backdrop-blur-md">
            <div className="flex flex-col gap-3">
              <Link
                to="/register"
                onClick={() => setOpen(false)}
                className="btn-gold w-full min-h-[48px] py-3.5 text-center text-base font-bold shadow-lg"
              >
                {t('nav.registerLong')}
              </Link>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-navy-300">SYRMUN 2027 · Damascus</span>
                <Link
                  to="/faq"
                  onClick={() => setOpen(false)}
                  className="text-xs font-semibold text-sky-300 hover:text-white underline decoration-sky-400 underline-offset-4"
                >
                  {t('nav.faq')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function Footer() {
  const { settings } = useSettings();
  const { t, st } = useI18n();
  const socials = [
    ['Instagram', settings.instagram_url],
    ['TikTok', settings.tiktok_url],
    ['X', settings.x_url],
    ['LinkedIn', settings.linkedin_url],
    ['YouTube', settings.youtube_url],
  ].filter(([, url]) => safeUrl(url));

  return (
    <footer className="footer-glass relative z-10 text-navy-100">
      <div className="container-x grid gap-8 sm:gap-10 py-10 sm:py-14 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
        <div className="sm:col-span-2">
          <Logo size={40} className="text-white" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-navy-200">
            {t('footer.about', { venue: st('venue_text'), dates: st('conference_dates_text') })}
          </p>
          {socials.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {socials.map(([name, url]) => (
                <a
                  key={name}
                  href={safeUrl(url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[38px] items-center rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs sm:text-sm transition hover:border-sky-300 hover:text-sky-200"
                >
                  {name}
                </a>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="font-sans text-xs font-semibold uppercase tracking-widest text-sky-300">{t('footer.explore')}</h2>
          <ul className="mt-3 sm:mt-4 grid grid-cols-2 gap-y-1.5 gap-x-3 sm:block sm:space-y-2.5 text-xs sm:text-sm">
            {[...NAV, ['/faq', 'nav.faq'], ['/register', 'nav.register']].map(([to, key]) => (
              <li key={to}>
                <Link to={to} className="inline-block min-h-[32px] py-1 transition hover:text-sky-300">
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-sans text-xs font-semibold uppercase tracking-widest text-sky-300">{t('footer.contact')}</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li className="leading-relaxed">{st('venue_text')}</li>
            {settings.contact_email && (
              <li>
                <a href={`mailto:${settings.contact_email}`} className="ltr-text break-all transition hover:text-sky-300">
                  {settings.contact_email}
                </a>
              </li>
            )}
            <li>
              <Link to="/privacy" className="inline-block min-h-[32px] py-1 transition hover:text-sky-300">
                {t('footer.privacy')}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-navy-300">
        {t('footer.copy', { year: new Date().getFullYear() })}
      </div>
    </footer>
  );
}

export default function Layout() {
  const { t, dir, lang } = useI18n();
  useEffect(() => startSmoothScroll(), []);
  return (
    <div className="relative flex min-h-screen flex-col bg-transparent text-white selection:bg-sky-500 selection:text-navy-950" dir={dir} lang={lang}>
      <ArchitecturalBackground />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:start-3 focus:top-3 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-navy-950"
      >
        {t('layout.skip')}
      </a>
      <ScrollToTop />
      {!isConfigured && (
        <div className="border-b border-sky-400/20 bg-sky-500/15 px-4 py-2 text-center text-xs font-semibold text-sky-200 backdrop-blur-sm">
          {t('layout.preview')}
        </div>
      )}
      <Header />
      <main id="main" className="relative z-10 flex-1 bg-transparent">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

