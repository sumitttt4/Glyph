/**
 * Premium Logo Engine - Type Definitions
 *
 * Professional parametric logo generation with infinite unique outputs
 * SHA-256 hash-based uniqueness with 30+ seeded parameters
 */

// ============================================
// CORE ALGORITHM TYPES
// ============================================

export type LogoAlgorithm =
    | 'starburst'        // Claude/Anthropic - curved organic arms
    | 'framed-letter'    // Notion - letter in geometric frame
    | 'motion-lines'     // Linear/Framer - stacked motion lines
    | 'gradient-bars'    // Stripe - parallel diagonal bars
    | 'perfect-triangle' // Vercel - single perfect triangle
    | 'circle-overlap'   // Figma - overlapping transparent circles
    | 'depth-geometry'   // Raycast - abstract with depth/shadow
    | 'letter-swoosh'    // Arc - letter with dynamic swoosh
    | 'orbital-rings'    // Planetscale - intersecting orbital paths
    | 'flow-gradient'    // Loom - flowing gradient organic shape
    | 'isometric-cube'   // Pitch - 3D isometric cube letterform
    | 'abstract-mark'    // Supabase - abstract angular mark
    | 'monogram-blend';  // Two letters intertwined

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
    // Element counts (from hash bits 0-15)
    elementCount: number;        // 6-20 elements
    layerCount: number;          // 1-5 layers

    // Rotation & angles (from hash bits 16-31)
    rotationOffset: number;      // 0-360 degrees
    angleSpread: number;         // 0-90 degrees

    // Curve properties (from hash bits 32-47)
    curveTension: number;        // 0.3-0.9
    curveAmplitude: number;      // 0-50

    // Taper & stroke (from hash bits 48-63)
    taperRatio: number;          // 0.2-0.8
    strokeWidth: number;         // 1-12

    // Spacing & scale (from hash bits 64-79)
    spacingFactor: number;       // 0.5-2.0
    scaleFactor: number;         // 0.7-1.3

    // Symmetry & style (from hash bits 80-95)
    symmetryType: SymmetryType;
    styleVariant: number;        // 0-7

    // Color placement (from hash bits 96-111)
    colorPlacement: number;      // 0-7 placement variants
    gradientAngle: number;       // 0-360

    // Organic variation (from hash bits 112-127)
    organicAmount: number;       // 0-1
    jitterAmount: number;        // 0-10

    // Additional params (from hash bits 128-255)
    armWidth: number;            // 2-15
    armLength: number;           // 20-50
    centerRadius: number;        // 0-15
    spiralAmount: number;        // 0-0.5
    bulgeAmount: number;         // 0-0.5
    cornerRadius: number;        // 0-30
    depthOffset: number;         // 2-20
    perspectiveStrength: number; // 0-1
    letterWeight: number;        // 100-900
    cutDepth: number;            // 0-1
    overlapAmount: number;       // 0.2-0.8
    ringThickness: number;       // 2-12
    flowIntensity: number;       // 0-1
    extrusionDepth: number;      // 5-25
}

// ============================================
// QUALITY SCORING
// ============================================

