/**
 * Semantic Logo Engine
 * 
 * Intelligent logo generation based on brand name meaning, industry context,
 * and aesthetic preferences. Maps 500+ keywords to abstract visual concepts.
 * 
 * Example: "Brewly" + Coffee + Minimal = steam rising from abstract B shape
 */

// ============================================
// KEYWORD-TO-SHAPE MAPPINGS (500+ words)
// ============================================

export interface ShapeMapping {
    shapes: string[];      // SVG path concepts
    algorithms: string[];  // Preferred logo algorithms
    colors?: string[];     // Suggested color types
    style?: string;        // Visual style hint
}

/**
 * Word meaning detection - maps keywords to abstract visual concepts
 */
export const KEYWORD_SHAPE_MAP: Record<string, ShapeMapping> = {
    // ============================================
    // FOOD & BEVERAGE
    // ============================================
    'coffee': { shapes: ['cup-silhouette', 'steam-curves', 'bean-shape', 'drip-circle'], algorithms: ['flow-gradient', 'wave-flow'], style: 'organic' },
    'tea': { shapes: ['cup-outline', 'leaf-accent', 'steam-wisps', 'pot-silhouette'], algorithms: ['flow-gradient', 'depth-geometry'], style: 'elegant' },
    'brew': { shapes: ['steam-rising', 'cup-abstract', 'drip-drop', 'bubble-cluster'], algorithms: ['flow-gradient', 'starburst'], style: 'warm' },
    'cafe': { shapes: ['cup-modern', 'counter-line', 'steam-wave'], algorithms: ['framed-letter', 'motion-lines'], style: 'minimal' },
    'roast': { shapes: ['flame-abstract', 'bean-split', 'heat-wave'], algorithms: ['starburst', 'flow-gradient'], style: 'bold' },
    'espresso': { shapes: ['shot-glass', 'crema-swirl', 'pressure-gauge'], algorithms: ['circle-overlap', 'depth-geometry'], style: 'premium' },
    'latte': { shapes: ['foam-art', 'milk-pour', 'layer-stack'], algorithms: ['flow-gradient', 'gradient-bars'], style: 'soft' },
    'bean': { shapes: ['bean-outline', 'split-seed', 'organic-oval'], algorithms: ['perfect-triangle', 'circle-overlap'], style: 'natural' },
    'bakery': { shapes: ['wheat-stalk', 'bread-curve', 'oven-arch'], algorithms: ['starburst', 'flow-gradient'], style: 'artisan' },
    'kitchen': { shapes: ['utensil-cross', 'pot-outline', 'flame-base'], algorithms: ['framed-letter', 'shield-badge'], style: 'home' },
    'chef': { shapes: ['hat-silhouette', 'knife-angle', 'flame-accent'], algorithms: ['framed-letter', 'motion-lines'], style: 'professional' },
    'food': { shapes: ['plate-circle', 'fork-knife', 'organic-blob'], algorithms: ['circle-overlap', 'starburst'], style: 'appetizing' },
    'pizza': { shapes: ['slice-triangle', 'circle-cut', 'steam-top'], algorithms: ['perfect-triangle', 'starburst'], style: 'fun' },
    'sushi': { shapes: ['roll-circle', 'chopstick-parallel', 'wave-base'], algorithms: ['circle-overlap', 'wave-flow'], style: 'minimal' },
    'burger': { shapes: ['stack-layers', 'bun-curve', 'seed-dots'], algorithms: ['gradient-bars', 'depth-geometry'], style: 'bold' },
    'wine': { shapes: ['glass-silhouette', 'grape-cluster', 'pour-curve'], algorithms: ['flow-gradient', 'depth-geometry'], style: 'elegant' },
    'beer': { shapes: ['mug-outline', 'foam-top', 'hop-cone'], algorithms: ['framed-letter', 'starburst'], style: 'craft' },
    'juice': { shapes: ['fruit-slice', 'drop-splash', 'citrus-wedge'], algorithms: ['circle-overlap', 'flow-gradient'], style: 'fresh' },
    'smoothie': { shapes: ['blend-swirl', 'fruit-mix', 'straw-line'], algorithms: ['flow-gradient', 'starburst'], style: 'vibrant' },
    'organic': { shapes: ['leaf-curl', 'root-branch', 'seed-sprout'], algorithms: ['flow-gradient', 'wave-flow'], style: 'natural' },
    'farm': { shapes: ['barn-peak', 'field-lines', 'sun-rise'], algorithms: ['mountain-peak', 'starburst'], style: 'rustic' },
    'harvest': { shapes: ['wheat-bundle', 'basket-arc', 'sun-rays'], algorithms: ['starburst', 'flow-gradient'], style: 'abundant' },

    // ============================================
    // BAGS & ACCESSORIES (Enhanced with specific primitives)
    // ============================================
    'bag': { shapes: ['handle-curves', 'tote-geometric-abstract', 'opening-fold', 'strap-loop', 'body-rectangle', 'clasp-circle'], algorithms: ['framed-letter', 'depth-geometry', 'flow-gradient'], style: 'fashion' },
    'tote': { shapes: ['tote-geometric-abstract', 'handle-curve-pair', 'fabric-fold-wave', 'base-rectangle', 'stitch-line'], algorithms: ['framed-letter', 'motion-lines', 'depth-geometry'], style: 'casual' },
    'purse': { shapes: ['clasp-detail-arc', 'chain-link-repeat', 'flap-curve-elegant', 'lock-mechanism', 'handle-short'], algorithms: ['depth-geometry', 'flow-gradient', 'diamond-gem'], style: 'luxury' },
    'handbag': { shapes: ['handle-curves', 'body-trapezoid', 'zipper-line-top', 'pocket-rectangle', 'logo-plate'], algorithms: ['framed-letter', 'depth-geometry', 'motion-lines'], style: 'premium' },
    'wallet': { shapes: ['fold-line-center', 'pocket-stack-layers', 'card-slot-grid', 'clasp-minimal', 'leather-edge'], algorithms: ['gradient-bars', 'framed-letter', 'depth-geometry'], style: 'minimal' },
    'backpack': { shapes: ['pack-outline-rounded', 'strap-x-cross', 'zipper-line-curve', 'pocket-front', 'buckle-detail'], algorithms: ['depth-geometry', 'shield-badge', 'motion-lines'], style: 'adventure' },
    'luggage': { shapes: ['case-rect-rounded', 'wheel-circle-pair', 'handle-pull-extend', 'lock-secure', 'shell-hard'], algorithms: ['framed-letter', 'depth-geometry', 'shield-badge'], style: 'travel' },
    'leather': { shapes: ['stitch-line-cross', 'texture-grain-pattern', 'edge-curve-burnished', 'grain-organic', 'patina-subtle'], algorithms: ['motion-lines', 'flow-gradient', 'depth-geometry'], style: 'craft' },
    'fashion': { shapes: ['runway-line-perspective', 'silhouette-curve-elegant', 'fabric-drape-flow', 'haute-angle', 'trend-wave'], algorithms: ['flow-gradient', 'motion-lines', 'starburst'], style: 'elegant' },
    'wear': { shapes: ['hanger-hook-minimal', 'fold-crease-sharp', 'fabric-wave-soft', 'collar-v', 'seam-line'], algorithms: ['motion-lines', 'flow-gradient', 'framed-letter'], style: 'style' },
    'accessory': { shapes: ['belt-loop', 'buckle-frame', 'chain-link', 'tassel-drop', 'charm-dangle'], algorithms: ['depth-geometry', 'circle-overlap', 'motion-lines'], style: 'detail' },

    // ============================================
    // CLOUD & TECH (Enhanced with Tech/SaaS primitives)
    // ============================================
    'cloud': { shapes: ['cumulus-rounded', 'server-stack', 'floating-dots', 'data-stream', 'node-cluster'], algorithms: ['circle-overlap', 'flow-gradient', 'orbital-rings'], style: 'tech' },
    'sync': { shapes: ['arrow-cycle', 'refresh-loop', 'circular-flow', 'sync-arrows-dual'], algorithms: ['infinity-loop', 'orbital-rings', 'motion-lines'], style: 'seamless' },
    'data': { shapes: ['bar-chart', 'node-network', 'stream-lines', 'data-flow-arrow', 'analytics-graph'], algorithms: ['gradient-bars', 'maze-pattern', 'orbital-paths'], style: 'analytical' },
    'server': { shapes: ['rack-stack', 'led-dots', 'cable-curve', 'server-blade', 'rack-unit'], algorithms: ['gradient-bars', 'depth-geometry', 'maze-pattern'], style: 'infrastructure' },
    'api': { shapes: ['node-brackets', 'bracket-pair', 'slash-angle', 'connect-dot', 'endpoint-circle'], algorithms: ['framed-letter', 'motion-lines', 'orbital-paths'], style: 'developer' },
    'code': { shapes: ['node-brackets', 'bracket-angle', 'cursor-line', 'syntax-block', 'terminal-cursor'], algorithms: ['framed-letter', 'gradient-bars', 'maze-pattern'], style: 'developer' },
    'dev': { shapes: ['terminal-prompt', 'branch-git', 'merge-arrow', 'code-commit', 'pipeline-flow'], algorithms: ['framed-letter', 'arrow-mark', 'motion-lines'], style: 'technical' },
    'saas': { shapes: ['node-brackets', 'cloud-connect', 'subscription-loop', 'dashboard-grid', 'api-endpoint'], algorithms: ['framed-letter', 'orbital-rings', 'gradient-bars'], style: 'platform' },
    'stack': { shapes: ['layer-pile', 'block-tower', 'level-shift', 'tech-stack-blocks', 'integration-layers'], algorithms: ['depth-geometry', 'gradient-bars', 'motion-lines'], style: 'structured' },
    'node': { shapes: ['node-brackets', 'dot-connect', 'network-web', 'junction-point', 'hub-spoke'], algorithms: ['orbital-paths', 'fingerprint-id', 'maze-pattern'], style: 'connected' },
    'pixel': { shapes: ['pixel-grid', 'grid-square', 'mosaic-tile', 'bitmap-dot', 'raster-pattern'], algorithms: ['maze-pattern', 'gradient-bars', 'depth-geometry'], style: 'digital' },
    'byte': { shapes: ['binary-pair', 'bit-block', 'data-unit', 'byte-stream', 'hex-pattern'], algorithms: ['framed-letter', 'gradient-bars', 'maze-pattern'], style: 'computing' },
    'tech': { shapes: ['circuit-path', 'node-brackets', 'pixel-grid', 'chip-pattern', 'signal-pulse'], algorithms: ['framed-letter', 'maze-pattern', 'orbital-paths'], style: 'innovative' },
    'software': { shapes: ['window-frame', 'code-block', 'layer-stack', 'module-grid', 'interface-element'], algorithms: ['framed-letter', 'depth-geometry', 'gradient-bars'], style: 'digital' },
    'platform': { shapes: ['foundation-base', 'integration-hub', 'api-gateway', 'connect-points', 'service-mesh'], algorithms: ['depth-geometry', 'orbital-paths', 'gradient-bars'], style: 'infrastructure' },
    'ai': { shapes: ['neural-node', 'brain-curve', 'spark-synapse', 'deep-layer', 'inference-path'], algorithms: ['orbital-paths', 'starburst', 'flow-gradient'], style: 'intelligent' },
    'ml': { shapes: ['graph-curve', 'training-arrow', 'model-layer', 'tensor-flow', 'gradient-descent'], algorithms: ['flow-gradient', 'gradient-bars', 'orbital-paths'], style: 'learning' },
    'bot': { shapes: ['face-simple', 'antenna-dot', 'chat-bubble', 'robot-head', 'speak-wave'], algorithms: ['framed-letter', 'circle-overlap', 'starburst'], style: 'friendly' },
    'auto': { shapes: ['gear-tooth', 'cycle-arrow', 'flow-auto', 'process-loop', 'automation-cog'], algorithms: ['infinity-loop', 'orbital-rings', 'motion-lines'], style: 'automated' },
    'smart': { shapes: ['bulb-glow', 'connect-dot', 'think-cloud', 'idea-spark', 'intelligence-aura'], algorithms: ['starburst', 'orbital-paths', 'flow-gradient'], style: 'intelligent' },
    'digital': { shapes: ['screen-frame', 'pixel-grid', 'signal-wave', 'binary-stream', 'interface-clean'], algorithms: ['framed-letter', 'wave-flow', 'gradient-bars'], style: 'modern' },
    'cyber': { shapes: ['shield-hex', 'lock-circuit', 'scan-line', 'firewall-barrier', 'secure-grid'], algorithms: ['shield-badge', 'maze-pattern', 'lock-secure'], style: 'secure' },
    'meta': { shapes: ['infinity-twist', 'dimension-fold', 'portal-ring', 'multiverse-layer', 'vr-horizon'], algorithms: ['infinity-loop', 'orbital-rings', 'depth-geometry'], style: 'virtual' },
    'virtual': { shapes: ['vr-headset', 'dimension-grid', 'portal-frame', 'immersive-sphere', 'reality-warp'], algorithms: ['depth-geometry', 'orbital-rings', 'flow-gradient'], style: 'immersive' },
    'quantum': { shapes: ['superposition-blur', 'particle-wave', 'entangle-link', 'qubit-state', 'probability-cloud'], algorithms: ['orbital-paths', 'wave-flow', 'starburst'], style: 'scientific' },


    // ============================================
    // WAVE & MOTION
    // ============================================
    'wave': { shapes: ['sine-curve', 'water-flow', 'sound-frequency', 'ocean-swell'], algorithms: ['wave-flow', 'motion-lines', 'sound-waves'], style: 'dynamic' },
    'flow': { shapes: ['stream-curve', 'liquid-path', 'air-current'], algorithms: ['flow-gradient', 'wave-flow'], style: 'fluid' },
    'stream': { shapes: ['river-bend', 'data-flow', 'continuous-line'], algorithms: ['flow-gradient', 'motion-lines'], style: 'continuous' },
    'pulse': { shapes: ['heartbeat-line', 'signal-peak', 'rhythm-wave'], algorithms: ['wave-flow', 'motion-lines'], style: 'alive' },
    'vibrant': { shapes: ['energy-burst', 'color-splash', 'motion-blur'], algorithms: ['starburst', 'flow-gradient'], style: 'energetic' },
    'rhythm': { shapes: ['beat-bar', 'wave-pattern', 'tempo-line'], algorithms: ['gradient-bars', 'wave-flow'], style: 'musical' },
    'sound': { shapes: ['frequency-bar', 'speaker-cone', 'wave-ripple'], algorithms: ['sound-waves', 'gradient-bars'], style: 'audio' },
    'audio': { shapes: ['waveform-visual', 'speaker-icon', 'volume-bar'], algorithms: ['sound-waves', 'gradient-bars'], style: 'sonic' },
    'music': { shapes: ['note-symbol', 'staff-line', 'rhythm-curve'], algorithms: ['wave-flow', 'starburst'], style: 'melodic' },
    'voice': { shapes: ['speech-wave', 'mic-silhouette', 'sound-emanate'], algorithms: ['sound-waves', 'flow-gradient'], style: 'expressive' },
    'echo': { shapes: ['ripple-expand', 'fade-wave', 'repeat-arc'], algorithms: ['circle-overlap', 'wave-flow'], style: 'resonant' },

    // ============================================
    // NATURE & ENVIRONMENT
    // ============================================
    'leaf': { shapes: ['leaf-vein', 'stem-curve', 'organic-tip'], algorithms: ['flow-gradient', 'wave-flow'], style: 'natural' },
    'tree': { shapes: ['trunk-base', 'branch-spread', 'canopy-round'], algorithms: ['starburst', 'depth-geometry'], style: 'growth' },
    'forest': { shapes: ['tree-row', 'pine-peak', 'undergrowth-layer'], algorithms: ['gradient-bars', 'mountain-peak'], style: 'wilderness' },
    'plant': { shapes: ['sprout-curve', 'pot-base', 'growth-stem'], algorithms: ['flow-gradient', 'starburst'], style: 'botanical' },
    'flower': { shapes: ['petal-radial', 'bloom-center', 'stem-support'], algorithms: ['starburst', 'circle-overlap'], style: 'floral' },
    'seed': { shapes: ['seed-oval', 'sprout-emerge', 'potential-dot'], algorithms: ['circle-overlap', 'flow-gradient'], style: 'origin' },
    'root': { shapes: ['branch-down', 'ground-spread', 'anchor-base'], algorithms: ['starburst', 'orbital-paths'], style: 'grounded' },
    'sun': { shapes: ['ray-burst', 'circle-glow', 'rise-arc'], algorithms: ['starburst', 'circle-overlap'], style: 'bright' },
    'moon': { shapes: ['crescent-curve', 'phase-shadow', 'night-glow'], algorithms: ['moon-phase', 'circle-overlap'], style: 'celestial' },
    'star': { shapes: ['point-radial', 'twinkle-burst', 'constellation-dot'], algorithms: ['star-mark', 'starburst'], style: 'stellar' },
    'sky': { shapes: ['cloud-float', 'gradient-fade', 'horizon-line'], algorithms: ['flow-gradient', 'wave-flow'], style: 'expansive' },
    'ocean': { shapes: ['wave-layer', 'depth-fade', 'current-flow'], algorithms: ['wave-flow', 'flow-gradient'], style: 'vast' },
    'river': { shapes: ['meander-curve', 'flow-path', 'bank-edge'], algorithms: ['flow-gradient', 'motion-lines'], style: 'flowing' },
    'mountain': { shapes: ['peak-triangle', 'range-layer', 'summit-point'], algorithms: ['mountain-peak', 'depth-geometry'], style: 'majestic' },
    'earth': { shapes: ['globe-curve', 'continent-shape', 'orbit-ring'], algorithms: ['circle-overlap', 'orbital-rings'], style: 'global' },
    'eco': { shapes: ['recycle-arrow', 'leaf-circle', 'green-loop'], algorithms: ['infinity-loop', 'flow-gradient'], style: 'sustainable' },
    'green': { shapes: ['leaf-accent', 'growth-arrow', 'nature-curve'], algorithms: ['flow-gradient', 'starburst'], style: 'environmental' },
    'water': { shapes: ['drop-shape', 'ripple-circle', 'wave-surface'], algorithms: ['flow-gradient', 'circle-overlap'], style: 'fluid' },
    'fire': { shapes: ['flame-tongue', 'ember-glow', 'heat-rise'], algorithms: ['starburst', 'flow-gradient'], style: 'intense' },
    'air': { shapes: ['wind-curve', 'breeze-line', 'current-flow'], algorithms: ['motion-lines', 'wave-flow'], style: 'light' },
    'stone': { shapes: ['rock-facet', 'mineral-edge', 'solid-base'], algorithms: ['depth-geometry', 'perfect-triangle'], style: 'solid' },
    'crystal': { shapes: ['facet-angle', 'prism-light', 'gem-cut'], algorithms: ['diamond-gem', 'depth-geometry'], style: 'precious' },

    // ============================================
    // FINANCE & BUSINESS (Enhanced with Fintech primitives)
    // ============================================
    'finance': { shapes: ['chart-rise', 'bar-growth', 'coin-stack', 'arrow-precision', 'growth-trend'], algorithms: ['gradient-bars', 'arrow-mark', 'depth-geometry'], style: 'professional' },
    'fintech': { shapes: ['shield-vector', 'locked-growth', 'arrow-precision', 'circuit-coin', 'digital-currency', 'secure-transaction'], algorithms: ['shield-badge', 'lock-secure', 'arrow-mark', 'gradient-bars'], style: 'innovative' },
    'bank': { shapes: ['column-pillar', 'vault-door', 'shield-vector', 'safe-lock', 'institution-facade'], algorithms: ['framed-letter', 'depth-geometry', 'shield-badge'], style: 'trust' },
    'pay': { shapes: ['card-swipe', 'checkmark-confirm', 'transfer-arrow', 'arrow-precision', 'instant-flash'], algorithms: ['arrow-mark', 'motion-lines', 'starburst'], style: 'instant' },
    'money': { shapes: ['currency-symbol', 'coin-circle', 'bill-fold', 'value-stack', 'wealth-shine'], algorithms: ['framed-letter', 'circle-overlap', 'depth-geometry'], style: 'value' },
    'invest': { shapes: ['locked-growth', 'growth-arrow', 'seed-money', 'compound-stack', 'portfolio-chart'], algorithms: ['arrow-mark', 'gradient-bars', 'depth-geometry'], style: 'growth' },
    'trade': { shapes: ['exchange-arrow', 'market-chart', 'balance-scale', 'candlestick-pattern', 'bid-ask-flow'], algorithms: ['arrow-mark', 'motion-lines', 'gradient-bars'], style: 'dynamic' },
    'wealth': { shapes: ['accumulate-stack', 'diamond-gem', 'crown-peak', 'locked-growth', 'prosperity-arc'], algorithms: ['depth-geometry', 'diamond-gem', 'starburst'], style: 'premium' },
    'crypto': { shapes: ['blockchain-link', 'hash-pattern', 'decentralized-node', 'token-circle', 'chain-secure'], algorithms: ['maze-pattern', 'orbital-paths', 'lock-secure'], style: 'disruptive' },
    'insurance': { shapes: ['umbrella-cover', 'shield-vector', 'safety-net', 'protection-circle', 'coverage-arc'], algorithms: ['shield-badge', 'framed-letter', 'circle-overlap'], style: 'protective' },
    'payment': { shapes: ['card-chip', 'contactless-wave', 'arrow-precision', 'secure-check', 'tap-circle'], algorithms: ['motion-lines', 'circle-overlap', 'arrow-mark'], style: 'seamless' },
    'capital': { shapes: ['pillar-strong', 'locked-growth', 'foundation-base', 'accumulation-stack', 'institution-solid'], algorithms: ['depth-geometry', 'gradient-bars', 'framed-letter'], style: 'substantial' },


    // ============================================
    // HEALTHCARE & WELLNESS
    // ============================================
    'health': { shapes: ['heart-pulse', 'cross-medical', 'life-circle'], algorithms: ['circle-overlap', 'flow-gradient'], style: 'care' },
    'medical': { shapes: ['cross-symbol', 'stethoscope-curve', 'pill-capsule'], algorithms: ['framed-letter', 'circle-overlap'], style: 'clinical' },
    'care': { shapes: ['hand-hold', 'heart-embrace', 'nurture-curve'], algorithms: ['flow-gradient', 'circle-overlap'], style: 'compassionate' },
    'wellness': { shapes: ['balance-scale', 'zen-circle', 'lotus-bloom'], algorithms: ['circle-overlap', 'starburst'], style: 'holistic' },
    'fitness': { shapes: ['muscle-flex', 'heart-beat', 'motion-run'], algorithms: ['motion-lines', 'arrow-mark'], style: 'active' },
    'yoga': { shapes: ['pose-silhouette', 'breath-flow', 'lotus-seat'], algorithms: ['flow-gradient', 'starburst'], style: 'zen' },
    'mind': { shapes: ['brain-curve', 'thought-bubble', 'neural-path'], algorithms: ['orbital-paths', 'flow-gradient'], style: 'cognitive' },
    'therapy': { shapes: ['hand-support', 'spiral-heal', 'path-progress'], algorithms: ['flow-gradient', 'infinity-loop'], style: 'healing' },
    'pharma': { shapes: ['pill-shape', 'molecule-bond', 'rx-symbol'], algorithms: ['circle-overlap', 'framed-letter'], style: 'scientific' },
    'lab': { shapes: ['flask-beaker', 'molecule-structure', 'test-tube'], algorithms: ['depth-geometry', 'orbital-paths'], style: 'research' },
    'bio': { shapes: ['dna-helix', 'cell-divide', 'life-cycle'], algorithms: ['dna-helix', 'infinity-loop'], style: 'life-science' },

    // ============================================
    // TRAVEL & TRANSPORTATION
    // ============================================
    'travel': { shapes: ['compass-point', 'globe-meridian', 'airplane-silhouette', 'path-line'], algorithms: ['arrow-mark', 'orbital-rings'], style: 'adventure' },
    'fly': { shapes: ['wing-curve', 'takeoff-angle', 'sky-arc'], algorithms: ['motion-lines', 'arrow-mark'], style: 'freedom' },
    'trip': { shapes: ['road-stretch', 'destination-pin', 'journey-curve'], algorithms: ['motion-lines', 'flow-gradient'], style: 'adventure' },
    'voyage': { shapes: ['ship-sail', 'horizon-line', 'compass-rose'], algorithms: ['starburst', 'wave-flow'], style: 'epic' },
    'explore': { shapes: ['compass-needle', 'telescope-scope', 'map-unfold'], algorithms: ['arrow-mark', 'starburst'], style: 'discovery' },
    'jet': { shapes: ['speed-line', 'thrust-flame', 'altitude-climb'], algorithms: ['motion-lines', 'arrow-mark'], style: 'fast' },
    'cruise': { shapes: ['ship-bow', 'wave-wake', 'deck-layer'], algorithms: ['wave-flow', 'depth-geometry'], style: 'luxury' },
    'road': { shapes: ['highway-stretch', 'lane-line', 'horizon-vanish'], algorithms: ['gradient-bars', 'motion-lines'], style: 'journey' },
    'drive': { shapes: ['wheel-turn', 'dashboard-arc', 'speed-needle'], algorithms: ['circle-overlap', 'motion-lines'], style: 'dynamic' },
    'ride': { shapes: ['wheel-motion', 'seat-curve', 'path-forward'], algorithms: ['motion-lines', 'circle-overlap'], style: 'smooth' },
    'transit': { shapes: ['rail-track', 'station-dot', 'route-map'], algorithms: ['gradient-bars', 'orbital-paths'], style: 'connected' },
    'metro': { shapes: ['underground-circle', 'tunnel-arc', 'stop-dot'], algorithms: ['circle-overlap', 'framed-letter'], style: 'urban' },
    'space': { shapes: ['rocket-ascent', 'orbit-path', 'star-field'], algorithms: ['orbital-rings', 'starburst'], style: 'cosmic' },

    // ============================================
    // SECURITY & TRUST
    // ============================================
    'secure': { shapes: ['lock-solid', 'shield-strong', 'key-insert'], algorithms: ['lock-secure', 'shield-badge'], style: 'protected' },
    'safe': { shapes: ['vault-circle', 'barrier-line', 'check-confirm'], algorithms: ['shield-badge', 'lock-secure'], style: 'trusted' },
    'protect': { shapes: ['shield-cover', 'umbrella-span', 'wall-barrier'], algorithms: ['shield-badge', 'framed-letter'], style: 'defensive' },
    'guard': { shapes: ['shield-front', 'watch-eye', 'stance-solid'], algorithms: ['shield-badge', 'eye-vision'], style: 'vigilant' },
    'trust': { shapes: ['handshake-meet', 'heart-core', 'foundation-base'], algorithms: ['circle-overlap', 'framed-letter'], style: 'reliable' },
    'verify': { shapes: ['checkmark-bold', 'scan-line', 'confirm-circle'], algorithms: ['framed-letter', 'circle-overlap'], style: 'authentic' },
    'auth': { shapes: ['key-symbol', 'fingerprint-whorl', 'access-gate'], algorithms: ['fingerprint-id', 'lock-secure'], style: 'identity' },
    'identity': { shapes: ['fingerprint-unique', 'face-outline', 'id-badge'], algorithms: ['fingerprint-id', 'framed-letter'], style: 'personal' },
    'privacy': { shapes: ['mask-cover', 'shield-eye', 'lock-data'], algorithms: ['shield-badge', 'eye-vision'], style: 'confidential' },

    // ============================================
    // COMMUNICATION & SOCIAL
    // ============================================
    'chat': { shapes: ['bubble-speech', 'ellipsis-typing', 'message-corner'], algorithms: ['circle-overlap', 'framed-letter'], style: 'conversational' },
    'talk': { shapes: ['speech-wave', 'mouth-curve', 'dialogue-pair'], algorithms: ['wave-flow', 'circle-overlap'], style: 'verbal' },
    'connect': { shapes: ['link-chain', 'bridge-span', 'node-join'], algorithms: ['orbital-paths', 'infinity-loop'], style: 'relational' },
    'social': { shapes: ['people-cluster', 'network-web', 'community-circle'], algorithms: ['circle-overlap', 'orbital-paths'], style: 'communal' },
    'share': { shapes: ['branch-out', 'send-arrow', 'spread-nodes'], algorithms: ['starburst', 'orbital-paths'], style: 'generous' },
    'meet': { shapes: ['handshake-cross', 'table-oval', 'video-frame'], algorithms: ['circle-overlap', 'framed-letter'], style: 'collaborative' },
    'team': { shapes: ['people-row', 'unity-circle', 'together-stack'], algorithms: ['circle-overlap', 'gradient-bars'], style: 'unified' },
    'community': { shapes: ['house-cluster', 'hands-together', 'circle-of-people'], algorithms: ['circle-overlap', 'starburst'], style: 'inclusive' },

    // ============================================
    // CREATIVE & ART
    // ============================================
    'design': { shapes: ['pen-tool', 'artboard-frame', 'curve-bezier'], algorithms: ['flow-gradient', 'framed-letter'], style: 'creative' },
    'art': { shapes: ['brush-stroke', 'palette-colors', 'canvas-frame'], algorithms: ['flow-gradient', 'starburst'], style: 'expressive' },
    'create': { shapes: ['spark-idea', 'hand-craft', 'build-block'], algorithms: ['starburst', 'depth-geometry'], style: 'inventive' },
    'studio': { shapes: ['spotlight-cone', 'easel-frame', 'workspace-desk'], algorithms: ['depth-geometry', 'framed-letter'], style: 'professional' },
    'photo': { shapes: ['aperture-iris', 'frame-border', 'flash-burst'], algorithms: ['circle-overlap', 'starburst'], style: 'capture' },
    'video': { shapes: ['play-triangle', 'film-strip', 'record-circle'], algorithms: ['perfect-triangle', 'gradient-bars'], style: 'motion' },
    'media': { shapes: ['screen-multi', 'broadcast-wave', 'content-grid'], algorithms: ['gradient-bars', 'starburst'], style: 'dynamic' },
    'pixels': { shapes: ['grid-square', 'mosaic-tile', 'raster-dot'], algorithms: ['maze-pattern', 'gradient-bars'], style: 'digital' },
    'ink': { shapes: ['drop-splash', 'pen-flow', 'print-press'], algorithms: ['flow-gradient', 'starburst'], style: 'print' },
    'canvas': { shapes: ['frame-border', 'texture-weave', 'surface-flat'], algorithms: ['framed-letter', 'gradient-bars'], style: 'foundation' },

    // ============================================
    // GROWTH & PROGRESS
    // ============================================
    'grow': { shapes: ['sprout-up', 'arrow-rise', 'expand-circle'], algorithms: ['arrow-mark', 'starburst'], style: 'ascending' },
    'launch': { shapes: ['rocket-blast', 'trajectory-arc', 'lift-off'], algorithms: ['arrow-mark', 'motion-lines'], style: 'explosive' },
    'start': { shapes: ['ignite-spark', 'first-step', 'origin-point'], algorithms: ['starburst', 'circle-overlap'], style: 'beginning' },
    'boost': { shapes: ['thrust-arrow', 'accelerate-line', 'power-up'], algorithms: ['arrow-mark', 'motion-lines'], style: 'amplified' },
    'level': { shapes: ['tier-stack', 'progress-bar', 'step-climb'], algorithms: ['gradient-bars', 'depth-geometry'], style: 'progression' },
    'scale': { shapes: ['expand-diagonal', 'multiply-grid', 'growth-curve'], algorithms: ['starburst', 'gradient-bars'], style: 'exponential' },
    'rise': { shapes: ['ascend-line', 'sun-horizon', 'elevate-arrow'], algorithms: ['arrow-mark', 'starburst'], style: 'upward' },
    'peak': { shapes: ['summit-point', 'achievement-flag', 'apex-triangle'], algorithms: ['mountain-peak', 'perfect-triangle'], style: 'pinnacle' },
    'next': { shapes: ['forward-arrow', 'step-ahead', 'future-horizon'], algorithms: ['arrow-mark', 'motion-lines'], style: 'progressive' },
    'future': { shapes: ['horizon-fade', 'path-forward', 'tomorrow-glow'], algorithms: ['flow-gradient', 'arrow-mark'], style: 'forward' },
    'new': { shapes: ['spark-fresh', 'dawn-glow', 'birth-emerge'], algorithms: ['starburst', 'circle-overlap'], style: 'novel' },
    'prime': { shapes: ['first-place', 'gold-star', 'premium-mark'], algorithms: ['star-mark', 'diamond-gem'], style: 'top-tier' },
    'ultra': { shapes: ['beyond-limit', 'extreme-edge', 'max-power'], algorithms: ['starburst', 'motion-lines'], style: 'extreme' },
    'mega': { shapes: ['large-scale', 'massive-block', 'grand-arc'], algorithms: ['depth-geometry', 'starburst'], style: 'grand' },
    'hyper': { shapes: ['speed-trail', 'overdrive-line', 'intense-burst'], algorithms: ['motion-lines', 'starburst'], style: 'intense' },

    // ============================================
    // ABSTRACT CONCEPTS
    // ============================================
    'core': { shapes: ['center-nucleus', 'essential-dot', 'heart-middle'], algorithms: ['circle-overlap', 'starburst'], style: 'fundamental' },
    'hub': { shapes: ['central-node', 'spoke-radial', 'connect-center'], algorithms: ['starburst', 'orbital-paths'], style: 'central' },
    'link': { shapes: ['chain-connect', 'bridge-span', 'bond-line'], algorithms: ['infinity-loop', 'motion-lines'], style: 'connected' },
    'loop': { shapes: ['circle-infinite', 'cycle-return', 'continuous-band'], algorithms: ['infinity-loop', 'orbital-rings'], style: 'endless' },
    'bridge': { shapes: ['arch-span', 'connect-pillars', 'cross-gap'], algorithms: ['depth-geometry', 'framed-letter'], style: 'connecting' },
    'spark': { shapes: ['ignite-flash', 'idea-burst', 'energy-crackle'], algorithms: ['starburst', 'motion-lines'], style: 'energetic' },
    'glow': { shapes: ['radiate-light', 'soft-halo', 'warm-aura'], algorithms: ['circle-overlap', 'flow-gradient'], style: 'luminous' },
    'bold': { shapes: ['strong-block', 'impact-strike', 'statement-mark'], algorithms: ['framed-letter', 'depth-geometry'], style: 'powerful' },
    'swift': { shapes: ['speed-streak', 'quick-arrow', 'agile-curve'], algorithms: ['motion-lines', 'arrow-mark'], style: 'fast' },
    'zen': { shapes: ['circle-enso', 'stone-balance', 'calm-wave'], algorithms: ['circle-overlap', 'flow-gradient'], style: 'peaceful' },
    'pure': { shapes: ['clean-circle', 'simple-form', 'essence-dot'], algorithms: ['circle-overlap', 'framed-letter'], style: 'minimal' },
    'edge': { shapes: ['sharp-angle', 'blade-line', 'cutting-point'], algorithms: ['perfect-triangle', 'arrow-mark'], style: 'sharp' },
    'apex': { shapes: ['peak-point', 'top-triangle', 'summit-mark'], algorithms: ['mountain-peak', 'perfect-triangle'], style: 'pinnacle' },
    'base': { shapes: ['foundation-block', 'ground-line', 'support-platform'], algorithms: ['depth-geometry', 'gradient-bars'], style: 'foundational' },
    'matrix': { shapes: ['grid-intersect', 'data-field', 'array-pattern'], algorithms: ['maze-pattern', 'gradient-bars'], style: 'structured' },
    'axis': { shapes: ['cross-center', 'coordinate-point', 'pivot-line'], algorithms: ['framed-letter', 'motion-lines'], style: 'balanced' },
    'vertex': { shapes: ['point-meet', 'corner-angle', 'junction-node'], algorithms: ['perfect-triangle', 'orbital-paths'], style: 'precise' },
    'prism': { shapes: ['refract-light', 'facet-split', 'spectrum-ray'], algorithms: ['depth-geometry', 'diamond-gem'], style: 'multifaceted' },
    'nexus': { shapes: ['join-point', 'connection-hub', 'merge-center'], algorithms: ['orbital-paths', 'starburst'], style: 'convergent' },
    'helix': { shapes: ['spiral-twist', 'dna-strand', 'coil-ascend'], algorithms: ['dna-helix', 'flow-gradient'], style: 'dynamic' },
    'orbit': { shapes: ['ellipse-path', 'satellite-ring', 'gravitational-curve'], algorithms: ['orbital-rings', 'circle-overlap'], style: 'cosmic' },
    'nova': { shapes: ['explode-star', 'bright-burst', 'cosmic-flash'], algorithms: ['starburst', 'circle-overlap'], style: 'explosive' },
    'reverb': { shapes: ['ripple-repeat', 'fade-wave', 'sound-return'], algorithms: ['circle-overlap', 'wave-flow'], style: 'resonant' },
    'flux': { shapes: ['change-flow', 'morph-shape', 'transition-blend'], algorithms: ['flow-gradient', 'wave-flow'], style: 'changing' },
    'aura': { shapes: ['glow-surround', 'energy-field', 'presence-halo'], algorithms: ['circle-overlap', 'flow-gradient'], style: 'ethereal' },
    'ember': { shapes: ['glow-coal', 'warm-spark', 'fade-heat'], algorithms: ['starburst', 'flow-gradient'], style: 'warm' },
    'frost': { shapes: ['crystal-branch', 'ice-pattern', 'cold-edge'], algorithms: ['starburst', 'maze-pattern'], style: 'cool' },
    'mist': { shapes: ['fog-fade', 'cloud-blur', 'vapor-soft'], algorithms: ['flow-gradient', 'circle-overlap'], style: 'ethereal' },
    'dawn': { shapes: ['horizon-glow', 'first-light', 'morning-arc'], algorithms: ['starburst', 'flow-gradient'], style: 'hopeful' },
    'dusk': { shapes: ['sunset-fade', 'evening-gradient', 'twilight-blend'], algorithms: ['flow-gradient', 'gradient-bars'], style: 'transitional' },
};

