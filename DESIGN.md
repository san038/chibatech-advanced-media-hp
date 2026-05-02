# Design System Strategy: The Monolithic Archive

## 1. Overview & Creative North Star
**Creative North Star: The Monolithic Archive**
This design system rejects the "friendly" ubiquity of modern web templates in favor of a cold, intellectual precision. We are designing for the Chiba Institute of Technology’s Department of Advanced Media—a place where engineering meets art. The aesthetic is "Structural Intellectualism": a high-contrast, hard-edged environment that feels like a digital gallery or a high-end research journal.

To move beyond the "vocational school" look, we utilize **intentional asymmetry, massive typographic scales, and tectonic layering.** Instead of boxes, we use planes. Instead of borders, we use light. The goal is an interface that feels less like software and more like a physical installation.

## 2. Colors & Tonal Logic
The palette is rooted in a pure white vacuum, punctuated by high-fidelity technical accents that represent the department's three pillars.

### The Core Palette
- **Background (`#fcf9f8`):** Not a pure sterile white, but a "Gallery White" that provides a sophisticated base.
- **On-Surface (`#1c1b1b`):** Deep charcoal for maximum legibility and authority.
- **The Pillar Accents:**
    - **Media Engineering (`#6A4DFF` / `primary`):** A high-energy violet for technical innovation.
    - **Knowledge Engineering (`#3B82F6` / `secondary`):** A disciplined blue for logic and data.
    - **Information Design (`#FF7A59` / `tertiary`):** A warm, humanistic coral for communication.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to define sections. Traditional "boxing" of content is the hallmark of amateur design. 
- Boundaries must be defined through **Background Color Shifts**. Use `surface-container-low` against `surface` to create distinct zones.
- Use **Vertical White Space** as a structural element. If a section needs to end, let it end with a 160px gap, not a line.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked architectural planes:
1.  **Base:** `surface` (#fcf9f8) - The ground floor.
2.  **Raised Planes:** `surface-container-low` (#f6f3f2) - For secondary content blocks.
3.  **High-Detail Areas:** `surface-container-lowest` (#ffffff) - Use pure white for high-priority cards to create a "lift" effect against the gallery-white background.

## 3. Typography: Editorial Hierarchy
Typography is our primary tool for navigation. We use **Space Grotesk** for its mathematical, futuristic personality and **Inter** for its neutral, academic clarity.

- **Display (Space Grotesk):** Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) for hero statements. This should feel like a headline in a premium architecture magazine.
- **Headline (Space Grotesk):** `headline-lg` (2rem) for section headers. Always use "Sentence case" to maintain an intellectual, non-shouty tone.
- **Body (Inter):** `body-lg` (1rem) with a generous line-height (1.6) to ensure long-form academic papers remain readable.
- **Labels (Inter):** `label-md` (0.75rem) in All-Caps with +0.05em tracking for technical metadata or categories.

## 4. Elevation & Depth: Tonal Layering
We do not use shadows to mimic "floating" objects; we use them to mimic "ambient occlusion" between rigid slabs.

- **The Layering Principle:** Achieve depth by "stacking." A `surface-container-highest` navigation bar should stick to the top of the viewport, while `surface` content slides beneath it.
- **Ambient Shadows:** Only use shadows on "Sticky" or "Floating" elements. Shadows must be extra-diffused: `box-shadow: 0 20px 80px rgba(0,0,0,0.04)`.
- **The "Ghost Border":** If a separation is mathematically required for accessibility, use the `outline-variant` token at 10% opacity. It should be barely perceptible—a "whisper" of a line.
- **Glassmorphism:** For futuristic overlays (e.g., mobile menus), use `surface` with 80% opacity and a `backdrop-filter: blur(20px)`. This creates a frosted-lens effect that feels like high-end lab equipment.

## 5. Components

### The "Zero-Radius" Mandate
All components—buttons, cards, inputs—must have a **0px border radius.** No exceptions. Rounded corners suggest consumer "friendliness"; hard edges suggest professional "precision."

- **Buttons:**
    - **Primary:** `primary` background with `on-primary` text. Rectangular, no shadow. Hover state: `primary-container`.
    - **Tertiary (Ghost):** No background, just a text label with an underscore that expands on hover.
- **Cards:** Forbid divider lines. Use a `surface-container-low` background for the card body and `surface-container-lowest` for an internal "inset" area if needed.
- **Sticky Sections:** Use `position: sticky` for section headers. As the user scrolls, headers should stack or "push" the previous section, creating a sense of physical weight.
- **Inputs:** A single `outline` bottom-border only. No 4-sided boxes. This mimics a signature line on a formal document.

## 6. Do's and Don'ts

### Do:
- **Use "Extreme" White Space:** If you think there is enough padding, double it.
- **Embrace Asymmetry:** Align text to a 12-column grid but leave the first 3 columns empty for "breathing room" in hero sections.
- **Sticky Layering:** Allow images to overlap text containers slightly to create a layered, "collage" effect of research materials.

### Don't:
- **No Rounded Corners:** Never use `border-radius`.
- **No Generic Icons:** Avoid "bubbly" icon sets. Use thin-stroke (1px) geometric icons that feel like technical schematics.
- **No Center Alignment:** For body text and headlines, stick to left-alignment. Centered text feels like a greeting card; left-aligned text feels like a report.
- **No Pure Black:** Never use `#000000`. Use `on-surface` (#1c1b1b) to keep the contrast high but the tone sophisticated.

---
*This design system is a living document intended to facilitate the creation of an elite academic environment for the Department of Advanced Media.*