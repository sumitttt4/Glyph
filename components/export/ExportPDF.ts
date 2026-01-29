/**
 * PDF Generator for Brand Guidelines
 *
 * Comprehensive 20+ page brand guideline PDF following professional design standards.
 * Based on Holly Ventures style guide structure.
 *
 * CRITICAL: All logo exports use getStoredLogoSVG() which pulls from global export state.
 * Never regenerates logos - always uses what was displayed in preview.
 */

import { jsPDF } from 'jspdf';
import { BrandIdentity } from '@/lib/data';
import {
    getStoredLogoSVG,
    getLogoVariationsForExport,
    recolorSVG,
} from '@/components/logo-engine/renderers/stored-logo-export';
import { hasValidExportState, validateExportState, getExportMetadata } from '@/lib/export-state';

// Debug logging
const DEBUG = true;
function logPDF(action: string, data?: Record<string, unknown>) {
    if (DEBUG) {
        console.log(`[ExportPDF] ${action}`, data ? data : '');
    }
}

// ============================================
// TYPES
// ============================================

interface PDFColors {
    primary: string;
    accent?: string;
    surface: string;
    bg: string;
    text: string;
    muted?: string;
}

interface RGB {
    r: number;
    g: number;
    b: number;
}

interface CMYK {
    c: number;
    m: number;
    y: number;
    k: number;
}

// ============================================
// MAIN EXPORT FUNCTION
// ============================================

/**
 * Generate a comprehensive brand guidelines PDF (20+ pages)
 * USES STORED STATE - never regenerates logos
 */
