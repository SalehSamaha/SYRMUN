import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// When the env vars are missing the site runs in "preview mode" with sample data,
// so you can work on the design without a database.
export const supabase = url && key ? createClient(url, key) : null;
export const isConfigured = Boolean(supabase);
export const BUCKET = 'site-files';
