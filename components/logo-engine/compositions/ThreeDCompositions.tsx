/**
 * 3D & Depth Composition Styles
 * Premium effects with isometric, shadows, layers and perspective
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

export function IsometricComposition({
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
        <mask id={`mask-iso-${uniqueId}`}>
          <rect width="100" height="100" fill="white" />
          <g transform={`translate(${centerOffset}, ${centerOffset}) scale(${primaryScale * 0.75})`}>
            <path d={primaryShape.path} fill="black" />
          </g>
        </mask>
      </defs>
      {/* Back face (shadow) */}
      <g transform="translate(8, 8)">
        <rect x="10" y="10" width="80" height="80" rx="16" fill={accentColor} opacity="0.3" mask={`url(#mask-iso-${uniqueId})`} />
      </g>
      {/* Middle face */}
      <g transform="translate(4, 4)">
        <rect x="10" y="10" width="80" height="80" rx="16" fill={accentColor} opacity="0.5" mask={`url(#mask-iso-${uniqueId})`} />
      </g>
      {/* Front face */}
      <rect x="10" y="10" width="80" height="80" rx="16" fill={primaryColor} mask={`url(#mask-iso-${uniqueId})`} />
    </svg>
  );
}

export function ShadowDepthComposition({
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
        <filter id={`shadow-${uniqueId}`} x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="4" dy="4" stdDeviation="4" floodColor={primaryColor} floodOpacity="0.3" />
          <feDropShadow dx="8" dy="8" stdDeviation="8" floodColor={primaryColor} floodOpacity="0.2" />
        </filter>
        <mask id={`mask-shadow-${uniqueId}`}>
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
        fill={primaryColor}
        mask={`url(#mask-shadow-${uniqueId})`}
        filter={`url(#shadow-${uniqueId})`}
      />
    </svg>
  );
}

export function Layered3DComposition({
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
        <mask id={`mask-layer-${uniqueId}`}>
          <rect width="100" height="100" fill="white" />
          <g transform={`translate(${centerOffset}, ${centerOffset}) scale(${primaryScale * 0.7})`}>
            <path d={primaryShape.path} fill="black" />
          </g>
        </mask>
      </defs>
      {/* Layer 4 (back) */}
      <g transform="translate(6, 6)">
        <rect x="15" y="15" width="70" height="70" rx="14" fill={primaryColor} opacity="0.2" />
      </g>
      {/* Layer 3 */}
      <g transform="translate(4, 4)">
        <rect x="15" y="15" width="70" height="70" rx="14" fill={primaryColor} opacity="0.4" />
      </g>
      {/* Layer 2 */}
      <g transform="translate(2, 2)">
        <rect x="15" y="15" width="70" height="70" rx="14" fill={primaryColor} opacity="0.6" />
      </g>
      {/* Layer 1 (front) with cutout */}
      <rect x="15" y="15" width="70" height="70" rx="14" fill={primaryColor} mask={`url(#mask-layer-${uniqueId})`} />
    </svg>
  );
}

export function PerspectiveComposition({
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
        <mask id={`mask-persp-${uniqueId}`}>
          <rect width="100" height="100" fill="white" />
          <g transform={`translate(${centerOffset + 5}, ${centerOffset}) scale(${primaryScale * 0.75})`}>
            <path d={primaryShape.path} fill="black" />
          </g>
        </mask>
      </defs>
      {/* Perspective container - trapezoid shape */}
      <path
        d="M20 15 L80 10 L85 90 L15 85 Z"
        fill={primaryColor}
        mask={`url(#mask-persp-${uniqueId})`}
      />
      {/* Side face for depth */}
      <path
        d="M80 10 L90 15 L95 85 L85 90 Z"
        fill={accentColor}
        opacity="0.5"
      />
    </svg>
  );
}
