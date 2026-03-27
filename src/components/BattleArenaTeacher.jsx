// src/components/BattleArenaTeacher.jsx
// Phase 4: Game Master dashboard for v2 boss battles
// Desktop-optimized, dark command-center theme, dense information layout

import { useState, useEffect, useRef, useCallback } from "react";
import PixelAvatar from "./PixelAvatar";
import { BossArt, DamageNumber, ParticleField, HitExplosion, ScreenFlash, BOSS_THEMES, BATTLE_CSS } from "./BattleEffects";
import { CLASSES } from "../lib/avatar";
import { triggerBossEvent, endBattle } from "../lib/bossBattle";

// ─── Color constants ───
const BG = "#0D1B2A";
const SURFACE = "#1B2838";
const ACCENT = "#02C39A";

// ─── HP Bar (teacher-sized) ───
function HPBar({ label, icon, current, max, colorLow, colorMid, colorHigh, height = 22, glow, large }) {
  const pct = max > 0 ? (current / max) * 100 : 0;
  const color = pct > 50 ? colorHigh : pct > 25 ? colorMid : colorLow;
  return (
    <div style={{ marginBottom: large ? 8 : 4 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: large ? 13 : 11, fontWeight: 700, marginBottom: 3 }}>
        <span style={{ color: colorHigh }}>{icon} {label}</span>
        <span style={{ color: pct < 25 ? colorLow : "rgba(255,255,255,0.6)", fontFamily: "var(--font-display)", fontSize: large ? 16 : 13 }}>{current}/{max}</span>
      </div>
      <div style={{
        height, background: "rgba(0,0,0,0.5)", borderRadius: height / 2,
        overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)",
      }}>
        <div style={{
          width: `${pct}%`, height: "100%",
          background: `linear-gradient(90deg, ${color}, ${colorHigh})`,
          borderRadius: height / 2,
          transition: "width 0.6s ease",
          boxShadow: glow ? `0 0 16px ${colorHigh}66` : "none",
          position: "relative",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 50%)",
            borderRadius: height / 2,
          }} />
        </div>
      </div>
    </div>
  );
}

