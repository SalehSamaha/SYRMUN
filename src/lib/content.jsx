import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase.js';
import { DEFAULT_SETTINGS, SAMPLE } from './defaults.js';

const SettingsContext = createContext({ settings: DEFAULT_SETTINGS, loaded: true });

export function SettingsProvider({ children }) {
  const [state, setState] = useState({ settings: DEFAULT_SETTINGS, loaded: !supabase });

  useEffect(() => {
    if (!supabase) return undefined;
    let off = false;
    supabase
      .from('settings')
      .select('key,value')
      .then(({ data }) => {
        if (off) return;
        const merged = { ...DEFAULT_SETTINGS };
        // A non-empty value overrides the default; an empty value keeps the default.
        (data || []).forEach((r) => {
          if (r.value !== '') merged[r.key] = r.value;
        });
        setState({ settings: merged, loaded: true });
      });
    return () => {
      off = true;
    };
  }, []);

  return <SettingsContext.Provider value={state}>{children}</SettingsContext.Provider>;
}

export const useSettings = () => useContext(SettingsContext);

/** Loads rows of a public content table (published rows only). */
export function useRows(table, { orderBy = 'sort_order', ascending = true } = {}) {
  const [state, setState] = useState(() =>
    supabase
      ? { data: [], loading: true, error: '' }
      : { data: SAMPLE[table] || [], loading: false, error: '' },
  );

  useEffect(() => {
    if (!supabase) return undefined;
    let off = false;
    let query = supabase.from(table).select('*').eq('published', true).order(orderBy, { ascending });
    if (orderBy !== 'created_at') query = query.order('created_at', { ascending: true });
    query.then(({ data, error }) => {
      if (off) return;
      setState({ data: data || [], loading: false, error: error ? error.message : '' });
    });
    return () => {
      off = true;
    };
  }, [table, orderBy, ascending]);

  return state;
}
