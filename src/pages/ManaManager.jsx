// src/pages/ManaManager.jsx
// Teacher-only page for managing course mana pool.
// Route: /mana/:courseId

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { doc, getDoc, collection, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import {
  getManaState, saveManaState, awardMana, deductMana,
  spendMana, applyDecay, startVote, endVote,
  addPower, removePower,
  getStudentManaForClass, awardStudentMana, getLevel,
  awardBehaviorMana, getManaTitle, getManaRequests,
  MANA_CAP, DEFAULT_POWERS, MANA_LEVELS, MAGE_DAILY_BUDGET,
  POSITIVE_BEHAVIORS, NEGATIVE_BEHAVIORS,
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

  // Student balances
  const [studentMana, setStudentMana] = useState({});
  const [studentNames, setStudentNames] = useState({});
  const [grantUid, setGrantUid] = useState(null);
  const [grantAmount, setGrantAmount] = useState(5);
  const [grantReason, setGrantReason] = useState("");
  const [bulkAmount, setBulkAmount] = useState(5);
  const [bulkReason, setBulkReason] = useState("");
  const [showBulkGrant, setShowBulkGrant] = useState(false);

  // Behavior award
  const [behaviorTarget, setBehaviorTarget] = useState(null); // uid of student with flyout open
  const [behaviorToast, setBehaviorToast] = useState(null);

  // Requests (quotes + suggestions)
  const [requests, setRequests] = useState([]);
  const [quotePrices, setQuotePrices] = useState({}); // requestId -> price input value

  // Mage/Enchantress
  const [studentGenders, setStudentGenders] = useState({});

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
        await Promise.all([loadMana(), loadStudentBalances(), loadRequests()]);
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

  async function loadStudentBalances() {
    try {
      // Load student mana docs
      const manaData = await getStudentManaForClass(courseId);
      setStudentMana(manaData);

      // Load names from enrollments + users (two strategies for coverage)
      const names = {};
      const genders = {};
      try {
        const enrollSnap = await getDocs(collection(db, "enrollments"));
        const usersSnap = await getDocs(collection(db, "users"));
        const usersMap = {};
        usersSnap.forEach((d) => { usersMap[d.id] = d.data(); });
        // Strategy 1: enrollments collection
        enrollSnap.forEach((d) => {
          const data = d.data();
          if (data.courseId !== courseId || data.isTestStudent) return;
          const uid = data.uid || data.studentUid;
          if (!uid) return;
          const user = usersMap[uid];
          names[uid] = user?.displayName || data.name || data.email || "Unknown";
          if (user?.gender) genders[uid] = user.gender;
        });
        // Strategy 2: users with enrolledCourses (catches anyone missed by enrollments)
        usersSnap.forEach((d) => {
          const data = d.data();
          if (data.role === "teacher") return;
          const enrolled = data.enrolledCourses || {};
          if (enrolled[courseId] && !names[d.id]) {
            names[d.id] = data.displayName || data.email || d.id;
          }
          if (enrolled[courseId] && data.gender) {
            genders[d.id] = data.gender;
          }
        });
      } catch (err) {
        console.warn("Enrollment load failed, falling back to users:", err);
        const usersSnap = await getDocs(collection(db, "users"));
        usersSnap.forEach((d) => {
          const data = d.data();
          if (data.role === "teacher") return;
          const enrolled = data.enrolledCourses || {};
          if (enrolled[courseId]) {
            names[d.id] = data.displayName || data.email || d.id;
            if (data.gender) genders[d.id] = data.gender;
          }
        });
      }
      // Also include any uid that has mana but wasn't found above
      for (const uid of Object.keys(manaData)) {
        if (!names[uid]) names[uid] = uid;
      }
      setStudentNames(names);
      setStudentGenders(genders);
    } catch (err) {
      console.error("Error loading student balances:", err);
    }
  }

  async function loadRequests() {
    try {
      const all = await getManaRequests(courseId);
      // Show pending quotes and pending suggestions
      setRequests(all.filter(r => r.status === "pending" || r.status === "priced"));
    } catch (err) {
      console.warn("Error loading requests:", err);
    }
  }

  async function handleGrantStudent(uid) {
    if (!grantReason.trim() || grantAmount <= 0) return;
    await awardStudentMana(courseId, uid, grantAmount, grantReason.trim());
    setGrantUid(null);
    setGrantReason("");
    setGrantAmount(5);
    await loadStudentBalances();
  }

  async function handleBulkGrant() {
    if (!bulkReason.trim() || bulkAmount <= 0) return;
    const uids = Object.keys(studentNames);
    await Promise.all(uids.map((uid) => awardStudentMana(courseId, uid, bulkAmount, bulkReason.trim())));
    setShowBulkGrant(false);
    setBulkReason("");
    setBulkAmount(5);
    await loadStudentBalances();
  }

  async function handleBehaviorAward(uid, behaviorId, isPositive) {
    const behaviors = isPositive ? POSITIVE_BEHAVIORS : NEGATIVE_BEHAVIORS;
    const behavior = behaviors.find(b => b.id === behaviorId);
    if (!behavior) return;
    await awardBehaviorMana(courseId, uid, behaviorId, isPositive);
    const name = studentNames[uid] || "Student";
    const sign = isPositive ? "+" : "";
    setBehaviorToast(`${sign}${behavior.mana} mana to ${name} (${behavior.label})`);
    setTimeout(() => setBehaviorToast(null), 2500);
    await loadStudentBalances();
  }

  async function handleSummonMage() {
    const uids = Object.keys(studentNames);
    if (uids.length === 0) return;
    const randomUid = uids[Math.floor(Math.random() * uids.length)];
    const today = new Date().toISOString().split("T")[0];
    const updated = {
      ...state,
      mageStudentId: randomUid,
      mageStudentName: studentNames[randomUid] || "Unknown",
      mageDate: today,
      mageBudgetUsed: 0,
    };
    setState(updated);
    await saveManaState(courseId, undefined, updated);
  }

  async function handleClearMage() {
    const updated = { ...state };
    delete updated.mageStudentId;
    delete updated.mageStudentName;
    delete updated.mageDate;
    delete updated.mageBudgetUsed;
    setState(updated);
    await saveManaState(courseId, undefined, updated);
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
      <div className="page-wrapper" style={{ display: "flex", justifyContent: "center", paddingTop: 120 }}>
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
    <main id="main-content" className="page-wrapper">
      <div style={{ maxWidth: 800, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
          <button onClick={() => navigate(`/course/${courseId}`)} style={{ ...btnSecondary, padding: "6px 12px" }}>← Back</button>
          <h1 className="page-title">🔮 Mana Pool</h1>
        </div>
        <p className="page-subtitle" style={{ marginBottom: 20 }}>
          {course?.title} — Manage course mana pool
        </p>

        {!state ? (
          <div className="empty-state"><div className="empty-state-text">Loading mana state...</div></div>
        ) : (
          <>
            {/* Daily Mage / Enchantress */}
            <div style={cardStyle}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ fontSize: 16, fontWeight: 700 }}>🧙 Daily Mage / Enchantress</div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={handleSummonMage} style={btnPrimary}>Summon</button>
                  {state?.mageStudentId && (
                    <button onClick={handleClearMage} style={btnSecondary}>Clear</button>
                  )}
                </div>
              </div>
              {state?.mageStudentId && state.mageDate === new Date().toISOString().split("T")[0] ? (
                <div style={{
                  padding: "14px 18px", borderRadius: 10, background: `${glowColor}11`,
                  border: `1px solid ${glowColor}33`, display: "flex", alignItems: "center", gap: 14,
                }}>
                  <span style={{ fontSize: 28 }}>{studentGenders[state.mageStudentId] === 'F' ? '🧝‍♀️' : '🧙'}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: glowColor }}>
                      Today's {getManaTitle(studentGenders[state.mageStudentId] || 'M')}: {state.mageStudentName}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>
                      Budget: {state.mageBudgetUsed || 0} / {MAGE_DAILY_BUDGET} mana awarded to classmates
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ color: "var(--text3)", fontSize: 13 }}>
                  No Mage/Enchantress summoned today. Click "Summon" to randomly pick a student.
                </div>
              )}
            </div>

            {/* Quick Behavior Award Grid */}
            <div style={cardStyle}>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>🎯 Behavior Awards</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 8 }}>
                {Object.entries(studentNames)
                  .sort(([, a], [, b]) => a.localeCompare(b))
                  .map(([uid, name]) => {
                    const sm = studentMana[uid] || { balance: 0 };
                    const isOpen = behaviorTarget === uid;
                    return (
                      <div key={uid} style={{ position: "relative" }}>
                        <button
                          onClick={() => setBehaviorTarget(isOpen ? null : uid)}
                          style={{
                            width: "100%", padding: "10px 12px", borderRadius: 10,
                            border: isOpen ? `2px solid ${glowColor}` : "1px solid var(--border)",
                            background: isOpen ? `${glowColor}11` : "var(--surface2)",
                            cursor: "pointer", textAlign: "left",
                          }}
                        >
                          <div style={{ fontWeight: 600, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {name.split(" ")[0]}
                          </div>
                          <div style={{ fontSize: 12, color: "#8b5cf6", fontWeight: 700, marginTop: 2 }}>
                            {sm.balance} mana
                          </div>
                        </button>
                      </div>
                    );
                  })}
              </div>

              {/* Behavior flyout */}
              {behaviorTarget && (
                <div style={{
                  marginTop: 14, padding: "16px 18px", borderRadius: 10,
                  background: "var(--surface2)", border: "1px solid var(--border)",
                }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>
                    Award to: {studentNames[behaviorTarget]}
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "var(--green)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      Positive
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {POSITIVE_BEHAVIORS.map(b => (
                        <button
                          key={b.id}
                          onClick={() => handleBehaviorAward(behaviorTarget, b.id, true)}
                          style={{
                            padding: "6px 12px", borderRadius: 6,
                            border: "1px solid var(--green)33", background: "var(--green)11",
                            color: "var(--green)", fontSize: 12, fontWeight: 600, cursor: "pointer",
                          }}
                        >
                          {b.icon} {b.label} (+{b.mana})
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "var(--red)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      Negative
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {NEGATIVE_BEHAVIORS.map(b => (
                        <button
                          key={b.id}
                          onClick={() => handleBehaviorAward(behaviorTarget, b.id, false)}
                          style={{
                            padding: "6px 12px", borderRadius: 6,
                            border: "1px solid var(--red)33", background: "var(--red)11",
                            color: "var(--red)", fontSize: 12, fontWeight: 600, cursor: "pointer",
                          }}
                        >
                          {b.icon} {b.label} ({b.mana})
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

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
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>📜 Pool History</div>
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

            {/* Requests (Quote + Suggestions) */}
            {requests.filter(r => r.status === "pending" || r.status === "priced").length > 0 && (
              <div style={cardStyle}>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>📨 Requests</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {requests.filter(r => r.type === "quote" && (r.status === "pending" || r.status === "priced")).map((req) => (
                    <div key={req.id} style={{
                      padding: "14px 16px", borderRadius: 10, background: "var(--surface2)",
                      border: "1px solid var(--border)",
                    }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
                        <span style={{ fontSize: 20 }}>🏗️</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>
                            {req.studentName} — Custom 3D Print
                          </div>
                          <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 2 }}>
                            "{req.description}"
                          </div>
                          {req.status === "priced" && (
                            <div style={{ fontSize: 12, color: glowColor, marginTop: 4, fontWeight: 600 }}>
                              Quoted: {req.quotedCost} mana — waiting for student
                            </div>
                          )}
                        </div>
                      </div>
                      {req.status === "pending" && (
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <input
                            type="number" min={1} placeholder="Price"
                            value={quotePrices[req.id] || ""}
                            onChange={(e) => setQuotePrices({ ...quotePrices, [req.id]: parseInt(e.target.value) || "" })}
                            style={{
                              width: 80, padding: "6px 10px", borderRadius: 6,
                              border: "1px solid var(--border)", background: "var(--bg)",
                              color: "var(--text1)", fontSize: 13, textAlign: "center",
                            }}
                          />
                          <span style={{ fontSize: 12, color: "var(--text3)" }}>mana</span>
                          <button
                            disabled={!quotePrices[req.id]}
                            onClick={async () => {
                              const price = quotePrices[req.id];
                              if (!price || price <= 0) return;
                              await updateDoc(doc(db, "courses", courseId, "manaRequests", req.id), { status: "priced", quotedCost: price });
                              setQuotePrices({ ...quotePrices, [req.id]: "" });
                              await loadRequests();
                            }}
                            style={{ ...btnPrimary, padding: "6px 14px", opacity: quotePrices[req.id] ? 1 : 0.4 }}
                          >
                            Send Quote
                          </button>
                          <button
                            onClick={async () => {
                              await updateDoc(doc(db, "courses", courseId, "manaRequests", req.id), { status: "declined" });
                              await loadRequests();
                            }}
                            style={{ ...btnDanger, padding: "6px 12px" }}
                          >
                            Decline
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  {requests.filter(r => r.type === "suggestion" && r.status === "pending").map((req) => (
                    <div key={req.id} style={{
                      padding: "14px 16px", borderRadius: 10, background: "var(--surface2)",
                      border: "1px solid var(--border)",
                    }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
                        <span style={{ fontSize: 20 }}>💡</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>
                            {req.studentName} — Reward Suggestion
                          </div>
                          <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 2 }}>
                            "{req.suggestion}"
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={async () => {
                            await updateDoc(doc(db, "courses", courseId, "manaRequests", req.id), { status: "approved" });
                            await loadRequests();
                          }}
                          style={{ ...btnPrimary, padding: "6px 14px" }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={async () => {
                            await updateDoc(doc(db, "courses", courseId, "manaRequests", req.id), { status: "rejected" });
                            await loadRequests();
                          }}
                          style={{ ...btnDanger, padding: "6px 12px" }}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Student Balances */}
            <div style={cardStyle}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ fontSize: 16, fontWeight: 700 }}>✦ Student Mana Balances</div>
                <button onClick={() => setShowBulkGrant(!showBulkGrant)} style={btnPrimary}>
                  Grant to All
                </button>
              </div>

              {showBulkGrant && (
                <div style={{ background: "var(--surface2)", borderRadius: 8, padding: 14, marginBottom: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Grant mana to all enrolled students</div>
                  <div style={{ display: "flex", gap: 8, alignItems: "flex-end", flexWrap: "wrap" }}>
                    <div>
                      <label style={{ fontSize: 11, color: "var(--text3)", display: "block", marginBottom: 3 }}>Amount</label>
                      <input
                        type="number" min={1} value={bulkAmount}
                        onChange={(e) => setBulkAmount(parseInt(e.target.value) || 0)}
                        style={{
                          width: 60, padding: "6px 10px", borderRadius: 6,
                          border: "1px solid var(--border)", background: "var(--bg)",
                          color: "var(--text1)", fontSize: 13, textAlign: "center",
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: 11, color: "var(--text3)", display: "block", marginBottom: 3 }}>Reason</label>
                      <input
                        type="text" value={bulkReason} placeholder="e.g. Great class behavior"
                        onChange={(e) => setBulkReason(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleBulkGrant()}
                        style={{
                          width: "100%", padding: "6px 10px", borderRadius: 6,
                          border: "1px solid var(--border)", background: "var(--bg)",
                          color: "var(--text1)", fontSize: 13,
                        }}
                      />
                    </div>
                    <button onClick={handleBulkGrant} disabled={!bulkReason.trim()} style={{ ...btnPrimary, opacity: bulkReason.trim() ? 1 : 0.5 }}>
                      Grant ({Object.keys(studentNames).length} students)
                    </button>
                    <button onClick={() => setShowBulkGrant(false)} style={btnSecondary}>Cancel</button>
                  </div>
                </div>
              )}

              {Object.keys(studentNames).length === 0 ? (
                <div style={{ color: "var(--text3)", fontSize: 13, padding: "10px 0" }}>
                  No enrolled students found. Sync your roster to see student balances.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {Object.entries(studentNames)
                    .sort(([, a], [, b]) => a.localeCompare(b))
                    .map(([uid, name]) => {
                      const sm = studentMana[uid] || { balance: 0, lifetimeEarned: 0, level: "Newcomer", history: [] };
                      const lvl = getLevel(sm.lifetimeEarned || 0);
                      const lastTx = (sm.history || [])[0];
                      const isGranting = grantUid === uid;

                      return (
                        <div key={uid}>
                          <div style={{
                            display: "flex", alignItems: "center", gap: 10, padding: "8px 10px",
                            borderRadius: 6, background: isGranting ? "var(--surface2)" : "transparent",
                            cursor: "pointer",
                          }} onClick={() => setGrantUid(isGranting ? null : uid)}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontWeight: 600, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {name}
                              </div>
                              {lastTx && (
                                <div style={{ fontSize: 11, color: "var(--text3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                  Last: {lastTx.reason} ({new Date(lastTx.timestamp).toLocaleDateString()})
                                </div>
                              )}
                            </div>
                            <span style={{
                              display: "inline-flex", alignItems: "center", gap: 4,
                              padding: "2px 8px", borderRadius: 10,
                              background: `${lvl.color}18`, fontSize: 11, fontWeight: 600, color: lvl.color,
                            }}>
                              {lvl.label}
                            </span>
                            <span style={{
                              fontFamily: "ui-monospace, monospace", fontSize: 15, fontWeight: 700,
                              color: "#8b5cf6", minWidth: 40, textAlign: "right",
                            }}>
                              {sm.balance}
                            </span>
                          </div>

                          {isGranting && (
                            <div style={{ display: "flex", gap: 8, padding: "6px 10px 10px", alignItems: "flex-end" }}>
                              <div>
                                <label style={{ fontSize: 11, color: "var(--text3)", display: "block", marginBottom: 3 }}>Amount</label>
                                <input
                                  type="number" min={1} value={grantAmount}
                                  onChange={(e) => setGrantAmount(parseInt(e.target.value) || 0)}
                                  style={{
                                    width: 60, padding: "5px 8px", borderRadius: 6,
                                    border: "1px solid var(--border)", background: "var(--bg)",
                                    color: "var(--text1)", fontSize: 13, textAlign: "center",
                                  }}
                                />
                              </div>
                              <div style={{ flex: 1 }}>
                                <label style={{ fontSize: 11, color: "var(--text3)", display: "block", marginBottom: 3 }}>Reason</label>
                                <input
                                  type="text" value={grantReason} placeholder="e.g. Extra effort"
                                  onChange={(e) => setGrantReason(e.target.value)}
                                  onKeyDown={(e) => e.key === "Enter" && handleGrantStudent(uid)}
                                  style={{
                                    width: "100%", padding: "5px 8px", borderRadius: 6,
                                    border: "1px solid var(--border)", background: "var(--bg)",
                                    color: "var(--text1)", fontSize: 13,
                                  }}
                                />
                              </div>
                              <button
                                onClick={() => handleGrantStudent(uid)}
                                disabled={!grantReason.trim()}
                                style={{ ...btnPrimary, padding: "6px 14px", opacity: grantReason.trim() ? 1 : 0.5 }}
                              >
                                Grant
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Behavior Toast */}
      {behaviorToast && (
        <div style={{
          position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
          background: "var(--surface)", border: "1px solid #8b5cf666", borderRadius: 10,
          padding: "12px 24px", fontSize: 14, fontWeight: 600, color: "#8b5cf6",
          boxShadow: "0 8px 32px #8b5cf633", zIndex: 10000,
          animation: "fadeIn 0.2s ease",
        }}>
          {behaviorToast}
        </div>
      )}
    </main>
  );
}
