import type { Metadata } from "next";
import "@/styles/globals.css";
import { manrope, instrumentSerif } from "@/lib/brand-fonts";

export const metadata: Metadata = {
  metadataBase: new URL('https://glyph.software'),
  title: "Glyph | Design Engineer",
  description: "Generate premium brand identity systems for your startup in seconds.",
  openGraph: {
    title: "Glyph | Design Engineer",
    description: "Generate premium brand identity systems for your startup in seconds.",
    url: 'https://glyph.software',
    siteName: 'Glyph',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Glyph | Design Engineer",
    description: "Generate premium brand identity systems for your startup in seconds.",
    creator: '@glyph_app', // Placeholder
  },
  icons: {
    icon: '/logo.svg',
  },
};

import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${manrope.variable} ${instrumentSerif.variable}`}>
      <body className="antialiased min-h-screen bg-stone-50 font-sans">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