// ─── Boss Event Button ───
function BossEventButton({ icon, label, color, glowColor, onClick, disabled }) {
  const [pulse, setPulse] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    onClick();
    setPulse(true);
    setTimeout(() => setPulse(false), 600);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      style={{
        padding: "10px 18px",
        borderRadius: 10,
        border: `1.5px solid ${disabled ? `${color}33` : `${color}88`}`,
        background: disabled ? `${color}0D` : `${color}22`,
        color: disabled ? `${color}55` : color,
        fontWeight: 700,
        fontSize: 13,
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.4 : 1,
        transition: "transform 0.1s, box-shadow 0.2s, background 0.2s",
        fontFamily: "'Nunito', var(--font-body), sans-serif",
        display: "flex",
        alignItems: "center",
        gap: 6,
        minHeight: 44,
        position: "relative",
        boxShadow: pulse ? `0 0 20px ${glowColor || color}66` : "none",
        animation: pulse ? "bossEventPulse 0.6s ease-out" : "none",
        transform: pulse ? "scale(1.05)" : "scale(1)",
      }}
    >
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

// ─── Team Card ───
function TeamCard({ teamId, team, players, totalQuestions, expanded, onToggle }) {
  const teamPlayers = players ? Object.entries(players).filter(([, p]) => p.teamId === teamId) : [];
  const finishedCount = teamPlayers.filter(([, p]) => p.finished).length;
  const totalPlayers = team.playerCount || teamPlayers.length;
  const pctComplete = totalPlayers > 0 ? Math.round((finishedCount / totalPlayers) * 100) : 0;

  // Aggregate from team summaries (faster) with player fallback
  const damage = team.damage || 0;
  const correctCount = team.correctCount || 0;
  const wrongCount = team.wrongCount || 0;

  return (
    <div style={{
      background: "rgba(0,0,0,0.35)",
      border: `1px solid ${team.color}44`,
      borderRadius: 12,
      overflow: "hidden",
    }}>
      {/* Header (always visible) */}
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          padding: "12px 14px",
          display: "flex", alignItems: "center", gap: 10,
          background: "transparent", border: "none", cursor: "pointer", color: "#fff",
          textAlign: "left",
        }}
      >
        <div style={{
          width: 10, height: 10, borderRadius: "50%",
          background: team.color,
          boxShadow: `0 0 8px ${team.color}66`,
          flexShrink: 0,
        }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: team.color, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {team.name}
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>
            {correctCount}✓ {wrongCount}✗ · {finishedCount}/{totalPlayers} done
          </div>
        </div>
        <div style={{
          fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 900, color: "#fff",
          textShadow: `0 0 8px ${team.color}44`,
        }}>
          {damage}
        </div>
        <span style={{
          fontSize: 10, color: "rgba(255,255,255,0.3)",
          transition: "transform 0.2s",
          transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
        }}>▼</span>
      </button>

      {/* Progress bar */}
      <div style={{ padding: "0 14px 8px" }}>
        <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2 }}>
          <div style={{
            width: `${pctComplete}%`, height: "100%",
            background: team.color, borderRadius: 2,
            transition: "width 0.5s ease",
          }} />
        </div>
      </div>

      {/* Expanded: player roster */}
      {expanded && (
        <div style={{ padding: "4px 12px 12px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          {teamPlayers.length === 0 && (
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", padding: "8px 0", textAlign: "center" }}>No players</div>
          )}
          {teamPlayers
            .sort((a, b) => (b[1].damage || 0) - (a[1].damage || 0))
            .map(([uid, player]) => {
              const avatarData = player.avatar ? {
                classId: player.classId || "mage",
                skinTone: player.avatar.skinTone || "medium",
                hairColor: player.avatar.hairColor || "black",
                eyeColor: player.avatar.eyeColor || "brown",
                petId: null,
                accessory: player.avatar.accessory || "none",
                specialPower: player.avatar.specialPower || "none",
              } : {
                classId: player.classId || "mage",
                skinTone: "medium", hairColor: "black", eyeColor: "brown",
                petId: null, accessory: "none", specialPower: "none",
              };
              const classId = player.classId || "mage";
              const classInfo = CLASSES[classId] || {};
              const qProgress = player.questionOrder ? `Q${player.currentIndex || 0}/${player.questionOrder.length}` : "";
              const streak = player.streak || 0;
              const buffs = player.buffs || [];
              const classCD = player.abilities?.classAbility?.cooldownRemaining || 0;

              return (
                <div key={uid} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "6px 4px",
                  borderBottom: "1px solid rgba(255,255,255,0.03)",
                }}>
                  <div style={{ flexShrink: 0, width: 32, height: 32 }}>
                    <PixelAvatar avatar={avatarData} level={1} size={32} animate={false} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 12, fontWeight: 600, color: "#fff",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {player.displayName || "Student"}
                    </div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>
                      {classInfo.icon || "?"} {classInfo.name || classId} · {qProgress}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                    {streak >= 2 && (
                      <span style={{
                        fontSize: 10, padding: "2px 5px", borderRadius: 4,
                        background: "rgba(255,150,50,0.15)", color: "#ff9632", fontWeight: 700,
                      }}>
                        🔥{streak}
                      </span>
                    )}
                    {buffs.length > 0 && (
                      <span style={{
                        fontSize: 10, padding: "2px 5px", borderRadius: 4,
                        background: "rgba(168,85,247,0.15)", color: "#c084fc", fontWeight: 700,
                      }}>
                        ✨{buffs.length}
                      </span>
                    )}
                    <span style={{
                      fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 800, color: "#e74c3c",
                    }}>
                      {player.damage || 0}
                    </span>
                    {player.finished && (
                      <span style={{ fontSize: 12 }}>✅</span>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

// ─── Live Feed ───
function LiveFeed({ log }) {
  const feedRef = useRef(null);
  const prevLenRef = useRef(0);

  useEffect(() => {
    if (log.length > prevLenRef.current && feedRef.current) {
      feedRef.current.scrollTop = 0;
    }
    prevLenRef.current = log.length;
  }, [log.length]);

  const getEntryColor = (entry) => {
    if (entry.type === "boss_event") return "#ff9632";
    if (entry.type === "attack") return "#2ecc71";
    if (entry.type === "miss") return "#e74c3c";
    if (entry.type === "ability") return "#c084fc";
    return "rgba(255,255,255,0.5)";
  };

  const getEntryIcon = (entry) => {
    if (entry.type === "boss_event") return "🎲";
    if (entry.type === "attack") return "⚔️";
    if (entry.type === "miss") return "❌";
    if (entry.type === "ability") return entry.abilityIcon || "✨";
    return "📜";
  };

  return (
    <div style={{
      background: "rgba(0,0,0,0.35)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 12,
      padding: "12px 14px",
    }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>
        📜 Live Feed
      </div>
      <div
        ref={feedRef}
        style={{
          maxHeight: 280,
          overflowY: "auto",
          scrollBehavior: "smooth",
        }}
      >
        {log.slice(0, 20).map((entry, i) => {
          const entryColor = getEntryColor(entry);
          const time = entry.timestamp ? new Date(entry.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "";
          return (
            <div key={i} style={{
              display: "flex", gap: 8, alignItems: "flex-start",
              padding: "5px 0",
              borderBottom: "1px solid rgba(255,255,255,0.03)",
              fontSize: 12,
              animation: i === 0 ? "feedEntryIn 0.3s ease-out" : "none",
            }}>
              <span style={{
                fontSize: 9, color: "rgba(255,255,255,0.25)",
                minWidth: 52, flexShrink: 0, paddingTop: 2,
                fontFamily: "monospace",
              }}>{time}</span>
              {entry.teamColor && (
                <span style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: entry.teamColor,
                  flexShrink: 0, marginTop: 5,
                }} />
              )}
              <span style={{ color: entryColor }}>
                {getEntryIcon(entry)}{" "}
                {entry.type === "attack" && (
                  <><span style={{ color: "#fff", fontWeight: 600 }}>{entry.playerName || entry.team}</span> dealt <strong>{entry.damage}</strong> damage{entry.criticalHit ? " 💥 CRIT!" : ""}</>
                )}
                {entry.type === "miss" && (
                  <><span style={{ color: "#fff", fontWeight: 600 }}>{entry.playerName || entry.team}</span>{entry.shielded ? " 🛡️ Shield blocked!" : entry.dodged ? " 💨 Dodged!" : ` missed! -${entry.classDamage || 1} class HP`}</>
                )}
                {entry.type === "ability" && (
                  <><span style={{ color: "#fff", fontWeight: 600 }}>{entry.playerName || entry.team}</span> used {entry.ability}{entry.description ? ` — ${entry.description}` : ""}</>
                )}
                {entry.type === "boss_event" && (
                  <span style={{ fontWeight: 600 }}>{entry.description || entry.eventType}</span>
                )}
              </span>
            </div>
          );
        })}
        {log.length === 0 && (
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", textAlign: "center", padding: 20 }}>
            Waiting for battle activity...
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Confirm Dialog ───
function ConfirmDialog({ title, message, confirmLabel, confirmColor, onConfirm, onCancel, children }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 500,
      background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        background: SURFACE, border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 16, padding: "24px 28px", maxWidth: 400, width: "90%",
      }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{title}</div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 16 }}>{message}</div>
        {children}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }}>
          <button onClick={onCancel} style={{
            padding: "8px 16px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)",
            background: "transparent", color: "rgba(255,255,255,0.6)", fontWeight: 600, fontSize: 13, cursor: "pointer",
          }}>Cancel</button>
          <button onClick={onConfirm} style={{
            padding: "8px 16px", borderRadius: 8, border: "none",
            background: confirmColor || "#e74c3c", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer",
          }}>{confirmLabel || "Confirm"}</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════
export default function BattleArenaTeacher({
  battle,
  allPlayers,
  courseId,
  user,
  navigate,
  onNewBattle,
}) {
  // ─── Local state ───
  const [expandedTeams, setExpandedTeams] = useState({});
  const [confirmDialog, setConfirmDialog] = useState(null); // { type, ... }
  const [healAmount, setHealAmount] = useState(3);
  const [enrageDamage, setEnrageDamage] = useState(2);
  const [endReason, setEndReason] = useState("");

  // Effect state
  const [damageNumbers, setDamageNumbers] = useState([]);
  const [animatingDamage, setAnimatingDamage] = useState(false);
  const [showExplosion, setShowExplosion] = useState(false);
  const [shakeScreen, setShakeScreen] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [flashColor, setFlashColor] = useState("#e74c3c");
  const prevBossHP = useRef(null);
  const prevClassHP = useRef(null);

  // React to HP changes
  useEffect(() => {
    if (!battle) return;
    if (prevBossHP.current !== null && battle.boss.currentHP < prevBossHP.current) {
      setAnimatingDamage(true);
      setShowExplosion(true);
      const dmg = prevBossHP.current - battle.boss.currentHP;
      setDamageNumbers((prev) => [...prev, {
        id: Date.now(), amount: dmg, isCrit: dmg >= 4,
        x: `${40 + Math.random() * 20}%`, y: `${10 + Math.random() * 10}%`,
      }]);
      setTimeout(() => { setAnimatingDamage(false); setShowExplosion(false); }, 700);
      setTimeout(() => setDamageNumbers((prev) => prev.filter((d) => Date.now() - d.id < 1500)), 2000);
    }
    if (prevClassHP.current !== null && battle.classHP.current < prevClassHP.current) {
      setShakeScreen(true);
      setShowFlash(true);
      setFlashColor("#8b1a1a");
      setTimeout(() => { setShakeScreen(false); setShowFlash(false); }, 600);
    }
    prevBossHP.current = battle.boss.currentHP;
    prevClassHP.current = battle.classHP.current;
  }, [battle?.boss?.currentHP, battle?.classHP?.current]);

  // ─── Boss event handlers ───
  const handleBossEvent = useCallback(async (eventType, params = {}) => {
    try {
      await triggerBossEvent(courseId, battle.id, eventType, params);
    } catch (err) {
      console.error("Boss event error:", err);
      alert("Error triggering event: " + err.message);
    }
    setConfirmDialog(null);
  }, [courseId, battle?.id]);

  const handleEndBattle = useCallback(async (status) => {
    try {
      await endBattle(courseId, battle.id, status, endReason || undefined);
    } catch (err) {
      console.error("End battle error:", err);
    }
    setConfirmDialog(null);
  }, [courseId, battle?.id, endReason]);

  // ─── Derived state ───
  const boss = battle?.boss;
  if (!boss) return null;

  const bossHpPct = (boss.currentHP / boss.maxHP) * 100;
  const classHpPct = (battle.classHP.current / battle.classHP.max) * 100;
  const theme = BOSS_THEMES[boss.id] || BOSS_THEMES.dragon;
  const isPaused = battle.status === "paused";
  const battleOver = battle.status === "victory" || battle.status === "defeat";
  const bossState = battle.bossState || {};

  const teamEntries = Object.entries(battle.teamSummaries || battle.teamProgress || {})
    .map(([id, t]) => ({ id, ...t }))
    .sort((a, b) => (b.damage || 0) - (a.damage || 0));

  // Player aggregates
  const allPlayersList = allPlayers ? Object.entries(allPlayers) : [];
  const totalDamage = allPlayersList.reduce((sum, [, p]) => sum + (p.damage || 0), 0);
  const totalCorrect = allPlayersList.reduce((sum, [, p]) => sum + (p.correctCount || 0), 0);
  const totalAbilities = allPlayersList.reduce((sum, [, p]) => {
    const used = (p.abilities?.classAbility?.lastUsed) ? 1 : 0;
    return sum + used + (p.buffs?.length || 0);
  }, 0);

  // MVP
  const mvp = allPlayersList.length > 0
    ? allPlayersList.reduce((best, [uid, p]) => (!best || (p.damage || 0) > (best[1].damage || 0)) ? [uid, p] : best, null)
    : null;

  // Boss status text
  const getBossStatus = () => {
    if (bossState.rage > 0) return { text: `ENRAGED! (${bossState.rage} left)`, color: "#e74c3c" };
    if (bossState.confusion) return { text: "Confusion Wave Active", color: "#a855f7" };
    if (bossHpPct < 25) return { text: "Critically Wounded", color: "#f39c12" };
    if (bossHpPct < 50) return { text: "Bloodied", color: "#e67e22" };
    return { text: "Normal", color: "rgba(255,255,255,0.4)" };
  };
  const bossStatus = getBossStatus();

  // ─── Victory / Defeat view ───
  if (battleOver) {
    const isVictory = battle.status === "victory";
    return (
      <div style={{
        minHeight: "100vh",
        background: isVictory
          ? "radial-gradient(ellipse at 50% 60%, #0a2a1a 0%, #0D1B2A 60%)"
          : `radial-gradient(ellipse at 50% 60%, #2a0a0a 0%, ${BG} 60%)`,
        position: "relative", overflow: "hidden",
      }}>
        <style>{BATTLE_CSS}{TEACHER_CSS}</style>
        <ParticleField
          particles={isVictory ? ["🏆", "⭐", "✨", "🎉"] : ["💀", "😈", "💨"]}
          count={25} speed={0.5}
          color={isVictory ? "#ffed4a" : "#e74c3c"}
        />

        <div style={{
          maxWidth: 800, margin: "0 auto",
          padding: "60px 30px 40px", position: "relative", zIndex: 5,
        }}>
          {/* Big title */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{
              fontSize: 80, marginBottom: 12,
              animation: isVictory ? "victoryBurst 1s ease-out" : "defeatSink 1s ease",
            }}>
              {isVictory ? "🏆" : boss.icon || "💀"}
            </div>
            <h1 style={{
              fontFamily: "var(--font-display)", fontSize: 42, fontWeight: 900,
              color: isVictory ? "#2ecc71" : "#e74c3c",
              textShadow: isVictory ? "0 0 30px rgba(46,204,113,0.5)" : "0 0 30px rgba(231,76,60,0.5)",
              marginBottom: 8,
            }}>
              {isVictory ? "VICTORY!" : "DEFEATED"}
            </h1>
          </div>

          {/* Stats row */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 24,
          }}>
            {[
              { label: "Boss HP", value: `${boss.currentHP}/${boss.maxHP}`, color: "#e74c3c" },
              { label: "Class HP", value: `${battle.classHP.current}/${battle.classHP.max}`, color: "#2ecc71" },
              { label: "Total Damage", value: totalDamage, color: "#ff9632" },
              { label: "Abilities Used", value: totalAbilities, color: "#c084fc" },
              { label: "XP Awarded", value: allPlayersList.reduce((sum, [, p]) => sum + (p.xpEarned || 0), 0), color: "#ffd700" },
            ].map((s) => (
              <div key={s.label} style={{
                padding: "14px 10px", borderRadius: 10, textAlign: "center",
                background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)",
              }}>
                <div style={{
                  fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 900,
                  color: s.color, textShadow: `0 0 10px ${s.color}44`,
                }}>{s.value}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* MVP — by damage + XP earned */}
          {mvp && (() => {
            const xpMvp = allPlayersList.length > 0
              ? allPlayersList.reduce((best, [uid, p]) => (!best || (p.xpEarned || 0) > (best[1].xpEarned || 0)) ? [uid, p] : best, null)
              : null;
            const samePlayer = xpMvp && mvp && xpMvp[0] === mvp[0];

            return (
              <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                {/* Damage MVP */}
                <div style={{
                  flex: 1,
                  background: "rgba(255,215,0,0.08)", border: "1px solid rgba(255,215,0,0.3)",
                  borderRadius: 12, padding: "14px 18px",
                  display: "flex", alignItems: "center", gap: 12,
                }}>
                  <span style={{ fontSize: 28 }}>🏅</span>
                  <div>
                    <div style={{ fontSize: 11, color: "rgba(255,215,0,0.6)", fontWeight: 700 }}>
                      {samePlayer ? "MVP" : "Damage MVP"}
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#ffd700" }}>{mvp[1].displayName || "Student"}</div>
                  </div>
                  <div style={{ marginLeft: "auto", textAlign: "right" }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 900, color: "#e74c3c" }}>
                      {mvp[1].damage || 0}
                    </div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>damage</div>
                    {mvp[1].xpEarned > 0 && (
                      <div style={{ fontSize: 10, color: "#ffd700" }}>{mvp[1].xpEarned} XP</div>
                    )}
                  </div>
                </div>

                {/* XP MVP (only if different from damage MVP) */}
                {xpMvp && !samePlayer && (xpMvp[1].xpEarned || 0) > 0 && (
                  <div style={{
                    flex: 1,
                    background: "rgba(255,215,0,0.05)", border: "1px solid rgba(255,215,0,0.2)",
                    borderRadius: 12, padding: "14px 18px",
                    display: "flex", alignItems: "center", gap: 12,
                  }}>
                    <span style={{ fontSize: 28 }}>&#11088;</span>
                    <div>
                      <div style={{ fontSize: 11, color: "rgba(255,215,0,0.6)", fontWeight: 700 }}>XP MVP</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "#ffd700" }}>{xpMvp[1].displayName || "Student"}</div>
                    </div>
                    <div style={{ marginLeft: "auto", textAlign: "right" }}>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 900, color: "#ffd700" }}>
                        {xpMvp[1].xpEarned || 0}
                      </div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>XP earned</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Team rankings */}
          <div style={{
            background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, padding: "16px 18px", marginBottom: 24,
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 12 }}>
              🏅 Team Rankings
            </div>
            {teamEntries.map((team, i) => {
              const medals = ["🥇", "🥈", "🥉"];
              return (
                <div key={team.id} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 12px", marginBottom: 4, borderRadius: 8,
                  background: i === 0 ? `${team.color}18` : "transparent",
                  border: i === 0 ? `1px solid ${team.color}44` : "1px solid transparent",
                }}>
                  <span style={{ fontSize: 18, width: 28, textAlign: "center" }}>{medals[i] || `${i + 1}.`}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: team.color }}>{team.name}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
                      {team.correctCount || 0}✓ · {team.wrongCount || 0}✗
                    </div>
                  </div>
                  <div style={{
                    fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 900, color: "#fff",
                    textShadow: `0 0 8px ${team.color}44`,
                  }}>{team.damage || 0}</div>
                </div>
              );
            })}
          </div>

          {/* Per-student XP Roster */}
          {allPlayersList.some(([, p]) => p.xpEarned > 0) && (
            <div style={{
              background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,215,0,0.15)",
              borderRadius: 12, padding: "16px 18px", marginBottom: 24,
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,215,0,0.7)", marginBottom: 12 }}>
                &#11088; XP Rewards
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {allPlayersList
                  .filter(([, p]) => p.xpEarned > 0)
                  .sort((a, b) => (b[1].xpEarned || 0) - (a[1].xpEarned || 0))
                  .map(([uid, p], i) => {
                    const teamData = battle.teamSummaries?.[p.teamId] || battle.teamProgress?.[p.teamId] || {};
                    return (
                      <div key={uid} style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "8px 10px", borderRadius: 6,
                        background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                      }}>
                        <div style={{
                          width: 6, height: 6, borderRadius: "50%",
                          background: teamData.color || "#888", flexShrink: 0,
                        }} />
                        <div style={{ flex: 1, fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
                          {p.displayName || "Student"}
                        </div>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginRight: 6 }}>
                          {p.damage || 0} dmg · {p.correctCount || 0}✓
                        </div>
                        <div style={{
                          fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 900,
                          color: "#ffd700", minWidth: 50, textAlign: "right",
                        }}>
                          {p.xpEarned} XP
                        </div>
                        {p.leveledUp && (
                          <span style={{
                            fontSize: 10, padding: "2px 6px", borderRadius: 4,
                            background: "rgba(46,204,113,0.2)", color: "#2ecc71", fontWeight: 700,
                          }}>LVL {p.newLevel}</span>
                        )}
                      </div>
                    );
                  })}
              </div>
              <div style={{
                borderTop: "1px solid rgba(255,215,0,0.1)", marginTop: 10, paddingTop: 8,
                display: "flex", justifyContent: "space-between", fontSize: 12, color: "rgba(255,255,255,0.4)",
              }}>
                <span>{allPlayersList.filter(([, p]) => p.xpEarned > 0).length} students rewarded</span>
                <span style={{ color: "#ffd700", fontWeight: 700 }}>
                  {allPlayersList.reduce((sum, [, p]) => sum + (p.xpEarned || 0), 0)} total XP
                </span>
              </div>
            </div>
          )}

          {/* Mana reward indicator */}
          {battle.xpAwarded && (
            <div style={{
              background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.25)",
              borderRadius: 10, padding: "10px 16px", marginBottom: 16,
              display: "flex", alignItems: "center", gap: 10, justifyContent: "center",
            }}>
              <span style={{ fontSize: 18 }}>💧</span>
              <span style={{ fontSize: 13, color: "rgba(59,130,246,0.8)", fontWeight: 600 }}>
                +{battle.status === "victory" ? 5 : 2} Class Mana awarded
              </span>
            </div>
          )}

          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button onClick={onNewBattle} style={{
              padding: "12px 24px", borderRadius: 10, border: "none",
              background: "#8b5cf6", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer",
              boxShadow: "0 0 16px rgba(139,92,246,0.3)",
            }}>
              ⚔️ New Battle
            </button>
            <button onClick={() => navigate(`/course/${courseId}`)} style={{
              padding: "12px 24px", borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.2)",
              background: "transparent", color: "rgba(255,255,255,0.6)", fontWeight: 700, fontSize: 15, cursor: "pointer",
            }}>
              Back to Course
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════
  // ACTIVE BATTLE — GAME MASTER DASHBOARD
  // ═══════════════════════════════════════════════════════
  return (
    <div style={{
      minHeight: "100vh",
      background: BG,
      animation: shakeScreen ? "screenShake 0.6s ease" : "none",
      position: "relative", overflow: "hidden",
    }}>
      <ScreenFlash active={showFlash} color={flashColor} />
      <style>{BATTLE_CSS}{TEACHER_CSS}</style>

      {/* Ambient particles (subtle) */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.25, pointerEvents: "none" }}>
        <ParticleField particles={theme.particles} count={10} speed={0.3} color={theme.particleColor} />
      </div>

      {/* Floating damage numbers */}
      {damageNumbers.map((d) => <DamageNumber key={d.id} amount={d.amount} x={d.x} y={d.y} isCrit={d.isCrit} />)}

      {/* ─── PAUSED OVERLAY ─── */}
      {isPaused && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 400,
          background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            fontSize: 64, marginBottom: 16,
            animation: "pausePulse 2s ease-in-out infinite",
          }}>⏸️</div>
          <div style={{
            fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 900, color: "#f39c12",
            textShadow: "0 0 20px rgba(243,156,18,0.5)",
            marginBottom: 12,
          }}>BATTLE PAUSED</div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 24 }}>
            Students see a pause overlay. No answers can be submitted.
          </div>
          <button
            onClick={() => handleBossEvent("resume")}
            style={{
              padding: "12px 32px", borderRadius: 10, border: "none",
              background: "#2ecc71", color: "#fff", fontWeight: 700, fontSize: 16, cursor: "pointer",
              boxShadow: "0 0 20px rgba(46,204,113,0.4)",
            }}
          >
            ▶️ Resume Battle
          </button>
        </div>
      )}

      {/* ─── CONFIRM DIALOGS ─── */}
      {confirmDialog?.type === "rage" && (
        <ConfirmDialog
          title="🔥 Activate Rage Mode?"
          message="Boss counterattack damage doubles for the next 5 wrong answers. Students will see a warning."
          confirmLabel="Activate Rage"
          confirmColor="#e74c3c"
          onConfirm={() => handleBossEvent("rage_mode")}
          onCancel={() => setConfirmDialog(null)}
        />
      )}
      {confirmDialog?.type === "heal" && (
        <ConfirmDialog
          title="💚 Boss Heal"
          message={`Heal the boss by ${healAmount} HP.`}
          confirmLabel={`Heal +${healAmount}`}
          confirmColor="#2ecc71"
          onConfirm={() => handleBossEvent("boss_heal", { amount: healAmount })}
          onCancel={() => setConfirmDialog(null)}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
            <button onClick={() => setHealAmount(Math.max(1, healAmount - 1))} style={{
              width: 32, height: 32, borderRadius: 6, border: "1px solid rgba(255,255,255,0.2)",
              background: "transparent", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 16,
            }}>-</button>
            <span style={{
              fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 900, color: "#2ecc71",
              minWidth: 40, textAlign: "center",
            }}>{healAmount}</span>
            <button onClick={() => setHealAmount(Math.min(boss.maxHP - boss.currentHP, healAmount + 1))} style={{
              width: 32, height: 32, borderRadius: 6, border: "1px solid rgba(255,255,255,0.2)",
              background: "transparent", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 16,
            }}>+</button>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>HP</span>
          </div>
        </ConfirmDialog>
      )}
      {confirmDialog?.type === "confusion" && (
        <ConfirmDialog
          title="🌀 Confusion Wave?"
          message="All students' next answer will have options visually scrambled."
          confirmLabel="Launch Confusion"
          confirmColor="#a855f7"
          onConfirm={() => handleBossEvent("confusion_wave")}
          onCancel={() => setConfirmDialog(null)}
        />
      )}
      {confirmDialog?.type === "enrage" && (
        <ConfirmDialog
          title="⚡ Enrage — Direct Damage"
          message={`Deal ${enrageDamage} damage directly to class HP.`}
          confirmLabel={`Deal ${enrageDamage} Damage`}
          confirmColor="#f59e0b"
          onConfirm={() => handleBossEvent("enrage", { damage: enrageDamage })}
          onCancel={() => setConfirmDialog(null)}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
            <button onClick={() => setEnrageDamage(Math.max(1, enrageDamage - 1))} style={{
              width: 32, height: 32, borderRadius: 6, border: "1px solid rgba(255,255,255,0.2)",
              background: "transparent", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 16,
            }}>-</button>
            <span style={{
              fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 900, color: "#f59e0b",
              minWidth: 40, textAlign: "center",
            }}>{enrageDamage}</span>
            <button onClick={() => setEnrageDamage(Math.min(battle.classHP.current, enrageDamage + 1))} style={{
              width: 32, height: 32, borderRadius: 6, border: "1px solid rgba(255,255,255,0.2)",
              background: "transparent", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 16,
            }}>+</button>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>HP damage to class</span>
          </div>
        </ConfirmDialog>
      )}
      {confirmDialog?.type === "end" && (
        <ConfirmDialog
          title="🛑 End Battle?"
          message="Choose how to end this battle."
          confirmLabel={confirmDialog.status === "victory" ? "End as Victory" : "End as Defeat"}
          confirmColor={confirmDialog.status === "victory" ? "#2ecc71" : "#e74c3c"}
          onConfirm={() => handleEndBattle(confirmDialog.status)}
          onCancel={() => setConfirmDialog(null)}
        >
          <div style={{ marginTop: 8 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <button
                onClick={() => setConfirmDialog({ ...confirmDialog, status: "victory" })}
                style={{
                  flex: 1, padding: "8px 12px", borderRadius: 8,
                  border: confirmDialog.status === "victory" ? "2px solid #2ecc71" : "1px solid rgba(255,255,255,0.15)",
                  background: confirmDialog.status === "victory" ? "rgba(46,204,113,0.15)" : "transparent",
                  color: confirmDialog.status === "victory" ? "#2ecc71" : "rgba(255,255,255,0.5)",
                  fontWeight: 700, fontSize: 13, cursor: "pointer",
                }}
              >🏆 Victory (Mercy)</button>
              <button
                onClick={() => setConfirmDialog({ ...confirmDialog, status: "defeat" })}
                style={{
                  flex: 1, padding: "8px 12px", borderRadius: 8,
                  border: confirmDialog.status === "defeat" ? "2px solid #e74c3c" : "1px solid rgba(255,255,255,0.15)",
                  background: confirmDialog.status === "defeat" ? "rgba(231,76,60,0.15)" : "transparent",
                  color: confirmDialog.status === "defeat" ? "#e74c3c" : "rgba(255,255,255,0.5)",
                  fontWeight: 700, fontSize: 13, cursor: "pointer",
                }}
              >💀 Defeat</button>
            </div>
            <input
              type="text"
              placeholder="Reason (optional)"
              value={endReason}
              onChange={(e) => setEndReason(e.target.value)}
              style={{
                width: "100%", padding: "8px 12px", borderRadius: 6,
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(0,0,0,0.3)", color: "#fff", fontSize: 13,
              }}
            />
          </div>
        </ConfirmDialog>
      )}

      {/* ─── MAIN CONTENT ─── */}
      <div style={{
        maxWidth: 1100, margin: "0 auto",
        padding: "64px 24px 24px",
        position: "relative", zIndex: 5,
      }}>

        {/* ══ TOP BAR: HP + Controls ══ */}
        <div style={{
          display: "flex", gap: 16, alignItems: "stretch", marginBottom: 16,
        }}>
          {/* HP bars */}
          <div style={{
            flex: 1,
            background: "rgba(0,0,0,0.35)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, padding: "14px 18px",
          }}>
            <HPBar label="BOSS HP" icon="❤️" current={boss.currentHP} max={boss.maxHP}
              colorLow="#7f1d1d" colorMid="#f39c12" colorHigh="#e74c3c" height={24} glow={animatingDamage} large />
            <HPBar label="CLASS HP" icon="💚" current={battle.classHP.current} max={battle.classHP.max}
              colorLow="#c0392b" colorMid="#f39c12" colorHigh="#2ecc71" height={16} />
          </div>

          {/* Control buttons */}
          <div style={{
            display: "flex", gap: 8, alignItems: "center",
            background: "rgba(0,0,0,0.35)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, padding: "8px 14px",
          }}>
            <button
              onClick={() => handleBossEvent(isPaused ? "resume" : "pause")}
              style={{
                padding: "10px 18px", borderRadius: 10,
                border: isPaused ? "1.5px solid #2ecc7188" : "1.5px solid #f39c1288",
                background: isPaused ? "#2ecc7122" : "#f39c1222",
                color: isPaused ? "#2ecc71" : "#f39c12",
                fontWeight: 700, fontSize: 14, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6,
                minHeight: 44,
              }}
            >
              <span style={{ fontSize: 18 }}>{isPaused ? "▶️" : "⏸"}</span>
              {isPaused ? "Resume" : "Pause"}
            </button>
            <button
              onClick={() => setConfirmDialog({ type: "end", status: "defeat" })}
              style={{
                padding: "10px 18px", borderRadius: 10,
                border: "1.5px solid #e74c3c66",
                background: "#e74c3c11",
                color: "#e74c3c",
                fontWeight: 700, fontSize: 14, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6,
                minHeight: 44,
              }}
            >
              <span style={{ fontSize: 18 }}>🛑</span>
              End
            </button>
          </div>
        </div>

        {/* ══ BOSS AREA + EVENTS ══ */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 320px", gap: 16, marginBottom: 16,
        }}>
          {/* Boss art + status */}
          <div style={{
            background: "rgba(0,0,0,0.35)",
            border: `1px solid ${theme.glowColor}22`,
            borderRadius: 14, padding: "20px",
            textAlign: "center", position: "relative",
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", inset: 0,
              background: `radial-gradient(ellipse at 50% 100%, ${theme.glowColor}10, transparent 70%)`,
              pointerEvents: "none",
            }} />
            <HitExplosion active={showExplosion} color={theme.glowColor} />

            <div style={{ position: "relative", zIndex: 2 }}>
              <BossArt bossId={boss.id} size={280} hit={animatingDamage} lowHP={bossHpPct < 25} />
              <div style={{
                fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800, color: "#fff",
                textShadow: `0 0 12px ${theme.glowColor}88`, marginTop: 8, marginBottom: 4,
              }}>
                {boss.name}
              </div>
              <div style={{
                fontSize: 12, fontWeight: 700, color: bossStatus.color,
                padding: "3px 12px", borderRadius: 20,
                background: `${bossStatus.color}15`, border: `1px solid ${bossStatus.color}33`,
                display: "inline-block",
              }}>
                {bossStatus.text}
              </div>
            </div>
          </div>

          {/* Boss event buttons */}
          <div style={{
            background: "rgba(0,0,0,0.35)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 14, padding: "16px",
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>
              🎲 Boss Events
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <BossEventButton
                icon="🔥" label="Rage Mode" color="#e74c3c" glowColor="#ff6b6b"
                onClick={() => setConfirmDialog({ type: "rage" })}
                disabled={isPaused || (bossState.rage > 0)}
              />
              <BossEventButton
                icon="💚" label={`Boss Heal +${healAmount}`} color="#2ecc71" glowColor="#4ade80"
                onClick={() => setConfirmDialog({ type: "heal" })}
                disabled={isPaused || boss.currentHP >= boss.maxHP}
              />
              <BossEventButton
                icon="🌀" label="Confusion Wave" color="#a855f7" glowColor="#c084fc"
                onClick={() => setConfirmDialog({ type: "confusion" })}
                disabled={isPaused || bossState.confusion}
              />
              <BossEventButton
                icon="⚡" label="Enrage" color="#f59e0b" glowColor="#fbbf24"
                onClick={() => setConfirmDialog({ type: "enrage" })}
                disabled={isPaused || battle.classHP.current <= 0}
              />
            </div>
          </div>
        </div>

        {/* ══ TEAMS + FEED ══ */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 360px", gap: 16,
        }}>
          {/* Team cards */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.4)", marginBottom: 10 }}>
              ⚔️ Teams ({teamEntries.length})
            </div>
            <div style={{
              display: "grid",
              gridTemplateColumns: teamEntries.length <= 4 ? "1fr 1fr" : "1fr 1fr 1fr",
              gap: 10,
            }}>
              {teamEntries.map((team) => (
                <TeamCard
                  key={team.id}
                  teamId={team.id}
                  team={team}
                  players={allPlayers}
                  totalQuestions={battle.questions?.length || 0}
                  expanded={expandedTeams[team.id] || false}
                  onToggle={() => setExpandedTeams((prev) => ({ ...prev, [team.id]: !prev[team.id] }))}
                />
              ))}
            </div>
          </div>

          {/* Live feed */}
          <LiveFeed log={battle.log || []} />
        </div>
      </div>
    </div>
  );
}

// ─── Additional CSS keyframes ───
const TEACHER_CSS = `
  @keyframes bossEventPulse {
    0% { box-shadow: 0 0 0 rgba(255,255,255,0); }
    50% { box-shadow: 0 0 24px rgba(255,255,255,0.3); }
    100% { box-shadow: 0 0 0 rgba(255,255,255,0); }
  }
  @keyframes pausePulse {
    0%, 100% { transform: scale(1); opacity: 0.8; }
    50% { transform: scale(1.05); opacity: 1; }
  }
  @keyframes feedEntryIn {
    0% { opacity: 0; transform: translateY(-8px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  @media (max-width: 900px) {
    /* Stack columns on smaller screens */
  }
`;
