"use client";

import { useState, useCallback, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Sidebar, GenerationOptions } from '@/components/generator/Sidebar';
import { Toolbar } from '@/components/generator/Toolbar';
import { LoadingState } from '@/components/generator/LoadingState';
import { WorkbenchBentoGrid } from '@/components/generator/WorkbenchBentoGrid';
import { ProGateModal } from '@/components/generator/ProGateModal';
import { useBrandGenerator } from '@/hooks/use-brand-generator';
import { useSubscription } from '@/hooks/use-subscription';
import { createClient } from '@/lib/supabase/client';
import { useUser, useClerk } from '@clerk/nextjs';
import { exportBrandPackage } from '@/components/export/ExportPackage';
import { generateSocialMediaKit, downloadSocialAsset } from '@/components/export/ExportSocial';
import { downloadBrandBookPDF } from '@/components/export/ExportPDF';
import { CompareOverlay } from '@/components/generator/CompareOverlay';
import { RobotEmptyState } from '@/components/generator/RobotEmptyState';
import { BrandIdentity } from '@/lib/data';
import { SoftGateVariations } from '@/components/generator/SoftGateVariations';
import { StyleGuidePreview } from '@/components/preview/StyleGuidePreview';


function GeneratorContent() {
  const searchParams = useSearchParams();
  const brandGenerators = useBrandGenerator();
  // ... rest of component

  const { brand, generateBrand, isGenerating, resetBrand, setBrand } = brandGenerators;
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedVibe, setSelectedVibe] = useState('minimalist');
  const [viewMode, setViewMode] = useState<'overview' | 'presentation'>('overview');
  const [showProModal, setShowProModal] = useState(false);

  const [isPro, setIsPro] = useState(false);
  const subscription = useSubscription();

  // Update isPro when subscription loads
  // Update isPro when subscription loads
  useEffect(() => {
    if (!subscription.isLoading) {
      setIsPro(subscription.isPro);
    }
  }, [subscription.isPro, subscription.isLoading]);

  // Compare State
  const [compareList, setCompareList] = useState<BrandIdentity[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const handleAddToCompare = () => {
    if (!brand) return;
    if (compareList.find(b => b.id === brand.id)) {
      alert("This brand is already in your comparison list.");
      return;
    }
    if (compareList.length >= 8) {
      alert("You can compare up to 8 brands at a time.");
      return;
    }
    setCompareList([...compareList, brand]);
    // Optional feedback
    const btn = document.activeElement as HTMLElement;
    if (btn) {
      const originalText = btn.innerHTML;
      btn.innerHTML = "<span class='text-green-600'>Added!</span>";
      setTimeout(() => btn.innerHTML = originalText, 1000);
    }
  };

  const handleRemoveFromCompare = (id: string) => {
    setCompareList(prev => prev.filter(b => b.id !== id));
  };

  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Scroll to results on mobile when generation finishes
    if (!isGenerating && brand && window.innerWidth < 768) {
      mainRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isGenerating, brand]);

  // RESTORE STATE: Check for pending projects (History Edit or Login Redirect)
  useEffect(() => {
    const pendingJSON = localStorage.getItem('glyph_pending_project');
    if (pendingJSON) {
      try {
        const pending = JSON.parse(pendingJSON);

        // 1. Exact Restoration (From History Page)
        if (pending.restoreMode && pending.identity) {
          console.log("Restoring exact brand state...");
          setBrand?.(pending.identity);
          localStorage.removeItem('glyph_pending_project');
          return;
        }

        // 2. Pending Inputs (From Login Redirect)
        if (pending.name && pending.vibe) {
          console.log("Restoring pending input state...");
          generateBrand(pending.vibe, pending.name, {
            color: pending.color
          });
          localStorage.removeItem('glyph_pending_project');
        }
      } catch (e) {
        console.error("Failed to restore project:", e);
      }
    }
  }, [generateBrand, setBrand]);

  // PLG: Check Authed Session Helper (Gate)
  const { user } = useUser();
  const { openSignIn } = useClerk();

  const checkAuth = async (): Promise<boolean> => {
    if (user) return true;

    // Not logged in -> Save State & Redirect
    if (brand) {
      const pendingProject = {
        name: brand.name,
        prompt: "Draft Concept",
        vibe: brand.vibe,
        color: brand.theme.tokens.light.primary,
        timestamp: Date.now()
      };
      localStorage.setItem('glyph_pending_project', JSON.stringify(pendingProject));
    }

    window.location.href = '/login?next=/generator';
    return false;
  };

  const handleGenerate = useCallback((options: GenerationOptions) => {
    // Scroll to top to show the loading state and result
    window.scrollTo({ top: 0, behavior: 'smooth' });

    generateBrand(options.vibe, options.name, {
      color: options.color,
      shape: options.shape,
      gradient: options.gradient,
      surpriseMe: options.surpriseMe,
      category: options.category,
      legalEntity: options.legalEntity
    });
  }, [generateBrand]);

  const handleExport = async (type: string) => {
    if (!brand) return;

    // GATE: All Exports require login
    const isAuthed = await checkAuth();
    if (!isAuthed) return;

    if (type === 'svg') {
      // Use stored logo SVG - ensures exact match with preview
      const { getStoredLogoSVG } = await import('@/components/logo-engine/renderers/stored-logo-export');
      const svgContent = getStoredLogoSVG(brand, 'color');
      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${brand.name.toLowerCase().replace(/\s+/g, '-')}-logo.svg`;
      link.click();
    } else if (type === 'tailwind') {
      const tokens = brand.theme.tokens;
      const config = `// ${brand.name} - Tailwind CSS Config
// Generated by Glyph

module.exports = {
  theme: {
    extend: {
      colors: {
        light: {
          background: "${tokens.light.bg}",
          foreground: "${tokens.light.text}",
          primary: "${tokens.light.primary}",
          surface: "${tokens.light.surface}",
          muted: "${tokens.light.muted}",
          border: "${tokens.light.border}",
        },
        dark: {
          background: "${tokens.dark.bg}",
          foreground: "${tokens.dark.text}",
          primary: "${tokens.dark.primary}",
          surface: "${tokens.dark.surface}",
          muted: "${tokens.dark.muted}",
          border: "${tokens.dark.border}",
        },
      },
    },
  },
};`;
      navigator.clipboard.writeText(config);
      alert('Tailwind config copied to clipboard!');
    } else if (type === 'react') {
      const componentCode = `// ${brand.name} Logo Component
// Generated by Glyph

interface LogoProps {
  className?: string;
  color?: string;
}

export function ${brand.name.replace(/\s+/g, '')}Logo({ className = "w-8 h-8", color = "${brand.theme.tokens.light.primary}" }: LogoProps) {
  return (
    <svg
      viewBox="${brand.shape.viewBox || "0 0 24 24"}"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="${brand.shape.path}" fill={color} />
    </svg>
  );
}
`;
      navigator.clipboard.writeText(componentCode);
      alert('React component copied to clipboard!');
    } else if (type === 'all') {
      if (!isPro) {
        setShowProModal(true);
        return;
      }
      try {
        await exportBrandPackage(brand);
      } catch (error) {
        console.error("Export failed:", error);
        alert("Failed to create export package. Please try again.");
      }
    } else if (type === 'favicon') {
      // Generate and download favicon package (use sync version for simplicity)
      const { generateFaviconPackageSync } = await import('@/components/export/ExportFavicon');
      const pkg = generateFaviconPackageSync(brand);
      const faviconSvg = pkg.files.find((f: { name: string }) => f.name === 'favicon.svg')?.content || '';
      const blob = new Blob([faviconSvg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${brand.name.toLowerCase().replace(/\s+/g, '-')}-favicon.svg`;
      link.click();
      // Also copy HTML snippet to clipboard
      navigator.clipboard.writeText(pkg.htmlSnippet);
      alert('Favicon SVG downloaded! HTML snippet copied to clipboard.');
    } else if (type === 'social') {
      // Download complete social media kit as ZIP
      // const { downloadSocialMediaKitZip } = await import('@/components/export/ExportSocial');
      // await downloadSocialMediaKitZip(brand);
      alert('Please use the Social Media Kit section in the workbench to download assets.');
      alert('Social Media Kit downloaded!');
    } else if (type === 'brandbook') {
      try {
        await downloadBrandBookPDF(brand);
        alert('Brand Guidelines PDF downloaded!');
      } catch (error) {
        console.error('PDF generation failed:', error);
        alert('Failed to generate PDF. Please try again.');
      }
    }
  };


  // Handle generating variations
  const handleGenerateVariations = async () => {
    if (!brand) return;



    // 2. Generate 4 variations
    const variations = await brandGenerators.generateVariations(brand);

    // 3. Reset comparison to Current + New Variations
    // This ensures we always show fresh results (fixing the "stays the same" issue)
    setCompareList([brand, ...variations]);

    // 4. Open overlay
    setIsCompareOpen(true);
  };

  return (
    // Responsive Flex Layout: Stacks on mobile, Row on desktop
    <div className="flex flex-col md:flex-row min-h-screen w-full bg-stone-50 font-sans">
      <LoadingState isLoading={isGenerating} />
      <ProGateModal
        isOpen={showProModal}
        onClose={() => setShowProModal(false)}
        featureName="Full Package Export"
      />

      {/* Sidebar - Relative Flex Child */}
      {/* md:w-[420px] ensures it takes space in the flow */}
      {/* md:sticky md:top-0 md:h-screen ensures it stays viewable while scrolling main content */}
      <aside className="w-full md:w-[420px] flex-shrink-0 z-40 relative md:sticky md:top-0 md:h-screen md:overflow-y-auto border-r border-stone-200 bg-white scrollbar-hide">
        <Sidebar
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          selectedVibe={selectedVibe}
          setSelectedVibe={setSelectedVibe}
          hasGenerated={!!brand}
        />
      </aside>

      {/* Main Content - Flex-1 takes remaining space */}
      <main ref={mainRef} className="flex-1 relative bg-[#FAFAF9] min-h-screen">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'radial-gradient(#A8A29E 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Toolbar - Sticky on mobile */}
        <div className="sticky md:absolute top-0 md:top-6 right-0 md:right-8 z-30 p-3 md:p-0 bg-stone-50/80 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none flex justify-end">
          <Toolbar
            brand={brand || undefined}
            onExport={handleExport}
            viewMode={viewMode}
            setViewMode={async (mode) => {
              if (mode === 'presentation') {
                // GATE: Guidelines require login
                const isAuthed = await checkAuth();
                if (!isAuthed) return;
              }
              setViewMode(mode);
            }}
            canUndo={brandGenerators.canUndo}
            canRedo={brandGenerators.canRedo}
            onUndo={brandGenerators.undo}
            onRedo={brandGenerators.redo}
            currentHistoryIndex={brandGenerators.historyIndex}
            totalHistory={brandGenerators.historyTotal}
            onAddToCompare={brand ? handleAddToCompare : undefined}
            onOpenCompare={() => setIsCompareOpen(true)}
            compareCount={compareList.length}
            onVariations={brand ? handleGenerateVariations : undefined}
            isGenerating={brandGenerators.isGenerating}
          />
        </div>

        <CompareOverlay
          brands={compareList}
          isOpen={isCompareOpen}
          isGenerating={brandGenerators.isGenerating}
          onClose={() => setIsCompareOpen(false)}
          onRemove={handleRemoveFromCompare}
          onSelect={(selectedBrand) => {
            brandGenerators.setBrand?.(selectedBrand);
            setIsCompareOpen(false);
          }}
          onGenerateMore={handleGenerateVariations}
        />


        <div className={`relative z-10 transition-all duration-500 w-full min-h-full pt-4 md:pt-20 ${viewMode === 'presentation' ? 'pb-0' : 'pb-20'} px-2 md:px-0 ${isDarkMode ? 'dark' : ''}`}>
          {brand ? (
            <div className="max-w-7xl mx-auto">
              <WorkbenchBentoGrid
                brand={brand}
                isDark={isDarkMode}
                onShuffleLogo={() => generateBrand(selectedVibe, brand.name)}
                onVariations={handleGenerateVariations}
                onUpdateBrand={brandGenerators.updateBrand}
                onUpdateFont={(newFont) => {
                  brandGenerators.updateBrand({
                    font: {
                      id: newFont.id,
                      name: newFont.name,
                      heading: newFont.heading.className,
                      body: newFont.body.className,
                      headingName: newFont.headingName,
                      bodyName: newFont.bodyName,
                      tags: newFont.tags
                    }
                  });
                }}
                onSelectColor={(selectedColor) => {
                  if (!brand) return;

                  // Replace colors in existing SVG strings (keep same logo, just change color)
                  let updatedLogos = brand.generatedLogos;

                  if (brand.generatedLogos && brand.generatedLogos.length > 0) {
                    // Update all logos
                    updatedLogos = brand.generatedLogos.map(logo => {
                      let newSvg = logo.svg;

                      // 1. Find all hex colors in the SVG
                      const hexRegex = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/g;
                      const foundColors = [...newSvg.matchAll(hexRegex)].map(m => m[0]);
                      const uniqueColors = Array.from(new Set(foundColors.map(c => c.toLowerCase())));

                      if (uniqueColors.length === 0) return logo;

                      // 2. Sort unique colors by luminance to map gradients correctly (dark -> light)
                      // Simple approach: just replace all of them with the new color for a solid look,
                      // OR map them to a new monochromatic palette if there are multiple.

                      const newColor = selectedColor.light;

                      if (uniqueColors.length === 1) {
                        // Simple replacement for single color
                        newSvg = newSvg.replace(new RegExp(uniqueColors[0], 'gi'), newColor);
                      } else {
                        // For multi-color (gradients), we need to generate a palette from the new color
                        // We'll replace the existing colors with a monochromatic scale of the new color.
                        // But for now, user asked to "change whole logo color", so let's try making it solid first?
                        // "when i changed this in blue why its coming in middle remove that logic and change whole logo color"
                        // This implies they want the WHOLE thing to be the new color.
                        // However, flattening a gradient to a single color destroys the 3D effect.
                        // Better approach: Map the old colors to new tonal variants.

                        // Helper to adjust brightness
                        const adjustBrightness = (hex: string, percent: number) => {
                          const num = parseInt(hex.replace('#', ''), 16);
                          const amt = Math.round(2.55 * percent);
                          const R = (num >> 16) + amt;
                          const G = (num >> 8 & 0x00FF) + amt;
                          const B = (num & 0x0000FF) + amt;
                          return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
                        };

                        // Replace each unique color with a variant of the new color
                        // We map the "middle" color to the selected color, and others to lighter/darker
                        uniqueColors.forEach((oldHex, index) => {
                          // Naive mapping: just assign variants
                          // Ideally we'd sort by brightness, but index based might work if SVG order is consistent
                          let replacement = newColor;

                          // If it's a gradient, try to preserve some variation
                          if (index === 0) replacement = newColor; // Main
                          else if (index === 1) replacement = adjustBrightness(newColor, 20); // Lighter
                          else if (index === 2) replacement = adjustBrightness(newColor, -20); // Darker
                          else replacement = adjustBrightness(newColor, (index % 2 === 0 ? 10 : -10) * index);

                          newSvg = newSvg.split(oldHex).join(replacement);
                          newSvg = newSvg.split(oldHex.toUpperCase()).join(replacement);
                        });
                      }

                      return {
                        ...logo,
                        svg: newSvg,
                        meta: {
                          ...logo.meta,
                          colors: {
                            ...logo.meta.colors,
                            primary: newColor,
                            // Update palette too
                            palette: [newColor, selectedColor.dark]
                          }
                        }
                      };
                    });
                  }

                  // Update theme colors AND logos with new color
                  brandGenerators.updateBrand({
                    theme: {
                      ...brand.theme,
                      tokens: {
                        light: {
                          ...brand.theme.tokens.light,
                          primary: selectedColor.light
                        },
                        dark: {
                          ...brand.theme.tokens.dark,
                          primary: selectedColor.dark
                        }
                      }
                    },
                    generatedLogos: updatedLogos,
                  });
                }}
                onSwapFont={() => {
                  import('@/lib/fonts').then(({ fontPairings }) => {
                    const currentFontId = brand.font.id;
                    const currentIndex = fontPairings.findIndex(f => f.id === currentFontId);
                    const nextFont = fontPairings[(currentIndex + 1) % fontPairings.length];
                    brandGenerators.updateBrand({
                      font: {
                        id: nextFont.id,
                        name: nextFont.name,
                        heading: nextFont.heading.className,
                        body: nextFont.body.className,
                        headingName: nextFont.headingName,
                        bodyName: nextFont.bodyName,
                        tags: nextFont.tags
                      }
                    });
                  });
                }}
                viewMode={viewMode}
                setViewMode={async (mode) => {
                  if (mode === 'presentation') {
                    // GATE: Guidelines require login
                    const isAuthed = await checkAuth();
                    if (!isAuthed) return;
                  }
                  setViewMode(mode);
                }}
              />
            </div>
          ) : (
            <RobotEmptyState initialBrandName={searchParams.get('name') || ''} />
          )}
        </div>
      </main>
    </div>
  );
}

export default function GeneratorPage() {
  return (
    <Suspense fallback={<LoadingState isLoading={true} />}>
      <GeneratorContent />
    </Suspense>
  );
}


