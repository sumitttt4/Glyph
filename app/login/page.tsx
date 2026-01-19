"use client";

import { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Github, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [loadingMessage, setLoadingMessage] = useState('Sending magic link...');
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const supabase = createClient();

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback?next=/generator`,
                },
            });
            if (error) throw error;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            setIsLoading(false);
        }
    };

    const handleMagicLink = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setMessage(null);

        try {
            // DEVELOPER BACKDOOR
            // Sets a cookie to bypass middleware checks
            if (email === 'sumitsharma9128@gmail.com') {
                document.cookie = "admin-bypass=true; path=/; max-age=31536000"; // 1 year
                router.push('/generator');
                return;
            }

            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback?next=/generator`,
                },
            });

            if (error) throw error;
            setMessage('Magic link sent! Check your email to log in.');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-white">
            {/* 1. Visual Side (Half) */}
            <div className="hidden lg:block w-1/2 relative bg-stone-900 overflow-hidden">
                <Image
                    src="/auth-visual.jpg"
                    alt="Design Engineer Aesthetic"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/10" />

                {/* Overlay Text */}
                <div className="absolute bottom-12 left-12 right-12 text-white">
                    <h2 className="text-3xl font-bold tracking-tight mb-2">Glyph Station</h2>
                    <p className="text-stone-300 opacity-80">Access the parametric brand generation engine.</p>
                </div>
            </div>

            {/* 2. Auth Form Side (Half) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-20 relative">
                <Link href="/" className="absolute top-8 right-8 text-sm text-stone-500 hover:text-stone-900 transition-colors">
                    Back to Home
                </Link>

                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h1 className="text-3xl font-bold tracking-tight text-stone-900">
                            Welcome <span className="text-[#FF4500]">Back</span>.
                        </h1>
                        <p className="mt-2 text-stone-500">
                            Enter your email to receive a secure login link.
                        </p>
                    </div>

                    {/* Error / Success Messages */}
                    {error && (
                        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}
                    {message && (
                        <div className="p-3 rounded-lg bg-green-50 text-green-600 text-sm flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            {message}
                        </div>
                    )}



                    {/* Google Login */}
                    <button
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="w-full h-12 bg-white text-stone-900 border border-stone-200 rounded-xl font-bold hover:bg-stone-50 transition-all shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center gap-2 mb-6"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Sign in with Google
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-stone-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-stone-500">Or continue with email</span>
                        </div>
                    </div>

                    {/* Email Form */}
                    <form onSubmit={handleMagicLink} className="space-y-4">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">Email address</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:ring-2 focus:ring-[#FF4500] focus:border-transparent outline-none transition-all placeholder:text-stone-400 font-medium"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 bg-stone-900 text-white rounded-xl font-bold hover:bg-stone-800 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Sending Link...' : 'Send Magic Link'}
                            {!isLoading && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
