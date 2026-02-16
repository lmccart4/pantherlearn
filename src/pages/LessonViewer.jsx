// src/pages/LessonViewer.jsx
import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth";
import BlockRenderer from "../components/blocks/BlockRenderer";
import ProgressSidebar from "../components/ProgressSidebar";
import LessonCompleteButton from "../components/LessonCompleteButton";
import { useTranslatedText } from "../hooks/useTranslatedText.jsx";
import { usePreview } from "../contexts/PreviewContext";
import { usePreviewData } from "../hooks/usePreviewData";
import PreviewLauncher from "../components/PreviewLauncher";

export default function LessonViewer() {
  const { courseId, lessonId } = useParams();
  const { user, userRole, getToken } = useAuth();
  const { isPreview } = usePreview();
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
        setRealStudentData((prev) => ({ ...prev, [blockId]: data }));
        return;
      }

      setRealStudentData((prev) => {
        const updated = { ...prev, [blockId]: data };

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
    if (isPreviewActive) return;
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
            const extraProps = {};
            if (block.type === "chatbot") {
              extraProps.lessonId = lessonId;
              extraProps.courseId = courseId;
              extraProps.getToken = getToken;
              extraProps.onLog = handleChatLog;
            }
            if (block.type === "question") {
              extraProps.studentData = studentData;
              extraProps.onAnswer = handleAnswer;
              extraProps.courseId = courseId;
              extraProps.lessonCompleted = lessonCompleted;
            }

            const el = <BlockRenderer key={block.id} block={block} extraProps={extraProps} />;

            if (block.type === "section_header") {
              return <div key={block.id} id={block.id}>{el}</div>;
            }
            return el;
          })}
        </div>

        {/* Complete Lesson — students only */}
        {userRole !== "teacher" && !isPreview && (
          <LessonCompleteButton
            lesson={lesson}
            studentData={studentData}
            chatLogs={chatLogs}
            user={user}
            courseId={courseId}
            lessonId={lessonId}
          />
        )}
      </div>

      <ProgressSidebar lesson={lesson} studentData={studentData} chatLogs={chatLogs} courseId={courseId} />
    </div>
  );
}