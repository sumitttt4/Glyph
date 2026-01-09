# Brand Identity Generator - Phase 2 Roadmap

## 1. Current Status Review
**Verdict:** The application has a "World-Class" *UI* and *Interaction Design* (animations, transitions, sidebar), but the *Generation Engine* is currently at a "High-End MVP" level. It produces beautiful results, but lacks the depth of customization and asset variety found in top-tier branding tools.

### Strengths
*   **Premium Aesthetic:** The dark mode, bento grids, and typography are excellent.
*   **Smart Inputs:** The "Reframe" AI feature is a standout for UX.
*   **Presentation:** The Slide Deck view is very persuasive.

### Critical Gaps
*   **Static Generation:** Once a logo is made, users can't tweak it (e.g., "Make the icon smaller", "Rotate slightly"). Feature request: **Direct Manipulation**.
*   **CSS-Only Mockups:** The mockups look good in the browser but can't be downloaded as high-res images for the user to actually use.
*   **Missing Assets:** A real brand kit includes Patterns, Social Covers, and Stationery.

---

## 2. Proposed Phase 2 Features

### A. The "Fine-Tune" Editor (High Priority)
*   **Goal:** Allow users to perfect the generative result.
*   **Features:**
    *   **Scale Slider:** Adjust icon vs. text size.
    *   **Gap Slider:** Adjust spacing between icon and text.
    *   **Rotation:** Rotate the symbol (90/180 or free).
    *   **Layout Toggle:** Instant switch between Stacked, Horizontal, Icon Only.

### B. "Real" Asset Generation (High Priority)
*   **Goal:** Provide actual files, not just screenshots.
*   **Implementation:**
    *   Use `html-to-image` or `canvas` to render the Social Media Kit slides as downloadable PNGs.
    *   Generate a `favicon.ico` and `og-image.jpg` pack.

### C. Brand Pattern Generator
*   **Goal:** Add depth to the identity.
*   **Feature:** Automatically generate a seamless pattern based on the chosen Icon geometry (Repeating, Scattered, Grid) to be used as backgrounds.

### D. Export Pipeline Hardening
*   **Goal:** One-click "Download Everything".
*   **Implementation:**
    *   Integrate `jszip`.
    *   Bundle: Logomarks (SVG/PNG), Brand Book (PDF), Social Assets (PNG), and Fonts (Links).

---

## 3. Implementation Plan

### Step 1: The Editor Engine upgrades
*   Refactor `LogoComposition` to accept `scale`, `rotation`, and `gap` props.
*   Update `BrandIdentity` type to store these tweak values.
*   Add a "Tweak" panel to the Workbench.

### Step 2: Asset Export System
*   Create a hidden "Renderer" component to draw assets to Canvas.
*   Implement `downloadAsZip` utility.

### Step 3: Pattern Generator
*   Create `PatternGenerator` component using SVG patterns.
*   Add "Brand Pattern" slide to presentation.
