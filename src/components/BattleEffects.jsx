// src/components/BattleEffects.jsx
// Visual effects system for Boss Battles
// Handles: particles, floating damage, screen flashes, animated backgrounds, team avatars

import { useState, useEffect, useRef } from "react";
import PixelBoss from "./PixelBoss";
import { useTranslatedText } from "../hooks/useTranslatedText.jsx";

// ─── Team Avatars based on color ───
export const TEAM_AVATARS = {
  red: { icon: "⚔️", name: "Warrior", sprite: "🧑‍🔧", color: "#e74c3c" },
  blue: { icon: "🧙", name: "Mage", sprite: "🧙", color: "#3498db" },
  green: { icon: "🏹", name: "Ranger", sprite: "🧝", color: "#2ecc71" },
  purple: { icon: "🔮", name: "Sorcerer", sprite: "🧑‍🎤", color: "#9b59b6" },
  orange: { icon: "🛡️", name: "Paladin", sprite: "🦸", color: "#f39c12" },
  cyan: { icon: "🗡️", name: "Rogue", sprite: "🥷", color: "#00cec9" },
  pink: { icon: "✨", name: "Cleric", sprite: "🧚", color: "#fd79a8" },
  yellow: { icon: "⚡", name: "Monk", sprite: "🧑‍🦲", color: "#fdcb6e" },
};

