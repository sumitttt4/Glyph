import { BrandIdentity } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

interface CodeCellProps {
    brand: BrandIdentity;
    mode: 'light' | 'dark';
}

export function CodeCell({ brand, mode }: CodeCellProps) {
    const [copied, setCopied] = useState(false);
    const t = brand.theme.tokens;

    const configString = `import { type Config } from "tailwindcss";

export default {
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "${t.light.primary}",
          dark: "${t.dark.primary}",
        },
        surface: {
          DEFAULT: "${t.light.surface}",
          dark: "${t.dark.surface}",
        }
      },
      fontFamily: {
        heading: ["${brand.font.name.split('+')[0].trim()}", "sans-serif"],
        body: ["${brand.font.name.split('+').pop()?.trim()}", "sans-serif"],
      }
    },
  },
} satisfies Config;`;

    const handleCopy = () => {
        navigator.clipboard.writeText(configString);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative h-full w-full rounded-2xl bg-[#1E1E1E] text-gray-300 p-6 overflow-hidden flex flex-col font-mono text-xs">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-700">
                <span className="text-gray-500">tailwind.config.ts</span>
                <button
                    onClick={handleCopy}
                    className="hover:text-white transition-colors"
                >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
            </div>
            <div className="overflow-auto custom-scrollbar">
                <pre className="whitespace-pre">
                    {configString}
                </pre>
            </div>
        </div>
    );
}
