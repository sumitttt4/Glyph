
import { InfiniteLogoParams } from '../types';

export function generateInterlocking(params: InfiniteLogoParams, brandName: string): string {
    // 3 Shapes Weaving
    const count = Math.max(3, params.elementCount); // Force at least 3 for weaving
    const center = 100;
    const radius = 50 * params.spacingRatio;
    const strokeW = Math.max(4, params.strokeWidth * 3); // Thicker for geometry

    let paths = '';
    const angleStep = 360 / count;

    // Color Palette derivation from Brand? For now just use "currentColor" or black/white
    // We assume the renderer handles color injection via 'currentColor' or we output white/black paths.

    // We generate "Links"
    // Shape: Stadium (Pill)
    const w = 40 * params.scaleVariance;
    const h = 80 * params.scaleVariance;

    for (let i = 0; i < count; i++) {
        const angle = i * angleStep;

        // Transform logic
        // rotate(angle, 100, 100) -> translate(0, -radius)

        paths += `
            <g transform="rotate(${angle} ${center} ${center}) translate(0 -${radius})">
                <!-- Main Shape -->
                <rect 
                    x="${center - w / 2}" 
                    y="${center - h / 2}" 
                    width="${w}" 
                    height="${h}" 
                    rx="${Math.min(w / 2, params.cornerRadius + 10)}" 
                    fill="none" 
                    stroke="currentColor" 
                    stroke-width="${strokeW}"
                />
                <!-- Weave Effect (Gap) -->
                <!-- A white stroke on top of the intersection point?
                     This is tricky in single-color SVG. 
                     We typically use 'mask'. -->
            </g>
        `;
    }

    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
        <g transform="rotate(${params.rotation} 100 100)">
            ${paths}
        </g>
    </svg>`;
}
