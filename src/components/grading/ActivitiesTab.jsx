// src/components/grading/ActivitiesTab.jsx
// ─────────────────────────────────────────────────────────────
// Generic activities tab for the Grading Dashboard.
// Reads from the activity registry, fetches submission counts,
// and renders the selected activity's review component.
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, Suspense } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { ACTIVITIES } from "../../config/activityRegistry";

export default function ActivitiesTab({ selectedCourse, studentMap }) {
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [activityCounts, setActivityCounts] = useState({});
  const [loading, setLoading] = useState(true);

  // Filter activities for the selected course
  const visibleActivities = ACTIVITIES.filter(
    (a) => a.course === null || a.course === selectedCourse
  );

  // Fetch submission counts for all visible activities
  useEffect(() => {
    const fetchCounts = async () => {
      setLoading(true);
      const counts = {};
      await Promise.allSettled(
        visibleActivities.map(async (activity) => {
          try {
            const col = activity.courseScoped
              ? collection(db, "courses", selectedCourse, activity.collection)
              : collection(db, activity.collection);
            const snap = await getDocs(col);
            const subs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
            const completed = subs.filter((s) => activity.completionCheck(s)).length;
            const avgScore = subs.length > 0
              ? Math.round(subs.reduce((sum, s) => sum + activity.scoreCalculator(s), 0) / subs.length)
              : 0;
            counts[activity.id] = { total: subs.length, completed, avgScore };
          } catch (err) {
            console.error(`Error fetching ${activity.id}:`, err);
            counts[activity.id] = { total: 0, completed: 0, avgScore: 0 };
          }
        })
      );
      setActivityCounts(counts);
      setLoading(false);
    };
    fetchCounts();
  }, [selectedCourse]);

  // If an activity is selected, render its review component
  if (selectedActivity) {
    const activity = ACTIVITIES.find((a) => a.id === selectedActivity);
    if (!activity) return null;
    const ReviewComponent = activity.component;

    return (
      <div>
        {/* Back button */}
        <button
          onClick={() => setSelectedActivity(null)}
          style={{
            display: "flex", alignItems: "center", gap: 6, background: "none",
            border: "none", cursor: "pointer", fontFamily: "var(--font-body)",
            fontSize: 13, color: "var(--amber)", padding: 0, marginBottom: 20,
            fontWeight: 600,
          }}
        >
          ← Back to Activities
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <span style={{ fontSize: 24 }}>{activity.icon}</span>
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, margin: 0 }}>
              {activity.title}
            </h2>
            {activity.url && (
              <a href={activity.url} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 12, color: "var(--text3)" }}>
                Open activity →
              </a>
            )}
          </div>
        </div>

        <Suspense fallback={
          <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
            <div className="spinner" />
          </div>
        }>
          <ReviewComponent activity={activity} studentMap={studentMap} courseId={selectedCourse} />
        </Suspense>
      </div>
    );
  }

  // Activity list view
  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {[1, 2].map((i) => (
          <div key={i} className="skeleton skeleton-card" style={{ height: 90 }} />
        ))}
      </div>
    );
  }

  if (visibleActivities.length === 0) {
    return (
      <div className="card" style={{ textAlign: "center", padding: 60 }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
        <p style={{ fontSize: 16, fontWeight: 600 }}>No activities available</p>
        <p style={{ color: "var(--text2)", fontSize: 14, marginTop: 8 }}>
          External activity labs will appear here as they're added.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {visibleActivities.map((activity) => {
        const counts = activityCounts[activity.id] || { total: 0, completed: 0, avgScore: 0 };
        return (
          <button
            key={activity.id}
            onClick={() => setSelectedActivity(activity.id)}
            className="card"
            style={{
              display: "flex", alignItems: "center", gap: 16, padding: "16px 20px",
              cursor: "pointer", border: "1px solid var(--border)", textAlign: "left",
              width: "100%", fontFamily: "var(--font-body)", transition: "border-color 0.15s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--amber)"}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border)"}
          >
            <span style={{ fontSize: 28, lineHeight: 1 }}>{activity.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 2, color: "var(--text)" }}>{activity.title}</div>
              <div style={{ fontSize: 12, color: "var(--text3)", lineHeight: 1.4 }}>{activity.description}</div>
            </div>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "var(--font-display)" }}>{counts.total}</div>
                <div style={{ fontSize: 11, color: "var(--text3)" }}>Submitted</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--green)" }}>{counts.completed}</div>
                <div style={{ fontSize: 11, color: "var(--text3)" }}>Complete</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "var(--font-display)", color: counts.avgScore >= 70 ? "var(--green)" : counts.avgScore >= 50 ? "var(--amber)" : "var(--text3)" }}>
                  {counts.total > 0 ? counts.avgScore : "—"}
                </div>
                <div style={{ fontSize: 11, color: "var(--text3)" }}>Avg Score</div>
              </div>
              <span style={{ fontSize: 16, color: "var(--text3)" }}>›</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
