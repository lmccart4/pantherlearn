// src/pages/EmbeddingExplorerDashboard.jsx
// Teacher dashboard for the Embedding Explorer ("The Word Vault") activity.
// Shows student exploration progress, case breakdowns, and export tools.

import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { db } from "../lib/firebase";
import { getCourseExplorations, calculateScore } from "../lib/embeddingStore";
import { CASES, DIFFICULTY_COLORS, PHASES } from "../lib/embeddingCases";

const TABS = [
  { key: "overview", label: "Overview", icon: "\uD83D\uDCCA" },
  { key: "bycase", label: "By Case", icon: "\uD83D\uDDC2\uFE0F" },
  { key: "export", label: "Export", icon: "\uD83D\uDCE5" },
];

function phaseLabel(phaseId) {
  const p = PHASES.find(ph => ph.id === phaseId);
  return p ? p.label : phaseId || "\u2014";
}

function scoreColor(total) {
  if (total >= 70) return "var(--green, #10b981)";
  if (total >= 40) return "var(--amber, #f5a623)";
  return "var(--red, #ef4444)";
}

function fmtDate(ts) {
  if (!ts) return "\u2014";
  if (ts.toDate) return ts.toDate().toLocaleDateString();
  if (ts instanceof Date) return ts.toLocaleDateString();
  return "\u2014";
}

