// src/components/blocks/BarChartBlock.jsx
// Interactive physics energy bar chart with auto-scaling Y-axis.
// Three sections: Initial State (green), Delta (blue), Final State (red).
// Students drag bars up/down; the tallest bar auto-scales to fill the space.
// Ctrl/Cmd+click a bar to type an exact value. Each bar has label + subscript.
// Students can dynamically add/remove bars per section.

import { useState, useRef, useCallback, useEffect } from "react";
import useAutoSave from "../../hooks/useAutoSave.jsx";

const COLORS = {
  initial: {
    bg: "rgba(136,204,85,0.10)",
    header: "#88cc55",
    bar: "#557733",
    border: "#446622",
    label: "#446622",
    valueText: "#c8e6a0",
  },
  delta: {
    bg: "rgba(51,51,204,0.10)",
    divider: "#5555ee",
    bar: "#5555ee",
    border: "#3333aa",
    label: "#5555ee",
    valueText: "#b8b8ff",
  },
  final: {
    bg: "rgba(204,85,68,0.10)",
    header: "#cc5544",
    bar: "#aa3322",
    border: "#882211",
    label: "#882211",
    valueText: "#f5b8b0",
  },
};

const makeBar = () => ({ value: 0, label: "", subscript: "" });

const defaultSection = (count = 4) =>
  Array.from({ length: count }, () => makeBar());

