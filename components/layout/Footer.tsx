"use client";

import Link from 'next/link';
import { Github, Twitter, Linkedin } from 'lucide-react';
import { GlyphLogo } from '@/components/logo-engine/LogoGlyph';
import { motion } from 'framer-motion';

const FOOTER_LINKS = {
    product: [
        { label: 'Features', href: '#features' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Generator', href: '/generator' },
    ],
    legal: [
        { label: 'Privacy Policy', href: '/legal/privacy' },
        { label: 'Terms of Service', href: '/legal/terms' },
    ],
};

const SOCIAL_LINKS = [
    { icon: Twitter, href: 'https://x.com/Sumitthq', label: 'X (formerly Twitter)' },
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
];

// Animation Variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        },
    },
};

const socialVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.3,
            ease: "backOut",
        },
    },
};

export function Footer() {
    return (
        <motion.footer
            className="bg-stone-950 text-stone-300"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
                    {/* Brand Column */}
                    <motion.div className="col-span-1 md:col-span-2" variants={itemVariants}>
                        <motion.div
                            className="bg-white/5 p-4 rounded-2xl border border-white/10 inline-block mb-4"
                            whileHover={{ scale: 1.02, borderColor: "rgba(255,255,255,0.2)" }}
                            transition={{ duration: 0.2 }}
                        >
                            <GlyphLogo className="scale-90 text-white [&>span]:text-white" />
                        </motion.div>
                        <p className="mt-4 text-sm text-stone-400 max-w-xs leading-relaxed">
                            The AI Design Engineer for startups. Generate premium brand identity systems in seconds.
                        </p>
                        <div className="flex gap-4 mt-6">
                            {SOCIAL_LINKS.map((social, index) => (
                                <motion.a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-full bg-stone-800 hover:bg-stone-700 transition-colors"
                                    aria-label={social.label}
                                    variants={socialVariants}
                                    whileHover={{ scale: 1.15, rotate: 5 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <social.icon className="w-5 h-5" />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Product Links */}
                    <motion.div variants={itemVariants}>
                        <h4 className="font-semibold text-white mb-4">Product</h4>
                        <ul className="space-y-3">
                            {FOOTER_LINKS.product.map((link, index) => (
                                <motion.li
                                    key={link.label}
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <a
                                        href={link.href}
                                        className="text-sm hover:text-white transition-colors inline-block hover:translate-x-1 duration-200"
                                    >
                                        {link.label}
                                    </a>
                                </motion.li>
                            ))}
                            <motion.li
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 }}
                                viewport={{ once: true }}
                            >
                                <Link
                                    href="/design-system"
                                    className="text-sm font-medium text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-2 hover:translate-x-1 duration-200"
                                >
                                    Design System
                                    <span className="bg-orange-500/20 text-orange-400 text-[10px] px-1.5 py-0.5 rounded-full border border-orange-500/30">
                                        Internal
                                    </span>
                                </Link>
                            </motion.li>
                        </ul>
                    </motion.div>

                    {/* Legal Links */}
                    <motion.div variants={itemVariants}>
                        <h4 className="font-semibold text-white mb-4">Legal</h4>
                        <ul className="space-y-3">
                            {FOOTER_LINKS.legal.map((link, index) => (
                                <motion.li
                                    key={link.label}
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <Link
                                        href={link.href}
                                        className="text-sm hover:text-white transition-colors inline-block hover:translate-x-1 duration-200"
                                    >
                                        {link.label}
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                {/* Bottom Bar */}
                <motion.div
                    className="mt-16 pt-8 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    viewport={{ once: true }}
                >
                    <p className="text-sm text-stone-500">
                        © 2026 Glyph Systems. All rights reserved.
                    </p>
                    <motion.a
                        href="https://sumitsharmaa.me"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-stone-500 hover:text-stone-300 transition-colors"
                        whileHover={{ scale: 1.05 }}
                    >
                        Made by <span className="text-white hover:underline">Sumit</span>
                    </motion.a>
                </motion.div>
            </div>
        </motion.footer>
    );
}
