"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useUser } from '@clerk/nextjs';
import { createClient } from '@/lib/supabase/client';
import { BrandIdentity } from '@/lib/data';
import { ADMIN_EMAILS } from '@/lib/subscription';

export interface BrandRecord {
    id: string;
    identity: BrandIdentity;
    created_at: string;
    is_favorited?: boolean;
}

const FREE_HISTORY_LIMIT = 3;

export function useHistory() {
    const { user, isLoaded } = useUser();
    const [allBrands, setAllBrands] = useState<BrandRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPro, setIsPro] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

    // localStorage-based favorites fallback (works even if DB column doesn't exist)
    const [localFavorites, setLocalFavorites] = useState<Set<string>>(new Set());

    // Load local favorites on mount
    useEffect(() => {
        try {
            const stored = JSON.parse(localStorage.getItem('glyph_favorites') || '[]');
            setLocalFavorites(new Set(stored));
        } catch { /* ignore */ }
    }, []);

    const email = user?.primaryEmailAddress?.emailAddress || '';

    useEffect(() => {
        if (!isLoaded) return;

        const fetchHistory = async () => {
            if (!user) {
                window.location.href = '/login?next=/history';
                return;
            }

            const supabase = createClient();

            // Check pro status
            const isAdmin = ADMIN_EMAILS.includes(email);
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

            // Fetch brands
            const limit = 50;
            const { data, error } = await supabase
                .from('brands')
                .select('*')
                .eq('user_email', email)
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) {
                // Fallback query
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

                const filteredData = fallbackData?.filter((b: any) =>
                    b.user_email === email || b.identity?.userEmail === email
                ) || [];

                processHistory(filteredData);
            } else if (data) {
                processHistory(data);
            }

            setLoading(false);
        };

        const processHistory = (data: any[]) => {
            const mapped = data.map((d: any) => ({
                id: d.id,
                identity: d.identity as BrandIdentity,
                created_at: d.created_at,
                is_favorited: d.is_favorited || false,
            }));
            setAllBrands(mapped);
        };

        fetchHistory();
    }, [user, isLoaded, email]);

    // Computed: visible brands (respects free limit, search, favorites)
    const { brands, blockedCount, totalCount } = useMemo(() => {
        let filtered = allBrands;

        // Search filter
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(b =>
                b.identity.name?.toLowerCase().includes(q) ||
                b.identity.vibe?.toLowerCase().includes(q) ||
                b.identity.category?.toLowerCase().includes(q)
            );
        }

        // Favorites filter
        if (showFavoritesOnly) {
            filtered = filtered.filter(b =>
                b.is_favorited || localFavorites.has(b.id)
            );
        }

        const totalCount = allBrands.length;

        if (isPro) {
            return { brands: filtered, blockedCount: 0, totalCount };
        }

        // Free users: show first 3 (of the unfiltered total), count rest as blocked
        const visible = filtered.slice(0, FREE_HISTORY_LIMIT);
        const blocked = Math.max(0, allBrands.length - FREE_HISTORY_LIMIT);
        return { brands: visible, blockedCount: blocked, totalCount };
    }, [allBrands, isPro, searchQuery, showFavoritesOnly, localFavorites]);

    // Toggle favorite
    const toggleFavorite = useCallback(async (brandId: string) => {
        const isFav = localFavorites.has(brandId);
        const newFavorites = new Set(localFavorites);
        if (isFav) {
            newFavorites.delete(brandId);
        } else {
            newFavorites.add(brandId);
        }
        setLocalFavorites(newFavorites);

        // Persist to localStorage
        try {
            localStorage.setItem('glyph_favorites', JSON.stringify([...newFavorites]));
        } catch { /* ignore */ }

        // Update local state
        setAllBrands(prev => prev.map(b =>
            b.id === brandId ? { ...b, is_favorited: !isFav } : b
        ));

        // Try to persist to DB (fire and forget)
        try {
            await fetch('/api/history', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ brandId, userEmail: email, isFavorited: !isFav }),
            });
        } catch { /* DB update is best-effort */ }
    }, [localFavorites, email]);

    // Delete brand
    const deleteBrand = useCallback(async (brandId: string) => {
        // Optimistic update
        setAllBrands(prev => prev.filter(b => b.id !== brandId));

        try {
            const res = await fetch('/api/history', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ brandId, userEmail: email }),
            });

            if (!res.ok) {
                console.error('[History] Delete failed');
            }
        } catch (e) {
            console.error('[History] Delete error:', e);
        }
    }, [email]);

    // Check if a brand is favorited
    const isFavorited = useCallback((brandId: string) => {
        return localFavorites.has(brandId);
    }, [localFavorites]);

    return {
        brands,
        loading,
        isPro,
        blockedCount,
        totalCount,
        // Search
        searchQuery,
        setSearchQuery,
        // Favorites
        showFavoritesOnly,
        setShowFavoritesOnly,
        toggleFavorite,
        isFavorited,
        // Delete
        deleteBrand,
        // Counter for free users
        freeLimit: FREE_HISTORY_LIMIT,
    };
}
