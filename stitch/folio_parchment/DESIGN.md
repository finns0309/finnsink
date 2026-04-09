# Design System Document: The Editorial Archive

## 1. Overview & Creative North Star: "The Digital Curator"
This design system moves away from the sterile, modular nature of modern web templates to embrace the tactile, intellectual weight of a rare first-edition book. The Creative North Star is **The Digital Curator**. 

We are not building a "website"; we are curating a digital manuscript. The design breaks the rigid, symmetrical grid of the "bootstrap era" by utilizing intentional asymmetry, wide "margin-note" gutters, and a typographic scale that prioritizes rhythm over density. We use overlapping elements—such as an image slightly bleeding into a text column—to mimic the way a physical bookmark or a hand-pressed leaf might sit on a page. The goal is an experience that feels quiet, sophisticated, and deeply intentional.

## 2. Colors & Tonal Depth
Our palette is rooted in organic materials: aged paper, ink, and natural pigments.

### The "No-Line" Rule
**Prohibit 1px solid borders for sectioning.** Traditional dividers are the enemy of a "parchment" feel. Boundaries must be defined solely through:
- **Background Color Shifts:** Use `surface-container-low` (#f5f3ee) sections sitting on a `background` (#fbf9f4).
- **Tonal Transitions:** Use a soft gradient transition from `surface` to `surface-container` to indicate a shift in content without a hard edge.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. 
- **Base Layer:** `surface` (#fbf9f4) acts as the primary "paper."
- **Secondary Insights:** Floating sidebars or pull-quotes should use `surface-container-lowest` (#ffffff) to create a subtle "lift" as if a whiter piece of paper was laid on top.
- **Interactive Layers:** Cards should utilize `surface-container-high` (#eae8e3) to create a recessed, tactile feel.

### Signature Textures & Soul
To avoid a "flat" digital look, apply a subtle noise texture (grain) at 3% opacity across the `background`. For primary CTAs or Hero sections, use a linear gradient from `primary` (#171818) to `primary-container` (#2c2c2c) at a 15-degree angle. This provides a "carbon ink" depth that flat charcoal cannot achieve.

## 3. Typography: The Editorial Voice
Typography is the primary vehicle for our brand's authority.

*   **Display & Headlines (Newsreader):** Used for titles and major headings. The high-contrast serif evokes a literary prestige. Use `display-lg` for article titles to command the page.
*   **Body Text (Noto Serif):** Our "workhorse." It provides the legibility of a classic novel. Always prioritize generous line-height (1.6x) to ensure a "calm" reading experience.
*   **Labels (Public Sans):** Used sparingly for metadata (dates, tags). This clean sans-serif acts as the "archivist's note," providing a functional contrast to the elegant serifs.

## 4. Elevation & Depth: Tonal Layering
We do not use drop shadows to indicate height; we use light and opacity.

*   **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` section. This creates a soft, natural lift mimicking the way paper shadows itself.
*   **Ambient Shadows:** If a "floating" navigation bar or menu is required, use a shadow with a 40px blur and only 4% opacity, tinted with `on-surface` (#1b1c19).
*   **The "Ghost Border" Fallback:** If a boundary is required for accessibility, use the `outline-variant` token at **15% opacity**. Never use 100% opaque borders.
*   **Glassmorphism:** For mobile navigation or overlay modals, use `surface` with 80% opacity and a `20px` backdrop-blur. This allows the "parchment" texture of the content below to bleed through, maintaining the tactile atmosphere.

## 5. Components

### Buttons
- **Primary:** Background `primary` (#171818), text `on-primary` (#ffffff). Use `DEFAULT` (0.25rem) roundedness to keep the edges crisp and architectural.
- **Secondary:** Background `secondary-container` (#cae6d6), text `on-secondary-container` (#4e685b). This provides a "Forest Green" accent that feels scholarly.
- **Tertiary:** No background. Underline using the `tertiary` (#201600) color at 2px thickness, offset by 4px.

### Cards & Lists
- **The Rule:** Forbid divider lines.
- **The Implementation:** Use the Spacing Scale `12` (4rem) to separate list items. For cards, use a subtle background shift to `surface-container-low` (#f5f3ee).
- **Tactile Hover:** On hover, a card should transition its background to `surface-container-high` (#eae8e3) rather than growing in size.

### Input Fields
- **Styling:** Use a "minimalist ledger" style. No containing box—only a bottom border using `outline-variant` (#c4c7c7) at 40% opacity.
- **Focus State:** The bottom border transforms into a 2px `secondary` (#4a6457) line.

### Additional Signature Components
- **The Marginalia (Side-note):** A small text block using `body-sm` and `label-md` metadata, positioned in the wide right-hand margin. This mimics the scholarly tradition of annotating texts.
- **The Drop-Cap:** The first letter of a blog post should be a `display-md` serif, spanning two lines of text to immediately establish the "Book" aesthetic.

## 6. Do’s and Don’ts

### Do
- **Do** use asymmetric layouts. Place an image on the far left and the text column slightly off-center to the right.
- **Do** use the `16` (5.5rem) spacing token for vertical rhythm between sections to ensure the design "breathes."
- **Do** use the `secondary` (Forest Green) and `tertiary-fixed-dim` (Muted Gold) colors for very small interactive hits, like a "Read More" arrow or a Category tag.

### Don’t
- **Don't** use pure black (#000000). Use `primary` (#171818) for deep blacks and `on-surface` (#1b1c19) for standard text.
- **Don't** use sharp, 90-degree corners for everything. While we value architectural lines, use the `sm` (0.125rem) roundedness to take the "digital edge" off buttons and images.
- **Don't** cram content. If a page feels "busy," add more `surface` background. The "parchment" is as important as the "ink."