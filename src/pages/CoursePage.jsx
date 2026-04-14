// src/pages/CoursePage.jsx
import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc, collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth";
import TeamPanel from "../components/TeamPanel";
import ManaPool from "../components/ManaPool";
import Leaderboard from "../components/Leaderboard";
import { getManaState } from "../lib/mana";
import { groupLessonsByWeek, getCurrentWeek } from "../lib/schoolWeeks";
import { useTranslatedText, useTranslatedTexts } from "../hooks/useTranslatedText.jsx";

export default function CoursePage() {
  const { courseId } = useParams();
  const { user, userRole, isTestStudent } = useAuth();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  // Week-collapse state: key is week.num (-1 for "Unscheduled"). Weeks default
  // collapsed except the current week. Teachers/students can toggle individually.
  const [collapsedWeeks, setCollapsedWeeks] = useState({});
  const [collapseInitialized, setCollapseInitialized] = useState(false);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [manaEnabled, setManaEnabled] = useState(false);
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

  // One-shot course metadata (rarely changes mid-session)
  useEffect(() => {
    getDoc(doc(db, "courses", courseId))
      .then((d) => { if (d.exists()) setCourse({ id: d.id, ...d.data() }); })
      .catch((err) => console.error("Error fetching course:", err))
      .finally(() => setLoading(false));
  }, [courseId]);

  // Real-time lessons — teacher visibility changes appear instantly.
  // We no longer pre-sort here; groupLessonsByWeek handles Fri→Mon order
  // within each week and newest-first between weeks.
  useEffect(() => {
    const q = query(collection(db, "courses", courseId, "lessons"), orderBy("order", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setLessons(data);
      setLoading(false);
    }, (err) => console.warn("Lesson listener error:", err));
    return () => unsub();
  }, [courseId]);

  // Real-time progress — completion indicators update live
  useEffect(() => {
    if (userRole === "teacher" || !user) return;
    const unsub = onSnapshot(
      collection(db, "progress", user.uid, "courses", courseId, "lessons"),
      (snap) => {
        const completed = new Set();
        snap.forEach((d) => { if (d.data().completed || d.data().exempt) completed.add(d.id); });
        setCompletedLessons(completed);
      },
      (err) => console.warn("Progress listener error:", err)
    );
    return () => unsub();
  }, [courseId, user, userRole]);

  // Check if mana is enabled for this course (for student mana link)
  useEffect(() => {
    getManaState(courseId).then((s) => setManaEnabled(!!s?.enabled)).catch(() => {});
  }, [courseId]);

  // FIX #33: Memoize lesson grouping instead of recalculating in an IIFE on every render
  const visibleLessons = useMemo(() =>
    lessons.filter((lesson) => isTeacher || isTestStudent || lesson.visible !== false),
    [lessons, isTeacher, isTestStudent]
  );

  // Week-based grouping: Unscheduled drawer at top, then weeks in descending
  // week-number order (future → current → past). Fri top, Mon bottom inside
  // each week. `num` is assigned in display order for the little circled badge.
  // Students don't see the Unscheduled drawer — it's a teacher workflow
  // queue for "stuff I still need to give a due date". Test students see it
  // so Luke can QA against it.
  const weekGroups = useMemo(() => {
    let groups = groupLessonsByWeek(visibleLessons);
    if (!isTeacher && !isTestStudent) {
      groups = groups.filter((g) => g.week.num !== -1);
    }
    let globalNum = 0;
    return groups.map((g) => ({
      ...g,
      lessons: g.lessons.map((lesson) => ({ lesson, num: ++globalNum })),
    }));
  }, [visibleLessons, isTeacher, isTestStudent]);

  // First time we have data, default every week to collapsed except the
  // current real-world week (and the unscheduled drawer stays open too so
  // teachers notice lessons with missing due dates).
  useEffect(() => {
    if (collapseInitialized || weekGroups.length === 0) return;
    const currentWeek = getCurrentWeek();
    const initial = {};
    for (const g of weekGroups) {
      // -1 is the unscheduled synthetic bucket — leave expanded.
      if (g.week.num === -1) continue;
      if (currentWeek && g.week.num === currentWeek.num) continue;
      initial[g.week.num] = true;
    }
    setCollapsedWeeks(initial);
    setCollapseInitialized(true);
  }, [weekGroups, collapseInitialized]);

  if (loading) return (
    <main id="main-content" className="page-wrapper page-wrapper--narrow">
      <div className="skeleton skeleton-line" style={{ width: 140, height: 13, marginBottom: 16 }} />
      <div className="cp-hero">
        <div className="skeleton skeleton-rect" style={{ width: 64, height: 64, borderRadius: 14 }} />
        <div style={{ flex: 1 }}>
          <div className="skeleton skeleton-line" style={{ width: "60%", height: 24 }} />
          <div className="skeleton skeleton-line" style={{ width: "40%", height: 14 }} />
        </div>
      </div>
      <div className="skeleton skeleton-line" style={{ width: 120, height: 16, marginBottom: 12 }} />
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="skeleton skeleton-card" style={{ height: 52, marginBottom: 8, display: "flex", alignItems: "center", gap: 12, padding: "0 16px" }}>
          <div className="skeleton skeleton-circle" style={{ width: 28, height: 28 }} />
          <div className="skeleton skeleton-line" style={{ width: `${50 + i * 5}%`, height: 14, marginBottom: 0 }} />
        </div>
      ))}
    </main>
  );
  if (!course) return (
    <div className="page-wrapper empty-state" style={{ paddingTop: 120 }}>
      <h2 className="empty-state-title" data-translatable>{ui(0, "Course not found")}</h2>
    </div>
  );

  return (
    <main id="main-content" className="page-wrapper page-wrapper--narrow">
        <Link to="/" className="cp-back-link" data-translatable>{ui(1, "← Back to Dashboard")}</Link>
        <div className="cp-hero">
          <div className="cp-hero-icon">
            {course.icon || "📚"}
          </div>
          <div>
            <h1 className="cp-hero-title" data-translatable>{translatedTitle}</h1>
            <p className="cp-hero-desc" data-translatable>{translatedDesc}</p>
          </div>
        </div>

        {/* Teacher quick links — English only */}
        {isTeacher && (
          <div className="cp-teacher-links">
            <Link to={`/xp-controls/${courseId}`} className="cp-teacher-link cp-teacher-link--amber">
              ⚙️ XP Controls
            </Link>
            <Link to={`/teams/${courseId}`} className="cp-teacher-link cp-teacher-link--amber">
              👥 Manage Teams
            </Link>
            <Link to={`/mana/${courseId}`} className="cp-teacher-link cp-teacher-link--purple">
              🔮 Mana Pool
            </Link>
            <Link to={`/boss-battle/${courseId}`} className="cp-teacher-link cp-teacher-link--red">
              ⚔️ Boss Battle
            </Link>
            <Link to={`/course/${courseId}/evidence`} className="cp-teacher-link cp-teacher-link--green">
              📸 Evidence Log
            </Link>
          </div>
        )}

        {/* Evidence Log link for students */}
        {!isTeacher && course.evidenceConfig?.enabled && (
          <Link to={`/course/${courseId}/evidence`} className="card cp-evidence-card">
            <div className="cp-evidence-icon">📸</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>Weekly Evidence Log</div>
              <div style={{ fontSize: 12, color: "var(--text3)" }}>Upload photos and reflections each week</div>
            </div>
            <div className="cp-evidence-arrow">→</div>
          </Link>
        )}

        {/* Student Mana link */}
        {!isTeacher && manaEnabled && (
          <Link to={`/my-mana/${courseId}`} className="card cp-evidence-card" style={{ borderLeft: "3px solid #8b5cf6" }}>
            <div className="cp-evidence-icon" style={{ fontSize: 22 }}>✦</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>My Mana</div>
              <div style={{ fontSize: 12, color: "var(--text3)" }}>View your balance, level, and redeem powers</div>
            </div>
            <div className="cp-evidence-arrow">→</div>
          </Link>
        )}

        {/* Team Panel (students see their team here) */}
        <TeamPanel courseId={courseId} />

        {/* Mana Pool (visible to all when enabled) */}
        <ManaPool courseId={courseId} />

        {/* Leaderboard — students only, full width above lessons */}
        {!isTeacher && <Leaderboard courseId={courseId} />}

        {/* Lessons */}
        <div>
            {lessons.length === 0 ? (
              <div className="card empty-state">
                <p className="empty-state-title" data-translatable>{ui(2, "No lessons yet")}</p>
                <p className="empty-state-text" data-translatable>{ui(3, "Your teacher is still building this course.")}</p>
              </div>
            ) : (
              <div className="cp-lesson-list">
                {weekGroups.map((group, groupIdx) => {
                  const isCollapsed = !!collapsedWeeks[group.week.num];
                  const isUnscheduled = group.week.num === -1;

                  return (
                    <div key={`week-${group.week.num}`}>
                      {/* Week header (always shown, including Unscheduled) */}
                      <button
                        onClick={() => setCollapsedWeeks((prev) => ({ ...prev, [group.week.num]: !prev[group.week.num] }))}
                        className="card cp-unit-header"
                        style={{ marginTop: groupIdx > 0 ? 20 : 0 }}
                      >
                        <span className={`cp-unit-chevron ${isCollapsed ? "collapsed" : ""}`}>▼</span>
                        <div style={{ flex: 1 }}>
                          <div className="cp-unit-title">
                            {isUnscheduled ? "📋 Unscheduled" : group.week.label}
                          </div>
                          <div className="cp-unit-count">
                            {group.lessons.length} {group.lessons.length === 1 ? "lesson" : "lessons"}
                          </div>
                        </div>
                      </button>

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
                            <div className="card fade-in cp-lesson-row" style={{
                              animationDelay: `${i * 0.05}s`,
                              marginLeft: 12,
                              borderLeft: isCompleted ? "3px solid var(--green)" : undefined,
                            }}>
                              <div className={`cp-lesson-number ${isCompleted ? "cp-lesson-number--completed" : "cp-lesson-number--default"}`}>
                                {isCompleted ? "✓" : num}
                              </div>
                              <div>
                                <div style={{ fontWeight: 600, fontSize: 15 }} data-translatable>{tTitle}</div>
                                {isCompleted && (
                                  <div style={{ fontSize: 11, color: "var(--green)", fontWeight: 600, marginTop: 1 }}>
                                    Completed
                                  </div>
                                )}
                              </div>
                              <div className="cp-lesson-meta">
                                <div className="cp-question-count">
                                  {qCount} {ui(4, "questions")}
                                </div>
                                {(() => {
                                  const effectiveDue = lesson.dueDate;
                                  if (!effectiveDue) return (
                                    <div className="cp-due-date cp-due-date--normal">
                                      Due TBD
                                    </div>
                                  );
                                  const due = new Date(effectiveDue + "T23:59:59");
                                  const now = new Date();
                                  const isPastDue = due < now;
                                  const isToday = effectiveDue === `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
                                  const isSoon = !isPastDue && !isToday && (due - now) < 2 * 24 * 60 * 60 * 1000;

                                  if (isCompleted) {
                                    return (
                                      <div className="cp-due-date cp-due-date--normal">
                                        Due {new Date(effectiveDue + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                                      </div>
                                    );
                                  }

                                  const dateClass = isPastDue ? "cp-due-date--overdue" : isToday || isSoon ? "cp-due-date--today" : "cp-due-date--normal";
                                  return (
                                    <div className={`cp-due-date ${dateClass}`}>
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
    </main>
  );
}