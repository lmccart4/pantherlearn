// src/components/RankProgress.jsx
import { useState, useEffect } from "react";
import {
  LEVELS,
  RANK_TIERS,
  getLevelInfo,
  getRankTier,
  getNextTierMilestone,
  getUnlockedPerks,
  getNextPerk,
  canUsePerk,
  loadCoursePerks,
  requestPerkRedemption,
  DEFAULT_PERKS,
} from "../lib/gamification";
import { useTranslatedTexts } from "../hooks/useTranslatedText.jsx";

const styles = {
  container: {
    background: "#1a1a2e",
    borderRadius: 16,
    padding: 24,
    color: "#e0e0e0",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  rankHeader: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginBottom: 20,
  },
  rankCircle: (color) => ({
    width: 64,
    height: 64,
    borderRadius: "50%",
    background: `radial-gradient(circle at 30% 30%, ${color}44, ${color}11)`,
    border: `3px solid ${color}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 28,
    flexShrink: 0,
    boxShadow: `0 0 20px ${color}33`,
  }),
  rankInfo: {
    flex: 1,
  },
  rankName: (color) => ({
    fontSize: 22,
    fontWeight: 700,
    color,
    lineHeight: 1.2,
  }),
  rankLevel: {
    fontSize: 13,
    color: "#8892b0",
    marginTop: 2,
  },
  xpBarContainer: {
    marginTop: 10,
    background: "#0d0d1a",
    borderRadius: 8,
    height: 12,
    overflow: "hidden",
    position: "relative",
  },
  xpBarFill: (color, pct) => ({
    height: "100%",
    borderRadius: 8,
    background: `linear-gradient(90deg, ${color}88, ${color})`,
    width: `${pct}%`,
    transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: `0 0 8px ${color}66`,
  }),
  xpText: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 11,
    color: "#666",
    marginTop: 4,
  },
  roadmapTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#fff",
    marginBottom: 14,
    marginTop: 24,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  tierTrack: {
    position: "relative",
    paddingLeft: 20,
  },
  tierLine: {
    position: "absolute",
    left: 14,
    top: 0,
    bottom: 0,
    width: 3,
    background: "#2a2a4a",
    borderRadius: 2,
  },
  tierNode: (active, color) => ({
    position: "relative",
    paddingLeft: 28,
    paddingBottom: 20,
    opacity: active ? 1 : 0.4,
  }),
  tierDot: (active, color) => ({
    position: "absolute",
    left: -9,
    top: 2,
    width: 20,
    height: 20,
    borderRadius: "50%",
    background: active ? color : "#2a2a4a",
    border: `2px solid ${active ? color : "#444"}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 10,
    zIndex: 1,
    boxShadow: active ? `0 0 10px ${color}44` : "none",
  }),
  tierNodeName: (active, color) => ({
    fontSize: 14,
    fontWeight: 600,
    color: active ? color : "#555",
  }),
  tierNodeRange: {
    fontSize: 11,
    color: "#666",
    marginTop: 1,
  },
  perksList: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 6,
  },
  perkChip: (unlocked, color) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: "4px 10px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 500,
    background: unlocked ? `${color}22` : "#1a1a2e",
    color: unlocked ? color : "#555",
    border: `1px solid ${unlocked ? `${color}44` : "#2a2a4a"}`,
  }),
  unlockedSection: {
    marginTop: 24,
    padding: 18,
    background: "#16162b",
    borderRadius: 12,
    border: "1px solid #2a2a4a",
  },
  unlockedTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: "#fff",
    marginBottom: 12,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  perkCard: (color) => ({
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 14px",
    background: `${color}0a`,
    borderRadius: 10,
    marginBottom: 8,
    border: `1px solid ${color}22`,
  }),
  perkCardIcon: {
    fontSize: 22,
    width: 36,
    textAlign: "center",
  },
  perkCardInfo: {
    flex: 1,
  },
  perkCardName: {
    fontSize: 13,
    fontWeight: 600,
    color: "#fff",
  },
  perkCardDesc: {
    fontSize: 11,
    color: "#8892b0",
    marginTop: 1,
  },
  useBtn: (color) => ({
    background: `${color}22`,
    color,
    border: `1px solid ${color}44`,
    borderRadius: 8,
    padding: "6px 14px",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
  }),
  usedBadge: {
    fontSize: 11,
    color: "#666",
    fontStyle: "italic",
  },
  nextPerkTeaser: {
    marginTop: 16,
    padding: 14,
    background: "#0d0d1a",
    borderRadius: 10,
    border: "1px dashed #2a2a4a",
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  nextPerkIcon: {
    fontSize: 24,
    opacity: 0.5,
    filter: "grayscale(80%)",
  },
  nextPerkInfo: {
    flex: 1,
  },
  nextPerkName: {
    fontSize: 13,
    fontWeight: 600,
    color: "#666",
  },
  nextPerkLevel: {
    fontSize: 11,
    color: "#555",
    marginTop: 2,
  },
};

