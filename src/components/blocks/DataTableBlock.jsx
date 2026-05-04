// src/components/blocks/DataTableBlock.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslatedText } from "../../hooks/useTranslatedText.jsx";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";
import useAutoSave from "../../hooks/useAutoSave.jsx";
import "./DataTableBlock.css";

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

export default function DataTableBlock({ block, lessonId, courseId, studentData = {}, onAnswer }) {
  const { user } = useAuth();
  const translatedTitle = useTranslatedText(block.title);
  const [data, setData] = useState({});

  const sections = useMemo(() => buildMomentumRows(block.trials || 1, block), [block.trials, block.labelA, block.labelB]);
  const columns = useMemo(() => getMomentumColumns(block), [block.showScalar, block.showVector, block.columnOverrides]);
  const summaryColKeys = columns.filter((c) => !c.input).map((c) => c.key);
  const inputColCount = columns.filter((c) => c.input).length;

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

    if (onAnswer) {
      const filledCells = Object.values(data).reduce(
        (acc, row) => acc + Object.values(row || {}).filter((v) => v !== "" && v !== undefined).length, 0
      );
      onAnswer(block.id, {
        submitted: filledCells > 0,
        answer: { tableData: data, computedData: allRows },
        filledCells,
        writtenScore: filledCells > 0 ? 1 : 0,
        savedAt: new Date().toISOString(),
      });
    }
  }, [user, lessonId, courseId, block, data, sections, onAnswer]);

  const { saveNow, lastSaved, saveError, markDirty } = useAutoSave(performSave);

  useEffect(() => {
    if (!user || !db || !lessonId || !courseId) return;
    const load = async () => {
      try {
        const ref = doc(db, "courses", courseId, "lessons", lessonId, "responses", user.uid, "blocks", block.id);
        const snap = await getDoc(ref);
        if (snap.exists() && snap.data().tableData) {
          setData(snap.data().tableData);
          return;
        }
        const progressData = studentData?.[block.id];
        if (progressData?.answer?.tableData) {
          setData(progressData.answer.tableData);
        }
      } catch (e) {
        console.warn("Failed to load data table:", e);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, lessonId, courseId, block.id]);

  const handleInput = useCallback((rowKey, colKey, value) => {
    setData((prev) => ({
      ...prev,
      [rowKey]: { ...(prev[rowKey] || {}), [colKey]: value },
    }));
    markDirty();
  }, [markDirty]);

  const renderValue = (val) => {
    if (val === null || val === undefined) return <span className="dt-dash">–</span>;
    return <span className="dt-computed">{val}</span>;
  };

  const renderSummaryValue = (val) => {
    if (val === null || val === undefined) return <span className="dt-dash">–</span>;
    return <span className="dt-summary-value">{val}</span>;
  };

  return (
    <div className="dt-wrapper">
      <div className="dt-header">
        <span className="dt-header-icon" aria-hidden>📊</span>
        <span className="dt-title">{translatedTitle || "Data Table"}</span>
      </div>

      <div className="dt-scroll">
        <table className="dt-table">
          <thead>
            <tr className="dt-thead-row">
              <th className="dt-th dt-th-object">Object</th>
              {columns.map((col) => (
                <th key={col.key} className="dt-th" style={{ width: col.width }}>
                  {col.label}
                  <span className="dt-th-sub">{col.sublabel}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sections.map((section, si) => (
              <React.Fragment key={si}>
                {si > 0 && (
                  <tr><td colSpan={1 + columns.length} className="dt-spacer" /></tr>
                )}

                {section.rows.map((row, ri) => {
                  const rd = data[row.key] || {};
                  const comp = computeMomentum(rd);
                  return (
                    <tr key={row.key} className={`dt-row ${ri % 2 === 0 ? "" : "is-alt"}`}>
                      <td className="dt-label-cell">{row.label}</td>
                      {columns.map((col) => (
                        <td key={col.key} className="dt-td">
                          {col.input ? (
                            <input
                              type="number"
                              step="any"
                              value={rd[col.key] || ""}
                              onChange={(e) => handleInput(row.key, col.key, e.target.value)}
                              onBlur={saveNow}
                              className="dt-input"
                            />
                          ) : (
                            renderValue(comp[col.key])
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}

                <tr className="dt-summary-row">
                  <td colSpan={1 + inputColCount} className="dt-summary-label-cell">
                    {section.summary.label}
                  </td>
                  {summaryColKeys.map((colKey) => (
                    <td key={colKey} className="dt-td">
                      {renderSummaryValue(sumColumn(data, section.rows.map((r) => r.key), colKey))}
                    </td>
                  ))}
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {(lastSaved || saveError) && (
        <div className="dt-footer">
          {saveError ? (
            <span className="dt-save-error">{saveError}</span>
          ) : (
            <span className="dt-saved">
              ✓ Auto-saved {lastSaved.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
