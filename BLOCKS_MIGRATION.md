# Block migration to Savanna primitives

Two lesson blocks have been migrated from class/inline-style markup to the
Savanna primitive library (`src/components/savanna/index.jsx`).

## 1. CalloutBlock → `<Callout>`

**Before:** Hand-rolled `<div className="callout-block callout-{style}">` with
manual icon span; styling lived in `blocks.css` + `blocks-savanna.css`.

**After:** Renders the savanna `<Callout>` primitive directly. Authoring
`block.style` is mapped to a tone:

| `block.style` | savanna `tone` |
|---------------|----------------|
| insight       | warn           |
| warning       | danger         |
| question      | info           |
| info          | info           |
| success       | success        |
| tip           | warn           |

`block.icon` (custom emoji) still passes through via the primitive's `icon` prop;
when omitted, the primitive's tone-default glyph is used.

**Net:** -8 lines of bespoke markup, gains `role="alert"` for danger tones,
title slot, and the same skin used everywhere else in the app.

## 2. ChecklistBlock → `<Card>` + `<ProgressBar>` + tokenized CSS

**Before:** ~90 lines of inline `style={{...}}` with hardcoded hex colors
(`#1e2132`, `#22c55e`, `#888`, `#e0e0e0`) that completely bypassed the savanna
token system. Looked stuck in pre-savanna dark mode.

**After:**
- Wrapped in savanna `<Card>` (gets the same surface treatment as the rest of the app)
- Progress visualization now uses savanna `<ProgressBar>` (lime fill, accessible)
- All inline styles moved to a sibling `ChecklistBlock.css` using semantic tokens
  (`--bg-surface`, `--fg-default`, `--fg-muted`, `--accent-hero`, `--r-md`, etc.)
- Hover/done states use `color-mix()` against tokens instead of hardcoded rgba
- Checkbox is now a real focus-visible target

**Net:** Identical behavior, identical interaction model, but the block now
inherits theme changes for free and looks consistent with cards elsewhere.

## Why these two

- **CalloutBlock** is the cleanest semantic mapping in the block library —
  the savanna primitive was practically purpose-built for it.
- **ChecklistBlock** was the worst offender for inline styles + hardcoded
  colors, so migration has the highest visible impact.

## Suggested follow-ups (not done)

- `ObjectivesBlock` and `DefinitionBlock` are already class-based with
  savanna-tokenized CSS — fine as-is, but could optionally use `<Card>`.
- `SectionHeader` could swap to `<SectionHead>` if/when an authored `num`
  field is added to lesson schema.
- Other inline-styled blocks worth checking: `BattleArenaStudent`,
  `BiasInvestigation` (callouts inside pages, not block library).
