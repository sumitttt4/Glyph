"use client";

import React, { useMemo, Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { Environment, Float, OrbitControls, RoundedBox, Cylinder, Box } from '@react-three/drei';
import * as THREE from 'three';
import { BrandIdentity } from '@/lib/data';
import { MockupType } from '@/lib/mockup-state';

// ============================================
// SHARED UTILITIES
// ============================================

function generateBrandTexture(brand: BrandIdentity, width = 512, height = 512, layout: 'centered' | 'card' = 'centered'): string {
    try {
        const color = brand.theme?.tokens?.light?.primary || '#000000';
        const bgColor = '#ffffff';
        const name = brand.name || 'Brand';

        // 1. Use Generated Logo if available (Priority)
        const selectedLogo = brand.generatedLogos?.[brand.selectedLogoIndex || 0];
        if (selectedLogo?.svg) {
            // Encode the logo SVG to base64 to embed it safely
            const logoBase64 = btoa(unescape(encodeURIComponent(selectedLogo.svg)));

            if (layout === 'card') {
                // Business Card with real Logo
                return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(`
                    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
                        <rect width="${width}" height="${height}" fill="${bgColor}"/>
                        
                        <!-- Logo (Top Left or Center Left) -->
                        <image href="data:image/svg+xml;base64,${logoBase64}" x="${width * 0.1}" y="${height * 0.25}" width="${width * 0.2}" height="${height * 0.2}" />
                        
                        <!-- Text -->
                        <text x="${width * 0.1}" y="${height * 0.65}" font-family="Arial, sans-serif" font-weight="bold" font-size="${height * 0.08}" fill="#333333">
                            ${name}
                        </text>
                        <text x="${width * 0.1}" y="${height * 0.78}" font-family="Arial, sans-serif" font-size="${height * 0.04}" fill="#666666">
                            hello@${name.toLowerCase().replace(/\s+/g, '')}.com
                        </text>
                    </svg>
                `)))}`;
            } else {
                // Centered Logo (for Box, Icon, etc)
                // We use an empty background or transparent?
                // Usually mockups expect white bg texture with logo in middle.
                return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(`
                    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
                        <rect width="${width}" height="${height}" fill="${bgColor}" fill-opacity="1"/>
                        <image href="data:image/svg+xml;base64,${logoBase64}" x="${width * 0.2}" y="${height * 0.2}" width="${width * 0.6}" height="${height * 0.6}" />
                        <text x="50%" y="90%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" font-size="${height * 0.08}" fill="#333333">
                            ${name}
                        </text>
                    </svg>
                `)))}`;
            }
        }

        // 2. Fallback to Hardcoded (Legacy)
        if (layout === 'card') {
            // Business card layout
            return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
                    <rect width="${width}" height="${height}" fill="${bgColor}"/>
                    <circle cx="${width * 0.2}" cy="${height * 0.35}" r="${Math.min(width, height) * 0.12}" fill="${color}"/>
                    <text x="${width * 0.2}" y="${height * 0.65}" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" font-size="${height * 0.08}" fill="#333333">
                        ${name}
                    </text>
                    <text x="${width * 0.2}" y="${height * 0.78}" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="${height * 0.04}" fill="#666666">
                        hello@${name.toLowerCase().replace(/\s+/g, '')}.com
                    </text>
                </svg>
            `)))}`;
        }

        // Centered logo layout (default)
        return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
                <rect width="${width}" height="${height}" fill="${bgColor}"/>
                <circle cx="${width / 2}" cy="${height * 0.4}" r="${Math.min(width, height) * 0.15}" fill="${color}"/>
                <text x="50%" y="70%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" font-size="${height * 0.08}" fill="#333333">
                    ${name}
                </text>
            </svg>
        `)))}`;
    } catch {
        return 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    }
}

// ============================================
// 3D MOCKUP MODELS
// ============================================

