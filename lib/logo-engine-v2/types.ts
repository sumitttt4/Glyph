
export interface InfiniteLogoParams {
    strokeWidth: number;      // 1-8px
    cornerRadius: number;     // 0-50%
    rotation: number;         // 0-360
    curveTension: number;     // 0.1-1.0
    elementCount: number;     // 2-6
    spacingRatio: number;     // 0.5-2.0
    scaleVariance: number;    // 0.8-1.2
    symmetry: 'bilateral' | 'radial' | 'none';
    fillOpacity: number;      // 0.3-1.0
    gradientAngle: number;    // 0-360
    anatomy: ('stem' | 'bowl' | 'crossbar' | 'terminal')[];
    cutoutPosition: number;   // Index 0-11
    interlockDepth: number;   // 10-90%
    strokeTaper: number;      // 0-100%
}

export interface InfiniteLogoResult {
    id: string; // Hash
    svg: string;
    algorithm: string;
    description?: string;
    params: InfiniteLogoParams;
    qualityScore: number;
}
