// src/pages/XPControls.jsx
// Teacher-only page for configuring XP values, behavior rewards, and multiplier events per course.
// Route: /xp-controls/:courseId

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  getXPConfig,
  saveXPConfig,
  setActiveMultiplier,
  clearActiveMultiplier,
  DEFAULT_XP_VALUES,
  DEFAULT_BEHAVIOR_REWARDS,
  DEFAULT_MULTIPLIER_CONFIG,
  DEFAULT_LEVEL_THRESHOLDS,
  LEVELS,
} from "../lib/gamification";

const XP_LABELS = {
  mc_correct: { label: "Multiple Choice — Correct", icon: "✅" },
  mc_incorrect: { label: "Multiple Choice — Incorrect (participation)", icon: "🔄" },
  short_answer: { label: "Written Response Submitted", icon: "✍️" },
  chat_message: { label: "Chat Message Sent", icon: "💬" },
  lesson_complete: { label: "Lesson Completed", icon: "📘" },
  perfect_lesson: { label: "Perfect Lesson (100%)", icon: "💯" },
  streak_bonus: { label: "Daily Streak Bonus (per day)", icon: "🔥" },
};

const WRITTEN_XP_LABELS = {
  written_refining: { label: "Refining", icon: "🏆", color: "var(--green, #10b981)" },
  written_developing: { label: "Developing", icon: "📘", color: "var(--cyan, #22d3ee)" },
  written_approaching: { label: "Approaching", icon: "📙", color: "var(--amber, #f5a623)" },
  written_emerging: { label: "Emerging", icon: "📕", color: "#ef4444" },
  written_missing: { label: "Missing", icon: "⬜", color: "var(--text3, #666)" },
};

