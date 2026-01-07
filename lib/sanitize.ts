/**
 * Input Sanitization Utilities
 * 
 * Security utilities for sanitizing user inputs.
 */

/**
 * Sanitize brand name input
 * - Removes potentially dangerous characters
 * - Trims whitespace
 * - Limits length
 */
export function sanitizeBrandName(name: string | undefined | null): string {
    if (!name || typeof name !== 'string') return 'Untitled Brand';

    // Remove HTML tags and dangerous characters
    let sanitized = name
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/[<>\"\'`]/g, '') // Remove quotes and angle brackets
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+=/gi, '') // Remove event handlers
        .trim();

    // Limit length
    if (sanitized.length > 50) {
        sanitized = sanitized.substring(0, 50);
    }

    // Ensure at least some content
    if (sanitized.length === 0) {
        return 'Untitled Brand';
    }

    return sanitized;
}

/**
 * Sanitize email input
 */
export function sanitizeEmail(email: string | undefined | null): string | null {
    if (!email || typeof email !== 'string') return null;

    const sanitized = email.trim().toLowerCase();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitized)) return null;

    // Length check
    if (sanitized.length > 254) return null;

    return sanitized;
}

/**
 * Sanitize generic text input
 */
export function sanitizeText(text: string | undefined | null, maxLength = 500): string {
    if (!text || typeof text !== 'string') return '';

    return text
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/[<>\"\'`]/g, '') // Remove quotes and angle brackets
        .trim()
        .substring(0, maxLength);
}

/**
 * Validate vibe selection
 */
export function isValidVibe(vibe: string): boolean {
    const validVibes = ['bold', 'minimalist', 'tech', 'nature', 'playful', 'luxury', 'modern', 'creative'];
    return validVibes.includes(vibe.toLowerCase());
}
