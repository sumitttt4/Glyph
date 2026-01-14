"use client";

import { useState, useCallback, useEffect, useRef } from 'react';
import { Sidebar, GenerationOptions } from '@/components/generator/Sidebar';
import { Toolbar } from '@/components/generator/Toolbar';
import { LoadingState } from '@/components/generator/LoadingState';
import { WorkbenchBentoGrid } from '@/components/generator/WorkbenchBentoGrid';
import { ProGateModal } from '@/components/generator/ProGateModal';
import { useBrandGenerator } from '@/hooks/use-brand-generator';
import { useSubscription } from '@/hooks/use-subscription';
import { createClient } from '@/lib/supabase/client';
import { exportBrandPackage } from '@/lib/export';
import { generateFaviconPackage } from '@/lib/favicon-generator';
import { generateSocialMediaKit, downloadSocialAsset } from '@/lib/social-media-kit';
import { downloadBrandBookPDF } from '@/lib/pdf-generator';
import { CompareOverlay } from '@/components/generator/CompareOverlay';
import { RobotEmptyState } from '@/components/generator/RobotEmptyState';
import { BrandIdentity } from '@/lib/data';
import { SoftGateVariations } from '@/components/generator/SoftGateVariations';


export default function GeneratorPage() {
  const brandGenerators = useBrandGenerator();
  // ... rest of component

  const { brand, generateBrand, isGenerating, resetBrand } = brandGenerators;
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedVibe, setSelectedVibe] = useState('minimalist');
  const [viewMode, setViewMode] = useState<'overview' | 'presentation'>('overview');
  const [showProModal, setShowProModal] = useState(false);

  const [isPro, setIsPro] = useState(false);
  const subscription = useSubscription();

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

  useEffect(() => {
    const checkAccess = async () => {
      // ADMIN BYPASS: Check cookie
      const hasAdminBypass = document.cookie.split(';').some(c => c.trim().startsWith('admin-bypass=true'));
      if (hasAdminBypass) {
        setIsPro(true);
        return;
      }

      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user?.email) return;

      // Check if user is Pro from Supabase profiles table (Dodo Payments integration)
      const { fetchProStatusFromDB, ADMIN_EMAILS } = await import('@/lib/subscription');

      // Admin emails always get Pro
      if (ADMIN_EMAILS.includes(user.email)) {
        setIsPro(true);
        return;
      }

      // Check database for Pro status (set by Dodo webhook)
      const isProFromDB = await fetchProStatusFromDB(supabase, user.email);
      setIsPro(isProFromDB);
    };

    checkAccess();
  }, []);

  // PLG: Check Authed Session Helper (Gate)
  const checkAuth = async (): Promise<boolean> => {
    // 1. Check cookies for bypass first (fastest)
    const hasAdminBypass = document.cookie.split(';').some(c => c.trim().startsWith('admin-bypass=true'));
    if (hasAdminBypass) return true;

    // 2. Check Supabase session
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) return true;

    // 3. Not logged in -> Save State & Redirect
    if (brand) {
      const pendingProject = {
        name: brand.name,
        prompt: "Draft Concept", // We don't have original prompt here easily, but brand object has data
        vibe: brand.vibe,
        color: brand.theme.tokens.light.primary,
        // We should ideally persist the full brand object or re-generate. 
        // For now, let's just save the inputs we have or the brand object itself if possible.
        // Better: Saving the inputs allows re-generation.
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
      surpriseMe: options.surpriseMe
    });
  }, [generateBrand]);

  const handleExport = async (type: string) => {
    if (!brand) return;

    // GATE: All Exports require login
    const isAuthed = await checkAuth();
    if (!isAuthed) return;

    if (type === 'svg') {
      // Use the composed logo generator that matches the app display
      const { generateComposedLogoSVG } = await import('@/lib/svg-exporter');
      const svgContent = generateComposedLogoSVG(brand, 'color');
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
      // Generate and download favicon package
      const pkg = generateFaviconPackage(brand);
      const faviconSvg = pkg.files.find(f => f.name === 'favicon.svg')?.content || '';
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
      // const { downloadSocialMediaKitZip } = await import('@/lib/social-media-kit');
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
    // Mobile: Vertical stack, Desktop: Fixed sidebar + scrollable main
    <div className="min-h-screen w-full bg-stone-50 font-sans">
      <LoadingState isLoading={isGenerating} />
      <ProGateModal
        isOpen={showProModal}
        onClose={() => setShowProModal(false)}
        featureName="Full Package Export"
      />

      {/* Sidebar - Fixed on desktop, normal flow on mobile */}
      <div className="md:fixed md:left-0 md:top-0 md:bottom-0 md:w-[420px] md:overflow-y-auto overflow-x-hidden md:border-r md:border-stone-200 z-40 scrollbar-hide">
        <Sidebar
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          selectedVibe={selectedVibe}
          setSelectedVibe={setSelectedVibe}
          hasGenerated={!!brand}
        />
      </div>

      {/* Main Content - Has left margin on desktop to account for fixed sidebar */}
      <main ref={mainRef} className="relative bg-[#FAFAF9] min-h-screen md:ml-[420px]">
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
            isDark={isDarkMode}
            toggleDark={() => setIsDarkMode(!isDarkMode)}
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


        <div className={`relative z-10 transition-all duration-500 w-full min-h-full pt-4 md:pt-20 pb-20 px-2 md:px-0 ${isDarkMode ? 'dark' : ''}`}>
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
                onCycleColor={() => {
                  if (!brand) return;
                  const tokens = brand.theme.tokens;
                  const mode = isDarkMode ? 'dark' : 'light';
                  const currentTokens = tokens[mode];

                  // Rotate: Primary -> Accent -> Surface -> Text -> Primary
                  // We simulate this by creating a new custom theme
                  // Actually, LogoComposition uses 'primary'.
                  // We want to force the Primary Brand Color to be the next one in the palette.
                  // BUT, 'primary' is a specific token.

                  // Let's grab the current palette from Sidebar? No access.
                  // Let's just rotate the existing tokens if they feel distinct.
                  // BETTER: Shift the Hue of the primary color?
                  // USER REQUEST: "he mistakely chose the color... wants to edit same logo with different color"
                  // This suggests swapping to a DIFFERENT PALETTE, potentially.
                  // But `updateBrand` takes partial.

                  // Let's implement a simple Hue Shift for now, or rotate if we knew the palette.
                  // Since we don't know the full palette here, let's just cycle through standard colors?
                  // No, that breaks the "System".

                  // Alternative: If the user selected a color in Sidebar, he expects THAT color.
                  // But we are in the grid.

                  // Let's try to find the Current Theme in the THEMES list and pick the next one?
                  // Importing THEMES might be heavy here? No, it's fine.
                  import('@/lib/themes').then(({ THEMES }) => {
                    // Find current theme index
                    const currentIndex = THEMES.findIndex(t => t.id === brand.theme.id);
                    const nextTheme = THEMES[(currentIndex + 1) % THEMES.length];

                    // Keep the same shape, just update theme
                    brandGenerators.updateBrand({
                      theme: nextTheme
                    });
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

              {/* SOFT GATE for Email Capture */}
              <div className="max-w-3xl mx-auto px-4">
                <SoftGateVariations onUnlock={handleGenerateVariations} />
              </div>
            </div>
          ) : (
            <RobotEmptyState />
          )}
        </div>
      </main>
    </div>
  );
}


