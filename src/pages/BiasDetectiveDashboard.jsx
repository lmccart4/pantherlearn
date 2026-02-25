// src/pages/BiasDetectiveDashboard.jsx
// Teacher dashboard for the AI Bias Detective activity.
// Shows student investigation progress, case breakdowns, and export tools.

import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { db } from "../lib/firebase";
import { getCourseInvestigations, calculateScore } from "../lib/biasStore";
import { CASES, DIFFICULTY_COLORS, PHASES } from "../lib/biasCases";

const TABS = [
  { key: "overview", label: "Overview", icon: "📊" },
  { key: "bycase", label: "By Case", icon: "🗂️" },
  { key: "export", label: "Export", icon: "📥" },
];

function phaseLabel(phaseId) {
  const p = PHASES.find(ph => ph.id === phaseId);
  return p ? p.label : phaseId || "—";
}

function scoreColor(total) {
  if (total >= 70) return "var(--green, #10b981)";
  if (total >= 40) return "var(--amber, #f5a623)";
  return "var(--red, #ef4444)";
}

function fmtDate(ts) {
  if (!ts) return "—";
  if (ts.toDate) return ts.toDate().toLocaleDateString();
  if (ts instanceof Date) return ts.toLocaleDateString();
  return "—";
}

export default function BiasDetectiveDashboard() {
  const { courseId } = useParams();
  const { userRole } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState("overview");
  const [investigations, setInvestigations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState("name");
  const [expandedRow, setExpandedRow] = useState(null);
  const [selectedCase, setSelectedCase] = useState(CASES[0]?.id || null);

  const isTeacher = userRole === "teacher";

  useEffect(() => {
    if (!courseId || !isTeacher) return;
    setLoading(true);
    getCourseInvestigations(db, courseId)
      .then(setInvestigations)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [courseId, isTeacher]);

  // Enrich investigations with computed score when needed
  const enriched = useMemo(() => investigations.map(inv => {
    const caseData = CASES.find(c => c.id === inv.caseId);
    let score = inv.score;
    if (!score && inv.status === "submitted" && caseData) {
      score = calculateScore(inv, caseData);
    }
    return { ...inv, caseData, computedScore: score };
  }), [investigations]);

  // Stats
  const stats = useMemo(() => {
    const total = enriched.length;
    const submitted = enriched.filter(i => i.status === "submitted").length;
    const scored = enriched.filter(i => i.computedScore);
    const avgScore = scored.length ? (scored.reduce((s, i) => s + i.computedScore.total, 0) / scored.length).toFixed(1) : "—";
    const avgClues = total ? (enriched.reduce((s, i) => s + (i.discoveredClues?.length || 0), 0) / total).toFixed(1) : "—";
    const active = total - submitted;
    return { total, submitted, avgScore, avgClues, active };
  }, [enriched]);

  // Sorted investigations
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
    const headers = ["Student", "Case", "Phase", "Status", "Clues", "Score", "Started", "Submitted"];
    const rows = enriched.map(i => [
      i.studentName || "Anonymous", i.caseData?.title || i.caseId, phaseLabel(i.currentPhase),
      i.status, i.discoveredClues?.length || 0, i.computedScore?.total ?? "",
      fmtDate(i.startedAt), fmtDate(i.submittedAt),
    ]);
    downloadCSV("bias-detective-investigations.csv", headers, rows);
  }

  function exportScores() {
    const headers = ["Student", "Case", "Clues Found", "Analysis Accuracy", "Bias ID", "Evidence Quality", "Mitigations", "Total"];
    const rows = enriched.filter(i => i.computedScore).map(i => [
      i.studentName || "Anonymous", i.caseData?.title || i.caseId,
      i.computedScore.cluesFound, i.computedScore.analysisAccuracy ?? "",
      i.computedScore.biasIdentification,
      i.computedScore.evidenceQuality, i.computedScore.mitigations, i.computedScore.total,
    ]);
    downloadCSV("bias-detective-scores.csv", headers, rows);
  }

  function exportReports() {
    const headers = ["Student", "Case", "Identified Biases", "Mitigations", "Summary"];
    const rows = enriched.filter(i => i.biasReport).map(i => [
      i.studentName || "Anonymous", i.caseData?.title || i.caseId,
      (i.biasReport.identifiedBiases || []).join("; "),
      (i.biasReport.mitigations || []).join("; "),
      i.biasReport.summary || "",
    ]);
    downloadCSV("bias-detective-reports.csv", headers, rows);
  }

  // Access guard
  if (!isTeacher) {
    return (
      <main className="page-container" style={{ padding: "48px 40px" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center", color: "var(--text3)" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
          <div style={{ fontSize: 18, fontWeight: 600 }}>Teacher access only</div>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="page-container" style={{ padding: "48px 40px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
          <div className="spinner" />
        </div>
      </main>
    );
  }

  return (
    <main className="page-container" style={{ padding: "48px 40px" }}>
      <style>{`
        .bdd-stat-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin-bottom: 28px; }
        .bdd-stat-card {
          background: var(--surface); border: 1px solid var(--border, rgba(255,255,255,0.08));
          border-radius: 14px; padding: 18px 16px; text-align: center;
        }
        .bdd-stat-val { font-family: var(--font-display); font-size: 28px; font-weight: 800; color: var(--text); }
        .bdd-stat-label { font-size: 11px; font-weight: 600; color: var(--text3); text-transform: uppercase; margin-top: 4px; }
        .bdd-tabs { display: flex; gap: 0; margin-bottom: 24px; border-bottom: 1px solid var(--border, rgba(255,255,255,0.08)); }
        .bdd-tab {
          padding: 10px 20px; font-size: 13px; font-weight: 600; color: var(--text3);
          border: none; background: none; cursor: pointer; border-bottom: 2px solid transparent;
          transition: all 0.15s; display: flex; align-items: center; gap: 6px;
        }
        .bdd-tab:hover { color: var(--text); }
        .bdd-tab.active { color: var(--cyan); border-bottom-color: var(--cyan); }
        .bdd-table { width: 100%; border-collapse: collapse; }
        .bdd-table th {
          text-align: left; padding: 10px 14px; font-size: 11px; font-weight: 700;
          color: var(--text3); text-transform: uppercase; letter-spacing: 0.5px;
          border-bottom: 2px solid var(--border, rgba(255,255,255,0.08));
          cursor: pointer; user-select: none;
        }
        .bdd-table th:hover { color: var(--cyan); }
        .bdd-table td { padding: 12px 14px; font-size: 14px; color: var(--text); border-bottom: 1px solid var(--border, rgba(255,255,255,0.05)); }
        .bdd-table tr:hover td { background: rgba(255,255,255,0.02); }
        .bdd-badge {
          display: inline-block; font-size: 11px; font-weight: 600;
          padding: 2px 10px; border-radius: 6px;
        }
        .bdd-expand-row td { padding: 16px 20px; background: var(--surface); }
        .bdd-filter-row { display: flex; gap: 8px; margin-bottom: 16px; align-items: center; }
        .bdd-filter-btn {
          padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 600;
          border: 1px solid var(--border, rgba(255,255,255,0.12));
          background: transparent; color: var(--text3); cursor: pointer; transition: all 0.15s;
        }
        .bdd-filter-btn.active { background: var(--cyan)22; border-color: var(--cyan); color: var(--cyan); }
        .bdd-case-card {
          background: var(--surface); border: 2px solid var(--border, rgba(255,255,255,0.08));
          border-radius: 14px; padding: 16px; cursor: pointer; transition: all 0.15s; text-align: center;
        }
        .bdd-case-card:hover { border-color: var(--text3); }
        .bdd-case-card.active { border-color: currentColor; }
        .bdd-export-card {
          background: var(--surface); border: 1px solid var(--border, rgba(255,255,255,0.08));
          border-radius: 14px; padding: 24px; margin-bottom: 16px;
          display: flex; align-items: center; gap: 20px;
        }
        .bdd-export-btn {
          padding: 10px 24px; border-radius: 10px; font-size: 14px; font-weight: 700;
          border: none; cursor: pointer; transition: all 0.15s; flex-shrink: 0;
          background: var(--cyan); color: #1a1a1a;
        }
        .bdd-export-btn:hover { opacity: 0.85; transform: translateY(-1px); }
        .bdd-bar { height: 8px; border-radius: 4px; background: var(--border, rgba(255,255,255,0.08)); overflow: hidden; }
        .bdd-bar-fill { height: 100%; border-radius: 4px; transition: width 0.3s; }
        @media (max-width: 800px) {
          .bdd-stat-grid { grid-template-columns: repeat(2, 1fr); }
          .bdd-tabs { overflow-x: auto; }
        }
      `}</style>

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
          <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "var(--text3)", fontSize: 13, cursor: "pointer", padding: 0 }}>
            ← Back
          </button>
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>
          🔍 AI Bias Detective Dashboard
        </h1>
        <p style={{ fontSize: 14, color: "var(--text3)", marginBottom: 28 }}>
          Monitor student investigations, review bias reports, and export data.
        </p>

        {/* Stat Cards */}
        <div className="bdd-stat-grid">
          <div className="bdd-stat-card"><div className="bdd-stat-val">{stats.total}</div><div className="bdd-stat-label">Total Investigations</div></div>
          <div className="bdd-stat-card"><div className="bdd-stat-val" style={{ color: "var(--green, #10b981)" }}>{stats.submitted}</div><div className="bdd-stat-label">Submitted</div></div>
          <div className="bdd-stat-card"><div className="bdd-stat-val" style={{ color: "var(--purple, #a78bfa)" }}>{stats.avgScore}</div><div className="bdd-stat-label">Avg Score</div></div>
          <div className="bdd-stat-card"><div className="bdd-stat-val" style={{ color: "var(--cyan)" }}>{stats.avgClues}</div><div className="bdd-stat-label">Avg Clues Found</div></div>
          <div className="bdd-stat-card"><div className="bdd-stat-val" style={{ color: "var(--amber)" }}>{stats.active}</div><div className="bdd-stat-label">Active</div></div>
        </div>

        {/* Tabs */}
        <div className="bdd-tabs">
          {TABS.map(t => (
            <button key={t.key} className={`bdd-tab ${tab === t.key ? "active" : ""}`} onClick={() => setTab(t.key)}>
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        {tab === "overview" && renderOverview()}
        {tab === "bycase" && renderByCase()}
        {tab === "export" && renderExport()}
      </div>
    </main>
  );

  // ─── Overview Tab ───────────────────────────────────────────────────────────

  function renderOverview() {
    if (enriched.length === 0) {
      return (
        <div style={{ textAlign: "center", padding: 60, color: "var(--text3)" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>No investigations yet</div>
          <div style={{ fontSize: 13, marginTop: 6 }}>Students will appear here once they start an investigation.</div>
        </div>
      );
    }
    return (
      <>
        <div className="bdd-filter-row">
          <span style={{ fontSize: 12, color: "var(--text3)", marginRight: 4 }}>Sort:</span>
          {[["name", "Name"], ["case", "Case"], ["status", "Status"], ["score", "Score"]].map(([key, label]) => (
            <button key={key} className={`bdd-filter-btn ${sortKey === key ? "active" : ""}`} onClick={() => setSortKey(key)}>{label}</button>
          ))}
        </div>

        <table className="bdd-table">
          <thead><tr>
            <th onClick={() => setSortKey("name")}>Student</th>
            <th onClick={() => setSortKey("case")}>Case</th>
            <th>Phase</th>
            <th onClick={() => setSortKey("status")}>Status</th>
            <th>Clues</th>
            <th onClick={() => setSortKey("score")}>Score</th>
          </tr></thead>
          <tbody>
            {sorted.map(inv => (
              <>{/* fragment per row */}
                <tr key={inv.id} style={{ cursor: "pointer" }} onClick={() => setExpandedRow(expandedRow === inv.id ? null : inv.id)}>
                  <td style={{ fontWeight: 600 }}>{inv.studentName || "Anonymous"}</td>
                  <td>
                    {inv.caseData && (
                      <span className="bdd-badge" style={{ background: `${inv.caseData.color}18`, color: inv.caseData.color }}>
                        {inv.caseData.emoji} {inv.caseData.title}
                      </span>
                    )}
                  </td>
                  <td><span className="bdd-badge" style={{ background: "var(--cyan)18", color: "var(--cyan)" }}>{phaseLabel(inv.currentPhase)}</span></td>
                  <td>
                    <span style={{ fontWeight: 600, color: inv.status === "submitted" ? "var(--green, #10b981)" : "var(--amber)" }}>
                      {inv.status === "submitted" ? "Submitted" : "Active"}
                    </span>
                  </td>
                  <td>{inv.discoveredClues?.length || 0}</td>
                  <td style={{ fontWeight: 700, color: inv.computedScore ? scoreColor(inv.computedScore.total) : "var(--text3)" }}>
                    {inv.computedScore ? inv.computedScore.total : "—"}
                  </td>
                </tr>
                {expandedRow === inv.id && (
                  <tr key={`${inv.id}-exp`} className="bdd-expand-row"><td colSpan={6}>
                    <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                      {/* Bias report */}
                      <div style={{ flex: 1, minWidth: 220 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text3)", marginBottom: 8, textTransform: "uppercase" }}>Bias Report</div>
                        <div style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.6, marginBottom: 8 }}>
                          {inv.biasReport?.summary || "No report submitted yet."}
                        </div>
                        {inv.biasReport?.identifiedBiases?.length > 0 && (
                          <div style={{ marginBottom: 8 }}>
                            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text3)", marginBottom: 4 }}>Identified Biases:</div>
                            {inv.biasReport.identifiedBiases.map((b, i) => (
                              <span key={i} className="bdd-badge" style={{ background: "var(--purple, #a78bfa)18", color: "var(--purple, #a78bfa)", marginRight: 6, marginBottom: 4 }}>{b}</span>
                            ))}
                          </div>
                        )}
                        {inv.biasReport?.mitigations?.length > 0 && (
                          <div>
                            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text3)", marginBottom: 4 }}>Mitigations:</div>
                            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: "var(--text2)", lineHeight: 1.7 }}>
                              {inv.biasReport.mitigations.map((m, i) => <li key={i}>{m}</li>)}
                            </ul>
                          </div>
                        )}
                      </div>
                      {/* Score breakdown */}
                      <div style={{ minWidth: 220 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text3)", marginBottom: 8, textTransform: "uppercase" }}>Score Breakdown</div>
                        {inv.computedScore ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {(inv.computedScore.analysisAccuracy != null
                              ? [["Clues", inv.computedScore.cluesFound, 30], ["Analysis", inv.computedScore.analysisAccuracy, 15], ["Bias ID", inv.computedScore.biasIdentification, 25], ["Evidence", inv.computedScore.evidenceQuality, 10], ["Mitigations", inv.computedScore.mitigations, 20]]
                              : [["Clues", inv.computedScore.cluesFound, 40], ["Bias ID", inv.computedScore.biasIdentification, 25], ["Evidence", inv.computedScore.evidenceQuality, 15], ["Mitigations", inv.computedScore.mitigations, 20]]
                            ).map(([label, val, max]) => (
                              <div key={label}>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text3)", marginBottom: 2 }}>
                                  <span>{label}</span><span>{val}/{max}</span>
                                </div>
                                <div className="bdd-bar"><div className="bdd-bar-fill" style={{ width: `${(val / max) * 100}%`, background: "var(--cyan)" }} /></div>
                              </div>
                            ))}
                          </div>
                        ) : <div style={{ fontSize: 13, color: "var(--text3)" }}>Not yet scored</div>}
                      </div>
                      {/* Dates */}
                      <div style={{ minWidth: 140 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text3)", marginBottom: 8, textTransform: "uppercase" }}>Dates</div>
                        <div style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.8 }}>
                          Started: {fmtDate(inv.startedAt)}<br />
                          Updated: {fmtDate(inv.updatedAt)}<br />
                          Submitted: {fmtDate(inv.submittedAt)}
                        </div>
                      </div>
                    </div>
                  </td></tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </>
    );
  }

  // ─── By Case Tab ────────────────────────────────────────────────────────────

  function renderByCase() {
    const caseInvs = enriched.filter(i => i.caseId === selectedCase);
    const caseData = CASES.find(c => c.id === selectedCase);

    return (
      <>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${CASES.length}, 1fr)`, gap: 12, marginBottom: 24 }}>
          {CASES.map(c => {
            const count = enriched.filter(i => i.caseId === c.id).length;
            const isActive = selectedCase === c.id;
            return (
              <div
                key={c.id}
                className={`bdd-case-card ${isActive ? "active" : ""}`}
                style={{ color: isActive ? c.color : "var(--text3)", borderColor: isActive ? c.color : undefined }}
                onClick={() => setSelectedCase(c.id)}
              >
                <div style={{ fontSize: 28, marginBottom: 4 }}>{c.emoji}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: isActive ? c.color : "var(--text)" }}>{c.title}</div>
                <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>{count} investigation{count !== 1 ? "s" : ""}</div>
              </div>
            );
          })}
        </div>

        {caseInvs.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "var(--text3)" }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>📭</div>
            <div style={{ fontSize: 14 }}>No investigations for {caseData?.title || "this case"} yet.</div>
          </div>
        ) : (
          <table className="bdd-table">
            <thead><tr>
              <th>Student</th><th>Phase</th><th>Clues Found</th><th>Score</th><th>Status</th>
            </tr></thead>
            <tbody>
              {caseInvs.map(inv => (
                <tr key={inv.id}>
                  <td style={{ fontWeight: 600 }}>{inv.studentName || "Anonymous"}</td>
                  <td><span className="bdd-badge" style={{ background: "var(--cyan)18", color: "var(--cyan)" }}>{phaseLabel(inv.currentPhase)}</span></td>
                  <td>{inv.discoveredClues?.length || 0} / {caseData?.totalClues || "?"}</td>
                  <td style={{ fontWeight: 700, color: inv.computedScore ? scoreColor(inv.computedScore.total) : "var(--text3)" }}>
                    {inv.computedScore ? inv.computedScore.total : "—"}
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: inv.status === "submitted" ? "var(--green, #10b981)" : "var(--amber)" }}>
                      {inv.status === "submitted" ? "Submitted" : "Active"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </>
    );
  }

  // ─── Export Tab ──────────────────────────────────────────────────────────────

  function renderExport() {
    return (
      <>
        <div className="bdd-export-card">
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>📊 All Investigations</div>
            <div style={{ fontSize: 13, color: "var(--text3)" }}>
              Export all students' investigation data: case, phase, status, clues, score, and dates.
            </div>
          </div>
          <button className="bdd-export-btn" onClick={exportAll}>Download CSV</button>
        </div>

        <div className="bdd-export-card">
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>🎯 Score Breakdown</div>
            <div style={{ fontSize: 13, color: "var(--text3)" }}>
              Export detailed score breakdowns: clues found, bias identification, evidence quality, and mitigations.
            </div>
          </div>
          <button className="bdd-export-btn" onClick={exportScores}>Download CSV</button>
        </div>

        <div className="bdd-export-card">
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>📝 Bias Reports</div>
            <div style={{ fontSize: 13, color: "var(--text3)" }}>
              Export students' bias reports: identified biases, mitigations, and summaries.
            </div>
          </div>
          <button className="bdd-export-btn" onClick={exportReports}>Download CSV</button>
        </div>
      </>
    );
  }
}
