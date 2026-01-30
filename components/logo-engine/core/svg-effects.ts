/**
 * SVG Effects Library
 *
 * Professional-grade SVG filter effects for logos:
 * - Drop shadows (soft, hard, long)
 * - Inner shadows
 * - Outer glow / Inner glow
 * - Bevels and embossing
 * - Textures and noise
 * - Advanced gradient systems
 * - Blur effects
 * - Duotone / color overlays
 */

// ============================================
// TYPES
// ============================================

export interface ShadowEffect {
    type: 'drop-shadow' | 'inner-shadow' | 'long-shadow';
    offsetX: number;
    offsetY: number;
    blur: number;
    color: string;
    opacity: number;
    spread?: number;  // For long shadows
    angle?: number;   // For long shadows (degrees)
}

export interface GlowEffect {
    type: 'outer-glow' | 'inner-glow';
    blur: number;
    color: string;
    opacity: number;
    intensity: number;
}

export interface BevelEffect {
    type: 'bevel' | 'emboss' | 'pillow-emboss';
    depth: number;
    softness: number;
    angle: number;
    highlightColor: string;
    shadowColor: string;
}

export interface TextureEffect {
    type: 'noise' | 'grain' | 'halftone' | 'paper' | 'fabric';
    intensity: number;
    scale: number;
    seed?: number;
}

export interface GradientStop {
    offset: number;
    color: string;
    opacity?: number;
}

export interface GradientEffect {
    type: 'linear' | 'radial' | 'conic' | 'mesh';
    stops: GradientStop[];
    angle?: number;     // For linear
    cx?: number;        // For radial (0-1)
    cy?: number;        // For radial (0-1)
    r?: number;         // For radial radius
}

export interface ColorOverlay {
    type: 'solid' | 'duotone' | 'gradient-map';
    color?: string;
    colors?: [string, string];  // For duotone
    blendMode: 'normal' | 'multiply' | 'screen' | 'overlay' | 'soft-light' | 'hard-light';
    opacity: number;
}

export interface EffectPreset {
    name: string;
    description: string;
    effects: LogoEffect[];
}

export type LogoEffect =
    | { effect: 'shadow'; config: ShadowEffect }
    | { effect: 'glow'; config: GlowEffect }
    | { effect: 'bevel'; config: BevelEffect }
    | { effect: 'texture'; config: TextureEffect }
    | { effect: 'gradient'; config: GradientEffect }
    | { effect: 'color-overlay'; config: ColorOverlay }
    | { effect: 'blur'; config: { radius: number } };

// ============================================
// FILTER ID GENERATION
// ============================================

let filterIdCounter = 0;
function generateFilterId(prefix: string): string {
    return `${prefix}_${++filterIdCounter}_${Date.now().toString(36)}`;
}

// ============================================
// SHADOW EFFECTS
// ============================================

export function createDropShadowFilter(shadow: ShadowEffect): { filterId: string; filterDef: string } {
    const filterId = generateFilterId('dropShadow');
    const filterDef = `
    <filter id="${filterId}" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow
            dx="${shadow.offsetX}"
            dy="${shadow.offsetY}"
            stdDeviation="${shadow.blur / 2}"
            flood-color="${shadow.color}"
            flood-opacity="${shadow.opacity}"
        />
    </filter>`;
    return { filterId, filterDef };
}

