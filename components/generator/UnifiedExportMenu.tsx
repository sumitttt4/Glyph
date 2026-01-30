"use client";

import React, { useState } from 'react';
import { BrandIdentity } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ChevronDown, FileJson, ImageIcon, Package, Share2, FileText, Code2, Box, Check, Loader2, Download, Play, Smartphone, Globe, Figma } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup
} from '@/components/ui/dropdown-menu';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import {
    setExportState,
    hasValidExportState,
    getStoredSvgForExport,
    getStoredColors,
    getStoredFonts,
} from '@/lib/export-state';
import {
    getStoredLogoSVG,
    getSelectedLogo,
    getLogoVariationsForExport,
} from '@/components/logo-engine/renderers/stored-logo-export';

interface UnifiedExportMenuProps {
    brand: BrandIdentity;
    onViewGuidelines?: () => void;
}

export function UnifiedExportMenu({ brand, onViewGuidelines }: UnifiedExportMenuProps) {
    const [isExporting, setIsExporting] = useState(false);
    const [activeExport, setActiveExport] = useState<string | null>(null);

    // CRITICAL: Sync export state before any export operation
    // This ensures exports match exactly what the user sees in preview
    const syncExportState = () => {
        const selectedLogo = getSelectedLogo(brand);
        const storedSvg = selectedLogo?.svg || '';

        if (!storedSvg && brand.generatedLogos?.length) {
            // Fallback to first logo if selected isn't available
            const fallbackSvg = brand.generatedLogos[0]?.svg || '';
            if (fallbackSvg) {
                setExportState(brand, fallbackSvg, brand.generatedLogos[0]);
                return true;
            }
        }

        if (storedSvg) {
            setExportState(brand, storedSvg, selectedLogo);
            return true;
        }

        console.error('[UnifiedExportMenu] No logo SVG available for export');
        return false;
    };

    // HELPER: Download Text File
    const downloadText = (content: string, filename: string) => {
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, filename);
    };

    // 1. Tailwind Config - Full color palette and typography
    const exportTailwind = () => {
        // Sync state before export
        syncExportState();

        const t = brand.theme.tokens;
        const config = `/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        // Light mode brand colors
        brand: {
          primary: '${t.light.primary}',
          accent: '${t.light.accent || t.light.primary}',
          background: '${t.light.bg}',
          surface: '${t.light.surface}',
          text: '${t.light.text}',
          muted: '${t.light.muted || '#666666'}',
          border: '${t.light.border || '#e5e5e5'}',
        },
        // Dark mode brand colors
        dark: {
          primary: '${t.dark?.primary || t.light.primary}',
          accent: '${t.dark?.accent || t.light.accent || t.light.primary}',
          background: '${t.dark?.bg || '#0a0a0a'}',
          surface: '${t.dark?.surface || '#1a1a1a'}',
          text: '${t.dark?.text || '#ffffff'}',
          muted: '${t.dark?.muted || '#888888'}',
          border: '${t.dark?.border || '#333333'}',
        },
      },
      fontFamily: {
        display: ['${brand.font.headingName || brand.font.name}', 'system-ui', 'sans-serif'],
        body: ['${brand.font.bodyName || brand.font.name}', 'system-ui', 'sans-serif'],
        ${brand.font.monoName ? `mono: ['${brand.font.monoName}', 'monospace'],` : ''}
      },
    },
  },
  plugins: [],
};

/*
 * CSS Variables (add to your global CSS):
 *
 * :root {
 *   --color-primary: ${t.light.primary};
 *   --color-accent: ${t.light.accent || t.light.primary};
 *   --color-background: ${t.light.bg};
 *   --color-surface: ${t.light.surface};
 *   --color-text: ${t.light.text};
 *   --color-muted: ${t.light.muted || '#666666'};
 *   --color-border: ${t.light.border || '#e5e5e5'};
 * }
 *
 * .dark {
 *   --color-primary: ${t.dark?.primary || t.light.primary};
 *   --color-accent: ${t.dark?.accent || t.light.accent || t.light.primary};
 *   --color-background: ${t.dark?.bg || '#0a0a0a'};
 *   --color-surface: ${t.dark?.surface || '#1a1a1a'};
 *   --color-text: ${t.dark?.text || '#ffffff'};
 *   --color-muted: ${t.dark?.muted || '#888888'};
 *   --color-border: ${t.dark?.border || '#333333'};
 * }
 */
`;
        downloadText(config.trim(), 'tailwind.config.js');
    };

    // 2. SVG Logo - Uses stored export state (NEVER regenerates)
    const exportSVG = () => {
        // Sync state before export
        if (!syncExportState()) {
            alert("No logo available. Please generate a logo first.");
            return;
        }

        try {
            // Get the exact SVG from stored state - this matches what user sees
            const svgString = getStoredLogoSVG(brand, 'color');

            if (!svgString) {
                alert("Could not retrieve logo. Please try regenerating.");
                return;
            }

            // Add XML declaration for proper SVG file
            const fullSvg = svgString.startsWith('<?xml')
                ? svgString
                : `<?xml version="1.0" encoding="UTF-8"?>\n${svgString}`;

            const blob = new Blob([fullSvg], { type: 'image/svg+xml;charset=utf-8' });
            saveAs(blob, `${brand.name.toLowerCase().replace(/\s+/g, '-')}-logo.svg`);
        } catch (e) {
            console.error('SVG export failed:', e);
            alert("SVG export failed. Please try again.");
        }
    };

    // 3. React Component - Uses actual stored SVG content
    const exportReact = () => {
        // Sync state before export
        if (!syncExportState()) {
            alert("No logo available. Please generate a logo first.");
            return;
        }

        try {
            const svgString = getStoredLogoSVG(brand, 'color');
            if (!svgString) {
                alert("Could not retrieve logo. Please try regenerating.");
                return;
            }

            // Extract viewBox from SVG
            const viewBoxMatch = svgString.match(/viewBox="([^"]+)"/);
            const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 100 100';

            // Extract inner content (without XML declaration and outer svg tags)
            const innerContent = svgString
                .replace(/<\?xml[^?]*\?>/g, '')
                .replace(/<svg[^>]*>/g, '')
                .replace(/<\/svg>/g, '')
                .trim()
                // Convert to JSX-compatible format
                .replace(/class=/g, 'className=')
                .replace(/stroke-width=/g, 'strokeWidth=')
                .replace(/stroke-linecap=/g, 'strokeLinecap=')
                .replace(/stroke-linejoin=/g, 'strokeLinejoin=')
                .replace(/fill-rule=/g, 'fillRule=')
                .replace(/clip-rule=/g, 'clipRule=')
                .replace(/stop-color=/g, 'stopColor=')
                .replace(/stop-opacity=/g, 'stopOpacity=');

            const componentName = brand.name.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
            const t = brand.theme.tokens;

            const component = `import React from 'react';

/**
 * ${brand.name} Logo Component
 * Generated by Glyph - https://glyph.software
 *
 * Usage:
 *   <${componentName}Logo size={60} variant="color" />
 *
 * Props:
 *   size: number (default: 40) - Height of the logo in pixels
 *   variant: 'color' | 'dark' | 'light' (default: 'color')
 *   className: string (optional) - Additional CSS classes
 */

interface ${componentName}LogoProps {
  size?: number;
  variant?: 'color' | 'dark' | 'light';
  className?: string;
}

// Brand colors
const BRAND_COLORS = {
  primary: '${t.light.primary}',
  accent: '${t.light.accent || t.light.primary}',
  background: '${t.light.bg}',
  text: '${t.light.text}',
};

export const ${componentName}Logo: React.FC<${componentName}LogoProps> = ({
  size = 40,
  variant = 'color',
  className = ''
}) => {
  const style: React.CSSProperties = {
    width: size,
    height: size,
    display: 'inline-block',
  };

  // Apply color filter for variants
  if (variant === 'dark') {
    style.filter = 'brightness(0)';
  } else if (variant === 'light') {
    style.filter = 'brightness(0) invert(1)';
  }

  return (
    <svg
      viewBox="${viewBox}"
      className={className}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
    >
      ${innerContent}
    </svg>
  );
};

export default ${componentName}Logo;
`;
            downloadText(component.trim(), `${componentName}Logo.tsx`);
        } catch (e) {
            console.error('React component export failed:', e);
            alert("React component export failed. Please try again.");
        }
    };

    // 4. Animation Export (Lottie + CSS)
    const exportAnimation = async () => {
        // Sync state before export
        if (!syncExportState()) {
            alert("No logo available. Please generate a logo first.");
            return;
        }

        try {
            const { generateLogoAnimation, exportAnimationPackage } = await import('@/components/logo-engine/animation/animation-export');

            const selectedLogo = getSelectedLogo(brand);
            if (!selectedLogo) {
                alert('No logo selected. Please generate a logo first.');
                return;
            }

            // Generate animation for 'fade-in' preset
            const animation = generateLogoAnimation(selectedLogo, 'fade-in', 1000);
            const pkg = exportAnimationPackage(animation);

            // Create ZIP with both files
            const zip = new JSZip();
            zip.file('animation.json', pkg.lottieJson);
            zip.file('animation.css', pkg.cssFile);
            zip.file('README.txt', `# ${brand.name} Logo Animation

Lottie Animation: animation.json
- Import into Lottie player libraries (lottie-web, lottie-react, etc.)
- Test at lottiefiles.com

CSS Animation: animation.css
- Copy keyframes into your stylesheet
- Apply .logo-animation class to your logo element

Generated by Glyph`);

            const content = await zip.generateAsync({ type: 'blob' });
            saveAs(content, `${brand.name.toLowerCase().replace(/\s+/g, '-')}-animation.zip`);
        } catch (e) {
            console.error('Animation export failed:', e);
            alert('Animation export failed. Please try again.');
        }
    };

    // 5. Favicon ICO Export
    const exportFaviconICO = async () => {
        // Sync state before export
        if (!syncExportState()) {
            alert("No logo available. Please generate a logo first.");
            return;
        }

        try {
            const { generateFaviconICO } = await import('@/components/export/ExportFavicon');
            const icoBlob = await generateFaviconICO(brand);
            saveAs(icoBlob, 'favicon.ico');
        } catch (e) {
            console.error('Favicon ICO export failed:', e);
            alert('Favicon ICO export failed. Please try again.');
        }
    };

    // 6. Figma Export (Design tokens + SVG)
    const exportFigma = async () => {
        // Sync state before export
        if (!syncExportState()) {
            alert("No logo available. Please generate a logo first.");
            return;
        }

        try {
            const selectedLogo = getSelectedLogo(brand);
            const logoSvg = getStoredLogoSVG(brand, 'color');
            const t = brand.theme.tokens;

            // Create Figma-compatible design tokens
            const figmaTokens = {
                version: "1.0",
                metadata: {
                    name: brand.name,
                    generator: "Glyph",
                    exportedAt: new Date().toISOString()
                },
                colors: {
                    "brand/primary": { value: t.light.primary, type: "color" },
                    "brand/background": { value: t.light.bg, type: "color" },
                    "brand/surface": { value: t.light.surface, type: "color" },
                    "brand/text": { value: t.light.text, type: "color" },
                    "brand/muted": { value: t.light.muted, type: "color" },
                    "brand/border": { value: t.light.border, type: "color" },
                    "dark/primary": { value: t.dark.primary, type: "color" },
                    "dark/background": { value: t.dark.bg, type: "color" },
                    "dark/surface": { value: t.dark.surface, type: "color" },
                    "dark/text": { value: t.dark.text, type: "color" },
                    "dark/muted": { value: t.dark.muted, type: "color" },
                    "dark/border": { value: t.dark.border, type: "color" }
                },
                typography: {
                    "heading/family": { value: brand.font.headingName || brand.font.name, type: "fontFamily" },
                    "body/family": { value: brand.font.bodyName || brand.font.name, type: "fontFamily" }
                }
            };

            // Create Figma plugin import format
            const figmaPluginData = {
                name: brand.name,
                styles: {
                    colors: Object.entries(figmaTokens.colors).map(([name, data]) => ({
                        name: name.replace('/', ' / '),
                        color: data.value
                    })),
                    typography: [
                        { name: "Heading", fontFamily: brand.font.headingName || brand.font.name, fontWeight: "Bold" },
                        { name: "Body", fontFamily: brand.font.bodyName || brand.font.name, fontWeight: "Regular" }
                    ]
                },
                components: {
                    logo: {
                        svg: logoSvg,
                        algorithm: selectedLogo?.algorithm || 'custom'
                    }
                }
            };

            const zip = new JSZip();
            zip.file('design-tokens.json', JSON.stringify(figmaTokens, null, 2));
            zip.file('figma-import.json', JSON.stringify(figmaPluginData, null, 2));
            zip.file('logo.svg', logoSvg);
            zip.file('README.md', `# ${brand.name} - Figma Export

## How to Import

### Option 1: Figma Tokens Plugin
1. Install "Figma Tokens" plugin from Figma Community
2. Open the plugin in your Figma file
3. Go to Settings > Import > JSON
4. Upload \`design-tokens.json\`
5. Apply tokens to your design

### Option 2: Manual Import
1. Open \`figma-import.json\` to see all color values
2. Create color styles in Figma with the provided HEX values
3. Import \`logo.svg\` directly into Figma

## Color Palette
${Object.entries(figmaTokens.colors).map(([name, data]) => `- ${name}: ${data.value}`).join('\n')}

## Typography
- Heading: ${brand.font.headingName || brand.font.name}
- Body: ${brand.font.bodyName || brand.font.name}

Generated by Glyph - https://glyph.software
`);

            const content = await zip.generateAsync({ type: 'blob' });
            saveAs(content, `${brand.name.toLowerCase().replace(/\s+/g, '-')}-figma-export.zip`);
        } catch (e) {
            console.error('Figma export failed:', e);
            alert('Figma export failed. Please try again.');
        }
    };

    // 7. App Icons Export (iOS + Android)
    const exportAppIcons = async () => {
        // Sync state before export
        if (!syncExportState()) {
            alert("No logo available. Please generate a logo first.");
            return;
        }

        try {
            const { generateAppIcons } = await import('@/components/export/ExportFavicon');
            const { ios, android } = await generateAppIcons(brand);

            const zip = new JSZip();
            zip.file('ios-1024x1024.png', ios);
            zip.file('android-512x512.png', android);
            zip.file('README.txt', `# ${brand.name} App Icons

iOS App Icon: ios-1024x1024.png
- 1024x1024 with proper padding
- No transparency (solid background)
- Upload to App Store Connect

Android App Icon: android-512x512.png
- 512x512 adaptive icon foreground
- 15% padding for safe zone
- Use with ic_launcher

Generated by Glyph`);

            const content = await zip.generateAsync({ type: 'blob' });
            saveAs(content, `${brand.name.toLowerCase().replace(/\s+/g, '-')}-app-icons.zip`);
        } catch (e) {
            console.error('App icons export failed:', e);
            alert('App icons export failed. Please try again.');
        }
    };

    // 8. Social Media Kit Export
    const exportSocialMediaKit = async () => {
        // Sync state before export
        if (!syncExportState()) {
            alert("No logo available. Please generate a logo first.");
            return;
        }

        try {
            const { exportBrandPackage } = await import('@/components/export/ExportPackage');

            // Generate the full package which includes social media assets
            // For a dedicated social kit, we could extract just the social folder
            // But for maximum value, we provide the full package
            await exportBrandPackage(brand);
        } catch (e) {
            console.error('Social media kit export failed:', e);
            alert('Social media kit export failed. Please try again.');
        }
    };

    // 9. Brand Guidelines PDF Export
    const exportBrandGuidelines = async () => {
        // Sync state before export
        if (!syncExportState()) {
            alert("No logo available. Please generate a logo first.");
            return;
        }

        try {
            const { generateBrandBookPDF } = await import('@/components/export/ExportPDF');
            const pdfBlob = await generateBrandBookPDF(brand);
            saveAs(pdfBlob, `${brand.name.toLowerCase().replace(/\s+/g, '-')}-brand-guidelines.pdf`);
        } catch (e) {
            console.error('Brand guidelines export failed:', e);
            alert('Brand guidelines export failed. Please try again.');
        }
    };

    // 10. Full Package Export (ZIP with all assets)
    const exportFullPackage = async () => {
        // Sync state before export
        if (!syncExportState()) {
            alert("No logo available. Please generate a logo first.");
            return;
        }

        try {
            const { exportBrandPackage } = await import('@/components/export/ExportPackage');
            await exportBrandPackage(brand);
        } catch (e) {
            console.error('Full package export failed:', e);
            alert('Full package export failed. Please try again.');
        }
    };

    const handleItemClick = async (action: string, fn: () => void | Promise<void>) => {
        setActiveExport(action);
        setIsExporting(true);
        // Simulate async
        await new Promise(r => setTimeout(r, 800));
        try {
            fn();
        } catch (e) {
            console.error(e);
        }
        setIsExporting(false);
        setActiveExport(null);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="bg-white text-stone-900 border border-stone-200 hover:bg-stone-50 shadow-sm gap-2 rounded-full px-6 shadow-xl hover:shadow-2xl transition-all">
                    {isExporting ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
                    Export
                    <ChevronDown size={14} className="opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-2 rounded-2xl shadow-xl border-stone-100 bg-white/95 backdrop-blur-xl">
                <DropdownMenuLabel className="px-3 py-2 text-xs font-mono text-stone-400 uppercase tracking-widest">
                    Assets & Config
                </DropdownMenuLabel>

                <DropdownMenuGroup className="space-y-1">
                    {/* Tailwind */}
                    <DropdownMenuItem
                        onClick={() => handleItemClick('tailwind', exportTailwind)}
                        className="flex items-start gap-4 p-3 rounded-xl focus:bg-stone-50 cursor-pointer"
                    >
                        <div className="p-2 bg-stone-100 rounded-lg text-stone-600">
                            <SwitchIcon active={activeExport === 'tailwind'} icon={Code2} />
                        </div>
                        <div>
                            <div className="font-semibold text-stone-900">Tailwind Config</div>
                            <div className="text-xs text-stone-500">CSS variables & tokens</div>
                        </div>
                    </DropdownMenuItem>

                    {/* SVG Logo */}
                    <DropdownMenuItem
                        onClick={() => handleItemClick('svg', exportSVG)}
                        className="flex items-start gap-4 p-3 rounded-xl focus:bg-stone-50 cursor-pointer"
                    >
                        <div className="p-2 bg-stone-100 rounded-lg text-stone-600">
                            <SwitchIcon active={activeExport === 'svg'} icon={ImageIcon} />
                        </div>
                        <div>
                            <div className="font-semibold text-stone-900">SVG Logo</div>
                            <div className="text-xs text-stone-500">Vector format</div>
                        </div>
                    </DropdownMenuItem>

                    {/* Favicon ICO - Moved up for better UX */}
                    <DropdownMenuItem
                        onClick={() => handleItemClick('favicon', exportFaviconICO)}
                        className="flex items-start gap-4 p-3 rounded-xl focus:bg-stone-50 cursor-pointer"
                    >
                        <div className="p-2 bg-stone-100 rounded-lg text-stone-600">
                            <SwitchIcon active={activeExport === 'favicon'} icon={Globe} />
                        </div>
                        <div>
                            <div className="font-semibold text-stone-900">Favicon Package</div>
                            <div className="text-xs text-stone-500">All favicon sizes</div>
                        </div>
                    </DropdownMenuItem>

                    {/* Social Media Kit - Direct Export */}
                    <DropdownMenuItem
                        onClick={() => handleItemClick('social', exportSocialMediaKit)}
                        className="flex items-start gap-4 p-3 rounded-xl focus:bg-stone-50 cursor-pointer"
                    >
                        <div className="p-2 bg-stone-100 rounded-lg text-stone-600">
                            <SwitchIcon active={activeExport === 'social'} icon={Share2} />
                        </div>
                        <div>
                            <div className="font-semibold text-stone-900">Social Media Kit</div>
                            <div className="text-xs text-stone-500">Profile pics & banners</div>
                        </div>
                    </DropdownMenuItem>

                    {/* Brand Guidelines - Direct PDF Export */}
                    <DropdownMenuItem
                        onClick={() => handleItemClick('guidelines', exportBrandGuidelines)}
                        className="flex items-start gap-4 p-3 rounded-xl focus:bg-stone-50 cursor-pointer"
                    >
                        <div className="p-2 bg-stone-100 rounded-lg text-stone-600">
                            <SwitchIcon active={activeExport === 'guidelines'} icon={FileText} />
                        </div>
                        <div>
                            <div className="font-semibold text-stone-900">Brand Guidelines</div>
                            <div className="text-xs text-stone-500">PDF-ready Brand Book</div>
                        </div>
                    </DropdownMenuItem>

                    {/* React Component */}
                    <DropdownMenuItem
                        onClick={() => handleItemClick('react', exportReact)}
                        className="flex items-start gap-4 p-3 rounded-xl focus:bg-stone-50 cursor-pointer"
                    >
                        <div className="p-2 bg-stone-100 rounded-lg text-stone-600">
                            <SwitchIcon active={activeExport === 'react'} icon={FileJson} />
                        </div>
                        <div>
                            <div className="font-semibold text-stone-900">React Component</div>
                            <div className="text-xs text-stone-500">Copy-paste ready</div>
                        </div>
                    </DropdownMenuItem>

                    {/* Animation Export */}
                    <DropdownMenuItem
                        onClick={() => handleItemClick('animation', exportAnimation)}
                        className="flex items-start gap-4 p-3 rounded-xl focus:bg-stone-50 cursor-pointer"
                    >
                        <div className="p-2 bg-stone-100 rounded-lg text-stone-600">
                            <SwitchIcon active={activeExport === 'animation'} icon={Play} />
                        </div>
                        <div>
                            <div className="font-semibold text-stone-900">Logo Animation</div>
                            <div className="text-xs text-stone-500">Lottie JSON + CSS keyframes</div>
                        </div>
                    </DropdownMenuItem>

                    {/* App Icons */}
                    <DropdownMenuItem
                        onClick={() => handleItemClick('appicons', exportAppIcons)}
                        className="flex items-start gap-4 p-3 rounded-xl focus:bg-stone-50 cursor-pointer"
                    >
                        <div className="p-2 bg-stone-100 rounded-lg text-stone-600">
                            <SwitchIcon active={activeExport === 'appicons'} icon={Smartphone} />
                        </div>
                        <div>
                            <div className="font-semibold text-stone-900">App Icons</div>
                            <div className="text-xs text-stone-500">iOS 1024px + Android 512px</div>
                        </div>
                    </DropdownMenuItem>

                    {/* Figma Export */}
                    <DropdownMenuItem
                        onClick={() => handleItemClick('figma', exportFigma)}
                        className="flex items-start gap-4 p-3 rounded-xl focus:bg-stone-50 cursor-pointer"
                    >
                        <div className="p-2 bg-stone-100 rounded-lg text-stone-600">
                            <SwitchIcon active={activeExport === 'figma'} icon={Figma} />
                        </div>
                        <div>
                            <div className="font-semibold text-stone-900">Figma Export</div>
                            <div className="text-xs text-stone-500">Design tokens + SVG logo</div>
                        </div>
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="my-2 bg-stone-100" />

                {/* Full Package - Premium Export with ALL Assets */}
                <DropdownMenuItem
                    onClick={() => handleItemClick('fullpackage', exportFullPackage)}
                    className="flex items-start gap-4 p-3 rounded-xl focus:bg-stone-900 focus:text-white group cursor-pointer"
                >
                    <div className="p-2 bg-stone-100 rounded-lg text-stone-900 group-focus:bg-stone-800 group-focus:text-white">
                        <SwitchIcon active={activeExport === 'fullpackage'} icon={Package} />
                    </div>
                    <div>
                        <div className="font-semibold text-stone-900 group-focus:text-white">Full Package</div>
                        <div className="text-xs text-stone-500 group-focus:text-stone-400">ZIP with all assets</div>
                    </div>
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    );
}

import { LucideIcon } from 'lucide-react';

function SwitchIcon({ active, icon: Icon }: { active: boolean, icon: LucideIcon }) {
    if (active) return <Loader2 size={18} className="animate-spin text-orange-500" />;
    return <Icon size={18} />;
}
