// src/components/LessonCompleteButton.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { awardXP } from "../lib/gamification";

export default function LessonCompleteButton({ lesson, studentData, chatLogs, user, courseId, lessonId }) {
  const navigate = useNavigate();
  const [completing, setCompleting] = useState(false);
  const [lessonCompleted, setLessonCompleted] = useState(false);

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

  const handleComplete = async () => {
    if (completing || !allComplete) return;
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
          await awardXP(user.uid, courseId, "lesson_complete", { lessonId });
        } catch (e) {
          console.warn("Could not award XP:", e);
        }
      }
      navigate(`/course/${courseId}`);
    } catch (e) {
      console.error("Failed to complete lesson:", e);
      setCompleting(false);
    }
  };

  return (
    <div style={{
      marginTop: 48, paddingTop: 32, borderTop: "1px solid var(--border)",
      display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
    }}>
      <button
        onClick={handleComplete}
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
        {completing ? "Completing..." : !allComplete ? "🔒 Complete Lesson" : "✅ Complete Lesson"}
      </button>
      <span style={{ fontSize: 12, color: "var(--text3)" }}>
        {allComplete
          ? "Mark this lesson as done and return to course"
          : `Finish all activities first — ${remaining.join(", ")} remaining`
        }
      </span>
    </div>
  );
}