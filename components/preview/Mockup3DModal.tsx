"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { MockupType, MOCKUP_METADATA, downloadMockupAsPng } from '@/lib/mockup-state';
import { BrandIdentity } from '@/lib/data';

interface Mockup3DModalProps {
    isOpen: boolean;
    onClose: () => void;
    mockupType: MockupType;
    brand: BrandIdentity; // Changed form brandName to brand
    children: React.ReactNode;
}

/**
 * 3D Mockup Modal with drag-to-rotate functionality
 */
export function Mockup3DModal({
    isOpen,
    onClose,
    mockupType,
    brand,
    children,
}: Mockup3DModalProps) {
    const [rotation, setRotation] = useState({ x: 15, y: -15 });
    const [zoom, setZoom] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const lastPosition = useRef({ x: 0, y: 0 });

    const metadata = MOCKUP_METADATA[mockupType];
    const tokens = brand.theme.tokens;

    // Reset on open
    useEffect(() => {
        if (isOpen) {
            setRotation({ x: 15, y: -15 });
            setZoom(1);
        }
    }, [isOpen]);

    // Handle mouse/touch drag
    const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDragging(true);
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        lastPosition.current = { x: clientX, y: clientY };
    };

    const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDragging) return;

        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        const deltaX = clientX - lastPosition.current.x;
        const deltaY = clientY - lastPosition.current.y;

        setRotation((prev) => ({
            x: Math.max(-60, Math.min(60, prev.x - deltaY * 0.5)),
            y: prev.y + deltaX * 0.5,
        }));

        lastPosition.current = { x: clientX, y: clientY };
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Handle zoom
    const handleZoomIn = () => setZoom((prev) => Math.min(2, prev + 0.2));
    const handleZoomOut = () => setZoom((prev) => Math.max(0.5, prev - 0.2));
    const handleReset = () => {
        setRotation({ x: 15, y: -15 });
        setZoom(1);
    };

    // Handle download
    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            await downloadMockupAsPng(mockupType, brand.name);
        } catch (error) {
            console.error('Download failed:', error);
        }
        setIsDownloading(false);
    };

    // Close on escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                    onClick={(e) => e.target === e.currentTarget && onClose()}
                >
                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative w-full max-w-6xl mx-4 rounded-2xl overflow-hidden shadow-2xl"
                        style={{ background: tokens.dark.bg }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{metadata.icon}</span>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">
                                        {metadata.name}
                                    </h3>
                                    <p className="text-sm text-gray-400">
                                        {metadata.description} • {metadata.width}x{metadata.height}px
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        {/* 3D Viewport */}
                        <div
                            ref={containerRef}
                            className="relative h-[500px] cursor-grab active:cursor-grabbing select-none"
                            style={{ perspective: '1500px' }}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            onTouchStart={handleMouseDown}
                            onTouchMove={handleMouseMove}
                            onTouchEnd={handleMouseUp}
                        >
                            {/* Background gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-gray-900/50" />

                            {/* Grid pattern */}
                            <div
                                className="absolute inset-0 opacity-20"
                                style={{
                                    backgroundImage: `
                                        linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                                        linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
                                    `,
                                    backgroundSize: '40px 40px',
                                }}
                            />

                            {/* 3D Container */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.div
                                    animate={{
                                        rotateX: rotation.x,
                                        rotateY: rotation.y,
                                        scale: zoom,
                                    }}
                                    transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                                    style={{
                                        transformStyle: 'preserve-3d',
                                    }}
                                    className="relative"
                                >
                                    {/* Shadow */}
                                    <div
                                        className="absolute inset-0 bg-black/40 blur-3xl"
                                        style={{
                                            transform: 'translateZ(-100px) translateY(40px) scale(0.9)',
                                        }}
                                    />

                                    {/* Mockup Content */}
                                    <div
                                        className="relative rounded-xl overflow-hidden"
                                        style={{
                                            boxShadow: '0 50px 100px -20px rgba(0,0,0,0.5)',
                                            transform: 'translateZ(0)',
                                        }}
                                    >
                                        {children}
                                    </div>

                                    {/* Reflection */}
                                    <div
                                        className="absolute inset-0 pointer-events-none rounded-xl"
                                        style={{
                                            background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)',
                                            transform: 'translateZ(1px)',
                                        }}
                                    />
                                </motion.div>
                            </div>

                            {/* Drag hint */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 rounded-full backdrop-blur-sm">
                                <p className="text-xs text-gray-400">
                                    Drag to rotate • Scroll to zoom
                                </p>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-black/20">
                            {/* Zoom & Reset */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleZoomOut}
                                    className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                                    title="Zoom Out"
                                >
                                    <ZoomOut className="w-5 h-5" />
                                </button>
                                <span className="text-sm text-gray-400 w-12 text-center">
                                    {Math.round(zoom * 100)}%
                                </span>
                                <button
                                    onClick={handleZoomIn}
                                    className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                                    title="Zoom In"
                                >
                                    <ZoomIn className="w-5 h-5" />
                                </button>
                                <div className="w-px h-6 bg-white/10 mx-2" />
                                <button
                                    onClick={handleReset}
                                    className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                                    title="Reset View"
                                >
                                    <RotateCcw className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Download */}
                            <button
                                onClick={handleDownload}
                                disabled={isDownloading}
                                className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
                            >
                                <Download className="w-4 h-4" />
                                {isDownloading ? 'Downloading...' : 'Download PNG'}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default Mockup3DModal;
