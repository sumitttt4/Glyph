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
    // Existing algorithms (13)
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
    | 'monogram-blend'   // Two letters intertwined
    // New Symbol Algorithms (20)
    | 'sound-waves'      // Spotify - flowing audio waveforms
    | 'page-icon'        // Notion - document/page with sidebar
    | 'chat-bubble'      // Slack/Discord - speech bubble stack
    | 'infinity-loop'    // Meta - infinite loop/ribbon
    | 'arrow-mark'       // Amazon/FedEx - dynamic arrow
    | 'shield-badge'     // Security apps - protective shield
    | 'crown-mark'       // Premium brands - royal crown
    | 'lightning-bolt'   // Energy/speed - electric bolt
    | 'mountain-peak'    // Outdoor brands - mountain silhouette
    | 'wave-flow'        // Water/fluid - ocean wave
    | 'leaf-organic'     // Eco/nature - organic leaf
    | 'eye-vision'       // AI/surveillance - stylized eye
    | 'heart-love'       // Social/dating - heart symbol
    | 'star-mark'        // Rating/awards - star burst
    | 'moon-phase'       // Night/mystery - crescent moon
    | 'gear-cog'         // Engineering - mechanical gear
    | 'lock-secure'      // Security - padlock
    | 'cloud-soft'       // Cloud/hosting - soft cloud
    | 'diamond-gem'      // Luxury - faceted diamond
    | 'hexagon-tech'     // Tech/blockchain - hexagonal pattern
    // New Wordmark Algorithms (4)
    | 'letter-gradient'  // Google - colorful letter gradient
    | 'letter-striped'   // IBM - horizontal stripes through letters
    | 'letter-script'    // Coca-Cola - flowing script style
    | 'box-logo'         // Supreme - boxed logo text
    // New Advanced/3D Algorithms (8)
    | 'circular-emblem'  // Starbucks - circular badge/seal
    | 'ribbon-banner'    // Vintage - flowing ribbon
    | 'cube-3d'          // Pitch - 3D extruded cube
    | 'origami-fold'     // Paper craft - folded paper
    | 'maze-pattern'     // Complexity - labyrinth pattern
    | 'fingerprint-id'   // Identity - spiral fingerprint
    | 'dna-helix'        // Biotech - double helix
    | 'orbital-paths'    // Planetscale - planetary orbits
    // Stacked Lines Algorithm
    | 'stacked-lines';   // Linear-inspired stacked horizontal lines

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

export interface SoundWavesParams extends BaseParameters {
    waveCount: number;             // 3-8
    amplitude: number;             // 10-40
    frequency: number;             // 0.5-2.0
    decay: number;                 // 0.7-1.0
    spacing: number;               // 8-24
    strokeTaper: number;           // 0.3-0.9
    phaseOffset: number;           // 0-360
    waveStyle: 'sine' | 'sawtooth' | 'square' | 'organic';
    symmetry: 'bilateral' | 'radial' | 'none';
    peakRounding: number;          // 0-1
}

export interface PageIconParams extends BaseParameters {
    pageCornerRadius: number;      // 0-15
    sidebarWidth: number;          // 10-25
    pageLines: number;             // 2-6
    foldAngle: number;             // 0-45
    foldSize: number;              // 5-20
    dotPattern: boolean;
    lineSpacing: number;           // 4-12
    sidebarStyle: 'solid' | 'dots' | 'lines';
    pageAspect: number;            // 0.6-0.9
    shadowDepth: number;           // 0-10
}

export interface ChatBubbleParams extends BaseParameters {
    bubbleShape: 'round' | 'square' | 'organic';
    tailPosition: 'bottom-left' | 'bottom-right' | 'left' | 'right';
    borderRadius: number;          // 5-30
    stackCount: number;            // 1-3
    stackOffset: number;           // 5-20
    tailSize: number;              // 5-15
    bubbleAspect: number;          // 0.8-1.2
    innerDots: boolean;
    dotCount: number;              // 2-4
    layerOpacity: number;          // 0.3-0.8
}

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

export interface ArrowMarkParams extends BaseParameters {
    arrowCurve: number;            // 0-1
    headAngle: number;             // 30-90
    tailWidth: number;             // 3-15
    direction: 'right' | 'up' | 'diagonal' | 'circular' | 'up-right';
    headStyle?: 'sharp' | 'rounded' | 'open';
    bodyTaper?: number;            // 0-1
    dynamicCurve?: number;         // 0-1
    smileEffect?: number;          // 0-1 (Amazon smile)
    strokeCap?: 'round' | 'square';
    doubleArrow: boolean;
    arrowLength: number;           // 30-60
    headSize: number;              // 10-25
    curved: boolean;
    motionLines?: number;
    strokeStyle?: string | boolean;
}

