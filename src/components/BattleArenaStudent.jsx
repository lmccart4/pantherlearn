// src/components/BattleArenaStudent.jsx
// Phase 3: Pokemon-trainer style student battle view for v2 boss battles
// Mobile-first, dark RPG theme, GPU-composited animations

import { useState, useEffect, useRef, useCallback } from "react";
import PixelAvatar, { PixelPet } from "./PixelAvatar";
import { BossArt, DamageNumber, ParticleField, ScreenFlash, HitExplosion, BOSS_THEMES, BATTLE_CSS } from "./BattleEffects";
import { CLASSES, PETS } from "../lib/avatar";
import { getClassAbilities, canUseActive } from "../lib/classAbilities";
import { useTranslatedTexts } from "../hooks/useTranslatedText.jsx";

// ─── Color constants ───
const BG = "#0D1B2A";
const SURFACE = "#1B2838";
const ACCENT = "#02C39A";

// ─── HP Bar Component ───
function HPBar({ label, icon, current, max, colorLow, colorMid, colorHigh, height = 18, glow }) {
  const pct = max > 0 ? (current / max) * 100 : 0;
  const color = pct > 50 ? colorHigh : pct > 25 ? colorMid : colorLow;
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 700, marginBottom: 3 }}>
        <span style={{ color: colorHigh }}>{icon} {label}</span>
        <span style={{ color: pct < 25 ? colorLow : "rgba(255,255,255,0.6)" }}>{current}/{max}</span>
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
          boxShadow: glow ? `0 0 12px ${colorHigh}66` : "none",
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

// ─── Ability Button ───
function AbilityBtn({ icon, label, onClick, disabled, cooldown, color, large, active }) {
  const isOnCD = cooldown > 0;
  const isDisabled = disabled || isOnCD;
  const borderColor = isDisabled ? `${color}33` : `${color}88`;
  const bgColor = isDisabled ? `${color}0D` : `${color}26`;
  const textColor = isDisabled ? `${color}66` : color;

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      style={{
        padding: large ? "10px 16px" : "8px 12px",
        borderRadius: 10,
        border: `1.5px solid ${borderColor}`,
        background: bgColor,
        color: textColor,
        fontWeight: 700,
        fontSize: large ? 13 : 12,
        cursor: isDisabled ? "default" : "pointer",
        opacity: isDisabled ? 0.4 : 1,
        position: "relative",
        transition: "transform 0.1s, box-shadow 0.2s",
        fontFamily: "'Nunito', var(--font-body), sans-serif",
        minHeight: 44,
        minWidth: 44,
        display: "flex",
        alignItems: "center",
        gap: 4,
        flexShrink: 0,
      }}
      data-translatable
    >
      <span style={{ fontSize: large ? 18 : 16 }}>{icon}</span>
      <span>{label}</span>
      {isOnCD && (
        <span style={{
          position: "absolute", top: -6, right: -6,
          width: 20, height: 20, borderRadius: "50%",
          background: "#1a1a2a", border: `1.5px solid ${color}66`,
          color, fontSize: 10, fontWeight: 900,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>{cooldown}</span>
      )}
      {active && (
        <span style={{
          position: "absolute", top: -4, right: -4,
          width: 10, height: 10, borderRadius: "50%",
          background: color,
          boxShadow: `0 0 8px ${color}`,
          animation: "shieldPulse 1.5s ease-in-out infinite",
        }} />
      )}
    </button>
  );
}

// ─── Streak display ───
function StreakBadge({ streak }) {
  if (!streak || streak < 1) return null;
  const fireScale = Math.min(1 + streak * 0.1, 2);
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 4,
      padding: "4px 10px", borderRadius: 8,
      background: "rgba(255,150,50,0.15)", border: "1px solid rgba(255,150,50,0.3)",
    }}>
      <span style={{ fontSize: 16 * fireScale, transition: "font-size 0.3s" }}>🔥</span>
      <span style={{ fontSize: 13, fontWeight: 800, color: "#ff9632" }}>{streak}</span>
    </div>
  );
}

