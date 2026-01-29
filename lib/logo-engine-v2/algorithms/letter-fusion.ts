
import { InfiniteLogoParams } from '../types';

export function generateLetterFusion(params: InfiniteLogoParams, brandName: string): string {
    const letter = brandName.charAt(0).toUpperCase();
    // In a real implementation we would use a font path library like opentype.js
    // For V1 simulation, we use an SVG text element and position an icon

    // Icon Logic
    // In real app: Map category -> Icon Set.
    // Here: Choose shape based on params

    const iconType = Math.floor(params.cutoutPosition) % 3; // 0=Leaf, 1=Bolt, 2=Circle

    let iconPath = '';
    if (iconType === 0) iconPath = "M50 0 C20 0 0 20 0 50 C0 80 20 100 50 100 C80 100 100 80 100 50 C100 20 80 0 50 0 Z"; // Leaf-ish
    if (iconType === 1) iconPath = "M40 0 L60 0 L55 40 L90 40 L40 100 L45 50 L10 50 Z"; // Bolt
    if (iconType === 2) iconPath = "M50 0 A50 50 0 1 0 50 100 A50 50 0 1 0 50 0 Z"; // Circle

    // Layout
    const isOverlay = params.interlockDepth > 50;

    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
        <!-- Letter -->
        <text 
            x="100" 
            y="140" 
            text-anchor="middle" 
            font-family="Arial, sans-serif" 
            font-weight="900" 
            font-size="140" 
            fill="currentColor"
        >${letter}</text>
        
        <!-- Icon Fusion -->
        <g transform="translate(${isOverlay ? 100 : 140} ${isOverlay ? 80 : 40}) scale(${0.4 * params.scaleVariance})">
             <path d="${iconPath}" fill="${isOverlay ? 'white' : 'currentColor'}"/>
        </g>
    </svg>`;
}