export function createInnerShadowFilter(shadow: ShadowEffect): { filterId: string; filterDef: string } {
    const filterId = generateFilterId('innerShadow');
    const filterDef = `
    <filter id="${filterId}" x="-50%" y="-50%" width="200%" height="200%">
        <!-- Get the alpha of the source -->
        <feComponentTransfer in="SourceAlpha" result="hardAlpha">
            <feFuncA type="discrete" tableValues="0 1"/>
        </feComponentTransfer>
        <!-- Invert and offset -->
        <feOffset dx="${shadow.offsetX}" dy="${shadow.offsetY}" in="hardAlpha" result="offsetBlur"/>
        <feGaussianBlur in="offsetBlur" stdDeviation="${shadow.blur / 2}" result="blur"/>
        <!-- Subtract from original alpha -->
        <feComposite in="hardAlpha" in2="blur" operator="out" result="shadowShape"/>
        <!-- Color the shadow -->
        <feFlood flood-color="${shadow.color}" flood-opacity="${shadow.opacity}" result="shadowColor"/>
        <feComposite in="shadowColor" in2="shadowShape" operator="in" result="shadow"/>
        <!-- Combine with source -->
        <feMerge>
            <feMergeNode in="SourceGraphic"/>
            <feMergeNode in="shadow"/>
        </feMerge>
    </filter>`;
    return { filterId, filterDef };
}

export function createLongShadowFilter(shadow: ShadowEffect): { filterId: string; filterDef: string } {
    const filterId = generateFilterId('longShadow');
    const angle = (shadow.angle || 45) * Math.PI / 180;
    const spread = shadow.spread || 20;

    // Create multiple offset layers for long shadow effect
    let offsetLayers = '';
    let mergeNodes = '';

    for (let i = 1; i <= spread; i++) {
        const dx = Math.cos(angle) * i;
        const dy = Math.sin(angle) * i;
        const layerOpacity = shadow.opacity * (1 - i / spread);

        offsetLayers += `
        <feOffset in="SourceAlpha" dx="${dx}" dy="${dy}" result="offset${i}"/>
        <feFlood flood-color="${shadow.color}" flood-opacity="${layerOpacity}" result="color${i}"/>
        <feComposite in="color${i}" in2="offset${i}" operator="in" result="shadow${i}"/>`;
        mergeNodes += `<feMergeNode in="shadow${i}"/>`;
    }

    const filterDef = `
    <filter id="${filterId}" x="-100%" y="-100%" width="400%" height="400%">
        ${offsetLayers}
        <feMerge>
            ${mergeNodes}
            <feMergeNode in="SourceGraphic"/>
        </feMerge>
    </filter>`;

    return { filterId, filterDef };
}

// ============================================
// GLOW EFFECTS
// ============================================

export function createOuterGlowFilter(glow: GlowEffect): { filterId: string; filterDef: string } {
    const filterId = generateFilterId('outerGlow');
    const filterDef = `
    <filter id="${filterId}" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="${glow.blur}" result="blur"/>
        <feFlood flood-color="${glow.color}" flood-opacity="${glow.opacity}" result="glowColor"/>
        <feComposite in="glowColor" in2="blur" operator="in" result="glow"/>
        <!-- Stack multiple for intensity -->
        ${Array(Math.ceil(glow.intensity)).fill(0).map((_, i) =>
            `<feGaussianBlur in="glow" stdDeviation="${glow.blur * (1 + i * 0.5)}" result="glow${i}"/>`
        ).join('\n        ')}
        <feMerge>
            ${Array(Math.ceil(glow.intensity)).fill(0).map((_, i) =>
                `<feMergeNode in="glow${i}"/>`
            ).join('\n            ')}
            <feMergeNode in="SourceGraphic"/>
        </feMerge>
    </filter>`;
    return { filterId, filterDef };
}

export function createInnerGlowFilter(glow: GlowEffect): { filterId: string; filterDef: string } {
    const filterId = generateFilterId('innerGlow');
    const filterDef = `
    <filter id="${filterId}" x="-50%" y="-50%" width="200%" height="200%">
        <feComponentTransfer in="SourceAlpha" result="hardAlpha">
            <feFuncA type="discrete" tableValues="0 1"/>
        </feComponentTransfer>
        <feMorphology operator="erode" radius="${glow.blur / 4}" in="hardAlpha" result="eroded"/>
        <feGaussianBlur in="eroded" stdDeviation="${glow.blur}" result="blur"/>
        <feComposite in="hardAlpha" in2="blur" operator="xor" result="innerArea"/>
        <feFlood flood-color="${glow.color}" flood-opacity="${glow.opacity * glow.intensity}" result="glowColor"/>
        <feComposite in="glowColor" in2="innerArea" operator="in" result="innerGlow"/>
        <feMerge>
            <feMergeNode in="SourceGraphic"/>
            <feMergeNode in="innerGlow"/>
        </feMerge>
    </filter>`;
    return { filterId, filterDef };
}

