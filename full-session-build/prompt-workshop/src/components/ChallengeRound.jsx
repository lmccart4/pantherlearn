// src/components/ChallengeRound.jsx
import React, { useState } from "react";
import { sendChat } from "../lib/pantherlearn";

export default function ChallengeRound({ challenge, roundNum, totalRounds, onComplete }) {
  const [phase, setPhase] = useState("brief"); // brief | write | loading | response | judging | result
  const [prompt, setPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [judgment, setJudgment] = useState(null); // "perfect" | "partial" | "fail"
  const [error, setError] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [bestJudgment, setBestJudgment] = useState(null);

  // Phase 1 → 2: Start writing
  const handleStartWriting = () => setPhase("write");

  // Phase 2 → 3: Send prompt to AI
  const handleSend = async () => {
    if (!prompt.trim()) return;
    setPhase("loading");
    setError(null);

    try {
      // Send student's prompt to Gemini (no special system prompt — just respond naturally)
      const response = await sendChat(
        "You are a helpful AI assistant. Respond naturally to the user's prompt. Follow their instructions as precisely as you can.",
        [{ role: "user", content: prompt.trim() }]
      );
      setAiResponse(response);
      setPhase("response");
    } catch (err) {
      setError(err.message);
      setPhase("write");
    }
  };

  // Phase 4: Judge the response
  const handleJudge = async () => {
    setPhase("judging");
    try {
      // Send the AI's response to the judge
      const judgeResult = await sendChat(
        challenge.evaluationPrompt,
        [{ role: "user", content: `Student's prompt: "${prompt}"\n\nAI's response:\n${aiResponse}` }]
      );

      const j = judgeResult.trim().toLowerCase();
      const result = j.includes("perfect") ? "perfect" : j.includes("partial") ? "partial" : "fail";
      setJudgment(result);
      setAttempts((prev) => prev + 1);

      // Track best result across attempts
      if (!bestJudgment || result === "perfect" || (result === "partial" && bestJudgment === "fail")) {
        setBestJudgment(result);
      }

      setPhase("result");
    } catch (err) {
      // If judge fails, give partial credit
      setJudgment("partial");
      setAttempts((prev) => prev + 1);
      setBestJudgment((prev) => prev || "partial");
      setPhase("result");
    }
  };

  // Try again or continue
  const handleRetry = () => {
    setPrompt("");
    setAiResponse("");
    setJudgment(null);
    setPhase("write");
  };

  const handleContinue = () => {
    const j = bestJudgment || judgment || "fail";
    const pts =
      j === "perfect" ? challenge.maxPoints :
      j === "partial" ? Math.round(challenge.maxPoints * 0.5) : 
      Math.round(challenge.maxPoints * 0.15);

    // Bonus for first-try success
    const bonus = (j === "perfect" && attempts === 1) ? Math.round(challenge.maxPoints * 0.1) : 0;

    onComplete({
      points: Math.min(pts + bonus, challenge.maxPoints),
      maxPoints: challenge.maxPoints,
      correct: j === "perfect",
      judgment: j,
      attempts,
      prompt,
      concept: challenge.concept,
    });
  };

  const judgmentColors = { perfect: "var(--success)", partial: "var(--warning)", fail: "var(--danger)" };
  const judgmentEmoji = { perfect: "🎯", partial: "🔶", fail: "❌" };
  const judgmentLabel = { perfect: "Perfect!", partial: "Partial Credit", fail: "Not Quite" };

  return (
    <div className="slide-up" style={{ maxWidth: "720px", margin: "0 auto", padding: "32px 24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div>
          <div style={{ color: "var(--muted)", fontSize: "12px", fontFamily: "var(--font-mono)", letterSpacing: "1px", textTransform: "uppercase" }}>
            Challenge {roundNum} of {totalRounds}
          </div>
          <h2 style={{ fontSize: "20px", fontWeight: 700, margin: "4px 0 0" }}>{challenge.title}</h2>
        </div>
        <span style={{
          padding: "4px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px",
          background: challenge.difficulty === "hard" ? "rgba(248,113,113,0.15)" : challenge.difficulty === "medium" ? "rgba(251,191,36,0.12)" : "rgba(52,211,153,0.12)",
          color: challenge.difficulty === "hard" ? "var(--danger)" : challenge.difficulty === "medium" ? "var(--warning)" : "var(--success)",
        }}>
          {challenge.difficulty}
        </span>
      </div>

      {/* BRIEF: Show the goal and bad example */}
      {phase === "brief" && (
        <div>
          {/* Goal */}
          <div style={{ background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: "12px", padding: "16px 20px", marginBottom: "16px" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--success)", marginBottom: "6px", letterSpacing: "0.5px", textTransform: "uppercase" }}>🎯 Your Goal</div>
            <p style={{ fontSize: "15px", fontWeight: 500, lineHeight: 1.6 }}>{challenge.goal}</p>
          </div>

          {/* Bad example */}
          <div style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "12px", padding: "16px 20px", marginBottom: "16px" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--danger)", marginBottom: "6px", letterSpacing: "0.5px", textTransform: "uppercase" }}>❌ Bad Prompt</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "14px", color: "var(--danger)", background: "rgba(248,113,113,0.08)", padding: "10px 14px", borderRadius: "6px", marginBottom: "8px" }}>
              "{challenge.failExample}"
            </div>
            <p style={{ fontSize: "13px", color: "var(--text-dim)", lineHeight: 1.5 }}>
              <strong>Why it fails:</strong> {challenge.failWhy}
            </p>
          </div>

          {/* Hint */}
          <div style={{ background: "rgba(129,140,248,0.06)", border: "1px solid rgba(129,140,248,0.15)", borderRadius: "12px", padding: "12px 16px", marginBottom: "20px" }}>
            <p style={{ fontSize: "13px", color: "var(--accent)" }}>
              💡 <strong>Hint:</strong> {challenge.successHint}
            </p>
          </div>

          <button onClick={handleStartWriting} style={{
            width: "100%", padding: "14px", borderRadius: "10px", fontSize: "15px", fontWeight: 700,
            background: "var(--accent)", color: "var(--bg)", border: "none", cursor: "pointer",
          }}>
            Write Your Prompt →
          </button>
        </div>
      )}

      {/* WRITE: Student crafts their prompt */}
      {phase === "write" && (
        <div>
          <div style={{ background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.15)", borderRadius: "10px", padding: "10px 14px", marginBottom: "12px" }}>
            <span style={{ fontSize: "13px", color: "var(--success)" }}>🎯 {challenge.goal}</span>
          </div>

          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "8px", color: "var(--text-dim)" }}>
              Your Prompt:
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Write your prompt here..."
              style={{
                width: "100%", minHeight: "120px", padding: "14px", borderRadius: "8px",
                background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)",
                fontSize: "14px", fontFamily: "var(--font-mono)", resize: "vertical", lineHeight: 1.6,
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
              <span style={{ fontSize: "11px", color: "var(--muted)" }}>{prompt.length} characters</span>
              {attempts > 0 && <span style={{ fontSize: "11px", color: "var(--warning)" }}>Attempt {attempts + 1}</span>}
            </div>
          </div>

          {error && (
            <div style={{ color: "var(--danger)", fontSize: "13px", marginBottom: "12px", padding: "8px 12px", background: "rgba(248,113,113,0.08)", borderRadius: "8px" }}>
              ⚠ {error}
            </div>
          )}

          <button onClick={handleSend} disabled={!prompt.trim()} style={{
            width: "100%", padding: "14px", borderRadius: "10px", fontSize: "15px", fontWeight: 700,
            background: prompt.trim() ? "linear-gradient(135deg, #059669, #34d399)" : "var(--border)",
            color: prompt.trim() ? "#fff" : "var(--muted)", border: "none",
          }}>
            🚀 Send to AI
          </button>
        </div>
      )}

      {/* LOADING */}
      {phase === "loading" && (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <div style={{ fontSize: "32px", animation: "pulse 1.5s ease infinite" }}>🤖</div>
          <p style={{ color: "var(--muted)", marginTop: "12px" }}>The AI is responding to your prompt...</p>
        </div>
      )}

      {/* RESPONSE: Show AI's response, ask student to submit for judging */}
      {phase === "response" && (
        <div>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px 20px", marginBottom: "16px" }}>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--muted)", marginBottom: "8px" }}>Your prompt:</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: "var(--accent)", background: "var(--bg)", padding: "10px 14px", borderRadius: "6px", marginBottom: "16px" }}>
              {prompt}
            </div>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--muted)", marginBottom: "8px" }}>AI's response:</div>
            <div style={{ fontSize: "14px", lineHeight: 1.7, color: "var(--text)", whiteSpace: "pre-wrap" }}>
              {aiResponse}
            </div>
          </div>

          <button onClick={handleJudge} style={{
            width: "100%", padding: "14px", borderRadius: "10px", fontSize: "15px", fontWeight: 700,
            background: "var(--accent)", color: "var(--bg)", border: "none", cursor: "pointer",
          }}>
            📊 Check My Results
          </button>
        </div>
      )}

      {/* JUDGING */}
      {phase === "judging" && (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <div style={{ fontSize: "32px", animation: "pulse 1.5s ease infinite" }}>📊</div>
          <p style={{ color: "var(--muted)", marginTop: "12px" }}>Evaluating your prompt...</p>
        </div>
      )}

      {/* RESULT */}
      {phase === "result" && judgment && (
        <div className="fade-in">
          {/* Judgment banner */}
          <div style={{
            textAlign: "center", padding: "24px", marginBottom: "16px",
            background: `${judgmentColors[judgment]}10`, border: `1px solid ${judgmentColors[judgment]}30`,
            borderRadius: "12px",
          }}>
            <div style={{ fontSize: "36px", marginBottom: "8px" }}>{judgmentEmoji[judgment]}</div>
            <div style={{ fontSize: "20px", fontWeight: 700, color: judgmentColors[judgment] }}>
              {judgmentLabel[judgment]}
            </div>
            <p style={{ fontSize: "13px", color: "var(--text-dim)", marginTop: "6px" }}>
              {judgment === "perfect" && "Your prompt achieved the goal perfectly!"}
              {judgment === "partial" && "Your prompt got close but didn't fully meet the criteria."}
              {judgment === "fail" && "The AI's response didn't match the goal. Try a different approach!"}
            </p>
          </div>

          {/* Concept badge */}
          <div style={{
            background: "rgba(129,140,248,0.06)", border: "1px solid rgba(129,140,248,0.15)",
            borderRadius: "10px", padding: "12px 16px", marginBottom: "16px", fontSize: "13px",
          }}>
            <strong style={{ color: "var(--accent)" }}>Concept practiced:</strong>{" "}
            <span style={{ color: "var(--text-dim)" }}>
              {challenge.concept === "specificity" && "Being specific about what you want"}
              {challenge.concept === "audience" && "Specifying the target audience"}
              {challenge.concept === "formatting" && "Controlling output format"}
              {challenge.concept === "role_setting" && "Assigning a role/persona to the AI"}
              {challenge.concept === "constraints" && "Setting multiple constraints"}
              {challenge.concept === "negative_constraints" && "Telling the AI what NOT to do"}
              {challenge.concept === "chain_of_thought" && "Asking the AI to think step-by-step"}
              {challenge.concept === "few_shot" && "Teaching by example (few-shot prompting)"}
              {challenge.concept === "system_design" && "Designing AI behavior rules"}
            </span>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: "12px" }}>
            {judgment !== "perfect" && attempts < 3 && (
              <button onClick={handleRetry} style={{
                flex: 1, padding: "12px", borderRadius: "8px", fontSize: "14px",
                background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-dim)",
                fontWeight: 600, cursor: "pointer",
              }}>
                🔄 Try Again ({3 - attempts} left)
              </button>
            )}
            <button onClick={handleContinue} style={{
              flex: judgment === "perfect" || attempts >= 3 ? 1 : 1, padding: "12px", borderRadius: "8px",
              fontSize: "14px", fontWeight: 700, background: "var(--accent)", color: "var(--bg)",
              border: "none", cursor: "pointer",
            }}>
              {roundNum < totalRounds ? "Next Challenge →" : "See Results →"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
