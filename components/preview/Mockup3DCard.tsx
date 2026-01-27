"use client";

import React, { useMemo } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { Environment, Float, OrbitControls, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { BrandIdentity } from '@/lib/data';

interface Mockup3DCardProps {
    brand: BrandIdentity;
    stacked?: boolean;
}

function CardModel({ brand }: { brand: BrandIdentity }) {
    // Generate texture
    const svgDataUri = useMemo(() => {
        try {
            // Robust Manual SVG construction to avoid dependency hell
            // Uses brand primary color and name
            const color = brand.theme?.tokens?.light?.primary || '#000000';
            const bgColor = "#ffffff";
            const name = brand.name || 'Brand';

            const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
                <rect width="512" height="512" fill="${bgColor}"/>
                <circle cx="256" cy="200" r="80" fill="${color}"/>
                <text x="50%" y="75%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" font-size="48" fill="#333333">
                    ${name}
                </text>
            </svg>`;

            const encoded = btoa(unescape(encodeURIComponent(svg)));
            return `data:image/svg+xml;base64,${encoded}`;
        } catch (e) {
            return 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        }
    }, [brand]);

    // Load texture
    const texture = useLoader(THREE.TextureLoader, svgDataUri);

    useMemo(() => {
        if (texture) {
            texture.anisotropy = 16;
            texture.center.set(0.5, 0.5);
        }
    }, [texture]);

    const primaryColor = brand.theme.tokens.light.primary;

    return (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
            <RoundedBox args={[3.2, 1.9, 0.05]} radius={0.05} receiveShadow castShadow>
                {/* Sides - Index 0-3 */}
                {/* @ts-ignore */}
                <meshStandardMaterial attach="material-0" color="#f5f5f5" />
                {/* @ts-ignore */}
                <meshStandardMaterial attach="material-1" color="#f5f5f5" />
                {/* @ts-ignore */}
                <meshStandardMaterial attach="material-2" color="#f5f5f5" />
                {/* @ts-ignore */}
                <meshStandardMaterial attach="material-3" color="#f5f5f5" />

                {/* Front (Index 4) - Logo */}
                {/* @ts-ignore */}
                <meshStandardMaterial attach="material-4" map={texture} color="#ffffff" metalness={0.1} roughness={0.3} />

                {/* Back (Index 5) - Primary Color */}
                {/* @ts-ignore */}
                <meshStandardMaterial attach="material-5" color={primaryColor} metalness={0.1} roughness={0.5} />
            </RoundedBox>
        </Float>
    );
}

export function Mockup3DCard({ brand }: Mockup3DCardProps) {
    return (
        <div className="w-full h-full">
            <Canvas
                shadows
                camera={{ position: [0, 0, 5], fov: 45 }}
                gl={{ preserveDrawingBuffer: true, antialias: true, alpha: true }}
                dpr={[1, 2]}
            >
                <ambientLight intensity={0.8} />
                <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={1} castShadow />
                <spotLight position={[-10, 5, 5]} intensity={0.5} />

                <CardModel brand={brand} />

                <OrbitControls autoRotate autoRotateSpeed={2.0} enableZoom={true} minDistance={2} maxDistance={10} />
                <Environment preset="city" />
            </Canvas>
        </div>
    );
}

export default Mockup3DCard;
