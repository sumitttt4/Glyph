import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Subscription and Tier Management
 * 
 * Free Tier: 10 generations per month
 * Pro Tier: Unlimited + all features
 * Admin: Full access (Pro + admin features)
 */

// Admin emails - these get full Pro access automatically
export const ADMIN_EMAILS = ['sumitsharma9128@gmail.com'];

// Pro emails - manually added pro users (before Stripe integration)
export const PRO_EMAILS: string[] = [];

// Free tier limits
export const FREE_GENERATIONS_LIMIT = 10;

export type UserPlan = 'free' | 'pro' | 'admin';

export interface SubscriptionStatus {
    plan: UserPlan;
    isPro: boolean;
    isAdmin: boolean;
    generationsUsed: number;
    generationsRemaining: number;
    canGenerate: boolean;
}

/**
 * Get user's subscription status
 */
export function getSubscriptionStatus(
    email: string | null | undefined,
    generationsUsed: number = 0
): SubscriptionStatus {
    if (!email) {
        return {
            plan: 'free',
            isPro: false,
            isAdmin: false,
            generationsUsed: 0,
            generationsRemaining: FREE_GENERATIONS_LIMIT,
            canGenerate: true, // Allow generation, will prompt login
        };
    }

    const isAdmin = ADMIN_EMAILS.includes(email);
    const isPro = isAdmin || PRO_EMAILS.includes(email);

    const plan: UserPlan = isAdmin ? 'admin' : isPro ? 'pro' : 'free';
    const generationsRemaining = isPro ? Infinity : Math.max(0, FREE_GENERATIONS_LIMIT - generationsUsed);
    const canGenerate = isPro || generationsRemaining > 0;

    return {
        plan,
        isPro,
        isAdmin,
        generationsUsed,
        generationsRemaining,
        canGenerate,
    };
}

/**
 * Fetch Pro status from Supabase profiles table
 * This is used to check if a user has paid via Dodo Payments
 */
export async function fetchProStatusFromDB(
    supabaseClient: SupabaseClient,
    email: string | null | undefined
): Promise<boolean> {
    if (!email) return false;

    // Check if admin email first
    if (ADMIN_EMAILS.includes(email)) return true;

    try {
        const { data, error } = await supabaseClient
            .from('profiles')
            .select('is_pro')
            .eq('email', email)
            .single();

        if (error) {
            console.log('[Subscription] Profile fetch error:', error.message);
            return false;
        }

        return data?.is_pro === true;
    } catch (e) {
        console.error('[Subscription] DB fetch failed:', e);
        return false;
    }
}

/**
 * Check if a feature is available for the user's plan
 */
export function hasFeatureAccess(
    email: string | null | undefined,
    feature: 'custom_vibes' | 'gradients' | 'svg_export' | 'brand_book' | 'social_kit' | 'favicon_pack' | 'unlimited_history' | 'ai_suggestions'
): boolean {
    const status = getSubscriptionStatus(email);

    // Pro and Admin get all features
    if (status.isPro) return true;

    // Free tier features
    const freeFeatures = ['basic_export', 'basic_vibes', 'colors'];

    // These require Pro
    const proFeatures = [
        'custom_vibes',
        'gradients',
        'svg_export',
        'brand_book',
        'social_kit',
        'favicon_pack',
        'unlimited_history',
        'ai_suggestions'
    ];

    return !proFeatures.includes(feature);
}

/**
 * Get display text for user's plan
 */
export function getPlanDisplayInfo(plan: UserPlan): {
    label: string;
    color: string;
    bgColor: string;
    icon: 'star' | 'check' | 'user';
} {
    switch (plan) {
        case 'admin':
            return {
                label: 'Admin',
                color: 'text-amber-600',
                bgColor: 'bg-amber-50',
                icon: 'star',
            };
        case 'pro':
            return {
                label: 'Pro',
                color: 'text-green-600',
                bgColor: 'bg-green-50',
                icon: 'check',
            };
        default:
            return {
                label: 'Free',
                color: 'text-stone-500',
                bgColor: 'bg-stone-100',
                icon: 'user',
            };
    }
}
