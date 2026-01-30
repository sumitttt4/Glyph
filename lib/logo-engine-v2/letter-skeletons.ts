/**
 * Letter Skeleton System
 * 
 * Defines SVG path data for each letter A-Z with anatomical anchor points
 * and curve handles. Techniques transform these points: MODULAR builds 
 * from units at points, STENCIL cuts gaps, OUTLINE traces path, etc.
 * 
 * Each letter skeleton contains:
 * - anchors: Key anatomical points with x,y coordinates (normalized 0-100)
 * - paths: SVG path segments connecting anchors
 * - anatomy: Named parts (stem, bowl, crossbar, terminal, etc.)
 * - curves: Bezier curve handles for smooth paths
 */

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface Point {
  x: number;
  y: number;
}

export interface CurveHandle {
  /** Control point 1 (from anchor) */
  cp1: Point;
  /** Control point 2 (to anchor) */
  cp2: Point;
}

export type AnatomyType = 
  | 'stem'           // Vertical main stroke
  | 'bowl'           // Curved enclosed area (like in B, D, P, R)
  | 'crossbar'       // Horizontal connecting stroke
  | 'diagonal'       // Slanted stroke
  | 'terminal'       // End point/serif area
  | 'apex'           // Pointed top (like A, M, N)
  | 'vertex'         // Pointed bottom (like V, W)
  | 'arm'            // Horizontal or upward diagonal stroke
  | 'leg'            // Downward diagonal stroke
  | 'spine'          // Main curved stroke (like S)
  | 'bar'            // Horizontal stroke
  | 'tail'           // Extended stroke (like Q)
  | 'spur'           // Small projection
  | 'hook'           // Curved terminal
  | 'arc'            // Open curve segment
  | 'loop'           // Closed curve
  | 'counter'        // Enclosed/partially enclosed space
  | 'shoulder'       // Curved stroke (like n, m)
  | 'ear'            // Small projection at top
  | 'link'           // Connecting stroke
  | 'baseline'       // Bottom alignment
  | 'capline';       // Top alignment

export interface AnatomyPart {
  type: AnatomyType;
  /** Anchor point indices that define this part */
  anchorIndices: number[];
  /** SVG path segment for this part */
  pathSegment: string;
  /** Curve handles for bezier curves (optional) */
  curveHandles?: CurveHandle;
  /** Whether this part is the primary/dominant feature */
  isPrimary?: boolean;
}

export interface LetterSkeleton {
  /** The letter this skeleton represents */
  letter: string;
  /** Human-readable description of the letter's structure */
  description: string;
  /** Anchor points in normalized coordinates (0-100) */
  anchors: Point[];
  /** Named anatomical parts */
  anatomy: AnatomyPart[];
  /** Complete SVG path (viewBox 0 0 100 100) */
  svgPath: string;
  /** Suggested stroke width ratio */
  strokeWidthRatio: number;
  /** Optical adjustments for visual balance */
  opticalCorrections?: {
    /** Overshoot for curved tops/bottoms */
    overshoot?: number;
    /** Horizontal weight compensation */
    horizontalWeight?: number;
  };
}

// ============================================
// LETTER SKELETONS A-Z
// ============================================

