/**
 * /api/share — Public Share Link Management
 *
 * POST: Create a share link for a brand generation
 * GET:  Retrieve a shared brand by its share_id
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

function generateShareId(): string {
    // Short, URL-safe ID: timestamp base36 + random suffix
    const ts = Date.now().toString(36);
    const rand = Math.random().toString(36).slice(2, 8);
    return `${ts}${rand}`;
}

// POST: Create a share link
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { brandId, identity, userEmail } = body;

        if (!identity || !identity.name) {
            return NextResponse.json(
                { error: 'Brand identity data is required' },
                { status: 400 },
            );
        }

        const shareId = generateShareId();
        const supabase = await createClient();

        // Try to insert into shared_brands table
        const { error } = await supabase
            .from('shared_brands')
            .insert({
                share_id: shareId,
                brand_id: brandId || null,
                brand_data: identity,
                user_email: userEmail || null,
                created_at: new Date().toISOString(),
            });

        if (error) {
            // If the table doesn't exist, fall back to returning a localStorage-based approach
            console.error('[Share] DB insert failed:', error.message);
            // Still return the share_id — the share page will try DB first, then fallback
            return NextResponse.json({
                shareId,
                shareUrl: `/share/${shareId}`,
                stored: false,
                fallback: 'localStorage',
            });
        }

        return NextResponse.json({
            shareId,
            shareUrl: `/share/${shareId}`,
            stored: true,
        });
    } catch (err) {
        console.error('[Share] Error:', err);
        return NextResponse.json(
            { error: 'Failed to create share link' },
            { status: 500 },
        );
    }
}

// GET: Retrieve a shared brand
export async function GET(req: NextRequest) {
    const shareId = req.nextUrl.searchParams.get('id');

    if (!shareId) {
        return NextResponse.json(
            { error: 'Share ID is required' },
            { status: 400 },
        );
    }

    try {
        const supabase = await createClient();

        // Try shared_brands table first
        const { data, error } = await supabase
            .from('shared_brands')
            .select('*')
            .eq('share_id', shareId)
            .single();

        if (error || !data) {
            // Fallback: try brands table by ID
            const { data: brandData, error: brandError } = await supabase
                .from('brands')
                .select('*')
                .eq('id', shareId)
                .single();

            if (brandError || !brandData) {
                return NextResponse.json(
                    { error: 'Share not found' },
                    { status: 404 },
                );
            }

            return NextResponse.json({
                shareId,
                identity: brandData.identity,
                createdAt: brandData.created_at,
            });
        }

        return NextResponse.json({
            shareId: data.share_id,
            identity: data.brand_data,
            createdAt: data.created_at,
        });
    } catch (err) {
        console.error('[Share GET] Error:', err);
        return NextResponse.json(
            { error: 'Failed to retrieve share' },
            { status: 500 },
        );
    }
}
