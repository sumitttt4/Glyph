import { ArrowRight, Github } from 'lucide-react';
import Image from 'next/image';
import { SignInButton } from "@clerk/nextjs";

export function AuthSection() {
    return (
        <section className="flex flex-col items-center justify-center py-20 lg:py-32 border-y border-stone-200 bg-white">
            <div className="w-full max-w-md px-6">
                <div className="space-y-10">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-stone-900">
                            Join the <span className="text-[#FF4500]">Design Engineer</span> Club.
                        </h2>
                        <p className="mt-2 text-stone-500 text-lg">
                            Save your generated brands and export premium assets.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {/* Primary Action - "Save My Brand" */}
                        <SignInButton mode="modal">
                            <button className="w-full py-4 bg-stone-900 text-white rounded-xl font-bold hover:bg-stone-800 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 group">
                                Save My Brand
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </SignInButton>

                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-stone-200" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-stone-400 font-medium tracking-wide">Or via Socials</span>
                            </div>
                        </div>

                        {/* Social Auth Buttons */}
                        <div className="grid grid-cols-2 gap-4">
                            <SignInButton mode="modal">
                                <button className="flex items-center justify-center gap-2 px-4 py-3 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors font-medium text-sm">
                                    <Github className="w-5 h-5" />
                                    GitHub
                                </button>
                            </SignInButton>

                            <SignInButton mode="modal">
                                <button className="flex items-center justify-center gap-2 px-4 py-3 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors font-medium text-sm">
                                    <div className="w-5 h-5 flex items-center justify-center font-bold text-lg bg-red-500 rounded-full text-white leading-none">G</div>
                                    Google
                                </button>
                            </SignInButton>
                        </div>
                    </div>

                    <p className="text-center text-sm text-stone-500">
                        Already have an account?{' '}
                        <SignInButton mode="modal">
                            <span className="font-bold text-stone-900 cursor-pointer hover:underline">Log in</span>
                        </SignInButton>
                    </p>
                </div>
            </div>
        </section>
    );
}

