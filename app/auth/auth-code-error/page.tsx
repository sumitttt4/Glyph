'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ErrorContent() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 px-4 text-center">
            <h1 className="text-4xl font-bold mb-4 text-stone-900">Authentication Error</h1>
            <p className="text-lg mb-8 text-stone-600 max-w-md">
                {error ? `Error: ${error}` : 'There was an error authenticating your request. Please try signing in again.'}
            </p>
            <a
                href="/login"
                className="px-6 py-3 bg-stone-900 text-white rounded-full hover:bg-stone-800 transition font-medium"
            >
                Back to Login
            </a>
        </div>
    );
}

export default function AuthCodeError() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ErrorContent />
        </Suspense>
    );
}
