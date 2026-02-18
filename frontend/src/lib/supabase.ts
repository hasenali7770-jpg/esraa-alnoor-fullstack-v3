import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// إذا ماكو Supabase، نسوي mock حتى ما ينهار الموقع
export const supabase = (url && key)
  ? createClient(url, key)
  : ({
      auth: {
        getSession: async () => ({ data: { session: null } }),
        getUser: async () => ({ data: { user: null } }),
        onAuthStateChange: () => ({
          data: { subscription: { unsubscribe: () => {} } },
        }),
        signInWithPassword: async () => ({ error: new Error("Supabase disabled") }),
        signUp: async () => ({ error: new Error("Supabase disabled") }),
        signOut: async () => ({}),
      },
      storage: {
        from: () => ({
          upload: async () => ({ error: new Error("Supabase disabled") }),
          getPublicUrl: () => ({ data: { publicUrl: "" } }),
        }),
      },
    } as any);
