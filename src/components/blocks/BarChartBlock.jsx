// src/components/blocks/BarChartBlock.jsx
// Interactive physics energy bar chart with auto-scaling Y-axis.
// Three sections: Initial State (green), Delta (blue), Final State (red).
// Students drag bars up/down; the tallest bar auto-scales to fill the space.

import { useState, useRef, useCallback, useEffect } from "react";
import useAutoSave from "../../hooks/useAutoSave.jsx";

const COLORS = {
  initial: {
    bg: "rgba(136,204,85,0.10)",
    header: "#88cc55",
    bar: "#557733",
    border: "#446622",
    label: "#446622",
  },
  delta: {
    bg: "rgba(51,51,204,0.10)",
    divider: "#5555ee",
    bar: "#5555ee",
    label: "#5555ee",
  },
  final: {
    bg: "rgba(204,85,68,0.10)",
    header: "#cc5544",
    bar: "#aa3322",
    border: "#882211",
    label: "#882211",
  },
};

export default function BarChartBlock({ block, studentData, onAnswer }) {
  const barCount = block.barCount || 4;
  const totalBars = barCount * 2 + 1; // initial + delta + final

  // Load saved state or initialize
  const saved = (studentData || {})[block.id] || {};
  const [values, setValues] = useState(() =>
    saved.values || new Array(totalBars).fill(0)
  );
  const [labels, setLabels] = useState(() =>
    saved.labels || [
      ...new Array(barCount).fill(""),
      ...new Array(barCount).fill(""),
    ]
  );
  const [deltaLabel, setDeltaLabel] = useState(() => saved.deltaLabel || "");

  // Manual value entry (Ctrl/Cmd + click)
  const [editingBar, setEditingBar] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  const containerRef = useRef(null);
  const dragRef = useRef({ active: false, barIndex: null });
  const valuesRef = useRef(values);
  valuesRef.current = values;

  // Auto-save
  const performSave = useCallback(() => {
    if (!onAnswer) return;
    onAnswer(block.id, {
      values: valuesRef.current,
      labels,
      deltaLabel,
      savedAt: new Date().toISOString(),
    });
  }, [block.id, labels, deltaLabel, onAnswer]);

  const { markDirty, saveNow } = useAutoSave(performSave);

  // Get the axis center Y position for a given bar column element
  const getAxisY = (barColEl) => {
    const section = barColEl.closest("[data-section]");
    if (!section) return barColEl.getBoundingClientRect().top + barColEl.getBoundingClientRect().height / 2;
    const rect = section.querySelector(".bc-bars-wrapper");
    if (!rect) return section.getBoundingClientRect().top + section.getBoundingClientRect().height / 2;
    const wrapRect = rect.getBoundingClientRect();
    return wrapRect.top + wrapRect.height / 2;
  };

  // Map clientY to a raw value -100..+100
  const clientYToValue = (clientY, barColEl) => {
    const section = barColEl.closest("[data-section]");
    const wrapper = section?.querySelector(".bc-bars-wrapper");
    if (!wrapper) return 0;
    const wrapRect = wrapper.getBoundingClientRect();
    const axisY = wrapRect.top + wrapRect.height / 2;
    const halfHeight = wrapRect.height / 2;
    // Above axis = positive, below = negative
    let raw = ((axisY - clientY) / halfHeight) * 100;
    return Math.max(-100, Math.min(100, raw));
  };

  // Commit a manually typed bar value
  const commitManualValue = (barIndex, raw) => {
    const num = parseFloat(raw);
    if (isNaN(num)) return; // ignore non-numeric input
    const clamped = Math.max(-100, Math.min(100, num));
    setValues((prev) => {
      const next = [...prev];
      next[barIndex] = Math.round(clamped);
      return next;
    });
    markDirty();
    setEditingBar(null);
    setEditingValue("");
    // Save immediately after manual entry
    setTimeout(() => saveNow(), 0);
  };

  // Drag handlers
  const handlePointerDown = (e, barIndex) => {
    if (e.target.tagName === "INPUT") return;

    // Ctrl+click (Windows/Linux) or Cmd+click (Mac) → manual entry
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      e.stopPropagation();
      setEditingBar(barIndex);
      setEditingValue(String(values[barIndex]));
      return;
    }

    e.preventDefault();
    dragRef.current = { active: true, barIndex, el: e.currentTarget };
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const val = clientYToValue(clientY, e.currentTarget);
    setValues((prev) => {
      const next = [...prev];
      next[barIndex] = Math.round(val);
      return next;
    });
    markDirty();
  };

  useEffect(() => {
    const handleMove = (e) => {
      if (!dragRef.current.active) return;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const val = clientYToValue(clientY, dragRef.current.el);
      setValues((prev) => {
        const next = [...prev];
        next[dragRef.current.barIndex] = Math.round(val);
        return next;
      });
      markDirty();
    };
    const handleUp = () => {
      if (dragRef.current.active) {
        dragRef.current.active = false;
        saveNow();
      }
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleUp);
    };
  }, [markDirty, saveNow]);

  // Auto-scale: find max absolute value
  const maxAbs = Math.max(1, ...values.map(Math.abs));

  // Compute bar height as a percentage of half-height (0-90%)
  const scaledPercent = (rawValue) => (Math.abs(rawValue) / maxAbs) * 90;

  // Render a single bar column
  const renderBar = (index, color, showLabel, labelIndex) => {
    const val = values[index];
    const pct = scaledPercent(val);
    const isPositive = val >= 0;
    const isEditing = editingBar === index;

    return (
      <div
        key={index}
        className="bc-bar-column"
        onMouseDown={(e) => handlePointerDown(e, index)}
        onTouchStart={(e) => handlePointerDown(e, index)}
        style={{ cursor: "ns-resize" }}
      >
        <div
          className="bc-bar"
          style={{
            backgroundColor: color.bar,
            border: `2px solid ${color.border || "rgba(0,0,0,0.4)"}`,
            height: `${pct}%`,
            ...(isPositive
              ? { bottom: "50%", top: "auto" }
              : { top: "50%", bottom: "auto" }),
          }}
        />
        {/* Manual value input overlay — shown on Ctrl/Cmd+click */}
        {isEditing && (
          <div className="bc-value-input-container">
            <input
              type="number"
              className="bc-value-input"
              value={editingValue}
              onChange={(e) => setEditingValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitManualValue(index, editingValue);
                if (e.key === "Escape") { setEditingBar(null); setEditingValue(""); }
              }}
              onBlur={() => commitManualValue(index, editingValue)}
              autoFocus
              min={-100}
              max={100}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            />
          </div>
        )}
        {/* Value tooltip — shows current value on the bar */}
        {val !== 0 && !isEditing && (
          <div
            className="bc-value-tooltip"
            style={{
              ...(isPositive
                ? { bottom: `calc(50% + ${pct}% + 4px)` }
                : { top: `calc(50% + ${pct}% + 4px)` }),
              color: color.bar,
            }}
          >
            {val}
          </div>
        )}
        {showLabel && (
          <div className="bc-label-container">
            <input
              type="text"
              className="bc-label-input"
              value={labels[labelIndex] || ""}
              onChange={(e) => {
                const next = [...labels];
                next[labelIndex] = e.target.value;
                setLabels(next);
                markDirty();
              }}
              onBlur={saveNow}
              placeholder="Label"
              style={{ borderColor: color.label }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </div>
    );
  };

  // Grid lines (10 horizontal)
  const gridLines = Array.from({ length: 11 }, (_, i) => (
    <div
      key={i}
      className="bc-grid-line"
      style={{ top: `${i * 10}%` }}
    />
  ));

  return (
    <div className="bar-chart-block" ref={containerRef}>
      {block.title && (
        <div className="bc-title">{block.title}</div>
      )}

      <div className="bc-chart-container" style={{ userSelect: "none" }}>
        {/* Initial State Section */}
        <div
          className="bc-section bc-section-initial"
          data-section="initial"
          style={{ backgroundColor: COLORS.initial.bg, flex: 4 }}
        >
          {gridLines}
          <div className="bc-axis-line" />
          <div className="bc-header-container">
            <div
              className="bc-header-box"
              style={{ backgroundColor: COLORS.initial.header }}
            >
              {block.initialLabel || "Initial State"}
            </div>
          </div>
          <div className="bc-bars-wrapper">
            {Array.from({ length: barCount }, (_, i) =>
              renderBar(i, COLORS.initial, true, i)
            )}
          </div>
        </div>

        {/* Delta Section */}
        <div
          className="bc-section bc-section-delta"
          data-section="delta"
          style={{
            backgroundColor: COLORS.delta.bg,
            flex: 1.5,
            borderLeft: `6px solid ${COLORS.delta.divider}`,
            borderRight: `6px solid ${COLORS.delta.divider}`,
          }}
        >
          {gridLines}
          <div className="bc-axis-line" />
          <div className="bc-header-container">
            <div className="bc-delta-header-group">
              <span className="bc-delta-symbol">&Delta;</span>
              <input
                type="text"
                className="bc-delta-input"
                value={deltaLabel}
                onChange={(e) => { setDeltaLabel(e.target.value); markDirty(); }}
                onBlur={saveNow}
                placeholder="Label"
              />
            </div>
          </div>
          <div className="bc-bars-wrapper">
            {renderBar(barCount, COLORS.delta, false, null)}
          </div>
        </div>

        {/* Final State Section */}
        <div
          className="bc-section bc-section-final"
          data-section="final"
          style={{ backgroundColor: COLORS.final.bg, flex: 4 }}
        >
          {gridLines}
          <div className="bc-axis-line" />
          <div className="bc-header-container">
            <div
              className="bc-header-box bc-header-final"
              style={{ backgroundColor: COLORS.final.header }}
            >
              {block.finalLabel || "Final State"}
            </div>
          </div>
          <div className="bc-bars-wrapper">
            {Array.from({ length: barCount }, (_, i) =>
              renderBar(barCount + 1 + i, COLORS.final, true, barCount + i)
            )}
          </div>
        </div>
      </div>

      <div className="bc-hint">
        Drag bars up or down &bull; Ctrl+click (&#8984;+click on Mac) a bar to type an exact value
      </div>
    </div>
  );
}
