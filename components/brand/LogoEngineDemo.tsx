"use client";

/**
 * Logo Engine v3 Demo Component
 *
 * Showcases all 10 professional logo generation algorithms
 * including Stripe, Linear, Notion, Claude, Airbnb, Mastercard styles
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
    generateLogos,
    generateAllAlgorithms,
    quickGenerate,
    ALL_ALGORITHMS,
    ALGORITHM_INFO,
    LogoAlgorithm,
    GeneratedLogo,
    LogoGenerationParams,
    LogoAesthetic,
    IndustryCategory,
} from '@/lib/logo-engine';
import { LogoPreview, LogoGrid, LogoShowcase } from '@/lib/logo-engine/renderers/svg-renderer';
import { downloadSvg, downloadPng } from '@/lib/logo-engine/renderers/export-utils';

// ============================================
// DEMO PRESETS
// ============================================

const DEMO_BRANDS = [
    { name: 'Nexus', color: '#6366F1', accent: '#8B5CF6', industry: 'technology' as const, aesthetic: 'tech-minimal' as const },
    { name: 'Apex', color: '#0EA5E9', accent: '#06B6D4', industry: 'finance' as const, aesthetic: 'bold-geometric' as const },
    { name: 'Bloom', color: '#22C55E', accent: '#84CC16', industry: 'sustainability' as const, aesthetic: 'friendly-rounded' as const },
    { name: 'Prism', color: '#F43F5E', accent: '#EC4899', industry: 'creative' as const, aesthetic: 'elegant-refined' as const },
    { name: 'Ember', color: '#F97316', accent: '#FBBF24', industry: 'ecommerce' as const, aesthetic: 'bold-geometric' as const },
    { name: 'Vital', color: '#14B8A6', accent: '#06B6D4', industry: 'healthcare' as const, aesthetic: 'friendly-rounded' as const },
];

const ALGORITHMS_UI: { id: LogoAlgorithm; category: 'classic' | 'professional' }[] = [
    // Classic
    { id: 'parallel-bars', category: 'classic' },
    { id: 'stacked-lines', category: 'classic' },
    { id: 'letterform-cutout', category: 'classic' },
    { id: 'sparkle-asterisk', category: 'classic' },
    { id: 'negative-space', category: 'classic' },
    // Professional
    { id: 'arc-swoosh', category: 'professional' },
    { id: 'overlapping-shapes', category: 'professional' },
    { id: 'depth-mark', category: 'professional' },
    { id: 'interlocking-forms', category: 'professional' },
    { id: 'abstract-monogram', category: 'professional' },
];

const INDUSTRIES: { id: IndustryCategory; name: string }[] = [
    { id: 'technology', name: 'Technology' },
    { id: 'finance', name: 'Finance' },
    { id: 'healthcare', name: 'Healthcare' },
    { id: 'creative', name: 'Creative' },
    { id: 'ecommerce', name: 'E-commerce' },
    { id: 'education', name: 'Education' },
    { id: 'sustainability', name: 'Sustainability' },
    { id: 'general', name: 'General' },
];

const AESTHETICS: { id: LogoAesthetic; name: string }[] = [
    { id: 'tech-minimal', name: 'Tech Minimal' },
    { id: 'friendly-rounded', name: 'Friendly Rounded' },
    { id: 'bold-geometric', name: 'Bold Geometric' },
    { id: 'elegant-refined', name: 'Elegant Refined' },
];

// ============================================
// MAIN COMPONENT
// ============================================

export function LogoEngineDemo() {
    const [brandName, setBrandName] = useState('Nexus');
    const [primaryColor, setPrimaryColor] = useState('#6366F1');
    const [accentColor, setAccentColor] = useState('#8B5CF6');
    const [selectedAlgorithm, setSelectedAlgorithm] = useState<LogoAlgorithm | 'all' | 'professional'>('all');
    const [industry, setIndustry] = useState<IndustryCategory>('technology');
    const [aesthetic, setAesthetic] = useState<LogoAesthetic>('tech-minimal');
    const [logos, setLogos] = useState<GeneratedLogo[]>([]);
    const [selectedLogo, setSelectedLogo] = useState<GeneratedLogo | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'showcase'>('grid');

    // Generate logos
    const handleGenerate = useCallback(() => {
        setIsGenerating(true);

        // Use setTimeout to allow UI to update
        setTimeout(() => {
            try {
                const params: LogoGenerationParams = {
                    brandName,
                    primaryColor,
                    accentColor,
                    industry,
                    aesthetic,
                    variations: 2,
                };

                let generated: GeneratedLogo[];

                if (selectedAlgorithm === 'all') {
                    generated = generateAllAlgorithms(params);
                } else if (selectedAlgorithm === 'professional') {
                    // Generate only professional category
                    const proAlgos = ALGORITHMS_UI.filter(a => a.category === 'professional').map(a => a.id);
                    generated = [];
                    for (const algo of proAlgos) {
                        generated.push(...generateLogos({ ...params, algorithm: algo, variations: 3 }));
                    }
                } else {
                    generated = generateLogos({ ...params, algorithm: selectedAlgorithm, variations: 4 });
                }

                setLogos(generated);
                setSelectedLogo(generated[0] || null);
            } catch (error) {
                console.error('Generation error:', error);
            }
            setIsGenerating(false);
        }, 50);
    }, [brandName, primaryColor, accentColor, selectedAlgorithm, industry, aesthetic]);

    // Generate on mount
    useEffect(() => {
        handleGenerate();
    }, []);

    // Apply preset
    const applyPreset = (preset: typeof DEMO_BRANDS[0]) => {
        setBrandName(preset.name);
        setPrimaryColor(preset.color);
        setAccentColor(preset.accent);
        setIndustry(preset.industry);
        setAesthetic(preset.aesthetic);
    };

    // Group logos by algorithm
    const logosByAlgorithm = logos.reduce((acc, logo) => {
        if (!acc[logo.algorithm]) acc[logo.algorithm] = [];
        acc[logo.algorithm].push(logo);
        return acc;
    }, {} as Record<LogoAlgorithm, GeneratedLogo[]>);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Logo Engine v3</h1>
                    <p className="text-gray-500 mt-2">
                        Professional logo generation with 10 algorithms - Stripe, Linear, Notion, Claude, Airbnb quality
                    </p>
                    <div className="mt-3 flex justify-center gap-2">
                        <span className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full">
                            Golden Ratio Grids
                        </span>
                        <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                            Bezier Curves
                        </span>
                        <span className="px-2 py-1 text-xs bg-pink-100 text-pink-700 rounded-full">
                            Advanced Gradients
                        </span>
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                            Industry Symbols
                        </span>
                    </div>
                </div>

                {/* Controls */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Brand Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Brand Name
                            </label>
                            <input
                                type="text"
                                value={brandName}
                                onChange={(e) => setBrandName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter brand name"
                            />
                        </div>

                        {/* Primary Color */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Primary Color
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="color"
                                    value={primaryColor}
                                    onChange={(e) => setPrimaryColor(e.target.value)}
                                    className="w-12 h-10 rounded cursor-pointer border-0"
                                />
                                <input
                                    type="text"
                                    value={primaryColor}
                                    onChange={(e) => setPrimaryColor(e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                                />
                            </div>
                        </div>

                        {/* Accent Color */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Accent Color
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="color"
                                    value={accentColor}
                                    onChange={(e) => setAccentColor(e.target.value)}
                                    className="w-12 h-10 rounded cursor-pointer border-0"
                                />
                                <input
                                    type="text"
                                    value={accentColor}
                                    onChange={(e) => setAccentColor(e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                                />
                            </div>
                        </div>

                        {/* Industry */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Industry
                            </label>
                            <select
                                value={industry}
                                onChange={(e) => setIndustry(e.target.value as IndustryCategory)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            >
                                {INDUSTRIES.map((ind) => (
                                    <option key={ind.id} value={ind.id}>
                                        {ind.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Aesthetic */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Aesthetic
                            </label>
                            <select
                                value={aesthetic}
                                onChange={(e) => setAesthetic(e.target.value as LogoAesthetic)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            >
                                {AESTHETICS.map((aes) => (
                                    <option key={aes.id} value={aes.id}>
                                        {aes.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Algorithm Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Logo Style
                            </label>
                            <select
                                value={selectedAlgorithm}
                                onChange={(e) => setSelectedAlgorithm(e.target.value as LogoAlgorithm | 'all' | 'professional')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="all">All Styles (30+ logos)</option>
                                <option value="professional">Professional Only (15 logos)</option>
                                <optgroup label="Classic Styles">
                                    {ALGORITHMS_UI.filter(a => a.category === 'classic').map((a) => (
                                        <option key={a.id} value={a.id}>
                                            {ALGORITHM_INFO[a.id].name}
                                        </option>
                                    ))}
                                </optgroup>
                                <optgroup label="Professional Styles">
                                    {ALGORITHMS_UI.filter(a => a.category === 'professional').map((a) => (
                                        <option key={a.id} value={a.id}>
                                            {ALGORITHM_INFO[a.id].name}
                                        </option>
                                    ))}
                                </optgroup>
                            </select>
                        </div>
                    </div>

                    {/* Presets */}
                    <div className="mt-4 flex flex-wrap gap-2">
                        <span className="text-sm text-gray-500 mr-2">Brand Presets:</span>
                        {DEMO_BRANDS.map((preset) => (
                            <button
                                key={preset.name}
                                onClick={() => applyPreset(preset)}
                                className="px-3 py-1 text-sm rounded-full border border-gray-300 hover:border-gray-400 transition-colors flex items-center gap-1.5"
                            >
                                <span
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: preset.color }}
                                />
                                {preset.name}
                            </button>
                        ))}
                    </div>

                    {/* Generate Button */}
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="mt-4 w-full py-2.5 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                    >
                        {isGenerating ? 'Generating...' : `Generate ${selectedAlgorithm === 'all' ? 'Logs' : selectedAlgorithm === 'professional' ? 'Pro' : '4'} Logos`}
                    </button>
                </div>

                {/* Results Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Logo Grid */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Generated Logos ({logos.length})
                                </h2>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`px-3 py-1 text-sm rounded ${viewMode === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                                    >
                                        Grid
                                    </button>
                                    <button
                                        onClick={() => setViewMode('showcase')}
                                        className={`px-3 py-1 text-sm rounded ${viewMode === 'showcase' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                                    >
                                        By Type
                                    </button>
                                </div>
                            </div>

                            {logos.length > 0 ? (
                                viewMode === 'grid' ? (
                                    <LogoGrid
                                        logos={logos}
                                        itemSize={90}
                                        columns={5}
                                        gap={10}
                                        selectedId={selectedLogo?.id}
                                        onSelect={setSelectedLogo}
                                    />
                                ) : (
                                    <div className="space-y-6">
                                        {Object.entries(logosByAlgorithm).map(([algoId, archLogos]) => (
                                            <div key={algoId}>
                                                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                    {ALGORITHM_INFO[algoId as LogoAlgorithm]?.name || algoId}
                                                    <span className="text-xs text-gray-400">
                                                        ({archLogos.length})
                                                    </span>
                                                    {ALGORITHMS_UI.find(a => a.id === algoId)?.category === 'professional' && (
                                                        <span className="px-1.5 py-0.5 text-xs bg-purple-100 text-purple-700 rounded">
                                                            Pro
                                                        </span>
                                                    )}
                                                </h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {archLogos.map((logo) => (
                                                        <div
                                                            key={logo.id}
                                                            onClick={() => setSelectedLogo(logo)}
                                                            className={`w-20 h-20 border-2 rounded-lg cursor-pointer transition-all bg-white flex items-center justify-center ${selectedLogo?.id === logo.id
                                                                ? 'border-indigo-500 shadow-md'
                                                                : 'border-gray-200 hover:border-gray-300'
                                                                }`}
                                                        >
                                                            <div
                                                                className="w-16 h-16"
                                                                dangerouslySetInnerHTML={{ __html: logo.svg }}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    Click "Generate Logos" to see results
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Selected Logo Preview */}
                    <div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Selected Logo
                            </h2>

                            {selectedLogo ? (
                                <div className="space-y-4">
                                    <LogoShowcase
                                        logo={selectedLogo}
                                        brandName={brandName}
                                        showBackgrounds={true}
                                        showSizes={true}
                                    />

                                    {/* Metadata */}
                                    <div className="text-xs text-gray-500 space-y-1 pt-2 border-t">
                                        <div className="flex justify-between">
                                            <span>Type:</span>
                                            <span className="font-medium">
                                                {ALGORITHM_INFO[selectedLogo.algorithm]?.name}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Variant:</span>
                                            <span className="font-mono">{selectedLogo.variant}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Golden Ratio:</span>
                                            <span>{selectedLogo.meta.geometry.usesGoldenRatio ? 'Yes' : 'No'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Bezier Curves:</span>
                                            <span>{selectedLogo.meta.geometry.bezierCurves ? 'Yes' : 'No'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Symmetry:</span>
                                            <span className="capitalize">{selectedLogo.meta.geometry.symmetry}</span>
                                        </div>
                                    </div>

                                    {/* Export Buttons */}
                                    <div className="flex gap-2 pt-4 border-t">
                                        <button
                                            onClick={() => downloadSvg(selectedLogo, `${brandName}-logo.svg`)}
                                            className="flex-1 py-2 px-3 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                        >
                                            SVG
                                        </button>
                                        <button
                                            onClick={() => downloadPng(selectedLogo, 256, `${brandName}-logo-256.png`)}
                                            className="flex-1 py-2 px-3 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                        >
                                            PNG 256
                                        </button>
                                        <button
                                            onClick={() => downloadPng(selectedLogo, 512, `${brandName}-logo-512.png`)}
                                            className="flex-1 py-2 px-3 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                        >
                                            PNG 512
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    Select a logo to preview
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Archetype Reference */}
                <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        10 Logo Archetypes
                    </h2>

                    <div className="mb-4">
                        <h3 className="text-sm font-medium text-gray-500 mb-3">Classic Styles</h3>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                            {ALGORITHMS_UI.filter(a => a.category === 'classic').map((item) => (
                                <div
                                    key={item.id}
                                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${selectedAlgorithm === item.id
                                        ? 'border-indigo-500 bg-indigo-50'
                                        : 'border-gray-200 hover:border-indigo-300'
                                        }`}
                                    onClick={() => setSelectedAlgorithm(item.id)}
                                >
                                    <h4 className="font-medium text-gray-900 text-sm">{ALGORITHM_INFO[item.id].name}</h4>
                                    <p className="text-xs text-gray-500 mt-0.5">{ALGORITHM_INFO[item.id].description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-purple-600 mb-3 flex items-center gap-2">
                            Professional Styles
                            <span className="px-1.5 py-0.5 text-xs bg-purple-100 text-purple-700 rounded">New</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                            {ALGORITHMS_UI.filter(a => a.category === 'professional').map((item) => (
                                <div
                                    key={item.id}
                                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${selectedAlgorithm === item.id
                                        ? 'border-purple-500 bg-purple-50'
                                        : 'border-gray-200 hover:border-purple-300'
                                        }`}
                                    onClick={() => setSelectedAlgorithm(item.id)}
                                >
                                    <h4 className="font-medium text-gray-900 text-sm">{ALGORITHM_INFO[item.id].name}</h4>
                                    <p className="text-xs text-gray-500 mt-0.5">{ALGORITHM_INFO[item.id].description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LogoEngineDemo;
