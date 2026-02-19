// src/components/AnnouncementComposer.jsx
// Modal for teachers to compose and publish announcements.

import { useState } from "react";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { fanOutNotification } from "../lib/notifications";

const ANNOUNCEMENT_ICONS = ["📢", "📣", "🎉", "⚠️", "📝", "🔔", "💡", "🎯"];

export default function AnnouncementComposer({ courseId, courseTitle, user, onClose }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [icon, setIcon] = useState("📢");
  const [pinned, setPinned] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const handlePublish = async () => {
    if (!title.trim() || publishing) return;
    setPublishing(true);

    try {
      const annRef = doc(collection(db, "courses", courseId, "announcements"));
      await setDoc(annRef, {
        title: title.trim(),
        body: body.trim(),
        icon,
        pinned,
        priority: pinned ? "high" : "normal",
        authorUid: user.uid,
        authorName: user.displayName || "Teacher",
        createdAt: serverTimestamp(),
      });

      // Fan out notification to all enrolled students
      await fanOutNotification(courseId, {
        type: "announcement",
        title: `📢 ${courseTitle || "Course"}: ${title.trim()}`,
        body: body.trim().slice(0, 120) || undefined,
        icon: "📢",
        link: null,
      });

      onClose();
    } catch (err) {
      console.error("Failed to publish announcement:", err);
      alert("Failed to publish announcement. Please try again.");
    }
    setPublishing(false);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <div className="announce-composer" onClick={(e) => e.stopPropagation()}>
        <h2>📢 New Announcement</h2>

        <div className="announce-field">
          <label>Icon</label>
          <div style={{ display: "flex", gap: 6 }}>
            {ANNOUNCEMENT_ICONS.map((ic) => (
              <button
                key={ic}
                onClick={() => setIcon(ic)}
                style={{
                  fontSize: 22, width: 36, height: 36, borderRadius: 8, cursor: "pointer",
                  border: icon === ic ? "2px solid var(--amber)" : "1px solid var(--border)",
                  background: icon === ic ? "var(--amber-dim)" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >{ic}</button>
            ))}
          </div>
        </div>

        <div className="announce-field">
          <label>Title *</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Homework reminder for Unit 3"
            autoFocus
          />
        </div>

        <div className="announce-field">
          <label>Message (optional)</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Add details..."
            rows={3}
          />
        </div>

        <div className="announce-field" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <input
            type="checkbox"
            id="pin-toggle"
            checked={pinned}
            onChange={() => setPinned(!pinned)}
            style={{ width: 16, height: 16, cursor: "pointer", accentColor: "var(--amber)" }}
          />
          <label htmlFor="pin-toggle" style={{ cursor: "pointer", margin: 0, fontSize: 13, color: "var(--text2)" }}>
            📌 Pin to top of announcements
          </label>
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
          <button className="btn btn-secondary" onClick={onClose} style={{ fontSize: 14, padding: "8px 18px" }}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={handlePublish}
            disabled={!title.trim() || publishing}
            style={{ fontSize: 14, padding: "8px 18px", opacity: !title.trim() || publishing ? 0.5 : 1 }}
          >
            {publishing ? "Publishing..." : "📢 Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}
