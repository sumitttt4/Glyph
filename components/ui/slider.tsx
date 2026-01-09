"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SliderProps {
    value: number[];
    min: number;
    max: number;
    step: number;
    onValueChange: (val: number[]) => void;
    className?: string;
}

export function Slider({ value, min, max, step, onValueChange, className }: SliderProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onValueChange([parseFloat(e.target.value)]);
    };

    return (
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value[0]}
            onChange={handleChange}
            className={cn(
                "w-full h-1 bg-stone-700/50 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-500",
                "accent-white", // Standard consistent color
                className
            )}
        />
    );
}
