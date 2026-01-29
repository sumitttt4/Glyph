"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getGenerationCount } from '@/app/actions/stats';
import { Sparkles } from 'lucide-react';

export function LiveCounter() {
    const [count, setCount] = useState<number | null>(null);

    useEffect(() => {
        getGenerationCount().then(val => setCount(val));
    }, []);

    if (count === null) return null; // or a skeleton

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 backdrop-blur border border-white/50 shadow-sm w-fit mx-auto mt-6"
        >
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-green-600">
                <Sparkles size={10} className="fill-current" />
            </div>
            <div className="text-xs font-semibold text-stone-600">
                <span className="font-bold text-stone-900 tabular-nums">{count.toLocaleString()}</span> brands generated
            </div>
        </motion.div>
    );
}
