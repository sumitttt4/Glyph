"use client";

import React from 'react';
import { SystemNav } from '@/components/meta/SystemNav';
import { ComponentPlayground } from '@/components/meta/ComponentPlayground';
import { Button } from '@/components/ui/button';

export default function DesignSystemPage() {
    return (
        <div className="min-h-screen bg-stone-50 font-sans text-stone-900 selection:bg-orange-100 selection:text-orange-900">
            <SystemNav />

            {/* Main Content */}
            <main className="lg:ml-64 min-h-screen">
                <div className="p-8 lg:p-12 max-w-5xl mx-auto space-y-16">

                    {/* Hero Section */}
                    <header className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900 text-stone-50 text-[10px] uppercase font-bold tracking-widest">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            System v1.0
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-stone-900">
                            Glyph <span className="text-stone-300">Design</span>
                        </h1>
                        <p className="text-xl text-stone-500 max-w-2xl leading-relaxed">
                            A comprehensive design language for building technical, high-performance interfaces.
                            Grounded in simplicity, designed for scale.
                        </p>
                    </header>

                    <hr className="border-stone-200" />

                    {/* BUTTONS SECTION */}
                    <section id="buttons" className="space-y-8">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold tracking-tight">Buttons</h2>
                            <p className="text-stone-500">The core interactive element. Use buttons to trigger actions.</p>
                        </div>

                        <ComponentPlayground
                            title="Primary Button"
                            description="The main call-to-action button."
                            componentName="Button"
                            propConfig={[
                                { name: 'children', type: 'text', defaultValue: 'Get Started' },
                                { name: 'variant', type: 'select', options: ['default', 'secondary', 'outline', 'ghost', 'link'], defaultValue: 'default' },
                                { name: 'size', type: 'select', options: ['default', 'sm', 'lg', 'icon'], defaultValue: 'default' },
                            ]}
                            renderComponent={(props) => (
                                <Button {...props}>
                                    {props.children}
                                </Button>
                            )}
                            generateCode={(props) => {
                                const variantStr = props.variant && props.variant !== 'default' ? ` variant="${props.variant}"` : '';
                                const sizeStr = props.size && props.size !== 'default' ? ` size="${props.size}"` : '';
                                return `<Button${variantStr}${sizeStr}>\n  ${props.children}\n</Button>`;
                            }}
                        />
                    </section>

                    {/* COLORS SECTION */}
                    <section id="colors" className="space-y-8 pt-12 border-t border-stone-200">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold tracking-tight">Colors</h2>
                            <p className="text-stone-500">The primitive color palette of the Glyph system.</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {[
                                { name: "Stone 50", hex: "#fafaf9", class: "bg-stone-50" },
                                { name: "Stone 100", hex: "#f5f5f4", class: "bg-stone-100" },
                                { name: "Stone 200", hex: "#e7e5e4", class: "bg-stone-200" },
                                { name: "Stone 500", hex: "#78716c", class: "bg-stone-500 text-white" },
                                { name: "Stone 900", hex: "#1c1917", class: "bg-stone-900 text-white" },
                                { name: "Orange 500", hex: "#f97316", class: "bg-orange-500 text-white" },
                                { name: "Orange 600", hex: "#ea580c", class: "bg-orange-600 text-white" },
                            ].map((color) => (
                                <div key={color.name} className="space-y-2">
                                    <div className={`w-full h-20 rounded-xl shadow-sm border border-stone-200/50 ${color.class}`} />
                                    <div>
                                        <p className="text-xs font-bold text-stone-900">{color.name}</p>
                                        <p className="text-[10px] font-mono text-stone-400">{color.hex}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* TYPOGRAPHY SECTION */}
                    <section id="typography" className="space-y-8 pt-12 border-t border-stone-200">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold tracking-tight">Typography</h2>
                            <p className="text-stone-500">Scale and rules for the system font.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <span className="text-xs text-stone-400 uppercase font-mono">Display</span>
                                <p className="text-4xl font-bold text-stone-900">The rapid brown fox</p>
                            </div>
                            <div className="space-y-2">
                                <span className="text-xs text-stone-400 uppercase font-mono">Body</span>
                                <p className="text-base text-stone-600 leading-relaxed">
                                    Typography is the voice of design. Good typography establishes a visual hierarchy and provides a graphic balance to the website.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
