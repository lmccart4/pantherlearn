# Reference Site: Shift5.io

Design inspiration reference. When reviewing PantherLearn components, draw from these patterns to inform polish and visual quality — adapted to PantherLearn's dark theme and CSS variable system.

## Overall Aesthetic
- **Militaristic minimalism** with high-tech undertones
- Clean, bold, confident — no clutter
- Dark backgrounds with a single strong accent color for dramatic contrast
- Monospace fonts for technical/data elements mixed with clean sans-serif for readability
- Structured, grid-based layouts that feel organized and intentional
- Generous whitespace — sections breathe

## Color Strategy
| Role | Shift5 Value | PantherLearn Equivalent |
|------|-------------|------------------------|
| Dark background | `#202020` | `var(--bg)` (#0a0c12) |
| Accent/brand | `#ff5841` (coral-orange) | `var(--amber)` (#f5a623) |
| Accent on dark | `#ff5841` text on dark bg | `var(--amber)` on `var(--surface)` |
| Neutral text | White/light on dark | `var(--text)` (#f0f0f4) |

**Takeaway:** Single strong accent color against dark backgrounds. Don't dilute with too many colors. Use the accent sparingly for CTAs, key data, and interactive elements.

## Typography Patterns
- **Display/headings:** Large, bold, commanding — big size differential from body text
- **Technical labels:** Monospace (`AuxMono`), uppercase, 12px, tight letter-spacing (-0.24px), line-height 1.33
- **Body text:** Clean sans-serif, weight 500 for emphasis
- **Font pairing:** Serif/display + monospace creates a sophisticated tech feel

**PantherLearn mapping:**
- Headings → `var(--font-display)` (Fraunces) at larger sizes with more weight contrast
- Technical labels/metadata → Consider monospace or uppercase `var(--font-body)` with letter-spacing
- Body → `var(--font-body)` (Inter)

## Spacing Philosophy
- **Hero sections:** Very generous top padding (200px desktop, reduced on mobile)
- **Section padding:** Large blocks — 5.6rem (90px) top, 4rem (64px) sides
- **Consistent increments:** 16px, 24px, 32px, 64px scale
- **Mobile reduction:** Padding drops proportionally (e.g., 4rem → 2.4rem)

**Takeaway:** PantherLearn could use more breathing room between sections. Shift5 isn't afraid of large whitespace.

## Component Patterns

### Buttons
- Rounded pill shape: `border-radius: 24px`
- Dark bg (`#202020`) with accent text (`#ff5841`)
- Fixed dimensions: 48px height, 100px+ width
- Clean, no border — relies on bg/text contrast

**PantherLearn adaptation:** Consider pill-shaped CTAs for primary actions. Current 14px radius is fine for cards but primary buttons could go rounder.

### Cards
- `border-radius: 8px` (tighter than PantherLearn's 14px)
- Clean, minimal — let content speak
- Image-forward with lazy-load fade-in (opacity 0 → 1)
- No heavy shadows or glows — relies on bg contrast and spacing for separation

**Takeaway:** Shift5 cards are cleaner and less decorated than PantherLearn's glassmorphism approach. For data-heavy or technical components, consider a cleaner card style.

### Featured/Hero Sections
- Large background images with content overlaid
- Strong headline hierarchy — title dominates
- Single clear CTA
- Generous vertical spacing

### Article/List Items
- Single-column vertical list (not grid)
- Category badges: uppercase, small, monospace-styled
- Clear date/headline/description hierarchy
- Consistent vertical rhythm between entries

## Layout Patterns
- **Grid-based:** Structured columns (20rem, 24rem, 36rem widths)
- **Flexbox with wrap:** Multi-column footer, card grids
- **Single-column content:** Long-form sections use centered single column
- **Responsive breakpoint:** 749px for mobile, 1280px for large

**PantherLearn adaptation:** The grid discipline is the key takeaway. Align elements to consistent column widths rather than stretching to fill.

## Animation & Interaction
- **Entrance animations:** `clip-path: inset(100% 0 0 0)` — sections clip in from bottom (scroll-triggered)
- **Image loading:** Opacity 0 → 1 fade on lazy load
- **Performance:** `will-change: transform, opacity` for GPU acceleration
- **Philosophy:** Animations are subtle and purposeful — no bounce, no overshoot, no playfulness

**PantherLearn adaptation:** The clip-path entrance is more sophisticated than translateY fade-in. Consider for section entrances on lesson pages.

## Interactive Elements
- **Dropdown filters:** Clean, minimal — category/type filtering for content
- **Binary code visualization:** Animated data streams for tech aesthetic
- **Modal forms:** Slide-in/fade-in contact forms
- **Hover states:** Subtle, not dramatic — color shifts rather than movement

**Takeaway:** Hover states are restrained. Shift5 uses color change over transform for a more professional feel.

## Key Design Principles to Borrow

1. **Restraint over decoration** — Every visual element earns its place
2. **Size contrast for hierarchy** — Headlines are dramatically larger than body text
3. **Single accent, used sparingly** — One warm color does all the heavy lifting
4. **Generous whitespace** — Sections feel spacious, not cramped
5. **Technical authenticity** — Monospace fonts and structured layouts signal competence
6. **Subtle animation** — Entrance effects feel natural, not showy
7. **Dark backgrounds done right** — Content pops through contrast, not through glow effects
