import type { Metadata } from "next";
import "./globals.css";
import { manrope, instrumentSerif } from "@/lib/brand-fonts";

export const metadata: Metadata = {
  title: "Glyph | AI Design Engineer",
  description: "Generate premium brand identity systems for your startup in seconds.",
  icons: {
    icon: '/logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${manrope.variable} ${instrumentSerif.variable}`}>
      <body className="antialiased min-h-screen bg-stone-50 font-sans">
        {children}
      </body>
    </html>
  );
}
