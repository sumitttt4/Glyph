/**
 * Premium Logo Compositions
 *
 * Export all composition components for use in LogoComposition
 */

// Gradient Effects
export {
  GradientLinearComposition,
  GradientRadialComposition,
  GradientMeshComposition,
  DuotoneComposition,
} from './GradientCompositions';

// 3D & Depth Effects
export {
  IsometricComposition,
  ShadowDepthComposition,
  Layered3DComposition,
  PerspectiveComposition,
} from './ThreeDCompositions';

// Glass & Modern Effects
export {
  GlassmorphismComposition,
  NeonGlowComposition,
  SoftShadowComposition,
  BlurGradientComposition,
} from './GlassCompositions';

// Geometric Patterns
export {
  TessellationComposition,
  HoneycombComposition,
  KaleidoscopeComposition,
  GoldenSpiralComposition,
} from './PatternCompositions';

// Advanced Compositions
export {
  OrbitComposition,
  ExplosionComposition,
  WaveStackComposition,
  CornerAccentComposition,
  SealComposition,
  LetterFillComposition,
  BadgeTextComposition,
} from './AdvancedCompositions';

// Composition props interface
export interface CompositionProps {
  brand: import('@/lib/data').BrandIdentity;
  primaryColor: string;
  accentColor: string;
  centerOffset: number;
  primaryScale: number;
  primaryShape: import('@/lib/shapes').Shape;
  uniqueId: string;
  className?: string;
}
