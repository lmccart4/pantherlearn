// src/pages/WeeklyEvidence.jsx
// Weekly evidence log — students upload photos + reflections each week.
// Auto-rotates to the current week. Teachers see a student grid.

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
  doc, getDoc, getDocs, setDoc, collection, query, where, onSnapshot,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth";
import { getCourseEnrollments } from "../lib/enrollment";
import { resolveDisplayName } from "../lib/displayName";
import useAutoSave from "../hooks/useAutoSave.jsx";

// ─── Week helpers ───

function getISOWeekKey(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  // Adjust to Thursday in current week (ISO 8601)
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const yearStart = new Date(d.getFullYear(), 0, 4);
  const weekNum = 1 + Math.round(
    ((d - yearStart) / 86400000 - 3 + ((yearStart.getDay() + 6) % 7)) / 7
  );
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}

function getWeekMonday(weekKey) {
  const [yearStr, wStr] = weekKey.split("-W");
  const year = parseInt(yearStr, 10);
  const week = parseInt(wStr, 10);
  // Jan 4 is always in ISO week 1
  const jan4 = new Date(year, 0, 4);
  const dayOfWeek = (jan4.getDay() + 6) % 7; // 0=Mon
  const monday = new Date(jan4);
  monday.setDate(jan4.getDate() - dayOfWeek + (week - 1) * 7);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function getWeekRange(weekKey) {
  const monday = getWeekMonday(weekKey);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return { start: monday, end: sunday };
}

function formatDateShort(d) {
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function generateWeekKeys(startDate, endDate) {
  const keys = [];
  const current = new Date(startDate);
  const endKey = getISOWeekKey(endDate);
  const seen = new Set();
  while (true) {
    const key = getISOWeekKey(current);
    if (!seen.has(key)) {
      seen.add(key);
      keys.push(key);
    }
    if (key === endKey) break;
    current.setDate(current.getDate() + 7);
    if (keys.length > 52) break; // safety limit
  }
  return keys;
}

// ─── Student week card (editable for current, read-only for past) ───

function WeekCard({ weekKey, data, isCurrentWeek, prompt, onSave }) {
  const [images, setImages] = useState(data?.images || []);
  const [reflection, setReflection] = useState(data?.reflection || "");
  const [expanded, setExpanded] = useState(isCurrentWeek);
  const imagesRef = useRef(images);
  const reflectionRef = useRef(reflection);
  imagesRef.current = images;
  reflectionRef.current = reflection;

  // Sync from props when data changes externally
  useEffect(() => {
    setImages(data?.images || []);
    setReflection(data?.reflection || "");
  }, [data]);

  const performSave = useCallback(() => {
    onSave(weekKey, {
      images: imagesRef.current,
      reflection: reflectionRef.current,
      savedAt: new Date().toISOString(),
    });
  }, [weekKey, onSave]);

  const { markDirty, saveNow, lastSaved } = useAutoSave(performSave);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      if (file.size > 5 * 1024 * 1024) {
        alert("Image too large (max 5MB). Please resize and try again.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImages((prev) => {
          if (prev.length >= 4) {
            alert("Maximum 4 images per week.");
            return prev;
          }
          return [...prev, { dataUrl: ev.target.result, name: file.name, uploadedAt: new Date().toISOString() }];
        });
        markDirty();
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    markDirty();
  };

  const range = getWeekRange(weekKey);
  const weekNum = parseInt(weekKey.split("-W")[1], 10);
  const hasContent = images.length > 0 || reflection.trim().length > 0;

  return (
    <div className={`card evidence-week-card ${isCurrentWeek ? "evidence-week-current" : ""}`}>
      <button
        className="evidence-week-header"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <span style={{
          transition: "transform 0.2s", transform: expanded ? "rotate(0deg)" : "rotate(-90deg)",
          display: "inline-block", fontSize: 14, color: "var(--amber)", marginRight: 10,
        }}>▼</span>
        <div style={{ flex: 1, textAlign: "left" }}>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16 }}>
            Week {weekNum}
          </span>
          <span style={{ color: "var(--text3)", fontSize: 13, marginLeft: 10 }}>
            {formatDateShort(range.start)} – {formatDateShort(range.end)}
          </span>
        </div>
        {hasContent ? (
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--green, #10b981)" }}>✓ Submitted</span>
        ) : isCurrentWeek ? (
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--amber)" }}>Current week</span>
        ) : (
          <span style={{ fontSize: 12, color: "var(--text3)" }}>Empty</span>
        )}
      </button>

      {expanded && (
        <div style={{ padding: "16px 20px 12px" }}>
          {/* Image grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10, marginBottom: 14 }}>
            {images.map((img, i) => (
              <div key={i} style={{ position: "relative", borderRadius: 10, overflow: "hidden", border: "1px solid var(--border)", background: "var(--surface2)" }}>
                <img src={img.dataUrl} alt={img.name || "Evidence"} style={{ width: "100%", height: 140, objectFit: "cover" }} />
                {isCurrentWeek && (
                  <button
                    onClick={() => removeImage(i)}
                    aria-label="Remove image"
                    style={{
                      position: "absolute", top: 4, right: 4, width: 22, height: 22, borderRadius: "50%",
                      background: "rgba(0,0,0,0.6)", border: "none", color: "white", fontSize: 12,
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >✕</button>
                )}
              </div>
            ))}

            {isCurrentWeek && images.length < 4 && (
              <label style={{
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                height: 140, borderRadius: 10, border: "2px dashed var(--border)",
                background: "var(--surface2)", cursor: "pointer", transition: "border-color 0.2s",
                color: "var(--text3)", fontSize: 13, fontWeight: 600,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--amber)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
              >
                <span style={{ fontSize: 28, marginBottom: 4 }}>📷</span>
                <span>Add Photo</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: "none" }} multiple />
              </label>
            )}
          </div>

          {/* Reflection */}
          {prompt && (
            <div style={{ marginTop: 8 }}>
              <label style={{ fontSize: 12, color: "var(--text3)", fontWeight: 600, display: "block", marginBottom: 4 }}>
                {prompt}
              </label>
              {isCurrentWeek ? (
                <textarea
                  className="sa-input"
                  rows={3}
                  value={reflection}
                  onChange={(e) => { setReflection(e.target.value); markDirty(); }}
                  onBlur={saveNow}
                  placeholder="Write your reflection..."
                />
              ) : (
                <p style={{ fontSize: 14, color: "var(--text2)", whiteSpace: "pre-wrap", minHeight: 20 }}>
                  {reflection || <span style={{ color: "var(--text3)", fontStyle: "italic" }}>No reflection written</span>}
                </p>
              )}
            </div>
          )}

          {isCurrentWeek && lastSaved && (
            <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 6 }}>
              Saved {lastSaved.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Teacher: student evidence viewer ───

function TeacherView({ courseId, course }) {
  const [enrollments, setEnrollments] = useState([]);
  const [users, setUsers] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentWeeks, setStudentWeeks] = useState({});
  const [loading, setLoading] = useState(true);

  const currentWeekKey = useMemo(() => getISOWeekKey(), []);

  useEffect(() => {
    async function load() {
      const enrolls = await getCourseEnrollments(courseId);
      const studentEnrolls = enrolls.filter((e) => e.uid || e.studentUid);
      setEnrollments(studentEnrolls);

      // Fetch user profiles
      const uids = [...new Set(studentEnrolls.map((e) => e.uid || e.studentUid))];
      const userMap = {};
      await Promise.all(
        uids.map(async (uid) => {
          const snap = await getDoc(doc(db, "users", uid));
          if (snap.exists()) userMap[uid] = snap.data();
        })
      );
      setUsers(userMap);

      // Fetch current week evidence for all students
      const weekMap = {};
      await Promise.all(
        uids.map(async (uid) => {
          const snap = await getDoc(doc(db, "evidence", uid, "courses", courseId, "weeks", currentWeekKey));
          if (snap.exists()) weekMap[uid] = snap.data();
        })
      );
      setStudentWeeks(weekMap);
      setLoading(false);
    }
    load();
  }, [courseId, currentWeekKey]);

  // When a student is selected, load all their weeks
  const [selectedStudentWeeks, setSelectedStudentWeeks] = useState({});
  const [loadingStudent, setLoadingStudent] = useState(false);

  useEffect(() => {
    if (!selectedStudent) return;
    setLoadingStudent(true);
    const unsub = onSnapshot(
      collection(db, "evidence", selectedStudent, "courses", courseId, "weeks"),
      (snap) => {
        const weeks = {};
        snap.forEach((d) => { weeks[d.id] = d.data(); });
        setSelectedStudentWeeks(weeks);
        setLoadingStudent(false);
      }
    );
    return () => unsub();
  }, [selectedStudent, courseId]);

  if (loading) return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="skeleton skeleton-card" style={{ height: 52 }} />
      ))}
    </div>
  );

  if (selectedStudent) {
    const u = users[selectedStudent] || {};
    const name = resolveDisplayName({ displayName: u.displayName, nickname: u.nickname, isTeacherViewing: true });
    const weekKeys = Object.keys(selectedStudentWeeks).sort().reverse();
    const prompt = course.evidenceConfig?.prompt || "Weekly reflection";

    return (
      <div>
        <button
          onClick={() => setSelectedStudent(null)}
          style={{ fontSize: 13, color: "var(--text3)", background: "none", border: "none", cursor: "pointer", marginBottom: 16 }}
        >← Back to all students</button>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, marginBottom: 16 }}>{name}</h2>

        {loadingStudent ? (
          <div className="skeleton skeleton-card" style={{ height: 200 }} />
        ) : weekKeys.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: 40, color: "var(--text3)" }}>
            No evidence submitted yet
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {weekKeys.map((wk) => {
              const data = selectedStudentWeeks[wk];
              const range = getWeekRange(wk);
              const weekNum = parseInt(wk.split("-W")[1], 10);
              return (
                <div key={wk} className="card" style={{ padding: 16 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, marginBottom: 10 }}>
                    Week {weekNum} — {formatDateShort(range.start)} – {formatDateShort(range.end)}
                  </div>
                  {data.images?.length > 0 && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 8, marginBottom: 10 }}>
                      {data.images.map((img, i) => (
                        <img key={i} src={img.dataUrl} alt={img.name || "Evidence"} style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 8, border: "1px solid var(--border)" }} />
                      ))}
                    </div>
                  )}
                  {data.reflection && (
                    <div>
                      <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600, marginBottom: 4 }}>{prompt}</div>
                      <p style={{ fontSize: 14, color: "var(--text2)", whiteSpace: "pre-wrap" }}>{data.reflection}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Student grid
  const range = getWeekRange(currentWeekKey);
  const weekNum = parseInt(currentWeekKey.split("-W")[1], 10);

  return (
    <div>
      <div style={{ fontSize: 14, color: "var(--text3)", marginBottom: 16 }}>
        Week {weekNum} — {formatDateShort(range.start)} – {formatDateShort(range.end)}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {enrollments.map((e) => {
          const uid = e.uid || e.studentUid;
          const u = users[uid] || {};
          const name = resolveDisplayName({ displayName: u.displayName, nickname: u.nickname, isTeacherViewing: true });
          const hasEvidence = !!studentWeeks[uid];
          const imgCount = studentWeeks[uid]?.images?.length || 0;

          return (
            <button
              key={uid}
              className="card"
              onClick={() => setSelectedStudent(uid)}
              style={{
                display: "flex", alignItems: "center", gap: 14, cursor: "pointer",
                width: "100%", textAlign: "left", color: "inherit",
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: hasEvidence ? "rgba(16, 185, 129, 0.15)" : "var(--surface2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 700,
                color: hasEvidence ? "var(--green, #10b981)" : "var(--text3)",
              }}>
                {hasEvidence ? "✓" : "—"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{name}</div>
              </div>
              <div style={{ fontSize: 12, color: "var(--text3)" }}>
                {hasEvidence ? `${imgCount} photo${imgCount !== 1 ? "s" : ""}` : "Not submitted"}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main page ───

export default function WeeklyEvidence() {
  const { courseId } = useParams();
  const { user, userRole } = useAuth();
  const isTeacher = userRole === "teacher";

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [weekEntries, setWeekEntries] = useState({});

  const currentWeekKey = useMemo(() => getISOWeekKey(), []);
  const currentWeekRef = useRef(null);

  // Load course
  useEffect(() => {
    getDoc(doc(db, "courses", courseId))
      .then((d) => { if (d.exists()) setCourse({ id: d.id, ...d.data() }); })
      .finally(() => setLoading(false));
  }, [courseId]);

  // Real-time evidence entries (student only)
  useEffect(() => {
    if (!user || isTeacher) return;
    const unsub = onSnapshot(
      collection(db, "evidence", user.uid, "courses", courseId, "weeks"),
      (snap) => {
        const entries = {};
        snap.forEach((d) => { entries[d.id] = d.data(); });
        setWeekEntries(entries);
      }
    );
    return () => unsub();
  }, [courseId, user, isTeacher]);

  // Scroll to current week on mount
  useEffect(() => {
    if (currentWeekRef.current) {
      currentWeekRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [loading]);

  const handleSave = useCallback(async (weekKey, data) => {
    if (!user) return;
    await setDoc(
      doc(db, "evidence", user.uid, "courses", courseId, "weeks", weekKey),
      data,
      { merge: true }
    );
  }, [user, courseId]);

  // Generate week list (past 16 weeks → current)
  const weekKeys = useMemo(() => {
    const now = new Date();
    const start = new Date(now);
    start.setDate(start.getDate() - 16 * 7);
    return generateWeekKeys(start, now).reverse(); // newest first
  }, []);

  // Skeleton loading
  if (loading) return (
    <main id="main-content" className="page-container" style={{ padding: "48px 40px" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <div className="skeleton skeleton-line" style={{ width: 140, height: 13, marginBottom: 16 }} />
        <div className="skeleton skeleton-line" style={{ width: "60%", height: 24, marginBottom: 8 }} />
        <div className="skeleton skeleton-line" style={{ width: "40%", height: 14, marginBottom: 24 }} />
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton skeleton-card" style={{ height: 60, marginBottom: 8 }} />
        ))}
      </div>
    </main>
  );

  if (!course) return (
    <main id="main-content" className="page-container" style={{ textAlign: "center", paddingTop: 120 }}>
      <h2>Course not found</h2>
    </main>
  );

  const config = course.evidenceConfig;

  if (!config?.enabled && !isTeacher) return (
    <main id="main-content" className="page-container" style={{ textAlign: "center", paddingTop: 120 }}>
      <h2>Evidence log not enabled for this course</h2>
      <Link to={`/course/${courseId}`} style={{ color: "var(--amber)", fontSize: 14 }}>← Back to course</Link>
    </main>
  );

  const prompt = config?.prompt || "What did you work on this week?";

  return (
    <main id="main-content" className="page-container" style={{ padding: "48px 40px" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <Link to={`/course/${courseId}`} style={{ fontSize: 13, color: "var(--text3)", marginBottom: 16, display: "block" }}>
          ← Back to {course.title || "Course"}
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
          <div style={{
            fontSize: 36, width: 56, height: 56, borderRadius: 14,
            background: "var(--amber-dim)", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            📸
          </div>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700 }}>
              Weekly Evidence Log
            </h1>
            <p style={{ color: "var(--text2)", fontSize: 14 }}>{course.title}</p>
          </div>
        </div>

        {isTeacher ? (
          <TeacherView courseId={courseId} course={course} />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {weekKeys.map((wk) => (
              <div key={wk} ref={wk === currentWeekKey ? currentWeekRef : null}>
                <WeekCard
                  weekKey={wk}
                  data={weekEntries[wk]}
                  isCurrentWeek={wk === currentWeekKey}
                  prompt={prompt}
                  onSave={handleSave}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
