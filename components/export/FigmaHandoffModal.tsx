'use client';

/**
 * Figma Handoff Modal
 *
 * A comprehensive export experience for Figma.
 * Shows what will be exported (Logo variations, Colors, Typography) and provides
 * one-tap export functionality via Tokens Studio JSON or full ZIP package.
 *
 * CRITICAL: Syncs export state before any export to ensure consistency.
 */

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Download,
    Palette,
    Type,
    Image,
    CheckCircle2,
    Sparkles,
    ExternalLink,
    Copy,
    Check,
    Layers,
    Moon,
    Sun,
} from 'lucide-react';
import { BrandIdentity } from '@/lib/data';
import {
    getStoredLogoSVG,
    getSelectedLogo,
    getLogoVariationsForExport,
} from '@/components/logo-engine/renderers/stored-logo-export';
import { setExportState } from '@/lib/export-state';
import { FigmaLogo, FigmaLogoCompact } from '@/components/icons/FigmaLogo';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface FigmaHandoffModalProps {
    isOpen: boolean;
    onClose: () => void;
    brand: BrandIdentity;
    hasFigmaAccess: boolean;
    onUpgrade?: () => void;
}

export function FigmaHandoffModal({
    isOpen,
    onClose,
    brand,
    hasFigmaAccess,
    onUpgrade,
}: FigmaHandoffModalProps) {
    const [mounted, setMounted] = useState(false);
    const [exported, setExported] = useState(false);
    const [copiedTokens, setCopiedTokens] = useState(false);
    const [activeTab, setActiveTab] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // CRITICAL: Sync export state when modal opens
    useEffect(() => {
        if (isOpen) {
            const selectedLogo = getSelectedLogo(brand);
            const storedSvg = selectedLogo?.svg || '';
            if (storedSvg) {
                setExportState(brand, storedSvg, selectedLogo);
            }
        }
    }, [isOpen, brand]);

    const lightTokens = brand.theme.tokens.light;
    const darkTokens = brand.theme.tokens.dark;
    const tokens = activeTab === 'light' ? lightTokens : darkTokens;
    const logoSvg = getStoredLogoSVG(brand, 'color');

    // Get logo variations for preview
    const getLogoVariations = () => {
        try {
            return getLogoVariationsForExport(brand);
        } catch {
            return null;
        }
    };

    // Generate comprehensive Tokens Studio compatible JSON
    const generateTokensStudioJSON = () => {
        return {
            "$themes": [
                { "id": "light", "name": "Light", "selectedTokenSets": { "light": "enabled" } },
                { "id": "dark", "name": "Dark", "selectedTokenSets": { "dark": "enabled" } }
            ],
            "$metadata": {
                "tokenSetOrder": ["global", "light", "dark"],
                "generator": "Glyph",
                "brand": brand.name,
                "exportedAt": new Date().toISOString()
            },
            "global": {
                "brand": {
                    "name": { "value": brand.name, "type": "other" },
                    "tagline": { "value": (brand as any).tagline || "", "type": "other" },
                },
                "typography": {
                    "fontFamilies": {
                        "heading": { "value": brand.font?.headingName || "Inter", "type": "fontFamilies" },
                        "body": { "value": brand.font?.bodyName || "Inter", "type": "fontFamilies" },
                        "mono": { "value": brand.font?.monoName || "monospace", "type": "fontFamilies" },
                    },
                    "fontWeights": {
                        "regular": { "value": "400", "type": "fontWeights" },
                        "medium": { "value": "500", "type": "fontWeights" },
                        "semibold": { "value": "600", "type": "fontWeights" },
                        "bold": { "value": "700", "type": "fontWeights" },
                    },
                    "fontSize": {
                        "xs": { "value": "12", "type": "fontSizes" },
                        "sm": { "value": "14", "type": "fontSizes" },
                        "base": { "value": "16", "type": "fontSizes" },
                        "lg": { "value": "18", "type": "fontSizes" },
                        "xl": { "value": "20", "type": "fontSizes" },
                        "2xl": { "value": "24", "type": "fontSizes" },
                        "3xl": { "value": "30", "type": "fontSizes" },
                        "4xl": { "value": "36", "type": "fontSizes" },
                        "5xl": { "value": "48", "type": "fontSizes" },
                    },
                    "lineHeight": {
                        "tight": { "value": "1.25", "type": "lineHeights" },
                        "normal": { "value": "1.5", "type": "lineHeights" },
                        "relaxed": { "value": "1.75", "type": "lineHeights" },
                    },
                },
                "spacing": {
                    "xs": { "value": "4", "type": "spacing" },
                    "sm": { "value": "8", "type": "spacing" },
                    "md": { "value": "16", "type": "spacing" },
                    "lg": { "value": "24", "type": "spacing" },
                    "xl": { "value": "32", "type": "spacing" },
                    "2xl": { "value": "48", "type": "spacing" },
                    "3xl": { "value": "64", "type": "spacing" },
                },
                "borderRadius": {
                    "none": { "value": "0", "type": "borderRadius" },
                    "sm": { "value": "4", "type": "borderRadius" },
                    "md": { "value": "8", "type": "borderRadius" },
                    "lg": { "value": "12", "type": "borderRadius" },
                    "xl": { "value": "16", "type": "borderRadius" },
                    "full": { "value": "9999", "type": "borderRadius" },
                },
            },
            "light": {
                "colors": {
                    "primary": { "value": lightTokens.primary, "type": "color" },
                    "accent": { "value": lightTokens.accent || lightTokens.primary, "type": "color" },
                    "background": { "value": lightTokens.bg, "type": "color" },
                    "surface": { "value": lightTokens.surface, "type": "color" },
                    "text": { "value": lightTokens.text, "type": "color" },
                    "muted": { "value": lightTokens.muted || '#666666', "type": "color" },
                    "border": { "value": lightTokens.border || '#e5e5e5', "type": "color" },
                },
            },
            "dark": {
                "colors": {
                    "primary": { "value": darkTokens?.primary || lightTokens.primary, "type": "color" },
                    "accent": { "value": darkTokens?.accent || lightTokens.accent || lightTokens.primary, "type": "color" },
                    "background": { "value": darkTokens?.bg || '#0a0a0a', "type": "color" },
                    "surface": { "value": darkTokens?.surface || '#1a1a1a', "type": "color" },
                    "text": { "value": darkTokens?.text || '#ffffff', "type": "color" },
                    "muted": { "value": darkTokens?.muted || '#888888', "type": "color" },
                    "border": { "value": darkTokens?.border || '#333333', "type": "color" },
                },
            },
        };
    };

    // Export complete ZIP package with logos + tokens
    const handleExport = async () => {
        if (!hasFigmaAccess) {
            onUpgrade?.();
            return;
        }

        try {
            const zip = new JSZip();
            const brandSlug = brand.name.toLowerCase().replace(/\s+/g, '-');

            // 1. Add Tokens Studio JSON
            const tokensJSON = generateTokensStudioJSON();
            zip.file('tokens.json', JSON.stringify(tokensJSON, null, 2));

            // 2. Add all logo variations as SVG
            const logosFolder = zip.folder('logos');
            if (logosFolder) {
                // Main logo (color)
                const colorLogo = getStoredLogoSVG(brand, 'color');
                if (colorLogo) {
                    logosFolder.file('logo-color.svg', colorLogo);
                }

                // Black version
                const blackLogo = getStoredLogoSVG(brand, 'black');
                if (blackLogo) {
                    logosFolder.file('logo-black.svg', blackLogo);
                }

                // White version
                const whiteLogo = getStoredLogoSVG(brand, 'white');
                if (whiteLogo) {
                    logosFolder.file('logo-white.svg', whiteLogo);
                }

                // Get all variations
                const variations = getLogoVariations();
                if (variations) {
                    if (variations.horizontal) {
                        logosFolder.file('logo-horizontal.svg', variations.horizontal);
                    }
                    if (variations.stacked) {
                        logosFolder.file('logo-stacked.svg', variations.stacked);
                    }
                    if (variations.iconOnly) {
                        logosFolder.file('logo-icon.svg', variations.iconOnly);
                    }
                    if (variations.wordmarkOnly) {
                        logosFolder.file('logo-wordmark.svg', variations.wordmarkOnly);
                    }
                }
            }

            // 3. Add Figma plugin import format
            const figmaPluginData = {
                version: "2.0",
                name: brand.name,
                generator: "Glyph",
                tokens: tokensJSON,
                assets: {
                    logos: ['logo-color.svg', 'logo-black.svg', 'logo-white.svg', 'logo-horizontal.svg', 'logo-stacked.svg', 'logo-icon.svg', 'logo-wordmark.svg']
                }
            };
            zip.file('figma-import.json', JSON.stringify(figmaPluginData, null, 2));

            // 4. Add README
            zip.file('README.md', `# ${brand.name} - Figma Export

## Contents

- \`tokens.json\` - Tokens Studio compatible design tokens
- \`figma-import.json\` - Figma plugin import format
- \`logos/\` - All logo variations in SVG format

## How to Import

### Option 1: Tokens Studio Plugin (Recommended)
1. Install "Tokens Studio for Figma" plugin
2. Open plugin → Settings → Import
3. Select \`tokens.json\`
4. Your tokens are ready to use!

### Option 2: Manual Import
1. Drag SVG files from \`logos/\` folder into Figma
2. Use color values from \`tokens.json\` to create color styles
3. Set up text styles with the typography values

## Color Tokens

### Light Mode
- Primary: ${lightTokens.primary}
- Background: ${lightTokens.bg}
- Surface: ${lightTokens.surface}
- Text: ${lightTokens.text}

### Dark Mode
- Primary: ${darkTokens?.primary || lightTokens.primary}
- Background: ${darkTokens?.bg || '#0a0a0a'}
- Surface: ${darkTokens?.surface || '#1a1a1a'}
- Text: ${darkTokens?.text || '#ffffff'}

## Typography
- Heading: ${brand.font?.headingName || 'Inter'}
- Body: ${brand.font?.bodyName || 'Inter'}

---
Generated by Glyph - https://glyph.software
`);

            // Generate and download ZIP
            const content = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
            saveAs(content, `${brandSlug}-figma-export.zip`);

            setExported(true);
            setTimeout(() => setExported(false), 3000);
        } catch (e) {
            console.error('Figma export failed:', e);
            alert('Export failed. Please try again.');
        }
    };

    const handleCopyTokens = async () => {
        const tokensJSON = generateTokensStudioJSON();
        await navigator.clipboard.writeText(JSON.stringify(tokensJSON, null, 2));
        setCopiedTokens(true);
        setTimeout(() => setCopiedTokens(false), 2000);
    };

    // All color swatches including muted and border
    const colorSwatches = [
        { name: 'Primary', color: tokens?.primary || lightTokens.primary },
        { name: 'Background', color: tokens?.bg || lightTokens.bg },
        { name: 'Surface', color: tokens?.surface || lightTokens.surface },
        { name: 'Text', color: tokens?.text || lightTokens.text },
        { name: 'Accent', color: tokens?.accent || lightTokens.accent || lightTokens.primary },
        { name: 'Muted', color: tokens?.muted || '#666666' },
        { name: 'Border', color: tokens?.border || '#e5e5e5' },
    ];

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 md:p-8"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 20, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header - Uses brand primary color */}
                        <div
                            className="px-6 py-4 flex items-center justify-between"
                            style={{ backgroundColor: tokens.primary }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                    <FigmaLogoCompact size={22} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white">Figma Handoff</h2>
                                    <p className="text-sm text-white/70">Export brand assets to Figma</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                            >
                                <X className="w-4 h-4 text-white" />
                            </button>
                        </div>

                        {/* Content - Enhanced Grid Layout */}
                        <div className="p-4 overflow-y-auto max-h-[60vh]">
                            <div className="grid grid-cols-3 gap-3">
                                {/* Logo Preview - Shows variations */}
                                <div className="bg-stone-50 rounded-xl p-4 border border-stone-100">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Layers className="w-3.5 h-3.5 text-stone-400" />
                                        <span className="text-xs font-semibold text-stone-600">Logo Variations</span>
                                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500 ml-auto" />
                                    </div>
                                    <div className="flex justify-center py-2">
                                        <div
                                            className="w-16 h-16 rounded-lg bg-white shadow-sm border border-stone-100 p-2"
                                            dangerouslySetInnerHTML={{ __html: logoSvg }}
                                        />
                                    </div>
                                    <div className="flex gap-1 justify-center mt-2">
                                        <div className="w-8 h-8 rounded bg-white border border-stone-200 p-1" title="Color">
                                            <div
                                                className="w-full h-full"
                                                dangerouslySetInnerHTML={{ __html: logoSvg }}
                                                style={{ transform: 'scale(0.8)', transformOrigin: 'center' }}
                                            />
                                        </div>
                                        <div className="w-8 h-8 rounded bg-stone-900 border border-stone-700 p-1" title="Light on Dark">
                                            <div
                                                className="w-full h-full"
                                                style={{ filter: 'brightness(0) invert(1)', transform: 'scale(0.8)', transformOrigin: 'center' }}
                                                dangerouslySetInnerHTML={{ __html: logoSvg }}
                                            />
                                        </div>
                                        <div className="w-8 h-8 rounded bg-white border border-stone-200 p-1" title="Black">
                                            <div
                                                className="w-full h-full"
                                                style={{ filter: 'brightness(0)', transform: 'scale(0.8)', transformOrigin: 'center' }}
                                                dangerouslySetInnerHTML={{ __html: logoSvg }}
                                            />
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-stone-400 text-center mt-2">7 SVG variations</p>
                                </div>

                                {/* Colors Preview - With Light/Dark toggle */}
                                <div className="bg-stone-50 rounded-xl p-4 border border-stone-100">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Palette className="w-3.5 h-3.5 text-stone-400" />
                                        <span className="text-xs font-semibold text-stone-600">Colors</span>
                                        {/* Light/Dark Toggle */}
                                        <div className="flex gap-1 ml-auto mr-1">
                                            <button
                                                onClick={() => setActiveTab('light')}
                                                className={`p-1 rounded ${activeTab === 'light' ? 'bg-white shadow-sm' : 'opacity-50'}`}
                                                title="Light Mode"
                                            >
                                                <Sun className="w-3 h-3" />
                                            </button>
                                            <button
                                                onClick={() => setActiveTab('dark')}
                                                className={`p-1 rounded ${activeTab === 'dark' ? 'bg-white shadow-sm' : 'opacity-50'}`}
                                                title="Dark Mode"
                                            >
                                                <Moon className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                    </div>
                                    <div className="grid grid-cols-4 gap-1">
                                        {colorSwatches.slice(0, 4).map((swatch) => (
                                            <div key={swatch.name} className="flex flex-col items-center gap-0.5">
                                                <div
                                                    className="w-9 h-9 rounded-md shadow-sm border border-stone-200"
                                                    style={{ backgroundColor: swatch.color }}
                                                    title={swatch.color}
                                                />
                                                <span className="text-[8px] text-stone-400 truncate w-full text-center">{swatch.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-3 gap-1 mt-1">
                                        {colorSwatches.slice(4).map((swatch) => (
                                            <div key={swatch.name} className="flex flex-col items-center gap-0.5">
                                                <div
                                                    className="w-9 h-9 rounded-md shadow-sm border border-stone-200"
                                                    style={{ backgroundColor: swatch.color }}
                                                    title={swatch.color}
                                                />
                                                <span className="text-[8px] text-stone-400 truncate w-full text-center">{swatch.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Typography Preview - Enhanced */}
                                <div className="bg-stone-50 rounded-xl p-4 border border-stone-100">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Type className="w-3.5 h-3.5 text-stone-400" />
                                        <span className="text-xs font-semibold text-stone-600">Typography</span>
                                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500 ml-auto" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] text-stone-400">Heading</span>
                                            <span
                                                className="text-sm font-bold text-stone-800"
                                                style={{ fontFamily: brand.font?.headingName || 'Inter' }}
                                            >
                                                {brand.font?.headingName || 'Inter'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] text-stone-400">Body</span>
                                            <span
                                                className="text-sm text-stone-600"
                                                style={{ fontFamily: brand.font?.bodyName || 'Inter' }}
                                            >
                                                {brand.font?.bodyName || 'Inter'}
                                            </span>
                                        </div>
                                        {brand.font?.monoName && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] text-stone-400">Mono</span>
                                                <span
                                                    className="text-sm text-stone-600"
                                                    style={{ fontFamily: brand.font?.monoName }}
                                                >
                                                    {brand.font?.monoName}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-3 pt-2 border-t border-stone-200">
                                        <p className="text-[9px] text-stone-400">+ Font sizes, weights, line heights</p>
                                    </div>
                                </div>
                            </div>

                            {/* Pro Gate */}
                            {!hasFigmaAccess && (
                                <div className="mt-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-3 border border-amber-200">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center">
                                            <Sparkles className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm text-amber-900">Unlock Figma Export</p>
                                            <p className="text-xs text-amber-700">Upgrade to Pro for one-tap Figma handoff</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex gap-3">
                            <button
                                onClick={handleCopyTokens}
                                disabled={!hasFigmaAccess}
                                className={`flex-1 h-11 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${hasFigmaAccess
                                    ? 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                                    : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                                    }`}
                            >
                                {copiedTokens ? (
                                    <>
                                        <Check className="w-4 h-4 text-green-600" />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4" />
                                        Copy Tokens
                                    </>
                                )}
                            </button>
                            <button
                                onClick={handleExport}
                                className={`flex-1 h-11 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${!hasFigmaAccess
                                    ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:shadow-lg'
                                    : exported
                                        ? 'bg-green-500 text-white'
                                        : 'text-white hover:shadow-lg'
                                    }`}
                                style={hasFigmaAccess && !exported ? { backgroundColor: tokens.primary } : undefined}
                            >
                                {!hasFigmaAccess ? (
                                    <>
                                        <Sparkles className="w-4 h-4" />
                                        Upgrade to Export
                                    </>
                                ) : exported ? (
                                    <>
                                        <CheckCircle2 className="w-4 h-4" />
                                        Exported!
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-4 h-4" />
                                        Export to Figma
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Instructions */}
                        {hasFigmaAccess && (
                            <div className="px-6 pb-4 bg-stone-50">
                                <div className="text-xs text-stone-500 space-y-1">
                                    <p className="font-medium text-stone-600">What&apos;s included in the ZIP:</p>
                                    <ul className="list-disc list-inside space-y-0.5 text-stone-500 ml-1">
                                        <li><span className="font-medium text-stone-700">tokens.json</span> - Tokens Studio compatible</li>
                                        <li><span className="font-medium text-stone-700">logos/</span> - 7 SVG variations (color, black, white, horizontal, stacked, icon, wordmark)</li>
                                        <li><span className="font-medium text-stone-700">figma-import.json</span> - Full brand data</li>
                                    </ul>
                                    <p className="font-medium text-stone-600 mt-2">How to import:</p>
                                    <ol className="list-decimal list-inside space-y-0.5 text-stone-500">
                                        <li>Install <span className="font-semibold text-stone-700">Tokens Studio</span> plugin in Figma</li>
                                        <li>Open plugin → Settings → Import → Select tokens.json</li>
                                        <li>Drag logo SVGs directly into your Figma file</li>
                                    </ol>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}