// ============================================
// BEVEL & EMBOSS EFFECTS
// ============================================

export function createBevelFilter(bevel: BevelEffect): { filterId: string; filterDef: string } {
    const filterId = generateFilterId('bevel');
    const angleRad = bevel.angle * Math.PI / 180;
    const lightX = Math.cos(angleRad);
    const lightY = Math.sin(angleRad);

    const filterDef = `
    <filter id="${filterId}" x="-20%" y="-20%" width="140%" height="140%">
        <!-- Create height map from alpha -->
        <feGaussianBlur in="SourceAlpha" stdDeviation="${bevel.softness}" result="blur"/>

        <!-- Light from angle -->
        <feSpecularLighting
            in="blur"
            surfaceScale="${bevel.depth}"
            specularConstant="1"
            specularExponent="20"
            result="specular"
        >
            <fePointLight x="${50 + lightX * 100}" y="${50 - lightY * 100}" z="100"/>
        </feSpecularLighting>

        <feComposite in="specular" in2="SourceAlpha" operator="in" result="specularMasked"/>

        <!-- Combine -->
        <feMerge>
            <feMergeNode in="SourceGraphic"/>
            <feMergeNode in="specularMasked"/>
        </feMerge>
    </filter>`;

    return { filterId, filterDef };
}

export function createEmbossFilter(bevel: BevelEffect): { filterId: string; filterDef: string } {
    const filterId = generateFilterId('emboss');
    const angleRad = bevel.angle * Math.PI / 180;
    const dx = Math.cos(angleRad) * bevel.depth;
    const dy = -Math.sin(angleRad) * bevel.depth;

    const filterDef = `
    <filter id="${filterId}" x="-20%" y="-20%" width="140%" height="140%">
        <!-- Highlight offset -->
        <feOffset in="SourceAlpha" dx="${-dx}" dy="${-dy}" result="offsetHighlight"/>
        <feFlood flood-color="${bevel.highlightColor}" flood-opacity="0.5" result="highlightColor"/>
        <feComposite in="highlightColor" in2="offsetHighlight" operator="in" result="highlight"/>

        <!-- Shadow offset -->
        <feOffset in="SourceAlpha" dx="${dx}" dy="${dy}" result="offsetShadow"/>
        <feFlood flood-color="${bevel.shadowColor}" flood-opacity="0.5" result="shadowColor"/>
        <feComposite in="shadowColor" in2="offsetShadow" operator="in" result="shadow"/>

        <!-- Blur both -->
        <feGaussianBlur in="highlight" stdDeviation="${bevel.softness}" result="highlightBlur"/>
        <feGaussianBlur in="shadow" stdDeviation="${bevel.softness}" result="shadowBlur"/>

        <!-- Mask to source shape -->
        <feComposite in="highlightBlur" in2="SourceAlpha" operator="in" result="highlightMasked"/>
        <feComposite in="shadowBlur" in2="SourceAlpha" operator="in" result="shadowMasked"/>

        <feMerge>
            <feMergeNode in="SourceGraphic"/>
            <feMergeNode in="shadowMasked"/>
            <feMergeNode in="highlightMasked"/>
        </feMerge>
    </filter>`;

    return { filterId, filterDef };
}

// ============================================
// TEXTURE EFFECTS
// ============================================

