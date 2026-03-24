// src/pages/StudentDashboard.jsx
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef, useMemo } from "react";
import { collection, getDocs, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { getLevelInfo, getStudentGamification, getXPConfig, retroactiveBadgeXP } from "../lib/gamification";
import { getStudentEnrolledCourseIds } from "../lib/enrollment";
import { getAvatar, generateRandomAvatar } from "../lib/avatar";
import { AvatarWithPet } from "../components/PixelAvatar";
import BadgeGrid from "../components/BadgeGrid";
import StreakDisplay from "../components/StreakDisplay";
import MultiplierBanner from "../components/MultiplierBanner";
import NicknameEditor from "../components/NicknameEditor";
import ManaPool from "../components/ManaPool";
import DueToday from "../components/DueToday";
import JoinCourse from "../components/JoinCourse";
import AnnouncementBanner from "../components/AnnouncementBanner";
import { useTranslatedTexts } from "../hooks/useTranslatedText.jsx";

export default function StudentDashboard() {
  const { user, nickname, updateNickname } = useAuth();
  const [allCourses, setAllCourses] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gamification, setGamification] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [hasCustomAvatar, setHasCustomAvatar] = useState(false);
  const [courseProgress, setCourseProgress] = useState({});
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [lessonMap, setLessonMap] = useState({});
  const [activeMultiplier, setActiveMultiplier] = useState(null);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const lessonMapRef = useRef({});

  const firstName = nickname || user?.displayName?.split(" ")[0] || "there";

  const uiStrings = useTranslatedTexts([
    "Badges",                              // 0
    "My Courses",                          // 1
    "🔑 Join a Course",                    // 2
    "No courses yet",                      // 3
    "Get an enroll code from your teacher to get started.", // 4
    "Enter Enroll Code",                   // 5
    "🔑 Enter enroll code to access this course", // 6
    "🏆 Class Leaderboard",               // 7
    "Progress",                            // 8
    "lessons",                             // 9
    "questions",                           // 10
    "accuracy",                            // 11
    "Rank",                                // 12
    "You",                                 // 13
    "Level",                               // 14
  ]);
  const ui = (i, fallback) => uiStrings?.[i] ?? fallback;

  // Real-time courses — new/hidden courses update instantly
  useEffect(() => {
    const q = query(collection(db, "courses"), orderBy("order", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      setAllCourses(snap.docs.map((d) => ({ id: d.id, ...d.data() })).filter((c) => !c.hidden));
    }, (err) => console.error("Course listener error:", err));
    return () => unsub();
  }, []);

  // Stable course ID string — only changes when the list of visible course IDs changes
  const courseIdKey = useMemo(
    () => allCourses.map((c) => c.id).join(","),
    [allCourses]
  );

  // Enrollment + one-shot data (gamification, avatar, multiplier) + real-time lessons/progress
  useEffect(() => {
    if (!user || allCourses.length === 0) return;
    let cancelled = false;
    const unsubs = [];

    const fetchData = async () => {
      try {
        // Get enrolled course IDs
        let enrolledSet = new Set();
        try {
          enrolledSet = await getStudentEnrolledCourseIds(user.uid);
        } catch (e) {
          console.warn("Failed to get enrolled courses:", e);
        }
        if (cancelled) return;
        setEnrolledIds(enrolledSet);

        const enrolledCourses = allCourses.filter((c) => enrolledSet.has(c.id));

        // Real-time lesson listeners for each enrolled course
        for (const course of enrolledCourses) {
          const lessonUnsub = onSnapshot(
            query(collection(db, "courses", course.id, "lessons"), orderBy("order", "asc")),
            (snap) => {
              setLessonMap((prev) => {
                const next = { ...prev };
                // Remove old lessons for this course
                Object.keys(next).forEach((k) => { if (next[k].courseId === course.id) delete next[k]; });
                snap.forEach((ld) => {
                  const data = ld.data();
                  if (data.visible === false) return;
                  next[ld.id] = { ...data, courseId: course.id };
                });
                lessonMapRef.current = next;
                return next;
              });
            },
            (err) => console.warn("Lesson listener error:", err)
          );
          unsubs.push(lessonUnsub);
        }

        // Real-time progress listeners for each enrolled course
        for (const course of enrolledCourses) {
          const progressUnsub = onSnapshot(
            collection(db, "progress", user.uid, "courses", course.id, "lessons"),
            (snap) => {
              const progressByLesson = {};
              snap.forEach((d) => {
                progressByLesson[d.id] = d.data();
              });

              setCompletedLessons((prev) => {
                const next = new Set(prev);
                snap.forEach((d) => {
                  if (d.data().completed || d.data().exempt) next.add(d.id); else next.delete(d.id);
                });
                return next;
              });

              // Read lessonMap from ref instead of nesting inside setLessonMap
              const currentLessonMap = lessonMapRef.current;
              const courseLessons = Object.entries(currentLessonMap)
                .filter(([_, l]) => l.courseId === course.id)
                .map(([id, l]) => ({ id, ...l }));

              let totalQuestions = 0, answeredQuestions = 0, correctQuestions = 0;
              for (const lesson of courseLessons) {
                const questions = (lesson.blocks || []).filter((b) => b.type === "question");
                totalQuestions += questions.length;
                const progData = progressByLesson[lesson.id];
                if (progData) {
                  const answers = progData.answers || {};
                  questions.forEach((qBlock) => {
                    if (answers[qBlock.id]?.submitted) {
                      answeredQuestions++;
                      if (answers[qBlock.id]?.correct) correctQuestions++;
                    }
                  });
                }
              }
              setCourseProgress((p) => ({
                ...p,
                [course.id]: {
                  totalLessons: courseLessons.length,
                  totalQuestions,
                  answeredQuestions,
                  correctQuestions,
                  accuracy: answeredQuestions > 0 ? Math.round((correctQuestions / answeredQuestions) * 100) : null,
                  completion: totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0,
                },
              }));
            },
            (err) => console.warn("Progress listener error:", err)
          );
          unsubs.push(progressUnsub);
        }

        // One-shot: gamification, avatar, multiplier
        if (enrolledCourses.length > 0) {
          const primaryCourseId = enrolledCourses[0].id;

          let gData = await getStudentGamification(user.uid, primaryCourseId);
          try {
            const retro = await retroactiveBadgeXP(user.uid, primaryCourseId);
            if (retro.awarded > 0) gData = await getStudentGamification(user.uid, primaryCourseId);
          } catch (e) { /* ignore */ }
          if (cancelled) return;
          setGamification(gData);

          try {
            const existingAvatar = await getAvatar(user.uid);
            if (cancelled) return;
            if (existingAvatar) { setAvatar(existingAvatar); setHasCustomAvatar(true); }
            else { setAvatar(generateRandomAvatar(gData.totalXP || 0)); setHasCustomAvatar(false); }
          } catch (e) { setAvatar(generateRandomAvatar(0)); setHasCustomAvatar(false); }

          for (const course of enrolledCourses) {
            try {
              const config = await getXPConfig(course.id);
              if (config.activeMultiplier) {
                const expires = config.activeMultiplier.expiresAt?.toDate?.()
                  ? config.activeMultiplier.expiresAt.toDate()
                  : new Date(config.activeMultiplier.expiresAt);
                if (expires > new Date()) { setActiveMultiplier(config.activeMultiplier); break; }
              }
            } catch (e) { /* no config yet */ }
          }
        }
      } catch (err) {
        console.error("Error fetching student dashboard:", err);
      }
      if (!cancelled) setLoading(false);
    };
    fetchData();
    return () => { cancelled = true; unsubs.forEach((u) => u()); };
  }, [user, courseIdKey]);

  const handleEnrolled = (course) => {
    setEnrolledIds((prev) => new Set([...(prev || []), course.id]));
    setShowJoinModal(false);
    window.location.reload();
  };

  if (loading) {
    return (
      <main id="main-content" className="page-wrapper page-wrapper--medium">
        {/* Avatar placeholder */}
        <div className="sd-avatar-hero">
          <div className="skeleton skeleton-rect sd-skeleton-avatar" />
        </div>
        {/* Welcome + level */}
        <div className="sd-welcome-header" style={{ marginBottom: 8 }}>
          <div className="skeleton skeleton-line" style={{ width: 200, height: 28 }} />
          <div className="skeleton skeleton-line" style={{ width: 100, height: 14 }} />
        </div>
        {/* XP bar */}
        <div className="skeleton skeleton-rect" style={{ width: "100%", height: 8, marginBottom: 16 }} />
        {/* Stats row */}
        <div className="sd-stats" style={{ marginBottom: 32 }}>
          <div className="skeleton skeleton-card" style={{ flex: 1, height: 80 }} />
          <div className="skeleton skeleton-card" style={{ flex: 1, height: 80 }} />
        </div>
        {/* Section header */}
        <div className="skeleton skeleton-line" style={{ width: 140, height: 20, marginBottom: 16 }} />
        {/* Course cards */}
        <div className="sd-skeleton-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton skeleton-card" style={{ height: 140 }}>
              <div className="skeleton skeleton-circle" style={{ width: 40, height: 40, marginBottom: 12 }} />
              <div className="skeleton skeleton-line" style={{ width: "70%", height: 16 }} />
              <div className="skeleton skeleton-line" style={{ width: "50%", height: 12, marginTop: 8 }} />
            </div>
          ))}
        </div>
      </main>
    );
  }

  const level = gamification ? getLevelInfo(gamification.totalXP) : null;
  const enrolledCourses = allCourses.filter((c) => enrolledIds?.has(c.id));

  return (
    <main id="main-content" className="page-wrapper page-wrapper--medium">

        {/* Announcements for enrolled courses */}
        {enrolledCourses.map((course) => (
          <AnnouncementBanner key={`ann-${course.id}`} courseId={course.id} />
        ))}

        {/* Active Multiplier Banner */}
        <MultiplierBanner activeMultiplier={activeMultiplier} />

        {/* Avatar — centered hero */}
        {avatar && (
          <div className="sd-avatar-hero">
            <Link to="/avatar" style={{ textDecoration: "none" }}>
              <div className="sd-avatar-card">
                <AvatarWithPet
                  avatar={avatar}
                  level={level?.level || 1}
                  charSize={240}
                  petSize={156}
                  animate
                />
                <div className={`sd-avatar-label ${hasCustomAvatar ? "sd-avatar-label--custom" : "sd-avatar-label--new"}`}>
                  {hasCustomAvatar ? "✏️ Edit Character" : "⚔️ Customize Me!"}
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Welcome + Stats */}
        <div className="sd-welcome">
          <div className="sd-welcome-header">
            <div>
              <h1 className="sd-welcome-heading">
                Hey {firstName} 👋
              </h1>
              <NicknameEditor nickname={nickname} onSave={updateNickname} />
            </div>
            {level && (
              <div className="sd-level-badge">
                <div className="sd-level-title" data-translatable>
                  {ui(14, "Level")} {level.level} — {level.tierName}
                </div>
                <div className="sd-level-xp">{gamification.totalXP} XP</div>
              </div>
            )}
          </div>

          {/* XP Bar */}
          {level && (
            <div className="sd-xp-section">
              <div className="sd-xp-labels">
                <span>Lv {level.level}</span>
                <span>{level.xpIntoLevel}/{level.xpForNext} XP</span>
                <span>Lv {level.level + 1}</span>
              </div>
              <div className="sd-xp-bar">
                <div className="sd-xp-fill" style={{ width: `${level.progress * 100}%` }} />
              </div>
            </div>
          )}

          {/* Stats Row */}
          <div className="sd-stats">
            {gamification && <StreakDisplay
              currentStreak={gamification.currentStreak || 0}
              longestStreak={gamification.longestStreak || 0}
              streakFreezes={gamification.streakFreezes || 0}
            />}
            <DueToday lessonMap={lessonMap} allCourses={allCourses} completedLessons={completedLessons} />
          </div>
        </div>

        {/* My Courses (enrolled) */}
        <div className="sd-courses">
          {enrolledCourses.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              {enrolledCourses.map((course) => (
                <ManaPool key={course.id} courseId={course.id} />
              ))}
            </div>
          )}
          <div className="sd-courses-header">
            <h2 className="section-heading" style={{ marginBottom: 0 }} data-translatable>{ui(1, "My Courses")}</h2>
            <button
              className="btn btn-primary"
              style={{ fontSize: 13, padding: "8px 16px" }}
              onClick={() => setShowJoinModal(true)}
              data-translatable
            >
              {ui(2, "🔑 Join a Course")}
            </button>
          </div>

          {enrolledCourses.length === 0 ? (
            <div className="card empty-state">
              <div className="empty-state-icon">🔑</div>
              <p className="empty-state-title" data-translatable>{ui(3, "No courses yet")}</p>
              <p className="empty-state-text" data-translatable>
                {ui(4, "Get an enroll code from your teacher to get started.")}
              </p>
              <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => setShowJoinModal(true)} data-translatable>
                {ui(5, "Enter Enroll Code")}
              </button>
            </div>
          ) : (
            <div className="card-grid card-grid--3">
              {enrolledCourses.map((course) => {
                const prog = courseProgress[course.id] || {};
                return (
                  <Link key={course.id} to={`/course/${course.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <div className="card fade-in" style={{ cursor: "pointer" }}>
                      <div className="sd-course-top">
                        <div className="sd-course-icon">{course.icon || "📚"}</div>
                        <div>
                          <div className="sd-course-title">{course.title}</div>
                          <div className="sd-course-subtitle">{prog.totalLessons || 0} {ui(9, "lessons")}</div>
                        </div>
                      </div>
                      <div className="sd-course-progress">
                        <div className="sd-course-progress-header">
                          <span className="sd-course-progress-label" data-translatable>{ui(8, "Progress")}</span>
                          <span className="sd-course-progress-value">{prog.completion || 0}%</span>
                        </div>
                        <div className="sd-course-bar">
                          <div className="sd-course-bar-fill" style={{ width: `${prog.completion || 0}%` }} />
                        </div>
                      </div>
                      <div className="sd-course-stats">
                        <span>{prog.answeredQuestions || 0}/{prog.totalQuestions || 0} {ui(10, "questions")}</span>
                        {prog.accuracy !== null && prog.accuracy !== undefined && (
                          <span className={prog.accuracy >= 70 ? "sd-accuracy-good" : "sd-accuracy-low"}>{prog.accuracy}% {ui(11, "accuracy")}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Badges */}
        {gamification && (
          <div className="sd-badges">
            <h2 className="section-heading" data-translatable>
              {ui(0, "Badges")}
            </h2>
            <BadgeGrid earnedBadgeIds={gamification.badges || []} />
          </div>
        )}

      {/* Join Course Modal */}
      {showJoinModal && (
        <JoinCourse
          user={user}
          onEnrolled={handleEnrolled}
          onClose={() => setShowJoinModal(false)}
        />
      )}
    </main>
  );
}