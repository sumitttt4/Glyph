/**
 * Glyph Core Data Types
 * 
 * Re-exports types from intelligence engine modules
 * and defines the central BrandIdentity interface.
 */

import { Theme, ThemeTokens } from './themes';
import { Shape } from './shapes';
import { FontFamily, FontPairing } from './typography';

export type { Theme, ThemeTokens, Shape, FontFamily, FontPairing };

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
  logoLayout?: 'default' | 'swiss' | 'bauhaus' | 'minimal_grid' | 'organic_fluid' | 'generative';

  // Procedural Logo Engine
  logoIcon?: string;      // Lucide icon name

  logoContainer?: string; // Container shape key
  logoAssemblerLayout?: 'icon_left' | 'icon_right' | 'stacked' | 'badge' | 'monogram';

  canvasStyle?: 'solid' | 'gradient' | 'mesh';  // Background style
  font: FontPair;

  // Uniqueness Seed (timestamp + random for parametric variations)
  generationSeed: number;

  // Strategy Core
  strategy?: {
    mission: string;
    vision: string;
    values: string[];
    audience: string;
    tone: string;
  };

  createdAt: Date;
}
