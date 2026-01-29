"use client";

import React from 'react';
import { BrandIdentity } from '@/lib/data';
import { ProBadge, ProLockOverlay } from '@/components/ui/ProBadge';
import { RotateCcw, Maximize2, Move, CornerUpRight } from 'lucide-react';

interface LogoTweaks {
  scale: number;
  rotate: number;
  gap: number;
}

interface LogoCustomizerProps {
  brand: BrandIdentity;
  tweaks: LogoTweaks;
  onTweakChange: (tweaks: LogoTweaks) => void;
  isPro: boolean;
  onUpgradeClick?: () => void;
}

export function LogoCustomizer({
  brand,
  tweaks,
  onTweakChange,
  isPro,
  onUpgradeClick,
}: LogoCustomizerProps) {
  const handleSliderChange = (key: keyof LogoTweaks, value: number) => {
    if (!isPro) {
      onUpgradeClick?.();
      return;
    }
    onTweakChange({ ...tweaks, [key]: value });
  };

  const handleReset = () => {
    if (!isPro) {
      onUpgradeClick?.();
      return;
    }
    onTweakChange({ scale: 1, rotate: 0, gap: 0 });
  };

  return (
    <div className="relative">
      {/* Pro Gate Overlay */}
      {!isPro && (
        <div
          className="absolute inset-0 z-10 bg-white/80 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center cursor-pointer"
          onClick={onUpgradeClick}
        >
          <ProBadge size="md" />
          <p className="text-sm text-stone-600 mt-2">Unlock customization</p>
          <button className="mt-2 text-xs font-medium text-orange-600 hover:text-orange-700">
            Upgrade to Pro
          </button>
        </div>
      )}

      <div className="space-y-4 p-4 bg-stone-50 rounded-lg border border-stone-200">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
            Fine-tune Logo
            {!isPro && <ProBadge size="sm" />}
          </h3>
          <button
            onClick={handleReset}
            disabled={!isPro}
            className="text-xs text-stone-500 hover:text-stone-700 flex items-center gap-1 disabled:opacity-50"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>

        {/* Scale Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-stone-600 flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5" />
              Scale
            </label>
            <span className="text-xs text-stone-400">{tweaks.scale.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="1.5"
            step="0.1"
            value={tweaks.scale}
            onChange={(e) => handleSliderChange('scale', parseFloat(e.target.value))}
            disabled={!isPro}
            className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-orange-500 disabled:opacity-50"
          />
          <div className="flex justify-between text-[10px] text-stone-400">
            <span>0.5x</span>
            <span>1.5x</span>
          </div>
        </div>

        {/* Rotation Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-stone-600 flex items-center gap-1.5">
              <CornerUpRight className="w-3.5 h-3.5" />
              Rotation
            </label>
            <span className="text-xs text-stone-400">{tweaks.rotate}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            step="15"
            value={tweaks.rotate}
            onChange={(e) => handleSliderChange('rotate', parseInt(e.target.value))}
            disabled={!isPro}
            className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-orange-500 disabled:opacity-50"
          />
          <div className="flex justify-between text-[10px] text-stone-400">
            <span>0°</span>
            <span>360°</span>
          </div>
        </div>

        {/* Gap Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-stone-600 flex items-center gap-1.5">
              <Move className="w-3.5 h-3.5" />
              Spacing
            </label>
            <span className="text-xs text-stone-400">{tweaks.gap}px</span>
          </div>
          <input
            type="range"
            min="0"
            max="48"
            step="4"
            value={tweaks.gap}
            onChange={(e) => handleSliderChange('gap', parseInt(e.target.value))}
            disabled={!isPro}
            className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-orange-500 disabled:opacity-50"
          />
          <div className="flex justify-between text-[10px] text-stone-400">
            <span>0px</span>
            <span>48px</span>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="pt-2 border-t border-stone-200">
          <label className="text-xs font-medium text-stone-600 mb-2 block">Quick Presets</label>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => isPro && onTweakChange({ scale: 1, rotate: 0, gap: 0 })}
              disabled={!isPro}
              className="px-2 py-1 text-[10px] bg-white border border-stone-200 rounded-md hover:bg-stone-50 disabled:opacity-50"
            >
              Default
            </button>
            <button
              onClick={() => isPro && onTweakChange({ scale: 1.2, rotate: 0, gap: 0 })}
              disabled={!isPro}
              className="px-2 py-1 text-[10px] bg-white border border-stone-200 rounded-md hover:bg-stone-50 disabled:opacity-50"
            >
              Large
            </button>
            <button
              onClick={() => isPro && onTweakChange({ scale: 0.8, rotate: 0, gap: 0 })}
              disabled={!isPro}
              className="px-2 py-1 text-[10px] bg-white border border-stone-200 rounded-md hover:bg-stone-50 disabled:opacity-50"
            >
              Compact
            </button>
            <button
              onClick={() => isPro && onTweakChange({ scale: 1, rotate: 45, gap: 0 })}
              disabled={!isPro}
              className="px-2 py-1 text-[10px] bg-white border border-stone-200 rounded-md hover:bg-stone-50 disabled:opacity-50"
            >
              Tilted
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogoCustomizer;
