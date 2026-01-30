"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrandIdentity } from '@/lib/data';

// ============================================
// TYPES
// ============================================

type FontType = 'display' | 'body' | 'mono';
type FontWeight = 'light' | 'regular' | 'bold';

interface TypographySpecimenProps {
    brand: BrandIdentity;
    className?: string;
    showAllFonts?: boolean;
    compact?: boolean;
}

// ============================================
// CONSTANTS
// ============================================

const ALPHABET_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const ALPHABET_LOWER = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';

const WEIGHT_MAP: Record<FontWeight, { value: number; label: string }> = {
    light: { value: 300, label: 'Light' },
    regular: { value: 400, label: 'Regular' },
    bold: { value: 700, label: 'Bold' },
};

const FONT_TYPE_INFO: Record<FontType, { label: string; description: string; icon: string }> = {
    display: {
        label: 'Display',
        description: 'For headings and logo text',
        icon: 'Aa',
    },
    body: {
        label: 'Body',
        description: 'For paragraphs and content',
        icon: 'Bb',
    },
    mono: {
        label: 'Mono',
        description: 'For code and technical text',
        icon: '{}',
    },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

function getFontFamily(brand: BrandIdentity, type: FontType): string {
    switch (type) {
        case 'display':
            return brand.font.headingName || brand.font.heading || 'Inter';
        case 'body':
            return brand.font.bodyName || brand.font.body || 'Inter';
        case 'mono':
            return (brand.font as any).monoName || 'Roboto Mono';
        default:
            return 'Inter';
    }
}

function getFontClassName(brand: BrandIdentity, type: FontType): string {
    switch (type) {
        case 'display':
            return brand.font.heading || '';
        case 'body':
            return brand.font.body || '';
        case 'mono':
            return (brand.font as any).mono || '';
        default:
            return '';
    }
}

// ============================================
// SINGLE FONT SPECIMEN
// ============================================

function FontSpecimen({
    fontName,
    fontClassName,
    weight,
    primaryColor,
    textColor,
    compact = false,
}: {
    fontName: string;
    fontClassName: string;
    weight: FontWeight;
    primaryColor: string;
    textColor: string;
    compact?: boolean;
}) {
    const weightInfo = WEIGHT_MAP[weight];

    return (
        <div className={`${compact ? 'p-3' : 'p-4'}`}>
            {/* Weight label */}
            <div className="flex items-center gap-2 mb-2">
                <span
                    className="text-xs font-medium px-2 py-0.5 rounded"
                    style={{ background: primaryColor + '20', color: primaryColor }}
                >
                    {weightInfo.label}
                </span>
                <span className="text-xs opacity-50" style={{ color: textColor }}>
                    {weightInfo.value}
                </span>
            </div>

            {/* Alphabet specimen */}
            <div
                className={`${fontClassName} ${compact ? 'text-lg' : 'text-2xl'} leading-tight`}
                style={{
                    fontWeight: weightInfo.value,
                    color: textColor,
                    fontFamily: `"${fontName}", system-ui, sans-serif`,
                }}
            >
                {compact ? 'AaBbCc' : ALPHABET_UPPER}
            </div>

            {!compact && (
                <>
                    <div
                        className={`${fontClassName} text-2xl leading-tight mt-1`}
                        style={{
                            fontWeight: weightInfo.value,
                            color: textColor,
                            fontFamily: `"${fontName}", system-ui, sans-serif`,
                        }}
                    >
                        {ALPHABET_LOWER}
                    </div>

                    <div
                        className={`${fontClassName} text-xl leading-tight mt-2 opacity-70`}
                        style={{
                            fontWeight: weightInfo.value,
                            color: textColor,
                            fontFamily: `"${fontName}", system-ui, sans-serif`,
                        }}
                    >
                        {NUMBERS}
                    </div>
                </>
            )}
        </div>
    );
}

// ============================================
// FONT TYPE CARD
// ============================================

function FontTypeCard({
    brand,
    type,
    isSelected,
    onSelect,
    compact = false,
}: {
    brand: BrandIdentity;
    type: FontType;
    isSelected: boolean;
    onSelect: () => void;
    compact?: boolean;
}) {
    const colors = brand.theme.tokens.light;
    const fontName = getFontFamily(brand, type);
    const fontClassName = getFontClassName(brand, type);
    const info = FONT_TYPE_INFO[type];

    // Skip mono if not available
    if (type === 'mono' && !(brand.font as any).monoName) {
        return null;
    }

    return (
        <motion.button
            onClick={onSelect}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`
                text-left rounded-xl border-2 transition-all overflow-hidden
                ${isSelected
                    ? 'border-blue-500 ring-2 ring-blue-500/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }
            `}
            style={{ background: colors.bg }}
        >
            {/* Header */}
            <div
                className="px-4 py-3 border-b flex items-center justify-between"
                style={{ borderColor: colors.border }}
            >
                <div>
                    <span className="text-lg font-bold mr-2" style={{ color: colors.primary }}>
                        {info.icon}
                    </span>
                    <span className="font-semibold" style={{ color: colors.text }}>
                        {info.label}
                    </span>
                </div>
                <span className="text-sm" style={{ color: colors.muted }}>
                    {fontName}
                </span>
            </div>

            {/* Preview */}
            <div className="px-4 py-4">
                <div
                    className={`${fontClassName} text-4xl font-bold leading-none`}
                    style={{
                        color: colors.text,
                        fontFamily: `"${fontName}", system-ui, sans-serif`,
                    }}
                >
                    AaBbCc
                </div>
                <p className="text-xs mt-2 opacity-60" style={{ color: colors.text }}>
                    {info.description}
                </p>
            </div>
        </motion.button>
    );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function TypographySpecimen({
    brand,
    className = '',
    showAllFonts = false,
    compact = false,
}: TypographySpecimenProps) {
    const [selectedType, setSelectedType] = useState<FontType>('display');
    const [selectedWeight, setSelectedWeight] = useState<FontWeight>('regular');

    const colors = brand.theme.tokens.light;
    const fontName = getFontFamily(brand, selectedType);
    const fontClassName = getFontClassName(brand, selectedType);

    const fontTypes: FontType[] = (brand.font as any).monoName
        ? ['display', 'body', 'mono']
        : ['display', 'body'];

    // Grid view showing all fonts
    if (showAllFonts) {
        return (
            <div className={`space-y-6 ${className}`}>
                {/* Font Type Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {fontTypes.map((type) => (
                        <FontTypeCard
                            key={type}
                            brand={brand}
                            type={type}
                            isSelected={selectedType === type}
                            onSelect={() => setSelectedType(type)}
                            compact={compact}
                        />
                    ))}
                </div>

                {/* Full Specimen for Selected Font */}
                <div
                    className="rounded-xl border overflow-hidden"
                    style={{ borderColor: colors.border, background: colors.bg }}
                >
                    {/* Header */}
                    <div
                        className="px-6 py-4 border-b flex items-center justify-between"
                        style={{ borderColor: colors.border }}
                    >
                        <div>
                            <h3 className="font-bold text-lg" style={{ color: colors.text }}>
                                {fontName}
                            </h3>
                            <p className="text-sm opacity-60" style={{ color: colors.text }}>
                                {FONT_TYPE_INFO[selectedType].description}
                            </p>
                        </div>

                        {/* Weight selector */}
                        <div className="flex gap-2">
                            {(['light', 'regular', 'bold'] as FontWeight[]).map((weight) => (
                                <button
                                    key={weight}
                                    onClick={() => setSelectedWeight(weight)}
                                    className={`
                                        px-3 py-1 rounded-md text-sm transition-all
                                        ${selectedWeight === weight
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                                        }
                                    `}
                                    style={{
                                        color: selectedWeight === weight ? 'white' : colors.text,
                                    }}
                                >
                                    {WEIGHT_MAP[weight].label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Specimen */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${selectedType}-${selectedWeight}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.15 }}
                            className="p-6"
                        >
                            {/* Large preview */}
                            <div
                                className={`${fontClassName} text-6xl md:text-7xl leading-none mb-6`}
                                style={{
                                    fontWeight: WEIGHT_MAP[selectedWeight].value,
                                    color: colors.text,
                                    fontFamily: `"${fontName}", system-ui, sans-serif`,
                                }}
                            >
                                AaBbCc
                            </div>

                            {/* Full alphabet */}
                            <div className="space-y-4">
                                <div
                                    className={`${fontClassName} text-2xl leading-relaxed tracking-wide`}
                                    style={{
                                        fontWeight: WEIGHT_MAP[selectedWeight].value,
                                        color: colors.text,
                                        fontFamily: `"${fontName}", system-ui, sans-serif`,
                                    }}
                                >
                                    {ALPHABET_UPPER}
                                </div>
                                <div
                                    className={`${fontClassName} text-2xl leading-relaxed tracking-wide`}
                                    style={{
                                        fontWeight: WEIGHT_MAP[selectedWeight].value,
                                        color: colors.text,
                                        fontFamily: `"${fontName}", system-ui, sans-serif`,
                                    }}
                                >
                                    {ALPHABET_LOWER}
                                </div>
                                <div
                                    className={`${fontClassName} text-xl leading-relaxed tracking-wide opacity-70`}
                                    style={{
                                        fontWeight: WEIGHT_MAP[selectedWeight].value,
                                        color: colors.text,
                                        fontFamily: `"${fontName}", system-ui, sans-serif`,
                                    }}
                                >
                                    {NUMBERS}
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        );
    }

    // Compact single view
    return (
        <div className={`${className}`}>
            {/* Font type tabs */}
            <div className="flex gap-2 mb-4 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                {fontTypes.map((type) => {
                    const info = FONT_TYPE_INFO[type];
                    const isSelected = selectedType === type;

                    return (
                        <button
                            key={type}
                            onClick={() => setSelectedType(type)}
                            className={`
                                flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all
                                ${isSelected
                                    ? 'bg-white dark:bg-gray-700 shadow-sm'
                                    : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                                }
                            `}
                            style={{
                                color: isSelected ? colors.text : colors.muted,
                            }}
                        >
                            <span className="mr-1">{info.icon}</span>
                            {info.label}
                        </button>
                    );
                })}
            </div>

            {/* Specimen card */}
            <div
                className="rounded-xl border overflow-hidden"
                style={{ borderColor: colors.border, background: colors.bg }}
            >
                <div className="p-4 border-b" style={{ borderColor: colors.border }}>
                    <h4 className="font-semibold" style={{ color: colors.text }}>
                        {fontName}
                    </h4>
                </div>

                <div className="divide-y" style={{ borderColor: colors.border }}>
                    {(['light', 'regular', 'bold'] as FontWeight[]).map((weight) => (
                        <FontSpecimen
                            key={weight}
                            fontName={fontName}
                            fontClassName={fontClassName}
                            weight={weight}
                            primaryColor={colors.primary}
                            textColor={colors.text}
                            compact={compact}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

// ============================================
// TYPOGRAPHY OVERVIEW (for brand slides)
// ============================================

export function TypographyOverview({ brand }: { brand: BrandIdentity }) {
    const colors = brand.theme.tokens.light;
    const displayFont = getFontFamily(brand, 'display');
    const bodyFont = getFontFamily(brand, 'body');
    const monoFont = (brand.font as any).monoName;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Display Font */}
            <div
                className="p-6 rounded-xl border"
                style={{ borderColor: colors.border, background: colors.surface }}
            >
                <div className="flex items-center gap-2 mb-4">
                    <span
                        className="text-xs font-medium px-2 py-1 rounded"
                        style={{ background: colors.primary, color: colors.bg }}
                    >
                        Display
                    </span>
                    <span className="text-sm font-medium" style={{ color: colors.text }}>
                        {displayFont}
                    </span>
                </div>

                <div
                    className="text-5xl font-bold mb-4"
                    style={{
                        color: colors.text,
                        fontFamily: `"${displayFont}", system-ui, sans-serif`,
                    }}
                >
                    AaBbCc
                </div>

                <div
                    className="text-sm opacity-70 leading-relaxed"
                    style={{
                        color: colors.text,
                        fontFamily: `"${displayFont}", system-ui, sans-serif`,
                    }}
                >
                    {ALPHABET_UPPER}
                    <br />
                    {ALPHABET_LOWER}
                    <br />
                    {NUMBERS}
                </div>
            </div>

            {/* Body Font */}
            <div
                className="p-6 rounded-xl border"
                style={{ borderColor: colors.border, background: colors.surface }}
            >
                <div className="flex items-center gap-2 mb-4">
                    <span
                        className="text-xs font-medium px-2 py-1 rounded"
                        style={{ background: colors.muted, color: colors.bg }}
                    >
                        Body
                    </span>
                    <span className="text-sm font-medium" style={{ color: colors.text }}>
                        {bodyFont}
                    </span>
                </div>

                <div
                    className="text-5xl font-normal mb-4"
                    style={{
                        color: colors.text,
                        fontFamily: `"${bodyFont}", system-ui, sans-serif`,
                    }}
                >
                    AaBbCc
                </div>

                <div
                    className="text-sm opacity-70 leading-relaxed"
                    style={{
                        color: colors.text,
                        fontFamily: `"${bodyFont}", system-ui, sans-serif`,
                    }}
                >
                    {ALPHABET_UPPER}
                    <br />
                    {ALPHABET_LOWER}
                    <br />
                    {NUMBERS}
                </div>
            </div>

            {/* Mono Font (if available) */}
            {monoFont && (
                <div
                    className="p-6 rounded-xl border md:col-span-2"
                    style={{ borderColor: colors.border, background: colors.surface }}
                >
                    <div className="flex items-center gap-2 mb-4">
                        <span
                            className="text-xs font-medium px-2 py-1 rounded bg-gray-800 text-white"
                        >
                            Mono
                        </span>
                        <span className="text-sm font-medium" style={{ color: colors.text }}>
                            {monoFont}
                        </span>
                    </div>

                    <div
                        className="text-3xl font-normal mb-4 font-mono"
                        style={{
                            color: colors.text,
                            fontFamily: `"${monoFont}", monospace`,
                        }}
                    >
                        {'{ code: "example" }'}
                    </div>

                    <div
                        className="text-sm opacity-70 font-mono"
                        style={{
                            color: colors.text,
                            fontFamily: `"${monoFont}", monospace`,
                        }}
                    >
                        {ALPHABET_UPPER} {NUMBERS}
                    </div>
                </div>
            )}
        </div>
    );
}

// ============================================
// TYPOGRAPHY TEASER (Poster-style for Overview tab)
// ============================================

export function TypographyTeaser({
    brand,
    className = '',
    onClick
}: {
    brand: BrandIdentity;
    className?: string;
    onClick?: () => void;
}) {
    const colors = brand.theme.tokens.light;
    const displayFont = getFontFamily(brand, 'display');
    const fontClassName = getFontClassName(brand, 'display');

    return (
        <button
            onClick={onClick}
            className={`
                relative w-full overflow-hidden rounded-2xl border transition-all group
                hover:scale-[1.01] hover:shadow-xl active:scale-[0.99]
                ${className}
            `}
            style={{
                borderColor: colors.border,
                background: `linear-gradient(135deg, ${colors.surface} 0%, ${colors.bg} 100%)`,
            }}
        >
            {/* Gradient Overlay from Primary Color */}
            <div
                className="absolute inset-0 opacity-30"
                style={{
                    background: `radial-gradient(circle at bottom right, ${colors.primary}40 0%, transparent 60%)`,
                }}
            />

            {/* Content */}
            <div className="relative z-10 p-8 md:p-12 flex flex-col items-center justify-center min-h-[280px] md:min-h-[320px]">

                {/* Massive "Aa" */}
                <div
                    className={`
                        text-[120px] md:text-[180px] lg:text-[220px] leading-none tracking-tight
                        transition-all group-hover:scale-105
                        ${fontClassName}
                    `}
                    style={{
                        fontFamily: `"${displayFont}", system-ui, sans-serif`,
                        fontWeight: 700,
                        color: colors.text,
                    }}
                >
                    Aa
                </div>

                {/* Font Name Badge */}
                <div className="mt-4 flex items-center gap-2">
                    <span
                        className="px-3 py-1.5 text-xs font-semibold rounded-full uppercase tracking-wider"
                        style={{
                            backgroundColor: colors.primary,
                            color: colors.bg,
                        }}
                    >
                        Typeface
                    </span>
                    <span
                        className="text-sm font-medium"
                        style={{ color: colors.muted }}
                    >
                        {displayFont}
                    </span>
                </div>

            </div>

            {/* Subtle Arrow Hint */}
            <div
                className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-60 transition-opacity"
                style={{ color: colors.muted }}
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
            </div>
        </button>
    );
}

export default TypographySpecimen;

