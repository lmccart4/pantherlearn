// src/components/ManaPool.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { getManaState, castVote, MANA_CAP } from "../lib/mana";
import { useTranslatedTexts } from "../hooks/useTranslatedText.jsx";

export default function ManaPool({ courseId, compact = false }) {
  const { user, userRole } = useAuth();
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const uiStrings = useTranslatedTexts([
    "Class Mana",                                // 0
    "Class Mana Pool",                           // 1
    "Earn mana together, unlock class powers",   // 2
    "Vote: Activate",                            // 3
    "Yes",                                       // 4
    "No",                                        // 5
    "Recent",                                    // 6
    "How Mana Works",                            // 7
    "Earn Mana",                                 // 8
    "Lose Mana",                                 // 9
    "Good class behavior",                       // 10
    "Quiz scores above 80%",                     // 11
    "Perfect attendance day",                    // 12
    "Great class participation",                 // 13
    "Class disruption",                          // 14
    "Widespread off-task behavior",              // 15
    "Mana above 50 MP decays 10% weekly",        // 16
    "Spend mana to activate class powers!",      // 17
  ]);
  const ui = (i, fallback) => uiStrings?.[i] ?? fallback;

  useEffect(() => {
    if (!courseId) {
      setLoading(false);
      return;
    }
    loadMana();
  }, [courseId]);

  async function loadMana() {
    try {
      const s = await getManaState(courseId);
      setState(s);
    } catch (err) {
      console.error("Error loading mana:", err);
    }
    setLoading(false);
  }

  async function handleVote(powerId, vote) {
    if (!user || voting) return;
    setVoting(true);
    try {
      await castVote(courseId, undefined, powerId, user.uid, vote);
      await loadMana();
    } catch (err) {
      console.error("Vote error:", err);
    }
    setVoting(false);
  }

  if (loading || !state || !state.enabled) return null;

  const pct = Math.min((state.currentMP / MANA_CAP) * 100, 100);
  const isLow = pct < 20;
  const isHigh = pct > 70;
  const glowColor = isLow ? "#8b5cf6" : isHigh ? "#06b6d4" : "#a78bfa";
  const barColor = isLow
    ? "linear-gradient(90deg, #7c3aed, #8b5cf6)"
    : isHigh
    ? "linear-gradient(90deg, #8b5cf6, #06b6d4)"
    : "linear-gradient(90deg, #8b5cf6, #a78bfa)";

  const activePower = state.activeVote
    ? (state.powers || []).find((p) => p.id === state.activeVote)
    : null;

  const myVote = activePower
    ? (state.votes?.[state.activeVote] || []).find((v) => v.uid === user?.uid)
    : null;

  const yesVotes = activePower
    ? (state.votes?.[state.activeVote] || []).filter((v) => v.vote === true).length
    : 0;
  const noVotes = activePower
    ? (state.votes?.[state.activeVote] || []).filter((v) => v.vote === false).length
    : 0;
  const totalVotes = yesVotes + noVotes;

  if (compact) {
    return (
      <div style={{
        background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10,
        padding: "12px 14px",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em" }} data-translatable>
            🔮 {ui(0, "Class Mana")}
          </span>
          <span style={{ fontSize: 13, fontWeight: 700, color: glowColor }}>
            {state.currentMP}/{MANA_CAP}
          </span>
        </div>
        <div style={{ height: 6, background: "var(--surface2)", borderRadius: 3, overflow: "hidden" }}>
          <div style={{
            width: `${pct}%`, height: "100%", background: barColor,
            borderRadius: 3, transition: "width 0.6s ease",
            boxShadow: `0 0 8px ${glowColor}44`,
          }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: "var(--surface)", border: `1px solid ${glowColor}33`,
      borderRadius: 14, padding: "20px 24px", marginBottom: 20,
      boxShadow: `0 0 20px ${glowColor}11`,
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 24 }}>🔮</span>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700 }} data-translatable>{ui(1, "Class Mana Pool")}</div>
            <div style={{ fontSize: 12, color: "var(--text3)" }} data-translatable>{ui(2, "Earn mana together, unlock class powers")}</div>
          </div>
        </div>
        <div style={{
          fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, color: glowColor,
        }}>
          {state.currentMP}<span style={{ fontSize: 14, color: "var(--text3)", fontWeight: 400 }}>/{MANA_CAP} MP</span>
        </div>
      </div>

      {/* Mana Bar */}
      <div style={{
        height: 18, background: "var(--surface2)", borderRadius: 10, overflow: "hidden",
        position: "relative", marginBottom: 12,
        boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3)",
      }}>
        <div style={{
          width: `${pct}%`, height: "100%", background: barColor,
          borderRadius: 10, transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: `0 0 16px ${glowColor}55, inset 0 1px 2px rgba(255,255,255,0.2)`,
          position: "relative",
        }}>
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
            backgroundSize: "200% 100%",
            animation: "manaShimmer 3s linear infinite",
          }} />
        </div>
      </div>

      {/* How Mana Works toggle */}
      <button
        onClick={() => setShowInfo(!showInfo)}
        style={{
          background: "none", border: "none", cursor: "pointer",
          fontSize: 12, color: "var(--text3)", fontWeight: 600,
          padding: "2px 0", marginBottom: showInfo ? 0 : 14,
          display: "flex", alignItems: "center", gap: 4,
        }}
      >
        <span style={{ transition: "transform 0.2s", transform: showInfo ? "rotate(90deg)" : "rotate(0deg)", display: "inline-block" }}>▸</span>
        <span data-translatable>{ui(7, "How Mana Works")}</span>
      </button>

      {showInfo && (
        <div style={{
          background: `${glowColor}08`, border: `1px solid ${glowColor}22`,
          borderRadius: 10, padding: "14px 18px", marginTop: 8, marginBottom: 14,
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16,
        }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--green)", marginBottom: 8, display: "flex", alignItems: "center", gap: 4 }} data-translatable>
              📈 {ui(8, "Earn Mana")}
            </div>
            {[
              { icon: "👏", text: ui(10, "Good class behavior"), amount: "+5" },
              { icon: "📝", text: ui(11, "Quiz scores above 80%"), amount: "+5" },
              { icon: "✅", text: ui(12, "Perfect attendance day"), amount: "+15" },
              { icon: "🙋", text: ui(13, "Great class participation"), amount: "+10" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, fontSize: 12 }}>
                <span>{item.icon}</span>
                <span style={{ flex: 1, color: "var(--text2)" }} data-translatable>{item.text}</span>
                <span style={{ color: "var(--green)", fontWeight: 700, fontFamily: "var(--font-display)", fontSize: 11 }}>{item.amount}</span>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--red)", marginBottom: 8, display: "flex", alignItems: "center", gap: 4 }} data-translatable>
              📉 {ui(9, "Lose Mana")}
            </div>
            {[
              { icon: "🚫", text: ui(14, "Class disruption"), amount: "−5" },
              { icon: "📵", text: ui(15, "Widespread off-task behavior"), amount: "−10" },
              { icon: "📊", text: ui(16, "Mana above 50 MP decays 10% weekly"), amount: "" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, fontSize: 12 }}>
                <span>{item.icon}</span>
                <span style={{ flex: 1, color: "var(--text2)" }} data-translatable>{item.text}</span>
                {item.amount && <span style={{ color: "var(--red)", fontWeight: 700, fontFamily: "var(--font-display)", fontSize: 11 }}>{item.amount}</span>}
              </div>
            ))}
            <div style={{ marginTop: 8, fontSize: 11, color: "var(--text3)", fontStyle: "italic" }} data-translatable>
              💡 {ui(17, "Spend mana to activate class powers!")}
            </div>
          </div>
        </div>
      )}

      {/* Active Vote */}
      {activePower && (
        <div style={{
          background: `${glowColor}11`, border: `1px solid ${glowColor}33`,
          borderRadius: 10, padding: "14px 18px", marginBottom: 14,
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
            <span>🗳️</span>
            <span data-translatable>{ui(3, "Vote: Activate")} "{activePower.name}"?</span>
            <span style={{ fontSize: 12, color: "var(--text3)", fontWeight: 400 }}>({activePower.cost} MP)</span>
          </div>
          <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 12 }}>{activePower.description}</div>

          {userRole !== "teacher" && (
            <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
              <button
                onClick={() => handleVote(activePower.id, true)} disabled={voting}
                style={{
                  flex: 1, padding: "8px 16px", borderRadius: 8, border: "none",
                  background: myVote?.vote === true ? "var(--green)" : "var(--surface2)",
                  color: myVote?.vote === true ? "var(--bg)" : "var(--text2)",
                  fontWeight: 600, fontSize: 13, cursor: "pointer",
                }}
                data-translatable
              >
                👍 {ui(4, "Yes")} {yesVotes > 0 && `(${yesVotes})`}
              </button>
              <button
                onClick={() => handleVote(activePower.id, false)} disabled={voting}
                style={{
                  flex: 1, padding: "8px 16px", borderRadius: 8, border: "none",
                  background: myVote?.vote === false ? "var(--red)" : "var(--surface2)",
                  color: myVote?.vote === false ? "#fff" : "var(--text2)",
                  fontWeight: 600, fontSize: 13, cursor: "pointer",
                }}
                data-translatable
              >
                👎 {ui(5, "No")} {noVotes > 0 && `(${noVotes})`}
              </button>
            </div>
          )}

          {totalVotes > 0 && (
            <div style={{ height: 6, background: "var(--surface2)", borderRadius: 3, overflow: "hidden", display: "flex" }}>
              <div style={{ width: `${(yesVotes / totalVotes) * 100}%`, background: "var(--green)", transition: "width 0.3s" }} />
              <div style={{ width: `${(noVotes / totalVotes) * 100}%`, background: "var(--red)", transition: "width 0.3s" }} />
            </div>
          )}
        </div>
      )}

      {/* Available Powers */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {(state.powers || []).map((power) => {
          const canAfford = state.currentMP >= power.cost;
          return (
            <div key={power.id} style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "6px 12px", borderRadius: 8,
              background: canAfford ? `${glowColor}11` : "var(--surface2)",
              border: `1px solid ${canAfford ? `${glowColor}33` : "var(--border)"}`,
              opacity: canAfford ? 1 : 0.5, fontSize: 12,
            }}>
              <span>{power.icon || "⚡"}</span>
              <span style={{ fontWeight: 600 }}>{power.name}</span>
              <span style={{ color: "var(--text3)" }}>{power.cost} MP</span>
            </div>
          );
        })}
      </div>

      {/* Recent History */}
      {(state.history || []).length > 0 && (
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
          <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }} data-translatable>{ui(6, "Recent")}</div>
          {(state.history || []).slice(0, 3).map((entry, i) => (
            <div key={i} style={{ fontSize: 12, color: "var(--text2)", marginBottom: 3, display: "flex", gap: 6 }}>
              <span style={{
                color: entry.type === "gain" ? "var(--green)" : entry.type === "decay" ? "var(--text3)" : "var(--red)",
                fontWeight: 600,
              }}>
                {entry.type === "gain" ? "+" : "−"}{entry.amount} MP
              </span>
              <span>{entry.reason}</span>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes manaShimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
    </div>
  );
}
