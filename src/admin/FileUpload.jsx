import { useState } from 'react';
import { BUCKET, supabase } from '../lib/supabase.js';
import { safeUrl, uuid } from '../lib/util.js';

const MAX_MB = 15;

/** Upload to the public "site-files" bucket, or paste a link. Value is the public URL. */
export default function FileUpload({ id, value, onChange, accept, isImage }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function pick(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setError('');
    if (file.size > MAX_MB * 1024 * 1024) return setError(`File is larger than ${MAX_MB} MB.`);

    setBusy(true);
    const ext = (file.name.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '');
    const path = `${new Date().getFullYear()}/${uuid()}.${ext}`;
    const { error: err } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type, upsert: false });
    setBusy(false);
    if (err) return setError(`Upload failed: ${err.message}`);
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    onChange(data.publicUrl);
  }

  const url = safeUrl(value);

  return (
    <div className="space-y-2">
      {isImage && url && <img src={url} alt="" className="h-24 w-auto rounded-lg border border-navy-100 object-contain" />}
      <div className="flex flex-wrap items-center gap-2">
        <label className="btn-navy cursor-pointer !px-4 !py-2">
          {busy ? 'Uploading…' : value ? 'Replace file' : 'Upload file'}
          <input type="file" className="sr-only" accept={accept} onChange={pick} disabled={busy} />
        </label>
        {value && (
          <button type="button" className="text-sm text-red-700 underline" onClick={() => onChange('')}>
            Remove
          </button>
        )}
      </div>
      <input
        id={id}
        className="field !py-2 text-sm"
        placeholder="…or paste a link (https://…)"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
