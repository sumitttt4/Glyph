/**
 * Premium Logo Engine - Type Definitions
 *
 * Professional parametric logo generation with infinite unique outputs
 * SHA-256 hash-based uniqueness with 30+ seeded parameters
 */

// ============================================
// CORE ALGORITHM TYPES
// ============================================

/**
 * ABSTRACT PROFESSIONAL LOGO ALGORITHMS ONLY
 *
 * All algorithms must produce abstract marks, NOT literal objects.
 * Inspired by: Stripe, Linear, Vercel, Figma, Claude, Mastercard
 *
 * REJECTED PATTERNS (DO NOT ADD):
 * - Literal objects: hearts, crowns, leaves, mountains, clouds, locks
 * - Clipart-style: arrows, stars, moons, gears, eyes, shields
 * - Basic shapes: simple circles, squares, triangles without treatment
 * - Scenery: landscapes, weather, nature scenes
 */
export type LogoAlgorithm =
    | 'line-fragmentation'
    | 'staggered-bars'
    | 'block-assembly'
    | 'motion-chevrons'
    | 'negative-space'
    | 'interlocking-loops'
    | 'monogram-merge'
    | 'continuous-stroke'
    | 'geometric-extract'
    | 'clover-radial';

export type LogoCategory =
    | 'technology'
    | 'finance'
    | 'healthcare'
    | 'creative'
    | 'ecommerce'
    | 'education'
    | 'sustainability'
    | 'general';

// Alias for backwards compatibility
export type IndustryCategory = LogoCategory;

export type LogoAesthetic =
    | 'tech-minimal'
    | 'friendly-rounded'
    | 'bold-geometric'
    | 'elegant-refined';

export type SymmetryType =
    | 'none'
    | 'horizontal'
    | 'vertical'
    | 'radial'
    | 'bilateral'
    | 'rotational'
    | 'rotational-4'
    | 'rotational-6'
    | 'rotational-8';

// ============================================
// HASH-BASED UNIQUENESS SYSTEM
// ============================================

export interface HashParams {
    brandName: string;
    category: LogoCategory;
    timestamp: number;
    salt: string;
    hashHex: string;
}

export interface HashDerivedParams {
    // === STRUCTURAL PARAMETERS (major visual impact) ===
    // Element counts (from hash bits 0-15) - WIDER range for more variety
    elementCount: number;        // 4-24 elements
    layerCount: number;          // 1-7 layers

    // Rotation & angles (from hash bits 16-31) - FULL range
    rotationOffset: number;      // 0-360 degrees
    angleSpread: number;         // 15-180 degrees

    // Curve properties (from hash bits 32-47) - WIDER range
    curveTension: number;        // 0.1-1.0
    curveAmplitude: number;      // 5-80

    // Taper & stroke (from hash bits 48-63)
    taperRatio: number;          // 0.1-0.95
    strokeWidth: number;         // 0.5-18

    // Spacing & scale (from hash bits 64-79) - WIDER range
    spacingFactor: number;       // 0.3-3.0
    scaleFactor: number;         // 0.5-1.8

    // Symmetry & style (from hash bits 80-95)
    symmetryType: SymmetryType;
    styleVariant: number;        // 0-15

    // Color placement (from hash bits 96-111)
    colorPlacement: number;      // 0-11 placement variants
    gradientAngle: number;       // 0-360

    // Organic variation (from hash bits 112-127) - HIGHER potential
    organicAmount: number;       // 0-1
    jitterAmount: number;        // 0-15

    // === ARM/ELEMENT PARAMETERS ===
    armWidth: number;            // 1.5-22
    armLength: number;           // 15-65
    centerRadius: number;        // 0-25
    spiralAmount: number;        // 0-0.8
    bulgeAmount: number;         // 0-0.7
    cornerRadius: number;        // 0-40
    depthOffset: number;         // 1-30
    perspectiveStrength: number; // 0-1
    letterWeight: number;        // 100-900
    cutDepth: number;            // 0-1
    overlapAmount: number;       // 0.1-0.9
    ringThickness: number;       // 1-18
    flowIntensity: number;       // 0-1
    extrusionDepth: number;      // 3-35

