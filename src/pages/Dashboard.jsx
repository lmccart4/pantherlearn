// src/pages/Dashboard.jsx
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { getLevelInfo, getStudentGamification, BADGES, getXPConfig } from "../lib/gamification";
import { resolveFirstName } from "../lib/displayName";
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
import { useTranslatedTexts } from "../hooks/useTranslatedText.jsx";

export default function Dashboard() {
  const { user, userRole, nickname, updateNickname } = useAuth();
  const [allCourses, setAllCourses] = useState([]);    // All courses in DB
  const [enrolledIds, setEnrolledIds] = useState(null); // Set of enrolled courseIds (null = loading)
  const [loading, setLoading] = useState(true);
  const [gamification, setGamification] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [hasCustomAvatar, setHasCustomAvatar] = useState(false);
  const [courseProgress, setCourseProgress] = useState({});
  const [showAllBadges, setShowAllBadges] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  // Teacher state
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [lessonMap, setLessonMap] = useState({});
  // Active multiplier from first enrolled course
  const [activeMultiplier, setActiveMultiplier] = useState(null);

  const isTeacher = userRole === "teacher";
  const firstName = nickname || user?.displayName?.split(" ")[0] || "there";

  // Translate student-facing UI strings (skip for teachers)
  const uiStrings = useTranslatedTexts(isTeacher ? [] : [
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
        // Fetch courses — teachers see only owned, students see all
        let coursesData;
        if (isTeacher) {
          // Fetch all courses, filter client-side to owned courses
          const q = query(collection(db, "courses"), orderBy("order", "asc"));
          const snapshot = await getDocs(q);
          coursesData = snapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .filter((c) => !c.ownerUid || c.ownerUid === user.uid);
        } else {
          const q = query(collection(db, "courses"), orderBy("order", "asc"));
          const snapshot = await getDocs(q);
          coursesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        }

        setAllCourses(coursesData);

        // For students, get enrolled course IDs FIRST (before fetching lessons)
        let enrolledSet = null;
        if (!isTeacher && user) {
          try {
            enrolledSet = await getStudentEnrolledCourseIds(user.uid);
          } catch (e) {
            console.warn("Failed to get enrolled courses:", e);
            enrolledSet = new Set();
          }
          setEnrolledIds(enrolledSet);
        }

        // Fetch lessons — only for courses the user has access to
        const lessons = {};
        for (const course of coursesData) {
          // Students: only fetch lessons for enrolled courses
          if (!isTeacher && enrolledSet && !enrolledSet.has(course.id)) continue;
          try {
            const lessonsSnap = await getDocs(
              query(collection(db, "courses", course.id, "lessons"), orderBy("order", "asc"))
            );
            lessonsSnap.forEach((ld) => {
              lessons[ld.id] = { ...ld.data(), courseId: course.id };
            });
          } catch (e) {
            console.warn("Could not fetch lessons for", course.id, e);
          }
        }
        setLessonMap(lessons);

        if (!isTeacher && user && enrolledSet) {
          const enrolledCourses = coursesData.filter((c) => enrolledSet.has(c.id));
          const primaryCourseId = enrolledCourses[0]?.id;

          const gData = await getStudentGamification(user.uid, primaryCourseId);
          setGamification(gData);

          // Fetch avatar — or generate random if none saved
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

          // Check for active multiplier on enrolled courses only
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

          // Fetch progress for enrolled courses only
          const progress = {};
          for (const course of enrolledCourses) {
            const lessonsSnap = await getDocs(
              query(collection(db, "courses", course.id, "lessons"), orderBy("order", "asc"))
            );
            const lessonsList = lessonsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
            let totalQuestions = 0, answeredQuestions = 0, correctQuestions = 0;

            for (const lesson of lessonsList) {
              const questions = (lesson.blocks || []).filter((b) => b.type === "question");
              totalQuestions += questions.length;
              const progRef = doc(db, "progress", user.uid, "courses", course.id, "lessons", lesson.id);
              const progDoc = await getDoc(progRef);
              if (progDoc.exists()) {
                const answers = progDoc.data().answers || {};
                questions.forEach((qBlock) => {
                  if (answers[qBlock.id]?.submitted) {
                    answeredQuestions++;
                    if (answers[qBlock.id]?.correct) correctQuestions++;
                  }
                });
              }
            }
            progress[course.id] = {
              totalLessons: lessonsList.length,
              totalQuestions,
              answeredQuestions,
              correctQuestions,
              accuracy: answeredQuestions > 0 ? Math.round((correctQuestions / answeredQuestions) * 100) : null,
              completion: totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0,
            };
          }
          setCourseProgress(progress);
        }

        if (isTeacher && coursesData.length > 0) setSelectedCourse(coursesData[0].id);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
      setLoading(false);
    };
    fetchData();
  }, [user, isTeacher]);

  const handleEnrolled = (course) => {
    // Refresh enrollment state
    setEnrolledIds((prev) => new Set([...(prev || []), course.id]));
    setShowJoinModal(false);
    // Reload the page to fetch full data for new course
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="page-container" style={{ display: "flex", justifyContent: "center", paddingTop: 120 }}>
        <div className="spinner" />
      </div>
    );
  }

  // =================== STUDENT DASHBOARD ===================
  if (!isTeacher) {
    const level = gamification ? getLevelInfo(gamification.totalXP) : null;

    // Split courses into enrolled vs locked
    const enrolledCourses = allCourses.filter((c) => enrolledIds?.has(c.id));
    const lockedCourses = allCourses.filter((c) => !enrolledIds?.has(c.id));

    return (
      <div className="page-container" style={{ padding: "48px 40px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>

          {/* Active Multiplier Banner */}
          <MultiplierBanner activeMultiplier={activeMultiplier} />

          {/* Avatar — centered hero */}
          {avatar && (
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
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
              {gamification && <StreakDisplay streak={gamification.currentStreak} />}
              <DueToday lessonMap={lessonMap} allCourses={allCourses} />
            </div>
          </div>

          {/* Badges */}
          {gamification && (gamification.badges || []).length > 0 && (
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, color: "var(--text2)", marginBottom: 14 }} data-translatable>
                {ui(0, "Badges")}
              </h2>
              <BadgeGrid earnedBadgeIds={gamification.badges || []} />
            </div>
          )}

          {/* My Courses (enrolled) */}
          <div style={{ marginBottom: 32 }}>
            {/* Mana Pools for enrolled courses */}
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

            {enrolledCourses.length === 0 && lockedCourses.length === 0 ? (
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
                {/* Enrolled courses — fully interactive */}
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

                {/* Locked courses — visible but gated */}
                {lockedCourses.map((course) => (
                  <div
                    key={course.id}
                    className="card fade-in"
                    style={{ cursor: "pointer", opacity: 0.6, position: "relative" }}
                    onClick={() => setShowJoinModal(true)}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                      <div style={{
                        fontSize: 28, width: 48, height: 48, borderRadius: 10, background: "var(--surface2)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>🔒</div>
                      <div>
                        <div className="card-title" style={{ fontSize: 16, marginBottom: 2 }}>{course.title}</div>
                        <div className="card-subtitle">{course.description}</div>
                      </div>
                    </div>
                    <div style={{
                      background: "rgba(243,156,18,0.1)", border: "1px solid rgba(243,156,18,0.2)",
                      borderRadius: 8, padding: "10px 14px", textAlign: "center",
                      fontSize: 13, color: "var(--amber)", fontWeight: 600,
                    }} data-translatable>
                      {ui(6, "🔑 Enter enroll code to access this course")}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Join Course Modal */}
        {showJoinModal && (
          <JoinCourse
            user={user}
            onEnrolled={handleEnrolled}
            onClose={() => setShowJoinModal(false)}
          />
        )}
      </div>
    );
  }

  // =================== TEACHER DASHBOARD ===================
  return (
    <div className="page-container" style={{ padding: "48px 40px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 700, marginBottom: 6 }}>Hey {firstName} 👋</h1>
          <p style={{ color: "var(--text2)", fontSize: 15 }}>Manage your courses, edit lessons, and review student progress.</p>
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 36, flexWrap: "wrap" }}>
          <Link to="/editor" className="btn btn-primary" style={{ textDecoration: "none" }}>✏️ Lesson Editor</Link>
          <Link to="/progress" className="btn btn-secondary" style={{ textDecoration: "none" }}>📈 Student Progress</Link>
          <Link to="/grading" className="btn btn-secondary" style={{ textDecoration: "none" }}>📊 Grading Dashboard</Link>
          <Link to="/rosters" className="btn btn-secondary" style={{ textDecoration: "none" }}>📋 Roster</Link>
        </div>

        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, color: "var(--text2)", marginBottom: 14 }}>Your Courses</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {allCourses.map((course) => (
              <div key={course.id} className="card fade-in">
                <Link to={`/course/${course.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div style={{ fontSize: 32, marginBottom: 12, width: 56, height: 56, borderRadius: 12, background: "var(--amber-dim)", display: "flex", alignItems: "center", justifyContent: "center" }}>{course.icon || "📚"}</div>
                  <div className="card-title">{course.title}</div>
                  <div className="card-subtitle">{course.description}</div>
                </Link>

                {/* Section Enroll Codes */}
                {course.sections && Object.keys(course.sections).length > 0 ? (
                  <div style={{
                    marginTop: 12, padding: "10px 12px", background: "var(--surface2)",
                    borderRadius: 8, fontSize: 12,
                  }}>
                    <div style={{ color: "var(--text3)", marginBottom: 6, fontWeight: 600 }}>Enroll Codes:</div>
                    {Object.entries(course.sections).map(([id, sec]) => (
                      <div key={id} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}>
                        <span style={{ color: "var(--text2)" }}>{sec.name}</span>
                        <span style={{
                          fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13,
                          color: "var(--amber)", letterSpacing: 1.5,
                        }}>{sec.enrollCode}</span>
                      </div>
                    ))}
                  </div>
                ) : course.enrollCode ? (
                  <div style={{
                    marginTop: 12, padding: "8px 12px", background: "var(--surface2)",
                    borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}>
                    <span style={{ fontSize: 12, color: "var(--text3)" }}>Enroll Code:</span>
                    <span style={{
                      fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15,
                      color: "var(--amber)", letterSpacing: 2,
                    }}>{course.enrollCode}</span>
                  </div>
                ) : null}

                <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)", display: "flex", gap: 14 }}>
                  <Link to={`/xp-controls/${course.id}`} style={{ fontSize: 13, color: "var(--amber)", textDecoration: "none", fontWeight: 600 }}>
                    ⚙️ XP Controls
                  </Link>
                  <Link to={`/teams/${course.id}`} style={{ fontSize: 13, color: "var(--amber)", textDecoration: "none", fontWeight: 600 }}>
                    👥 Teams
                  </Link>
                  <Link to={`/mana/${course.id}`} style={{ fontSize: 13, color: "#8b5cf6", textDecoration: "none", fontWeight: 600 }}>
                    🔮 Mana
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
