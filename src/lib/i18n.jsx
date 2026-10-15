import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useSettings } from './content.jsx';
import { formatDate } from './fees.js';
import { pickField, pickSetting, translate } from './translations.js';

const KEY = 'syrmun_lang';

function readSaved() {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === 'ar' || v === 'en' ? v : 'en';
  } catch {
    return 'en';
  }
}

const LangContext = createContext({ lang: 'en', setLang: () => {} });

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(readSaved);
  const setLang = useCallback((next) => {
    setLangState(next);
    try {
      window.localStorage.setItem(KEY, next);
    } catch {
      /* private mode etc: the choice just won't be remembered */
    }
  }, []);
  const value = useMemo(() => ({ lang, setLang }), [lang, setLang]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

/**
 * const { t, tr, st, fd, lang, dir, toggle } = useI18n();
 *   t('key', params)      fixed website text
 *   tr(row, 'field')      a database row's field, Arabic version when available
 *   st('setting_key')     a setting, Arabic version when available
 *   fd('2027-03-01')      a date formatted for the current language
 */
export function useI18n() {
  const { lang, setLang } = useContext(LangContext);
  const { settings } = useSettings();
  return useMemo(
    () => ({
      lang,
      dir: lang === 'ar' ? 'rtl' : 'ltr',
      isAr: lang === 'ar',
      toggle: () => setLang(lang === 'ar' ? 'en' : 'ar'),
      t: (key, params) => translate(lang, key, params),
      tr: (row, field) => pickField(row, field, lang),
      st: (key) => pickSetting(settings, key, lang),
      fd: (d) => formatDate(d, lang),
    }),
    [lang, setLang, settings],
  );
}
