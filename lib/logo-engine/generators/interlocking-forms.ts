/**
 * Interlocking Forms Generator (Olympic/Chain style)
 *
 * Creates interconnected shapes that weave through each other
 * Inspired by Olympic rings and chain links
 * 20+ adjustable parameters for infinite variations
 */

import {
    GeneratedLogo,
    LogoGenerationParams,
    InterlockingFormsParams,
    Point,
} from '../types';
import {
    createSeededRandom,
    generateBaseParams,
    generateLogoHash,
    generateLogoId,
    addNoise,
    PHI,
    lerp,
    calculateComplexity,
    storeHash,
} from '../core/parametric-engine';
import { createSVG } from '../core/svg-builder';
import { lighten, darken, rotateHue } from '../core/color-utils';

// ============================================
// DEFAULT PARAMETERS
// ============================================

function generateInterlockingParams(rng: () => number): InterlockingFormsParams {
    const base = generateBaseParams(rng);
    const shapes: Array<'ring' | 'link' | 'chain' | 'weave'> = ['ring', 'link', 'chain', 'weave'];
    const arrangements: Array<'linear' | 'circular' | 'stacked'> = ['linear', 'circular', 'stacked'];
    const formCount = 2 + Math.floor(rng() * 3);

    return {
        ...base,
        formCount,
        formShape: shapes[Math.floor(rng() * shapes.length)],
        interlockDepth: 0.3 + rng() * 0.4,                // 0.3-0.7
        formThickness: 4 + rng() * 8,                     // 4-12
        gapSize: 2 + rng() * 5,                           // 2-7
        arrangement: arrangements[Math.floor(rng() * arrangements.length)],
        overlapOrder: Array.from({ length: formCount }, (_, i) => i),
        connectionStrength: 0.4 + rng() * 0.5,            // 0.4-0.9
    };
}

// ============================================
// FORM GENERATION
// ============================================

interface FormPath {
    segments: { d: string; layer: number }[];
    index: number;
    color: string;
}

/**
 * Generate a ring form (torus-like)
 */
function generateRingForm(
    cx: number,
    cy: number,
    outerRadius: number,
    thickness: number,
    params: InterlockingFormsParams
): string {
    const innerRadius = outerRadius - thickness;
    const k = 0.5522847498; // Bezier circle constant

    // Outer circle
    const outer = `
        M ${cx} ${cy - outerRadius}
        C ${cx + outerRadius * k} ${cy - outerRadius}, ${cx + outerRadius} ${cy - outerRadius * k}, ${cx + outerRadius} ${cy}
        C ${cx + outerRadius} ${cy + outerRadius * k}, ${cx + outerRadius * k} ${cy + outerRadius}, ${cx} ${cy + outerRadius}
        C ${cx - outerRadius * k} ${cy + outerRadius}, ${cx - outerRadius} ${cy + outerRadius * k}, ${cx - outerRadius} ${cy}
        C ${cx - outerRadius} ${cy - outerRadius * k}, ${cx - outerRadius * k} ${cy - outerRadius}, ${cx} ${cy - outerRadius}
        Z
    `;

    // Inner circle (reverse direction for cutout)
    const inner = `
        M ${cx} ${cy - innerRadius}
        C ${cx - innerRadius * k} ${cy - innerRadius}, ${cx - innerRadius} ${cy - innerRadius * k}, ${cx - innerRadius} ${cy}
        C ${cx - innerRadius} ${cy + innerRadius * k}, ${cx - innerRadius * k} ${cy + innerRadius}, ${cx} ${cy + innerRadius}
        C ${cx + innerRadius * k} ${cy + innerRadius}, ${cx + innerRadius} ${cy + innerRadius * k}, ${cx + innerRadius} ${cy}
        C ${cx + innerRadius} ${cy - innerRadius * k}, ${cx + innerRadius * k} ${cy - innerRadius}, ${cx} ${cy - innerRadius}
        Z
    `;

    return `${outer} ${inner}`.replace(/\s+/g, ' ').trim();
}

/**
 * Generate a chain link form
 */
function generateLinkForm(
    cx: number,
    cy: number,
    width: number,
    height: number,
    thickness: number,
    params: InterlockingFormsParams
): string {
    const hw = width / 2;
    const hh = height / 2;
    const r = Math.min(hw, thickness);
    const innerHw = hw - thickness;
    const innerHh = hh - thickness;
    const innerR = Math.max(1, r - thickness);

    // Outer rounded rectangle
    const outer = createRoundedRectPath(cx, cy, hw, hh, r);

    // Inner cutout
    const inner = createRoundedRectPath(cx, cy, innerHw, innerHh, innerR);

    return `${outer} ${inner}`;
}

/**
 * Create a rounded rectangle path
 */
