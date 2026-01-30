/**
 * Email Signature Generator
 * 
 * Generates professional email signature templates for multiple clients:
 * - Gmail (table-based layout)
 * - Outlook (Office 365 compatible)
 * - Apple Mail (WebKit optimized)
 * - Plain text fallback
 */

import { BrandIdentity } from '@/lib/data';
import { getStoredLogoSVG } from '@/components/logo-engine/renderers/stored-logo-export';

// ============================================
// TYPES
// ============================================

interface EmailSignatureTemplate {
    name: string;
    filename: string;
    html: string;
    instructions: string;
}

// ============================================
// GMAIL SIGNATURE (Table-based, Gmail-safe)
// ============================================

function generateGmailSignature(brand: BrandIdentity): string {
    const colors = brand.theme.tokens.light;
    const logoSvgDataUri = `data:image/svg+xml;base64,${btoa(getStoredLogoSVG(brand, 'color'))}`;

    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
    <table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; font-size: 14px; color: #333333; max-width: 500px;">
        <tr>
            <td style="padding-bottom: 10px;">
                <img src="${logoSvgDataUri}" alt="${brand.name}" style="height: 60px; display: block; border: 0;" />
            </td>
        </tr>
        <tr>
            <td style="padding-bottom: 5px; font-size: 16px; font-weight: bold; color: ${colors.text};">
                [Your Name]
            </td>
        </tr>
        <tr>
            <td style="padding-bottom: 5px; font-size: 13px; color: ${colors.muted || '#666666'};">
                [Your Title]
            </td>
        </tr>
        <tr>
            <td style="padding-bottom: 15px; font-size: 13px; font-weight: 600; color: ${colors.primary};">
                ${brand.name}
            </td>
        </tr>
        <tr>
            <td style="padding-bottom: 3px; font-size: 13px; color: #666666;">
                📧 [your.email@${brand.name.toLowerCase().replace(/\s+/g, '')}.com]
            </td>
        </tr>
        <tr>
            <td style="padding-bottom: 3px; font-size: 13px; color: #666666;">
                📱 [+1 (555) 123-4567]
            </td>
        </tr>
        <tr>
            <td style="padding-bottom: 3px; font-size: 13px; color: #666666;">
                🌐 <a href="https://www.${brand.name.toLowerCase().replace(/\s+/g, '')}.com" style="color: ${colors.primary}; text-decoration: none;">www.${brand.name.toLowerCase().replace(/\s+/g, '')}.com</a>
            </td>
        </tr>
        <tr>
            <td style="padding-top: 15px; padding-bottom: 5px; font-size: 11px; color: #999999; border-top: 1px solid #eeeeee;">
                ${brand.strategy?.tagline || 'Building the future, one idea at a time'}
            </td>
        </tr>
    </table>
</body>
</html>`;
}

// ============================================
// OUTLOOK SIGNATURE (Office 365 Compatible)
// ============================================

function generateOutlookSignature(brand: BrandIdentity): string {
    const colors = brand.theme.tokens.light;
    const logoSvgDataUri = `data:image/svg+xml;base64,${btoa(getStoredLogoSVG(brand, 'color'))}`;

    return `<!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="UTF-8">
    <!--[if gte mso 9]>
    <xml>
        <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
    </xml>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0;">
    <table border="0" cellpadding="0" cellspacing="0" style="font-family: Calibri, Arial, sans-serif; font-size: 11pt; mso-line-height-rule: exactly;">
        <tr>
            <td style="padding-bottom: 12px;">
                <img src="${logoSvgDataUri}" alt="${brand.name}" height="60" style="height: 60px; border: 0; display: block;" />
            </td>
        </tr>
        <tr>
            <td style="font-size: 14pt; font-weight: bold; color: ${colors.text}; padding-bottom: 4px;">
                <span style="mso-line-height-rule: exactly;">[Your Name]</span>
            </td>
        </tr>
        <tr>
            <td style="font-size: 10pt; color: ${colors.muted || '#666666'}; padding-bottom: 4px;">
                <span style="mso-line-height-rule: exactly;">[Your Title]</span>
            </td>
        </tr>
        <tr>
            <td style="font-size: 10pt; font-weight: 600; color: ${colors.primary}; padding-bottom: 12px;">
                <span style="mso-line-height-rule: exactly;">${brand.name}</span>
            </td>
        </tr>
        <tr>
            <td style="font-size: 10pt; color: #666666; padding-bottom: 2px;">
                <span style="mso-line-height-rule: exactly;">📧 <a href="mailto:your.email@${brand.name.toLowerCase().replace(/\s+/g, '')}.com" style="color: inherit; text-decoration: none;">[your.email@${brand.name.toLowerCase().replace(/\s+/g, '')}.com]</a></span>
            </td>
        </tr>
        <tr>
            <td style="font-size: 10pt; color: #666666; padding-bottom: 2px;">
                <span style="mso-line-height-rule: exactly;">📱 [+1 (555) 123-4567]</span>
            </td>
        </tr>
        <tr>
            <td style="font-size: 10pt; color: #666666; padding-bottom: 12px;">
                <span style="mso-line-height-rule: exactly;">🌐 <a href="https://www.${brand.name.toLowerCase().replace(/\s+/g, '')}.com" style="color: ${colors.primary}; text-decoration: none;">www.${brand.name.toLowerCase().replace(/\s+/g, '')}.com</a></span>
            </td>
        </tr>
        <tr>
            <td style="font-size: 9pt; color: #999999; padding-top: 12px; border-top: 1px solid #eeeeee;">
                <span style="mso-line-height-rule: exactly;">${brand.strategy?.tagline || 'Building the future, one idea at a time'}</span>
            </td>
        </tr>
    </table>
</body>
</html>`;
}

// ============================================
// PLAIN TEXT SIGNATURE
// ============================================

function generatePlainTextSignature(brand: BrandIdentity): string {
    return `[Your Name]
[Your Title]
${brand.name}

Email: [your.email@${brand.name.toLowerCase().replace(/\s+/g, '')}.com]
Phone: [+1 (555) 123-4567]
Web: www.${brand.name.toLowerCase().replace(/\s+/g, '')}.com

${brand.strategy?.tagline || 'Building the future, one idea at a time'}`;
}

// ============================================
// MAIN EXPORT FUNCTION
// ============================================

export function generateAllEmailSignatures(brand: BrandIdentity): EmailSignatureTemplate[] {
    return [
        {
            name: 'Gmail Signature',
            filename: 'email-signature-gmail.html',
            html: generateGmailSignature(brand),
            instructions: `Gmail Installation:
1. Open Gmail Settings (gear icon → See all settings)
2. Scroll to "Signature" section
3. Click "Create new" and name it
4. Open email-signature-gmail.html in a browser
5. Select all (Ctrl+A / Cmd+A) and copy
6. Paste into Gmail signature editor
7. Replace [Your Name], [Your Title], and contact info
8. Click "Save Changes" at bottom`
        },
        {
            name: 'Outlook Signature',
            filename: 'email-signature-outlook.html',
            html: generateOutlookSignature(brand),
            instructions: `Outlook Installation (Desktop):
1. Open Outlook and go to File → Options → Mail → Signatures
2. Click "New" to create a new signature
3. Open email-signature-outlook.html in a browser
4. Select all (Ctrl+A / Cmd+A) and copy
5. Paste into Outlook signature editor
6. Replace [Your Name], [Your Title], and contact info
7. Click "OK" to save

Outlook Web (Office 365):
1. Click Settings (gear icon) → View all Outlook settings
2. Go to Mail → Compose and reply
3. Open email-signature-outlook.html in a browser
4. Select all and copy, then paste into signature field
5. Replace placeholder text and save`
        },
        {
            name: 'Plain Text Signature',
            filename: 'email-signature-plain.txt',
            html: generatePlainTextSignature(brand),
            instructions: `Use this plain text version for:
- Email clients that don't support HTML
- Mobile email apps with limited formatting
- Terminal-based email clients
- As a fallback option

Simply copy and paste the text, replacing the placeholder information with your actual contact details.`
        }
    ];
}
