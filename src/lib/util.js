import { useEffect } from 'react';

/** Only allow http(s), mailto and relative links. Blocks javascript: and data: URLs. */
export function safeUrl(u) {
  if (!u) return '';
  const s = String(u).trim();
  if (s.startsWith('/') && !s.startsWith('//')) return s;
  try {
    const parsed = new URL(s);
    return ['http:', 'https:', 'mailto:'].includes(parsed.protocol) ? s : '';
  } catch {
    return '';
  }
}

/** Split a multi-line text field into trimmed, non-empty lines. */
export const lines = (text) =>
  String(text || '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

export function uuid() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  const b = new Uint8Array(16);
  globalThis.crypto.getRandomValues(b);
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = [...b].map((x) => x.toString(16).padStart(2, '0')).join('');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

export const isEmail = (s) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(s || '').trim());

export const initials = (name) =>
  String(name || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');

/** Sets <title> and meta description for the current page. */
export function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title ? `${title} · SYRMUN 2027` : 'SYRMUN 2027 — Syria Model United Nations';
    if (description) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', 'description');
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', description);
    }
  }, [title, description]);
}