function createRoundedRectPath(
    cx: number,
    cy: number,
    hw: number,
    hh: number,
    r: number
): string {
    const k = 0.5522847498;
    r = Math.min(r, hw, hh);

    return `
        M ${cx - hw + r} ${cy - hh}
        L ${cx + hw - r} ${cy - hh}
        C ${cx + hw - r + r * k} ${cy - hh}, ${cx + hw} ${cy - hh + r - r * k}, ${cx + hw} ${cy - hh + r}
        L ${cx + hw} ${cy + hh - r}
        C ${cx + hw} ${cy + hh - r + r * k}, ${cx + hw - r + r * k} ${cy + hh}, ${cx + hw - r} ${cy + hh}
        L ${cx - hw + r} ${cy + hh}
        C ${cx - hw + r - r * k} ${cy + hh}, ${cx - hw} ${cy + hh - r + r * k}, ${cx - hw} ${cy + hh - r}
        L ${cx - hw} ${cy - hh + r}
        C ${cx - hw} ${cy - hh + r - r * k}, ${cx - hw + r - r * k} ${cy - hh}, ${cx - hw + r} ${cy - hh}
        Z
    `.replace(/\s+/g, ' ').trim();
}

/**
 * Generate a weave form (figure-8 like)
 */
function generateWeaveForm(
    cx: number,
    cy: number,
    size: number,
    thickness: number,
    params: InterlockingFormsParams
): string {
    const r = size * 0.35;
    const offset = size * 0.25;

    // Create figure-8 with two overlapping circles
    const leftCircle = generateRingForm(cx - offset, cy, r, thickness, params);
    const rightCircle = generateRingForm(cx + offset, cy, r, thickness, params);

    return `${leftCircle} ${rightCircle}`;
}

/**
 * Split a ring into segments for interlocking effect
 */
function splitRingIntoSegments(
    cx: number,
    cy: number,
    outerRadius: number,
    innerRadius: number,
    startAngle: number,
    endAngle: number,
    params: InterlockingFormsParams
): string {
    const segments = 16;
    const outerPoints: Point[] = [];
    const innerPoints: Point[] = [];

    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const angle = lerp(startAngle, endAngle, t);

        outerPoints.push({
            x: cx + Math.cos(angle) * outerRadius,
            y: cy + Math.sin(angle) * outerRadius,
        });

        innerPoints.push({
            x: cx + Math.cos(angle) * innerRadius,
            y: cy + Math.sin(angle) * innerRadius,
        });
    }

    // Build path
    const path: string[] = [];

    // Outer arc
    path.push(`M ${outerPoints[0].x.toFixed(2)} ${outerPoints[0].y.toFixed(2)}`);
    for (let i = 1; i < outerPoints.length; i++) {
        const prev = outerPoints[i - 1];
        const curr = outerPoints[i];
        const cpx = (prev.x + curr.x) / 2 + (curr.y - prev.y) * 0.1;
        const cpy = (prev.y + curr.y) / 2 - (curr.x - prev.x) * 0.1;
        path.push(`Q ${cpx.toFixed(2)} ${cpy.toFixed(2)}, ${curr.x.toFixed(2)} ${curr.y.toFixed(2)}`);
    }

    // End cap
    const lastOuter = outerPoints[outerPoints.length - 1];
    const lastInner = innerPoints[innerPoints.length - 1];
    path.push(`L ${lastInner.x.toFixed(2)} ${lastInner.y.toFixed(2)}`);

    // Inner arc (reverse)
    for (let i = innerPoints.length - 2; i >= 0; i--) {
        const prev = innerPoints[i + 1];
        const curr = innerPoints[i];
        const cpx = (prev.x + curr.x) / 2 - (curr.y - prev.y) * 0.1;
        const cpy = (prev.y + curr.y) / 2 + (curr.x - prev.x) * 0.1;
        path.push(`Q ${cpx.toFixed(2)} ${cpy.toFixed(2)}, ${curr.x.toFixed(2)} ${curr.y.toFixed(2)}`);
    }

    path.push('Z');
    return path.join(' ');
}

/**
 * Generate interlocking forms with proper layering
 */
