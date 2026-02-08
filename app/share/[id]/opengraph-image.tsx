import { ImageResponse } from 'next/og';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'edge';
export const alt = 'Brand Identity by Glyph';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

async function getSharedBrand(shareId: string) {
    try {
        const supabase = await createClient();

        const { data } = await supabase
            .from('shared_brands')
            .select('brand_data')
            .eq('share_id', shareId)
            .single();

        if (data) return data.brand_data;

        const { data: brandData } = await supabase
            .from('brands')
            .select('identity')
            .eq('id', shareId)
            .single();

        if (brandData) return brandData.identity;
    } catch {
        // Silently fail — will show fallback image
    }
    return null;
}

export default async function OGImage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const identity = await getSharedBrand(id);

    const brandName = identity?.name || 'Brand Identity';
    const tagline = identity?.strategy?.tagline || 'Created with Glyph';
    const primaryColor = identity?.theme?.tokens?.light?.primary || '#6366f1';
    const accentColor = identity?.theme?.tokens?.light?.accent || '#8b5cf6';
    const secondaryColor = identity?.theme?.tokens?.light?.secondary || '#a78bfa';
    const bgColor = '#0c0a09';
    const vibe = identity?.vibe || '';
    const firstLetter = brandName.charAt(0).toUpperCase();

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: bgColor,
                    fontFamily: 'system-ui, sans-serif',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Background gradient effect */}
                <div
                    style={{
                        position: 'absolute',
                        top: '-200px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '800px',
                        height: '800px',
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${primaryColor}22, transparent 70%)`,
                    }}
                />

                {/* Grid pattern overlay */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        opacity: 0.05,
                        backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                    }}
                />

                {/* Logo placeholder (letter mark) */}
                <div
                    style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '24px',
                        backgroundColor: primaryColor + '20',
                        border: `3px solid ${primaryColor}40`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '52px',
                        fontWeight: 700,
                        color: primaryColor,
                        marginBottom: '32px',
                    }}
                >
                    {firstLetter}
                </div>

                {/* Brand name */}
                <div
                    style={{
                        fontSize: '56px',
                        fontWeight: 800,
                        color: 'white',
                        letterSpacing: '-0.02em',
                        marginBottom: '12px',
                        textAlign: 'center',
                        maxWidth: '80%',
                    }}
                >
                    {brandName}
                </div>

                {/* Tagline */}
                {tagline && (
                    <div
                        style={{
                            fontSize: '22px',
                            color: 'rgba(255,255,255,0.45)',
                            textAlign: 'center',
                            maxWidth: '600px',
                            lineHeight: 1.4,
                            marginBottom: '36px',
                        }}
                    >
                        {tagline}
                    </div>
                )}

                {/* Color palette swatches */}
                <div
                    style={{
                        display: 'flex',
                        gap: '8px',
                        marginBottom: '48px',
                    }}
                >
                    {[primaryColor, accentColor, secondaryColor, '#fafafa', '#1c1917'].map((c, i) => (
                        <div
                            key={i}
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                backgroundColor: c,
                                border: '2px solid rgba(255,255,255,0.1)',
                            }}
                        />
                    ))}
                </div>

                {/* Footer: "glyph.software" watermark */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                    }}
                >
                    <div
                        style={{
                            fontSize: '14px',
                            color: 'rgba(255,255,255,0.25)',
                            letterSpacing: '0.05em',
                        }}
                    >
                        glyph.software
                    </div>
                </div>

                {/* Vibe badge */}
                {vibe && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '28px',
                            right: '28px',
                            fontSize: '11px',
                            fontWeight: 600,
                            color: primaryColor,
                            backgroundColor: primaryColor + '15',
                            border: `1px solid ${primaryColor}30`,
                            borderRadius: '999px',
                            padding: '4px 14px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                        }}
                    >
                        {vibe}
                    </div>
                )}
            </div>
        ),
        {
            ...size,
        },
    );
}
