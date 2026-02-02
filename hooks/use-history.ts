
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { BrandIdentity } from '@/lib/data';
import { fetchProStatusFromDB } from '@/lib/subscription';

export interface BrandRecord {
    id: string;
    identity: BrandIdentity;
    created_at: string;
}

export function useHistory() {
    const [brands, setBrands] = useState<BrandRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPro, setIsPro] = useState(false);
    const [blockedCount, setBlockedCount] = useState(0);

    useEffect(() => {
        const fetchHistory = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                // 1. Check cookies for bypass (Dev/Guest Mode)
                const hasBypass = document.cookie.split(';').some(c => c.trim().startsWith('admin-bypass=true'));

                if (hasBypass) {
                    setIsPro(true); // Treat bypass as Pro

                    // Load local history for guest mode
                    try {
                        const localHistory = JSON.parse(localStorage.getItem('glyph_guest_history') || '[]');

                        // Debug: Log whether logos have SVG data
                        console.log('[History] Loaded guest history:', localHistory.length);
                        localHistory.forEach((b: any, i: number) => {
                            const hasLogo = !!b.identity?.generatedLogos?.[0]?.svg;
                            console.log(`[History] Guest Brand ${i}: "${b.identity?.name}" - Logo SVG: ${hasLogo ? 'YES ✓' : 'NO (legacy)'}`);
                        });

                        setBrands(localHistory);
                    } catch (e) {
                        console.error('Failed to load guest history', e);
                        setBrands([]);
                    }

                    setLoading(false);
                    return;
                }

                // 2. Redirect to login if truly not authenticated
                window.location.href = '/login?next=/history';
                return;
            }

            // Check Pro Status
            const proStatus = await fetchProStatusFromDB(supabase, user.email);
            setIsPro(proStatus);

            // Fetch Brands
            // We fetch reasonable amount to determine if we need to show blocked items
            const limit = 50;

            const { data, error } = await supabase
                .from('brands')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(limit);

            if (data) {
                const mappedBrands = data.map(d => ({
                    id: d.id,
                    identity: d.identity as BrandIdentity,
                    created_at: d.created_at
                }));

                // Debug: Log whether logos have SVG data
                console.log('[History] Fetched brands:', mappedBrands.length);
                mappedBrands.forEach((b, i) => {
                    const hasLogo = !!b.identity.generatedLogos?.[0]?.svg;
                    console.log(`[History] Brand ${i}: "${b.identity.name}" - Logo SVG: ${hasLogo ? 'YES ✓' : 'NO (legacy)'}`);
                });

                if (proStatus) {
                    setBrands(mappedBrands);
                    setBlockedCount(0); // Pro sees all
                } else {
                    // Free User Logic: Show 3, Block rest
                    const visible = mappedBrands.slice(0, 3);
                    const blocked = mappedBrands.length > 3 ? mappedBrands.slice(3) : [];

                    setBrands(visible);
                    setBlockedCount(blocked.length + (data.length === limit ? 1 : 0)); // If we hit limit, assume more
                }
            } else if (error) {
                console.error('Error fetching history:', error);
            }

            setLoading(false);
        };

        fetchHistory();
    }, []);

    return { brands, loading, isPro, blockedCount };
}
