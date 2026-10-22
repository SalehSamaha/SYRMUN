import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Icon } from './art.jsx';
import Logo from './Logo.jsx';
import { useSettings } from '../lib/content.jsx';
import { useI18n } from '../lib/i18n.jsx';
import { isConfigured } from '../lib/supabase.js';
import { useTheme } from '../lib/theme.jsx';
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
    window.scrollTo(0, 0);
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
      className={`rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:border-gold-400 hover:text-gold-300 ${className}`}
    >
      {t('lang.switchLabel')}
    </button>
  );
}

function ThemeButton({ className = '' }) {
  const { t } = useI18n();
  const { isDark, toggle } = useTheme();
  const label = isDark ? t('theme.toLight') : t('theme.toDark');
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={`grid h-9 w-9 place-items-center rounded-full border border-white/30 text-white transition hover:border-gold-400 hover:text-gold-300 ${className}`}
    >
      <Icon name={isDark ? 'sun' : 'moon'} className="h-[18px] w-[18px]" />
    </button>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { t } = useI18n();

  useEffect(() => setOpen(false), [pathname]);

  const link = ({ isActive }) =>
    `rounded-full px-3 py-2 text-sm font-medium transition ${
      isActive ? 'text-gold-300' : 'text-navy-100 hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-navy-950/95 text-white backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between gap-2">
        <Link to="/" aria-label={t('nav.home')}>
          <Logo size={40} />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label={t('nav.main')}>
          {NAV.map(([to, key]) => (
            <NavLink key={to} to={to} className={link}>
              {t(key)}
            </NavLink>
          ))}
          <LangButton className="ms-2 !px-3 !py-1.5" />
          <ThemeButton className="ms-1" />
          <Link to="/register" className="btn-gold ms-2 !px-5 !py-2">
            {t('nav.register')}
          </Link>
        </nav>

        <div className="flex items-center gap-1.5 lg:hidden">
          <LangButton className="!px-2.5 !py-2" />
          <ThemeButton />
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-lg border border-white/20"
            aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-3.5 w-5">
              <span className={`absolute start-0 h-0.5 w-5 bg-white transition ${open ? 'top-1.5 rotate-45' : 'top-0'}`} />
              <span className={`absolute start-0 top-1.5 h-0.5 w-5 bg-white transition ${open ? 'opacity-0' : ''}`} />
              <span className={`absolute start-0 h-0.5 w-5 bg-white transition ${open ? 'top-1.5 -rotate-45' : 'top-3'}`} />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-white/10 bg-navy-950 lg:hidden" aria-label={t('nav.mobile')}>
          <div className="container-x flex flex-col py-3">
            {NAV.map(([to, key]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `border-b border-white/5 py-3 text-base font-medium ${isActive ? 'text-gold-300' : 'text-navy-100'}`
                }
              >
                {t(key)}
              </NavLink>
            ))}
            <Link to="/register" className="btn-gold my-4">
              {t('nav.registerLong')}
            </Link>
          </div>
        </nav>
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
    <footer className="pattern-gold bg-navy-950 text-navy-100">
      <div className="container-x grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo size={44} className="text-white" />
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
                  className="rounded-full border border-white/20 px-4 py-1.5 text-sm transition hover:border-gold-400 hover:text-gold-300"
                >
                  {name}
                </a>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-400">{t('footer.explore')}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {[...NAV, ['/faq', 'nav.faq'], ['/register', 'nav.register']].map(([to, key]) => (
              <li key={to}>
                <Link to={to} className="transition hover:text-gold-300">
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-400">{t('footer.contact')}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>{st('venue_text')}</li>
            {settings.contact_email && (
              <li>
                <a href={`mailto:${settings.contact_email}`} className="ltr-text break-all transition hover:text-gold-300">
                  {settings.contact_email}
                </a>
              </li>
            )}
            <li>
              <Link to="/privacy" className="transition hover:text-gold-300">
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
  return (
    <div className="flex min-h-screen flex-col" dir={dir} lang={lang}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:start-3 focus:top-3 focus:z-50 focus:rounded focus:bg-gold-500 focus:px-4 focus:py-2 focus:text-navy-950"
      >
        {t('layout.skip')}
      </a>
      <ScrollToTop />
      {!isConfigured && (
        <div className="bg-gold-500 px-4 py-2 text-center text-xs font-semibold text-navy-950">{t('layout.preview')}</div>
      )}
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
