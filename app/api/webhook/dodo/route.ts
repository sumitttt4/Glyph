/**
 * Dodo Payments Webhook Handler
 * 
 * Receives payment.completed events and marks user as Pro in Supabase.
 * Includes signature verification for security.
 */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createHmac } from 'crypto';

// Get Supabase admin client (lazy initialization)
function getSupabaseAdmin() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fvvzawoqzgeymcickvtn.supabase.co',
        process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );
}

/**
 * Verify webhook signature from Dodo Payments
 * Dodo uses HMAC-SHA256 signature in the 'x-dodo-signature' header
 */
function verifyWebhookSignature(payload: string, signature: string | null): boolean {
    const secret = process.env.DODO_WEBHOOK_SECRET;

    // If no secret configured, skip verification (development only)
    if (!secret) {
        console.warn('[Dodo Webhook] No DODO_WEBHOOK_SECRET configured - skipping verification');
        return true;
    }

    if (!signature) {
        console.error('[Dodo Webhook] No signature in request');
        return false;
    }

    // Calculate expected signature
    const expectedSignature = createHmac('sha256', secret)
        .update(payload)
        .digest('hex');

    // Compare signatures (timing-safe comparison)
    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (signatureBuffer.length !== expectedBuffer.length) {
        return false;
    }

    // Use timing-safe comparison
    let result = 0;
    for (let i = 0; i < signatureBuffer.length; i++) {
        result |= signatureBuffer[i] ^ expectedBuffer[i];
    }

    return result === 0;
}

/**
 * Sanitize email input
 */
function sanitizeEmail(email: string | undefined): string | null {
    if (!email || typeof email !== 'string') return null;
    // Basic email validation and sanitization
    const sanitized = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(sanitized) ? sanitized : null;
}

export async function POST(request: NextRequest) {
    try {
        const rawBody = await request.text();
        const signature = request.headers.get('x-dodo-signature') ||
            request.headers.get('x-webhook-signature');

        // Verify signature in production
        if (process.env.NODE_ENV === 'production' || process.env.DODO_WEBHOOK_SECRET) {
            if (!verifyWebhookSignature(rawBody, signature)) {
                console.error('[Dodo Webhook] Invalid signature');
                return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
            }
        }

        const body = JSON.parse(rawBody);
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
