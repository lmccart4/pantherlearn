# PantherLearn Design System Reference

## CSS Architecture
- Pure vanilla CSS with CSS custom properties (no framework)
- Global files: `src/index.css` (main), `src/blocks.css` (lesson blocks), `src/gamification-extras.css`, `src/preview.css`
- Components use className attributes exclusively

## Color Palette

### Foundation
| Variable | Value | Usage |
|----------|-------|-------|
| `--bg` | `#0a0c12` | Primary background |
| `--surface` | `#161a26` | Cards/panels |
| `--surface2` | `#1e2330` | Elevated surfaces |
| `--surface3` | `#262c3d` | Higher elevation |
| `--border` | `#323952` | Borders/dividers |
| `--border-glow` | `rgba(245, 166, 35, 0.22)` | Accent borders |

### Text
| Variable | Value | Usage |
|----------|-------|-------|
| `--text` | `#f0f0f4` | Primary text |
| `--text2` | `#b0b5c9` | Secondary text |
| `--text3` | `#7a809a` | Muted/tertiary text |

### Semantic
| Variable | Value | Usage |
|----------|-------|-------|
| `--amber` | `#f5a623` | Primary accent (warm gold) |
| `--amber-bright` | `#ffbe47` | Hover states |
| `--amber-dim` | `rgba(245, 166, 35, 0.10)` | Background tint |
| `--green` | `#34d8a8` | Success/correct |
| `--green-dim` | `rgba(52, 216, 168, 0.10)` | Success bg |
| `--red` | `#f87171` | Error/incorrect |
| `--red-dim` | `rgba(248, 113, 113, 0.10)` | Error bg |
| `--blue` | `#60a5fa` | Info/questions |
| `--blue-dim` | `rgba(96, 165, 250, 0.10)` | Info bg |
| `--purple` | `#b08eff` | Tertiary accent |
| `--purple-dim` | `rgba(176, 142, 255, 0.10)` | Tertiary bg |
| `--cyan` | `#22d3ee` | External links |
| `--cyan-dim` | `rgba(34, 211, 238, 0.10)` | Link bg |

### Ori Spirit Palette (special effects)
| Variable | Value |
|----------|-------|
| `--ori-glow-purple` | `rgba(176,142,255,0.09)` |
| `--ori-glow-teal` | `rgba(13,180,180,0.07)` |
| `--ori-glow-gold` | `rgba(245,166,35,0.05)` |
| `--ori-lavender` | `#c4b5fd` |
| `--ori-firefly` | `rgba(245,200,80,0.7)` |
| `--ori-firefly-cool` | `rgba(34,211,238,0.55)` |

## Typography
- **Display font:** `'Fraunces', serif` (`--font-display`) — headings
- **Body font:** `'Inter', sans-serif` (`--font-body`) — all text
- **Sizes:** 16px base, 20px questions, 22px activity titles, 32px section headers
- **Line height:** 1.7 body, 1.65 prompts, 1.75 instructions
- **Border radius:** `--radius: 14px`

## Spacing Conventions
- **Padding:** 12px, 14px, 16px, 18px, 20px, 24px, 28px
- **Gaps:** 4px, 6px, 8px, 10px, 12px, 14px, 16px, 20px
- **Content gutters:** 72px desktop, 24px mobile

## Responsive Breakpoints
- **Mobile:** `max-width: 480px` — floating widgets repositioned, minibar style
- **Tablet:** `max-width: 768px` — sidebar hidden, full-width content, adjusted font sizes
- **Reduced motion:** `prefers-reduced-motion: reduce` — all animations disabled

## Card Pattern
```css
background: linear-gradient(135deg, var(--surface), rgba(26,16,64,0.15));
border: 1px solid var(--border);
border-radius: 14px;
padding: 28px;
box-shadow: 0 2px 12px rgba(0,0,0,0.25), inset 0 1px 0 rgba(176,142,255,0.04);
transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
```

## Button Patterns
- **Primary:** Gradient bg (amber → orange-bright), drop shadow, translateY hover
- **Secondary:** Surface bg, border, purple hover with inset glow
- **Disabled:** opacity 0.4, no cursor, no transform

## Interactive States
- **Hover:** translateY(-2px), enhanced box-shadow, color shift
- **Focus:** outline-offset 2px, amber outline
- **Active:** darker bg, increased saturation
- **Transitions:** 0.2s–0.4s cubic-bezier(0.22, 1, 0.36, 1)

## Visual Effects
- **Glassmorphism:** backdrop-filter: blur(12px–28px) saturate(1.5) on top bar, dropdowns, modals
- **Glows:** box-shadow with rgba purple/amber for subtle auras
- **Depth shadows:** 0 12px 40px rgba(0,0,0,0.35) for floating elements
- **Inset glow:** inset 0 0 40px rgba(176,142,255,0.05) for inner light

## Animations
- `fadeIn` — 0.45s, translateY(14px) entrance
- `fadeInStagger` — staggered card load (0.05s increments)
- `badgePop` — scale 0→1 bounce (0.3s)
- `spiritBreathe` — box-shadow pulse (3–4s breathing)
- `shimmer` — skeleton loading gradient
- Default easing: `cubic-bezier(0.22, 1, 0.36, 1)`

## Layout
```css
.lesson-layout {
  display: grid;
  grid-template-columns: 1fr 240px; /* Content + sidebar */
}
.lesson-content {
  padding: 52px 72px 120px; /* Large gutters */
}
.progress-sidebar {
  position: sticky; top: 62px;
}
```

## Accessibility
- `.skip-to-content` — focusable skip link
- `.sr-only` — screen-reader-only text
- `:focus-visible` — 2px solid amber outline
- Reduced motion respected globally
- WCAG color contrast maintained on dark bg
