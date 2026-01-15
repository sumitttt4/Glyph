/**
 * Parametric Logo Engine v4 - Type Definitions
 *
 * Professional parametric logo generation with infinite unique outputs
 * Each algorithm has 20+ adjustable parameters
 */

// ============================================
// CORE ALGORITHM TYPES
// ============================================

export type LogoAlgorithm =
    | 'parallel-bars'        // Stripe-style gradient bars
    | 'stacked-lines'        // Linear-style motion lines
    | 'letterform-cutout'    // Notion-style letter in frame
    | 'sparkle-asterisk'     // Claude-style curved arms
    | 'overlapping-shapes'   // Figma-style transparency
    | 'arc-swoosh'           // Nike-style dynamic curves
    | 'depth-mark'           // Raycast-style 3D depth
    | 'negative-space'       // FedEx-style hidden forms
    | 'interlocking-forms'   // Olympic-style linked shapes
    | 'abstract-monogram';   // Modern letterform abstraction

export type LogoAesthetic =
    | 'tech-minimal'
    | 'friendly-rounded'
    | 'bold-geometric'
    | 'elegant-refined'
    | 'futuristic-gradient'
    | 'organic-flowing';

export type IndustryCategory =
    | 'technology'
    | 'finance'
    | 'healthcare'
    | 'creative'
    | 'ecommerce'
    | 'education'
    | 'sustainability'
    | 'general';

// ============================================
// PARAMETRIC CONFIGURATION (20+ params per algo)
// ============================================

export interface BaseParameters {
    // Core
    strokeWidth: number;           // 1-10
    strokeWidthVariance: number;   // 0-1, adds randomness

    // Angles & Rotation
    baseAngle: number;             // 0-360
    angleVariance: number;         // 0-90
    rotationOffset: number;        // 0-360

    // Curves & Tension
    curveTension: number;          // 0-1, bezier control
    curveAmplitude: number;        // 0-50
    curveFrequency: number;        // 1-10

    // Segments & Counts
    segmentCount: number;          // 2-20
    segmentSpacing: number;        // 0-50
    segmentLengthRatio: number;    // 0.1-1

    // Spacing & Layout
    horizontalSpacing: number;     // 0-50
    verticalSpacing: number;       // 0-50
    paddingRatio: number;          // 0.05-0.3

    // Scale & Size
    scaleX: number;                // 0.5-2
    scaleY: number;                // 0.5-2
    sizeVariance: number;          // 0-0.5

    // Corner & Radius
    cornerRadius: number;          // 0-50
    cornerRadiusVariance: number;  // 0-1

    // Opacity & Layers
    baseOpacity: number;           // 0.1-1
    opacityFalloff: number;        // 0-1
    layerCount: number;            // 1-10

    // Noise & Variation
    noiseAmount: number;           // 0-1
    noiseFrequency: number;        // 0.1-5
    jitterAmount: number;          // 0-10
}

export interface ParallelBarsParams extends BaseParameters {
    barCount: number;              // 2-8
    barWidthRatio: number;         // 0.3-0.95
    barSkew: number;               // -30 to 30
    barGap: number;                // 2-20
    barRoundness: number;          // 0-1
    gradientAngle: number;         // 0-180
    gradientSpread: number;        // 0-1
    staggerOffset: number;         // 0-30
    taperAmount: number;           // 0-1
}

export interface StackedLinesParams extends BaseParameters {
    lineCount: number;             // 3-12
    lineThickness: number;         // 1-8
    lineWaveAmplitude: number;     // 0-20
    lineWaveFrequency: number;     // 0.5-4
    lineSpacing: number;           // 4-20
    motionBlur: number;            // 0-1
    velocityVariance: number;      // 0-1
    parallelOffset: number;        // 0-15
}

export interface LetterformCutoutParams extends BaseParameters {
    frameShape: 'square' | 'circle' | 'rounded' | 'hexagon';
    frameThickness: number;        // 2-15
    letterScale: number;           // 0.4-0.9
    letterWeight: number;          // 1-9
    cutoutDepth: number;           // 0-1
    shadowOffset: number;          // 0-10
    innerPadding: number;          // 5-25
    frameRotation: number;         // 0-45
}

export interface SparkleAsteriskParams extends BaseParameters {
    armCount: number;              // 3-12
    armLength: number;             // 20-45
    armWidth: number;              // 2-12
    armCurvature: number;          // 0-1
    armTaper: number;              // 0-1
    centerRadius: number;          // 0-15
    rotationalSymmetry: boolean;
    spiralAmount: number;          // 0-1
    armBulge: number;              // 0-1
}

export interface OverlappingShapesParams extends BaseParameters {
    shapeCount: number;            // 2-6
    shapeType: 'circle' | 'ellipse' | 'organic';
    overlapAmount: number;         // 0.2-0.8
    sizeProgression: number;       // 0.5-1.5
    blendMode: 'multiply' | 'screen' | 'overlay';
    shapePadding: number;          // 5-30
    rotationSpread: number;        // 0-180
    aspectRatio: number;           // 0.5-2
}

export interface ArcSwooshParams extends BaseParameters {
    swooshCount: number;           // 1-5
    swooshWidth: number;           // 3-20
    swooshLength: number;          // 0.3-1
    swooshCurvature: number;       // 0.2-0.9
    startAngle: number;            // 0-360
    sweepAngle: number;            // 45-270
    taperStart: number;            // 0-1
    taperEnd: number;              // 0-1
    dynamicWidth: boolean;
}

