import { useMemo } from 'react';
import { useI18n } from '../lib/i18n.jsx';
import { AR } from './adminDict.js';

export function useA() {
  const { lang, dir, toggle } = useI18n();
  return useMemo(() => {
    const a = (en, params) => {
      let s = lang === 'ar' ? AR[en] || en : en;
      if (params) s = s.replace(/\{(\w+)\}/g, (m, k) => (params[k] != null ? String(params[k]) : m));
      return s;
    };
    return { a, lang, dir, isAr: lang === 'ar', toggle };
  }, [lang, dir, toggle]);
}

/** Label of a config field; Arabic-twin fields get the "— Arabic" suffix in the right language. */
export function fieldLabel(a, f) {
  if (f.baseLabel) return a(f.baseLabel) + a(' — Arabic (العربية)');
  return a(f.label);
}
