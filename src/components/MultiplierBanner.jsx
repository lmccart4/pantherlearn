// src/components/MultiplierBanner.jsx
import { useState, useEffect } from "react";
import { useTranslatedTexts } from "../hooks/useTranslatedText.jsx";

export default function MultiplierBanner({ activeMultiplier, compact = false }) {
  const [timeLeft, setTimeLeft] = useState("");
  const [isActive, setIsActive] = useState(false);

  const uiStrings = useTranslatedTexts([
    "Active!",                                  // 0
    "All XP earned is multiplied right now",    // 1
  ]);
  const ui = (i, fallback) => uiStrings?.[i] ?? fallback;

  useEffect(() => {
    if (!activeMultiplier) {
      setIsActive(false);
      return;
    }

    const expires = activeMultiplier.expiresAt?.toDate?.()
      ? activeMultiplier.expiresAt.toDate()
      : new Date(activeMultiplier.expiresAt);

    function updateTimer() {
      const now = new Date();
      const diff = expires - now;

      if (diff <= 0) {
        setIsActive(false);
        setTimeLeft("");
        return;
      }

      setIsActive(true);
      const hours = Math.floor(diff / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);

      if (hours > 0) {
        setTimeLeft(`${hours}h ${mins}m`);
      } else if (mins > 0) {
        setTimeLeft(`${mins}m ${secs}s`);
      } else {
        setTimeLeft(`${secs}s`);
      }
    }

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [activeMultiplier]);

  if (!isActive) return null;

  if (compact) {
    return (
      <div style={{
        background: "linear-gradient(135deg, #f39c12, #e74c3c)",
        borderRadius: 8, padding: "8px 12px",
        display: "flex", alignItems: "center", gap: 6,
        color: "#fff", fontSize: 12, fontWeight: 600, marginBottom: 8,
      }}>
        <span>🚀</span>
        <span>{activeMultiplier.label}</span>
        <span style={{ opacity: 0.8, marginLeft: "auto", fontSize: 11 }}>{timeLeft}</span>
      </div>
    );
  }

  return (
    <div style={{
      background: "linear-gradient(135deg, #f39c1222, #e74c3c22)",
      border: "1px solid #f39c1255",
      borderRadius: 12, padding: "14px 20px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      marginBottom: 20,
      animation: "multiplierGlow 2s ease-in-out infinite alternate",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 28 }}>🚀</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#f39c12" }} data-translatable>
            {activeMultiplier.label} {ui(0, "Active!")}
          </div>
          <div style={{ fontSize: 12, color: "var(--text2, #aaa)" }} data-translatable>
            {ui(1, "All XP earned is multiplied right now")}
          </div>
        </div>
      </div>
      <div style={{
        background: "#f39c1233", borderRadius: 8,
        padding: "8px 14px", fontWeight: 700, color: "#f39c12",
        fontSize: 14, fontFamily: "monospace",
      }}>
        ⏱ {timeLeft}
      </div>
    </div>
  );
}
