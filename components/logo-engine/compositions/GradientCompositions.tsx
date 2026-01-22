/**
 * Gradient Composition Styles
 * Premium effects with linear, radial, mesh gradients and duotone
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

export function GradientLinearComposition({
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
        <linearGradient id={`grad-linear-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primaryColor} />
          <stop offset="100%" stopColor={accentColor} />
        </linearGradient>
        <mask id={`mask-linear-${uniqueId}`}>
          <rect width="100" height="100" fill="white" />
          <g transform={`translate(${centerOffset}, ${centerOffset}) scale(${primaryScale * 0.85})`}>
            <path d={primaryShape.path} fill="black" />
          </g>
        </mask>
      </defs>
      <rect
        x="10" y="10"
        width="80" height="80"
        rx="18"
        fill={`url(#grad-linear-${uniqueId})`}
        mask={`url(#mask-linear-${uniqueId})`}
      />
    </svg>
  );
}

export function GradientRadialComposition({
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
        <radialGradient id={`grad-radial-${uniqueId}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accentColor} />
          <stop offset="100%" stopColor={primaryColor} />
        </radialGradient>
        <mask id={`mask-radial-${uniqueId}`}>
          <rect width="100" height="100" fill="white" />
          <g transform={`translate(${centerOffset}, ${centerOffset}) scale(${primaryScale * 0.85})`}>
            <path d={primaryShape.path} fill="black" />
          </g>
        </mask>
      </defs>
      <rect
        x="10" y="10"
        width="80" height="80"
        rx="18"
        fill={`url(#grad-radial-${uniqueId})`}
        mask={`url(#mask-radial-${uniqueId})`}
      />
    </svg>
  );
}

export function GradientMeshComposition({
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
        <radialGradient id={`mesh-1-${uniqueId}`} cx="30%" cy="30%" r="60%">
          <stop offset="0%" stopColor={primaryColor} stopOpacity="0.8" />
          <stop offset="100%" stopColor={primaryColor} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`mesh-2-${uniqueId}`} cx="70%" cy="70%" r="60%">
          <stop offset="0%" stopColor={accentColor} stopOpacity="0.8" />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
        </radialGradient>
        <mask id={`mask-mesh-${uniqueId}`}>
          <rect width="100" height="100" fill="white" />
          <g transform={`translate(${centerOffset}, ${centerOffset}) scale(${primaryScale * 0.8})`}>
            <path d={primaryShape.path} fill="black" />
          </g>
        </mask>
      </defs>
      <rect x="10" y="10" width="80" height="80" rx="18" fill={bgColor} />
      <rect x="10" y="10" width="80" height="80" rx="18" fill={`url(#mesh-1-${uniqueId})`} />
      <rect x="10" y="10" width="80" height="80" rx="18" fill={`url(#mesh-2-${uniqueId})`} />
      <rect
        x="10" y="10"
        width="80" height="80"
        rx="18"
        fill="white"
        mask={`url(#mask-mesh-${uniqueId})`}
      />
    </svg>
  );
}

export function DuotoneComposition({
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
        <clipPath id={`clip-left-${uniqueId}`}>
          <rect x="0" y="0" width="50" height="100" />
        </clipPath>
        <clipPath id={`clip-right-${uniqueId}`}>
          <rect x="50" y="0" width="50" height="100" />
        </clipPath>
        <mask id={`mask-duo-${uniqueId}`}>
          <rect width="100" height="100" fill="white" />
          <g transform={`translate(${centerOffset}, ${centerOffset}) scale(${primaryScale * 0.85})`}>
            <path d={primaryShape.path} fill="black" />
          </g>
        </mask>
      </defs>
      {/* Left half */}
      <g clipPath={`url(#clip-left-${uniqueId})`}>
        <rect
          x="10" y="10"
          width="80" height="80"
          rx="18"
          fill={primaryColor}
          mask={`url(#mask-duo-${uniqueId})`}
        />
      </g>
      {/* Right half */}
      <g clipPath={`url(#clip-right-${uniqueId})`}>
        <rect
          x="10" y="10"
          width="80" height="80"
          rx="18"
          fill={accentColor}
          mask={`url(#mask-duo-${uniqueId})`}
        />
      </g>
    </svg>
  );
}
