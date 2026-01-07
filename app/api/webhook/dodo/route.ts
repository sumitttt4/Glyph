/**
 * Dodo Payments Webhook Handler
 * 
 * Receives payment.completed events and marks user as Pro in Supabase.
 */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Get Supabase admin client (lazy initialization)
function getSupabaseAdmin() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fvvzawoqzgeymcickvtn.supabase.co',
        process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        console.log('[Dodo Webhook] Received:', JSON.stringify(body, null, 2));

        // Dodo Payments sends different event types
        // Common events: payment.completed, payment.failed, subscription.created
        const eventType = body.type || body.event_type;

        if (eventType === 'payment.completed' || eventType === 'payment_succeeded') {
            // Extract customer email from payload
            // Dodo Payments structure may vary - check their docs
            const customerEmail =
                body.customer?.email ||
                body.data?.customer?.email ||
                body.metadata?.email ||
                body.buyer_email;

            if (!customerEmail) {
                console.error('[Dodo Webhook] No customer email found in payload');
                return NextResponse.json({ error: 'No customer email' }, { status: 400 });
            }

            console.log('[Dodo Webhook] Upgrading user to Pro:', customerEmail);

            // Update user's profile to Pro
            const supabaseAdmin = getSupabaseAdmin();
            const { error } = await supabaseAdmin
                .from('profiles')
                .update({ is_pro: true, upgraded_at: new Date().toISOString() })
                .eq('email', customerEmail);

            if (error) {
                // If profile doesn't exist, try to create it
                console.log('[Dodo Webhook] Profile update failed, trying upsert:', error.message);

                const { error: upsertError } = await supabaseAdmin
                    .from('profiles')
                    .upsert({
                        email: customerEmail,
                        is_pro: true,
                        upgraded_at: new Date().toISOString()
                    }, {
                        onConflict: 'email'
                    });

                if (upsertError) {
                    console.error('[Dodo Webhook] Upsert failed:', upsertError.message);
                    return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
                }
            }

            console.log('[Dodo Webhook] Successfully upgraded:', customerEmail);
            return NextResponse.json({ success: true, upgraded: customerEmail });
        }

        // Handle other event types gracefully
        console.log('[Dodo Webhook] Unhandled event type:', eventType);
        return NextResponse.json({ received: true, eventType });

    } catch (error) {
        console.error('[Dodo Webhook] Error:', error);
        return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
    }
}

// Dodo may send GET requests to verify webhook endpoint
export async function GET() {
    return NextResponse.json({ status: 'ok', service: 'dodo-webhook' });
}