export default function EmbeddingExplorerDashboard() {
  const { courseId } = useParams();
  const { userRole } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState("overview");
  const [explorations, setExplorations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState("name");
  const [expandedRow, setExpandedRow] = useState(null);
  const [selectedCase, setSelectedCase] = useState(CASES[0]?.id || null);

  const isTeacher = userRole === "teacher";

  useEffect(() => {
    if (!courseId || !isTeacher) return;
    setLoading(true);
    getCourseExplorations(db, courseId)
      .then(setExplorations)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [courseId, isTeacher]);

  // Enrich explorations with computed score
  const enriched = useMemo(() => explorations.map(exp => {
    const caseData = CASES.find(c => c.id === exp.caseId);
    let score = exp.score;
    if (!score && exp.status === "submitted" && caseData) {
      score = calculateScore(exp, caseData);
    }
    return { ...exp, caseData, computedScore: score };
  }), [explorations]);

  // Stats
  const stats = useMemo(() => {
    const total = enriched.length;
    const submitted = enriched.filter(i => i.status === "submitted").length;
    const scored = enriched.filter(i => i.computedScore);
    const avgScore = scored.length ? (scored.reduce((s, i) => s + i.computedScore.total, 0) / scored.length).toFixed(1) : "\u2014";
    const avgInsights = total ? (enriched.reduce((s, i) => s + (i.discoveredInsights?.length || 0), 0) / total).toFixed(1) : "\u2014";
    const active = total - submitted;
    return { total, submitted, avgScore, avgInsights, active };
  }, [enriched]);

  // Sorted explorations
  const sorted = useMemo(() => {
    const arr = [...enriched];
    switch (sortKey) {
      case "name": arr.sort((a, b) => (a.studentName || "").localeCompare(b.studentName || "")); break;
      case "case": arr.sort((a, b) => (a.caseId || "").localeCompare(b.caseId || "")); break;
      case "status": arr.sort((a, b) => (a.status || "").localeCompare(b.status || "")); break;
      case "score": arr.sort((a, b) => (b.computedScore?.total || 0) - (a.computedScore?.total || 0)); break;
      default: break;
    }
    return arr;
  }, [enriched, sortKey]);

  // Export helpers
  function downloadCSV(filename, headers, rows) {
    const escape = v => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [headers.join(","), ...rows.map(r => r.map(escape).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }

  function exportAll() {
    downloadCSV("embedding-explorations.csv",
      ["Student", "Case", "Status", "Phase", "Insights", "Score", "Started", "Updated"],
      enriched.map(e => [
        e.studentName, e.caseData?.title || e.caseId, e.status,
        phaseLabel(e.currentPhase), (e.discoveredInsights?.length || 0),
        e.computedScore?.total ?? "", fmtDate(e.startedAt), fmtDate(e.updatedAt),
      ])
    );
  }

  function exportScores() {
    const scored = enriched.filter(e => e.computedScore);
    downloadCSV("embedding-scores.csv",
      ["Student", "Case", "Insights Found", "Analysis Accuracy", "Key Findings", "Evidence Quality", "Engineer Report", "Total"],
      scored.map(e => [
        e.studentName, e.caseData?.title || e.caseId,
        e.computedScore.insightsFound, e.computedScore.analysisAccuracy,
        e.computedScore.findingsId, e.computedScore.evidenceQuality,
        e.computedScore.engineerReport, e.computedScore.total,
      ])
    );
  }

  function exportReports() {
    const withReports = enriched.filter(e => e.engineerReport?.summary);
    downloadCSV("embedding-reports.csv",
      ["Student", "Case", "Findings", "Summary"],
      withReports.map(e => [
        e.studentName, e.caseData?.title || e.caseId,
        (e.engineerReport?.identifiedFindings || []).join("; "),
        e.engineerReport?.summary || "",
      ])
    );
  }

  // ── Access guard ──
  if (!isTeacher) {
    return (
      <main id="main-content" className="page-wrapper">
        <div className="empty-state">
          <div className="empty-state-icon">🔒</div>
          <div className="empty-state-title">Teacher Access Only</div>
          <div className="empty-state-text">This dashboard is only available to teachers.</div>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main id="main-content" className="page-wrapper">
        <div style={{ minHeight: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="spinner" />
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="page-wrapper">
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: "none", border: "none", color: "var(--text2)", cursor: "pointer", fontSize: 14, padding: 0 }}
        >
          ← Back
        </button>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "var(--text)", margin: 0 }}>
            Word Vault Dashboard
          </h1>
          <p style={{ color: "var(--text3)", fontSize: 13, marginTop: 4, marginBottom: 0 }}>
            Student progress across Embedding Explorer projects
          </p>
        </div>
      </div>

      {/* Stat Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginBottom: 24 }}>
        {[
          { label: "Total", value: stats.total, color: "var(--text)" },
          { label: "Submitted", value: stats.submitted, color: "var(--text)" },
          { label: "Avg Score", value: stats.avgScore, color: "var(--amber)" },
          { label: "Avg Insights", value: stats.avgInsights, color: "var(--cyan)" },
          { label: "Active", value: stats.active, color: "var(--purple, #b08eff)" },
        ].map((s) => (
          <div key={s.label} className="card" style={{ padding: "14px 16px", textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "var(--font-display)", color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="tab-bar" style={{ marginBottom: 20 }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`tab-item ${tab === t.key ? "active" : ""}`}
            onClick={() => setTab(t.key)}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === "overview" && (
        <div>
          {enriched.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">{"\uD83D\uDD22"}</div>
              <div className="empty-state-title">No explorations yet</div>
              <div className="empty-state-text">Student explorations will appear here once they start a project.</div>
            </div>
          ) : (
            <>
              {/* Sort bar */}
              <div style={{ display: "flex", gap: 8, marginBottom: 12, fontSize: 12 }}>
                <span style={{ color: "var(--text3)", lineHeight: "28px" }}>Sort:</span>
                {["name", "case", "status", "score"].map((k) => (
                  <button key={k} onClick={() => setSortKey(k)} style={{
                    padding: "4px 12px", borderRadius: 6, border: "none", cursor: "pointer",
                    background: sortKey === k ? "rgba(34,211,238,0.12)" : "var(--surface2)",
                    color: sortKey === k ? "var(--cyan)" : "var(--text3)",
                    fontWeight: sortKey === k ? 700 : 500, fontSize: 12, textTransform: "capitalize",
                  }}>
                    {k}
                  </button>
                ))}
              </div>

              {/* Table */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {sorted.map((exp) => {
                  const isOpen = expandedRow === exp.id;
                  return (
                    <div key={exp.id} className="card" style={{ padding: "14px 18px" }}>
                      <div
                        onClick={() => setExpandedRow(isOpen ? null : exp.id)}
                        style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
                      >
                        <span style={{ fontSize: 18 }}>{exp.caseData?.emoji || "\uD83D\uDCCB"}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{exp.studentName}</div>
                          <div style={{ fontSize: 11, color: "var(--text3)" }}>
                            {exp.caseData?.title || exp.caseId} &middot; {phaseLabel(exp.currentPhase)}
                          </div>
                        </div>
                        <span style={{
                          fontSize: 10, padding: "2px 10px", borderRadius: 4, fontWeight: 600,
                          background: exp.status === "submitted" ? "rgba(16,185,129,0.12)" : "rgba(245,166,35,0.12)",
                          color: exp.status === "submitted" ? "var(--green)" : "var(--amber)",
                        }}>
                          {exp.status === "submitted" ? "Submitted" : "Active"}
                        </span>
                        {exp.computedScore && (
                          <span style={{ fontSize: 14, fontWeight: 700, color: scoreColor(exp.computedScore.total) }}>
                            {exp.computedScore.total}/100
                          </span>
                        )}
                        <span style={{ color: "var(--text3)", fontSize: 12 }}>{isOpen ? "▲" : "▼"}</span>
                      </div>

                      {isOpen && exp.computedScore && (
                        <div style={{ marginTop: 14, padding: "12px 14px", borderRadius: 8, background: "var(--bg)", border: "1px solid var(--border)" }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text2)", marginBottom: 8 }}>Score Breakdown</div>
                          {[
                            ["Insights Found", exp.computedScore.insightsFound, 25],
                            ["Analysis Accuracy", exp.computedScore.analysisAccuracy, 20],
                            ["Key Findings", exp.computedScore.findingsId, 25],
                            ["Evidence Quality", exp.computedScore.evidenceQuality, 10],
                            ["Engineer Report", exp.computedScore.engineerReport, 20],
                          ].map(([label, val, max]) => (
                            <div key={label} style={{ marginBottom: 4 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text3)", marginBottom: 2 }}>
                                <span>{label}</span>
                                <span>{val}/{max}</span>
                              </div>
                              <div style={{ height: 6, background: "var(--surface2)", borderRadius: 3 }}>
                                <div style={{ width: `${(val / max) * 100}%`, height: "100%", background: "var(--cyan)", borderRadius: 3, transition: "width 0.3s" }} />
                              </div>
                            </div>
                          ))}

                          {exp.engineerReport?.summary && (
                            <div style={{ marginTop: 10 }}>
                              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text2)", marginBottom: 4 }}>Summary</div>
                              <div style={{ background: "var(--surface)", borderRadius: 6, padding: 10, fontSize: 12, lineHeight: 1.5, color: "var(--text2)" }}>
                                {exp.engineerReport.summary}
                              </div>
                            </div>
                          )}

                          <div style={{ marginTop: 10 }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text2)", marginBottom: 4 }}>
                              Insights ({(exp.discoveredInsights || []).length}/{exp.caseData?.insights?.length || 0})
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                              {(exp.discoveredInsights || []).map((insId) => {
                                const ins = exp.caseData?.insights?.find((i) => i.id === insId);
                                return (
                                  <span key={insId} style={{
                                    fontSize: 10, padding: "2px 8px", borderRadius: 4,
                                    background: "rgba(34,211,238,0.12)", color: "var(--cyan)", fontWeight: 600,
                                  }}>
                                    {ins?.title || insId}
                                  </span>
                                );
                              })}
                            </div>
                          </div>

                          <div style={{ display: "flex", gap: 12, marginTop: 10, fontSize: 11, color: "var(--text3)" }}>
                            <span>Started: {fmtDate(exp.startedAt)}</span>
                            <span>Updated: {fmtDate(exp.updatedAt)}</span>
                            {exp.submittedAt && <span>Submitted: {fmtDate(exp.submittedAt)}</span>}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* By Case Tab */}
      {tab === "bycase" && (
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {CASES.map((c) => {
              const count = enriched.filter(e => e.caseId === c.id).length;
              const active = selectedCase === c.id;
              return (
                <button key={c.id} onClick={() => setSelectedCase(c.id)} style={{
                  padding: "10px 16px", borderRadius: 10, border: "none", cursor: "pointer",
                  background: active ? c.color + "18" : "var(--surface2)",
                  color: active ? c.color : "var(--text3)",
                  fontWeight: active ? 700 : 500, fontSize: 13, transition: "all 0.2s",
                }}>
                  {c.emoji} {c.title} ({count})
                </button>
              );
            })}
          </div>

          {enriched.filter(e => e.caseId === selectedCase).length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-text">No explorations for this case yet.</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {enriched.filter(e => e.caseId === selectedCase).map((exp) => (
                <div key={exp.id} className="card" style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{exp.studentName}</span>
                      <span style={{ fontSize: 11, color: "var(--text3)", marginLeft: 10 }}>{phaseLabel(exp.currentPhase)}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 11, color: "var(--text3)" }}>
                        {(exp.discoveredInsights?.length || 0)} insights
                      </span>
                      {exp.computedScore && (
                        <span style={{ fontSize: 13, fontWeight: 700, color: scoreColor(exp.computedScore.total) }}>
                          {exp.computedScore.total}
                        </span>
                      )}
                      <span style={{
                        fontSize: 10, padding: "2px 8px", borderRadius: 4, fontWeight: 600,
                        background: exp.status === "submitted" ? "rgba(16,185,129,0.12)" : "rgba(245,166,35,0.12)",
                        color: exp.status === "submitted" ? "var(--green)" : "var(--amber)",
                      }}>
                        {exp.status === "submitted" ? "Submitted" : "Active"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Export Tab */}
      {tab === "export" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { label: "All Explorations", desc: "Student names, cases, phases, insights, scores", fn: exportAll },
            { label: "Score Breakdown", desc: "Detailed scoring per component for submitted explorations", fn: exportScores },
            { label: "Engineer Reports", desc: "Student-written findings and summaries", fn: exportReports },
          ].map((opt) => (
            <div key={opt.label} className="card" style={{ padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{opt.label}</div>
                <div style={{ fontSize: 12, color: "var(--text3)" }}>{opt.desc}</div>
              </div>
              <button
                onClick={opt.fn}
                style={{
                  padding: "8px 18px", borderRadius: 8, border: "none",
                  background: "var(--cyan)", color: "#000", fontWeight: 700, fontSize: 12,
                  cursor: "pointer",
                }}
              >
                Download CSV
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
    </main>
  );
}
