// src/components/blocks/DataTableBlock.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslatedText } from "../../hooks/useTranslatedText.jsx";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";
import useAutoSave from "../../hooks/useAutoSave.jsx";

/*
  Block JSON shape (momentum preset):
  {
    id: "dt1",
    type: "data_table",
    preset: "momentum",       // future: "kinematics", "energy", "custom"
    title: "Momentum Data Table",
    trials: 1,                // number of before/after pairs (default 1)
  }

  For future "custom" preset:
  {
    type: "data_table",
    preset: "custom",
    title: "...",
    columns: [
      { key: "mass", label: "Mass", unit: "kg", input: true },
      { key: "accel", label: "Acceleration", unit: "m/s²", input: true },
      { key: "force", label: "Force", unit: "N", formula: "mass * accel" },
    ],
    rows: [
      { key: "obj1", label: "Object 1" },
      { key: "obj2", label: "Object 2" },
    ],
    summaryRows: [
      { key: "total", label: "System Total", formula: "sum" },
    ]
  }
*/

// --- Momentum preset definition ---
const ALL_MOMENTUM_COLUMNS = [
  { key: "mass", label: "Mass", unit: "kg", sublabel: "m", input: true, width: 110, group: "input" },
  { key: "speed", label: "Speed", unit: "m/s", sublabel: "|v|", input: true, width: 110, group: "scalar" },
  { key: "velocity", label: "Velocity", unit: "m/s", sublabel: "v", input: true, width: 120, group: "vector" },
  { key: "scalar", label: "Scalar Cand.", sublabel: "m|v|", input: false, width: 110, group: "scalar" },
  { key: "vector", label: "Vector Cand.", sublabel: "mv", input: false, width: 110, group: "vector" },
];

function getMomentumColumns(block) {
  const showScalar = block.showScalar !== false;
  const showVector = block.showVector !== false;
  const overrides = block.columnOverrides || {};

  return ALL_MOMENTUM_COLUMNS
    .filter((col) => {
      if (col.group === "scalar" && !showScalar) return false;
      if (col.group === "vector" && !showVector) return false;
      return true;
    })
    .map((col) => {
      const ov = overrides[col.key] || {};
      const label = ov.label || col.label;
      const unit = ov.unit || col.unit || "";
      const sublabel = ov.sublabel !== undefined ? ov.sublabel : col.sublabel;
      const fullLabel = unit ? `${label} (${unit})` : label;
      return { ...col, label: fullLabel, sublabel };
    });
}

function buildMomentumRows(trials, block) {
  const n = trials || 1;
  const labelA = block.labelA || "Cart A";
  const labelB = block.labelB || "Cart B";
  const sections = [];
  for (let t = 0; t < n; t++) {
    const trialLabel = n > 1 ? ` (Trial ${t + 1})` : "";
    sections.push({
      rows: [
        { key: `a_before_${t}`, label: `${labelA} (Before)${trialLabel}` },
        { key: `b_before_${t}`, label: `${labelB} (Before)${trialLabel}` },
      ],
      summary: { key: `total_before_${t}`, label: "System Total (Before):" },
      phase: "before",
    });
    sections.push({
      rows: [
        { key: `a_after_${t}`, label: `${labelA} (After)${trialLabel}` },
        { key: `b_after_${t}`, label: `${labelB} (After)${trialLabel}` },
      ],
      summary: { key: `total_after_${t}`, label: "System Total (After):" },
      phase: "after",
    });
  }
  return sections;
}

function computeMomentum(rowData) {
  const m = parseFloat(rowData?.mass);
  const s = parseFloat(rowData?.speed);
  const v = parseFloat(rowData?.velocity);
  return {
    scalar: isFinite(m) && isFinite(s) ? Math.round(m * Math.abs(s) * 10000) / 10000 : null,
    vector: isFinite(m) && isFinite(v) ? Math.round(m * v * 10000) / 10000 : null,
  };
}

function sumColumn(data, rowKeys, col) {
  let total = 0;
  let hasValue = false;
  for (const key of rowKeys) {
    const val = col === "scalar" || col === "vector"
      ? computeMomentum(data[key])?.[col]
      : parseFloat(data[key]?.[col]);
    if (val !== null && isFinite(val)) {
      total += val;
      hasValue = true;
    }
  }
  return hasValue ? Math.round(total * 10000) / 10000 : null;
}

