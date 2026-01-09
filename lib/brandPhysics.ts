// Helper to convert Hex to RGB for opacity manipulation
const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
        : '0, 0, 0';
};

export const getBrandShadow = (color: string, intensity: 'soft' | 'hard' | 'glass' = 'soft') => {
    const rgb = hexToRgb(color);

    // STYLE 1: LEDGE (Clean SaaS) - White background, subtle lift
    if (intensity === 'soft') {
        return `
      0 1px 2px -1px rgba(0, 0, 0, 0.05),
      0 10px 15px -3px rgba(${rgb}, 0.08), 
      0 20px 40px -8px rgba(${rgb}, 0.04)
    `;
    }

    // STYLE 2: MARKET RADAR (Aggressive Glass) - Deep colored glow
    if (intensity === 'glass') {
        return `
      0 0 0 1px rgba(255,255,255, 0.1) inset,      /* Inner Rim Light */
      0 20px 50px -10px rgba(${rgb}, 0.5),        /* The Glow */
      0 40px 80px -20px rgba(0, 0, 0, 0.6)        /* Deep Depth */
    `;
    }

    // STYLE 3: BITLENDEX (Geometric Tech) - Sharp and precise
    return `
    4px 4px 0px 0px rgba(${rgb}, 1),              /* Hard offset (Brutalist) */
    4px 4px 10px 0px rgba(0,0,0,0.2)
  `;
};
