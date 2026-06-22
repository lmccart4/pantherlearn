// src/components/blocks/MissionLogBlock.jsx
//
// Mission Log — the backbone student workbook for the OpenSciEd-spine / Rober-engine
// physics units (Unit 1 "Energy & the Grid" pilot). One configurable block that holds a
// set of student-owned "pages" (sections): Notice/Think/Wonder, editable tables
// (e.g. Build & Fail Log), prompt sets (sensemaking / reflection), a single testable
// question, and a Word Tracker. Replaces OpenSciEd's separate paper trackers.
//
// Persistence (belt-and-suspenders, per .claude/rules/persist-student-interaction-data.md):
//   1. Direct setDoc to courses/{courseId}/lessons/{lessonId}/responses/{uid}/blocks/{blockId}
//      — the canonical, teacher-recoverable work path (full activityState).
//   2. onAnswer(block.id, {...}) — drives studentData hydration + lesson-completion signal.
// Debounced + unmount/beforeunload flush is handled by useAutoSave.
//
// Scope note: this pilot persists per-lesson (under one block.id). Threading a single
// Word Tracker across all unit lessons is a documented Phase-1 follow-up (needs a
// unit-scoped collection + rules) — not required for the L1 validation gate.

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useTranslation } from "../../contexts/TranslationContext";
import useAutoSave from "../../hooks/useAutoSave.jsx";
import { renderMarkdown } from "../../lib/utils";
import "./MissionLogBlock.css";

// ──────────────────────────────────────────────
// State shape helpers
// ──────────────────────────────────────────────

const NTW_COLS = [
  { key: "notice", label: "I notice…", labelEs: "Observo…" },
  { key: "think", label: "I think…", labelEs: "Pienso…" },
  { key: "wonder", label: "I wonder…", labelEs: "Me pregunto…" },
];

function emptyTableRow(columns) {
  const row = {};
  (columns || []).forEach((c) => { row[c.key] = ""; });
  return row;
}

// Build a valid initial state for one section, merging any saved values.
function initSectionState(section, saved) {
  const s = saved || {};
  switch (section.kind) {
    case "ntw": {
      const min = Math.max(1, section.minPerColumn || 2);
      const out = {};
      NTW_COLS.forEach(({ key }) => {
        const arr = Array.isArray(s[key]) ? s[key].slice() : [];
        while (arr.length < min) arr.push("");
        out[key] = arr;
      });
      return out;
    }
    case "table": {
      const min = Math.max(1, section.minRows || 2);
      let rows = Array.isArray(s.rows) ? s.rows.map((r) => ({ ...r })) : [];
      while (rows.length < min) rows.push(emptyTableRow(section.columns));
      return { rows };
    }
    case "prompts": {
      const out = {};
      (section.prompts || []).forEach((p) => { out[p.id] = typeof s[p.id] === "string" ? s[p.id] : ""; });
      return out;
    }
    case "text":
      return { value: typeof s.value === "string" ? s.value : "" };
    case "word_tracker": {
      const entries = Array.isArray(s.entries) ? s.entries.map((e) => ({ word: e.word || "", meaning: e.meaning || "" })) : [];
      return { entries };
    }
    default:
      return s;
  }
}

function makeInitialState(sections, savedState) {
  const out = {};
  (sections || []).forEach((sec) => {
    out[sec.id] = initSectionState(sec, savedState ? savedState[sec.id] : null);
  });
  return out;
}

function sectionHasContent(kind, st) {
  if (!st) return false;
  switch (kind) {
    case "ntw":
      return NTW_COLS.some(({ key }) => (st[key] || []).some((v) => v && v.trim()));
    case "table":
      return (st.rows || []).some((r) => Object.values(r || {}).some((v) => v && String(v).trim()));
    case "prompts":
      return Object.values(st).some((v) => v && String(v).trim());
    case "text":
      return !!(st.value && st.value.trim());
    case "word_tracker":
      return (st.entries || []).some((e) => (e.word && e.word.trim()) || (e.meaning && e.meaning.trim()));
    default:
      return false;
  }
}

// ──────────────────────────────────────────────
// Main component
// ──────────────────────────────────────────────