export default function RankProgress({
  totalXP = 0,
  courseId = null,
  uid = null,
  studentName = "",
  perkUsage = {},
}) {
  const [coursePerks, setCoursePerks] = useState(DEFAULT_PERKS);
  const [requesting, setRequesting] = useState(null);

  const uiStrings = useTranslatedTexts([
    "Level",                        // 0
    "Tier",                         // 1
    "XP total",                     // 2
    "Rank Roadmap",                 // 3
    "CURRENT",                      // 4
    "Levels",                       // 5
    "Your Unlocked Perks",          // 6
    "used this semester",           // 7
    "Active",                       // 8
    "Requesting...",                // 9
    "Use",                          // 10
    "All used this semester",       // 11
    "Next Perk:",                   // 12
    "Unlocks at Level",             // 13
    "XP to go",                     // 14
    "MAX LEVEL",                    // 15
    "XP to Level",                  // 16
    "Perk request sent to your teacher!", // 17
  ]);
  const ui = (i, fallback) => uiStrings?.[i] ?? fallback;

  useEffect(() => {
    if (courseId) {
      loadCoursePerks(courseId).then(setCoursePerks);
    }
  }, [courseId]);

  const levelInfo = getLevelInfo(totalXP);
  const currentLevel = levelInfo.current.level;
  const tier = getRankTier(currentLevel);
  const nextMilestone = getNextTierMilestone(currentLevel);
  const unlockedPerks = getUnlockedPerks(currentLevel, coursePerks);
  const nextPerk = getNextPerk(currentLevel, coursePerks);
  const courseUsage = perkUsage?.[courseId] || {};

  async function handleRequestPerk(perkId) {
    setRequesting(perkId);
    await requestPerkRedemption(uid, perkId, courseId, studentName);
    setRequesting(null);
    alert(ui(17, "Perk request sent to your teacher!"));
  }

  return (
    <div style={styles.container}>
      {/* Current Rank Display */}
      <div style={styles.rankHeader}>
        <div style={styles.rankCircle(tier.color)}>{tier.icon}</div>
        <div style={styles.rankInfo}>
          <div style={styles.rankName(tier.color)}>
            {levelInfo.current.name}
          </div>
          <div style={styles.rankLevel} data-translatable>
            {ui(0, "Level")} {currentLevel} • {tier.name} {ui(1, "Tier")} •{" "}
            {totalXP.toLocaleString()} {ui(2, "XP total")}
          </div>
          <div style={styles.xpBarContainer}>
            <div
              style={styles.xpBarFill(tier.color, levelInfo.progress)}
            />
          </div>
          <div style={styles.xpText}>
            <span>{levelInfo.xpInLevel.toLocaleString()} XP</span>
            <span data-translatable>
              {levelInfo.next
                ? `${levelInfo.xpForNext.toLocaleString()} ${ui(16, "XP to Level")} ${levelInfo.next.level}`
                : ui(15, "MAX LEVEL")}
            </span>
          </div>
        </div>
      </div>

      {/* Tier Roadmap */}
      <div style={styles.roadmapTitle} data-translatable>🗺️ {ui(3, "Rank Roadmap")}</div>
      <div style={styles.tierTrack}>
        <div style={styles.tierLine} />
        {RANK_TIERS.map((t) => {
          const isActive = currentLevel >= t.minLevel;
          const isCurrent = tier.tier === t.tier;
          const tierPerks = coursePerks.filter((p) => {
            const pTier = Math.ceil(p.unlockLevel / 5);
            return pTier === t.tier && p.enabled !== false;
          });

          return (
            <div key={t.tier} style={styles.tierNode(isActive, t.color)}>
              <div style={styles.tierDot(isActive, t.color)}>
                {isActive ? "✓" : ""}
              </div>
              <div style={styles.tierNodeName(isActive, t.color)}>
                {t.icon} {t.name}
                {isCurrent && (
                  <span
                    style={{
                      marginLeft: 8, fontSize: 10,
                      background: `${t.color}33`, color: t.color,
                      padding: "2px 8px", borderRadius: 10,
                    }}
                    data-translatable
                  >
                    {ui(4, "CURRENT")}
                  </span>
                )}
              </div>
              <div style={styles.tierNodeRange}>
                {ui(5, "Levels")} {t.minLevel}–{t.maxLevel} •{" "}
                {LEVELS[t.minLevel - 1]?.xpRequired?.toLocaleString()} XP
              </div>
              {tierPerks.length > 0 && (
                <div style={styles.perksList}>
                  {tierPerks.map((p) => (
                    <span
                      key={p.id}
                      style={styles.perkChip(
                        currentLevel >= p.unlockLevel,
                        t.color
                      )}
                    >
                      {p.icon} {p.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Unlocked Perks */}
      {unlockedPerks.length > 0 && (
        <div style={styles.unlockedSection}>
          <div style={styles.unlockedTitle} data-translatable>
            🎁 {ui(6, "Your Unlocked Perks")} ({unlockedPerks.length})
          </div>
          {unlockedPerks.map((perk) => {
            const perkTier = getRankTier(perk.unlockLevel);
            const used = courseUsage[perk.id] || 0;
            const canUse =
              perk.type === "consumable" &&
              used < (perk.usesPerSemester || 0);
            const allUsed =
              perk.type === "consumable" &&
              used >= (perk.usesPerSemester || 0);

            return (
              <div key={perk.id} style={styles.perkCard(perkTier.color)}>
                <div style={styles.perkCardIcon}>{perk.icon}</div>
                <div style={styles.perkCardInfo}>
                  <div style={styles.perkCardName}>{perk.name}</div>
                  <div style={styles.perkCardDesc}>
                    {perk.description}
                    {perk.type === "consumable" && (
                      <span>
                        {" "}
                        • {used}/{perk.usesPerSemester} {ui(7, "used this semester")}
                      </span>
                    )}
                  </div>
                </div>
                {perk.type === "passive" && (
                  <span
                    style={{
                      fontSize: 11, color: "#2ecc71", fontWeight: 600,
                    }}
                    data-translatable
                  >
                    ✓ {ui(8, "Active")}
                  </span>
                )}
                {canUse && uid && courseId && (
                  <button
                    style={styles.useBtn(perkTier.color)}
                    onClick={() => handleRequestPerk(perk.id)}
                    disabled={requesting === perk.id}
                    data-translatable
                  >
                    {requesting === perk.id ? ui(9, "Requesting...") : ui(10, "Use")}
                  </button>
                )}
                {allUsed && (
                  <span style={styles.usedBadge} data-translatable>{ui(11, "All used this semester")}</span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Next Perk Teaser */}
      {nextPerk && (
        <div style={styles.nextPerkTeaser}>
          <div style={styles.nextPerkIcon}>{nextPerk.icon}</div>
          <div style={styles.nextPerkInfo}>
            <div style={styles.nextPerkName} data-translatable>
              🔒 {ui(12, "Next Perk:")} {nextPerk.name}
            </div>
            <div style={styles.nextPerkLevel} data-translatable>
              {ui(13, "Unlocks at Level")} {nextPerk.unlockLevel} •{" "}
              {(
                LEVELS[nextPerk.unlockLevel - 1]?.xpRequired - totalXP
              ).toLocaleString()}{" "}
              {ui(14, "XP to go")}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
