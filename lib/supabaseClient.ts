export const supabase = {
  from: () => ({
    select: async () => ({ data: [], error: null }),
    insert: async () => ({ data: null, error: null }),
    update: async () => ({ data: null, error: null }),
    delete: async () => ({ data: null, error: null }),
    eq: () => ({
      select: async () => ({ data: [], error: null }),
    }),
    order: () => ({
      select: async () => ({ data: [], error: null }),
    }),
    in: () => ({
      select: async () => ({ data: [], error: null }),
    }),
  }),
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    signOut: async () => ({ error: null }),
  },
};
