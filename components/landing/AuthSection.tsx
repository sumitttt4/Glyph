import { ArrowRight, Github } from 'lucide-react';
import { SignInButton } from "@clerk/nextjs";

export function AuthSection() {
    return (
        <section className="relative flex flex-col items-center justify-center py-24 border-y border-stone-100 bg-stone-50/50 overflow-hidden">

            {/* Subtle Orange Blur Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-200/20 rounded-full blur-[100px] pointer-events-none" />

            {/* The "Glass Card" Container */}
            <div className="relative w-full max-w-md bg-white rounded-2xl border border-zinc-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-10 z-10 transition-transform hover:scale-[1.01] duration-500">

                <div className="space-y-8">
                    {/* Header Content */}
                    <div className="text-center space-y-6">
                        {/* Social Proof Avatars */}
                        <div className="flex justify-center -space-x-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-zinc-200 overflow-hidden shadow-sm">
                                    <img
                                        src={`https://i.pravatar.cc/100?img=${i + 10}`}
                                        alt="Member"
                                        className="w-full h-full object-cover opacity-90"
                                    />
                                </div>
                            ))}
                        </div>

                        <div>
                            <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
                                Join the Design Engineer <span className="font-serif italic text-orange-600">Club</span>.
                            </h2>
                            <p className="mt-3 text-zinc-500 text-lg leading-relaxed">
                                Save your generated brands and export premium assets.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-5">
                        {/* Primary Action - Vibrant Orange */}
                        <SignInButton mode="modal">
                            <button className="w-full h-12 bg-[#F97316] hover:bg-[#ea580c] text-white rounded-xl font-semibold shadow-lg shadow-orange-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group">
                                Save My Brand
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </SignInButton>

                        {/* Divider */}
                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-zinc-200" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-3 text-zinc-400 font-medium tracking-wide">Or continue with</span>
                            </div>
                        </div>

                        {/* Social Auth Buttons */}
                        <div className="grid grid-cols-2 gap-4">
                            <SignInButton mode="modal">
                                <button className="flex items-center justify-center gap-2 h-11 border border-zinc-200 bg-white rounded-lg hover:bg-zinc-50 text-zinc-700 transition-colors font-medium text-sm">
                                    <Github className="w-4 h-4" />
                                    GitHub
                                </button>
                            </SignInButton>

                            <SignInButton mode="modal">
                                <button className="flex items-center justify-center gap-2 h-11 border border-zinc-200 bg-white rounded-lg hover:bg-zinc-50 text-zinc-700 transition-colors font-medium text-sm">
                                    <div className="w-4 h-4 flex items-center justify-center font-bold text-sm bg-red-500 rounded-full text-white leading-none">G</div>
                                    Google
                                </button>
                            </SignInButton>
                        </div>
                    </div>

                    <p className="text-center text-sm text-zinc-400">
                        Already have an account?{' '}
                        <SignInButton mode="modal">
                            <span className="font-semibold text-zinc-900 cursor-pointer hover:underline decoration-orange-500/50 underline-offset-4">Log in</span>
                        </SignInButton>
                    </p>
                </div>
            </div>
        </section>
    );
}