// ============================================
// INDUSTRY TO SHAPE MAPPINGS
// ============================================

export interface IndustryMapping {
    shapes: string[];
    algorithms: string[];
    colors: string[];
    style: string;
    keywords: string[];
}

export const INDUSTRY_SHAPE_MAP: Record<string, IndustryMapping> = {
    'fintech': {
        shapes: ['shield-protect', 'lock-solid', 'arrow-growth', 'chart-line', 'coin-stack', 'secure-badge'],
        algorithms: ['shield-badge', 'lock-secure', 'arrow-mark', 'gradient-bars'],
        colors: ['trust-blue', 'secure-green', 'professional-navy'],
        style: 'modern-trust',
        keywords: ['finance', 'bank', 'pay', 'money', 'invest', 'trade', 'crypto', 'secure']
    },
    'healthcare': {
        shapes: ['cross-medical', 'heart-pulse', 'leaf-health', 'shield-care', 'hand-support', 'dna-strand'],
        algorithms: ['circle-overlap', 'flow-gradient', 'framed-letter', 'dna-helix'],
        colors: ['care-blue', 'health-green', 'trust-teal', 'calm-white'],
        style: 'clean-caring',
        keywords: ['health', 'medical', 'care', 'wellness', 'pharma', 'bio', 'therapy']
    },
    'food': {
        shapes: ['utensil-cross', 'plate-circle', 'flame-cook', 'leaf-organic', 'chef-hat', 'steam-rise'],
        algorithms: ['starburst', 'circle-overlap', 'flow-gradient', 'framed-letter'],
        colors: ['appetite-red', 'fresh-green', 'warm-orange', 'earth-brown'],
        style: 'appetizing-warm',
        keywords: ['restaurant', 'cafe', 'kitchen', 'chef', 'cook', 'eat', 'taste', 'flavor']
    },
    'travel': {
        shapes: ['compass-point', 'globe-meridian', 'airplane-silhouette', 'path-road', 'mountain-peak', 'wave-ocean'],
        algorithms: ['arrow-mark', 'orbital-rings', 'mountain-peak', 'wave-flow'],
        colors: ['sky-blue', 'earth-brown', 'sunset-orange', 'ocean-teal'],
        style: 'adventure-freedom',
        keywords: ['travel', 'fly', 'trip', 'voyage', 'explore', 'adventure', 'journey']
    },
    'tech': {
        shapes: ['circuit-line', 'node-network', 'bracket-code', 'pixel-grid', 'signal-wave', 'chip-pattern'],
        algorithms: ['framed-letter', 'maze-pattern', 'orbital-paths', 'gradient-bars'],
        colors: ['electric-blue', 'cyber-purple', 'neon-green', 'dark-slate'],
        style: 'modern-innovative',
        keywords: ['tech', 'software', 'digital', 'code', 'dev', 'app', 'data', 'cloud', 'ai']
    },
    'education': {
        shapes: ['book-open', 'graduation-cap', 'lightbulb-idea', 'pencil-write', 'brain-learn', 'path-growth'],
        algorithms: ['framed-letter', 'starburst', 'arrow-mark', 'circle-overlap'],
        colors: ['knowledge-blue', 'growth-green', 'wisdom-purple', 'classic-navy'],
        style: 'academic-inspiring',
        keywords: ['learn', 'study', 'school', 'teach', 'knowledge', 'academy', 'course']
    },
    'ecommerce': {
        shapes: ['cart-bag', 'tag-price', 'box-package', 'arrow-fast', 'star-review', 'checkmark-confirm'],
        algorithms: ['framed-letter', 'arrow-mark', 'gradient-bars', 'circle-overlap'],
        colors: ['action-orange', 'trust-blue', 'deal-red', 'confirm-green'],
        style: 'fast-trustworthy',
        keywords: ['shop', 'store', 'buy', 'sell', 'cart', 'deal', 'order', 'delivery']
    },
    'fitness': {
        shapes: ['muscle-flex', 'heart-beat', 'motion-run', 'energy-bolt', 'weight-lift', 'progress-chart'],
        algorithms: ['motion-lines', 'arrow-mark', 'starburst', 'gradient-bars'],
        colors: ['energy-orange', 'power-red', 'vitality-green', 'strength-black'],
        style: 'dynamic-powerful',
        keywords: ['fitness', 'gym', 'workout', 'train', 'health', 'strong', 'active']
    },
    'beauty': {
        shapes: ['flower-petal', 'drop-essence', 'leaf-natural', 'mirror-reflect', 'brush-stroke', 'sparkle-glow'],
        algorithms: ['flow-gradient', 'circle-overlap', 'starburst', 'wave-flow'],
        colors: ['rose-pink', 'gold-luxury', 'nude-soft', 'lavender-calm'],
        style: 'elegant-luxurious',
        keywords: ['beauty', 'cosmetic', 'skin', 'hair', 'spa', 'glow', 'radiant']
    },
    'legal': {
        shapes: ['scale-balance', 'pillar-column', 'shield-protect', 'gavel-justice', 'book-law', 'handshake-trust'],
        algorithms: ['framed-letter', 'shield-badge', 'depth-geometry', 'gradient-bars'],
        colors: ['authority-navy', 'trust-gold', 'classic-burgundy', 'dignity-charcoal'],
        style: 'authoritative-trustworthy',
        keywords: ['law', 'legal', 'attorney', 'justice', 'court', 'firm', 'counsel']
    },
    'realestate': {
        shapes: ['house-roof', 'key-unlock', 'window-frame', 'door-open', 'building-rise', 'location-pin'],
        algorithms: ['framed-letter', 'depth-geometry', 'arrow-mark', 'gradient-bars'],
        colors: ['trust-blue', 'home-green', 'luxury-gold', 'solid-gray'],
        style: 'solid-trustworthy',
        keywords: ['home', 'house', 'property', 'estate', 'realtor', 'build', 'invest']
    },
    'entertainment': {
        shapes: ['play-triangle', 'star-burst', 'spotlight-cone', 'ticket-stub', 'film-reel', 'music-note'],
        algorithms: ['starburst', 'perfect-triangle', 'motion-lines', 'gradient-bars'],
        colors: ['excitement-red', 'spotlight-gold', 'night-purple', 'energy-orange'],
        style: 'exciting-dynamic',
        keywords: ['entertainment', 'movie', 'music', 'show', 'event', 'game', 'fun']
    },
    'sustainability': {
        shapes: ['leaf-eco', 'recycle-arrow', 'sun-energy', 'water-drop', 'earth-globe', 'wind-turbine'],
        algorithms: ['flow-gradient', 'infinity-loop', 'circle-overlap', 'starburst'],
        colors: ['earth-green', 'ocean-blue', 'sun-yellow', 'soil-brown'],
        style: 'natural-responsible',
        keywords: ['eco', 'green', 'sustainable', 'organic', 'natural', 'clean', 'renewable']
    }
};

