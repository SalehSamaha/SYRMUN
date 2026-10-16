import { useCallback, useEffect, useState } from 'react';
import { dateLocale } from '../lib/translations.js';
import { supabase } from '../lib/supabase.js';
import { fieldLabel, useA } from './adminI18n.js';
import FileUpload from './FileUpload.jsx';

const blank = (fields) =>
  Object.fromEntries(
    fields.map((f) => [f.name, f.type === 'bool' ? true : f.type === 'number' ? 0 : f.type === 'select' ? f.options[0][0] : '']),
  );

// stored value -> English label that has an Arabic translation
const COLUMN_VALUES = {
  handbook: 'Delegate Handbook',
  background_guide: 'Background guide',
  other: 'Other',
  sponsor: 'Sponsor',
  partner: 'Partner institution',
};

function FieldInput({ field, value, onChange }) {
  const { a } = useA();
  const id = `f_${field.name}`;
  // Arabic boxes are right-to-left; everything else (English names, links…) is typed left-to-right.
  const dirAttrs = field.arabic ? { dir: 'rtl', lang: 'ar' } : { dir: 'ltr' };
  switch (field.type) {
    case 'textarea':
      return <textarea id={id} rows={5} {...dirAttrs} className="field text-start" value={value ?? ''} onChange={(e) => onChange(e.target.value)} />;
    case 'bool':
      return (
        <label className="flex items-center gap-3">
          <input id={id} type="checkbox" className="h-5 w-5 accent-gold-600" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
          <span className="text-sm text-navy-800">{fieldLabel(a, field)}</span>
        </label>
      );
    case 'select':
      return (
        <select id={id} className="field" value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
          {field.options.map(([v, l]) => (
            <option key={v} value={v}>
              {a(l)}
            </option>
          ))}
        </select>
      );
    case 'image':
      return <FileUpload id={id} value={value} onChange={onChange} accept="image/png,image/jpeg,image/webp,image/svg+xml" isImage />;
    case 'file':
      return <FileUpload id={id} value={value} onChange={onChange} accept="application/pdf" />;
    case 'date':
      return <input id={id} type="date" dir="ltr" className="field text-start" value={value ?? ''} onChange={(e) => onChange(e.target.value)} />;
    case 'number':
      return <input id={id} type="number" dir="ltr" className="field text-start" value={value ?? 0} onChange={(e) => onChange(e.target.value)} />;
    default:
      return <input id={id} {...dirAttrs} className="field text-start" value={value ?? ''} onChange={(e) => onChange(e.target.value)} />;
  }
}

