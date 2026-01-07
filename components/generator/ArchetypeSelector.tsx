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
        <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-500">Archetype</label>
            <div className="grid grid-cols-2 gap-2">
                {/* SYMBOL OPTION */}
                <button
                    onClick={() => onSelect("symbol")}
                    className={cn(
                        "relative flex items-center justify-center gap-2 px-4 py-3 rounded-md border text-sm font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2",
                        selected === "symbol"
                            ? "bg-neutral-900 border-neutral-900 text-white shadow-sm"
                            : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50"
                    )}
                >
                    <Hexagon className="w-4 h-4" />
                    <span>Symbol</span>
                </button>

                {/* WORDMARK OPTION */}
                <button
                    onClick={() => onSelect("wordmark")}
                    className={cn(
                        "relative flex items-center justify-center gap-2 px-4 py-3 rounded-md border text-sm font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2",
                        selected === "wordmark"
                            ? "bg-neutral-900 border-neutral-900 text-white shadow-sm"
                            : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50"
                    )}
                >
                    <Type className="w-4 h-4" />
                    <span>Wordmark</span>
                </button>
            </div>
        </div>
    );
}
