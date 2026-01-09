import React, { useMemo } from 'react';

// 1. SHAPE PRIMITIVES (The "Atoms")
const ATOMS = [
    'dot',       // Simple Circle
    'ring',      // Ring (Hollow Circle)
    'capsule',   // Pill shape
    'hex',       // Hexagon
    'petal'      // Teardrop shape
];

interface RadialLogoProps {
    name: string;   // Seed for uniqueness
    color: string;
    className?: string; // Standard prop
}

export default function RadialLogo({ name, color, className }: RadialLogoProps) {

    // 2. THE MATH (Procedural Generation)
    const config = useMemo(() => {
        // A. Generate a seed number from the name
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const seed = Math.abs(hash);

        // B. Determine Physics
        const spokes = (seed % 5) + 3; // 3 to 7 spokes (Triangle, Square, Pentagon, etc.)
        const atomType = ATOMS[seed % ATOMS.length];
        const rotationOffset = (seed % 360); // Unique angle
        const gap = (seed % 10) + 15; // Distance from center

        return { spokes, atomType, rotationOffset, gap };
    }, [name]);

    // 3. RENDER THE RADIAL ARRAY
    return (
        <div
            className={`w-full h-full flex items-center justify-center relative rounded-xl overflow-hidden ${className}`}
        // style={{ backgroundColor: '#1c1917' }} // REMOVED: Background should be handled by container, not component itself for flexibility
        >
            {/* Generate the Spokes */}
            {Array.from({ length: config.spokes }).map((_, i) => {

                // Calculate Angle
                const angle = (i * (360 / config.spokes)) + config.rotationOffset;

                return (
                    <div
                        key={i}
                        className="absolute flex items-center justify-center"
                        style={{
                            // Rotate the arm
                            transform: `rotate(${angle}deg) translateY(-${config.gap}px)`,
                            transformOrigin: '50% 150%' // Magic center point
                        }}
                    >
                        {/* Render the Atom */}
                        <Atom type={config.atomType} color={color} />

                        {/* Optional: Connector Line to Center (Molecular look) */}
                        <div
                            className="absolute top-full w-0.5 h-6 rounded-full origin-top"
                            style={{ backgroundColor: color, opacity: 0.5 }}
                        />
                    </div>
                );
            })}

            {/* Optional: Central Nucleus */}
            <div className="absolute w-3 h-3 rounded-full opacity-100" style={{ backgroundColor: color }} />

        </div>
    );
}

// 4. ATOM COMPONENT
function Atom({ type, color }: { type: string, color: string }) {
    const common = `shadow-sm`;

    switch (type) {
        case 'ring':
            return <div className={`w-6 h-6 rounded-full border-[3px] ${common}`} style={{ borderColor: color }} />;
        case 'capsule':
            return <div className={`w-3 h-6 rounded-full ${common}`} style={{ backgroundColor: color }} />;
        case 'hex':
            // Using a CSS clip-path for hexagon
            return <div className={`w-6 h-6 ${common}`} style={{ backgroundColor: color, clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }} />;
        case 'petal':
            return <div className={`w-5 h-5 rounded-tr-[50%] rounded-bl-[50%] rounded-tl-full rounded-br-full ${common}`} style={{ backgroundColor: color }} />;
        default: // Dot
            return <div className={`w-5 h-5 rounded-full ${common}`} style={{ backgroundColor: color }} />;
    }
}
