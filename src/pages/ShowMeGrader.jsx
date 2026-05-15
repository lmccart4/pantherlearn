// Rubric-grading dashboard for teacher_checkpoint blocks that carry a `levels` array.
// One row per enrolled student, 5 level buttons per checkpoint, click to grade.
// Route: /teacher/show-me/:courseId/:lessonId

import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth";
import "./ShowMeGrader.css";

function pctOf(score, max) {
  if (!max || max <= 0) return 0;
  return Math.round((score / max) * 100);
}

function studentName(s) {
  const fn = s.firstName || "";
  const ln = s.lastName || "";
  const full = `${fn} ${ln}`.trim();
  return full || s.email || s.uid;
}

function sortKey(s) {
  return `${(s.lastName || "zzz").toLowerCase()} ${(s.firstName || "").toLowerCase()}`;
}

export default function ShowMeGrader() {
  const { courseId, lessonId } = useParams();
  const { user, userRole } = useAuth();

  const [lesson, setLesson] = useState(null);
  const [students, setStudents] = useState([]);
  const [answers, setAnswers] = useState({}); // { studentUid: { blockId: data } }
  const [loading, setLoading] = useState(true);
  const [filterUngraded, setFilterUngraded] = useState(false);
  const [savingKey, setSavingKey] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userRole !== "teacher") return;
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const lessonSnap = await getDoc(doc(db, "courses", courseId, "lessons", lessonId));
        if (!lessonSnap.exists()) throw new Error("Lesson not found");
        const lessonData = { id: lessonSnap.id, ...lessonSnap.data() };

        const enrollSnap = await getDocs(
          query(collection(db, "enrollments"), where("courseId", "==", courseId))
        );
        const enrollRows = enrollSnap.docs.map((d) => d.data()).filter((e) => e.uid || e.studentId);
        const uids = [...new Set(enrollRows.map((e) => e.uid || e.studentId))];

        const userDocs = await Promise.all(
          uids.map((uid) => getDoc(doc(db, "users", uid)).catch(() => null))
        );
        const enrollByUid = {};
        for (const e of enrollRows) {
          const k = e.uid || e.studentId;
          if (k) enrollByUid[k] = e;
        }
        const studentRows = uids.map((uid, i) => {
          const u = userDocs[i] && userDocs[i].exists() ? userDocs[i].data() : {};
          const en = enrollByUid[uid] || {};
          return {
            uid,
            email: u.email || en.email || "",
            firstName: u.firstName || en.firstName || "",
            lastName: u.lastName || en.lastName || "",
          };
        }).sort((a, b) => sortKey(a).localeCompare(sortKey(b)));

        const answerSnaps = await Promise.all(
          uids.map((uid) =>
            getDoc(doc(db, "progress", uid, "courses", courseId, "lessons", lessonId)).catch(() => null)
          )
        );
        const ansMap = {};
        uids.forEach((uid, i) => {
          const s = answerSnaps[i];
          ansMap[uid] = s && s.exists() ? (s.data().answers || {}) : {};
        });

        if (!cancelled) {
          setLesson(lessonData);
          setStudents(studentRows);
          setAnswers(ansMap);
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) setError(e.message || "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [courseId, lessonId, userRole]);

  const checkpoints = useMemo(
    () => (lesson?.blocks || []).filter((b) => b.type === "teacher_checkpoint"),
    [lesson]
  );

  const grade = async (studentUid, block, level) => {
    const key = `${studentUid}:${block.id}`;
    setSavingKey(key);
    const ref = doc(db, "progress", studentUid, "courses", courseId, "lessons", lessonId);
    const max = block.weight || 5;
    const score = level.score;
    const approved = score > 0;
    const payload = {
      approved,
      approvedAt: new Date().toISOString(),
      approvedBy: user.uid,
      approvedByEmail: user.email,
      submitted: true,
      score,
      maxScore: max,
      level: level.score,
      levelLabel: level.label,
      needsApproval: true,
    };
    try {
      await setDoc(ref, { answers: { [block.id]: payload } }, { merge: true });
      setAnswers((prev) => ({
        ...prev,
        [studentUid]: {
          ...(prev[studentUid] || {}),
          [block.id]: { ...((prev[studentUid] || {})[block.id] || {}), ...payload },
        },
      }));
    } catch (e) {
      console.error("grade failed", e);
      alert(`Failed to save grade: ${e.message || e}`);
    } finally {
      setSavingKey(null);
    }
  };

  const clearGrade = async (studentUid, block) => {
    const key = `${studentUid}:${block.id}:clear`;
    setSavingKey(key);
    const ref = doc(db, "progress", studentUid, "courses", courseId, "lessons", lessonId);
    const max = block.weight || 5;
    const payload = {
      approved: false,
      approvedAt: null,
      approvedBy: null,
      approvedByEmail: null,
      submitted: false,
      score: null,
      maxScore: max,
      level: null,
      levelLabel: null,
      needsApproval: true,
    };
    try {
      await setDoc(ref, { answers: { [block.id]: payload } }, { merge: true });
      setAnswers((prev) => {
        const next = { ...prev };
        const studentAns = { ...(next[studentUid] || {}) };
        delete studentAns[block.id];
        next[studentUid] = studentAns;
        return next;
      });
    } catch (e) {
      console.error("clear failed", e);
      alert(`Failed to clear: ${e.message || e}`);
    } finally {
      setSavingKey(null);
    }
  };

  if (userRole !== "teacher") {
    return <div className="smg-page"><div className="smg-empty">Teachers only.</div></div>;
  }

  if (loading) {
    return <div className="smg-page"><div className="smg-empty">Loading…</div></div>;
  }

  if (error) {
    return <div className="smg-page"><div className="smg-empty smg-error">⚠️ {error}</div></div>;
  }

  if (!lesson) {
    return <div className="smg-page"><div className="smg-empty">Lesson not found.</div></div>;
  }

  if (checkpoints.length === 0) {
    return (
      <div className="smg-page">
        <div className="smg-empty">
          This lesson has no <code>teacher_checkpoint</code> blocks to grade.
        </div>
      </div>
    );
  }

  const visibleStudents = filterUngraded
    ? students.filter((s) =>
        checkpoints.some((b) => {
          const a = (answers[s.uid] || {})[b.id];
          return !a || (a.approved !== true && typeof a.score !== "number");
        })
      )
    : students;

  return (
    <div className="smg-page">
      <div className="smg-header">
        <div>
          <div className="smg-breadcrumb">
            <Link to="/progress">Student Progress</Link>
            <span> / </span>
            <span>{lesson.course || courseId}</span>
            <span> / </span>
            <span>{lesson.title}</span>
          </div>
          <h1 className="smg-title">🎯 Show Me Grader</h1>
          <div className="smg-sub">{lesson.title}</div>
        </div>
        <div className="smg-controls">
          <label className="smg-toggle">
            <input
              type="checkbox"
              checked={filterUngraded}
              onChange={(e) => setFilterUngraded(e.target.checked)}
            />
            <span>Show ungraded only</span>
          </label>
          <Link className="smg-link" to={`/course/${courseId}/lesson/${lessonId}`}>
            View lesson →
          </Link>
        </div>
      </div>

      {checkpoints.map((block) => {
        const levels = Array.isArray(block.levels) && block.levels.length > 0
          ? block.levels
          : [
              { score: block.weight || 5, label: "Approved", description: "Full credit" },
              { score: 0, label: "Missing", description: "No credit" },
            ];
        const max = block.weight || 5;
        const stats = students.reduce(
          (acc, s) => {
            const a = (answers[s.uid] || {})[block.id];
            const isGraded = a && (a.approved === true || typeof a.score === "number");
            if (isGraded) acc.graded++;
            return acc;
          },
          { graded: 0 }
        );

        return (
          <section className="smg-section" key={block.id}>
            <div className="smg-section-header">
              <h2>{block.title || "Checkpoint"}</h2>
              <div className="smg-count">
                {stats.graded} / {students.length} graded
              </div>
            </div>

            <div className="smg-rubric-legend">
              {levels.map((lvl) => (
                <div key={lvl.score + lvl.label} className="smg-legend-pill">
                  <span className="smg-legend-pct">{pctOf(lvl.score, max)}%</span>
                  <span className="smg-legend-label">{lvl.label}</span>
                  {lvl.description && <span className="smg-legend-desc">{lvl.description}</span>}
                </div>
              ))}
            </div>

            <div className="smg-table-wrap">
              <table className="smg-table">
                <thead>
                  <tr>
                    <th className="smg-col-name">Student</th>
                    {levels.map((lvl) => (
                      <th key={lvl.score + lvl.label} className="smg-col-level">
                        <div className="smg-th-pct">{pctOf(lvl.score, max)}%</div>
                        <div className="smg-th-label">{lvl.label}</div>
                      </th>
                    ))}
                    <th className="smg-col-current">Current</th>
                    <th className="smg-col-clear"></th>
                  </tr>
                </thead>
                <tbody>
                  {visibleStudents.map((s) => {
                    const a = (answers[s.uid] || {})[block.id] || {};
                    const isGraded = a.approved === true || typeof a.score === "number";
                    const currentScore = typeof a.score === "number" ? a.score : (a.approved ? max : null);
                    const currentLevel = a.levelLabel || (isGraded ? (currentScore > 0 ? "Approved" : "Missing") : "");
                    const saving = savingKey?.startsWith(`${s.uid}:${block.id}`);
                    return (
                      <tr key={s.uid} className={isGraded ? "is-graded" : "is-ungraded"}>
                        <td className="smg-col-name">
                          <div className="smg-student-name">{studentName(s)}</div>
                          {s.email && <div className="smg-student-email">{s.email}</div>}
                        </td>
                        {levels.map((lvl) => {
                          const isCurrent = isGraded && currentScore === lvl.score && (currentLevel === lvl.label || !a.levelLabel);
                          return (
                            <td key={lvl.score + lvl.label} className="smg-col-level">
                              <button
                                className={`smg-level-btn ${isCurrent ? "is-current" : ""}`}
                                disabled={saving}
                                onClick={() => grade(s.uid, block, lvl)}
                                title={lvl.description || ""}
                              >
                                {pctOf(lvl.score, max)}%
                              </button>
                            </td>
                          );
                        })}
                        <td className="smg-col-current">
                          {isGraded ? (
                            <div className="smg-current-cell">
                              <div className="smg-current-pct">{pctOf(currentScore, max)}%</div>
                              {currentLevel && <div className="smg-current-label">{currentLevel}</div>}
                            </div>
                          ) : (
                            <span className="smg-current-empty">—</span>
                          )}
                        </td>
                        <td className="smg-col-clear">
                          {isGraded && (
                            <button
                              className="smg-clear-btn"
                              disabled={saving}
                              onClick={() => clearGrade(s.uid, block)}
                              title="Clear grade"
                            >
                              ✕
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {visibleStudents.length === 0 && (
                    <tr>
                      <td colSpan={levels.length + 3} className="smg-empty-row">
                        {filterUngraded ? "All students graded 🎉" : "No students enrolled."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
    </div>
  );
}
