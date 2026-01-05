import Link from 'next/link';
import { Github, Twitter, Linkedin } from 'lucide-react';
import { GlyphLogo } from "@/components/brand/GlyphLogo";

const FOOTER_LINKS = {
    product: [
        { label: 'Features', href: '#features' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Generator', href: '/generate' },
    ],
    company: [
        { label: 'About', href: '#' },
        { label: 'Blog', href: '#' },
        { label: 'Careers', href: '#' },
    ],
    legal: [
        { label: 'Privacy', href: '#' },
        { label: 'Terms', href: '#' },
    ],
};

const SOCIAL_LINKS = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
];

export function Footer() {
    return (
        <footer className="bg-[#0C0A09] text-stone-300 border-t border-stone-800">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
                    {/* Brand Column */}
                    <div className="col-span-2">
                        <Link href="/" className="inline-block group hover:opacity-90 transition-opacity">
                            <div className="bg-white/5 p-3 rounded-2xl border border-white/10 inline-block">
                                <GlyphLogo className="scale-90 text-white [&>span]:text-white" />
                            </div>
                        </Link>
                        <p className="mt-6 text-sm text-stone-400 max-w-xs leading-relaxed font-mono">
                            The AI Design Engineer for startups. Generate premium brand identity systems in seconds.
                        </p>
                        <div className="flex gap-4 mt-6">
                            {SOCIAL_LINKS.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white transition-all"
                                >
                                    <social.icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Product</h3>
                        <ul className="space-y-3">
                            {FOOTER_LINKS.product.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-sm text-stone-400 hover:text-white transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Company</h3>
                        <ul className="space-y-3">
                            {FOOTER_LINKS.company.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-sm text-stone-400 hover:text-white transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Legal</h3>
                        <ul className="space-y-3">
                            {FOOTER_LINKS.legal.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-sm text-stone-400 hover:text-white transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-stone-500 font-mono">
                        © 2026 Glyph Systems Inc. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-xs text-stone-400 font-mono">Systems Operational</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
