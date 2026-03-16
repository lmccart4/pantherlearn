// src/pages/LessonViewer.jsx
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, setDoc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth";
import BlockRenderer from "../components/blocks/BlockRenderer";
import ProgressSidebar from "../components/ProgressSidebar";
import LessonCompleteButton from "../components/LessonCompleteButton";
import { useTranslatedText } from "../hooks/useTranslatedText.jsx";
import { usePreview } from "../contexts/PreviewContext";
import { usePreviewData } from "../hooks/usePreviewData";
import PreviewLauncher from "../components/PreviewLauncher";
import { useEngagementTimer, formatEngagementTime } from "../hooks/useEngagementTimer";
import { TelemetryProvider } from "../contexts/TelemetryContext";

export default function LessonViewer() {
  const { courseId, lessonId } = useParams();
  const { user, userRole, isTestStudent, getToken } = useAuth();
  const { isPreview } = usePreview();
  const isStudent = userRole === "student";
  const { seconds: engagementSeconds } = useEngagementTimer(
    isStudent ? courseId : null,
    isStudent ? lessonId : null
  );
  const [lesson, setLesson] = useState(null);
  const [realStudentData, setRealStudentData] = useState({});
  const [realChatLogs, setRealChatLogs] = useState({});
  const [loading, setLoading] = useState(true);
  const [lessonCompleted, setLessonCompleted] = useState(false);

  // Scroll to top when entering or exiting preview
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [isPreview]);

  // Swap in mock data when preview is active
  const { studentData, chatLogs, isPreviewActive } = usePreviewData(
    lesson,
    realStudentData,
    realChatLogs
  );

  // Real-time lesson content — teacher edits propagate live
  useEffect(() => {
    const lessonRef = doc(db, "courses", courseId, "lessons", lessonId);
    const unsub = onSnapshot(lessonRef, (snap) => {
      if (snap.exists()) setLesson({ id: snap.id, ...snap.data() });
      setLoading(false);
    }, (err) => {
      console.error("Lesson listener error:", err);
      setLoading(false);
    });
    return () => unsub();
  }, [courseId, lessonId]);

  // Real-time student progress — uses onSnapshot so locally-queued writes
  // (from beforeunload / unmount saves) are visible immediately on reload,
  // even before they sync to the server.
  useEffect(() => {
    if (!user) return;
    const progressRef = doc(db, "progress", user.uid, "courses", courseId, "lessons", lessonId);
    const unsub = onSnapshot(progressRef, (snap) => {
      if (snap.exists()) {
        const serverAnswers = snap.data().answers || {};
        // Merge strategy: never let a snapshot DOWNGRADE local data.
        // The engagement timer writes to this same document every 30s, each
        // write triggers onSnapshot. If an answer write (updateDoc) is in-flight
        // when the engagement-timer snapshot arrives, that snapshot may contain
        // STALE answers. Without this guard, the stale snapshot would overwrite
        // the optimistic local state from handleAnswer, silently losing the answer.
        setRealStudentData((prev) => {
          const merged = { ...serverAnswers };
          for (const [blockId, localData] of Object.entries(prev)) {
            if (!localData) continue;
            const serverData = merged[blockId];
            if (!serverData) {
              // Server doesn't have this block yet — keep local optimistic data
              merged[blockId] = localData;
            } else {
              // Both exist — never downgrade:
              // 1. Never replace submitted answer with non-submitted (stale draft)
              // 2. Never replace data that has an answer with data that doesn't
              if (localData.submitted && !serverData.submitted) {
                merged[blockId] = localData;
              } else if (
                localData.answer !== undefined && localData.answer !== null &&
                (serverData.answer === undefined || serverData.answer === null)
              ) {
                merged[blockId] = localData;
              }
            }
          }
          return merged;
        });
        if (snap.data().completed) setLessonCompleted(true);
      } else {
        // Document was deleted (e.g. teacher reset) — clear local state
        setRealStudentData({});
        setLessonCompleted(false);
      }
    }, (err) => console.error("Progress listener error:", err));
    return () => unsub();
  }, [courseId, lessonId, user]);

  // Track latest student data for Firestore writes without stale closures
  const studentDataRef = useRef({});
  useEffect(() => { studentDataRef.current = realStudentData; }, [realStudentData]);

  // Track per-block write sequence numbers to abort stale retries.
  // If a new write starts for a block while a retry is in-flight,
  // the old retry aborts so it can't overwrite the newer data.
  const writeSeqRef = useRef({});

  // Track save failures so the UI can display a warning
  const [saveError, setSaveError] = useState(null);

  const handleAnswer = useCallback(
    async (blockId, data) => {
      if (isPreviewActive) {
        setRealStudentData((prev) => ({ ...prev, [blockId]: data }));
        return;
      }

      // Guard: never overwrite a submitted answer with a draft
      const existing = studentDataRef.current[blockId];
      if (existing?.submitted && data.draft && !data.submitted) {
        return; // silently discard stale draft saves
      }

      // Update ref immediately (synchronous) so concurrent calls see correct state
      studentDataRef.current = { ...studentDataRef.current, [blockId]: data };
      setRealStudentData((prev) => ({ ...prev, [blockId]: data }));

      // Persist ONLY this block using dot-notation so other blocks are never overwritten.
      // updateDoc uses "answers.blockId" as a nested field path (correct).
      // The setDoc fallback uses a nested object + merge:true to achieve the same safely.
      //
      // Retries with exponential backoff on failure — previously, a single failed
      // updateDoc would silently drop the answer (only logged to console). With
      // school wifi that can be spotty, transient Firestore errors are expected.
      // The engagement timer always saves the cumulative total so it self-heals,
      // but answer writes are per-block and must each succeed individually.
      if (user) {
        const seq = (writeSeqRef.current[blockId] || 0) + 1;
        writeSeqRef.current[blockId] = seq;
        const MAX_RETRIES = 3;

        for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
          // Abort if a newer write has started for this block
          if (writeSeqRef.current[blockId] !== seq) return;

          try {
            const progressRef = doc(
              db, "progress", user.uid, "courses", courseId, "lessons", lessonId
            );
            try {
              await updateDoc(progressRef, {
                [`answers.${blockId}`]: data,
                lastUpdated: new Date(),
              });
            } catch (updateErr) {
              // Document doesn't exist yet (first answer) — create it.
              // Use setDoc with merge:true and a nested answers object so
              // concurrent first-answer saves don't overwrite each other.
              if (updateErr.code === "not-found") {
                await setDoc(progressRef, {
                  answers: { [blockId]: data },
                  lastUpdated: new Date(),
                }, { merge: true });
              } else {
                throw updateErr;
              }
            }
            // Write succeeded — clear any previous save error
            setSaveError(null);
            return;
          } catch (err) {
            if (attempt < MAX_RETRIES) {
              // Exponential backoff: 1s, 2s, 4s
              const backoff = Math.min(1000 * Math.pow(2, attempt), 8000);
              await new Promise((resolve) => setTimeout(resolve, backoff));
            } else {
              console.error(`Failed to save answer for ${blockId} after ${MAX_RETRIES + 1} attempts:`, err);
              setSaveError(`Some answers may not have saved. Check your connection and try again.`);
            }
          }
        }
      }
    },
    [user, courseId, lessonId, isPreviewActive]
  );

  // Student requests manual review of an AI-graded answer.
  // Uses dot-notation to update ONLY review fields — must NOT use handleAnswer
  // because that overwrites the entire answer object including grading data.
  const handleRequestReview = useCallback(
    async (blockId, note) => {
      if (!user || isPreviewActive) return;
      const progressRef = doc(
        db, "progress", user.uid, "courses", courseId, "lessons", lessonId
      );
      await updateDoc(progressRef, {
        [`answers.${blockId}.reviewRequested`]: true,
        [`answers.${blockId}.reviewRequestedAt`]: new Date().toISOString(),
        [`answers.${blockId}.reviewNote`]: note || null,
      });
      setRealStudentData((prev) => ({
        ...prev,
        [blockId]: {
          ...prev[blockId],
          reviewRequested: true,
          reviewRequestedAt: new Date().toISOString(),
          reviewNote: note || null,
        },
      }));
    },
    [user, courseId, lessonId, isPreviewActive]
  );

  const handleChatLog = useCallback((blockId, messages) => {
    if (isPreviewActive) return;
    setRealChatLogs((prev) => ({ ...prev, [blockId]: messages }));
  }, [isPreviewActive]);

  // Teacher: reset own progress so lesson can be demoed fresh
  const resetMyProgress = async () => {
    if (!user || !confirm("Reset your progress on this lesson? All your answers will be cleared.")) return;
    try {
      const progressRef = doc(db, "progress", user.uid, "courses", courseId, "lessons", lessonId);
      await deleteDoc(progressRef);
      setRealStudentData({});
      setLessonCompleted(false);
      studentDataRef.current = {};
    } catch (err) {
      console.error("Failed to reset progress:", err);
      alert("Failed to reset. Check the console for details.");
    }
  };

  const translatedTitle = useTranslatedText(lesson?.title);
  const translatedUnit = useTranslatedText(lesson?.unit || lesson?.course);

  // FIX #16: Memoize block extra props so they only recalculate when dependencies change
  const blocksWithProps = useMemo(() => {
    if (!lesson?.blocks) return [];
    return lesson.blocks.map((block) => {
      const extraProps = {};
      if (block.type === "chatbot") {
        extraProps.lessonId = lessonId;
        extraProps.courseId = courseId;
        extraProps.getToken = getToken;
        extraProps.onLog = handleChatLog;
        extraProps.studentData = studentData;
        extraProps.onAnswer = handleAnswer;
      }
      if (block.type === "sorting") {
        extraProps.studentData = studentData;
        extraProps.onAnswer = handleAnswer;
      }
      if (block.type === "checklist") {
        extraProps.studentData = studentData;
        extraProps.onAnswer = handleAnswer;
      }
      if (block.type === "question") {
        extraProps.studentData = studentData;
        extraProps.onAnswer = handleAnswer;
        extraProps.onRequestReview = handleRequestReview;
        extraProps.courseId = courseId;
        extraProps.lessonCompleted = lessonCompleted;
      }
      if (block.type === "calculator") {
        extraProps.lessonId = lessonId;
        extraProps.courseId = courseId;
      }
      if (block.type === "data_table") {
        extraProps.lessonId = lessonId;
        extraProps.courseId = courseId;
        extraProps.studentData = studentData;
        extraProps.onAnswer = handleAnswer;
      }
      if (block.type === "bar_chart") {
        extraProps.studentData = studentData;
        extraProps.onAnswer = handleAnswer;
      }
      if (block.type === "sketch") {
        extraProps.studentData = studentData;
        extraProps.onAnswer = handleAnswer;
      }
      if (block.type === "evidence_upload" || block.type === "media_upload") {
        extraProps.studentData = studentData;
        extraProps.onAnswer = handleAnswer;
      }
      if (block.type === "simulation") {
        extraProps.studentData = studentData;
        extraProps.onAnswer = handleAnswer;
      }
      if (block.type === "guess_who") {
        extraProps.courseId = courseId;
        extraProps.lessonId = lessonId;
      }
      if (block.type === "chatbot_workshop") {
        extraProps.courseId = courseId;
        extraProps.lessonId = lessonId;
      }
      if (block.type === "bias_detective") {
        extraProps.courseId = courseId;
        extraProps.lessonId = lessonId;
      }
      if (block.type === "embed") {
        extraProps.courseId = courseId;
        extraProps.lessonId = lessonId;
        extraProps.user = user;
        extraProps.onAnswer = handleAnswer;
        extraProps.studentData = studentData;
        extraProps.isTestStudent = isTestStudent;
      }
      if (block.type === "rocket_staging") {
        extraProps.studentData = studentData;
        extraProps.onAnswer = handleAnswer;
      }
      if (block.type === "concept_builder") {
        extraProps.studentData = studentData;
        extraProps.onAnswer = handleAnswer;
        extraProps.courseId = courseId;
      }
      if (block.type === "momentum_mystery_lab") {
        extraProps.courseId = courseId;
        extraProps.lessonId = lessonId;
      }
      if (block.type === "score_tally") {
        extraProps.studentData = studentData;
      }
      return { block, extraProps };
    });
  }, [lesson?.blocks, lessonId, courseId, getToken, handleChatLog, studentData, handleAnswer, lessonCompleted]);

  if (loading) {
    return (
      <div className="lesson-layout">
        <main className="lesson-content" id="main-content">
          <div className="skeleton skeleton-line" style={{ width: 120, height: 13, marginBottom: 16 }} />
          <div style={{ marginBottom: 32, paddingBottom: 24, borderBottom: "1px solid var(--border)" }}>
            <div className="skeleton skeleton-line" style={{ width: 100, height: 12, marginBottom: 10 }} />
            <div className="skeleton skeleton-line" style={{ width: "70%", height: 36 }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div className="skeleton skeleton-rect" style={{ width: "100%", height: 120 }} />
            <div className="skeleton skeleton-rect" style={{ width: "100%", height: 80 }} />
            <div className="skeleton skeleton-rect" style={{ width: "100%", height: 160 }} />
            <div className="skeleton skeleton-rect" style={{ width: "100%", height: 100 }} />
          </div>
        </main>
        <aside className="progress-sidebar" aria-label="Lesson progress">
          <div className="skeleton skeleton-circle" style={{ width: 80, height: 80, margin: "0 auto 16px" }} />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton skeleton-line" style={{ width: `${60 + i * 8}%`, height: 14, marginBottom: 10 }} />
          ))}
        </aside>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="page-container" style={{ textAlign: "center", paddingTop: 120 }}>
        <h2 style={{ fontFamily: "var(--font-display)" }}>Lesson not found</h2>
        <p style={{ color: "var(--text2)", marginTop: 8 }}>This lesson may not exist or you may not have access.</p>
      </div>
    );
  }

  const telemetryCourseId = isStudent ? courseId : null;
  const telemetryLessonId = isStudent ? lessonId : null;

  return (
    <TelemetryProvider courseId={telemetryCourseId} lessonId={telemetryLessonId}>
      <div className="lesson-layout">
        <main className="lesson-content" id="main-content">
          {/* Back to course — students only */}
          {userRole !== "teacher" && !isPreview && (
            <Link to={`/course/${courseId}`} style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              fontSize: 13, color: "var(--text3)", textDecoration: "none",
              marginBottom: 16, fontWeight: 600,
            }}>
              ← Back to Course
            </Link>
          )}

          {/* Teacher toolbar — preview launcher + reset button */}
          {userRole === "teacher" && !isPreview && (
            <div style={{ marginBottom: 24, display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                className="btn btn-secondary"
                onClick={resetMyProgress}
                style={{ fontSize: 13, padding: "8px 14px", color: "var(--red)", borderColor: "var(--red)" }}
                title="Clear your own answers so you can demo this lesson fresh"
              >
                🔄 Reset My Progress
              </button>
              <PreviewLauncher sourceLocation={{ courseId, lessonId }} />
            </div>
          )}

          {/* Save error banner — visible when Firestore writes fail after retries */}
          {saveError && (
            <div role="alert" style={{
              background: "rgba(245,166,35,0.1)", border: "1px solid var(--amber)",
              borderRadius: 10, padding: "10px 16px", marginBottom: 16,
              display: "flex", alignItems: "center", gap: 10, fontSize: 13,
              color: "var(--amber)", fontWeight: 600,
            }}>
              <span>⚠️</span>
              <span>{saveError}</span>
            </div>
          )}

          {/* Lesson hero */}
          <div style={{
            marginBottom: 32, paddingBottom: 24, borderBottom: "1px solid var(--border)",
          }}>
            <div style={{
              fontSize: 12, fontWeight: 600, textTransform: "uppercase",
              letterSpacing: "0.1em", color: "var(--amber)", marginBottom: 10,
            }}>
              {translatedUnit}
            </div>
            <h1 style={{
              fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 700,
              lineHeight: 1.15, letterSpacing: "-0.02em",
            }} data-translatable>
              {translatedTitle}
            </h1>
            {(() => {
              const d = lesson.dueDate;
              const label = d
                ? `Due ${new Date(d + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" })}`
                : "Due TBD";
              const now = new Date();
              const isPastDue = d && new Date(d + "T23:59:59") < now;
              const isToday = d === `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
              const color = isPastDue ? "var(--red)" : isToday ? "var(--amber)" : "var(--text3)";
              return (
                <div style={{
                  marginTop: 10, fontSize: 13, fontWeight: 500, color,
                  display: "inline-flex", alignItems: "center", gap: 6,
                }}>
                  {isPastDue ? "⚠️ " : isToday ? "📌 " : ""}{label}
                </div>
              );
            })()}
          </div>

          {/* Blocks */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {blocksWithProps.map(({ block, extraProps }) => (
              <div key={block.id} id={block.type === "section_header" ? block.id : undefined} data-block-id={block.id}>
                <BlockRenderer block={block} extraProps={extraProps} />
              </div>
            ))}
          </div>

          {/* Complete Lesson — students and teacher preview */}
          {(userRole !== "teacher" || isPreview) && (
            <LessonCompleteButton
              lesson={lesson}
              studentData={studentData}
              chatLogs={chatLogs}
              user={user}
              courseId={courseId}
              lessonId={lessonId}
            />
          )}
        </main>

        <ProgressSidebar lesson={lesson} studentData={studentData} chatLogs={chatLogs} courseId={courseId} engagementSeconds={engagementSeconds} />
      </div>
    </TelemetryProvider>
  );
}