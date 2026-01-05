import Link from 'next/link';
import { Github, Twitter, Linkedin } from 'lucide-react';
import { GlyphLogo } from '@/components/brand/GlyphLogo';

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
        <footer className="bg-stone-950 text-stone-300">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
                    {/* Brand Column */}
                    <div className="col-span-2">
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
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Company</h4>
                        <ul className="space-y-3">
                            {FOOTER_LINKS.company.map((link) => (
                                <li key={link.label}>
                                    <a href={link.href} className="text-sm hover:text-white transition-colors">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Legal</h4>
                        <ul className="space-y-3">
                            {FOOTER_LINKS.legal.map((link) => (
                                <li key={link.label}>
                                    <a href={link.href} className="text-sm hover:text-white transition-colors">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 pt-8 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-stone-500">
                        © 2024 Glyph Systems. All rights reserved.
                    </p>
                    <p className="text-sm text-stone-500">
                        Built with <span className="text-red-400">♥</span> for founders and developers.
                    </p>
                </div>
            </div>
        </footer>
    );
}