function Editor({ table, config, initial, onClose, onSaved }) {
  const { a } = useA();
  const [form, setForm] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const isNew = !initial.id;

  async function save(e) {
    e.preventDefault();
    setError('');
    for (const f of config.fields) {
      if (f.required && !String(form[f.name] ?? '').trim()) return setError(a('“{x}” is required.', { x: fieldLabel(a, f) }));
    }
    const row = {};
    config.fields.forEach((f) => {
      let v = form[f.name];
      if (f.type === 'number') v = Number.parseInt(v, 10) || 0;
      else if (f.type === 'bool') v = Boolean(v);
      else if (f.type === 'date') v = v || null;
      else if (typeof v === 'string') v = v.trim() === '' && !f.required ? null : v;
      row[f.name] = v;
    });

    setBusy(true);
    const { error: err } = isNew
      ? await supabase.from(table).insert(row)
      : await supabase.from(table).update(row).eq('id', initial.id);
    setBusy(false);
    if (err) return setError(err.message);
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-navy-950/60 p-4 sm:p-8" role="dialog" aria-modal="true">
      <form onSubmit={save} className="w-full max-w-2xl space-y-5 rounded-2xl bg-white p-6 shadow-soft sm:p-8">
        <h2 className="text-2xl font-bold text-navy-950">
          {isNew ? a('Add {x}', { x: a(config.singular) }) : `${a('Edit')} ${a(config.singular)}`}
        </h2>
        {config.fields.map((f) => (
          <div key={f.name}>
            {f.type !== 'bool' && (
              <label htmlFor={`f_${f.name}`} className="label">
                {fieldLabel(a, f)}
                {f.required && <span className="text-gold-700"> *</span>}
              </label>
            )}
            <FieldInput field={f} value={form[f.name]} onChange={(v) => setForm((s) => ({ ...s, [f.name]: v }))} />
            {f.help && <p className="mt-1 text-xs text-navy-500">{a(f.help)}</p>}
          </div>
        ))}
        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
            {error}
          </p>
        )}
        <div className="flex flex-wrap justify-end gap-3">
          <button type="button" className="btn-outline-dark" onClick={onClose}>
            {a('Cancel')}
          </button>
          <button type="submit" className="btn-gold" disabled={busy}>
            {busy ? a('Saving…') : a('Save')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function ContentManager({ table, config }) {
  const { a, lang } = useA();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);

  const cell = (v) => {
    if (v === true) return a('Yes');
    if (v === false || v == null || v === '') return '—';
    if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(v)) return new Date(v).toLocaleDateString(dateLocale(lang));
    return COLUMN_VALUES[v] ? a(COLUMN_VALUES[v]) : String(v);
  };

  const load = useCallback(async () => {
    setLoading(true);
    const orderBy = config.orderBy || 'sort_order';
    let q = supabase.from(table).select('*').order(orderBy, { ascending: config.ascending ?? true });
    if (orderBy !== 'created_at') q = q.order('created_at', { ascending: true });
    const { data, error: err } = await q;
    setLoading(false);
    if (err) return setError(err.message);
    setError('');
    setRows(data || []);
  }, [table, config]);

  useEffect(() => {
    load();
  }, [load]);

  async function remove(row) {
    if (!window.confirm(a('Delete this permanently? This cannot be undone.'))) return;
    const { error: err } = await supabase.from(table).delete().eq('id', row.id);
    if (err) return setError(err.message);
    load();
  }

  async function togglePublished(row) {
    const { error: err } = await supabase.from(table).update({ published: !row.published }).eq('id', row.id);
    if (err) return setError(err.message);
    load();
  }

  const colLabel = (c) => {
    if (c === 'created_at') return a('Date added');
    const f = config.fields.find((x) => x.name === c);
    return f ? a(f.label) : c.replace('_', ' ');
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold text-navy-950">{a(config.title)}</h1>
        <button type="button" className="btn-gold" onClick={() => setEditing(blank(config.fields))}>
          {a('+ Add {x}', { x: a(config.singular) })}
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      )}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-navy-100 bg-white shadow-soft">
        {loading ? (
          <p className="p-6 text-navy-600">{a('Loading…')}</p>
        ) : rows.length === 0 ? (
          <p className="p-8 text-center text-navy-600">{a('Nothing here yet. Click “Add {x}”.', { x: a(config.singular) })}</p>
        ) : (
          <table className="w-full min-w-[34rem] text-start text-sm">
            <thead className="bg-navy-50 text-xs uppercase tracking-wide text-navy-600">
              <tr>
                {config.columns.map((c) => (
                  <th key={c} className="px-4 py-3 text-start">
                    {colLabel(c)}
                  </th>
                ))}
                {config.fields.some((f) => f.name === 'published') && <th className="px-4 py-3 text-start">{a('Visible')}</th>}
                <th className="px-4 py-3 text-end">{a('Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100">
              {rows.map((r) => (
                <tr key={r.id} className={r.published === false ? 'bg-navy-50/50 text-navy-500' : ''}>
                  {config.columns.map((c) => (
                    <td key={c} className="max-w-[18rem] truncate px-4 py-3">
                      {cell(r[c])}
                    </td>
                  ))}
                  {config.fields.some((f) => f.name === 'published') && (
                    <td className="px-4 py-3">
                      <button type="button" className="underline" onClick={() => togglePublished(r)}>
                        {r.published ? a('Yes') : a('Hidden')}
                      </button>
                    </td>
                  )}
                  <td className="whitespace-nowrap px-4 py-3 text-end">
                    <button type="button" className="me-4 font-semibold text-navy-800 underline" onClick={() => setEditing({ ...blank(config.fields), ...r })}>
                      {a('Edit')}
                    </button>
                    <button type="button" className="font-semibold text-red-700 underline" onClick={() => remove(r)}>
                      {a('Delete')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editing && (
        <Editor
          table={table}
          config={config}
          initial={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}
    </div>
  );
}
