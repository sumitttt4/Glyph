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
  canvasStyle?: 'solid' | 'gradient' | 'mesh';  // Background style
  font: FontPair;

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
