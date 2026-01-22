"use client";

import React, { useState } from 'react';
import { Check, Copy, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

type PropValue = string | boolean;
type PropsState = Record<string, PropValue>;

interface PropConfig {
    name: string;
    type: 'select' | 'boolean' | 'text';
    options?: string[]; // For select
    defaultValue?: PropValue;
}

interface ComponentPlaygroundProps {
    title: string;
    description?: string;
    componentName: string; // e.g. "Button"
    propConfig: PropConfig[];
    // Function that takes current props and returns the React Node
    renderComponent: (props: PropsState) => React.ReactNode;
    // Function that takes current props and returns the code string
    generateCode: (props: PropsState) => string;
}

export function ComponentPlayground({
    title,
    description,
    componentName,
    propConfig,
    renderComponent,
    generateCode
}: ComponentPlaygroundProps) {
    // Initialize state with default values
    const [props, setProps] = useState<PropsState>(() => {
        const defaults: PropsState = {};
        propConfig.forEach(config => {
            if (config.defaultValue !== undefined) {
                defaults[config.name] = config.defaultValue;
            }
        });
        return defaults;
    });

    const [isCopied, setIsCopied] = useState(false);
    const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

    const handlePropChange = (name: string, value: PropValue) => {
        setProps((prev: PropsState) => ({ ...prev, [name]: value }));
    };

    const copyToClipboard = () => {
        const code = generateCode(props);
        navigator.clipboard.writeText(code);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-sm">
            {/* Header */}
            <div className="px-6 py-4 border-b border-stone-100 bg-stone-50/50 flex justify-between items-center">
                <div>
                    <h3 className="text-sm font-bold text-stone-900">{title}</h3>
                    {description && <p className="text-xs text-stone-500 mt-1">{description}</p>}
                </div>
                {/* Tabs */}
                <div className="flex bg-stone-100 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('preview')}
                        className={cn(
                            "px-3 py-1 text-xs font-medium rounded-md transition-all",
                            activeTab === 'preview' ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-900"
                        )}
                    >
                        Preview
                    </button>
                    <button
                        onClick={() => setActiveTab('code')}
                        className={cn(
                            "px-3 py-1 text-xs font-medium rounded-md transition-all",
                            activeTab === 'code' ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-900"
                        )}
                    >
                        Code
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-stone-100">
                {/* Main Preview Area (2 cols) */}
                <div className="lg:col-span-2 min-h-[300px] flex items-center justify-center bg-[url('/grid-pattern.svg')] bg-stone-50/30 p-8 relative">

                    {activeTab === 'preview' ? (
                        <div className="scale-100 transition-all duration-300">
                            {renderComponent(props)}
                        </div>
                    ) : (
                        <div className="w-full h-full bg-stone-900 rounded-lg p-4 overflow-auto relative group">
                            <pre className="text-xs font-mono text-stone-300 whitespace-pre-wrap">
                                {generateCode(props)}
                            </pre>
                            <button
                                onClick={copyToClipboard}
                                className="absolute top-3 right-3 p-2 bg-stone-800 text-stone-400 hover:text-white rounded-md transition-colors opacity-0 group-hover:opacity-100"
                            >
                                {isCopied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                            </button>
                        </div>
                    )}
                </div>

                {/* Controls (1 col) */}
                <div className="p-6 bg-white space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                        <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Configuration</span>
                        <button
                            onClick={() => {
                                const defaults: PropsState = {};
                                propConfig.forEach(config => {
                                    if (config.defaultValue !== undefined) {
                                        defaults[config.name] = config.defaultValue;
                                    }
                                });
                                setProps(defaults);
                            }}
                            className="p-1 text-stone-400 hover:text-orange-500 transition-colors"
                            title="Reset to default"
                        >
                            <RefreshCw size={12} />
                        </button>
                    </div>

                    <div className="space-y-5">
                        {propConfig.map((config) => (
                            <div key={config.name} className="space-y-2">
                                <label className="text-xs font-semibold text-stone-700 block">
                                    {config.name}
                                </label>

                                {config.type === 'select' && config.options && (
                                    <div className="flex flex-wrap gap-2">
                                        {config.options.map((option) => (
                                            <button
                                                key={option}
                                                onClick={() => handlePropChange(config.name, option)}
                                                className={cn(
                                                    "px-3 py-1.5 text-xs rounded-md border transition-all",
                                                    props[config.name] === option
                                                        ? "bg-orange-50 border-orange-200 text-orange-700 font-medium"
                                                        : "bg-white border-stone-200 text-stone-600 hover:border-stone-300"
                                                )}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {config.type === 'boolean' && (
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <div className={cn(
                                            "w-9 h-5 rounded-full relative transition-colors duration-200",
                                            props[config.name] ? "bg-orange-500" : "bg-stone-200 group-hover:bg-stone-300"
                                        )}>
                                            <input
                                                type="checkbox"
                                                checked={props[config.name] === true}
                                                onChange={(e) => handlePropChange(config.name, e.target.checked)}
                                                className="opacity-0 absolute w-full h-full cursor-pointer"
                                            />
                                            <div className={cn(
                                                "absolute top-1 left-1 bg-white w-3 h-3 rounded-full shadow-sm transition-transform duration-200",
                                                props[config.name] ? "translate-x-4" : "translate-x-0"
                                            )} />
                                        </div>
                                        <span className="text-xs text-stone-500 font-medium select-none">
                                            {props[config.name] ? "Enabled" : "Disabled"}
                                        </span>
                                    </label>
                                )}

                                {config.type === 'text' && (
                                    <input
                                        type="text"
                                        value={String(props[config.name] ?? '')}
                                        onChange={(e) => handlePropChange(config.name, e.target.value)}
                                        className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/10 transition-all"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
