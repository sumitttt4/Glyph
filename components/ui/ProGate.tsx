'use client';

import React from 'react';

interface ProBadgeProps {
    className?: string;
}

/**
 * Small "PRO" pill badge for labeling premium features
 */
export function ProBadge({ className = '' }: ProBadgeProps) {
    return (
        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-sm ${className}`}>
            Pro
        </span>
    );
}

interface ProGateProps {
    children: React.ReactNode;
    isPro: boolean;
    feature: string;
    onUpgrade?: () => void;
}

/**
 * Wrapper that shows upgrade prompt if user doesn't have Pro access
 */
export function ProGate({ children, isPro, feature, onUpgrade }: ProGateProps) {
    if (isPro) {
        return <>{children}</>;
    }

    const handleUpgrade = () => {
        if (onUpgrade) {
            onUpgrade();
        } else {
            // Default: open pricing modal or navigate to pricing
            window.location.href = '/pricing';
        }
    };

    return (
        <div className="relative group">
            {/* Blurred/disabled content */}
            <div className="opacity-50 pointer-events-none blur-[1px]">
                {children}
            </div>

            {/* Upgrade overlay */}
            <div
                className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={handleUpgrade}
            >
                <div className="text-center p-4">
                    <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                    </div>
                    <p className="text-sm font-semibold text-stone-900 mb-1">Pro Feature</p>
                    <p className="text-xs text-stone-500 mb-3">{feature} requires Pro</p>
                    <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full hover:shadow-lg transition-all">
                        Upgrade to Pro
                    </button>
                </div>
            </div>
        </div>
    );
}

interface GenerationCounterProps {
    used: number;
    limit: number;
    isPro: boolean;
}

/**
 * Shows generation usage for free users
 */
export function GenerationCounter({ used, limit, isPro }: GenerationCounterProps) {
    if (isPro) {
        return (
            <div className="flex items-center gap-2 text-xs text-green-600">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="font-medium">Unlimited generations</span>
            </div>
        );
    }

    const remaining = Math.max(0, limit - used);
    const percentage = (used / limit) * 100;

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500">
                    <span className="font-semibold text-stone-700">{remaining}</span> of {limit} left
                </span>
                {remaining <= 3 && (
                    <button
                        onClick={() => window.location.href = '/pricing'}
                        className="text-amber-600 font-semibold hover:text-amber-700"
                    >
                        Go Pro →
                    </button>
                )}
            </div>
            <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all ${percentage > 80 ? 'bg-red-500' : percentage > 50 ? 'bg-amber-500' : 'bg-green-500'}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}

interface UpgradeButtonProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

/**
 * Standalone upgrade button
 */
export function UpgradeButton({ size = 'md', className = '' }: UpgradeButtonProps) {
    const sizeClasses = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    return (
        <button
            onClick={() => window.location.href = '/pricing'}
            className={`inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all ${sizeClasses[size]} ${className}`}
        >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Upgrade to Pro
        </button>
    );
}
