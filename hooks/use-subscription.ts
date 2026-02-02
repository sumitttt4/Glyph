"use client";

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
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
 * Uses Clerk for auth and Supabase for profile data
 */
export function useSubscription(): SubscriptionState {
    const { user, isLoaded } = useUser();
    const [state, setState] = useState<SubscriptionState>({
        isPro: false,
        isAdmin: false,
        isLoading: true,
        email: null,
    });

    useEffect(() => {
        if (!isLoaded) return;

        if (!user) {
            setState({
                isPro: false,
                isAdmin: false,
                isLoading: false,
                email: null,
            });
            return;
        }

        const email = user.primaryEmailAddress?.emailAddress || '';

        // 1. Admin Bypass (Clerk Email)
        if (ADMIN_EMAILS.includes(email) || email === 'sumitsharma9128@gmail.com') {
            setState({
                isPro: true,
                isAdmin: true,
                isLoading: false,
                email,
            });
            return;
        }

        // 2. Check Pro status via API (Bypasses RLS)
        const checkProStatus = async () => {
            try {
                const res = await fetch(`/api/subscription/status?email=${encodeURIComponent(email)}`);
                const data = await res.json();

                setState({
                    isPro: data.isPro,
                    isAdmin: data.isAdmin || false,
                    isLoading: false,
                    email,
                });
            } catch (err) {
                console.error('Subscription check failed:', err);
                setState({
                    isPro: false,
                    isAdmin: false,
                    isLoading: false,
                    email,
                });
            }
        };

        checkProStatus();

    }, [user, isLoaded]);

    return state;
}
