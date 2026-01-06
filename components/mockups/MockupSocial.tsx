'use client';

import React from 'react';
import { BrandIdentity } from '@/lib/data';
import { LogoComposition } from '../brand/LogoComposition';
import { cn } from '@/lib/utils';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';

interface MockupSocialProps {
    brand: BrandIdentity;
    className?: string;
    variant?: 'feed' | 'profile';
}

export const MockupSocial = ({ brand, className, variant = 'feed' }: MockupSocialProps) => {
    const tokens = brand.theme.tokens.light;

    // Social Post Component
    const SocialPost = () => (
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden max-w-sm w-full mx-auto">
            {/* Header */}
            <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-stone-100 bg-stone-50 md:p-1 relative">
                        <LogoComposition brand={brand} />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-stone-900">{brand.name.toLowerCase().replace(/\s+/g, '')}</div>
                        <div className="text-[10px] text-stone-500">Sponsored</div>
                    </div>
                </div>
                <MoreHorizontal size={16} className="text-stone-400" />
            </div>

            {/* Content - 1:1 Aspect Ratio Canvas */}
            <div className="aspect-square w-full relative bg-stone-100 overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0" style={{ backgroundColor: tokens.bg }} />

                {/* Visual Content Generative Art */}
                <div className="relative z-10 w-full h-full p-8 flex flex-col items-center justify-center text-center">
                    <div className="w-1/2 h-1/2 relative mb-6">
                        <LogoComposition brand={brand} />
                    </div>
                    <h3 className={cn("text-2xl font-bold mb-2", brand.font.heading)} style={{ color: tokens.text }}>
                        Redefining {brand.vibe}.
                    </h3>
                    <button
                        className="px-4 py-2 rounded-full text-xs font-bold mt-2"
                        style={{ backgroundColor: tokens.primary, color: '#ffffff' }}
                    >
                        Shop Now
                    </button>
                </div>
            </div>

            {/* Actions */}
            <div className="p-3">
                <div className="flex justify-between mb-3">
                    <div className="flex gap-4">
                        <Heart size={20} className="text-stone-800" />
                        <MessageCircle size={20} className="text-stone-800" />
                        <Send size={20} className="text-stone-800" />
                    </div>
                    <Bookmark size={20} className="text-stone-800" />
                </div>
                <div className="text-xs font-semibold text-stone-900 mb-1">1,204 likes</div>
                <div className="text-xs text-stone-800">
                    <span className="font-bold mr-1">{brand.name.toLowerCase().replace(/\s+/g, '')}</span>
                    Introducing the new collection. Essential items for the modern lifestyle. #design #{brand.vibe}
                </div>
            </div>
        </div>
    );

    // Profile Component (Simplified)
    const ProfileHeader = () => (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 max-w-sm w-full mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div className="w-20 h-20 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 to-fuchsia-600">
                    <div className="w-full h-full rounded-full border-2 border-white bg-white overflow-hidden p-1 relative">
                        <LogoComposition brand={brand} />
                    </div>
                </div>
                <div className="flex gap-4 text-center">
                    <div>
                        <div className="font-bold text-lg text-stone-900">124</div>
                        <div className="text-xs text-stone-500">Posts</div>
                    </div>
                    <div>
                        <div className="font-bold text-lg text-stone-900">14.2k</div>
                        <div className="text-xs text-stone-500">Followers</div>
                    </div>
                    <div>
                        <div className="font-bold text-lg text-stone-900">342</div>
                        <div className="text-xs text-stone-500">Following</div>
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <div className="font-bold text-sm text-stone-900">{brand.name}</div>
                <div className="text-xs text-stone-600 font-medium">Product/Service</div>
                <div className="text-xs text-stone-500 mt-1">
                    {brand.strategy?.mission || `The official home of ${brand.name}. Design for the future.`} <br />
                    <span className="text-blue-900 font-medium">link.bio/{brand.name.toLowerCase().replace(/\s+/g, '')}</span>
                </div>
            </div>

            <div className="flex gap-2">
                <button className="flex-1 bg-stone-900 text-white text-xs font-bold py-1.5 rounded-lg">Follow</button>
                <button className="flex-1 bg-stone-100 text-stone-900 text-xs font-bold py-1.5 rounded-lg">Message</button>
            </div>
        </div>
    );

    return (
        <div className={cn("p-4 flex items-center justify-center bg-stone-50", className)}>
            {variant === 'feed' ? <SocialPost /> : <ProfileHeader />}
        </div>
    );
};
