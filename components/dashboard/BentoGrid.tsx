"use client";

import { BrandIdentity } from '@/lib/data';
import { LogoCell } from './LogoCell';
import { PaletteCell } from './PaletteCell';
import { CodeCell } from './CodeCell';
import { BusinessCardsCell } from './BusinessCardsCell';
import { IconVariantsCell } from './IconVariantsCell';
import { TypographyCell } from './TypographyCell';
import { MugCell } from './MugCell';
import { TumblerCell } from './TumblerCell';
import { ToteBagCell } from './ToteBagCell';
import { TShirtCell } from './TShirtCell';
import { PhoneCell } from './PhoneCell';
import { useState } from 'react';
import { Moon, Sun, ArrowLeft, Download, Copy, Check } from 'lucide-react';
import Link from 'next/link';

interface BentoGridProps {
    brand: BrandIdentity;
    onBack: () => void;
}

export function BentoGrid({ brand, onBack }: BentoGridProps) {
    const [mode, setMode] = useState<'light' | 'dark'>('light');
    const [copied, setCopied] = useState(false);

    const handleCopyConfig = () => {
        const t = brand.theme.tokens;
        const configString = `// ${brand.name} - Tailwind Config
colors: {
  primary: "${t.light.primary}",
  background: "${t.light.bg}",
  surface: "${t.light.surface}",
  foreground: "${t.light.text}",
}`;
        navigator.clipboard.writeText(configString);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-stone-50 text-stone-950">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-stone-50/80 backdrop-blur-sm border-b border-stone-200">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <Link
                        href="/generate"
                        onClick={(e) => { e.preventDefault(); onBack(); }}
                        className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="font-semibold tracking-tight">New Brand</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        {/* Mode Toggle */}
                        <div className="flex border border-stone-200 rounded-full p-0.5">
                            <button
                                onClick={() => setMode('light')}
                                className={`p-2 rounded-full transition-all ${mode === 'light' ? 'bg-stone-900 text-white' : 'text-stone-400 hover:text-stone-600'}`}
                            >
                                <Sun className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setMode('dark')}
                                className={`p-2 rounded-full transition-all ${mode === 'dark' ? 'bg-stone-900 text-white' : 'text-stone-400 hover:text-stone-600'}`}
                            >
                                <Moon className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Copy Config */}
                        <button
                            onClick={handleCopyConfig}
                            className="flex items-center gap-2 px-4 py-2 border border-stone-200 rounded-full text-sm font-medium hover:border-stone-900 transition-colors"
                        >
                            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                            {copied ? 'Copied!' : 'Copy Config'}
                        </button>
                    </div>
                </div>
            </header>

            {/* Bento Grid - 3x3 Layout */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-1 border border-stone-200 rounded-2xl overflow-hidden bg-stone-200">
                    {/* Row 1 */}
                    {/* A1: Logo + Brand Name */}
                    <div className="aspect-square md:aspect-auto md:h-64">
                        <LogoCell brand={brand} mode={mode} />
                    </div>

                    {/* A2: Business Cards */}
                    <div className="aspect-square md:aspect-auto md:h-64">
                        <BusinessCardsCell brand={brand} mode={mode} variant="primary" />
                    </div>

                    {/* A3: Mug */}
                    <div className="aspect-square md:aspect-auto md:h-64">
                        <MugCell brand={brand} mode={mode} variant="light" />
                    </div>

                    {/* Row 2 */}
                    {/* B1: Icon Variants */}
                    <div className="aspect-square md:aspect-auto md:h-64">
                        <IconVariantsCell brand={brand} mode={mode} variant="light" />
                    </div>

                    {/* B2: Tumbler */}
                    <div className="aspect-square md:aspect-auto md:h-64">
                        <TumblerCell brand={brand} mode={mode} variant="light" />
                    </div>

                    {/* B3: Tote Bag */}
                    <div className="aspect-square md:aspect-auto md:h-64">
                        <ToteBagCell brand={brand} mode={mode} variant="primary" />
                    </div>

                    {/* Row 3 */}
                    {/* C1: T-Shirt */}
                    <div className="aspect-square md:aspect-auto md:h-64">
                        <TShirtCell brand={brand} mode={mode} variant="primary" />
                    </div>

                    {/* C2: Typography */}
                    <div className="aspect-square md:aspect-auto md:h-64">
                        <TypographyCell brand={brand} mode={mode} variant="primary" />
                    </div>

                    {/* C3: Phone */}
                    <div className="aspect-square md:aspect-auto md:h-64">
                        <PhoneCell brand={brand} mode={mode} variant="light" />
                    </div>
                </div>

                {/* Palette Strip Below */}
                <div className="mt-1 border border-stone-200 rounded-2xl overflow-hidden h-24">
                    <PaletteCell brand={brand} mode={mode} />
                </div>

                {/* Code Cell */}
                <div className="mt-1 border border-stone-200 rounded-2xl overflow-hidden h-48">
                    <CodeCell brand={brand} mode={mode} />
                </div>
            </main>
        </div>
    );
}
