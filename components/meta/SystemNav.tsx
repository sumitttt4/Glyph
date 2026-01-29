"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import { Box, Layers, LayoutGrid, Type, Palette, Component, MousePointerClick } from "lucide-react";

const NAV_ITEMS = [
    {
        category: "Foundation",
        items: [
            { label: "Introduction", href: "/design-system", icon: Box },
            { label: "Colors", href: "/design-system#colors", icon: Palette },
            { label: "Typography", href: "/design-system#typography", icon: Type },
            { label: "Layout", href: "/design-system#layout", icon: LayoutGrid },
        ]
    },
    {
        category: "Components",
        items: [
            { label: "Buttons", href: "/design-system#buttons", icon: MousePointerClick },
            { label: "Inputs", href: "/design-system#inputs", icon: Component },
            { label: "Badges", href: "/design-system#badges", icon: Layers },
        ]
    }
];

export function SystemNav() {
    return (
        <nav className="w-64 h-screen fixed left-0 top-0 border-r border-stone-200 bg-stone-50/50 backdrop-blur-xl p-6 hidden lg:block overflow-y-auto">
            <div className="mb-8">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-stone-900 rounded-lg flex items-center justify-center text-white font-bold text-sm group-hover:bg-orange-600 transition-colors">
                        G
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-stone-900 text-sm">Glyph System</span>
                        <span className="text-[10px] text-stone-500 font-mono">v1.0.0-beta</span>
                    </div>
                </Link>
            </div>

            <div className="space-y-8">
                {NAV_ITEMS.map((section) => (
                    <div key={section.category}>
                        <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-4 px-2">
                            {section.category}
                        </h4>
                        <div className="space-y-1">
                            {section.items.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="flex items-center gap-3 px-2 py-2 text-sm text-stone-600 hover:text-stone-900 hover:bg-stone-200/50 rounded-lg transition-colors group"
                                >
                                    <item.icon size={16} className="text-stone-400 group-hover:text-stone-600 transition-colors" />
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="absolute bottom-6 left-6 right-6">
                <div className="p-4 bg-stone-900 rounded-xl text-center">
                    <p className="text-xs text-stone-400 mb-2">Need help?</p>
                    <a href="mailto:support@glyph.com" className="text-xs font-bold text-white hover:text-orange-400">Contact Support</a>
                </div>
            </div>
        </nav>
    );
}