// ============================================
// LETTER SHAPE ANALYSIS
// ============================================

export interface LetterAnalysis {
    letter: string;
    shapes: string[];
    hiddenMeanings: string[];
    negativeSpace: string[];
}

export const LETTER_SHAPE_MAP: Record<string, LetterAnalysis> = {
    'A': { letter: 'A', shapes: ['triangle-peak', 'mountain-form', 'arrow-up'], hiddenMeanings: ['growth', 'aspiration', 'stability'], negativeSpace: ['triangle-void', 'tent-opening'] },
    'B': { letter: 'B', shapes: ['double-curve', 'stacked-bumps', 'belly-form'], hiddenMeanings: ['fullness', 'abundance', 'comfort'], negativeSpace: ['13-hidden', 'dual-circles'] },
    'C': { letter: 'C', shapes: ['crescent-moon', 'embrace-curve', 'open-circle'], hiddenMeanings: ['openness', 'receptivity', 'cycle'], negativeSpace: ['pac-man', 'bite-taken'] },
    'D': { letter: 'D', shapes: ['half-circle', 'dome-arch', 'belly-right'], hiddenMeanings: ['protection', 'shelter', 'completion'], negativeSpace: ['sunrise-horizon'] },
    'E': { letter: 'E', shapes: ['triple-bar', 'comb-teeth', 'stack-lines'], hiddenMeanings: ['equality', 'layers', 'balance'], negativeSpace: ['three-spaces'] },
    'F': { letter: 'F', shapes: ['flag-pole', 'double-arm', 'branch-top'], hiddenMeanings: ['forward', 'signal', 'direction'], negativeSpace: ['missing-base'] },
    'G': { letter: 'G', shapes: ['spiral-entry', 'coin-slot', 'c-with-bar'], hiddenMeanings: ['gravity', 'center', 'return'], negativeSpace: ['arrow-inward'] },
    'H': { letter: 'H', shapes: ['pillar-pair', 'bridge-span', 'ladder-rung'], hiddenMeanings: ['support', 'connection', 'stability'], negativeSpace: ['window-pair'] },
    'I': { letter: 'I', shapes: ['pillar-single', 'beam-vertical', 'serif-ends'], hiddenMeanings: ['self', 'individual', 'focus'], negativeSpace: ['minimal-void'] },
    'J': { letter: 'J', shapes: ['hook-bottom', 'cane-curve', 'swing-arc'], hiddenMeanings: ['journey-end', 'landing', 'anchor'], negativeSpace: ['j-curve-space'] },
    'K': { letter: 'K', shapes: ['thrust-angles', 'kick-out', 'arrow-pair'], hiddenMeanings: ['action', 'dynamic', 'diverge'], negativeSpace: ['v-split'] },
    'L': { letter: 'L', shapes: ['corner-right', 'base-line', 'floor-wall'], hiddenMeanings: ['foundation', 'support', 'ground'], negativeSpace: ['large-open'] },
    'M': { letter: 'M', shapes: ['mountain-peaks', 'crown-points', 'wave-tops'], hiddenMeanings: ['magnitude', 'strength', 'stability'], negativeSpace: ['twin-valleys'] },
    'N': { letter: 'N', shapes: ['diagonal-bridge', 'lightning-bolt', 'ramp-up'], hiddenMeanings: ['connection', 'energy', 'progress'], negativeSpace: ['twin-triangles'] },
    'O': { letter: 'O', shapes: ['perfect-circle', 'ring-complete', 'zero-form'], hiddenMeanings: ['wholeness', 'unity', 'infinity'], negativeSpace: ['center-void', 'portal-hole'] },
    'P': { letter: 'P', shapes: ['flag-top', 'head-profile', 'bubble-stem'], hiddenMeanings: ['thought', 'idea', 'pointing'], negativeSpace: ['lower-void'] },
    'Q': { letter: 'Q', shapes: ['circle-tail', 'balloon-string', 'eye-lash'], hiddenMeanings: ['departure', 'unique', 'question'], negativeSpace: ['o-plus-accent'] },
    'R': { letter: 'R', shapes: ['walking-man', 'flag-with-leg', 'dynamic-p'], hiddenMeanings: ['movement', 'action', 'stride'], negativeSpace: ['angle-void'] },
    'S': { letter: 'S', shapes: ['snake-curve', 'wave-vertical', 'yin-yang'], hiddenMeanings: ['flow', 'flexibility', 'balance'], negativeSpace: ['reverse-curves'] },
    'T': { letter: 'T', shapes: ['cross-top', 'platform-beam', 'tree-simple'], hiddenMeanings: ['foundation', 'truth', 'structure'], negativeSpace: ['twin-corners'] },
    'U': { letter: 'U', shapes: ['cup-form', 'cradle-curve', 'smile-arc'], hiddenMeanings: ['holding', 'receiving', 'unity'], negativeSpace: ['vessel-void'] },
    'V': { letter: 'V', shapes: ['arrow-down', 'valley-form', 'victory-point'], hiddenMeanings: ['focus', 'victory', 'convergence'], negativeSpace: ['point-base'] },
    'W': { letter: 'W', shapes: ['double-v', 'wave-form', 'crown-inverted'], hiddenMeanings: ['waves', 'width', 'water'], negativeSpace: ['triple-peaks'] },
    'X': { letter: 'X', shapes: ['cross-diagonal', 'multiply-sign', 'intersect'], hiddenMeanings: ['unknown', 'multiply', 'crossing'], negativeSpace: ['four-triangles'] },
    'Y': { letter: 'Y', shapes: ['branch-up', 'fork-split', 'tree-top'], hiddenMeanings: ['choice', 'branching', 'reaching'], negativeSpace: ['stem-base'] },
    'Z': { letter: 'Z', shapes: ['lightning-horizontal', 'zig-zag', 'dynamic-line'], hiddenMeanings: ['energy', 'speed', 'finale'], negativeSpace: ['angle-pair'] },
};

