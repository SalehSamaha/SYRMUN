import { useEffect, useState } from 'react';
import { DEFAULT_SETTINGS } from '../lib/defaults.js';
import { getRegistrationState, formatMoney } from '../lib/fees.js';
import { supabase } from '../lib/supabase.js';
import { SETTINGS_GROUPS } from './config.js';

function Input({ field, value, onChange }) {
  const id = `s_${field.key}`;
  if (field.type === 'textarea')
    return <textarea id={id} rows={4} className="field" value={value} onChange={(e) => onChange(e.target.value)} />;
  if (field.type === 'select')
    return (
      <select id={id} className="field" value={value} onChange={(e) => onChange(e.target.value)}>
        {field.options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    );
  return (
    <input
      id={id}
      type={field.type === 'date' ? 'date' : field.type === 'number' ? 'number' : 'text'}
      min={field.type === 'number' ? 0 : undefined}
      step={field.type === 'number' ? '0.01' : undefined}
      className="field"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export default function SettingsManager() {
  const [values, setValues] = useState(null);
  const [saved, setSaved] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    supabase
      .from('settings')
      .select('key,value')
      .then(({ data, error }) => {
        if (error) return setMsg({ type: 'error', text: error.message });
        const stored = Object.fromEntries((data || []).map((r) => [r.key, r.value]));
        // Show what the site is really using: stored value, else the built-in default.
        const merged = {};
        SETTINGS_GROUPS.forEach((g) =>
          g.fields.forEach((f) => {
            merged[f.key] = stored[f.key] && stored[f.key] !== '' ? stored[f.key] : DEFAULT_SETTINGS[f.key] ?? '';
          }),
        );
        setValues(merged);
        setSaved(merged);
      });
  }, []);

  if (!values) return <p className="text-navy-600">{msg.text || 'Loading…'}</p>;

  const dirty = JSON.stringify(values) !== JSON.stringify(saved);
  const preview = getRegistrationState(values);

  async function save(e) {
    e.preventDefault();
    setMsg({ type: '', text: '' });

    const d = (k) => values[k] || '';
    const early = d('early_bird_ends'), regular = d('regular_ends'), closes = d('registration_closes'), opens = d('registration_opens');
    if (opens && early && early < opens) return setMsg({ type: 'error', text: '“Early bird ends” is before “Registration opens”.' });
    if (early && regular && regular < early) return setMsg({ type: 'error', text: '“Regular fee ends” is before “Early bird ends”.' });
    if (regular && closes && closes < regular) return setMsg({ type: 'error', text: '“Registration closes” is before “Regular fee ends”.' });
    if (early && !regular) return setMsg({ type: 'error', text: 'If you set an early bird end date you must also set “Regular fee ends”.' });
    for (const k of ['fee_early', 'fee_regular', 'fee_late']) {
      if (values[k] === '' || Number.isNaN(Number(values[k])) || Number(values[k]) < 0)
        return setMsg({ type: 'error', text: 'Fees must be numbers (0 or more).' });
    }

    const rows = Object.entries(values).map(([key, value]) => ({ key, value: String(value ?? ''), updated_at: new Date().toISOString() }));
    setBusy(true);
    const { error } = await supabase.from('settings').upsert(rows, { onConflict: 'key' });
    setBusy(false);
    if (error) return setMsg({ type: 'error', text: error.message });
    setSaved(values);
    setMsg({ type: 'ok', text: 'Saved. The website now uses these settings.' });
  }

  return (
    <form onSubmit={save} className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold text-navy-950">Settings & fees</h1>
        <button type="submit" className="btn-gold" disabled={busy || !dirty}>
          {busy ? 'Saving…' : dirty ? 'Save changes' : 'No changes'}
        </button>
      </div>

      <div className="rounded-2xl border border-gold-500/40 bg-gold-100/50 p-4 text-sm text-navy-900">
        <strong>Right now (based on today’s date and the values below):</strong>{' '}
        {preview.state === 'open'
          ? `registration is OPEN — ${preview.label} fee, ${formatMoney(preview.amount)}.`
          : preview.state === 'closed'
            ? 'registration is CLOSED.'
            : 'registration is NOT OPEN yet.'}
      </div>

      {msg.text && (
        <p role="alert" className={`rounded-lg px-3 py-2 text-sm ${msg.type === 'ok' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
          {msg.text}
        </p>
      )}

      {SETTINGS_GROUPS.map((g) => (
        <section key={g.title} className="rounded-2xl border border-navy-100 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-bold text-navy-950">{g.title}</h2>
          {g.note && <p className="mt-1 text-sm text-navy-600">{g.note}</p>}
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {g.fields.map((f) => (
              <div key={f.key} className={f.type === 'textarea' ? 'md:col-span-2' : ''}>
                <label htmlFor={`s_${f.key}`} className="label">
                  {f.label}
                </label>
                <Input field={f} value={values[f.key]} onChange={(v) => setValues((s) => ({ ...s, [f.key]: v }))} />
                {f.help && <p className="mt-1 text-xs text-navy-500">{f.help}</p>}
              </div>
            ))}
          </div>
        </section>
      ))}

      <div className="flex justify-end">
        <button type="submit" className="btn-gold" disabled={busy || !dirty}>
          {busy ? 'Saving…' : dirty ? 'Save changes' : 'No changes'}
        </button>
      </div>
    </form>
  );
}