// Business Card Model
function BusinessCardModel({ brand }: { brand: BrandIdentity }) {
    const textureUri = useMemo(() => generateBrandTexture(brand, 512, 300, 'card'), [brand]);
    const texture = useLoader(THREE.TextureLoader, textureUri);
    const primaryColor = brand.theme.tokens.light.primary;

    return (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
            <RoundedBox args={[3.2, 1.9, 0.05]} radius={0.05} receiveShadow castShadow>
                {/* @ts-ignore */}
                <meshStandardMaterial attach="material-0" color="#f5f5f5" />
                {/* @ts-ignore */}
                <meshStandardMaterial attach="material-1" color="#f5f5f5" />
                {/* @ts-ignore */}
                <meshStandardMaterial attach="material-2" color="#f5f5f5" />
                {/* @ts-ignore */}
                <meshStandardMaterial attach="material-3" color="#f5f5f5" />
                {/* @ts-ignore */}
                <meshStandardMaterial attach="material-4" map={texture} color="#ffffff" metalness={0.1} roughness={0.3} />
                {/* @ts-ignore */}
                <meshStandardMaterial attach="material-5" color={primaryColor} metalness={0.1} roughness={0.5} />
            </RoundedBox>
        </Float>
    );
}

// Phone Model
function PhoneModel({ brand }: { brand: BrandIdentity }) {
    const screenTexture = useMemo(() => generateBrandTexture(brand, 390, 844), [brand]);
    const texture = useLoader(THREE.TextureLoader, screenTexture);
    const primaryColor = brand.theme.tokens.light.primary;

    return (
        <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.15}>
            <group>
                {/* Phone Body */}
                <RoundedBox args={[1.8, 3.8, 0.15]} radius={0.15} receiveShadow castShadow>
                    <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
                </RoundedBox>
                {/* Screen */}
                <mesh position={[0, 0, 0.08]}>
                    <planeGeometry args={[1.6, 3.4]} />
                    <meshStandardMaterial map={texture} />
                </mesh>
                {/* Camera Notch */}
                <group position={[0, 1.7, 0.08]} rotation={[0, 0, Math.PI / 2]}>
                    <mesh>
                        <capsuleGeometry args={[0.08, 0.3, 4, 8]} />
                        <meshStandardMaterial color="#0a0a0a" />
                    </mesh>
                </group>
                {/* Camera Island */}
                <RoundedBox args={[0.8, 0.8, 0.05]} radius={0.1} position={[-0.4, 1.4, -0.1]}>
                    <meshStandardMaterial color="#2a2a2a" metalness={0.5} />
                </RoundedBox>
            </group>
        </Float>
    );
}

// Laptop Model
function LaptopModel({ brand }: { brand: BrandIdentity }) {
    const screenTexture = useMemo(() => generateBrandTexture(brand, 1440, 900), [brand]);
    const texture = useLoader(THREE.TextureLoader, screenTexture);
    const primaryColor = brand.theme.tokens.light.primary;

    return (
        <Float speed={1} rotationIntensity={0.1} floatIntensity={0.1}>
            <group position={[0, -0.5, 0]}>
                {/* Screen */}
                <group rotation={[-0.3, 0, 0]} position={[0, 1.2, -0.8]}>
                    <RoundedBox args={[4, 2.5, 0.08]} radius={0.05}>
                        <meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.3} />
                    </RoundedBox>
                    <mesh position={[0, 0, 0.045]}>
                        <planeGeometry args={[3.7, 2.2]} />
                        <meshStandardMaterial map={texture} />
                    </mesh>
                </group>
                {/* Base/Keyboard */}
                <RoundedBox args={[4.2, 0.12, 2.8]} radius={0.05} position={[0, 0, 0]}>
                    <meshStandardMaterial color="#3a3a3a" metalness={0.4} roughness={0.5} />
                </RoundedBox>
                {/* Trackpad */}
                <mesh position={[0, 0.07, 0.5]}>
                    <planeGeometry args={[1.2, 0.8]} />
                    <meshStandardMaterial color="#4a4a4a" metalness={0.3} />
                </mesh>
            </group>
        </Float>
    );
}

