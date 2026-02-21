// src/pages/WeeklyEvidence.jsx
// Weekly evidence log — day-based tabs (Mon–Fri), one photo + reflection per day.
// Auto-rotates to the current week. Teachers see a student grid.

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
  doc, getDoc, getDocs, setDoc, collection, onSnapshot,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth";
import { getCourseEnrollments } from "../lib/enrollment";
import { resolveDisplayName } from "../lib/displayName";
import useAutoSave from "../hooks/useAutoSave.jsx";

// ─── Constants ───

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday"];
const DAY_LABELS = { monday: "Mon", tuesday: "Tue", wednesday: "Wed", thursday: "Thu", friday: "Fri" };
const DAY_FULL = { monday: "Monday", tuesday: "Tuesday", wednesday: "Wednesday", thursday: "Thursday", friday: "Friday" };

// ─── Week helpers ───

function getISOWeekKey(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
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
  const jan4 = new Date(year, 0, 4);
  const dayOfWeek = (jan4.getDay() + 6) % 7;
  const monday = new Date(jan4);
  monday.setDate(jan4.getDate() - dayOfWeek + (week - 1) * 7);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function getWeekRange(weekKey) {
  const monday = getWeekMonday(weekKey);
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);
  return { start: monday, end: friday };
}

function formatDateShort(d) {
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function offsetWeekKey(weekKey, delta) {
  const monday = getWeekMonday(weekKey);
  monday.setDate(monday.getDate() + delta * 7);
  return getISOWeekKey(monday);
}

function getTodayDayName() {
  const i = new Date().getDay(); // 0=Sun
  if (i === 0 || i === 6) return "monday";
  return DAYS[i - 1];
}

function isLegacyFormat(data) {
  return data && Array.isArray(data.images) && !data.monday;
}

function countDaysWithPhotos(data) {
  if (!data) return 0;
  if (isLegacyFormat(data)) return data.images?.length > 0 ? 1 : 0;
  return DAYS.filter(d => data[d]?.image).length;
}

// ─── Image compression (keep under Firestore 1MB doc limit) ───

function compressImage(dataUrl, maxWidth = 800, quality = 0.7) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let w = img.width, h = img.height;
      if (w > maxWidth) { h = Math.round(h * (maxWidth / w)); w = maxWidth; }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => resolve(dataUrl); // fallback to original
    img.src = dataUrl;
  });
}

// ─── Camera SVG icon ───

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 48, height: 48, marginBottom: 8 }}>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

// ─── DayPanel — photo upload + reflection for one day ───

function DayPanel({ day, dayData, isEditable, prompt, onSave }) {
  const [image, setImage] = useState(dayData?.image || null);
  const [reflection, setReflection] = useState(dayData?.reflection || "");
  const imageRef = useRef(image);
  const reflectionRef = useRef(reflection);
  imageRef.current = image;
  reflectionRef.current = reflection;

  useEffect(() => {
    setImage(dayData?.image || null);
    setReflection(dayData?.reflection || "");
  }, [dayData]);

  const performSave = useCallback(() => {
    onSave(day, { image: imageRef.current, reflection: reflectionRef.current });
  }, [day, onSave]);

  const { markDirty, saveNow, lastSaved, saving } = useAutoSave(performSave);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Image too large (max 5 MB). Please resize and try again.");
      return;
    }
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const compressed = await compressImage(ev.target.result);
      const img = { dataUrl: compressed, name: file.name, uploadedAt: new Date().toISOString() };
      setImage(img);
      markDirty();
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const removeImage = () => {
    setImage(null);
    markDirty();
  };

  const hasPhoto = !!image;

  return (
    <div className="card" style={{ padding: "20px 24px" }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text3)", marginBottom: 12 }}>
        {DAY_FULL[day]}
      </div>

      {/* Photo area */}
      {isEditable ? (
        hasPhoto ? (
          <div className="evidence-photo-display">
            <img src={image.dataUrl} alt={image.name || "Evidence"} />
            <button className="evidence-photo-remove" onClick={removeImage} aria-label="Remove photo">✕</button>
          </div>
        ) : (
          <label className="evidence-upload-zone">
            <CameraIcon />
            <span>Tap to add today's photo</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: "none" }} />
          </label>
        )
      ) : (
        hasPhoto ? (
          <div className="evidence-photo-display">
            <img src={image.dataUrl} alt={image.name || "Evidence"} />
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text3)", fontSize: 13 }}>
            No photo uploaded
          </div>
        )
      )}

      {/* Reflection */}
      <div style={{ marginTop: 12 }}>
        <label style={{ fontSize: 12, color: "var(--text3)", fontWeight: 600, display: "block", marginBottom: 4 }}>
          Daily Reflection
        </label>
        {isEditable ? (
          hasPhoto ? (
            <textarea
              className="sa-input"
              rows={3}
              value={reflection}
              onChange={(e) => { setReflection(e.target.value); markDirty(); }}
              onBlur={saveNow}
              placeholder={prompt || "What did you learn today?"}
            />
          ) : (
            <div className="evidence-reflection-locked">
              <textarea className="sa-input" rows={3} disabled placeholder="" />
              <div className="evidence-reflection-locked-overlay">
                Upload a photo to unlock your daily reflection
              </div>
            </div>
          )
        ) : (
          <p style={{ fontSize: 14, color: "var(--text2)", whiteSpace: "pre-wrap", minHeight: 20 }}>
            {reflection || <span style={{ color: "var(--text3)", fontStyle: "italic" }}>No reflection written</span>}
          </p>
        )}
      </div>

      {/* Save status */}
      {isEditable && (lastSaved || saving) && (
        <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 8 }}>
          {saving ? "Saving..." : `Saved ${lastSaved.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`}
        </div>
      )}
    </div>
  );
}

