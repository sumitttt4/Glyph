"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { createClient } from '@/lib/supabase/client';
import { BrandIdentity } from '@/lib/data';
import { ADMIN_EMAILS } from '@/lib/subscription';

export interface BrandRecord {
    id: string;
    identity: BrandIdentity;
    created_at: string;
}

export function useHistory() {
    const { user, isLoaded } = useUser();
    const [brands, setBrands] = useState<BrandRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPro, setIsPro] = useState(false);
    const [blockedCount, setBlockedCount] = useState(0);

    useEffect(() => {
        // Wait for Clerk to load
        if (!isLoaded) return;

        const fetchHistory = async () => {
            // User not logged in - redirect to login
            if (!user) {
                window.location.href = '/login?next=/history';
                return;
            }

            const email = user.primaryEmailAddress?.emailAddress || '';
            const supabase = createClient();

            // Check if admin/pro via email
            const isAdmin = ADMIN_EMAILS.includes(email);

            // Also check Supabase profiles for Pro status (from Dodo payments)
            let isProFromDB = false;
            try {
                const res = await fetch(`/api/subscription/status?email=${encodeURIComponent(email)}`);
                const data = await res.json();
                isProFromDB = data.isPro === true;
            } catch (e) {
                console.error('[History] Failed to check pro status:', e);
            }

            const proStatus = isAdmin || isProFromDB;
            setIsPro(proStatus);

            // Fetch brands using Clerk user ID
            // Note: brands table uses clerk_user_id or email for lookup
            const limit = 50;

            // Try fetching by email since that's more reliable with Clerk
            const { data, error } = await supabase
                .from('brands')
                .select('*')
                .eq('user_email', email)
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) {
                // Fallback: try user_id if user_email column doesn't exist
                console.log('[History] Trying fallback query...');
                const { data: fallbackData, error: fallbackError } = await supabase
                    .from('brands')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(limit);

                if (fallbackError) {
                    console.error('[History] Error fetching history:', fallbackError);
                    setLoading(false);
                    return;
                }

                // Filter by email if we got all brands
                const filteredData = fallbackData?.filter((b: any) =>
                    b.user_email === email || b.identity?.userEmail === email
                ) || [];

                processHistory(filteredData, proStatus, limit);
            } else if (data) {
                processHistory(data, proStatus, limit);
            }

            setLoading(false);
        };

        const processHistory = (data: any[], proStatus: boolean, limit: number) => {
            const mappedBrands = data.map((d: any) => ({
                id: d.id,
                identity: d.identity as BrandIdentity,
                created_at: d.created_at
            }));

            // Debug: Log whether logos have SVG data
            console.log('[History] Fetched brands:', mappedBrands.length);
            mappedBrands.forEach((b, i) => {
                const hasLogo = !!b.identity?.generatedLogos?.[0]?.svg;
                console.log(`[History] Brand ${i}: "${b.identity?.name}" - Logo SVG: ${hasLogo ? 'YES ✓' : 'NO (legacy)'}`);
            });

            if (proStatus) {
                setBrands(mappedBrands);
                setBlockedCount(0); // Pro sees all
            } else {
                // Free User Logic: Show 3, Block rest
                const visible = mappedBrands.slice(0, 3);
                const blocked = mappedBrands.length > 3 ? mappedBrands.slice(3) : [];

                setBrands(visible);
                setBlockedCount(blocked.length + (data.length === limit ? 1 : 0));
            }
        };

        fetchHistory();
    }, [user, isLoaded]);

    return { brands, loading, isPro, blockedCount };
}