// Coffee Cup Model
function CoffeeCupModel({ brand }: { brand: BrandIdentity }) {
    const logoTexture = useMemo(() => generateBrandTexture(brand, 512, 512), [brand]);
    const texture = useLoader(THREE.TextureLoader, logoTexture);
    const primaryColor = brand.theme.tokens.light.primary;

    return (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
            <group>
                {/* Cup Body */}
                <Cylinder args={[0.8, 0.7, 1.8, 32]} position={[0, 0, 0]} receiveShadow castShadow>
                    <meshStandardMaterial color="#f5f5f5" map={texture} roughness={0.4} />
                </Cylinder>
                {/* Handle */}
                <mesh position={[1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <torusGeometry args={[0.35, 0.08, 16, 100, Math.PI]} />
                    <meshStandardMaterial color="#f5f5f5" roughness={0.4} />
                </mesh>
                {/* Coffee inside */}
                <Cylinder args={[0.72, 0.72, 0.1, 32]} position={[0, 0.85, 0]}>
                    <meshStandardMaterial color="#3d2314" roughness={0.8} />
                </Cylinder>
            </group>
        </Float>
    );
}

// Tote Bag Model
function ToteBagModel({ brand }: { brand: BrandIdentity }) {
    const logoTexture = useMemo(() => generateBrandTexture(brand, 512, 512), [brand]);
    const texture = useLoader(THREE.TextureLoader, logoTexture);

    return (
        <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.15}>
            <group>
                {/* Bag Body */}
                <Box args={[2.2, 2.8, 0.4]} position={[0, 0, 0]} receiveShadow castShadow>
                    <meshStandardMaterial color="#f5f0e8" roughness={0.8} />
                </Box>
                {/* Logo Panel */}
                <mesh position={[0, 0, 0.21]}>
                    <planeGeometry args={[1.8, 1.8]} />
                    <meshStandardMaterial map={texture} transparent />
                </mesh>
                {/* Left Handle */}
                <mesh position={[-0.5, 2, 0]} rotation={[0, 0, 0]}>
                    <torusGeometry args={[0.5, 0.04, 8, 32, Math.PI]} />
                    <meshStandardMaterial color="#d4c4b0" roughness={0.7} />
                </mesh>
                {/* Right Handle */}
                <mesh position={[0.5, 2, 0]} rotation={[0, 0, 0]}>
                    <torusGeometry args={[0.5, 0.04, 8, 32, Math.PI]} />
                    <meshStandardMaterial color="#d4c4b0" roughness={0.7} />
                </mesh>
            </group>
        </Float>
    );
}

// Packaging Box Model
function PackagingBoxModel({ brand }: { brand: BrandIdentity }) {
    const logoTexture = useMemo(() => generateBrandTexture(brand, 512, 512), [brand]);
    const texture = useLoader(THREE.TextureLoader, logoTexture);
    const primaryColor = brand.theme.tokens.light.primary;

    return (
        <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.15}>
            <group rotation={[0.1, 0.3, 0]}>
                <Box args={[2.5, 2.5, 2.5]} receiveShadow castShadow>
                    {/* @ts-ignore */}
                    <meshStandardMaterial attach="material-0" color={primaryColor} roughness={0.5} />
                    {/* @ts-ignore */}
                    <meshStandardMaterial attach="material-1" color={primaryColor} roughness={0.5} />
                    {/* @ts-ignore */}
                    <meshStandardMaterial attach="material-2" color={primaryColor} roughness={0.5} />
                    {/* @ts-ignore */}
                    <meshStandardMaterial attach="material-3" color={primaryColor} roughness={0.5} />
                    {/* @ts-ignore - Front face with logo */}
                    <meshStandardMaterial attach="material-4" map={texture} color="#ffffff" />
                    {/* @ts-ignore */}
                    <meshStandardMaterial attach="material-5" color={primaryColor} roughness={0.5} />
                </Box>
            </group>
        </Float>
    );
}

