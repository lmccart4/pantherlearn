// src/components/chatbot-workshop/StumpLeaderboard.jsx
// Leaderboard showing top bot stumpers in the course arcade.

import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { getArcadeStats } from "../../lib/botStore";

export default function StumpLeaderboard({ courseId }) {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!courseId) return;
    loadStats();
  }, [courseId]);

  async function loadStats() {
    setLoading(true);
    try {
      const raw = await getArcadeStats(db, courseId);
      // Sort by totalStumps descending
      const sorted = raw
        .filter(s => (s.totalStumps || 0) > 0)
        .sort((a, b) => (b.totalStumps || 0) - (a.totalStumps || 0));
      setStats(sorted);
    } catch (err) {
      console.error("Error loading arcade stats:", err);
    }
    setLoading(false);
  }

  if (loading) return null;
  if (stats.length === 0) return null;

  return (
    <div style={{
      background: "var(--surface)", borderRadius: 16, padding: 0, overflow: "hidden",
      border: "1px solid var(--border, rgba(255,255,255,0.08))",
    }}>
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{
          display: "flex", alignItems: "center", gap: 10, width: "100%",
          padding: "16px 20px", background: "none", border: "none",
          cursor: "pointer", color: "var(--text)", textAlign: "left",
        }}
      >
        <span style={{ fontSize: 22 }}>🏆</span>
        <span style={{ flex: 1, fontSize: 15, fontWeight: 700 }}>Stump Leaderboard</span>
        <span style={{ fontSize: 12, color: "var(--text3)", transition: "transform 0.2s", transform: collapsed ? "rotate(-90deg)" : "rotate(0)" }}>
          ▼
        </span>
      </button>

      {!collapsed && (
        <div style={{ padding: "0 20px 16px" }}>
          {stats.slice(0, 10).map((entry, i) => {
            const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : null;
            return (
              <div key={entry.id} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "10px 0",
                borderBottom: i < stats.length - 1 ? "1px solid var(--border, rgba(255,255,255,0.05))" : "none",
              }}>
                <span style={{
                  width: 28, height: 28, borderRadius: 8, display: "flex",
                  alignItems: "center", justifyContent: "center", fontSize: medal ? 16 : 12,
                  fontWeight: 700, color: medal ? undefined : "var(--text3)",
                  background: medal ? undefined : "var(--surface2, rgba(255,255,255,0.05))",
                }}>
                  {medal || (i + 1)}
                </span>
                <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
                  {entry.displayName || entry.id}
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--amber)" }}>
                  {entry.totalStumps || 0} stumps
                </span>
                <span style={{ fontSize: 11, color: "var(--text3)" }}>
                  {entry.totalTests || 0} tests
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