export function createNoiseTextureFilter(texture: TextureEffect): { filterId: string; filterDef: string } {
    const filterId = generateFilterId('noise');
    const seed = texture.seed || Math.floor(Math.random() * 1000);

    const filterDef = `
    <filter id="${filterId}" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence
            type="fractalNoise"
            baseFrequency="${0.01 * texture.scale}"
            numOctaves="4"
            seed="${seed}"
            result="noise"
        />
        <feColorMatrix
            in="noise"
            type="matrix"
            values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 ${texture.intensity} 0"
            result="noiseAlpha"
        />
        <feComposite in="noiseAlpha" in2="SourceAlpha" operator="in" result="noiseMasked"/>
        <feBlend in="SourceGraphic" in2="noiseMasked" mode="overlay"/>
    </filter>`;

    return { filterId, filterDef };
}

export function createGrainTextureFilter(texture: TextureEffect): { filterId: string; filterDef: string } {
    const filterId = generateFilterId('grain');
    const seed = texture.seed || Math.floor(Math.random() * 1000);

    const filterDef = `
    <filter id="${filterId}" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence
            type="turbulence"
            baseFrequency="${0.5 / texture.scale}"
            numOctaves="1"
            seed="${seed}"
            result="grain"
        />
        <feColorMatrix
            in="grain"
            type="saturate"
            values="0"
            result="grainBW"
        />
        <feComponentTransfer in="grainBW" result="grainContrast">
            <feFuncR type="linear" slope="${1 + texture.intensity}" intercept="${-texture.intensity / 2}"/>
            <feFuncG type="linear" slope="${1 + texture.intensity}" intercept="${-texture.intensity / 2}"/>
            <feFuncB type="linear" slope="${1 + texture.intensity}" intercept="${-texture.intensity / 2}"/>
        </feComponentTransfer>
        <feBlend in="SourceGraphic" in2="grainContrast" mode="soft-light"/>
    </filter>`;

    return { filterId, filterDef };
}

export function createHalftoneTextureFilter(texture: TextureEffect): { filterId: string; filterDef: string } {
    const filterId = generateFilterId('halftone');
    const patternId = generateFilterId('halftonePattern');
    const dotSize = texture.scale * 2;

    const filterDef = `
    <pattern id="${patternId}" width="${dotSize}" height="${dotSize}" patternUnits="userSpaceOnUse">
        <circle cx="${dotSize/2}" cy="${dotSize/2}" r="${dotSize/4 * texture.intensity}" fill="black"/>
    </pattern>
    <filter id="${filterId}" x="0%" y="0%" width="100%" height="100%">
        <feImage href="#${patternId}" result="dots"/>
        <feComposite in="SourceGraphic" in2="dots" operator="in"/>
    </filter>`;

    return { filterId, filterDef };
}

// ============================================
// GRADIENT HELPERS
// ============================================

export function createLinearGradientDef(gradient: GradientEffect, id?: string): { gradientId: string; gradientDef: string } {
    const gradientId = id || generateFilterId('linearGrad');
    const angle = gradient.angle || 0;
    const angleRad = angle * Math.PI / 180;

    // Calculate start and end points based on angle
    const x1 = 50 - Math.cos(angleRad) * 50;
    const y1 = 50 - Math.sin(angleRad) * 50;
    const x2 = 50 + Math.cos(angleRad) * 50;
    const y2 = 50 + Math.sin(angleRad) * 50;

    const stops = gradient.stops.map(stop =>
        `<stop offset="${stop.offset * 100}%" stop-color="${stop.color}" stop-opacity="${stop.opacity ?? 1}"/>`
    ).join('\n        ');

    const gradientDef = `
    <linearGradient id="${gradientId}" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
        ${stops}
    </linearGradient>`;

    return { gradientId, gradientDef };
}

