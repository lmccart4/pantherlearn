// src/components/blocks/BarChartBlock.jsx
// Interactive physics energy bar chart with auto-scaling Y-axis.
// Three sections: Initial State (green), Delta (blue, single bar), Final State (red).
// Students drag bars up/down; tallest bar auto-scales to fill the chart area.
// Ctrl/Cmd+click a bar to type an exact value. Each bar has label + subscript.
// Students can dynamically add/remove bars in initial/final sections.
// Values are unclamped — any number is allowed; the Y-axis rescales dynamically.
// Labels rendered with KaTeX for proper math typesetting (K_{E,i} etc.).

import { useState, useRef, useCallback, useEffect } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
// Note: KaTeX is ~260KB but only loaded when BarChartBlock is rendered
// (it's already code-split via the LessonViewer lazy route).
import useAutoSave from "../../hooks/useAutoSave.jsx";

const COLORS = {
  initial: {
    bg: "rgba(136,204,85,0.12)",
    header: "#88cc55",
    bar: "#557733",
    border: "#446622",
    label: "#557733",
    valueText: "#d0eeb0",
  },
  delta: {
    bg: "rgba(51,51,204,0.12)",
    divider: "#5555ee",
    bar: "#5555ee",
    border: "#3333aa",
    label: "#5555ee",
    valueText: "#c0c0ff",
  },
  final: {
    bg: "rgba(204,85,68,0.12)",
    header: "#cc5544",
    bar: "#aa3322",
    border: "#882211",
    label: "#aa3322",
    valueText: "#f5c0b8",
  },
};

const makeBar = () => ({ value: 0, label: "", subscript: "" });
const defaultSection = (n = 4) => Array.from({ length: n }, makeBar);

