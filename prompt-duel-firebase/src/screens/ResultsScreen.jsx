// src/screens/ResultsScreen.jsx
import { useState, useEffect } from "react";
import { xpToLevel } from "../lib/api";
import { saveGameResult } from "../lib/store";

export function ResultsScreen({ user, courseId, playerName, players, roundResults, onPlayAgain, onLeaderboard }) {
  const [revealIdx, setRevealIdx] = useState(-1);
  const [showXP, setShowXP] = useState(false);
  const [saved, setSaved] = useState(false);
  const human = players.find((p) => p.isHuman);
  const { level, progress } = xpToLevel(human.xp);
  const sorted = [...players].sort((a, b) => a.rank - b.rank);

  // Save to Firestore using Firebase Auth user
  useEffect(() => {
    if (saved || !human || !user) return;
    saveGameResult(user, courseId, {
      totalScore: human.totalScore,
      xpEarned: human.xp,
      rank: human.rank,
      totalPlayers: players.length,
      roundResults,
    }).then(() => setSaved(true)).catch(console.error);
  }, []);

  // Reveal animation
  useEffect(() => {
    let i = sorted.length - 1;
    const iv = setInterval(() => {
      setRevealIdx(sorted.length - 1 - i);
      i--;
      if (i < 0) { clearInterval(iv); setTimeout(() => setShowXP(true), 600); }
    }, 300);
    return () => clearInterval(iv);
  }, []);

  const rankIcon = (r) => {
    if (r === 1) return "👑";
    if (r === 2) return "🥈";
    if (r === 3) return "🥉";
    return `#${r}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {human.rank === 1 && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/[0.04] blur-[150px] rounded-full" />}
      </div>

      <div className="relative text-center mb-10">
        <div className="text-5xl md:text-6xl font-black tracking-[-0.04em] mb-2" style={{ fontFamily: "'Oswald', system-ui",
          background: human.rank === 1 ? "linear-gradient(135deg, #fbbf24, #f59e0b, #fde68a)" : "linear-gradient(180deg, #fafafa, #a3a3a3)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          {human.rank === 1 ? "VICTORY!" : human.rank <= 3 ? "WELL PLAYED!" : "GAME OVER"}
        </div>
        <p className="text-neutral-500 text-sm">You placed #{human.rank} of {players.length}</p>
        {saved && <p className="text-[10px] text-emerald-400/50 mt-1">✓ Score saved & XP synced to PantherLearn</p>}
      </div>

      <div className="relative w-full max-w-2xl mb-10 space-y-2">
        {sorted.map((p, i) => (
          <div key={p.id} className={`flex items-center gap-4 px-5 py-3.5 rounded-xl border transition-all duration-500 ${
            i <= revealIdx ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          } ${p.isHuman ? p.rank === 1 ? "border-amber-500/25 bg-amber-500/[0.04]" : "border-orange-500/15 bg-orange-500/[0.03]" : "border-white/[0.04] bg-white/[0.015]"}`}>
            <div className="w-7 flex justify-center text-sm">{rankIcon(p.rank)}</div>
            <div className="flex-1">
              <div className={`font-bold text-sm ${p.isHuman ? "text-white" : "text-neutral-500"}`}>
                {p.name}{p.isHuman && <span className="ml-2 text-[10px] text-orange-400/60">(you)</span>}
              </div>
            </div>
            <div className={`font-mono font-bold text-lg ${p.rank === 1 ? "text-amber-400" : "text-neutral-400"}`}>{p.totalScore}</div>
          </div>
        ))}
      </div>

      {/* XP breakdown */}
      <div className={`relative w-full max-w-lg transition-all duration-700 ${showXP ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <div className="rounded-2xl border border-orange-500/15 bg-orange-500/[0.03] p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-orange-400 uppercase tracking-wider">⚡ XP Earned</span>
            <div className="text-2xl font-mono font-black text-orange-400">+{human.xp}</div>
          </div>
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-neutral-500">Level {level}</span>
              <span className="text-neutral-600">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 rounded-full bg-black/30 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${progress}%`, background: "linear-gradient(90deg, #f97316, #fb923c)" }} />
            </div>
          </div>
          <div className="space-y-1.5">
            {roundResults.map((rr, i) => {
              const improved = rr.iterations.length > 1 && rr.iterations[rr.iterations.length - 1].score > rr.iterations[0].score;
              return (
                <div key={i} className="flex items-center justify-between text-xs px-3 py-2 rounded-lg bg-black/20">
                  <span className="text-neutral-500">Round {rr.round}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-neutral-600 font-mono">{rr.iterations.length} tries</span>
                    {improved && <span className="text-emerald-400">📈</span>}
                    <span className="font-mono text-neutral-300">{rr.bestScore}/10</span>
                    <span className="text-orange-400 font-mono">+{rr.bestScore * 15} xp</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-orange-500/10 text-center">
            <p className="text-[10px] text-orange-400/40">🐾 XP synced to your PantherLearn profile</p>
          </div>
        </div>
      </div>

      <div className={`flex gap-3 mt-8 transition-all duration-500 ${showXP ? "opacity-100" : "opacity-0"}`}>
        <button onClick={onPlayAgain}
          className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] text-white"
          style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}>
          🔄 PLAY AGAIN
        </button>
        <button onClick={onLeaderboard}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm border border-amber-500/20 bg-amber-500/[0.04] text-amber-400 hover:bg-amber-500/[0.08] transition-all">
          🏆 LEADERBOARD
        </button>
      </div>
    </div>
  );
}
