/**
 * Advanced Composition Styles
 * Premium effects with orbit, explosion, wave stack, corner accent, seal
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

export function OrbitComposition({
  brand,
  primaryColor,
  accentColor,
  centerOffset,
  primaryScale,
  primaryShape,
  uniqueId,
  className,
}: CompositionProps) {
  const orbitItems = 5;
  const elements = [];

  for (let i = 0; i < orbitItems; i++) {
    const angle = (360 / orbitItems) * i - 90;
    const rad = (angle * Math.PI) / 180;
    const radius = 30;
    const x = 50 + Math.cos(rad) * radius;
    const y = 50 + Math.sin(rad) * radius;

    elements.push(
      <g key={i} transform={`translate(${x}, ${y}) scale(${primaryScale * 0.2})`}>
        <path d={primaryShape.path} fill={primaryColor} opacity={0.5 + i * 0.1} />
      </g>
    );
  }

  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Orbit ring */}
      <circle cx="50" cy="50" r="30" fill="none" stroke={primaryColor} strokeWidth="1" opacity="0.2" strokeDasharray="4 4" />
      {/* Orbiting shapes */}
      {elements}
      {/* Central shape */}
      <g transform={`translate(38, 38) scale(${primaryScale * 0.5})`}>
        <path d={primaryShape.path} fill={primaryColor} />
      </g>
    </svg>
  );
}

export function ExplosionComposition({
  brand,
  primaryColor,
  accentColor,
  centerOffset,
  primaryScale,
  primaryShape,
  uniqueId,
  className,
}: CompositionProps) {
  const rays = 8;
  const elements = [];

  for (let i = 0; i < rays; i++) {
    const angle = (360 / rays) * i;
    const rad = (angle * Math.PI) / 180;

    for (let j = 1; j <= 3; j++) {
      const radius = 15 + j * 12;
      const x = 50 + Math.cos(rad) * radius;
      const y = 50 + Math.sin(rad) * radius;
      const scale = 0.15 - j * 0.03;

      elements.push(
        <g key={`${i}-${j}`} transform={`translate(${x}, ${y}) scale(${primaryScale * scale}) rotate(${angle})`}>
          <path d={primaryShape.path} fill={primaryColor} opacity={0.8 - j * 0.2} />
        </g>
      );
    }
  }

  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      {elements}
      {/* Center */}
      <g transform={`translate(40, 40) scale(${primaryScale * 0.4})`}>
        <path d={primaryShape.path} fill={primaryColor} />
      </g>
    </svg>
  );
}

export function WaveStackComposition({
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
        <mask id={`mask-wave-${uniqueId}`}>
          <rect width="100" height="100" fill="white" />
          <g transform={`translate(${centerOffset}, ${centerOffset}) scale(${primaryScale * 0.7})`}>
            <path d={primaryShape.path} fill="black" />
          </g>
        </mask>
      </defs>
      {/* Wave layers */}
      <path d="M0 70 Q25 60 50 70 T100 70 V100 H0 Z" fill={primaryColor} opacity="0.2" />
      <path d="M0 60 Q25 50 50 60 T100 60 V100 H0 Z" fill={primaryColor} opacity="0.3" />
      <path d="M0 50 Q25 40 50 50 T100 50 V100 H0 Z" fill={primaryColor} opacity="0.4" />
      {/* Main container */}
      <rect x="15" y="15" width="70" height="70" rx="14" fill={primaryColor} mask={`url(#mask-wave-${uniqueId})`} />
    </svg>
  );
}

export function CornerAccentComposition({
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
        <mask id={`mask-corner-${uniqueId}`}>
          <rect width="100" height="100" fill="white" />
          <g transform={`translate(${centerOffset}, ${centerOffset}) scale(${primaryScale * 0.85})`}>
            <path d={primaryShape.path} fill="black" />
          </g>
        </mask>
      </defs>
      {/* Corner accents */}
      <g transform="translate(5, 5) scale(0.15)">
        <path d={primaryShape.path} fill={accentColor} opacity="0.4" />
      </g>
      <g transform="translate(85, 5) scale(0.15) rotate(90)">
        <path d={primaryShape.path} fill={accentColor} opacity="0.4" />
      </g>
      <g transform="translate(85, 85) scale(0.15) rotate(180)">
        <path d={primaryShape.path} fill={accentColor} opacity="0.4" />
      </g>
      <g transform="translate(5, 85) scale(0.15) rotate(270)">
        <path d={primaryShape.path} fill={accentColor} opacity="0.4" />
      </g>
      {/* Main container */}
      <rect x="10" y="10" width="80" height="80" rx="18" fill={primaryColor} mask={`url(#mask-corner-${uniqueId})`} />
    </svg>
  );
}

