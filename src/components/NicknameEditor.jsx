// src/components/NicknameEditor.jsx
// Small inline editor for students to set/edit their nickname.
// Shows as a subtle link when no nickname is set, or displays current nickname with edit.

import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth";

export default function NicknameEditor({ currentNickname, onSave }) {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(currentNickname || "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    const trimmed = value.trim();
    setSaving(true);
    try {
      await setDoc(doc(db, "users", user.uid), { nickname: trimmed || null }, { merge: true });
      if (onSave) onSave(trimmed || null);
      setEditing(false);
    } catch (err) {
      console.error("Failed to save nickname:", err);
    }
    setSaving(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") { setEditing(false); setValue(currentNickname || ""); }
  }

  if (editing) {
    return (
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter nickname..."
          aria-label="Nickname"
          maxLength={20}
          autoFocus
          style={{
            padding: "4px 10px", borderRadius: 6, border: "1px solid var(--border)",
            background: "var(--surface)", color: "var(--text)", fontSize: 13,
            fontFamily: "var(--font-body)", width: 140,
          }}
        />
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: "4px 10px", borderRadius: 6, border: "none",
            background: "var(--amber)", color: "var(--bg)", fontSize: 12,
            fontWeight: 600, cursor: "pointer",
          }}
        >
          {saving ? "..." : "Save"}
        </button>
        <button
          onClick={() => { setEditing(false); setValue(currentNickname || ""); }}
          aria-label="Cancel editing nickname"
          style={{
            padding: "4px 8px", borderRadius: 6, border: "1px solid var(--border)",
            background: "transparent", color: "var(--text3)", fontSize: 12, cursor: "pointer",
          }}
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      style={{
        background: "none", border: "none", cursor: "pointer",
        color: "var(--text3)", fontSize: 12, padding: 0,
        textDecoration: "underline", textDecorationStyle: "dotted",
      }}
    >
      {currentNickname ? `✏️ Nickname: ${currentNickname}` : "✏️ Set a nickname"}
    </button>
  );
}
