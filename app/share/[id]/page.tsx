import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import SharePageClient from './SharePageClient';

interface SharePageProps {
    params: Promise<{ id: string }>;
}

async function getSharedBrand(shareId: string) {
    const supabase = await createClient();

    // Try shared_brands table first
    const { data, error } = await supabase
        .from('shared_brands')
        .select('*')
        .eq('share_id', shareId)
        .single();

    if (!error && data) {
        return data.brand_data;
    }

    // Fallback: try brands table by ID
    const { data: brandData, error: brandError } = await supabase
        .from('brands')
        .select('*')
        .eq('id', shareId)
        .single();

    if (!brandError && brandData) {
        return brandData.identity;
    }

    return null;
}

export async function generateMetadata({ params }: SharePageProps): Promise<Metadata> {
    const { id } = await params;
    const identity = await getSharedBrand(id);

    if (!identity) {
        return { title: 'Brand Not Found — Glyph' };
    }

    const brandName = identity.name || 'Brand';
    const tagline = identity.strategy?.tagline || 'Brand Identity System';

    return {
        title: `${brandName} — Brand Identity by Glyph`,
        description: `Complete brand identity system for ${brandName}: logo, colors, typography & guidelines. ${tagline}. Built with AI on Glyph.`,
        openGraph: {
            title: `${brandName} — Brand Identity by Glyph`,
            description: `Complete brand identity system including logo, colors, typography & guidelines. Built with AI on Glyph.`,
            url: `https://glyph.software/share/${id}`,
            siteName: 'Glyph',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${brandName} — Brand Identity by Glyph`,
            description: `Complete brand identity system including logo, colors, typography & guidelines. Built with AI on Glyph.`,
        },
    };
}

export default async function SharePage({ params }: SharePageProps) {
    const { id } = await params;
    const identity = await getSharedBrand(id);

    if (!identity) {
        notFound();
    }

    return <SharePageClient identity={identity} shareId={id} />;
}
