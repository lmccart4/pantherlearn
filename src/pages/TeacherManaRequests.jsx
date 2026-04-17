// src/pages/TeacherManaRequests.jsx
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth";
import { markRequestFulfilled } from "../lib/manaRequests";

export default function TeacherManaRequests() {
  const { user, userRole } = useAuth();
  const isTeacher = userRole === "teacher";
  const [params] = useSearchParams();
  const focusId = params.get("focus");
  const [rows, setRows] = useState([]);
  const [tab, setTab] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [fulfillingId, setFulfillingId] = useState(null);

  async function load() {
    setLoading(true);
    const q = query(collection(db, "courses"), orderBy("order", "asc"));
    const coursesSnap = await getDocs(q);
    const all = [];
    for (const c of coursesSnap.docs) {
      const courseData = c.data();
      const snap = await getDocs(collection(db, "courses", c.id, "manaRequests"));
      snap.forEach((d) =>
        all.push({
          id: d.id,
          courseId: c.id,
          courseName: courseData.name || c.id,
          ...d.data(),
        })
      );
    }
    all.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
    setRows(all);
    setLoading(false);
  }

  useEffect(() => {
    if (isTeacher) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTeacher]);

  useEffect(() => {
    if (focusId) {
      const el = document.getElementById(`req-${focusId}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [focusId, rows]);

  if (!isTeacher) return <div style={{ padding: 32 }}>Teacher access required.</div>;
  if (loading) return <div style={{ padding: 32 }}>Loading…</div>;

  const pending = rows.filter((r) => r.status === "pending");
  const fulfilled = rows.filter((r) => r.status === "fulfilled");
  const list = tab === "pending" ? pending : fulfilled;

  async function handleFulfill(row) {
    setFulfillingId(row.id);
    try {
      await markRequestFulfilled(row.courseId, row.id);
      await load();
    } catch (err) {
      alert(`Couldn't mark fulfilled: ${err.message}`);
    } finally {
      setFulfillingId(null);
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ margin: "0 0 16px" }}>Mana Redemption Requests</h1>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <button onClick={() => setTab("pending")} style={tabStyle(tab === "pending")}>
          Pending ({pending.length})
        </button>
        <button onClick={() => setTab("fulfilled")} style={tabStyle(tab === "fulfilled")}>
          History ({fulfilled.length})
        </button>
      </div>
      {list.length === 0 ? (
        <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>
          {tab === "pending"
            ? "No pending redemptions. All caught up."
            : "No fulfilled redemptions yet."}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {list.map((row) => (
            <div
              key={row.id}
              id={`req-${row.id}`}
              style={{
                padding: 16,
                borderRadius: 10,
                border:
                  focusId === row.id ? "2px solid #7c3aed" : "1px solid #e2e8f0",
                background: "#fff",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 12,
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: "#0f172a" }}>
                    {row.powerName}{" "}
                    {row.autoFulfilled && (
                      <span
                        style={{
                          background: "#059669",
                          color: "#fff",
                          padding: "2px 8px",
                          borderRadius: 8,
                          fontSize: 10,
                          fontWeight: 700,
                        }}
                      >
                        AUTO
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>
                    {row.studentName} · {row.courseName} · {row.cost} ✦ ·{" "}
                    {new Date(row.createdAt).toLocaleString()}
                  </div>
                  {row.details && (
                    <div style={{ fontSize: 13, color: "#0f172a", marginTop: 6 }}>
                      {row.details}
                    </div>
                  )}
                </div>
                {tab === "pending" && !row.autoFulfilled && (
                  <button
                    onClick={() => handleFulfill(row)}
                    disabled={fulfillingId === row.id}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 8,
                      background: fulfillingId === row.id ? "#a78bfa" : "#7c3aed",
                      color: "#fff",
                      border: "none",
                      fontWeight: 600,
                      cursor: fulfillingId === row.id ? "default" : "pointer",
                    }}
                  >
                    {fulfillingId === row.id ? "Marking…" : "Mark fulfilled"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function tabStyle(active) {
  return {
    padding: "8px 16px",
    borderRadius: 8,
    border: "1px solid #e2e8f0",
    background: active ? "#7c3aed" : "#fff",
    color: active ? "#fff" : "#0f172a",
    fontWeight: 600,
    cursor: "pointer",
  };
}
