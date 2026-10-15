import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import Logo from './Logo.jsx';
import { useSettings } from '../lib/content.jsx';
import { isConfigured } from '../lib/supabase.js';
import { safeUrl } from '../lib/util.js';

const NAV = [
  ['/about', 'About'],
  ['/committees', 'Committees'],
  ['/board', 'Executive Board'],
  ['/delegates', 'Delegates'],
  ['/staff', 'Join the Team'],
  ['/sponsors', 'Sponsors'],
  ['/contact', 'Contact'],
];

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  const link = ({ isActive }) =>
    `rounded-full px-3 py-2 text-sm font-medium transition ${
      isActive ? 'text-gold-300' : 'text-navy-100 hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-navy-950/95 text-white backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between">
        <Link to="/" aria-label="SYRMUN 2027 home">
          <Logo size={36} />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV.map(([to, label]) => (
            <NavLink key={to} to={to} className={link}>
              {label}
            </NavLink>
          ))}
          <Link to="/register" className="btn-gold ml-3 !px-5 !py-2">
            Register
          </Link>
        </nav>

        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-lg border border-white/20 lg:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-3.5 w-5">
            <span className={`absolute left-0 h-0.5 w-5 bg-white transition ${open ? 'top-1.5 rotate-45' : 'top-0'}`} />
            <span className={`absolute left-0 top-1.5 h-0.5 w-5 bg-white transition ${open ? 'opacity-0' : ''}`} />
            <span className={`absolute left-0 h-0.5 w-5 bg-white transition ${open ? 'top-1.5 -rotate-45' : 'top-3'}`} />
          </span>
        </button>
      </div>

      {open && (
        <nav className="border-t border-white/10 bg-navy-950 lg:hidden" aria-label="Mobile">
          <div className="container-x flex flex-col py-3">
            {NAV.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `border-b border-white/5 py-3 text-base font-medium ${isActive ? 'text-gold-300' : 'text-navy-100'}`
                }
              >
                {label}
              </NavLink>
            ))}
            <Link to="/register" className="btn-gold my-4">
              Register as a delegate
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}

function Footer() {
  const { settings } = useSettings();
  const socials = [
    ['Instagram', settings.instagram_url],
    ['TikTok', settings.tiktok_url],
    ['X', settings.x_url],
    ['LinkedIn', settings.linkedin_url],
    ['YouTube', settings.youtube_url],
  ].filter(([, url]) => safeUrl(url));

  return (
    <footer className="bg-navy-950 text-navy-100">
      <div className="container-x grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo size={44} className="text-white" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-navy-200">
            Syria Model United Nations — a two-day conference in {settings.venue_text}, {settings.conference_dates_text}.
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
          <h2 className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-400">Explore</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {[...NAV, ['/faq', 'FAQ'], ['/register', 'Register']].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="transition hover:text-gold-300">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-400">Contact</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>{settings.venue_text}</li>
            {settings.contact_email && (
              <li>
                <a href={`mailto:${settings.contact_email}`} className="break-all transition hover:text-gold-300">
                  {settings.contact_email}
                </a>
              </li>
            )}
            <li>
              <Link to="/privacy" className="transition hover:text-gold-300">
                Privacy
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-navy-300">
        © {new Date().getFullYear()} SYRMUN. SYRMUN is an independent Model United Nations conference and is not affiliated with the United Nations.
      </div>
    </footer>
  );
}

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded focus:bg-gold-500 focus:px-4 focus:py-2 focus:text-navy-950"
      >
        Skip to content
      </a>
      <ScrollToTop />
      {!isConfigured && (
        <div className="bg-gold-500 px-4 py-2 text-center text-xs font-semibold text-navy-950">
          Preview mode — no database connected, sample content is shown and nothing is saved.
        </div>
      )}
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
