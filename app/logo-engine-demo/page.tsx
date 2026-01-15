import { LogoEngineDemo } from '@/components/brand/LogoEngineDemo';

export const metadata = {
    title: 'Logo Engine v2 Demo | Glyph',
    description: 'Parametric logo generation visualization',
};

export default function LogoEnginePage() {
    return (
        <main>
            <LogoEngineDemo />
        </main>
    );
}