export function SealComposition({
  brand,
  primaryColor,
  accentColor,
  centerOffset,
  primaryScale,
  primaryShape,
  uniqueId,
  className,
}: CompositionProps) {
  const teeth = 24;
  const innerRadius = 35;
  const outerRadius = 42;
  const sealPath = [];

  for (let i = 0; i < teeth; i++) {
    const angle1 = (360 / teeth) * i;
    const angle2 = (360 / teeth) * (i + 0.5);
    const rad1 = (angle1 * Math.PI) / 180;
    const rad2 = (angle2 * Math.PI) / 180;

    const x1 = 50 + Math.cos(rad1) * outerRadius;
    const y1 = 50 + Math.sin(rad1) * outerRadius;
    const x2 = 50 + Math.cos(rad2) * innerRadius;
    const y2 = 50 + Math.sin(rad2) * innerRadius;

    if (i === 0) {
      sealPath.push(`M ${x1} ${y1}`);
    } else {
      sealPath.push(`L ${x1} ${y1}`);
    }
    sealPath.push(`L ${x2} ${y2}`);
  }
  sealPath.push('Z');

  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <mask id={`mask-seal-${uniqueId}`}>
          <rect width="100" height="100" fill="white" />
          <g transform={`translate(${centerOffset + 5}, ${centerOffset + 5}) scale(${primaryScale * 0.6})`}>
            <path d={primaryShape.path} fill="black" />
          </g>
        </mask>
      </defs>
      {/* Seal edge */}
      <path d={sealPath.join(' ')} fill={primaryColor} mask={`url(#mask-seal-${uniqueId})`} />
      {/* Inner circle */}
      <circle cx="50" cy="50" r="28" fill="none" stroke={accentColor} strokeWidth="2" opacity="0.3" />
    </svg>
  );
}

export function LetterFillComposition({
  brand,
  primaryColor,
  accentColor,
  centerOffset,
  primaryScale,
  primaryShape,
  uniqueId,
  className,
}: CompositionProps) {
  const initial = brand.name.charAt(0).toUpperCase();

  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <mask id={`mask-letter-${uniqueId}`}>
          <rect width="100" height="100" fill="black" />
          <text
            x="50"
            y="70"
            fontSize="72"
            fontWeight="900"
            textAnchor="middle"
            fill="white"
            fontFamily="var(--font-heading), system-ui, sans-serif"
          >
            {initial}
          </text>
        </mask>
        <pattern id={`shape-pattern-${uniqueId}`} width="20" height="20" patternUnits="userSpaceOnUse">
          <g transform={`scale(${primaryScale * 0.15})`}>
            <path d={primaryShape.path} fill={primaryColor} />
          </g>
        </pattern>
      </defs>
      {/* Letter filled with shape pattern */}
      <rect
        x="0" y="0"
        width="100" height="100"
        fill={`url(#shape-pattern-${uniqueId})`}
        mask={`url(#mask-letter-${uniqueId})`}
      />
    </svg>
  );
}

export function BadgeTextComposition({
  brand,
  primaryColor,
  accentColor,
  centerOffset,
  primaryScale,
  primaryShape,
  uniqueId,
  className,
}: CompositionProps) {
  const initial = brand.name.charAt(0).toUpperCase();
  const isWhite = primaryColor.toLowerCase() === '#ffffff' || primaryColor.toLowerCase() === '#fff';
  const textColor = isWhite ? '#000000' : '#ffffff';

  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <mask id={`mask-badge-${uniqueId}`}>
          <rect width="100" height="100" fill="white" />
          <g transform={`translate(55, 15) scale(${primaryScale * 0.35})`}>
            <path d={primaryShape.path} fill="black" />
          </g>
        </mask>
      </defs>
      {/* Badge background */}
      <rect x="10" y="10" width="80" height="80" rx="18" fill={primaryColor} mask={`url(#mask-badge-${uniqueId})`} />
      {/* Letter */}
      <text
        x="40"
        y="65"
        fontSize="48"
        fontWeight="700"
        textAnchor="middle"
        fill={textColor}
        fontFamily="var(--font-heading), system-ui, sans-serif"
      >
        {initial}
      </text>
    </svg>
  );
}
