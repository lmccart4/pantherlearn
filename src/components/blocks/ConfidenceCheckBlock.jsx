// src/components/blocks/ConfidenceCheckBlock.jsx
//
// Confidence Stars — a 1–5 self-rating "how sure do you feel right now?" primitive.
// Used in every lesson's Status Check and in the Mission Log close-out (OpenSciEd/Rober
// physics units). NOT graded — it's a formative signal for the teacher (group the
// 1–2★ students for re-teach, pair 4–5★ as explainers; high stars + low accuracy is its
// own flag). Persists server-side per persist-student-interaction-data.

import { useState, useEffect, useRef, useCallback } from "react";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useTranslation } from "../../contexts/TranslationContext";
import { renderMarkdown } from "../../lib/utils";
import "./ConfidenceCheckBlock.css";

const DEFAULT_LABELS = [
  "Pretty lost — go slower.",
  "Shaky.",
  "Getting it.",
  "Solid.",
  "Could explain it to someone else.",
];
const DEFAULT_LABELS_ES = [
  "Bastante perdido/a — más despacio.",
  "Inseguro/a.",
  "Lo voy entendiendo.",
  "Sólido/a.",
  "Podría explicárselo a alguien.",
];

export default function ConfidenceCheckBlock({ block, studentData, onAnswer, courseId, lessonId, readOnly = false }) {
  const { user } = useAuth();
  const { language } = useTranslation();
  const tr = useCallback((en, es) => (language && language !== "en" && es ? es : en), [language]);

  const saved = (studentData || {})[block.id] || {};
  const [rating, setRating] = useState(typeof saved.rating === "number" ? saved.rating : null);
  const [hover, setHover] = useState(0);
  const ratingRef = useRef(rating);
  useEffect(() => { ratingRef.current = rating; }, [rating]);

  const hydrated = useRef(false);
  const loadTried = useRef(false);

  // Hydrate once (studentData snapshot first, else responses doc).
  useEffect(() => {
    if (hydrated.current) return;
    const fromStudent = (studentData || {})[block.id]?.rating ?? (studentData || {})[block.id]?.answer;
    if (typeof fromStudent === "number") {
      hydrated.current = true;
      setRating(fromStudent);
      return;
    }
    if (loadTried.current || !user || !db || !courseId || !lessonId) return;
    loadTried.current = true;
    (async () => {
      try {
        const ref = doc(db, "courses", courseId, "lessons", lessonId, "responses", user.uid, "blocks", block.id);
        const snap = await getDoc(ref);
        if (!hydrated.current && snap.exists() && typeof snap.data().rating === "number") {
          hydrated.current = true;
          setRating(snap.data().rating);
        }
      } catch (e) {
        console.warn("Confidence check load failed:", e);
      }
    })();
  }, [studentData, block.id, user, courseId, lessonId]);

  const save = useCallback(async (value) => {
    if (user && db && courseId && lessonId) {
      try {
        const ref = doc(db, "courses", courseId, "lessons", lessonId, "responses", user.uid, "blocks", block.id);
        await setDoc(ref, {
          type: "confidence_check",
          blockId: block.id,
          rating: value,
          studentId: user.uid,
          studentName: user.displayName || "Unknown",
          submitted: true,
          updatedAt: serverTimestamp(),
        }, { merge: true });
      } catch (e) {
        console.warn("Confidence check save failed:", e);
      }
    }
    if (onAnswer) {
      onAnswer(block.id, {
        type: "confidence_check",
        rating: value,
        answer: value,
        submitted: true,
        writtenScore: 1, // completion only — not graded for correctness
        savedAt: new Date().toISOString(),
      });
    }
  }, [user, courseId, lessonId, block.id, onAnswer]);

  const pick = (value) => {
    if (readOnly) return;
    setRating(value);
    ratingRef.current = value;
    save(value);
  };

  const labels = block.labels || DEFAULT_LABELS;
  const labelsEs = block.labelsEs || DEFAULT_LABELS_ES;
  const active = hover || rating || 0;
  const shownLabel = active ? tr(labels[active - 1], labelsEs[active - 1]) : null;

  return (
    <div className="cc-block">
      <div className="cc-prompt" dangerouslySetInnerHTML={{
        __html: renderMarkdown(tr(block.prompt || "How sure do you feel right now?", block.promptEs || "¿Qué tan seguro/a te sientes ahora?")),
      }} />
      <div
        className="cc-stars"
        role="radiogroup"
        aria-label={tr(block.prompt || "Confidence rating", block.promptEs)}
        onMouseLeave={() => setHover(0)}
      >
        {[1, 2, 3, 4, 5].map((v) => (
          <button
            key={v}
            type="button"
            role="radio"
            aria-checked={rating === v}
            aria-label={`${v} — ${tr(labels[v - 1], labelsEs[v - 1])}`}
            className={`cc-star ${v <= active ? "is-on" : ""}`}
            disabled={readOnly}
            onMouseEnter={() => !readOnly && setHover(v)}
            onFocus={() => !readOnly && setHover(v)}
            onBlur={() => setHover(0)}
            onClick={() => pick(v)}
          >
            ★
          </button>
        ))}
      </div>
      <div className="cc-meta">
        {shownLabel ? (
          <span className="cc-label">{active}★ — {shownLabel}</span>
        ) : (
          <span className="cc-hint">{tr("Tap your stars — there's no wrong answer.", "Toca tus estrellas — no hay respuesta incorrecta.")}</span>
        )}
        {rating != null && <span className="cc-saved">✓ {tr("Saved", "Guardado")}</span>}
      </div>
    </div>
  );
}