export interface ShieldBadgeParams extends BaseParameters {
    shieldShape: 'classic' | 'modern' | 'rounded' | 'pointed';
    innerPattern: 'none' | 'cross' | 'star' | 'chevron';
    borderWidth: number;           // 2-10
    crestStyle: 'flat' | 'curved' | 'pointed';
    innerPadding: number;          // 5-20
    divisionStyle: 'none' | 'quarters' | 'horizontal' | 'vertical';
    accentBand: boolean;
    bandPosition: number;          // 0.3-0.7
    embossEffect: number;          // 0-1
    cornerDetail: boolean;
}

export interface CrownMarkParams extends BaseParameters {
    pointCount: number;            // 3-7
    jewelStyle: 'none' | 'round' | 'diamond' | 'star' | 'circles' | 'diamonds' | 'mixed';
    baseWidth: number;             // 40-70
    archHeight: number;            // 10-30
    pointHeight: number;           // 15-35
    bandHeight?: number;           // 5-15
    jewelSize?: number;            // 3-10
    velvetFill?: boolean;
    ornateLevel?: number;          // 0-1
    symmetryPerfect?: boolean;
    crownWidth: number;            // 40-70
    rimThickness: number;          // 2-8
    baseDecoration: boolean;
    crossOnCenter?: boolean;
}

export interface LightningBoltParams extends BaseParameters {
    boltAngles: number[];          // Array of angle changes
    branchCount: number;           // 0-3
    glowAmount: number;            // 0-1
    zigzagDepth: number;           // 5-20
    boltWidth: number;             // 5-20
    taperAmount?: number;          // 0-1
    electricEffect?: boolean;
    branchScale?: number;          // 0.3-0.7
    sharpness: number;             // 0-1
    energyGlow?: number;           // 0-1
    electricGlow: boolean;
    secondaryBolt: boolean;
    energyLines: number;           // 0-5
    rotation?: number;
}

export interface MountainPeakParams extends BaseParameters {
    peakCount: number;             // 1-5
    snowLine: number;              // 0-1
    ridgeStyle: 'sharp' | 'rounded' | 'jagged' | 'smooth' | 'stepped';
    baseWidth: number;             // 60-90
    peakHeights?: number[];        // Relative heights
    layerCount: number;            // 1-3
    sunMoon?: 'none' | 'sun' | 'moon';
    treeLine: boolean;
    reflectionEffect?: boolean;
    atmosphericPerspective?: number; // 0-1
    peakSharpness: number;         // 0-1
    mainPeakHeight: number;        // 30-50
    sunBehind: boolean;
    fogEffect: boolean;
}

export interface WaveFlowParams extends BaseParameters {
    waveCount: number;             // 2-5
    amplitude: number;             // 10-30
    flowDirection: 'horizontal' | 'vertical' | 'circular' | 'diagonal';
    foamAmount: number;            // 0-1
    crestStyle: 'smooth' | 'curled' | 'breaking' | 'sharp';
    layerOpacity: number;          // 0.3-0.8
    wavelength: number;            // 20-50
    phaseShift: number;            // 0-1
    splashEffect?: boolean;
    depthGradient?: boolean;
    droplets?: number;
    gradient?: boolean;
}

export interface LeafOrganicParams extends BaseParameters {
    leafShape: 'oval' | 'pointed' | 'heart' | 'maple';
    veinPattern: 'none' | 'central' | 'branching' | 'parallel';
    stemCurve: number;             // 0-1
    serrationCount: number;        // 0-12
    leafCurl: number;              // 0-1
    stemLength: number;            // 10-30
    veinDepth: number;             // 0-1
    asymmetry: number;             // 0-0.3
    multiLeaf: number;             // 1-3
    dropShadow: boolean;
}

export interface EyeVisionParams extends BaseParameters {
    pupilSize: number;             // 0.2-0.5
    irisPattern: 'solid' | 'radial' | 'concentric' | 'organic' | 'gradient' | 'rings' | 'tech';
    lashStyle: 'none' | 'simple' | 'detailed' | 'full' | 'minimal';
    glintPosition: number;         // 0-360 angle
    eyeShape?: 'almond' | 'round' | 'cat';
    irisRings?: number;            // 1-4
    pupilShape?: 'round' | 'vertical' | 'horizontal';
    glintCount?: number;           // 1-3
    lidThickness?: number;         // 1-5
    expressiveness?: number;       // 0-1
    eyeWidth: number;              // 30-50
    eyeHeight: number;             // 15-30
    irisSize: number;              // 0.5-0.8
    glowEffect: boolean;
    scanLines: boolean;
    techOverlay: boolean;
}

