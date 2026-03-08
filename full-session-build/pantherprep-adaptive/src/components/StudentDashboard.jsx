// src/components/StudentDashboard.jsx
// Student-facing adaptive dashboard for PantherPrep
// Shows mastery heat map, recommendations, progress over time, streak

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useAdaptiveProfile, useRecentAnswers } from "../hooks/useAdaptive";
import {
  MATH_SKILLS,
  RW_SKILLS,
  skillLabel,
  domainForSkill,
} from "../services/adaptiveEngine";

// ============================================================
// STYLE CONSTANTS (matching PantherPrep dark theme)
// ============================================================

const COLORS = {
  bg: "#0e0e14",
  surface: "#13131f",
  surfaceHover: "#1a1a2e",
  border: "#1e293b",
  muted: "#64748b",
  text: "#e2e8f0",
  textDim: "#94a3b8",
  accent: "#818cf8",     // indigo-400
  accentDim: "#6366f1",
  success: "#34d399",    // emerald-400
  warning: "#fbbf24",    // amber-400
  danger: "#f87171",     // red-400
  info: "#38bdf8",       // sky-400
  streak: "#f59e0b",     // amber-500
};

// Mastery → color gradient
function masteryColor(m) {
  if (m >= 0.8) return COLORS.success;
  if (m >= 0.6) return "#a3e635"; // lime-400
  if (m >= 0.4) return COLORS.warning;
  if (m >= 0.2) return "#fb923c"; // orange-400
  return COLORS.danger;
}

function masteryBg(m) {
  if (m >= 0.8) return "rgba(52,211,153,0.15)";
  if (m >= 0.6) return "rgba(163,230,53,0.12)";
  if (m >= 0.4) return "rgba(251,191,36,0.12)";
  if (m >= 0.2) return "rgba(251,146,60,0.12)";
  return "rgba(248,113,113,0.12)";
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function StudentDashboard({ uid, course }) {
  const { profile, loading, error, refresh } = useAdaptiveProfile(uid);
  const { answers: recentAnswers } = useRecentAnswers(uid, 200);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedDomain, setSelectedDomain] = useState(null);

  const taxonomy = course?.includes("math") ? MATH_SKILLS : RW_SKILLS;
  const courseLabel = course?.includes("math") ? "Math" : "Reading & Writing";

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} />;
  if (!profile) return <EmptyState onRefresh={refresh} />;

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", color: COLORS.text, fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
      {/* Header */}
      <div style={{ padding: "24px 32px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, margin: 0, letterSpacing: "-0.5px" }}>
            <span style={{ color: COLORS.accent }}>◈</span> Adaptive Dashboard
          </h1>
          <p style={{ color: COLORS.muted, fontSize: "13px", margin: "4px 0 0" }}>
            {courseLabel} • {profile.totalAnswers} answers tracked • {profile.streakDays}🔥 day streak
          </p>
        </div>
        <button onClick={refresh} style={{
          background: COLORS.surface, border: `1px solid ${COLORS.border}`, color: COLORS.accent,
          padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontSize: "13px",
          transition: "all 0.2s"
        }}>
          ↻ Refresh
        </button>
      </div>

      {/* Tab Bar */}
      <div style={{ display: "flex", gap: "0", borderBottom: `1px solid ${COLORS.border}`, padding: "0 32px" }}>
        {["overview", "skills", "history", "practice"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: "none", border: "none", color: activeTab === tab ? COLORS.accent : COLORS.muted,
              padding: "12px 20px", fontSize: "13px", cursor: "pointer", textTransform: "uppercase",
              letterSpacing: "1px", fontWeight: 600,
              borderBottom: activeTab === tab ? `2px solid ${COLORS.accent}` : "2px solid transparent",
              transition: "all 0.2s",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ padding: "24px 32px" }}>
        {activeTab === "overview" && (
          <OverviewTab profile={profile} taxonomy={taxonomy} />
        )}
        {activeTab === "skills" && (
          <SkillsTab
            profile={profile}
            taxonomy={taxonomy}
            selectedDomain={selectedDomain}
            onSelectDomain={setSelectedDomain}
          />
        )}
        {activeTab === "history" && (
          <HistoryTab answers={recentAnswers} />
        )}
        {activeTab === "practice" && (
          <PracticeTab profile={profile} />
        )}
      </div>
    </div>
  );
}

