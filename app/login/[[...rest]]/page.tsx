"use client";

import Image from 'next/image';
import Link from 'next/link';
import { SignIn, ClerkLoading, ClerkLoaded } from '@clerk/nextjs';

export default function LoginPage() {
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

                <div className="w-full flex justify-center">
                    <ClerkLoading>
                        <div className="w-full max-w-[400px] space-y-8 animate-pulse">
                            <div className="space-y-2 text-center">
                                <div className="h-8 w-48 bg-stone-100 rounded-lg mx-auto" />
                                <div className="h-4 w-64 bg-stone-100 rounded-lg mx-auto" />
                            </div>
                            <div className="space-y-3">
                                <div className="h-12 w-full bg-stone-100 rounded-xl" />
                                <div className="h-12 w-full bg-stone-100 rounded-xl" />
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="h-px flex-1 bg-stone-100" />
                                <div className="h-4 w-8 bg-stone-100 rounded" />
                                <div className="h-px flex-1 bg-stone-100" />
                            </div>
                            <div className="space-y-4">
                                <div className="h-10 w-full bg-stone-100 rounded-lg" />
                                <div className="h-10 w-full bg-stone-100 rounded-lg" />
                                <div className="h-12 w-full bg-stone-200 rounded-xl" />
                            </div>
                        </div>
                    </ClerkLoading>

                    <ClerkLoaded>
                        <SignIn
                            appearance={{
                                elements: {
                                    rootBox: "mx-auto w-full",
                                    card: "shadow-none border-none p-0 w-full",
                                    headerTitle: "text-2xl font-bold text-stone-900",
                                    headerSubtitle: "text-stone-500",
                                    socialButtonsBlockButton: "rounded-xl border-stone-200 hover:bg-stone-50 text-stone-600 font-medium h-12",
                                    formButtonPrimary: "bg-stone-900 hover:bg-stone-800 text-white rounded-xl shadow-lg h-12",
                                    footerActionLink: "text-stone-900 hover:text-stone-700 font-bold",
                                    formFieldInput: "rounded-lg border-stone-200 focus:ring-stone-900 focus:border-stone-900 h-10",
                                }
                            }}
                            forceRedirectUrl="/generator"
                            signUpUrl="/signup"
                        />
                    </ClerkLoaded>
                </div>
            </div>
        </div>
    );
}