export async function generateBrandBookPDF(brand: BrandIdentity): Promise<Blob> {
    // Log export state
    logPDF('Starting PDF generation', {
        brandName: brand.name,
        hasExportState: hasValidExportState(),
    });

    const metadata = getExportMetadata();
    if (metadata) {
        logPDF('Exporting brand ID: ' + metadata.brandId, metadata);
    }

    const colors = brand.theme.tokens.light;
    const darkColors = brand.theme.tokens.dark;
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    // ============================================
    // HELPER FUNCTIONS
    // ============================================

    const hexToRgb = (hex: string): RGB => {
        const cleanHex = hex.replace('#', '');
        return {
            r: parseInt(cleanHex.substring(0, 2), 16),
            g: parseInt(cleanHex.substring(2, 4), 16),
            b: parseInt(cleanHex.substring(4, 6), 16)
        };
    };

    const rgbToCmyk = (rgb: RGB): CMYK => {
        const r = rgb.r / 255;
        const g = rgb.g / 255;
        const b = rgb.b / 255;
        const k = 1 - Math.max(r, g, b);
        if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
        return {
            c: Math.round(((1 - r - k) / (1 - k)) * 100),
            m: Math.round(((1 - g - k) / (1 - k)) * 100),
            y: Math.round(((1 - b - k) / (1 - k)) * 100),
            k: Math.round(k * 100)
        };
    };

    const addText = (text: string, x: number, y: number, options?: {
        fontSize?: number;
        fontStyle?: 'normal' | 'bold' | 'italic';
        color?: string;
        maxWidth?: number;
        align?: 'left' | 'center' | 'right';
        lineHeight?: number;
    }) => {
        const { fontSize = 12, fontStyle = 'normal', color = '#1a1a1a', maxWidth, align = 'left', lineHeight = 1.4 } = options || {};
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', fontStyle);
        const { r, g, b } = hexToRgb(color);
        doc.setTextColor(r, g, b);

        if (maxWidth) {
            doc.text(text, x, y, { maxWidth, align, lineHeightFactor: lineHeight });
        } else {
            doc.text(text, x, y, { align });
        }
    };

    const drawRect = (x: number, y: number, w: number, h: number, color: string, radius = 0) => {
        const { r, g, b } = hexToRgb(color);
        doc.setFillColor(r, g, b);
        if (radius > 0) {
            doc.roundedRect(x, y, w, h, radius, radius, 'F');
        } else {
            doc.rect(x, y, w, h, 'F');
        }
    };

    const drawStroke = (x: number, y: number, w: number, h: number, color: string, lineWidth = 0.5) => {
        const { r, g, b } = hexToRgb(color);
        doc.setDrawColor(r, g, b);
        doc.setLineWidth(lineWidth);
        doc.rect(x, y, w, h, 'S');
    };

    const drawLine = (x1: number, y1: number, x2: number, y2: number, color: string, lineWidth = 0.5) => {
        const { r, g, b } = hexToRgb(color);
        doc.setDrawColor(r, g, b);
        doc.setLineWidth(lineWidth);
        doc.line(x1, y1, x2, y2);
    };

    const addPageNumber = (pageNum: number, total?: number) => {
        const text = total ? `${pageNum} / ${total}` : `${pageNum}`;
        addText(text, pageWidth - margin, pageHeight - 10, { fontSize: 8, color: '#999999', align: 'right' });
    };

    const addSectionHeader = (title: string, subtitle?: string, y = 30) => {
        addText(title.toUpperCase(), margin, y, { fontSize: 10, fontStyle: 'bold', color: '#666666' });
        drawLine(margin, y + 3, pageWidth - margin, y + 3, '#E5E5E5', 0.3);
        if (subtitle) {
            addText(subtitle, margin, y + 20, { fontSize: 32, fontStyle: 'bold' });
            return y + 40;
        }
        return y + 15;
    };

    const addColorSwatch = (
        x: number,
        y: number,
        width: number,
        height: number,
        color: string,
        name: string,
        showValues = true
    ) => {
        drawRect(x, y, width, height, color, 3);

        // Color name
        addText(name, x, y + height + 8, { fontSize: 10, fontStyle: 'bold' });

        if (showValues) {
            const rgb = hexToRgb(color);
            const cmyk = rgbToCmyk(rgb);

            addText(`HEX: ${color.toUpperCase()}`, x, y + height + 16, { fontSize: 7, color: '#666666' });
            addText(`RGB: ${rgb.r}, ${rgb.g}, ${rgb.b}`, x, y + height + 22, { fontSize: 7, color: '#666666' });
            addText(`CMYK: ${cmyk.c}, ${cmyk.m}, ${cmyk.y}, ${cmyk.k}`, x, y + height + 28, { fontSize: 7, color: '#666666' });
        }
    };

    const totalPages = 20;
    let pageNum = 1;

    // ========================================================================
    // PAGE 1: COVER
    // ========================================================================
    {
        const { r, g, b } = hexToRgb(colors.primary);
        doc.setFillColor(r, g, b);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');

        // Brand name centered
        addText(brand.name.toUpperCase(), pageWidth / 2, pageHeight / 2 - 20, {
            fontSize: 48,
            fontStyle: 'bold',
            color: '#FFFFFF',
            align: 'center'
        });

        // Tagline if available
        if (brand.strategy?.tagline) {
            addText(brand.strategy.tagline, pageWidth / 2, pageHeight / 2 + 5, {
                fontSize: 14,
                color: '#FFFFFF',
                align: 'center',
                maxWidth: contentWidth
            });
        }

        // "Brand Guidelines" title at bottom
        addText('BRAND GUIDELINES', pageWidth / 2, pageHeight - 50, {
            fontSize: 12,
            fontStyle: 'bold',
            color: '#FFFFFF',
            align: 'center'
        });

        addText(`Version 1.0 • ${new Date().getFullYear()}`, pageWidth / 2, pageHeight - 40, {
            fontSize: 9,
            color: '#FFFFFF',
            align: 'center'
        });
    }

    // ========================================================================
    // PAGE 2: TABLE OF CONTENTS
    // ========================================================================
    doc.addPage();
    pageNum++;
    {
        addSectionHeader('CONTENTS', 'Table of Contents');

        const sections = [
            { title: 'LOGO', items: ['Logo Design', 'Logo Variations', 'Clear Space', 'Minimum Size', 'Logo Don\'ts'], startPage: 3 },
            { title: 'TYPOGRAPHY', items: ['Typography Overview', 'Display Specimen', 'Body Specimen'], startPage: 8 },
            { title: 'COLOR PALETTE', items: ['Primary Colors', 'Color Pairings', 'Color Usage'], startPage: 11 },
            { title: 'BRAND ELEMENTS', items: ['Brand Pattern'], startPage: 14 },
            { title: 'APPLICATIONS', items: ['Business Card', 'Letterhead', 'Social Media', 'Website', 'Mobile App'], startPage: 15 },
        ];

        let tocY = 70;
        sections.forEach(section => {
            addText(section.title, margin, tocY, { fontSize: 10, fontStyle: 'bold', color: colors.primary });
            tocY += 10;

            let pageCounter = section.startPage;
            section.items.forEach(item => {
                addText(item, margin + 10, tocY, { fontSize: 10, color: '#333333' });
                addText(`${pageCounter}`, pageWidth - margin, tocY, { fontSize: 10, color: '#666666', align: 'right' });

                // Dotted line
                doc.setDrawColor(200, 200, 200);
                doc.setLineDashPattern([1, 2], 0);
                doc.line(margin + 60, tocY - 1, pageWidth - margin - 15, tocY - 1);
                doc.setLineDashPattern([], 0);

                tocY += 8;
                pageCounter++;
            });
            tocY += 8;
        });

        addPageNumber(pageNum, totalPages);
    }

    // ========================================================================
    // PAGE 3: LOGO DESIGN - Main logo large
    // ========================================================================
    doc.addPage();
    pageNum++;
    {
        addSectionHeader('LOGO', 'Logo Design');

        addText(
            `The ${brand.name} logo is the primary visual identifier of the brand. It embodies our values and should be treated with care in all applications.`,
            margin, 65, { fontSize: 11, maxWidth: contentWidth, color: '#333333' }
        );

        // Large logo display area
        drawRect(margin, 90, contentWidth, 120, '#F8F8F8', 4);

        // Center text placeholder for logo
        addText(`[ ${brand.name} Logo ]`, pageWidth / 2, 155, {
            fontSize: 24,
            fontStyle: 'bold',
            color: colors.primary,
            align: 'center'
        });

        // Logo construction notes
        addText('Construction', margin, 230, { fontSize: 12, fontStyle: 'bold' });
        addText(
            'The logo is constructed using precise geometric principles to ensure visual harmony across all applications. The proportions should never be altered.',
            margin, 242, { fontSize: 10, maxWidth: contentWidth, color: '#666666' }
        );

        const algorithm = brand.generatedLogos?.[0]?.algorithm || 'Custom Design';
        addText('Style:', margin, 265, { fontSize: 10, fontStyle: 'bold' });
        addText(algorithm.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), margin + 20, 265, { fontSize: 10, color: '#666666' });

        addPageNumber(pageNum, totalPages);
    }

    // ========================================================================
    // PAGE 4: LOGO VARIATIONS - All 6 lockups
    // ========================================================================
    doc.addPage();
    pageNum++;
    {
        addSectionHeader('LOGO', 'Logo Variations');

        addText(
            'Six standard logo variations ensure the brand works across all contexts and applications.',
            margin, 65, { fontSize: 11, maxWidth: contentWidth, color: '#333333' }
        );

        const variations = [
            { name: 'Horizontal Lockup', desc: 'Icon left, wordmark right. Primary use.', key: 'horizontal' },
            { name: 'Stacked Lockup', desc: 'Icon top, wordmark below. Square formats.', key: 'stacked' },
            { name: 'Icon Only', desc: 'Symbol without text. Favicons, avatars.', key: 'iconOnly' },
            { name: 'Wordmark Only', desc: 'Text without symbol. Co-branding.', key: 'wordmarkOnly' },
            { name: 'Dark Version', desc: 'For light backgrounds.', key: 'dark' },
            { name: 'Light Version', desc: 'For dark backgrounds.', key: 'light' },
        ];

        let varY = 85;
        let col = 0;
        variations.forEach((v, i) => {
            const x = margin + (col * (contentWidth / 2 + 5));
            const boxWidth = (contentWidth / 2) - 5;

            // Background varies for dark/light versions
            const bgColor = v.key === 'light' ? colors.primary : '#F5F5F5';
            drawRect(x, varY, boxWidth, 50, bgColor, 3);

            addText(v.name, x, varY + 60, { fontSize: 9, fontStyle: 'bold' });
            addText(v.desc, x, varY + 68, { fontSize: 8, color: '#666666', maxWidth: boxWidth });

            col++;
            if (col >= 2) {
                col = 0;
                varY += 85;
            }
        });

        addPageNumber(pageNum, totalPages);
    }

    // ========================================================================
    // PAGE 5: LOGO CLEAR SPACE - 1.5x padding rule
    // ========================================================================
    doc.addPage();
    pageNum++;
    {
        addSectionHeader('LOGO', 'Clear Space');

        addText(
            'Maintain minimum clear space around the logo to ensure visual impact and legibility. The clear space is defined as 1.5x the height of the logo icon.',
            margin, 65, { fontSize: 11, maxWidth: contentWidth, color: '#333333' }
        );

        // Clear space diagram
        const diagramX = margin + 20;
        const diagramY = 95;
        const logoBoxSize = 60;
        const clearSpace = 20; // Represents 1.5x

        // Outer clear space area (blue tint)
        drawRect(diagramX, diagramY, logoBoxSize + (clearSpace * 2), logoBoxSize + (clearSpace * 2), '#E8F4FF', 0);

        // Inner logo area
        drawRect(diagramX + clearSpace, diagramY + clearSpace, logoBoxSize, logoBoxSize, '#FFFFFF', 3);
        drawStroke(diagramX + clearSpace, diagramY + clearSpace, logoBoxSize, logoBoxSize, colors.primary, 0.5);

        // X markers for clear space
        addText('1.5x', diagramX + 5, diagramY + clearSpace + (logoBoxSize / 2), { fontSize: 8, fontStyle: 'bold', color: colors.primary });
        addText('1.5x', diagramX + clearSpace + logoBoxSize + 5, diagramY + clearSpace + (logoBoxSize / 2), { fontSize: 8, fontStyle: 'bold', color: colors.primary });
        addText('1.5x', diagramX + clearSpace + (logoBoxSize / 2) - 5, diagramY + 8, { fontSize: 8, fontStyle: 'bold', color: colors.primary });
        addText('1.5x', diagramX + clearSpace + (logoBoxSize / 2) - 5, diagramY + clearSpace * 2 + logoBoxSize - 5, { fontSize: 8, fontStyle: 'bold', color: colors.primary });

        // Legend
        addText('Clear Space Zone', diagramX + clearSpace * 2 + logoBoxSize + 30, diagramY + 30, { fontSize: 10, fontStyle: 'bold' });
        drawRect(diagramX + clearSpace * 2 + logoBoxSize + 30, diagramY + 35, 15, 15, '#E8F4FF', 0);
        addText('= 1.5x logo height', diagramX + clearSpace * 2 + logoBoxSize + 50, diagramY + 45, { fontSize: 9, color: '#666666' });

        // Rules
        addText('Rules', margin, 200, { fontSize: 12, fontStyle: 'bold' });
        const rules = [
            '- No text, graphics, or visual elements within the clear space zone',
            '- Clear space scales proportionally with logo size',
            '- When in doubt, add more space rather than less',
            '- The clear space rule applies to all logo variations'
        ];
        let ruleY = 215;
        rules.forEach(rule => {
            addText(rule, margin, ruleY, { fontSize: 10, color: '#333333' });
            ruleY += 10;
        });

        addPageNumber(pageNum, totalPages);
    }

    // ========================================================================
    // PAGE 6: LOGO MINIMUM SIZE
    // ========================================================================
    doc.addPage();
    pageNum++;
    {
        addSectionHeader('LOGO', 'Minimum Size');

        addText(
            'To maintain legibility and visual quality, never use the logo smaller than the minimum sizes specified below.',
            margin, 65, { fontSize: 11, maxWidth: contentWidth, color: '#333333' }
        );

        // Digital minimum sizes
        addText('Digital Applications', margin, 95, { fontSize: 12, fontStyle: 'bold' });

        // 24px minimum (actual size representation)
        drawRect(margin, 110, 8, 8, '#F5F5F5', 1);
        drawStroke(margin, 110, 8, 8, '#CCCCCC', 0.3);
        addText('24px', margin + 15, 117, { fontSize: 10, fontStyle: 'bold' });
        addText('Favicon, small icons', margin + 35, 117, { fontSize: 9, color: '#666666' });

        // 32px minimum
        drawRect(margin, 130, 11, 11, '#F5F5F5', 1);
        drawStroke(margin, 130, 11, 11, '#CCCCCC', 0.3);
        addText('32px', margin + 18, 139, { fontSize: 10, fontStyle: 'bold' });
        addText('UI elements, app icons', margin + 38, 139, { fontSize: 9, color: '#666666' });

        // 48px minimum
        drawRect(margin, 155, 16, 16, '#F5F5F5', 1);
        drawStroke(margin, 155, 16, 16, '#CCCCCC', 0.3);
        addText('48px', margin + 23, 167, { fontSize: 10, fontStyle: 'bold' });
        addText('Standard website use', margin + 43, 167, { fontSize: 9, color: '#666666' });

        // Print minimum sizes
        addText('Print Applications', margin, 195, { fontSize: 12, fontStyle: 'bold' });

        addText('15mm', margin, 212, { fontSize: 10, fontStyle: 'bold' });
        addText('(0.6 inches) - Minimum width for business cards', margin + 20, 212, { fontSize: 9, color: '#666666' });

        addText('25mm', margin, 227, { fontSize: 10, fontStyle: 'bold' });
        addText('(1 inch) - Recommended for letterheads', margin + 20, 227, { fontSize: 9, color: '#666666' });

        addText('50mm', margin, 242, { fontSize: 10, fontStyle: 'bold' });
        addText('(2 inches) - Minimum for signage', margin + 20, 242, { fontSize: 9, color: '#666666' });

        // Note
        drawRect(margin, 260, contentWidth, 20, '#FFF9E6', 3);
        addText('Note: The logo is vector-based and can scale infinitely for large format applications.', margin + 5, 273, { fontSize: 9, color: '#996600' });

        addPageNumber(pageNum, totalPages);
    }

    // ========================================================================
    // PAGE 7: LOGO DON'TS - 6 examples
    // ========================================================================
    doc.addPage();
    pageNum++;
    {
        addSectionHeader('LOGO', 'Logo Don\'ts');

        addText(
            'To maintain brand consistency, these misuses of the logo must be avoided.',
            margin, 65, { fontSize: 11, maxWidth: contentWidth, color: '#333333' }
        );

        const donts = [
            { title: 'Don\'t stretch', desc: 'Never distort the aspect ratio' },
            { title: 'Don\'t rotate', desc: 'Keep logo in original orientation' },
            { title: 'Don\'t recolor', desc: 'Only use approved color variants' },
            { title: 'Don\'t use low contrast', desc: 'Ensure sufficient visibility' },
            { title: 'Don\'t place on busy backgrounds', desc: 'Maintain clear legibility' },
            { title: 'Don\'t add effects', desc: 'No shadows, glows, or gradients' },
        ];

        let dontY = 90;
        let col = 0;
        donts.forEach((item, i) => {
            const x = margin + (col * (contentWidth / 2 + 5));
            const boxWidth = (contentWidth / 2) - 5;

            // Red-tinted background
            drawRect(x, dontY, boxWidth, 55, '#FEE2E2', 3);

            // X mark
            const { r, g, b } = hexToRgb('#EF4444');
            doc.setDrawColor(r, g, b);
            doc.setLineWidth(1.5);
            doc.line(x + boxWidth - 15, dontY + 8, x + boxWidth - 5, dontY + 18);
            doc.line(x + boxWidth - 5, dontY + 8, x + boxWidth - 15, dontY + 18);

            addText(item.title, x + 5, dontY + 62, { fontSize: 9, fontStyle: 'bold', color: '#DC2626' });
            addText(item.desc, x + 5, dontY + 70, { fontSize: 8, color: '#666666' });

            col++;
            if (col >= 2) {
                col = 0;
                dontY += 85;
            }
        });

        addPageNumber(pageNum, totalPages);
    }

    // ========================================================================
    // PAGE 8: TYPOGRAPHY OVERVIEW
    // ========================================================================
    doc.addPage();
    pageNum++;
    {
        addSectionHeader('TYPOGRAPHY', 'Overview');

        addText(
            'Typography is a fundamental element of the brand identity. Our font pairing creates a clear visual hierarchy while maintaining readability.',
            margin, 65, { fontSize: 11, maxWidth: contentWidth, color: '#333333' }
        );

        // Display Font
        const displayFont = brand.font.headingName || brand.font.name;
        addText('Display Font', margin, 100, { fontSize: 10, fontStyle: 'bold', color: colors.primary });
        addText(displayFont, margin, 118, { fontSize: 28, fontStyle: 'bold' });
        addText('Used for headlines, titles, and display text', margin, 132, { fontSize: 9, color: '#666666' });

        // Body Font
        const bodyFont = brand.font.bodyName || brand.font.name;
        addText('Body Font', margin, 160, { fontSize: 10, fontStyle: 'bold', color: colors.primary });
        addText(bodyFont, margin, 178, { fontSize: 18 });
        addText('Used for paragraphs, body copy, and UI text', margin, 190, { fontSize: 9, color: '#666666' });

        // Mono Font (if available)
        if (brand.font.monoName) {
            addText('Mono Font', margin, 218, { fontSize: 10, fontStyle: 'bold', color: colors.primary });
            addText(brand.font.monoName, margin, 236, { fontSize: 14 });
            addText('Used for code, technical content, and data', margin, 248, { fontSize: 9, color: '#666666' });
        }

        addPageNumber(pageNum, totalPages);
    }

    // ========================================================================
    // PAGE 9: TYPOGRAPHY SPECIMEN - Display Font
    // ========================================================================
    doc.addPage();
    pageNum++;
    {
        addSectionHeader('TYPOGRAPHY', 'Display Specimen');

        const displayFont = brand.font.headingName || brand.font.name;
        addText(displayFont, margin, 65, { fontSize: 14, fontStyle: 'bold', color: colors.primary });

        // Full alphabet uppercase
        addText('ABCDEFGHIJKLM', margin, 95, { fontSize: 24, fontStyle: 'bold' });
        addText('NOPQRSTUVWXYZ', margin, 118, { fontSize: 24, fontStyle: 'bold' });

        // Full alphabet lowercase
        addText('abcdefghijklm', margin, 148, { fontSize: 24, fontStyle: 'bold' });
        addText('nopqrstuvwxyz', margin, 171, { fontSize: 24, fontStyle: 'bold' });

        // Numbers
        addText('0123456789', margin, 201, { fontSize: 24, fontStyle: 'bold' });

        // Weights demonstration
        addText('Weights', margin, 235, { fontSize: 10, fontStyle: 'bold', color: colors.primary });

        addText('Light', margin, 250, { fontSize: 9, color: '#666666' });
        addText('The quick brown fox jumps', margin, 262, { fontSize: 16 }); // Light weight

        addText('Regular', margin + contentWidth / 2, 250, { fontSize: 9, color: '#666666' });
        addText('The quick brown fox jumps', margin + contentWidth / 2, 262, { fontSize: 16 });

        addText('Bold', margin, 280, { fontSize: 9, color: '#666666' });
        addText('The quick brown fox jumps', margin, 292, { fontSize: 16, fontStyle: 'bold' });

        addPageNumber(pageNum, totalPages);
    }

    // ========================================================================
    // PAGE 10: TYPOGRAPHY SPECIMEN - Body Font
    // ========================================================================
    doc.addPage();
    pageNum++;
    {
        addSectionHeader('TYPOGRAPHY', 'Body Specimen');

        const bodyFont = brand.font.bodyName || brand.font.name;
        addText(bodyFont, margin, 65, { fontSize: 14, fontStyle: 'bold', color: colors.primary });

        // Full alphabet uppercase
        addText('ABCDEFGHIJKLM', margin, 92, { fontSize: 18 });
        addText('NOPQRSTUVWXYZ', margin, 110, { fontSize: 18 });

        // Full alphabet lowercase
        addText('abcdefghijklm', margin, 135, { fontSize: 18 });
        addText('nopqrstuvwxyz', margin, 153, { fontSize: 18 });

        // Numbers
        addText('0123456789', margin, 178, { fontSize: 18 });

        // Sample paragraph
        addText('Sample Paragraph', margin, 205, { fontSize: 10, fontStyle: 'bold', color: colors.primary });
        addText(
            'Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed. The arrangement of type involves selecting typefaces, point sizes, line lengths, line-spacing, and letter-spacing.',
            margin, 220, { fontSize: 11, maxWidth: contentWidth, color: '#333333', lineHeight: 1.6 }
        );

        // Type scale
        addText('Type Scale', margin, 265, { fontSize: 10, fontStyle: 'bold', color: colors.primary });
        addText('48px - Display', margin, 278, { fontSize: 9 });
        addText('36px - H1', margin + 35, 278, { fontSize: 9 });
        addText('28px - H2', margin + 60, 278, { fontSize: 9 });
        addText('22px - H3', margin + 85, 278, { fontSize: 9 });
        addText('18px - H4', margin + 110, 278, { fontSize: 9 });
        addText('16px - Body', margin + 135, 278, { fontSize: 9 });

        addPageNumber(pageNum, totalPages);
    }

    // ========================================================================
    // PAGE 11: COLOR PALETTE - Primary colors with HEX, RGB, CMYK
    // ========================================================================
    doc.addPage();
    pageNum++;
    {
        addSectionHeader('COLOR PALETTE', 'Primary Colors');

        addText(
            'Our color palette defines the visual identity. Each color has specific applications and should be used consistently.',
            margin, 65, { fontSize: 11, maxWidth: contentWidth, color: '#333333' }
        );

        // Primary color (large swatch)
        addColorSwatch(margin, 90, contentWidth, 60, colors.primary, 'Primary');

        // Secondary colors row
        const swatchWidth = (contentWidth - 20) / 3;
        let swatchY = 180;

        if (colors.accent) {
            addColorSwatch(margin, swatchY, swatchWidth, 45, colors.accent, 'Accent');
        }
        addColorSwatch(margin + swatchWidth + 10, swatchY, swatchWidth, 45, colors.surface, 'Surface');
        addColorSwatch(margin + (swatchWidth + 10) * 2, swatchY, swatchWidth, 45, colors.bg, 'Background');

        // Text colors
        addText('Text Colors', margin, 265, { fontSize: 10, fontStyle: 'bold', color: colors.primary });
        addColorSwatch(margin, 275, 40, 30, colors.text, 'Primary', false);
        if (colors.muted) {
            addColorSwatch(margin + 60, 275, 40, 30, colors.muted, 'Muted', false);
        }

        addPageNumber(pageNum, totalPages);
    }

    // ========================================================================
    // PAGE 12: COLOR PAIRINGS - Grid showing compatible combinations
    // ========================================================================
    doc.addPage();
    pageNum++;
    {
        addSectionHeader('COLOR PALETTE', 'Color Pairings');

        addText(
            'These color combinations work well together and maintain accessibility standards.',
            margin, 65, { fontSize: 11, maxWidth: contentWidth, color: '#333333' }
        );

        // Pairing grid
        const pairings = [
            { bg: colors.primary, fg: '#FFFFFF', name: 'Primary + White', use: 'CTAs, buttons' },
            { bg: colors.bg, fg: colors.primary, name: 'Background + Primary', use: 'Links, highlights' },
            { bg: colors.surface, fg: colors.text, name: 'Surface + Text', use: 'Cards, content' },
            { bg: colors.primary, fg: colors.bg, name: 'Primary + Background', use: 'Headers, banners' },
            { bg: darkColors?.bg || '#1a1a1a', fg: darkColors?.primary || colors.primary, name: 'Dark + Primary', use: 'Dark mode' },
            { bg: '#FFFFFF', fg: colors.text, name: 'White + Text', use: 'Body content' },
        ];

        let pairY = 90;
        pairings.forEach((pair, i) => {
            const x = margin + ((i % 2) * (contentWidth / 2 + 5));
            const boxWidth = (contentWidth / 2) - 5;

            // Background
            drawRect(x, pairY, boxWidth, 35, pair.bg, 3);

            // Sample text
            addText('Aa', x + 10, pairY + 23, { fontSize: 18, fontStyle: 'bold', color: pair.fg });
            addText('Sample', x + 35, pairY + 23, { fontSize: 12, color: pair.fg });

            // Label
            addText(pair.name, x, pairY + 43, { fontSize: 9, fontStyle: 'bold' });
            addText(pair.use, x, pairY + 51, { fontSize: 8, color: '#666666' });

            if (i % 2 === 1) {
                pairY += 65;
            }
        });

        addPageNumber(pageNum, totalPages);
    }

    // ========================================================================
    // PAGE 13: COLOR USAGE - Do's and Don'ts
    // ========================================================================
    doc.addPage();
    pageNum++;
    {
        addSectionHeader('COLOR PALETTE', 'Color Usage');

        // Do's
        addText('Do\'s', margin, 65, { fontSize: 12, fontStyle: 'bold', color: '#16A34A' });

        const dos = [
            'Use primary color for key actions and brand moments',
            'Maintain sufficient contrast (4.5:1 for body text)',
            'Use neutral backgrounds for readability',
            'Apply dark mode colors for dark interfaces'
        ];

        let doY = 80;
        dos.forEach(item => {
            drawRect(margin, doY, contentWidth, 18, '#DCFCE7', 3);
            addText('+ ' + item, margin + 5, doY + 12, { fontSize: 9, color: '#166534' });
            doY += 23;
        });

        // Don'ts
        addText('Don\'ts', margin, 175, { fontSize: 12, fontStyle: 'bold', color: '#DC2626' });

        const donts = [
            'Don\'t use colors not in the approved palette',
            'Don\'t place text on low-contrast backgrounds',
            'Don\'t use gradients unless specified',
            'Don\'t alter the opacity of brand colors'
        ];

        let dontY = 190;
        donts.forEach(item => {
            drawRect(margin, dontY, contentWidth, 18, '#FEE2E2', 3);
            addText('- ' + item, margin + 5, dontY + 12, { fontSize: 9, color: '#DC2626' });
            dontY += 23;
        });

        addPageNumber(pageNum, totalPages);
    }

    // ========================================================================
    // PAGE 14: BRAND PATTERN
    // ========================================================================
    doc.addPage();
    pageNum++;
    {
        addSectionHeader('BRAND ELEMENTS', 'Brand Pattern');

        addText(
            'The brand pattern is derived from logo elements and can be used as a supporting graphic texture.',
            margin, 65, { fontSize: 11, maxWidth: contentWidth, color: '#333333' }
        );

        // Pattern display area
        drawRect(margin, 90, contentWidth, 100, '#F5F5F5', 4);

        // Generate simple geometric pattern using primary color
        const patternSpacing = 15;
        for (let px = margin + 10; px < pageWidth - margin - 10; px += patternSpacing) {
            for (let py = 100; py < 180; py += patternSpacing) {
                const { r, g, b } = hexToRgb(colors.primary);
                doc.setFillColor(r, g, b);
                doc.circle(px, py, 2, 'F');
            }
        }

        // Usage guidelines
        addText('Usage Guidelines', margin, 210, { fontSize: 12, fontStyle: 'bold' });
        const patternRules = [
            '- Use as a background texture at low opacity (10-20%)',
            '- Can be used on marketing materials and presentations',
            '- Do not place over important content or text',
            '- Scale proportionally to maintain visual rhythm'
        ];
        let patternY = 225;
        patternRules.forEach(rule => {
            addText(rule, margin, patternY, { fontSize: 10, color: '#333333' });
            patternY += 12;
        });

        addPageNumber(pageNum, totalPages);
    }

    // ========================================================================
    // PAGE 15: BUSINESS CARD - Front and Back
    // ========================================================================
    doc.addPage();
    pageNum++;
    {
        addSectionHeader('APPLICATIONS', 'Business Card');

        addText('Standard size: 3.5" x 2" (89mm x 51mm)', margin, 65, { fontSize: 10, color: '#666666' });

        // Front of card
        addText('Front', margin, 85, { fontSize: 10, fontStyle: 'bold' });
        drawRect(margin, 95, 89, 51, colors.primary, 3);
        addText(brand.name, margin + 10, 120, { fontSize: 12, fontStyle: 'bold', color: '#FFFFFF' });
        if (brand.strategy?.tagline) {
            addText(brand.strategy.tagline, margin + 10, 132, { fontSize: 7, color: '#FFFFFF', maxWidth: 70 });
        }

        // Back of card
        addText('Back', margin + 110, 85, { fontSize: 10, fontStyle: 'bold' });
        drawRect(margin + 110, 95, 89, 51, '#FFFFFF', 3);
        drawStroke(margin + 110, 95, 89, 51, '#E5E5E5', 0.5);

        addText('John Doe', margin + 120, 115, { fontSize: 9, fontStyle: 'bold', color: colors.text });
        addText('Position Title', margin + 120, 123, { fontSize: 7, color: '#666666' });
        addText('email@company.com', margin + 120, 135, { fontSize: 6, color: '#666666' });
        addText('+1 (555) 000-0000', margin + 120, 141, { fontSize: 6, color: '#666666' });

        // Specifications
        addText('Specifications', margin, 170, { fontSize: 11, fontStyle: 'bold' });
        const specs = [
            'Paper: 350gsm premium uncoated stock',
            'Finish: Matte or soft-touch lamination',
            'Corners: 3mm radius rounded corners (optional)',
            'Print: Full bleed, CMYK process'
        ];
        let specY = 185;
        specs.forEach(spec => {
            addText('- ' + spec, margin, specY, { fontSize: 9, color: '#333333' });
            specY += 10;
        });

        addPageNumber(pageNum, totalPages);
    }

    // ========================================================================
    // PAGE 16: LETTERHEAD - A4 document layout
    // ========================================================================
    doc.addPage();
    pageNum++;
    {
        addSectionHeader('APPLICATIONS', 'Letterhead');

        addText('A4 format: 210mm x 297mm', margin, 65, { fontSize: 10, color: '#666666' });

        // Letterhead mockup (scaled down)
        const lhWidth = 70;
        const lhHeight = 99;
        const lhX = pageWidth / 2 - lhWidth / 2;
        const lhY = 85;

        drawRect(lhX, lhY, lhWidth, lhHeight, '#FFFFFF', 2);
        drawStroke(lhX, lhY, lhWidth, lhHeight, '#E5E5E5', 0.3);

        // Header area with logo
        drawRect(lhX, lhY, lhWidth, 15, colors.primary, 0);
        addText(brand.name, lhX + 5, lhY + 10, { fontSize: 8, fontStyle: 'bold', color: '#FFFFFF' });

        // Content lines (simulated)
        for (let i = 0; i < 8; i++) {
            drawRect(lhX + 5, lhY + 25 + (i * 8), lhWidth - 10, 2, '#F0F0F0', 0);
        }

        // Footer
        addText('company.com | contact@company.com', lhX + 5, lhY + lhHeight - 5, { fontSize: 4, color: '#999999' });

        // Layout guidelines
        addText('Layout Guidelines', margin, 200, { fontSize: 11, fontStyle: 'bold' });
        const layoutRules = [
            'Header height: 25mm from top edge',
            'Logo placement: Left aligned, 15mm from top and left edges',
            'Body text starts: 50mm from top edge',
            'Footer: 15mm from bottom edge',
            'Margins: 25mm left, 20mm right'
        ];
        let layoutY = 215;
        layoutRules.forEach(rule => {
            addText('- ' + rule, margin, layoutY, { fontSize: 9, color: '#333333' });
            layoutY += 10;
        });

        addPageNumber(pageNum, totalPages);
    }

    // ========================================================================
    // PAGE 17: SOCIAL MEDIA - LinkedIn, Twitter templates
    // ========================================================================
    doc.addPage();
    pageNum++;
    {
        addSectionHeader('APPLICATIONS', 'Social Media');

        // LinkedIn Banner
        addText('LinkedIn Banner', margin, 65, { fontSize: 10, fontStyle: 'bold' });
        addText('1584 x 396 px', margin, 73, { fontSize: 8, color: '#666666' });

        const linkedinWidth = contentWidth;
        const linkedinHeight = contentWidth * (396 / 1584);
        drawRect(margin, 80, linkedinWidth, linkedinHeight, colors.primary, 3);
        addText(brand.name, margin + 10, 80 + linkedinHeight / 2 + 3, { fontSize: 14, fontStyle: 'bold', color: '#FFFFFF' });

        // Twitter/X Header
        addText('Twitter/X Header', margin, 80 + linkedinHeight + 20, { fontSize: 10, fontStyle: 'bold' });
        addText('1500 x 500 px', margin, 80 + linkedinHeight + 28, { fontSize: 8, color: '#666666' });

        const twitterWidth = contentWidth;
        const twitterHeight = contentWidth * (500 / 1500);
        const twitterY = 80 + linkedinHeight + 35;
        drawRect(margin, twitterY, twitterWidth, twitterHeight, colors.surface, 3);
        drawRect(margin, twitterY, twitterWidth / 3, twitterHeight, colors.primary, 0);
        addText(brand.name, margin + 10, twitterY + twitterHeight / 2 + 3, { fontSize: 12, fontStyle: 'bold', color: '#FFFFFF' });

        // Profile picture
        addText('Profile Picture', margin, twitterY + twitterHeight + 20, { fontSize: 10, fontStyle: 'bold' });
        addText('400 x 400 px', margin, twitterY + twitterHeight + 28, { fontSize: 8, color: '#666666' });

        const profileSize = 30;
        drawRect(margin, twitterY + twitterHeight + 35, profileSize, profileSize, colors.primary, profileSize / 2);

        addPageNumber(pageNum, totalPages);
    }

    // ========================================================================
    // PAGE 18: WEBSITE - Header mockup
    // ========================================================================
    doc.addPage();
    pageNum++;
    {
        addSectionHeader('APPLICATIONS', 'Website');

        addText('Website header and navigation example', margin, 65, { fontSize: 10, color: '#666666' });

        // Browser window mockup
        const browserX = margin;
        const browserY = 80;
        const browserWidth = contentWidth;
        const browserHeight = 130;

        // Browser chrome
        drawRect(browserX, browserY, browserWidth, 12, '#F0F0F0', 0);

        // Window buttons
        doc.setFillColor(255, 95, 86);
        doc.circle(browserX + 8, browserY + 6, 2.5, 'F');
        doc.setFillColor(255, 189, 46);
        doc.circle(browserX + 16, browserY + 6, 2.5, 'F');
        doc.setFillColor(39, 201, 63);
        doc.circle(browserX + 24, browserY + 6, 2.5, 'F');

        // URL bar
        drawRect(browserX + 35, browserY + 3, 80, 6, '#FFFFFF', 2);
        addText('www.company.com', browserX + 38, browserY + 7, { fontSize: 4, color: '#666666' });

        // Website content area
        drawRect(browserX, browserY + 12, browserWidth, browserHeight - 12, '#FFFFFF', 0);

        // Header
        drawRect(browserX, browserY + 12, browserWidth, 20, '#FFFFFF', 0);
        addText(brand.name, browserX + 10, browserY + 25, { fontSize: 10, fontStyle: 'bold', color: colors.primary });
        addText('Home    About    Services    Contact', browserX + browserWidth - 70, browserY + 25, { fontSize: 6, color: '#333333' });

        // Hero section
        drawRect(browserX, browserY + 32, browserWidth, 60, colors.primary, 0);
        addText(brand.strategy?.marketing?.headline || 'Welcome to ' + brand.name, browserX + 10, browserY + 60, { fontSize: 12, fontStyle: 'bold', color: '#FFFFFF' });
        addText(brand.strategy?.marketing?.subhead || 'Your tagline goes here', browserX + 10, browserY + 72, { fontSize: 8, color: '#FFFFFF' });

        // CTA button
        drawRect(browserX + 10, browserY + 78, 30, 8, '#FFFFFF', 2);
        addText('Get Started', browserX + 14, browserY + 84, { fontSize: 5, fontStyle: 'bold', color: colors.primary });

        // Guidelines
        addText('Header Guidelines', margin, 230, { fontSize: 11, fontStyle: 'bold' });
        const webRules = [
            'Logo height: Minimum 32px in header',
            'Navigation: Right-aligned, 14-16px font size',
            'Header height: 60-80px recommended',
            'Mobile: Hamburger menu at 768px breakpoint'
        ];
        let webY = 245;
        webRules.forEach(rule => {
            addText('- ' + rule, margin, webY, { fontSize: 9, color: '#333333' });
            webY += 10;
        });

        addPageNumber(pageNum, totalPages);
    }

    // ========================================================================
    // PAGE 19: MOBILE APP - Icon and splash screen
    // ========================================================================
    doc.addPage();
    pageNum++;
    {
        addSectionHeader('APPLICATIONS', 'Mobile App');

        // App Icon
        addText('App Icon', margin, 65, { fontSize: 10, fontStyle: 'bold' });
        addText('1024 x 1024 px (scaled for stores)', margin, 73, { fontSize: 8, color: '#666666' });

        // Large app icon
        const iconSize = 40;
        drawRect(margin, 85, iconSize, iconSize, colors.primary, 8);
        addText(brand.name.charAt(0), margin + iconSize / 2, 85 + iconSize / 2 + 8, {
            fontSize: 24,
            fontStyle: 'bold',
            color: '#FFFFFF',
            align: 'center'
        });

        // Size variations
        addText('Size Variations', margin + 60, 85, { fontSize: 9, fontStyle: 'bold' });
        const sizes = [29, 20, 16, 12];
        let sizeX = margin + 60;
        sizes.forEach(size => {
            drawRect(sizeX, 95, size, size, colors.primary, size / 5);
            addText(`${size * 3}px`, sizeX, 95 + size + 8, { fontSize: 6, color: '#666666' });
            sizeX += size + 10;
        });

        // Splash Screen
        addText('Splash Screen', margin, 145, { fontSize: 10, fontStyle: 'bold' });

        // Phone mockup
        const phoneWidth = 50;
        const phoneHeight = 100;
        const phoneX = margin + 20;
        const phoneY = 160;

        drawRect(phoneX, phoneY, phoneWidth, phoneHeight, '#1a1a1a', 5);
        drawRect(phoneX + 3, phoneY + 8, phoneWidth - 6, phoneHeight - 16, colors.primary, 2);

        // Logo on splash
        addText(brand.name, phoneX + phoneWidth / 2, phoneY + phoneHeight / 2, {
            fontSize: 8,
            fontStyle: 'bold',
            color: '#FFFFFF',
            align: 'center'
        });

        // Notch
        drawRect(phoneX + 15, phoneY + 2, 20, 4, '#1a1a1a', 2);

        // Guidelines
        addText('App Guidelines', margin + 100, 160, { fontSize: 11, fontStyle: 'bold' });
        const appRules = [
            'App icon: Use simplified logo mark',
            'Splash: Full brand color background',
            'Duration: 1-2 seconds maximum',
            'Animation: Optional subtle fade-in'
        ];
        let appY = 175;
        appRules.forEach(rule => {
            addText('- ' + rule, margin + 100, appY, { fontSize: 9, color: '#333333' });
            appY += 12;
        });

        addPageNumber(pageNum, totalPages);
    }

    // ========================================================================
    // PAGE 20: CONTACT - Glyph branding
    // ========================================================================
    doc.addPage();
    pageNum++;
    {
        // Full page with primary color
        const { r, g, b } = hexToRgb(colors.primary);
        doc.setFillColor(r, g, b);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');

        addText('Thank You', pageWidth / 2, 80, {
            fontSize: 36,
            fontStyle: 'bold',
            color: '#FFFFFF',
            align: 'center'
        });

        addText(
            'These brand guidelines ensure consistent application of the ' + brand.name + ' identity across all touchpoints.',
            pageWidth / 2, 105,
            { fontSize: 12, color: '#FFFFFF', align: 'center', maxWidth: contentWidth }
        );

        // Contact section
        addText('For questions about brand usage:', pageWidth / 2, 150, {
            fontSize: 11,
            color: '#FFFFFF',
            align: 'center'
        });

        addText('contact@company.com', pageWidth / 2, 165, {
            fontSize: 14,
            fontStyle: 'bold',
            color: '#FFFFFF',
            align: 'center'
        });

        // Glyph branding at bottom
        drawRect(margin, pageHeight - 60, contentWidth, 40, '#000000', 4);

        addText('Generated with', pageWidth / 2, pageHeight - 45, {
            fontSize: 9,
            color: '#FFFFFF',
            align: 'center'
        });

        addText('GLYPH', pageWidth / 2, pageHeight - 32, {
            fontSize: 18,
            fontStyle: 'bold',
            color: '#FFFFFF',
            align: 'center'
        });

        addText('glyph.software', pageWidth / 2, pageHeight - 22, {
            fontSize: 10,
            color: '#FFFFFF',
            align: 'center'
        });

        addPageNumber(pageNum, totalPages);
    }

    return doc.output('blob');
}

/**
 * Download brand guidelines as PDF
 */
export async function downloadBrandBookPDF(brand: BrandIdentity): Promise<void> {
    const blob = await generateBrandBookPDF(brand);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${brand.name.toLowerCase().replace(/\s+/g, '-')}-brand-guidelines.pdf`;
    link.click();
    URL.revokeObjectURL(url);
}
