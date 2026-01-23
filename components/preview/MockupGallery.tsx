"use client";

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface MockupGalleryProps {
    logoUrl: string;
    primaryColor: string;
    className?: string;
}

interface MockupConfig {
    id: string;
    image: string;
    title: string;
    logoStyle: React.CSSProperties;
}

const MOCKUPS: MockupConfig[] = [
    {
        id: 'tshirt',
        title: 'Apparel',
        image: '/assets/tshirt-blank.png',
        logoStyle: {
            position: 'absolute',
            top: '30%',
            left: '32%',
            width: '36%',
            height: 'auto',
            transform: 'rotate(-2deg)',
            mixBlendMode: 'multiply',
            opacity: 0.9,
        }
    },
    {
        id: 'cup',
        title: 'Merch',
        image: '/assets/cup-blank.png',
        logoStyle: {
            position: 'absolute',
            top: '40%',
            left: '28%',
            width: '40%',
            height: 'auto',
            transform: 'rotate(-5deg) skewX(5deg) skewY(2deg)',
            mixBlendMode: 'multiply',
            opacity: 0.85,
        }
    },
    {
        id: 'poster',
        title: 'Advertising',
        image: '/assets/poster-blank.png',
        logoStyle: {
            position: 'absolute',
            top: '30%',
            left: '25%',
            width: '50%',
            height: 'auto',
            transform: 'perspective(500px) rotateY(0deg)', // Subtle perspective if needed
            mixBlendMode: 'multiply',
            opacity: 0.95,
        }
    },
    {
        id: 'card',
        title: 'Stationery',
        image: '/assets/card-blank.png',
        logoStyle: {
            position: 'absolute',
            top: '35%',
            left: '35%',
            width: '45%',
            height: 'auto',
            transform: 'rotate(-32deg) skewX(10deg) skewY(-5deg)', // Adjusted for the specific card stack angle
            mixBlendMode: 'multiply',
            opacity: 0.9,
        }
    }
];

export function MockupGallery({ logoUrl, primaryColor, className }: MockupGalleryProps) {
    if (!logoUrl) return null;

    return (
        <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-6", className)}>
            {MOCKUPS.map((mockup) => (
                <div
                    key={mockup.id}
                    className="relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-stone-100 group bg-stone-50"
                >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        <Image
                            src={mockup.image}
                            alt={`${mockup.title} Mockup`}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    </div>

                    {/* Logo Overlay */}
                    <img
                        src={logoUrl}
                        alt="Brand Logo"
                        className="pointer-events-none transition-all duration-500"
                        style={{
                            ...mockup.logoStyle,
                            // Optional: inject primary color filter if needed, but logoUrl should usually carry color
                        }}
                    />

                    {/* Label */}
                    <div className="absolute bottom-4 left-4 px-3 py-1 bg-white/80 backdrop-blur-md rounded-full text-xs font-semibold text-stone-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        {mockup.title}
                    </div>
                </div>
            ))}
        </div>
    );
}
