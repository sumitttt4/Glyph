"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GlyphLogo } from '@/components/brand/GlyphLogo';

// ... (existing imports)

const NAV_LINKS = [
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#pricing', label: 'Pricing' },
];

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                isScrolled
                    ? 'bg-white/80 backdrop-blur-lg shadow-sm border-b border-stone-200'
                    : 'bg-transparent'
            )}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo */}
                    <Link href="/" className="group hover:opacity-90 transition-opacity">
                        <GlyphLogo className="h-8" />
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-8">
                        {NAV_LINKS.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="text-sm font-medium text-stone-600 hover:text-stone-950 transition-colors"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link
                            href="/login"
                            className="inline-flex items-center h-9 px-4 rounded-full bg-stone-950 text-white text-sm font-medium hover:bg-stone-800 transition-all shadow-lg hover:shadow-xl active:scale-95"
                        >
                            Launch Generator
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 text-stone-600"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-stone-200">
                    <div className="px-6 py-4 space-y-4">
                        {NAV_LINKS.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="block text-base font-medium text-stone-700 hover:text-stone-950"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.label}
                            </a>
                        ))}
                        <Link
                            href="/login"
                            className="block w-full text-center px-5 py-3 rounded-full bg-stone-950 text-white text-sm font-medium"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Launch Generator
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
