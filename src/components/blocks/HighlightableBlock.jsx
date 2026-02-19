// src/components/blocks/HighlightableBlock.jsx
// Wraps any text-content block to enable student highlighting.
// Uses the browser Selection API to detect text selections, shows a
// floating toolbar, and persists highlights to Firestore via onHighlight.
import { useRef, useState, useEffect, useCallback } from "react";

const COLORS = [
  { id: "yellow", bg: "rgba(250,204,21,0.35)", border: "rgba(250,204,21,0.6)" },
  { id: "green", bg: "rgba(52,211,153,0.30)", border: "rgba(52,211,153,0.55)" },
  { id: "blue", bg: "rgba(96,165,250,0.30)", border: "rgba(96,165,250,0.55)" },
  { id: "pink", bg: "rgba(244,114,182,0.30)", border: "rgba(244,114,182,0.55)" },
];

/* ── helpers ────────────────────────────────────────────── */

// Walk all text nodes under `root` in DOM order.
function getTextNodes(root) {
  const nodes = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
  while (walker.nextNode()) nodes.push(walker.currentNode);
  return nodes;
}

// Compute a flat character offset for a given DOM node+offset pair
// relative to the block container.
function domToTextOffset(container, node, offset) {
  const textNodes = getTextNodes(container);
  let pos = 0;
  for (const tn of textNodes) {
    if (tn === node) return pos + offset;
    pos += tn.textContent.length;
  }
  return pos + offset;
}

// Convert a flat character offset back to a DOM node+offset pair.
function textOffsetToDom(container, offset) {
  const textNodes = getTextNodes(container);
  let pos = 0;
  for (const tn of textNodes) {
    if (pos + tn.textContent.length >= offset) {
      return { node: tn, offset: offset - pos };
    }
    pos += tn.textContent.length;
  }
  // Past end — return end of last text node
  if (textNodes.length > 0) {
    const last = textNodes[textNodes.length - 1];
    return { node: last, offset: last.textContent.length };
  }
  return { node: container, offset: 0 };
}

// Get all the plain text inside a container.
function getPlainText(container) {
  return getTextNodes(container).map((n) => n.textContent).join("");
}

/* ── component ─────────────────────────────────────────── */