export default function BarChartBlock({ block, studentData, onAnswer }) {
  const saved = (studentData || {})[block.id] || {};
  const defaultCount = block.barCount || 4;

  const [initialBars, setInitialBars] = useState(() => saved.initialBars || defaultSection(defaultCount));
  const [deltaBars, setDeltaBars] = useState(() => saved.deltaBars || defaultSection(1));
  const [finalBars, setFinalBars] = useState(() => saved.finalBars || defaultSection(defaultCount));
  const [deltaLabel, setDeltaLabel] = useState(() => saved.deltaLabel || "");
  const [editingBar, setEditingBar] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [editingLabel, setEditingLabel] = useState(null); // "section-idx" or null

  const containerRef = useRef(null);
  const dragRef = useRef({ active: false, section: null, barIdx: null, el: null });
  const initialRef = useRef(initialBars);
  const deltaRef = useRef(deltaBars);
  const finalRef = useRef(finalBars);
  initialRef.current = initialBars;
  deltaRef.current = deltaBars;
  finalRef.current = finalBars;

  const performSave = useCallback(() => {
    if (!onAnswer) return;
    onAnswer(block.id, {
      initialBars: initialRef.current,
      deltaBars: deltaRef.current,
      finalBars: finalRef.current,
      deltaLabel,
      savedAt: new Date().toISOString(),
    });
  }, [block.id, deltaLabel, onAnswer]);

  const { markDirty, saveNow } = useAutoSave(performSave);

  // --- Auto-scale (no fixed limits — any value works) ---
  const allValues = [
    ...initialBars.map((b) => b.value),
    ...deltaBars.map((b) => b.value),
    ...finalBars.map((b) => b.value),
  ];
  const maxAbs = Math.max(1, ...allValues.map(Math.abs));
  // Tallest bar fills 42% of full chart height (= 84% of half). Keeps room
  // for the value label inside the bar and prevents overflow.
  const scaledPercent = (rawValue) => (Math.abs(rawValue) / maxAbs) * 42;

  const getSetter = (s) => (s === "initial" ? setInitialBars : s === "delta" ? setDeltaBars : setFinalBars);
  const getBars = (s) => (s === "initial" ? initialBars : s === "delta" ? deltaBars : finalBars);

  // Map pointer Y → raw value. Uses the ".bc-chart-area" as coordinate
  // reference so the midpoint always matches the drawn axis line.
  // The drag range maps the full chart-area half-height to the current maxAbs,
  // so the user can always drag beyond existing values to increase the scale.
  const clientYToValue = (clientY, barColEl) => {
    const area = barColEl.closest(".bc-chart-area");
    if (!area) return 0;
    const rect = area.getBoundingClientRect();
    const axisY = rect.top + rect.height / 2;
    const halfH = rect.height / 2;
    // No clamping — allow any value. Scale so current maxAbs fills 42% of half.
    // Dragging to the very edge = maxAbs / 0.42 ≈ 2.38× current max.
    const raw = ((axisY - clientY) / halfH) * (maxAbs / 0.42);
    return Math.round(raw);
  };

  const commitManualValue = (section, barIdx, raw) => {
    const num = parseFloat(raw);
    if (isNaN(num)) { setEditingBar(null); setEditingValue(""); return; }
    getSetter(section)((prev) => { const n = [...prev]; n[barIdx] = { ...n[barIdx], value: num }; return n; });
    markDirty();
    setEditingBar(null);
    setEditingValue("");
    setTimeout(() => saveNow(), 0);
  };

  const handlePointerDown = (e, section, barIdx) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "BUTTON") return;
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault(); e.stopPropagation();
      setEditingBar(`${section}-${barIdx}`);
      setEditingValue(String(getBars(section)[barIdx].value));
      return;
    }
    e.preventDefault();
    dragRef.current = { active: true, section, barIdx, el: e.currentTarget };
    const cY = e.touches ? e.touches[0].clientY : e.clientY;
    const val = clientYToValue(cY, e.currentTarget);
    getSetter(section)((prev) => { const n = [...prev]; n[barIdx] = { ...n[barIdx], value: val }; return n; });
    markDirty();
  };

  useEffect(() => {
    const move = (e) => {
      if (!dragRef.current.active) return;
      const cY = e.touches ? e.touches[0].clientY : e.clientY;
      const val = clientYToValue(cY, dragRef.current.el);
      getSetter(dragRef.current.section)((prev) => {
        const n = [...prev]; n[dragRef.current.barIdx] = { ...n[dragRef.current.barIdx], value: val }; return n;
      });
      markDirty();
    };
    const up = () => { if (dragRef.current.active) { dragRef.current.active = false; saveNow(); } };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("touchend", up);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); window.removeEventListener("touchmove", move); window.removeEventListener("touchend", up); };
  }, [markDirty, saveNow]);

  const addBar = (section) => { getSetter(section)((p) => [...p, makeBar()]); markDirty(); };
  const removeBar = (section, idx) => {
    getSetter(section)((p) => { if (p.length <= 1) return p; const n = [...p]; n.splice(idx, 1); return n; });
    markDirty();
  };
  const updateBarField = (section, idx, field, value) => {
    getSetter(section)((p) => { const n = [...p]; n[idx] = { ...n[idx], [field]: value }; return n; });
    markDirty();
  };

  // Build KaTeX HTML from label + subscript. E.g. label="K", sub="E,i" → "K_{E,i}"
  const renderKatex = (label, subscript, color) => {
    if (!label && !subscript) return null;
    let tex = label || "\\;";
    if (subscript) tex += `_{${subscript}}`;
    try {
      return { __html: katex.renderToString(tex, { throwOnError: false, displayMode: false }) };
    } catch {
      return { __html: label + (subscript ? `<sub>${subscript}</sub>` : "") };
    }
  };

  // --- Render label row (sits OUTSIDE chart-area so it doesn't offset the axis) ---
  const renderLabelRow = (bars, section, color, canRemove) => (
    <div className="bc-label-row">
      {bars.map((bar, idx) => {
        const editKey = `${section}-${idx}`;
        const isEditing = editingLabel === editKey;
        const hasContent = bar.label || bar.subscript;

        return (
          <div key={editKey} className="bc-label-cell" onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
            {isEditing ? (
              /* Edit mode: two inline inputs */
              <div className="bc-label-edit">
                <input type="text" className="bc-label-input" value={bar.label}
                  onChange={(e) => updateBarField(section, idx, "label", e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { setEditingLabel(null); saveNow(); } }}
                  placeholder="label"
                  autoFocus
                  style={{ color: color.label }} />
                <input type="text" className="bc-label-input bc-label-input-sub" value={bar.subscript}
                  onChange={(e) => updateBarField(section, idx, "subscript", e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { setEditingLabel(null); saveNow(); } }}
                  onBlur={() => { setEditingLabel(null); saveNow(); }}
                  placeholder="sub"
                  style={{ color: color.label }} />
              </div>
            ) : (
              /* Display mode: KaTeX-rendered math, click to edit */
              <div className="bc-label-display"
                onClick={() => setEditingLabel(editKey)}
                style={{ color: color.label }}
              >
                {hasContent ? (
                  <span dangerouslySetInnerHTML={renderKatex(bar.label, bar.subscript, color)} />
                ) : (
                  <span className="bc-label-placeholder">+</span>
                )}
              </div>
            )}
            {canRemove && bars.length > 1 && (
              <button className="bc-remove-bar"
                onClick={(e) => { e.stopPropagation(); removeBar(section, idx); }}
                onMouseDown={(e) => e.stopPropagation()} title="Remove bar">&times;</button>
            )}
          </div>
        );
      })}
    </div>
  );

  // --- Render a single bar column (just the draggable bar, no label) ---
  const renderBarCol = (bar, idx, section, color) => {
    const val = bar.value;
    const pct = scaledPercent(val);
    const isPos = val >= 0;
    const editKey = `${section}-${idx}`;
    const isEditing = editingBar === editKey;

    return (
      <div key={editKey} className="bc-bar-col"
        onMouseDown={(e) => handlePointerDown(e, section, idx)}
        onTouchStart={(e) => handlePointerDown(e, section, idx)}
      >
        {/* The bar rectangle */}
        <div className="bc-bar" style={{
          backgroundColor: color.bar,
          borderColor: color.border,
          height: `${pct}%`,
          ...(isPos ? { bottom: "50%", top: "auto" } : { top: "50%", bottom: "auto" }),
        }}>
          {val !== 0 && !isEditing && (
            <span className="bc-bar-value" style={{
              color: color.valueText,
              ...(isPos ? { top: 2 } : { bottom: 2 }),
            }}>{Number.isInteger(val) ? val : parseFloat(val.toFixed(4))}</span>
          )}
        </div>

        {/* Manual input overlay */}
        {isEditing && (
          <div className="bc-value-input-container">
            <input type="number" step="any" className="bc-value-input" value={editingValue}
              onChange={(e) => setEditingValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitManualValue(section, idx, editingValue);
                if (e.key === "Escape") { setEditingBar(null); setEditingValue(""); }
              }}
              onBlur={() => commitManualValue(section, idx, editingValue)}
              autoFocus onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()} />
          </div>
        )}
      </div>
    );
  };

  // --- Render a section (initial / delta / final) ---
  const renderSection = (bars, section, color, headerContent, sectionClass, flexVal, showAddBtn) => (
    <div className={`bc-section ${sectionClass}`} style={{
      backgroundColor: color.bg, flex: flexVal,
      ...(section === "delta" ? { borderLeft: `6px solid ${color.divider}`, borderRight: `6px solid ${color.divider}` } : {}),
    }}>
      {/* Header row */}
      <div className="bc-header-row">
        {headerContent}
        {showAddBtn && bars.length < 6 && (
          <button className="bc-add-bar" onClick={() => addBar(section)} title="Add a bar">+</button>
        )}
      </div>

      {/* Label row — OUTSIDE chart-area so bars align with axis */}
      {renderLabelRow(bars, section, color, showAddBtn)}

      {/* Chart area — grid + axis + bars only, no labels */}
      <div className="bc-chart-area" data-section={section}>
        {/* Grid lines */}
        {Array.from({ length: 11 }, (_, i) => (
          <div key={i} className="bc-grid-line" style={{ top: `${i * 10}%` }} />
        ))}
        {/* Axis */}
        <div className="bc-axis-line" />

        {/* Bar columns */}
        <div className="bc-bar-row">
          {bars.map((bar, i) => renderBarCol(bar, i, section, color))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bar-chart-block" ref={containerRef}>
      {block.title && <div className="bc-title">{block.title}</div>}

      <div className="bc-container" style={{ userSelect: "none" }}>
        {renderSection(initialBars, "initial", COLORS.initial,
          <div className="bc-header-box" style={{ backgroundColor: COLORS.initial.header }}>
            {block.initialLabel || "Initial State"}
          </div>, "bc-section-initial", 4, true)}

        {renderSection(deltaBars, "delta", COLORS.delta,
          <div className="bc-delta-header-group">
            <span className="bc-delta-symbol">&Delta;</span>
            <input type="text" className="bc-delta-input" value={deltaLabel}
              onChange={(e) => { setDeltaLabel(e.target.value); markDirty(); }}
              onBlur={saveNow} placeholder="Label" />
          </div>, "bc-section-delta", 1.5, false)}

        {renderSection(finalBars, "final", COLORS.final,
          <div className="bc-header-box bc-header-final" style={{ backgroundColor: COLORS.final.header }}>
            {block.finalLabel || "Final State"}
          </div>, "bc-section-final", 4, true)}
      </div>

      <div className="bc-hint">
        Drag bars up or down &bull; Ctrl+click (&#8984;+click on Mac) to type a value
      </div>
    </div>
  );
}
