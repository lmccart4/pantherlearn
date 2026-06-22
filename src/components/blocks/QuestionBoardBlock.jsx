// src/components/blocks/QuestionBoardBlock.jsx
//
// Student Question Board (the "DQB") — class-shared, teacher-curated question wall for the
// OpenSciEd-spine / Rober-engine physics units. Students post the questions they still have
// after a build; the teacher clusters them into groups and marks ones the class has answered.
// These questions drive the unit roadmap; the class returns to the board as questions resolve.
//
// Class-level collection: courses/{courseId}/questionBoard/{threadId}, scoped by boardId so
// multiple lessons can each have their own board. Real-time via onSnapshot. Students post as
// themselves and manage only their own posts; teachers curate everything.

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useTranslation } from "../../contexts/TranslationContext";
import { renderMarkdown } from "../../lib/utils";
import "./QuestionBoardBlock.css";

const UNGROUPED = "__ungrouped__";

export default function QuestionBoardBlock({ block, courseId, lessonId }) {
  const { user, userRole } = useAuth();
  const { language } = useTranslation();
  const tr = useCallback((en, es) => (language && language !== "en" && es ? es : en), [language]);
  const isTeacher = userRole === "teacher";

  const boardId = block.boardId || block.id;
  const [threads, setThreads] = useState([]);
  const [error, setError] = useState(null);
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);

  // Real-time subscription, scoped to this board. Sort client-side (no composite index).
  useEffect(() => {
    if (!courseId || !boardId) return;
    const q = query(collection(db, "courses", courseId, "questionBoard"), where("boardId", "==", boardId));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setThreads(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setError(null);
      },
      (err) => {
        console.error("Question board subscription error:", err);
        setError(err.message?.includes("index") ? "Firestore index needed — see console." : (err.message || "Failed to load board"));
      }
    );
    return () => unsub();
  }, [courseId, boardId]);

  const sorted = useMemo(
    () => [...threads].sort((a, b) => (a.createdAtMs || 0) - (b.createdAtMs || 0)),
    [threads]
  );

  // Group by teacher-assigned cluster; ungrouped last.
  const groups = useMemo(() => {
    const byCluster = {};
    for (const t of sorted) {
      const c = (t.cluster && t.cluster.trim()) || UNGROUPED;
      (byCluster[c] = byCluster[c] || []).push(t);
    }
    const names = Object.keys(byCluster).filter((c) => c !== UNGROUPED).sort();
    if (byCluster[UNGROUPED]) names.push(UNGROUPED);
    return names.map((c) => ({ cluster: c, items: byCluster[c] }));
  }, [sorted]);

  const post = useCallback(async () => {
    if (!user || !courseId || !text.trim()) return;
    setPosting(true);
    try {
      await addDoc(collection(db, "courses", courseId, "questionBoard"), {
        boardId,
        lessonId: lessonId || null,
        text: text.trim().slice(0, 500),
        authorUid: user.uid,
        authorName: user.displayName || "Student",
        cluster: "",
        answered: false,
        createdAt: serverTimestamp(),
        createdAtMs: Date.now(), // client sort key (serverTimestamp is null until it lands)
      });
      setText("");
    } catch (e) {
      console.error("Failed to post question:", e);
      setError(e.message || "Could not post — try again.");
    } finally {
      setPosting(false);
    }
  }, [user, courseId, boardId, lessonId, text]);

  const refDoc = (id) => doc(db, "courses", courseId, "questionBoard", id);
  const toggleAnswered = (t) => updateDoc(refDoc(t.id), { answered: !t.answered }).catch((e) => setError(e.message));
  const setCluster = (t, cluster) => updateDoc(refDoc(t.id), { cluster: cluster.slice(0, 40) }).catch((e) => setError(e.message));
  const removeThread = (t) => {
    if (!window.confirm(tr("Remove this question?", "¿Quitar esta pregunta?"))) return;
    deleteDoc(refDoc(t.id)).catch((e) => setError(e.message));
  };

  const starters = block.starters || [
    "Why did ___ happen when we ___?",
    "What would happen if ___?",
    "How does the real grid handle ___?",
  ];
  const startersEs = block.startersEs || [];

  const answeredCount = sorted.filter((t) => t.answered).length;

  return (
    <div className="qbd-block">
      <div className="qbd-header">
        <span className="qbd-badge" aria-hidden>❓</span>
        <div className="qbd-headtext">
          <div className="qbd-title">{tr(block.title || "Class Question Board", block.titleEs)}</div>
          <div className="qbd-sub">{tr("Post a question you still have. These drive where we go next.", "Publica una pregunta que aún tengas. Estas guían hacia dónde vamos.")}</div>
        </div>
        {sorted.length > 0 && (
          <span className="qbd-count">{answeredCount}/{sorted.length} {tr("answered", "respondidas")}</span>
        )}
      </div>

      {block.intro && (
        <div className="qbd-intro" dangerouslySetInnerHTML={{ __html: renderMarkdown(tr(block.intro, block.introEs)) }} />
      )}

      {!isTeacher && (
        <div className="qbd-compose">
          <div className="qbd-starters">
            {starters.map((s, i) => (
              <button key={i} type="button" className="qbd-starter" onClick={() => setText(tr(s, startersEs[i]))}>
                {tr(s, startersEs[i])}
              </button>
            ))}
          </div>
          <textarea
            className="qbd-input"
            rows={2}
            value={text}
            maxLength={500}
            placeholder={tr("Type your question…", "Escribe tu pregunta…")}
            onChange={(e) => setText(e.target.value)}
          />
          <button type="button" className="qbd-post" disabled={posting || !text.trim()} onClick={post}>
            {tr("Post to the board", "Publicar en el tablero")}
          </button>
        </div>
      )}

      <div className="qbd-list">
        {sorted.length === 0 ? (
          <div className="qbd-empty">{tr("No questions yet — be the first to post one.", "Aún no hay preguntas — sé el primero en publicar.")}</div>
        ) : (
          groups.map((g) => (
            <div className="qbd-group" key={g.cluster}>
              {g.cluster !== UNGROUPED && <div className="qbd-group-label">{g.cluster}</div>}
              {g.items.map((t) => {
                const mine = t.authorUid === user?.uid;
                return (
                  <div className={`qbd-card ${t.answered ? "is-answered" : ""}`} key={t.id}>
                    <div className="qbd-card-text">{t.text}</div>
                    <div className="qbd-card-meta">
                      <span className="qbd-author">{mine ? tr("you", "tú") : t.authorName}</span>
                      {t.answered && <span className="qbd-answered-badge">✓ {tr("answered", "respondida")}</span>}
                      {isTeacher && (
                        <span className="qbd-tools">
                          <input
                            className="qbd-cluster-input"
                            type="text"
                            defaultValue={t.cluster || ""}
                            placeholder={tr("group…", "grupo…")}
                            onBlur={(e) => { if (e.target.value !== (t.cluster || "")) setCluster(t, e.target.value); }}
                          />
                          <button type="button" className="qbd-tool" onClick={() => toggleAnswered(t)}>
                            {t.answered ? tr("Reopen", "Reabrir") : tr("Mark answered", "Marcar resuelta")}
                          </button>
                          <button type="button" className="qbd-tool qbd-del" onClick={() => removeThread(t)}>✕</button>
                        </span>
                      )}
                      {!isTeacher && mine && (
                        <button type="button" className="qbd-tool qbd-del" onClick={() => removeThread(t)}>{tr("delete", "borrar")}</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>

      {error && <div className="qbd-error">{error}</div>}
    </div>
  );
}
