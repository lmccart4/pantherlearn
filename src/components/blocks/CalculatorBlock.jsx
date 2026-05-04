// src/components/blocks/CalculatorBlock.jsx
import { useState, useEffect, useCallback } from "react";
import { useTranslatedText } from "../../hooks/useTranslatedText.jsx";
import { renderMarkdown } from "../../lib/utils";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";
import useAutoSave from "../../hooks/useAutoSave.jsx";
import "./CalculatorBlock.css";

export default function CalculatorBlock({ block, lessonId, courseId }) {
  const { user } = useAuth();
  const translatedTitle = useTranslatedText(block.title);

  const [values, setValues] = useState(() => {
    const init = {};
    (block.inputs || []).forEach((inp) => {
      init[inp.name] = "";
    });
    return init;
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

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

  const { markDirty, saveNow, lastSaved } = useAutoSave(performSave);

  useEffect(() => {
    if (!user || !db || !lessonId || !courseId) return;
    const loadSaved = async () => {
      try {
        const ref = doc(db, "courses", courseId, "lessons", lessonId, "responses", user.uid, "blocks", block.id);
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

  const SAFE_FUNCTIONS = { sqrt: Math.sqrt, abs: Math.abs, pow: Math.pow, round: Math.round, floor: Math.floor, ceil: Math.ceil, sin: Math.sin, cos: Math.cos, tan: Math.tan, log: Math.log, PI: Math.PI };
  const evaluate = (formula, vals) => {
    let expr = formula.replace(/Math\./g, "");
    for (const [name, val] of Object.entries(vals)) {
      const num = parseFloat(val);
      if (isNaN(num)) return null;
      expr = expr.replace(new RegExp(`\\b${name}\\b`, "g"), `(${num})`);
    }

    const tokens = [];
    let i = 0;
    while (i < expr.length) {
      if (/\s/.test(expr[i])) { i++; continue; }
      if ("+-*/()^,".includes(expr[i])) { tokens.push(expr[i]); i++; continue; }
      if (/[\d.]/.test(expr[i])) {
        let num = "";
        while (i < expr.length && /[\d.]/.test(expr[i])) num += expr[i++];
        const parsed = parseFloat(num);
        if (isNaN(parsed)) return null;
        tokens.push(parsed);
        continue;
      }
      if (/[a-zA-Z_]/.test(expr[i])) {
        let name = "";
        while (i < expr.length && /[a-zA-Z_]/.test(expr[i])) name += expr[i++];
        if (name in SAFE_FUNCTIONS) { tokens.push({ fn: name }); continue; }
        return null;
      }
      return null;
    }

    let pos = 0;
    const peek = () => tokens[pos];
    const next = () => tokens[pos++];

    function parseExpr() {
      let val = parseTerm();
      if (val === null) return null;
      while (peek() === "+" || peek() === "-") {
        const op = next();
        const right = parseTerm();
        if (right === null) return null;
        val = op === "+" ? val + right : val - right;
      }
      return val;
    }

    function parseTerm() {
      let val = parseUnary();
      if (val === null) return null;
      while (peek() === "*" || peek() === "/") {
        const op = next();
        const right = parseUnary();
        if (right === null) return null;
        val = op === "*" ? val * right : val / right;
      }
      return val;
    }

    function parseUnary() {
      if (peek() === "-") { next(); const val = parsePower(); return val === null ? null : -val; }
      if (peek() === "+") { next(); return parsePower(); }
      return parsePower();
    }

    function parsePower() {
      let val = parsePrimary();
      if (val === null) return null;
      if (peek() === "^") { next(); const exp = parseUnary(); if (exp === null) return null; val = Math.pow(val, exp); }
      return val;
    }

    function parsePrimary() {
      if (peek() && typeof peek() === "object" && peek().fn) {
        const fnName = next().fn;
        const fn = SAFE_FUNCTIONS[fnName];
        if (typeof fn === "number") return fn;
        if (peek() !== "(") return null;
        next();
        const arg1 = parseExpr();
        if (arg1 === null) return null;
        if (peek() === ",") {
          next();
          const arg2 = parseExpr();
          if (arg2 === null || peek() !== ")") return null;
          next();
          return fn(arg1, arg2);
        }
        if (peek() !== ")") return null;
        next();
        return fn(arg1);
      }
      if (peek() === "(") {
        next();
        const val = parseExpr();
        if (val === null || peek() !== ")") return null;
        next();
        return val;
      }
      if (typeof peek() === "number") return next();
      return null;
    }

    try {
      const res = parseExpr();
      if (res === null || pos !== tokens.length) return null;
      if (!isFinite(res)) return null;
      return Math.round(res * 10000) / 10000;
    } catch {
      return null;
    }
  };

  const handleCalculate = async () => {
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

    markDirty();
    setTimeout(() => saveNow(), 100);
  };

  const formatResult = (val) => {
    if (val === null || val === undefined) return "";
    if (Number.isInteger(val)) return val.toString();
    return val.toFixed(block.output?.decimals ?? 2);
  };

  return (
    <div className="calc-block">
      <div className="calc-header">
        <span className="calc-icon" aria-hidden>🧮</span>
        <span className="calc-title">{translatedTitle || "Calculator"}</span>
      </div>

      <div className="calc-body">
        {block.description && (
          <p className="calc-desc">
            <span dangerouslySetInnerHTML={{ __html: renderMarkdown(block.description) }} />
          </p>
        )}

        <div className="calc-inputs">
          {(block.inputs || []).map((inp) => (
            <div key={inp.name} className="calc-input-cell">
              <label className="calc-input-label">
                {inp.label} {inp.unit && <span className="calc-input-unit">({inp.unit})</span>}
              </label>
              <input
                type="number"
                step="any"
                value={values[inp.name]}
                onChange={(e) => handleChange(inp.name, e.target.value)}
                placeholder={`Enter ${inp.label.toLowerCase()}`}
                className="calc-input"
                onBlur={saveNow}
              />
            </div>
          ))}
        </div>

        {block.showFormula && (
          <div className="calc-formula">
            Formula: {block.output?.label || "Result"} = {block.formula}
          </div>
        )}

        <button onClick={handleCalculate} className="calc-go">
          Calculate
        </button>

        {error && <div className="calc-error">{error}</div>}

        {result !== null && (
          <div className="calc-result">
            <span className="calc-result-label">{block.output?.label || "Result"}</span>
            <span className="calc-result-value">{formatResult(result)}</span>
            {block.output?.unit && (
              <span className="calc-result-unit">{block.output.unit}</span>
            )}
            {lastSaved && (
              <span className="calc-saved">
                ✓ Saved {lastSaved.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
