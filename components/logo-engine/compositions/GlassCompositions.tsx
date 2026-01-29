/**
 * Glass & Modern Effect Composition Styles
 * Premium effects with glassmorphism, neon glow, soft shadows, blur
 */

import { BrandIdentity } from '@/lib/data';
import { Shape } from '@/lib/shapes';

interface CompositionProps {
  brand: BrandIdentity;
  primaryColor: string;
  accentColor: string;
  centerOffset: number;
  primaryScale: number;
  primaryShape: Shape;
  uniqueId: string;
  className?: string;
}

export function GlassmorphismComposition({
  brand,
  primaryColor,
  accentColor,
  centerOffset,
  primaryScale,
  primaryShape,
  uniqueId,
  className,
}: CompositionProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id={`blur-glass-${uniqueId}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
        </filter>
        <linearGradient id={`glass-grad-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.4" />
          <stop offset="100%" stopColor="white" stopOpacity="0.1" />
        </linearGradient>
        <mask id={`mask-glass-${uniqueId}`}>
          <rect width="100" height="100" fill="white" />
          <g transform={`translate(${centerOffset}, ${centerOffset}) scale(${primaryScale * 0.85})`}>
            <path d={primaryShape.path} fill="black" />
          </g>
        </mask>
      </defs>
      {/* Background blobs */}
      <circle cx="30" cy="30" r="25" fill={primaryColor} opacity="0.6" filter={`url(#blur-glass-${uniqueId})`} />
      <circle cx="70" cy="70" r="30" fill={accentColor} opacity="0.6" filter={`url(#blur-glass-${uniqueId})`} />
      {/* Glass container */}
      <rect
        x="10" y="10"
        width="80" height="80"
        rx="18"
        fill={`url(#glass-grad-${uniqueId})`}
        stroke="white"
        strokeOpacity="0.3"
        strokeWidth="1"
        mask={`url(#mask-glass-${uniqueId})`}
      />
    </svg>
  );
}

export function NeonGlowComposition({
  brand,
  primaryColor,
  accentColor,
  centerOffset,
  primaryScale,
  primaryShape,
  uniqueId,
  className,
}: CompositionProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id={`glow-${uniqueId}`} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="3" result="blur1" />
          <feGaussianBlur stdDeviation="6" result="blur2" />
          <feGaussianBlur stdDeviation="12" result="blur3" />
          <feMerge>
            <feMergeNode in="blur3" />
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <mask id={`mask-neon-${uniqueId}`}>
          <rect width="100" height="100" fill="white" />
          <g transform={`translate(${centerOffset}, ${centerOffset}) scale(${primaryScale * 0.85})`}>
            <path d={primaryShape.path} fill="black" />
          </g>
        </mask>
      </defs>
      {/* Dark background */}
      <rect x="5" y="5" width="90" height="90" rx="20" fill="#0a0a0a" />
      {/* Neon glow shape */}
      <rect
        x="10" y="10"
        width="80" height="80"
        rx="18"
        fill={primaryColor}
        mask={`url(#mask-neon-${uniqueId})`}
        filter={`url(#glow-${uniqueId})`}
      />
    </svg>
  );
}

export function SoftShadowComposition({
  brand,
  primaryColor,
  accentColor,
  centerOffset,
  primaryScale,
  primaryShape,
  uniqueId,
  className,
}: CompositionProps) {
  const bgColor = brand.theme.tokens.light.bg;

  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id={`soft-shadow-${uniqueId}`} x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#000" floodOpacity="0.15" />
        </filter>
        <mask id={`mask-soft-${uniqueId}`}>
          <rect width="100" height="100" fill="white" />
          <g transform={`translate(${centerOffset}, ${centerOffset}) scale(${primaryScale * 0.85})`}>
            <path d={primaryShape.path} fill="black" />
          </g>
        </mask>
      </defs>
      {/* Background */}
      <rect x="0" y="0" width="100" height="100" fill={bgColor} />
      {/* Card with soft shadow */}
      <rect
        x="12" y="8"
        width="76" height="76"
        rx="16"
        fill={primaryColor}
        mask={`url(#mask-soft-${uniqueId})`}
        filter={`url(#soft-shadow-${uniqueId})`}
      />
    </svg>
  );
}

export function BlurGradientComposition({
  brand,
  primaryColor,
  accentColor,
  centerOffset,
  primaryScale,
  primaryShape,
  uniqueId,
  className,
}: CompositionProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id={`blur-bg-${uniqueId}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
        </filter>
        <mask id={`mask-blur-${uniqueId}`}>
          <rect width="100" height="100" fill="white" />
          <g transform={`translate(${centerOffset}, ${centerOffset}) scale(${primaryScale * 0.85})`}>
            <path d={primaryShape.path} fill="black" />
          </g>
        </mask>
      </defs>
      {/* Blurred background shape */}
      <rect
        x="10" y="10"
        width="80" height="80"
        rx="18"
        fill={primaryColor}
        filter={`url(#blur-bg-${uniqueId})`}
        opacity="0.6"
      />
      {/* Sharp foreground */}
      <rect
        x="10" y="10"
        width="80" height="80"
        rx="18"
        fill={primaryColor}
        mask={`url(#mask-blur-${uniqueId})`}
      />
    </svg>
  );
}