    // === NEW PARAMETERS (55+ total) ===
    // Segment parameters
    segmentCount: number;        // 3-16
    segmentSpacing: number;      // 2-30
    segmentCurve: number;        // 0-1

    // Shape modifiers
    innerRadius: number;         // 0-0.6
    outerRadius: number;         // 0.7-1.0
    pointiness: number;          // 0-1
    roundness: number;           // 0-1
    skewX: number;               // -0.3-0.3
    skewY: number;               // -0.3-0.3

    // Complexity modifiers
    subdivisions: number;        // 1-6
    nestingLevel: number;        // 1-4
    branchCount: number;         // 0-5
    branchAngle: number;         // 15-90
    branchLength: number;        // 0.3-0.8

    // Fill/stroke variations
    fillStrokeRatio: number;     // 0-1
    strokeDashRatio: number;     // 0-1

    // Transformation parameters
    waveFrequency: number;       // 0-5
    waveAmplitude: number;       // 0-20
    noiseScale: number;          // 0.01-0.5
    turbulence: number;          // 0-1

    // Position modifiers
    offsetX: number;             // -10-10
    offsetY: number;             // -10-10
    anchorPoint: number;         // 0-1

    // Visual weight distribution
    weightDistribution: number;  // 0-1
    densityCenter: number;       // 0.2-0.8
    densityEdge: number;         // 0.2-0.8
}

// ============================================
// QUALITY SCORING
// ============================================

/**
 * Rejection reason for quality filtering
 */
export interface RejectionReason {
    reason: string;
    value: number;
    threshold: number;
}

export interface QualityMetrics {
    score: number;               // 0-100 overall score
    pathSmoothness: number;      // 0-100 bezier curve quality
    visualBalance: number;       // 0-100 visual weight distribution
    complexity: number;          // 0-100 optimal complexity score
    goldenRatioAdherence: number;// 0-100 golden ratio usage
    uniqueness: number;          // 0-100 distinctiveness
    rejections?: RejectionReason[]; // List of rejection reasons if below threshold
}

// ============================================
// BASE PARAMETERS
// ============================================

export interface BaseParameters {
    // Core
    strokeWidth: number;
    strokeWidthVariance: number;

    // Angles & Rotation
    baseAngle: number;
    angleVariance: number;
    rotationOffset: number;

    // Curves & Tension
    curveTension: number;
    curveAmplitude: number;
    curveFrequency: number;

    // Segments & Counts
    segmentCount: number;
    segmentSpacing: number;
    segmentLengthRatio: number;

    // Spacing & Layout
    horizontalSpacing: number;
    verticalSpacing: number;
    paddingRatio: number;

    // Scale & Size
    scaleX: number;
    scaleY: number;
    sizeVariance: number;

    // Corner & Radius
    cornerRadius: number;
    cornerRadiusVariance: number;

    // Opacity & Layers
    baseOpacity: number;
    opacityFalloff: number;
    layerCount: number;

    // Noise & Variation
    noiseAmount: number;
    noiseFrequency: number;
    jitterAmount: number;
}

// ============================================
// ALGORITHM-SPECIFIC PARAMETERS
// ============================================

// ============================================
// NEW ALGORITHM PARAMETERS (10 TECHNIQUES)
// ============================================

export interface LineFragmentationParams extends BaseParameters {
    lineCount: number;           // 10-30
    gapRatio: number;            // 0.1-0.5
    thickness: number;           // 1-5
    angle: number;               // 0-180
    fragmentationIntensity: number; // 0-1
    minFragmentLength: number;   // 5-20
    noiseOffset: number;         // 0-10
}

export interface StaggeredBarsParams extends BaseParameters {
    barCount: number;            // 8-20
    staggerOffset: number;       // 0-50
    barHeight: number;           // 5-20
    rounding: number;            // 0-1
    widthVariation: number;      // 0-1
    verticalAlignment: 'top' | 'center' | 'bottom' | 'wave';
}

export interface BlockAssemblyParams extends BaseParameters {
    blockCount: number;          // 2-4
    overlapPercentage: number;   // 0.1-0.8
    shadowOffset: number;        // 2-15
    perspectiveAngle: number;    // 0-60
    depthScale: number;          // 0.5-1.0
    stackDirection: 'vertical' | 'horizontal' | 'diagonal';
}