export interface HeartLoveParams extends BaseParameters {
    heartStyle: 'classic' | 'modern' | 'geometric' | 'organic';
    curveDepth: number;            // 0.3-0.8
    splitAmount: number;           // 0-0.3
    pulseEffect: boolean;
    heartRotation: number;         // -30 to 30
    innerHeart: boolean;
    innerScale: number;            // 0.3-0.7
    strokeOnly: boolean;
    heartWidth: number;            // 0.8-1.2 aspect
    tipSharpness: number;          // 0-1
}

export interface StarMarkParams extends BaseParameters {
    pointCount: number;            // 4-12
    innerRadius: number;           // 0.2-0.6
    rotationOffset: number;        // 0-360
    rayStyle: 'sharp' | 'rounded' | 'beveled' | 'pointed' | 'split';
    pointLength?: number;          // 0.3-0.8
    alternatePoints?: boolean;
    innerStar: boolean;
    twinkleEffect?: boolean;
    threeD?: boolean;
    facetShading?: number;         // 0-1
    outerRadius: number;           // 25-40
    pointSharpness: number;        // 0-1
    glowRays: boolean;
    dimensionalEffect: boolean;
    innerScale: number;            // 0.3-0.7
}

export interface MoonPhaseParams extends BaseParameters {
    phaseAmount: number;           // 0-1 (0=new, 0.5=full, 1=new)
    craterStyle: 'none' | 'subtle' | 'detailed';
    glowRadius: number;            // 0-20
    crescentWidth: number;         // 0.1-0.5
    orientation?: number;          // 0-360
    starCount: number;             // 0-5
    faceDetail?: 'none' | 'simple' | 'detailed';
    auraEffect?: boolean;
    surfaceTexture: number | boolean; // 0-1
    shadowSoftness?: number;       // 0-1
    moonRadius: number;            // 25-40
    haloEffect: boolean;
    tilt?: number;
    innerShadow?: boolean;
}

export interface GearCogParams extends BaseParameters {
    toothCount: number;            // 6-20
    toothDepth: number;            // 5-20
    hubSize: number;               // 0.2-0.5
    spokeStyle: 'none' | 'solid' | 'spokes' | 'holes' | 'lines' | 'curved';
    toothShape: 'square' | 'rounded' | 'pointed' | 'squared';
    hubHole?: boolean;
    holeSize?: number | boolean | string; // 0.1-0.3
    bevelEffect: number | boolean;  // 0-1
    secondaryGear?: boolean;
    meshAngle?: number;            // 0-360
    outerRadius: number;           // 30-45
    toothWidth: number;            // 5-15
    innerRing: boolean;
    spokeCount: number;            // 3-8
}

export interface LockSecureParams extends BaseParameters {
    shackleWidth: number;          // 0.4-0.8
    bodyShape: 'square' | 'rounded' | 'circular' | 'squared' | 'shield';
    keyholeStyle: 'classic' | 'modern' | 'digital' | 'none' | 'circle';
    boltCount: number;             // 0-4
    shackleThickness?: number;     // 3-10
    bodyHeight?: number;           // 0.6-1.0
    lockState?: 'locked' | 'unlocked';
    shineEffect?: boolean;
    brandingArea?: boolean;
    securityLevel?: number;        // 0-1 (visual complexity)
    shackleHeight: number;         // 15-30
    lockClosed: boolean;
    bodyWidth: number;             // 25-40
    metallic: boolean;
    glowEffect: boolean;
    reinforced: boolean;
}

export interface CloudSoftParams extends BaseParameters {
    puffCount: number;             // 3-7
    baseWidth: number;             // 50-80
    baseHeight: number;            // 25-45
    shadowDepth: number;           // 0-1
    layerCount: number;            // 1-3
    puffSize?: number[];           // Relative sizes
    fluffiness: number;            // 0-1
    rainEffect?: boolean;
    sunPeek: boolean;
    lightningBolt?: boolean;
    atmosphereGlow?: number;       // 0-1
    puffVariation: number;         // 0-1
    softness: number;              // 0.5-1
    rainDrops: number;             // 0-10
}