export function createRadialGradientDef(gradient: GradientEffect, id?: string): { gradientId: string; gradientDef: string } {
    const gradientId = id || generateFilterId('radialGrad');
    const cx = (gradient.cx ?? 0.5) * 100;
    const cy = (gradient.cy ?? 0.5) * 100;
    const r = (gradient.r ?? 0.5) * 100;

    const stops = gradient.stops.map(stop =>
        `<stop offset="${stop.offset * 100}%" stop-color="${stop.color}" stop-opacity="${stop.opacity ?? 1}"/>`
    ).join('\n        ');

    const gradientDef = `
    <radialGradient id="${gradientId}" cx="${cx}%" cy="${cy}%" r="${r}%" fx="${cx}%" fy="${cy}%">
        ${stops}
    </radialGradient>`;

    return { gradientId, gradientDef };
}

// ============================================
// COLOR OVERLAY EFFECTS
// ============================================

export function createDuotoneFilter(overlay: ColorOverlay): { filterId: string; filterDef: string } {
    const filterId = generateFilterId('duotone');
    const colors = overlay.colors || ['#000000', '#ffffff'];

    // Parse colors to RGB
    const parseColor = (hex: string) => {
        const c = hex.replace('#', '');
        return {
            r: parseInt(c.slice(0, 2), 16) / 255,
            g: parseInt(c.slice(2, 4), 16) / 255,
            b: parseInt(c.slice(4, 6), 16) / 255,
        };
    };

    const dark = parseColor(colors[0]);
    const light = parseColor(colors[1]);

    const filterDef = `
    <filter id="${filterId}" x="0%" y="0%" width="100%" height="100%">
        <!-- Convert to grayscale first -->
        <feColorMatrix type="saturate" values="0" result="gray"/>

        <!-- Map grayscale to duotone -->
        <feComponentTransfer in="gray" result="duotone">
            <feFuncR type="table" tableValues="${dark.r} ${light.r}"/>
            <feFuncG type="table" tableValues="${dark.g} ${light.g}"/>
            <feFuncB type="table" tableValues="${dark.b} ${light.b}"/>
        </feComponentTransfer>

        <!-- Blend with original based on opacity -->
        <feBlend in="duotone" in2="SourceGraphic" mode="${overlay.blendMode}" result="blended"/>
        <feComponentTransfer in="blended">
            <feFuncA type="table" tableValues="0 ${overlay.opacity}"/>
        </feComponentTransfer>
    </filter>`;

    return { filterId, filterDef };
}

export function createColorOverlayFilter(overlay: ColorOverlay): { filterId: string; filterDef: string } {
    const filterId = generateFilterId('colorOverlay');
    const color = overlay.color || '#000000';

    const filterDef = `
    <filter id="${filterId}" x="0%" y="0%" width="100%" height="100%">
        <feFlood flood-color="${color}" flood-opacity="${overlay.opacity}" result="color"/>
        <feComposite in="color" in2="SourceAlpha" operator="in" result="colorMasked"/>
        <feBlend in="colorMasked" in2="SourceGraphic" mode="${overlay.blendMode}"/>
    </filter>`;

    return { filterId, filterDef };
}

// ============================================
// BLUR EFFECTS
// ============================================

export function createBlurFilter(radius: number): { filterId: string; filterDef: string } {
    const filterId = generateFilterId('blur');
    const filterDef = `
    <filter id="${filterId}" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="${radius}"/>
    </filter>`;
    return { filterId, filterDef };
}

// ============================================
// EFFECT PRESETS
// ============================================

