// src/components/Leaderboard.jsx
// Richer leaderboard with podium (top 3), privacy mode support, and codenames.

import { useState, useEffect } from "react";
import { getLeaderboard, getLevelInfo, getRankTier } from "../lib/gamification";
import { useAuth } from "../hooks/useAuth";
import { resolveDisplayName } from "../lib/displayName";
import { useTranslatedTexts } from "../hooks/useTranslatedText.jsx";

const PODIUM_COLORS = {
  1: { bg: "linear-gradient(135deg, #ffd700 0%, #f5a623 100%)", border: "#ffd700", shadow: "rgba(255,215,0,0.3)", label: "🥇" },
  2: { bg: "linear-gradient(135deg, #c0c0c0 0%, #9ca3af 100%)", border: "#c0c0c0", shadow: "rgba(192,192,192,0.3)", label: "🥈" },
  3: { bg: "linear-gradient(135deg, #cd7f32 0%, #a0522d 100%)", border: "#cd7f32", shadow: "rgba(205,127,50,0.3)", label: "🥉" },
};

export default function Leaderboard({ courseId }) {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const uiStrings = useTranslatedTexts([
    "🏆 Class Leaderboard",  // 0
    "Rank",                   // 1
    "You",                    // 2
    "Level",                  // 3
  ]);
  const ui = (i, fallback) => uiStrings?.[i] ?? fallback;

  useEffect(() => {
    if (!courseId) return;
    const load = async () => {
      const data = await getLeaderboard(courseId);
      setEntries(data);
      setLoading(false);
    };
    load();
  }, [courseId]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 30, color: "var(--text3)" }}>
        <div className="spinner" style={{ margin: "0 auto" }} />
      </div>
    );
  }

  if (entries.length === 0) return null;

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);
  const userIdx = entries.findIndex((e) => e.uid === user?.uid);

  const getDisplayName = (entry) => {
    // Privacy modes: "visible" (default), "codename", "hidden"
    const privacy = entry.leaderboardPrivacy || "visible";
    if (privacy === "hidden" && entry.uid !== user?.uid) return null; // hidden from others
    if (privacy === "codename") return entry.codename || "Anonymous Panther";
    return resolveDisplayName({ displayName: entry.displayName, nickname: entry.nickname });
  };

  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, color: "var(--text2)", marginBottom: 16 }} data-translatable>
        {ui(0, "🏆 Class Leaderboard")}
      </h2>

      {/* Podium — top 3 */}
      {top3.length > 0 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 12, marginBottom: 24 }}>
          {/* Show in order: 2nd, 1st, 3rd */}
          {[1, 0, 2].map((podiumIdx) => {
            const entry = top3[podiumIdx];
            if (!entry) return null;
            const rank = podiumIdx + 1;
            const podium = PODIUM_COLORS[rank];
            const level = getLevelInfo(entry.totalXP || 0);
            const name = getDisplayName(entry);
            const isUser = entry.uid === user?.uid;
            const heights = { 1: 120, 2: 90, 3: 70 };

            return (
              <div key={entry.uid} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: rank === 1 ? 130 : 110 }}>
                {/* Avatar */}
                <div style={{
                  width: rank === 1 ? 56 : 44, height: rank === 1 ? 56 : 44, borderRadius: "50%",
                  border: `3px solid ${podium.border}`, overflow: "hidden", marginBottom: 8,
                  boxShadow: `0 0 16px ${podium.shadow}`,
                }}>
                  {entry.photoURL ? (
                    <img src={entry.photoURL} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} referrerPolicy="no-referrer" />
                  ) : (
                    <div style={{ width: "100%", height: "100%", background: "var(--surface2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: rank === 1 ? 22 : 18 }}>
                      {level.current.tierIcon}
                    </div>
                  )}
                </div>

                {/* Name */}
                <div style={{
                  fontSize: 12, fontWeight: 700, textAlign: "center", marginBottom: 4,
                  color: isUser ? "var(--amber)" : "var(--text)",
                  maxWidth: 110, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {isUser ? `${ui(2, "You")}` : name}
                </div>

                {/* Podium block */}
                <div style={{
                  width: "100%", height: heights[rank], background: podium.bg,
                  borderRadius: "10px 10px 0 0", display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", position: "relative",
                }}>
                  <span style={{ fontSize: rank === 1 ? 28 : 22 }}>{podium.label}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(0,0,0,0.7)" }}>
                    {(entry.totalXP || 0).toLocaleString()} XP
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Rest of leaderboard */}
      {rest.length > 0 && (
        <div style={{ background: "var(--surface)", borderRadius: "var(--radius)", border: "1px solid var(--border)", overflow: "hidden" }}>
          {rest.map((entry, i) => {
            const rank = i + 4;
            const level = getLevelInfo(entry.totalXP || 0);
            const tier = getRankTier(level.current.level);
            const name = getDisplayName(entry);
            const isUser = entry.uid === user?.uid;

            if (!name && !isUser) return null; // hidden privacy

            return (
              <div key={entry.uid} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "10px 18px",
                borderBottom: i < rest.length - 1 ? "1px solid rgba(50,57,82,0.3)" : "none",
                background: isUser ? "rgba(245,166,35,0.06)" : "transparent",
              }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: "var(--text3)", minWidth: 28, textAlign: "center" }}>
                  #{rank}
                </span>
                {entry.photoURL ? (
                  <img src={entry.photoURL} alt="" style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid var(--border)" }} referrerPolicy="no-referrer" />
                ) : (
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--surface2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
                    {tier.icon}
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: isUser ? "var(--amber)" : "var(--text)" }}>
                    {isUser ? ui(2, "You") : name}
                  </span>
                </div>
                <span style={{ fontSize: 12, color: tier.color, fontWeight: 600 }}>Lv {level.current.level}</span>
                <span style={{ fontSize: 12, color: "var(--text3)", fontWeight: 600, minWidth: 60, textAlign: "right" }}>
                  {(entry.totalXP || 0).toLocaleString()} XP
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* User's rank if not in top visible */}
      {userIdx >= 3 && (
        <div style={{ textAlign: "center", marginTop: 12, fontSize: 13, color: "var(--amber)", fontWeight: 600 }}>
          {ui(1, "Rank")} #{userIdx + 1} — {(entries[userIdx].totalXP || 0).toLocaleString()} XP
        </div>
      )}
    </div>
  );
}
