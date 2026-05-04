# Block migration to Savanna primitives

The lesson block library has been migrated from class/inline-style markup to the
Savanna primitive system (`src/components/savanna/index.jsx`) and semantic
token vocabulary (`src/styles/tokens.semantic.css`).

## Reference migrations (initial)

### CalloutBlock → `<Callout>`
**Before:** Hand-rolled `<div className="callout-block callout-{style}">` with manual icon span; styling lived in `blocks.css` + `blocks-savanna.css`.

**After:** Renders the savanna `<Callout>` primitive directly. Authoring `block.style` is mapped to a tone:

| `block.style` | savanna `tone` |
|---------------|----------------|
| insight       | warn           |
| warning       | danger         |
| question      | info           |
| info          | info           |
| success       | success        |
| tip           | warn           |

`block.icon` (custom emoji) still passes through via the primitive's `icon` prop.

### ChecklistBlock → `<Card>` + `<ProgressBar>` + tokenized CSS
**Before:** ~90 lines of inline `style={{...}}` with hardcoded hex colors that bypassed the token system.

**After:** Wrapped in savanna `<Card>`; progress visualization uses savanna `<ProgressBar>`; all inline styles moved to `ChecklistBlock.css` using semantic tokens.

## Tier 1 migrations

The following blocks were migrated from inline styles + hex literals to sibling CSS files using semantic tokens (`--bg-surface`, `--fg-default`, `--fg-muted`, `--accent-hero`, `--status-success/info/warn/danger`, `--r-md`, `--space-*`, etc.). Each got its own commit so reverts are surgical.

| Block | New CSS file | Key mapping |
|-------|--------------|-------------|
| `DividerBlock` | `DividerBlock.css` | `--border-soft`, `--space-7` |
| `ImageBlock` | `ImageBlock.css` | image border + caption tokens |
| `VideoBlock` | `VideoBlock.css` | iframe frame + caption tokens |
| `ErrorBoundary` | `ErrorBoundary.css` | retry banner mapped to `--status-danger` |
| `EmbedBlock` | `EmbedBlock.css` | complete/pending status banner via `--status-success`/`--status-warn` |
| `QuestionBlock` | `QuestionBlock.css` | XP toast, graded-tier badges, ranking rows, review form |
| `ScoreTallyBlock` | `ScoreTallyBlock.css` | tier classes (perfect/strong/ok/weak) |
| `SlideSubmitBlock` | `SlideSubmitBlock.css` | input + Canva fallback |
| `EvidenceUploadBlock` | `EvidenceUploadBlock.css` | photo grid + uploading spinner |
| `BarChartBlock` | `BarChartBlock.css` | per-section initial/delta/final colors via status tokens |
| `DataTableBlock` | `DataTableBlock.css` | red header → `--status-danger`, cyan summary → `--status-info` |
| `SketchBlock` | `SketchBlock.css` | textarea overlay, color picker chrome (drawing palette intentionally kept as hex — see notes) |
| `CalculatorBlock` | `CalculatorBlock.css` | formula chip, calc gradient, result panel |
| `ImageGenBlock` | `ImageGenBlock.css` | tip card, gallery, lightbox |
| `BiasDetectiveBlock` | `BiasDetectiveBlock.css` | launcher-card pattern |
| `EmbeddingExplorerBlock` | `EmbeddingExplorerBlock.css` | launcher-card pattern |
| `ChatbotWorkshopBlock` | `ChatbotWorkshopBlock.css` | launcher-card pattern |
| `MomentumMysteryLabBlock` | `MomentumMysteryLabBlock.css` | launcher-card pattern |
| `SpaceRescueBlock` | `SpaceRescueBlock.css` | launcher-card pattern |
| `ExternalActivityBlock` | `ExternalActivityBlock.css` | per-activity tone classes (warn/info/alt/hero) |
| `SimulationBlock` | `SimulationBlock.css` | observation submit toggle |
| `SortingBlock` | `SortingBlock.css` | swipe-card glow via CSS custom property; score tier classes |
| `GuessWhoBlock` | `GuessWhoBlock.css` | tone-driven Section/SmallBtn helpers |

`ChatbotBlock` was audited and left unchanged — its only inline style is a dynamic progress-bar width, and all colors already flow through legacy bridge tokens.

### What was preserved
- `studentData` / `onAnswer` / `onLog` / `onRequestReview` contracts — every grading and persistence shape is byte-identical to before.
- All `data-translatable` attributes and `useTranslatedText` / `useTranslatedTexts` hooks.
- Authoring schema (`block.style`, `block.icon`, `block.items`, etc.).
- Block IDs — no rendering change touches Firestore IDs (per `.claude/rules/grade-data-integrity.md`).

### Inline styles that were intentionally kept
- **Computed values**: drag transforms, dynamically-driven widths, opacity tied to drag distance, KaTeX-rendered `font-size`. These have to be inline because they change every frame.
- **Authored color overrides**: e.g. Bloom-difficulty badge color in QuestionBlock comes from the gamification lib per Bloom level — kept as inline style with the lib-supplied color.
- **`--glow` custom property pattern**: where a CSS class needs a runtime-computed scalar, the JSX writes a single CSS var and the stylesheet does the color-mix.

## Intentionally NOT migrated (game-themed)

Three blocks are full-bleed gameplay components with deliberate, designed-from-scratch visual identities. Their hex palettes are intrinsic to the game design, not theme drift, so forcing them onto semantic tokens would break the game's look:

| Block | Why kept |
|-------|----------|
| `ConceptBuilderBlock` | "Industrial Blueprint Edition" — Russo One + IBM Plex Mono with a navy / safety-yellow / hazard-orange / steel palette. The `T` palette object *is* the game's visual identity. |
| `ConnectFourBlock` | Game board with player chip colors, win-line glow, and turn indicators that map to specific functional colors. |
| `rocket-staging/RocketStagingChallenge` | Multi-stage rocket simulation with stage-coloring tied to physics state (fuel/thrust/mass) — the colors *are* game data. |
| `SketchBlock` drawing palette | The 6-color `COLORS` array is the student's drawing palette, written into the saved stroke record. Tokenizing it would change the rendered drawing when the student switches themes. The block's *chrome* (textarea overlay, color picker) is migrated. |

If a future redesign integrates the games into the savanna look, these are the candidates — but it's a design decision, not a token-cleanup sweep.

## Acceptance check (post-Tier-1)

- `rg "#[0-9a-fA-F]{3,6}" src/components/blocks/`: 4 files match (3 game-themed + 1 false positive on the `&#8984;` HTML entity in BarChartBlock's hint string).
- `rg "style=\{\{" src/components/blocks/`: 10 files match. The bulk live in the 3 game blocks above; the rest are single-line dynamic styles that have to remain inline.