// ─── StudentView ───

function StudentView({ courseId, course, user }) {
  const currentWeekKey = useMemo(() => getISOWeekKey(), []);
  const [weekKey, setWeekKey] = useState(currentWeekKey);
  const [activeDay, setActiveDay] = useState(getTodayDayName());
  const [weekData, setWeekData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [printMode, setPrintMode] = useState(false);

  const isCurrentWeek = weekKey === currentWeekKey;
  const range = getWeekRange(weekKey);
  const config = course.evidenceConfig || {};
  const prompt = config.prompt || "What did you learn today?";

  // Real-time listener on current week doc
  useEffect(() => {
    setLoading(true);
    const unsub = onSnapshot(
      doc(db, "evidence", user.uid, "courses", courseId, "weeks", weekKey),
      (snap) => {
        setWeekData(snap.exists() ? snap.data() : null);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsub();
  }, [courseId, user.uid, weekKey]);

  const handleSave = useCallback(async (day, dayData) => {
    await setDoc(
      doc(db, "evidence", user.uid, "courses", courseId, "weeks", weekKey),
      { [day]: dayData, savedAt: new Date().toISOString() },
      { merge: true }
    );
  }, [user.uid, courseId, weekKey]);

  const goToPrevWeek = () => {
    setWeekKey(offsetWeekKey(weekKey, -1));
    setActiveDay("monday");
  };
  const goToNextWeek = () => {
    const next = offsetWeekKey(weekKey, 1);
    if (next <= currentWeekKey) {
      setWeekKey(next);
      if (next === currentWeekKey) setActiveDay(getTodayDayName());
      else setActiveDay("monday");
    }
  };

  const handlePrintPDF = () => {
    setPrintMode(true);
    requestAnimationFrame(() => {
      window.print();
      setPrintMode(false);
    });
  };

  const legacy = isLegacyFormat(weekData);

  return (
    <div>
      {/* Header */}
      <div className="evidence-header">
        <div className="evidence-week-nav">
          <button onClick={goToPrevWeek} aria-label="Previous week">←</button>
          <div>
            <div className="evidence-cycle-id">{weekKey}</div>
            <div style={{ fontSize: 13, color: "var(--text3)" }}>
              {formatDateShort(range.start)} – {formatDateShort(range.end)}
            </div>
          </div>
          <button onClick={goToNextWeek} disabled={isCurrentWeek} aria-label="Next week">→</button>
        </div>
        <div style={{ fontSize: 14, color: "var(--text2)", marginTop: 8, marginBottom: 4 }}>
          {prompt}
        </div>
        <button className="evidence-pdf-btn" onClick={handlePrintPDF} style={{ marginTop: 8 }}>
          Save Report (PDF)
        </button>
      </div>

      {loading ? (
        <div>
          <div className="skeleton skeleton-card" style={{ height: 44, marginBottom: 16 }} />
          <div className="skeleton skeleton-card" style={{ height: 300 }} />
        </div>
      ) : legacy ? (
        // Legacy format — read-only display
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 13, color: "var(--text3)", fontWeight: 600, marginBottom: 12 }}>Legacy format (read-only)</div>
          {weekData.images?.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10, marginBottom: 14 }}>
              {weekData.images.map((img, i) => (
                <img key={i} src={img.dataUrl} alt={img.name || "Evidence"} style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 10, border: "1px solid var(--border)" }} />
              ))}
            </div>
          )}
          {weekData.reflection && <p style={{ fontSize: 14, color: "var(--text2)", whiteSpace: "pre-wrap" }}>{weekData.reflection}</p>}
        </div>
      ) : printMode ? (
        // Print mode — all 5 days visible
        <div className="evidence-print-area">
          <h2 style={{ fontFamily: "var(--font-display)", marginBottom: 16 }}>{course.title} — {weekKey}</h2>
          {DAYS.map(day => {
            const dd = weekData?.[day];
            return (
              <div key={day} style={{ marginBottom: 20, pageBreakInside: "avoid" }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{DAY_FULL[day]}</h3>
                {dd?.image ? (
                  <img src={dd.image.dataUrl} alt="Evidence" style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 8, marginBottom: 8 }} />
                ) : (
                  <div style={{ color: "#999", fontSize: 13, marginBottom: 8 }}>No photo</div>
                )}
                <p style={{ fontSize: 14, whiteSpace: "pre-wrap" }}>{dd?.reflection || "No reflection"}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <>
          {/* Day tabs */}
          <div className="evidence-day-tabs">
            {DAYS.map(day => {
              const hasPhoto = !!weekData?.[day]?.image;
              return (
                <button
                  key={day}
                  className={`evidence-day-tab ${activeDay === day ? "active" : ""}`}
                  onClick={() => setActiveDay(day)}
                >
                  {DAY_LABELS[day]}
                  {hasPhoto && <span className="day-status-dot" />}
                </button>
              );
            })}
          </div>

          {/* Active day panel */}
          <DayPanel
            key={`${weekKey}-${activeDay}`}
            day={activeDay}
            dayData={weekData?.[activeDay]}
            isEditable={isCurrentWeek}
            prompt={prompt}
            onSave={handleSave}
          />
        </>
      )}
    </div>
  );
}

