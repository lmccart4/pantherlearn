// src/pages/TeacherDashboard.jsx
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";
import { resolveFirstName } from "../lib/displayName";

export default function TeacherDashboard() {
  const { user, nickname } = useAuth();
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const firstName = nickname || user?.displayName?.split(" ")[0] || "there";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, "courses"), orderBy("order", "asc"));
        const snapshot = await getDocs(q);
        const coursesData = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((c) => !c.ownerUid || c.ownerUid === user.uid);
        setAllCourses(coursesData);
      } catch (err) {
        console.error("Error fetching teacher dashboard:", err);
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="page-container" style={{ display: "flex", justifyContent: "center", paddingTop: 120 }}>
        <div className="spinner" />
      </div>
    );
  }

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