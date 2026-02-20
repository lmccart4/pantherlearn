// src/components/Leaderboard.jsx
// Epic leaderboard with animated podium, top-10 limit, podium streak tracking,
// and privacy mode support.

import { useState, useEffect } from "react";
import { getLeaderboard, getLevelInfo, getRankTier } from "../lib/gamification";
import { useAuth } from "../hooks/useAuth";
import { resolveDisplayName } from "../lib/displayName";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

const MAX_VISIBLE = 10;

const PODIUM_STYLES = {
  1: {
    bg: "linear-gradient(135deg, #ffd700 0%, #f5a623 60%, #ff8c00 100%)",
    border: "#ffd700",
    shadow: "0 0 28px rgba(255,215,0,0.4), 0 0 60px rgba(255,215,0,0.15)",
    glow: "rgba(255,215,0,0.35)",
    label: "🥇",
    textShadow: "0 2px 8px rgba(255,215,0,0.4)",
  },
  2: {
    bg: "linear-gradient(135deg, #e8e8e8 0%, #b0b0b0 60%, #9ca3af 100%)",
    border: "#d4d4d8",
    shadow: "0 0 20px rgba(200,200,200,0.25), 0 0 40px rgba(200,200,200,0.1)",
    glow: "rgba(200,200,200,0.25)",
    label: "🥈",
    textShadow: "0 2px 6px rgba(200,200,200,0.3)",
  },
  3: {
    bg: "linear-gradient(135deg, #e8985a 0%, #cd7f32 60%, #a0522d 100%)",
    border: "#cd7f32",
    shadow: "0 0 20px rgba(205,127,50,0.3), 0 0 40px rgba(205,127,50,0.1)",
    glow: "rgba(205,127,50,0.25)",
    label: "🥉",
    textShadow: "0 2px 6px rgba(205,127,50,0.3)",
  },
};

