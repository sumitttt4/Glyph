import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = {
    width: 180,
    height: 180,
}
export const contentType = 'image/png'

export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 24,
                    background: '#FF4500',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                }}
            >
                <svg
                    width="108"
                    height="108"
                    viewBox="0 0 24 24"
                    fill="none"
                    style={{ display: 'flex' }}
                >
                    <path
                        d="M12 4L4 12h5v8h6v-6l4-4H12z M7 12l5-5 5 5-5 5-5-5z"
                        fill="white"
                    />
                </svg>
            </div>
        ),
        {
            ...size,
        }
    )
}
