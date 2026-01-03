# MarkZero Implementation Walkthrough

## Overview
MarkZero is a "Design Engineer" platform built with Next.js 14/16 strict ecosystem. It generates brand identities using a "Curated Logic" engine rather than generative AI, ensuring consistent, premium quality results.

## Key Features
1.  **"Parametric" Brand Engine**: Located in `hooks/use-brand-generator.ts`, this engine combines curated Shapes, Themes, and Fonts based on a user-selected "Vibe".
2.  **Premium Aesthetics**:
    *   **Landing Page**: "Paper & Ink" style (Stone-50/900), border-heavy design.
    *   **Live Demo**: An animated card on the landing page cycles through aesthetics to wow the user.
3.  **Bento Grid Dashboard**:
    *   **Architecture**: CSS Grid layout (`components/dashboard/BentoGrid.tsx`).
    *   **Cells**:
        *   **Logo**: Large 2x2 cell displaying the SVG logo. Includes SVG Export.
        *   **Mockup**: 2x1 cell showing a Tote Bag (Light Mode) or Phone Interface (Dark Mode).
        *   **Palette**: 1x1 cell visualizing the generated color tokens.
        *   **Code**: 1x1 cell providing the ready-to-use `tailwind.config.ts`.
4.  **Dark/Light Mode**:
    *   The generated brand has independent Light and Dark tokens.
    *   A global toggle in the dashboard switches the **preview context** (not just the app UI) between these two modes.

## Tech Stack Verification
*   **Framework**: Next.js (App Router).
*   **Styling**: Tailwind CSS v4 (configured via `app/globals.css`).
*   **Icons**: Lucide React.
*   **State**: React Context/Hooks (`useBrandGenerator`).

## How to Run
1.  In the terminal, run `npm run dev`.
2.  Open [localhost:3000](http://localhost:3000).
3.  Select a Vibe (e.g., "Tech" or "Nature") to generate a brand.
4.  Explore the Dashboard, try the Sun/Moon toggle, and download your logo.

## File Structure
*   `app/page.tsx`: Main entry point handling Landing -> Dashboard transition.
*   `lib/data.ts`: Type definitions.
*   `lib/*.ts`: Curated databases for Themes, Shapes, and Fonts.
*   `components/dashboard/`: Bento Grid cell components.

## Verification
*   **Build**: Run `npm run build` to verify type safety (Passed).
*   **Lint**: Tailwind v4 conversion completed.
