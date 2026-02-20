// src/components/LessonCompleteButton.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth";
import { awardXP, getXPConfig, DEFAULT_XP_VALUES, getStudentGamification, updateStudentGamification } from "../lib/gamification";
import { useTranslatedTexts } from "../hooks/useTranslatedText.jsx";

const VALIDATE_REFLECTION_URL =
  import.meta.env.VITE_VALIDATE_REFLECTION_URL || "https://us-central1-pantherlearn-d6f7c.cloudfunctions.net/validateReflection";

export default function LessonCompleteButton({ lesson, studentData, chatLogs, user, courseId, lessonId }) {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [completing, setCompleting] = useState(false);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [xpConfig, setXpConfig] = useState(null);

  // Reflection modal state
  const [showReflection, setShowReflection] = useState(false);
  const [reflectionText, setReflectionText] = useState("");
  const [validating, setValidating] = useState(false);
  const [reflectionFeedback, setReflectionFeedback] = useState(null);
  const [reflectionValid, setReflectionValid] = useState(false);
  const [alreadyReflected, setAlreadyReflected] = useState(false);

  const uiStrings = useTranslatedTexts([
    "Complete Lesson",           // 0
    "Completing...",             // 1
    "What did I learn today?",   // 2
    "Take a moment to reflect on what you learned in this lesson. Write a few sentences about what stood out to you.", // 3
    "Write your reflection here...", // 4
    "Submit Reflection",         // 5
    "Validating...",             // 6
    "Skip",                      // 7
    "Mark this lesson as done and return to course", // 8
    "Finish all activities first", // 9
    "remaining",                  // 10
  ]);
  const ui = (i, fallback) => uiStrings?.[i] ?? fallback;

  useEffect(() => {
    if (courseId) {
      getXPConfig(courseId).then(setXpConfig).catch(() => setXpConfig(null));
    }
  }, [courseId]);

  // Check if already reflected for this lesson
  useEffect(() => {
    if (!user || !courseId || !lessonId) return;
    const checkExisting = async () => {
      try {
        const ref = doc(db, "courses", courseId, "reflections", `${user.uid}_${lessonId}`);
        const snap = await getDoc(ref);
        if (snap.exists() && snap.data().valid) {
          setAlreadyReflected(true);
        }
      } catch (e) { /* no reflection yet */ }
    };
    checkExisting();
  }, [user, courseId, lessonId]);

  const getXPValue = (key) => {
    return xpConfig?.xpValues?.[key] ?? DEFAULT_XP_VALUES[key] ?? 0;
  };

  const blocks = lesson.blocks || [];
  const questionBlocks = blocks.filter((b) => b.type === "question");
  const chatbotBlocks = blocks.filter((b) => b.type === "chatbot");
  const checklistBlocks = blocks.filter((b) => b.type === "checklist");

  const allQuestionsAnswered = questionBlocks.every((b) => studentData[b.id]?.submitted);
  const allChatbotsUsed = chatbotBlocks.every((b) => chatLogs[b.id]?.length > 0);
  const allChecklistsDone = checklistBlocks.every((b) => {
    const items = b.items || [];
    if (items.length === 0) return true;
    const checked = studentData[b.id]?.checked || {};
    return items.every((_, i) => checked[i]);
  });

  const allComplete = allQuestionsAnswered && allChatbotsUsed && allChecklistsDone;

  const remaining = [];
  const unansweredQ = questionBlocks.filter((b) => !studentData[b.id]?.submitted).length;
  const unusedChat = chatbotBlocks.filter((b) => !chatLogs[b.id]?.length).length;
  const uncheckedLists = checklistBlocks.filter((b) => {
    const items = b.items || [];
    if (items.length === 0) return false;
    const checked = studentData[b.id]?.checked || {};
    return !items.every((_, i) => checked[i]);
  }).length;
  if (unansweredQ) remaining.push(`${unansweredQ} question${unansweredQ > 1 ? "s" : ""}`);
  if (unusedChat) remaining.push(`${unusedChat} chatbot${unusedChat > 1 ? "s" : ""}`);
  if (uncheckedLists) remaining.push(`${uncheckedLists} checklist${uncheckedLists > 1 ? "s" : ""}`);

  const handleClickComplete = () => {
    if (!allComplete || completing) return;
    // If already reflected for this lesson, skip the modal
    if (alreadyReflected) {
      finishLesson();
    } else {
      setShowReflection(true);
    }
  };

  const handleSubmitReflection = async () => {
    if (!reflectionText.trim() || validating) return;
    setValidating(true);
    setReflectionFeedback(null);

    try {
      const authToken = await getToken();
      const response = await fetch(VALIDATE_REFLECTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          courseId,
          lessonId,
          lessonTitle: lesson.title || "",
          reflection: reflectionText.trim(),
        }),
      });

      const result = await response.json();
      setReflectionFeedback(result.feedback);
      setReflectionValid(result.valid);

      if (result.valid) {
        // Award reflection XP
        try {
          const baseXP = getXPValue("reflection") || 10;
          await awardXP(user.uid, baseXP, "reflection", courseId);
        } catch (e) {
          console.warn("Could not award reflection XP:", e);
        }

        // Save as a gradebook entry
        try {
          const today = new Date().toISOString().slice(0, 10);
          const gradeRef = doc(
            db, "courses", courseId, "grades", `reflection_${user.uid}_${lessonId}`
          );
          await setDoc(gradeRef, {
            studentId: user.uid,
            studentName: user.displayName || "Unknown",
            type: "reflection",
            lessonId,
            lessonTitle: lesson.title || "",
            response: reflectionText.trim(),
            score: 100,
            maxScore: 100,
            date: today,
            gradedAt: new Date(),
            autoGraded: true,
            category: "Daily Reflection",
          });

          // Also save to reflections collection (read by MyGrades + StudentProgress)
          const reflRef = doc(db, "courses", courseId, "reflections", `${user.uid}_${lessonId}`);
          await setDoc(reflRef, {
            studentId: user.uid,
            lessonId,
            response: reflectionText.trim(),
            valid: true,
            skipped: false,
            savedAt: new Date(),
          });
        } catch (e) {
          console.warn("Could not save gradebook entry:", e);
        }

        setAlreadyReflected(true);
        // Auto-proceed after a brief pause to show the success message
        setTimeout(() => {
          setShowReflection(false);
          finishLesson();
        }, 1500);
      }
    } catch (e) {
      console.error("Reflection validation error:", e);
      setReflectionFeedback("Something went wrong. Your reflection has been saved — please continue.");
      setReflectionValid(true);
      setTimeout(() => {
        setShowReflection(false);
        finishLesson();
      }, 1500);
    }

    setValidating(false);
  };

  const [showSkipConfirm, setShowSkipConfirm] = useState(false);

  const handleSkipReflection = async () => {
    // Save a 0/100 gradebook entry
    try {
      const today = new Date().toISOString().slice(0, 10);
      const gradeRef = doc(
        db, "courses", courseId, "grades", `reflection_${user.uid}_${lessonId}`
      );
      await setDoc(gradeRef, {
        studentId: user.uid,
        studentName: user.displayName || "Unknown",
        type: "reflection",
        lessonId,
        lessonTitle: lesson.title || "",
        response: "(skipped)",
        score: 0,
        maxScore: 100,
        date: today,
        gradedAt: new Date(),
        autoGraded: true,
        skipped: true,
        category: "Daily Reflection",
      });

      // Also save to reflections collection (read by MyGrades + StudentProgress)
      const reflRef = doc(db, "courses", courseId, "reflections", `${user.uid}_${lessonId}`);
      await setDoc(reflRef, {
        studentId: user.uid,
        lessonId,
        response: "(skipped)",
        valid: false,
        skipped: true,
        savedAt: new Date(),
      });
    } catch (e) {
      console.warn("Could not save skipped grade:", e);
    }
    setShowReflection(false);
    setShowSkipConfirm(false);
    finishLesson();
  };

  const finishLesson = async () => {
    if (completing) return;
    setCompleting(true);
    try {
      if (user) {
        const progressRef = doc(
          db, "progress", user.uid, "courses", courseId, "lessons", lessonId
        );
        await setDoc(progressRef, {
          completedAt: new Date(),
          completed: true,
        }, { merge: true });
        setLessonCompleted(true);

        try {
          const baseXP = getXPValue("lesson_complete");
          await awardXP(user.uid, baseXP, "lesson_complete", courseId);
        } catch (e) {
          console.warn("Could not award XP:", e);
        }

        // Increment lessonsCompleted + check badges
        try {
          const currentGam = await getStudentGamification(user.uid, courseId);
          await updateStudentGamification(user.uid, {
            lessonsCompleted: (currentGam.lessonsCompleted || 0) + 1,
          }, courseId);
        } catch (e) {
          console.warn("Could not update lesson count / badges:", e);
        }
      }
      navigate(`/course/${courseId}`);
    } catch (e) {
      console.error("Failed to complete lesson:", e);
      setCompleting(false);
    }
  };

  // -- Styles --
  const modalOverlay = {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 9999, padding: 20,
  };

  const modalBox = {
    background: "var(--surface, #1e2030)", borderRadius: 16,
    padding: "32px 28px", maxWidth: 520, width: "100%",
    border: "1px solid var(--border, #2a2f3d)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
  };

  return (
    <>
      <div style={{
        marginTop: 48, paddingTop: 32, borderTop: "1px solid var(--border)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
      }}>
        <button
          onClick={handleClickComplete}
          disabled={completing || !allComplete}
          style={{
            padding: "14px 48px",
            fontSize: 16,
            fontWeight: 700,
            fontFamily: "var(--font-display)",
            background: !allComplete ? "var(--surface2)" : completing ? "var(--surface2)" : "var(--amber)",
            color: !allComplete ? "var(--text3)" : completing ? "var(--text3)" : "#1a1a1a",
            border: "none",
            borderRadius: 12,
            cursor: !allComplete || completing ? "default" : "pointer",
            transition: "all 0.2s",
            opacity: !allComplete ? 0.5 : 1,
          }}
        >
          {completing ? ui(1, "Completing...") : !allComplete ? `🔒 ${ui(0, "Complete Lesson")}` : `✅ ${ui(0, "Complete Lesson")}`}
        </button>
        <span style={{ fontSize: 12, color: "var(--text3)" }}>
          {allComplete
            ? ui(8, "Mark this lesson as done and return to course")
            : `${ui(9, "Finish all activities first")} — ${remaining.join(", ")} ${ui(10, "remaining")}`
          }
        </span>
      </div>

      {/* Reflection Modal */}
      {showReflection && (
        <div style={modalOverlay} onClick={(e) => e.target === e.currentTarget && setShowSkipConfirm(true)}>
          <div style={modalBox}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>💭</div>
              <h2 style={{
                fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700,
                color: "var(--text, #fff)", marginBottom: 6,
              }}>
                {ui(2, "What did I learn today?")}
              </h2>
              <p style={{ fontSize: 13, color: "var(--text3, #888)", lineHeight: 1.5 }}>
                {ui(3, "Take a moment to reflect on what you learned in this lesson. Write a few sentences about what stood out to you.")}
              </p>
            </div>

            <textarea
              value={reflectionText}
              onChange={(e) => {
                setReflectionText(e.target.value);
                setReflectionFeedback(null);
                setReflectionValid(false);
              }}
              placeholder={ui(4, "Write your reflection here...")}
              rows={5}
              style={{
                width: "100%", padding: "14px 16px", borderRadius: 10,
                border: "1.5px solid var(--border, #2a2f3d)",
                background: "var(--bg, #141520)", color: "var(--text, #fff)",
                fontFamily: "var(--font-body)", fontSize: 15, resize: "vertical",
                outline: "none", lineHeight: 1.6,
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => e.target.style.borderColor = "var(--amber, #f5a623)"}
              onBlur={(e) => e.target.style.borderColor = "var(--border, #2a2f3d)"}
              disabled={validating || reflectionValid}
              autoFocus
            />

            {/* Feedback message */}
            {reflectionFeedback && (
              <div style={{
                marginTop: 12, padding: "10px 14px", borderRadius: 8,
                background: reflectionValid
                  ? "rgba(16, 185, 129, 0.1)"
                  : "rgba(239, 68, 68, 0.1)",
                border: `1px solid ${reflectionValid ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
                color: reflectionValid ? "var(--green, #10b981)" : "var(--red, #ef4444)",
                fontSize: 13, lineHeight: 1.5,
              }}>
                {reflectionValid ? "✨ " : "✏️ "}{reflectionFeedback}
                {reflectionValid && (
                  <span style={{ display: "block", marginTop: 4, fontSize: 12, opacity: 0.8 }}>
                    +{getXPValue("reflection") || 10} XP earned!
                  </span>
                )}
              </div>
            )}

            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button
                onClick={handleSubmitReflection}
                disabled={!reflectionText.trim() || validating || reflectionValid}
                style={{
                  flex: 1, padding: "12px 20px", borderRadius: 10, border: "none",
                  background: !reflectionText.trim() || validating || reflectionValid
                    ? "var(--surface2, #2a2f3d)" : "var(--amber, #f5a623)",
                  color: !reflectionText.trim() || validating || reflectionValid
                    ? "var(--text3, #888)" : "#1a1a1a",
                  fontWeight: 700, fontSize: 14, fontFamily: "var(--font-display)",
                  cursor: !reflectionText.trim() || validating || reflectionValid ? "default" : "pointer",
                  transition: "all 0.2s",
                }}
              >
                {validating ? ui(6, "Validating...") : reflectionValid ? "✅ Done!" : ui(5, "Submit Reflection")}
              </button>
              {!reflectionValid && !showSkipConfirm && (
                <button
                  onClick={() => setShowSkipConfirm(true)}
                  disabled={validating}
                  style={{
                    padding: "12px 20px", borderRadius: 10,
                    border: "1px solid var(--border, #2a2f3d)",
                    background: "transparent", color: "var(--text3, #888)",
                    fontWeight: 600, fontSize: 13, cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {ui(7, "Skip")}
                </button>
              )}
            </div>

            {/* Skip confirmation warning */}
            {showSkipConfirm && !reflectionValid && (
              <div style={{
                marginTop: 12, padding: "12px 14px", borderRadius: 8,
                background: "rgba(239, 68, 68, 0.08)",
                border: "1px solid rgba(239, 68, 68, 0.25)",
              }}>
                <p style={{ fontSize: 13, color: "var(--red, #ef4444)", fontWeight: 600, marginBottom: 8 }}>
                  ⚠️ Skipping will record a 0% for this reflection grade.
                </p>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={handleSkipReflection}
                    style={{
                      padding: "8px 16px", borderRadius: 8, border: "none",
                      background: "var(--red, #ef4444)", color: "#fff",
                      fontWeight: 700, fontSize: 12, cursor: "pointer",
                    }}
                  >
                    Skip Anyway (0%)
                  </button>
                  <button
                    onClick={() => setShowSkipConfirm(false)}
                    style={{
                      padding: "8px 16px", borderRadius: 8,
                      border: "1px solid var(--border, #2a2f3d)",
                      background: "transparent", color: "var(--text, #fff)",
                      fontWeight: 600, fontSize: 12, cursor: "pointer",
                    }}
                  >
                    Go Back
                  </button>
                </div>
              </div>
            )}

            <p style={{ fontSize: 11, color: "var(--text3, #888)", textAlign: "center", marginTop: 12, opacity: 0.6 }}>
              Reflections count as a daily participation grade
            </p>
          </div>
        </div>
      )}
    </>
  );
}
