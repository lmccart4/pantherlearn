// src/pages/ChatbotDashboard.jsx
// Teacher dashboard for the Chatbot Workshop.
// Shows student bot progress, conversation logs, reflections, and export tools.

import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { db } from "../lib/firebase";
import {
  getCourseBotProjects, getCourseBotReflections,
  getBotRatings, getConversationLogs, getArcadeStats,
} from "../lib/botStore";

const PHASE_LABELS = { 1: "Decision Tree", 2: "Keyword Match", 3: "Intent Classifier", 4: "LLM-Powered" };
const PHASE_COLORS = { 1: "var(--cyan)", 2: "var(--amber)", 3: "var(--purple)", 4: "var(--green, #34d399)" };

const TABS = [
  { key: "overview", label: "Overview", icon: "📊" },
  { key: "logs", label: "Conversation Logs", icon: "💬" },
  { key: "reflections", label: "Reflections", icon: "💭" },
  { key: "export", label: "Export", icon: "📥" },
];

export default function ChatbotDashboard() {
  const { courseId } = useParams();
  const { user, userRole } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState("overview");
  const [bots, setBots] = useState([]);
  const [reflections, setReflections] = useState([]);
  const [arcadeStats, setArcadeStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState("name");
  const [expandedBot, setExpandedBot] = useState(null);

  // Logs tab state
  const [selectedBotId, setSelectedBotId] = useState(null);
  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [expandedLog, setExpandedLog] = useState(null);
  const [logPhaseFilter, setLogPhaseFilter] = useState(0); // 0 = all

  // Reflections tab state
  const [reflPhaseFilter, setReflPhaseFilter] = useState(0);
  const [expandedRefl, setExpandedRefl] = useState(null);

  // Ratings cache (botId → ratings array)
  const [ratingsCache, setRatingsCache] = useState({});

  const isTeacher = userRole === "teacher";

  // Load overview data
  useEffect(() => {
    if (!courseId || !isTeacher) return;
    loadData();
  }, [courseId, isTeacher]);

  async function loadData() {
    setLoading(true);
    try {
      const [botsData, statsData] = await Promise.all([
        getCourseBotProjects(db, courseId),
        getArcadeStats(db, courseId),
      ]);
      setBots(botsData);
      setArcadeStats(statsData);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    }
    setLoading(false);
  }

  // Lazy-load reflections when tab switches
  useEffect(() => {
    if (tab === "reflections" && reflections.length === 0 && courseId) {
      getCourseBotReflections(db, courseId).then(setReflections).catch(console.error);
    }
  }, [tab, courseId]);

  // Lazy-load conversation logs when a bot is selected
  useEffect(() => {
    if (!selectedBotId) return;
    setLogsLoading(true);
    setLogs([]);
    setExpandedLog(null);
    getConversationLogs(db, selectedBotId)
      .then(setLogs)
      .catch(console.error)
      .finally(() => setLogsLoading(false));
  }, [selectedBotId]);

  // Load ratings for expanded bot
  async function loadRatingsForBot(botId) {
    if (ratingsCache[botId]) return;
    try {
      const ratings = await getBotRatings(db, botId);
      setRatingsCache(prev => ({ ...prev, [botId]: ratings }));
    } catch (err) {
      console.error("Error loading ratings:", err);
    }
  }

  // ─── Computed Stats ──────────────────────────────────────────────────────────

  const stats = useMemo(() => {
    const total = bots.length;
    const published = bots.filter(b => b.published).length;
    const avgPhase = total ? (bots.reduce((s, b) => s + (b.currentPhase || 1), 0) / total).toFixed(1) : "—";
    const totalTests = bots.reduce((s, b) => s + (b.testCount || 0), 0);
    const totalStumps = bots.reduce((s, b) => s + (b.stumpCount || 0), 0);
    return { total, published, avgPhase, totalTests, totalStumps };
  }, [bots]);

  // ─── Sorted bots ────────────────────────────────────────────────────────────

  const sortedBots = useMemo(() => {
    const sorted = [...bots];
    switch (sortKey) {
      case "name": sorted.sort((a, b) => (a.ownerName || "").localeCompare(b.ownerName || "")); break;
      case "phase": sorted.sort((a, b) => (b.currentPhase || 1) - (a.currentPhase || 1)); break;
      case "tests": sorted.sort((a, b) => (b.testCount || 0) - (a.testCount || 0)); break;
      case "stumps": sorted.sort((a, b) => (b.stumpCount || 0) - (a.stumpCount || 0)); break;
      default: break;
    }
    return sorted;
  }, [bots, sortKey]);

  // ─── Filtered logs ──────────────────────────────────────────────────────────

  const filteredLogs = useMemo(() => {
    if (logPhaseFilter === 0) return logs;
    return logs.filter(l => l.phase === logPhaseFilter);
  }, [logs, logPhaseFilter]);

  // ─── Filtered reflections ───────────────────────────────────────────────────

  const filteredReflections = useMemo(() => {
    if (reflPhaseFilter === 0) return reflections;
    return reflections.filter(r => r.phase === reflPhaseFilter);
  }, [reflections, reflPhaseFilter]);

  // ─── Export helpers ─────────────────────────────────────────────────────────

  function downloadCSV(filename, headers, rows) {
    const escape = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [headers.join(","), ...rows.map(r => r.map(escape).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportBotData() {
    const headers = ["Student", "Bot Name", "Avatar", "Phase", "Published", "Tests", "Stumps", "Description"];
    const rows = bots.map(b => [
      b.ownerName || "Anonymous", b.botName || "Untitled", b.botAvatar || "🤖",
      b.currentPhase || 1, b.published ? "Yes" : "No",
      b.testCount || 0, b.stumpCount || 0, b.botDescription || "",
    ]);
    downloadCSV("chatbot-workshop-bots.csv", headers, rows);
  }

  function exportReflections() {
    const headers = ["Student", "Phase", "Phase Name", "Response", "Valid", "Skipped", "Date"];
    const rows = reflections.map(r => [
      r.studentName || "Anonymous", r.phase, PHASE_LABELS[r.phase] || "",
      r.response || "", r.valid ? "Yes" : "No", r.skipped ? "Yes" : "No",
      r.savedAt?.toDate ? r.savedAt.toDate().toLocaleDateString() : "",
    ]);
    downloadCSV("chatbot-workshop-reflections.csv", headers, rows);
  }

  async function exportConversationLogs() {
    // Gather all conversation logs across all bots
    const allLogs = [];
    for (const bot of bots) {
      try {
        const botLogs = await getConversationLogs(db, bot.id);
        for (const log of botLogs) {
          const transcript = (log.messages || []).map(m => `${m.role}: ${m.content}`).join(" | ");
          allLogs.push([
            bot.ownerName || "Anonymous", bot.botName || "Untitled", log.testerName || "Anonymous",
            log.phase || "", (log.messages || []).length, transcript,
            log.createdAt?.toDate ? log.createdAt.toDate().toLocaleDateString() : "",
          ]);
        }
      } catch (_) { /* skip failed bot */ }
    }
    const headers = ["Bot Owner", "Bot Name", "Tester", "Phase", "Messages", "Transcript", "Date"];
    downloadCSV("chatbot-workshop-logs.csv", headers, allLogs);
  }

  // ─── Access guard ───────────────────────────────────────────────────────────

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
        .cbd-stat-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin-bottom: 28px; }
        .cbd-stat-card {
          background: var(--surface); border: 1px solid var(--border, rgba(255,255,255,0.08));
          border-radius: 14px; padding: 18px 16px; text-align: center;
        }
        .cbd-stat-val { font-family: var(--font-display); font-size: 28px; font-weight: 800; color: var(--text); }
        .cbd-stat-label { font-size: 11px; font-weight: 600; color: var(--text3); text-transform: uppercase; margin-top: 4px; }
        .cbd-tabs { display: flex; gap: 0; margin-bottom: 24px; border-bottom: 1px solid var(--border, rgba(255,255,255,0.08)); }
        .cbd-tab {
          padding: 10px 20px; font-size: 13px; font-weight: 600; color: var(--text3);
          border: none; background: none; cursor: pointer; border-bottom: 2px solid transparent;
          transition: all 0.15s; display: flex; align-items: center; gap: 6px;
        }
        .cbd-tab:hover { color: var(--text); }
        .cbd-tab.active { color: var(--amber); border-bottom-color: var(--amber); }
        .cbd-table { width: 100%; border-collapse: collapse; }
        .cbd-table th {
          text-align: left; padding: 10px 14px; font-size: 11px; font-weight: 700;
          color: var(--text3); text-transform: uppercase; letter-spacing: 0.5px;
          border-bottom: 2px solid var(--border, rgba(255,255,255,0.08));
          cursor: pointer; user-select: none;
        }
        .cbd-table th:hover { color: var(--amber); }
        .cbd-table td { padding: 12px 14px; font-size: 14px; color: var(--text); border-bottom: 1px solid var(--border, rgba(255,255,255,0.05)); }
        .cbd-table tr:hover td { background: rgba(255,255,255,0.02); }
        .cbd-phase-badge {
          display: inline-block; font-size: 11px; font-weight: 600;
          padding: 2px 10px; border-radius: 6px;
        }
        .cbd-expand-row td { padding: 16px 20px; background: var(--surface); }
        .cbd-log-card {
          background: var(--surface); border: 1px solid var(--border, rgba(255,255,255,0.08));
          border-radius: 12px; padding: 14px 18px; margin-bottom: 10px; cursor: pointer;
          transition: border-color 0.15s;
        }
        .cbd-log-card:hover { border-color: var(--amber); }
        .cbd-transcript { padding: 16px; background: var(--bg); border-radius: 10px; margin-top: 10px; }
        .cbd-msg { display: flex; gap: 8px; margin-bottom: 8px; }
        .cbd-msg.user { flex-direction: row-reverse; }
        .cbd-msg-bubble {
          max-width: 75%; padding: 8px 12px; border-radius: 12px; font-size: 13px; line-height: 1.5;
        }
        .cbd-msg.bot .cbd-msg-bubble { background: var(--surface); color: var(--text); border-bottom-left-radius: 4px; }
        .cbd-msg.user .cbd-msg-bubble { background: var(--amber)22; color: var(--text); border-bottom-right-radius: 4px; }
        .cbd-export-card {
          background: var(--surface); border: 1px solid var(--border, rgba(255,255,255,0.08));
          border-radius: 14px; padding: 24px; margin-bottom: 16px;
          display: flex; align-items: center; gap: 20px;
        }
        .cbd-export-btn {
          padding: 10px 24px; border-radius: 10px; font-size: 14px; font-weight: 700;
          border: none; cursor: pointer; transition: all 0.15s; flex-shrink: 0;
          background: var(--amber); color: #1a1a1a;
        }
        .cbd-export-btn:hover { opacity: 0.85; transform: translateY(-1px); }
        .cbd-filter-row { display: flex; gap: 8px; margin-bottom: 16px; align-items: center; }
        .cbd-filter-btn {
          padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 600;
          border: 1px solid var(--border, rgba(255,255,255,0.12));
          background: transparent; color: var(--text3); cursor: pointer; transition: all 0.15s;
        }
        .cbd-filter-btn.active { background: var(--amber)22; border-color: var(--amber); color: var(--amber); }
        .cbd-refl-card {
          background: var(--surface); border: 1px solid var(--border, rgba(255,255,255,0.08));
          border-radius: 12px; padding: 14px 18px; margin-bottom: 10px; cursor: pointer;
          transition: border-color 0.15s;
        }
        .cbd-refl-card:hover { border-color: var(--amber); }
        @media (max-width: 800px) {
          .cbd-stat-grid { grid-template-columns: repeat(2, 1fr); }
          .cbd-tabs { overflow-x: auto; }
        }
      `}</style>

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "none", border: "none", color: "var(--text3)",
              fontSize: 13, cursor: "pointer", padding: 0,
            }}
          >
            ← Back
          </button>
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>
          🤖 Chatbot Workshop Dashboard
        </h1>
        <p style={{ fontSize: 14, color: "var(--text3)", marginBottom: 28 }}>
          Monitor student progress, view conversation logs, and export data.
        </p>

        {/* Stat Cards */}
        <div className="cbd-stat-grid">
          <div className="cbd-stat-card">
            <div className="cbd-stat-val">{stats.total}</div>
            <div className="cbd-stat-label">Total Bots</div>
          </div>
          <div className="cbd-stat-card">
            <div className="cbd-stat-val" style={{ color: "var(--green, #34d399)" }}>{stats.published}</div>
            <div className="cbd-stat-label">Published</div>
          </div>
          <div className="cbd-stat-card">
            <div className="cbd-stat-val" style={{ color: "var(--purple, #a78bfa)" }}>{stats.avgPhase}</div>
            <div className="cbd-stat-label">Avg Phase</div>
          </div>
          <div className="cbd-stat-card">
            <div className="cbd-stat-val" style={{ color: "var(--cyan)" }}>{stats.totalTests}</div>
            <div className="cbd-stat-label">Total Tests</div>
          </div>
          <div className="cbd-stat-card">
            <div className="cbd-stat-val" style={{ color: "var(--amber)" }}>{stats.totalStumps}</div>
            <div className="cbd-stat-label">Total Stumps</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="cbd-tabs">
          {TABS.map(t => (
            <button
              key={t.key}
              className={`cbd-tab ${tab === t.key ? "active" : ""}`}
              onClick={() => setTab(t.key)}
            >
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {tab === "overview" && renderOverview()}
        {tab === "logs" && renderLogs()}
        {tab === "reflections" && renderReflections()}
        {tab === "export" && renderExport()}
      </div>
    </main>
  );

  // ─── Overview Tab ───────────────────────────────────────────────────────────

  function renderOverview() {
    if (bots.length === 0) {
      return (
        <div style={{ textAlign: "center", padding: 60, color: "var(--text3)" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>No bots created yet</div>
          <div style={{ fontSize: 13, marginTop: 6 }}>Students will appear here once they start building chatbots.</div>
        </div>
      );
    }

    return (
      <>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 12, color: "var(--text3)", alignSelf: "center", marginRight: 4 }}>Sort:</span>
          {[["name", "Name"], ["phase", "Phase"], ["tests", "Tests"], ["stumps", "Stumps"]].map(([key, label]) => (
            <button
              key={key}
              className={`cbd-filter-btn ${sortKey === key ? "active" : ""}`}
              onClick={() => setSortKey(key)}
            >
              {label}
            </button>
          ))}
        </div>

        <table className="cbd-table">
          <thead>
            <tr>
              <th onClick={() => setSortKey("name")}>Student</th>
              <th>Bot Name</th>
              <th onClick={() => setSortKey("phase")}>Phase</th>
              <th>Published</th>
              <th onClick={() => setSortKey("tests")}>Tests</th>
              <th onClick={() => setSortKey("stumps")}>Stumps</th>
            </tr>
          </thead>
          <tbody>
            {sortedBots.map(bot => (
              <>
                <tr
                  key={bot.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    const next = expandedBot === bot.id ? null : bot.id;
                    setExpandedBot(next);
                    if (next) loadRatingsForBot(bot.id);
                  }}
                >
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 20 }}>{bot.botAvatar || "🤖"}</span>
                      <div>
                        <div style={{ fontWeight: 600 }}>{bot.ownerName || "Anonymous"}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontWeight: 500 }}>{bot.botName || "Untitled"}</td>
                  <td>
                    <span
                      className="cbd-phase-badge"
                      style={{
                        background: `${PHASE_COLORS[bot.currentPhase || 1]}18`,
                        color: PHASE_COLORS[bot.currentPhase || 1],
                      }}
                    >
                      {bot.currentPhase || 1}: {PHASE_LABELS[bot.currentPhase || 1]}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: bot.published ? "var(--green, #34d399)" : "var(--text3)", fontWeight: 600 }}>
                      {bot.published ? "✓ Yes" : "—"}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{bot.testCount || 0}</td>
                  <td style={{ fontWeight: 600, color: (bot.stumpCount || 0) > 0 ? "var(--amber)" : "var(--text3)" }}>
                    {bot.stumpCount || 0}
                  </td>
                </tr>
                {expandedBot === bot.id && (
                  <tr key={`${bot.id}-expand`} className="cbd-expand-row">
                    <td colSpan={6}>
                      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                        <div style={{ flex: 1, minWidth: 200 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text3)", marginBottom: 8, textTransform: "uppercase" }}>Description</div>
                          <div style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.6 }}>
                            {bot.botDescription || "No description provided."}
                          </div>
                        </div>
                        <div style={{ minWidth: 200 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text3)", marginBottom: 8, textTransform: "uppercase" }}>Ratings</div>
                          {ratingsCache[bot.id]?.length > 0 ? (
                            <div>
                              <div style={{ fontSize: 14 }}>
                                Understanding: <strong>{(ratingsCache[bot.id].reduce((s, r) => s + (r.understanding || 0), 0) / ratingsCache[bot.id].length).toFixed(1)}</strong>/5
                              </div>
                              <div style={{ fontSize: 14 }}>
                                Helpfulness: <strong>{(ratingsCache[bot.id].reduce((s, r) => s + (r.helpfulness || 0), 0) / ratingsCache[bot.id].length).toFixed(1)}</strong>/5
                              </div>
                              <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 4 }}>
                                {ratingsCache[bot.id].length} rating{ratingsCache[bot.id].length !== 1 ? "s" : ""}
                              </div>
                            </div>
                          ) : (
                            <div style={{ fontSize: 13, color: "var(--text3)" }}>No ratings yet</div>
                          )}
                        </div>
                        <div style={{ minWidth: 150 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text3)", marginBottom: 8, textTransform: "uppercase" }}>Details</div>
                          <div style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.8 }}>
                            Created: {bot.createdAt?.toDate ? bot.createdAt.toDate().toLocaleDateString() : "—"}<br />
                            Updated: {bot.updatedAt?.toDate ? bot.updatedAt.toDate().toLocaleDateString() : "—"}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </>
    );
  }

  // ─── Logs Tab ───────────────────────────────────────────────────────────────

  function renderLogs() {
    return (
      <>
        {/* Bot selector */}
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text3)" }}>Select Bot:</label>
          <select
            value={selectedBotId || ""}
            onChange={e => setSelectedBotId(e.target.value || null)}
            style={{
              background: "var(--surface)", border: "1px solid var(--border, rgba(255,255,255,0.12))",
              borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "var(--text)",
              fontFamily: "var(--font-body)", minWidth: 250,
            }}
          >
            <option value="">Choose a bot...</option>
            {bots.map(b => (
              <option key={b.id} value={b.id}>
                {b.botAvatar} {b.botName || "Untitled"} — {b.ownerName || "Anonymous"}
              </option>
            ))}
          </select>

          {selectedBotId && (
            <div className="cbd-filter-row" style={{ marginBottom: 0 }}>
              <button className={`cbd-filter-btn ${logPhaseFilter === 0 ? "active" : ""}`} onClick={() => setLogPhaseFilter(0)}>All</button>
              {[1, 2, 3, 4].map(p => (
                <button key={p} className={`cbd-filter-btn ${logPhaseFilter === p ? "active" : ""}`} onClick={() => setLogPhaseFilter(p)}>
                  P{p}
                </button>
              ))}
            </div>
          )}
        </div>

        {!selectedBotId && (
          <div style={{ textAlign: "center", padding: 40, color: "var(--text3)" }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>💬</div>
            <div style={{ fontSize: 14 }}>Select a bot above to view its conversation logs.</div>
          </div>
        )}

        {selectedBotId && logsLoading && (
          <div style={{ display: "flex", justifyContent: "center", padding: 40 }}><div className="spinner" /></div>
        )}

        {selectedBotId && !logsLoading && filteredLogs.length === 0 && (
          <div style={{ textAlign: "center", padding: 40, color: "var(--text3)" }}>
            <div style={{ fontSize: 14 }}>No conversation logs found{logPhaseFilter ? ` for Phase ${logPhaseFilter}` : ""}.</div>
          </div>
        )}

        {selectedBotId && !logsLoading && filteredLogs.map((log, i) => (
          <div key={log.id || i} className="cbd-log-card" onClick={() => setExpandedLog(expandedLog === i ? null : i)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontWeight: 600 }}>{log.testerName || "Anonymous"}</span>
                <span style={{ fontSize: 12, color: "var(--text3)", marginLeft: 10 }}>
                  Phase {log.phase} · {(log.messages || []).length} messages
                </span>
              </div>
              <div style={{ fontSize: 12, color: "var(--text3)" }}>
                {log.createdAt?.toDate ? log.createdAt.toDate().toLocaleDateString() : ""}
              </div>
            </div>

            {expandedLog === i && (
              <div className="cbd-transcript">
                {(log.messages || []).map((msg, j) => (
                  <div key={j} className={`cbd-msg ${msg.role}`}>
                    <div className="cbd-msg-bubble">{msg.content}</div>
                  </div>
                ))}
                {(log.messages || []).length === 0 && (
                  <div style={{ fontSize: 13, color: "var(--text3)", textAlign: "center" }}>Empty conversation</div>
                )}
              </div>
            )}
          </div>
        ))}
      </>
    );
  }

  // ─── Reflections Tab ────────────────────────────────────────────────────────

  function renderReflections() {
    // Summary stats
    const reflectionsByPhase = { 1: 0, 2: 0, 3: 0, 4: 0 };
    const validByPhase = { 1: 0, 2: 0, 3: 0, 4: 0 };
    reflections.forEach(r => {
      reflectionsByPhase[r.phase] = (reflectionsByPhase[r.phase] || 0) + 1;
      if (r.valid) validByPhase[r.phase] = (validByPhase[r.phase] || 0) + 1;
    });

    return (
      <>
        {/* Summary row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
          {[1, 2, 3, 4].map(p => (
            <div key={p} style={{
              background: "var(--surface)", borderRadius: 12, padding: "14px 16px",
              border: "1px solid var(--border, rgba(255,255,255,0.08))", textAlign: "center",
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: PHASE_COLORS[p], marginBottom: 4 }}>
                Phase {p}
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "var(--text)" }}>{validByPhase[p]}</div>
              <div style={{ fontSize: 11, color: "var(--text3)" }}>
                of {reflectionsByPhase[p]} submitted
              </div>
            </div>
          ))}
        </div>

        {/* Phase filter */}
        <div className="cbd-filter-row">
          <span style={{ fontSize: 12, color: "var(--text3)" }}>Filter:</span>
          <button className={`cbd-filter-btn ${reflPhaseFilter === 0 ? "active" : ""}`} onClick={() => setReflPhaseFilter(0)}>All</button>
          {[1, 2, 3, 4].map(p => (
            <button key={p} className={`cbd-filter-btn ${reflPhaseFilter === p ? "active" : ""}`} onClick={() => setReflPhaseFilter(p)}>
              Phase {p}
            </button>
          ))}
        </div>

        {filteredReflections.length === 0 && (
          <div style={{ textAlign: "center", padding: 40, color: "var(--text3)" }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>💭</div>
            <div style={{ fontSize: 14 }}>No reflections submitted yet{reflPhaseFilter ? ` for Phase ${reflPhaseFilter}` : ""}.</div>
          </div>
        )}

        {filteredReflections.map((r, i) => (
          <div key={r.id || i} className="cbd-refl-card" onClick={() => setExpandedRefl(expandedRefl === i ? null : i)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontWeight: 600 }}>{r.studentName || "Anonymous"}</span>
                <span
                  className="cbd-phase-badge"
                  style={{ background: `${PHASE_COLORS[r.phase]}18`, color: PHASE_COLORS[r.phase] }}
                >
                  Phase {r.phase}
                </span>
                {r.skipped && (
                  <span style={{ fontSize: 11, color: "var(--red, #ef4444)", fontWeight: 600 }}>Skipped</span>
                )}
                {r.valid && !r.skipped && (
                  <span style={{ fontSize: 11, color: "var(--green, #10b981)", fontWeight: 600 }}>✓ Valid</span>
                )}
              </div>
              <div style={{ fontSize: 12, color: "var(--text3)" }}>
                {r.savedAt?.toDate ? r.savedAt.toDate().toLocaleDateString() : ""}
              </div>
            </div>

            {expandedRefl !== i && !r.skipped && (
              <div style={{ fontSize: 13, color: "var(--text3)", marginTop: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {r.response?.substring(0, 100)}{r.response?.length > 100 ? "..." : ""}
              </div>
            )}

            {expandedRefl === i && (
              <div style={{
                marginTop: 10, padding: 14, borderRadius: 10,
                background: "var(--bg)", fontSize: 14, lineHeight: 1.6, color: "var(--text)",
              }}>
                {r.response || "(no response)"}
              </div>
            )}
          </div>
        ))}
      </>
    );
  }

  // ─── Export Tab ──────────────────────────────────────────────────────────────

  function renderExport() {
    return (
      <>
        <div className="cbd-export-card">
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>📊 Bot Data</div>
            <div style={{ fontSize: 13, color: "var(--text3)" }}>
              Export all students' bot metadata: name, phase, published status, test/stump counts.
            </div>
          </div>
          <button className="cbd-export-btn" onClick={exportBotData}>Download CSV</button>
        </div>

        <div className="cbd-export-card">
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>💭 Reflections</div>
            <div style={{ fontSize: 13, color: "var(--text3)" }}>
              Export all phase reflections with student names, responses, and validation status.
            </div>
          </div>
          <button className="cbd-export-btn" onClick={exportReflections}>Download CSV</button>
        </div>

        <div className="cbd-export-card">
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>💬 Conversation Logs</div>
            <div style={{ fontSize: 13, color: "var(--text3)" }}>
              Export all conversation transcripts from bot testing sessions. This may take a moment for large classes.
            </div>
          </div>
          <button className="cbd-export-btn" onClick={exportConversationLogs}>Download CSV</button>
        </div>
      </>
    );
  }
}
