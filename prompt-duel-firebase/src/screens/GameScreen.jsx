import { useState, useEffect, useRef, useCallback } from "react";
import { generateFromPrompt, judgeOutput, findBannedWords, getDifficultyColor } from "../lib/api";

export function GameScreen({ challenge, round, totalRounds, players, onRoundComplete }) {
  const [phase, setPhase] = useState("reveal"); // reveal | write | generating | judging | feedback | complete
  const [prompt, setPrompt] = useState("");
  const [timeLeft, setTimeLeft] = useState(challenge.timeLimit);
  const [timerActive, setTimerActive] = useState(false);
  const [iteration, setIteration] = useState(0);
  const [iterations, setIterations] = useState([]);
  const [currentResult, setCurrentResult] = useState(null);
  const [bannedViolations, setBannedViolations] = useState([]);
  const [showTarget, setShowTarget] = useState(true);
  const [showHint, setShowHint] = useState(false);
  const timerRef = useRef(null);
  const textareaRef = useRef(null);
  const submitRef = useRef(null);

  // Store handleSubmit in ref so timer callback always has latest
  submitRef.current = async (timedOut = false) => {
    if (phase !== "write" && !timedOut) return;
    setTimerActive(false);
    if (timerRef.current) clearInterval(timerRef.current);

    const cleanPrompt = prompt.trim();

    if (!cleanPrompt) {
      const emptyResult = {
        prompt: "(no prompt submitted)", output: "(no output generated)",
        score: 0, feedback: "Time ran out before a prompt was submitted.",
        matchedConcepts: [], missedConcepts: [],
      };
      const newIterations = [...iterations, emptyResult];
      setIterations(newIterations);
      setCurrentResult(emptyResult);
      setPhase("complete");
      onRoundComplete(0, newIterations);
      return;
    }

    setPhase("generating");
    try {
      const output = await generateFromPrompt(cleanPrompt, challenge);
      setPhase("judging");
      const judgment = await judgeOutput(challenge, cleanPrompt, output);

      const result = {
        prompt: cleanPrompt, output,
        score: judgment.score, feedback: judgment.feedback,
        matchedConcepts: judgment.matched, missedConcepts: judgment.missed,
      };

      const newIterations = [...iterations, result];
      setIterations(newIterations);
      setCurrentResult(result);
      setIteration((i) => i + 1);

      if (iteration + 1 >= challenge.maxIterations || judgment.score >= 9) {
        setPhase("complete");
        const best = Math.max(...newIterations.map((i) => i.score));
        onRoundComplete(best, newIterations);
      } else {
        setPhase("feedback");
      }
    } catch (err) {
      console.error("Generation error:", err);
      setPhase("write");
      setTimerActive(true);
    }
  };

  // Reset on new challenge
  useEffect(() => {
    setPhase("reveal"); setPrompt(""); setTimeLeft(challenge.timeLimit);
    setTimerActive(false); setIteration(0); setIterations([]);
    setCurrentResult(null); setBannedViolations([]); setShowTarget(true); setShowHint(false);
  }, [challenge]);

  // Timer
  useEffect(() => {
    if (!timerActive) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setTimerActive(false);
          submitRef.current(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerActive]);

  const handlePromptChange = useCallback((text) => {
    setPrompt(text);
    setBannedViolations(findBannedWords(text, challenge.bannedWords));
  }, [challenge.bannedWords]);

  const startWriting = useCallback(() => {
    setPhase("write");
    setTimerActive(true);
    setTimeout(() => textareaRef.current?.focus(), 100);
  }, []);

  const startNextIteration = useCallback(() => {
    setTimeLeft(challenge.timeLimit);
    setPhase("write");
    setTimerActive(true);
    setCurrentResult(null);
    setBannedViolations([]);
    setTimeout(() => textareaRef.current?.focus(), 100);
  }, [challenge.timeLimit]);

  const timerPct = (timeLeft / challenge.timeLimit) * 100;
  const isUrgent = timeLeft <= 15;
  const diffColor = getDifficultyColor(challenge.difficulty);
  const bestSoFar = iterations.length > 0 ? Math.max(...iterations.map((i) => i.score)) : 0;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="sticky top-0 z-50 border-b border-white/[0.04] bg-[#09090f]/95 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {Array.from({ length: totalRounds }).map((_, i) => (
                <div key={i} className="h-1 w-8 rounded-full transition-all" style={{
                  backgroundColor: i < round - 1 ? "#f97316" : i === round - 1 ? diffColor : "rgba(255,255,255,0.05)",
                }} />
              ))}
            </div>
            <span className="text-[10px] font-mono text-neutral-600">R{round}/{totalRounds}</span>
            <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider" style={{
              color: diffColor, backgroundColor: diffColor + "15", border: `1px solid ${diffColor}25`,
            }}>{challenge.difficulty}</span>
          </div>

          {phase === "write" && (
            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border transition-all ${
              isUrgent ? "border-red-500/40 bg-red-500/10 text-red-400 animate-pulse" : "border-white/[0.08] bg-white/[0.02] text-neutral-300"
            }`}>
              ⏱ <span className="font-mono font-bold text-sm tabular-nums">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}</span>
            </div>
          )}

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-[8px] text-neutral-700 uppercase tracking-[0.15em]">Attempt</div>
              <div className="text-sm font-bold text-orange-400 font-mono">{iteration}/{challenge.maxIterations}</div>
            </div>
            <div className="text-right">
              <div className="text-[8px] text-neutral-700 uppercase tracking-[0.15em]">Best</div>
              <div className="text-sm font-bold text-cyan-400 font-mono">{bestSoFar}/10</div>
            </div>
          </div>
        </div>
        {phase === "write" && (
          <div className="h-0.5 bg-white/[0.03]">
            <div className="h-full transition-all duration-1000 ease-linear rounded-r-full" style={{
              width: `${timerPct}%`,
              backgroundColor: isUrgent ? "#ef4444" : timerPct > 50 ? "#f97316" : "#f59e0b",
            }} />
          </div>
        )}
      </div>

      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        {/* ── REVEAL ── */}
        {phase === "reveal" && (
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div>
              <h2 className="text-3xl font-black tracking-tight mb-2" style={{ fontFamily: "'Oswald', system-ui" }}>{challenge.title}</h2>
              <p className="text-neutral-500 text-sm">{challenge.description}</p>
            </div>
            <div className="text-left">
              <div className="text-[10px] text-neutral-600 uppercase tracking-[0.15em] mb-2">Target Output</div>
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-sm leading-relaxed text-neutral-300 whitespace-pre-wrap" style={{ fontFamily: "'Georgia', serif" }}>
                {challenge.targetOutput}
              </div>
            </div>
            <div className="text-left">
              <div className="text-[10px] text-red-400/70 uppercase tracking-[0.15em] mb-2 flex items-center gap-1.5">
                🚫 Banned Words
              </div>
              <div className="flex flex-wrap gap-1.5">
                {challenge.bannedWords.map((w, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-red-500/[0.06] border border-red-500/15 text-red-400/80 text-xs font-mono">{w}</span>
                ))}
              </div>
              <p className="text-[11px] text-neutral-600 mt-2">You cannot use these words in your prompt. Describe what you want another way.</p>
            </div>
            <button onClick={startWriting}
              className="px-10 py-3.5 rounded-2xl font-bold text-sm tracking-wide transition-all hover:scale-[1.02] active:scale-[0.98] text-white"
              style={{ background: "linear-gradient(135deg, #f97316, #ea580c)", boxShadow: "0 0 40px rgba(249,115,22,0.1)" }}>
              <span className="flex items-center gap-2">▶ Start Writing — {challenge.timeLimit}s</span>
            </button>
          </div>
        )}

        {/* ── WRITE / GENERATING / JUDGING ── */}
        {(phase === "write" || phase === "generating" || phase === "judging") && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
            <div className="space-y-4">
              {/* Target toggle */}
              <div className="rounded-2xl border border-white/[0.04] bg-white/[0.015] overflow-hidden">
                <button onClick={() => setShowTarget(!showTarget)}
                  className="w-full px-5 py-3 flex items-center justify-between hover:bg-white/[0.01] transition-colors">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">🎯 Target Output</span>
                  <span className="text-neutral-600 text-xs">{showTarget ? "hide" : "show"}</span>
                </button>
                {showTarget && (
                  <div className="px-5 pb-4">
                    <div className="p-4 rounded-xl bg-black/30 border border-white/[0.04] text-sm leading-relaxed text-neutral-400 max-h-32 overflow-y-auto whitespace-pre-wrap" style={{ fontFamily: "'Georgia', serif" }}>
                      {challenge.targetOutput}
                    </div>
                  </div>
                )}
              </div>

              {/* Prompt editor */}
              <div className="rounded-2xl border border-orange-500/10 bg-orange-500/[0.015] p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-orange-400/80 uppercase tracking-wider">Your Prompt</span>
                  <span className="text-[10px] text-neutral-600 font-mono">{prompt.length} chars</span>
                </div>
                <textarea ref={textareaRef} value={prompt}
                  onChange={(e) => handlePromptChange(e.target.value)}
                  disabled={phase !== "write"}
                  placeholder="Write your prompt here... Describe what you want the AI to produce, without using the banned words."
                  className="w-full h-40 px-4 py-3 rounded-xl bg-black/30 border border-white/[0.06] text-sm text-neutral-200 placeholder:text-neutral-700 outline-none focus:border-orange-500/30 transition-colors resize-none leading-relaxed disabled:opacity-50"
                  style={{ fontFamily: "'Georgia', serif" }}
                />

                {bannedViolations.length > 0 && (
                  <div className="mt-2 flex items-start gap-2 p-3 rounded-xl bg-red-500/[0.06] border border-red-500/15">
                    <span className="text-red-400 mt-0.5 shrink-0">⚠</span>
                    <div>
                      <p className="text-[11px] text-red-400 font-medium">Banned words detected!</p>
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {bannedViolations.map((w, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] font-mono">{w}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <button onClick={() => submitRef.current(false)}
                  disabled={phase !== "write" || !prompt.trim() || bannedViolations.length > 0}
                  className="mt-3 w-full py-3 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all disabled:opacity-25 disabled:cursor-not-allowed hover:brightness-110 active:scale-[0.98] text-white"
                  style={{ background: bannedViolations.length > 0 ? "#374151" : "linear-gradient(135deg, #f97316, #ea580c)" }}>
                  {phase === "generating" ? <><span className="animate-spin">⟳</span> AI is writing...</>
                  : phase === "judging" ? <><span className="animate-spin">⟳</span> Judging output...</>
                  : <>📤 Submit Prompt</>}
                </button>
              </div>

              {/* Previous iterations */}
              {iterations.length > 0 && (
                <div className="rounded-2xl border border-white/[0.04] bg-white/[0.015] p-5">
                  <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider">Previous Attempts</span>
                  <div className="mt-3 space-y-3">
                    {iterations.map((it, i) => (
                      <div key={i} className="p-3 rounded-xl bg-black/20 border border-white/[0.04]">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-neutral-500">Attempt {i + 1}</span>
                          <span className="text-xs font-mono font-bold" style={{ color: it.score >= 7 ? "#22c55e" : it.score >= 4 ? "#f59e0b" : "#ef4444" }}>{it.score}/10</span>
                        </div>
                        <p className="text-[11px] text-neutral-500 italic leading-relaxed line-clamp-2">"{it.prompt}"</p>
                        <p className="text-[10px] text-cyan-400/60 mt-1">{it.feedback}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-red-500/10 bg-red-500/[0.015] p-4">
                <div className="text-[10px] text-red-400/60 uppercase tracking-wider font-bold mb-2 flex items-center gap-1.5">🚫 Banned Words</div>
                <div className="flex flex-wrap gap-1">
                  {challenge.bannedWords.map((w, i) => (
                    <span key={i} className={`px-2 py-0.5 rounded-md text-[10px] font-mono border ${
                      bannedViolations.includes(w) ? "bg-red-500/20 border-red-500/30 text-red-400" : "bg-red-500/[0.04] border-red-500/10 text-red-400/50"
                    }`}>{w}</span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-amber-500/10 bg-amber-500/[0.015] p-4">
                <button onClick={() => setShowHint(!showHint)}
                  className="flex items-center gap-2 text-[10px] text-amber-400/60 uppercase tracking-wider font-bold w-full">
                  💡 {showHint ? "Hints" : "Need a hint?"}
                </button>
                {showHint && (
                  <ul className="mt-2 space-y-1.5">
                    {challenge.hints.map((h, i) => (
                      <li key={i} className="text-[11px] text-neutral-500 leading-relaxed flex gap-2">
                        <span className="text-amber-500/40 shrink-0">•</span>{h}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="rounded-2xl border border-white/[0.04] bg-white/[0.015] p-4">
                <div className="text-[10px] text-neutral-600 uppercase tracking-wider font-bold mb-3">Live Standings</div>
                <div className="space-y-1.5">
                  {[...players].sort((a, b) => b.totalScore - a.totalScore).slice(0, 6).map((p, i) => (
                    <div key={p.id} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs ${
                      p.isHuman ? "bg-orange-500/[0.06] border border-orange-500/10 text-orange-400" : "text-neutral-600"
                    }`}>
                      <span className="w-3 font-mono font-bold text-[10px]">{i + 1}</span>
                      <span className="flex-1 truncate">{p.name}</span>
                      <span className="font-mono font-bold">{p.totalScore}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── FEEDBACK ── */}
        {phase === "feedback" && currentResult && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-4" style={{
                borderColor: currentResult.score >= 7 ? "#22c55e33" : currentResult.score >= 4 ? "#f59e0b33" : "#ef444433",
                backgroundColor: currentResult.score >= 7 ? "#22c55e08" : currentResult.score >= 4 ? "#f59e0b08" : "#ef444408",
                color: currentResult.score >= 7 ? "#22c55e" : currentResult.score >= 4 ? "#f59e0b" : "#ef4444",
              }}>
                <span className="text-sm font-bold">✨ Score: {currentResult.score}/10</span>
              </div>
              <p className="text-neutral-400 text-sm">{currentResult.feedback}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[10px] text-cyan-400/60 uppercase tracking-wider font-bold mb-2">🎯 Target</div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-cyan-500/10 text-sm leading-relaxed text-neutral-400 whitespace-pre-wrap max-h-52 overflow-y-auto" style={{ fontFamily: "'Georgia', serif" }}>
                  {challenge.targetOutput}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-orange-400/60 uppercase tracking-wider font-bold mb-2">🤖 Your Output</div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-orange-500/10 text-sm leading-relaxed text-neutral-400 whitespace-pre-wrap max-h-52 overflow-y-auto" style={{ fontFamily: "'Georgia', serif" }}>
                  {currentResult.output}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {currentResult.matchedConcepts.length > 0 && (
                <div>
                  <div className="text-[10px] text-emerald-400/60 uppercase tracking-wider font-bold mb-1.5">✓ Matched</div>
                  <div className="flex flex-wrap gap-1">
                    {currentResult.matchedConcepts.map((c, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-emerald-500/[0.06] border border-emerald-500/15 text-emerald-400/70 text-[10px]">{c}</span>
                    ))}
                  </div>
                </div>
              )}
              {currentResult.missedConcepts.length > 0 && (
                <div>
                  <div className="text-[10px] text-red-400/60 uppercase tracking-wider font-bold mb-1.5">✗ Missed</div>
                  <div className="flex flex-wrap gap-1">
                    {currentResult.missedConcepts.map((c, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-red-500/[0.06] border border-red-500/15 text-red-400/60 text-[10px]">{c}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="text-center">
              <p className="text-[11px] text-neutral-600 mb-4">
                Iteration {iteration} of {challenge.maxIterations} — revise your prompt using the feedback
              </p>
              <button onClick={startNextIteration}
                className="px-8 py-3 rounded-xl font-bold text-sm tracking-wide transition-all hover:scale-[1.02] active:scale-[0.98] text-white"
                style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}>
                🔄 Revise Prompt ({challenge.maxIterations - iteration} left)
              </button>
            </div>
          </div>
        )}

        {/* ── COMPLETE ── */}
        {phase === "complete" && currentResult && (
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="text-4xl font-black tracking-tight" style={{ fontFamily: "'Oswald', system-ui" }}>
              <span style={{ color: bestSoFar >= 7 ? "#22c55e" : bestSoFar >= 4 ? "#f59e0b" : "#ef4444" }}>
                {bestSoFar}/10
              </span>
            </div>
            <p className="text-neutral-500 text-sm">
              {bestSoFar >= 9 ? "Perfect! Your prompt engineering is exceptional." :
               bestSoFar >= 7 ? "Great work! You captured most of the target." :
               bestSoFar >= 4 ? "Solid attempt. Review what you missed for next round." :
               "Tough round. The feedback shows what to focus on."}
            </p>
            <div className="flex items-center justify-center gap-2 pt-4">
              <span className="animate-spin text-neutral-600">⟳</span>
              <span className="text-xs text-neutral-600">Loading next round...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
