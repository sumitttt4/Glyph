'use client';

/**
 * Official Figma Logo Component
 * Uses the actual Figma brand colors and logo design
 */

interface FigmaLogoProps {
    className?: string;
    size?: number;
}

export function FigmaLogo({ className = '', size = 24 }: FigmaLogoProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 38 57"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Orange - top left */}
            <path
                d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z"
                fill="#1ABCFE"
            />
            {/* Purple - top right */}
            <path
                d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z"
                fill="#0ACF83"
            />
            {/* Blue - center */}
            <path
                d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z"
                fill="#FF7262"
            />
            {/* Green - bottom left */}
            <path
                d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z"
                fill="#F24E1E"
            />
            {/* Red - top left */}
            <path
                d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z"
                fill="#A259FF"
            />
        </svg>
    );
}

// Compact square version for smaller UI
export function FigmaLogoCompact({ className = '', size = 20 }: FigmaLogoProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M8 24C10.208 24 12 22.208 12 20V16H8C5.792 16 4 17.792 4 20C4 22.208 5.792 24 8 24Z"
                fill="#0ACF83"
            />
            <path
                d="M4 12C4 9.792 5.792 8 8 8H12V16H8C5.792 16 4 14.208 4 12Z"
                fill="#A259FF"
            />
            <path
                d="M4 4C4 1.792 5.792 0 8 0H12V8H8C5.792 8 4 6.208 4 4Z"
                fill="#F24E1E"
            />
            <path
                d="M12 0H16C18.208 0 20 1.792 20 4C20 6.208 18.208 8 16 8H12V0Z"
                fill="#FF7262"
            />
            <path
                d="M20 12C20 14.208 18.208 16 16 16C13.792 16 12 14.208 12 12C12 9.792 13.792 8 16 8C18.208 8 20 9.792 20 12Z"
                fill="#1ABCFE"
            />
        </svg>
    );
}
