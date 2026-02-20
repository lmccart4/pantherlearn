// src/pages/CoursePage.jsx
import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc, collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth";
import TeamPanel from "../components/TeamPanel";
import ManaPool from "../components/ManaPool";
import Leaderboard from "../components/Leaderboard";
import { useTranslatedText, useTranslatedTexts } from "../hooks/useTranslatedText.jsx";

export default function CoursePage() {
  const { courseId } = useParams();
  const { user, userRole } = useAuth();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [collapsedUnits, setCollapsedUnits] = useState({});
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const isTeacher = userRole === "teacher";

  // Translate UI chrome
  const uiStrings = useTranslatedTexts([
    "Course not found",          // 0
    "← Back to Dashboard",       // 1
    "No lessons yet",            // 2
    "Your teacher is still building this course.", // 3
    "questions",                 // 4
  ]);
  const ui = (i, fallback) => uiStrings?.[i] ?? fallback;

  // Translate dynamic course content
  const translatedTitle = useTranslatedText(course?.title);
  const translatedDesc = useTranslatedText(course?.description);

  // Translate lesson titles and units in a single batch
  const lessonTexts = lessons.flatMap(l => [l.title, l.unit || ""]);
  const translatedLessonTexts = useTranslatedTexts(lessonTexts);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseDoc = await getDoc(doc(db, "courses", courseId));
        if (courseDoc.exists()) setCourse({ id: courseDoc.id, ...courseDoc.data() });

        try {
          const snapshot = await getDocs(query(collection(db, "courses", courseId, "lessons"), orderBy("order", "asc")));
          const lessonData = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
          lessonData.sort((a, b) => (a.order || 0) - (b.order || 0));
          setLessons(lessonData);
        } catch (e) {
          console.warn("Could not fetch lessons:", e);
        }

        // Fetch student's lesson progress to show completion indicators
        if (userRole !== "teacher" && user) {
          try {
            const progressSnap = await getDocs(
              collection(db, "progress", user.uid, "courses", courseId, "lessons")
            );
            const completed = new Set();
            progressSnap.forEach((d) => {
              if (d.data().completed) completed.add(d.id);
            });
            setCompletedLessons(completed);
          } catch (e) {
            console.warn("Could not fetch lesson progress:", e);
          }
        }

        // Leaderboard is now handled by the Leaderboard component
      } catch (err) {
        console.error("Error fetching course:", err);
      }
      setLoading(false);
    };
    fetchData();
  }, [courseId, user, userRole]);

  // FIX #33: Memoize lesson grouping instead of recalculating in an IIFE on every render
  const visibleLessons = useMemo(() =>
    lessons.filter((lesson) => isTeacher || lesson.visible !== false),
    [lessons, isTeacher]
  );

  const lessonGroups = useMemo(() => {
    const groups = [];
    let currentUnit = null;
    let currentGroup = null;
    let globalNum = 0;
    for (const lesson of visibleLessons) {
      const unit = lesson.unit || "";
      if (unit !== currentUnit) {
        currentUnit = unit;
        currentGroup = { unit, lessons: [] };
        groups.push(currentGroup);
      }
      globalNum++;
      currentGroup.lessons.push({ lesson, num: globalNum });
    }
    return groups;
  }, [visibleLessons]);

  if (loading) return <div className="page-container" style={{ display: "flex", justifyContent: "center", paddingTop: 120 }}><div className="spinner" /></div>;
  if (!course) return <div className="page-container" style={{ textAlign: "center", paddingTop: 120 }}><h2 data-translatable>{ui(0, "Course not found")}</h2></div>;

  return (
    <main id="main-content" className="page-container" style={{ padding: "48px 40px" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <Link to="/" style={{ fontSize: 13, color: "var(--text3)", marginBottom: 16, display: "block" }} data-translatable>{ui(1, "← Back to Dashboard")}</Link>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <div style={{
            fontSize: 40, width: 64, height: 64, borderRadius: 14,
            background: "var(--amber-dim)", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {course.icon || "📚"}
          </div>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700 }} data-translatable>{translatedTitle}</h1>
            <p style={{ color: "var(--text2)", fontSize: 14 }} data-translatable>{translatedDesc}</p>
          </div>
        </div>

        {/* Teacher quick links — English only */}
        {isTeacher && (
          <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
            <Link to={`/xp-controls/${courseId}`} style={{ fontSize: 13, color: "var(--amber)", textDecoration: "none", fontWeight: 600, padding: "6px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)" }}>
              ⚙️ XP Controls
            </Link>
            <Link to={`/teams/${courseId}`} style={{ fontSize: 13, color: "var(--amber)", textDecoration: "none", fontWeight: 600, padding: "6px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)" }}>
              👥 Manage Teams
            </Link>
            <Link to={`/mana/${courseId}`} style={{ fontSize: 13, color: "#8b5cf6", textDecoration: "none", fontWeight: 600, padding: "6px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)" }}>
              🔮 Mana Pool
            </Link>
            <Link to={`/boss-battle/${courseId}`} style={{ fontSize: 13, color: "#e74c3c", textDecoration: "none", fontWeight: 600, padding: "6px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)" }}>
              ⚔️ Boss Battle
            </Link>
          </div>
        )}

        {/* Team Panel (students see their team here) */}
        <TeamPanel courseId={courseId} />

        {/* Mana Pool (visible to all when enabled) */}
        <ManaPool courseId={courseId} />

        {/* Leaderboard — students only, full width above lessons */}
        {!isTeacher && <Leaderboard courseId={courseId} />}

        {/* Lessons */}
        <div>
          <div>
            {lessons.length === 0 ? (
              <div className="card" style={{ textAlign: "center", padding: 60 }}>
                <p data-translatable>{ui(2, "No lessons yet")}</p>
                <p style={{ color: "var(--text2)", fontSize: 14, marginTop: 8 }} data-translatable>{ui(3, "Your teacher is still building this course.")}</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {lessonGroups.map((group) => {
                  const hasUnit = group.unit.trim() !== "";
                  const isCollapsed = hasUnit && collapsedUnits[group.unit];

                  return (
                    <div key={group.unit || "__no_unit__"}>
                      {/* Unit header */}
                      {hasUnit && (
                        <button
                          onClick={() => setCollapsedUnits((prev) => ({ ...prev, [group.unit]: !prev[group.unit] }))}
                          className="card"
                          style={{
                            display: "flex", alignItems: "center", gap: 14, width: "100%",
                            padding: "16px 20px", marginBottom: 8, marginTop: lessonGroups.indexOf(group) > 0 ? 20 : 0,
                            cursor: "pointer", transition: "all 0.15s",
                            borderLeft: "4px solid var(--amber)",
                            textAlign: "left", color: "inherit",
                          }}
                        >
                          <span style={{
                            transition: "transform 0.2s",
                            transform: isCollapsed ? "rotate(-90deg)" : "rotate(0deg)",
                            display: "inline-block", fontSize: 14, color: "var(--amber)",
                          }}>▼</span>
                          <div style={{ flex: 1 }}>
                            <div style={{
                              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18,
                              color: "var(--text1, #e8e8e8)",
                            }}>
                              {group.unit}
                            </div>
                            <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>
                              {group.lessons.length} {group.lessons.length === 1 ? "lesson" : "lessons"}
                            </div>
                          </div>
                        </button>
                      )}

                      {/* Lessons in this group */}
                      {!isCollapsed && group.lessons.map(({ lesson, num }, i) => {
                        const originalIndex = lessons.indexOf(lesson);
                        const tTitle = translatedLessonTexts?.[originalIndex * 2] ?? lesson.title;
                        const tUnit = translatedLessonTexts?.[originalIndex * 2 + 1] || "";
                        const qCount = (lesson.blocks || []).filter((b) => b.type === "question").length;
                        const isCompleted = !isTeacher && completedLessons.has(lesson.id);
                        return (
                          <Link key={lesson.id} to={`/course/${courseId}/lesson/${lesson.id}`}
                            style={{ textDecoration: "none", color: "inherit" }}>
                            <div className="card fade-in" style={{
                              display: "flex", alignItems: "center", gap: 16, cursor: "pointer",
                              animationDelay: `${i * 0.05}s`,
                              marginLeft: hasUnit ? 12 : 0,
                              borderLeft: isCompleted ? "3px solid var(--green, #10b981)" : undefined,
                            }}>
                              <div style={{
                                width: 36, height: 36, borderRadius: 8,
                                background: isCompleted ? "rgba(16, 185, 129, 0.15)" : "var(--surface2)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14,
                                color: isCompleted ? "var(--green, #10b981)" : "var(--amber)",
                              }}>
                                {isCompleted ? "✓" : num}
                              </div>
                              <div>
                                <div style={{ fontWeight: 600, fontSize: 15 }} data-translatable>{tTitle}</div>
                                {isCompleted && (
                                  <div style={{ fontSize: 11, color: "var(--green, #10b981)", fontWeight: 600, marginTop: 1 }}>
                                    Completed
                                  </div>
                                )}
                              </div>
                              <div style={{ marginLeft: "auto", textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
                                <div style={{ color: "var(--text3)", fontSize: 13 }}>
                                  {qCount} {ui(4, "questions")}
                                </div>
                                {(() => {
                                  const effectiveDue = lesson.dueDate;
                                  if (!effectiveDue) return null;
                                  const due = new Date(effectiveDue + "T23:59:59");
                                  const now = new Date();
                                  const isPastDue = due < now;
                                  const isToday = effectiveDue === `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
                                  const isSoon = !isPastDue && !isToday && (due - now) < 2 * 24 * 60 * 60 * 1000;

                                  // Don't show stress-inducing warnings on completed lessons
                                  if (isCompleted) {
                                    return (
                                      <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text3)" }}>
                                        Due {new Date(effectiveDue + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                                      </div>
                                    );
                                  }

                                  return (
                                    <div style={{
                                      fontSize: 11, fontWeight: 600,
                                      color: isPastDue ? "var(--red)" : isToday ? "var(--amber)" : isSoon ? "var(--amber)" : "var(--text3)",
                                    }}>
                                      {isPastDue ? "⚠️ " : isToday ? "📌 " : ""}
                                      Due {new Date(effectiveDue + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                                    </div>
                                  );
                                })()}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}