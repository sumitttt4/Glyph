/**
 * Mockup State Store
 *
 * Stores rendered mockup images for export consistency.
 * When a mockup renders in preview, store the exact canvas/SVG here.
 * All exports pull from this stored state - never regenerate.
 */

import { BrandIdentity } from '@/lib/data';

// ============================================
// MOCKUP TYPES
// ============================================

export type MockupType =
    | 'business-card'
    | 'linkedin-banner'
    | 'website-header'
    | 'mobile-app'
    | 'poster'
    | 'letterhead'
    | 'billboard'
    | 'phone-screen'
    | 'laptop-screen'
    | 'storefront-sign'
    | 'packaging-box'
    | 'hoodie'
    | 'tote-bag'
    | 'coffee-cup';

export interface MockupData {
    type: MockupType;
    svg: string;
    pngDataUrl?: string;
    width: number;
    height: number;
    timestamp: number;
}

export interface MockupStateData {
    id: string;
    brandId: string;
    brandName: string;
    timestamp: number;
    mockups: Map<MockupType, MockupData>;
}

// ============================================
// MOCKUP METADATA
// ============================================

export const MOCKUP_METADATA: Record<MockupType, {
    name: string;
    icon: string;
    description: string;
    category: 'print' | 'digital' | 'merchandise' | 'signage';
    width: number;
    height: number;
}> = {
    'business-card': {
        name: 'Business Card',
        icon: '💳',
        description: '3D angled card with shadow',
        category: 'print',
        width: 800,
        height: 500,
    },
    'linkedin-banner': {
        name: 'LinkedIn Banner',
        icon: '🔗',
        description: 'Professional profile banner',
        category: 'digital',
        width: 1584,
        height: 396,
    },
    'website-header': {
        name: 'Website Header',
        icon: '🌐',
        description: 'Browser frame with navigation',
        category: 'digital',
        width: 1200,
        height: 800,
    },
    'mobile-app': {
        name: 'Mobile App',
        icon: '📱',
        description: 'iPhone with splash screen',
        category: 'digital',
        width: 500,
        height: 900,
    },
    'poster': {
        name: 'Poster',
        icon: '🖼️',
        description: 'Large format display',
        category: 'print',
        width: 600,
        height: 800,
    },
    'letterhead': {
        name: 'Letterhead',
        icon: '📄',
        description: 'A4 document template',
        category: 'print',
        width: 595,
        height: 842,
    },
    'billboard': {
        name: 'Billboard',
        icon: '🏙️',
        description: 'Outdoor advertising display',
        category: 'signage',
        width: 1200,
        height: 600,
    },
    'phone-screen': {
        name: 'Phone Screen',
        icon: '📲',
        description: 'App interface mockup',
        category: 'digital',
        width: 390,
        height: 844,
    },
    'laptop-screen': {
        name: 'Laptop Screen',
        icon: '💻',
        description: 'MacBook Pro display',
        category: 'digital',
        width: 1440,
        height: 900,
    },
    'storefront-sign': {
        name: 'Storefront Sign',
        icon: '🏪',
        description: 'Illuminated store signage',
        category: 'signage',
        width: 1000,
        height: 400,
    },
    'packaging-box': {
        name: 'Packaging Box',
        icon: '📦',
        description: 'Product packaging design',
        category: 'print',
        width: 800,
        height: 800,
    },
    'hoodie': {
        name: 'Hoodie',
        icon: '🧥',
        description: 'Apparel mockup',
        category: 'merchandise',
        width: 800,
        height: 900,
    },
    'tote-bag': {
        name: 'Tote Bag',
        icon: '👜',
        description: 'Canvas tote bag',
        category: 'merchandise',
        width: 700,
        height: 800,
    },
    'coffee-cup': {
        name: 'Coffee Cup',
        icon: '☕',
        description: 'Ceramic mug mockup',
        category: 'merchandise',
        width: 600,
        height: 600,
    },
};

export const ALL_MOCKUP_TYPES: MockupType[] = Object.keys(MOCKUP_METADATA) as MockupType[];

// ============================================
// GLOBAL STATE
// ============================================

let currentMockupState: MockupStateData | null = null;

const DEBUG = true;
function logMockup(action: string, data?: Record<string, unknown>) {
    if (DEBUG) {
        console.log(`[MockupState] ${action}`, data ? data : '');
    }
}

// ============================================
// STATE MANAGEMENT
// ============================================

/**
 * Initialize mockup state for a brand
 */
