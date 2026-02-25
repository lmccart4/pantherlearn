# Plan: Student Text Highlighting Feature

## Overview
Allow students to select and highlight text within lesson content blocks. Highlights persist to Firestore and are visible when they return to the lesson.

## Approach
Rather than modifying every text-rendering block individually, we'll create a **wrapper component** (`HighlightableBlock`) that wraps any block with text content. This wrapper uses the browser's native `Selection` API to detect text selections, shows a small floating toolbar to apply/remove highlights, and renders saved highlights as `<mark>` overlays.

## Data Storage
Store highlights in the existing progress document alongside answers:

**Path:** `progress/{uid}/courses/{courseId}/lessons/{lessonId}`
```js
{
  answers: { ... },          // existing
  highlights: {              // NEW
    "block-id": [
      { text: "selected text", startOffset: 15, endOffset: 42, color: "yellow" },
      ...
    ]
  }
}
```

This uses the same `merge: true` setDoc pattern — no schema changes needed, no Firestore rule changes needed (students already have write access to their own progress docs).

## Implementation Steps

### 1. Create `HighlightableBlock` wrapper component
**New file:** `src/components/blocks/HighlightableBlock.jsx`

- Wraps children in a `<div>` with `onMouseUp`/`onTouchEnd` handlers
- On text selection: gets the `Selection` object, computes a text-relative offset within the block's DOM
- Shows a small floating popup near the selection with a highlight button (🖍️) and color options
- On highlight: saves the selection range (text + offsets) to state and calls `onHighlight(blockId, highlights)`
- On load: re-applies saved highlights by walking the DOM text nodes and wrapping matched ranges in `<mark>` elements
- Supports removing a highlight by clicking on an existing one

### 2. Update `LessonViewer.jsx`
- Load `highlights` from the progress doc alongside `answers` (it's already in the same doc)
- Add `handleHighlight(blockId, highlights)` callback that writes to Firestore
- Pass `highlights` and `onHighlight` as extra props to highlightable block types

### 3. Update `BlockRenderer.jsx`
- For highlightable block types (text, callout, definition, activity, objectives, vocab_list), wrap the rendered component in `<HighlightableBlock>`
- Pass through `highlights` and `onHighlight` props

### 4. Add CSS for highlights
**In `blocks.css`:**
- `.highlight-mark` — the `<mark>` element styling (background color, rounded corners)
- `.highlight-toolbar` — the floating popup (position, animation, button styles)
- Color options: yellow (default), green, blue, pink

### 5. Debounced auto-save
- Use a simple debounce (1 second) before persisting highlights to Firestore
- This avoids excessive writes when students are rapidly highlighting

## Block types that get highlighting
- `text` — primary target
- `callout` — tip/insight blocks
- `definition` — term definitions
- `activity` — activity instructions
- `objectives` — learning objectives
- `vocab_list` — vocabulary terms

## What does NOT get highlighting
- `question` — has its own interaction model
- `chatbot` — dynamic content
- `video`, `image`, `embed` — no text to highlight
- `bar_chart`, `calculator`, `data_table` — interactive blocks

## Key technical decisions
- **Offset-based matching with text fallback**: Store both character offsets and the highlighted text. On re-render, first try offset-based matching; if the text doesn't match (e.g., content was edited), fall back to text search
- **Students only**: Teachers don't see highlights (they have their own preview mode)
- **No cross-block highlights**: Each highlight is scoped to one block — simpler and more reliable
