// src/pages/LessonViewer.jsx
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
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

export default function LessonViewer() {
  const { courseId, lessonId } = useParams();
  const { user, userRole, getToken } = useAuth();
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

  // Track latest student data for Firestore writes without stale closures
  const studentDataRef = useRef({});
  useEffect(() => { studentDataRef.current = realStudentData; }, [realStudentData]);


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

      setRealStudentData((prev) => {
        const updated = { ...prev, [blockId]: data };
        studentDataRef.current = updated;
        return updated;
      });

      // Persist to Firestore outside of the state setter
      if (user) {
        try {
          const progressRef = doc(
            db, "progress", user.uid, "courses", courseId, "lessons", lessonId
          );
          await setDoc(progressRef, { answers: studentDataRef.current, lastUpdated: new Date() }, { merge: true });
        } catch (err) {
          console.error("Failed to save answer:", err);
        }
      }
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
      }
      if (block.type === "question") {
        extraProps.studentData = studentData;
        extraProps.onAnswer = handleAnswer;
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
      }
      if (block.type === "bar_chart") {
        extraProps.studentData = studentData;
        extraProps.onAnswer = handleAnswer;
      }
      if (block.type === "sketch") {
        extraProps.studentData = studentData;
        extraProps.onAnswer = handleAnswer;
      }
      return { block, extraProps };
    });
  }, [lesson?.blocks, lessonId, courseId, getToken, handleChatLog, studentData, handleAnswer, lessonCompleted]);

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
        </div>

        {/* Blocks */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {blocksWithProps.map(({ block, extraProps }) => {
            const el = <BlockRenderer key={block.id} block={block} extraProps={extraProps} />;

            if (block.type === "section_header") {
              return <div key={block.id} id={block.id}>{el}</div>;
            }
            return el;
          })}
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
      </div>

      <ProgressSidebar lesson={lesson} studentData={studentData} chatLogs={chatLogs} courseId={courseId} engagementSeconds={engagementSeconds} />
    </div>
  );
}