// ─── TeacherView ───

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
      const studentEnrolls = enrolls.filter(e => e.uid || e.studentUid);
      setEnrollments(studentEnrolls);
      const uids = [...new Set(studentEnrolls.map(e => e.uid || e.studentUid))];
      const userMap = {};
      await Promise.all(uids.map(async uid => {
        const snap = await getDoc(doc(db, "users", uid));
        if (snap.exists()) userMap[uid] = snap.data();
      }));
      setUsers(userMap);
      const weekMap = {};
      await Promise.all(uids.map(async uid => {
        const snap = await getDoc(doc(db, "evidence", uid, "courses", courseId, "weeks", currentWeekKey));
        if (snap.exists()) weekMap[uid] = snap.data();
      }));
      setStudentWeeks(weekMap);
      setLoading(false);
    }
    load();
  }, [courseId, currentWeekKey]);

  // Load all weeks for selected student
  const [selectedStudentWeeks, setSelectedStudentWeeks] = useState({});
  const [loadingStudent, setLoadingStudent] = useState(false);

  useEffect(() => {
    if (!selectedStudent) return;
    setLoadingStudent(true);
    const unsub = onSnapshot(
      collection(db, "evidence", selectedStudent, "courses", courseId, "weeks"),
      (snap) => {
        const weeks = {};
        snap.forEach(d => { weeks[d.id] = d.data(); });
        setSelectedStudentWeeks(weeks);
        setLoadingStudent(false);
      }
    );
    return () => unsub();
  }, [selectedStudent, courseId]);

  if (loading) return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {[1, 2, 3, 4, 5].map(i => <div key={i} className="skeleton skeleton-card" style={{ height: 52 }} />)}
    </div>
  );

  // Student detail view
  if (selectedStudent) {
    const u = users[selectedStudent] || {};
    const name = resolveDisplayName({ displayName: u.displayName, nickname: u.nickname, isTeacherViewing: true });
    const weekKeys = Object.keys(selectedStudentWeeks).sort().reverse();
    const prompt = course.evidenceConfig?.prompt || "Daily reflection";

    return (
      <div>
        <button onClick={() => setSelectedStudent(null)}
          style={{ fontSize: 13, color: "var(--text3)", background: "none", border: "none", cursor: "pointer", marginBottom: 16 }}>
          ← Back to all students
        </button>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, marginBottom: 16 }}>{name}</h2>

        {loadingStudent ? (
          <div className="skeleton skeleton-card" style={{ height: 200 }} />
        ) : weekKeys.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: 40, color: "var(--text3)" }}>No evidence submitted yet</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {weekKeys.map(wk => {
              const data = selectedStudentWeeks[wk];
              const range = getWeekRange(wk);
              const legacy = isLegacyFormat(data);

              return (
                <div key={wk} className="card" style={{ padding: 16 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, marginBottom: 10 }}>
                    {wk} — {formatDateShort(range.start)} – {formatDateShort(range.end)}
                  </div>

                  {legacy ? (
                    // Legacy format
                    <>
                      {data.images?.length > 0 && (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 8, marginBottom: 10 }}>
                          {data.images.map((img, i) => (
                            <img key={i} src={img.dataUrl} alt={img.name || "Evidence"} style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 8, border: "1px solid var(--border)" }} />
                          ))}
                        </div>
                      )}
                      {data.reflection && <p style={{ fontSize: 14, color: "var(--text2)", whiteSpace: "pre-wrap" }}>{data.reflection}</p>}
                    </>
                  ) : (
                    // New per-day format
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
                      {DAYS.map(day => {
                        const dd = data[day];
                        return (
                          <div key={day} style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text3)", marginBottom: 4 }}>{DAY_LABELS[day]}</div>
                            {dd?.image ? (
                              <img src={dd.image.dataUrl} alt="Evidence" style={{ width: "100%", height: 80, objectFit: "cover", borderRadius: 6, border: "1px solid var(--border)" }} />
                            ) : (
                              <div style={{ width: "100%", height: 80, borderRadius: 6, background: "var(--surface2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "var(--text3)" }}>—</div>
                            )}
                            {dd?.reflection && (
                              <div style={{ fontSize: 10, color: "var(--text2)", marginTop: 4, lineHeight: 1.3, overflow: "hidden", maxHeight: 40 }}>{dd.reflection}</div>
                            )}
                          </div>
                        );
                      })}
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

  return (
    <div>
      <div style={{ fontSize: 14, color: "var(--text3)", marginBottom: 16 }}>
        {currentWeekKey} — {formatDateShort(range.start)} – {formatDateShort(range.end)}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {enrollments.map(e => {
          const uid = e.uid || e.studentUid;
          const u = users[uid] || {};
          const name = resolveDisplayName({ displayName: u.displayName, nickname: u.nickname, isTeacherViewing: true });
          const daysCount = countDaysWithPhotos(studentWeeks[uid]);
          const hasEvidence = daysCount > 0;

          return (
            <button key={uid} className="card" onClick={() => setSelectedStudent(uid)}
              style={{ display: "flex", alignItems: "center", gap: 14, cursor: "pointer", width: "100%", textAlign: "left", color: "inherit" }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: hasEvidence ? "rgba(16, 185, 129, 0.15)" : "var(--surface2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 700, color: hasEvidence ? "var(--green, #10b981)" : "var(--text3)",
              }}>
                {hasEvidence ? "✓" : "—"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{name}</div>
              </div>
              <div style={{ fontSize: 12, color: "var(--text3)" }}>
                {hasEvidence ? `${daysCount}/5 days` : "Not submitted"}
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

  useEffect(() => {
    getDoc(doc(db, "courses", courseId))
      .then(d => { if (d.exists()) setCourse({ id: d.id, ...d.data() }); })
      .finally(() => setLoading(false));
  }, [courseId]);

  if (loading) return (
    <main id="main-content" className="page-container" style={{ padding: "48px 40px" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <div className="skeleton skeleton-line" style={{ width: 140, height: 13, marginBottom: 16 }} />
        <div className="skeleton skeleton-line" style={{ width: "60%", height: 24, marginBottom: 8 }} />
        <div className="skeleton skeleton-line" style={{ width: "40%", height: 14, marginBottom: 24 }} />
        <div className="skeleton skeleton-card" style={{ height: 44, marginBottom: 16 }} />
        <div className="skeleton skeleton-card" style={{ height: 300 }} />
      </div>
    </main>
  );

  if (!course) return (
    <main id="main-content" className="page-container" style={{ textAlign: "center", paddingTop: 120 }}>
      <h2>Course not found</h2>
    </main>
  );

  if (!course.evidenceConfig?.enabled && !isTeacher) return (
    <main id="main-content" className="page-container" style={{ textAlign: "center", paddingTop: 120 }}>
      <h2>Evidence log not enabled for this course</h2>
      <Link to={`/course/${courseId}`} style={{ color: "var(--amber)", fontSize: 14 }}>← Back to course</Link>
    </main>
  );

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
          }}>📸</div>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700 }}>Weekly Evidence Log</h1>
            <p style={{ color: "var(--text2)", fontSize: 14 }}>{course.title}</p>
          </div>
        </div>

        {isTeacher ? (
          <TeacherView courseId={courseId} course={course} />
        ) : (
          <StudentView courseId={courseId} course={course} user={user} />
        )}
      </div>
    </main>
  );
}
