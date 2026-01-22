"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Check, Sparkles, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    featureName?: string;
}

const PRO_FEATURES = [
    "Fine-Tune Controls (Scale, Rotate, Gap)",
    "Full Brand Asset Kit (ZIP)",
    "SVG Vector Export",
    "Tailwind CSS Config",
    "React Component Code",
    "Commercial License",
];

/**
 * Upgrade modal shown when free users attempt Pro features
 * Links to Dodo Payments checkout
 */
export function UpgradeModal({ isOpen, onClose, featureName = "this feature" }: UpgradeModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleUpgrade = () => {
        setIsLoading(true);
        // Redirect to Dodo checkout
        window.location.href = "https://checkout.dodopayments.com/buy/pdt_0NVXcrRSqLnWomnnrEIla?quantity=1&redirect_url=" + encodeURIComponent(window.location.href);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header with gradient */}
                        <div className="bg-gradient-to-r from-[#FF4500] to-[#FF6B35] p-6 text-white relative overflow-hidden">
                            {/* Decorative circles */}
                            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10" />
                            <div className="absolute -right-4 -bottom-12 w-24 h-24 rounded-full bg-white/5" />

                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <Crown className="w-6 h-6" />
                                    <span className="text-sm font-bold uppercase tracking-wider opacity-90">Unlock Pro</span>
                                </div>
                                <h2 className="text-2xl font-bold tracking-tight">
                                    Get Full Access
                                </h2>
                                <p className="text-white/80 text-sm mt-1">
                                    {featureName} requires the Founder Pass
                                </p>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="p-6">
                            <p className="text-stone-600 text-sm mb-4">
                                Unlock all premium features with a one-time payment:
                            </p>

                            <ul className="space-y-2 mb-6">
                                {PRO_FEATURES.map((feature) => (
                                    <li key={feature} className="flex items-center gap-2 text-stone-700 text-sm">
                                        <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                            <Check className="w-2.5 h-2.5 text-green-600" />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            {/* Pricing */}
                            <div className="bg-stone-50 rounded-xl p-4 mb-6 border border-stone-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-2xl font-bold text-stone-900">$19</span>
                                        <span className="text-stone-400 text-sm ml-2 line-through">$49</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                                        <Zap className="w-3 h-3" />
                                        Early Bird
                                    </div>
                                </div>
                                <p className="text-stone-500 text-xs mt-1">One-time payment • Lifetime access</p>
                            </div>

                            {/* CTA */}
                            <button
                                onClick={handleUpgrade}
                                disabled={isLoading}
                                className={cn(
                                    "w-full py-3 rounded-xl font-bold text-white transition-all",
                                    "bg-gradient-to-r from-[#FF4500] to-[#FF6B35]",
                                    "hover:shadow-lg hover:shadow-orange-200 active:scale-[0.98]",
                                    "flex items-center justify-center gap-2",
                                    isLoading && "opacity-70 cursor-not-allowed"
                                )}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Redirecting...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4" />
                                        Get Founder Pass
                                    </>
                                )}
                            </button>

                            <p className="text-center text-stone-400 text-xs mt-4">
                                Secure checkout powered by Dodo Payments
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
