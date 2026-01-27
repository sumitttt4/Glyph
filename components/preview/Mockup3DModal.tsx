"use client";

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { MockupType, MOCKUP_METADATA, downloadMockupAsPng } from '@/lib/mockup-state';
import { BrandIdentity } from '@/lib/data';
import Mockup3DCard from './Mockup3DCard';

interface Mockup3DModalProps {
    isOpen: boolean;
    onClose: () => void;
    mockupType: MockupType;
    brand: BrandIdentity;
    children: React.ReactNode;
}

/**
 * 3D Mockup Modal
 * Uses React Portal to break out of layouts/stacking contexts (z-index fix).
 * Renders R3F Canvas for 'business-card' or CSS 3D for others.
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
    const [mounted, setMounted] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const lastPosition = useRef({ x: 0, y: 0 });

    const metadata = MOCKUP_METADATA[mockupType];
    const isR3F = mockupType === 'business-card';

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Reset on open
    useEffect(() => {
        if (isOpen) {
            setRotation({ x: 15, y: -15 });
            setZoom(1);
        }
    }, [isOpen]);

    // Handle mouse/touch drag (Only for CSS Mode)
    const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
        if (isR3F) return; // OrbitControls handles R3F
        setIsDragging(true);
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        lastPosition.current = { x: clientX, y: clientY };
    };

    const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDragging || isR3F) return;

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

    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-md"
                    onClick={(e) => e.target === e.currentTarget && onClose()}
                >
                    {/* Modal Container */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="relative w-full max-w-7xl mx-4 h-[85vh] flex flex-col bg-gray-950 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40 z-20">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{metadata.icon}</span>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">
                                        {metadata.name}
                                    </h3>
                                    <p className="text-sm text-gray-400">
                                        {isR3F ? 'Interactive 3D Preview' : `${metadata.description} • ${metadata.width}x${metadata.height}px`}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg hover:bg-white/10 transition-colors z-50"
                            >
                                <X className="w-6 h-6 text-gray-400 hover:text-white" />
                            </button>
                        </div>

                        {/* Viewport */}
                        <div className="relative flex-1 bg-gradient-to-br from-gray-900 via-gray-950 to-black overflow-hidden">

                            {isR3F ? (
                                /* R3F Component */
                                <div className="absolute inset-0">
                                    <Mockup3DCard brand={brand} />
                                </div>
                            ) : (
                                /* CSS 3D Implementation (Fallback/Legacy) */
                                <div
                                    ref={containerRef}
                                    className="relative w-full h-full cursor-grab active:cursor-grabbing select-none flex items-center justify-center"
                                    style={{ perspective: '1500px' }}
                                    onMouseDown={handleMouseDown}
                                    onMouseMove={handleMouseMove}
                                    onMouseUp={handleMouseUp}
                                    onMouseLeave={handleMouseUp}
                                    onTouchStart={handleMouseDown}
                                    onTouchMove={handleMouseMove}
                                    onTouchEnd={handleMouseUp}
                                >
                                    {/* Grid pattern */}
                                    <div
                                        className="absolute inset-0 opacity-10 pointer-events-none"
                                        style={{
                                            backgroundImage: `
                                                linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                                                linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
                                            `,
                                            backgroundSize: '40px 40px',
                                        }}
                                    />

                                    {/* CSS 3D Scene */}
                                    <motion.div
                                        animate={{
                                            rotateX: rotation.x,
                                            rotateY: rotation.y,
                                            scale: zoom,
                                        }}
                                        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                                        style={{ transformStyle: 'preserve-3d' }}
                                        className="relative"
                                    >
                                        {/* Shadow */}
                                        <div className="absolute inset-0 bg-black/50 blur-3xl transform translate-y-20 scale-90 -z-10" />
                                        <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
                                            {children}
                                        </div>
                                    </motion.div>

                                    {/* CSS Controls Overlay */}
                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 rounded-full backdrop-blur-md border border-white/10">
                                        <p className="text-xs text-gray-400 font-medium">
                                            Drag to rotate • Scroll to zoom
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer / Controls */}
                        {!isR3F && (
                            <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-black/40 z-20">
                                <div className="flex items-center gap-2">
                                    <button onClick={handleZoomOut} className="p-2 rounded hover:bg-white/10 text-gray-400"><ZoomOut className="w-5 h-5" /></button>
                                    <span className="text-xs text-gray-500 w-12 text-center">{Math.round(zoom * 100)}%</span>
                                    <button onClick={handleZoomIn} className="p-2 rounded hover:bg-white/10 text-gray-400"><ZoomIn className="w-5 h-5" /></button>
                                    <div className="w-px h-4 bg-white/10 mx-2" />
                                    <button onClick={handleReset} className="p-2 rounded hover:bg-white/10 text-gray-400"><RotateCcw className="w-5 h-5" /></button>
                                </div>
                                <button
                                    onClick={handleDownload}
                                    disabled={isDownloading}
                                    className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors disabled:opacity-50"
                                >
                                    <Download className="w-4 h-4" />
                                    {isDownloading ? 'Saving...' : 'Download PNG'}
                                </button>
                            </div>
                        )}
                        {isR3F && (
                            <div className="flex items-center justify-end px-6 py-4 border-t border-white/10 bg-black/40 z-20">
                                <button
                                    onClick={handleDownload} // Note: R3F Canvas download is trickier, simplified here to use same handler if canvas has id? Or just placeholder.
                                    disabled={isDownloading}
                                    className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors disabled:opacity-50"
                                >
                                    <Download className="w-4 h-4" />
                                    Download PNG
                                </button>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    if (!mounted) return null;
    return createPortal(modalContent, document.body);
}

export default Mockup3DModal;
