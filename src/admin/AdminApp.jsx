import { useEffect, useState } from 'react';
import { Link, NavLink, Navigate, Outlet, Route, Routes, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';
import { CONTENT } from './config.js';
import ApplicationsManager from './ApplicationsManager.jsx';
import ContentManager from './ContentManager.jsx';
import SettingsManager from './SettingsManager.jsx';

function Centered({ children }) {
  return (
    <div className="grid min-h-screen place-items-center bg-navy-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-navy-100 bg-white p-8 shadow-soft">{children}</div>
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (err) setError('Incorrect email or password.');
  }

  return (
    <Centered>
      <img src="/logo.png" alt="" width="48" height="48" />
      <h1 className="mt-4 text-2xl font-bold text-navy-950">SYRMUN admin</h1>
      <p className="mt-1 text-sm text-navy-600">Sign in with your organiser account.</p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="a_email" className="label">
            Email
          </label>
          <input id="a_email" type="email" autoComplete="username" className="field" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="a_pw" className="label">
            Password
          </label>
          <input id="a_pw" type="password" autoComplete="current-password" className="field" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
            {error}
          </p>
        )}
        <button type="submit" className="btn-navy w-full" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <Link to="/" className="mt-6 block text-center text-sm text-navy-600 underline">
        ← Back to the website
      </Link>
    </Centered>
  );
}

function AdminGate({ children }) {
  const [session, setSession] = useState(undefined); // undefined = still loading
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    // Keep the admin panel out of search engines.
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    document.title = 'Admin · SYRMUN';
    return () => meta.remove();
  }, []);

  useEffect(() => {
    if (!supabase) return undefined;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!supabase || !session) {
      setIsAdmin(null);
      return undefined;
    }
    let off = false;
    supabase
      .from('admins')
      .select('user_id')
      .eq('user_id', session.user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!off) setIsAdmin(Boolean(data));
      });
    return () => {
      off = true;
    };
  }, [session]);

  if (!supabase) {
    return (
      <Centered>
        <h1 className="text-xl font-bold text-navy-950">Database not connected</h1>
        <p className="mt-2 text-sm text-navy-700">
          The admin panel needs Supabase. Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> (see README) and reload.
        </p>
      </Centered>
    );
  }
  if (session === undefined) return <Centered>Loading…</Centered>;
  if (!session) return <Login />;
  if (isAdmin === null) return <Centered>Checking access…</Centered>;
  if (!isAdmin) {
    return (
      <Centered>
        <h1 className="text-xl font-bold text-navy-950">No access</h1>
        <p className="mt-2 text-sm text-navy-700">
          You are signed in as <strong>{session.user.email}</strong>, but this account is not an organiser. Ask an existing admin to add you
          (see <code>supabase/make_admin.sql</code>).
        </p>
        <button type="button" className="btn-navy mt-5" onClick={() => supabase.auth.signOut()}>
          Sign out
        </button>
      </Centered>
    );
  }
  return children({ email: session.user.email });
}

function AdminLayout({ email }) {
  const link = ({ isActive }) =>
    `whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-gold-500 text-navy-950' : 'text-navy-100 hover:bg-white/10'}`;
  return (
    <div className="min-h-screen bg-navy-50/60">
      <header className="bg-navy-950 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="" width="32" height="32" />
            <span className="font-serif text-lg font-bold">SYRMUN admin</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Link to="/" target="_blank" className="text-navy-200 hover:text-white">
              View site ↗
            </Link>
            <span className="hidden text-navy-300 sm:inline">{email}</span>
            <button type="button" className="rounded-lg border border-white/30 px-3 py-1.5 hover:border-gold-400" onClick={() => supabase.auth.signOut()}>
              Sign out
            </button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 pb-3" aria-label="Admin">
          <NavLink to="/admin/applications" className={link}>
            Delegates
          </NavLink>
          <NavLink to="/admin/staff-applications" className={link}>
            Staff applicants
          </NavLink>
          <span className="mx-2 w-px self-stretch bg-white/15" aria-hidden="true" />
          {Object.entries(CONTENT).map(([table, cfg]) => (
            <NavLink key={table} to={`/admin/content/${table}`} className={link}>
              {cfg.title}
            </NavLink>
          ))}
          <span className="mx-2 w-px self-stretch bg-white/15" aria-hidden="true" />
          <NavLink to="/admin/settings" className={link}>
            Settings & fees
          </NavLink>
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

function ContentRoute() {
  const { table } = useParams();
  const config = CONTENT[table];
  if (!config) return <p>Unknown section.</p>;
  return <ContentManager key={table} table={table} config={config} />;
}

export default function AdminApp() {
  return (
    <AdminGate>
      {({ email }) => (
        <Routes>
          <Route element={<AdminLayout email={email} />}>
            <Route index element={<Navigate to="applications" replace />} />
            <Route path="applications" element={<ApplicationsManager key="d" kind="delegate" />} />
            <Route path="staff-applications" element={<ApplicationsManager key="s" kind="staff" />} />
            <Route path="content/:table" element={<ContentRoute />} />
            <Route path="settings" element={<SettingsManager />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
        </Routes>
      )}
    </AdminGate>
  );
}
