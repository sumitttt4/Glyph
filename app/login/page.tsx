"use client";

import { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Github, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [loadingMessage, setLoadingMessage] = useState('Sending magic link...');
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const supabase = createClient();

    const handleMagicLink = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setMessage(null);


        try {
            // DEVELOPER BACKDOOR
            if (email === 'sumitsharma9128@gmail.com') {
                router.push('/generator');
                return;
            }

            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${location.origin}/auth/callback`,
                },
            });

            if (error) throw error;
            setMessage('Magic link sent! Check your email to log in.');
        } catch (err: any) {
            setError(err.message);
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
