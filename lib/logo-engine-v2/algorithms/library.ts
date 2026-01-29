
import { InfiniteLogoParams } from '../types';
import { generateInterlocking } from './interlocking';
import { generateLetterFusion } from './letter-fusion';
import { generateConstruction, generateNeoGradient, generateNegativeSpace, generateSwissMinimal } from './premium';

// Import skeleton-based techniques (proper typography anatomy)
import {
    generateModular,
    generateStencil,
    generateOutline,
    generateGeometricConstruction,
    generateCalligraphic,
    generateMonoline,
    generateShadowLetter,
    generateDottedSkeleton,
} from './skeleton-techniques';

// Import abstract icon generators (symbol-only logos)
import {
    generateSpeedIcon,
    generateGrowthIcon,
    generateConnectIcon,
    generateSecureIcon,
    generateTechIcon,
    generateCreativeIcon,
    generateDataIcon,
    generateCommunicationIcon,
    generateFinanceIcon,
    generateHealthIcon,
    generateDefaultIcon,
} from '../abstract-icons';

// Re-use core generators with different internal logic triggers or just variety
// We define a "Variant" as a Name + Core Generator + Specific 'Flavor' (simulated via seed influence or params)
// Since the generators currently take 'params' derived from seed, 
// we will wrap them to enforce specific styles.

interface LogoVariant {
    name: string;
    description: string;
    fn: (params: InfiniteLogoParams, brandName: string) => string;
}

// Helper to force specific params for a variant
const withPreset = (generator: Function, overrides: Partial<InfiniteLogoParams>) => {
    return (params: InfiniteLogoParams, brandName: string) => {
        const merged = { ...params, ...overrides };
        return generator(merged, brandName);
    };
};

// Note: Removed placeholder text-based generators (genMinimal, genMonogram, genAbstract)
// All logo variants now use proper skeleton-based or premium algorithms

