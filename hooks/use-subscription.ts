"use client";

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ADMIN_EMAILS } from '@/lib/subscription';

interface SubscriptionState {
    isPro: boolean;
    isAdmin: boolean;
    isLoading: boolean;
    email: string | null;
}

/**
 * Client-side hook to check Pro subscription status
 * Fetches from Supabase profiles table
 */
export function useSubscription(): SubscriptionState & { checkProStatus: () => Promise<void> } {
    const [state, setState] = useState<SubscriptionState>({
        isPro: false,
        isAdmin: false,
        isLoading: true,
        email: null,
    });

    const checkProStatus = useCallback(async () => {
        // ADMIN BYPASS: Check cookie first
        if (typeof document !== 'undefined' && /admin-bypass=true/.test(document.cookie)) {
            setState({
                isPro: true,
                isAdmin: true,
                isLoading: false,
                email: 'sumitsharma9128@gmail.com',
            });
            return;
        }

        const supabase = createClient();

        try {
            // Get current user
            const { data: { user } } = await supabase.auth.getUser();

            if (!user?.email) {
                setState({
                    isPro: false,
                    isAdmin: false,
                    isLoading: false,
                    email: null,
                });
                return;
            }

            const email = user.email;

            // Check if admin (instant Pro)
            if (ADMIN_EMAILS.includes(email)) {
                setState({
                    isPro: true,
                    isAdmin: true,
                    isLoading: false,
                    email,
                });
                return;
            }

            // Check Supabase profile for is_pro flag
            const { data, error } = await supabase
                .from('profiles')
                .select('is_pro')
                .eq('email', email)
                .single();

            if (error) {
                console.log('[useSubscription] Profile not found or error:', error.message);
            }

            setState({
                isPro: data?.is_pro === true,
                isAdmin: false,
                isLoading: false,
                email,
            });
        } catch (e) {
            console.error('[useSubscription] Error:', e);
            setState(prev => ({ ...prev, isLoading: false }));
        }
    }, []);

    useEffect(() => {
        checkProStatus();
    }, [checkProStatus]);

    return { ...state, checkProStatus };
}
