'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

export default function UserProfile() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const supabase = createClient();

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

    if (loading) return <div className="animate-pulse w-8 h-8 rounded-full bg-stone-200" />;

    if (!user) {
        return null;
    }

    return (
        <div className="relative w-full">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 p-2 hover:bg-stone-100 rounded-xl transition-colors w-full border border-transparent hover:border-stone-200"
            >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold shadow-sm text-sm ring-2 ring-white">
                    {user.user_metadata?.full_name?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 text-left hidden md:block">
                    <div className="text-sm font-bold text-stone-900 truncate max-w-[140px]">
                        {user.user_metadata?.full_name || 'User'}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] text-stone-500 font-mono font-medium">PRO PLAN</span>
                    </div>
                </div>
                <svg className={`w-4 h-4 text-stone-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute bottom-full left-0 mb-3 w-full bg-white border border-stone-200 rounded-xl shadow-xl p-1.5 overflow-hidden animate-in slide-in-from-bottom-2 z-50">
                    <div className="px-3 py-2 border-b border-stone-100 mb-1">
                        <div className="text-[10px] font-mono text-stone-400 uppercase tracking-wider">Signed in as</div>
                        <div className="text-xs font-semibold text-stone-900 truncate">{user.email}</div>
                    </div>

                    <button onClick={() => window.location.href = '/history'} className="w-full text-left px-3 py-2 text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-900 rounded-lg flex items-center gap-2 transition-colors">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" /></svg>
                        Generation History
                    </button>

                    <button className="w-full text-left px-3 py-2 text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-900 rounded-lg flex items-center gap-2 transition-colors">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                        Profile Settings
                    </button>

                    <div className="h-px bg-stone-100 my-1.5" />

                    <button onClick={handleSignOut} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 transition-colors">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                        Sign Out
                    </button>
                </div>
            )}
        </div>
    )
}
