// src/components/BadgeGrid.jsx
import { useState } from "react";
import { BADGES, RARITY_COLORS } from "../lib/gamification";
import { useTranslatedTexts } from "../hooks/useTranslatedText.jsx";

export default function BadgeGrid({ earnedBadgeIds = [], showHidden = false, compact = false }) {
  const [celebratingBadge, setCelebratingBadge] = useState(null);

  const uiStrings = useTranslatedTexts([
    "Earned",                                    // 0
    "Locked",                                    // 1
    "hidden badge",                              // 2
    "hidden badges",                             // 3
    "left to discover...",                       // 4
    "Keep exploring to discover this badge!",    // 5
  ]);
  const ui = (i, fallback) => uiStrings?.[i] ?? fallback;

  const visibleBadges = BADGES.filter((b) => {
    if (b.hidden && !earnedBadgeIds.includes(b.id) && !showHidden) return false;
    return true;
  });

  const earned = visibleBadges.filter((b) => earnedBadgeIds.includes(b.id));
  const locked = visibleBadges.filter((b) => !earnedBadgeIds.includes(b.id));
  const hiddenCount = BADGES.filter((b) => b.hidden && !earnedBadgeIds.includes(b.id)).length;

  function handleBadgeClick(badge) {
    if (earnedBadgeIds.includes(badge.id)) {
      setCelebratingBadge(badge.id);
      setTimeout(() => setCelebratingBadge(null), 800);
    }
  }

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: compact ? "repeat(auto-fill, minmax(80px, 1fr))" : "repeat(auto-fill, minmax(140px, 1fr))",
    gap: compact ? 8 : 12,
  };

  return (
    <div>
      {earned.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text2, #aaa)", marginBottom: 10 }} data-translatable>
            {ui(0, "Earned")} ({earned.length})
          </div>
          <div style={gridStyle}>
            {earned.map((badge) => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                unlocked
                celebrating={celebratingBadge === badge.id}
                compact={compact}
                onClick={() => handleBadgeClick(badge)}
                hiddenHint={ui(5, "Keep exploring to discover this badge!")}
              />
            ))}
          </div>
        </div>
      )}

      {locked.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text2, #aaa)", marginBottom: 10 }} data-translatable>
            {ui(1, "Locked")} ({locked.length})
          </div>
          <div style={gridStyle}>
            {locked.map((badge) => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                unlocked={false}
                compact={compact}
                hiddenHint={ui(5, "Keep exploring to discover this badge!")}
              />
            ))}
          </div>
        </div>
      )}

      {hiddenCount > 0 && !showHidden && (
        <div style={{
          marginTop: 12, padding: "10px 14px",
          background: "var(--surface2, #252535)", borderRadius: 8,
          fontSize: 13, color: "var(--text2, #aaa)", textAlign: "center", fontStyle: "italic",
        }} data-translatable>
          🔮 {hiddenCount} {hiddenCount > 1 ? ui(3, "hidden badges") : ui(2, "hidden badge")} {ui(4, "left to discover...")}
        </div>
      )}
    </div>
  );
}

function BadgeCard({ badge, unlocked, celebrating = false, compact = false, onClick, hiddenHint }) {
  const [hovered, setHovered] = useState(false);
  const rarity = RARITY_COLORS[badge.rarity] || RARITY_COLORS.common;

  const cardStyle = {
    position: "relative",
    background: unlocked ? rarity.bg : "var(--surface2, #252535)",
    border: `2px solid ${unlocked ? rarity.border : "var(--border, #2a2a3a)"}`,
    borderRadius: 10,
    padding: compact ? "10px 6px" : "14px 10px",
    textAlign: "center",
    cursor: unlocked ? "pointer" : "default",
    transition: "all 0.2s ease",
    transform: celebrating ? "scale(1.1)" : hovered && unlocked ? "translateY(-2px)" : "none",
    boxShadow: celebrating
      ? `0 0 20px ${rarity.border}88`
      : unlocked && hovered
      ? `0 4px 12px ${rarity.border}33`
      : "none",
    opacity: unlocked ? 1 : 0.5,
    filter: unlocked ? "none" : "grayscale(0.6)",
    overflow: "hidden",
  };

  const iconStyle = {
    fontSize: compact ? 24 : 32,
    marginBottom: compact ? 4 : 8,
    display: "block",
    filter: unlocked ? "none" : "grayscale(1) brightness(0.7)",
  };

  const nameStyle = {
    fontSize: compact ? 11 : 13,
    fontWeight: 600,
    color: unlocked ? "var(--text1, #e8e8e8)" : "var(--text2, #aaa)",
    marginBottom: compact ? 0 : 4,
    lineHeight: 1.2,
  };

  const descStyle = {
    fontSize: 11,
    color: "var(--text2, #aaa)",
    lineHeight: 1.3,
  };

  const rarityTagStyle = {
    position: "absolute",
    top: 4,
    right: 4,
    fontSize: 9,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    color: rarity.border,
    opacity: 0.8,
  };

  const sparkleStyle = celebrating
    ? {
        position: "absolute",
        inset: 0,
        background: `radial-gradient(circle, ${rarity.border}33 0%, transparent 70%)`,
        animation: "badgePulse 0.8s ease-out",
        pointerEvents: "none",
      }
    : {};

  return (
    <div
      style={cardStyle}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={unlocked ? `${badge.name} — ${badge.description}` : `🔒 ${badge.description}`}
    >
      {celebrating && <div style={sparkleStyle} />}

      {!compact && badge.rarity !== "common" && (
        <div style={rarityTagStyle}>{rarity.label}</div>
      )}

      <span style={iconStyle}>
        {badge.hidden && !unlocked ? "❓" : badge.icon}
      </span>
      <div style={nameStyle}>
        {badge.hidden && !unlocked ? "???" : badge.name}
      </div>
      {!compact && (
        <div style={descStyle}>
          {badge.hidden && !unlocked ? hiddenHint : badge.description}
        </div>
      )}

      {unlocked && (
        <div style={{
          position: "absolute",
          bottom: 4, left: 4,
          fontSize: 10,
          background: rarity.border,
          color: "#fff",
          borderRadius: 10,
          padding: "1px 5px",
          fontWeight: 700,
        }}>
          ✓
        </div>
      )}
    </div>
  );
}
