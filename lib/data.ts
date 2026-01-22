/**
 * Glyph Core Data Types
 *
 * Re-exports types from intelligence engine modules
 * and defines the central BrandIdentity interface.
 */

import { Theme, ThemeTokens } from './themes';
import { Shape } from './shapes';
import { FontFamily, FontPairing } from './typography';
import {
  GeneratedLogo,
  LogoVariationType,
  LogoVariation,
  LogoVariations,
  GeneratedLogoWithVariations,
} from '@/components/logo-engine/types';

export type {
  Theme,
  ThemeTokens,
  Shape,
  FontFamily,
  FontPairing,
  GeneratedLogo,
  LogoVariationType,
  LogoVariation,
  LogoVariations,
  GeneratedLogoWithVariations,
};

// Font Pair for generated brands (simplified)
export interface FontPair {
  id: string;
  name: string;
  heading: string;  // CSS class or font family
  body: string;     // CSS class or font family
  tags: string[];
}

// The main output of the generator
export interface BrandIdentity {
  id: string;
  vibe: string;
  name: string;

  // Visual Core
  theme: Theme;
  shape: Shape;
  archetype?: 'symbol' | 'wordmark' | 'both'; // Logo type: symbol-only, text-only, or combined
  logoLayout?: 'default' | 'swiss' | 'bauhaus' | 'minimal_grid' | 'organic_fluid' | 'generative' | 'radial';

  // Procedural Logo Engine
  logoIcon?: string;      // Lucide icon name

  logoContainer?: string; // Container shape key
  logoAssemblerLayout?: 'icon_left' | 'icon_right' | 'stacked' | 'badge' | 'monogram' | 'icon_only';
  logoTweaks?: {
    scale: number;    // 0.5 to 1.5
    gap: number;      // 0 to 48px
    rotate: number;  // 0 to 360deg
  };

  canvasStyle?: 'solid' | 'gradient' | 'mesh';  // Background style

  // Logo Engine v5 - Premium Generated Logos
  generatedLogos?: GeneratedLogo[];  // Array of premium bezier-based logos
  selectedLogoIndex?: number;        // Currently selected logo index

  font: {
    id: string;
    name: string;
    heading: string;  // CSS class or font family
    body: string;     // CSS class or font family
    mono?: string;    // CSS class or font family for code/technical
    headingName?: string; // Human readable
    bodyName?: string; // Human readable
    monoName?: string; // Human readable mono font name
    tags: string[];
    weights?: {
      heading: number[];
      body: number[];
      mono?: number[];
    };
  };


  // Uniqueness Seed (timestamp + random for parametric variations)
  generationSeed: number;

  // Premium Strategy Module
  strategy?: {
    tagline: string;
    mission: string;
    vision: string;
    values: string[]; // Legacy support
    audience: string; // Legacy support
    archetype: string;
    voice: {
      tone: string;
      dos: string[];
      donts: string[];
    };
    marketing: {
      headline: string;
      subhead: string;
      about: string;
    };
  };



  createdAt: Date;
}