// ============================================
// MAIN SEMANTIC ANALYSIS FUNCTION
// ============================================

export interface SemanticAnalysis {
    keywords: string[];
    matchedKeywords: { word: string; mapping: ShapeMapping }[];
    industry: { name: string; mapping: IndustryMapping } | null;
    letterAnalysis: LetterAnalysis[];
    combinedShapes: string[];
    recommendedAlgorithms: string[];
    style: string;
}

/**
 * Analyze brand name and category for semantic meaning
 */
export function analyzeSemantics(
    brandName: string,
    category?: string,
    aesthetic?: string
): SemanticAnalysis {
    const result: SemanticAnalysis = {
        keywords: [],
        matchedKeywords: [],
        industry: null,
        letterAnalysis: [],
        combinedShapes: [],
        recommendedAlgorithms: [],
        style: aesthetic || 'modern'
    };

    // 1. Extract keywords from brand name
    const words = brandName.toLowerCase().split(/[\s\-\_\.]+/);
    result.keywords = words;

    // 2. Match keywords to shape mappings
    for (const word of words) {
        // Direct match
        if (KEYWORD_SHAPE_MAP[word]) {
            result.matchedKeywords.push({ word, mapping: KEYWORD_SHAPE_MAP[word] });
        }
        // Partial match (word contains keyword)
        for (const [keyword, mapping] of Object.entries(KEYWORD_SHAPE_MAP)) {
            if (word.includes(keyword) && word !== keyword) {
                result.matchedKeywords.push({ word: keyword, mapping });
            }
        }
    }

    // 3. Match industry
    if (category) {
        const categoryLower = category.toLowerCase();
        for (const [industryKey, mapping] of Object.entries(INDUSTRY_SHAPE_MAP)) {
            if (categoryLower.includes(industryKey) || mapping.keywords.some(k => categoryLower.includes(k))) {
                result.industry = { name: industryKey, mapping };
                break;
            }
        }
    }

    // 4. Analyze letters
    const initials = brandName.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3);
    for (const letter of initials) {
        if (LETTER_SHAPE_MAP[letter]) {
            result.letterAnalysis.push(LETTER_SHAPE_MAP[letter]);
        }
    }

    // 5. Combine shapes from all sources
    const allShapes = new Set<string>();
    const allAlgorithms = new Set<string>();

    // From matched keywords
    for (const { mapping } of result.matchedKeywords) {
        mapping.shapes.forEach(s => allShapes.add(s));
        mapping.algorithms.forEach(a => allAlgorithms.add(a));
    }

    // From industry
    if (result.industry) {
        result.industry.mapping.shapes.forEach(s => allShapes.add(s));
        result.industry.mapping.algorithms.forEach(a => allAlgorithms.add(a));
    }

    // From letter analysis
    for (const letterInfo of result.letterAnalysis) {
        letterInfo.shapes.forEach(s => allShapes.add(s));
        letterInfo.hiddenMeanings.forEach(m => allShapes.add(m));
    }

    result.combinedShapes = Array.from(allShapes);
    result.recommendedAlgorithms = Array.from(allAlgorithms);

    return result;
}

