"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrandIdentity, GeneratedLogo } from '@/lib/data';
import {
    LogoVariationType,
    LogoVariation,
    LogoVariations,
} from '../types';
import { VARIATION_TYPES, VARIATION_INFO, getLogoVariation } from './logo-variations-generator';

interface LogoVariationsPreviewProps {
    brand: BrandIdentity;
    className?: string;
    showAllGrid?: boolean;
    defaultVariation?: LogoVariationType;
    onVariationChange?: (variation: LogoVariationType) => void;
}

/**
 * LogoVariationsPreview
 *
 * Displays logo variations with a toggle to switch between:
 * - Horizontal lockup
 * - Stacked lockup
 * - Icon only
 * - Wordmark only
 * - Dark version
 * - Light version
 */
export function LogoVariationsPreview({
    brand,
    className = '',
    showAllGrid = false,
    defaultVariation = 'icon-only',
    onVariationChange,
}: LogoVariationsPreviewProps) {
    const [selectedVariation, setSelectedVariation] = useState<LogoVariationType>(defaultVariation);

    // Get the selected logo from brand
    const selectedLogo = brand.generatedLogos?.[brand.selectedLogoIndex ?? 0];
    const variations = (selectedLogo as any)?.variations as LogoVariations | undefined;

    if (!variations) {
        // Fallback to showing the base logo if no variations
        return (
            <div className={`flex items-center justify-center p-4 ${className}`}>
                {selectedLogo?.svg && (
                    <div
                        dangerouslySetInnerHTML={{ __html: selectedLogo.svg }}
                        className="w-full h-full max-w-[200px] max-h-[200px]"
                    />
                )}
            </div>
        );
    }

    const handleVariationSelect = (variation: LogoVariationType) => {
        setSelectedVariation(variation);
        onVariationChange?.(variation);
    };

    const currentVariation = getLogoVariation(selectedLogo as any, selectedVariation);

    // Grid view showing all variations
    if (showAllGrid) {
        return (
            <div className={`grid grid-cols-2 md:grid-cols-3 gap-4 p-4 ${className}`}>
                {VARIATION_TYPES.map((type) => {
                    const variation = getLogoVariation(selectedLogo as any, type);
                    if (!variation) return null;

                    const info = VARIATION_INFO[type];
                    const isSelected = selectedVariation === type;
                    const needsDarkBg = type === 'light';

                    return (
                        <motion.button
                            key={type}
                            onClick={() => handleVariationSelect(type)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`
                                relative p-4 rounded-xl border-2 transition-all cursor-pointer
                                ${isSelected
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                }
                                ${needsDarkBg ? 'bg-gray-900' : 'bg-white dark:bg-gray-800'}
                            `}
                        >
                            {/* Logo Preview */}
                            <div
                                className="w-full aspect-[4/3] flex items-center justify-center mb-3"
                                dangerouslySetInnerHTML={{ __html: variation.svg }}
                                style={{
                                    maxHeight: '120px',
                                }}
                            />

                            {/* Label */}
                            <div className={`text-center ${needsDarkBg ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                                <span className="text-lg mr-2">{info.icon}</span>
                                <span className="text-sm font-medium">{info.name}</span>
                            </div>

                            {/* Selection indicator */}
                            {isSelected && (
                                <motion.div
                                    layoutId="variation-selection"
                                    className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
                                    initial={false}
                                >
                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </motion.div>
                            )}
                        </motion.button>
                    );
                })}
            </div>
        );
    }

    // Single variation view with toggle buttons
    return (
        <div className={`flex flex-col ${className}`}>
            {/* Toggle Buttons */}
            <div className="flex flex-wrap gap-2 mb-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                {VARIATION_TYPES.map((type) => {
                    const info = VARIATION_INFO[type];
                    const isSelected = selectedVariation === type;

                    return (
                        <button
                            key={type}
                            onClick={() => handleVariationSelect(type)}
                            className={`
                                px-3 py-1.5 rounded-md text-sm font-medium transition-all
                                flex items-center gap-1.5
                                ${isSelected
                                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }
                            `}
                        >
                            <span>{info.icon}</span>
                            <span className="hidden sm:inline">{info.name}</span>
                        </button>
                    );
                })}
            </div>

            {/* Logo Preview */}
            <AnimatePresence mode="wait">
                {currentVariation && (
                    <motion.div
                        key={selectedVariation}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className={`
                            flex items-center justify-center p-8 rounded-xl
                            ${selectedVariation === 'light' ? 'bg-gray-900' : 'bg-white dark:bg-gray-800'}
                            border border-gray-200 dark:border-gray-700
                        `}
                    >
                        <div
                            dangerouslySetInnerHTML={{ __html: currentVariation.svg }}
                            className="max-w-full max-h-[300px] w-auto h-auto"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Description */}
            {currentVariation && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 text-center"
                >
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {currentVariation.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {currentVariation.recommended}
                    </p>
                </motion.div>
            )}
        </div>
    );
}

/**
 * Compact variation selector for use in toolbars
 */
export function LogoVariationSelector({
    brand,
    selectedVariation,
    onSelect,
    compact = false,
}: {
    brand: BrandIdentity;
    selectedVariation: LogoVariationType;
    onSelect: (variation: LogoVariationType) => void;
    compact?: boolean;
}) {
    return (
        <div className={`flex ${compact ? 'gap-1' : 'gap-2'}`}>
            {VARIATION_TYPES.map((type) => {
                const info = VARIATION_INFO[type];
                const isSelected = selectedVariation === type;

                return (
                    <button
                        key={type}
                        onClick={() => onSelect(type)}
                        title={`${info.name}: ${info.description}`}
                        className={`
                            ${compact ? 'p-1.5' : 'p-2'} rounded transition-all
                            ${isSelected
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }
                        `}
                    >
                        <span className={compact ? 'text-sm' : 'text-base'}>{info.icon}</span>
                    </button>
                );
            })}
        </div>
    );
}

export default LogoVariationsPreview;