// Hoodie Model (Simplified - T-pose shape)
function HoodieModel({ brand }: { brand: BrandIdentity }) {
    const logoTexture = useMemo(() => generateBrandTexture(brand, 512, 512), [brand]);
    const texture = useLoader(THREE.TextureLoader, logoTexture);
    const primaryColor = brand.theme.tokens.light.primary;

    return (
        <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.15}>
            <group>
                {/* Body */}
                <Box args={[2.2, 2.8, 0.5]} position={[0, 0, 0]} receiveShadow castShadow>
                    <meshStandardMaterial color={primaryColor} roughness={0.8} />
                </Box>
                {/* Logo */}
                <mesh position={[0, 0.3, 0.26]}>
                    <planeGeometry args={[1.2, 1.2]} />
                    <meshStandardMaterial map={texture} transparent />
                </mesh>
                {/* Left Sleeve */}
                <Box args={[1.2, 0.6, 0.4]} position={[-1.6, 0.8, 0]} rotation={[0, 0, 0.3]}>
                    <meshStandardMaterial color={primaryColor} roughness={0.8} />
                </Box>
                {/* Right Sleeve */}
                <Box args={[1.2, 0.6, 0.4]} position={[1.6, 0.8, 0]} rotation={[0, 0, -0.3]}>
                    <meshStandardMaterial color={primaryColor} roughness={0.8} />
                </Box>
                {/* Hood */}
                <mesh position={[0, 1.7, -0.1]}>
                    <sphereGeometry args={[0.6, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
                    <meshStandardMaterial color={primaryColor} roughness={0.8} side={THREE.DoubleSide} />
                </mesh>
            </group>
        </Float>
    );
}

// Billboard Model
function BillboardModel({ brand }: { brand: BrandIdentity }) {
    const logoTexture = useMemo(() => generateBrandTexture(brand, 1200, 600), [brand]);
    const texture = useLoader(THREE.TextureLoader, logoTexture);

    return (
        <Float speed={1} rotationIntensity={0.1} floatIntensity={0.1}>
            <group>
                {/* Billboard Panel */}
                <Box args={[5, 2.5, 0.15]} position={[0, 1.5, 0]} receiveShadow castShadow>
                    <meshStandardMaterial color="#333333" roughness={0.3} />
                </Box>
                {/* Screen */}
                <mesh position={[0, 1.5, 0.08]}>
                    <planeGeometry args={[4.8, 2.3]} />
                    <meshStandardMaterial map={texture} />
                </mesh>
                {/* Left Pole */}
                <Cylinder args={[0.1, 0.1, 3, 16]} position={[-2, -0.3, 0]}>
                    <meshStandardMaterial color="#555555" metalness={0.6} roughness={0.4} />
                </Cylinder>
                {/* Right Pole */}
                <Cylinder args={[0.1, 0.1, 3, 16]} position={[2, -0.3, 0]}>
                    <meshStandardMaterial color="#555555" metalness={0.6} roughness={0.4} />
                </Cylinder>
            </group>
        </Float>
    );
}

// Poster Model
function PosterModel({ brand }: { brand: BrandIdentity }) {
    const logoTexture = useMemo(() => generateBrandTexture(brand, 600, 800), [brand]);
    const texture = useLoader(THREE.TextureLoader, logoTexture);

    return (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
            <group rotation={[0.05, 0, 0]}>
                {/* Poster */}
                <Box args={[2.4, 3.2, 0.02]} receiveShadow castShadow>
                    <meshStandardMaterial map={texture} roughness={0.3} />
                </Box>
            </group>
        </Float>
    );
}

// Storefront Sign Model
function StorefrontSignModel({ brand }: { brand: BrandIdentity }) {
    const logoTexture = useMemo(() => generateBrandTexture(brand, 1000, 400), [brand]);
    const texture = useLoader(THREE.TextureLoader, logoTexture);
    const primaryColor = brand.theme.tokens.light.primary;

    return (
        <Float speed={1} rotationIntensity={0.1} floatIntensity={0.1}>
            <group>
                {/* Sign Panel */}
                <RoundedBox args={[4, 1.2, 0.3]} radius={0.1} position={[0, 0, 0]} receiveShadow castShadow>
                    <meshStandardMaterial color={primaryColor} roughness={0.3} metalness={0.2} />
                </RoundedBox>
                {/* Sign Face */}
                <mesh position={[0, 0, 0.16]}>
                    <planeGeometry args={[3.8, 1]} />
                    <meshStandardMaterial map={texture} />
                </mesh>
                {/* Mounting Bracket Left */}
                <Cylinder args={[0.05, 0.05, 0.6, 8]} position={[-1.5, 0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <meshStandardMaterial color="#333333" metalness={0.8} />
                </Cylinder>
                {/* Mounting Bracket Right */}
                <Cylinder args={[0.05, 0.05, 0.6, 8]} position={[1.5, 0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <meshStandardMaterial color="#333333" metalness={0.8} />
                </Cylinder>
            </group>
        </Float>
    );
}

// ============================================
// GENERIC FLAT MOCKUP (Fallback for digital assets)
// ============================================

function FlatMockupModel({ brand, aspectRatio = 16 / 9 }: { brand: BrandIdentity; aspectRatio?: number }) {
    const width = 3;
    const height = width / aspectRatio;
    const logoTexture = useMemo(() => generateBrandTexture(brand, 512, Math.round(512 / aspectRatio)), [brand, aspectRatio]);
    const texture = useLoader(THREE.TextureLoader, logoTexture);

    return (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
            <RoundedBox args={[width, height, 0.05]} radius={0.02} receiveShadow castShadow>
                {/* @ts-ignore */}
                <meshStandardMaterial attach="material-4" map={texture} />
                {/* @ts-ignore */}
                <meshStandardMaterial attach="material-5" color="#f0f0f0" />
            </RoundedBox>
        </Float>
    );
}

// ============================================
// MOCKUP TYPE REGISTRY
// ============================================

export const MOCKUP_3D_REGISTRY: Record<MockupType, React.FC<{ brand: BrandIdentity }> | null> = {
    'business-card': BusinessCardModel,
    'phone-screen': PhoneModel,
    'laptop-screen': LaptopModel,
    'coffee-cup': CoffeeCupModel,
    'tote-bag': ToteBagModel,
    'packaging-box': PackagingBoxModel,
    'hoodie': HoodieModel,
    'billboard': BillboardModel,
    'poster': PosterModel,
    'storefront-sign': StorefrontSignModel,
    'mobile-app': PhoneModel, // Reuse phone
    'linkedin-banner': ({ brand }) => <FlatMockupModel brand={brand} aspectRatio={1584 / 396} />,
    'website-header': ({ brand }) => <FlatMockupModel brand={brand} aspectRatio={1200 / 800} />,
    'letterhead': ({ brand }) => <FlatMockupModel brand={brand} aspectRatio={595 / 842} />,
    'social-suite': null,
    'merch-suite': null,
};

export function has3DComponent(mockupType: MockupType): boolean {
    return MOCKUP_3D_REGISTRY[mockupType] !== null;
}

// ============================================
// MAIN 3D SCENE COMPONENT
// ============================================

interface Mockup3DSceneProps {
    brand: BrandIdentity;
    mockupType: MockupType;
}

function MockupScene({ brand, mockupType }: Mockup3DSceneProps) {
    const ModelComponent = MOCKUP_3D_REGISTRY[mockupType];
    if (!ModelComponent) return null;
    return <ModelComponent brand={brand} />;
}

export function Mockup3DScene({ brand, mockupType }: Mockup3DSceneProps) {
    return (
        <div className="w-full h-full">
            <Canvas
                shadows
                camera={{ position: [0, 0, 6], fov: 45 }}
                gl={{ preserveDrawingBuffer: true, antialias: true, alpha: true }}
                dpr={[1, 2]}
            >
                <ambientLight intensity={0.8} />
                <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={1} castShadow />
                <spotLight position={[-10, 5, 5]} intensity={0.5} />

                <Suspense fallback={null}>
                    <MockupScene brand={brand} mockupType={mockupType} />
                </Suspense>

                <OrbitControls
                    autoRotate
                    autoRotateSpeed={2.0}
                    enableZoom={true}
                    minDistance={2}
                    maxDistance={12}
                />
                <Environment preset="city" />
            </Canvas>
        </div>
    );
}

export default Mockup3DScene;
