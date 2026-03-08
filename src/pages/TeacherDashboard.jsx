// src/pages/TeacherDashboard.jsx
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, doc, setDoc, addDoc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { generateEnrollCode, removeCoTeacher } from "../lib/enrollment";
import AnnouncementComposer from "../components/AnnouncementComposer";
import JoinCourse from "../components/JoinCourse";

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
  const [announceCourse, setAnnounceCourse] = useState(null); // { id, title } for composer modal
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [coTeacherNames, setCoTeacherNames] = useState({}); // { uid: displayName }
  const [expandedCoTeachers, setExpandedCoTeachers] = useState(null); // courseId

  const firstName = nickname || user?.displayName?.split(" ")[0] || "there";

  const fetchCourses = async () => {
    try {
      const q = query(collection(db, "courses"), orderBy("order", "asc"));
      const snapshot = await getDocs(q);
      const all = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })).filter((c) => !c.hidden);
      // "My Courses" = owned OR co-teaching
      setMyCourses(all.filter((c) =>
        c.ownerUid === user.uid || (c.coTeachers || []).includes(user.uid)
      ));
      // "Other Courses" = not owned and not co-teaching
      setOtherCourses(all.filter((c) =>
        c.ownerUid && c.ownerUid !== user.uid && !(c.coTeachers || []).includes(user.uid)
      ));

      // Resolve co-teacher display names for owned courses
      const allCoTeacherUids = new Set();
      all.forEach((c) => {
        if (c.ownerUid === user.uid && c.coTeachers) {
          c.coTeachers.forEach((uid) => allCoTeacherUids.add(uid));
        }
      });
      if (allCoTeacherUids.size > 0) {
        const names = { ...coTeacherNames };
        for (const uid of allCoTeacherUids) {
          if (!names[uid]) {
            try {
              const userDoc = await getDoc(doc(db, "users", uid));
              if (userDoc.exists()) {
                names[uid] = userDoc.data().displayName || userDoc.data().email || uid;
              } else {
                names[uid] = uid;
              }
            } catch (e) {
              names[uid] = uid;
            }
          }
        }
        setCoTeacherNames(names);
      }
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
        coTeachers: [],
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
        coTeachers: [],
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

  // ============ REMOVE CO-TEACHER ============
  const handleRemoveCoTeacher = async (courseId, teacherUid) => {
    const name = coTeacherNames[teacherUid] || teacherUid;
    if (!window.confirm(`Remove ${name} as co-teacher?`)) return;
    try {
      await removeCoTeacher(courseId, teacherUid);
      await fetchCourses();
    } catch (err) {
      console.error("Failed to remove co-teacher:", err);
      alert("Failed to remove co-teacher.");
    }
  };

  if (loading) {
    return (
      <main id="main-content" className="page-wrapper">
        <div className="page-header">
          <div className="skeleton skeleton-line" style={{ width: 220, height: 28, marginBottom: 8 }} />
          <div className="skeleton skeleton-line" style={{ width: 320, height: 14 }} />
        </div>
        <div className="td-quick-links">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton skeleton-rect" style={{ width: 130, height: 36, borderRadius: 8 }} />
          ))}
        </div>
        <div className="skeleton skeleton-line" style={{ width: 140, height: 20, marginBottom: 16 }} />
        <div className="card-grid card-grid--3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton skeleton-card" style={{ height: 160 }}>
              <div className="skeleton skeleton-circle" style={{ width: 44, height: 44, marginBottom: 12 }} />
              <div className="skeleton skeleton-line" style={{ width: "65%", height: 18 }} />
              <div className="skeleton skeleton-line" style={{ width: "45%", height: 13, marginTop: 8 }} />
            </div>
          ))}
        </div>
      </main>
    );
  }

  const ICONS = ["📚", "🧪", "💻", "🎨", "📐", "🌍", "🧬", "📊", "🎵", "🏛️", "🔬", "📖", "🤖", "⚡", "🧮", "🎭"];

  return (
    <main id="main-content" className="page-wrapper">

        <div className="page-header">
          <h1 className="page-title">Hey {firstName} 👋</h1>
          <p className="page-subtitle">Manage your courses, edit lessons, and review student progress.</p>
        </div>

        <div className="td-quick-links">
          <Link to="/editor" className="btn btn-secondary">✏️ Lesson Editor</Link>
          <Link to="/progress" className="btn btn-secondary">📈 Student Progress</Link>
          <Link to="/grading" className="btn btn-secondary">📊 Grading Dashboard</Link>
          <Link to="/rosters" className="btn btn-secondary">📋 Roster</Link>
        </div>

        {/* ============ MY COURSES ============ */}
        <div className="td-section">
          <div className="td-section-header">
            <h2 className="section-heading" style={{ marginBottom: 0 }}>Your Courses</h2>
            <div className="td-section-actions">
              <button
                className="btn btn-secondary"
                style={{ fontSize: 13, padding: "8px 16px" }}
                onClick={() => setShowJoinModal(true)}
              >
                👥 Join as Co-Teacher
              </button>
              <button className="btn btn-primary" style={{ fontSize: 13, padding: "8px 16px" }} onClick={() => setShowCreateModal(true)}>
                + New Course
              </button>
            </div>
          </div>
          {myCourses.length === 0 ? (
            <div className="card empty-state">
              <div className="empty-state-icon">📚</div>
              <p className="empty-state-title">No courses yet</p>
              <p className="empty-state-text">Create a new course or copy one from the template library below.</p>
            </div>
          ) : (
            <div className="card-grid card-grid--3">
              {myCourses.map((course) => {
                const isOwner = course.ownerUid === user.uid;
                const isCoTeacher = !isOwner;
                const displayCode = course.enrollCode || Object.values(course.sections || {})[0]?.enrollCode || "\u2014";
                const coTeacherList = course.coTeachers || [];

                return (
                  <div key={course.id} className="card fade-in" style={{ position: "relative" }}>
                    {/* Co-Teacher badge */}
                    {isCoTeacher && (
                      <div className="td-card-badge td-card-badge--coteacher">Co-Teacher</div>
                    )}

                    <Link to={`/course/${course.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                        {isOwner ? (
                          <div
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setEditingIcon(editingIcon === course.id ? null : course.id); }}
                            title="Change icon"
                            className={`td-course-icon td-course-icon--editable ${editingIcon === course.id ? "editing" : ""}`}
                          >{course.icon || "📚"}</div>
                        ) : (
                          <div className="td-course-icon td-course-icon--readonly">{course.icon || "📚"}</div>
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="card-title">{course.title}</div>
                          <div className="card-subtitle">{course.description}</div>
                        </div>
                      </div>
                    </Link>

                    {/* Icon picker — owner only */}
                    {isOwner && editingIcon === course.id && (
                      <div className="td-icon-picker">
                        {ICONS.map((icon) => (
                          <button
                            key={icon}
                            onClick={async () => {
                              await updateDoc(doc(db, "courses", course.id), { icon });
                              setEditingIcon(null);
                              fetchCourses();
                            }}
                            className={`td-icon-btn ${(course.icon || "📚") === icon ? "active" : ""}`}
                          >{icon}</button>
                        ))}
                      </div>
                    )}

                    {/* Enrollment code — owner only */}
                    {isOwner && (
                      <div className="td-enroll-code">
                        <span className="td-enroll-label">Enroll Code:</span>
                        <span className="td-enroll-value">{displayCode}</span>
                      </div>
                    )}

                    {/* Co-teacher indicator for co-teachers */}
                    {isCoTeacher && course.ownerEmail && (
                      <div className="td-owner-info">
                        Owner: {course.ownerEmail.split("@")[0]}
                      </div>
                    )}

                    {/* Co-teachers list — owner only */}
                    {isOwner && coTeacherList.length > 0 && (
                      <div>
                        <button
                          onClick={() => setExpandedCoTeachers(expandedCoTeachers === course.id ? null : course.id)}
                          className="td-coteacher-toggle"
                        >
                          👥 {coTeacherList.length} co-teacher{coTeacherList.length !== 1 ? "s" : ""} {expandedCoTeachers === course.id ? "▲" : "▼"}
                        </button>
                        {expandedCoTeachers === course.id && (
                          <div className="td-coteacher-list">
                            {coTeacherList.map((uid) => (
                              <div key={uid} className="td-coteacher-row">
                                <span>{coTeacherNames[uid] || uid}</span>
                                <button
                                  onClick={() => handleRemoveCoTeacher(course.id, uid)}
                                  title="Remove co-teacher"
                                  className="td-coteacher-remove"
                                >✕</button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="td-card-actions">
                      <Link to={`/xp-controls/${course.id}`} className="td-action-link td-action-link--amber">
                        ⚙️ XP Controls
                      </Link>
                      <Link to={`/teams/${course.id}`} className="td-action-link td-action-link--amber">
                        👥 Teams
                      </Link>
                      <Link to={`/mana/${course.id}`} className="td-action-link td-action-link--purple">
                        🔮 Mana
                      </Link>
                      <button
                        onClick={() => setAnnounceCourse({ id: course.id, title: course.title })}
                        className="td-action-btn"
                      >
                        📢 Announce
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ============ TEMPLATE LIBRARY ============ */}
        {otherCourses.length > 0 && (
          <div className="td-section">
            <h2 className="section-heading">
              📖 Template Library
            </h2>
            <p className="td-template-desc">
              Courses shared by other teachers. Browse read-only or copy one to make it your own.
            </p>
            <div className="card-grid card-grid--3">
              {otherCourses.map((course) => (
                <div key={course.id} className="card fade-in" style={{ position: "relative" }}>
                  <div className="td-card-badge td-card-badge--viewonly">View Only</div>

                  <Link to={`/course/${course.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <div className="td-template-icon">{course.icon || "📚"}</div>
                    <div className="card-title">{course.title}</div>
                    <div className="card-subtitle">{course.description}</div>
                  </Link>

                  {course.ownerEmail && (
                    <div className="td-template-by">
                      By {course.ownerEmail.split("@")[0]}
                    </div>
                  )}

                  <div className="td-card-actions">
                    <button
                      onClick={() => handleForkCourse(course)}
                      disabled={copying === course.id}
                      className="td-fork-btn"
                    >
                      {copying === course.id ? "Copying..." : "📋 Copy to My Courses"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* ============ ANNOUNCEMENT COMPOSER MODAL ============ */}
      {announceCourse && (
        <AnnouncementComposer
          courseId={announceCourse.id}
          courseTitle={announceCourse.title}
          user={user}
          onClose={() => setAnnounceCourse(null)}
        />
      )}

      {/* ============ JOIN AS CO-TEACHER MODAL ============ */}
      {showJoinModal && (
        <JoinCourse
          user={user}
          role="teacher"
          onEnrolled={() => fetchCourses()}
          onClose={() => setShowJoinModal(false)}
        />
      )}

      {/* ============ CREATE COURSE MODAL ============ */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440 }}>
            <h2 className="modal-title">Create New Course</h2>

            <div className="td-modal-field">
              <label className="td-modal-label">Course Icon</label>
              <div className="td-modal-icon-picker">
                {ICONS.map((icon) => (
                  <button
                    key={icon}
                    onClick={() => setNewIcon(icon)}
                    className={`td-modal-icon-btn ${newIcon === icon ? "active" : ""}`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div className="td-modal-field">
              <label className="td-modal-label">Course Title *</label>
              <input
                className="input-field"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. AP Physics 1"
                autoFocus
              />
            </div>

            <div className="td-modal-field" style={{ marginBottom: 24 }}>
              <label className="td-modal-label">Description</label>
              <input
                className="input-field"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="e.g. Mechanics, energy, and waves"
              />
            </div>

            <div className="td-modal-actions">
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
    </main>
  );
}
