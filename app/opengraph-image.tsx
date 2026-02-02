import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Glyph - Design Engineer';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
    // Debug: Removed font fetching which often crashes Edge runtime if network fails
    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    backgroundColor: '#050505',
                    fontFamily: 'sans-serif', // Fallback
                    position: 'relative',
                }}
            >
                {/* Simple Grid Background */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundImage: 'linear-gradient(#222 1px, transparent 1px), linear-gradient(90deg, #222 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    opacity: 0.2
                }} />

                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '60px',
                    gap: '40px'
                }}>

                    {/* Left Content */}
                    <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '500px', zIndex: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                            <div style={{ width: '40px', height: '40px', backgroundColor: '#FF4500', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 4L4 12h5v8h6v-6l4-4H12z M7 12l5-5 5 5-5 5-5-5z" fill="white" />
                                </svg>
                            </div>
                            <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'white' }}>Glyph</div>
                        </div>

                        <div style={{ fontSize: '60px', fontWeight: 'bold', color: 'white', lineHeight: 1.1, marginBottom: '20px' }}>
                            Launch Your Brand in <span style={{ color: '#FF4500' }}>60 Seconds.</span>
                        </div>

                        <div style={{ fontSize: '24px', color: '#a8a29e' }}>
                            Generate logos, typography, and palettes. Export to code instantly.
                        </div>
                    </div>

                    {/* Right Content (Preview Grid) - Simplified */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', zIndex: 10 }}>
                        {/* Logo Card */}
                        <div style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            width: '300px', height: '220px', backgroundColor: 'white', borderRadius: '16px'
                        }}>
                            <svg width="80" height="80" viewBox="0 0 32 32" fill="none">
                                <rect width="32" height="32" rx="8" fill="#FF4500" />
                                <path d="M12 2L2 12h5v10h10v-5l5-5H12z M7 12l5-5 5 5-5 5-5-5z" fill="white" transform="translate(4, 4)" />
                            </svg>
                        </div>
                        {/* Palette Strip */}
                        <div style={{
                            display: 'flex', width: '300px', height: '80px', borderRadius: '16px', overflow: 'hidden'
                        }}>
                            <div style={{ flex: 1, backgroundColor: '#FF4500' }} />
                            <div style={{ flex: 1, backgroundColor: '#1c1917' }} />
                            <div style={{ flex: 1, backgroundColor: '#E7E5E4' }} />
                        </div>
                    </div>

                </div>
            </div>
        )
    );
}