export interface DiamondGemParams extends BaseParameters {
    facetCount: number;            // 4-12
    brillianceCut: 'round' | 'princess' | 'emerald' | 'oval' | 'brilliant';
    tableSize: number;             // 0.3-0.6
    pavilionAngle: number;         // 30-50
    crownHeight: number;           // 0.1-0.3
    girdleThickness?: number;      // 1-5
    sparkleEffect?: boolean;
    colorDispersion?: boolean;
    facetShading?: number;         // 0-1
    outline?: boolean;
    lightDirection: number;        // 0-360
    sparkleCount: number;          // 0-6
    facetDepth: number;            // 0.2-0.5
    girdle?: number;
    symmetryPerfection?: number;
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
// NEW WORDMARK ALGORITHM PARAMETERS (4)
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

export interface LetterStripedParams extends BaseParameters {
    stripeCount: number;           // 3-10
    stripeAngle: number;           // 0-90
    gapSize: number;               // 1-5
    strokeWidth: number;           // 2-8
    letterWeight: number;          // 400-800
    stripeStyle: 'solid' | 'dashed' | 'dotted';
    maskToLetter: boolean;
    alternateColors: boolean;
    perspectiveEffect: boolean;
    extrusionDepth: number;        // 0-10
}

export interface LetterScriptParams extends BaseParameters {
    flourishAmount: number;        // 0-1
    baselineWobble: number;        // 0-1
    connectStyle: 'full' | 'partial' | 'none';
    slant: number;                 // -30 to 30
    strokeContrast: number;        // 0-1
    loopSize: number;              // 0-1
    tailExtension: number;         // 0-30
    inkVariation: number;          // 0-1
    pressureEffect: boolean;
    vintageWear: number;           // 0-1
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
// NEW ADVANCED/3D ALGORITHM PARAMETERS (8)
// ============================================

export interface CircularEmblemParams extends BaseParameters {
    ringCount: number;             // 1-4
    innerSymbol: 'none' | 'star' | 'shield' | 'letter' | 'custom' | 'crown';
    textCurve: number;             // 0-1
    sealStyle: 'classic' | 'modern' | 'vintage' | 'minimal' | 'none' | 'simple' | 'ornate';
    borderPattern?: 'solid' | 'dots' | 'rope' | 'laurel';
    innerRadius: number;           // 0.3-0.7
    textUpperArc?: string;
    textLowerArc?: string;
    starCount: number;             // 0-12
    yearBadge?: boolean;
    borderWidth: number;           // 2-8
    decorativeElements: boolean;
    doubleBorder: boolean;
    vintageStyle: boolean;
}

export interface RibbonBannerParams extends BaseParameters {
    foldCount: number;             // 0-4
    ribbonWidth: number;           // 15-40
    endStyle: 'pointed' | 'fishtail' | 'straight' | 'rounded';
    waveAmount: number;            // 0-1
    textOnRibbon: boolean;
    ribbonLayers: number;          // 1-3
    shadowDepth: number;           // 0-10
    curveAmount: number;           // 0-1
    stitchEffect: boolean;
    wornTexture: number;           // 0-1
}

export interface Cube3DParams extends BaseParameters {
    isometricAngle: number;        // 25-35
    faceShading: 'none' | 'gradient' | 'solid';
    extrusionDepth: number;        // 10-40
    edgeStyle: 'sharp' | 'beveled' | 'rounded';
    facePattern: 'none' | 'grid' | 'dots' | 'letter';
    perspectiveAmount: number;     // 0-1
    transparentFaces: boolean;
    wireframeMode: boolean;
    rotationX: number;             // -30 to 30
    rotationY: number;             // -30 to 30
}

export interface OrigamiFoldParams extends BaseParameters {
    foldCount: number;             // 2-8
    creaseDensity: number;         // 0-1
    shadowAngle: number;           // 0-360
    paperTexture: 'none' | 'subtle' | 'visible';
    baseShape: 'square' | 'triangle' | 'crane' | 'abstract';
    foldDepth: number;             // 0-1
    colorFaces: boolean;
    crispness: number;             // 0-1
    unfoldAmount: number;          // 0-1
    lightSource: number;           // 0-360
}

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

// Union type for all parameter types
export type AlgorithmParams =
    // Existing
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
    | MonogramBlendParams
    // New Symbol Algorithms
    | SoundWavesParams
    | PageIconParams
    | ChatBubbleParams
    | InfinityLoopParams
    | ArrowMarkParams
    | ShieldBadgeParams
    | CrownMarkParams
    | LightningBoltParams
    | MountainPeakParams
    | WaveFlowParams
    | LeafOrganicParams
    | EyeVisionParams
    | HeartLoveParams
    | StarMarkParams
    | MoonPhaseParams
    | GearCogParams
    | LockSecureParams
    | CloudSoftParams
    | DiamondGemParams
    | HexagonTechParams
    // New Wordmark Algorithms
    | LetterGradientParams
    | LetterStripedParams
    | LetterScriptParams
    | BoxLogoParams
    // New Advanced/3D Algorithms
    | CircularEmblemParams
    | RibbonBannerParams
    | Cube3DParams
    | OrigamiFoldParams
    | MazePatternParams
    | FingerprintIdParams
    | DnaHelixParams
    | OrbitalPathsParams
    // Stacked Lines
    | StackedLinesParams;

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
