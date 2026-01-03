/**
 * MarkZero Core Data Types
 * 
 * Re-exports types from intelligence engine modules
 * and defines the central BrandIdentity interface.
 */

// Re-export from intelligence engine modules
export type { Theme, ThemeTokens } from './themes';
export type { Shape } from './shapes';
export type { FontFamily, FontPairing } from './typography';

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
  theme: {
    id: string;
    name: string;
    tags: string[];
    tokens: {
      light: { bg: string; text: string; primary: string; surface: string; muted: string; border: string };
      dark: { bg: string; text: string; primary: string; surface: string; muted: string; border: string };
    };
  };
  shape: {
    id: string;
    name: string;
    path: string;
    viewBox: string;
    tags: string[];
  };
  font: FontPair;
  createdAt: Date;
}
