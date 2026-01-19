'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { getSubscriptionStatus, getPlanDisplayInfo } from '@/lib/subscription';

// Generate a consistent DiceBear avatar URL based on user identifier
function getAvatarUrl(seed: string): string {
    // Using 'notionists' style for professional, stylized avatars
    return `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
}

export default function UserProfile() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const supabase = createClient();

    // Get subscription status
    const subscriptionStatus = useMemo(() => {
        return getSubscriptionStatus(user?.email);
    }, [user?.email]);

    const { isAdmin, isPro, plan } = subscriptionStatus;
    const planInfo = getPlanDisplayInfo(plan);

    // Generate avatar URL based on user email (consistent per user)
    const avatarUrl = useMemo(() => {
        if (!user?.email) return getAvatarUrl('guest');
        return getAvatarUrl(user.email);
    }, [user?.email]);

    useEffect(() => {
        const getUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                setUser(user);
            } catch (e) {
                console.error('Auth Error', e);
            } finally {
                setLoading(false);
            }
        };
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });
        return () => subscription.unsubscribe();
    }, [supabase]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.reload();
    };

    const handleLogin = () => {
        window.location.href = '/login';
    };

    // Loading skeleton
    if (loading) {
        return (
            <div className="animate-pulse w-10 h-10 rounded-full bg-gradient-to-br from-stone-200 to-stone-300" />
        );
    }

    // Not logged in - show login button with guest avatar
    if (!user) {
        return (
            <button
                onClick={handleLogin}
                className="flex items-center gap-2 px-3 py-2 h-10 border border-stone-200 rounded-full bg-white shadow-sm text-sm font-medium text-stone-700 hover:border-stone-400 transition-all"
            >
                <div className="w-6 h-6 rounded-full overflow-hidden ring-2 ring-stone-100">
                    <Image
                        src={getAvatarUrl('guest')}
                        alt="Guest"
                        width={24}
                        height={24}
                        className="w-full h-full"
                    />
                </div>
                <span className="hidden md:inline">Sign In</span>
            </button>
        );
    }

    // Get first name from full name or email
    const getFirstName = () => {
        if (user.user_metadata?.full_name) {
            return user.user_metadata.full_name.split(' ')[0];
        }
        if (user.email) {
            return user.email.split('@')[0];
        }
        return 'User';
    };

    // Logged in - show profile with avatar dropdown
    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-2 py-1.5 hover:bg-stone-100 rounded-full transition-colors border border-transparent hover:border-stone-200 group"
            >
                {/* Cool DiceBear Avatar */}
                <div className="relative">
                    <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-stone-200 group-hover:ring-stone-300 transition-all shadow-sm">
                        <Image
                            src={avatarUrl}
                            alt={user.user_metadata?.full_name || 'User'}
                            width={36}
                            height={36}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {/* Admin badge */}
                    {isAdmin && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center ring-2 ring-white">
                            <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        </div>
                    )}
                </div>

                {/* User's first name - hidden on mobile */}
                <span className="hidden md:inline text-sm font-medium text-stone-700 max-w-[100px] truncate">
                    {getFirstName()}
                </span>

                {/* Dropdown indicator */}
                <svg
                    className={`w-3 h-3 text-stone-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                >
                    <path d="M6 9l6 6 6-6" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Menu */}
                    <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-stone-200 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                        {/* User Header */}
                        <div className={`p-4 border-b border-stone-200 ${isAdmin ? 'bg-gradient-to-br from-amber-50 to-orange-50' : 'bg-gradient-to-br from-stone-50 to-stone-100'}`}>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-white shadow-lg">
                                        <Image
                                            src={avatarUrl}
                                            alt={user.user_metadata?.full_name || 'User'}
                                            width={56}
                                            height={56}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    {isAdmin && (
                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center ring-2 ring-white">
                                            <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-bold text-stone-900 truncate">
                                        {user.user_metadata?.full_name || 'User'}
                                    </div>
                                    <div className="text-xs text-stone-500 truncate">
                                        {user.email}
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        {plan === 'admin' ? (
                                            <>
                                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                                <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">Admin</span>
                                            </>
                                        ) : plan === 'pro' ? (
                                            <>
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                                <span className="text-[10px] text-green-600 font-semibold uppercase tracking-wider">Pro Plan</span>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                                                <span className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider">Free Plan</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2">
                            <button
                                onClick={() => window.location.href = '/history'}
                                className="w-full text-left px-3 py-2.5 text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-900 rounded-xl flex items-center gap-3 transition-colors"
                            >
                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="font-medium">Generation History</div>
                                    <div className="text-[10px] text-stone-400">View past brands</div>
                                </div>
                            </button>

                            <button
                                className="w-full text-left px-3 py-2.5 text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-900 rounded-xl flex items-center gap-3 transition-colors"
                            >
                                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="font-medium">Profile Settings</div>
                                    <div className="text-[10px] text-stone-400">Manage account</div>
                                </div>
                            </button>

                            {/* Admin-only options */}
                            {isAdmin && (
                                <button
                                    className="w-full text-left px-3 py-2.5 text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-900 rounded-xl flex items-center gap-3 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="font-medium">Admin Dashboard</div>
                                        <div className="text-[10px] text-stone-400">Manage users & system</div>
                                    </div>
                                </button>
                            )}

                            {plan === 'free' ? (
                                <button
                                    onClick={() => window.location.href = '/pricing'}
                                    className="w-full text-left px-3 py-2.5 text-sm text-stone-600 hover:bg-amber-50 hover:text-stone-900 rounded-xl flex items-center gap-3 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="font-medium text-amber-700">Upgrade to Pro</div>
                                        <div className="text-[10px] text-amber-600">Unlimited brands & exports</div>
                                    </div>
                                </button>
                            ) : (
                                <button
                                    className="w-full text-left px-3 py-2.5 text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-900 rounded-xl flex items-center gap-3 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="font-medium">{isAdmin ? 'All Features Unlocked' : 'Pro Active'}</div>
                                        <div className="text-[10px] text-stone-400">{isAdmin ? 'Full admin access' : 'Unlimited brands & exports'}</div>
                                    </div>
                                </button>
                            )}
                        </div>

                        {/* Sign Out */}
                        <div className="p-2 pt-0 border-t border-stone-100 mt-1">
                            <button
                                onClick={handleSignOut}
                                className="w-full text-left px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-3 transition-colors mt-1"
                            >
                                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                        <polyline points="16 17 21 12 16 7" />
                                        <line x1="21" y1="12" x2="9" y2="12" />
                                    </svg>
                                </div>
                                <div className="font-medium">Sign Out</div>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
