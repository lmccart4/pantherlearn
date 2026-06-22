// src/components/blocks/ConsensusModelBlock.jsx
//
// Class Consensus Model — the collaborative, revisable class explanation that the OpenSciEd
// storyline returns to every lesson ("Tweak Our Explanation"). The teacher builds/edits it
// live (projected) using students' own words; students read it and copy it into their own
// Mission Log. It keeps an "initial draft" snapshot so the class can compare initial-vs-final
// at the end of the unit.
//
// Class-level doc: courses/{courseId}/consensusModel/{roundId}. Teacher-write, class-read
// (firestore.rules). Real-time via onSnapshot so students watch it update as the class builds it.

import { useState, useEffect, useRef, useCallback } from "react";
import { doc, onSnapshot, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useTranslation } from "../../contexts/TranslationContext";
import { renderMarkdown } from "../../lib/utils";
import "./ConsensusModelBlock.css";

export default function ConsensusModelBlock({ block, courseId, lessonId }) {
  const { user, userRole } = useAuth();
  const { language } = useTranslation();
  const tr = useCallback((en, es) => (language && language !== "en" && es ? es : en), [language]);
  const isTeacher = userRole === "teacher";

  const roundId = block.roundId || block.id;
  const [model, setModel] = useState(null);
  const [draft, setDraft] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [error, setError] = useState(null);
  const editingRef = useRef(false); // don't stomp the teacher's in-progress edits on snapshot

  useEffect(() => {
    if (!courseId || !roundId) return;
    const ref = doc(db, "courses", courseId, "consensusModel", roundId);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        const d = snap.exists() ? snap.data() : null;
        setModel(d);
        if (!editingRef.current) {
          setDraft(d?.text || "");
          setImageUrl(d?.imageUrl || "");
        }
        setError(null);
      },
      (err) => { console.error("Consensus model subscription error:", err); setError(err.message || "Failed to load model"); }
    );
    return () => unsub();
  }, [courseId, roundId]);

  const save = useCallback(async (extra = {}) => {
    if (!isTeacher || !courseId) return;
    setSaving(true);
    try {
      const ref = doc(db, "courses", courseId, "consensusModel", roundId);
      await setDoc(ref, {
        roundId,
        lessonId: lessonId || null,
        text: draft,
        imageUrl: imageUrl || "",
        updatedByName: user?.displayName || "Teacher",
        updatedAt: serverTimestamp(),
        ...extra,
      }, { merge: true });
      editingRef.current = false;
      setSavedAt(new Date());
    } catch (e) {
      console.error("Failed to save consensus model:", e);
      setError(e.message || "Could not save.");
    } finally {
      setSaving(false);
    }
  }, [isTeacher, courseId, roundId, lessonId, draft, imageUrl, user]);

  const lockInitial = useCallback(() => {
    if (!isTeacher) return;
    if (model?.initialText && !window.confirm(tr("An initial draft is already saved. Overwrite it?", "Ya hay un borrador inicial guardado. ¿Sobrescribirlo?"))) return;
    save({ initialText: draft, initialSavedAt: serverTimestamp() });
  }, [isTeacher, model, draft, save, tr]);

  const hasModel = (model?.text && model.text.trim()) || model?.imageUrl;

  return (
    <div className="cmod-block">
      <div className="cmod-header">
        <span className="cmod-badge" aria-hidden>🧩</span>
        <div className="cmod-headtext">
          <div className="cmod-title">{tr(block.title || "Our Class Model", block.titleEs)}</div>
          <div className="cmod-sub">{tr("Our shared explanation so far. We tweak it every lesson.", "Nuestra explicación compartida hasta ahora. La ajustamos cada lección.")}</div>
        </div>
      </div>

      {block.intro && (
        <div className="cmod-intro" dangerouslySetInnerHTML={{ __html: renderMarkdown(tr(block.intro, block.introEs)) }} />
      )}

      {/* Initial-vs-current compare */}
      {model?.initialText && (
        <div className="cmod-initial">
          <div className="cmod-initial-label">📌 {tr("Our first draft (saved):", "Nuestro primer borrador (guardado):")}</div>
          <div className="cmod-initial-text">{model.initialText}</div>
        </div>
      )}

      {isTeacher ? (
        <div className="cmod-editor">
          <textarea
            className="cmod-textarea"
            rows={5}
            value={draft}
            placeholder={tr("Build the class model here, in students' own words…", "Construye el modelo de la clase aquí, con las palabras de los estudiantes…")}
            onChange={(e) => { editingRef.current = true; setDraft(e.target.value); }}
          />
          <input
            className="cmod-image-input"
            type="text"
            value={imageUrl}
            placeholder={tr("Optional: image URL of the class diagram", "Opcional: URL de imagen del diagrama de la clase")}
            onChange={(e) => { editingRef.current = true; setImageUrl(e.target.value); }}
          />
          <div className="cmod-actions">
            <button type="button" className="cmod-save" disabled={saving} onClick={() => save()}>
              {saving ? tr("Saving…", "Guardando…") : tr("Save model", "Guardar modelo")}
            </button>
            <button type="button" className="cmod-lock" disabled={saving || !draft.trim()} onClick={lockInitial}>
              📌 {tr("Lock as initial draft", "Fijar como borrador inicial")}
            </button>
            {savedAt && <span className="cmod-saved">✓ {tr("Saved", "Guardado")} {savedAt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</span>}
          </div>
        </div>
      ) : (
        <div className="cmod-view">
          {hasModel ? (
            <>
              {model.text && <div className="cmod-text">{model.text}</div>}
              {model.imageUrl && <img className="cmod-image" src={model.imageUrl} alt={tr("Class model diagram", "Diagrama del modelo de la clase")} loading="lazy" />}
              <div className="cmod-copy-note">✍️ {tr("Copy this into your Mission Log — it's allowed to be wrong; we fix it as we learn.", "Copia esto en tu Cuaderno de Misión — puede estar equivocado; lo corregimos a medida que aprendemos.")}</div>
            </>
          ) : (
            <div className="cmod-empty">{tr("We'll build our class model together — watch this space.", "Construiremos el modelo de la clase juntos — atento a este espacio.")}</div>
          )}
        </div>
      )}

      {error && <div className="cmod-error">{error}</div>}
    </div>
  );
}
