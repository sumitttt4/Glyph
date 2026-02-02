"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, Suspense } from 'react';
import { Check, Sparkles, Play, ArrowRight } from 'lucide-react';

// Components
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthRescue } from '@/components/auth/AuthRescue';
import { AuthSection } from "@/components/landing/AuthSection";
import HeroAnimation from '@/components/landing/HeroAnimation'; // Original was default
import { LiveCounter } from '@/components/landing/LiveCounter';
import Pricing from '@/components/landing/Pricing'; // Original was default

import { LogoComposition } from '@/components/logo-engine/LogoComposition';

// New Components
import { HeroCentered } from '@/components/hero-centered';
import { ProcessPipeline } from '@/components/landing/ProcessPipeline';
// import { TokenEngine } from '@/components/landing/TokenEngine';
import { AssetPayload } from '@/components/landing/AssetPayload';
import { ComparisonTable } from '@/components/landing/ComparisonTable';
import { UrgencyBanner } from '@/components/ui/UrgencyBanner';

// Data
import { THEMES } from '@/lib/themes';
import { SHAPES } from '@/lib/shapes';
import { BrandIdentity } from '@/lib/data';

const DEMO_BRAND: BrandIdentity = {
    id: 'demo',
    name: 'Glyph',
    vibe: 'Premium',
    font: { id: 'demo-font', name: 'Instrument Sans', heading: 'Instrument Sans', body: 'Inter', tags: ['modern'] },
    theme: THEMES[0], // Architect
    shape: SHAPES[6], // Glyph Custom
    generationSeed: 12345,
    createdAt: new Date(),
};

export default function LandingPage() {
    const [demoIndex, setDemoIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setDemoIndex((prev) => (prev + 1) % 3);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-white text-stone-950 font-sans">
            <Suspense fallback={null}>
                <AuthRescue />
            </Suspense>
            <UrgencyBanner spotsLeft={47} />
            <Navbar />

            {/* ==================== 1. HERO SECTION ==================== */}
            {/* ==================== 1. HERO SECTION ==================== */}
            <HeroCentered />

            {/* ==================== 2. HOW IT WORKS (3 Steps) ==================== */}
            <ProcessPipeline />



            {/* ==================== 4. SHOWCASE SECTION REMOVED ==================== */}

            {/* ==================== 5. THE PAYLOAD (The Value) ==================== */}
            <AssetPayload />

            {/* ==================== 6. COMPARISON (The Anchor) ==================== */}
            <ComparisonTable />



            {/* ==================== 8. PRICING SECTION ==================== */}
            {/* ==================== 8. PRICING SECTION ==================== */}
            <Pricing />

            <AuthSection />

            <Footer />
        </div>
    );
}
