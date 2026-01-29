import React from 'react';
import { BrandIdentity } from '@/lib/data';
import { LogoComposition } from './LogoComposition';
import LogoAssembler from './LogoAssembler';

interface SmartLogoProps {
    brand: BrandIdentity;
    className?: string;
    overrideColors?: { primary: string; accent?: string; bg?: string };
    layout?: 'default' | 'swiss' | 'bauhaus' | 'minimal_grid' | 'organic_fluid' | 'generative' | 'radial';
}

/**
 * SmartLogo - Intelligently chooses between LogoComposition and LogoAssembler
 * based on the brand's archetype and logo configuration.
 */
export default function SmartLogo({ brand, className, overrideColors, layout }: SmartLogoProps) {
    // If archetype is Symbol AND we have a logoIcon, use LogoAssembler for icon-based logos
    const hasIcon = brand.logoIcon && brand.logoIcon !== '';
    const isSymbol = brand.archetype?.toLowerCase() === 'symbol';

    if (isSymbol && hasIcon && brand.logoIcon) {
        const mode = 'light'; // You can make this dynamic based on props
        const tokens = brand.theme.tokens[mode];

        return (
            <LogoAssembler
                iconName={brand.logoIcon}
                brandName={brand.name}
                layout={brand.logoAssemblerLayout || 'icon_left'}
                shape={brand.logoContainer || 'squircle'}
                primaryColor={overrideColors?.primary || tokens.primary}
                fontFamily={brand.font.heading}
                accentColor={overrideColors?.accent || tokens.accent}
                gap={brand.logoTweaks?.gap || 12}
                className={className}
            />
        );
    }

    // Otherwise, use LogoComposition for generative/wordmark logos
    return (
        <LogoComposition
            brand={brand}
            className={className}
            overrideColors={overrideColors}
            layout={layout}
        />
    );
}