export interface QualityMetrics {
    score: number;               // 0-100 overall score
    pathSmoothness: number;      // 0-100 bezier curve quality
    visualBalance: number;       // 0-100 visual weight distribution
    complexity: number;          // 0-100 optimal complexity score
    goldenRatioAdherence: number;// 0-100 golden ratio usage
    uniqueness: number;          // 0-100 distinctiveness
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

export interface StarburstParams extends BaseParameters {
    armCount: number;              // 6-16 arms
    armLength: number;             // 20-50
    armWidth: number;              // 3-15
    armCurvature: number;          // 0-1 (bezier curve intensity)
    armTaper: number;              // 0.2-0.8 (taper ratio)
    centerRadius: number;          // 0-15
    rotationalSymmetry: boolean;
    spiralAmount: number;          // 0-0.5
    armBulge: number;              // 0-0.5
    organicWobble: number;         // 0-1
}

export interface FramedLetterParams extends BaseParameters {
    frameShape: 'square' | 'circle' | 'rounded' | 'hexagon' | 'octagon';
    frameThickness: number;        // 2-15
    letterScale: number;           // 0.4-0.9
    letterWeight: number;          // 300-800
    cutoutStyle: 'none' | 'partial' | 'full';
    cutoutDepth: number;           // 0-1
    innerPadding: number;          // 5-25
    frameRotation: number;         // 0-45
}

export interface MotionLinesParams extends BaseParameters {
    lineCount: number;             // 3-8
    lineThickness: number;         // 2-10
    lineWaveAmplitude: number;     // 0-15
    lineSpacing: number;           // 6-20
    velocityEffect: number;        // 0-1
    staggerOffset: number;         // 0-20
    taperDirection: 'left' | 'right' | 'both' | 'none';
}

export interface GradientBarsParams extends BaseParameters {
    barCount: number;              // 2-6
    barWidth: number;              // 8-25
    barAngle: number;              // -45 to 45
    barGap: number;                // 3-15
    barRoundness: number;          // 0-1
    gradientIntensity: number;     // 0-1
    staggerAmount: number;         // 0-30
}

export interface PerfectTriangleParams extends BaseParameters {
    triangleType: 'equilateral' | 'isoceles' | 'right';
    triangleSize: number;          // 60-90 (% of viewbox)
    rotation: number;              // 0-360
    fillStyle: 'solid' | 'gradient' | 'outline';
    outlineWidth: number;          // 2-10
    innerCutout: boolean;
    cutoutScale: number;           // 0.3-0.7
}

export interface CircleOverlapParams extends BaseParameters {
    circleCount: number;           // 2-5
    circleSize: number;            // 20-40
    overlapAmount: number;         // 0.2-0.6
    arrangementType: 'horizontal' | 'vertical' | 'diagonal' | 'cluster';
    opacityVariation: number;      // 0-0.5
    sizeVariation: number;         // 0-0.3
}

export interface DepthGeometryParams extends BaseParameters {
    shapeType: 'cube' | 'prism' | 'pyramid' | 'abstract';
    depthLayers: number;           // 2-5
    depthOffset: number;           // 3-15
    perspectiveAngle: number;      // -30 to 30
    shadowIntensity: number;       // 0-1
    lightDirection: number;        // 0-360
}

export interface LetterSwooshParams extends BaseParameters {
    swooshCount: number;           // 1-3
    swooshWidth: number;           // 3-15
    swooshCurvature: number;       // 0.3-0.9
    swooshPlacement: 'under' | 'through' | 'around';
    letterWeight: number;          // 400-700
    letterScale: number;           // 0.5-0.8
    dynamicTaper: boolean;
}

export interface OrbitalRingsParams extends BaseParameters {
    ringCount: number;             // 2-4
    ringThickness: number;         // 2-8
    orbitAngle: number;            // 0-60
    orbitEccentricity: number;     // 0-0.5
    intersectionStyle: 'weave' | 'overlap' | 'break';
    rotationOffset: number;        // 0-120
}

export interface FlowGradientParams extends BaseParameters {
    flowDirection: 'horizontal' | 'vertical' | 'diagonal' | 'radial';
    waveCount: number;             // 1-4
    waveAmplitude: number;         // 10-40
    organicDistortion: number;     // 0-1
    gradientStops: number;         // 2-5
    blobFactor: number;            // 0-1
}

export interface IsometricCubeParams extends BaseParameters {
    cubeStyle: 'solid' | 'wireframe' | 'partial';
    cubeAngle: number;             // 25-35 (isometric angle)
    faceVisibility: [boolean, boolean, boolean]; // top, left, right
    letterPlacement: 'front' | 'side' | 'integrated';
    extrusionDepth: number;        // 10-30
    letterScale: number;           // 0.4-0.7
}

export interface AbstractMarkParams extends BaseParameters {
    angularComplexity: number;     // 3-8 points
    sharpness: number;             // 0-1
    asymmetryAmount: number;       // 0-0.5
    innerNegativeSpace: boolean;
    strokeOnly: boolean;
    dynamicThickness: number;      // 0-1
}

export interface MonogramBlendParams extends BaseParameters {
    blendStyle: 'overlap' | 'interlock' | 'merge' | 'stack';
    letterSpacing: number;         // -20 to 20
    shareStrokes: boolean;
    strokeModulation: number;      // 0-1
    letterWeights: [number, number]; // weights for each letter
    verticalOffset: number;        // -15 to 15
}

// Union type for all parameter types
export type AlgorithmParams =
    | StarburstParams
    | FramedLetterParams
    | MotionLinesParams
    | GradientBarsParams
    | PerfectTriangleParams
    | CircleOverlapParams
    | DepthGeometryParams
    | LetterSwooshParams
    | OrbitalRingsParams
    | FlowGradientParams
    | IsometricCubeParams
    | AbstractMarkParams
    | MonogramBlendParams;

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
    variations?: number;
    seed?: string;
    customParams?: Partial<BaseParameters>;
    minQualityScore?: number;      // Default 80
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

export interface LogoStorageState {
    generatedHashes: Set<string>;
    logoRecords: Map<string, LogoHashRecord>;
    lastUpdated: number;
}