// ─── Boss Themes (backgrounds + art) ───
export const BOSS_THEMES = {
  dragon: {
    bg: "radial-gradient(ellipse at 50% 120%, #4a1a0a 0%, #1a0505 50%, #0a0a0f 100%)",
    particles: ["🔥", "🔥", "💨", "✨"],
    particleColor: "#f39c12",
    glowColor: "#e74c3c",
    ambientAnim: "dragonFlicker",
    art: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="dg" cx="50%" cy="50%"><stop offset="0%" stop-color="#ff6b35"/><stop offset="100%" stop-color="#c0392b"/></radialGradient>
        <filter id="dglow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <ellipse cx="100" cy="130" rx="60" ry="35" fill="#1a0505" opacity="0.5"/>
      <path d="M60 120 Q40 80 55 50 Q65 70 75 60 Q80 40 100 35 Q120 40 125 60 Q135 70 145 50 Q160 80 140 120 Z" fill="url(#dg)" filter="url(#dglow)"/>
      <path d="M55 50 Q45 30 35 40" stroke="#ff6b35" stroke-width="3" fill="none"/>
      <path d="M145 50 Q155 30 165 40" stroke="#ff6b35" stroke-width="3" fill="none"/>
      <circle cx="85" cy="75" r="6" fill="#ffed4a"/>
      <circle cx="115" cy="75" r="6" fill="#ffed4a"/>
      <circle cx="85" cy="75" r="3" fill="#1a0505"/>
      <circle cx="115" cy="75" r="3" fill="#1a0505"/>
      <path d="M85 100 Q100 115 115 100" stroke="#ffed4a" stroke-width="2" fill="none"/>
      <path d="M88 100 L92 108 L96 100 L100 108 L104 100 L108 108 L112 100" stroke="#fff" stroke-width="1.5" fill="none"/>
      <path d="M40 110 Q20 90 30 70 Q35 85 45 95 Z" fill="#c0392b" opacity="0.8"/>
      <path d="M160 110 Q180 90 170 70 Q165 85 155 95 Z" fill="#c0392b" opacity="0.8"/>
    </svg>`,
  },
  golem: {
    bg: "radial-gradient(ellipse at 50% 120%, #2a2a1a 0%, #111108 50%, #0a0a0f 100%)",
    particles: ["🪨", "💎", "✨", "⚡"],
    particleColor: "#95a5a6",
    glowColor: "#7f8c8d",
    ambientAnim: "golemPulse",
    art: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#7f8c8d"/><stop offset="100%" stop-color="#4a4a3a"/></linearGradient>
        <filter id="gglow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <ellipse cx="100" cy="155" rx="55" ry="20" fill="#111108" opacity="0.5"/>
      <rect x="60" y="60" width="80" height="90" rx="8" fill="url(#gg)" filter="url(#gglow)"/>
      <rect x="70" y="45" width="60" height="25" rx="6" fill="#6a6a5a"/>
      <rect x="55" y="80" width="15" height="50" rx="4" fill="#5a5a4a"/>
      <rect x="130" y="80" width="15" height="50" rx="4" fill="#5a5a4a"/>
      <rect x="80" cy="68" r="8" fill="#2ecc71"/>
      <circle cx="82" cy="58" r="7" fill="#2ecc71" filter="url(#gglow)"/>
      <circle cx="118" cy="58" r="7" fill="#2ecc71" filter="url(#gglow)"/>
      <circle cx="82" cy="58" r="3" fill="#0a3a0a"/>
      <circle cx="118" cy="58" r="3" fill="#0a3a0a"/>
      <line x1="85" y1="100" x2="115" y2="100" stroke="#4a4a3a" stroke-width="3" stroke-linecap="round"/>
      <path d="M65 105 L70 115 L75 105" stroke="#555" stroke-width="1" fill="none"/>
      <path d="M125 105 L130 115 L135 105" stroke="#555" stroke-width="1" fill="none"/>
    </svg>`,
  },
  hydra: {
    bg: "radial-gradient(ellipse at 50% 120%, #0a2a1a 0%, #051510 50%, #0a0a0f 100%)",
    particles: ["🐍", "💀", "☠️", "✨"],
    particleColor: "#2ecc71",
    glowColor: "#27ae60",
    ambientAnim: "hydraSlither",
    art: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="hg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#27ae60"/><stop offset="100%" stop-color="#1a5a2a"/></linearGradient>
        <filter id="hglow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <ellipse cx="100" cy="160" rx="50" ry="15" fill="#051510" opacity="0.5"/>
      <path d="M80 140 Q60 100 50 60 Q55 50 65 55 Q60 80 80 110 Z" fill="url(#hg)" filter="url(#hglow)"/>
      <path d="M100 140 Q100 90 100 50 Q110 45 115 50 Q110 90 110 140 Z" fill="url(#hg)" filter="url(#hglow)"/>
      <path d="M120 140 Q140 100 150 60 Q145 50 135 55 Q140 80 120 110 Z" fill="url(#hg)" filter="url(#hglow)"/>
      <circle cx="55" cy="55" r="5" fill="#ff4444"/>
      <circle cx="105" cy="48" r="5" fill="#ff4444"/>
      <circle cx="145" cy="55" r="5" fill="#ff4444"/>
      <circle cx="55" cy="55" r="2" fill="#1a0505"/>
      <circle cx="105" cy="48" r="2" fill="#1a0505"/>
      <circle cx="145" cy="55" r="2" fill="#1a0505"/>
      <ellipse cx="100" cy="150" rx="35" ry="20" fill="#1a5a2a"/>
    </svg>`,
  },
  phantom: {
    bg: "radial-gradient(ellipse at 50% 120%, #1a1a2a 0%, #0a0a15 50%, #050510 100%)",
    particles: ["👻", "💀", "🌙", "✨"],
    particleColor: "#9b59b6",
    glowColor: "#8e44ad",
    ambientAnim: "phantomFloat",
    art: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="pg" cx="50%" cy="40%"><stop offset="0%" stop-color="#bb88ee" stop-opacity="0.9"/><stop offset="100%" stop-color="#6a3a9a" stop-opacity="0.4"/></radialGradient>
        <filter id="pglow"><feGaussianBlur stdDeviation="5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <path d="M60 160 Q60 60 100 40 Q140 60 140 160 L130 145 L120 160 L110 145 L100 160 L90 145 L80 160 L70 145 Z" fill="url(#pg)" filter="url(#pglow)"/>
      <ellipse cx="82" cy="85" rx="12" ry="15" fill="#0a0a15"/>
      <ellipse cx="118" cy="85" rx="12" ry="15" fill="#0a0a15"/>
      <circle cx="82" cy="85" r="5" fill="#ff4444" opacity="0.8"/>
      <circle cx="118" cy="85" r="5" fill="#ff4444" opacity="0.8"/>
      <ellipse cx="100" cy="110" rx="8" ry="12" fill="#0a0a15"/>
    </svg>`,
  },
  kraken: {
    bg: "radial-gradient(ellipse at 50% 120%, #0a1a2a 0%, #050f1a 50%, #020810 100%)",
    particles: ["🌊", "💧", "🫧", "✨"],
    particleColor: "#3498db",
    glowColor: "#2980b9",
    ambientAnim: "krakenWave",
    art: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="kg" cx="50%" cy="50%"><stop offset="0%" stop-color="#e74c3c"/><stop offset="100%" stop-color="#8b1a1a"/></radialGradient>
        <filter id="kglow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <ellipse cx="100" cy="80" rx="40" ry="35" fill="url(#kg)" filter="url(#kglow)"/>
      <circle cx="85" cy="72" r="8" fill="#ffed4a"/>
      <circle cx="115" cy="72" r="8" fill="#ffed4a"/>
      <circle cx="85" cy="72" r="4" fill="#1a0505"/>
      <circle cx="115" cy="72" r="4" fill="#1a0505"/>
      <path d="M60 100 Q40 140 30 170" stroke="#c0392b" stroke-width="8" fill="none" stroke-linecap="round"/>
      <path d="M70 105 Q55 145 50 170" stroke="#c0392b" stroke-width="7" fill="none" stroke-linecap="round"/>
      <path d="M130 105 Q145 145 150 170" stroke="#c0392b" stroke-width="7" fill="none" stroke-linecap="round"/>
      <path d="M140 100 Q160 140 170 170" stroke="#c0392b" stroke-width="8" fill="none" stroke-linecap="round"/>
      <path d="M85 95 Q100 110 115 95" stroke="#8b1a1a" stroke-width="2" fill="none"/>
    </svg>`,
  },
  chimera: {
    bg: "radial-gradient(ellipse at 50% 120%, #2a1a0a 0%, #150a05 50%, #0a0a0f 100%)",
    particles: ["🦁", "🔥", "⚡", "✨"],
    particleColor: "#f39c12",
    glowColor: "#d35400",
    ambientAnim: "chimeraRoar",
    art: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="cg" cx="50%" cy="50%"><stop offset="0%" stop-color="#f39c12"/><stop offset="100%" stop-color="#d35400"/></radialGradient>
        <filter id="cglow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <ellipse cx="100" cy="155" rx="55" ry="18" fill="#150a05" opacity="0.5"/>
      <ellipse cx="100" cy="95" rx="35" ry="30" fill="url(#cg)" filter="url(#cglow)"/>
      <path d="M65 85 Q50 50 40 60 Q55 55 65 75 Z" fill="#f39c12"/>
      <path d="M135 85 Q150 50 160 60 Q145 55 135 75 Z" fill="#f39c12"/>
      <path d="M70 70 Q60 40 75 45 Q70 55 75 65 Z" fill="#e67e22"/>
      <path d="M130 70 Q140 40 125 45 Q130 55 125 65 Z" fill="#e67e22"/>
      <path d="M80 65 Q85 35 95 50 Z" fill="#d35400"/>
      <path d="M120 65 Q115 35 105 50 Z" fill="#d35400"/>
      <circle cx="88" cy="88" r="6" fill="#fff"/>
      <circle cx="112" cy="88" r="6" fill="#fff"/>
      <circle cx="88" cy="88" r="3" fill="#1a0505"/>
      <circle cx="112" cy="88" r="3" fill="#1a0505"/>
      <path d="M90 108 Q100 118 110 108" stroke="#1a0505" stroke-width="2" fill="none"/>
      <path d="M92 108 L96 114 L100 108 L104 114 L108 108" stroke="#fff" stroke-width="1.5" fill="none"/>
      <path d="M75 130 Q70 155 65 165" stroke="#d35400" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M125 130 Q130 155 135 165" stroke="#d35400" stroke-width="5" fill="none" stroke-linecap="round"/>
    </svg>`,
  },
};

// ─── Floating Damage Number ───
export function DamageNumber({ amount, x, y, isCrit, type = "damage" }) {
  const [visible, setVisible] = useState(true);
  const critLabel = useTranslatedText("CRIT!");

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 1500);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  const color = type === "damage" ? (isCrit ? "#ffed4a" : "#e74c3c") : type === "heal" ? "#2ecc71" : "#ff6b6b";
  const prefix = type === "damage" ? "-" : "+";

  return (
    <div style={{
      position: "absolute", left: x, top: y, pointerEvents: "none", zIndex: 100,
      animation: "damageFloat 1.5s ease-out forwards",
      fontFamily: "var(--font-display)", fontSize: isCrit ? 42 : 32, fontWeight: 900,
      color, textShadow: `0 0 20px ${color}, 0 2px 4px rgba(0,0,0,0.8)`,
    }}>
      {prefix}{amount}
      {isCrit && <span style={{ fontSize: 18, marginLeft: 4 }}>{critLabel || "CRIT!"}</span>}
    </div>
  );
}

