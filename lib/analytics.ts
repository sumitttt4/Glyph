/**
 * Analytics utility for tracking conversion events throughout the pricing and generation flow.
 * 
 * Events tracked:
 * - pricing_page_viewed
 * - free_plan_clicked
 * - paid_plan_clicked
 * - generation_1_completed
 * - generation_2_completed
 * - generation_3_completed (paywall trigger)
 * - paywall_modal_shown
 * - paywall_modal_dismissed
 * - paywall_modal_converted
 * - download_attempted (free user)
 * - download_completed (paid user)
 * - download_intercept_upgraded
 * - download_proceeded_free
 * - checkout_started
 * - checkout_completed
 * - urgency_banner_clicked
 */

interface EventProperties {
    [key: string]: string | number | boolean | undefined;
}

/**
 * Track an analytics event
 * Integrates with Vercel Analytics, Google Analytics, or PostHog based on availability
 */
export function trackEvent(eventName: string, properties?: EventProperties): void {
    // Development logging
    if (process.env.NODE_ENV === "development") {
        console.log(`[Analytics] ${eventName}`, properties);
    }

    // Vercel Analytics
    if (typeof window !== "undefined" && (window as any).va) {
        (window as any).va("event", { name: eventName, ...properties });
    }

    // Google Analytics (gtag)
    if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", eventName, properties);
    }

    // PostHog
    if (typeof window !== "undefined" && (window as any).posthog) {
        (window as any).posthog.capture(eventName, {
            ...properties,
            timestamp: Date.now(),
        });
    }
}

/**
 * Track page view
 */
export function trackPageView(pageName: string, properties?: EventProperties): void {
    trackEvent("page_viewed", { page: pageName, ...properties });
}

/**
 * Track generation milestones
 */
export function trackGeneration(generationNumber: number, brandName?: string): void {
    const eventName = `generation_${generationNumber}_completed` as const;
    trackEvent(eventName, {
        generation_number: generationNumber,
        brand_name: brandName,
        is_paywall_trigger: generationNumber >= 3,
    });
}

/**
 * Track checkout events
 */
export function trackCheckout(action: "started" | "completed", amount?: number): void {
    trackEvent(`checkout_${action}`, {
        purchase_amount: amount,
        currency: "USD",
    });
}

/**
 * Identify user for analytics
 */
export function identifyUser(userId: string, traits?: EventProperties): void {
    // PostHog
    if (typeof window !== "undefined" && (window as any).posthog) {
        (window as any).posthog.identify(userId, traits);
    }

    // Google Analytics
    if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("config", process.env.NEXT_PUBLIC_GA_ID, {
            user_id: userId,
        });
    }
}

/**
 * Get user's generation count from localStorage
 */
export function getGenerationCount(): number {
    if (typeof window === "undefined") return 0;
    const count = localStorage.getItem("generation_count");
    return count ? parseInt(count, 10) : 0;
}

/**
 * Increment and return the new generation count
 */
export function incrementGenerationCount(): number {
    if (typeof window === "undefined") return 0;
    const currentCount = getGenerationCount();
    const newCount = currentCount + 1;
    localStorage.setItem("generation_count", newCount.toString());
    trackGeneration(newCount);
    return newCount;
}

/**
 * Check if user has exceeded free generation limit
 */
export function hasExceededFreeLimit(limit: number = 3): boolean {
    return getGenerationCount() >= limit;
}
