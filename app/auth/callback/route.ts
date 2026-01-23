import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/generator'

    if (code) {
        const supabase = await createClient()
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error && data.user) {
            const adminEmails = ['sumitsharma9128@gmail.com'];
            const response = NextResponse.redirect(`${origin}${next}`);

            if (data.user.email && adminEmails.includes(data.user.email)) {
                // Set a long-lived bypass cookie
                response.cookies.set('admin-bypass', 'true', {
                    path: '/',
                    maxAge: 60 * 60 * 24 * 365, // 1 year
                    httpOnly: false, // Allow JS access
                });
            }
            return response;
        } else {
            console.error('Auth Error:', error)
            return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${encodeURIComponent(error.message)}`)
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=No+code+provided`)
}