export const EFFECT_PRESETS: Record<string, EffectPreset> = {
    'subtle-shadow': {
        name: 'Subtle Shadow',
        description: 'Light drop shadow for depth',
        effects: [{
            effect: 'shadow',
            config: {
                type: 'drop-shadow',
                offsetX: 2,
                offsetY: 2,
                blur: 4,
                color: '#000000',
                opacity: 0.15,
            }
        }]
    },
    'bold-shadow': {
        name: 'Bold Shadow',
        description: 'Strong shadow for dramatic effect',
        effects: [{
            effect: 'shadow',
            config: {
                type: 'drop-shadow',
                offsetX: 4,
                offsetY: 4,
                blur: 0,
                color: '#000000',
                opacity: 0.3,
            }
        }]
    },
    'long-shadow-flat': {
        name: 'Long Shadow (Flat)',
        description: 'Extended diagonal shadow for flat design',
        effects: [{
            effect: 'shadow',
            config: {
                type: 'long-shadow',
                offsetX: 0,
                offsetY: 0,
                blur: 0,
                color: '#000000',
                opacity: 0.2,
                spread: 30,
                angle: 135,
            }
        }]
    },
    'neon-glow': {
        name: 'Neon Glow',
        description: 'Vibrant glowing effect',
        effects: [{
            effect: 'glow',
            config: {
                type: 'outer-glow',
                blur: 8,
                color: '#00ffff',
                opacity: 0.8,
                intensity: 3,
            }
        }]
    },
    'soft-glow': {
        name: 'Soft Glow',
        description: 'Subtle ambient glow',
        effects: [{
            effect: 'glow',
            config: {
                type: 'outer-glow',
                blur: 12,
                color: '#ffffff',
                opacity: 0.4,
                intensity: 1,
            }
        }]
    },
    'embossed': {
        name: 'Embossed',
        description: '3D raised effect',
        effects: [{
            effect: 'bevel',
            config: {
                type: 'emboss',
                depth: 2,
                softness: 1,
                angle: 135,
                highlightColor: '#ffffff',
                shadowColor: '#000000',
            }
        }]
    },
    'letterpress': {
        name: 'Letterpress',
        description: 'Pressed-in print effect',
        effects: [
            {
                effect: 'shadow',
                config: {
                    type: 'inner-shadow',
                    offsetX: 1,
                    offsetY: 1,
                    blur: 2,
                    color: '#000000',
                    opacity: 0.3,
                }
            },
            {
                effect: 'shadow',
                config: {
                    type: 'drop-shadow',
                    offsetX: 0,
                    offsetY: -1,
                    blur: 0,
                    color: '#ffffff',
                    opacity: 0.3,
                }
            }
        ]
    },
    'vintage-grain': {
        name: 'Vintage Grain',
        description: 'Retro film grain texture',
        effects: [{
            effect: 'texture',
            config: {
                type: 'grain',
                intensity: 0.3,
                scale: 1,
            }
        }]
    },
    'noise-overlay': {
        name: 'Noise Overlay',
        description: 'Subtle noise for texture',
        effects: [{
            effect: 'texture',
            config: {
                type: 'noise',
                intensity: 0.15,
                scale: 1,
            }
        }]
    },
    'frosted-glass': {
        name: 'Frosted Glass',
        description: 'Blurred glassmorphism effect',
        effects: [
            {
                effect: 'blur',
                config: { radius: 3 }
            },
            {
                effect: 'color-overlay',
                config: {
                    type: 'solid',
                    color: '#ffffff',
                    blendMode: 'overlay',
                    opacity: 0.2,
                }
            }
        ]
    },
    'duotone-contrast': {
        name: 'Duotone Contrast',
        description: 'Two-color dramatic effect',
        effects: [{
            effect: 'color-overlay',
            config: {
                type: 'duotone',
                colors: ['#1a1a2e', '#edf2f4'],
                blendMode: 'normal',
                opacity: 1,
            }
        }]
    },
};

// ============================================
// MAIN EFFECT APPLICATION FUNCTION
// ============================================

export interface EffectResult {
    defs: string;
    filterIds: string[];
    gradientIds: string[];
}