export interface MotionChevronsParams extends BaseParameters {
    count: number;               // 2-4
    spacing: number;             // 5-20
    angle: number;               // 0-360
    taper: boolean;
    chevronWidth: number;        // 10-50
    chevronAngle: number;        // 30-150 (internal angle)
}

export interface NegativeSpaceParams extends BaseParameters {
    containerShape: 'circle' | 'square' | 'hexagon' | 'shield';
    cutDepth: number;            // 0.1-1.0
    innerScale: number;          // 0.3-0.8
    rotation: number;            // 0-360
    containerBorder: number;     // 0-10
}

export interface InterlockingLoopsParams extends BaseParameters {
    loopCount: number;           // 2-4
    weaveDepth: number;          // 0-10 (visual gap for weave)
    strokeWidth: number;         // 5-20
    roundness: number;           // 0-1
    interactionType: 'chain' | 'braid' | 'olympic';
}

export interface MonogramMergeParams extends BaseParameters {
    mergePoint: number;          // 0-1 (along stroke)
    connectionStyle: 'smooth' | 'sharp' | 'gap';
    letterSpacing: number;       // -20 to 20
    verticalOffset: number;      // -10 to 10
    strokeWeight: number;        // 10-40
}

export interface ContinuousStrokeParams extends BaseParameters {
    complexity: number;          // 0-1
    cornerStyle: 'round' | 'sharp' | 'beveled';
    gridBased: boolean;
    pathLength: number;          // 0-100
    loops: number;               // 0-3
}

export interface GeometricExtractParams extends BaseParameters {
    extractionPart: 'peak' | 'arc' | 'crossbar' | 'stem' | 'bowl';
    zoomLevel: number;           // 1.0-3.0
    abstractionLevel: number;    // 0-1
    frameType: 'none' | 'circle' | 'box';
    rotation: number;            // 0-360
}

export interface CloverRadialParams extends BaseParameters {
    petalCount: number;          // 3-6
    petalShape: 'round' | 'pointed' | 'heart' | 'shield';
    overlap: number;             // 0-0.5
    rotationOffset: number;      // 0-360
    centerGap: number;           // 0-20
}

export type AlgorithmParams =
    | LineFragmentationParams
    | StaggeredBarsParams
    | BlockAssemblyParams
    | MotionChevronsParams
    | NegativeSpaceParams
    | InterlockingLoopsParams
    | MonogramMergeParams
    | ContinuousStrokeParams
    | GeometricExtractParams
    | CloverRadialParams;

// ============================================
// INPUT PARAMETERS
// ============================================

export interface LogoGenerationParams {
    brandName: string;
    tagline?: string;
    category?: LogoCategory;
    industry?: IndustryCategory;   // Alias for category (backwards compat)
    aesthetic?: LogoAesthetic;
    primaryColor: string;
    accentColor?: string;
    algorithm?: LogoAlgorithm;
    archetype?: 'symbol' | 'wordmark' | 'both'; // Logo type filtering
    variations?: number;
    seed?: string;
    customParams?: Partial<BaseParameters>;
    minQualityScore?: number;      // Default 85
}

// ============================================
// OUTPUT TYPES
// ============================================

export interface GeneratedLogo {
    id: string;
    hash: string;                  // SHA-256 based unique hash
    algorithm: LogoAlgorithm;
    variant: number;
    svg: string;
    viewBox: string;
    meta: LogoMetadata;
    params: AlgorithmParams;
    quality: QualityMetrics;
    animation?: LogoAnimation;
}

export interface LogoMetadata {
    brandName: string;
    generatedAt: number;
    seed: string;
    hashParams: HashParams;
    geometry: {
        usesGoldenRatio: boolean;
        gridBased: boolean;
        bezierCurves: boolean;
        symmetry: SymmetryType;
        pathCount: number;
        complexity: number;
    };
    colors: {
        primary: string;
        accent?: string;
        gradient?: GradientDef;
        palette: string[];
    };
}

export interface LogoAnimation {
    lottie: LottieAnimation;
    css: CSSAnimation;
    preset: AnimationPreset;
}

export type AnimationPreset = 'fade-in' | 'scale-bounce' | 'draw-path' | 'morph-reveal' | 'stagger-in';

