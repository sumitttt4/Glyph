import { Manrope, Instrument_Serif } from 'next/font/google';

// MarkZero Brand Typography
export const manrope = Manrope({
    subsets: ['latin'],
    variable: '--font-manrope',
});

export const instrumentSerif = Instrument_Serif({
    subsets: ['latin'],
    weight: '400',
    style: ['normal', 'italic'],
    variable: '--font-instrument-serif',
});