export default function XPControls() {
  const { courseId } = useParams();
  const { userRole } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [xpValues, setXpValues] = useState({ ...DEFAULT_XP_VALUES });
  const [behaviorRewards, setBehaviorRewards] = useState([...DEFAULT_BEHAVIOR_REWARDS]);
  const [multiplierConfig, setMultiplierConfig] = useState({ ...DEFAULT_MULTIPLIER_CONFIG });
  const [levelThresholds, setLevelThresholds] = useState([...DEFAULT_LEVEL_THRESHOLDS]);
  const [activeMultiplier, setActiveMultiplierState] = useState(null);

  // New behavior form
  const [newBehavior, setNewBehavior] = useState({ label: "", xp: 10, icon: "⭐" });

  // Multiplier event form
  const [eventMultiplier, setEventMultiplier] = useState(2);
  const [eventDuration, setEventDuration] = useState(60);
  const [eventLabel, setEventLabel] = useState("Double XP Hour");

  useEffect(() => {
    if (userRole !== "teacher") {
      navigate("/");
      return;
    }
    loadConfig();
  }, [courseId, userRole]);

  async function loadConfig() {
    setLoading(true);
    const config = await getXPConfig(courseId);
    setXpValues(config.xpValues);
    setBehaviorRewards(config.behaviorRewards);
    setMultiplierConfig(config.multiplierConfig);
    setLevelThresholds(config.levelThresholds);
    setActiveMultiplierState(config.activeMultiplier);
    setLoading(false);
  }

  async function handleSave() {
    setSaving(true);
    await saveXPConfig(courseId, { xpValues, behaviorRewards, multiplierConfig, levelThresholds });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleResetDefaults() {
    if (!confirm("Reset all XP values to defaults? This won't affect student XP already earned.")) return;
    setXpValues({ ...DEFAULT_XP_VALUES });
    setBehaviorRewards([...DEFAULT_BEHAVIOR_REWARDS]);
    setMultiplierConfig({ ...DEFAULT_MULTIPLIER_CONFIG });
    setLevelThresholds([...DEFAULT_LEVEL_THRESHOLDS]);
  }

  function updateXPValue(key, value) {
    setXpValues((prev) => ({ ...prev, [key]: Math.max(0, parseInt(value) || 0) }));
  }

  // ─── Behavior Rewards ───
  function addBehavior() {
    if (!newBehavior.label.trim()) return;
    const id = newBehavior.label.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
    setBehaviorRewards((prev) => [...prev, { ...newBehavior, id }]);
    setNewBehavior({ label: "", xp: 10, icon: "⭐" });
  }

  function removeBehavior(id) {
    setBehaviorRewards((prev) => prev.filter((b) => b.id !== id));
  }

  function updateBehaviorXP(id, xp) {
    setBehaviorRewards((prev) =>
      prev.map((b) => (b.id === id ? { ...b, xp: Math.max(0, parseInt(xp) || 0) } : b))
    );
  }

  // ─── Multiplier Events ───
  async function startMultiplierEvent() {
    await setActiveMultiplier(courseId, eventMultiplier, eventDuration, eventLabel);
    await loadConfig();
  }

  async function stopMultiplierEvent() {
    await clearActiveMultiplier(courseId);
    setActiveMultiplierState(null);
  }

  function isMultiplierActive() {
    if (!activeMultiplier) return false;
    const expires = activeMultiplier.expiresAt?.toDate?.()
      ? activeMultiplier.expiresAt.toDate()
      : new Date(activeMultiplier.expiresAt);
    return expires > new Date();
  }

  // ─── Styles ───
  const pageStyle = {
    padding: "32px 24px",
    maxWidth: 800,
    margin: "0 auto",
    fontFamily: "var(--font-body, -apple-system, BlinkMacSystemFont, sans-serif)",
    color: "var(--text1, #e8e8e8)",
  };

  const cardStyle = {
    background: "var(--surface1, #1e1e2e)",
    borderRadius: 12,
    padding: "24px",
    marginBottom: 24,
    border: "1px solid var(--border, #2a2a3a)",
  };

  const sectionTitle = {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 16,
    display: "flex",
    alignItems: "center",
    gap: 8,
  };

  const inputRow = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid var(--border, #2a2a3a)",
  };

  const inputLabel = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 14,
    flex: 1,
  };

  const xpInput = {
    width: 80,
    padding: "6px 10px",
    borderRadius: 8,
    border: "1px solid var(--border, #2a2a3a)",
    background: "var(--surface2, #252535)",
    color: "var(--text1, #e8e8e8)",
    fontSize: 14,
    textAlign: "center",
  };

  const btnPrimary = {
    padding: "10px 20px",
    borderRadius: 8,
    border: "none",
    background: "var(--accent, #6c5ce7)",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 14,
  };

  const btnSecondary = {
    padding: "8px 16px",
    borderRadius: 8,
    border: "1px solid var(--border, #2a2a3a)",
    background: "transparent",
    color: "var(--text2, #aaa)",
    cursor: "pointer",
    fontSize: 13,
  };

  const btnDanger = {
    padding: "4px 10px",
    borderRadius: 6,
    border: "none",
    background: "#e74c3c33",
    color: "#e74c3c",
    cursor: "pointer",
    fontSize: 12,
  };

  const bannerStyle = {
    background: "linear-gradient(135deg, #f39c12, #e74c3c)",
    borderRadius: 12,
    padding: "16px 20px",
    marginBottom: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    color: "#fff",
  };

  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
          <div className="spinner" />
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <button onClick={() => navigate(-1)} style={{ ...btnSecondary, marginBottom: 8 }}>
            ← Back
          </button>
          <h1 style={{ fontSize: 26, fontWeight: 700, fontFamily: "var(--font-display, var(--font-body))" }}>
            ⚙️ XP Controls
          </h1>
          <p style={{ color: "var(--text2, #aaa)", fontSize: 14, marginTop: 4 }}>
            Configure XP rewards, behavior bonuses, and multiplier events for this course.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button onClick={handleResetDefaults} style={btnSecondary}>
            Reset Defaults
          </button>
          <button onClick={handleSave} disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.6 : 1 }}>
            {saving ? "Saving..." : saved ? "✓ Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Active Multiplier Banner */}
      {isMultiplierActive() && (
        <div style={bannerStyle}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>
              🚀 {activeMultiplier.label} Active!
            </div>
            <div style={{ fontSize: 13, opacity: 0.9 }}>
              Expires: {new Date(activeMultiplier.expiresAt?.toDate?.() ? activeMultiplier.expiresAt.toDate() : activeMultiplier.expiresAt).toLocaleTimeString()}
            </div>
          </div>
          <button onClick={stopMultiplierEvent} style={{ ...btnSecondary, color: "#fff", borderColor: "#fff6" }}>
            End Event
          </button>
        </div>
      )}

      {/* Section 1: Activity XP Values */}
      <div style={cardStyle}>
        <div style={sectionTitle}>📊 Activity XP Values</div>
        <p style={{ color: "var(--text2, #aaa)", fontSize: 13, marginBottom: 16 }}>
          Set how much XP students earn for each type of activity. Changes apply to future actions only.
        </p>
        {Object.entries(XP_LABELS).map(([key, { label, icon }]) => (
          <div key={key} style={inputRow}>
            <div style={inputLabel}>
              <span>{icon}</span>
              <span>{label}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input
                type="number"
                min={0}
                value={xpValues[key]}
                onChange={(e) => updateXPValue(key, e.target.value)}
                style={xpInput}
              />
              <span style={{ color: "var(--text2, #aaa)", fontSize: 12 }}>XP</span>
            </div>
          </div>
        ))}
      </div>

      {/* Section 2: Level Thresholds */}
      <div style={cardStyle}>
        <div style={sectionTitle}>⬆️ Level Thresholds</div>
        <p style={{ color: "var(--text2, #aaa)", fontSize: 13, marginBottom: 16 }}>
          Set the total XP required to reach each level. Level 1 always starts at 0 XP. Each level must require more XP than the previous.
        </p>
        {levelThresholds.map((t, idx) => {
          const levelName = LEVELS[idx]?.name || `Level ${t.level}`;
          const prevXP = idx > 0 ? levelThresholds[idx - 1].xpRequired : 0;
          const gap = t.xpRequired - prevXP;
          return (
            <div key={t.level} style={inputRow}>
              <div style={inputLabel}>
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  background: idx < 3 ? "#2a3a2a" : idx < 6 ? "#2a2a4a" : idx < 8 ? "#3a2a3a" : "#3a2a1a",
                  fontSize: 12,
                  fontWeight: 800,
                  color: idx < 3 ? "#2ecc71" : idx < 6 ? "#3498db" : idx < 8 ? "#9b59b6" : "#f39c12",
                }}>{t.level}</span>
                <span>{levelName}</span>
                {idx > 0 && (
                  <span style={{ fontSize: 11, color: "var(--text2, #aaa)", marginLeft: 4 }}>
                    (+{gap.toLocaleString()} from Lv{t.level - 1})
                  </span>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {idx === 0 ? (
                  <span style={{ ...xpInput, opacity: 0.5, display: "inline-block", background: "transparent", border: "1px solid transparent" }}>0</span>
                ) : (
                  <input
                    type="number"
                    min={prevXP + 1}
                    value={t.xpRequired}
                    onChange={(e) => {
                      const val = Math.max(prevXP + 1, parseInt(e.target.value) || 0);
                      setLevelThresholds((prev) => {
                        const updated = [...prev];
                        updated[idx] = { ...updated[idx], xpRequired: val };
                        // Auto-bump any subsequent levels that would be lower
                        for (let j = idx + 1; j < updated.length; j++) {
                          if (updated[j].xpRequired <= updated[j - 1].xpRequired) {
                            updated[j] = { ...updated[j], xpRequired: updated[j - 1].xpRequired + 100 };
                          }
                        }
                        return updated;
                      });
                    }}
                    style={xpInput}
                  />
                )}
                <span style={{ color: "var(--text2, #aaa)", fontSize: 12 }}>XP</span>
              </div>
            </div>
          );
        })}
        {/* Quick presets */}
        <div style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: "var(--text2, #aaa)", alignSelf: "center" }}>Presets:</span>
          <button
            onClick={() => setLevelThresholds([...DEFAULT_LEVEL_THRESHOLDS])}
            style={{ ...btnSecondary, fontSize: 12, padding: "4px 12px" }}
          >
            Default
          </button>
          <button
            onClick={() => setLevelThresholds(DEFAULT_LEVEL_THRESHOLDS.map((t) => ({ ...t, xpRequired: Math.round(t.xpRequired * 0.5) })))}
            style={{ ...btnSecondary, fontSize: 12, padding: "4px 12px" }}
          >
            Easy (50%)
          </button>
          <button
            onClick={() => setLevelThresholds(DEFAULT_LEVEL_THRESHOLDS.map((t) => ({ ...t, xpRequired: Math.round(t.xpRequired * 1.5) })))}
            style={{ ...btnSecondary, fontSize: 12, padding: "4px 12px" }}
          >
            Hard (150%)
          </button>
          <button
            onClick={() => {
              const linear = DEFAULT_LEVEL_THRESHOLDS.map((t, i) => ({ ...t, xpRequired: i * 200 }));
              setLevelThresholds(linear);
            }}
            style={{ ...btnSecondary, fontSize: 12, padding: "4px 12px" }}
          >
            Linear (200/lvl)
          </button>
        </div>
      </div>

      {/* Section 3: Behavior Rewards */}
      <div style={cardStyle}>
        <div style={sectionTitle}>🙋 Behavior Rewards</div>
        <p style={{ color: "var(--text2, #aaa)", fontSize: 13, marginBottom: 16 }}>
          Quick-award XP from the class roster for positive behaviors. Customize the list below.
        </p>

        {behaviorRewards.map((b) => (
          <div key={b.id} style={inputRow}>
            <div style={inputLabel}>
              <span style={{ fontSize: 18 }}>{b.icon}</span>
              <span>{b.label}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="number"
                min={0}
                value={b.xp}
                onChange={(e) => updateBehaviorXP(b.id, e.target.value)}
                style={{ ...xpInput, width: 60 }}
              />
              <span style={{ color: "var(--text2, #aaa)", fontSize: 12 }}>XP</span>
              <button onClick={() => removeBehavior(b.id)} style={btnDanger}>✕</button>
            </div>
          </div>
        ))}

        {/* Add new behavior */}
        <div style={{ marginTop: 16, padding: "16px", background: "var(--surface2, #252535)", borderRadius: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: "var(--text2, #aaa)" }}>
            + Add Custom Behavior
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <input
              type="text"
              placeholder="Icon"
              value={newBehavior.icon}
              onChange={(e) => setNewBehavior((p) => ({ ...p, icon: e.target.value }))}
              style={{ ...xpInput, width: 50 }}
            />
            <input
              type="text"
              placeholder="Behavior name..."
              value={newBehavior.label}
              onChange={(e) => setNewBehavior((p) => ({ ...p, label: e.target.value }))}
              style={{ ...xpInput, width: 200, textAlign: "left" }}
            />
            <input
              type="number"
              min={0}
              value={newBehavior.xp}
              onChange={(e) => setNewBehavior((p) => ({ ...p, xp: parseInt(e.target.value) || 0 }))}
              style={{ ...xpInput, width: 60 }}
            />
            <span style={{ color: "var(--text2, #aaa)", fontSize: 12 }}>XP</span>
            <button onClick={addBehavior} disabled={!newBehavior.label.trim()} style={{ ...btnPrimary, padding: "6px 14px", fontSize: 13, opacity: newBehavior.label.trim() ? 1 : 0.5 }}>
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Section 4: Streak Multipliers */}
      <div style={cardStyle}>
        <div style={sectionTitle}>🔥 Streak Multipliers</div>
        <p style={{ color: "var(--text2, #aaa)", fontSize: 13, marginBottom: 16 }}>
          Students with active streaks earn bonus XP. Configure the multiplier for each streak milestone.
        </p>
        {Object.entries(multiplierConfig.streakMultipliers || {}).map(([days, mult]) => (
          <div key={days} style={inputRow}>
            <div style={inputLabel}>
              <span>🔥</span>
              <span>{days}-day streak</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input
                type="number"
                min={1}
                max={5}
                step={0.25}
                value={mult}
                onChange={(e) =>
                  setMultiplierConfig((prev) => ({
                    ...prev,
                    streakMultipliers: {
                      ...prev.streakMultipliers,
                      [days]: parseFloat(e.target.value) || 1,
                    },
                  }))
                }
                style={{ ...xpInput, width: 70 }}
              />
              <span style={{ color: "var(--text2, #aaa)", fontSize: 12 }}>×</span>
            </div>
          </div>
        ))}
      </div>

      {/* Section 5: XP Multiplier Events */}
      <div style={cardStyle}>
        <div style={sectionTitle}>🚀 XP Multiplier Events</div>
        <p style={{ color: "var(--text2, #aaa)", fontSize: 13, marginBottom: 16 }}>
          Trigger a class-wide XP boost. Great for review days or rewarding good behavior.
        </p>

        {isMultiplierActive() ? (
          <div style={{ textAlign: "center", padding: 20 }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🚀</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{activeMultiplier.label} is active!</div>
            <div style={{ color: "var(--text2, #aaa)", fontSize: 13, marginTop: 4 }}>
              Expires at {new Date(activeMultiplier.expiresAt?.toDate?.() ? activeMultiplier.expiresAt.toDate() : activeMultiplier.expiresAt).toLocaleTimeString()}
            </div>
            <button onClick={stopMultiplierEvent} style={{ ...btnDanger, marginTop: 12, padding: "8px 20px" }}>
              End Event Early
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
            <div>
              <label style={{ fontSize: 12, color: "var(--text2, #aaa)", display: "block", marginBottom: 4 }}>
                Event Name
              </label>
              <input
                type="text"
                value={eventLabel}
                onChange={(e) => setEventLabel(e.target.value)}
                style={{ ...xpInput, width: 180, textAlign: "left" }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--text2, #aaa)", display: "block", marginBottom: 4 }}>
                Multiplier
              </label>
              <select
                value={eventMultiplier}
                onChange={(e) => setEventMultiplier(parseFloat(e.target.value))}
                style={{ ...xpInput, width: 80 }}
              >
                <option value={1.5}>1.5×</option>
                <option value={2}>2×</option>
                <option value={3}>3×</option>
                <option value={5}>5×</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--text2, #aaa)", display: "block", marginBottom: 4 }}>
                Duration
              </label>
              <select
                value={eventDuration}
                onChange={(e) => setEventDuration(parseInt(e.target.value))}
                style={{ ...xpInput, width: 120 }}
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>1 hour</option>
                <option value={120}>2 hours</option>
                <option value={480}>Full day (8h)</option>
              </select>
            </div>
            <button onClick={startMultiplierEvent} style={btnPrimary}>
              🚀 Start Event
            </button>
          </div>
        )}
      </div>

      {/* Section 6: Written Response Grading XP */}
      <div style={cardStyle}>
        <div style={sectionTitle}>📝 Written Response Grading XP</div>
        <p style={{ color: "var(--text2, #aaa)", fontSize: 13, marginBottom: 16 }}>
          XP awarded when you grade a written response. Students receive XP based on the grade tier you assign.
        </p>
        {Object.entries(WRITTEN_XP_LABELS).map(([key, { label, icon, color }]) => (
          <div key={key} style={inputRow}>
            <div style={inputLabel}>
              <span>{icon}</span>
              <span style={{ color }}>{label}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input
                type="number"
                min={0}
                value={xpValues[key] ?? DEFAULT_XP_VALUES[key] ?? 0}
                onChange={(e) => updateXPValue(key, e.target.value)}
                style={xpInput}
              />
              <span style={{ color: "var(--text2, #aaa)", fontSize: 12 }}>XP</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