export interface LottieAnimation {
    v: string;
    fr: number;
    ip: number;
    op: number;
    w: number;
    h: number;
    layers: LottieLayer[];
}

export interface LottieLayer {
    ty: number;
    nm: string;
    ks: {
        o: LottieKeyframe;
        r: LottieKeyframe;
        p: LottieKeyframe;
        s: LottieKeyframe;
    };
    shapes?: LottieShape[];
}

export interface LottieKeyframe {
    a: 0 | 1;
    k: number | number[] | LottieKeyframeValue[];
}

export interface LottieKeyframeValue {
    t: number;
    s: number[];
    e?: number[];
    i?: { x: number[]; y: number[] };
    o?: { x: number[]; y: number[] };
}

export interface LottieShape {
    ty: string;
    nm: string;
    it?: LottieShape[];
    ks?: {
        a: 0 | 1;
        k: string | { i: number[][]; o: number[][]; v: number[][]; c: boolean };
    };
    c?: { a: 0 | 1; k: number[] };
    o?: LottieKeyframe;
    w?: LottieKeyframe;
    s?: LottieKeyframe; // Start for Trim Paths
    e?: LottieKeyframe; // End for Trim Paths
}

export interface CSSAnimation {
    keyframes: string;
    className: string;
    duration: number;
    easing: string;
    delay?: number;
}

export interface GradientDef {
    type: 'linear' | 'radial' | 'conic';
    angle?: number;
    stops: Array<{ offset: number; color: string; opacity?: number }>;
}

// ============================================
// GEOMETRY TYPES
// ============================================

export interface Point {
    x: number;
    y: number;
}

export interface BezierCurve {
    start: Point;
    control1: Point;
    control2: Point;
    end: Point;
}

export interface QuadraticCurve {
    start: Point;
    control: Point;
    end: Point;
}

export interface PathCommand {
    type: 'M' | 'L' | 'C' | 'Q' | 'S' | 'T' | 'A' | 'Z';
    points: number[];
}

export interface Arc {
    center: Point;
    radius: number;
    startAngle: number;
    endAngle: number;
    clockwise?: boolean;
}

export interface Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
    rx?: number;  // Optional corner radius
}

export interface GridConfig {
    cellSize: number;
    columns: number;
    rows: number;
    margin: number;
    gutterX: number;
    gutterY: number;
}

export interface GoldenRatioGrid {
    size: number;
    columns: number;
    rows: number;
    margin: number;
    gap: number;
    phi: number;
    major: number;
    minor: number;
}

// ============================================
// HASH & STORAGE
// ============================================

export interface LogoHashRecord {
    hash: string;
    brandName: string;
    algorithm: LogoAlgorithm;
    variant: number;
    createdAt: number;
    qualityScore: number;
    svg?: string;
}

// ============================================
// LOGO VARIATIONS SYSTEM
// ============================================

/**
 * Logo variation types for brand identity system
 * Each brand generates 6 standard variations
 */
export type LogoVariationType =
    | 'horizontal'    // Icon left, wordmark right
    | 'stacked'       // Icon top, wordmark below
    | 'icon-only'     // Symbol without text
    | 'wordmark-only' // Text without symbol
    | 'dark'          // For light backgrounds (dark logo)
    | 'light';        // For dark backgrounds (light logo)

/**
 * Individual logo variation with SVG and metadata
 */
export interface LogoVariation {
    type: LogoVariationType;
    svg: string;
    viewBox: string;
    description: string;
    recommended: string;  // e.g., "Use on light backgrounds", "Use for favicons"
}

/**
 * Complete set of logo variations for a brand
 */
export interface LogoVariations {
    horizontal: LogoVariation;
    stacked: LogoVariation;
    iconOnly: LogoVariation;
    wordmarkOnly: LogoVariation;
    dark: LogoVariation;
    light: LogoVariation;
}

/**
 * Extended GeneratedLogo with variations support
 */
export interface GeneratedLogoWithVariations extends GeneratedLogo {
    variations?: LogoVariations;
}

export interface LogoStorageState {
    generatedHashes: Set<string>;
    logoRecords: Map<string, LogoHashRecord>;
    lastUpdated: number;
}
