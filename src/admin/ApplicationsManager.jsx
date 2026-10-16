import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { formatMoney } from '../lib/fees.js';
import { dateLocale } from '../lib/translations.js';
import { useA } from './adminI18n.js';
import { AGE_LABEL, APPLICATIONS, EXP_LABEL, STATUS_LABEL, STATUS_STYLE } from './config.js';

const PHASE_LABEL = { early: 'Early bird', regular: 'Regular', late: 'Late' };

const csvCell = (v) => {
  let s = v == null ? '' : String(v);
  // Stop spreadsheet formula injection from user-submitted text.
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
};

function exportCsv(kind, rows) {
  const cols =
    kind === 'delegate'
      ? ['reference', 'created_at', 'full_name', 'email', 'institution', 'age_group', 'mun_experience', 'committee_pref_1', 'committee_pref_2', 'status', 'payment_status', 'fee_phase', 'fee_amount', 'notes', 'admin_notes']
      : ['reference', 'created_at', 'position', 'full_name', 'email', 'institution', 'age_group', 'experience', 'motivation', 'availability', 'status', 'admin_notes'];
  const out = [cols.join(',')]
    .concat(rows.map((r) => cols.map((c) => csvCell(c === 'reference' ? r.id.slice(0, 8).toUpperCase() : r[c])).join(',')))
    .join('\r\n');
  const blob = new Blob([`﻿${out}`], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `syrmun-${kind}-applications-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

function Badge({ status }) {
  const { a } = useA();
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[status] || ''}`}>{STATUS_LABEL[status] ? a(STATUS_LABEL[status]) : status}</span>;
}

function Detail({ label, children }) {
  if (!children) return null;
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-navy-500">{label}</dt>
      <dd className="mt-0.5 whitespace-pre-line break-words text-navy-900">{children}</dd>
    </div>
  );
}

function DetailPanel({ kind, cfg, row, onClose, onChanged }) {
  const { a, lang } = useA();
  const [status, setStatus] = useState(row.status);
  const [payment, setPayment] = useState(row.payment_status || 'unpaid');
  const [notes, setNotes] = useState(row.admin_notes || '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function save() {
    setBusy(true);
    setError('');
    const patch = { status, admin_notes: notes.trim() || null };
    if (cfg.payment) patch.payment_status = payment;
    const { error: err } = await supabase.from(cfg.table).update(patch).eq('id', row.id);
    setBusy(false);
    if (err) return setError(err.message);
    onChanged();
  }

  async function remove() {
    if (!window.confirm(a('Permanently delete the application from {x}? This cannot be undone.', { x: row.full_name }))) return;
    const { error: err } = await supabase.from(cfg.table).delete().eq('id', row.id);
    if (err) return setError(err.message);
    onChanged();
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-navy-950/60" role="dialog" aria-modal="true">
      <div className="h-full w-full max-w-lg overflow-y-auto bg-white p-6 shadow-soft">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-navy-950">{row.full_name}</h2>
            <p className="mt-1 font-mono text-xs text-navy-500">{a('Ref')} <span dir="ltr">{row.id.slice(0, 8).toUpperCase()}</span></p>
          </div>
          <button type="button" className="rounded-lg border border-navy-200 px-3 py-1.5 text-sm" onClick={onClose}>
            {a('Close')}
          </button>
        </div>

        <dl className="mt-6 space-y-4 text-sm">
          <Detail label={a('Email')}>
            <a className="underline" href={`mailto:${row.email}`}>
              {row.email}
            </a>
          </Detail>
          <Detail label={a('Submitted')}>{new Date(row.created_at).toLocaleString(dateLocale(lang))}</Detail>
          {kind === 'staff' && <Detail label={a('Position')}>{row.position}</Detail>}
          <Detail label={a('Institution')}>{row.institution}</Detail>
          <Detail label={a('Age group')}>{AGE_LABEL[row.age_group] ? a(AGE_LABEL[row.age_group]) : row.age_group}</Detail>
          {kind === 'delegate' ? (
            <>
              <Detail label={a('MUN experience')}>{EXP_LABEL[row.mun_experience] ? a(EXP_LABEL[row.mun_experience]) : row.mun_experience}</Detail>
              <Detail label={a('Committee preferences')}>{[row.committee_pref_1, row.committee_pref_2].filter(Boolean).join('  ›  ')}</Detail>
              <Detail label={a('Fee at time of application')}>
                {row.fee_amount != null ? `${formatMoney(Number(row.fee_amount))} (${a(PHASE_LABEL[row.fee_phase] || row.fee_phase)})` : ''}
              </Detail>
              <Detail label={a('Notes from applicant')}>{row.notes}</Detail>
            </>
          ) : (
            <>
              <Detail label={a('Experience')}>{row.experience}</Detail>
              <Detail label={a('Motivation')}>{row.motivation}</Detail>
              <Detail label={a('Availability')}>{row.availability}</Detail>
            </>
          )}
        </dl>

        <div className="mt-8 space-y-4 rounded-xl bg-navy-50 p-4">
          <div>
            <label htmlFor="st" className="label">
              {a('Status')}
            </label>
            <select id="st" className="field" value={status} onChange={(e) => setStatus(e.target.value)}>
              {cfg.statuses.map((s) => (
                <option key={s} value={s}>
                  {a(STATUS_LABEL[s])}
                </option>
              ))}
            </select>
          </div>
          {cfg.payment && (
            <div>
              <label htmlFor="pay" className="label">
                {a('Payment')}
              </label>
              <select id="pay" className="field" value={payment} onChange={(e) => setPayment(e.target.value)}>
                <option value="unpaid">{a('Unpaid')}</option>
                <option value="paid">{a('Paid')}</option>
                <option value="waived">{a('Waived')}</option>
              </select>
            </div>
          )}
          <div>
            <label htmlFor="an" className="label">
              {a('Internal notes (never shown to the applicant)')}
            </label>
            <textarea id="an" rows={4} className="field" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          {error && (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
              {error}
            </p>
          )}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button type="button" className="text-sm font-semibold text-red-700 underline" onClick={remove}>
              {a('Delete application')}
            </button>
            <button type="button" className="btn-gold" disabled={busy} onClick={save}>
              {busy ? a('Saving…') : a('Save')}
            </button>
          </div>
          <p className="text-xs text-navy-600">{a('Changing the status does not email the applicant — contact them yourself at the address above.')}</p>
        </div>
      </div>
    </div>
  );
}

