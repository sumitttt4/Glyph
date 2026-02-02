import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Glyph - Design Engineer';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
    // Load Inter Font (Bold & Regular)
    const interBold = await fetch(
        'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hjp-Ek-_EeA.woff'
    ).then((res) => res.arrayBuffer());

    const interRegular = await fetch(
        'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hjp-Ek-_EeA.woff'
    ).then((res) => res.arrayBuffer());

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#050505',
                    fontFamily: 'Inter',
                    position: 'relative',
                }}
            >
                {/* Grid Background */}
                <div style={{
                    display: 'flex',
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundImage: 'linear-gradient(#222 1px, transparent 1px), linear-gradient(90deg, #222 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    opacity: 0.3
                }} />

                {/* Start Content */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'space-between', // Changed to space-between
                    padding: '80px', // More padding
                }}>

                    {/* Left Content: Text */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '500px',
                        justifyContent: 'center'
                    }}>
                        {/* Logo Badge */}
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '48px', height: '48px', backgroundColor: '#FF4500', borderRadius: '12px',
                                boxShadow: '0 4px 12px rgba(255, 69, 0, 0.4)'
                            }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ display: 'flex' }}>
                                    <path d="M12 4L4 12h5v8h6v-6l4-4H12z M7 12l5-5 5 5-5 5-5-5z" fill="white" />
                                </svg>
                            </div>
                            <div style={{ display: 'flex', fontSize: '36px', fontWeight: 700, color: 'white' }}>Glyph</div>
                        </div>

                        {/* Headings */}
                        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', fontSize: '64px', fontWeight: 800, color: 'white', lineHeight: 1.1, letterSpacing: '-0.03em' }}>
                                Launch Your Brand
                            </div>
                            <div style={{ display: 'flex', fontSize: '64px', fontWeight: 800, color: '#FF4500', lineHeight: 1.1, letterSpacing: '-0.03em' }}>
                                in 60 Seconds.
                            </div>
                        </div>

                        {/* Subtext */}
                        <div style={{ display: 'flex', fontSize: '24px', color: '#d6d3d1', lineHeight: 1.5, fontWeight: 400 }}>
                            Generate logos, typography, and palettes. Export to code instantly.
                        </div>
                    </div>

                    {/* Right Content: Premium Bento Grid Preview */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '500px',
                        height: '420px',
                        transform: 'rotate(-5deg)', // Add slight tilt for 3D feel
                        gap: '16px'
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', height: '260px' }}>
                            {/* 1. Main Logo Card */}
                            <div style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                flex: 1.5,
                                backgroundColor: 'white', borderRadius: '24px',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
                            }}>
                                <svg width="100" height="100" viewBox="0 0 32 32" fill="none" style={{ display: 'flex' }}>
                                    <rect width="32" height="32" rx="8" fill="#FF4500" />
                                    <path d="M12 2L2 12h5v10h10v-5l5-5H12z M7 12l5-5 5 5-5 5-5-5z" fill="white" transform="translate(4, 4)" />
                                </svg>
                                <div style={{ display: 'flex', marginTop: '16px', fontSize: '24px', fontWeight: 700, color: 'black' }}>Glyph</div>
                            </div>

                            {/* 2. Typography Card */}
                            <div style={{
                                display: 'flex', flexDirection: 'column',
                                flex: 1,
                                backgroundColor: '#FF4500', borderRadius: '24px', padding: '24px',
                                color: 'white',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
                            }}>
                                <div style={{ display: 'flex', fontSize: '14px', opacity: 0.8, marginBottom: 'auto' }}>FONT</div>
                                <div style={{ display: 'flex', fontSize: '64px', fontWeight: 700, lineHeight: 1 }}>Aa</div>
                                <div style={{ display: 'flex', fontSize: '16px', fontWeight: 500, marginTop: '8px' }}>Inter</div>
                            </div>
                        </div>

                        {/* 3. Palette Row */}
                        <div style={{
                            display: 'flex', flexDirection: 'row', // Explicit row
                            height: '140px', borderRadius: '24px',
                            backgroundColor: '#1c1917', border: '1px solid #333',
                            alignItems: 'center', padding: '0 24px', gap: '20px',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
                        }}>
                            <div style={{ display: 'flex', fontSize: '14px', color: '#a8a29e', width: '60px' }}>COLOR</div>
                            <div style={{ display: 'flex', flex: 1, height: '80px', borderRadius: '12px', backgroundColor: 'white' }} />
                            <div style={{ display: 'flex', flex: 1, height: '80px', borderRadius: '12px', backgroundColor: '#FF4500' }} />
                            <div style={{ display: 'flex', flex: 1, height: '80px', borderRadius: '12px', backgroundColor: '#444' }} />
                        </div>
                    </div>

                </div>
            </div>
        ),
        {
            ...size,
            fonts: [
                {
                    name: 'Inter',
                    data: interBold,
                    style: 'normal',
                    weight: 700,
                },
                {
                    name: 'Inter',
                    data: interRegular,
                    style: 'normal',
                    weight: 400,
                },
            ],
        }
    );
}
