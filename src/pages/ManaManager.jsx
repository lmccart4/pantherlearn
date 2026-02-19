// src/pages/ManaManager.jsx
// Teacher-only page for managing course mana pool.
// Route: /mana/:courseId

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import {
  getManaState, saveManaState, awardMana, deductMana,
  spendMana, applyDecay, startVote, endVote,
  addPower, removePower,
  MANA_CAP, DEFAULT_POWERS,
} from "../lib/mana";

export default function ManaManager() {
  const { courseId } = useParams();
  const { userRole } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [state, setState] = useState(null);

  // Award/deduct form
  const [awardAmount, setAwardAmount] = useState(5);
  const [awardReason, setAwardReason] = useState("");
  const [isDeducting, setIsDeducting] = useState(false);

  // New power form
  const [showNewPower, setShowNewPower] = useState(false);
  const [newPower, setNewPower] = useState({ name: "", description: "", cost: 25, icon: "⚡" });

  useEffect(() => {
    if (userRole !== "teacher") { navigate("/"); return; }
    loadCourse();
  }, [courseId, userRole]);

  async function loadCourse() {
    setLoading(true);
    try {
      const courseDoc = await getDoc(doc(db, "courses", courseId));
      if (courseDoc.exists()) {
        const courseData = { id: courseDoc.id, ...courseDoc.data() };
        setCourse(courseData);
        await loadMana();
      }
    } catch (err) {
      console.error("Error loading course:", err);
    }
    setLoading(false);
  }

  async function loadMana() {
    try {
      const s = await getManaState(courseId);
      setState(s);
    } catch (err) {
      console.error("Error loading mana:", err);
    }
  }

  async function handleToggleEnabled() {
    const updated = { ...state, enabled: !state.enabled };
    setState(updated);
    await saveManaState(courseId, undefined, updated);
  }

  async function handleAward() {
    if (!awardReason.trim()) return;
    if (isDeducting) {
      await deductMana(courseId, undefined, awardAmount, awardReason.trim());
    } else {
      await awardMana(courseId, undefined, awardAmount, awardReason.trim(), "teacher");
    }
    setAwardReason("");
    await loadMana();
  }

  async function handleQuickAward(amount, reason) {
    if (amount > 0) {
      await awardMana(courseId, undefined, amount, reason, "teacher");
    } else {
      await deductMana(courseId, undefined, Math.abs(amount), reason);
    }
    await loadMana();
  }

  async function handleActivatePower(powerId) {
    try {
      await spendMana(courseId, undefined, powerId);
      await loadMana();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleStartVote(powerId) {
    await startVote(courseId, undefined, powerId);
    await loadMana();
  }

  async function handleEndVote() {
    await endVote(courseId);
    await loadMana();
  }

  async function handleApplyDecay() {
    const result = await applyDecay(courseId);
    if (result.decayed) {
      alert(`Decayed ${result.decayAmount} MP → ${result.newMP} MP remaining`);
    } else {
      alert("No decay needed (below threshold or already applied this week)");
    }
    await loadMana();
  }

  async function handleAddPower() {
    if (!newPower.name.trim()) return;
    await addPower(courseId, undefined, newPower);
    setNewPower({ name: "", description: "", cost: 25, icon: "⚡" });
    setShowNewPower(false);
    await loadMana();
  }

  async function handleRemovePower(powerId) {
    if (!confirm("Remove this power?")) return;
    await removePower(courseId, undefined, powerId);
    await loadMana();
  }

  async function handleResetToDefaults() {
    if (!confirm("Reset powers to defaults? Custom powers will be lost.")) return;
    const updated = { ...state, powers: DEFAULT_POWERS };
    await saveManaState(courseId, undefined, updated);
    await loadMana();
  }

  if (loading) {
    return (
      <div className="page-container" style={{ display: "flex", justifyContent: "center", paddingTop: 120 }}>
        <div className="spinner" />
      </div>
    );
  }

  const pct = state ? Math.min((state.currentMP / MANA_CAP) * 100, 100) : 0;
  const glowColor = pct < 20 ? "#8b5cf6" : pct > 70 ? "#06b6d4" : "#a78bfa";

  const cardStyle = {
    background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12,
    padding: "18px 22px", marginBottom: 16,
  };
  const btnPrimary = {
    padding: "8px 16px", borderRadius: 8, border: "none", fontWeight: 600, fontSize: 13,
    cursor: "pointer", background: glowColor, color: "#fff",
  };
  const btnSecondary = {
    padding: "8px 16px", borderRadius: 8, border: "1px solid var(--border)", fontWeight: 600,
    fontSize: 13, cursor: "pointer", background: "transparent", color: "var(--text2)",
  };
  const btnDanger = {
    padding: "4px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "transparent",
    color: "var(--red)", cursor: "pointer", fontSize: 12, fontWeight: 600,
  };

  const poolLabel = course?.title || "Course";

  return (
    <div className="page-container" style={{ padding: "48px 40px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
          <button onClick={() => navigate(`/course/${courseId}`)} style={{ ...btnSecondary, padding: "6px 12px" }}>← Back</button>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700 }}>🔮 Mana Pool</h1>
        </div>
        <p style={{ color: "var(--text2)", fontSize: 14, marginBottom: 20 }}>
          {course?.title} — Manage course mana pool
        </p>

        {!state ? (
          <div style={{ textAlign: "center", padding: 40, color: "var(--text3)" }}>Loading mana state...</div>
        ) : (
          <>
            {/* Enable Toggle + Pool Status */}
            <div style={cardStyle}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15, fontWeight: 600 }}>
                  <input
                    type="checkbox" checked={state?.enabled || false}
                    onChange={handleToggleEnabled}
                    style={{ accentColor: glowColor, width: 18, height: 18 }}
                  />
                  Mana Pool Enabled
                </label>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, color: glowColor }}>
                  {state.currentMP}<span style={{ fontSize: 14, color: "var(--text3)", fontWeight: 400 }}>/{MANA_CAP} MP</span>
                </div>
              </div>

              {/* Bar */}
              <div style={{
                height: 14, background: "var(--surface2)", borderRadius: 7, overflow: "hidden", marginBottom: 16,
              }}>
                <div style={{
                  width: `${pct}%`, height: "100%",
                  background: `linear-gradient(90deg, #8b5cf6, ${glowColor})`,
                  borderRadius: 7, transition: "width 0.6s ease",
                  boxShadow: `0 0 12px ${glowColor}44`,
                }} />
              </div>

              {/* Quick Award Buttons */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                {[
                  { label: "+5 Good Behavior", amount: 5, reason: "Good class behavior" },
                  { label: "+5 Quiz Scores", amount: 5, reason: "Strong quiz scores" },
                  { label: "+15 Attendance", amount: 15, reason: "Perfect attendance day" },
                  { label: "+10 Participation", amount: 10, reason: "Great participation" },
                  { label: "−5 Disruption", amount: -5, reason: "Class disruption" },
                ].map((btn) => (
                  <button
                    key={btn.label}
                    onClick={() => handleQuickAward(btn.amount, btn.reason)}
                    style={{
                      padding: "6px 12px", borderRadius: 6,
                      border: `1px solid ${btn.amount > 0 ? "var(--green)" : "var(--red)"}33`,
                      background: `${btn.amount > 0 ? "var(--green)" : "var(--red)"}11`,
                      color: btn.amount > 0 ? "var(--green)" : "var(--red)",
                      fontSize: 12, fontWeight: 600, cursor: "pointer",
                    }}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>

              {/* Custom award/deduct */}
              <div style={{ display: "flex", gap: 8, alignItems: "flex-end", flexWrap: "wrap" }}>
                <div>
                  <label style={{ fontSize: 11, color: "var(--text3)", display: "block", marginBottom: 3 }}>
                    {isDeducting ? "Deduct" : "Award"} Amount
                  </label>
                  <input
                    type="number" min={1} max={MANA_CAP} value={awardAmount}
                    onChange={(e) => setAwardAmount(parseInt(e.target.value) || 0)}
                    style={{
                      width: 60, padding: "6px 10px", borderRadius: 6,
                      border: "1px solid var(--border)", background: "var(--surface2)",
                      color: "var(--text1)", fontSize: 13, textAlign: "center",
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, color: "var(--text3)", display: "block", marginBottom: 3 }}>Reason</label>
                  <input
                    type="text" value={awardReason} placeholder="e.g. Great lab behavior"
                    onChange={(e) => setAwardReason(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAward()}
                    style={{
                      width: "100%", padding: "6px 10px", borderRadius: 6,
                      border: "1px solid var(--border)", background: "var(--surface2)",
                      color: "var(--text1)", fontSize: 13,
                    }}
                  />
                </div>
                <button onClick={handleAward} disabled={!awardReason.trim()} style={{ ...btnPrimary, opacity: awardReason.trim() ? 1 : 0.5 }}>
                  {isDeducting ? "Deduct" : "Award"}
                </button>
                <button onClick={() => setIsDeducting(!isDeducting)} style={btnSecondary}>
                  {isDeducting ? "Switch to Award" : "Switch to Deduct"}
                </button>
              </div>
            </div>

            {/* Powers */}
            <div style={cardStyle}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ fontSize: 16, fontWeight: 700 }}>⚡ Powers</div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => setShowNewPower(true)} style={btnPrimary}>+ Add Power</button>
                  <button onClick={handleResetToDefaults} style={btnSecondary}>Reset Defaults</button>
                </div>
              </div>

              {showNewPower && (
                <div style={{ background: "var(--surface2)", borderRadius: 8, padding: 14, marginBottom: 12 }}>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                    <input type="text" placeholder="Power name" value={newPower.name}
                      onChange={(e) => setNewPower({ ...newPower, name: e.target.value })}
                      style={{ flex: 1, minWidth: 120, padding: "6px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text1)", fontSize: 13 }}
                    />
                    <input type="text" placeholder="Icon" value={newPower.icon} maxLength={4}
                      onChange={(e) => setNewPower({ ...newPower, icon: e.target.value })}
                      style={{ width: 50, padding: "6px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text1)", fontSize: 13, textAlign: "center" }}
                    />
                    <input type="number" min={5} max={100} value={newPower.cost}
                      onChange={(e) => setNewPower({ ...newPower, cost: parseInt(e.target.value) || 5 })}
                      style={{ width: 60, padding: "6px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text1)", fontSize: 13, textAlign: "center" }}
                    />
                    <span style={{ fontSize: 12, color: "var(--text3)", alignSelf: "center" }}>MP</span>
                  </div>
                  <input type="text" placeholder="Description" value={newPower.description}
                    onChange={(e) => setNewPower({ ...newPower, description: e.target.value })}
                    style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text1)", fontSize: 13, marginBottom: 8 }}
                  />
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={handleAddPower} disabled={!newPower.name.trim()} style={{ ...btnPrimary, opacity: newPower.name.trim() ? 1 : 0.5 }}>Create</button>
                    <button onClick={() => setShowNewPower(false)} style={btnSecondary}>Cancel</button>
                  </div>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(state?.powers || []).map((power) => {
                  const canAfford = (state?.currentMP || 0) >= power.cost;
                  const isVoting = state?.activeVote === power.id;
                  const votes = state?.votes?.[power.id] || [];
                  const yesCount = votes.filter((v) => v.vote === true).length;
                  const noCount = votes.filter((v) => v.vote === false).length;

                  return (
                    <div key={power.id} style={{
                      display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                      borderRadius: 8, background: isVoting ? `${glowColor}11` : "var(--surface2)",
                      border: isVoting ? `1px solid ${glowColor}44` : "1px solid transparent",
                    }}>
                      <span style={{ fontSize: 20 }}>{power.icon || "⚡"}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{power.name}</div>
                        <div style={{ fontSize: 12, color: "var(--text3)" }}>{power.description}</div>
                        {isVoting && (
                          <div style={{ fontSize: 11, color: glowColor, marginTop: 4 }}>
                            🗳️ Voting: {yesCount} yes, {noCount} no ({yesCount + noCount} total)
                          </div>
                        )}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: canAfford ? glowColor : "var(--text3)" }}>
                        {power.cost} MP
                      </span>
                      <div style={{ display: "flex", gap: 4 }}>
                        {isVoting ? (
                          <button onClick={handleEndVote} style={btnSecondary}>End Vote</button>
                        ) : (
                          <button onClick={() => handleStartVote(power.id)} style={btnSecondary}>Start Vote</button>
                        )}
                        <button onClick={() => handleActivatePower(power.id)} disabled={!canAfford}
                          style={{ ...btnPrimary, opacity: canAfford ? 1 : 0.4 }}>Activate</button>
                        <button onClick={() => handleRemovePower(power.id)} style={btnDanger}>✕</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Maintenance */}
            <div style={cardStyle}>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>🛠️ Maintenance</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button onClick={handleApplyDecay} style={btnSecondary}>
                  Apply Weekly Decay (10% above 50 MP)
                </button>
                <button onClick={async () => {
                  if (!confirm("Reset mana to 0? History will be cleared.")) return;
                  await saveManaState(courseId, undefined, { ...state, currentMP: 0, history: [], votes: {}, activeVote: null });
                  await loadMana();
                }} style={{ ...btnSecondary, color: "var(--red)", borderColor: "var(--red)" }}>
                  Reset Pool to 0
                </button>
              </div>
            </div>

            {/* History */}
            {(state?.history || []).length > 0 && (
              <div style={cardStyle}>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>📜 History</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {(state.history || []).slice(0, 20).map((entry, i) => (
                    <div key={i} style={{
                      display: "flex", gap: 10, alignItems: "center", padding: "6px 0",
                      borderBottom: i < Math.min((state.history || []).length, 20) - 1 ? "1px solid var(--border)" : "none",
                    }}>
                      <span style={{
                        fontSize: 13, fontWeight: 700, minWidth: 60,
                        color: entry.type === "gain" ? "var(--green)" : entry.type === "decay" ? "var(--text3)" : "var(--red)",
                      }}>
                        {entry.type === "gain" ? "+" : "−"}{entry.amount} MP
                      </span>
                      <span style={{ fontSize: 13, color: "var(--text2)", flex: 1 }}>{entry.reason}</span>
                      <span style={{ fontSize: 11, color: "var(--text3)" }}>
                        {entry.timestamp ? new Date(entry.timestamp).toLocaleDateString() : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
