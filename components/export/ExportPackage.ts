import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { BrandIdentity } from '@/lib/data';
import { generateSimpleLogoSVG } from '@/components/export/ExportSVG';
import {
  getStoredLogoSVG,
  generateStoredWordmarkSVG,
  generateStoredFaviconSVG,
  generateDarkLightVariants,
  getLogoVariationsForExport,
} from '@/components/logo-engine/renderers/stored-logo-export';
import { generateAllMockups } from '@/components/export/ExportMockups';
import { generateTypographyExport, generateTypographyJSON } from '@/components/export/ExportTypography';

export async function exportBrandPackage(brand: BrandIdentity) {
  const zip = new JSZip();
  const folderName = brand.name.toLowerCase().replace(/\s+/g, '-');
  const root = zip.folder(folderName);

  if (!root) {
    console.error("Failed to create zip folder");
    return;
  }

  // 1. ICONS / LOGOS - Both composed (visual) and simple (shape-only) versions
  const icons = root.folder("icons");
  if (icons) {
    // Composed logos (EXACT match to preview - uses stored SVG)
    icons.file("logo-composed-color.svg", getStoredLogoSVG(brand, 'color'));
    icons.file("logo-composed-black.svg", getStoredLogoSVG(brand, 'black'));
    icons.file("logo-composed-white.svg", getStoredLogoSVG(brand, 'white'));

    // Dark mode variant (auto-adjusted for dark backgrounds)
    const { dark: darkVariant } = generateDarkLightVariants(brand);
    icons.file("logo-dark-mode.svg", darkVariant);

    // Simple shape-only logos (clean vector of just the shape)
    icons.file("logo-simple-color.svg", generateSimpleLogoSVG(brand, 'color'));
    icons.file("logo-simple-black.svg", generateSimpleLogoSVG(brand, 'black'));
    icons.file("logo-simple-white.svg", generateSimpleLogoSVG(brand, 'white'));

    // Wordmark (logo + brand name) - uses stored logo
    icons.file("wordmark-color.svg", generateStoredWordmarkSVG(brand, 'color'));
    icons.file("wordmark-black.svg", generateStoredWordmarkSVG(brand, 'black'));
    icons.file("wordmark-white.svg", generateStoredWordmarkSVG(brand, 'white'));

    // Favicon - uses stored logo
    icons.file("favicon.svg", generateStoredFaviconSVG(brand));

    // 6 Standard Logo Variations (NEW)
    const variations = root.folder("variations");
    if (variations) {
      const logoVariations = getLogoVariationsForExport(brand);

      // 1. Horizontal lockup (icon left, wordmark right)
      if (logoVariations.horizontal) {
        variations.file("logo-horizontal.svg", logoVariations.horizontal);
      }

      // 2. Stacked lockup (icon top, wordmark below)
      if (logoVariations.stacked) {
        variations.file("logo-stacked.svg", logoVariations.stacked);
      }

      // 3. Icon only (symbol without text)
      if (logoVariations.iconOnly) {
        variations.file("logo-icon-only.svg", logoVariations.iconOnly);
      }

      // 4. Wordmark only (text without symbol)
      if (logoVariations.wordmarkOnly) {
        variations.file("logo-wordmark-only.svg", logoVariations.wordmarkOnly);
      }

      // 5. Dark version (for light backgrounds)
      if (logoVariations.dark) {
        variations.file("logo-dark.svg", logoVariations.dark);
      }

      // 6. Light version (for dark backgrounds)
      if (logoVariations.light) {
        variations.file("logo-light.svg", logoVariations.light);
      }
    }
  }

  // 1.5 MOCKUPS - Brand application mockups
  const mockups = root.folder("mockups");
  if (mockups) {
    const allMockups = generateAllMockups(brand);

    for (const mockup of allMockups) {
      mockups.file(mockup.filename, mockup.svg);
    }
  }

  // 2. TOKENS / CODE
  const tokens = root.folder("tokens");
  if (tokens) {
    // A. theme.json
    tokens.file("theme.json", JSON.stringify(brand.theme, null, 2));

    // B. tailwind.config.js
    const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '${brand.theme.tokens.light.bg}',
          100: '${brand.theme.tokens.light.surface}',
          500: '${brand.theme.tokens.light.primary}',
          900: '${brand.theme.tokens.light.text}',
        }
      },
      fontFamily: {
        sans: ['${brand.font.name}', 'sans-serif'],
      }
    },
  },
}`;
    tokens.file("tailwind.config.js", tailwindConfig);

    // C. css-variables.css
    const cssVars = `:root {
  --brand-primary: ${brand.theme.tokens.light.primary};
  --brand-bg: ${brand.theme.tokens.light.bg};
  --brand-surface: ${brand.theme.tokens.light.surface};
  --brand-text: ${brand.theme.tokens.light.text};
  --font-heading: '${brand.font.headingName || brand.font.name}';
  --font-body: '${brand.font.bodyName || brand.font.name}';
  ${brand.font.monoName ? `--font-mono: '${brand.font.monoName}';` : ''}
}`;
    tokens.file("variables.css", cssVars);
  }

  // 2.5 TYPOGRAPHY - Font pairing and specimen
  const typography = root.folder("typography");
  if (typography) {
    const typoExport = generateTypographyExport(brand);

    // Typography CSS variables (detailed)
    typography.file("typography.css", typoExport.cssVariables);

    // Typography JSON (font metadata)
    typography.file("typography.json", generateTypographyJSON(brand));

    // Typography specimen SVG
    typography.file("typography-specimen.svg", typoExport.specimenSvg);

    // Google Fonts import snippet
    const googleFontsSnippet = `<!-- Google Fonts Import -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${typoExport.googleFontsUrl}" rel="stylesheet">

