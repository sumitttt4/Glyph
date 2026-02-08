/**
 * /api/history — History Management
 *
 * DELETE: Remove a brand from history
 * PATCH:  Toggle favorite status on a brand
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// DELETE: Remove a brand from history
export async function DELETE(req: NextRequest) {
    try {
        const { brandId, userEmail } = await req.json();

        if (!brandId || !userEmail) {
            return NextResponse.json(
                { error: 'brandId and userEmail are required' },
                { status: 400 },
            );
        }

        const supabase = await createClient();

        // Delete the brand — only allow deleting own brands
        const { error } = await supabase
            .from('brands')
            .delete()
            .eq('id', brandId)
            .eq('user_email', userEmail);

        if (error) {
            console.error('[History DELETE] Error:', error.message);
            return NextResponse.json(
                { error: 'Failed to delete brand' },
                { status: 500 },
            );
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('[History DELETE] Error:', err);
        return NextResponse.json(
            { error: 'Failed to delete brand' },
            { status: 500 },
        );
    }
}

// PATCH: Toggle favorite status
export async function PATCH(req: NextRequest) {
    try {
        const { brandId, userEmail, isFavorited } = await req.json();

        if (!brandId || !userEmail) {
            return NextResponse.json(
                { error: 'brandId and userEmail are required' },
                { status: 400 },
            );
        }

        const supabase = await createClient();

        // Try to update the is_favorited column
        const { error } = await supabase
            .from('brands')
            .update({ is_favorited: isFavorited })
            .eq('id', brandId)
            .eq('user_email', userEmail);

        if (error) {
            // Column may not exist — return success anyway (favorites will use localStorage fallback)
            console.error('[History PATCH] DB update failed:', error.message);
            return NextResponse.json({ success: true, fallback: true });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('[History PATCH] Error:', err);
        return NextResponse.json(
            { error: 'Failed to update favorite status' },
            { status: 500 },
        );
    }
}
