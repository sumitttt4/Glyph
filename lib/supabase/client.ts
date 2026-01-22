import { createBrowserClient } from '@supabase/ssr'

// Hardcoded for this session as .env.local is blocked
const SUPABASE_URL = 'https://fvvzawoqzgeymcickvtn.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ULULffspaJObTYOmXo0N-Q_j1h9Mk7V';

export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY
    )
}
