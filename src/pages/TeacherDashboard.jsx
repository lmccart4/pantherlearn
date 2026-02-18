// src/pages/TeacherDashboard.jsx
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, doc, setDoc, addDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { generateEnrollCode } from "../lib/enrollment";

export default function TeacherDashboard() {
  const { user, nickname } = useAuth();
  const navigate = useNavigate();
  const [myCourses, setMyCourses] = useState([]);
  const [otherCourses, setOtherCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copying, setCopying] = useState(null);

  // Create course modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newIcon, setNewIcon] = useState("📚");
  const [creating, setCreating] = useState(false);

  const [editingIcon, setEditingIcon] = useState(null); // courseId

  const firstName = nickname || user?.displayName?.split(" ")[0] || "there";

  const fetchCourses = async () => {
    try {
      const q = query(collection(db, "courses"), orderBy("order", "asc"));
      const snapshot = await getDocs(q);
      const all = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })).filter((c) => !c.hidden);
      setMyCourses(all.filter((c) => c.ownerUid === user.uid));
      setOtherCourses(all.filter((c) => c.ownerUid && c.ownerUid !== user.uid));
    } catch (err) {
      console.error("Error fetching teacher dashboard:", err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchCourses(); }, [user]);

  // ============ CREATE COURSE ============
  const handleCreateCourse = async () => {
    if (!newTitle.trim() || creating) return;
    setCreating(true);
    try {
      await addDoc(collection(db, "courses"), {
        title: newTitle.trim(),
        description: newDescription.trim(),
        icon: newIcon || "📚",
        order: myCourses.length + 1,
        ownerUid: user.uid,
        ownerEmail: user.email,
        enrollCode: await generateEnrollCode(newTitle.trim()),
        createdAt: new Date(),
      });
      setShowCreateModal(false);
      setNewTitle("");
      setNewDescription("");
      setNewIcon("📚");
      await fetchCourses();
    } catch (err) {
      console.error("Failed to create course:", err);
      alert("Failed to create course. Please try again.");
    }
    setCreating(false);
  };

  // ============ FORK COURSE ============
  const handleForkCourse = async (course) => {
    if (copying) return;
    const confirmed = window.confirm(
      `Create your own copy of "${course.title}"?\n\nThis will duplicate all lessons and blocks into a new course that you own. Students and grades will NOT be copied.`
    );
    if (!confirmed) return;

    setCopying(course.id);
    try {
      const newCourseRef = await addDoc(collection(db, "courses"), {
        title: `${course.title} (Copy)`,
        description: course.description || "",
        icon: course.icon || "📚",
        order: myCourses.length + 1,
        ownerUid: user.uid,
        ownerEmail: user.email,
        enrollCode: await generateEnrollCode(`${course.title} (Copy)`),
        forkedFrom: course.id,
        forkedAt: new Date(),
        createdAt: new Date(),
      });

      const lessonsSnap = await getDocs(
        query(collection(db, "courses", course.id, "lessons"), orderBy("order", "asc"))
      );
      for (const lessonDoc of lessonsSnap.docs) {
        await setDoc(doc(db, "courses", newCourseRef.id, "lessons", lessonDoc.id), {
          ...lessonDoc.data(),
          visible: false,
        });
      }

      try {
        const settingsSnap = await getDocs(collection(db, "courses", course.id, "settings"));
        for (const settingDoc of settingsSnap.docs) {
          await setDoc(doc(db, "courses", newCourseRef.id, "settings", settingDoc.id), settingDoc.data());
        }
      } catch (e) { /* no settings */ }

      await fetchCourses();
    } catch (err) {
      console.error("Failed to fork course:", err);
      alert("Failed to copy course. Please try again.");
    }
    setCopying(null);
  };

  if (loading) {
    return (
      <div className="page-container" style={{ display: "flex", justifyContent: "center", paddingTop: 120 }}>
        <div className="spinner" />
      </div>
    );
  }

  const ICONS = ["📚", "🧪", "💻", "🎨", "📐", "🌍", "🧬", "📊", "🎵", "🏛️", "🔬", "📖", "🤖", "⚡", "🧮", "🎭"];

  return (
    <div className="page-container" style={{ padding: "48px 40px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 700, marginBottom: 6 }}>Hey {firstName} 👋</h1>
          <p style={{ color: "var(--text2)", fontSize: 15 }}>Manage your courses, edit lessons, and review student progress.</p>
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 36, flexWrap: "wrap" }}>
          <Link to="/editor" className="btn btn-secondary" style={{ textDecoration: "none" }}>✏️ Lesson Editor</Link>
          <Link to="/progress" className="btn btn-secondary" style={{ textDecoration: "none" }}>📈 Student Progress</Link>
          <Link to="/grading" className="btn btn-secondary" style={{ textDecoration: "none" }}>📊 Grading Dashboard</Link>
          <Link to="/rosters" className="btn btn-secondary" style={{ textDecoration: "none" }}>📋 Roster</Link>
        </div>

        {/* ============ MY COURSES ============ */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, color: "var(--text2)" }}>Your Courses</h2>
            <button className="btn btn-primary" style={{ fontSize: 13, padding: "8px 16px" }} onClick={() => setShowCreateModal(true)}>
              + New Course
            </button>
          </div>
          {myCourses.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: 48 }}>
              <p style={{ fontSize: 32, marginBottom: 8 }}>📚</p>
              <p style={{ fontWeight: 600, marginBottom: 4 }}>No courses yet</p>
              <p style={{ color: "var(--text3)", fontSize: 13 }}>Create a new course or copy one from the template library below.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
              {myCourses.map((course) => {
                const displayCode = course.enrollCode || Object.values(course.sections || {})[0]?.enrollCode || "\u2014";

                return (
                  <div key={course.id} className="card fade-in">
                    <Link to={`/course/${course.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                        <div
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setEditingIcon(editingIcon === course.id ? null : course.id); }}
                          title="Change icon"
                          style={{
                            fontSize: 32, width: 56, height: 56, borderRadius: 12,
                            background: "var(--amber-dim)", display: "flex", alignItems: "center", justifyContent: "center",
                            cursor: "pointer", border: editingIcon === course.id ? "2px solid var(--amber)" : "2px solid transparent",
                            transition: "border-color 0.15s",
                          }}
                        >{course.icon || "📚"}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="card-title">{course.title}</div>
                          <div className="card-subtitle">{course.description}</div>
                        </div>
                      </div>
                    </Link>

                    {/* Icon picker */}
                    {editingIcon === course.id && (
                      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 10, padding: "8px 0" }}>
                        {ICONS.map((icon) => (
                          <button
                            key={icon}
                            onClick={async () => {
                              await updateDoc(doc(db, "courses", course.id), { icon });
                              setEditingIcon(null);
                              fetchCourses();
                            }}
                            style={{
                              fontSize: 22, width: 36, height: 36, borderRadius: 8, cursor: "pointer",
                              border: (course.icon || "📚") === icon ? "2px solid var(--amber)" : "1px solid var(--border)",
                              background: (course.icon || "📚") === icon ? "var(--amber-dim)" : "transparent",
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}
                          >{icon}</button>
                        ))}
                      </div>
                    )}

                    {/* Enrollment code */}
                    <div style={{
                      marginTop: 12, padding: "10px 12px", background: "var(--surface2)",
                      borderRadius: 8, fontSize: 12, display: "flex", justifyContent: "space-between", alignItems: "center",
                    }}>
                      <span style={{ color: "var(--text3)", fontWeight: 600 }}>Enroll Code:</span>
                      <span style={{
                        fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14,
                        color: "var(--amber)", letterSpacing: 1.5,
                      }}>{displayCode}</span>
                    </div>

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
                );
              })}
            </div>
          )}
        </div>

        {/* ============ TEMPLATE LIBRARY ============ */}
        {otherCourses.length > 0 && (
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, color: "var(--text2)", marginBottom: 6 }}>
              📖 Template Library
            </h2>
            <p style={{ color: "var(--text3)", fontSize: 13, marginBottom: 14 }}>
              Courses shared by other teachers. Browse read-only or copy one to make it your own.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {otherCourses.map((course) => (
                <div key={course.id} className="card fade-in" style={{ position: "relative" }}>
                  <div style={{
                    position: "absolute", top: 12, right: 12,
                    fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                    letterSpacing: "0.05em", color: "var(--text3)",
                    background: "var(--surface2)", padding: "3px 8px", borderRadius: 6,
                  }}>
                    View Only
                  </div>

                  <Link to={`/course/${course.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <div style={{ fontSize: 32, marginBottom: 12, width: 56, height: 56, borderRadius: 12, background: "var(--surface2)", display: "flex", alignItems: "center", justifyContent: "center" }}>{course.icon || "📚"}</div>
                    <div className="card-title">{course.title}</div>
                    <div className="card-subtitle">{course.description}</div>
                  </Link>

                  {course.ownerEmail && (
                    <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 8 }}>
                      By {course.ownerEmail.split("@")[0]}
                    </div>
                  )}

                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
                    <button
                      onClick={() => handleForkCourse(course)}
                      disabled={copying === course.id}
                      style={{
                        fontSize: 13, fontWeight: 700, color: "var(--amber)",
                        background: "none", border: "none", cursor: "pointer",
                        padding: 0, opacity: copying === course.id ? 0.5 : 1,
                      }}
                    >
                      {copying === course.id ? "Copying..." : "📋 Copy to My Courses"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ============ CREATE COURSE MODAL ============ */}
      {showCreateModal && (
        <div
          onClick={() => setShowCreateModal(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--surface)", borderRadius: 16, padding: "32px 28px",
              width: "100%", maxWidth: 440, border: "1px solid var(--border)",
            }}
          >
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, marginBottom: 20 }}>
              Create New Course
            </h2>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: "var(--text3)", display: "block", marginBottom: 4 }}>Course Icon</label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {ICONS.map((icon) => (
                  <button
                    key={icon}
                    onClick={() => setNewIcon(icon)}
                    style={{
                      fontSize: 24, width: 40, height: 40, borderRadius: 8, cursor: "pointer",
                      border: newIcon === icon ? "2px solid var(--amber)" : "1px solid var(--border)",
                      background: newIcon === icon ? "var(--amber-dim)" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: "var(--text3)", display: "block", marginBottom: 4 }}>Course Title *</label>
              <input
                className="editor-input"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. AP Physics 1"
                autoFocus
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 12, color: "var(--text3)", display: "block", marginBottom: 4 }}>Description</label>
              <input
                className="editor-input"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="e.g. Mechanics, energy, and waves"
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
              <button
                className="btn btn-primary"
                onClick={handleCreateCourse}
                disabled={!newTitle.trim() || creating}
                style={{ opacity: !newTitle.trim() || creating ? 0.5 : 1 }}
              >
                {creating ? "Creating..." : "Create Course"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