export default function HighlightableBlock({ blockId, highlights = [], onHighlight, children }) {
  const containerRef = useRef(null);
  const [toolbar, setToolbar] = useState(null); // { x, y, start, end, text }
  const [activeColor, setActiveColor] = useState("yellow");
  const [removeTarget, setRemoveTarget] = useState(null); // index of highlight being hovered
  const debounceRef = useRef(null);

  // Debounced save
  const saveHighlights = useCallback(
    (updated) => {
      if (!onHighlight) return;
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onHighlight(blockId, updated);
      }, 600);
    },
    [blockId, onHighlight]
  );

  // Close toolbar on outside click or scroll
  useEffect(() => {
    if (!toolbar) return;
    const close = () => setToolbar(null);
    document.addEventListener("mousedown", close);
    window.addEventListener("scroll", close, true);
    return () => {
      document.removeEventListener("mousedown", close);
      window.removeEventListener("scroll", close, true);
    };
  }, [toolbar]);

  /* ── apply saved highlights as <mark> wrappers ──────── */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Remove existing marks (re-render from scratch)
    el.querySelectorAll("mark.hl-mark").forEach((m) => {
      const parent = m.parentNode;
      while (m.firstChild) parent.insertBefore(m.firstChild, m);
      parent.removeChild(m);
      parent.normalize();
    });

    if (!highlights || highlights.length === 0) return;

    // Sort highlights by startOffset (ascending) so we process left→right
    const sorted = [...highlights]
      .map((h, i) => ({ ...h, _idx: i }))
      .sort((a, b) => a.startOffset - b.startOffset);

    // Apply each highlight. After each insertion the DOM changes,
    // so we re-resolve offsets from the (now-normalized) text each time.
    for (const hl of sorted) {
      try {
        const plainText = getPlainText(el);
        // Validate: does the stored text still match?
        const slice = plainText.slice(hl.startOffset, hl.endOffset);
        if (slice !== hl.text) continue; // content changed — skip

        const startDom = textOffsetToDom(el, hl.startOffset);
        const endDom = textOffsetToDom(el, hl.endOffset);
        const range = document.createRange();
        range.setStart(startDom.node, startDom.offset);
        range.setEnd(endDom.node, endDom.offset);

        const mark = document.createElement("mark");
        mark.className = "hl-mark";
        const colorObj = COLORS.find((c) => c.id === hl.color) || COLORS[0];
        mark.style.background = colorObj.bg;
        mark.style.borderBottom = `2px solid ${colorObj.border}`;
        mark.style.borderRadius = "2px";
        mark.style.padding = "1px 0";
        mark.style.cursor = "pointer";
        mark.dataset.hlIdx = String(hl._idx);

        range.surroundContents(mark);
      } catch (e) {
        // Selection might span multiple elements — skip gracefully
        continue;
      }
    }
  }, [highlights]);

  /* ── handle text selection ──────────────────────────── */
  const handleSelectionEnd = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.rangeCount) return;

    const range = sel.getRangeAt(0);
    const container = containerRef.current;
    if (!container) return;

    // Make sure the selection is inside our container
    if (!container.contains(range.startContainer) || !container.contains(range.endContainer)) return;

    const text = sel.toString().trim();
    if (!text || text.length < 2) return;

    const start = domToTextOffset(container, range.startContainer, range.startOffset);
    const end = domToTextOffset(container, range.endContainer, range.endOffset);

    // Position toolbar near the selection
    const rect = range.getBoundingClientRect();
    setToolbar({
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
      start,
      end,
      text,
    });
  }, []);

  /* ── add a highlight ────────────────────────────────── */
  const addHighlight = useCallback(
    (color) => {
      if (!toolbar) return;
      const newHL = {
        text: toolbar.text,
        startOffset: toolbar.start,
        endOffset: toolbar.end,
        color,
        createdAt: new Date().toISOString(),
      };
      // Merge, avoiding overlaps (simple: remove any that overlap, add new)
      const updated = [
        ...highlights.filter(
          (h) => h.endOffset <= newHL.startOffset || h.startOffset >= newHL.endOffset
        ),
        newHL,
      ];
      saveHighlights(updated);
      setToolbar(null);
      window.getSelection()?.removeAllRanges();
    },
    [toolbar, highlights, saveHighlights]
  );

  /* ── remove a highlight (click existing mark) ───────── */
  const handleContainerClick = useCallback(
    (e) => {
      const mark = e.target.closest("mark.hl-mark");
      if (!mark) return;
      const idx = parseInt(mark.dataset.hlIdx, 10);
      if (isNaN(idx)) return;
      // Show remove option
      const rect = mark.getBoundingClientRect();
      setRemoveTarget({ idx, x: rect.left + rect.width / 2, y: rect.top - 8 });
      e.stopPropagation();
    },
    []
  );

  const removeHighlight = useCallback(() => {
    if (removeTarget === null) return;
    const updated = highlights.filter((_, i) => i !== removeTarget.idx);
    saveHighlights(updated);
    setRemoveTarget(null);
  }, [removeTarget, highlights, saveHighlights]);

  // Close remove popup on outside click
  useEffect(() => {
    if (removeTarget === null) return;
    const close = () => setRemoveTarget(null);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [removeTarget]);

  return (
    <div style={{ position: "relative" }}>
      <div
        ref={containerRef}
        onMouseUp={handleSelectionEnd}
        onTouchEnd={handleSelectionEnd}
        onClick={handleContainerClick}
      >
        {children}
      </div>

      {/* Highlight toolbar */}
      {toolbar && (
        <div
          className="hl-toolbar"
          style={{
            position: "fixed",
            left: Math.max(10, Math.min(toolbar.x - 68, window.innerWidth - 146)),
            top: Math.max(10, toolbar.y - 40),
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text3)", marginRight: 4 }}>
            🖍️
          </span>
          {COLORS.map((c) => (
            <button
              key={c.id}
              className="hl-color-btn"
              style={{ background: c.bg, borderColor: c.border }}
              onClick={() => addHighlight(c.id)}
              title={c.id}
            />
          ))}
        </div>
      )}

      {/* Remove highlight popup */}
      {removeTarget !== null && (
        <div
          className="hl-toolbar"
          style={{
            position: "fixed",
            left: Math.max(10, Math.min(removeTarget.x - 50, window.innerWidth - 110)),
            top: Math.max(10, removeTarget.y - 40),
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <button
            className="hl-remove-btn"
            onClick={removeHighlight}
          >
            ✕ Remove
          </button>
        </div>
      )}
    </div>
  );
}
