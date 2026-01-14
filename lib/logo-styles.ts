/**
 * Logo Style Definitions
 *
 * Defines all available logo composition styles with metadata for gating.
 * Free users get 5 styles, Pro users get all 30+ styles.
 */

export interface LogoStyle {
  id: string;
  name: string;
  description: string;
  tier: 'free' | 'premium';
  category: 'basic' | 'gradient' | '3d' | 'glass' | 'pattern' | 'typography' | 'advanced';
}

// Free styles available to all users
export const FREE_STYLES = ['container', 'frame', 'monogram', 'diamond', 'grid'] as const;

// All logo styles with metadata
export const LOGO_STYLES: LogoStyle[] = [
  // ============================================================
  // FREE TIER (5 styles)
  // ============================================================
  {
    id: 'container',
    name: 'Container',
    description: 'Shape cut out of rounded square with negative space',
    tier: 'free',
    category: 'basic',
  },
  {
    id: 'frame',
    name: 'Frame',
    description: 'Shape centered inside a bordered frame',
    tier: 'free',
    category: 'basic',
  },
  {
    id: 'monogram',
    name: 'Monogram',
    description: 'Letter badge with shape accent in corner',
    tier: 'free',
    category: 'basic',
  },
  {
    id: 'diamond',
    name: 'Diamond',
    description: 'Shape in 45° rotated container',
    tier: 'free',
    category: 'basic',
  },
  {
    id: 'grid',
    name: 'Grid',
    description: '3x3 construction pattern with cells',
    tier: 'free',
    category: 'basic',
  },

  // ============================================================
  // PREMIUM TIER - Gradient Effects
  // ============================================================
  {
    id: 'gradient_linear',
    name: 'Linear Gradient',
    description: 'Shape with smooth linear gradient fill',
    tier: 'premium',
    category: 'gradient',
  },
  {
    id: 'gradient_radial',
    name: 'Radial Gradient',
    description: 'Shape with radial gradient emanating from center',
    tier: 'premium',
    category: 'gradient',
  },
  {
    id: 'gradient_mesh',
    name: 'Mesh Gradient',
    description: 'Complex mesh gradient background with shape overlay',
    tier: 'premium',
    category: 'gradient',
  },
  {
    id: 'duotone',
    name: 'Duotone',
    description: 'Two-color split composition',
    tier: 'premium',
    category: 'gradient',
  },

  // ============================================================
  // PREMIUM TIER - 3D & Depth Effects
  // ============================================================
  {
    id: 'isometric',
    name: 'Isometric',
    description: 'Shape rendered in isometric 3D perspective',
    tier: 'premium',
    category: '3d',
  },
  {
    id: 'shadow_depth',
    name: 'Shadow Depth',
    description: 'Multiple shadow layers creating depth illusion',
    tier: 'premium',
    category: '3d',
  },
  {
    id: 'layered_3d',
    name: 'Layered 3D',
    description: 'Stacked layers with offset creating 3D stack effect',
    tier: 'premium',
    category: '3d',
  },
  {
    id: 'perspective',
    name: 'Perspective',
    description: 'Shape with vanishing point perspective transform',
    tier: 'premium',
    category: '3d',
  },

  // ============================================================
  // PREMIUM TIER - Glass & Modern Effects
  // ============================================================
  {
    id: 'glassmorphism',
    name: 'Glassmorphism',
    description: 'Frosted glass effect with blur and transparency',
    tier: 'premium',
    category: 'glass',
  },
  {
    id: 'neon_glow',
    name: 'Neon Glow',
    description: 'Outer glow effect with color bleed',
    tier: 'premium',
    category: 'glass',
  },
  {
    id: 'soft_shadow',
    name: 'Soft Shadow',
    description: 'Soft, diffused shadow beneath shape',
    tier: 'premium',
    category: 'glass',
  },
  {
    id: 'blur_gradient',
    name: 'Blur Gradient',
    description: 'Blurred shape background with sharp overlay',
    tier: 'premium',
    category: 'glass',
  },

  // ============================================================
  // PREMIUM TIER - Geometric Patterns
  // ============================================================
  {
    id: 'tessellation',
    name: 'Tessellation',
    description: 'Repeating shape pattern in tile formation',
    tier: 'premium',
    category: 'pattern',
  },
  {
    id: 'honeycomb',
    name: 'Honeycomb',
    description: 'Hexagonal grid with shape integration',
    tier: 'premium',
    category: 'pattern',
  },
  {
    id: 'kaleidoscope',
    name: 'Kaleidoscope',
    description: 'Radial symmetry with mirrored shapes',
    tier: 'premium',
    category: 'pattern',
  },
  {
    id: 'spiral_golden',
    name: 'Golden Spiral',
    description: 'Golden ratio spiral composition',
    tier: 'premium',
    category: 'pattern',
  },

  // ============================================================
  // PREMIUM TIER - Typography Mashup
  // ============================================================
  {
    id: 'letter_fill',
    name: 'Letter Fill',
    description: 'Letter outline filled with shape pattern',
    tier: 'premium',
    category: 'typography',
  },
  {
    id: 'badge_text',
    name: 'Badge Text',
    description: 'Shape badge with integrated text',
    tier: 'premium',
    category: 'typography',
  },

  // ============================================================
  // PREMIUM TIER - Advanced Compositions
  // ============================================================
  {
    id: 'orbit',
    name: 'Orbit',
    description: 'Multiple shapes orbiting central element',
    tier: 'premium',
    category: 'advanced',
  },
  {
    id: 'explosion',
    name: 'Explosion',
    description: 'Shapes radiating outward from center',
    tier: 'premium',
    category: 'advanced',
  },
  {
    id: 'wave_stack',
    name: 'Wave Stack',
    description: 'Multiple wave layers with depth',
    tier: 'premium',
    category: 'advanced',
  },
  {
    id: 'corner_accent',
    name: 'Corner Accent',
    description: 'Shape with decorative corner flourishes',
    tier: 'premium',
    category: 'advanced',
  },
  {
    id: 'seal',
    name: 'Seal',
    description: 'Official seal/stamp style composition',
    tier: 'premium',
    category: 'advanced',
  },
  {
    id: 'tech_circuit',
    name: 'Tech Circuit',
    description: 'Shape with circuit line accents',
    tier: 'premium',
    category: 'advanced',
  },

  // Existing styles moved to premium
  {
    id: 'radial',
    name: 'Radial',
    description: 'Shapes arranged in circular pattern',
    tier: 'premium',
    category: 'pattern',
  },
  {
    id: 'cluster',
    name: 'Cluster',
    description: 'Organic grouping of shapes',
    tier: 'premium',
    category: 'advanced',
  },
  {
    id: 'overlap',
    name: 'Overlap',
    description: 'Layered shapes with opacity',
    tier: 'premium',
    category: 'advanced',
  },
  {
    id: 'spiral',
    name: 'Spiral',
    description: 'Shapes in spiral pattern',
    tier: 'premium',
    category: 'pattern',
  },
  {
    id: 'wave',
    name: 'Wave',
    description: 'Horizontal wave of shapes',
    tier: 'premium',
    category: 'pattern',
  },
  {
    id: 'split',
    name: 'Split',
    description: 'Two complementary halves with negative space',
    tier: 'premium',
    category: 'basic',
  },
  {
    id: 'corner',
    name: 'Corner',
    description: 'Shape in corner with accent',
    tier: 'premium',
    category: 'basic',
  },
];

// Helper functions
export function getStyleById(id: string): LogoStyle | undefined {
  return LOGO_STYLES.find(style => style.id === id);
}

export function getFreeStyles(): LogoStyle[] {
  return LOGO_STYLES.filter(style => style.tier === 'free');
}

export function getPremiumStyles(): LogoStyle[] {
  return LOGO_STYLES.filter(style => style.tier === 'premium');
}

export function getStylesByCategory(category: LogoStyle['category']): LogoStyle[] {
  return LOGO_STYLES.filter(style => style.category === category);
}

export function isStyleFree(styleId: string): boolean {
  return FREE_STYLES.includes(styleId as typeof FREE_STYLES[number]);
}

export function getAvailableStyles(isPro: boolean): LogoStyle[] {
  return isPro ? LOGO_STYLES : getFreeStyles();
}

export function getAllStyleIds(): string[] {
  return LOGO_STYLES.map(style => style.id);
}

export type LogoStyleId = typeof LOGO_STYLES[number]['id'];
