"use client";

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export function AuthRescue() {
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const code = searchParams.get('code');
        if (code) {
            console.log("Captured auth code on landing page, redirecting to callback...");
            // Forward to the callback handler
            // We append next=/generator to ensure flow continues correctly
            router.push(`/auth/callback?code=${code}&next=/generator`);
        }
    }, [searchParams, router]);

    return null;
}
