// src/components/AnnouncementBanner.jsx
// Displays recent and pinned teacher announcements on the student dashboard.

import { useState, useEffect } from "react";
import { collection, query, orderBy, limit, onSnapshot, where } from "firebase/firestore";
import { db } from "../lib/firebase";

function timeAgo(date) {
  if (!date) return "";
  const d = date instanceof Date ? date : date?.toDate?.() ? date.toDate() : new Date(date);
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString();
}

export default function AnnouncementBanner({ courseId }) {
  const [announcements, setAnnouncements] = useState([]);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!courseId) return;
    const q = query(
      collection(db, "courses", courseId, "announcements"),
      orderBy("createdAt", "desc"),
      limit(5)
    );
    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        createdAt: d.data().createdAt?.toDate?.() || new Date(),
      }));
      setAnnouncements(items);
    });
    return () => unsub();
  }, [courseId]);

  if (announcements.length === 0) return null;

  // Sort: pinned first, then by date
  const sorted = [...announcements].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.createdAt - a.createdAt;
  });

  const hasPinned = sorted.some((a) => a.pinned);

  return (
    <div className={`announcement-banner ${hasPinned ? "pinned" : ""}`}>
      <div
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 20px", cursor: "pointer",
          borderBottom: collapsed ? "none" : "1px solid rgba(50,57,82,0.3)",
        }}
        onClick={() => setCollapsed(!collapsed)}
      >
        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--amber)", letterSpacing: "0.02em" }}>
          📢 Announcements ({announcements.length})
        </span>
        <span style={{ fontSize: 12, color: "var(--text3)", transition: "transform 0.2s", transform: collapsed ? "rotate(-90deg)" : "rotate(0)" }}>
          ▾
        </span>
      </div>

      {!collapsed && sorted.map((ann) => (
        <div key={ann.id} className="announcement-item">
          <div className="announcement-icon">{ann.icon || "📢"}</div>
          <div className="announcement-body">
            <div className="announcement-title">{ann.title}</div>
            {ann.body && <div className="announcement-text">{ann.body}</div>}
            <div className="announcement-meta">
              {ann.authorName || "Teacher"} · {timeAgo(ann.createdAt)}
            </div>
          </div>
          {ann.pinned && <span className="announcement-pin-badge">Pinned</span>}
        </div>
      ))}
    </div>
  );
}
