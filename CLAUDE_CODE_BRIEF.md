# Claude Code brief — migrate lesson blocks to Savanna primitives

## Context
This codebase has a Savanna design system at `src/components/savanna/index.jsx`
(primitives) + `src/components/savanna/savanna.css` (their styles). Lesson
content is rendered through `src/components/blocks/BlockRenderer.jsx`, which
maps a `block.type` string to one of ~45 block components in
`src/components/blocks/*.jsx`.

Two blocks have already been migrated as reference patterns. Use them as your
template:

- **`CalloutBlock.jsx`** → uses the `<Callout>` primitive (clean semantic swap)
- **`ChecklistBlock.jsx` + `ChecklistBlock.css`** → uses `<Card>` + `<ProgressBar>`,
  inline styles extracted to a sibling CSS file using only semantic tokens

See `BLOCKS_MIGRATION.md` for the full rationale and tone-mapping table.

## Your job
Continue the migration across the rest of the block library. Priority order:

### Tier 1 — Highest impact (do these first)
Blocks with hardcoded hex colors / inline `style={{...}}` that bypass the token
system. Find them with:

```bash
rg -l "style=\{\{" src/components/blocks/
rg "#[0-9a-fA-F]{3,6}" src/components/blocks/
```

For each one, the pattern is:
1. Wrap the outer container in `<Card>` (or another savanna primitive if a
   better match exists — `<Ticket>`, `<HazardBand>`, etc.)
2. Move all inline styles into a sibling `<BlockName>.css` file
3. Replace every hex color with a semantic token (`--bg-surface`, `--fg-default`,
   `--fg-muted`, `--accent-hero`, `--status-success`, `--status-warn`,
   `--status-danger`, `--status-info`). Use `color-mix(in oklab, ...)` for tints.
4. Replace ad-hoc radii (`borderRadius: 12`) with `--r-sm` / `--r-md` / `--r-lg`
5. Replace ad-hoc spacing (`padding: 20`) with `--space-3` … `--space-8`

### Tier 2 — Class-based blocks already on tokens
These already render through `blocks-savanna.css` with semantic tokens, so they
look right but don't use primitives. Optional upgrades:

- `ObjectivesBlock` → wrap in `<Card>`, keep markup simple
- `DefinitionBlock` → could use `<Card variant="raised">` or stay as-is
- `SectionHeader` → swap to `<SectionHead>` *only if* you also extend the lesson
  schema with an optional `num` field (otherwise leave it; bare title still
  works through current CSS)

### Tier 3 — Page-level (not block library)
Same anti-patterns exist outside `components/blocks/`. If there's time:

- `pages/BattleArenaStudent.jsx` (line ~922 has `#2ecc71` literal)
- `pages/BiasInvestigation.jsx` (callout-shaped UI inside the page)
- `pages/BossBattle.jsx` (lots of inline `btnP("#8b5cf6")` button factory —
  candidate for `<Button variant="...">`)

## Constraints

- **Don't break authoring.** `LessonEditor.jsx` writes blocks with specific
  `style` / `icon` / `items` shapes — preserve all input fields. Only change
  how they render.
- **Keep `studentData` / `onAnswer` contracts identical.** Several blocks
  persist student state; the shape of what they save must not change.
- **Translation hooks stay.** `useTranslatedText` / `useTranslatedTexts` and
  `data-translatable` attributes must be preserved on every translatable string.
- **Run the lesson player after each migration** to confirm the block still
  renders correctly with real lesson content. Pick a lesson that exercises the
  block you just migrated.
- **One block per commit.** Easier to review and to revert if something breaks.

## Acceptance criteria

- `rg "#[0-9a-fA-F]{3,6}" src/components/blocks/` returns no matches except
  inside comments or SVG `fill=` (which can stay literal)
- `rg "style=\{\{" src/components/blocks/` is dramatically reduced — remaining
  uses should only be for genuinely dynamic values (computed widths,
  user-provided colors, etc.)
- All blocks import from `../savanna/index.jsx` where a primitive fits
- No visual regressions in the lesson player (eyeball each block on a real
  lesson before merging)

## Reference files
- Primitives: `src/components/savanna/index.jsx`
- Their CSS: `src/components/savanna/savanna.css`
- Token definitions: `src/styles/tokens.semantic.css` + `src/styles/tokens.raw.css`
- Existing skin layer (kept as fallback): `src/styles/blocks-savanna.css`
- Block registry: `src/components/blocks/BlockRenderer.jsx`
- Migration notes & rationale: `BLOCKS_MIGRATION.md`
- Reference migrations: `src/components/blocks/CalloutBlock.jsx`,
  `src/components/blocks/ChecklistBlock.jsx`
