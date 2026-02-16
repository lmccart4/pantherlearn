// src/components/ChatToggle.jsx
// Small toggle for teachers to enable/disable class chat for a course.
// Can be placed on the Dashboard or CoursePage.

import { useState, useEffect } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth";

export default function ChatToggle({ courseId }) {
  const { userRole } = useAuth();
  const [enabled, setEnabled] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!courseId) return;
    const unsub = onSnapshot(doc(db, "courses", courseId), (snap) => {
      const data = snap.data();
      setEnabled(data?.chatEnabled !== false);
    });
    return unsub;
  }, [courseId]);

  if (userRole !== "teacher") return null;

  const toggle = async () => {
    setSaving(true);
    await setDoc(doc(db, "courses", courseId), { chatEnabled: !enabled }, { merge: true });
    setSaving(false);
  };

  return (
    <button
      onClick={toggle}
      disabled={saving}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "4px 10px", borderRadius: 6, border: "none", fontSize: 12,
        fontWeight: 600, cursor: "pointer",
        background: enabled ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
        color: enabled ? "var(--green, #22c55e)" : "#ef4444",
      }}
      title={enabled ? "Click to disable student chat" : "Click to enable student chat"}
    >
      💬 Chat: {enabled ? "On" : "Off"}
    </button>
  );
}
