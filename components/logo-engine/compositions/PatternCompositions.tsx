/**
 * Geometric Pattern Composition Styles
 * Premium effects with tessellation, honeycomb, kaleidoscope, spiral
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

export function TessellationComposition({
  brand,
  primaryColor,
  accentColor,
  centerOffset,
  primaryScale,
  primaryShape,
  uniqueId,
  className,
}: CompositionProps) {
  const tileSize = 25;
  const tiles = [];

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const x = col * tileSize + 5;
      const y = row * tileSize + 5;
      const opacity = 0.3 + ((row + col) % 3) * 0.25;
      tiles.push(
        <g key={`${row}-${col}`} transform={`translate(${x}, ${y}) scale(${tileSize / 100})`}>
          <g transform={`translate(${centerOffset * 0.5}, ${centerOffset * 0.5}) scale(${primaryScale * 0.4})`}>
            <path d={primaryShape.path} fill={primaryColor} opacity={opacity} />
          </g>
        </g>
      );
    }
  }

  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      {tiles}
    </svg>
  );
}

export function HoneycombComposition({
  brand,
  primaryColor,
  accentColor,
  centerOffset,
  primaryScale,
  primaryShape,
  uniqueId,
  className,
}: CompositionProps) {
  // Hexagon path for honeycomb
  const hexPath = "M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z";

  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <mask id={`mask-honey-${uniqueId}`}>
          <rect width="100" height="100" fill="white" />
          <g transform={`translate(${centerOffset}, ${centerOffset}) scale(${primaryScale * 0.7})`}>
            <path d={primaryShape.path} fill="black" />
          </g>
        </mask>
        <pattern id={`hex-pattern-${uniqueId}`} width="30" height="26" patternUnits="userSpaceOnUse">
          <path d="M15 0 L30 7.5 L30 22.5 L15 30 L0 22.5 L0 7.5 Z" fill="none" stroke={primaryColor} strokeWidth="1" opacity="0.3" transform="scale(0.5)" />
        </pattern>
      </defs>
      {/* Honeycomb background */}
      <rect x="0" y="0" width="100" height="100" fill={`url(#hex-pattern-${uniqueId})`} />
      {/* Central hexagon with shape cutout */}
      <g transform="translate(50, 50) scale(0.7) translate(-50, -50)">
        <path d={hexPath} fill={primaryColor} mask={`url(#mask-honey-${uniqueId})`} />
      </g>
    </svg>
  );
}

export function KaleidoscopeComposition({
  brand,
  primaryColor,
  accentColor,
  centerOffset,
  primaryScale,
  primaryShape,
  uniqueId,
  className,
}: CompositionProps) {
  const segments = 6;
  const elements = [];

  for (let i = 0; i < segments; i++) {
    const angle = (360 / segments) * i;
    elements.push(
      <g key={i} transform={`rotate(${angle}, 50, 50)`}>
        <g transform={`translate(50, 20) scale(${primaryScale * 0.25})`}>
          <path d={primaryShape.path} fill={primaryColor} opacity={0.6 + (i % 2) * 0.4} />
        </g>
      </g>
    );
  }

  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <mask id={`mask-kaleid-${uniqueId}`}>
          <rect width="100" height="100" fill="white" />
          <circle cx="50" cy="50" r="8" fill="black" />
        </mask>
      </defs>
      {elements}
      {/* Center dot */}
      <circle cx="50" cy="50" r="6" fill={accentColor} />
    </svg>
  );
}

export function GoldenSpiralComposition({
  brand,
  primaryColor,
  accentColor,
  centerOffset,
  primaryScale,
  primaryShape,
  uniqueId,
  className,
}: CompositionProps) {
  // Golden ratio spiral approximation
  const phi = 1.618;
  const elements = [];

  for (let i = 0; i < 8; i++) {
    const scale = Math.pow(phi, -i) * 0.8;
    const angle = i * 90;
    const radius = 35 * Math.pow(phi, -i * 0.5);
    const x = 50 + Math.cos((angle * Math.PI) / 180) * radius;
    const y = 50 + Math.sin((angle * Math.PI) / 180) * radius;

    elements.push(
      <g key={i} transform={`translate(${x}, ${y}) scale(${primaryScale * scale * 0.3}) rotate(${angle})`}>
        <path d={primaryShape.path} fill={primaryColor} opacity={0.3 + i * 0.08} />
      </g>
    );
  }

  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      {elements}
      {/* Central shape */}
      <g transform={`translate(${centerOffset}, ${centerOffset}) scale(${primaryScale * 0.5})`}>
        <path d={primaryShape.path} fill={primaryColor} />
      </g>
    </svg>
  );
}