// ─── Particle System ───
export function ParticleField({ particles = ["✨"], count = 15, speed = 1, color = "#fff" }) {
  const items = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 8 + Math.random() * 14,
      duration: 3 + Math.random() * 4 * (1 / speed),
      delay: Math.random() * 5,
      char: particles[Math.floor(Math.random() * particles.length)],
      opacity: 0.15 + Math.random() * 0.35,
    }))
  ).current;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 1 }}>
      {items.map((p) => (
        <div key={p.id} style={{
          position: "absolute", left: `${p.x}%`, fontSize: p.size, opacity: p.opacity,
          animation: `particleRise ${p.duration}s linear ${p.delay}s infinite`,
        }}>
          {p.char}
        </div>
      ))}
    </div>
  );
}

// ─── Hit Explosion Effect ───
export function HitExplosion({ active, x = "50%", y = "50%", color = "#e74c3c" }) {
  if (!active) return null;
  return (
    <div style={{
      position: "absolute", left: x, top: y, transform: "translate(-50%, -50%)",
      pointerEvents: "none", zIndex: 50,
    }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} style={{
          position: "absolute", width: 6, height: 6, borderRadius: "50%",
          background: color, animation: `explodeParticle 0.6s ease-out forwards`,
          transform: `rotate(${i * 45}deg) translateY(-20px)`,
          opacity: 0,
          animationDelay: `${i * 0.03}s`,
        }} />
      ))}
      <div style={{
        width: 40, height: 40, borderRadius: "50%",
        background: `radial-gradient(circle, ${color}88, transparent)`,
        animation: "explodeRing 0.5s ease-out forwards",
        transform: "translate(-50%, -50%)",
      }} />
    </div>
  );
}