function generateInterlockingForm(
    params: InterlockingFormsParams,
    index: number,
    totalForms: number,
    size: number,
    primaryColor: string,
    rng: () => number
): FormPath {
    const padding = size * params.paddingRatio;
    const availableSize = size - padding * 2;

    // Calculate position based on arrangement
    let cx: number, cy: number;
    const centerX = size / 2;
    const centerY = size / 2;

    switch (params.arrangement) {
        case 'circular': {
            const angle = (index / totalForms) * Math.PI * 2 - Math.PI / 2;
            const radius = availableSize * 0.25;
            cx = centerX + Math.cos(angle) * radius;
            cy = centerY + Math.sin(angle) * radius;
            break;
        }
        case 'stacked': {
            const offset = (index - (totalForms - 1) / 2) * params.formThickness * 0.5;
            cx = centerX + offset;
            cy = centerY + offset * 0.5;
            break;
        }
        case 'linear':
        default: {
            const spacing = availableSize / (totalForms + 1);
            cx = padding + spacing * (index + 1);
            cy = centerY;
            break;
        }
    }

    // Generate form based on shape type
    const formSize = availableSize / (totalForms * 0.6);

    let fullPath: string;
    switch (params.formShape) {
        case 'link':
            fullPath = generateLinkForm(cx, cy, formSize * 1.2, formSize * 0.8, params.formThickness, params);
            break;
        case 'chain':
            fullPath = generateLinkForm(cx, cy, formSize, formSize * 0.6, params.formThickness, params);
            break;
        case 'weave':
            fullPath = generateWeaveForm(cx, cy, formSize, params.formThickness, params);
            break;
        case 'ring':
        default:
            fullPath = generateRingForm(cx, cy, formSize / 2, params.formThickness, params);
            break;
    }

    // Generate color
    const hueShift = (index / totalForms) * 40 - 20;
    const color = rotateHue(primaryColor, hueShift);

    return {
        segments: [{ d: fullPath, layer: index }],
        index,
        color,
    };
}

// ============================================
// MAIN GENERATOR
// ============================================

export function generateInterlockingForms(params: LogoGenerationParams): GeneratedLogo[] {
    const {
        brandName,
        primaryColor,
        accentColor,
        variations = 3,
        seed = brandName,
    } = params;

    const logos: GeneratedLogo[] = [];
    const size = 100;

    for (let v = 0; v < variations; v++) {
        const variantSeed = `${seed}-interlocking-v${v}`;
        const rng = createSeededRandom(variantSeed);

        const algoParams = generateInterlockingParams(rng);
        const svg = createSVG(size);
        const uniqueId = generateLogoId('interlocking-forms', v);

        // Generate forms
        const forms: FormPath[] = [];
        for (let i = 0; i < algoParams.formCount; i++) {
            forms.push(generateInterlockingForm(
                algoParams,
                i,
                algoParams.formCount,
                size,
                primaryColor,
                rng
            ));
        }

        // Render forms with gradients
        forms.forEach((form, i) => {
            const gradId = `${uniqueId}-form-${i}`;
            const progress = i / (algoParams.formCount - 1 || 1);

            svg.addGradient(gradId, {
                type: 'linear',
                angle: 45 + i * 30,
                stops: [
                    { offset: 0, color: lighten(form.color, 15) },
                    { offset: 0.5, color: form.color },
                    { offset: 1, color: accentColor
                        ? lerp(0, 1, progress) > 0.5 ? accentColor : darken(form.color, 15)
                        : darken(form.color, 15) },
                ],
            });

            form.segments.forEach(segment => {
                svg.path(segment.d, {
                    fill: `url(#${gradId})`,
                    'fill-rule': 'evenodd',
                });
            });
        });

        const svgString = svg.build();
        const hash = generateLogoHash(brandName, 'interlocking-forms', v, algoParams);

        storeHash({
            hash,
            brandName,
            algorithm: 'interlocking-forms',
            variant: v,
            createdAt: Date.now(),
        });

        logos.push({
            id: uniqueId,
            hash,
            algorithm: 'interlocking-forms',
            variant: v + 1,
            svg: svgString,
            viewBox: `0 0 ${size} ${size}`,
            params: algoParams,
            meta: {
                brandName,
                generatedAt: Date.now(),
                seed: variantSeed,
                geometry: {
                    usesGoldenRatio: false,
                    gridBased: false,
                    bezierCurves: true,
                    symmetry: algoParams.arrangement === 'circular' ? 'radial' : 'none',
                    pathCount: algoParams.formCount,
                    complexity: calculateComplexity(svgString),
                },
                colors: {
                    primary: primaryColor,
                    accent: accentColor,
                    palette: forms.map(f => f.color),
                },
            },
        });
    }

    return logos;
}

export function generateSingleInterlockingForms(
    primaryColor: string,
    accentColor?: string,
    customParams?: Partial<InterlockingFormsParams>,
    seed: string = 'default'
): string {
    const rng = createSeededRandom(seed);
    const params = { ...generateInterlockingParams(rng), ...customParams };
    const size = 100;
    const svg = createSVG(size);

    for (let i = 0; i < params.formCount; i++) {
        const form = generateInterlockingForm(params, i, params.formCount, size, primaryColor, rng);

        svg.addGradient(`form-${i}`, {
            type: 'linear',
            angle: 45,
            stops: [
                { offset: 0, color: form.color },
                { offset: 1, color: darken(form.color, 20) },
            ],
        });

        form.segments.forEach(segment => {
            svg.path(segment.d, { fill: `url(#form-${i})`, 'fill-rule': 'evenodd' });
        });
    }

    return svg.build();
}
