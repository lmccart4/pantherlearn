// src/components/chatbot-workshop/BotTestView.jsx
// Full-page test view for a classmate's bot from the Bot Arcade.
// Split layout: info panel (left) + ChatPreview (right).

import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { db } from "../../lib/firebase";
import {
  getBotProject, saveConversationLog, incrementBotStumps,
  incrementBotTestCount, incrementArcadeStat, rateBot,
} from "../../lib/botStore";
import { awardXP, getXPConfig } from "../../lib/gamification";
import ChatPreview from "./ChatPreview";
import RatingModal from "./RatingModal";

const BOT_CHAT_URL = import.meta.env.VITE_BOT_CHAT_URL
  || "https://us-central1-pantherlearn-d6f7c.cloudfunctions.net/botChat";

const BOT_EMBED_URL = import.meta.env.VITE_BOT_EMBED_URL
  || "https://us-central1-pantherlearn-d6f7c.cloudfunctions.net/botEmbed";

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

export default function BotTestView() {
  const { courseId, projectId } = useParams();
  const { user, getToken } = useAuth();
  const navigate = useNavigate();

  const [bot, setBot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [stumpedIndices, setStumpedIndices] = useState(new Set());
  const [showRating, setShowRating] = useState(false);
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);

  const isOwnBot = bot?.ownerId === user?.uid;
  const phase = bot?.currentPhase || 1;
  const phaseColor = PHASE_COLORS[phase] || "var(--cyan)";

  useEffect(() => {
    if (!projectId) return;
    loadBot();
  }, [projectId]);

  async function loadBot() {
    setLoading(true);
    try {
      const project = await getBotProject(db, projectId);
      setBot(project);
    } catch (err) {
      console.error("Error loading bot:", err);
    }
    setLoading(false);
  }

  const handleMessagesChange = useCallback((msgs) => {
    setMessages(msgs);
  }, []);

  function handleStump(msg, index) {
    if (stumpedIndices.has(index)) {
      setStumpedIndices(prev => {
        const next = new Set(prev);
        next.delete(index);
        return next;
      });
    } else {
      setStumpedIndices(prev => new Set(prev).add(index));
    }
  }

  const renderMessageExtra = useCallback((msg, index) => {
    if (isOwnBot) return null; // No stumping your own bot
    const isStumped = stumpedIndices.has(index);
    return (
      <button
        onClick={(e) => { e.stopPropagation(); handleStump(msg, index); }}
        title={isStumped ? "Undo stump" : "Mark as stumped - bot gave a bad response"}
        style={{
          background: isStumped ? "var(--amber)22" : "transparent",
          border: `1px solid ${isStumped ? "var(--amber)" : "var(--border, rgba(255,255,255,0.1))"}`,
          borderRadius: 8, padding: "4px 8px", fontSize: 12,
          cursor: "pointer", transition: "all 0.15s", flexShrink: 0,
          color: isStumped ? "var(--amber)" : "var(--text3)",
          alignSelf: "flex-start", marginTop: 2,
        }}
      >
        {isStumped ? "Stumped!" : "🤔"}
      </button>
    );
  }, [stumpedIndices, isOwnBot]);

  async function handleDoneTesting() {
    if (done || saving) return;
    setSaving(true);

    try {
      const stumpCount = stumpedIndices.size;

      // Save conversation log
      if (messages.length > 1) {
        await saveConversationLog(db, projectId, {
          testerId: user.uid,
          testerName: user.displayName || "Anonymous",
          phase,
          messages: messages.map(m => ({ role: m.role, content: m.content, timestamp: m.timestamp })),
        });
      }

      // Only award XP and update stats for other people's bots
      if (!isOwnBot) {
        // Increment bot test count
        await incrementBotTestCount(db, projectId);

        // Increment stump counts
        if (stumpCount > 0) {
          await incrementBotStumps(db, projectId, stumpCount);
          // Track tester's stump stats
          await incrementArcadeStat(db, courseId, user.uid, "totalStumps", stumpCount);
        }

        // Track tester's test count
        await incrementArcadeStat(db, courseId, user.uid, "totalTests", 1);
        // Save display name for leaderboard
        await incrementArcadeStat(db, courseId, user.uid, "displayName", 0); // merge: true keeps displayName
        // Actually set the display name properly
        const { doc: firestoreDoc, setDoc, serverTimestamp } = await import("firebase/firestore");
        const statRef = firestoreDoc(db, "courses", courseId, "botArcadeStats", user.uid);
        await setDoc(statRef, { displayName: user.displayName || "Anonymous" }, { merge: true });

        // Award XP
        const xpConfig = await getXPConfig(courseId);
        const testXP = xpConfig?.bot_test ?? 5;
        await awardXP(user.uid, testXP, "bot_test", courseId);

        if (stumpCount > 0) {
          const stumpXP = xpConfig?.bot_stump ?? 5;
          await awardXP(user.uid, stumpXP * stumpCount, "bot_stump", courseId);
        }
      }

      setDone(true);

      // Show rating modal for other people's bots
      if (!isOwnBot && messages.length > 1) {
        setShowRating(true);
      }
    } catch (err) {
      console.error("Error saving test results:", err);
    }
    setSaving(false);
  }

  async function handleSubmitRating({ understanding, helpfulness, comment }) {
    try {
      await rateBot(db, projectId, {
        raterId: user.uid,
        understanding,
        helpfulness,
        comment,
      });

      // Award rating XP
      if (!isOwnBot) {
        const xpConfig = await getXPConfig(courseId);
        const rateXP = xpConfig?.bot_rate ?? 10;
        await awardXP(user.uid, rateXP, "bot_rate", courseId);
      }
    } catch (err) {
      console.error("Error submitting rating:", err);
    }
    setShowRating(false);
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!bot) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", color: "var(--text3)" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🤷</div>
          <div style={{ fontSize: 18, fontWeight: 600 }}>Bot not found</div>
          <button
            onClick={() => navigate(`/bot-arcade/${courseId}`)}
            style={{
              marginTop: 20, padding: "10px 24px", borderRadius: 10, fontSize: 13,
              fontWeight: 600, background: "var(--cyan)", color: "white", border: "none",
              cursor: "pointer",
            }}
          >
            Back to Arcade
          </button>
        </div>
      </div>
    );
  }

  const config = bot.phases?.[phase] || {};

  return (
    <div className="bot-test-view">
      <style>{`
        .bot-test-view {
          display: flex;
          height: calc(100vh - 56px);
          background: var(--bg);
          overflow: hidden;
        }
        .btv-info-panel {
          width: 320px; flex-shrink: 0;
          display: flex; flex-direction: column;
          border-right: 1px solid var(--border, rgba(255,255,255,0.08));
          background: var(--surface);
          overflow-y: auto;
        }
        .btv-info-content { padding: 24px; flex: 1; }
        .btv-back {
          font-size: 13px; color: var(--text3); text-decoration: none;
          display: inline-block; margin-bottom: 20px; transition: color 0.15s;
        }
        .btv-back:hover { color: var(--cyan); }
        .btv-avatar {
          width: 72px; height: 72px; border-radius: 20px;
          background: var(--surface2, rgba(255,255,255,0.05));
          display: flex; align-items: center; justify-content: center;
          font-size: 40px; margin-bottom: 16px;
        }
        .btv-name {
          font-size: 22px; font-weight: 800; color: var(--text);
          margin-bottom: 4px;
        }
        .btv-creator {
          font-size: 13px; color: var(--text3); margin-bottom: 16px;
        }
        .btv-desc {
          font-size: 14px; color: var(--text3); line-height: 1.6;
          margin-bottom: 20px;
        }
        .btv-stats {
          display: flex; gap: 16px; margin-bottom: 20px;
        }
        .btv-stat {
          text-align: center;
        }
        .btv-stat-val {
          font-size: 20px; font-weight: 800; color: var(--text);
        }
        .btv-stat-label {
          font-size: 11px; color: var(--text3);
        }
        .btv-stump-count {
          padding: 12px 16px; border-radius: 12px;
          background: var(--amber)12; border: 1px solid var(--amber)30;
          margin-bottom: 20px;
          display: flex; align-items: center; gap: 10px;
        }
        .btv-done-btn {
          width: 100%; padding: 14px; border-radius: 12px;
          font-size: 15px; font-weight: 700; border: none;
          cursor: pointer; transition: all 0.15s;
        }
        .btv-done-btn:hover:not(:disabled) { transform: translateY(-1px); opacity: 0.9; }
        .btv-done-btn:disabled { opacity: 0.5; cursor: default; }
        .btv-chat-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        @media (max-width: 800px) {
          .bot-test-view { flex-direction: column; height: auto; }
          .btv-info-panel { width: 100%; border-right: none; border-bottom: 1px solid var(--border); }
          .btv-chat-panel { height: 500px; }
        }
      `}</style>

      {/* Left: Bot Info Panel */}
      <div className="btv-info-panel">
        <div className="btv-info-content">
          <a className="btv-back" href="#" onClick={e => { e.preventDefault(); navigate(`/bot-arcade/${courseId}`); }}>
            ← Back to Arcade
          </a>

          <div className="btv-avatar">{bot.botAvatar || "🤖"}</div>
          <div className="btv-name">{bot.botName || "Untitled Bot"}</div>
          <div className="btv-creator">
            by {bot.ownerName || "Anonymous"}
            {isOwnBot && <span style={{ color: "var(--cyan)", marginLeft: 6 }}>(your bot)</span>}
          </div>

          <span style={{
            display: "inline-block", fontSize: 11, fontWeight: 600,
            padding: "3px 10px", borderRadius: 6, marginBottom: 16,
            background: `${phaseColor}18`, color: phaseColor,
          }}>
            Phase {phase}: {PHASE_LABELS[phase]}
          </span>

          <div className="btv-desc">
            {bot.botDescription || "No description provided."}
          </div>

          <div className="btv-stats">
            <div className="btv-stat">
              <div className="btv-stat-val">{bot.testCount || 0}</div>
              <div className="btv-stat-label">Tests</div>
            </div>
            <div className="btv-stat">
              <div className="btv-stat-val">{bot.stumpCount || 0}</div>
              <div className="btv-stat-label">Stumps</div>
            </div>
          </div>

          {/* Stump counter during testing */}
          {stumpedIndices.size > 0 && !done && (
            <div className="btv-stump-count">
              <span style={{ fontSize: 20 }}>🤔</span>
              <div>
                <div style={{ fontWeight: 700, color: "var(--amber)", fontSize: 14 }}>
                  {stumpedIndices.size} response{stumpedIndices.size !== 1 ? "s" : ""} stumped
                </div>
                <div style={{ fontSize: 11, color: "var(--text3)" }}>
                  Click the button next to bot messages to mark/unmark
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          {!done && !isOwnBot && (
            <div style={{
              fontSize: 12, color: "var(--text3)", lineHeight: 1.6,
              padding: 14, borderRadius: 10,
              background: "var(--surface2, rgba(255,255,255,0.03))",
              marginBottom: 16,
            }}>
              <strong style={{ color: "var(--text)" }}>How to test:</strong><br />
              Chat with the bot, then click 🤔 next to any bad responses to mark them as "stumped".
              When you're done, click the button below to save your results and rate the bot.
            </div>
          )}

          {/* Done button */}
          <button
            className="btv-done-btn"
            onClick={done ? () => navigate(`/bot-arcade/${courseId}`) : handleDoneTesting}
            disabled={saving}
            style={{
              background: done ? "var(--surface2, rgba(255,255,255,0.05))" : phaseColor,
              color: done ? "var(--text3)" : "white",
              border: done ? "1px solid var(--border, rgba(255,255,255,0.12))" : "none",
            }}
          >
            {saving ? "Saving..." : done ? "← Back to Arcade" : (isOwnBot ? "Done Previewing" : "Done Testing")}
          </button>

          {done && !isOwnBot && (
            <div style={{
              textAlign: "center", marginTop: 12,
              fontSize: 13, color: "var(--green, #34d399)", fontWeight: 600,
            }}>
              Results saved! XP awarded.
            </div>
          )}
        </div>
      </div>

      {/* Right: Chat Preview */}
      <div className="btv-chat-panel">
        <ChatPreview
          phase={phase}
          config={config}
          botName={bot.botName}
          botAvatar={bot.botAvatar}
          studentId={user?.uid}
          cloudFunctionUrl={BOT_CHAT_URL}
          embedFunctionUrl={BOT_EMBED_URL}
          getToken={getToken}
          projectId={projectId}
          onMessagesChange={handleMessagesChange}
          renderMessageExtra={renderMessageExtra}
        />
      </div>

      {/* Rating Modal */}
      {showRating && (
        <RatingModal
          botName={bot.botName}
          onSubmit={handleSubmitRating}
          onClose={() => setShowRating(false)}
        />
      )}
    </div>
  );
}
