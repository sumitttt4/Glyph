import type { Metadata } from "next";
import "@/styles/globals.css";
import { manrope, instrumentSerif } from "@/lib/brand-fonts";

export const metadata: Metadata = {
  metadataBase: new URL('https://glyph.software'),
  title: "Glyph | AI Brand Design Engineer for Startups",
  description: "Instantly generate premium brand identity systems for your startup. Glyph uses AI to act as your personal Design Engineer, creating logos, color palettes, and brand guidelines in seconds.",
  keywords: ["logo generator", "brand identity", "AI design", "startup branding", "design engineer", "brand guidelines"],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Glyph | AI Brand Design Engineer for Startups",
    description: "Instantly generate premium brand identity systems for your startup. Glyph uses AI to act as your personal Design Engineer.",
    url: 'https://glyph.software',
    siteName: 'Glyph',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Glyph | AI Brand Design Engineer for Startups",
    description: "Instantly generate premium brand identity systems for your startup.",
    creator: '@glyph_app',
  },
  icons: {
    icon: '/logo.svg',
  },
};

import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Glyph",
    "image": "https://glyph.software/opengraph-image",
    "description": "Instantly generate premium brand identity systems for your startup. Glyph uses AI to act as your personal Design Engineer.",
    "applicationCategory": "DesignApplication",
    "operatingSystem": "Web Browser",
    "url": "https://glyph.software",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "author": {
      "@type": "Organization",
      "name": "Glyph",
      "url": "https://glyph.software"
    }
  };

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning className={`${manrope.variable} ${instrumentSerif.variable}`}>
        <body className="antialiased min-h-screen bg-stone-50 font-sans">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          {children}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
