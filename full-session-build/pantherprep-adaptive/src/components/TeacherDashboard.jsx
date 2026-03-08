// src/components/TeacherDashboard.jsx
// Teacher-facing adaptive dashboard for PantherPrep
// Shows class overview, per-student drill-down, intervention alerts, question stats

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { getAllAdaptiveProfiles } from "../services/performanceService";
import { skillLabel, domainForSkill, MATH_SKILLS, RW_SKILLS } from "../services/adaptiveEngine";

// ============================================================
// COLORS (matching PantherPrep dark theme)
// ============================================================

const C = {
  bg: "#0e0e14",
  surface: "#13131f",
  border: "#1e293b",
  muted: "#64748b",
  text: "#e2e8f0",
  textDim: "#94a3b8",
  accent: "#818cf8",
  success: "#34d399",
  warning: "#fbbf24",
  danger: "#f87171",
  info: "#38bdf8",
};

function masteryColor(m) {
  if (m >= 0.8) return C.success;
  if (m >= 0.6) return "#a3e635";
  if (m >= 0.4) return C.warning;
  if (m >= 0.2) return "#fb923c";
  return C.danger;
}

// ============================================================
// MAIN TEACHER DASHBOARD
// ============================================================

export default function TeacherDashboard({ course }) {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("overview"); // overview | student | alerts | questions
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [sortBy, setSortBy] = useState("name"); // name | mastery | activity | streak

  const taxonomy = course?.includes("math") ? MATH_SKILLS : RW_SKILLS;

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const all = await getAllAdaptiveProfiles();
      setProfiles(all);
    } catch (e) {
      console.warn("TeacherDashboard load error:", e);
    } finally {
      setLoading(false);
    }
  }

  // ---- Computed data ----

  const classStats = useMemo(() => {
    if (!profiles.length) return null;

    const totalStudents = profiles.length;
    const activeThisWeek = profiles.filter(
      (p) => (p.weeklyStats?.answersThisWeek || 0) > 0
    ).length;
    const avgMastery =
      profiles.reduce((sum, p) => {
        const domainMasteries = Object.values(p.domains || {}).map((d) => d.mastery || 0);
        return sum + (domainMasteries.length > 0 ? domainMasteries.reduce((a, b) => a + b, 0) / domainMasteries.length : 0);
      }, 0) / totalStudents;
    const avgAccuracy =
      profiles.reduce((sum, p) => sum + (p.totalAnswers > 0 ? p.totalCorrect / p.totalAnswers : 0), 0) / totalStudents;
    const totalAnswersThisWeek = profiles.reduce((s, p) => s + (p.weeklyStats?.answersThisWeek || 0), 0);

    return { totalStudents, activeThisWeek, avgMastery, avgAccuracy, totalAnswersThisWeek };
  }, [profiles]);

  // Intervention alerts: students with low mastery or declining performance
  const alerts = useMemo(() => {
    const a = [];
    for (const p of profiles) {
      // Low overall mastery
      const domainMasteries = Object.values(p.domains || {}).map((d) => d.mastery || 0);
      const avgM = domainMasteries.length > 0 ? domainMasteries.reduce((s, v) => s + v, 0) / domainMasteries.length : 0;
      if (avgM < 0.3 && p.totalAnswers > 10) {
        a.push({
          uid: p.uid,
          name: p.uid, // In production, join with student names
          type: "low_mastery",
          severity: "high",
          message: `Overall mastery at ${Math.round(avgM * 100)}% after ${p.totalAnswers} questions`,
        });
      }

      // Declining domains
      if (p.weeklyStats?.decliningDomains?.length > 0) {
        a.push({
          uid: p.uid,
          name: p.uid,
          type: "declining",
          severity: "medium",
          message: `Declining in: ${p.weeklyStats.decliningDomains.join(", ")}`,
        });
      }

      // Inactive (no answers this week but has history)
      if (p.totalAnswers > 0 && (p.weeklyStats?.answersThisWeek || 0) === 0) {
        a.push({
          uid: p.uid,
          name: p.uid,
          type: "inactive",
          severity: "low",
          message: `No activity this week (${p.totalAnswers} total answers)`,
        });
      }

      // High content gap errors
      const contentGaps = Object.values(p.skills || {}).reduce(
        (s, sk) => s + (sk.errorPatterns?.content_gap || 0), 0
      );
      if (contentGaps > 5) {
        a.push({
          uid: p.uid,
          name: p.uid,
          type: "content_gap",
          severity: "high",
          message: `${contentGaps} content gap errors — may need direct instruction`,
        });
      }
    }
    return a.sort((a, b) => {
      const sev = { high: 0, medium: 1, low: 2 };
      return (sev[a.severity] || 3) - (sev[b.severity] || 3);
    });
  }, [profiles]);

  // Class-wide skill mastery for heatmap
  const classSkillMastery = useMemo(() => {
    const allSkills = {};
    for (const p of profiles) {
      for (const [skill, data] of Object.entries(p.skills || {})) {
        if (!allSkills[skill]) allSkills[skill] = { masteries: [], total: 0, correct: 0 };
        allSkills[skill].masteries.push(data.mastery);
        allSkills[skill].total += data.total;
        allSkills[skill].correct += data.correct;
      }
    }
    // Average mastery per skill
    for (const [k, v] of Object.entries(allSkills)) {
      v.avgMastery = v.masteries.reduce((s, m) => s + m, 0) / v.masteries.length;
      v.studentCount = v.masteries.length;
    }
    return allSkills;
  }, [profiles]);

  // Sorted student list
  const sortedProfiles = useMemo(() => {
    return [...profiles].sort((a, b) => {
      if (sortBy === "name") return (a.uid || "").localeCompare(b.uid || "");
      if (sortBy === "mastery") {
        const aM = Object.values(a.domains || {}).reduce((s, d) => s + (d.mastery || 0), 0);
        const bM = Object.values(b.domains || {}).reduce((s, d) => s + (d.mastery || 0), 0);
        return aM - bM; // lowest first (needs most help)
      }
      if (sortBy === "activity") return (b.weeklyStats?.answersThisWeek || 0) - (a.weeklyStats?.answersThisWeek || 0);
      if (sortBy === "streak") return (b.streakDays || 0) - (a.streakDays || 0);
      return 0;
    });
  }, [profiles, sortBy]);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: C.bg, color: C.accent }}>
        <p>Loading class data...</p>
      </div>
    );
  }

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
      {/* Header */}
      <div style={{ padding: "24px 32px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, margin: 0 }}>
            <span style={{ color: C.accent }}>◈</span> Teacher Dashboard
          </h1>
          <p style={{ color: C.muted, fontSize: "13px", margin: "4px 0 0" }}>
            {profiles.length} students • {alerts.filter((a) => a.severity === "high").length} high-priority alerts
          </p>
        </div>
        <button onClick={loadData} style={{
          background: C.surface, border: `1px solid ${C.border}`, color: C.accent,
          padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontSize: "13px",
        }}>
          ↻ Refresh
        </button>
      </div>

      {/* Nav */}
      <div style={{ display: "flex", gap: "0", borderBottom: `1px solid ${C.border}`, padding: "0 32px" }}>
        {[
          { key: "overview", label: "Class Overview" },
          { key: "students", label: "Students" },
          { key: "alerts", label: `Alerts (${alerts.length})` },
          { key: "heatmap", label: "Skill Heatmap" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveView(tab.key); setSelectedStudent(null); }}
            style={{
              background: "none", border: "none",
              color: activeView === tab.key ? C.accent : C.muted,
              padding: "12px 20px", fontSize: "13px", cursor: "pointer",
              fontWeight: 600, letterSpacing: "0.5px",
              borderBottom: activeView === tab.key ? `2px solid ${C.accent}` : "2px solid transparent",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ padding: "24px 32px" }}>
        {/* CLASS OVERVIEW */}
        {activeView === "overview" && classStats && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px", marginBottom: "24px" }}>
              <MiniStat label="Students" value={classStats.totalStudents} color={C.info} />
              <MiniStat label="Active This Week" value={classStats.activeThisWeek} color={C.success} />
              <MiniStat label="Avg Mastery" value={`${Math.round(classStats.avgMastery * 100)}%`} color={masteryColor(classStats.avgMastery)} />
              <MiniStat label="Avg Accuracy" value={`${Math.round(classStats.avgAccuracy * 100)}%`} color={masteryColor(classStats.avgAccuracy)} />
              <MiniStat label="Answers This Week" value={classStats.totalAnswersThisWeek} color={C.accent} />
            </div>

            {/* Class domain breakdown */}
            <div style={card}>
              <h3 style={h3}>Class Domain Performance</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "12px" }}>
                {Object.entries(taxonomy).map(([domain, skills]) => {
                  const skillData = skills.map((s) => classSkillMastery[s]).filter(Boolean);
                  const avgM = skillData.length > 0 ? skillData.reduce((s, d) => s + d.avgMastery, 0) / skillData.length : 0;
                  return (
                    <div key={domain} style={{ background: C.bg, borderRadius: "8px", padding: "12px", border: `1px solid ${C.border}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                        <span style={{ fontWeight: 600, fontSize: "13px" }}>{domain}</span>
                        <span style={{ color: masteryColor(avgM), fontWeight: 700 }}>{Math.round(avgM * 100)}%</span>
                      </div>
                      <div style={{ height: "6px", background: C.border, borderRadius: "3px", overflow: "hidden" }}>
                        <div style={{ width: `${avgM * 100}%`, height: "100%", background: masteryColor(avgM), borderRadius: "3px" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* High priority alerts preview */}
            {alerts.filter((a) => a.severity === "high").length > 0 && (
              <div style={{ ...card, marginTop: "16px", borderColor: "rgba(248,113,113,0.3)" }}>
                <h3 style={{ ...h3, color: C.danger }}>⚠ High Priority Alerts</h3>
                {alerts.filter((a) => a.severity === "high").slice(0, 5).map((alert, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "8px 12px", background: "rgba(248,113,113,0.05)",
                    borderRadius: "6px", marginBottom: "6px",
                    borderLeft: `3px solid ${C.danger}`, fontSize: "13px",
                  }}>
                    <span style={{ color: C.danger, fontWeight: 600 }}>{alert.name}</span>
                    <span style={{ color: C.textDim, flex: 1 }}>{alert.message}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STUDENTS LIST */}
        {activeView === "students" && !selectedStudent && (
          <div>
            {/* Sort controls */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "16px", alignItems: "center" }}>
              <span style={{ color: C.muted, fontSize: "12px", marginRight: "4px" }}>Sort by:</span>
              {["name", "mastery", "activity", "streak"].map((s) => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  style={{
                    background: s === sortBy ? C.accent : C.surface,
                    color: s === sortBy ? "#0e0e14" : C.textDim,
                    border: `1px solid ${s === sortBy ? C.accent : C.border}`,
                    padding: "4px 10px", borderRadius: "12px", fontSize: "11px",
                    cursor: "pointer", fontWeight: 600, textTransform: "capitalize",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Student rows */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {sortedProfiles.map((p) => {
                const domainMasteries = Object.values(p.domains || {}).map((d) => d.mastery || 0);
                const avgM = domainMasteries.length > 0 ? domainMasteries.reduce((s, v) => s + v, 0) / domainMasteries.length : 0;
                const accuracy = p.totalAnswers > 0 ? p.totalCorrect / p.totalAnswers : 0;

                return (
                  <div
                    key={p.uid}
                    onClick={() => setSelectedStudent(p)}
                    style={{
                      display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 80px",
                      alignItems: "center", padding: "12px 16px",
                      background: C.surface, borderRadius: "8px",
                      border: `1px solid ${C.border}`, cursor: "pointer",
                      transition: "border-color 0.2s", fontSize: "13px",
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{p.uid}</span>
                    <span style={{ color: masteryColor(avgM) }}>{Math.round(avgM * 100)}% mastery</span>
                    <span style={{ color: C.textDim }}>{Math.round(accuracy * 100)}% accuracy</span>
                    <span style={{ color: C.textDim }}>{p.weeklyStats?.answersThisWeek || 0} this week</span>
                    <span style={{ color: C.warning }}>{p.streakDays || 0}🔥</span>
                    <span style={{ color: C.accent, textAlign: "right" }}>View →</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STUDENT DRILL-DOWN */}
        {activeView === "students" && selectedStudent && (
          <StudentDrillDown
            profile={selectedStudent}
            taxonomy={taxonomy}
            onBack={() => setSelectedStudent(null)}
          />
        )}

        {/* ALERTS */}
        {activeView === "alerts" && (
          <div>
            <div style={card}>
              <h3 style={h3}>Intervention Alerts</h3>
              {alerts.length === 0 ? (
                <p style={{ color: C.muted }}>No alerts — all students are on track.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {alerts.map((alert, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex", alignItems: "center", gap: "10px",
                        padding: "10px 14px", background: C.bg, borderRadius: "6px",
                        borderLeft: `3px solid ${alert.severity === "high" ? C.danger : alert.severity === "medium" ? C.warning : C.muted}`,
                        fontSize: "13px",
                      }}
                    >
                      <span style={{
                        padding: "2px 6px", borderRadius: "4px", fontSize: "10px",
                        textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.5px",
                        background: alert.severity === "high" ? "rgba(248,113,113,0.15)" : alert.severity === "medium" ? "rgba(251,191,36,0.12)" : "rgba(100,116,139,0.15)",
                        color: alert.severity === "high" ? C.danger : alert.severity === "medium" ? C.warning : C.muted,
                      }}>
                        {alert.severity}
                      </span>
                      <span style={{
                        padding: "2px 6px", borderRadius: "4px", fontSize: "10px",
                        background: "rgba(129,140,248,0.1)", color: C.accent,
                      }}>
                        {alert.type.replace("_", " ")}
                      </span>
                      <span style={{ fontWeight: 600, color: C.text }}>{alert.name}</span>
                      <span style={{ color: C.textDim, flex: 1 }}>{alert.message}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SKILL HEATMAP */}
        {activeView === "heatmap" && (
          <div style={card}>
            <h3 style={h3}>Class Skill Mastery Heatmap</h3>
            <p style={{ color: C.textDim, fontSize: "13px", marginBottom: "16px" }}>
              Average mastery across all students for each skill. Red = class-wide weakness. Green = class strength.
            </p>
            {Object.entries(taxonomy).map(([domain, skills]) => (
              <div key={domain} style={{ marginBottom: "20px" }}>
                <h4 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "8px", color: C.accent }}>{domain}</h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "6px" }}>
                  {skills.map((skillKey) => {
                    const data = classSkillMastery[skillKey];
                    const m = data?.avgMastery ?? 0;
                    return (
                      <div
                        key={skillKey}
                        style={{
                          padding: "10px 12px", borderRadius: "6px",
                          background: `linear-gradient(135deg, ${masteryColor(m)}15, ${masteryColor(m)}08)`,
                          border: `1px solid ${masteryColor(m)}30`,
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: "12px", fontWeight: 500 }}>{skillLabel(skillKey)}</span>
                          <span style={{ color: masteryColor(m), fontWeight: 700, fontSize: "14px" }}>
                            {data ? `${Math.round(m * 100)}%` : "—"}
                          </span>
                        </div>
                        {data && (
                          <div style={{ fontSize: "11px", color: C.muted, marginTop: "4px" }}>
                            {data.studentCount} students • {data.correct}/{data.total} correct
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// STUDENT DRILL-DOWN
// ============================================================

function StudentDrillDown({ profile, taxonomy, onBack }) {
  const domainMasteries = Object.values(profile.domains || {}).map((d) => d.mastery || 0);
  const avgM = domainMasteries.length > 0 ? domainMasteries.reduce((s, v) => s + v, 0) / domainMasteries.length : 0;

  return (
    <div>
      <button onClick={onBack} style={{
        background: "none", border: "none", color: C.accent,
        cursor: "pointer", fontSize: "13px", marginBottom: "16px",
        padding: 0, fontWeight: 600,
      }}>
        ← Back to Students
      </button>

      <div style={{ ...card, marginBottom: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
          <div>
            <h2 style={{ margin: "0 0 4px", fontSize: "20px" }}>{profile.uid}</h2>
            <p style={{ color: C.muted, fontSize: "13px", margin: 0 }}>
              {profile.totalAnswers} answers • {profile.streakDays || 0}🔥 streak •
              Last active: {profile.lastActiveDate || "Unknown"}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "32px", fontWeight: 700, color: masteryColor(avgM) }}>
              {Math.round(avgM * 100)}%
            </div>
            <div style={{ fontSize: "12px", color: C.muted }}>Overall Mastery</div>
          </div>
        </div>
      </div>

      {/* Domain breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "12px", marginBottom: "16px" }}>
        {Object.entries(profile.domains || {}).map(([domain, data]) => (
          <div key={domain} style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontWeight: 600, fontSize: "14px" }}>{domain}</span>
              <span style={{ color: masteryColor(data.mastery), fontWeight: 700 }}>
                {Math.round((data.mastery || 0) * 100)}%
              </span>
            </div>
            <div style={{ height: "6px", background: C.border, borderRadius: "3px", overflow: "hidden", marginBottom: "8px" }}>
              <div style={{ width: `${(data.mastery || 0) * 100}%`, height: "100%", background: masteryColor(data.mastery || 0), borderRadius: "3px" }} />
            </div>
            <div style={{ fontSize: "12px", color: C.muted }}>
              {data.totalCorrect}/{data.totalAnswers} correct
            </div>
            {data.weakestSkills?.length > 0 && (
              <div style={{ fontSize: "11px", color: C.danger, marginTop: "4px" }}>
                Weak: {data.weakestSkills.map(skillLabel).join(", ")}
              </div>
            )}
            {data.strongestSkills?.length > 0 && (
              <div style={{ fontSize: "11px", color: C.success, marginTop: "2px" }}>
                Strong: {data.strongestSkills.map(skillLabel).join(", ")}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Recommendations for this student */}
      <div style={card}>
        <h3 style={h3}>Recommended Next Steps</h3>
        {profile.recommendations?.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {profile.recommendations.slice(0, 5).map((rec, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "8px 12px", background: C.bg, borderRadius: "6px",
                border: `1px solid ${C.border}`, fontSize: "13px",
              }}>
                <span style={{ color: C.accent, fontWeight: 700, width: "24px" }}>#{rec.priority}</span>
                <span style={{ fontWeight: 600 }}>{skillLabel(rec.skill)}</span>
                <span style={{ color: C.muted, flex: 1 }}>{rec.reason}</span>
                <span style={{
                  padding: "2px 8px", borderRadius: "4px", fontSize: "11px",
                  background: rec.suggestedDifficulty === "C" ? "rgba(248,113,113,0.15)" : rec.suggestedDifficulty === "F" ? "rgba(52,211,153,0.15)" : "rgba(251,191,36,0.12)",
                  color: rec.suggestedDifficulty === "C" ? C.danger : rec.suggestedDifficulty === "F" ? C.success : C.warning,
                }}>
                  {rec.suggestedDifficulty} × {rec.questionCount}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: C.muted, fontSize: "13px" }}>No recommendations yet.</p>
        )}
      </div>

      {/* Error pattern summary */}
      {profile.weeklyStats?.dominantErrorCategory && (
        <div style={{ ...card, marginTop: "16px" }}>
          <h3 style={h3}>Error Pattern Analysis</h3>
          <p style={{ color: C.textDim, fontSize: "13px" }}>
            Most common error this week: <span style={{ color: C.warning, fontWeight: 600 }}>{skillLabel(profile.weeklyStats.dominantErrorCategory)}</span>
          </p>
          {/* Aggregate error counts across all skills */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "12px" }}>
            {["content_gap", "careless", "time_pressure", "misread_trap", "strategy_gap"].map((cat) => {
              const count = Object.values(profile.skills || {}).reduce(
                (s, sk) => s + (sk.errorPatterns?.[cat] || 0), 0
              );
              if (count === 0) return null;
              return (
                <div key={cat} style={{
                  padding: "8px 14px", borderRadius: "8px",
                  background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.15)",
                }}>
                  <div style={{ fontSize: "18px", fontWeight: 700, color: C.danger }}>{count}</div>
                  <div style={{ fontSize: "11px", color: C.textDim }}>{skillLabel(cat)}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// SHARED COMPONENTS
// ============================================================

function MiniStat({ label, value, color }) {
  return (
    <div style={{ ...card, textAlign: "center", padding: "14px" }}>
      <div style={{ fontSize: "24px", fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: "11px", color: C.muted, textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "4px" }}>{label}</div>
    </div>
  );
}

const card = {
  background: C.surface,
  border: `1px solid ${C.border}`,
  borderRadius: "10px",
  padding: "20px",
};

const h3 = {
  fontSize: "16px",
  fontWeight: 700,
  margin: "0 0 16px",
  color: C.text,
};