export default function MissionLogBlock({ block, studentData, onAnswer, courseId, lessonId, readOnly = false }) {
  const { user } = useAuth();
  const { language } = useTranslation();
  const tr = useCallback((en, es) => (language && language !== "en" && es ? es : en), [language]);

  const sections = useMemo(() => block.sections || [], [block.sections]);

  const [state, setState] = useState(() =>
    makeInitialState(sections, (studentData || {})[block.id]?.activityState)
  );
  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);

  const hydrated = useRef(false);
  const loadTried = useRef(false);

  // ── Persistence ──
  const performSave = useCallback(async () => {
    const current = stateRef.current;
    const hasContent = sections.some((s) => sectionHasContent(s.kind, current[s.id]));

    // 1) Canonical, teacher-recoverable work path.
    if (user && db && courseId && lessonId) {
      try {
        const ref = doc(db, "courses", courseId, "lessons", lessonId, "responses", user.uid, "blocks", block.id);
        await setDoc(ref, {
          type: "mission_log",
          blockId: block.id,
          activityState: current,
          studentId: user.uid,
          studentName: user.displayName || "Unknown",
          submitted: hasContent,
          updatedAt: serverTimestamp(),
        }, { merge: true });
      } catch (e) {
        console.warn("Mission Log responses-path save failed:", e);
        throw e; // let useAutoSave retry/backoff
      }
    }

    // 2) Progress/completion signal — hydrates studentData on reload.
    if (onAnswer) {
      onAnswer(block.id, {
        type: "mission_log",
        activityState: current,
        answer: { activityState: current },
        submitted: hasContent,
        writtenScore: hasContent ? 1 : 0,
        savedAt: new Date().toISOString(),
      });
    }
  }, [sections, user, courseId, lessonId, block.id, onAnswer]);

  const { markDirty, saveNow, lastSaved, saving, saveError } = useAutoSave(performSave, { delay: 2500 });

  // ── Hydrate once: prefer studentData snapshot, else read the responses doc. ──
  useEffect(() => {
    if (hydrated.current) return;
    const fromStudent =
      (studentData || {})[block.id]?.activityState ||
      (studentData || {})[block.id]?.answer?.activityState;
    if (fromStudent) {
      hydrated.current = true;
      const next = makeInitialState(sections, fromStudent);
      stateRef.current = next;
      setState(next);
      return;
    }
    if (loadTried.current || !user || !db || !courseId || !lessonId) return;
    loadTried.current = true;
    (async () => {
      try {
        const ref = doc(db, "courses", courseId, "lessons", lessonId, "responses", user.uid, "blocks", block.id);
        const snap = await getDoc(ref);
        if (!hydrated.current && snap.exists() && snap.data().activityState) {
          hydrated.current = true;
          const next = makeInitialState(sections, snap.data().activityState);
          stateRef.current = next;
          setState(next);
        }
      } catch (e) {
        console.warn("Mission Log load failed:", e);
      }
    })();
  }, [studentData, block.id, user, courseId, lessonId, sections]);

  // ── Section mutation ──
  const updateSection = useCallback((sectionId, updater) => {
    if (readOnly) return;
    setState((prev) => {
      const nextSection = typeof updater === "function" ? updater(prev[sectionId] || {}) : updater;
      return { ...prev, [sectionId]: nextSection };
    });
    markDirty();
  }, [markDirty, readOnly]);

  const filledSections = sections.filter((s) => sectionHasContent(s.kind, state[s.id])).length;

  return (
    <div className="mlog-block">
      <div className="mlog-header">
        <span className="mlog-badge" aria-hidden>🛰️</span>
        <div className="mlog-headtext">
          <div className="mlog-title">{tr(block.title || "Mission Log", block.titleEs)}</div>
          <div className="mlog-sub">{tr("Your mission notebook — it saves itself.", "Tu cuaderno de misión — se guarda solo.")}</div>
        </div>
        {sections.length > 0 && (
          <span className="mlog-progress" title={tr("Pages with something written", "Páginas con algo escrito")}>
            {filledSections}/{sections.length}
          </span>
        )}
      </div>

      {block.intro && (
        <div
          className="mlog-intro"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(tr(block.intro, block.introEs)) }}
        />
      )}

      <div className="mlog-sections">
        {sections.map((section) => (
          <MissionLogSection
            key={section.id}
            section={section}
            st={state[section.id]}
            update={(u) => updateSection(section.id, u)}
            saveNow={saveNow}
            tr={tr}
            readOnly={readOnly}
          />
        ))}
      </div>

      <div className="mlog-footer">
        {saveError ? (
          <span className="mlog-save-error">{saveError}</span>
        ) : saving ? (
          <span className="mlog-saving">{tr("Saving…", "Guardando…")}</span>
        ) : lastSaved ? (
          <span className="mlog-saved">
            ✓ {tr("Auto-saved", "Guardado")} {lastSaved.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
          </span>
        ) : (
          <span className="mlog-saved-idle">{tr("Auto-saves as you type", "Se guarda mientras escribes")}</span>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Section renderer
// ──────────────────────────────────────────────

function MissionLogSection({ section, st, update, saveNow, tr, readOnly }) {
  return (
    <section className="mlog-section">
      <div className="mlog-section-head">
        {section.icon && <span className="mlog-section-icon" aria-hidden>{section.icon}</span>}
        <h4 className="mlog-section-title">{tr(section.title, section.titleEs)}</h4>
      </div>
      {section.instructions && (
        <div
          className="mlog-section-instructions"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(tr(section.instructions, section.instructionsEs)) }}
        />
      )}
      <SectionBody section={section} st={st} update={update} saveNow={saveNow} tr={tr} readOnly={readOnly} />
    </section>
  );
}

function SectionBody({ section, st, update, saveNow, tr, readOnly }) {
  if (!st) return null;
  switch (section.kind) {
    case "ntw": return <NtwSection section={section} st={st} update={update} saveNow={saveNow} tr={tr} readOnly={readOnly} />;
    case "table": return <TableSection section={section} st={st} update={update} saveNow={saveNow} tr={tr} readOnly={readOnly} />;
    case "prompts": return <PromptsSection section={section} st={st} update={update} saveNow={saveNow} tr={tr} readOnly={readOnly} />;
    case "text": return <TextSection section={section} st={st} update={update} saveNow={saveNow} tr={tr} readOnly={readOnly} />;
    case "word_tracker": return <WordTrackerSection section={section} st={st} update={update} saveNow={saveNow} tr={tr} readOnly={readOnly} />;
    default: return null;
  }
}

// ── Notice / Think / Wonder ──
function NtwSection({ section, st, update, saveNow, tr, readOnly }) {
  const min = Math.max(1, section.minPerColumn || 2);
  const setCol = (key, idx, value) =>
    update((cur) => {
      const arr = (cur[key] || []).slice();
      arr[idx] = value;
      return { ...cur, [key]: arr };
    });
  const addRow = (key) =>
    update((cur) => ({ ...cur, [key]: [...(cur[key] || []), ""] }));
  const removeRow = (key, idx) =>
    update((cur) => {
      const arr = (cur[key] || []).slice();
      arr.splice(idx, 1);
      while (arr.length < min) arr.push("");
      return { ...cur, [key]: arr };
    });

  return (
    <div className="mlog-ntw">
      {NTW_COLS.map((col) => {
        const entries = st[col.key] || [];
        return (
          <div className="mlog-ntw-col" key={col.key}>
            <div className="mlog-ntw-coltitle">{tr(col.label, col.labelEs)}</div>
            {entries.map((val, i) => (
              <div className="mlog-ntw-row" key={i}>
                <input
                  className="mlog-input"
                  type="text"
                  value={val}
                  placeholder={tr("…", "…")}
                  onChange={(e) => setCol(col.key, i, e.target.value)}
                  onBlur={saveNow}
                  disabled={readOnly}
                />
                {!readOnly && entries.length > min && (
                  <button type="button" className="mlog-rowx" title={tr("Remove", "Quitar")} onClick={() => removeRow(col.key, i)}>×</button>
                )}
              </div>
            ))}
            {!readOnly && (
              <button type="button" className="mlog-add" onClick={() => addRow(col.key)}>+ {tr("Add", "Añadir")}</button>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Editable table (e.g. Build & Fail Log) ──
function TableSection({ section, st, update, saveNow, tr, readOnly }) {
  const columns = section.columns || [];
  const min = Math.max(1, section.minRows || 2);
  const rows = st.rows || [];

  const setCell = (rowIdx, key, value) =>
    update((cur) => {
      const next = (cur.rows || []).map((r) => ({ ...r }));
      next[rowIdx] = { ...(next[rowIdx] || {}), [key]: value };
      return { ...cur, rows: next };
    });
  const addRow = () =>
    update((cur) => ({ ...cur, rows: [...(cur.rows || []), emptyTableRow(columns)] }));
  const removeRow = (rowIdx) =>
    update((cur) => {
      const next = (cur.rows || []).slice();
      next.splice(rowIdx, 1);
      while (next.length < min) next.push(emptyTableRow(columns));
      return { ...cur, rows: next };
    });

  return (
    <div className="mlog-tablewrap">
      <div className="mlog-scroll">
        <table className="mlog-table">
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.key} style={c.width ? { width: c.width } : undefined}>{tr(c.label, c.labelEs)}</th>
              ))}
              {!readOnly && <th className="mlog-th-action" aria-label="actions" />}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                {columns.map((c) => (
                  <td key={c.key}>
                    <textarea
                      className="mlog-cell"
                      rows={1}
                      value={row[c.key] || ""}
                      placeholder={tr(c.placeholder || "", c.placeholderEs)}
                      onChange={(e) => setCell(ri, c.key, e.target.value)}
                      onBlur={saveNow}
                      disabled={readOnly}
                    />
                  </td>
                ))}
                {!readOnly && (
                  <td className="mlog-td-action">
                    {rows.length > min && (
                      <button type="button" className="mlog-rowx" title={tr("Remove row", "Quitar fila")} onClick={() => removeRow(ri)}>×</button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!readOnly && (
        <button type="button" className="mlog-add" onClick={addRow}>+ {tr(section.addRowLabel || "Add row", section.addRowLabelEs || "Añadir fila")}</button>
      )}
    </div>
  );
}

// ── Prompt set (sensemaking / reflection) ──
function PromptsSection({ section, st, update, saveNow, tr, readOnly }) {
  const prompts = section.prompts || [];
  const setVal = (id, value) => update((cur) => ({ ...cur, [id]: value }));
  return (
    <div className="mlog-prompts">
      {prompts.map((p, i) => (
        <div className="mlog-prompt" key={p.id}>
          <label className="mlog-prompt-label">
            {prompts.length > 1 && <span className="mlog-prompt-num">{i + 1}.</span>}
            {tr(p.label, p.labelEs)}
          </label>
          <textarea
            className="mlog-textarea"
            rows={p.rows || 2}
            value={st[p.id] || ""}
            placeholder={tr(p.placeholder || "", p.placeholderEs)}
            onChange={(e) => setVal(p.id, e.target.value)}
            onBlur={saveNow}
            disabled={readOnly}
          />
        </div>
      ))}
    </div>
  );
}

// ── Single free-text (e.g. testable question) ──
function TextSection({ section, st, update, saveNow, tr, readOnly }) {
  return (
    <div className="mlog-prompts">
      <div className="mlog-prompt">
        {section.label && <label className="mlog-prompt-label">{tr(section.label, section.labelEs)}</label>}
        <textarea
          className="mlog-textarea"
          rows={section.rows || 2}
          value={st.value || ""}
          placeholder={tr(section.placeholder || "", section.placeholderEs)}
          onChange={(e) => update((cur) => ({ ...cur, value: e.target.value }))}
          onBlur={saveNow}
          disabled={readOnly}
        />
        {section.hint && <div className="mlog-hint" dangerouslySetInnerHTML={{ __html: renderMarkdown(tr(section.hint, section.hintEs)) }} />}
      </div>
    </div>
  );
}

// ── Word Tracker (earn-then-name) ──
function WordTrackerSection({ section, st, update, saveNow, tr, readOnly }) {
  const entries = st.entries || [];
  const setEntry = (idx, field, value) =>
    update((cur) => {
      const next = (cur.entries || []).map((e) => ({ ...e }));
      next[idx] = { ...(next[idx] || { word: "", meaning: "" }), [field]: value };
      return { ...cur, entries: next };
    });
  const addEntry = () =>
    update((cur) => ({ ...cur, entries: [...(cur.entries || []), { word: "", meaning: "" }] }));
  const removeEntry = (idx) =>
    update((cur) => {
      const next = (cur.entries || []).slice();
      next.splice(idx, 1);
      return { ...cur, entries: next };
    });

  return (
    <div className="mlog-words">
      {entries.length === 0 && (
        <div className="mlog-words-empty">{tr("No words yet — add one when you reach for a word you don't have a sharp name for.", "Aún no hay palabras — añade una cuando necesites un término que todavía no sabes nombrar.")}</div>
      )}
      {entries.map((e, i) => (
        <div className="mlog-word-row" key={i}>
          <input
            className="mlog-input mlog-word-term"
            type="text"
            value={e.word}
            placeholder={tr("word", "palabra")}
            onChange={(ev) => setEntry(i, "word", ev.target.value)}
            onBlur={saveNow}
            disabled={readOnly}
          />
          <input
            className="mlog-input mlog-word-mean"
            type="text"
            value={e.meaning}
            placeholder={tr("I think it means…", "Creo que significa…")}
            onChange={(ev) => setEntry(i, "meaning", ev.target.value)}
            onBlur={saveNow}
            disabled={readOnly}
          />
          {!readOnly && (
            <button type="button" className="mlog-rowx" title={tr("Remove", "Quitar")} onClick={() => removeEntry(i)}>×</button>
          )}
        </div>
      ))}
      {!readOnly && (
        <button type="button" className="mlog-add" onClick={addEntry}>+ {tr("Add a word", "Añadir palabra")}</button>
      )}
    </div>
  );
}
