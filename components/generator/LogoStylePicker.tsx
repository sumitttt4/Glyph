"use client";

import React, { useState } from 'react';
import { BrandIdentity } from '@/lib/data';
import { LOGO_STYLES, LogoStyle, isStyleFree } from '@/lib/logo-styles';
import { LogoComposition, LogoLayoutStyle } from '@/components/brand/LogoComposition';
import { ProBadge } from '@/components/ui/ProBadge';
import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoStylePickerProps {
  brand: BrandIdentity;
  currentStyle: LogoLayoutStyle;
  onStyleSelect: (styleId: LogoLayoutStyle) => void;
  isPro: boolean;
  onUpgradeClick?: () => void;
}

const STYLE_CATEGORIES = [
  { id: 'basic', name: 'Basic', description: 'Clean, professional styles' },
  { id: 'gradient', name: 'Gradients', description: 'Smooth color transitions' },
  { id: '3d', name: '3D Effects', description: 'Depth and dimension' },
  { id: 'glass', name: 'Modern', description: 'Glass and glow effects' },
  { id: 'pattern', name: 'Patterns', description: 'Geometric arrangements' },
  { id: 'typography', name: 'Typography', description: 'Letter-based designs' },
  { id: 'advanced', name: 'Advanced', description: 'Complex compositions' },
];

export function LogoStylePicker({
  brand,
  currentStyle,
  onStyleSelect,
  isPro,
  onUpgradeClick,
}: LogoStylePickerProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredStyles = activeCategory === 'all'
    ? LOGO_STYLES
    : LOGO_STYLES.filter(style => style.category === activeCategory);

  const handleStyleClick = (style: LogoStyle) => {
    if (style.tier === 'premium' && !isPro) {
      onUpgradeClick?.();
      return;
    }
    onStyleSelect(style.id as LogoLayoutStyle);
  };

  return (
    <div className="space-y-4">
      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setActiveCategory('all')}
          className={cn(
            "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
            activeCategory === 'all'
              ? "bg-stone-900 text-white"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          )}
        >
          All Styles
        </button>
        {STYLE_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
              activeCategory === cat.id
                ? "bg-stone-900 text-white"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Pro Banner */}
      {!isPro && (
        <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-200 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ProBadge size="sm" />
            <span className="text-sm text-stone-700">
              Unlock {LOGO_STYLES.filter(s => s.tier === 'premium').length} premium styles
            </span>
          </div>
          <button
            onClick={onUpgradeClick}
            className="text-xs font-medium text-orange-600 hover:text-orange-700"
          >
            Upgrade
          </button>
        </div>
      )}

      {/* Style Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
        {filteredStyles.map(style => {
          const isFree = style.tier === 'free';
          const isLocked = !isFree && !isPro;
          const isSelected = currentStyle === style.id;

          return (
            <div
              key={style.id}
              onClick={() => handleStyleClick(style)}
              className={cn(
                "relative aspect-square rounded-xl border-2 cursor-pointer transition-all overflow-hidden group",
                isSelected
                  ? "border-orange-500 ring-2 ring-orange-500/20"
                  : "border-stone-200 hover:border-stone-300",
                isLocked && "opacity-70"
              )}
            >
              {/* Preview */}
              <div className="absolute inset-2">
                <LogoComposition
                  brand={brand}
                  layout={style.id as LogoLayoutStyle}
                  className="w-full h-full"
                  isPro={true} // Always show preview
                />
              </div>

              {/* Lock Overlay for Premium */}
              {isLocked && (
                <div className="absolute inset-0 bg-stone-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex flex-col items-center gap-1">
                    <Lock className="w-4 h-4 text-white" />
                    <span className="text-[10px] text-white font-medium">Pro</span>
                  </div>
                </div>
              )}

              {/* Premium Badge */}
              {!isFree && (
                <div className="absolute top-1 right-1">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-400 to-amber-400" />
                </div>
              )}

              {/* Style Name */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 pt-6">
                <p className="text-[10px] text-white font-medium truncate">
                  {style.name}
                </p>
              </div>

              {/* Selected Indicator */}
              {isSelected && (
                <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="flex justify-between text-xs text-stone-400 pt-2">
        <span>{filteredStyles.filter(s => s.tier === 'free').length} free styles</span>
        <span>{filteredStyles.filter(s => s.tier === 'premium').length} premium styles</span>
      </div>
    </div>
  );
}

export default LogoStylePicker;
