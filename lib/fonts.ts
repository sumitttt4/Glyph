import { Inter, Playfair_Display, Roboto_Mono, Poppins, Outfit, Space_Grotesk, DM_Sans } from 'next/font/google';

export const inter = Inter({ subsets: ['latin'] });
export const playfair = Playfair_Display({ subsets: ['latin'] });
export const robotoMono = Roboto_Mono({ subsets: ['latin'] });
export const poppins = Poppins({ weight: ['400', '600', '700'], subsets: ['latin'] });
export const outfit = Outfit({ subsets: ['latin'] });
export const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });
export const dmSans = DM_Sans({ subsets: ['latin'] });

export interface FontConfig {
    id: string;
    name: string;
    heading: any; // NextFont
    body: any; // NextFont
    tags: string[];
}

export const fontPairings: FontConfig[] = [
    {
        id: 'modern-clean',
        name: 'Modern Clean',
        heading: inter,
        body: inter,
        tags: ['minimalist', 'tech']
    },
    {
        id: 'editorial',
        name: 'Editorial',
        heading: playfair,
        body: dmSans,
        tags: ['nature', 'organic', 'professional']
    },
    {
        id: 'tech-mono',
        name: 'Tech Mono',
        heading: spaceGrotesk,
        body: robotoMono,
        tags: ['tech', 'bold']
    },
    {
        id: 'startup-sleek',
        name: 'Startup Sleek',
        heading: outfit,
        body: inter,
        tags: ['modern', 'tech', 'vibrant']
    },
    {
        id: 'bold-geometric',
        name: 'Bold Geometric',
        heading: poppins,
        body: poppins,
        tags: ['bold', 'geometric']
    }
];