export interface DepthMarkParams extends BaseParameters {
    depthLayers: number;           // 2-6
    depthOffset: number;           // 2-15
    depthAngle: number;            // -45 to 45
    perspectiveStrength: number;   // 0-1
    shadowIntensity: number;       // 0-1
    extrusionDepth: number;        // 5-30
    lightDirection: number;        // 0-360
    surfaceDetail: number;         // 0-1
}

export interface NegativeSpaceParams extends BaseParameters {
    positiveShape: 'triangle' | 'arrow' | 'chevron' | 'custom';
    negativeReveal: number;        // 0-1
    balanceRatio: number;          // 0.3-0.7
    sharpness: number;             // 0-1
    innerContrast: number;         // 0-1
    boundaryBlur: number;          // 0-10
    dualTone: boolean;
    inversionPoint: number;        // 0-1
}

export interface InterlockingFormsParams extends BaseParameters {
    formCount: number;             // 2-5
    formShape: 'ring' | 'link' | 'chain' | 'weave';
    interlockDepth: number;        // 0.2-0.8
    formThickness: number;         // 3-15
    gapSize: number;               // 1-10
    arrangement: 'linear' | 'circular' | 'stacked';
    overlapOrder: number[];
    connectionStrength: number;    // 0-1
}

export interface AbstractMonogramParams extends BaseParameters {
    letterStyle: 'geometric' | 'organic' | 'stencil' | 'ribbon';
    letterConnections: boolean;
    strokeModulation: number;      // 0-1
    terminalStyle: 'round' | 'square' | 'pointed';
    ligatureStrength: number;      // 0-1
    deconstructLevel: number;      // 0-1
    pathSimplification: number;    // 0-1
    experimentalCuts: number;      // 0-1
}

// Union type for all parameter types
export type AlgorithmParams =
    | ParallelBarsParams
    | StackedLinesParams
    | LetterformCutoutParams
    | SparkleAsteriskParams
    | OverlappingShapesParams
    | ArcSwooshParams
    | DepthMarkParams
    | NegativeSpaceParams
    | InterlockingFormsParams
    | AbstractMonogramParams;

// ============================================
// INPUT PARAMETERS
// ============================================

export interface LogoGenerationParams {
    brandName: string;
    tagline?: string;
    industry?: IndustryCategory;
    aesthetic?: LogoAesthetic;
    primaryColor: string;
    accentColor?: string;
    algorithm?: LogoAlgorithm;
    variations?: number;
    seed?: string;
    customParams?: Partial<BaseParameters>;
}

// ============================================
// OUTPUT TYPES
// ============================================

export interface GeneratedLogo {
    id: string;
    hash: string;                  // Unique deterministic hash
    algorithm: LogoAlgorithm;
    variant: number;
    svg: string;
    viewBox: string;
    meta: LogoMetadata;
    params: AlgorithmParams;       // Full parameters used
    animation?: LogoAnimation;
}

export interface LogoMetadata {
    brandName: string;
    generatedAt: number;
    seed: string;
    geometry: {
        usesGoldenRatio: boolean;
        gridBased: boolean;
        bezierCurves: boolean;
        symmetry: 'none' | 'horizontal' | 'vertical' | 'radial' | 'bilateral';
        pathCount: number;
        complexity: number;        // 0-1 score
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
    v: string;                     // Version
    fr: number;                    // Frame rate
    ip: number;                    // In point
    op: number;                    // Out point
    w: number;                     // Width
    h: number;                     // Height
    layers: LottieLayer[];
}

export interface LottieLayer {
    ty: number;                    // Type (4 = shape)
    nm: string;                    // Name
    ks: {
        o: LottieKeyframe;         // Opacity
        r: LottieKeyframe;         // Rotation
        p: LottieKeyframe;         // Position
        s: LottieKeyframe;         // Scale
    };
    shapes?: LottieShape[];
}

export interface LottieKeyframe {
    a: 0 | 1;                      // Animated
    k: number | number[] | LottieKeyframeValue[];
}

export interface LottieKeyframeValue {
    t: number;                     // Time
    s: number[];                   // Start value
    e?: number[];                  // End value
    i?: { x: number[]; y: number[] };  // In tangent
    o?: { x: number[]; y: number[] };  // Out tangent
}

export interface LottieShape {
    ty: string;                    // Type ('gr', 'sh', 'fl', 'st', 'tr')
    nm: string;
    it?: LottieShape[];
    ks?: {
        a: 0 | 1;
        k: string | { i: number[][]; o: number[][]; v: number[][]; c: boolean };
    };
    c?: { a: 0 | 1; k: number[] }; // Color
    o?: LottieKeyframe;            // Opacity
    w?: LottieKeyframe;            // Width
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

export interface Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
    rx?: number;
    ry?: number;
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

// ============================================
// GRID SYSTEM
// ============================================

export interface GridConfig {
    size: number;
    columns: number;
    rows: number;
    margin: number;
    gap: number;
}

export interface GoldenRatioGrid extends GridConfig {
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
    svg?: string;                  // Optional cached SVG
}

export interface LogoStorageState {
    generatedHashes: Set<string>;
    logoRecords: Map<string, LogoHashRecord>;
    lastUpdated: number;
}