export function applyEffects(effects: LogoEffect[]): EffectResult {
    const defs: string[] = [];
    const filterIds: string[] = [];
    const gradientIds: string[] = [];

    for (const item of effects) {
        switch (item.effect) {
            case 'shadow': {
                const shadow = item.config;
                let result;
                if (shadow.type === 'drop-shadow') {
                    result = createDropShadowFilter(shadow);
                } else if (shadow.type === 'inner-shadow') {
                    result = createInnerShadowFilter(shadow);
                } else {
                    result = createLongShadowFilter(shadow);
                }
                defs.push(result.filterDef);
                filterIds.push(result.filterId);
                break;
            }
            case 'glow': {
                const glow = item.config;
                const result = glow.type === 'outer-glow'
                    ? createOuterGlowFilter(glow)
                    : createInnerGlowFilter(glow);
                defs.push(result.filterDef);
                filterIds.push(result.filterId);
                break;
            }
            case 'bevel': {
                const bevel = item.config;
                const result = bevel.type === 'emboss' || bevel.type === 'pillow-emboss'
                    ? createEmbossFilter(bevel)
                    : createBevelFilter(bevel);
                defs.push(result.filterDef);
                filterIds.push(result.filterId);
                break;
            }
            case 'texture': {
                const texture = item.config;
                let result;
                if (texture.type === 'grain') {
                    result = createGrainTextureFilter(texture);
                } else if (texture.type === 'halftone') {
                    result = createHalftoneTextureFilter(texture);
                } else {
                    result = createNoiseTextureFilter(texture);
                }
                defs.push(result.filterDef);
                filterIds.push(result.filterId);
                break;
            }
            case 'gradient': {
                const gradient = item.config;
                const result = gradient.type === 'radial'
                    ? createRadialGradientDef(gradient)
                    : createLinearGradientDef(gradient);
                defs.push(result.gradientDef);
                gradientIds.push(result.gradientId);
                break;
            }
            case 'color-overlay': {
                const overlay = item.config;
                const result = overlay.type === 'duotone'
                    ? createDuotoneFilter(overlay)
                    : createColorOverlayFilter(overlay);
                defs.push(result.filterDef);
                filterIds.push(result.filterId);
                break;
            }
            case 'blur': {
                const result = createBlurFilter(item.config.radius);
                defs.push(result.filterDef);
                filterIds.push(result.filterId);
                break;
            }
        }
    }

    return {
        defs: defs.join('\n'),
        filterIds,
        gradientIds,
    };
}

/**
 * Apply a preset to an SVG string
 */
export function applyPresetToSvg(svgString: string, presetName: string): string {
    const preset = EFFECT_PRESETS[presetName];
    if (!preset) return svgString;

    const { defs, filterIds } = applyEffects(preset.effects);

    // Insert defs into SVG
    const defsMatch = svgString.match(/<defs>([\s\S]*?)<\/defs>/);
    let modifiedSvg: string;

    if (defsMatch) {
        // Append to existing defs
        modifiedSvg = svgString.replace(
            /<defs>([\s\S]*?)<\/defs>/,
            `<defs>${defsMatch[1]}${defs}</defs>`
        );
    } else {
        // Insert new defs after opening svg tag
        modifiedSvg = svgString.replace(
            /(<svg[^>]*>)/,
            `$1<defs>${defs}</defs>`
        );
    }

    // Apply filters to main groups/paths
    if (filterIds.length > 0) {
        const filterAttr = `filter="url(#${filterIds[filterIds.length - 1]})"`;

        // Try to apply to main group
        if (modifiedSvg.includes('<g ')) {
            modifiedSvg = modifiedSvg.replace(/<g /, `<g ${filterAttr} `);
        } else {
            // Wrap content in a group with filter
            modifiedSvg = modifiedSvg.replace(
                /(<svg[^>]*>)([\s\S]*)(<\/svg>)/,
                `$1<g ${filterAttr}>$2</g>$3`
            );
        }
    }

    return modifiedSvg;
}

/**
 * Get all available preset names
 */
export function getAvailablePresets(): string[] {
    return Object.keys(EFFECT_PRESETS);
}

/**
 * Get preset info
 */
export function getPresetInfo(presetName: string): EffectPreset | undefined {
    return EFFECT_PRESETS[presetName];
}
