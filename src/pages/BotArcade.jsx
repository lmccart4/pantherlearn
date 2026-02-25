// src/pages/BotArcade.jsx
// Gallery page showing all published chatbots for a course.
// Students can browse, search, and click to test classmates' bots.

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { db } from "../lib/firebase";
import { subscribeToPublishedBots, getBotRatings } from "../lib/botStore";
import StumpLeaderboard from "../components/chatbot-workshop/StumpLeaderboard";

const PHASE_LABELS = {
  1: "Decision Tree",
  2: "Keyword Match",
  3: "Intent Classifier",
  4: "LLM-Powered",
};

const PHASE_COLORS = {
  1: "var(--cyan)",
  2: "var(--amber)",
  3: "var(--purple)",
  4: "var(--green, #34d399)",
};

export default function BotArcade() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [bots, setBots] = useState([]);
  const [ratings, setRatings] = useState({}); // { projectId: { avg, count } }
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // newest | rated

  // Subscribe to published bots
  useEffect(() => {
    if (!courseId) return;
    setLoading(true);
    const unsub = subscribeToPublishedBots(db, courseId, async (botList) => {
      setBots(botList);
      setLoading(false);

      // Fetch ratings for each bot
      const ratingMap = {};
      await Promise.all(botList.map(async (bot) => {
        try {
          const r = await getBotRatings(db, bot.id);
          if (r.length > 0) {
            const avgUnderstanding = r.reduce((s, x) => s + (x.understanding || 0), 0) / r.length;
            const avgHelpfulness = r.reduce((s, x) => s + (x.helpfulness || 0), 0) / r.length;
            ratingMap[bot.id] = {
              avg: (avgUnderstanding + avgHelpfulness) / 2,
              count: r.length,
            };
          }
        } catch (err) { /* ignore */ }
      }));
      setRatings(ratingMap);
    });
    return unsub;
  }, [courseId]);

  // Filter and sort
  const filtered = bots
    .filter(b => {
      if (!search.trim()) return true;
      const s = search.toLowerCase();
      return (b.botName || "").toLowerCase().includes(s)
        || (b.ownerName || "").toLowerCase().includes(s);
    })
    .sort((a, b) => {
      if (sortBy === "rated") {
        return (ratings[b.id]?.avg || 0) - (ratings[a.id]?.avg || 0);
      }
      // newest: by publishedAt descending
      const aTime = a.publishedAt?.seconds || 0;
      const bTime = b.publishedAt?.seconds || 0;
      return bTime - aTime;
    });

  return (
    <div className="bot-arcade">
      <style>{`
        .bot-arcade {
          min-height: calc(100vh - 56px);
          background: var(--bg);
          padding: 32px 24px;
          max-width: 1100px;
          margin: 0 auto;
        }
        .ba-header {
          display: flex; align-items: center; gap: 16px;
          margin-bottom: 24px; flex-wrap: wrap;
        }
        .ba-back {
          font-size: 13px; color: var(--text3); text-decoration: none;
          padding: 6px 14px; border-radius: 8px;
          border: 1px solid var(--border, rgba(255,255,255,0.12));
          transition: all 0.15s;
        }
        .ba-back:hover { border-color: var(--cyan); color: var(--cyan); }
        .ba-title { font-size: 24px; font-weight: 800; color: var(--text); flex: 1; }
        .ba-controls {
          display: flex; gap: 10px; align-items: center;
          width: 100%;
        }
        .ba-search {
          flex: 1; max-width: 300px; padding: 8px 14px;
          border-radius: 10px; border: 1px solid var(--border, rgba(255,255,255,0.1));
          background: var(--surface); color: var(--text); font-size: 13px;
          font-family: var(--font-body, inherit);
        }
        .ba-search:focus { outline: none; border-color: var(--cyan); }
        .ba-search::placeholder { color: var(--text3); }
        .ba-sort {
          padding: 8px 14px; border-radius: 10px; font-size: 13px;
          background: var(--surface); color: var(--text);
          border: 1px solid var(--border, rgba(255,255,255,0.1));
          cursor: pointer; font-family: var(--font-body, inherit);
        }
        .ba-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px; margin-bottom: 32px;
        }
        .ba-card {
          background: var(--surface); border-radius: 16px;
          padding: 20px; cursor: pointer;
          border: 1px solid var(--border, rgba(255,255,255,0.08));
          transition: all 0.2s;
        }
        .ba-card:hover {
          border-color: var(--cyan);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        }
        .ba-card-top {
          display: flex; align-items: center; gap: 12px; margin-bottom: 12px;
        }
        .ba-card-avatar {
          width: 48px; height: 48px; border-radius: 14px;
          background: var(--surface2, rgba(255,255,255,0.05));
          display: flex; align-items: center; justify-content: center;
          font-size: 28px;
        }
        .ba-card-name {
          font-size: 16px; font-weight: 700; color: var(--text);
        }
        .ba-card-creator {
          font-size: 12px; color: var(--text3); margin-top: 2px;
        }
        .ba-card-desc {
          font-size: 13px; color: var(--text3); line-height: 1.5;
          margin-bottom: 14px; min-height: 20px;
        }
        .ba-card-meta {
          display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
        }
        .ba-card-badge {
          font-size: 11px; font-weight: 600; padding: 3px 10px;
          border-radius: 6px; display: inline-block;
        }
        .ba-card-stat {
          font-size: 12px; color: var(--text3);
        }
        .ba-card-stars {
          font-size: 13px; color: var(--amber);
        }
        .ba-empty {
          text-align: center; padding: 80px 20px; color: var(--text3);
        }
        .ba-empty-icon { font-size: 64px; margin-bottom: 16px; opacity: 0.4; }
      `}</style>

      {/* Header */}
      <div className="ba-header">
        <Link to={`/chatbot-workshop/${courseId}`} className="ba-back">
          ← Back to Workshop
        </Link>
        <h1 className="ba-title">🎮 Bot Arcade</h1>
      </div>

      {/* Controls */}
      <div className="ba-controls" style={{ marginBottom: 24 }}>
        <input
          className="ba-search"
          placeholder="Search bots by name or creator..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="ba-sort" value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="rated">Highest Rated</option>
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 60 }}>
          <div className="spinner" />
        </div>
      )}

      {/* Bot Grid */}
      {!loading && filtered.length > 0 && (
        <div className="ba-grid">
          {filtered.map(bot => {
            const r = ratings[bot.id];
            const phase = bot.currentPhase || 1;
            const phaseColor = PHASE_COLORS[phase] || "var(--cyan)";
            const isOwn = bot.ownerId === user?.uid;
            return (
              <div
                key={bot.id}
                className="ba-card"
                onClick={() => navigate(`/bot-arcade/${courseId}/test/${bot.id}`)}
              >
                <div className="ba-card-top">
                  <div className="ba-card-avatar">{bot.botAvatar || "🤖"}</div>
                  <div>
                    <div className="ba-card-name">
                      {bot.botName || "Untitled Bot"}
                      {isOwn && <span style={{ fontSize: 11, color: "var(--text3)", marginLeft: 6 }}>(yours)</span>}
                    </div>
                    <div className="ba-card-creator">by {bot.ownerName || "Anonymous"}</div>
                  </div>
                </div>
                <div className="ba-card-desc">
                  {bot.botDescription || "No description yet"}
                </div>
                <div className="ba-card-meta">
                  <span className="ba-card-badge" style={{
                    background: `${phaseColor}18`, color: phaseColor,
                  }}>
                    Phase {phase}: {PHASE_LABELS[phase]}
                  </span>
                  {r && (
                    <span className="ba-card-stars">
                      {"★".repeat(Math.round(r.avg))}{"☆".repeat(5 - Math.round(r.avg))}
                      <span style={{ color: "var(--text3)", fontSize: 11, marginLeft: 4 }}>({r.count})</span>
                    </span>
                  )}
                  {(bot.stumpCount || 0) > 0 && (
                    <span className="ba-card-stat">🤔 {bot.stumpCount} stumps</span>
                  )}
                  {(bot.testCount || 0) > 0 && (
                    <span className="ba-card-stat">🧪 {bot.testCount} tests</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="ba-empty">
          <div className="ba-empty-icon">🎮</div>
          {bots.length === 0 ? (
            <>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: "var(--text)" }}>
                No bots published yet!
              </div>
              <div style={{ fontSize: 14 }}>
                Be the first to publish your chatbot to the arcade.
              </div>
            </>
          ) : (
            <div style={{ fontSize: 14 }}>
              No bots match your search. Try a different term.
            </div>
          )}
        </div>
      )}

      {/* Stump Leaderboard */}
      <StumpLeaderboard courseId={courseId} />
    </div>
  );
}
