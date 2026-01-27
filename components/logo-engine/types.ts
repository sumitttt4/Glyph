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
    // === LETTERMARKS (stylized initials with cuts/negative space) ===
    | 'framed-letter'    // Notion - letter in geometric frame with cutouts
    | 'letter-swoosh'    // Arc - letter with dynamic curved accent
    | 'monogram-blend'   // Intertwined letters with shared strokes
    | 'letter-gradient'  // Stylized letter with gradient treatment
    | 'box-logo'         // Bold boxed lettermark

    // === GEOMETRIC ABSTRACTS (Stripe bars, Linear lines, Vercel triangle) ===
    | 'gradient-bars'    // Stripe - parallel diagonal bars with gradient
    | 'motion-lines'     // Linear/Framer - stacked horizontal lines
    | 'perfect-triangle' // Vercel - single perfect geometric triangle
    | 'depth-geometry'   // Raycast - abstract with depth/shadow
    | 'isometric-cube'   // Pitch - 3D isometric letterform
    | 'hexagon-tech'     // Tech/blockchain - nested hexagonal pattern
    | 'stacked-lines'    // Linear-inspired stacked horizontal lines

    // === STARBURST/RADIAL (like Claude asterisk) ===
    | 'starburst'        // Claude/Anthropic - curved organic arms with rotational symmetry

    // === OVERLAPPING SHAPES (like Figma, Mastercard) ===
    | 'circle-overlap'   // Figma - overlapping transparent circles
    | 'orbital-rings'    // Planetscale - intersecting orbital paths
    | 'flow-gradient'    // Loom - flowing gradient organic shape

    // === LINE ART (continuous stroke marks) ===
    | 'abstract-mark'    // Supabase - abstract angular continuous mark
    | 'infinity-loop'    // Meta - infinite loop ribbon
    | 'maze-pattern'     // Abstract labyrinth line pattern
    | 'fingerprint-id'   // Abstract spiral line pattern

    // === ABSTRACT PATTERNS ===
    | 'orbital-paths'    // Abstract orbital ring pattern
    | 'dna-helix';       // Abstract double helix pattern

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

// ============================================
// NEW SYMBOL ALGORITHM PARAMETERS (20)
// ============================================

// ============================================
// ABSTRACT ALGORITHM PARAMETERS
// ============================================

export interface InfinityLoopParams extends BaseParameters {
    loopWidth: number;             // 30-60
    loopHeight: number;            // 20-40
    crossoverAngle: number;        // 20-70
    strokeTaper: number;           // 0.3-0.9
    thickness: number;             // 3-12
    twistAmount: number;           // 0-1
    gradientFlow: boolean;
    innerGap: number;              // 2-10
    smoothness: number;            // 0.5-1
    ribbonStyle: boolean;
}

export interface HexagonTechParams extends BaseParameters {
    innerShape: 'none' | 'hexagon' | 'circle' | 'letter';
    honeycombStyle: boolean;
    borderThickness: number;       // 2-10
    cornerCut: number;             // 0-1
    cellCount: number;             // 1-7
    connectionStyle: 'none' | 'lines' | 'nodes';
    techPattern: 'solid' | 'circuit' | 'grid';
    glowEffect: boolean;
    rotation: number;              // 0-60
    nestingLevel: number;          // 0-3
}

// ============================================
// WORDMARK ALGORITHM PARAMETERS
// ============================================

export interface LetterGradientParams extends BaseParameters {
    letterSpacing: number;         // -10 to 20
    colorStops: number;            // 2-6
    fontWeight: number | string;   // 300-900 or 'bold'/'normal'
    letterStyle: 'sans' | 'serif' | 'rounded' | 'mono' | 'geometric' | 'bold' | 'light';
    gradientDirection?: 'horizontal' | 'vertical' | 'diagonal' | 'per-letter';
    bounceEffect?: boolean;
    shadowDrop?: boolean;
    letterRotation?: number;       // -15 to 15
    scaleVariation?: number;       // 0-0.3
    colorfulness?: number;         // 0-1
    letterCount?: number | string; // 1-5
    multiColor: boolean;
    hueShift: number;              // 0-60
    gradientAngle: number;         // 0-360
    shadowEffect: boolean;
    outlineOnly: boolean;
    saturation?: number;           // 0-1
}

export interface BoxLogoParams extends BaseParameters {
    boxPadding: number;            // 5-25
    cornerRadius: number;          // 0-20
    textWeight: number | string;   // 400-900 or 'bold'/'heavy'
    borderThickness: number;       // 2-10
    fillStyle: 'solid' | 'outline' | 'both';
    textTransform?: 'uppercase' | 'lowercase' | 'capitalize';
    letterSpacing: number;         // -5 to 20
    stackedLayout?: boolean;
    shadowOffset?: number;         // 0-10
    glitchEffect?: boolean;
    textSize?: number | string;    // 14-28
    invertColors: boolean;
    shadowDepth: number;           // 0-10
    doubleBox: boolean;
}

// ============================================
// ABSTRACT PATTERN ALGORITHM PARAMETERS
// ============================================

