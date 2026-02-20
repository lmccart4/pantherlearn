// src/pages/StudentDashboard.jsx
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, "courses"), orderBy("order", "asc"));
        const snapshot = await getDocs(q);
        const coursesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })).filter((c) => !c.hidden);
        setAllCourses(coursesData);

        // Get enrolled course IDs
        let enrolledSet = new Set();
        if (user) {
          try {
            enrolledSet = await getStudentEnrolledCourseIds(user.uid);
          } catch (e) {
            console.warn("Failed to get enrolled courses:", e);
          }
          setEnrolledIds(enrolledSet);
        }

        // Fetch lessons for enrolled courses only
        const lessons = {};
        for (const course of coursesData) {
          if (!enrolledSet.has(course.id)) continue;
          try {
            const lessonsSnap = await getDocs(
              query(collection(db, "courses", course.id, "lessons"), orderBy("order", "asc"))
            );
            lessonsSnap.forEach((ld) => {
              const data = ld.data();
              if (data.visible === false) return; // skip hidden lessons
              lessons[ld.id] = { ...data, courseId: course.id };
            });
          } catch (e) {
            console.warn("Could not fetch lessons for", course.id, e);
          }
        }
        setLessonMap(lessons);

        if (user && enrolledSet.size > 0) {
          const enrolledCourses = coursesData.filter((c) => enrolledSet.has(c.id));
          const primaryCourseId = enrolledCourses[0]?.id;

          let gData = await getStudentGamification(user.uid, primaryCourseId);

          // Retroactive badge XP — credits XP for badges earned before this feature
          try {
            const retro = await retroactiveBadgeXP(user.uid, primaryCourseId);
            if (retro.awarded > 0) {
              gData = await getStudentGamification(user.uid, primaryCourseId);
            }
          } catch (e) { /* ignore */ }

          setGamification(gData);

          // Fetch avatar
          try {
            const existingAvatar = await getAvatar(user.uid);
            if (existingAvatar) {
              setAvatar(existingAvatar);
              setHasCustomAvatar(true);
            } else {
              setAvatar(generateRandomAvatar(gData.totalXP || 0));
              setHasCustomAvatar(false);
            }
          } catch (e) {
            setAvatar(generateRandomAvatar(0));
            setHasCustomAvatar(false);
          }

          // Check for active multiplier
          for (const course of enrolledCourses) {
            try {
              const config = await getXPConfig(course.id);
              if (config.activeMultiplier) {
                const expires = config.activeMultiplier.expiresAt?.toDate?.()
                  ? config.activeMultiplier.expiresAt.toDate()
                  : new Date(config.activeMultiplier.expiresAt);
                if (expires > new Date()) {
                  setActiveMultiplier(config.activeMultiplier);
                  break;
                }
              }
            } catch (e) { /* no config yet */ }
          }

          // Fetch progress for enrolled courses (batch query per course)
          const progress = {};
          const completedSet = new Set();
          for (const course of enrolledCourses) {
            const courseLessons = Object.entries(lessons)
              .filter(([_, l]) => l.courseId === course.id)
              .map(([id, l]) => ({ id, ...l }));

            let totalQuestions = 0, answeredQuestions = 0, correctQuestions = 0;

            // Single query gets all lesson progress for this course
            const allProgressSnap = await getDocs(
              collection(db, "progress", user.uid, "courses", course.id, "lessons")
            );
            const progressByLesson = {};
            allProgressSnap.forEach((d) => {
              progressByLesson[d.id] = d.data();
              if (d.data().completed) completedSet.add(d.id);
            });

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
            progress[course.id] = {
              totalLessons: courseLessons.length,
              totalQuestions,
              answeredQuestions,
              correctQuestions,
              accuracy: answeredQuestions > 0 ? Math.round((correctQuestions / answeredQuestions) * 100) : null,
              completion: totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0,
            };
          }
          setCourseProgress(progress);
          setCompletedLessons(completedSet);
        }
      } catch (err) {
        console.error("Error fetching student dashboard:", err);
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const handleEnrolled = (course) => {
    setEnrolledIds((prev) => new Set([...(prev || []), course.id]));
    setShowJoinModal(false);
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="page-container" style={{ display: "flex", justifyContent: "center", paddingTop: 120 }}>
        <div className="spinner" />
      </div>
    );
  }

  const level = gamification ? getLevelInfo(gamification.totalXP) : null;
  const enrolledCourses = allCourses.filter((c) => enrolledIds?.has(c.id));

  return (
    <main id="main-content" className="page-container" style={{ padding: "48px 40px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>

        {/* Announcements for enrolled courses */}
        {enrolledCourses.map((course) => (
          <AnnouncementBanner key={`ann-${course.id}`} courseId={course.id} />
        ))}

        {/* Active Multiplier Banner */}
        <MultiplierBanner activeMultiplier={activeMultiplier} />

        {/* Avatar — centered hero */}
        {avatar && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <Link to="/avatar" style={{ textDecoration: "none" }}>
              <div style={{
                position: "relative",
                background: "var(--surface1)",
                border: "2px solid var(--border)",
                borderRadius: 20,
                padding: "16px 16px 10px",
                cursor: "pointer",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--amber)"; e.currentTarget.style.boxShadow = "0 0 16px rgba(243,156,18,0.15)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <AvatarWithPet
                  avatar={avatar}
                  level={level?.level || 1}
                  charSize={240}
                  petSize={156}
                  animate
                />
                <div style={{
                  textAlign: "center",
                  marginTop: 6,
                  fontSize: 12,
                  fontWeight: 700,
                  color: hasCustomAvatar ? "var(--text3)" : "var(--amber)",
                }}>
                  {hasCustomAvatar ? "✏️ Edit Character" : "⚔️ Customize Me!"}
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Welcome + Stats */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, marginBottom: 4 }}>
                Hey {firstName} 👋
              </h1>
              <NicknameEditor nickname={nickname} onSave={updateNickname} />
            </div>
            {level && (
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: "var(--amber)" }} data-translatable>
                  {ui(14, "Level")} {level.level} — {level.tierName}
                </div>
                <div style={{ fontSize: 12, color: "var(--text3)" }}>{gamification.totalXP} XP</div>
              </div>
            )}
          </div>

          {/* XP Bar */}
          {level && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text3)", marginBottom: 3 }}>
                <span>Lv {level.level}</span>
                <span>{level.xpIntoLevel}/{level.xpForNext} XP</span>
                <span>Lv {level.level + 1}</span>
              </div>
              <div style={{ height: 8, background: "var(--surface2)", borderRadius: 4 }}>
                <div style={{
                  width: `${level.progress * 100}%`, height: "100%",
                  background: "linear-gradient(90deg, var(--amber), #f39c12)",
                  borderRadius: 4, transition: "width 0.5s",
                }} />
              </div>
            </div>
          )}

          {/* Stats Row */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "stretch" }}>
            {gamification && <StreakDisplay
              currentStreak={gamification.currentStreak || 0}
              longestStreak={gamification.longestStreak || 0}
              streakFreezes={gamification.streakFreezes || 0}
            />}
            <DueToday lessonMap={lessonMap} allCourses={allCourses} completedLessons={completedLessons} />
          </div>
        </div>

        {/* My Courses (enrolled) */}
        <div style={{ marginBottom: 32 }}>
          {enrolledCourses.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              {enrolledCourses.map((course) => (
                <ManaPool key={course.id} courseId={course.id} />
              ))}
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, color: "var(--text2)" }} data-translatable>{ui(1, "My Courses")}</h2>
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
            <div className="card" style={{ textAlign: "center", padding: 60 }}>
              <p style={{ fontSize: 40, marginBottom: 12 }}>🔑</p>
              <p style={{ fontWeight: 600 }} data-translatable>{ui(3, "No courses yet")}</p>
              <p style={{ color: "var(--text2)", fontSize: 14, marginTop: 8, marginBottom: 16 }} data-translatable>
                {ui(4, "Get an enroll code from your teacher to get started.")}
              </p>
              <button className="btn btn-primary" onClick={() => setShowJoinModal(true)} data-translatable>
                {ui(5, "Enter Enroll Code")}
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {enrolledCourses.map((course) => {
                const prog = courseProgress[course.id] || {};
                return (
                  <Link key={course.id} to={`/course/${course.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <div className="card fade-in" style={{ cursor: "pointer" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                        <div style={{
                          fontSize: 28, width: 48, height: 48, borderRadius: 10, background: "var(--amber-dim)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>{course.icon || "📚"}</div>
                        <div>
                          <div className="card-title" style={{ fontSize: 16, marginBottom: 2 }}>{course.title}</div>
                          <div className="card-subtitle">{prog.totalLessons || 0} {ui(9, "lessons")}</div>
                        </div>
                      </div>
                      <div style={{ marginBottom: 10 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                          <span style={{ color: "var(--text3)" }} data-translatable>{ui(8, "Progress")}</span>
                          <span style={{ color: "var(--amber)", fontWeight: 600 }}>{prog.completion || 0}%</span>
                        </div>
                        <div style={{ height: 6, background: "var(--surface2)", borderRadius: 3 }}>
                          <div style={{ width: `${prog.completion || 0}%`, height: "100%", background: "var(--amber)", borderRadius: 3, transition: "width 0.3s" }} />
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 16, fontSize: 12, color: "var(--text3)" }}>
                        <span>{prog.answeredQuestions || 0}/{prog.totalQuestions || 0} {ui(10, "questions")}</span>
                        {prog.accuracy !== null && prog.accuracy !== undefined && (
                          <span style={{ color: prog.accuracy >= 70 ? "var(--green)" : "var(--red)" }}>{prog.accuracy}% {ui(11, "accuracy")}</span>
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
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, color: "var(--text2)", marginBottom: 14 }} data-translatable>
              {ui(0, "Badges")}
            </h2>
            <BadgeGrid earnedBadgeIds={gamification.badges || []} />
          </div>
        )}
      </div>

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