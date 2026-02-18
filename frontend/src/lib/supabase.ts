// Supabase disabled (project removed it).
// Export a safe stub so the app never crashes.
export const supabase: any = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
    onAuthStateChange: () => ({
      data: { subscription: { unsubscribe: () => {} } },
    }),
    signInWithPassword: async () => ({ data: null, error: new Error("Supabase disabled") }),
    signUp: async () => ({ data: null, error: new Error("Supabase disabled") }),
    signOut: async () => ({ error: null }),
  },
  storage: {
    from: () => ({
      upload: async () => ({ data: null, error: new Error("Supabase disabled") }),
      getPublicUrl: () => ({ data: { publicUrl: "" } }),
    }),
  },
};
