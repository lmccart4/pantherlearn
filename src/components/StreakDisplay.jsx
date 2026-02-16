// src/components/StreakDisplay.jsx
import { useState } from "react";
import { useTranslatedTexts } from "../hooks/useTranslatedText.jsx";

export default function StreakDisplay({ currentStreak = 0, longestStreak = 0, streakFreezes = 0, compact = false }) {
  const [showTooltip, setShowTooltip] = useState(false);

  const uiStrings = useTranslatedTexts([
    "day",                                           // 0
    "days",                                          // 1
    "Keep it going!",                                // 2
    "Start a streak by being active today",          // 3
    "Best:",                                         // 4
    "Streak Info",                                   // 5
    "Be active each day to build your streak",       // 6
    "Weekends don't break your streak",              // 7
    "Earn streak freezes every 7 days (max 3)",      // 8
    "Longer streaks = XP multiplier bonus!",         // 9
    "Streak freeze available",                       // 10
    "Empty freeze slot",                             // 11
    "Streak freezes available",                      // 12
  ]);
  const ui = (i, fallback) => uiStrings?.[i] ?? fallback;

  const dayLabel = currentStreak !== 1 ? ui(1, "days") : ui(0, "day");

  const intensity = Math.min(currentStreak / 30, 1);
  const fireColor = currentStreak >= 30
    ? "#9b59b6"
    : currentStreak >= 14
    ? "#e74c3c"
    : currentStreak >= 7
    ? "#f39c12"
    : currentStreak >= 3
    ? "#f1c40f"
    : "var(--text2, #aaa)";

  if (compact) {
    return (
      <div style={{
        display: "flex", alignItems: "center", gap: 6, fontSize: 13,
        color: currentStreak > 0 ? fireColor : "var(--text2, #aaa)",
      }}>
        <span style={{ fontSize: 16 }}>{currentStreak > 0 ? "🔥" : "💤"}</span>
        <span style={{ fontWeight: 600 }}>{currentStreak} {dayLabel}</span>
        {streakFreezes > 0 && (
          <span title={ui(12, "Streak freezes available")} style={{ fontSize: 12 }}>
            🧊×{streakFreezes}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        background: "var(--surface1, #1e1e2e)",
        borderRadius: 12, padding: "16px",
        border: `1px solid ${currentStreak >= 7 ? fireColor + "44" : "var(--border, #2a2a3a)"}`,
        transition: "all 0.3s ease",
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            fontSize: 32,
            filter: currentStreak > 0 ? "none" : "grayscale(1)",
            transition: "all 0.3s ease",
          }}>
            {currentStreak >= 30 ? "🔥👑" : currentStreak > 0 ? "🔥" : "💤"}
          </div>
          <div>
            <div style={{
              fontSize: 22, fontWeight: 800,
              color: currentStreak > 0 ? fireColor : "var(--text2, #aaa)",
              fontFamily: "var(--font-display, var(--font-body))",
            }} data-translatable>
              {currentStreak} {currentStreak !== 1 ? ui(1, "Days") : ui(0, "Day")}
            </div>
            <div style={{ fontSize: 12, color: "var(--text2, #aaa)" }} data-translatable>
              {currentStreak > 0 ? ui(2, "Keep it going!") : ui(3, "Start a streak by being active today")}
            </div>
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 4,
            justifyContent: "flex-end", marginBottom: 4,
          }}>
            {[...Array(3)].map((_, i) => (
              <span
                key={i}
                style={{
                  fontSize: 16,
                  filter: i < streakFreezes ? "none" : "grayscale(1) opacity(0.3)",
                }}
                title={i < streakFreezes ? ui(10, "Streak freeze available") : ui(11, "Empty freeze slot")}
              >
                🧊
              </span>
            ))}
          </div>
          <div style={{ fontSize: 11, color: "var(--text2, #aaa)" }} data-translatable>
            {ui(4, "Best:")} {longestStreak} {longestStreak !== 1 ? ui(1, "days") : ui(0, "day")}
          </div>
        </div>
      </div>

      {currentStreak > 0 && (
        <div style={{ marginTop: 12, display: "flex", gap: 3, alignItems: "center" }}>
          {[3, 7, 14, 21, 30].map((milestone) => (
            <div key={milestone} style={{ flex: 1, textAlign: "center" }}>
              <div style={{
                height: 4, borderRadius: 2,
                background: currentStreak >= milestone ? fireColor : "var(--border, #2a2a3a)",
                transition: "background 0.3s ease", marginBottom: 3,
              }} />
              <span style={{
                fontSize: 9,
                color: currentStreak >= milestone ? fireColor : "var(--text2, #666)",
                fontWeight: currentStreak >= milestone ? 700 : 400,
              }}>
                {milestone}d
              </span>
            </div>
          ))}
        </div>
      )}

      {showTooltip && (
        <div style={{
          position: "absolute",
          bottom: "calc(100% + 8px)", right: 0,
          background: "var(--surface2, #252535)",
          border: "1px solid var(--border, #2a2a3a)",
          borderRadius: 8, padding: "10px 14px",
          fontSize: 12, color: "var(--text2, #aaa)",
          maxWidth: 240, zIndex: 10,
          boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
        }}>
          <div style={{ fontWeight: 600, color: "var(--text1, #e8e8e8)", marginBottom: 4 }} data-translatable>
            {ui(5, "Streak Info")}
          </div>
          <div data-translatable>• {ui(6, "Be active each day to build your streak")}</div>
          <div data-translatable>• {ui(7, "3-hour grace period after midnight")}</div>
          <div data-translatable>• {ui(8, "Earn streak freezes every 7 days (max 3)")}</div>
          <div data-translatable>• {ui(9, "Longer streaks = XP multiplier bonus!")}</div>
        </div>
      )}
    </div>
  );
}
