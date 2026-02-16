// src/pages/LessonViewer.jsx
import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth";
import TextBlock from "../components/blocks/TextBlock";
import VideoBlock from "../components/blocks/VideoBlock";
import QuestionBlock from "../components/blocks/QuestionBlock";
import ChatbotBlock from "../components/blocks/ChatbotBlock";
import DefinitionBlock from "../components/blocks/DefinitionBlock";
import CalloutBlock from "../components/blocks/CalloutBlock";
import ObjectivesBlock from "../components/blocks/ObjectivesBlock";
import ActivityBlock from "../components/blocks/ActivityBlock";
import VocabListBlock from "../components/blocks/VocabListBlock";
import SectionHeader from "../components/blocks/SectionHeader";
import ImageBlock from "../components/blocks/ImageBlock";
import ChecklistBlock from "../components/blocks/ChecklistBlock";
import EmbedBlock from "../components/blocks/EmbedBlock";
import DividerBlock from "../components/blocks/DividerBlock";
import SortingBlock from "../components/blocks/SortingBlock";
import ProgressSidebar from "../components/ProgressSidebar";
import { useTranslatedText } from "../hooks/useTranslatedText.jsx";
import { usePreview } from "../contexts/PreviewContext";
import { usePreviewData } from "../hooks/usePreviewData";
import PreviewLauncher from "../components/PreviewLauncher";
import { awardXP } from "../lib/gamification";

export default function LessonViewer() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { user, userRole, getToken } = useAuth();
  const { isPreview } = usePreview();
  const [lesson, setLesson] = useState(null);
  const [realStudentData, setRealStudentData] = useState({});
  const [realChatLogs, setRealChatLogs] = useState({});
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
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

  // Fetch lesson data
  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const lessonRef = doc(db, "courses", courseId, "lessons", lessonId);
        const lessonDoc = await getDoc(lessonRef);
        if (lessonDoc.exists()) {
          setLesson({ id: lessonDoc.id, ...lessonDoc.data() });
        }

        // Fetch student progress
        if (user) {
          const progressRef = doc(
            db, "progress", user.uid, "courses", courseId, "lessons", lessonId
          );
          const progressDoc = await getDoc(progressRef);
          if (progressDoc.exists()) {
            setRealStudentData(progressDoc.data().answers || {});
            if (progressDoc.data().completed) setLessonCompleted(true);
          }
        }
      } catch (err) {
        console.error("Error fetching lesson:", err);
      }
      setLoading(false);
    };
    fetchLesson();
  }, [courseId, lessonId, user]);

  // Save answer to Firestore (skipped during preview)
  const handleAnswer = useCallback(
    async (blockId, data) => {
      if (isPreviewActive) {
        // In preview mode, update local state visually but don't write to Firestore
        setRealStudentData((prev) => ({ ...prev, [blockId]: data }));
        return;
      }

      setRealStudentData((prev) => {
        const updated = { ...prev, [blockId]: data };

        // Persist to Firestore
        if (user) {
          const progressRef = doc(
            db, "progress", user.uid, "courses", courseId, "lessons", lessonId
          );
          setDoc(progressRef, { answers: updated, lastUpdated: new Date() }, { merge: true });
        }

        return updated;
      });
    },
    [user, courseId, lessonId, isPreviewActive]
  );

  const handleChatLog = useCallback((blockId, messages) => {
    if (isPreviewActive) return; // No-op during preview
    setRealChatLogs((prev) => ({ ...prev, [blockId]: messages }));
  }, [isPreviewActive]);

  const translatedTitle = useTranslatedText(lesson?.title);
  const translatedUnit = useTranslatedText(lesson?.unit || lesson?.course);

  if (loading) {
    return (
      <div className="page-container" style={{ display: "flex", justifyContent: "center", paddingTop: 120 }}>
        <div className="spinner" />
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

  const renderBlock = (block) => {
    switch (block.type) {
      case "section_header":
        return <SectionHeader key={block.id} block={block} />;
      case "text":
        return <TextBlock key={block.id} block={block} />;
      case "video":
        return <VideoBlock key={block.id} block={block} />;
      case "image":
        return <ImageBlock key={block.id} block={block} />;
      case "definition":
        return <DefinitionBlock key={block.id} block={block} />;
      case "callout":
        return <CalloutBlock key={block.id} block={block} />;
      case "objectives":
        return <ObjectivesBlock key={block.id} block={block} />;
      case "activity":
        return <ActivityBlock key={block.id} block={block} />;
      case "vocab_list":
        return <VocabListBlock key={block.id} block={block} />;
      case "checklist":
        return <ChecklistBlock key={block.id} block={block} />;
      case "embed":
        return <EmbedBlock key={block.id} block={block} />;
      case "divider":
        return <DividerBlock key={block.id} />;
      case "sorting":
        return <SortingBlock key={block.id} block={block} />;
      case "chatbot":
        return (
          <ChatbotBlock
            key={block.id}
            block={block}
            lessonId={lessonId}
            courseId={courseId}
            getToken={getToken}
            onLog={handleChatLog}
          />
        );
      case "question":
        return (
          <QuestionBlock
            key={block.id}
            block={block}
            studentData={studentData}
            onAnswer={handleAnswer}
            courseId={courseId}
            lessonCompleted={lessonCompleted}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="lesson-layout">
      <div className="lesson-content">
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

        {/* Preview launcher — only visible to teachers when NOT already previewing */}
        {userRole === "teacher" && !isPreview && (
          <div style={{ marginBottom: 24, display: "flex", justifyContent: "flex-end" }}>
            <PreviewLauncher sourceLocation={{ courseId, lessonId }} />
          </div>
        )}

        {/* Lesson hero */}
        <div style={{
          marginBottom: 48, paddingBottom: 36, borderBottom: "1px solid var(--border)",
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
        </div>

        {/* Blocks */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {(lesson.blocks || []).map((block) => {
            const el = renderBlock(block);
            if (block.type === "section_header") {
              return <div key={block.id} id={block.id}>{el}</div>;
            }
            return el;
          })}
        </div>

        {/* Complete Lesson — students only */}
        {userRole !== "teacher" && !isPreview && (() => {
          // Check if all interactive blocks have been completed
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

          return (
            <div style={{
              marginTop: 48, paddingTop: 32, borderTop: "1px solid var(--border)",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
            }}>
              <button
                onClick={async () => {
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
                }}
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
        })()}
      </div>

      <ProgressSidebar lesson={lesson} studentData={studentData} chatLogs={chatLogs} courseId={courseId} />
    </div>
  );
}
