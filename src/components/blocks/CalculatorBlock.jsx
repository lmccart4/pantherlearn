// src/components/blocks/CalculatorBlock.jsx
import { useState, useEffect, useCallback } from "react";
import { useTranslatedText } from "../../hooks/useTranslatedText.jsx";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";
import useAutoSave from "../../hooks/useAutoSave.jsx";

export default function CalculatorBlock({ block, lessonId, courseId }) {
  const { user } = useAuth();
  const translatedTitle = useTranslatedText(block.title);

  // Initialize input values from block definition
  const [values, setValues] = useState(() => {
    const init = {};
    (block.inputs || []).forEach((inp) => {
      init[inp.name] = "";
    });
    return init;
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Auto-save function for inputs
  const performSave = useCallback(async () => {
    if (!user || !db || !lessonId || !courseId) return;
    const ref = doc(db, "courses", courseId, "lessons", lessonId, "responses", user.uid, "blocks", block.id);
    await setDoc(ref, {
      type: "calculator",
      blockId: block.id,
      inputs: values,
      formula: block.formula,
      result,
      studentId: user.uid,
      studentName: user.displayName || "Unknown",
      submittedAt: serverTimestamp(),
    }, { merge: true });
  }, [user, lessonId, courseId, block, values, result]);

  const { markDirty, saveNow, lastSaved, saving } = useAutoSave(performSave);

  // Load previously saved values if they exist
  useEffect(() => {
    if (!user || !db || !lessonId || !courseId) return;
    const loadSaved = async () => {
      try {
        const ref = doc(
          db,
          "courses", courseId,
          "lessons", lessonId,
          "responses", user.uid,
          "blocks", block.id
        );
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          if (data.inputs) setValues(data.inputs);
          if (data.result !== undefined) setResult(data.result);
        }
      } catch (e) {
        console.warn("Failed to load calculator data:", e);
      }
    };
    loadSaved();
  }, [user, lessonId, courseId, block.id]);

  const handleChange = (name, val) => {
    setValues((prev) => ({ ...prev, [name]: val }));
    setResult(null);
    setError(null);
    markDirty();
  };

  const evaluate = (formula, vals) => {
    // Simple safe evaluator for basic math: +, -, *, /
    // Replace variable names with their numeric values
    let expr = formula;
    for (const [name, val] of Object.entries(vals)) {
      const num = parseFloat(val);
      if (isNaN(num)) return null;
      // Replace all occurrences of the variable name with the number
      // Use word boundary to avoid partial replacements
      expr = expr.replace(new RegExp(`\\b${name}\\b`, "g"), `(${num})`);
    }

    // Only allow safe characters: digits, operators, parentheses, dots, spaces
    if (!/^[\d\s+\-*/().]+$/.test(expr)) return null;

    try {
      // eslint-disable-next-line no-eval
      const res = Function(`"use strict"; return (${expr})`)();
      if (!isFinite(res)) return null;
      return Math.round(res * 10000) / 10000; // Round to 4 decimal places
    } catch {
      return null;
    }
  };

  const handleCalculate = async () => {
    // Validate all inputs are filled
    const empty = (block.inputs || []).filter((inp) => values[inp.name] === "" || values[inp.name] === undefined);
    if (empty.length > 0) {
      setError(`Please fill in: ${empty.map((e) => e.label).join(", ")}`);
      return;
    }

    const res = evaluate(block.formula, values);
    if (res === null) {
      setError("Check your values — make sure they're all valid numbers.");
      return;
    }

    setResult(res);
    setError(null);

    // Save immediately after calculating
    markDirty();
    // Small delay so state updates, then save
    setTimeout(() => saveNow(), 100);
  };

  // Format result with appropriate decimal places
  const formatResult = (val) => {
    if (val === null || val === undefined) return "";
    if (Number.isInteger(val)) return val.toString();
    return val.toFixed(block.output?.decimals ?? 2);
  };

  return (
    <div className="calculator-block" style={{
      margin: "24px 0",
      borderRadius: "var(--radius, 12px)",
      border: "1px solid var(--border, #2a2f3d)",
      overflow: "hidden",
      background: "var(--surface, #1a1e2e)",
    }}>
      {/* Header */}
      <div style={{
        padding: "14px 20px",
        background: "var(--surface-alt, #222738)",
        borderBottom: "1px solid var(--border, #2a2f3d)",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}>
        <span style={{ fontSize: 20 }}>🧮</span>
        <span style={{
          fontSize: 15,
          fontWeight: 600,
          color: "var(--text, #e2e8f0)",
        }}>
          {translatedTitle || "Calculator"}
        </span>
      </div>

      {/* Inputs */}
      <div style={{ padding: "20px" }}>
        {block.description && (
          <p style={{
            fontSize: 13,
            color: "var(--text2, #a0aec0)",
            marginBottom: 16,
            lineHeight: 1.5,
          }}>
            {block.description}
          </p>
        )}

        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 20,
        }}>
          {(block.inputs || []).map((inp) => (
            <div key={inp.name} style={{
              flex: "1 1 180px",
              minWidth: 150,
            }}>
              <label style={{
                display: "block",
                fontSize: 12,
                fontWeight: 600,
                color: "var(--text2, #a0aec0)",
                marginBottom: 6,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}>
                {inp.label} {inp.unit && (
                  <span style={{
                    fontWeight: 400,
                    textTransform: "none",
                    color: "var(--text3, #718096)",
                  }}>
                    ({inp.unit})
                  </span>
                )}
              </label>
              <input
                type="number"
                step="any"
                value={values[inp.name]}
                onChange={(e) => handleChange(inp.name, e.target.value)}
                placeholder={`Enter ${inp.label.toLowerCase()}`}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: 8,
                  border: "1px solid var(--border, #2a2f3d)",
                  background: "var(--bg, #0f1219)",
                  color: "var(--text, #e2e8f0)",
                  fontSize: 16,
                  fontFamily: "var(--font-body, system-ui)",
                  outline: "none",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => e.target.style.borderColor = "var(--cyan, #06b6d4)"}
                onBlur={(e) => { e.target.style.borderColor = "var(--border, #2a2f3d)"; saveNow(); }}
              />
            </div>
          ))}
        </div>

        {/* Formula display (optional) */}
        {block.showFormula && (
          <div style={{
            padding: "10px 14px",
            borderRadius: 8,
            background: "var(--bg, #0f1219)",
            fontSize: 13,
            color: "var(--text3, #718096)",
            marginBottom: 16,
            fontFamily: "monospace",
          }}>
            Formula: {block.output?.label || "Result"} = {block.formula}
          </div>
        )}

        {/* Calculate button */}
        <button
          onClick={handleCalculate}
          style={{
            padding: "10px 24px",
            borderRadius: 8,
            border: "none",
            background: "linear-gradient(135deg, var(--cyan, #06b6d4), var(--blue, #3b82f6))",
            color: "white",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            transition: "opacity 0.15s, transform 0.15s",
          }}
          onMouseOver={(e) => { e.target.style.opacity = "0.9"; e.target.style.transform = "translateY(-1px)"; }}
          onMouseOut={(e) => { e.target.style.opacity = "1"; e.target.style.transform = "translateY(0)"; }}
        >
          Calculate
        </button>

        {/* Error */}
        {error && (
          <div style={{
            marginTop: 12,
            padding: "10px 14px",
            borderRadius: 8,
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#f87171",
            fontSize: 13,
          }}>
            {error}
          </div>
        )}

        {/* Result */}
        {result !== null && (
          <div style={{
            marginTop: 16,
            padding: "16px 20px",
            borderRadius: 10,
            background: "rgba(6, 182, 212, 0.08)",
            border: "1px solid rgba(6, 182, 212, 0.25)",
            display: "flex",
            alignItems: "baseline",
            gap: 10,
          }}>
            <span style={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--cyan, #06b6d4)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}>
              {block.output?.label || "Result"}
            </span>
            <span style={{
              fontSize: 28,
              fontWeight: 700,
              color: "var(--text, #e2e8f0)",
              fontFamily: "Georgia, serif",
            }}>
              {formatResult(result)}
            </span>
            {block.output?.unit && (
              <span style={{
                fontSize: 16,
                color: "var(--text2, #a0aec0)",
              }}>
                {block.output.unit}
              </span>
            )}
            {lastSaved && (
              <span style={{
                marginLeft: "auto",
                fontSize: 11,
                color: "var(--green, #10b981)",
                fontWeight: 500,
              }}>
                ✓ Saved {lastSaved.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