// ─── Team Leaderboard ───
function TeamLeaderboard({ battle, myTeamId, collapsed, onToggle }) {
  const allTeams = Object.entries(battle.teamSummaries || battle.teamProgress || {})
    .map(([id, t]) => ({ id, ...t }))
    .sort((a, b) => (b.damage || 0) - (a.damage || 0));

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div style={{
      background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 12, overflow: "hidden",
    }}>
      <button
        onClick={onToggle}
        style={{
          width: "100%", padding: "10px 14px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: "transparent", border: "none", cursor: "pointer", color: "#fff",
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)" }}>🏆 Team Rankings</span>
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", transition: "transform 0.2s", transform: collapsed ? "rotate(0deg)" : "rotate(180deg)" }}>▼</span>
      </button>
      {!collapsed && (
        <div style={{ padding: "0 14px 12px" }}>
          {allTeams.map((team, i) => {
            const isMine = team.id === myTeamId;
            return (
              <div key={team.id} style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "6px 8px", marginBottom: 3, borderRadius: 8,
                background: isMine ? `${team.color}22` : "transparent",
                border: isMine ? `1px solid ${team.color}44` : "1px solid transparent",
              }}>
                <span style={{ fontSize: 14, width: 22, textAlign: "center" }}>{medals[i] || `${i + 1}.`}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 12, fontWeight: 700, color: team.color,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {team.name}{isMine ? " ★" : ""}
                  </div>
                </div>
                <div style={{
                  fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 900, color: "#fff",
                }}>{team.damage || 0}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════
export default function BattleArenaStudent({
  battle,
  myPlayer,
  myTeamId,
  user,
  courseId,
  // Handlers from parent
  handleSubmitAnswer,
  handleNextQuestion,
  handleAbility,
  handleClassAbility,
  // State from parent
  selectedAnswer,
  setSelectedAnswer,
  showResult,
  lastResult,
  hintUsed,
  eliminatedOptions,
  eliminatedOption,
  submitting,
  manaState,
  // Effect state
  passiveToasts,
  classAbilityFlash,
  navigate,
}) {
  // ─── Translation ───
  const uiStrings = useTranslatedTexts([
    "BOSS HP",                                           // 0
    "CLASS HP",                                          // 1
    "Attack!",                                           // 2
    "Hint",                                              // 3
    "Shield",                                            // 4
    "Crit",                                              // 5
    "Correct!",                                          // 6
    "damage dealt",                                      // 7
    "Shield Blocked the counterattack!",                 // 8
    "Dodged the counterattack!",                         // 9
    "Miss! Class takes damage",                          // 10
    "Next Question",                                     // 11
    "All Questions Answered!",                           // 12
    "You dealt",                                         // 13
    "total damage.",                                     // 14
    "Waiting for other teams...",                        // 15
    "Spectating",                                        // 16
    "You're not on a team. Watch the action!",           // 17
    "VICTORY!",                                          // 18
    "DEFEATED",                                          // 19
    "The class united to defeat",                        // 20
    "overwhelmed the class...",                          // 21
    "Your Stats",                                        // 22
    "Damage Dealt",                                      // 23
    "Correct",                                           // 24
    "Streak Record",                                     // 25
    "Back to Course",                                    // 26
    "CRIT!",                                             // 27
    "Passive:",                                          // 28
  ]);
  const ui = (i, fallback) => uiStrings?.[i] ?? fallback;

  // ─── Local state ───
  const [leaderboardCollapsed, setLeaderboardCollapsed] = useState(true);
  const [autoAdvanceTimer, setAutoAdvanceTimer] = useState(null);
  const [animatedXP, setAnimatedXP] = useState(0);

  // ─── Effect state (local) ───
  const [damageNumbers, setDamageNumbers] = useState([]);
  const [animatingDamage, setAnimatingDamage] = useState(false);
  const [showExplosion, setShowExplosion] = useState(false);
  const [shakeScreen, setShakeScreen] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [flashColor, setFlashColor] = useState("#e74c3c");
  const prevBossHP = useRef(null);
  const prevClassHP = useRef(null);

  // ─── React to HP changes ───
  useEffect(() => {
    if (!battle) return;
    if (prevBossHP.current !== null && battle.boss.currentHP < prevBossHP.current) {
      setAnimatingDamage(true);
      setShowExplosion(true);
      const dmg = prevBossHP.current - battle.boss.currentHP;
      setDamageNumbers((prev) => [...prev, {
        id: Date.now(), amount: dmg, isCrit: dmg >= 4,
        x: `${55 + Math.random() * 15}%`, y: `${10 + Math.random() * 10}%`,
      }]);
      setTimeout(() => { setAnimatingDamage(false); setShowExplosion(false); }, 700);
      setTimeout(() => setDamageNumbers((prev) => prev.filter((d) => Date.now() - d.id < 1500)), 2000);
    }
    if (prevClassHP.current !== null && battle.classHP.current < prevClassHP.current) {
      setShakeScreen(true);
      setTimeout(() => setShakeScreen(false), 600);
    }
    prevBossHP.current = battle.boss.currentHP;
    prevClassHP.current = battle.classHP.current;
  }, [battle?.boss?.currentHP, battle?.classHP?.current]);

  // ─── Auto-advance after result ───
  useEffect(() => {
    if (showResult && lastResult && battle?.status === "active") {
      const myTP = myPlayer;
      if (myTP && !myTP.finished) {
        const timer = setTimeout(() => {
          handleNextQuestion();
        }, 3000);
        setAutoAdvanceTimer(timer);
        return () => clearTimeout(timer);
      }
    }
    return () => {};
  }, [showResult, lastResult]);

  // ─── XP count-up animation ───
  const xpEarned = myPlayer?.xpEarned || 0;
  useEffect(() => {
    if (!xpEarned || xpEarned <= 0) { setAnimatedXP(0); return; }
    let start = 0;
    const duration = 1200; // ms
    const step = Math.max(1, Math.floor(xpEarned / 30));
    const interval = duration / (xpEarned / step);
    const timer = setInterval(() => {
      start += step;
      if (start >= xpEarned) {
        setAnimatedXP(xpEarned);
        clearInterval(timer);
      } else {
        setAnimatedXP(start);
      }
    }, interval);
    return () => clearInterval(timer);
  }, [xpEarned]);

  // ─── Derived state ───
  const boss = battle?.boss;
  if (!boss) return null;

  const bossHpPct = (boss.currentHP / boss.maxHP) * 100;
  const classHpPct = (battle.classHP.current / battle.classHP.max) * 100;
  const theme = BOSS_THEMES[boss.id] || BOSS_THEMES.dragon;

  const myTP = myPlayer ? {
    ...myPlayer,
    name: myPlayer.displayName,
    color: (battle.teamSummaries?.[myPlayer.teamId] || battle.teamProgress?.[myPlayer.teamId] || {}).color || "#888",
    shieldActive: myPlayer.abilities?.shield?.active || false,
    criticalHitActive: myPlayer.abilities?.criticalHit?.active || false,
    shieldCooldown: myPlayer.abilities?.shield?.cooldownRemaining || 0,
    critCooldown: myPlayer.abilities?.criticalHit?.cooldownRemaining || 0,
  } : null;

  const myQuestion = myTP && !myTP.finished ? battle.questions[myTP.questionOrder[myTP.currentIndex]] : null;
  const myQNum = myTP ? myTP.currentIndex + 1 : 0;
  const totalQs = myTP ? myTP.questionOrder.length : 0;
  const isFinished = myTP?.finished;
  const battleOver = battle.status === "victory" || battle.status === "defeat";

  // Avatar data
  const avatarData = myPlayer?.avatar ? {
    classId: myPlayer.classId || "mage",
    skinTone: myPlayer.avatar.skinTone || "medium",
    hairColor: myPlayer.avatar.hairColor || "black",
    eyeColor: myPlayer.avatar.eyeColor || "brown",
    petId: myPlayer.avatar.petId || null,
    accessory: myPlayer.avatar.accessory || "none",
    specialPower: myPlayer.avatar.specialPower || "none",
  } : {
    classId: myPlayer?.classId || "mage",
    skinTone: "medium",
    hairColor: "black",
    eyeColor: "brown",
    petId: null,
    accessory: "none",
    specialPower: "none",
  };

  // Class abilities
  const classId = myPlayer?.classId || "mage";
  const classAbilities = getClassAbilities(classId);
  const activeDef = classAbilities.active;
  const passiveDef = classAbilities.passive;
  const classActiveCD = myPlayer?.abilities?.classAbility?.cooldownRemaining || 0;
  const canUseClassActive = classActiveCD <= 0 && !isFinished;
  const classColor = CLASSES[classId]?.color?.accent || ACCENT;

  const petInfo = PETS.find((p) => p.id === avatarData.petId);

  // ─── Victory/Defeat Overlay ───
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
        <style>{BATTLE_CSS}{ARENA_CSS}</style>
        <ParticleField
          particles={isVictory ? ["🏆", "⭐", "✨", "🎉"] : ["💀", "😈", "💨"]}
          count={25} speed={0.5}
          color={isVictory ? "#ffed4a" : "#e74c3c"}
        />

        <div style={{
          maxWidth: 480, margin: "0 auto",
          padding: "60px 20px 40px", position: "relative", zIndex: 5,
          textAlign: "center",
        }}>
          {/* Big icon */}
          <div style={{
            fontSize: 80, marginBottom: 16,
            animation: isVictory ? "victoryBurst 1s ease-out" : "defeatSink 1s ease",
          }}>
            {isVictory ? "🏆" : boss.icon || "💀"}
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 900,
            color: isVictory ? "#2ecc71" : "#e74c3c",
            textShadow: isVictory ? "0 0 30px rgba(46,204,113,0.5)" : "0 0 30px rgba(231,76,60,0.5)",
            marginBottom: 8,
          }} data-translatable>
            {isVictory ? ui(18, "VICTORY!") : ui(19, "DEFEATED")}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, marginBottom: 28 }} data-translatable>
            {isVictory
              ? `${ui(20, "The class united to defeat")} ${boss.name}!`
              : `${boss.name} ${ui(21, "overwhelmed the class...")}`}
          </p>

          {/* Personal stats */}
          {myTP && (
            <div style={{
              background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 14, padding: "18px 20px", marginBottom: 16,
              backdropFilter: "blur(10px)",
            }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", marginBottom: 14 }} data-translatable>
                {ui(22, "Your Stats")}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                {[
                  { label: ui(23, "Damage Dealt"), value: myTP.damage || 0, color: "#e74c3c" },
                  { label: ui(24, "Correct"), value: myTP.correctCount || 0, color: "#2ecc71" },
                  { label: ui(25, "Streak Record"), value: myTP.streak || 0, color: "#ff9632" },
                ].map((s) => (
                  <div key={s.label} style={{
                    padding: "10px 8px", borderRadius: 10, textAlign: "center",
                    background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)",
                  }}>
                    <div style={{
                      fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 900,
                      color: s.color, textShadow: `0 0 10px ${s.color}44`,
                    }}>{s.value}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }} data-translatable>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* XP Breakdown Card */}
          {myPlayer?.xpAwarded && myPlayer?.xpBreakdown && (
            <div style={{
              background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,215,0,0.25)",
              borderRadius: 14, padding: "18px 20px", marginBottom: 16,
              backdropFilter: "blur(10px)",
            }}>
              {/* XP Header */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                marginBottom: 14,
              }}>
                <span style={{ fontSize: 22 }}>&#11088;</span>
                <span style={{
                  fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 900,
                  color: "#ffd700", textShadow: "0 0 20px rgba(255,215,0,0.4)",
                }}>{animatedXP} XP</span>
              </div>

              {/* Breakdown rows */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {myPlayer.xpBreakdown.map((row, i) => (
                  <div key={i} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "5px 8px", borderRadius: 6,
                    background: i % 2 === 0 ? "rgba(255,255,255,0.03)" : "transparent",
                  }}>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{row.label}</span>
                    <span style={{
                      fontSize: 13, fontWeight: 700,
                      color: row.value > 0 ? "#ffd700" : "rgba(255,255,255,0.3)",
                      fontFamily: "var(--font-display)",
                    }}>+{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Divider + Total */}
              <div style={{
                borderTop: "1px solid rgba(255,215,0,0.15)", marginTop: 8, paddingTop: 8,
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.5)" }}>Total</span>
                <span style={{
                  fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 900, color: "#ffd700",
                }}>{myPlayer.xpEarned} XP</span>
              </div>

              {/* Level-up notification */}
              {myPlayer.leveledUp && (
                <div style={{
                  marginTop: 10, padding: "8px 12px", borderRadius: 8,
                  background: "rgba(46,204,113,0.15)", border: "1px solid rgba(46,204,113,0.3)",
                  textAlign: "center",
                }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#2ecc71" }}>
                    Level Up! You reached Level {myPlayer.newLevel}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* XP Pending indicator (before teacher awards) */}
          {myPlayer && !myPlayer.xpAwarded && (
            <div style={{
              background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 14, padding: "14px 18px", marginBottom: 16,
              textAlign: "center",
            }}>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
                Calculating XP rewards...
              </span>
            </div>
          )}

          {/* Team rankings */}
          <TeamLeaderboard
            battle={battle}
            myTeamId={myTeamId}
            collapsed={false}
            onToggle={() => {}}
          />

          {/* Back button */}
          <button
            onClick={() => navigate(`/course/${courseId}`)}
            style={{
              marginTop: 20, padding: "12px 28px", borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.7)",
              fontWeight: 700, fontSize: 15, cursor: "pointer",
              fontFamily: "'Nunito', var(--font-body), sans-serif",
              minHeight: 48,
            }}
            data-translatable
          >
            {ui(26, "Back to Course")}
          </button>
        </div>
      </div>
    );
  }

  // ─── Pause overlay ───
  const isPaused = battle.status === "paused";

  // ─── No player doc → spectator ───
  if (!myPlayer) {
    return (
      <div style={{ minHeight: "100vh", background: theme.bg, position: "relative", overflow: "hidden" }}>
        <style>{BATTLE_CSS}{ARENA_CSS}</style>
        <ParticleField particles={theme.particles} count={12} speed={0.4} color={theme.particleColor} />
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "80px 20px", position: "relative", zIndex: 5 }}>
          {/* HP bars */}
          <HPBar label={ui(0, "BOSS HP")} icon="❤️" current={boss.currentHP} max={boss.maxHP}
            colorLow="#7f1d1d" colorMid="#f39c12" colorHigh="#e74c3c" height={18} glow={animatingDamage} />
          <HPBar label={ui(1, "CLASS HP")} icon="💚" current={battle.classHP.current} max={battle.classHP.max}
            colorLow="#c0392b" colorMid="#f39c12" colorHigh="#2ecc71" height={14} />

          <div style={{
            textAlign: "center", marginTop: 40, padding: "30px 20px",
            background: "rgba(0,0,0,0.4)", borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.06)",
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>👀</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 6 }} data-translatable>
              {ui(16, "Spectating")}
            </div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }} data-translatable>
              {ui(17, "You're not on a team. Watch the action!")}
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <TeamLeaderboard battle={battle} myTeamId={null} collapsed={leaderboardCollapsed} onToggle={() => setLeaderboardCollapsed(!leaderboardCollapsed)} />
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════
  // ACTIVE BATTLE VIEW
  // ═══════════════════════════════════════════════
  return (
    <div style={{
      minHeight: "100vh",
      background: BG,
      animation: shakeScreen ? "screenShake 0.6s ease" : "none",
      position: "relative", overflow: "hidden",
    }}>
      <ScreenFlash active={showFlash} color={flashColor} />
      <style>{BATTLE_CSS}{ARENA_CSS}</style>

      {/* Pause overlay */}
      {isPaused && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 400,
          background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            fontSize: 56, marginBottom: 12,
            animation: "arena-idle 2s ease-in-out infinite",
          }}>⏸️</div>
          <div style={{
            fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 900, color: "#f39c12",
            textShadow: "0 0 20px rgba(243,156,18,0.5)",
            marginBottom: 8,
          }} data-translatable>Battle Paused</div>
          <div style={{
            fontSize: 14, color: "rgba(255,255,255,0.5)",
          }} data-translatable>Paused by Mr. McCarthy. Hang tight!</div>
        </div>
      )}

      {/* Ambient particles (subtle) */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.4, pointerEvents: "none" }}>
        <ParticleField particles={theme.particles} count={10} speed={0.3} color={theme.particleColor} />
      </div>

      {/* Passive proc toasts */}
      {passiveToasts?.length > 0 && (
        <div style={{ position: "fixed", top: 72, right: 12, zIndex: 300, display: "flex", flexDirection: "column", gap: 6 }}>
          {passiveToasts.map((toast) => (
            <div key={toast.id} style={{
              padding: "8px 12px", borderRadius: 8,
              background: "rgba(168,85,247,0.2)", border: "1px solid rgba(168,85,247,0.4)",
              backdropFilter: "blur(10px)", color: "#c084fc",
              fontSize: 11, fontWeight: 600, maxWidth: 240,
              animation: "passiveToastIn 0.3s ease-out",
            }}>
              {toast.text}
            </div>
          ))}
        </div>
      )}

      {/* Class ability activation flash */}
      {classAbilityFlash && (
        <div style={{
          position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          zIndex: 250, textAlign: "center", pointerEvents: "none",
          animation: "abilityFlashIn 0.4s ease-out",
        }}>
          <div style={{ fontSize: 56, marginBottom: 4 }}>{classAbilityFlash.icon}</div>
          <div style={{
            fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 900, color: "#c084fc",
            textShadow: "0 0 20px rgba(168,85,247,0.6)",
          }}>{classAbilityFlash.name}</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>{classAbilityFlash.desc}</div>
        </div>
      )}

      {/* Floating damage numbers */}
      {damageNumbers.map((d) => <DamageNumber key={d.id} amount={d.amount} x={d.x} y={d.y} isCrit={d.isCrit} />)}

      {/* ─── Main Content ─── */}
      <div style={{
        maxWidth: 480, margin: "0 auto",
        padding: "64px 16px 24px",
        position: "relative", zIndex: 5,
      }}>

        {/* ══ HP BARS ══ */}
        <div style={{
          background: "rgba(0,0,0,0.3)", borderRadius: 12,
          padding: "12px 14px 8px",
          border: "1px solid rgba(255,255,255,0.06)",
          marginBottom: 12,
        }}>
          <HPBar label={ui(0, "BOSS HP")} icon="❤️" current={boss.currentHP} max={boss.maxHP}
            colorLow="#7f1d1d" colorMid="#f39c12" colorHigh="#e74c3c" height={20} glow={animatingDamage} />
          <HPBar label={ui(1, "CLASS HP")} icon="💚" current={battle.classHP.current} max={battle.classHP.max}
            colorLow="#c0392b" colorMid="#f39c12" colorHigh="#2ecc71" height={14} />
        </div>

        {/* ══ VS ARENA ══ */}
        <div style={{
          background: `linear-gradient(180deg, ${SURFACE} 0%, rgba(0,0,0,0.5) 100%)`,
          border: `1px solid ${theme.glowColor}33`,
          borderRadius: 16, padding: "16px 12px",
          marginBottom: 12, position: "relative",
          overflow: "hidden",
        }}>
          {/* Background glow */}
          <div style={{
            position: "absolute", inset: 0,
            background: `radial-gradient(ellipse at 50% 100%, ${theme.glowColor}15, transparent 70%)`,
            pointerEvents: "none",
          }} />

          <HitExplosion active={showExplosion} x="70%" y="40%" color={theme.glowColor} />

          <div style={{
            display: "flex", alignItems: "flex-end", justifyContent: "space-between",
            position: "relative", zIndex: 2,
            minHeight: 140,
          }}>
            {/* Left: Player avatar + pet */}
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              flex: "0 0 auto", maxWidth: "40%",
            }}>
              <div style={{
                animation: isFinished ? "arena-idle 3s ease-in-out infinite" : "arena-ready 1.5s ease-in-out infinite",
                position: "relative",
              }}>
                <PixelAvatar avatar={avatarData} level={1} size={128} animate={!isFinished} />
                {avatarData.petId && (
                  <div style={{ position: "absolute", bottom: -8, right: -20 }}>
                    <PixelPet petId={avatarData.petId} size={56} animate />
                  </div>
                )}
              </div>
              <div style={{
                fontSize: 10, fontWeight: 700, color: classColor,
                marginTop: 4, textAlign: "center",
              }}>
                {CLASSES[classId]?.icon} {myTP.name}
              </div>
            </div>

            {/* VS divider */}
            <div style={{
              fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 900,
              color: "rgba(255,255,255,0.15)", textShadow: `0 0 20px ${theme.glowColor}33`,
              alignSelf: "center", padding: "0 8px",
              flexShrink: 0,
            }}>
              VS
            </div>

            {/* Right: Boss */}
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              flex: "0 0 auto", maxWidth: "45%",
            }}>
              <div style={{
                animation: animatingDamage ? "bossHit 0.5s ease" : "bossIdle 3s ease-in-out infinite",
                position: "relative",
              }}>
                <BossArt bossId={boss.id} size={140} hit={animatingDamage} lowHP={bossHpPct < 25} />
              </div>
              <div style={{
                fontSize: 10, fontWeight: 700, color: theme.glowColor,
                marginTop: 4, textAlign: "center",
              }}>
                {boss.name}
              </div>
            </div>
          </div>

          {/* Stats row below arena */}
          <div style={{
            display: "flex", justifyContent: "center", gap: 12, marginTop: 10,
            position: "relative", zIndex: 2,
          }}>
            <StreakBadge streak={myTP?.streak || 0} />
            <div style={{
              display: "flex", alignItems: "center", gap: 4,
              padding: "4px 10px", borderRadius: 8,
              background: "rgba(231,76,60,0.15)", border: "1px solid rgba(231,76,60,0.3)",
            }}>
              <span style={{ fontSize: 14 }}>⚔️</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: "#e74c3c" }}>{myTP?.damage || 0}</span>
            </div>
            <div style={{
              fontSize: 11, color: "rgba(255,255,255,0.3)", alignSelf: "center",
            }}>
              Q {myQNum}/{totalQs}
            </div>
          </div>
        </div>

        {/* ══ QUESTION AREA ══ */}
        {!isFinished && myQuestion && !showResult && (
          <div style={{
            background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 14, padding: "16px", marginBottom: 12,
          }}>
            {/* Question prompt */}
            <div style={{
              fontSize: 16, fontWeight: 600, lineHeight: 1.6,
              color: "#fff", marginBottom: 14,
            }}>
              {myQuestion.prompt}
            </div>

            {/* 2x2 Answer grid */}
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8,
            }}>
              {myQuestion.options.map((opt, i) => {
                const isElim = eliminatedOptions.includes(i) || eliminatedOption === i;
                const isSel = selectedAnswer === i;
                const tc = myTP.color || ACCENT;
                return (
                  <button
                    key={i}
                    onClick={() => !isElim && setSelectedAnswer(i)}
                    disabled={isElim}
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "12px",
                      background: isElim ? "rgba(255,255,255,0.02)" : isSel ? `${tc}33` : "rgba(255,255,255,0.06)",
                      border: isSel ? `2px solid ${tc}` : "1.5px solid rgba(255,255,255,0.1)",
                      borderRadius: 10,
                      cursor: isElim ? "default" : "pointer",
                      fontSize: 14, textAlign: "left", color: isElim ? "rgba(255,255,255,0.2)" : "#fff",
                      opacity: isElim ? 0.25 : 1,
                      textDecoration: isElim ? "line-through" : "none",
                      transition: "transform 0.1s, border-color 0.15s",
                      minHeight: 48,
                      fontFamily: "'Nunito', var(--font-body), sans-serif",
                    }}
                  >
                    <span style={{
                      width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                      background: isSel ? tc : "rgba(255,255,255,0.08)",
                      color: isSel ? "#fff" : "rgba(255,255,255,0.5)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 700, fontSize: 12,
                      boxShadow: isSel ? `0 0 10px ${tc}66` : "none",
                    }}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span style={{ lineHeight: 1.3 }}>{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Attack button */}
            <button
              onClick={() => { handleSubmitAnswer(); setShowFlash(true); setFlashColor(ACCENT); setTimeout(() => setShowFlash(false), 300); }}
              disabled={selectedAnswer === null || submitting}
              style={{
                width: "100%", marginTop: 12, padding: "12px",
                borderRadius: 10, border: "none",
                background: selectedAnswer !== null
                  ? "linear-gradient(135deg, #e74c3c, #c0392b)"
                  : "rgba(255,255,255,0.06)",
                color: "#fff", fontWeight: 800, fontSize: 16,
                cursor: selectedAnswer !== null ? "pointer" : "default",
                opacity: selectedAnswer !== null ? 1 : 0.35,
                boxShadow: selectedAnswer !== null ? "0 0 20px rgba(231,76,60,0.4)" : "none",
                transition: "opacity 0.2s, box-shadow 0.2s",
                minHeight: 48,
                fontFamily: "'Nunito', var(--font-body), sans-serif",
              }}
              data-translatable
            >
              ⚔️ {submitting ? "..." : ui(2, "Attack!")}
            </button>
          </div>
        )}

        {/* ══ RESULT CARD ══ */}
        {showResult && lastResult && (
          <div style={{
            background: lastResult.correct ? "rgba(46,204,113,0.12)" : "rgba(231,76,60,0.12)",
            border: lastResult.correct ? "2px solid rgba(46,204,113,0.4)" : "2px solid rgba(231,76,60,0.4)",
            borderRadius: 14, padding: "20px 16px", marginBottom: 12,
            textAlign: "center",
          }}>
            {/* Big icon */}
            <div style={{
              fontSize: 44, marginBottom: 6,
              animation: lastResult.correct ? "victoryBurst 0.5s ease-out" : "defeatSink 0.4s ease",
            }}>
              {lastResult.correct
                ? (lastResult.criticalHit ? "💥" : "⚔️")
                : lastResult.shielded ? "🛡️" : lastResult.dodged ? "💨" : "😈"}
            </div>

            {/* Title */}
            <div style={{
              fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 900, color: "#fff",
              marginBottom: 8,
            }} data-translatable>
              {lastResult.correct
                ? `${lastResult.criticalHit ? ui(27, "CRIT!") + " " : ""}${ui(6, "Correct!")} +${lastResult.damage} ${ui(7, "damage dealt")}`
                : lastResult.shielded ? ui(8, "Shield Blocked the counterattack!")
                : lastResult.dodged ? ui(9, "Dodged the counterattack!")
                : ui(10, "Miss! Class takes damage")}
            </div>

            {/* Counterattack detail */}
            {!lastResult.correct && lastResult.counterattack && !lastResult.shielded && !lastResult.dodged && (
              <div style={{
                padding: "8px 12px", borderRadius: 8,
                background: "rgba(139,26,26,0.3)", border: "1px solid rgba(231,76,60,0.3)",
                marginBottom: 8, fontSize: 12, color: "#ff8888",
              }}>
                {lastResult.counterattack.icon} <strong>{lastResult.counterattack.name}</strong> — {lastResult.classDamage} damage to class
              </div>
            )}

            {/* Passive procs */}
            {lastResult.passiveProcs?.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8, justifyContent: "center" }}>
                {lastResult.passiveProcs.map((proc, i) => (
                  <span key={i} style={{
                    fontSize: 11, padding: "3px 10px", borderRadius: 6,
                    background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.3)",
                    color: "#c084fc",
                  }}>{proc.description}</span>
                ))}
              </div>
            )}

            {/* Correct answer if wrong */}
            {!lastResult.correct && myQuestion && (
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>
                Correct: <strong style={{ color: "#2ecc71" }}>{myQuestion.options[myQuestion.correctIndex]}</strong>
              </div>
            )}

            {/* Explanation */}
            {myQuestion?.explanation && (
              <div style={{
                fontSize: 12, color: "rgba(255,255,255,0.4)",
                padding: "8px 12px", background: "rgba(255,255,255,0.05)", borderRadius: 8,
                marginBottom: 10, textAlign: "left",
              }}>
                💡 {myQuestion.explanation}
              </div>
            )}

            {/* Next / Done */}
            {myTP && !myTP.finished && battle.status === "active" && (
              <button
                onClick={() => { if (autoAdvanceTimer) clearTimeout(autoAdvanceTimer); handleNextQuestion(); }}
                style={{
                  padding: "10px 24px", borderRadius: 10, border: "none",
                  background: "linear-gradient(135deg, #2ecc71, #27ae60)",
                  color: "#fff", fontWeight: 800, fontSize: 15,
                  cursor: "pointer", minHeight: 48,
                  fontFamily: "'Nunito', var(--font-body), sans-serif",
                }}
                data-translatable
              >
                {ui(11, "Next Question")} →
              </button>
            )}
            {myTP?.finished && battle.status === "active" && (
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 6 }} data-translatable>
                ✅ {ui(12, "All Questions Answered!")}
              </div>
            )}
          </div>
        )}

        {/* ══ ABILITY BAR ══ */}
        {!isFinished && !showResult && myQuestion && (
          <div style={{
            background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, padding: "10px 12px", marginBottom: 12,
          }}>
            <div style={{
              display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center",
            }}>
              <AbilityBtn
                icon="💡" label={ui(3, "Hint") + (manaState?.enabled ? " (5MP)" : "")}
                onClick={() => handleAbility("hint")}
                disabled={hintUsed || !manaState?.enabled}
                cooldown={0}
                color="#a855f7"
              />
              <AbilityBtn
                icon="🛡️" label={ui(4, "Shield")}
                onClick={() => handleAbility("shield")}
                disabled={myTP.shieldActive}
                cooldown={myTP.shieldCooldown}
                color="#3498db"
                active={myTP.shieldActive}
              />
              <AbilityBtn
                icon="⚔️" label={ui(5, "Crit")}
                onClick={() => handleAbility("criticalHit")}
                disabled={myTP.criticalHitActive}
                cooldown={myTP.critCooldown}
                color="#e74c3c"
                active={myTP.criticalHitActive}
              />
              <AbilityBtn
                icon={activeDef.icon} label={activeDef.name}
                onClick={handleClassAbility}
                disabled={!canUseClassActive}
                cooldown={classActiveCD}
                color={classColor}
                large
              />
            </div>
            {/* Passive indicator */}
            <div style={{
              fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 8,
              textAlign: "center", fontStyle: "italic",
              animation: "arena-passive-shimmer 3s ease-in-out infinite",
            }}>
              {passiveDef.icon} {ui(28, "Passive:")} {passiveDef.name} — {passiveDef.desc}
            </div>
          </div>
        )}

        {/* ══ SPECTATING MODE (finished, battle still active) ══ */}
        {isFinished && !showResult && battle.status === "active" && (
          <div style={{
            background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 14, padding: "24px 16px", textAlign: "center",
            marginBottom: 12, opacity: 0.85,
          }}>
            <div style={{
              fontSize: 40, marginBottom: 8,
              animation: "arena-idle 3s ease-in-out infinite",
            }}>⏳</div>
            <div style={{
              fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: "#fff",
              marginBottom: 6,
            }} data-translatable>
              {ui(12, "All Questions Answered!")}
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }} data-translatable>
              {ui(13, "You dealt")} <strong style={{ color: myTP.color }}>{myTP.damage || 0}</strong> {ui(14, "total damage.")} {ui(15, "Waiting for other teams...")}
            </div>
          </div>
        )}

        {/* ══ TEAM LEADERBOARD ══ */}
        <TeamLeaderboard
          battle={battle}
          myTeamId={myTeamId}
          collapsed={leaderboardCollapsed}
          onToggle={() => setLeaderboardCollapsed(!leaderboardCollapsed)}
        />
      </div>
    </div>
  );
}

// ─── Additional CSS keyframes ───
const ARENA_CSS = `
  @keyframes arena-ready {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
  }
  @keyframes arena-idle {
    0%, 100% { transform: translateY(0) scale(1); opacity: 0.7; }
    50% { transform: translateY(-3px) scale(1.02); opacity: 0.85; }
  }
  @keyframes arena-passive-shimmer {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.5; }
  }
  @keyframes passiveToastIn {
    0% { transform: translateX(100%); opacity: 0; }
    100% { transform: translateX(0); opacity: 1; }
  }
  @keyframes abilityFlashIn {
    0% { transform: scale(0.5); opacity: 0; }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); opacity: 1; }
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;
