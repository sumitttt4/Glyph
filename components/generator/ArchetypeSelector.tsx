"use client";

import { motion } from "framer-motion";
import { Type, Hexagon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArchetypeSelectorProps {
    selected: "symbol" | "wordmark";
    onSelect: (value: "symbol" | "wordmark") => void;
}

export function ArchetypeSelector({ selected, onSelect }: ArchetypeSelectorProps) {
    return (
        <div className="grid grid-cols-2 gap-2">
            {/* SYMBOL OPTION */}
            <button
                onClick={() => onSelect("symbol")}
                className={cn(
                    "relative flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2",
                    selected === "symbol"
                        ? "bg-stone-900 border-stone-900 text-white shadow-md ring-1 ring-stone-900 ring-offset-1"
                        : "bg-transparent border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-50/50"
                )}
            >
                <Hexagon className="w-4 h-4" />
                <span>Symbol</span>
            </button>

            {/* WORDMARK OPTION */}
            <button
                onClick={() => onSelect("wordmark")}
                className={cn(
                    "relative flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2",
                    selected === "wordmark"
                        ? "bg-stone-900 border-stone-900 text-white shadow-md ring-1 ring-stone-900 ring-offset-1"
                        : "bg-transparent border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-50/50"
                )}
            >
                <Type className="w-4 h-4" />
                <span>Wordmark</span>
            </button>
        </div>
    );
}