export function initMockupState(brand: BrandIdentity): void {
    currentMockupState = {
        id: `mockup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        brandId: brand.id,
        brandName: brand.name,
        timestamp: Date.now(),
        mockups: new Map(),
    };
    logMockup('State initialized', { brandId: brand.id, brandName: brand.name });
}

/**
 * Store a rendered mockup
 */
export function storeMockup(
    type: MockupType,
    svg: string,
    width: number,
    height: number,
    pngDataUrl?: string
): void {
    if (!currentMockupState) {
        logMockup('WARNING: No state initialized, creating default');
        currentMockupState = {
            id: `mockup-${Date.now()}`,
            brandId: 'unknown',
            brandName: 'Unknown',
            timestamp: Date.now(),
            mockups: new Map(),
        };
    }

    const mockupData: MockupData = {
        type,
        svg,
        pngDataUrl,
        width,
        height,
        timestamp: Date.now(),
    };

    currentMockupState.mockups.set(type, mockupData);
    logMockup('Mockup stored', { type, width, height, hasPng: !!pngDataUrl });
}

/**
 * Get a stored mockup
 */
export function getStoredMockup(type: MockupType): MockupData | null {
    if (!currentMockupState) return null;
    return currentMockupState.mockups.get(type) || null;
}

/**
 * Get all stored mockups
 */
export function getAllStoredMockups(): Map<MockupType, MockupData> {
    if (!currentMockupState) return new Map();
    return currentMockupState.mockups;
}

/**
 * Check if mockup state exists
 */
export function hasMockupState(): boolean {
    return currentMockupState !== null && currentMockupState.mockups.size > 0;
}

/**
 * Get mockup state metadata
 */
export function getMockupStateMetadata(): { id: string; brandId: string; count: number } | null {
    if (!currentMockupState) return null;
    return {
        id: currentMockupState.id,
        brandId: currentMockupState.brandId,
        count: currentMockupState.mockups.size,
    };
}

/**
 * Clear mockup state
 */
export function clearMockupState(): void {
    const oldId = currentMockupState?.id;
    currentMockupState = null;
    logMockup('State cleared', { previousId: oldId });
}

// ============================================
// EXPORT HELPERS
// ============================================

/**
 * Get stored mockup SVG for export
 */
export function getMockupSvgForExport(type: MockupType): string | null {
    const mockup = getStoredMockup(type);
    if (!mockup) {
        logMockup('WARNING: No stored mockup found', { type });
        return null;
    }
    logMockup('Exporting mockup SVG', { type, svgLength: mockup.svg.length });
    return mockup.svg;
}

/**
 * Get stored mockup PNG data URL for export
 */
export function getMockupPngForExport(type: MockupType): string | null {
    const mockup = getStoredMockup(type);
    if (!mockup?.pngDataUrl) {
        logMockup('WARNING: No stored PNG found', { type });
        return null;
    }
    logMockup('Exporting mockup PNG', { type });
    return mockup.pngDataUrl;
}

/**
 * Convert data URL to Blob for download
 */
export function dataUrlToBlob(dataUrl: string): Blob {
    const parts = dataUrl.split(',');
    const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/png';
    const bstr = atob(parts[1]);
    const u8arr = new Uint8Array(bstr.length);
    for (let i = 0; i < bstr.length; i++) {
        u8arr[i] = bstr.charCodeAt(i);
    }
    return new Blob([u8arr], { type: mime });
}

/**
 * Download a single mockup as PNG
 */
export async function downloadMockupAsPng(
    type: MockupType,
    brandName: string
): Promise<boolean> {
    const mockup = getStoredMockup(type);
    if (!mockup) {
        logMockup('ERROR: Cannot download - no stored mockup', { type });
        return false;
    }

    try {
        let pngBlob: Blob;

        if (mockup.pngDataUrl) {
            // Use stored PNG
            pngBlob = dataUrlToBlob(mockup.pngDataUrl);
        } else {
            // Convert SVG to PNG
            pngBlob = await svgToPngBlob(mockup.svg, mockup.width, mockup.height);
        }

        // Trigger download
        const url = URL.createObjectURL(pngBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${brandName.toLowerCase().replace(/\s+/g, '-')}-${type}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        logMockup('Mockup downloaded', { type, brandName });
        return true;
    } catch (error) {
        logMockup('ERROR: Download failed', { type, error: String(error) });
        return false;
    }
}

/**
 * Convert SVG string to PNG Blob
 */
export async function svgToPngBlob(svg: string, width: number, height: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            reject(new Error('Canvas context not available'));
            return;
        }

        // Use 2x scale for better quality
        const scale = 2;
        canvas.width = width * scale;
        canvas.height = height * scale;
        ctx.scale(scale, scale);

        const svgBlob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
            ctx.drawImage(img, 0, 0, width, height);
            URL.revokeObjectURL(url);

            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error('Failed to create PNG blob'));
                }
            }, 'image/png', 1.0);
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load SVG'));
        };

        img.src = url;
    });
}