/**
 * Get recommended logo algorithms based on semantic analysis
 */
export function getSemanticAlgorithms(
    brandName: string,
    category?: string,
    aesthetic?: string,
    seed?: number
): string[] {
    const analysis = analyzeSemantics(brandName, category, aesthetic);

    // Create seeded randomness for varied but consistent results
    const seededRandom = (s: number) => {
        const x = Math.sin(s++) * 10000;
        return x - Math.floor(x);
    };

    let randomSeed = seed || brandName.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);

    // 1. Score algorithms by relevance
    const algorithmCounts: Record<string, number> = {};

    // Weight: Keyword match (High relevance) = +3
    for (const { mapping } of analysis.matchedKeywords) {
        mapping.algorithms.forEach(algo => {
            algorithmCounts[algo] = (algorithmCounts[algo] || 0) + 3;
        });
    }

    // Weight: Industry match (Context) = +2
    if (analysis.industry) {
        analysis.industry.mapping.algorithms.forEach(algo => {
            algorithmCounts[algo] = (algorithmCounts[algo] || 0) + 2;
        });
    }

    // 2. Sort by score
    const sortedAlgorithms = Object.entries(algorithmCounts)
        .sort((a, b) => b[1] - a[1]) // Descending score
        .map(([algo]) => algo);

    // 3. Selection Strategy
    // Fallback to recommendedAlgorithms (unique set) if no weighted matches
    let candidates = sortedAlgorithms;
    if (candidates.length === 0) {
        candidates = analysis.recommendedAlgorithms;
    }

    // Take Top 8 candidates (to filter out low-relevance noise) and shuffle
    const topCandidates = candidates.slice(0, 8);
    const shuffled = topCandidates.sort(() => seededRandom(randomSeed++) - 0.5);

    // Return top 5
    return shuffled.slice(0, 5);
}

/**
 * Generate semantic context string for logo generation
 */
export function getSemanticContext(
    brandName: string,
    category?: string
): string {
    const analysis = analyzeSemantics(brandName, category);

    const parts: string[] = [];

    if (analysis.matchedKeywords.length > 0) {
        parts.push(`Keywords: ${analysis.matchedKeywords.map(k => k.word).join(', ')}`);
    }

    if (analysis.industry) {
        parts.push(`Industry: ${analysis.industry.name}`);
    }

    if (analysis.letterAnalysis.length > 0) {
        const meanings = analysis.letterAnalysis.flatMap(l => l.hiddenMeanings).slice(0, 3);
        parts.push(`Letter meanings: ${meanings.join(', ')}`);
    }

    return parts.join(' | ');
}

export default {
    KEYWORD_SHAPE_MAP,
    INDUSTRY_SHAPE_MAP,
    LETTER_SHAPE_MAP,
    analyzeSemantics,
    getSemanticAlgorithms,
    getSemanticContext
};
