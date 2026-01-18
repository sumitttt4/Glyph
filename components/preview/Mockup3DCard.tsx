import { BrandIdentity } from '@/lib/data';
import { motion } from 'framer-motion';
import { LogoComposition } from '@/components/logo-engine/LogoComposition';

interface Mockup3DCardProps {
    brand: BrandIdentity;
    stacked?: boolean;
}

export function Mockup3DCard({ brand, stacked = false }: Mockup3DCardProps) {
    // Extract colors for easier access
    const primary = brand.theme.tokens.light.primary;
    const surface = brand.theme.tokens.light.surface;
    const bg = brand.theme.tokens.light.bg;
    const text = brand.theme.tokens.light.text;

    // The Card Component
    const Card = ({ rotate = 0, y = 0, zIndex = 0, variant = 'front' }: { rotate?: number, y?: number, zIndex?: number, variant?: 'front' | 'back' }) => (
        <div
            className="absolute w-56 h-32 rounded-xl shadow-2xl flex flex-col justify-between overflow-hidden border border-white/10"
            style={{
                backgroundColor: variant === 'front' ? primary : bg,
                transform: `rotate(${rotate}deg) translateY(${y}px)`,
                zIndex
            }}
        >
            {variant === 'front' ? (
                // Front Design (Logo + Name)
                <div className="relative h-full p-5 flex flex-col justify-between">
                    {/* Subtle graphical element */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-bl-full -mr-4 -mt-4 opacity-50"></div>

                    <div className="w-8 h-8">
                        <LogoComposition brand={brand} overrideColors={{ primary: '#FFFFFF' }} />
                    </div>

                    <div>
                        <p className="text-white/80 text-[10px] uppercase tracking-widest font-mono mb-1">Founder</p>
                        <p className="text-white text-lg font-bold tracking-tight">{brand.name}</p>
                    </div>
                </div>
            ) : (
                // Back Design (Contact Info)
                <div className="relative h-full p-5 flex flex-col justify-center items-center text-center">
                    <div className="w-12 h-12 mb-3 opacity-20">
                        <LogoComposition brand={brand} />
                    </div>
                    <div className="space-y-1">
                        <div className="h-1.5 w-20 bg-stone-300 mx-auto rounded-full" style={{ backgroundColor: surface }} />
                        <div className="h-1.5 w-16 bg-stone-200 mx-auto rounded-full" />
                    </div>
                </div>
            )}
        </div>
    );

    if (stacked) {
        return (
            <div className="relative w-full h-full flex items-center justify-center py-8">
                <Card rotate={-15} y={-10} zIndex={10} variant="front" />
                <Card rotate={5} y={15} zIndex={20} variant="back" />
            </div>
        )
    }

    return (
        <div className="relative w-full h-full flex items-center justify-center p-8 perspective-[1000px]">
            {/* Simple single floating card */}
            <motion.div
                initial={{ rotateY: -20, rotateX: 10 }}
                animate={{ rotateY: [-20, 20, -20], rotateX: [10, 5, 10] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="w-64 h-40 rounded-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)]"
                style={{
                    backgroundColor: primary,
                    transformStyle: 'preserve-3d'
                }}
            >
                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    <div className="w-10 h-10">
                        <LogoComposition brand={brand} overrideColors={{ primary: '#FFFFFF' }} />
                    </div>
                    <div className="text-white text-2xl font-bold">{brand.name}</div>
                </div>

                {/* Realistic Gloss Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl pointer-events-none" />
            </motion.div>
        </div>
    );
}