export interface MazePatternParams extends BaseParameters {
    pathWidth: number;             // 3-10
    cornerStyle: 'square' | 'rounded' | 'sharp' | 'beveled';
    centerSymbol: 'none' | 'dot' | 'star' | 'letter' | 'square';
    wallThickness: number;         // 1-5
    complexity: number;            // 0-1
    mazeStyle?: 'rectangular' | 'circular' | 'hexagonal';
    deadEnds?: boolean;
    pathHighlight?: boolean;
    solutionPath?: boolean;
    borderThickness?: number;      // 0-5
    symmetrical: boolean;
    openings: number;              // 1-4
    gradientWalls: boolean;
    glowPath: boolean;
    rotated?: boolean;
}

export interface FingerprintIdParams extends BaseParameters {
    ridgeCount: number;            // 20-50
    spiralTightness: number;       // 0-1
    coreStyle: 'loop' | 'whorl' | 'arch';
    deltaPat?: boolean;
    deltaPattern: boolean;         // Alias for deltaPat
    ridgeThickness?: number;       // 1-4
    ridgeWidth: number;            // 1-4 (alias)
    gapVariation?: number;         // 0-1
    breakPattern?: number;         // 0-1
    breakCount: number;            // 0-3
    glowEffect: boolean;
    scanLine: boolean;
    dataOverlay?: boolean;
    centerOffset: number;          // 0-0.3
    ridgeSpacing: number;          // 2-6
}

export interface DnaHelixParams extends BaseParameters {
    helixTurns: number;            // 1-4
    baseSpacing: number;           // 5-15
    strandWidth: number;           // 2-8
    bondStyle: 'line' | 'lines' | 'dots' | 'blocks' | 'bars';
    helixAngle?: number;           // 15-45
    basePairs?: number;            // 4-12 per turn
    colorCoded?: boolean;
    glowEffect: boolean;
    moleculeDetail?: boolean;
    perspectiveDepth?: number;     // 0-1
    helixRadius: number;           // 12-25
    verticalStretch: number;       // 0.8-1.2
    bondCount: number;             // 4-10
    gradientStrands: boolean;
    rotation: number;              // 0-360
}

export interface OrbitalPathsParams extends BaseParameters {
    orbitCount: number;            // 2-5
    planetSize: number;            // 5-20
    ringTilt: number;              // 0-60
    trailEffect: 'none' | 'fade' | 'solid';
    orbitSpacing: number;          // 10-30
    planetPositions?: number[];    // Angles 0-360
    ringThickness?: number;        // 1-5
    centerBody?: boolean;
    centerSize?: number;           // 10-30
    dashPattern?: boolean;
    planetCount: number;           // 1-3
    ringOpacity: number;           // 0.4-0.8
    centerGlow: boolean;
    ellipseRatio: number;          // 0.4-0.8
    rotationAngle: number;         // 0-360
}

// Stacked Lines Parameters
export interface StackedLinesParams extends BaseParameters {
    lineCount: number;             // 3-8 lines
    lineHeight: number;            // 4-12
    lineSpacing: number;           // 2-8
    cornerRadius: number;          // 0-6 (for rounded ends)
    staggerOffset: number;         // 0-20
    taperAmount: number;           // 0-1
    waveAmplitude: number;         // 0-15
    gradientIntensity: number;     // 0-1
    lineVariation: number;         // 0-1 (length variation)
    alignment: 'left' | 'center' | 'right' | 'justified';
}

/**
 * Union type for all ABSTRACT algorithm parameters
 * Only includes professional-grade abstract mark generators
 */
export type AlgorithmParams =
    // === LETTERMARKS ===
    | FramedLetterParams       // Notion-style letter in frame
    | LetterSwooshParams       // Arc-style letter with swoosh
    | MonogramBlendParams      // Intertwined letters
    | LetterGradientParams     // Gradient lettermark
    | BoxLogoParams            // Boxed lettermark

    // === GEOMETRIC ABSTRACTS ===
    | GradientBarsParams       // Stripe-style bars
    | MotionLinesParams        // Linear-style lines
    | PerfectTriangleParams    // Vercel-style triangle
    | DepthGeometryParams      // Abstract with depth
    | IsometricCubeParams      // 3D isometric
    | HexagonTechParams        // Tech hexagon pattern
    | StackedLinesParams       // Stacked horizontal lines

    // === STARBURST/RADIAL ===
    | StarburstParams          // Claude-style radial arms

    // === OVERLAPPING SHAPES ===
    | CircleOverlapParams      // Figma-style circles
    | OrbitalRingsParams       // Intersecting rings
    | FlowGradientParams       // Flowing organic shape

    // === LINE ART/CONTINUOUS ===
    | AbstractMarkParams       // Abstract angular mark
    | InfinityLoopParams       // Meta-style infinity
    | MazePatternParams        // Abstract maze lines
    | FingerprintIdParams      // Abstract spiral lines

    // === ABSTRACT PATTERNS ===
    | OrbitalPathsParams       // Abstract orbital pattern
    | DnaHelixParams;          // Abstract helix pattern

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