// ============================================================
// OVERVIEW TAB — stats cards + domain mastery + recommendations
// ============================================================

function OverviewTab({ profile, taxonomy }) {
  const { totalAnswers, totalCorrect, streakDays, weeklyStats, recommendations, domains } = profile;
  const overallPct = totalAnswers > 0 ? Math.round((totalCorrect / totalAnswers) * 100) : 0;

  return (
    <div>
      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
        <StatCard label="Overall Accuracy" value={`${overallPct}%`} color={masteryColor(overallPct / 100)} />
        <StatCard label="Questions Answered" value={totalAnswers} color={COLORS.info} />
        <StatCard label="Day Streak" value={`${streakDays} 🔥`} color={COLORS.streak} />
        <StatCard label="This Week" value={`${weeklyStats?.answersThisWeek || 0} answers`} color={COLORS.accent} />
      </div>

      {/* Weekly Momentum */}
      {weeklyStats && (
        <div style={{ ...cardStyle, marginBottom: "24px" }}>
          <h3 style={sectionTitle}>Weekly Momentum</h3>
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            {weeklyStats.improvingDomains?.length > 0 && (
              <div>
                <span style={{ color: COLORS.success, fontSize: "13px", fontWeight: 600 }}>▲ Improving</span>
                <div style={{ color: COLORS.textDim, fontSize: "13px", marginTop: "4px" }}>
                  {weeklyStats.improvingDomains.join(", ")}
                </div>
              </div>
            )}
            {weeklyStats.decliningDomains?.length > 0 && (
              <div>
                <span style={{ color: COLORS.danger, fontSize: "13px", fontWeight: 600 }}>▼ Needs Attention</span>
                <div style={{ color: COLORS.textDim, fontSize: "13px", marginTop: "4px" }}>
                  {weeklyStats.decliningDomains.join(", ")}
                </div>
              </div>
            )}
            {weeklyStats.dominantErrorCategory && (
              <div>
                <span style={{ color: COLORS.warning, fontSize: "13px", fontWeight: 600 }}>⚠ Top Error Pattern</span>
                <div style={{ color: COLORS.textDim, fontSize: "13px", marginTop: "4px" }}>
                  {skillLabel(weeklyStats.dominantErrorCategory)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Domain Mastery Heat Map */}
      <div style={{ ...cardStyle, marginBottom: "24px" }}>
        <h3 style={sectionTitle}>Domain Mastery</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "12px" }}>
          {Object.entries(domains || {}).map(([domain, data]) => (
            <DomainCard key={domain} domain={domain} data={data} />
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div style={cardStyle}>
        <h3 style={sectionTitle}>Recommended Practice</h3>
        {recommendations?.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {recommendations.slice(0, 5).map((rec, i) => (
              <RecommendationRow key={i} rec={rec} index={i} />
            ))}
          </div>
        ) : (
          <p style={{ color: COLORS.muted, fontSize: "14px" }}>
            Complete more practice to get personalized recommendations.
          </p>
        )}
      </div>
    </div>
  );
}

// ============================================================
// SKILLS TAB — detailed per-skill breakdown with SM-2 data
// ============================================================

function SkillsTab({ profile, taxonomy, selectedDomain, onSelectDomain }) {
  const domains = Object.keys(taxonomy);
  const activeDomain = selectedDomain || domains[0];
  const skills = taxonomy[activeDomain] || [];

  return (
    <div>
      {/* Domain selector */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
        {domains.map((d) => (
          <button
            key={d}
            onClick={() => onSelectDomain(d)}
            style={{
              background: d === activeDomain ? COLORS.accent : COLORS.surface,
              color: d === activeDomain ? "#0e0e14" : COLORS.textDim,
              border: `1px solid ${d === activeDomain ? COLORS.accent : COLORS.border}`,
              padding: "6px 14px", borderRadius: "20px", fontSize: "12px",
              cursor: "pointer", fontWeight: 600, transition: "all 0.2s",
            }}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Skills grid */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {skills.map((skillKey) => {
          const skillData = profile.skills?.[skillKey];
          return (
            <SkillRow key={skillKey} skillKey={skillKey} data={skillData} />
          );
        })}
      </div>
    </div>
  );
}

function SkillRow({ skillKey, data }) {
  const [expanded, setExpanded] = useState(false);
  const mastery = data?.mastery ?? 0;
  const total = data?.total ?? 0;
  const correct = data?.correct ?? 0;

  return (
    <div style={{ ...cardStyle, cursor: "pointer", padding: "12px 16px" }} onClick={() => setExpanded(!expanded)}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Mastery indicator */}
        <div style={{
          width: "40px", height: "40px", borderRadius: "8px",
          background: masteryBg(mastery), display: "flex", alignItems: "center",
          justifyContent: "center", fontWeight: 700, fontSize: "14px",
          color: masteryColor(mastery), flexShrink: 0,
        }}>
          {total > 0 ? `${Math.round(mastery * 100)}` : "—"}
        </div>

        {/* Skill name + stats */}
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: "14px" }}>{skillLabel(skillKey)}</div>
          <div style={{ color: COLORS.muted, fontSize: "12px", marginTop: "2px" }}>
            {total > 0 ? `${correct}/${total} correct` : "No data yet"}
            {data?.nextReview && ` • Review: ${data.nextReview}`}
          </div>
        </div>

        {/* Mastery bar */}
        <div style={{ width: "120px", height: "6px", background: COLORS.border, borderRadius: "3px", overflow: "hidden" }}>
          <div style={{
            width: `${mastery * 100}%`, height: "100%",
            background: masteryColor(mastery), borderRadius: "3px",
            transition: "width 0.5s ease"
          }} />
        </div>

        <span style={{ color: COLORS.muted, fontSize: "12px" }}>{expanded ? "▲" : "▼"}</span>
      </div>

      {/* Expanded detail */}
      {expanded && data && (
        <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: `1px solid ${COLORS.border}` }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", fontSize: "12px" }}>
            <div>
              <span style={{ color: COLORS.muted }}>SM-2 Ease</span>
              <div style={{ fontWeight: 600, marginTop: "2px" }}>{data.ease?.toFixed(2) ?? "—"}</div>
            </div>
            <div>
              <span style={{ color: COLORS.muted }}>Interval</span>
              <div style={{ fontWeight: 600, marginTop: "2px" }}>{data.interval ?? 0} days</div>
            </div>
            <div>
              <span style={{ color: COLORS.muted }}>Next Review</span>
              <div style={{ fontWeight: 600, marginTop: "2px" }}>{data.nextReview ?? "—"}</div>
            </div>
          </div>

          {/* Error patterns */}
          {data.errorPatterns && Object.values(data.errorPatterns).some((v) => v > 0) && (
            <div style={{ marginTop: "12px" }}>
              <span style={{ color: COLORS.muted, fontSize: "12px" }}>Error Patterns</span>
              <div style={{ display: "flex", gap: "8px", marginTop: "6px", flexWrap: "wrap" }}>
                {Object.entries(data.errorPatterns)
                  .filter(([_, count]) => count > 0)
                  .sort((a, b) => b[1] - a[1])
                  .map(([cat, count]) => (
                    <span
                      key={cat}
                      style={{
                        background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)",
                        padding: "2px 8px", borderRadius: "10px", fontSize: "11px", color: COLORS.danger,
                      }}
                    >
                      {skillLabel(cat)}: {count}
                    </span>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// HISTORY TAB — recent answer feed
// ============================================================

function HistoryTab({ answers }) {
  const [filter, setFilter] = useState("all"); // all | correct | incorrect

  const filtered = useMemo(() => {
    if (filter === "correct") return answers.filter((a) => a.correct);
    if (filter === "incorrect") return answers.filter((a) => !a.correct);
    return answers;
  }, [answers, filter]);

  return (
    <div>
      {/* Filter pills */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        {["all", "correct", "incorrect"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              background: f === filter ? COLORS.accent : COLORS.surface,
              color: f === filter ? "#0e0e14" : COLORS.textDim,
              border: `1px solid ${f === filter ? COLORS.accent : COLORS.border}`,
              padding: "4px 12px", borderRadius: "14px", fontSize: "12px",
              cursor: "pointer", fontWeight: 600, textTransform: "capitalize",
            }}
          >
            {f} ({f === "all" ? answers.length : f === "correct" ? answers.filter((a) => a.correct).length : answers.filter((a) => !a.correct).length})
          </button>
        ))}
      </div>

      {/* Answer list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px", maxHeight: "600px", overflowY: "auto" }}>
        {filtered.slice(0, 100).map((ans, i) => (
          <div
            key={i}
            style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "8px 12px", background: COLORS.surface,
              borderRadius: "6px", fontSize: "13px",
              borderLeft: `3px solid ${ans.correct ? COLORS.success : COLORS.danger}`,
            }}
          >
            <span style={{ color: ans.correct ? COLORS.success : COLORS.danger, fontWeight: 700, width: "20px" }}>
              {ans.correct ? "✓" : "✗"}
            </span>
            <span style={{ flex: 1, color: COLORS.textDim }}>{skillLabel(ans.skill || "unknown")}</span>
            <span style={{
              padding: "1px 6px", borderRadius: "4px", fontSize: "11px",
              background: ans.difficulty === "C" ? "rgba(248,113,113,0.15)" : ans.difficulty === "F" ? "rgba(52,211,153,0.15)" : "rgba(251,191,36,0.12)",
              color: ans.difficulty === "C" ? COLORS.danger : ans.difficulty === "F" ? COLORS.success : COLORS.warning,
            }}>
              {ans.difficulty}
            </span>
            <span style={{ color: COLORS.muted, fontSize: "11px", width: "60px", textAlign: "right" }}>
              {ans.timeSpent ? `${ans.timeSpent}s` : "—"}
            </span>
            {ans.errorCategory && (
              <span style={{ color: COLORS.danger, fontSize: "11px" }}>
                {skillLabel(ans.errorCategory)}
              </span>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <p style={{ color: COLORS.muted, textAlign: "center", padding: "40px" }}>No answers to show.</p>
        )}
      </div>
    </div>
  );
}

// ============================================================
// PRACTICE TAB — launch adaptive practice
// ============================================================

function PracticeTab({ profile }) {
  const recs = profile?.recommendations || [];

  return (
    <div>
      <div style={cardStyle}>
        <h3 style={sectionTitle}>Your Adaptive Practice Plan</h3>
        <p style={{ color: COLORS.textDim, fontSize: "14px", marginBottom: "16px" }}>
          Based on your performance data, here's what you should focus on next.
          Each practice set is personalized to target your weakest areas.
        </p>

        {recs.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {recs.map((rec, i) => (
              <div
                key={i}
                style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: "12px 16px", background: COLORS.bg,
                  borderRadius: "8px", border: `1px solid ${COLORS.border}`,
                }}
              >
                <div style={{
                  width: "28px", height: "28px", borderRadius: "50%",
                  background: i < 3 ? COLORS.accent : COLORS.surface,
                  color: i < 3 ? "#0e0e14" : COLORS.muted,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontSize: "12px", flexShrink: 0,
                }}>
                  {rec.priority}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: "14px" }}>{skillLabel(rec.skill)}</div>
                  <div style={{ color: COLORS.muted, fontSize: "12px" }}>
                    {rec.domain} • {rec.reason}
                  </div>
                </div>
                <span style={{
                  padding: "2px 8px", borderRadius: "4px", fontSize: "11px",
                  background: rec.suggestedDifficulty === "C" ? "rgba(248,113,113,0.15)" : rec.suggestedDifficulty === "F" ? "rgba(52,211,153,0.15)" : "rgba(251,191,36,0.12)",
                  color: rec.suggestedDifficulty === "C" ? COLORS.danger : rec.suggestedDifficulty === "F" ? COLORS.success : COLORS.warning,
                }}>
                  {rec.suggestedDifficulty} × {rec.questionCount}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: COLORS.muted }}>Complete some modules to generate recommendations.</p>
        )}

        {/* Launch button */}
        <button
          style={{
            marginTop: "20px", width: "100%", padding: "14px",
            background: `linear-gradient(135deg, ${COLORS.accentDim}, ${COLORS.accent})`,
            color: "#0e0e14", border: "none", borderRadius: "8px",
            fontSize: "15px", fontWeight: 700, cursor: "pointer",
            letterSpacing: "0.5px", transition: "all 0.2s",
          }}
          disabled={recs.length === 0}
        >
          ▶ Launch Adaptive Practice ({recs.reduce((s, r) => s + r.questionCount, 0)} questions)
        </button>
      </div>
    </div>
  );
}

// ============================================================
// SHARED SUBCOMPONENTS
// ============================================================

function StatCard({ label, value, color }) {
  return (
    <div style={{ ...cardStyle, textAlign: "center", padding: "16px" }}>
      <div style={{ fontSize: "28px", fontWeight: 700, color, letterSpacing: "-1px" }}>{value}</div>
      <div style={{ fontSize: "12px", color: COLORS.muted, marginTop: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</div>
    </div>
  );
}

function DomainCard({ domain, data }) {
  const mastery = data?.mastery ?? 0;
  return (
    <div style={{ ...cardStyle, padding: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "10px" }}>
        <div style={{ fontWeight: 600, fontSize: "14px" }}>{domain}</div>
        <span style={{ color: masteryColor(mastery), fontWeight: 700, fontSize: "18px" }}>
          {Math.round(mastery * 100)}%
        </span>
      </div>
      {/* Mastery bar */}
      <div style={{ height: "8px", background: COLORS.border, borderRadius: "4px", overflow: "hidden", marginBottom: "10px" }}>
        <div style={{
          width: `${mastery * 100}%`, height: "100%",
          background: `linear-gradient(90deg, ${masteryColor(mastery)}88, ${masteryColor(mastery)})`,
          borderRadius: "4px", transition: "width 0.6s ease",
        }} />
      </div>
      <div style={{ fontSize: "12px", color: COLORS.muted }}>
        {data?.totalCorrect ?? 0}/{data?.totalAnswers ?? 0} correct
      </div>
      {data?.weakestSkills?.length > 0 && (
        <div style={{ fontSize: "11px", color: COLORS.danger, marginTop: "6px" }}>
          Focus: {data.weakestSkills.map(skillLabel).join(", ")}
        </div>
      )}
    </div>
  );
}

function RecommendationRow({ rec, index }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px",
      background: index === 0 ? "rgba(129,140,248,0.08)" : COLORS.bg,
      borderRadius: "6px", border: `1px solid ${index === 0 ? "rgba(129,140,248,0.2)" : COLORS.border}`,
    }}>
      <span style={{
        color: index === 0 ? COLORS.accent : COLORS.muted, fontWeight: 700,
        fontSize: "14px", width: "24px",
      }}>
        #{rec.priority}
      </span>
      <div style={{ flex: 1 }}>
        <span style={{ fontWeight: 600, fontSize: "13px" }}>{skillLabel(rec.skill)}</span>
        <span style={{ color: COLORS.muted, fontSize: "12px", marginLeft: "8px" }}>({rec.domain})</span>
      </div>
      <span style={{ color: COLORS.textDim, fontSize: "12px" }}>{rec.reason}</span>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: COLORS.bg, color: COLORS.accent }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "32px", animation: "spin 1s linear infinite" }}>◈</div>
        <p style={{ color: COLORS.muted, marginTop: "12px", fontSize: "14px" }}>Loading adaptive profile...</p>
      </div>
    </div>
  );
}

function ErrorScreen({ message }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: COLORS.bg }}>
      <div style={{ ...cardStyle, maxWidth: "400px", textAlign: "center" }}>
        <div style={{ fontSize: "32px", marginBottom: "12px" }}>⚠</div>
        <p style={{ color: COLORS.danger }}>{message}</p>
      </div>
    </div>
  );
}

function EmptyState({ onRefresh }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: COLORS.bg }}>
      <div style={{ ...cardStyle, maxWidth: "480px", textAlign: "center", padding: "40px" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>📊</div>
        <h2 style={{ color: COLORS.text, marginBottom: "8px" }}>No Adaptive Data Yet</h2>
        <p style={{ color: COLORS.muted, fontSize: "14px", marginBottom: "20px" }}>
          Complete some practice modules to start building your adaptive profile.
          The engine needs at least a few sessions to generate personalized recommendations.
        </p>
        <button onClick={onRefresh} style={{
          background: COLORS.accent, color: "#0e0e14", border: "none",
          padding: "10px 24px", borderRadius: "6px", cursor: "pointer",
          fontWeight: 600, fontSize: "14px",
        }}>
          Check Again
        </button>
      </div>
    </div>
  );
}

// ============================================================
// SHARED STYLES
// ============================================================

const cardStyle = {
  background: COLORS.surface,
  border: `1px solid ${COLORS.border}`,
  borderRadius: "10px",
  padding: "20px",
};

const sectionTitle = {
  fontSize: "16px",
  fontWeight: 700,
  marginBottom: "16px",
  color: COLORS.text,
  margin: "0 0 16px 0",
};