export default function ApplicationsManager({ kind }) {
  const { a, lang } = useA();
  const cfg = APPLICATIONS[kind];
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await supabase.from(cfg.table).select('*').order('created_at', { ascending: false });
    setLoading(false);
    if (err) return setError(err.message);
    setError('');
    setRows(data || []);
  }, [cfg.table]);

  useEffect(() => {
    load();
  }, [load]);

  const counts = useMemo(() => {
    const c = { all: rows.length };
    cfg.statuses.forEach((s) => {
      c[s] = rows.filter((r) => r.status === s).length;
    });
    return c;
  }, [rows, cfg.statuses]);

  const shown = rows.filter((r) => {
    if (filter !== 'all' && r.status !== filter) return false;
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return [r.full_name, r.email, r.institution, r.position].some((v) => v && String(v).toLowerCase().includes(q));
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold text-navy-950">{a(cfg.title)}</h1>
        <button type="button" className="btn-navy" onClick={() => exportCsv(kind, shown)} disabled={shown.length === 0}>
          {a('Download CSV ({x})', { x: shown.length })}
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {['all', ...cfg.statuses].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${filter === s ? 'border-gold-500 bg-gold-500 text-navy-950' : 'border-navy-200 bg-white text-navy-800'}`}
          >
            {s === 'all' ? a('All') : a(STATUS_LABEL[s])} · {counts[s] ?? 0}
          </button>
        ))}
      </div>

      <input className="field mt-4 max-w-md" placeholder={a('Search name, email, institution…')} value={search} onChange={(e) => setSearch(e.target.value)} aria-label={a('Search applications')} />

      {error && (
        <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      )}

      <div className="mt-5 overflow-x-auto rounded-2xl border border-navy-100 bg-white shadow-soft">
        {loading ? (
          <p className="p-6 text-navy-600">{a('Loading…')}</p>
        ) : shown.length === 0 ? (
          <p className="p-8 text-center text-navy-600">{rows.length === 0 ? a('No applications yet.') : a('No applications match.')}</p>
        ) : (
          <table className="w-full min-w-[40rem] text-start text-sm">
            <thead className="bg-navy-50 text-xs uppercase tracking-wide text-navy-600">
              <tr>
                <th className="px-4 py-3 text-start">{a('Name')}</th>
                <th className="px-4 py-3 text-start">{kind === 'staff' ? a('Position') : a('Institution')}</th>
                <th className="px-4 py-3 text-start">{a('Submitted')}</th>
                <th className="px-4 py-3 text-start">{a('Status')}</th>
                {cfg.payment && <th className="px-4 py-3 text-start">{a('Payment')}</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100">
              {shown.map((r) => (
                <tr key={r.id} className="cursor-pointer hover:bg-gold-100/30" onClick={() => setOpen(r)}>
                  <td className="px-4 py-3">
                    <button type="button" className="text-start font-semibold text-navy-950 underline decoration-navy-200" onClick={() => setOpen(r)}>
                      {r.full_name}
                    </button>
                    <div className="text-xs text-navy-500" dir="ltr" style={{ textAlign: 'start' }}>{r.email}</div>
                  </td>
                  <td className="px-4 py-3">{(kind === 'staff' ? r.position : r.institution) || '—'}</td>
                  <td className="whitespace-nowrap px-4 py-3">{new Date(r.created_at).toLocaleDateString(dateLocale(lang))}</td>
                  <td className="px-4 py-3">
                    <Badge status={r.status} />
                  </td>
                  {cfg.payment && <td className="px-4 py-3">{r.payment_status ? a(r.payment_status.charAt(0).toUpperCase() + r.payment_status.slice(1)) : ''}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {open && (
        <DetailPanel
          key={open.id}
          kind={kind}
          cfg={cfg}
          row={open}
          onClose={() => setOpen(null)}
          onChanged={() => {
            setOpen(null);
            load();
          }}
        />
      )}
    </div>
  );
}
