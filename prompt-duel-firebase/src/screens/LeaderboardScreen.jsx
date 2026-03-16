import { useState, useEffect } from "react";
import { getLeaderboard } from "../lib/store";
import { xpToLevel } from "../lib/api";

export function LeaderboardScreen({ players, onBack }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboard(20)
      .then(setEntries)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const rankIcon = (r) => {
    if (r === 1) return "👑";
    if (r === 2) return "🥈";
    if (r === 3) return "🥉";
    return `#${r}`;
  };

  return (
    <div className="min-h-screen relative px-4 py-8">
      <div className="relative max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="flex items-center gap-2 text-sm text-neutral-500 hover:text-white transition-colors">
            ← Back
          </button>
          <div className="flex items-center gap-2 text-amber-400">🏆 <span className="text-xs font-bold uppercase tracking-wider">Leaderboard</span></div>
          <div className="w-16" />
        </div>

        <h1 className="text-center text-4xl font-black tracking-[-0.04em] mb-8" style={{
          fontFamily: "'Oswald', system-ui",
          background: "linear-gradient(135deg, #fbbf24, #f59e0b, #fde68a)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>HALL OF FAME</h1>

        {loading ? (
          <div className="text-center py-16 text-neutral-600 text-sm">
            <span className="animate-spin inline-block mr-2">⟳</span> Loading leaderboard...
          </div>
        ) : entries.length > 0 ? (
          <div className="space-y-2">
            {entries.map((e, i) => (
              <div key={e.id} className={`flex items-center gap-4 px-5 py-3.5 rounded-xl border ${
                i === 0 ? "border-amber-500/20 bg-amber-500/[0.04]"
                : i === 1 ? "border-neutral-400/10 bg-neutral-400/[0.02]"
                : i === 2 ? "border-amber-700/10 bg-amber-700/[0.02]"
                : "border-white/[0.04] bg-white/[0.015]"
              }`}>
                <div className="w-7 flex justify-center text-sm">{rankIcon(e.rank)}</div>
                <div className="flex-1">
                  <div className="font-bold text-sm text-white/90">{e.name}</div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[10px] text-orange-400/60">⚡ Lvl {xpToLevel(e.totalXP || 0).level}</span>
                    <span className="text-[10px] text-neutral-500">{e.gamesPlayed || 0} games</span>
                    <span className="text-[10px] text-cyan-400/50">{e.totalXP || 0} XP</span>
                  </div>
                </div>
                <div className="font-mono font-bold text-sm text-amber-400">{e.bestScore || 0}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-neutral-600 text-sm">
            No games played yet. Be the first!
          </div>
        )}

        {/* Session standings if available */}
        {players.length > 0 && players[0].totalScore > 0 && (
          <>
            <h2 className="text-center text-lg font-bold text-neutral-400 mt-10 mb-4">This Session</h2>
            <div className="space-y-2">
              {[...players].sort((a, b) => a.rank - b.rank).map((p, i) => (
                <div key={p.id} className={`flex items-center gap-4 px-5 py-3 rounded-xl border ${
                  p.isHuman ? "border-orange-500/15 bg-orange-500/[0.03]" : "border-white/[0.04] bg-white/[0.015]"
                }`}>
                  <div className="w-7 flex justify-center text-sm">{rankIcon(i + 1)}</div>
                  <div className="flex-1">
                    <div className={`font-bold text-sm ${p.isHuman ? "text-orange-400" : "text-white/80"}`}>
                      {p.name}{p.isHuman && <span className="ml-2 text-[10px] opacity-60">(you)</span>}
                    </div>
                  </div>
                  <div className="font-mono font-bold text-sm text-neutral-300">{p.totalScore}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
