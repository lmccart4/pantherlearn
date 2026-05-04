// src/components/blocks/BarChartBlock.jsx
// Interactive physics energy bar chart with auto-scaling Y-axis.
// Three sections: Initial State (green), Delta (blue, single bar), Final State (red).
// Students drag bars up/down; tallest bar auto-scales to fill the chart area.
// Ctrl/Cmd+click a bar to type an exact value. Each bar has label + subscript.
// Students can dynamically add/remove bars in initial/final sections.
// Values are unclamped — any number is allowed; the Y-axis rescales dynamically.
// Labels rendered with KaTeX for proper math typesetting (K_{E,i} etc.).

import { useState, useRef, useCallback, useEffect } from "react";
import useAutoSave from "../../hooks/useAutoSave.jsx";
import "./BarChartBlock.css";

let katexModule = null;
const loadKatex = () => {
  if (katexModule) return Promise.resolve(katexModule);
  return Promise.all([
    import("katex"),
    import("katex/dist/katex.min.css"),
  ]).then(([mod]) => {
    katexModule = mod.default;
    return katexModule;
  });
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
  const [editingLabel, setEditingLabel] = useState(null);
  const hydrated = useRef(false);

  useEffect(() => {
    const saved = (studentData || {})[block.id];
    if (!saved) {
      if (hydrated.current && (!studentData || Object.keys(studentData).length === 0)) {
        setInitialBars(defaultSection(defaultCount));
        setDeltaBars(defaultSection(1));
        setFinalBars(defaultSection(defaultCount));
        setDeltaLabel("");
        hydrated.current = false;
      }
      return;
    }
    if (hydrated.current) return;
    hydrated.current = true;
    if (saved.initialBars) setInitialBars(saved.initialBars);
    if (saved.deltaBars) setDeltaBars(saved.deltaBars);
    if (saved.finalBars) setFinalBars(saved.finalBars);
    if (saved.deltaLabel !== undefined) setDeltaLabel(saved.deltaLabel);
  }, [studentData, block.id, defaultCount]);

  const [, setKatexReady] = useState(!!katexModule);
  const containerRef = useRef(null);
  const dragRef = useRef({ active: false, section: null, barIdx: null, el: null });

  useEffect(() => {
    if (!katexModule) loadKatex().then(() => setKatexReady(true));
  }, []);
  const initialRef = useRef(initialBars);
  const deltaRef = useRef(deltaBars);
  const finalRef = useRef(finalBars);
  initialRef.current = initialBars;
  deltaRef.current = deltaBars;
  finalRef.current = finalBars;

  const performSave = useCallback(() => {
    if (!onAnswer) return;
    const hasData = initialRef.current.some(b => b.value !== 0) || deltaRef.current.some(b => b.value !== 0) || finalRef.current.some(b => b.value !== 0);
    onAnswer(block.id, {
      initialBars: initialRef.current,
      deltaBars: deltaRef.current,
      finalBars: finalRef.current,
      deltaLabel,
      submitted: hasData,
      writtenScore: hasData ? 1 : 0,
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
  const scaledPercent = (rawValue) => (Math.abs(rawValue) / maxAbs) * 42;

  const getSetter = (s) => (s === "initial" ? setInitialBars : s === "delta" ? setDeltaBars : setFinalBars);
  const getBars = (s) => (s === "initial" ? initialBars : s === "delta" ? deltaBars : finalBars);

  const clientYToValue = (clientY, barColEl) => {
    const area = barColEl.closest(".bc-chart-area");
    if (!area) return 0;
    const rect = area.getBoundingClientRect();
    const axisY = rect.top + rect.height / 2;
    const halfH = rect.height / 2;
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

  const renderKatex = (label, subscript) => {
    if (!label && !subscript) return null;
    let tex = label || "\\;";
    if (subscript) tex += `_{${subscript}}`;
    if (!katexModule) return { __html: label + (subscript ? `<sub>${subscript}</sub>` : "") };
    try {
      return { __html: katexModule.renderToString(tex, { throwOnError: false, displayMode: false }) };
    } catch {
      return { __html: label + (subscript ? `<sub>${subscript}</sub>` : "") };
    }
  };

  const renderLabelRow = (bars, section, canRemove) => (
    <div className="bc-label-row">
      {bars.map((bar, idx) => {
        const editKey = `${section}-${idx}`;
        const isEditing = editingLabel === editKey;
        const hasContent = bar.label || bar.subscript;

        return (
          <div key={editKey} className="bc-label-cell" onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
            {isEditing ? (
              <div className="bc-label-edit">
                <input type="text" className="bc-label-input" value={bar.label}
                  onChange={(e) => updateBarField(section, idx, "label", e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { setEditingLabel(null); saveNow(); } }}
                  placeholder="label" autoFocus />
                <input type="text" className="bc-label-input bc-label-input-sub" value={bar.subscript}
                  onChange={(e) => updateBarField(section, idx, "subscript", e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { setEditingLabel(null); saveNow(); } }}
                  onBlur={() => { setEditingLabel(null); saveNow(); }}
                  placeholder="sub" />
              </div>
            ) : (
              <div className="bc-label-display" onClick={() => setEditingLabel(editKey)}>
                {hasContent ? (
                  <span dangerouslySetInnerHTML={renderKatex(bar.label, bar.subscript)} />
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

  const renderBarCol = (bar, idx, section) => {
    const val = bar.value;
    const pct = scaledPercent(val);
    const isPos = val >= 0;
    const editKey = `${section}-${idx}`;
    const isEditing = editingBar === editKey;
    const dirCls = isPos ? "is-positive" : "is-negative";

    return (
      <div key={editKey} className="bc-bar-col"
        onMouseDown={(e) => handlePointerDown(e, section, idx)}
        onTouchStart={(e) => handlePointerDown(e, section, idx)}
      >
        <div className={`bc-bar ${dirCls}`} style={{ height: `${pct}%` }}>
          {val !== 0 && !isEditing && (
            <span className="bc-bar-value">
              {Number.isInteger(val) ? val : parseFloat(val.toFixed(4))}
            </span>
          )}
        </div>

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

  const renderSection = (bars, section, headerContent, sectionClass, showAddBtn) => (
    <div className={`bc-section bc-section--${section} ${sectionClass}`}>
      <div className="bc-header-row">
        {headerContent}
        {showAddBtn && bars.length < 6 && (
          <button className="bc-add-bar" onClick={() => addBar(section)} title="Add a bar">+</button>
        )}
      </div>

      {renderLabelRow(bars, section, showAddBtn)}

      <div className="bc-chart-area" data-section={section}>
        {Array.from({ length: 11 }, (_, i) => (
          <div key={i} className="bc-grid-line" style={{ top: `${i * 10}%` }} />
        ))}
        <div className="bc-axis-line" />

        <div className="bc-bar-row">
          {bars.map((bar, i) => renderBarCol(bar, i, section))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bar-chart-block" ref={containerRef}>
      {block.title && <div className="bc-title">{block.title}</div>}

      <div className="bc-container">
        {renderSection(initialBars, "initial",
          <div className="bc-header-box">{block.initialLabel || "Initial State"}</div>,
          "bc-section-initial", true)}

        {renderSection(deltaBars, "delta",
          <div className="bc-delta-header-group">
            <span className="bc-delta-symbol">&Delta;</span>
            <input type="text" className="bc-delta-input" value={deltaLabel}
              onChange={(e) => { setDeltaLabel(e.target.value); markDirty(); }}
              onBlur={saveNow} placeholder="Label" />
          </div>,
          "bc-section-delta", false)}

        {renderSection(finalBars, "final",
          <div className="bc-header-box bc-header-final">{block.finalLabel || "Final State"}</div>,
          "bc-section-final", true)}
      </div>

      <div className="bc-hint">
        Drag bars up or down &bull; Ctrl+click (&#8984;+click on Mac) to type a value
      </div>
    </div>
  );
}
