// src/components/blocks/ChallengeTrackerBlock.jsx
//
// Challenge Progress Tracker — the public, real-time class leaderboard for the gamified
// "Keep the Lights On"-style challenge ladders (OpenSciEd-spine / Rober-engine physics).
// Teams claim a name and mark each level they clear; the whole class sees who's where, live.
// Class-level shared doc at courses/{courseId}/challengeProgress/{challengeId}
// (same model as connectFourGames). Any course member initializes/updates; teacher resets.
//
// Decision #5 (full gamification day one). Digital-primary; printable cards are a separate
// concern (html2canvas/jsPDF already in the bundle) — this is the class view.

import { useState, useEffect, useMemo, useCallback } from "react";
import { doc, onSnapshot, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useTranslation } from "../../contexts/TranslationContext";
import { renderMarkdown } from "../../lib/utils";
import "./ChallengeTrackerBlock.css";

function teamKey(name) {
  return (name || "").trim().replace(/[.~/*[\]#$]/g, "_").slice(0, 60) || "team";
}

export default function ChallengeTrackerBlock({ block, courseId, lessonId }) {
  const { user, userRole } = useAuth();
  const { language } = useTranslation();
  const tr = useCallback((en, es) => (language && language !== "en" && es ? es : en), [language]);
  const isTeacher = userRole === "teacher";

  const challengeId = block.challengeId || block.id;

  // Level config: explicit list, or derived from maxLevel with generic names.
  const levels = useMemo(() => {
    if (Array.isArray(block.levels) && block.levels.length) {
      return block.levels.map((l, i) => ({
        n: l.n || i + 1,
        name: l.name || `Level ${i + 1}`,
        nameEs: l.nameEs,
      }));
    }
    const max = block.maxLevel || 5;
    return Array.from({ length: max }, (_, i) => ({ n: i + 1, name: `Level ${i + 1}`, nameEs: `Nivel ${i + 1}` }));
  }, [block.levels, block.maxLevel]);
  const maxLevel = levels.length;

  const [board, setBoard] = useState(null); // { teams: {...} } | null (not started)
  const [error, setError] = useState(null);
  const lsKey = `mlogChallengeTeam:${courseId}:${challengeId}`;
  const [teamName, setTeamName] = useState(() => {
    try { return localStorage.getItem(lsKey) || ""; } catch { return ""; }
  });
  const [busy, setBusy] = useState(false);

  // Real-time subscription to the shared board doc.
  useEffect(() => {
    if (!courseId || !challengeId) return;
    const ref = doc(db, "courses", courseId, "challengeProgress", challengeId);
    const unsub = onSnapshot(
      ref,
      (snap) => { setBoard(snap.exists() ? snap.data() : null); setError(null); },
      (err) => { console.error("Challenge tracker subscription error:", err); setError(err.message || "Failed to load board"); }
    );
    return () => unsub();
  }, [courseId, challengeId]);

  const teams = useMemo(() => {
    const t = (board && board.teams) || {};
    return Object.entries(t)
      .map(([key, v]) => ({ key, name: v.name || key, level: v.level || 0, members: v.members || "" }))
      .sort((a, b) => b.level - a.level || a.name.localeCompare(b.name));
  }, [board]);

  const myKey = teamName ? teamKey(teamName) : null;
  const myLevel = (myKey && board?.teams?.[myKey]?.level) || 0;

  const writeMyTeam = useCallback(async (level) => {
    if (!user || !courseId || !teamName.trim()) return;
    setBusy(true);
    try {
      const ref = doc(db, "courses", courseId, "challengeProgress", challengeId);
      // Nested-object merge (NOT dotted keys — see feedback_firestore_dotted_paths):
      // deep-merges this one team into the teams map without clobbering others.
      await setDoc(ref, {
        challengeId,
        lessonId: lessonId || null,
        teams: {
          [teamKey(teamName)]: {
            name: teamName.trim().slice(0, 60),
            level,
            updatedByUid: user.uid,
            updatedByName: user.displayName || "Student",
            updatedAt: serverTimestamp(),
          },
        },
        updatedAt: serverTimestamp(),
      }, { merge: true });
      try { localStorage.setItem(lsKey, teamName); } catch { /* ignore */ }
    } catch (e) {
      console.error("Failed to update challenge progress:", e);
      setError(e.message || "Could not save — try again.");
    } finally {
      setBusy(false);
    }
  }, [user, courseId, challengeId, lessonId, teamName, lsKey]);

  const resetBoard = useCallback(async () => {
    if (!isTeacher) return;
    if (!window.confirm(tr("Reset the whole class board? This clears every team's progress.", "¿Reiniciar todo el tablero de la clase? Esto borra el progreso de cada equipo."))) return;
    try {
      await deleteDoc(doc(db, "courses", courseId, "challengeProgress", challengeId));
    } catch (e) {
      console.error("Failed to reset board:", e);
      setError(e.message || "Could not reset.");
    }
  }, [isTeacher, courseId, challengeId, tr]);

  return (
    <div className="chtrk-block">
      <div className="chtrk-header">
        <span className="chtrk-badge" aria-hidden>🏆</span>
        <div className="chtrk-headtext">
          <div className="chtrk-title">{tr(block.title || "Class Challenge Board", block.titleEs)}</div>
          <div className="chtrk-sub">{tr("Mark each level your team clears — the whole class can see it live.", "Marca cada nivel que tu equipo supere — toda la clase lo ve en vivo.")}</div>
        </div>
        {isTeacher && (board?.teams && Object.keys(board.teams).length > 0) && (
          <button type="button" className="chtrk-reset" onClick={resetBoard}>{tr("Reset board", "Reiniciar")}</button>
        )}
      </div>

      {block.intro && (
        <div className="chtrk-intro" dangerouslySetInnerHTML={{ __html: renderMarkdown(tr(block.intro, block.introEs)) }} />
      )}

      {/* Student's own team controls */}
      {!isTeacher && (
        <div className="chtrk-mine">
          <label className="chtrk-mine-label">{tr("Your team name", "Nombre de tu equipo")}</label>
          <input
            className="chtrk-team-input"
            type="text"
            value={teamName}
            placeholder={tr("e.g. Voltage Vipers", "p. ej. Voltage Vipers")}
            maxLength={60}
            onChange={(e) => setTeamName(e.target.value)}
            onBlur={() => { if (teamName.trim()) { try { localStorage.setItem(lsKey, teamName); } catch { /* ignore */ } } }}
          />
          <div className="chtrk-level-row" role="group" aria-label={tr("Mark cleared level", "Marcar nivel superado")}>
            {levels.map((lv) => {
              const cleared = lv.n <= myLevel;
              return (
                <button
                  key={lv.n}
                  type="button"
                  className={`chtrk-level-btn ${cleared ? "is-cleared" : ""}`}
                  disabled={busy || !teamName.trim()}
                  title={tr(lv.name, lv.nameEs)}
                  onClick={() => writeMyTeam(lv.n === myLevel ? lv.n - 1 : lv.n)}
                >
                  <span className="chtrk-level-n">{lv.n}</span>
                  <span className="chtrk-level-name">{tr(lv.name, lv.nameEs)}</span>
                </button>
              );
            })}
          </div>
          <div className="chtrk-mine-hint">
            {teamName.trim()
              ? tr("Tap a level to mark it cleared. Tap your current level again to undo.", "Toca un nivel para marcarlo como superado. Toca tu nivel actual otra vez para deshacer.")
              : tr("Type your team name first, then mark the levels you clear.", "Escribe el nombre de tu equipo primero, luego marca los niveles que superes.")}
          </div>
        </div>
      )}

      {/* Live leaderboard */}
      <div className="chtrk-board">
        {teams.length === 0 ? (
          <div className="chtrk-empty">{tr("No teams on the board yet — be the first to clear Level 1!", "Aún no hay equipos — ¡sé el primero en superar el Nivel 1!")}</div>
        ) : (
          teams.map((t) => (
            <div className={`chtrk-team ${myKey === t.key ? "is-me" : ""}`} key={t.key}>
              <div className="chtrk-team-name">
                {t.name}
                {t.level >= maxLevel && <span className="chtrk-crown" aria-label="all levels cleared"> 🎉</span>}
                {myKey === t.key && <span className="chtrk-you">{tr("you", "tú")}</span>}
              </div>
              <div className="chtrk-pips" aria-label={`${t.level} / ${maxLevel}`}>
                {levels.map((lv) => (
                  <span key={lv.n} className={`chtrk-pip ${lv.n <= t.level ? "is-on" : ""}`} title={tr(lv.name, lv.nameEs)} />
                ))}
                <span className="chtrk-count">{t.level}/{maxLevel}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {error && <div className="chtrk-error">{error}</div>}
    </div>
  );
}