export default function BarChartBlock({ block, studentData, onAnswer }) {
  const saved = (studentData || {})[block.id] || {};
  const defaultCount = block.barCount || 4;

  const [initialBars, setInitialBars] = useState(
    () => saved.initialBars || defaultSection(defaultCount)
  );
  const [deltaBars, setDeltaBars] = useState(
    () => saved.deltaBars || defaultSection(1)
  );
  const [finalBars, setFinalBars] = useState(
    () => saved.finalBars || defaultSection(defaultCount)
  );
  const [deltaLabel, setDeltaLabel] = useState(() => saved.deltaLabel || "");

  const [editingBar, setEditingBar] = useState(null);
  const [editingValue, setEditingValue] = useState("");

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

  const allValues = [
    ...initialBars.map((b) => b.value),
    ...deltaBars.map((b) => b.value),
    ...finalBars.map((b) => b.value),
  ];
  const maxAbs = Math.max(1, ...allValues.map(Math.abs));

  // Max 60% of half-height so bars stay well within visible bounds
  const scaledPercent = (rawValue) => (Math.abs(rawValue) / maxAbs) * 60;

  const getSetter = (section) => {
    if (section === "initial") return setInitialBars;
    if (section === "delta") return setDeltaBars;
    return setFinalBars;
  };
  const getBars = (section) => {
    if (section === "initial") return initialBars;
    if (section === "delta") return deltaBars;
    return finalBars;
  };

  const clientYToValue = (clientY, barColEl) => {
    const sectionEl = barColEl.closest("[data-section]");
    const wrapper = sectionEl?.querySelector(".bc-bars-wrapper");
    if (!wrapper) return 0;
    const wrapRect = wrapper.getBoundingClientRect();
    const axisY = wrapRect.top + wrapRect.height / 2;
    const halfHeight = wrapRect.height / 2;
    let raw = ((axisY - clientY) / halfHeight) * 100;
    return Math.max(-100, Math.min(100, raw));
  };

  const commitManualValue = (section, barIdx, raw) => {
    const num = parseFloat(raw);
    if (isNaN(num)) { setEditingBar(null); setEditingValue(""); return; }
    const clamped = Math.max(-100, Math.min(100, Math.round(num)));
    const setter = getSetter(section);
    setter((prev) => {
      const next = [...prev];
      next[barIdx] = { ...next[barIdx], value: clamped };
      return next;
    });
    markDirty();
    setEditingBar(null);
    setEditingValue("");
    setTimeout(() => saveNow(), 0);
  };

  const handlePointerDown = (e, section, barIdx) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "BUTTON") return;

    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      e.stopPropagation();
      const bars = getBars(section);
      setEditingBar(`${section}-${barIdx}`);
      setEditingValue(String(bars[barIdx].value));
      return;
    }

    e.preventDefault();
    dragRef.current = { active: true, section, barIdx, el: e.currentTarget };
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const val = Math.round(clientYToValue(clientY, e.currentTarget));
    const setter = getSetter(section);
    setter((prev) => {
      const next = [...prev];
      next[barIdx] = { ...next[barIdx], value: val };
      return next;
    });
    markDirty();
  };

  useEffect(() => {
    const handleMove = (e) => {
      if (!dragRef.current.active) return;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const val = Math.round(clientYToValue(clientY, dragRef.current.el));
      const setter = getSetter(dragRef.current.section);
      setter((prev) => {
        const next = [...prev];
        next[dragRef.current.barIdx] = { ...next[dragRef.current.barIdx], value: val };
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

  const addBar = (section) => {
    const setter = getSetter(section);
    setter((prev) => [...prev, makeBar()]);
    markDirty();
  };
  const removeBar = (section, idx) => {
    const setter = getSetter(section);
    setter((prev) => {
      if (prev.length <= 1) return prev;
      const next = [...prev];
      next.splice(idx, 1);
      return next;
    });
    markDirty();
  };

  const updateBarField = (section, idx, field, value) => {
    const setter = getSetter(section);
    setter((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
    markDirty();
  };

  const renderBar = (bar, idx, section, color) => {
    const val = bar.value;
    const pct = scaledPercent(val);
    const isPositive = val >= 0;
    const editKey = `${section}-${idx}`;
    const isEditing = editingBar === editKey;

    return (
      <div
        key={editKey}
        className="bc-bar-column"
        onMouseDown={(e) => handlePointerDown(e, section, idx)}
        onTouchStart={(e) => handlePointerDown(e, section, idx)}
        style={{ cursor: "ns-resize" }}
      >
        {/* Label + subscript — positioned directly above the bar column */}
        <div className="bc-label-container" onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
          <div className="bc-label-group">
            <input
              type="text"
              className="bc-label-main"
              value={bar.label}
              onChange={(e) => updateBarField(section, idx, "label", e.target.value)}
              onBlur={saveNow}
              placeholder="K"
              style={{ borderColor: color.label }}
            />
            <input
              type="text"
              className="bc-label-sub"
              value={bar.subscript}
              onChange={(e) => updateBarField(section, idx, "subscript", e.target.value)}
              onBlur={saveNow}
              placeholder="sub"
              style={{ borderColor: color.label }}
            />
          </div>
          {getBars(section).length > 1 && (
            <button
              className="bc-remove-bar"
              onClick={(e) => { e.stopPropagation(); removeBar(section, idx); }}
              onMouseDown={(e) => e.stopPropagation()}
              title="Remove this bar"
            >
              &times;
            </button>
          )}
        </div>

        {/* The bar itself */}
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
        >
          {/* Value number inside the bar */}
          {val !== 0 && !isEditing && (
            <span className="bc-bar-value" style={{ color: color.valueText }}>
              {val}
            </span>
          )}
        </div>

        {/* Manual value input overlay */}
        {isEditing && (
          <div className="bc-value-input-container">
            <input
              type="number"
              className="bc-value-input"
              value={editingValue}
              onChange={(e) => setEditingValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitManualValue(section, idx, editingValue);
                if (e.key === "Escape") { setEditingBar(null); setEditingValue(""); }
              }}
              onBlur={() => commitManualValue(section, idx, editingValue)}
              autoFocus
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </div>
    );
  };

  const gridLines = Array.from({ length: 11 }, (_, i) => (
    <div key={i} className="bc-grid-line" style={{ top: `${i * 10}%` }} />
  ));

  const renderSection = (bars, section, color, headerContent, sectionClass, flexVal) => (
    <div
      className={`bc-section ${sectionClass}`}
      data-section={section}
      style={{
        backgroundColor: color.bg,
        flex: flexVal,
        ...(section === "delta"
          ? { borderLeft: `6px solid ${color.divider}`, borderRight: `6px solid ${color.divider}` }
          : {}),
      }}
    >
      {gridLines}
      <div className="bc-axis-line" />
      <div className="bc-header-container">
        {headerContent}
        {/* Add bar button — in the header row */}
        {bars.length < 6 && (
          <button
            className="bc-add-bar"
            onClick={() => addBar(section)}
            title="Add a bar"
          >
            +
          </button>
        )}
      </div>
      <div className="bc-bars-wrapper">
        {bars.map((bar, i) => renderBar(bar, i, section, color))}
      </div>
    </div>
  );

  return (
    <div className="bar-chart-block" ref={containerRef}>
      {block.title && <div className="bc-title">{block.title}</div>}

      <div className="bc-chart-container" style={{ userSelect: "none" }}>
        {renderSection(
          initialBars, "initial", COLORS.initial,
          <div className="bc-header-box" style={{ backgroundColor: COLORS.initial.header }}>
            {block.initialLabel || "Initial State"}
          </div>,
          "bc-section-initial", 4
        )}

        {renderSection(
          deltaBars, "delta", COLORS.delta,
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
          </div>,
          "bc-section-delta", 1.5
        )}

        {renderSection(
          finalBars, "final", COLORS.final,
          <div className="bc-header-box bc-header-final" style={{ backgroundColor: COLORS.final.header }}>
            {block.finalLabel || "Final State"}
          </div>,
          "bc-section-final", 4
        )}
      </div>

      <div className="bc-hint">
        Drag bars up or down &bull; Ctrl+click (&#8984;+click on Mac) to type a value &bull; Click + to add bars
      </div>
    </div>
  );
}
