// src/components/chatbot-workshop/ChatPreview.jsx
// Universal chat test panel for all 4 bot phases.
// Renders as a right-side panel in the BotBuilder page.

import { useState, useRef, useEffect } from "react";
import { processMessage } from "../../lib/chatbotEngine";

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

export default function ChatPreview({ phase, config, botName, botAvatar, cloudFunctionUrl, embedFunctionUrl, studentId, getToken, projectId, onMessagesChange, renderMessageExtra }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationState, setConversationState] = useState(null);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Reset conversation when phase or config changes substantially
  useEffect(() => {
    resetChat();
  }, [phase]);

  function resetChat() {
    setMessages([]);
    setConversationState(null);
    setInput("");

    // Auto-greet for decision tree bots
    if (phase === 1 && config?.nodes?.length) {
      const startNode = config.nodes.find(n => n.type === "start");
      if (startNode?.data?.message) {
        setMessages([{ role: "bot", content: startNode.data.message, timestamp: Date.now() }]);
        // Set state to the start node so next message evaluates edges from it
        setConversationState({ currentNodeId: startNode.id, history: [], hasGreeted: true });
      }
    }
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: "user", content: text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Get fresh auth token for Phase 3 (embeddings) and Phase 4 (LLM)
      let authToken = null;
      if (phase >= 3 && getToken) {
        authToken = await getToken();
      }

      const result = await processMessage({
        phase,
        config,
        userMessage: text,
        conversationState,
        cloudFunctionUrl,
        embedFunctionUrl,
        studentId,
        authToken,
        projectId,
      });

      const botMsg = { role: "bot", content: result.response, timestamp: Date.now() };
      setMessages(prev => [...prev, botMsg]);

      if (result.state) setConversationState(result.state);

      // Show match info for Phase 2 (educational)
      if (phase === 2 && result.matchedRule) {
        const debugMsg = {
          role: "debug",
          content: `Matched: [${result.matchedRule.keywords?.join(", ")}] (confidence: ${Math.round((result.confidence || 0) * 100)}%)`,
          timestamp: Date.now(),
        };
        setMessages(prev => [...prev, debugMsg]);
      } else if (phase === 2 && !result.matchedRule) {
        const debugMsg = {
          role: "debug",
          content: "No keyword match — used fallback response",
          timestamp: Date.now(),
        };
        setMessages(prev => [...prev, debugMsg]);
      }

      // Show match info for Phase 3 (intent classification)
      if (phase === 3 && result.matchedRule) {
        const debugMsg = {
          role: "debug",
          content: `Intent: "${result.matchedRule.name}" (confidence: ${Math.round((result.confidence || 0) * 100)}%)`,
          timestamp: Date.now(),
        };
        setMessages(prev => [...prev, debugMsg]);
      } else if (phase === 3 && !result.matchedRule && result.confidence !== undefined) {
        const debugMsg = {
          role: "debug",
          content: `No intent matched (best: ${Math.round((result.confidence || 0) * 100)}%, threshold: ${Math.round((config.confidenceThreshold || 0.65) * 100)}%)`,
          timestamp: Date.now(),
        };
        setMessages(prev => [...prev, debugMsg]);
      }

      if (result.isEnd) {
        setMessages(prev => [...prev, {
          role: "system",
          content: "Conversation ended. The bot reached a terminal node.",
          timestamp: Date.now(),
        }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: "system",
        content: `Error: ${err.message}`,
        timestamp: Date.now(),
      }]);
    }

    setLoading(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    if (onMessagesChange) onMessagesChange(messages);
  }, [messages]);

  const accentColor = PHASE_COLORS[phase] || "var(--cyan)";

  return (
    <div className="chat-preview">
      <style>{`
        .chat-preview {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: var(--bg);
          border-left: 1px solid var(--border, rgba(255,255,255,0.08));
          font-family: var(--font-body, 'Inter', sans-serif);
        }

        .cp-header {
          padding: 16px 20px;
          background: var(--surface);
          border-bottom: 1px solid var(--border, rgba(255,255,255,0.08));
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .cp-avatar {
          width: 40px; height: 40px;
          border-radius: 12px;
          background: var(--surface2, rgba(255,255,255,0.05));
          display: flex; align-items: center; justify-content: center;
          font-size: 22px;
        }
        .cp-info { flex: 1; }
        .cp-bot-name {
          font-weight: 700; font-size: 15px; color: var(--text);
        }
        .cp-phase-badge {
          font-size: 11px; font-weight: 600;
          padding: 2px 8px; border-radius: 6px;
          display: inline-block; margin-top: 2px;
        }
        .cp-reset {
          background: none; border: 1px solid var(--border, rgba(255,255,255,0.12));
          color: var(--text3); font-size: 12px; padding: 6px 12px;
          border-radius: 8px; cursor: pointer; font-weight: 500;
          transition: all 0.15s;
        }
        .cp-reset:hover { border-color: ${accentColor}; color: ${accentColor}; }

        .cp-messages {
          flex: 1; overflow-y: auto; padding: 20px;
          display: flex; flex-direction: column; gap: 12px;
        }
        .cp-messages::-webkit-scrollbar { width: 4px; }
        .cp-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

        .cp-empty {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          color: var(--text3); text-align: center; padding: 40px;
          gap: 12px;
        }
        .cp-empty-icon { font-size: 48px; opacity: 0.4; }
        .cp-empty-text { font-size: 14px; line-height: 1.5; }

        .cp-msg {
          display: flex; gap: 10px;
          animation: cpFadeIn 0.25s ease;
        }
        @keyframes cpFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .cp-msg.user { flex-direction: row-reverse; }
        .cp-msg-avatar {
          width: 28px; height: 28px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; flex-shrink: 0;
          background: var(--surface2, rgba(255,255,255,0.05));
        }
        .cp-msg.user .cp-msg-avatar { background: ${accentColor}20; }
        .cp-msg-bubble {
          max-width: 80%; padding: 10px 14px;
          border-radius: 14px; font-size: 14px; line-height: 1.5;
        }
        .cp-msg.bot .cp-msg-bubble {
          background: var(--surface);
          color: var(--text);
          border-bottom-left-radius: 4px;
        }
        .cp-msg.user .cp-msg-bubble {
          background: ${accentColor}22;
          color: var(--text);
          border-bottom-right-radius: 4px;
        }
        .cp-msg.debug .cp-msg-bubble {
          background: transparent;
          border: 1px dashed var(--text3);
          color: var(--text3);
          font-size: 12px;
          font-family: var(--font-mono, monospace);
          max-width: 100%;
          padding: 6px 12px;
        }
        .cp-msg.system .cp-msg-bubble {
          background: transparent;
          color: var(--text3);
          font-size: 12px;
          font-style: italic;
          text-align: center;
          max-width: 100%;
        }

        .cp-typing {
          display: flex; gap: 4px; padding: 4px 0;
        }
        .cp-typing span {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--text3); opacity: 0.5;
          animation: cpBounce 1.2s infinite;
        }
        .cp-typing span:nth-child(2) { animation-delay: 0.15s; }
        .cp-typing span:nth-child(3) { animation-delay: 0.3s; }
        @keyframes cpBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }

        .cp-input-row {
          display: flex; gap: 8px; padding: 14px 20px;
          border-top: 1px solid var(--border, rgba(255,255,255,0.08));
          background: var(--surface);
        }
        .cp-input {
          flex: 1; background: var(--bg);
          border: 1px solid var(--border, rgba(255,255,255,0.1));
          border-radius: 10px; padding: 10px 14px;
          font-size: 14px; color: var(--text);
          font-family: var(--font-body, inherit);
          transition: border-color 0.15s;
        }
        .cp-input:focus { outline: none; border-color: ${accentColor}; }
        .cp-input::placeholder { color: var(--text3); }
        .cp-send {
          width: 40px; height: 40px; border-radius: 10px; border: none;
          background: ${accentColor};
          color: white; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: opacity 0.15s, transform 0.15s;
        }
        .cp-send:hover:not(:disabled) { opacity: 0.85; transform: translateY(-1px); }
        .cp-send:disabled { opacity: 0.3; cursor: default; }

        .cp-footer {
          padding: 8px 20px; font-size: 11px; color: var(--text3);
          text-align: center;
          border-top: 1px solid var(--border, rgba(255,255,255,0.05));
        }
      `}</style>

      {/* Header */}
      <div className="cp-header">
        <div className="cp-avatar">{botAvatar || "🤖"}</div>
        <div className="cp-info">
          <div className="cp-bot-name">{botName || "My Chatbot"}</div>
          <span className="cp-phase-badge" style={{
            background: `${accentColor}18`,
            color: accentColor,
          }}>
            Phase {phase}: {PHASE_LABELS[phase]}
          </span>
        </div>
        <button className="cp-reset" onClick={resetChat}>↻ Reset</button>
      </div>

      {/* Messages */}
      <div className="cp-messages">
        {messages.length === 0 ? (
          <div className="cp-empty">
            <div className="cp-empty-icon">💬</div>
            <div className="cp-empty-text">
              Send a message to test your bot!
              {phase === 1 && <><br />Your decision tree will guide the conversation.</>}
              {phase === 2 && <><br />Keywords you've defined will match responses.</>}
              {phase === 3 && <><br />Your trained intents will classify messages by meaning.</>}
              {phase === 4 && <><br />Your system prompt shapes the AI's personality.</>}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`cp-msg ${msg.role}`}>
              {(msg.role === "bot" || msg.role === "user") && (
                <div className="cp-msg-avatar">
                  {msg.role === "bot" ? (botAvatar || "🤖") : "👤"}
                </div>
              )}
              <div className="cp-msg-bubble">{msg.content}</div>
              {msg.role === "bot" && renderMessageExtra && renderMessageExtra(msg, i)}
            </div>
          ))
        )}
        {loading && (
          <div className="cp-msg bot">
            <div className="cp-msg-avatar">{botAvatar || "🤖"}</div>
            <div className="cp-msg-bubble">
              <div className="cp-typing"><span /><span /><span /></div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="cp-input-row">
        <input
          ref={inputRef}
          className="cp-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message to test your bot..."
          disabled={loading}
        />
        <button className="cp-send" onClick={sendMessage} disabled={!input.trim() || loading}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>

      <div className="cp-footer">
        {phase <= 2 ? "Running locally in your browser" : phase === 3 ? "Embeddings from AI · Similarity computed locally" : "Powered by AI · Responses are logged"}
      </div>
    </div>
  );
}
