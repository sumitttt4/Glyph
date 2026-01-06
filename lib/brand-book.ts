/**
 * Brand Book PDF Generator
 * 
 * Generates a comprehensive brand guidelines document
 * Uses HTML that can be printed to PDF or exported
 */

import { BrandIdentity } from './data';

/**
 * Generate brand book HTML content
 */
export function generateBrandBookHTML(brand: BrandIdentity): string {
    const colors = brand.theme.tokens.light;
    const darkColors = brand.theme.tokens.dark;
    const initial = brand.name.charAt(0).toUpperCase();

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${brand.name} - Brand Guidelines</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Inter', system-ui, sans-serif;
            color: #1a1a1a;
            line-height: 1.6;
            background: white;
        }
        
        .page {
            width: 8.5in;
            min-height: 11in;
            padding: 1in;
            margin: 0 auto;
            page-break-after: always;
        }
        
        .cover {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            background: linear-gradient(135deg, ${colors.primary}, ${colors.accent || colors.primary});
            color: white;
        }
        
        .cover-logo {
            width: 120px;
            height: 120px;
            background: white;
            border-radius: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 64px;
            font-weight: 800;
            color: ${colors.primary};
            margin-bottom: 2rem;
        }
        
        .cover h1 {
            font-size: 3rem;
            font-weight: 800;
            margin-bottom: 0.5rem;
        }
        
        .cover p {
            font-size: 1.25rem;
            opacity: 0.9;
        }
        
        h2 {
            font-size: 1.75rem;
            font-weight: 700;
            margin-bottom: 1.5rem;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid ${colors.primary};
        }
        
        h3 {
            font-size: 1.25rem;
            font-weight: 600;
            margin: 1.5rem 0 1rem;
        }
        
        .section {
            margin-bottom: 2rem;
        }
        
        .color-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
            margin: 1rem 0;
        }
        
        .color-swatch {
            padding: 1.5rem;
            border-radius: 12px;
            text-align: center;
        }
        
        .color-swatch .name {
            font-weight: 600;
            margin-bottom: 0.5rem;
        }
        
        .color-swatch .hex {
            font-family: monospace;
            font-size: 0.875rem;
            opacity: 0.8;
        }
        
        .logo-usage {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            margin: 1.5rem 0;
        }
        
        .logo-example {
            padding: 2rem;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .logo-mark {
            width: 80px;
            height: 80px;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48px;
            font-weight: 800;
        }
        
        .do-dont {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            margin-top: 1rem;
        }
        
        .do, .dont {
            padding: 1.5rem;
            border-radius: 12px;
        }
        
        .do {
            background: #dcfce7;
            border: 2px solid #22c55e;
        }
        
        .dont {
            background: #fee2e2;
            border: 2px solid #ef4444;
        }
        
        .do h4, .dont h4 {
            font-size: 0.875rem;
            font-weight: 700;
            text-transform: uppercase;
            margin-bottom: 0.5rem;
        }
        
        .do h4 { color: #22c55e; }
        .dont h4 { color: #ef4444; }
        
        .typography-sample {
            margin: 1rem 0;
            padding: 1.5rem;
            background: #f5f5f5;
            border-radius: 12px;
        }
        
        .type-heading {
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
        }
        
        .type-body {
            font-size: 1rem;
            color: #525252;
        }
        
        .footer {
            margin-top: 2rem;
            padding-top: 1rem;
            border-top: 1px solid #e5e5e5;
            font-size: 0.75rem;
            color: #737373;
            text-align: center;
        }
        
        @media print {
            .page { margin: 0; }
        }
    </style>
</head>
<body>
    <!-- Cover Page -->
    <div class="page cover">
        <div class="cover-logo">${initial}</div>
        <h1>${brand.name}</h1>
        <p>Brand Identity Guidelines</p>
    </div>

    <!-- Logo Usage -->
    <div class="page">
        <h2>Logo Usage</h2>
        
        <div class="section">
            <h3>Primary Logo</h3>
            <div class="logo-usage">
                <div class="logo-example" style="background: ${colors.bg};">
                    <div class="logo-mark" style="background: ${colors.primary}; color: white;">${initial}</div>
                </div>
                <div class="logo-example" style="background: ${darkColors.bg};">
                    <div class="logo-mark" style="background: ${darkColors.primary}; color: white;">${initial}</div>
                </div>
            </div>
        </div>
        
        <div class="section">
            <h3>Clear Space</h3>
            <p>Always maintain a minimum clear space around the logo equal to the height of the letter "${initial}".</p>
        </div>
        
        <div class="section">
            <h3>Do's and Don'ts</h3>
            <div class="do-dont">
                <div class="do">
                    <h4>✓ Do</h4>
                    <ul>
                        <li>Use approved colors only</li>
                        <li>Maintain clear space</li>
                        <li>Use on contrasting backgrounds</li>
                    </ul>
                </div>
                <div class="dont">
                    <h4>✗ Don't</h4>
                    <ul>
                        <li>Stretch or distort</li>
                        <li>Change colors arbitrarily</li>
                        <li>Add effects or shadows</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <!-- Colors -->
    <div class="page">
        <h2>Color Palette</h2>
        
        <div class="section">
            <h3>Light Mode</h3>
            <div class="color-grid">
                <div class="color-swatch" style="background: ${colors.primary}; color: white;">
                    <div class="name">Primary</div>
                    <div class="hex">${colors.primary}</div>
                </div>
                <div class="color-swatch" style="background: ${colors.accent || colors.primary}; color: white;">
                    <div class="name">Accent</div>
                    <div class="hex">${colors.accent || colors.primary}</div>
                </div>
                <div class="color-swatch" style="background: ${colors.bg}; border: 1px solid #e5e5e5;">
                    <div class="name">Background</div>
                    <div class="hex">${colors.bg}</div>
                </div>
                <div class="color-swatch" style="background: ${colors.text}; color: white;">
                    <div class="name">Text</div>
                    <div class="hex">${colors.text}</div>
                </div>
                <div class="color-swatch" style="background: ${colors.surface}; border: 1px solid #e5e5e5;">
                    <div class="name">Surface</div>
                    <div class="hex">${colors.surface}</div>
                </div>
                <div class="color-swatch" style="background: ${colors.muted}; color: white;">
                    <div class="name">Muted</div>
                    <div class="hex">${colors.muted}</div>
                </div>
            </div>
        </div>
        
        <div class="section">
            <h3>Dark Mode</h3>
            <div class="color-grid">
                <div class="color-swatch" style="background: ${darkColors.primary}; color: white;">
                    <div class="name">Primary</div>
                    <div class="hex">${darkColors.primary}</div>
                </div>
                <div class="color-swatch" style="background: ${darkColors.bg}; color: white;">
                    <div class="name">Background</div>
                    <div class="hex">${darkColors.bg}</div>
                </div>
                <div class="color-swatch" style="background: ${darkColors.text};">
                    <div class="name">Text</div>
                    <div class="hex">${darkColors.text}</div>
                </div>
            </div>
        </div>
    </div>

    <!-- Typography -->
    <div class="page">
        <h2>Typography</h2>
        
        <div class="section">
            <h3>Font Pairing</h3>
            <p><strong>Heading:</strong> ${brand.font?.name || 'Inter'}</p>
            <p><strong>Body:</strong> ${brand.font?.name || 'Inter'}</p>
            
            <div class="typography-sample">
                <div class="type-heading">${brand.name}</div>
                <div class="type-body">The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.</div>
            </div>
        </div>
        
        <div class="section">
            <h3>Type Scale</h3>
            <div style="margin: 1rem 0;">
                <div style="font-size: 2.5rem; font-weight: 700;">Display — 40px</div>
                <div style="font-size: 2rem; font-weight: 700;">H1 — 32px</div>
                <div style="font-size: 1.5rem; font-weight: 600;">H2 — 24px</div>
                <div style="font-size: 1.25rem; font-weight: 600;">H3 — 20px</div>
                <div style="font-size: 1rem;">Body — 16px</div>
                <div style="font-size: 0.875rem; color: #737373;">Small — 14px</div>
            </div>
        </div>
        
        <div class="footer">
            Generated by Glyph • ${new Date().toLocaleDateString()}
        </div>
    </div>
</body>
</html>`;
}

/**
 * Open brand book in new window for printing/saving as PDF
 */
export function openBrandBookForPrint(brand: BrandIdentity): void {
    const html = generateBrandBookHTML(brand);
    const newWindow = window.open('', '_blank');
    if (newWindow) {
        newWindow.document.write(html);
        newWindow.document.close();
        // Trigger print dialog after a short delay to ensure content loads
        setTimeout(() => {
            newWindow.print();
        }, 500);
    }
}

/**
 * Download brand book as HTML file
 */
export function downloadBrandBookHTML(brand: BrandIdentity): void {
    const html = generateBrandBookHTML(brand);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${brand.name.toLowerCase().replace(/\s+/g, '-')}-brand-book.html`;
    link.click();
    URL.revokeObjectURL(url);
}
