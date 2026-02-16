// src/components/blocks/ChatbotBlock.jsx
import { useState, useRef, useEffect } from "react";
import { renderMarkdown } from "../../lib/utils";
import { sendChatMessage } from "../../lib/api";
import { useTranslatedText, useTranslatedTexts } from "../../hooks/useTranslatedText.jsx";
import { usePreview } from "../../contexts/PreviewContext";

export default function ChatbotBlock({ block, lessonId, courseId, getToken, onLog }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: block.starterMessage },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const { isPreview } = usePreview();

  // Translate static block content
  const translatedTitle = useTranslatedText(block.title);
  const translatedInstructions = useTranslatedText(block.instructions);

  // Translate UI chrome strings
  const uiStrings = useTranslatedTexts([
    "AI",                        // 0
    "You",                       // 1
    block.placeholder || "Type a message...", // 2
    "Powered by Google Gemini · Conversations are logged for your teacher to review", // 3
    "Hmm, I had trouble connecting. Please try again!", // 4
  ]);
  const ui = (i, fallback) => uiStrings?.[i] ?? fallback;

  // Translate all message content for display
  const messageContents = messages.map(m => m.content);
  const translatedMessages = useTranslatedTexts(messageContents);

  const hasInteracted = useRef(false);

  useEffect(() => {
    if (!hasInteracted.current) {
      hasInteracted.current = true;
      return; // Skip scroll on initial render
    }
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");

    // In preview mode, simulate a response instead of calling the real API
    if (isPreview) {
      setLoading(true);
      // Brief delay to simulate typing
      await new Promise((r) => setTimeout(r, 600));
      const simMsg = {
        role: "assistant",
        content: "*(Preview mode — this is a simulated response. Students will see real AI responses here.)*",
      };
      setMessages((prev) => [...prev, simMsg]);
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
      return;
    }

    setLoading(true);

    try {
      const authToken = await getToken();
      const responseText = await sendChatMessage({
        authToken,
        courseId,
        lessonId,
        blockId: block.id,
        systemPrompt: block.systemPrompt,
        messages: newMessages,
      });

      const assistantMsg = { role: "assistant", content: responseText };
      setMessages((prev) => [...prev, assistantMsg]);
      if (onLog) onLog(block.id, [...newMessages, assistantMsg]);
    } catch (err) {
      const errorMsg = err.message.includes("Slow down")
        ? err.message
        : ui(4, "Hmm, I had trouble connecting. Please try again!");
      setMessages((prev) => [...prev, { role: "assistant", content: errorMsg }]);
    }

    setLoading(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chatbot-block">
      <div className="chatbot-header" onClick={() => setExpanded(!expanded)}>
        <div className="chatbot-header-left">
          <span className="chatbot-icon">{block.icon}</span>
          <h3 className="chatbot-title" data-translatable>{translatedTitle}</h3>
        </div>
        <span className="chatbot-toggle">{expanded ? "▾" : "▸"}</span>
      </div>

      {expanded && (
        <>
          {block.instructions && (
            <div className="chatbot-instructions" data-translatable dangerouslySetInnerHTML={{ __html: renderMarkdown(translatedInstructions || block.instructions) }} />
          )}

          {/* Preview mode notice */}
          {isPreview && (
            <div className="chatbot-preview-notice">
              👁 Preview mode — responses are simulated. No API calls or chat logs are created.
            </div>
          )}

          <div className="chatbot-conversation">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-message ${msg.role}`}>
                <div className="chat-avatar">{msg.role === "assistant" ? "🤖" : "👤"}</div>
                <div className="chat-bubble">
                  <div className="chat-role" data-translatable>{msg.role === "assistant" ? ui(0, "AI") : ui(1, "You")}</div>
                  <div className="chat-text" data-translatable dangerouslySetInnerHTML={{ __html: renderMarkdown(translatedMessages?.[i] ?? msg.content) }} />
                </div>
              </div>
            ))}
            {loading && (
              <div className="chat-message assistant">
                <div className="chat-avatar">🤖</div>
                <div className="chat-bubble">
                  <div className="chat-role" data-translatable>{ui(0, "AI")}</div>
                  <div className="chat-typing"><span /><span /><span /></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="chatbot-input-row">
            <input
              ref={inputRef}
              className="chatbot-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={ui(2, block.placeholder || "Type a message...")}
              disabled={loading}
            />
            <button className="chatbot-send" onClick={sendMessage} disabled={!input.trim() || loading}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
          <div className="chatbot-footer" data-translatable>{ui(3, "Powered by Google Gemini · Conversations are logged for your teacher to review")}</div>
        </>
      )}
    </div>
  );
}
