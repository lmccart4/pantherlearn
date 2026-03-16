import { useState } from "react";
import { CHALLENGES } from "../challenges";
import { getDifficultyColor } from "../lib/api";

export function LobbyScreen({ playerName, onStartGame, onLeaderboard }) {
  const [playerCount, setPlayerCount] = useState(4);

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center px-4 py-12">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, #f97316, transparent 70%)" }} />
        <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] rounded-full opacity-[0.03]" style={{ background: "radial-gradient(circle, #06b6d4, transparent 70%)" }} />
      </div>

      <div className="relative flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/20 bg-orange-500/5 text-orange-400 text-[11px] font-mono tracking-[0.2em] uppercase mb-8">
        ⚡ PantherLearn Module
      </div>

      <h1 className="relative text-7xl md:text-9xl font-black tracking-[-0.05em] leading-[0.85] text-center mb-4" style={{ fontFamily: "'Oswald', 'Impact', system-ui" }}>
        <span className="block" style={{ background: "linear-gradient(180deg, #fafafa 0%, #a3a3a3 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>PROMPT</span>
        <span className="block" style={{ background: "linear-gradient(135deg, #f97316 0%, #fb923c 40%, #06b6d4 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>DUEL</span>
      </h1>
      <p className="relative text-neutral-400 text-sm mb-2">
        Welcome, <span className="text-orange-400 font-bold">{playerName}</span>
      </p>
      <p className="relative text-neutral-500 text-base mb-12 text-center max-w-lg leading-relaxed" style={{ fontFamily: "'Georgia', serif" }}>
        Can you make the AI say what you want — without saying it yourself?
      </p>

      {/* How it works */}
      <div className="relative w-full max-w-3xl mb-12">
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: "👁", label: "Read the Target", desc: "See what output you're trying to get the AI to produce — but key words are BANNED" },
            { icon: "✏️", label: "Write Your Prompt", desc: "Craft instructions that guide the AI to the target without using forbidden words" },
            { icon: "⚖️", label: "Get Judged", desc: "The AI scores how close your output came — then you iterate and improve" },
          ].map((step, i) => (
            <div key={i} className="p-5 rounded-2xl border border-white/[0.04] bg-white/[0.015] group hover:border-orange-500/15 transition-all duration-500">
              <div className="text-2xl mb-3">{step.icon}</div>
              <div className="text-sm font-bold text-white/90 mb-1.5 tracking-wide">{step.label}</div>
              <div className="text-xs text-neutral-600 leading-relaxed">{step.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Rounds preview */}
      <div className="relative w-full max-w-3xl mb-10">
        <div className="flex gap-2 justify-center flex-wrap">
          {CHALLENGES.map((c, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/[0.04] bg-white/[0.015]">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getDifficultyColor(c.difficulty) }} />
              <span className="text-[11px] text-neutral-400 font-medium">{c.title}</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase" style={{
                color: getDifficultyColor(c.difficulty),
                backgroundColor: getDifficultyColor(c.difficulty) + "11",
              }}>{c.difficulty}</span>
            </div>
          ))}
        </div>
        <p className="text-center text-[11px] text-neutral-700 mt-3">{CHALLENGES.length} rounds · 2-3 iterations each · Banned words get harder</p>
      </div>

      {/* Player count */}
      <div className="relative mb-8">
        <div className="text-center mb-3 text-[10px] text-neutral-600 uppercase tracking-[0.15em]">Simulated opponents</div>
        <div className="flex justify-center gap-2">
          {[2, 3, 4, 5, 6].map((n) => (
            <button key={n} onClick={() => setPlayerCount(n)}
              className={`w-11 h-11 rounded-xl border text-sm font-bold transition-all ${
                playerCount === n
                  ? "border-orange-500/40 bg-orange-500/10 text-orange-400"
                  : "border-white/[0.06] bg-white/[0.02] text-neutral-600 hover:text-white"
              }`}>{n}</button>
          ))}
        </div>
      </div>

      <div className="relative flex flex-col items-center gap-3">
        <button onClick={() => onStartGame(playerCount)}
          className="group relative px-12 py-4 rounded-2xl font-black text-lg tracking-wide overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] text-white"
          style={{ background: "linear-gradient(135deg, #f97316, #ea580c)", boxShadow: "0 0 50px rgba(249,115,22,0.12), 0 4px 24px rgba(0,0,0,0.4)" }}>
          <span className="relative z-10 flex items-center gap-2.5">⚔️ START GAME</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </button>
        <button onClick={onLeaderboard} className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs text-neutral-500 hover:text-orange-400 border border-white/[0.04] hover:border-orange-500/20 transition-all">
          🏆 Leaderboard
        </button>
      </div>
    </div>
  );
}