// --- Styles ---
const styles = {
  wrapper: {
    margin: "24px 0",
    borderRadius: "var(--radius, 12px)",
    border: "1px solid var(--border, #2a2f3d)",
    overflow: "hidden",
    background: "var(--surface, #1a1e2e)",
  },
  header: {
    padding: "14px 20px",
    background: "var(--surface-alt, #222738)",
    borderBottom: "1px solid var(--border, #2a2f3d)",
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: 600,
    color: "var(--text, #e2e8f0)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  thRow: {
    background: "rgba(239, 68, 68, 0.12)",
    borderBottom: "2px solid rgba(239, 68, 68, 0.3)",
  },
  th: {
    padding: "12px 10px 6px",
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#f87171",
    textAlign: "center",
    verticalAlign: "bottom",
  },
  thSub: {
    display: "block",
    fontSize: 13,
    fontStyle: "italic",
    fontWeight: 400,
    marginTop: 2,
    letterSpacing: 0,
    textTransform: "none",
    color: "#fca5a5",
  },
  objectTh: {
    padding: "12px 10px 6px",
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#f87171",
    textAlign: "left",
    verticalAlign: "bottom",
    width: 160,
  },
  row: {
    borderBottom: "1px solid var(--border, #2a2f3d)",
  },
  rowAlt: {
    borderBottom: "1px solid var(--border, #2a2f3d)",
    background: "rgba(255,255,255,0.015)",
  },
  summaryRow: {
    background: "rgba(6, 182, 212, 0.06)",
    borderBottom: "2px solid var(--border, #2a2f3d)",
    borderTop: "1px solid rgba(6, 182, 212, 0.2)",
  },
  spacerRow: {
    height: 18,
    background: "transparent",
    borderBottom: "none",
  },
  td: {
    padding: "10px 10px",
    textAlign: "center",
    verticalAlign: "middle",
  },
  labelCell: {
    padding: "10px 16px",
    fontWeight: 600,
    fontSize: 14,
    color: "var(--text, #e2e8f0)",
    textAlign: "left",
    whiteSpace: "nowrap",
  },
  summaryLabelCell: {
    padding: "10px 16px",
    fontWeight: 700,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "var(--cyan, #06b6d4)",
    textAlign: "right",
    whiteSpace: "nowrap",
  },
  input: {
    width: 80,
    padding: "8px 10px",
    borderRadius: 8,
    border: "1px solid var(--border, #2a2f3d)",
    background: "var(--bg, #0f1219)",
    color: "var(--text, #e2e8f0)",
    fontSize: 15,
    textAlign: "center",
    fontFamily: "var(--font-body, system-ui)",
    outline: "none",
    boxSizing: "border-box",
  },
  computed: {
    fontSize: 15,
    fontWeight: 600,
    color: "var(--text, #e2e8f0)",
  },
  dash: {
    fontSize: 15,
    color: "var(--text3, #718096)",
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: 700,
    color: "var(--cyan, #06b6d4)",
  },
  footer: {
    padding: "12px 20px",
    borderTop: "1px solid var(--border, #2a2f3d)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  saveBtn: {
    padding: "8px 20px",
    borderRadius: 8,
    border: "none",
    background: "linear-gradient(135deg, var(--cyan, #06b6d4), var(--blue, #3b82f6))",
    color: "white",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
  savedTag: {
    fontSize: 11,
    color: "var(--green, #10b981)",
    fontWeight: 500,
  },
};

export default function DataTableBlock({ block, lessonId, courseId }) {
  const { user } = useAuth();
  const translatedTitle = useTranslatedText(block.title);
  const [data, setData] = useState({});

  // These must be declared before performSave since it references them
  const sections = useMemo(() => buildMomentumRows(block.trials || 1, block), [block.trials, block.labelA, block.labelB]);
  const columns = useMemo(() => getMomentumColumns(block), [block.showScalar, block.showVector, block.columnOverrides]);
  const summaryColKeys = columns.filter((c) => !c.input).map((c) => c.key);
  const inputColCount = columns.filter((c) => c.input).length;

  // Auto-save function
  const performSave = useCallback(async () => {
    if (!user || !db || !lessonId || !courseId) return;
    const showScalar = block.showScalar !== false;
    const showVector = block.showVector !== false;
    const allRows = {};
    sections.forEach((section) => {
      section.rows.forEach((row) => {
        const rd = data[row.key] || {};
        const comp = computeMomentum(rd);
        const stored = { ...rd };
        if (showScalar) stored.scalar = comp.scalar;
        if (showVector) stored.vector = comp.vector;
        allRows[row.key] = stored;
      });
      const rowKeys = section.rows.map((r) => r.key);
      const summaryData = {};
      if (showScalar) summaryData.scalar = sumColumn(data, rowKeys, "scalar");
      if (showVector) summaryData.vector = sumColumn(data, rowKeys, "vector");
      allRows[section.summary.key] = summaryData;
    });

    const ref = doc(db, "courses", courseId, "lessons", lessonId, "responses", user.uid, "blocks", block.id);
    await setDoc(ref, {
      type: "data_table",
      preset: block.preset || "momentum",
      blockId: block.id,
      tableData: data,
      computedData: allRows,
      studentId: user.uid,
      studentName: user.displayName || "Unknown",
      submittedAt: serverTimestamp(),
    }, { merge: true });
  }, [user, lessonId, courseId, block, data, sections]);

  const { markDirty, saveNow, lastSaved, saving } = useAutoSave(performSave);

  // Load saved data
  useEffect(() => {
    if (!user || !db || !lessonId || !courseId) return;
    const load = async () => {
      try {
        const ref = doc(db, "courses", courseId, "lessons", lessonId, "responses", user.uid, "blocks", block.id);
        const snap = await getDoc(ref);
        if (snap.exists() && snap.data().tableData) {
          setData(snap.data().tableData);
        }
      } catch (e) {
        console.warn("Failed to load data table:", e);
      }
    };
    load();
  }, [user, lessonId, courseId, block.id]);

  const handleInput = useCallback((rowKey, colKey, value) => {
    setData((prev) => ({
      ...prev,
      [rowKey]: { ...(prev[rowKey] || {}), [colKey]: value },
    }));
    markDirty();
  }, [markDirty]);

  const renderValue = (val) => {
    if (val === null || val === undefined) return <span style={styles.dash}>–</span>;
    return <span style={styles.computed}>{val}</span>;
  };

  const renderSummaryValue = (val) => {
    if (val === null || val === undefined) return <span style={styles.dash}>–</span>;
    return <span style={styles.summaryValue}>{val}</span>;
  };

  return (
    <div style={styles.wrapper}>
      {/* Header */}
      <div style={styles.header}>
        <span style={{ fontSize: 20 }}>📊</span>
        <span style={styles.title}>{translatedTitle || "Data Table"}</span>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thRow}>
              <th style={styles.objectTh}>Object</th>
              {columns.map((col) => (
                <th key={col.key} style={{ ...styles.th, width: col.width }}>
                  {col.label}
                  <span style={styles.thSub}>{col.sublabel}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sections.map((section, si) => (
              <React.Fragment key={si}>
                {/* Spacer between before/after groups */}
                {si > 0 && (
                  <tr><td colSpan={1 + columns.length} style={styles.spacerRow} /></tr>
                )}

                {/* Data rows */}
                {section.rows.map((row, ri) => {
                  const rd = data[row.key] || {};
                  const comp = computeMomentum(rd);
                  return (
                    <tr key={row.key} style={ri % 2 === 0 ? styles.row : styles.rowAlt}>
                      <td style={styles.labelCell}>{row.label}</td>
                      {columns.map((col) => (
                        <td key={col.key} style={styles.td}>
                          {col.input ? (
                            <input
                              type="number"
                              step="any"
                              value={rd[col.key] || ""}
                              onChange={(e) => handleInput(row.key, col.key, e.target.value)}
                              onBlur={saveNow}
                              style={styles.input}
                              onFocus={(e) => e.target.style.borderColor = "#06b6d4"}
                            />
                          ) : (
                            renderValue(comp[col.key])
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}

                {/* Summary row */}
                <tr style={styles.summaryRow}>
                  <td colSpan={1 + inputColCount} style={styles.summaryLabelCell}>
                    {section.summary.label}
                  </td>
                  {summaryColKeys.map((colKey) => (
                    <td key={colKey} style={styles.td}>
                      {renderSummaryValue(sumColumn(data, section.rows.map((r) => r.key), colKey))}
                    </td>
                  ))}
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer with save status */}
      <div style={styles.footer}>
        <button onClick={saveNow} style={styles.saveBtn}
          disabled={saving}
          onMouseOver={(e) => e.target.style.opacity = "0.9"}
          onMouseOut={(e) => e.target.style.opacity = "1"}>
          {saving ? "Saving..." : "Save Data"}
        </button>
        {lastSaved && (
          <span style={styles.savedTag}>
            ✓ Auto-saved {lastSaved.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
          </span>
        )}
      </div>
    </div>
  );
}
