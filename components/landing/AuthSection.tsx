import { ArrowRight, Github, Mail } from 'lucide-react';
import Image from 'next/image';

export function AuthSection() {
    return (
        <section className="flex flex-col lg:flex-row h-auto lg:h-[700px] border-y border-stone-200 bg-white">
            {/* 1. Visual Side (Half) */}
            {/* 1. Visual Side (Half) - Aesthetic Image */}
            <div className="w-full lg:w-1/2 relative bg-stone-900 overflow-hidden min-h-[400px] lg:min-h-0">
                <Image
                    src="/auth-visual.jpg"
                    alt="Design Engineer Aesthetic"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/10" />
            </div>

            {/* 2. Auth Form Side (Half) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-20">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold tracking-tight text-stone-900">
                            Join the <span className="text-[#FF4500]">Design Engineer</span> Club.
                        </h2>
                        <p className="mt-2 text-stone-500">
                            Sign up to save your generated brands and export premium assets.
                        </p>
                    </div>

                    {/* Social Auth Buttons */}
                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-2 px-4 py-3 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors font-medium text-sm">
                            <Github className="w-5 h-5" />
                            GitHub
                        </button>
                        <button className="flex items-center justify-center gap-2 px-4 py-3 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors font-medium text-sm">
                            <div className="w-5 h-5 flex items-center justify-center font-bold text-lg bg-red-500 rounded-full text-white leading-none">G</div>
                            Google
                        </button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-stone-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-stone-400 font-medium tracking-wide">Or continue with email</span>
                        </div>
                    </div>

                    {/* Email Form */}
                    <form className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">Email address</label>
                            <input
                                type="email"
                                id="email"
                                className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:ring-2 focus:ring-[#FF4500] focus:border-transparent outline-none transition-all"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-1">Password</label>
                            <input
                                type="password"
                                id="password"
                                className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:ring-2 focus:ring-[#FF4500] focus:border-transparent outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="button" // Prevent submission for now
                            className="w-full py-4 bg-stone-900 text-white rounded-xl font-bold hover:bg-stone-800 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
                        >
                            Create Account
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                    <p className="text-center text-sm text-stone-500">
                        Already have an account? <span className="font-bold text-stone-900 cursor-pointer hover:underline">Log in</span>
                    </p>
                </div>
            </div>
        </section>
    );
}