export const LETTER_SKELETONS: Record<string, LetterSkeleton> = {
  
  // ========== A ==========
  // 2 diagonals meeting at apex + horizontal crossbar
  A: {
    letter: 'A',
    description: '2 diagonals meeting at apex + horizontal crossbar',
    anchors: [
      { x: 10, y: 90 },   // 0: left base
      { x: 50, y: 5 },    // 1: apex
      { x: 90, y: 90 },   // 2: right base
      { x: 25, y: 60 },   // 3: crossbar left
      { x: 75, y: 60 },   // 4: crossbar right
    ],
    anatomy: [
      { 
        type: 'diagonal', 
        anchorIndices: [0, 1], 
        pathSegment: 'M 10 90 L 50 5',
        isPrimary: true 
      },
      { 
        type: 'diagonal', 
        anchorIndices: [1, 2], 
        pathSegment: 'M 50 5 L 90 90',
        isPrimary: true 
      },
      { 
        type: 'apex', 
        anchorIndices: [1], 
        pathSegment: '' 
      },
      { 
        type: 'crossbar', 
        anchorIndices: [3, 4], 
        pathSegment: 'M 25 60 L 75 60' 
      },
    ],
    svgPath: 'M 10 90 L 50 5 L 90 90 M 25 60 L 75 60',
    strokeWidthRatio: 0.12,
  },

  // ========== B ==========
  // Vertical stem + 2 bowls (upper smaller, lower larger)
  B: {
    letter: 'B',
    description: 'vertical stem + 2 bowls (upper smaller, lower larger)',
    anchors: [
      { x: 15, y: 10 },   // 0: stem top
      { x: 15, y: 90 },   // 1: stem bottom
      { x: 15, y: 50 },   // 2: stem middle (junction)
      { x: 65, y: 10 },   // 3: upper bowl top right
      { x: 70, y: 30 },   // 4: upper bowl apex
      { x: 65, y: 50 },   // 5: upper bowl bottom right
      { x: 70, y: 50 },   // 6: lower bowl top right
      { x: 75, y: 70 },   // 7: lower bowl apex
      { x: 70, y: 90 },   // 8: lower bowl bottom right
    ],
    anatomy: [
      { 
        type: 'stem', 
        anchorIndices: [0, 1], 
        pathSegment: 'M 15 10 L 15 90',
        isPrimary: true 
      },
      { 
        type: 'bowl', 
        anchorIndices: [0, 3, 4, 5, 2], 
        pathSegment: 'M 15 10 L 65 10 Q 85 10 85 30 Q 85 50 65 50 L 15 50',
        curveHandles: { cp1: { x: 85, y: 10 }, cp2: { x: 85, y: 50 } }
      },
      { 
        type: 'bowl', 
        anchorIndices: [2, 6, 7, 8, 1], 
        pathSegment: 'M 15 50 L 70 50 Q 95 50 95 70 Q 95 90 70 90 L 15 90',
        curveHandles: { cp1: { x: 95, y: 50 }, cp2: { x: 95, y: 90 } },
        isPrimary: true
      },
    ],
    svgPath: 'M 15 10 L 15 90 M 15 10 L 65 10 Q 85 10 85 30 Q 85 50 65 50 L 15 50 M 15 50 L 70 50 Q 95 50 95 70 Q 95 90 70 90 L 15 90',
    strokeWidthRatio: 0.12,
  },

  // ========== C ==========
  // Open curve, 270° arc
  C: {
    letter: 'C',
    description: 'open curve, 270° arc',
    anchors: [
      { x: 85, y: 25 },   // 0: top terminal
      { x: 50, y: 5 },    // 1: top curve
      { x: 10, y: 50 },   // 2: left apex
      { x: 50, y: 95 },   // 3: bottom curve
      { x: 85, y: 75 },   // 4: bottom terminal
    ],
    anatomy: [
      { 
        type: 'arc', 
        anchorIndices: [0, 1, 2, 3, 4], 
        pathSegment: 'M 85 25 Q 85 5 50 5 Q 10 5 10 50 Q 10 95 50 95 Q 85 95 85 75',
        curveHandles: { cp1: { x: 10, y: 5 }, cp2: { x: 10, y: 95 } },
        isPrimary: true 
      },
      { 
        type: 'terminal', 
        anchorIndices: [0], 
        pathSegment: '' 
      },
      { 
        type: 'terminal', 
        anchorIndices: [4], 
        pathSegment: '' 
      },
    ],
    svgPath: 'M 85 25 C 85 5 70 5 50 5 C 20 5 10 25 10 50 C 10 75 20 95 50 95 C 70 95 85 95 85 75',
    strokeWidthRatio: 0.12,
    opticalCorrections: { overshoot: 2 },
  },

  // ========== D ==========
  // Vertical stem + single large bowl
  D: {
    letter: 'D',
    description: 'vertical stem + single large bowl',
    anchors: [
      { x: 15, y: 10 },   // 0: stem top
      { x: 15, y: 90 },   // 1: stem bottom
      { x: 60, y: 10 },   // 2: bowl top
      { x: 90, y: 50 },   // 3: bowl right apex
      { x: 60, y: 90 },   // 4: bowl bottom
    ],
    anatomy: [
      { 
        type: 'stem', 
        anchorIndices: [0, 1], 
        pathSegment: 'M 15 10 L 15 90',
        isPrimary: true 
      },
      { 
        type: 'bowl', 
        anchorIndices: [0, 2, 3, 4, 1], 
        pathSegment: 'M 15 10 L 60 10 Q 95 10 95 50 Q 95 90 60 90 L 15 90',
        curveHandles: { cp1: { x: 95, y: 10 }, cp2: { x: 95, y: 90 } },
        isPrimary: true
      },
    ],
    svgPath: 'M 15 10 L 15 90 L 60 90 Q 95 90 95 50 Q 95 10 60 10 L 15 10',
    strokeWidthRatio: 0.12,
  },

  // ========== E ==========
  // Vertical stem + 3 horizontal bars
  E: {
    letter: 'E',
    description: 'vertical stem + 3 horizontal bars',
    anchors: [
      { x: 15, y: 10 },   // 0: stem top
      { x: 15, y: 90 },   // 1: stem bottom
      { x: 15, y: 50 },   // 2: stem middle
      { x: 85, y: 10 },   // 3: top bar right
      { x: 70, y: 50 },   // 4: middle bar right
      { x: 85, y: 90 },   // 5: bottom bar right
    ],
    anatomy: [
      { 
        type: 'stem', 
        anchorIndices: [0, 1], 
        pathSegment: 'M 15 10 L 15 90',
        isPrimary: true 
      },
      { 
        type: 'bar', 
        anchorIndices: [0, 3], 
        pathSegment: 'M 15 10 L 85 10' 
      },
      { 
        type: 'crossbar', 
        anchorIndices: [2, 4], 
        pathSegment: 'M 15 50 L 70 50' 
      },
      { 
        type: 'bar', 
        anchorIndices: [1, 5], 
        pathSegment: 'M 15 90 L 85 90' 
      },
    ],
    svgPath: 'M 15 10 L 15 90 M 15 10 L 85 10 M 15 50 L 70 50 M 15 90 L 85 90',
    strokeWidthRatio: 0.12,
  },

  // ========== F ==========
  // Vertical stem + 2 horizontal bars (top + middle)
  F: {
    letter: 'F',
    description: 'vertical stem + 2 horizontal bars (top + middle)',
    anchors: [
      { x: 15, y: 10 },   // 0: stem top
      { x: 15, y: 90 },   // 1: stem bottom
      { x: 15, y: 50 },   // 2: stem middle
      { x: 85, y: 10 },   // 3: top bar right
      { x: 65, y: 50 },   // 4: middle bar right
    ],
    anatomy: [
      { 
        type: 'stem', 
        anchorIndices: [0, 1], 
        pathSegment: 'M 15 10 L 15 90',
        isPrimary: true 
      },
      { 
        type: 'bar', 
        anchorIndices: [0, 3], 
        pathSegment: 'M 15 10 L 85 10' 
      },
      { 
        type: 'crossbar', 
        anchorIndices: [2, 4], 
        pathSegment: 'M 15 50 L 65 50' 
      },
    ],
    svgPath: 'M 15 10 L 15 90 M 15 10 L 85 10 M 15 50 L 65 50',
    strokeWidthRatio: 0.12,
  },

  // ========== G ==========
  // C curve + horizontal bar + optional vertical
  G: {
    letter: 'G',
    description: 'C curve + horizontal bar + optional vertical (beard)',
    anchors: [
      { x: 85, y: 25 },   // 0: top terminal
      { x: 50, y: 5 },    // 1: top curve
      { x: 10, y: 50 },   // 2: left apex
      { x: 50, y: 95 },   // 3: bottom curve
      { x: 85, y: 75 },   // 4: bottom right
      { x: 85, y: 50 },   // 5: bar/beard junction
      { x: 55, y: 50 },   // 6: bar left
    ],
    anatomy: [
      { 
        type: 'arc', 
        anchorIndices: [0, 1, 2, 3, 4], 
        pathSegment: 'M 85 25 C 85 5 70 5 50 5 C 20 5 10 25 10 50 C 10 75 20 95 50 95 C 70 95 85 85 85 75',
        isPrimary: true 
      },
      { 
        type: 'bar', 
        anchorIndices: [6, 5], 
        pathSegment: 'M 55 50 L 85 50' 
      },
      { 
        type: 'stem', 
        anchorIndices: [5, 4], 
        pathSegment: 'M 85 50 L 85 75' 
      },
    ],
    svgPath: 'M 85 25 C 85 5 70 5 50 5 C 20 5 10 25 10 50 C 10 75 20 95 50 95 C 70 95 85 85 85 75 L 85 50 L 55 50',
    strokeWidthRatio: 0.12,
  },

  // ========== H ==========
  // 2 vertical stems + horizontal crossbar
  H: {
    letter: 'H',
    description: '2 vertical stems + horizontal crossbar',
    anchors: [
      { x: 15, y: 10 },   // 0: left stem top
      { x: 15, y: 90 },   // 1: left stem bottom
      { x: 85, y: 10 },   // 2: right stem top
      { x: 85, y: 90 },   // 3: right stem bottom
      { x: 15, y: 50 },   // 4: crossbar left
      { x: 85, y: 50 },   // 5: crossbar right
    ],
    anatomy: [
      { 
        type: 'stem', 
        anchorIndices: [0, 1], 
        pathSegment: 'M 15 10 L 15 90',
        isPrimary: true 
      },
      { 
        type: 'stem', 
        anchorIndices: [2, 3], 
        pathSegment: 'M 85 10 L 85 90',
        isPrimary: true 
      },
      { 
        type: 'crossbar', 
        anchorIndices: [4, 5], 
        pathSegment: 'M 15 50 L 85 50' 
      },
    ],
    svgPath: 'M 15 10 L 15 90 M 85 10 L 85 90 M 15 50 L 85 50',
    strokeWidthRatio: 0.12,
  },

  // ========== I ==========
  // Vertical stem + optional serifs
  I: {
    letter: 'I',
    description: 'vertical stem + optional serifs',
    anchors: [
      { x: 50, y: 10 },   // 0: stem top
      { x: 50, y: 90 },   // 1: stem bottom
      { x: 30, y: 10 },   // 2: top serif left
      { x: 70, y: 10 },   // 3: top serif right
      { x: 30, y: 90 },   // 4: bottom serif left
      { x: 70, y: 90 },   // 5: bottom serif right
    ],
    anatomy: [
      { 
        type: 'stem', 
        anchorIndices: [0, 1], 
        pathSegment: 'M 50 10 L 50 90',
        isPrimary: true 
      },
      { 
        type: 'terminal', 
        anchorIndices: [2, 0, 3], 
        pathSegment: 'M 30 10 L 70 10' 
      },
      { 
        type: 'terminal', 
        anchorIndices: [4, 1, 5], 
        pathSegment: 'M 30 90 L 70 90' 
      },
    ],
    svgPath: 'M 50 10 L 50 90 M 30 10 L 70 10 M 30 90 L 70 90',
    strokeWidthRatio: 0.12,
  },

  // ========== J ==========
  // Vertical stem + bottom curve (hook)
  J: {
    letter: 'J',
    description: 'vertical stem + bottom curve (hook)',
    anchors: [
      { x: 70, y: 10 },   // 0: stem top
      { x: 70, y: 65 },   // 1: curve start
      { x: 50, y: 90 },   // 2: curve bottom
      { x: 20, y: 75 },   // 3: hook terminal
      { x: 40, y: 10 },   // 4: top serif left
      { x: 85, y: 10 },   // 5: top serif right
    ],
    anatomy: [
      { 
        type: 'stem', 
        anchorIndices: [0, 1], 
        pathSegment: 'M 70 10 L 70 65',
        isPrimary: true 
      },
      { 
        type: 'hook', 
        anchorIndices: [1, 2, 3], 
        pathSegment: 'M 70 65 Q 70 95 50 95 Q 20 95 20 75',
        curveHandles: { cp1: { x: 70, y: 95 }, cp2: { x: 20, y: 95 } }
      },
      { 
        type: 'terminal', 
        anchorIndices: [4, 0, 5], 
        pathSegment: 'M 40 10 L 85 10' 
      },
    ],
    svgPath: 'M 70 10 L 70 65 Q 70 95 50 95 Q 20 95 20 75 M 40 10 L 85 10',
    strokeWidthRatio: 0.12,
  },

  // ========== K ==========
  // Vertical stem + diagonal arm + diagonal leg
  K: {
    letter: 'K',
    description: 'vertical stem + diagonal arm + diagonal leg',
    anchors: [
      { x: 15, y: 10 },   // 0: stem top
      { x: 15, y: 90 },   // 1: stem bottom
      { x: 15, y: 55 },   // 2: junction point
      { x: 85, y: 10 },   // 3: arm top
      { x: 85, y: 90 },   // 4: leg bottom
    ],
    anatomy: [
      { 
        type: 'stem', 
        anchorIndices: [0, 1], 
        pathSegment: 'M 15 10 L 15 90',
        isPrimary: true 
      },
      { 
        type: 'arm', 
        anchorIndices: [2, 3], 
        pathSegment: 'M 15 55 L 85 10' 
      },
      { 
        type: 'leg', 
        anchorIndices: [2, 4], 
        pathSegment: 'M 15 55 L 85 90' 
      },
    ],
    svgPath: 'M 15 10 L 15 90 M 15 55 L 85 10 M 15 55 L 85 90',
    strokeWidthRatio: 0.12,
  },

  // ========== L ==========
  // Vertical stem + horizontal base
  L: {
    letter: 'L',
    description: 'vertical stem + horizontal base',
    anchors: [
      { x: 15, y: 10 },   // 0: stem top
      { x: 15, y: 90 },   // 1: stem bottom / base left
      { x: 85, y: 90 },   // 2: base right
    ],
    anatomy: [
      { 
        type: 'stem', 
        anchorIndices: [0, 1], 
        pathSegment: 'M 15 10 L 15 90',
        isPrimary: true 
      },
      { 
        type: 'bar', 
        anchorIndices: [1, 2], 
        pathSegment: 'M 15 90 L 85 90' 
      },
    ],
    svgPath: 'M 15 10 L 15 90 L 85 90',
    strokeWidthRatio: 0.12,
  },

  // ========== M ==========
  // 2 verticals + 2 diagonals meeting at center
  M: {
    letter: 'M',
    description: '2 verticals + 2 diagonals meeting at center valley',
    anchors: [
      { x: 10, y: 90 },   // 0: left base
      { x: 10, y: 10 },   // 1: left top
      { x: 50, y: 60 },   // 2: center valley (vertex)
      { x: 90, y: 10 },   // 3: right top
      { x: 90, y: 90 },   // 4: right base
    ],
    anatomy: [
      { 
        type: 'stem', 
        anchorIndices: [0, 1], 
        pathSegment: 'M 10 90 L 10 10',
        isPrimary: true 
      },
      { 
        type: 'diagonal', 
        anchorIndices: [1, 2], 
        pathSegment: 'M 10 10 L 50 60' 
      },
      { 
        type: 'vertex', 
        anchorIndices: [2], 
        pathSegment: '' 
      },
      { 
        type: 'diagonal', 
        anchorIndices: [2, 3], 
        pathSegment: 'M 50 60 L 90 10' 
      },
      { 
        type: 'stem', 
        anchorIndices: [3, 4], 
        pathSegment: 'M 90 10 L 90 90',
        isPrimary: true 
      },
    ],
    svgPath: 'M 10 90 L 10 10 L 50 60 L 90 10 L 90 90',
    strokeWidthRatio: 0.12,
  },

  // ========== N ==========
  // 2 verticals + single diagonal
  N: {
    letter: 'N',
    description: '2 verticals + single diagonal',
    anchors: [
      { x: 15, y: 90 },   // 0: left base
      { x: 15, y: 10 },   // 1: left top
      { x: 85, y: 90 },   // 2: right base
      { x: 85, y: 10 },   // 3: right top
    ],
    anatomy: [
      { 
        type: 'stem', 
        anchorIndices: [0, 1], 
        pathSegment: 'M 15 90 L 15 10',
        isPrimary: true 
      },
      { 
        type: 'diagonal', 
        anchorIndices: [1, 2], 
        pathSegment: 'M 15 10 L 85 90' 
      },
      { 
        type: 'stem', 
        anchorIndices: [2, 3], 
        pathSegment: 'M 85 90 L 85 10',
        isPrimary: true 
      },
    ],
    svgPath: 'M 15 90 L 15 10 L 85 90 L 85 10',
    strokeWidthRatio: 0.12,
  },

  // ========== O ==========
  // Closed oval/circle
  O: {
    letter: 'O',
    description: 'closed oval/circle',
    anchors: [
      { x: 50, y: 5 },    // 0: top center
      { x: 95, y: 50 },   // 1: right center
      { x: 50, y: 95 },   // 2: bottom center
      { x: 5, y: 50 },    // 3: left center
    ],
    anatomy: [
      { 
        type: 'loop', 
        anchorIndices: [0, 1, 2, 3], 
        pathSegment: 'M 50 5 C 80 5 95 25 95 50 C 95 75 80 95 50 95 C 20 95 5 75 5 50 C 5 25 20 5 50 5 Z',
        curveHandles: { cp1: { x: 95, y: 5 }, cp2: { x: 5, y: 5 } },
        isPrimary: true 
      },
    ],
    svgPath: 'M 50 5 C 80 5 95 25 95 50 C 95 75 80 95 50 95 C 20 95 5 75 5 50 C 5 25 20 5 50 5 Z',
    strokeWidthRatio: 0.12,
    opticalCorrections: { overshoot: 3 },
  },

  // ========== P ==========
  // Vertical stem + upper bowl
  P: {
    letter: 'P',
    description: 'vertical stem + upper bowl',
    anchors: [
      { x: 15, y: 10 },   // 0: stem top
      { x: 15, y: 90 },   // 1: stem bottom
      { x: 15, y: 55 },   // 2: bowl bottom junction
      { x: 65, y: 10 },   // 3: bowl top right
      { x: 80, y: 32 },   // 4: bowl apex
      { x: 65, y: 55 },   // 5: bowl bottom right
    ],
    anatomy: [
      { 
        type: 'stem', 
        anchorIndices: [0, 1], 
        pathSegment: 'M 15 10 L 15 90',
        isPrimary: true 
      },
      { 
        type: 'bowl', 
        anchorIndices: [0, 3, 4, 5, 2], 
        pathSegment: 'M 15 10 L 65 10 Q 95 10 95 32 Q 95 55 65 55 L 15 55',
        curveHandles: { cp1: { x: 95, y: 10 }, cp2: { x: 95, y: 55 } },
        isPrimary: true
      },
    ],
    svgPath: 'M 15 10 L 15 90 M 15 10 L 65 10 Q 95 10 95 32 Q 95 55 65 55 L 15 55',
    strokeWidthRatio: 0.12,
  },

  // ========== Q ==========
  // O + diagonal tail
  Q: {
    letter: 'Q',
    description: 'O + diagonal tail',
    anchors: [
      { x: 50, y: 5 },    // 0: top center
      { x: 95, y: 50 },   // 1: right center
      { x: 50, y: 95 },   // 2: bottom center
      { x: 5, y: 50 },    // 3: left center
      { x: 55, y: 75 },   // 4: tail start
      { x: 95, y: 98 },   // 5: tail end
    ],
    anatomy: [
      { 
        type: 'loop', 
        anchorIndices: [0, 1, 2, 3], 
        pathSegment: 'M 50 5 C 80 5 95 25 95 50 C 95 75 80 95 50 95 C 20 95 5 75 5 50 C 5 25 20 5 50 5 Z',
        isPrimary: true 
      },
      { 
        type: 'tail', 
        anchorIndices: [4, 5], 
        pathSegment: 'M 55 75 L 95 98' 
      },
    ],
    svgPath: 'M 50 5 C 80 5 95 25 95 50 C 95 75 80 95 50 95 C 20 95 5 75 5 50 C 5 25 20 5 50 5 Z M 55 75 L 95 98',
    strokeWidthRatio: 0.12,
    opticalCorrections: { overshoot: 3 },
  },

  // ========== R ==========
  // P + diagonal leg
  R: {
    letter: 'R',
    description: 'P (stem + bowl) + diagonal leg',
    anchors: [
      { x: 15, y: 10 },   // 0: stem top
      { x: 15, y: 90 },   // 1: stem bottom
      { x: 15, y: 55 },   // 2: junction
      { x: 65, y: 10 },   // 3: bowl top right
      { x: 80, y: 32 },   // 4: bowl apex
      { x: 65, y: 55 },   // 5: bowl bottom right / leg start
      { x: 85, y: 90 },   // 6: leg end
    ],
    anatomy: [
      { 
        type: 'stem', 
        anchorIndices: [0, 1], 
        pathSegment: 'M 15 10 L 15 90',
        isPrimary: true 
      },
      { 
        type: 'bowl', 
        anchorIndices: [0, 3, 4, 5, 2], 
        pathSegment: 'M 15 10 L 65 10 Q 95 10 95 32 Q 95 55 65 55 L 15 55',
        curveHandles: { cp1: { x: 95, y: 10 }, cp2: { x: 95, y: 55 } }
      },
      { 
        type: 'leg', 
        anchorIndices: [5, 6], 
        pathSegment: 'M 45 55 L 85 90' 
      },
    ],
    svgPath: 'M 15 10 L 15 90 M 15 10 L 65 10 Q 95 10 95 32 Q 95 55 65 55 L 15 55 M 45 55 L 85 90',
    strokeWidthRatio: 0.12,
  },

  // ========== S ==========
  // Double curve (spine) - S-curve
  S: {
    letter: 'S',
    description: 'double curve (spine)',
    anchors: [
      { x: 80, y: 20 },   // 0: top terminal
      { x: 50, y: 5 },    // 1: top curve center
      { x: 15, y: 25 },   // 2: top left curve
      { x: 50, y: 50 },   // 3: spine center
      { x: 85, y: 75 },   // 4: bottom right curve
      { x: 50, y: 95 },   // 5: bottom curve center
      { x: 20, y: 80 },   // 6: bottom terminal
    ],
    anatomy: [
      { 
        type: 'spine', 
        anchorIndices: [0, 1, 2, 3, 4, 5, 6], 
        pathSegment: 'M 80 20 C 80 5 60 5 50 5 C 25 5 15 15 15 30 C 15 45 30 50 50 50 C 70 50 85 55 85 70 C 85 85 75 95 50 95 C 40 95 20 95 20 80',
        isPrimary: true 
      },
    ],
    svgPath: 'M 80 20 C 80 5 60 5 50 5 C 25 5 15 15 15 30 C 15 45 30 50 50 50 C 70 50 85 55 85 70 C 85 85 75 95 50 95 C 40 95 20 95 20 80',
    strokeWidthRatio: 0.12,
    opticalCorrections: { overshoot: 2 },
  },

  // ========== T ==========
  // Horizontal top + vertical stem
  T: {
    letter: 'T',
    description: 'horizontal top + vertical stem',
    anchors: [
      { x: 5, y: 10 },    // 0: top bar left
      { x: 95, y: 10 },   // 1: top bar right
      { x: 50, y: 10 },   // 2: stem top
      { x: 50, y: 90 },   // 3: stem bottom
    ],
    anatomy: [
      { 
        type: 'bar', 
        anchorIndices: [0, 1], 
        pathSegment: 'M 5 10 L 95 10' 
      },
      { 
        type: 'stem', 
        anchorIndices: [2, 3], 
        pathSegment: 'M 50 10 L 50 90',
        isPrimary: true 
      },
    ],
    svgPath: 'M 5 10 L 95 10 M 50 10 L 50 90',
    strokeWidthRatio: 0.12,
  },

  // ========== U ==========
  // 2 verticals + bottom curve connecting
  U: {
    letter: 'U',
    description: '2 verticals + bottom curve connecting',
    anchors: [
      { x: 15, y: 10 },   // 0: left stem top
      { x: 15, y: 65 },   // 1: left stem bottom / curve start
      { x: 50, y: 95 },   // 2: curve bottom center
      { x: 85, y: 65 },   // 3: right stem bottom / curve end
      { x: 85, y: 10 },   // 4: right stem top
    ],
    anatomy: [
      { 
        type: 'stem', 
        anchorIndices: [0, 1], 
        pathSegment: 'M 15 10 L 15 65',
        isPrimary: true 
      },
      { 
        type: 'arc', 
        anchorIndices: [1, 2, 3], 
        pathSegment: 'M 15 65 Q 15 95 50 95 Q 85 95 85 65',
        curveHandles: { cp1: { x: 15, y: 95 }, cp2: { x: 85, y: 95 } }
      },
      { 
        type: 'stem', 
        anchorIndices: [3, 4], 
        pathSegment: 'M 85 65 L 85 10',
        isPrimary: true 
      },
    ],
    svgPath: 'M 15 10 L 15 65 Q 15 95 50 95 Q 85 95 85 65 L 85 10',
    strokeWidthRatio: 0.12,
    opticalCorrections: { overshoot: 2 },
  },

  // ========== V ==========
  // 2 diagonals meeting at bottom (vertex)
  V: {
    letter: 'V',
    description: '2 diagonals meeting at bottom vertex',
    anchors: [
      { x: 10, y: 10 },   // 0: left top
      { x: 50, y: 90 },   // 1: vertex (bottom)
      { x: 90, y: 10 },   // 2: right top
    ],
    anatomy: [
      { 
        type: 'diagonal', 
        anchorIndices: [0, 1], 
        pathSegment: 'M 10 10 L 50 90',
        isPrimary: true 
      },
      { 
        type: 'vertex', 
        anchorIndices: [1], 
        pathSegment: '' 
      },
      { 
        type: 'diagonal', 
        anchorIndices: [1, 2], 
        pathSegment: 'M 50 90 L 90 10',
        isPrimary: true 
      },
    ],
    svgPath: 'M 10 10 L 50 90 L 90 10',
    strokeWidthRatio: 0.12,
  },

  // ========== W ==========
  // 2 Vs connected (double valley)
  W: {
    letter: 'W',
    description: '2 Vs connected (double valley)',
    anchors: [
      { x: 5, y: 10 },    // 0: left top
      { x: 25, y: 90 },   // 1: first valley
      { x: 50, y: 40 },   // 2: center peak
      { x: 75, y: 90 },   // 3: second valley
      { x: 95, y: 10 },   // 4: right top
    ],
    anatomy: [
      { 
        type: 'diagonal', 
        anchorIndices: [0, 1], 
        pathSegment: 'M 5 10 L 25 90',
        isPrimary: true 
      },
      { 
        type: 'vertex', 
        anchorIndices: [1], 
        pathSegment: '' 
      },
      { 
        type: 'diagonal', 
        anchorIndices: [1, 2], 
        pathSegment: 'M 25 90 L 50 40' 
      },
      { 
        type: 'apex', 
        anchorIndices: [2], 
        pathSegment: '' 
      },
      { 
        type: 'diagonal', 
        anchorIndices: [2, 3], 
        pathSegment: 'M 50 40 L 75 90' 
      },
      { 
        type: 'vertex', 
        anchorIndices: [3], 
        pathSegment: '' 
      },
      { 
        type: 'diagonal', 
        anchorIndices: [3, 4], 
        pathSegment: 'M 75 90 L 95 10',
        isPrimary: true 
      },
    ],
    svgPath: 'M 5 10 L 25 90 L 50 40 L 75 90 L 95 10',
    strokeWidthRatio: 0.10,
  },

  // ========== X ==========
  // 2 diagonals crossing
  X: {
    letter: 'X',
    description: '2 diagonals crossing at center',
    anchors: [
      { x: 10, y: 10 },   // 0: top left
      { x: 90, y: 90 },   // 1: bottom right
      { x: 90, y: 10 },   // 2: top right
      { x: 10, y: 90 },   // 3: bottom left
      { x: 50, y: 50 },   // 4: center crossing
    ],
    anatomy: [
      { 
        type: 'diagonal', 
        anchorIndices: [0, 4, 1], 
        pathSegment: 'M 10 10 L 90 90',
        isPrimary: true 
      },
      { 
        type: 'diagonal', 
        anchorIndices: [2, 4, 3], 
        pathSegment: 'M 90 10 L 10 90',
        isPrimary: true 
      },
    ],
    svgPath: 'M 10 10 L 90 90 M 90 10 L 10 90',
    strokeWidthRatio: 0.12,
  },

  // ========== Y ==========
  // 2 upper diagonals + vertical stem below
  Y: {
    letter: 'Y',
    description: '2 upper diagonals meeting at center + vertical stem below',
    anchors: [
      { x: 10, y: 10 },   // 0: left arm top
      { x: 50, y: 50 },   // 1: junction center
      { x: 90, y: 10 },   // 2: right arm top
      { x: 50, y: 90 },   // 3: stem bottom
    ],
    anatomy: [
      { 
        type: 'arm', 
        anchorIndices: [0, 1], 
        pathSegment: 'M 10 10 L 50 50' 
      },
      { 
        type: 'arm', 
        anchorIndices: [2, 1], 
        pathSegment: 'M 90 10 L 50 50' 
      },
      { 
        type: 'stem', 
        anchorIndices: [1, 3], 
        pathSegment: 'M 50 50 L 50 90',
        isPrimary: true 
      },
    ],
    svgPath: 'M 10 10 L 50 50 L 90 10 M 50 50 L 50 90',
    strokeWidthRatio: 0.12,
  },

  // ========== Z ==========
  // Horizontal top + diagonal + horizontal bottom
  Z: {
    letter: 'Z',
    description: 'horizontal top + diagonal + horizontal bottom',
    anchors: [
      { x: 10, y: 10 },   // 0: top bar left
      { x: 90, y: 10 },   // 1: top bar right
      { x: 10, y: 90 },   // 2: bottom bar left
      { x: 90, y: 90 },   // 3: bottom bar right
    ],
    anatomy: [
      { 
        type: 'bar', 
        anchorIndices: [0, 1], 
        pathSegment: 'M 10 10 L 90 10' 
      },
      { 
        type: 'diagonal', 
        anchorIndices: [1, 2], 
        pathSegment: 'M 90 10 L 10 90',
        isPrimary: true 
      },
      { 
        type: 'bar', 
        anchorIndices: [2, 3], 
        pathSegment: 'M 10 90 L 90 90' 
      },
    ],
    svgPath: 'M 10 10 L 90 10 L 10 90 L 90 90',
    strokeWidthRatio: 0.12,
  },
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get skeleton for a specific letter (case-insensitive)
 */
export function getSkeleton(letter: string): LetterSkeleton | undefined {
  return LETTER_SKELETONS[letter.toUpperCase()];
}

/**
 * Get all skeletons as an array
 */
export function getAllSkeletons(): LetterSkeleton[] {
  return Object.values(LETTER_SKELETONS);
}

/**
 * Get the primary anchor points for a letter
 */
export function getPrimaryAnchors(letter: string): Point[] {
  const skeleton = getSkeleton(letter);
  if (!skeleton) return [];
  
  const primaryParts = skeleton.anatomy.filter(part => part.isPrimary);
  const anchorIndices = new Set<number>();
  
  primaryParts.forEach(part => {
    part.anchorIndices.forEach(idx => anchorIndices.add(idx));
  });
  
  return Array.from(anchorIndices).map(idx => skeleton.anchors[idx]);
}

/**
 * Get anatomy parts by type
 */
export function getAnatomyByType(letter: string, type: AnatomyType): AnatomyPart[] {
  const skeleton = getSkeleton(letter);
  if (!skeleton) return [];
  
  return skeleton.anatomy.filter(part => part.type === type);
}

/**
 * Scale a skeleton's anchors to a new size
 */
export function scaleSkeleton(skeleton: LetterSkeleton, width: number, height: number): Point[] {
  return skeleton.anchors.map(anchor => ({
    x: (anchor.x / 100) * width,
    y: (anchor.y / 100) * height,
  }));
}

/**
 * Generate SVG path with custom stroke width
 */
export function renderSkeleton(
  letter: string, 
  options: {
    width?: number;
    height?: number;
    strokeWidth?: number;
    strokeColor?: string;
    fillColor?: string;
    strokeLinecap?: 'butt' | 'round' | 'square';
    strokeLinejoin?: 'miter' | 'round' | 'bevel';
  } = {}
): string {
  const skeleton = getSkeleton(letter);
  if (!skeleton) return '';
  
  const {
    width = 100,
    height = 100,
    strokeWidth = skeleton.strokeWidthRatio * Math.min(width, height),
    strokeColor = 'currentColor',
    fillColor = 'none',
    strokeLinecap = 'round',
    strokeLinejoin = 'round',
  } = options;
  
  // Scale the path if dimensions differ from 100x100
  let path = skeleton.svgPath;
  if (width !== 100 || height !== 100) {
    path = scalePath(path, width / 100, height / 100);
  }
  
  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="${path}" 
      fill="${fillColor}" 
      stroke="${strokeColor}" 
      stroke-width="${strokeWidth}"
      stroke-linecap="${strokeLinecap}"
      stroke-linejoin="${strokeLinejoin}"
    />
  </svg>`;
}

/**
 * Scale an SVG path string by x and y factors
 */
function scalePath(path: string, scaleX: number, scaleY: number): string {
  return path.replace(/(-?\d+\.?\d*)/g, (match, num, offset, string) => {
    const val = parseFloat(num);
    // Determine if this is an x or y coordinate based on position
    // This is a simplified approach - for production, parse the path properly
    const prevChar = string[offset - 1];
    const isXCoord = prevChar === 'M' || prevChar === 'L' || prevChar === 'H' || 
                     prevChar === 'C' || prevChar === 'Q' || prevChar === ' ' || 
                     prevChar === ',';
    
    return (val * (isXCoord ? scaleX : scaleY)).toFixed(2);
  });
}

/**
 * Get the bounding box of a skeleton
 */
export function getSkeletonBounds(letter: string): { minX: number; minY: number; maxX: number; maxY: number } | null {
  const skeleton = getSkeleton(letter);
  if (!skeleton) return null;
  
  const xs = skeleton.anchors.map(a => a.x);
  const ys = skeleton.anchors.map(a => a.y);
  
  return {
    minX: Math.min(...xs),
    minY: Math.min(...ys),
    maxX: Math.max(...xs),
    maxY: Math.max(...ys),
  };
}

/**
 * Transform skeleton anchors with a custom transform function
 */
export function transformAnchors(
  letter: string, 
  transformFn: (point: Point, index: number) => Point
): Point[] {
  const skeleton = getSkeleton(letter);
  if (!skeleton) return [];
  
  return skeleton.anchors.map(transformFn);
}

// ============================================
// TECHNIQUE HELPERS
// ============================================

/**
 * Get connection points for MODULAR technique
 * Returns key points where modular units should be placed
 */
export function getModularPoints(letter: string): Point[] {
  const skeleton = getSkeleton(letter);
  if (!skeleton) return [];
  
  // Return all anchors as potential module placement points
  return [...skeleton.anchors];
}

/**
 * Get gap positions for STENCIL technique
 * Returns recommended positions to cut gaps in strokes
 */
export function getStencilGaps(letter: string): { start: Point; end: Point }[] {
  const skeleton = getSkeleton(letter);
  if (!skeleton) return [];
  
  const gaps: { start: Point; end: Point }[] = [];
  
  skeleton.anatomy.forEach(part => {
    if (part.anchorIndices.length >= 2) {
      const startIdx = part.anchorIndices[0];
      const endIdx = part.anchorIndices[part.anchorIndices.length - 1];
      
      const start = skeleton.anchors[startIdx];
      const end = skeleton.anchors[endIdx];
      
      // Calculate midpoint for gap
      const midX = (start.x + end.x) / 2;
      const midY = (start.y + end.y) / 2;
      
      gaps.push({
        start: { x: midX - 5, y: midY - 5 },
        end: { x: midX + 5, y: midY + 5 },
      });
    }
  });
  
  return gaps;
}

/**
 * Get outline path segments for OUTLINE technique
 */
export function getOutlineSegments(letter: string): string[] {
  const skeleton = getSkeleton(letter);
  if (!skeleton) return [];
  
  return skeleton.anatomy.map(part => part.pathSegment).filter(Boolean);
}

/**
 * Get letter categories by anatomical features
 */
export function getLettersByAnatomy(types: AnatomyType[]): string[] {
  const letters: string[] = [];
  
  Object.entries(LETTER_SKELETONS).forEach(([letter, skeleton]) => {
    const hasAllTypes = types.every(type => 
      skeleton.anatomy.some(part => part.type === type)
    );
    if (hasAllTypes) {
      letters.push(letter);
    }
  });
  
  return letters;
}

/**
 * Check if a letter has curved elements
 */
export function hasCurvedElements(letter: string): boolean {
  const skeleton = getSkeleton(letter);
  if (!skeleton) return false;
  
  const curvedTypes: AnatomyType[] = ['bowl', 'arc', 'loop', 'hook', 'spine', 'shoulder'];
  return skeleton.anatomy.some(part => curvedTypes.includes(part.type));
}

/**
 * Check if a letter has diagonal elements
 */
export function hasDiagonalElements(letter: string): boolean {
  const skeleton = getSkeleton(letter);
  if (!skeleton) return false;
  
  const diagonalTypes: AnatomyType[] = ['diagonal', 'arm', 'leg'];
  return skeleton.anatomy.some(part => diagonalTypes.includes(part.type));
}

/**
 * Get the dominant anatomy type for a letter
 */
export function getDominantAnatomy(letter: string): AnatomyType | null {
  const skeleton = getSkeleton(letter);
  if (!skeleton) return null;
  
  const primaryPart = skeleton.anatomy.find(part => part.isPrimary);
  return primaryPart?.type || skeleton.anatomy[0]?.type || null;
}

// ============================================
// EXPORT SUMMARY
// ============================================

export const LETTER_SKELETON_SUMMARY = {
  totalLetters: 26,
  categories: {
    withBowls: ['B', 'D', 'O', 'P', 'Q', 'R'],
    withDiagonals: ['A', 'K', 'M', 'N', 'V', 'W', 'X', 'Y', 'Z'],
    withCurves: ['C', 'G', 'J', 'O', 'Q', 'S', 'U'],
    straightOnly: ['E', 'F', 'H', 'I', 'L', 'T'],
    withCrossbars: ['A', 'E', 'F', 'G', 'H'],
  },
  anatomyTypes: [
    'stem', 'bowl', 'crossbar', 'diagonal', 'terminal', 'apex', 
    'vertex', 'arm', 'leg', 'spine', 'bar', 'tail', 'spur', 
    'hook', 'arc', 'loop', 'counter', 'shoulder', 'ear', 'link',
    'baseline', 'capline'
  ] as AnatomyType[],
};