/* CSS Import Alternative */
@import url('${typoExport.googleFontsUrl}');
`;
    typography.file("google-fonts-import.txt", googleFontsSnippet);
  }

  // 3. README
  const readme = `
# ${brand.name} Brand Identity
Generated by Glyph (https://glyph.software)

## Contents
- /icons: SVG vector logo files
- /variations: 6 standard logo variations for different use cases
- /mockups: Brand application mockups (business card, social media, etc.)
- /typography: Font pairings, CSS variables, and specimen
- /tokens: Development tokens for Tailwind CSS and CSS variables

## Logo Files

### Composed Logos (RECOMMENDED)
These match exactly what you see in the app - the full visual composition:
- logo-composed-color.svg - Primary brand color
- logo-composed-black.svg - Monotone black
- logo-composed-white.svg - For dark backgrounds

### Simple Logos
Clean vector of just the brand shape:
- logo-simple-color.svg - Primary color
- logo-simple-black.svg - Monotone black
- logo-simple-white.svg - For dark backgrounds

### Wordmarks
Logo with brand name text:
- wordmark-color.svg
- wordmark-black.svg

### Favicon
- favicon.svg - Optimized for browser tabs

## Logo Variations (/variations folder)

All 6 standard logo variations for professional brand usage:

1. **logo-horizontal.svg** - Horizontal lockup (icon left, wordmark right)
   Best for: Website headers, business cards, wide format applications

2. **logo-stacked.svg** - Stacked lockup (icon top, wordmark below)
   Best for: Social media profiles, app icons with text, square formats

3. **logo-icon-only.svg** - Icon only (symbol without text)
   Best for: Favicons, app icons, small spaces, social media avatars

4. **logo-wordmark-only.svg** - Wordmark only (text without symbol)
   Best for: Co-branding, text-heavy contexts, when symbol is visible elsewhere

5. **logo-dark.svg** - Dark version (black/dark colors)
   Best for: Use on white or light-colored backgrounds

6. **logo-light.svg** - Light version (white/light colors)
   Best for: Use on black, dark, or colored backgrounds

## Brand Mockups (/mockups folder)

Professional brand application mockups:

1. **mockup-business-card.svg** - 3D business card with shadow
   Use for: Presentations, client previews, portfolio

2. **mockup-linkedin-banner.svg** - LinkedIn cover image (1584x396)
   Use for: Social media profile headers

3. **mockup-website-header.svg** - Browser window with website
   Use for: Web design presentations, pitch decks

4. **mockup-mobile-app.svg** - iPhone with app splash screen
   Use for: App store screenshots, mobile presentations

5. **mockup-poster.svg** - Large format poster/signage
   Use for: Print collateral, outdoor advertising previews

6. **mockup-letterhead.svg** - A4 document with letterhead
   Use for: Stationery previews, corporate materials

## Typography (/typography folder)

Font pairing and typography assets:

1. **typography.css** - Complete CSS variables for fonts, sizes, weights, and spacing
2. **typography.json** - Font metadata and usage guidelines
3. **typography-specimen.svg** - Visual specimen showing all fonts and characters
4. **google-fonts-import.txt** - Ready-to-use Google Fonts import snippets

### Font Pairing
- **Display Font:** ${brand.font.headingName || brand.font.name} (for headings and logo text)
- **Body Font:** ${brand.font.bodyName || brand.font.name} (for paragraphs and content)
${brand.font.monoName ? `- **Mono Font:** ${brand.font.monoName} (for code and technical text)` : ''}

## Usage
- Use 'logo-composed-color.svg' for most applications
- Use white/light variants on dark backgrounds
- Always maintain clear space around the logo
- Choose the appropriate variation based on context and background

## Fonts
Primary Font: ${brand.font.headingName || brand.font.name}
Body Font: ${brand.font.bodyName || brand.font.name}
${brand.font.monoName ? `Mono Font: ${brand.font.monoName}` : ''}
This brand uses Google Fonts. You may need to license them for offline use.
`;
  root.file("README.txt", readme.trim());

  // GENERATE ZIP
  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, `${folderName}-assets.zip`);
}
