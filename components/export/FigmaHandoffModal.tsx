'use client';

/**
 * Figma Handoff Modal
 *
 * A visual preview-based export experience for Figma.
 * Shows what will be exported (Logo, Colors, Typography) and provides
 * one-tap export functionality via Tokens Studio JSON download.
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
} from 'lucide-react';
import { BrandIdentity } from '@/lib/data';
import { getStoredLogoSVG } from '@/components/logo-engine/renderers/stored-logo-export';
import { FigmaLogo, FigmaLogoCompact } from '@/components/icons/FigmaLogo';

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

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);
    const [copiedTokens, setCopiedTokens] = useState(false);

    const tokens = brand.theme.tokens.light;
    const logoSvg = getStoredLogoSVG(brand);

    // Generate Tokens Studio compatible JSON
    const generateTokensStudioJSON = () => {
        return {
            "$themes": [],
            "$metadata": {
                "tokenSetOrder": ["brand", "typography", "colors"]
            },
            "brand": {
                "name": { "value": brand.name, "type": "other" },
                "tagline": { "value": (brand as any).tagline || "", "type": "other" },
            },
            "colors": {
                "primary": { "value": tokens.primary, "type": "color" },
                "background": { "value": tokens.bg, "type": "color" },
                "surface": { "value": tokens.surface, "type": "color" },
                "text": { "value": tokens.text, "type": "color" },
                "muted": { "value": tokens.muted, "type": "color" },
                "accent": { "value": tokens.accent, "type": "color" },
                "border": { "value": tokens.border, "type": "color" },
            },
            "typography": {
                "heading": {
                    "fontFamily": { "value": brand.font?.headingName || "Inter", "type": "fontFamilies" },
                },
                "body": {
                    "fontFamily": { "value": brand.font?.bodyName || "Inter", "type": "fontFamilies" },
                },
            },
        };
    };

    const handleExport = async () => {
        if (!hasFigmaAccess) {
            onUpgrade?.();
            return;
        }

        // Generate the JSON
        const tokensJSON = generateTokensStudioJSON();

        // Create downloadable file
        const blob = new Blob([JSON.stringify(tokensJSON, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${brand.name.toLowerCase().replace(/\s+/g, '-')}-figma-tokens.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Also copy to clipboard
        await navigator.clipboard.writeText(JSON.stringify(tokensJSON, null, 2));

        setExported(true);
        setTimeout(() => setExported(false), 3000);
    };

    const handleCopyTokens = async () => {
        const tokensJSON = generateTokensStudioJSON();
        await navigator.clipboard.writeText(JSON.stringify(tokensJSON, null, 2));
        setCopiedTokens(true);
        setTimeout(() => setCopiedTokens(false), 2000);
    };

    const colorSwatches = [
        { name: 'Primary', color: tokens.primary },
        { name: 'Background', color: tokens.bg },
        { name: 'Surface', color: tokens.surface },
        { name: 'Text', color: tokens.text },
        { name: 'Accent', color: tokens.accent },
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

                        {/* Content - Horizontal Grid Layout */}
                        <div className="p-4 overflow-y-auto">
                            <div className="grid grid-cols-3 gap-3">
                                {/* Logo Preview */}
                                <div className="bg-stone-50 rounded-xl p-4 border border-stone-100">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Image className="w-3.5 h-3.5 text-stone-400" />
                                        <span className="text-xs font-semibold text-stone-600">Logo</span>
                                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500 ml-auto" />
                                    </div>
                                    <div className="flex justify-center py-2">
                                        <div
                                            className="w-20 h-20 rounded-lg bg-white shadow-sm border border-stone-100 p-3"
                                            dangerouslySetInnerHTML={{ __html: logoSvg }}
                                        />
                                    </div>
                                    <p className="text-[10px] text-stone-400 text-center mt-2">SVG vector</p>
                                </div>

                                {/* Colors Preview */}
                                <div className="bg-stone-50 rounded-xl p-4 border border-stone-100">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Palette className="w-3.5 h-3.5 text-stone-400" />
                                        <span className="text-xs font-semibold text-stone-600">Colors</span>
                                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500 ml-auto" />
                                    </div>
                                    <div className="flex gap-1.5 flex-wrap justify-center">
                                        {colorSwatches.map((swatch) => (
                                            <div key={swatch.name} className="flex flex-col items-center gap-0.5">
                                                <div
                                                    className="w-10 h-10 rounded-md shadow-sm border border-stone-200"
                                                    style={{ backgroundColor: swatch.color }}
                                                />
                                                <span className="text-[9px] text-stone-400">{swatch.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Typography Preview */}
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
                                    <p className="font-medium text-stone-600">How to import:</p>
                                    <ol className="list-decimal list-inside space-y-0.5 text-stone-500">
                                        <li>Install the <span className="font-semibold text-stone-700">Glyph</span> plugin in Figma</li>
                                        <li>Open plugin → Import → Paste or load JSON file</li>
                                        <li>Your brand tokens will be ready to use!</li>
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
