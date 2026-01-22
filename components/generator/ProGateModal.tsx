"use client";

import { Package, X, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProGateModalProps {
    isOpen: boolean;
    onClose: () => void;
    featureName?: string;
}

export function ProGateModal({ isOpen, onClose, featureName = "Full Package Export" }: ProGateModalProps) {
    if (!isOpen) return null;

    const proFeatures = [
        "SVG & PNG Asset Pack",
        "Tailwind CSS Config",
        "React Logo Component",
        "Brand Guidelines PDF",
        "Commercial License",
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="fixed inset-0 flex items-center justify-center z-50 p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
                            {/* Header */}
                            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 relative overflow-hidden">
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>

                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-white/20 rounded-xl">
                                        <Package className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-yellow-300" />
                                        <span className="text-xs font-bold text-white/80 uppercase tracking-wider">Pro Feature</span>
                                    </div>
                                </div>

                                <h2 className="text-2xl font-bold text-white mb-1">
                                    Unlock {featureName}
                                </h2>
                                <p className="text-white/80 text-sm">
                                    Get production-ready assets for your brand.
                                </p>
                            </div>

                            {/* Body */}
                            <div className="p-6">
                                <p className="text-stone-600 text-sm mb-4">
                                    Upgrade to the Founder Pass to export your complete brand package:
                                </p>

                                <ul className="space-y-2.5 mb-6">
                                    {proFeatures.map((feature) => (
                                        <li key={feature} className="flex items-center gap-3 text-stone-700">
                                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                                <Check className="w-3 h-3 text-green-600" />
                                            </div>
                                            <span className="text-sm font-medium">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA */}
                                <a
                                    href="https://checkout.dodopayments.com/buy/pdt_0NVXcrRSqLnWomnnrEIla?quantity=1&redirect_url=https%3A%2F%2Fglyph.software%2Fgenerator"
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
                                >
                                    <Package className="w-4 h-4" />
                                    Get Founder Pass — $19
                                </a>

                                <p className="text-center text-xs text-stone-400 mt-3">
                                    One-time payment. Lifetime access.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
