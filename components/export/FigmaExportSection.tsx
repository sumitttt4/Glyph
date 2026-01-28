"use client";

import React, { useState } from 'react';
import { BrandIdentity } from '@/lib/data';
import { Figma, Copy, Check, Loader2, Lock, Code2, Sparkles } from 'lucide-react';
import { useSubscription } from '@/hooks/use-subscription';
import { UpgradeModal } from '@/components/generator/UpgradeModal';
import {
    copyFigmaTokens,
    copySVGWithGrid,
    copyTailwindConfig,
} from '@/components/export/figma-tokens';
import { cn } from '@/lib/utils';
import { ADMIN_EMAILS } from '@/lib/subscription';

interface FigmaExportSectionProps {
    brand: BrandIdentity;
    className?: string;
}

type ExportAction = 'svg' | 'tokens' | 'tailwind' | null;

/**
 * Figma Export Section
 * 
 * PRO FEATURE: Direct export to Figma is gated for non-Pro users.
 * 
 * Features:
 * - Copy SVG with Construction Grids (orbital lines as separate vector groups)
 * - Copy Figma Tokens (compatible with Figma Tokens plugin)
 * - Copy Tailwind Config (with brand colors and stone-950 theme)
 */
export function FigmaExportSection({ brand, className }: FigmaExportSectionProps) {
    const { isPro, email, isLoading: isLoadingSubscription } = useSubscription();
    const [isExporting, setIsExporting] = useState<ExportAction>(null);
    const [copiedAction, setCopiedAction] = useState<ExportAction>(null);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // Check if user has access (Pro or Admin)
    const isAdmin = email && ADMIN_EMAILS.includes(email);
    const hasAccess = isPro || isAdmin;

    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const handleExport = async (action: ExportAction) => {
        if (!action) return;

        // Check access before allowing export
        if (!hasAccess && !isLoadingSubscription) {
            setShowUpgradeModal(true);
            return;
        }

        setIsExporting(action);
        setCopiedAction(null);

        try {
            let result: { success: boolean; message: string };

            switch (action) {
                case 'svg':
                    result = await copySVGWithGrid(brand);
                    break;
                case 'tokens':
                    result = await copyFigmaTokens(brand);
                    break;
                case 'tailwind':
                    result = await copyTailwindConfig(brand);
                    break;
                default:
                    return;
            }

            if (result.success) {
                setCopiedAction(action);
                showToast(result.message);
                // Reset copied state after 2 seconds
                setTimeout(() => setCopiedAction(null), 2000);
            } else {
                showToast(result.message);
            }
        } catch (error) {
            console.error('Export failed:', error);
            showToast('Export failed. Please try again.');
        } finally {
            setIsExporting(null);
        }
    };

    const ExportButton = ({
        action,
        icon: Icon,
        label,
        description,
    }: {
        action: ExportAction;
        icon: React.ComponentType<{ className?: string; size?: number }>;
        label: string;
        description: string;
    }) => {
        const isThisExporting = isExporting === action;
        const isThisCopied = copiedAction === action;

        return (
            <button
                onClick={() => handleExport(action)}
                disabled={isExporting !== null}
                className={cn(
                    "group relative w-full flex items-start gap-3 p-3 rounded-xl border transition-all duration-200",
                    "hover:shadow-md hover:border-stone-300 active:scale-[0.98]",
                    hasAccess
                        ? "border-stone-200 bg-white hover:bg-stone-50"
                        : "border-stone-200/60 bg-stone-50/50",
                    isExporting !== null && !isThisExporting && "opacity-50 cursor-not-allowed",
                    isThisCopied && "border-green-300 bg-green-50"
                )}
            >
                {/* Icon container */}
                <div className={cn(
                    "flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
                    isThisCopied
                        ? "bg-green-100 text-green-600"
                        : "bg-stone-100 text-stone-600 group-hover:bg-stone-200"
                )}>
                    {isThisExporting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : isThisCopied ? (
                        <Check className="w-4 h-4" />
                    ) : (
                        <Icon className="w-4 h-4" />
                    )}
                </div>

                {/* Text content */}
                <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center gap-1.5">
                        <span className={cn(
                            "font-medium text-sm transition-colors",
                            isThisCopied ? "text-green-700" : "text-stone-900"
                        )}>
                            {isThisCopied ? 'Copied!' : label}
                        </span>
                        {!hasAccess && (
                            <Lock className="w-3 h-3 text-amber-500" />
                        )}
                    </div>
                    <span className="text-xs text-stone-500 line-clamp-1">
                        {description}
                    </span>
                </div>

                {/* Copy icon on hover */}
                {!isThisExporting && !isThisCopied && hasAccess && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Copy className="w-3.5 h-3.5 text-stone-400" />
                    </div>
                )}
            </button>
        );
    };

    return (
        <>
            <section className={cn("space-y-4", className)}>
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
                            <Figma className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-stone-900 tracking-tight">
                                Figma Export
                            </h3>
                        </div>
                    </div>

                    {/* Pro Badge */}
                    {!hasAccess && !isLoadingSubscription && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-sm">
                            <Sparkles className="w-2.5 h-2.5" />
                            Pro
                        </span>
                    )}
                </div>

                {/* Description */}
                <p className="text-xs text-stone-500">
                    One-click export to your design tools. Goes from Glyph to Figma in under 60 seconds.
                </p>

                {/* Export Buttons */}
                <div className="space-y-2">
                    <ExportButton
                        action="svg"
                        icon={Figma}
                        label="Copy SVG with Construction Grids"
                        description="Logo with orbital lines as separate vector groups"
                    />

                    <ExportButton
                        action="tokens"
                        icon={Copy}
                        label="Copy Figma Tokens"
                        description="JSON compatible with Figma Tokens plugin"
                    />

                    <ExportButton
                        action="tailwind"
                        icon={Code2}
                        label="Copy Tailwind Config"
                        description="Colors + stone-950 theme extension"
                    />
                </div>

                {/* Pro Gate Overlay */}
                {!hasAccess && !isLoadingSubscription && (
                    <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100">
                        <div className="flex items-start gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                                <Lock className="w-3.5 h-3.5 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-medium text-amber-900 mb-1">
                                    Unlock Figma Export
                                </p>
                                <p className="text-[11px] text-amber-700/80 mb-2">
                                    Direct Figma export is a Pro feature. Upgrade to export your brand in seconds.
                                </p>
                                <button
                                    onClick={() => setShowUpgradeModal(true)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-md hover:scale-105 transition-all"
                                >
                                    <Sparkles className="w-3 h-3" />
                                    Upgrade to Pro
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* Toast Notification */}
            {toastMessage && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="bg-stone-900 text-white px-4 py-2.5 rounded-full shadow-xl flex items-center gap-2 text-sm font-medium">
                        <Check className="w-4 h-4 text-green-400" />
                        {toastMessage}
                    </div>
                </div>
            )}

            {/* Upgrade Modal */}
            <UpgradeModal
                isOpen={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
                featureName="Direct Figma Export"
            />
        </>
    );
}

export default FigmaExportSection;
