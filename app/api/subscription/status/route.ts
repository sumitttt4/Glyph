import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const email = searchParams.get('email');

    if (!email) {
        return NextResponse.json({ isPro: false }, { status: 400 });
    }

    // Admin Bypass (Hardcoded)
    const ADMIN_EMAILS = ['sumitsharma9128@gmail.com'];
    if (ADMIN_EMAILS.includes(email)) {
        return NextResponse.json({ isPro: true, isAdmin: true });
    }

    // Use Service Role Key to bypass RLS and read profiles
    // We assume SUPABASE_SERVICE_ROLE_KEY is set in env
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseServiceKey) {
        console.warn('SUPABASE_SERVICE_ROLE_KEY is not set. Cannot check database status.');
        return NextResponse.json({ isPro: false });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('is_pro')
            .eq('email', email)
            .single();

        if (error) {
            // If row doesn't exist, it's not an error, just not pro
            if (error.code !== 'PGRST116') {
                console.error('Supabase profile check error:', error);
            }
            return NextResponse.json({ isPro: false });
        }

        return NextResponse.json({ isPro: data?.is_pro === true });
    } catch (error) {
        console.error('Subscription API error:', error);
        return NextResponse.json({ isPro: false }, { status: 500 });
    }
}
