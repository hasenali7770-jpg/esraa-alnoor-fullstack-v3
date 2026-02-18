import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Supabase is disabled; prevent app crash when env vars are missing
export const supabase = (url && key) ? createClient(url, key) : (null as any);
