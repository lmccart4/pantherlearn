// src/pages/StudentMana.jsx
// Per-student mana page — balance, level, shop, transaction history.
// Route: /my-mana/:courseId

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { doc, getDoc, collection, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import {
  getStudentMana, spendStudentMana, getManaState,
  awardStudentMana, saveManaState,
  getLevel, getNextLevel, getManaTitle,
  submitQuoteRequest, submitRewardSuggestion, submitFulfillmentRequest, getManaRequests,
  deductStudentMana, applyGradeBonus,
  MANA_LEVELS, MAGE_DAILY_BUDGET, POSITIVE_BEHAVIORS,
} from "../lib/mana";

const ACCENT = "#8b5cf6";

export default function StudentMana() {
  const { courseId: routeCourseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(routeCourseId || null);
  const courseId = selectedCourse;

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [mana, setMana] = useState(null);
  const [powers, setPowers] = useState([]);
  const [confirmPower, setConfirmPower] = useState(null);
  const [toast, setToast] = useState(null);
  const [historyExpanded, setHistoryExpanded] = useState(false);

  // Quote request modal
  const [quoteModal, setQuoteModal] = useState(null); // power object when open
  const [quoteDescription, setQuoteDescription] = useState("");

  // Suggest a reward modal
  const [showSuggestModal, setShowSuggestModal] = useState(false);
  const [suggestionText, setSuggestionText] = useState("");

  // Input-required power modal (e.g., classwork pass)
  const [inputModal, setInputModal] = useState(null); // power object when open
  const [inputText, setInputText] = useState("");

  // Grade bonus modal (extra credit powers)
  const [bonusModal, setBonusModal] = useState(null); // power object when open
  const [bonusLessons, setBonusLessons] = useState([]); // lessons to pick from
  const [selectedLesson, setSelectedLesson] = useState(null);

  // Pending priced requests (quotes the teacher has priced)
  const [pricedRequests, setPricedRequests] = useState([]);

  // Mage/Enchantress state
  const [poolState, setPoolState] = useState(null);
  const [isMage, setIsMage] = useState(false);
  const [mageGender, setMageGender] = useState('M');
  const [classmates, setClassmates] = useState({}); // uid -> name
  const [mageBudgetUsed, setMageBudgetUsed] = useState(0);

  // Load enrolled courses for selector
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const userSnap = await getDoc(doc(db, "users", user.uid));
        const enrolled = userSnap.exists() ? userSnap.data().enrolledCourses || {} : {};
        const courseIds = Object.keys(enrolled).filter(id => enrolled[id]);
        const courseDocs = await Promise.all(courseIds.map(id => getDoc(doc(db, "courses", id))));
        const list = courseDocs.filter(d => d.exists() && !d.data().hidden).map(d => ({ id: d.id, title: d.data().title }));
        setCourses(list);
        if (!selectedCourse && list.length > 0) setSelectedCourse(list[0].id);
      } catch (e) { console.warn("Course fetch error:", e); }
    })();
  }, [user]);

  useEffect(() => {
    if (!user || !courseId) return;
    load();
  }, [courseId, user]);

  async function load() {
    setLoading(true);
    try {
      const [courseSnap, studentData, pool] = await Promise.all([
        getDoc(doc(db, "courses", courseId)),
        getStudentMana(courseId, user.uid),
        getManaState(courseId),
      ]);
      if (courseSnap.exists()) setCourse({ id: courseSnap.id, ...courseSnap.data() });
      setMana(studentData);
      setPowers(pool.powers || []);
      setPoolState(pool);

      // Load priced quote requests for this student
      try {
        const allRequests = await getManaRequests(courseId);
        const priced = allRequests.filter(r => r.studentUid === user.uid && r.status === "priced");
        setPricedRequests(priced);
      } catch (e) { console.warn("Failed to load requests:", e); }

      // Check if current user is today's Mage/Enchantress
      const today = new Date().toISOString().split("T")[0];
      const isTodaysMage = pool.mageStudentId === user.uid && pool.mageDate === today;
      setIsMage(isTodaysMage);
      setMageBudgetUsed(pool.mageBudgetUsed || 0);

      if (isTodaysMage) {
        // Load gender for title
        try {
          const userSnap = await getDoc(doc(db, "users", user.uid));
          if (userSnap.exists()) setMageGender(userSnap.data().gender || 'M');
        } catch (e) { /* ignore */ }

        // Load classmates for awarding
        try {
          const usersSnap = await getDocs(collection(db, "users"));
          const names = {};
          usersSnap.forEach((d) => {
            const data = d.data();
            if (data.role === "teacher" || d.id === user.uid) return;
            const enrolled = data.enrolledCourses || {};
            if (enrolled[courseId]) names[d.id] = data.displayName || data.email || d.id;
          });
          setClassmates(names);
        } catch (e) {
          console.warn("Failed to load classmates:", e);
        }
      }
    } catch (err) {
      console.error("Error loading student mana:", err);
    }
    setLoading(false);
  }

  async function handleMageAward(targetUid, behaviorId) {
    if (!poolState) return;
    const behavior = POSITIVE_BEHAVIORS.find(b => b.id === behaviorId);
    if (!behavior) return;
    const newUsed = (poolState.mageBudgetUsed || 0) + behavior.mana;
    if (newUsed > MAGE_DAILY_BUDGET) {
      setToast("Not enough budget remaining!");
      setTimeout(() => setToast(null), 2500);
      return;
    }
    await awardStudentMana(courseId, targetUid, behavior.mana, `${behavior.label} (from ${getManaTitle(mageGender)})`);
    const updatedPool = { ...poolState, mageBudgetUsed: newUsed };
    setPoolState(updatedPool);
    setMageBudgetUsed(newUsed);
    await saveManaState(courseId, undefined, updatedPool);
    const name = classmates[targetUid] || "Classmate";
    setToast(`+${behavior.mana} mana to ${name} (${behavior.label})`);
    setTimeout(() => setToast(null), 2500);
  }

  async function handleRedeem(power) {
    try {
      await spendStudentMana(courseId, user.uid, power.id);
      setConfirmPower(null);
      setToast(`${power.icon || "✦"} ${power.name} activated!`);
      setTimeout(() => setToast(null), 3000);
      await load();
    } catch (err) {
      alert(err.message);
      setConfirmPower(null);
    }
  }

  if (loading) {
    return (
      <main id="main-content" className="page-wrapper" style={{ display: "flex", justifyContent: "center", paddingTop: 120 }}>
        <div className="spinner" />
      </main>
    );
  }

  if (!course) {
    return (
      <main id="main-content" className="page-wrapper">
        <div className="empty-state"><div className="empty-state-text">Course not found</div></div>
      </main>
    );
  }

  const level = getLevel(mana?.lifetimeEarned || 0);
  const nextLevel = getNextLevel(mana?.lifetimeEarned || 0);
  const progressPct = nextLevel
    ? Math.min(((mana?.lifetimeEarned || 0) - level.threshold) / (nextLevel.threshold - level.threshold) * 100, 100)
    : 100;
  const history = mana?.history || [];
  const displayHistory = historyExpanded ? history : history.slice(0, 5);

  return (
    <main id="main-content" className="page-wrapper">
      <div style={{ maxWidth: 640, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
          <button
            onClick={() => navigate(`/course/${courseId}`)}
            style={{
              padding: "6px 12px", borderRadius: 8, border: "1px solid var(--border)",
              background: "transparent", color: "var(--text2)", fontWeight: 600, fontSize: 13, cursor: "pointer",
            }}
          >
            ← Back
          </button>
          <h1 className="page-title" style={{ fontSize: 22 }}>My Mana</h1>
        </div>
        {courses.length > 1 && (
          <select
            value={courseId}
            onChange={(e) => setSelectedCourse(e.target.value)}
            style={{
              marginBottom: 16, padding: "8px 12px", borderRadius: 8,
              border: "1px solid var(--border)", background: "var(--surface)",
              color: "var(--text1)", fontSize: 14, fontWeight: 500, cursor: "pointer", width: "100%",
            }}
          >
            {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        )}
        {courses.length <= 1 && (
          <p className="page-subtitle" style={{ marginBottom: 20, color: "var(--text3)", fontSize: 13 }}>
            {course.title}
          </p>
        )}

        {/* Mage/Enchantress Section */}
        {isMage && (
          <div style={{
            background: "var(--surface)", border: `1px solid ${ACCENT}44`, borderRadius: 16,
            padding: "20px 24px", marginBottom: 20, position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: -30, left: -30, width: 120, height: 120,
              borderRadius: "50%", background: `${ACCENT}12`, filter: "blur(30px)", pointerEvents: "none",
            }} />
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, position: "relative" }}>
              <span style={{ fontSize: 32 }}>{mageGender === 'F' ? '🧝‍♀️' : '🧙'}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: ACCENT }}>
                  You are today's {getManaTitle(mageGender)}!
                </div>
                <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>
                  Award mana to your classmates. Budget: {mageBudgetUsed} / {MAGE_DAILY_BUDGET} used
                </div>
              </div>
            </div>

            {/* Budget bar */}
            <div style={{
              height: 6, background: "var(--surface2)", borderRadius: 3, overflow: "hidden", marginBottom: 14,
            }}>
              <div style={{
                width: `${Math.min((mageBudgetUsed / MAGE_DAILY_BUDGET) * 100, 100)}%`, height: "100%",
                background: `linear-gradient(90deg, ${ACCENT}, #ec4899)`,
                borderRadius: 3, transition: "width 0.4s ease",
              }} />
            </div>

            {mageBudgetUsed >= MAGE_DAILY_BUDGET ? (
              <div style={{ color: "var(--text3)", fontSize: 13, fontStyle: "italic" }}>
                You've used your full budget for today. Great leadership!
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 8 }}>
                {Object.entries(classmates)
                  .sort(([, a], [, b]) => a.localeCompare(b))
                  .map(([uid, name]) => (
                    <div key={uid} style={{
                      padding: "10px 12px", borderRadius: 10, background: "var(--surface2)",
                      border: "1px solid var(--border)",
                    }}>
                      <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {name.split(" ")[0]}
                      </div>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {POSITIVE_BEHAVIORS.filter(b => b.mana <= (MAGE_DAILY_BUDGET - mageBudgetUsed)).map(b => (
                          <button
                            key={b.id}
                            onClick={() => handleMageAward(uid, b.id)}
                            title={b.label}
                            style={{
                              padding: "3px 7px", borderRadius: 5, border: "1px solid var(--border)",
                              background: "transparent", cursor: "pointer", fontSize: 12,
                              color: "var(--text2)",
                            }}
                          >
                            {b.icon}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Balance Card */}
        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16,
          padding: "24px 28px", marginBottom: 20, position: "relative", overflow: "hidden",
        }}>
          {/* Subtle glow behind balance */}
          <div style={{
            position: "absolute", top: -40, right: -40, width: 160, height: 160,
            borderRadius: "50%", background: `${ACCENT}15`, filter: "blur(40px)", pointerEvents: "none",
          }} />

          <div style={{ textAlign: "center", position: "relative" }}>
            <div style={{
              fontFamily: "var(--font-display), ui-monospace, monospace", fontSize: 52, fontWeight: 800,
              color: ACCENT, lineHeight: 1,
              textShadow: `0 0 24px ${ACCENT}33`,
            }}>
              {mana?.balance || 0}
            </div>
            <div style={{ fontSize: 13, color: "var(--text3)", fontWeight: 500, marginTop: 4 }}>mana</div>
          </div>
        </div>

        {/* Powers / Shop */}
        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14,
          padding: "18px 22px", marginBottom: 20,
        }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Powers</div>
          {powers.length === 0 ? (
            <div style={{ color: "var(--text3)", fontSize: 13 }}>No powers available yet.</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10 }}>
              {powers.map((power) => {
                const canAfford = (mana?.balance || 0) >= power.cost;
                return (
                  <div key={power.id} style={{
                    padding: "14px 16px", borderRadius: 10,
                    background: canAfford ? "var(--surface2)" : "var(--surface2)",
                    border: `1px solid ${canAfford ? "var(--border)" : "var(--border)"}`,
                    opacity: canAfford ? 1 : 0.5,
                    transition: "transform 0.15s, box-shadow 0.15s",
                    cursor: canAfford ? "pointer" : "default",
                  }}
                    onMouseEnter={(e) => { if (canAfford) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 4px 16px ${ACCENT}22`; } }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <span style={{ fontSize: 22 }}>{power.icon || "⚡"}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{power.name}</div>
                        <div style={{ fontSize: 11, color: "var(--text3)" }}>{power.description}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: power.isQuoteRequest ? "var(--text3)" : canAfford ? ACCENT : "var(--text3)" }}>
                        {power.isQuoteRequest ? "Quote" : `${power.cost} mana`}
                      </span>
                      <button
                        disabled={power.isQuoteRequest ? false : !canAfford}
                        onClick={async () => {
                          if (power.isQuoteRequest) { setQuoteModal(power); }
                          else if (power.requiresInput) { setInputModal(power); }
                          else if (power.category === "gradeBonus") {
                            // Load lessons for picker
                            try {
                              const lessonsSnap = await getDocs(collection(db, "courses", courseId, "lessons"));
                              const visible = lessonsSnap.docs
                                .map(d => ({ id: d.id, ...d.data() }))
                                .filter(l => l.visible !== false)
                                .filter(l => !power.gradeFilter || (l.gradeCategory || "classwork") === power.gradeFilter)
                                .sort((a, b) => (b.dueDate || "").localeCompare(a.dueDate || ""));
                              setBonusLessons(visible);
                              setBonusModal(power);
                              setSelectedLesson(null);
                            } catch (e) { console.error(e); }
                          }
                          else { setConfirmPower(power); }
                        }}
                        style={{
                          padding: "6px 14px", borderRadius: 7, border: "none", fontWeight: 600, fontSize: 12,
                          cursor: power.isQuoteRequest || canAfford ? "pointer" : "default",
                          background: power.isQuoteRequest || canAfford ? ACCENT : "var(--surface)",
                          color: power.isQuoteRequest || canAfford ? "#fff" : "var(--text3)",
                        }}
                      >
                        {power.isQuoteRequest ? "Request" : "Redeem"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <button
            onClick={() => setShowSuggestModal(true)}
            style={{
              marginTop: 14, padding: "10px 18px", borderRadius: 8,
              border: "1px dashed var(--border)", background: "transparent",
              color: "var(--text2)", fontWeight: 600, fontSize: 13,
              cursor: "pointer", width: "100%", textAlign: "center",
            }}
          >
            {"\uD83D\uDCA1"} Suggest a Reward
          </button>
        </div>

        {/* Priced Quote Banners */}
        {pricedRequests.map((req) => (
          <div key={req.id} style={{
            background: `${ACCENT}11`, border: `1px solid ${ACCENT}44`, borderRadius: 12,
            padding: "14px 18px", marginBottom: 16, display: "flex", alignItems: "center",
            gap: 12, flexWrap: "wrap",
          }}>
            <span style={{ fontSize: 22 }}>{"\uD83C\uDFD7\uFE0F"}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>
                Your custom 3D print has been quoted at <span style={{ color: ACCENT }}>{req.quotedCost} mana</span>
              </div>
              <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>
                "{req.description}"
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                disabled={(mana?.balance || 0) < req.quotedCost}
                onClick={async () => {
                  try {
                    await deductStudentMana(courseId, user.uid, req.quotedCost, `Custom 3D Print: ${req.description}`);
                    await updateDoc(doc(db, "courses", courseId, "manaRequests", req.id), { status: "accepted" });
                    setToast("Accepted! Your print is on the way.");
                    setTimeout(() => setToast(null), 3000);
                    await load();
                  } catch (err) { alert(err.message); }
                }}
                style={{
                  padding: "8px 16px", borderRadius: 8, border: "none", fontWeight: 600, fontSize: 13,
                  cursor: (mana?.balance || 0) >= req.quotedCost ? "pointer" : "default",
                  background: (mana?.balance || 0) >= req.quotedCost ? ACCENT : "var(--surface)",
                  color: (mana?.balance || 0) >= req.quotedCost ? "#fff" : "var(--text3)",
                  opacity: (mana?.balance || 0) >= req.quotedCost ? 1 : 0.5,
                }}
              >
                Accept ({req.quotedCost} mana)
              </button>
              <button
                onClick={async () => {
                  await updateDoc(doc(db, "courses", courseId, "manaRequests", req.id), { status: "cancelled" });
                  setToast("Quote declined.");
                  setTimeout(() => setToast(null), 2500);
                  await load();
                }}
                style={{
                  padding: "8px 16px", borderRadius: 8, border: "1px solid var(--border)",
                  background: "transparent", color: "var(--text2)", fontWeight: 600, fontSize: 13, cursor: "pointer",
                }}
              >
                Decline
              </button>
            </div>
          </div>
        ))}

        {/* Transaction History */}
        {history.length > 0 && (
          <div style={{
            background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14,
            padding: "18px 22px",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>History</div>
              {history.length > 5 && (
                <button
                  onClick={() => setHistoryExpanded(!historyExpanded)}
                  style={{
                    padding: "4px 10px", borderRadius: 6, border: "1px solid var(--border)",
                    background: "transparent", color: "var(--text3)", fontSize: 12, cursor: "pointer",
                  }}
                >
                  {historyExpanded ? "Show less" : `Show all (${history.length})`}
                </button>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {displayHistory.map((entry, i) => {
                const isEarn = entry.type === "earn" || entry.type === "refund";
                return (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "7px 0",
                    borderBottom: i < displayHistory.length - 1 ? "1px solid var(--border)" : "none",
                  }}>
                    <span style={{
                      fontSize: 13, fontWeight: 700, minWidth: 55, textAlign: "right",
                      color: isEarn ? "var(--green)" : "var(--red)",
                      fontFamily: "ui-monospace, monospace",
                    }}>
                      {isEarn ? "+" : "−"}{entry.amount}
                    </span>
                    <span style={{ fontSize: 13, color: "var(--text2)", flex: 1 }}>{entry.reason}</span>
                    <span style={{ fontSize: 11, color: "var(--text3)", whiteSpace: "nowrap" }}>
                      {entry.timestamp ? new Date(entry.timestamp).toLocaleDateString() : ""}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Confirm Modal */}
        {confirmPower && (
          <div style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 9999,
            display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
          }} onClick={() => setConfirmPower(null)}>
            <div onClick={(e) => e.stopPropagation()} style={{
              background: "var(--surface)", borderRadius: 14, padding: "28px 32px",
              maxWidth: 360, width: "100%", border: "1px solid var(--border)",
              boxShadow: `0 20px 60px rgba(0,0,0,0.4)`,
            }}>
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>{confirmPower.icon || "⚡"}</div>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{confirmPower.name}</div>
                <div style={{ fontSize: 13, color: "var(--text3)", marginBottom: 12 }}>{confirmPower.description}</div>
                <div style={{ fontSize: 14, color: ACCENT, fontWeight: 700 }}>
                  Cost: {confirmPower.cost} mana
                </div>
                <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 4 }}>
                  Balance after: {(mana?.balance || 0) - confirmPower.cost} mana
                </div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => setConfirmPower(null)}
                  style={{
                    flex: 1, padding: "10px 0", borderRadius: 8, border: "1px solid var(--border)",
                    background: "transparent", color: "var(--text2)", fontWeight: 600, fontSize: 14, cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRedeem(confirmPower)}
                  style={{
                    flex: 1, padding: "10px 0", borderRadius: 8, border: "none",
                    background: ACCENT, color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer",
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Grade Bonus Modal (Extra Credit powers) */}
        {bonusModal && (
          <div style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000,
            display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
          }} onClick={() => setBonusModal(null)}>
            <div style={{
              background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14,
              padding: "24px 28px", maxWidth: 480, width: "100%", maxHeight: "80vh", overflow: "auto",
            }} onClick={(e) => e.stopPropagation()}>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{bonusModal.icon} {bonusModal.name}</div>
              <div style={{ fontSize: 13, color: "var(--text3)", marginBottom: 16 }}>
                +{bonusModal.bonusAmount} percentage points — choose an assignment ({bonusModal.cost} mana)
              </div>
              {bonusLessons.length === 0 ? (
                <div style={{ color: "var(--text3)", fontSize: 13, padding: "10px 0" }}>No eligible assignments found.</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 16 }}>
                  {bonusLessons.map(l => (
                    <button key={l.id} onClick={() => setSelectedLesson(l)} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "10px 14px", borderRadius: 8, cursor: "pointer", textAlign: "left",
                      border: selectedLesson?.id === l.id ? `2px solid ${ACCENT}` : "1px solid var(--border)",
                      background: selectedLesson?.id === l.id ? `${ACCENT}11` : "var(--surface2)",
                      color: "var(--text1)", fontSize: 13, fontWeight: 500,
                    }}>
                      <span>{l.title}</span>
                      {l.dueDate && <span style={{ fontSize: 11, color: "var(--text3)" }}>{l.dueDate}</span>}
                    </button>
                  ))}
                </div>
              )}
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button onClick={() => setBonusModal(null)} style={{
                  padding: "8px 16px", borderRadius: 8, border: "1px solid var(--border)",
                  background: "transparent", color: "var(--text2)", fontWeight: 600, fontSize: 13, cursor: "pointer",
                }}>Cancel</button>
                <button
                  disabled={!selectedLesson}
                  onClick={async () => {
                    if (!selectedLesson) return;
                    try {
                      await deductStudentMana(courseId, user.uid, bonusModal.cost, `${bonusModal.name}: ${selectedLesson.title}`);
                      const newBonus = await applyGradeBonus(courseId, user.uid, selectedLesson.id, bonusModal.bonusAmount);
                      setToast(`+${bonusModal.bonusAmount}% applied to "${selectedLesson.title}"!`);
                      setTimeout(() => setToast(null), 4000);
                      setBonusModal(null);
                      setSelectedLesson(null);
                      await load();
                    } catch (err) { alert(err.message); }
                  }}
                  style={{
                    padding: "8px 16px", borderRadius: 8, border: "none", fontWeight: 600, fontSize: 13,
                    cursor: selectedLesson ? "pointer" : "default",
                    background: selectedLesson ? ACCENT : "var(--surface)", color: selectedLesson ? "#fff" : "var(--text3)",
                  }}
                >Apply +{bonusModal.bonusAmount}%</button>
              </div>
            </div>
          </div>
        )}

        {/* Input-Required Power Modal (e.g., Classwork Pass) */}
        {inputModal && (
          <div style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000,
            display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
          }} onClick={() => setInputModal(null)}>
            <div style={{
              background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14,
              padding: "24px 28px", maxWidth: 420, width: "100%",
            }} onClick={(e) => e.stopPropagation()}>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{inputModal.icon} {inputModal.name}</div>
              <div style={{ fontSize: 13, color: "var(--text3)", marginBottom: 16 }}>{inputModal.cost} mana will be deducted</div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{inputModal.inputPrompt}</div>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="e.g., Momentum Mystery Lab"
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: 8,
                  border: "1px solid var(--border)", background: "var(--surface2)",
                  color: "var(--text1)", fontSize: 14, marginBottom: 16,
                }}
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && inputText.trim() && document.getElementById("inputModalSubmit")?.click()}
              />
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button onClick={() => { setInputModal(null); setInputText(""); }} style={{
                  padding: "8px 16px", borderRadius: 8, border: "1px solid var(--border)",
                  background: "transparent", color: "var(--text2)", fontWeight: 600, fontSize: 13, cursor: "pointer",
                }}>Cancel</button>
                <button
                  id="inputModalSubmit"
                  disabled={!inputText.trim()}
                  onClick={async () => {
                    try {
                      await deductStudentMana(courseId, user.uid, inputModal.cost, `${inputModal.name}: ${inputText.trim()}`);
                      await submitFulfillmentRequest(courseId, user.uid, user.displayName || "Student", inputModal.id, inputModal.name, inputModal.cost, inputText.trim());
                      setToast(`${inputModal.name} redeemed! Mr. McCarthy has been notified.`);
                      setTimeout(() => setToast(null), 3000);
                      setInputModal(null);
                      setInputText("");
                      await load();
                    } catch (err) { alert(err.message); }
                  }}
                  style={{
                    padding: "8px 16px", borderRadius: 8, border: "none", fontWeight: 600, fontSize: 13,
                    cursor: inputText.trim() ? "pointer" : "default",
                    background: inputText.trim() ? ACCENT : "var(--surface)", color: inputText.trim() ? "#fff" : "var(--text3)",
                  }}
                >Redeem</button>
              </div>
            </div>
          </div>
        )}

        {/* Quote Request Modal */}
        {quoteModal && (
          <div style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 9999,
            display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
          }} onClick={() => { setQuoteModal(null); setQuoteDescription(""); }}>
            <div onClick={(e) => e.stopPropagation()} style={{
              background: "var(--surface)", borderRadius: 14, padding: "28px 32px",
              maxWidth: 400, width: "100%", border: "1px solid var(--border)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
            }}>
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>{"\uD83C\uDFD7\uFE0F"}</div>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Request a Custom 3D Print</div>
                <div style={{ fontSize: 13, color: "var(--text3)", marginBottom: 16 }}>
                  Describe what you want printed. Mr. McCarthy will set the price.
                </div>
              </div>
              <input
                type="text"
                placeholder="Describe what you want printed"
                value={quoteDescription}
                onChange={(e) => setQuoteDescription(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && quoteDescription.trim()) {
                    (async () => {
                      await submitQuoteRequest(courseId, user.uid, user.displayName || user.email, quoteModal.id, quoteDescription.trim());
                      setQuoteModal(null); setQuoteDescription("");
                      setToast("Request sent! Mr. McCarthy will set the price.");
                      setTimeout(() => setToast(null), 3000);
                    })();
                  }
                }}
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: 8,
                  border: "1px solid var(--border)", background: "var(--surface2)",
                  color: "var(--text1)", fontSize: 14, marginBottom: 16,
                }}
              />
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => { setQuoteModal(null); setQuoteDescription(""); }}
                  style={{
                    flex: 1, padding: "10px 0", borderRadius: 8, border: "1px solid var(--border)",
                    background: "transparent", color: "var(--text2)", fontWeight: 600, fontSize: 14, cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  disabled={!quoteDescription.trim()}
                  onClick={async () => {
                    await submitQuoteRequest(courseId, user.uid, user.displayName || user.email, quoteModal.id, quoteDescription.trim());
                    setQuoteModal(null); setQuoteDescription("");
                    setToast("Request sent! Mr. McCarthy will set the price.");
                    setTimeout(() => setToast(null), 3000);
                  }}
                  style={{
                    flex: 1, padding: "10px 0", borderRadius: 8, border: "none",
                    background: quoteDescription.trim() ? ACCENT : "var(--surface)",
                    color: quoteDescription.trim() ? "#fff" : "var(--text3)",
                    fontWeight: 600, fontSize: 14, cursor: quoteDescription.trim() ? "pointer" : "default",
                  }}
                >
                  Send Request
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Suggest a Reward Modal */}
        {showSuggestModal && (
          <div style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 9999,
            display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
          }} onClick={() => { setShowSuggestModal(false); setSuggestionText(""); }}>
            <div onClick={(e) => e.stopPropagation()} style={{
              background: "var(--surface)", borderRadius: 14, padding: "28px 32px",
              maxWidth: 400, width: "100%", border: "1px solid var(--border)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
            }}>
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>{"\uD83D\uDCA1"}</div>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Suggest a Reward</div>
                <div style={{ fontSize: 13, color: "var(--text3)", marginBottom: 16 }}>
                  What reward would you like to see in the shop?
                </div>
              </div>
              <input
                type="text"
                placeholder="What reward would you like to see?"
                value={suggestionText}
                onChange={(e) => setSuggestionText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && suggestionText.trim()) {
                    (async () => {
                      await submitRewardSuggestion(courseId, user.uid, user.displayName || user.email, suggestionText.trim());
                      setShowSuggestModal(false); setSuggestionText("");
                      setToast("Suggestion sent!");
                      setTimeout(() => setToast(null), 2500);
                    })();
                  }
                }}
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: 8,
                  border: "1px solid var(--border)", background: "var(--surface2)",
                  color: "var(--text1)", fontSize: 14, marginBottom: 16,
                }}
              />
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => { setShowSuggestModal(false); setSuggestionText(""); }}
                  style={{
                    flex: 1, padding: "10px 0", borderRadius: 8, border: "1px solid var(--border)",
                    background: "transparent", color: "var(--text2)", fontWeight: 600, fontSize: 14, cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  disabled={!suggestionText.trim()}
                  onClick={async () => {
                    await submitRewardSuggestion(courseId, user.uid, user.displayName || user.email, suggestionText.trim());
                    setShowSuggestModal(false); setSuggestionText("");
                    setToast("Suggestion sent!");
                    setTimeout(() => setToast(null), 2500);
                  }}
                  style={{
                    flex: 1, padding: "10px 0", borderRadius: 8, border: "none",
                    background: suggestionText.trim() ? ACCENT : "var(--surface)",
                    color: suggestionText.trim() ? "#fff" : "var(--text3)",
                    fontWeight: 600, fontSize: 14, cursor: suggestionText.trim() ? "pointer" : "default",
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div style={{
            position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
            background: "var(--surface)", border: `1px solid ${ACCENT}66`, borderRadius: 10,
            padding: "12px 24px", fontSize: 14, fontWeight: 600, color: ACCENT,
            boxShadow: `0 8px 32px ${ACCENT}33`, zIndex: 10000,
            animation: "fadeIn 0.2s ease",
          }}>
            {toast}
          </div>
        )}
      </div>
    </main>
  );
}
