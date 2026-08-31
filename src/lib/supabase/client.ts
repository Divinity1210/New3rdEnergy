import { createClient } from '@supabase/supabase-js';

// Project: 3rd Energy (wexnqxxjdzubtgqyedlm - London)
const DEFAULT_SUPABASE_URL = 'https://wexnqxxjdzubtgqyedlm.supabase.co';
const DEFAULT_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndleG5xeHhqZHp1YnRncXllZGxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyMzUyODEsImV4cCI6MjEwMDgxMTI4MX0.25HD9Mc0MO4xFH5J1ABwIHo0EjIMm7mMGx4R__RlpPs';
const DEFAULT_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndleG5xeHhqZHp1YnRncXllZGxtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTIzNTI4MSwiZXhwIjoyMTAwODExMjgxfQ.SAw8nv9Fn1MKbgfzYe__Nf2-rMKKuyZVycteMzgFPSI';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || DEFAULT_SERVICE_KEY;

// Client for browser / public operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: typeof window !== 'undefined',
    autoRefreshToken: typeof window !== 'undefined',
  },
});

// Server/Admin client using Service Role key for elevated backend API operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