export default function Leaderboard({ courseId }) {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [podiumStreak, setPodiumStreak] = useState(null); // { days, lastDate }

  useEffect(() => {
    if (!courseId) return;
    const load = async () => {
      const data = await getLeaderboard(courseId);
      setEntries(data);
      setLoading(false);

      // Load & update podium streak for current user
      if (user && data.length >= 3) {
        const top3Uids = data.slice(0, 3).map((e) => e.uid);
        const isOnPodium = top3Uids.includes(user.uid);
        try {
          const streakRef = doc(db, "courses", courseId, "gamification", user.uid);
          const streakDoc = await getDoc(streakRef);
          const existing = streakDoc.exists() ? streakDoc.data() : {};
          const today = new Date().toISOString().split("T")[0];
          const lastPodiumDate = existing.lastPodiumDate || null;
          let streak = existing.podiumStreak || 0;

          let totalDays = existing.totalPodiumDays || 0;

          if (isOnPodium && lastPodiumDate !== today) {
            // Check if consecutive day
            if (lastPodiumDate) {
              const lastDate = new Date(lastPodiumDate);
              const todayDate = new Date(today);
              const diffDays = Math.round((todayDate - lastDate) / (1000 * 60 * 60 * 24));
              streak = diffDays === 1 ? streak + 1 : 1;
            } else {
              streak = 1;
            }
            totalDays += 1;
            await setDoc(streakRef, {
              podiumStreak: streak,
              lastPodiumDate: today,
              bestPodiumStreak: Math.max(streak, existing.bestPodiumStreak || 0),
              totalPodiumDays: totalDays,
            }, { merge: true });
          } else if (!isOnPodium && lastPodiumDate) {
            const lastDate = new Date(lastPodiumDate);
            const todayDate = new Date(today);
            const diffDays = Math.round((todayDate - lastDate) / (1000 * 60 * 60 * 24));
            if (diffDays > 1) streak = 0;
          }

          setPodiumStreak({
            days: streak,
            best: Math.max(streak, existing.bestPodiumStreak || 0),
            total: totalDays,
            isOnPodium,
          });
        } catch (e) {
          // Non-critical
          console.warn("Podium streak check failed:", e);
        }
      }
    };
    load();
  }, [courseId, user]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 30, color: "var(--text3)" }}>
        <div className="spinner" style={{ margin: "0 auto" }} />
      </div>
    );
  }

  if (entries.length === 0) return null;

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3, MAX_VISIBLE);
  const userIdx = entries.findIndex((e) => e.uid === user?.uid);
  const userInTop10 = userIdx >= 0 && userIdx < MAX_VISIBLE;

  const getDisplayName = (entry) => {
    const privacy = entry.leaderboardPrivacy || "visible";
    if (privacy === "hidden" && entry.uid !== user?.uid) return null;
    if (privacy === "codename") return entry.codename || "Anonymous Panther";
    return resolveDisplayName({ displayName: entry.displayName, nickname: entry.nickname });
  };

  return (
    <div style={{ marginBottom: 32 }}>
      {/* Title */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10, marginBottom: 20,
      }}>
        <span style={{ fontSize: 24 }}>🏆</span>
        <h2 style={{
          fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700,
          color: "var(--text)", margin: 0, letterSpacing: "-0.01em",
        }}>
          Leaderboard
        </h2>
      </div>

      {/* Epic Podium — top 3 */}
      {top3.length > 0 && (
        <div style={{
          background: "linear-gradient(180deg, rgba(176,142,255,0.04) 0%, rgba(245,166,35,0.04) 50%, transparent 100%)",
          borderRadius: 16, padding: "24px 16px 0", marginBottom: 16,
          border: "1px solid rgba(50,57,82,0.3)",
        }}>
          <div style={{
            display: "flex", justifyContent: "center", alignItems: "flex-end",
            gap: 8, paddingBottom: 0,
          }}>
            {/* Display order: 2nd, 1st, 3rd */}
            {[1, 0, 2].map((podiumIdx) => {
              const entry = top3[podiumIdx];
              if (!entry) return <div key={podiumIdx} style={{ width: 100 }} />;
              const rank = podiumIdx + 1;
              const podium = PODIUM_STYLES[rank];
              const level = getLevelInfo(entry.totalXP || 0);
              const tier = getRankTier(level.current.level);
              const name = getDisplayName(entry);
              const isUser = entry.uid === user?.uid;
              const heights = { 1: 100, 2: 72, 3: 56 };
              const avatarSize = rank === 1 ? 60 : 48;

              return (
                <div key={entry.uid} style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  width: rank === 1 ? 140 : 110, transition: "all 0.3s",
                }}>
                  {/* Crown for #1 */}
                  {rank === 1 && (
                    <div style={{
                      fontSize: 26, marginBottom: -4, filter: "drop-shadow(0 2px 8px rgba(255,215,0,0.5))",
                      animation: "crownFloat 3s ease-in-out infinite",
                    }}>
                      👑
                    </div>
                  )}

                  {/* Avatar with glow ring */}
                  <div style={{
                    position: "relative", marginBottom: 8,
                  }}>
                    {/* Outer glow */}
                    <div style={{
                      position: "absolute", inset: -4, borderRadius: "50%",
                      background: `radial-gradient(circle, ${podium.glow}, transparent 70%)`,
                      animation: rank === 1 ? "podiumGlow 2s ease-in-out infinite" : undefined,
                    }} />
                    <div style={{
                      width: avatarSize, height: avatarSize, borderRadius: "50%",
                      border: `3px solid ${podium.border}`, overflow: "hidden",
                      boxShadow: podium.shadow, position: "relative", zIndex: 1,
                    }}>
                      {entry.photoURL ? (
                        <img src={entry.photoURL} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} referrerPolicy="no-referrer" />
                      ) : (
                        <div style={{
                          width: "100%", height: "100%", background: "var(--surface2)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: rank === 1 ? 24 : 20,
                        }}>
                          {tier.icon}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Name */}
                  <div style={{
                    fontSize: 12, fontWeight: 700, textAlign: "center", marginBottom: 4,
                    color: isUser ? "var(--amber)" : "var(--text)",
                    maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    textShadow: isUser ? "0 0 12px rgba(245,166,35,0.3)" : undefined,
                  }}>
                    {isUser ? "You" : name}
                  </div>

                  {/* XP */}
                  <div style={{
                    fontSize: 10, fontWeight: 600, color: "var(--text3)", marginBottom: 6,
                  }}>
                    {(entry.totalXP || 0).toLocaleString()} XP
                  </div>

                  {/* Podium block */}
                  <div style={{
                    width: "100%", height: heights[rank], background: podium.bg,
                    borderRadius: "12px 12px 0 0",
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    position: "relative", overflow: "hidden",
                  }}>
                    {/* Shimmer effect for #1 */}
                    {rank === 1 && (
                      <div style={{
                        position: "absolute", inset: 0,
                        background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)",
                        backgroundSize: "200% 100%",
                        animation: "podiumShimmer 3s linear infinite",
                      }} />
                    )}
                    <span style={{ fontSize: rank === 1 ? 32 : 24, position: "relative", zIndex: 1 }}>
                      {podium.label}
                    </span>
                    <span style={{
                      fontSize: 11, fontWeight: 800, color: "rgba(0,0,0,0.6)",
                      position: "relative", zIndex: 1, letterSpacing: "0.02em",
                    }}>
                      Lv {level.current.level}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Podium stats badges */}
      {podiumStreak && podiumStreak.isOnPodium && (podiumStreak.days > 0 || podiumStreak.total > 0) && (
        <div style={{
          display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap",
        }}>
          {/* Consecutive days streak */}
          {podiumStreak.days > 0 && (
            <div style={{
              flex: 1, minWidth: 140, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              padding: "10px 16px",
              background: "linear-gradient(135deg, rgba(255,215,0,0.08), rgba(245,166,35,0.05))",
              border: "1px solid rgba(255,215,0,0.15)", borderRadius: 10,
            }}>
              <span style={{ fontSize: 18 }}>🔥</span>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--amber)" }}>
                  {podiumStreak.days} day{podiumStreak.days !== 1 ? "s" : ""} streak
                </span>
                {podiumStreak.best > podiumStreak.days && (
                  <span style={{ fontSize: 10, color: "var(--text3)" }}>
                    Best: {podiumStreak.best}
                  </span>
                )}
              </div>
            </div>
          )}
          {/* Total days on podium */}
          {podiumStreak.total > 0 && (
            <div style={{
              flex: 1, minWidth: 140, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              padding: "10px 16px",
              background: "linear-gradient(135deg, rgba(176,142,255,0.08), rgba(176,142,255,0.04))",
              border: "1px solid rgba(176,142,255,0.15)", borderRadius: 10,
            }}>
              <span style={{ fontSize: 18 }}>🏅</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--purple)" }}>
                {podiumStreak.total} total podium day{podiumStreak.total !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Ranks 4–10 */}
      {rest.length > 0 && (
        <div style={{
          background: "var(--surface)", borderRadius: "var(--radius)",
          border: "1px solid var(--border)", overflow: "hidden",
        }}>
          {rest.map((entry, i) => {
            const rank = i + 4;
            const level = getLevelInfo(entry.totalXP || 0);
            const tier = getRankTier(level.current.level);
            const name = getDisplayName(entry);
            const isUser = entry.uid === user?.uid;

            if (!name && !isUser) return null;

            return (
              <div key={entry.uid} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
                borderBottom: i < rest.length - 1 ? "1px solid rgba(50,57,82,0.25)" : "none",
                background: isUser ? "rgba(245,166,35,0.06)" : "transparent",
                transition: "background 0.15s",
              }}>
                <span style={{
                  fontWeight: 800, fontSize: 13, color: "var(--text3)",
                  minWidth: 26, textAlign: "center",
                  fontFamily: "var(--font-display)",
                }}>
                  {rank}
                </span>
                {entry.photoURL ? (
                  <img src={entry.photoURL} alt="" style={{
                    width: 26, height: 26, borderRadius: "50%",
                    border: "1px solid var(--border)",
                  }} referrerPolicy="no-referrer" />
                ) : (
                  <div style={{
                    width: 26, height: 26, borderRadius: "50%", background: "var(--surface2)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13,
                  }}>
                    {tier.icon}
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{
                    fontSize: 13, fontWeight: 600,
                    color: isUser ? "var(--amber)" : "var(--text)",
                  }}>
                    {isUser ? "You" : name}
                  </span>
                </div>
                <span style={{ fontSize: 11, color: tier.color, fontWeight: 700 }}>
                  Lv {level.current.level}
                </span>
                <span style={{
                  fontSize: 11, color: "var(--text3)", fontWeight: 600,
                  minWidth: 52, textAlign: "right",
                }}>
                  {(entry.totalXP || 0).toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Current user's rank if outside top 10 */}
      {userIdx >= MAX_VISIBLE && (
        <div style={{
          marginTop: 12, padding: "12px 16px", borderRadius: 10,
          background: "rgba(245,166,35,0.06)", border: "1px solid rgba(245,166,35,0.15)",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{
            fontWeight: 800, fontSize: 14, color: "var(--amber)",
            fontFamily: "var(--font-display)", minWidth: 30,
          }}>
            #{userIdx + 1}
          </span>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--amber)", flex: 1 }}>
            You
          </span>
          <span style={{ fontSize: 12, color: "var(--text3)", fontWeight: 600 }}>
            {(entries[userIdx].totalXP || 0).toLocaleString()} XP
          </span>
        </div>
      )}
    </div>
  );
}
