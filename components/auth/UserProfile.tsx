'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useUser, useClerk, SignInButton, SignedOut, SignedIn } from '@clerk/nextjs';
import { useSubscription } from '@/hooks/use-subscription';
import { ArrowRight, LogOut, LayoutDashboard, Sparkles, History, Settings, Lock, CheckCircle2, Star } from 'lucide-react';

export default function UserProfile() {
    const { user } = useUser();
    const { signOut } = useClerk();
    const { isPro, isAdmin } = useSubscription();
    const [isOpen, setIsOpen] = useState(false);

    // Custom Avatar (using Clerk's image or fallback)
    const avatarUrl = user?.imageUrl;
    const fullName = user?.fullName || 'User';
    const email = user?.primaryEmailAddress?.emailAddress || '';

    // Determine Plan Display
    let planName = 'Free Plan';
    let planColor = 'bg-stone-400';
    let planTextColor = 'text-stone-500';
    let headerGradient = 'from-stone-50 to-stone-100';

    if (isAdmin) {
        planName = 'Admin';
        planColor = 'bg-amber-500';
        planTextColor = 'text-amber-600';
        headerGradient = 'from-amber-50 to-orange-50';
    } else if (isPro) {
        planName = 'Pro Plan';
        planColor = 'bg-green-500';
        planTextColor = 'text-green-600';
        headerGradient = 'from-emerald-50 to-teal-50';
    }

    return (
        <div className="relative">
            {/* Signed Out State */}
            <SignedOut>
                <button
                    onClick={() => window.location.href = '/login'}
                    className="flex items-center gap-3 pl-1.5 pr-4 py-1.5 bg-white border border-stone-200 rounded-full shadow-sm hover:shadow-md hover:border-stone-300 transition-all group"
                >
                    {/* Guest Avatar */}
                    <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-stone-100 bg-stone-50">
                        <Image
                            src="https://api.dicebear.com/7.x/notionists/svg?seed=guest&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf"
                            alt="Guest"
                            width={32}
                            height={32}
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                    </div>
                    <span className="text-sm font-medium text-stone-600 group-hover:text-stone-900">Sign In</span>
                </button>
            </SignedOut>

            {/* Signed In State */}
            <SignedIn>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 pl-1 pr-3 py-1 hover:bg-stone-100 rounded-full transition-colors border border-transparent hover:border-stone-200 group"
                >
                    <div className="relative">
                        <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-stone-200 group-hover:ring-stone-300 transition-all shadow-sm">
                            {avatarUrl && (
                                <Image
                                    src={avatarUrl}
                                    alt={fullName}
                                    width={36}
                                    height={36}
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>
                        {isAdmin && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center ring-2 ring-white">
                                <Sparkles className="w-2.5 h-2.5 text-white" />
                            </div>
                        )}
                    </div>
                    <span className="text-sm font-medium text-stone-700 max-w-[100px] truncate hidden md:block">
                        {user?.firstName || 'User'}
                    </span>
                    <div className={`w-2 h-2 rounded-full ${planColor} ml-1 md:hidden`} />
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <div className="absolute top-full right-0 mt-3 w-72 bg-white border border-stone-200 rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">

                            {/* Header */}
                            <div className={`p-5 border-b border-stone-100 bg-gradient-to-br ${headerGradient}`}>
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-14 h-14 rounded-full overflow-hidden ring-4 ring-white shadow-md">
                                            {avatarUrl && (
                                                <Image
                                                    src={avatarUrl}
                                                    alt={fullName}
                                                    width={56}
                                                    height={56}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>
                                        {isAdmin && (
                                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center ring-2 ring-white shadow-sm">
                                                <Sparkles className="w-3.5 h-3.5 text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold text-lg text-stone-900 truncate leading-tight mb-0.5">
                                            {fullName}
                                        </div>
                                        <div className="text-xs text-stone-500 truncate mb-2 font-medium">
                                            {email}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div className={`w-2 h-2 rounded-full ${planColor}`} />
                                            <span className={`text-[10px] uppercase tracking-wider font-bold ${planTextColor}`}>
                                                {planName}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Menu Items */}
                            <div className="p-2 space-y-0.5">
                                <button className="w-full text-left px-3 py-2.5 text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-900 rounded-xl flex items-center gap-3 transition-colors group">
                                    <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                                        <History className="w-4.5 h-4.5" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-stone-800">Generation History</div>
                                        <div className="text-[11px] text-stone-400 font-medium">View past brands</div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => window.location.href = '/settings'}
                                    className="w-full text-left px-3 py-2.5 text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-900 rounded-xl flex items-center gap-3 transition-colors group"
                                >
                                    <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                                        <Settings className="w-4.5 h-4.5" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-stone-800">Profile Settings</div>
                                        <div className="text-[11px] text-stone-400 font-medium">Manage account</div>
                                    </div>
                                </button>

                                {isAdmin ? (
                                    <>
                                        <button className="w-full text-left px-3 py-2.5 text-sm text-stone-600 hover:bg-amber-50 hover:text-amber-900 rounded-xl flex items-center gap-3 transition-colors group">
                                            <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                                                <Lock className="w-4.5 h-4.5" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-stone-800">Admin Dashboard</div>
                                                <div className="text-[11px] text-stone-400 font-medium">Manage users & system</div>
                                            </div>
                                        </button>
                                        <div className="px-3 py-2.5 flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                                <CheckCircle2 className="w-4.5 h-4.5" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-stone-800">All Features Unlocked</div>
                                                <div className="text-[11px] text-stone-400 font-medium">Full admin access</div>
                                            </div>
                                        </div>
                                    </>
                                ) : isPro ? (
                                    <button className="w-full text-left px-3 py-2.5 text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-900 rounded-xl flex items-center gap-3 transition-colors group">
                                        <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                                            <Sparkles className="w-4.5 h-4.5" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-stone-800">Pro Active</div>
                                            <div className="text-[11px] text-stone-400 font-medium">Unlimited brands & exports</div>
                                        </div>
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => window.location.href = '/pricing'}
                                        className="w-full text-left px-3 py-2.5 text-sm text-stone-600 hover:bg-orange-50 hover:text-orange-900 rounded-xl flex items-center gap-3 transition-colors group"
                                    >
                                        <div className="w-9 h-9 rounded-lg bg-orange-500 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                                            <Star className="w-4.5 h-4.5 fill-current" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-stone-800 group-hover:text-orange-700">Upgrade to Pro</div>
                                            <div className="text-[11px] text-stone-400 font-medium group-hover:text-orange-600/80">Unlimited brands & exports</div>
                                        </div>
                                    </button>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-2 border-t border-stone-100 mt-1 bg-stone-50/50">
                                <button
                                    onClick={() => signOut()}
                                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-3 transition-colors group"
                                >
                                    <div className="w-8 h-8 rounded-md bg-white border border-stone-200 text-red-500 flex items-center justify-center group-hover:border-red-200 transition-colors shadow-sm">
                                        <LogOut className="w-4 h-4" />
                                    </div>
                                    <span className="font-semibold">Sign Out</span>
                                </button>
                            </div>

                        </div>
                    </>
                )}
            </SignedIn>
        </div>
    );
}
