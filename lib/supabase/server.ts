import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Hardcoded for this session as .env.local is blocked
const SUPABASE_URL = 'https://fvvzawoqzgeymcickvtn.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ULULffspaJObTYOmXo0N-Q_j1h9Mk7V';

export async function createClient() {
    const cookieStore = await cookies()

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value, ...options })
                    } catch (error) {
                        // The `set` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
                remove(name: string, options: CookieOptions) {
                    try {
                        cookieStore.delete({ name, ...options })
                    } catch (error) {
                        // The `delete` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    )
}