// ─── Screen Flash ───
export function ScreenFlash({ active, color = "#e74c3c" }) {
  if (!active) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, background: color, opacity: 0, zIndex: 200,
      animation: "screenFlash 0.3s ease-out forwards", pointerEvents: "none",
    }} />
  );
}

// ─── Shield Bubble Effect ───
export function ShieldBubble({ active, color = "#3498db" }) {
  if (!active) return null;
  return (
    <div style={{
      position: "absolute", inset: -10, borderRadius: "50%",
      border: `3px solid ${color}`, opacity: 0.6,
      animation: "shieldPulse 2s ease-in-out infinite",
      background: `radial-gradient(circle, ${color}11, transparent)`,
      pointerEvents: "none", zIndex: 10,
    }} />
  );
}

// ─── Boss Art Renderer ───
export function BossArt({ bossId, size = 160, hit = false, lowHP = false }) {
  const theme = BOSS_THEMES[bossId] || BOSS_THEMES.dragon;

  return (
    <div style={{
      width: size, height: size, position: "relative",
    }}>
      <div style={{
        position: "absolute", inset: -20, borderRadius: "50%",
        background: `radial-gradient(circle, ${theme.glowColor}44, transparent)`,
        animation: `${theme.ambientAnim} 3s ease-in-out infinite`,
      }} />
      <div style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
        <PixelBoss bossId={bossId} size={size} hit={hit} lowHP={lowHP} />
      </div>
    </div>
  );
}