// THE MASSIVE LIBRARY
export const LOGO_LIBRARY: LogoVariant[] = [
    // --- PREMIUM SERIES ($1000 Styles) ---
    { name: 'Architectural Grid', description: 'Technical construction', fn: generateConstruction },
    { name: 'Neo Gradient', description: 'Modern vivid gradient', fn: generateNeoGradient },
    { name: 'Negative Space', description: 'Bold cutout', fn: generateNegativeSpace },
    { name: 'Swiss Minimal', description: 'International typographic', fn: generateSwissMinimal },
    // Variants of Premium
    { name: 'Techno Construct', description: 'Blueprint style', fn: withPreset(generateConstruction, { strokeWidth: 1 }) },
    { name: 'Glass Orb', description: 'Soft gradient sphere', fn: withPreset(generateNeoGradient, { fillOpacity: 0.9 }) },
    { name: 'Iconic Cut', description: 'App icon style', fn: withPreset(generateNegativeSpace, { cornerRadius: 50 }) },

    // =============================================
    // SKELETON-BASED LETTER TECHNIQUES (NEW)
    // Uses proper typography anatomy for each letter
    // =============================================

    // --- MODULAR SERIES (Geometric units at anchor points) ---
    { name: 'Modular Dots', description: 'Circular units on letter skeleton', fn: withPreset(generateModular, { cornerRadius: 50, strokeWidth: 3 }) },
    { name: 'Modular Blocks', description: 'Square units on letter anatomy', fn: withPreset(generateModular, { cornerRadius: 5, strokeWidth: 4 }) },
    { name: 'Modular Network', description: 'Connected geometric nodes', fn: withPreset(generateModular, { strokeWidth: 2, scaleVariance: 1.1 }) },
    { name: 'Modular Constellation', description: 'Star-like point distribution', fn: withPreset(generateModular, { cornerRadius: 50, strokeWidth: 2, rotation: 15 }) },

    // --- STENCIL SERIES (Cut gaps for spray paint effect) ---
    { name: 'Stencil Bold', description: 'Heavy stencil with wide gaps', fn: withPreset(generateStencil, { strokeWidth: 5, spacingRatio: 1.5 }) },
    { name: 'Stencil Fine', description: 'Thin stencil precise cuts', fn: withPreset(generateStencil, { strokeWidth: 3, spacingRatio: 0.8 }) },
    { name: 'Stencil Industrial', description: 'Factory marking style', fn: withPreset(generateStencil, { strokeWidth: 4, rotation: 0 }) },
    { name: 'Stencil Graffiti', description: 'Street art aesthetic', fn: withPreset(generateStencil, { strokeWidth: 6, spacingRatio: 1.2, rotation: -5 }) },

    // --- OUTLINE SERIES (Multiple parallel strokes) ---
    { name: 'Multi-Outline Glow', description: 'Glowing layered outlines', fn: withPreset(generateOutline, { elementCount: 4, strokeWidth: 3 }) },
    { name: 'Double Stroke', description: 'Twin line letter', fn: withPreset(generateOutline, { elementCount: 2, strokeWidth: 4 }) },
    { name: 'Neon Tube', description: 'Neon sign aesthetic', fn: withPreset(generateOutline, { elementCount: 3, strokeWidth: 5 }) },
    { name: 'Echo Lines', description: 'Fading echo effect', fn: withPreset(generateOutline, { elementCount: 5, strokeWidth: 2 }) },

    // --- GEOMETRIC CONSTRUCTION SERIES (Built from primitives) ---
    { name: 'Blueprint Letter', description: 'Technical drawing style', fn: withPreset(generateGeometricConstruction, { strokeWidth: 2, fillOpacity: 0.3 }) },
    { name: 'Structural Form', description: 'Architectural skeleton', fn: withPreset(generateGeometricConstruction, { strokeWidth: 3, fillOpacity: 0.5 }) },
    { name: 'Wireframe Type', description: 'Minimal wireframe', fn: withPreset(generateGeometricConstruction, { strokeWidth: 1, fillOpacity: 0.2 }) },
    { name: 'Construction Grid', description: 'Grid-based construction', fn: withPreset(generateGeometricConstruction, { strokeWidth: 2, rotation: 0 }) },

    // --- CALLIGRAPHIC SERIES (Variable stroke width) ---
    { name: 'Brush Script', description: 'Calligraphy brush feel', fn: withPreset(generateCalligraphic, { strokeTaper: 60, strokeWidth: 4 }) },
    { name: 'Pen Stroke', description: 'Fountain pen aesthetic', fn: withPreset(generateCalligraphic, { strokeTaper: 40, strokeWidth: 3 }) },
    { name: 'Chisel Tip', description: 'Flat nib calligraphy', fn: withPreset(generateCalligraphic, { strokeTaper: 80, strokeWidth: 5 }) },
    { name: 'Flow Script', description: 'Smooth flowing line', fn: withPreset(generateCalligraphic, { strokeTaper: 30, strokeWidth: 4 }) },

    // --- MONOLINE SERIES (Single continuous stroke) ---
    { name: 'Monoline Clean', description: 'Pure single line letter', fn: withPreset(generateMonoline, { strokeWidth: 3 }) },
    { name: 'Monoline Bold', description: 'Heavy single stroke', fn: withPreset(generateMonoline, { strokeWidth: 5 }) },
    { name: 'Monoline Wire', description: 'Thin wire aesthetic', fn: withPreset(generateMonoline, { strokeWidth: 1.5 }) },
    { name: 'Monoline Tilt', description: 'Angled single line', fn: withPreset(generateMonoline, { strokeWidth: 3, rotation: 10 }) },

    // --- SHADOW SERIES (Layered depth effect) ---
    { name: 'Long Shadow', description: 'Extended depth shadow', fn: withPreset(generateShadowLetter, { interlockDepth: 80, strokeWidth: 4 }) },
    { name: 'Soft Shadow', description: 'Subtle depth effect', fn: withPreset(generateShadowLetter, { interlockDepth: 30, strokeWidth: 3 }) },
    { name: 'Hard Shadow', description: 'Sharp offset shadow', fn: withPreset(generateShadowLetter, { interlockDepth: 60, strokeWidth: 5 }) },
    { name: '3D Block', description: 'Isometric block shadow', fn: withPreset(generateShadowLetter, { interlockDepth: 90, strokeWidth: 4 }) },

    // --- DOTTED SERIES (Dashed/dotted strokes) ---
    { name: 'Morse Code', description: 'Dot-dash pattern', fn: withPreset(generateDottedSkeleton, { spacingRatio: 1.0, strokeWidth: 3 }) },
    { name: 'Dashed Line', description: 'Long dash segments', fn: withPreset(generateDottedSkeleton, { spacingRatio: 1.5, strokeWidth: 4 }) },
    { name: 'Dotted Trail', description: 'Close dot pattern', fn: withPreset(generateDottedSkeleton, { spacingRatio: 0.6, strokeWidth: 2 }) },
    { name: 'Perforated', description: 'Perforation style', fn: withPreset(generateDottedSkeleton, { spacingRatio: 0.8, strokeWidth: 3 }) },

    // --- INTERLOCKING SERIES ---
    { name: 'Quantum Interlock', description: 'Tight geometric weave', fn: withPreset(generateInterlocking, { interlockDepth: 80, elementCount: 3, cornerRadius: 5 }) },
    { name: 'Orbital Rings', description: 'Circular paths', fn: withPreset(generateInterlocking, { cornerRadius: 50, elementCount: 2, scaleVariance: 1.2 }) },
    { name: 'Trinity Knot', description: 'Triangular weave', fn: withPreset(generateInterlocking, { elementCount: 3, spacingRatio: 0.8 }) },
    { name: 'Quad Link', description: 'Four-way connection', fn: withPreset(generateInterlocking, { elementCount: 4, cornerRadius: 10 }) },
    { name: 'Chain Reaction', description: 'Linear linking', fn: withPreset(generateInterlocking, { spacingRatio: 1.5 }) },
    { name: 'Weave Grid', description: 'Dense pattern', fn: withPreset(generateInterlocking, { elementCount: 6, strokeWidth: 2 }) },
    { name: 'Soft Interlock', description: 'Rounded edges', fn: withPreset(generateInterlocking, { cornerRadius: 40 }) },
    { name: 'Hard Link', description: 'Sharp edges', fn: withPreset(generateInterlocking, { cornerRadius: 0 }) },

    // --- FUSION SERIES ---
    { name: 'Eco Fusion', description: 'Nature integrated', fn: withPreset(generateLetterFusion, { cutoutPosition: 0 }) }, // Leaf
    { name: 'Power Fusion', description: 'Energy integrated', fn: withPreset(generateLetterFusion, { cutoutPosition: 1 }) }, // Bolt
    { name: 'Global Fusion', description: 'World integrated', fn: withPreset(generateLetterFusion, { cutoutPosition: 2 }) }, // Circle
    { name: 'Solid Fusion', description: 'Bold merger', fn: withPreset(generateLetterFusion, { interlockDepth: 20 }) },
    { name: 'Outline Fusion', description: 'Stroke based', fn: withPreset(generateLetterFusion, { fillOpacity: 0 }) },

    // =============================================
    // ABSTRACT ICON SERIES (Symbol-only, no letters)
    // Based on brand category + semantic meaning
    // =============================================

    // --- SPEED/MOTION ICONS ---
    { name: 'Speed Arrows', description: 'Dynamic motion chevrons', fn: generateSpeedIcon },
    { name: 'Motion Lines', description: 'Parallel velocity lines', fn: withPreset(generateSpeedIcon, { strokeWidth: 4 }) },
    { name: 'Fast Forward', description: 'Arrow sequence motion', fn: withPreset(generateSpeedIcon, { rotation: 0 }) },
    { name: 'Dash Blur', description: 'Speed blur effect', fn: withPreset(generateSpeedIcon, { strokeWidth: 5 }) },

    // --- GROWTH/UP ICONS ---
    { name: 'Rising Bars', description: 'Ascending growth chart', fn: generateGrowthIcon },
    { name: 'Peak Triangle', description: 'Upward mountain peak', fn: withPreset(generateGrowthIcon, { strokeWidth: 3 }) },
    { name: 'Lift Arc', description: 'Rising curved motion', fn: withPreset(generateGrowthIcon, { cornerRadius: 20 }) },
    { name: 'Elevate', description: 'Vertical growth symbol', fn: withPreset(generateGrowthIcon, { strokeWidth: 4 }) },

    // --- CONNECT/NETWORK ICONS ---
    { name: 'Link Rings', description: 'Overlapping connection circles', fn: generateConnectIcon },
    { name: 'Network Hub', description: 'Central node with connections', fn: withPreset(generateConnectIcon, { strokeWidth: 3 }) },
    { name: 'Chain Link', description: 'Linked ring chain', fn: withPreset(generateConnectIcon, { cornerRadius: 50 }) },
    { name: 'Social Web', description: 'Hub and spoke network', fn: withPreset(generateConnectIcon, { strokeWidth: 4 }) },

    // --- SECURE/TRUST ICONS ---
    { name: 'Shield Mark', description: 'Protective shield outline', fn: generateSecureIcon },
    { name: 'Lock Symbol', description: 'Security lock abstraction', fn: withPreset(generateSecureIcon, { strokeWidth: 3 }) },
    { name: 'Trust Check', description: 'Verified checkmark circle', fn: withPreset(generateSecureIcon, { cornerRadius: 50 }) },
    { name: 'Fortress', description: 'Concentric protective rings', fn: withPreset(generateSecureIcon, { strokeWidth: 4 }) },

    // --- TECH/DIGITAL ICONS ---
    { name: 'Pixel Grid', description: 'Digital pixel pattern', fn: generateTechIcon },
    { name: 'Code Brackets', description: 'Developer syntax symbol', fn: withPreset(generateTechIcon, { strokeWidth: 3 }) },
    { name: 'Cursor Mark', description: 'Digital pointer icon', fn: withPreset(generateTechIcon, { cornerRadius: 0 }) },
    { name: 'Binary Dots', description: 'Data point matrix', fn: withPreset(generateTechIcon, { strokeWidth: 4 }) },

    // --- CREATIVE/DESIGN ICONS ---
    { name: 'Pen Nib', description: 'Creative writing tool', fn: generateCreativeIcon },
    { name: 'Bezier Curve', description: 'Design path symbol', fn: withPreset(generateCreativeIcon, { strokeWidth: 3 }) },
    { name: 'Color Wheel', description: 'Spectrum palette icon', fn: withPreset(generateCreativeIcon, { cornerRadius: 50 }) },
    { name: 'Artboard', description: 'Design frame symbol', fn: withPreset(generateCreativeIcon, { strokeWidth: 4 }) },

    // --- DATA/ANALYTICS ICONS ---
    { name: 'Chart Line', description: 'Analytics graph symbol', fn: generateDataIcon },
    { name: 'Layer Stack', description: 'Stacked data layers', fn: withPreset(generateDataIcon, { strokeWidth: 3 }) },
    { name: 'Grid Matrix', description: 'Data grid pattern', fn: withPreset(generateDataIcon, { cornerRadius: 0 }) },
    { name: 'Pie Segments', description: 'Data distribution chart', fn: withPreset(generateDataIcon, { strokeWidth: 4 }) },

    // --- COMMUNICATION ICONS ---
    { name: 'Speech Bubble', description: 'Chat message symbol', fn: generateCommunicationIcon },
    { name: 'Signal Waves', description: 'Broadcast wave symbol', fn: withPreset(generateCommunicationIcon, { strokeWidth: 3 }) },
    { name: 'Chat Dots', description: 'Typing indicator icon', fn: withPreset(generateCommunicationIcon, { cornerRadius: 50 }) },
    { name: 'Broadcast', description: 'Megaphone signal icon', fn: withPreset(generateCommunicationIcon, { strokeWidth: 4 }) },

    // --- FINANCE/MONEY ICONS ---
    { name: 'Coin Stack', description: 'Abstract currency circles', fn: generateFinanceIcon },
    { name: 'Growth Arrow', description: 'Financial upward trend', fn: withPreset(generateFinanceIcon, { strokeWidth: 3 }) },
    { name: 'Value Layers', description: 'Stacked wealth symbol', fn: withPreset(generateFinanceIcon, { cornerRadius: 0 }) },
    { name: 'Gem Diamond', description: 'Premium value icon', fn: withPreset(generateFinanceIcon, { strokeWidth: 4 }) },

    // --- HEALTH/WELLNESS ICONS ---
    { name: 'Heart Symbol', description: 'Wellness heart outline', fn: generateHealthIcon },
    { name: 'Plus Cross', description: 'Medical plus sign', fn: withPreset(generateHealthIcon, { strokeWidth: 5 }) },
    { name: 'Leaf Curve', description: 'Natural wellness symbol', fn: withPreset(generateHealthIcon, { cornerRadius: 50 }) },
    { name: 'Pulse Line', description: 'Heartbeat monitor line', fn: withPreset(generateHealthIcon, { strokeWidth: 4 }) },

    // --- DEFAULT/ABSTRACT ICONS ---
    { name: 'Abstract Dots', description: 'Minimal dot pattern', fn: generateDefaultIcon },
    { name: 'Concentric Rings', description: 'Circular focus symbol', fn: withPreset(generateDefaultIcon, { strokeWidth: 3 }) },
    { name: 'Wave Form', description: 'Flowing wave pattern', fn: withPreset(generateDefaultIcon, { strokeWidth: 4 }) },
    { name: 'Centered Square', description: 'Geometric focus mark', fn: withPreset(generateDefaultIcon, { cornerRadius: 0 }) },

];

// Helper to get random variant
export const getRandomVariant = () => LOGO_LIBRARY[Math.floor(Math.random() * LOGO_LIBRARY.length)];

// Get count of skeleton-based variants
export const getSkeletonVariantCount = () => {
    const skeletonNames = ['Modular', 'Stencil', 'Outline', 'Blueprint', 'Structural', 'Wireframe', 'Construction',
        'Brush', 'Pen', 'Chisel', 'Flow', 'Monoline', 'Shadow', 'Block', 'Morse', 'Dashed', 'Dotted', 'Perforated'];
    return LOGO_LIBRARY.filter(v => skeletonNames.some(n => v.name.includes(n))).length;
};

// Total library size
export const LIBRARY_SIZE = LOGO_LIBRARY.length;
