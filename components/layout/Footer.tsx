import Link from 'next/link';
import { Github, Twitter, Linkedin } from 'lucide-react';
import { GlyphLogo } from '@/components/logo-engine/LogoGlyph';

// ... (imports remain the same)

const FOOTER_LINKS = {
    product: [
        { label: 'Features', href: '#features' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Generator', href: '/generator' },
    ],
    // Company section removed
    legal: [
        { label: 'Privacy Policy', href: '/legal/privacy' },
        { label: 'Terms of Service', href: '/legal/terms' },
    ],
};

const SOCIAL_LINKS = [
    { icon: Twitter, href: 'https://x.com/Sumitthq', label: 'X (formerly Twitter)' }, // Updated to X link
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
];

export function Footer() {
    return (
        <footer className="bg-stone-950 text-stone-300">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 inline-block mb-4">
                            <GlyphLogo className="scale-90 text-white [&>span]:text-white" />
                        </div>
                        <p className="mt-4 text-sm text-stone-400 max-w-xs leading-relaxed">
                            The AI Design Engineer for startups. Generate premium brand identity systems in seconds.
                        </p>
                        <div className="flex gap-4 mt-6">
                            {SOCIAL_LINKS.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-full bg-stone-800 hover:bg-stone-700 transition-colors"
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Product</h4>
                        <ul className="space-y-3">
                            {FOOTER_LINKS.product.map((link) => (
                                <li key={link.label}>
                                    <a href={link.href} className="text-sm hover:text-white transition-colors">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                            <li>
                                <Link
                                    href="/design-system"
                                    className="text-sm font-medium text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-2"
                                >
                                    Design System
                                    <span className="bg-orange-500/20 text-orange-400 text-[10px] px-1.5 py-0.5 rounded-full border border-orange-500/30">
                                        Internal
                                    </span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal Links (Moved up to replace Company) */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Legal</h4>
                        <ul className="space-y-3">
                            {FOOTER_LINKS.legal.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-sm hover:text-white transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 pt-8 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-stone-500">
                        © 2026 Glyph Systems. All rights reserved.
                    </p>
                    <a
                        href="https://sumitsharmaa.me"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-stone-500 hover:text-stone-300 transition-colors"
                    >
                        Made by <span className="text-white hover:underline">Sumit</span>
                    </a>
                </div>
            </div>
        </footer>
    );
}