// ─── All battle CSS keyframes ───
export const BATTLE_CSS = `
  @keyframes damageFloat {
    0% { opacity: 1; transform: translateY(0) scale(0.5); }
    20% { opacity: 1; transform: translateY(-10px) scale(1.2); }
    100% { opacity: 0; transform: translateY(-80px) scale(0.8); }
  }
  @keyframes particleRise {
    0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
    10% { opacity: var(--particle-opacity, 0.3); }
    90% { opacity: var(--particle-opacity, 0.3); }
    100% { transform: translateY(-20px) rotate(360deg); opacity: 0; }
  }
  @keyframes explodeParticle {
    0% { opacity: 1; transform: rotate(var(--angle)) translateY(0) scale(1); }
    100% { opacity: 0; transform: rotate(var(--angle)) translateY(-60px) scale(0); }
  }
  @keyframes explodeRing {
    0% { transform: translate(-50%, -50%) scale(0); opacity: 0.8; }
    100% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
  }
  @keyframes screenFlash {
    0% { opacity: 0.4; }
    100% { opacity: 0; }
  }
  @keyframes shieldPulse {
    0%, 100% { transform: scale(1); opacity: 0.4; }
    50% { transform: scale(1.05); opacity: 0.7; }
  }
  @keyframes bossIdle {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  @keyframes bossHit {
    0% { transform: scale(1) rotate(0); filter: brightness(1); }
    15% { transform: scale(0.85) rotate(-8deg); filter: brightness(3); }
    30% { transform: scale(1.15) rotate(5deg); filter: brightness(0.6); }
    50% { transform: scale(0.95) rotate(-3deg); filter: brightness(1.5); }
    100% { transform: scale(1) rotate(0); filter: brightness(1); }
  }
  @keyframes screenShake {
    0%, 100% { transform: translateX(0) translateY(0); }
    10% { transform: translateX(-10px) translateY(-5px); }
    20% { transform: translateX(10px) translateY(3px); }
    30% { transform: translateX(-8px) translateY(-3px); }
    40% { transform: translateX(8px) translateY(5px); }
    50% { transform: translateX(-5px) translateY(-2px); }
    60% { transform: translateX(5px) translateY(2px); }
    80% { transform: translateX(-2px) translateY(-1px); }
  }
  @keyframes dragonFlicker {
    0%, 100% { opacity: 0.5; transform: scale(1); }
    25% { opacity: 0.7; transform: scale(1.05); }
    50% { opacity: 0.4; transform: scale(0.98); }
    75% { opacity: 0.65; transform: scale(1.03); }
  }
  @keyframes golemPulse {
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50% { opacity: 0.6; transform: scale(1.02); }
  }
  @keyframes hydraSlither {
    0%, 100% { opacity: 0.5; transform: translateX(0); }
    33% { opacity: 0.6; transform: translateX(-5px); }
    66% { opacity: 0.4; transform: translateX(5px); }
  }
  @keyframes phantomFloat {
    0%, 100% { opacity: 0.3; transform: translateY(0) scale(1); }
    50% { opacity: 0.6; transform: translateY(-8px) scale(1.05); }
  }
  @keyframes krakenWave {
    0%, 100% { opacity: 0.4; transform: scale(1) rotate(0); }
    50% { opacity: 0.6; transform: scale(1.03) rotate(1deg); }
  }
  @keyframes chimeraRoar {
    0%, 100% { opacity: 0.5; transform: scale(1); }
    30% { opacity: 0.7; transform: scale(1.06); }
    60% { opacity: 0.4; transform: scale(0.97); }
  }
  @keyframes teamBounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
  }
  @keyframes victoryBurst {
    0% { transform: scale(0) rotate(-180deg); opacity: 0; }
    50% { transform: scale(1.3) rotate(10deg); opacity: 1; }
    100% { transform: scale(1) rotate(0); opacity: 1; }
  }
  @keyframes defeatSink {
    0% { transform: translateY(0) scale(1); opacity: 1; }
    100% { transform: translateY(20px) scale(0.9); opacity: 0.6; }
  }
  @keyframes hpDrain {
    0% { filter: brightness(1); }
    50% { filter: brightness(1.5); }
    100% { filter: brightness(1); }
  }
`;
