'use client';

import React from 'react';
import { BrandIdentity } from '@/lib/data';
import { LogoComposition } from '@/components/logo-engine/LogoComposition';

interface SharePageClientProps {
    identity: BrandIdentity;
    shareId: string;
}

function ColorSwatch({ color, label }: { color: string; label: string }) {
    return (
        <div className="flex flex-col items-center gap-2">
            <div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border border-white/10 shadow-lg"
                style={{ backgroundColor: color }}
            />
            <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider">{label}</span>
            <span className="text-xs font-mono text-white/70">{color}</span>
        </div>
    );
}

export default function SharePageClient({ identity, shareId }: SharePageClientProps) {
    const theme = identity.theme;
    const light = theme?.tokens?.light;
    const font = identity.font;
    const strategy = identity.strategy;
    const primaryColor = light?.primary || '#6366f1';
    const brandName = identity.name || 'Brand';
    const tagline = strategy?.tagline || '';
    const mission = strategy?.mission || '';

    return (
        <div className="min-h-screen bg-stone-950 text-white font-sans selection:bg-indigo-500/30">
            {/* ============================================================ */}
            {/* HERO — Logo Preview (matches generator's dark preview) */}
            {/* ============================================================ */}
            <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
                {/* Background effects */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1c191711_1px,transparent_1px),linear-gradient(to_bottom,#1c191711_1px,transparent_1px)] bg-[size:32px_32px]" />
                <div
                    className="absolute inset-0 opacity-20"
                    style={{ background: `radial-gradient(ellipse at center, ${primaryColor}33, transparent 70%)` }}
                />

                <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl">
                    {/* Logo */}
                    <div className="mb-8">
                        {identity.generatedLogos?.[0]?.svg ? (
                            <LogoComposition
                                brand={identity}
                                className="w-32 h-32 sm:w-40 sm:h-40"
                            />
                        ) : identity.aiIcon ? (
                            <img
                                src={identity.aiIcon}
                                alt={brandName}
                                className="w-32 h-32 sm:w-40 sm:h-40 object-contain"
                            />
                        ) : (
                            <div
                                className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl flex items-center justify-center text-4xl font-bold"
                                style={{ backgroundColor: primaryColor + '20', color: primaryColor }}
                            >
                                {brandName.charAt(0)}
                            </div>
                        )}
                    </div>

                    {/* Brand Name */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">
                        {brandName}
                        {identity.legalEntity && identity.legalEntity !== 'None' && (
                            <span className="text-white/30 font-light ml-2">{identity.legalEntity}</span>
                        )}
                    </h1>

                    {/* Tagline */}
                    {tagline && (
                        <p className="text-lg sm:text-xl text-white/50 max-w-lg leading-relaxed">
                            {tagline}
                        </p>
                    )}

                    {/* Vibe Badge */}
                    <div className="mt-6 flex items-center gap-3">
                        <span
                            className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border"
                            style={{
                                borderColor: primaryColor + '40',
                                color: primaryColor,
                                backgroundColor: primaryColor + '10',
                            }}
                        >
                            {identity.vibe}
                        </span>
                        {identity.category && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border border-white/10 text-white/40">
                                {identity.category}
                            </span>
                        )}
                    </div>
                </div>
            </section>

            {/* ============================================================ */}
            {/* SECTION: Brand Strategy */}
            {/* ============================================================ */}
            {strategy && (mission || strategy.vision) && (
                <section className="py-16 sm:py-24 px-6">
                    <div className="max-w-4xl mx-auto">
                        <SectionLabel color={primaryColor}>Brand Strategy</SectionLabel>
                        <div className="grid sm:grid-cols-2 gap-8 mt-8">
                            {mission && (
                                <div className="bg-stone-900/50 rounded-2xl p-6 border border-stone-800">
                                    <h3 className="text-xs font-mono uppercase tracking-widest text-stone-500 mb-3">Mission</h3>
                                    <p className="text-white/80 leading-relaxed">{mission}</p>
                                </div>
                            )}
                            {strategy.vision && (
                                <div className="bg-stone-900/50 rounded-2xl p-6 border border-stone-800">
                                    <h3 className="text-xs font-mono uppercase tracking-widest text-stone-500 mb-3">Vision</h3>
                                    <p className="text-white/80 leading-relaxed">{strategy.vision}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* ============================================================ */}
            {/* SECTION: Color System */}
            {/* ============================================================ */}
            {light && (
                <section className="py-16 sm:py-24 px-6 border-t border-stone-800/50">
                    <div className="max-w-4xl mx-auto">
                        <SectionLabel color={primaryColor}>Color System</SectionLabel>

                        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 mt-10">
                            <ColorSwatch color={light.primary} label="Primary" />
                            {light.accent && <ColorSwatch color={light.accent} label="Accent" />}
                            <ColorSwatch color={light.surface} label="Surface" />
                            <ColorSwatch color={light.bg} label="Background" />
                            <ColorSwatch color={light.text} label="Text" />
                        </div>

                        {/* Full Palette Bar */}
                        <div className="mt-10 rounded-xl overflow-hidden flex h-12 shadow-lg">
                            <div className="flex-1" style={{ backgroundColor: light.primary }} />
                            {light.accent && <div className="flex-1" style={{ backgroundColor: light.accent }} />}
                            <div className="flex-1" style={{ backgroundColor: light.surface }} />
                            <div className="flex-1" style={{ backgroundColor: light.bg }} />
                            <div className="flex-1" style={{ backgroundColor: light.text }} />
                        </div>
                    </div>
                </section>
            )}

            {/* ============================================================ */}
            {/* SECTION: Typography */}
            {/* ============================================================ */}
            {font && (
                <section className="py-16 sm:py-24 px-6 border-t border-stone-800/50">
                    <div className="max-w-4xl mx-auto">
                        <SectionLabel color={primaryColor}>Typography</SectionLabel>

                        <div className="grid sm:grid-cols-2 gap-8 mt-10">
                            {/* Display Font */}
                            <div className="bg-stone-900/50 rounded-2xl p-8 border border-stone-800">
                                <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500">Display</span>
                                <div className="mt-4">
                                    <p className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                                        {font.headingName || font.name || 'Display Font'}
                                    </p>
                                    <p className="text-sm text-white/50 mt-3 font-mono">
                                        Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm
                                    </p>
                                    <p className="text-sm text-white/50 mt-1 font-mono">
                                        Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz
                                    </p>
                                    <p className="text-sm text-white/50 mt-1 font-mono">
                                        0 1 2 3 4 5 6 7 8 9 ! @ # $ % &
                                    </p>
                                </div>
                            </div>

                            {/* Body Font */}
                            <div className="bg-stone-900/50 rounded-2xl p-8 border border-stone-800">
                                <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500">Body</span>
                                <div className="mt-4">
                                    <p className="text-xl text-white leading-tight">
                                        {font.bodyName || 'Body Font'}
                                    </p>
                                    <p className="text-sm text-white/60 mt-3 leading-relaxed">
                                        The quick brown fox jumps over the lazy dog. Every detail in your brand
                                        typography communicates personality, professionalism, and purpose.
                                    </p>
                                    {font.monoName && (
                                        <p className="text-xs text-white/40 mt-3 font-mono">
                                            Mono: {font.monoName}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ============================================================ */}
            {/* SECTION: Brand Voice */}
            {/* ============================================================ */}
            {strategy?.voice && (
                <section className="py-16 sm:py-24 px-6 border-t border-stone-800/50">
                    <div className="max-w-4xl mx-auto">
                        <SectionLabel color={primaryColor}>Brand Voice</SectionLabel>

                        <div className="mt-8 bg-stone-900/50 rounded-2xl p-8 border border-stone-800">
                            <p className="text-white/70 text-lg mb-6">
                                Tone: <span className="text-white font-semibold">{strategy.voice.tone}</span>
                            </p>

                            <div className="grid sm:grid-cols-2 gap-6">
                                {strategy.voice.dos.length > 0 && (
                                    <div>
                                        <h4 className="text-xs font-mono uppercase tracking-widest text-green-500 mb-3">Do</h4>
                                        <ul className="space-y-2">
                                            {strategy.voice.dos.map((item, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                                                    <span className="text-green-500 mt-0.5">+</span>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {strategy.voice.donts.length > 0 && (
                                    <div>
                                        <h4 className="text-xs font-mono uppercase tracking-widest text-red-400 mb-3">Don&apos;t</h4>
                                        <ul className="space-y-2">
                                            {strategy.voice.donts.map((item, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                                                    <span className="text-red-400 mt-0.5">-</span>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ============================================================ */}
            {/* FOOTER — "Built with Glyph" Viral Loop */}
            {/* ============================================================ */}
            <footer className="py-16 px-6 border-t border-stone-800/50">
                <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
                    <a
                        href="https://glyph.software"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-stone-900 border border-stone-800 hover:border-stone-600 transition-all"
                    >
                        <span className="text-sm text-white/50 group-hover:text-white/80 transition-colors">
                            Built with
                        </span>
                        <span className="text-sm font-bold text-white">Glyph</span>
                        <span className="text-white/30">&#10022;</span>
                    </a>

                    <a
                        href="https://glyph.software"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 text-sm text-white/30 hover:text-white/60 transition-colors"
                    >
                        Create your brand identity for free &rarr;
                    </a>

                    <p className="mt-8 text-[10px] font-mono text-stone-600 uppercase tracking-widest">
                        {brandName} &middot; Brand Identity System &middot; {new Date().getFullYear()}
                    </p>
                </div>
            </footer>
        </div>
    );
}

function SectionLabel({ children, color }: { children: React.ReactNode; color: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-stone-400">
                {children}
            </h2>
        </div>
    );
}
