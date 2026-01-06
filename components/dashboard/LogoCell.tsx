import { BrandIdentity } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Download } from 'lucide-react';
import { LogoComposition } from '@/components/brand/LogoComposition';

interface LogoCellProps {
    brand: BrandIdentity;
    mode: 'light' | 'dark';
}

export function LogoCell({ brand, mode }: LogoCellProps) {
    const tokens = brand.theme.tokens[mode];

    const handleDownload = () => {
        const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="${brand.shape.viewBox || "0 0 24 24"}">
        <path d="${brand.shape.path}" fill="${tokens.primary}" />
      </svg>
    `;
        const blob = new Blob([svgContent], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${brand.name.toLowerCase().replace(/\s+/g, '-')}-logo.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div
            className={cn(
                "relative flex flex-col items-center justify-center h-full w-full p-8 transition-colors duration-500 group",
            )}
            style={{
                backgroundColor: tokens.bg,
                color: tokens.text,
            }}
        >
            <button
                onClick={handleDownload}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/5 hover:bg-black/10 transition-colors opacity-0 group-hover:opacity-100 dark:bg-white/10 dark:hover:bg-white/20"
                title="Download SVG"
            >
                <Download className="w-5 h-5" />
            </button>

            <div className="w-24 h-24 mb-6">
                <LogoComposition brand={brand} />
            </div>
            <h2
                className={cn("text-3xl font-bold tracking-tight transition-colors duration-500", brand.font.heading)}
            >
                {brand.name}
            </h2>
            <p className={cn("text-sm opacity-60 mt-2", brand.font.body)}>
                {brand.vibe.toUpperCase()} SERIES
            </p>
        </div>
    );
}
