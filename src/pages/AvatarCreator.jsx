// src/pages/AvatarCreator.jsx
// Full avatar customization page with live preview, XP-gated unlocks, and save

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  CLASSES, SKIN_TONES, HAIR_COLORS, EYE_COLORS, PETS, ACCESSORIES,
  DEFAULT_AVATAR, VISUAL_TIERS,
  getAvatar, saveAvatar, getUnlockedItems,
} from "../lib/avatar";
import { getStudentGamification, getLevelInfo } from "../lib/gamification";
import { getStudentEnrolledCourseIds } from "../lib/enrollment";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";
import PixelAvatar, { PixelPet, AvatarWithPet } from "../components/PixelAvatar";
import { useTranslatedTexts } from "../hooks/useTranslatedText.jsx";

export default function AvatarCreator() {
  const { user } = useAuth();
  const [avatar, setAvatar] = useState({ ...DEFAULT_AVATAR });
  const [totalXP, setTotalXP] = useState(0);
  const [unlocked, setUnlocked] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [hoverPreview, setHoverPreview] = useState(null);

  // ─── UI chrome strings ───
  const uiStrings = useTranslatedTexts([
    "Character Creator",                     // 0
    "Level",                                 // 1
    "PREVIEW — Unlocks at higher level",     // 2
    "Tier:",                                 // 3
    "Class Abilities",                       // 4
    "PREVIEWING",                            // 5
    "Passive",                               // 6
    "Active",                                // 7
    "Saving...",                             // 8
    "Saved!",                                // 9
    "Save Character",                        // 10
    "Class",                                 // 11
    "Skin Tone",                             // 12
    "Hair Color",                            // 13
    "Eye Color",                             // 14
    "Companion Pet",                         // 15
    "Accessory",                             // 16
    "Special Power",                         // 17
    "Level Progression",                     // 18
    "Loading avatar...",                     // 19
  ]);
  const ui = (i, fallback) => uiStrings?.[i] ?? fallback;

  // ─── Collect all data-driven translatable strings ───
  const allClasses = useMemo(() => Object.values(CLASSES).sort((a, b) => a.unlockLevel - b.unlockLevel), []);
  const sortedPets = useMemo(() => [...PETS].sort((a, b) => a.unlockLevel - b.unlockLevel), []);
  const sortedAccSlot = useMemo(() => ACCESSORIES.filter((a) => a.slot === "accessory").sort((a, b) => a.unlockLevel - b.unlockLevel), []);
  const sortedPowerSlot = useMemo(() => ACCESSORIES.filter((a) => a.slot === "power").sort((a, b) => a.unlockLevel - b.unlockLevel), []);

  const dataStrings = useMemo(() => {
    const strings = [];
    // Class names + ability texts (3 per class)
    allClasses.forEach((c) => {
      strings.push(c.name);
      strings.push(c.abilities.passive);
      strings.push(c.abilities.active);
    });
    // Pet names
    sortedPets.forEach((p) => strings.push(p.name));
    // Accessory names
    sortedAccSlot.forEach((a) => strings.push(a.name));
    // Power names
    sortedPowerSlot.forEach((a) => strings.push(a.name));
    // Tier names
    VISUAL_TIERS.forEach((t) => strings.push(t.name));
    return strings;
  }, [allClasses, sortedPets, sortedAccSlot, sortedPowerSlot]);

  const translatedData = useTranslatedTexts(dataStrings);

  // Build lookup maps from the flat translated array
  const tData = useMemo(() => {
    if (!translatedData) return null;
    let idx = 0;

    const classMap = {};
    allClasses.forEach((c) => {
      classMap[c.id] = {
        name: translatedData[idx++] || c.name,
        passive: translatedData[idx++] || c.abilities.passive,
        active: translatedData[idx++] || c.abilities.active,
      };
    });

    const petMap = {};
    sortedPets.forEach((p) => { petMap[p.id] = translatedData[idx++] || p.name; });

    const accMap = {};
    sortedAccSlot.forEach((a) => { accMap[a.id] = translatedData[idx++] || a.name; });

    const powerMap = {};
    sortedPowerSlot.forEach((a) => { powerMap[a.id] = translatedData[idx++] || a.name; });

    const tierMap = {};
    VISUAL_TIERS.forEach((t) => { tierMap[t.name] = translatedData[idx++] || t.name; });

    return { classMap, petMap, accMap, powerMap, tierMap };
  }, [translatedData, allClasses, sortedPets, sortedAccSlot, sortedPowerSlot]);

  // Helpers
  const tClass = (id) => tData?.classMap[id]?.name || (CLASSES[id]?.name ?? id);
  const tClassPassive = (id) => tData?.classMap[id]?.passive || CLASSES[id]?.abilities?.passive || "";
  const tClassActive = (id) => tData?.classMap[id]?.active || CLASSES[id]?.abilities?.active || "";
  const tPet = (id) => tData?.petMap[id] || PETS.find((p) => p.id === id)?.name || id;
  const tAcc = (id) => tData?.accMap[id] || tData?.powerMap[id] || ACCESSORIES.find((a) => a.id === id)?.name || id;
  const tTier = (name) => tData?.tierMap[name] || name;

  useEffect(() => {
    if (!user) return;
    (async () => {
      // Load avatar
      const existing = await getAvatar(user.uid);
      if (existing) setAvatar(existing);

      // Fetch enrolled courses, then get course-specific gamification XP
      let xp = 0;
      try {
        const enrolledIds = await getStudentEnrolledCourseIds(user.uid);
        if (enrolledIds.length > 0) {
          // Use the primary (first) enrolled course, same as StudentDashboard
          const gam = await getStudentGamification(user.uid, enrolledIds[0]);
          xp = gam.totalXP || 0;
        }
      } catch (e) {
        // Fallback to global gamification doc
        const gam = await getStudentGamification(user.uid);
        xp = gam.totalXP || 0;
      }

      setTotalXP(xp);
      setUnlocked(getUnlockedItems(xp));
      setLoaded(true);
    })();
  }, [user]);

  const levelInfo = getLevelInfo(totalXP);
  const level = levelInfo.current.level;

  const update = (key, value) => {
    setAvatar((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const previewAvatar = hoverPreview
    ? { ...avatar, [hoverPreview.key]: hoverPreview.value }
    : avatar;

  const hover = (key, value) => setHoverPreview({ key, value });
  const unhover = () => setHoverPreview(null);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    await saveAvatar(user.uid, avatar);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!loaded) {
    return (
      <div style={styles.page}>
        <div style={styles.loading} data-translatable>{ui(19, "Loading avatar...")}</div>
      </div>
    );
  }

  const cls = CLASSES[avatar.classId] || CLASSES.mage;
  const previewCls = CLASSES[previewAvatar.classId] || cls;
  const isPreviewingClass = hoverPreview?.key === "classId" && previewCls.id !== cls.id;
  const currentTierName = VISUAL_TIERS.filter((t) => level >= t.minLevel).pop()?.name;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* ─── Header ─── */}
        <div style={styles.header}>
          <h1 style={styles.title} data-translatable>⚔️ {ui(0, "Character Creator")}</h1>
          <p style={styles.subtitle} data-translatable>
            {levelInfo.current.tierIcon} {ui(1, "Level")} {level} — {levelInfo.current.name} • {totalXP} XP
          </p>
          {/* XP Progress Bar */}
          <div style={styles.xpBarWrap}>
            <div style={styles.xpBarLabels}>
              <span data-translatable>Lv {level}</span>
              <span data-translatable>{levelInfo.xpIntoLevel} / {levelInfo.xpForNext} XP</span>
              <span data-translatable>{levelInfo.next ? `Lv ${level + 1}` : "MAX"}</span>
            </div>
            <div style={styles.xpBarTrack}>
              <div style={{
                ...styles.xpBarFill,
                width: `${Math.min(levelInfo.progress * 100, 100)}%`,
              }} />
            </div>
          </div>
        </div>

        <div style={styles.grid}>
          {/* ─── Live Preview ─── */}
          <div style={styles.preview}>
            <div style={{ ...styles.previewStage, position: "relative" }}>
              <AvatarWithPet
                avatar={previewAvatar}
                level={level}
                charSize={240}
                petSize={156}
                animate
                gap={16}
              />
              {hoverPreview && (
                <div style={styles.previewBadge} data-translatable>
                  👁 {ui(2, "PREVIEW — Unlocks at higher level")}
                </div>
              )}
            </div>
            <div style={styles.previewInfo}>
              <span style={{ color: previewCls.color.accent, fontWeight: 800 }} data-translatable>
                {previewCls.icon} {tClass(previewCls.id)}
              </span>
              <span style={{ color: "#9896a8" }} data-translatable>
                {" "}— {ui(3, "Tier:")} {tTier(currentTierName)}
              </span>
            </div>

            {/* Class abilities */}
            <div style={{
              ...styles.abilityBox,
              border: isPreviewingClass ? "1px solid rgba(243,156,18,0.3)" : "1px solid #2a2e42",
            }}>
              <div style={styles.abilityLabel} data-translatable>
                {ui(4, "Class Abilities")}
                {isPreviewingClass && (
                  <span style={{ color: "#f39c12", marginLeft: 8, fontSize: 9 }} data-translatable>
                    👁 {ui(5, "PREVIEWING")} {tClass(previewCls.id).toUpperCase()}
                  </span>
                )}
              </div>
              <div style={styles.abilityRow}>
                <span style={styles.abilityTag} data-translatable>{ui(6, "Passive")}</span>
                <span style={styles.abilityText} data-translatable>{tClassPassive(previewCls.id)}</span>
              </div>
              <div style={styles.abilityRow}>
                <span style={{ ...styles.abilityTag, background: "rgba(139,92,246,0.15)", color: "#8b5cf6" }} data-translatable>
                  {ui(7, "Active")}
                </span>
                <span style={styles.abilityText} data-translatable>{tClassActive(previewCls.id)}</span>
              </div>
            </div>

            {/* Save button */}
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                ...styles.saveBtn,
                opacity: saving ? 0.6 : 1,
                background: saved ? "#2ecc71" : "#8b5cf6",
              }}
              data-translatable
            >
              {saving ? ui(8, "Saving...") : saved ? `✓ ${ui(9, "Saved!")}` : `💾 ${ui(10, "Save Character")}`}
            </button>
          </div>

          {/* ─── Options Panel ─── */}
          <div style={styles.options}>
            {/* Class */}
            <Section title={ui(11, "Class")}>
              <div style={styles.optGrid}>
                {allClasses.map((c) => {
                  const locked = level < c.unlockLevel;
                  return (
                    <OptionCard
                      key={c.id}
                      selected={avatar.classId === c.id}
                      locked={locked}
                      lockLevel={c.unlockLevel}
                      onClick={() => !locked && update("classId", c.id)}
                      accent={c.color.accent}
                      onHover={() => hover("classId", c.id)}
                      onUnhover={unhover}
                    >
                      <div style={styles.optIcon}>{c.icon}</div>
                      <div style={styles.optName} data-translatable>{tClass(c.id)}</div>
                      {locked && <div style={styles.lockBadge}>Lv {c.unlockLevel}</div>}
                    </OptionCard>
                  );
                })}
              </div>
            </Section>

            {/* Skin Tone */}
            <Section title={ui(12, "Skin Tone")}>
              <div style={styles.colorRow}>
                {SKIN_TONES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => update("skinTone", s.id)}
                    style={{
                      ...styles.colorSwatch,
                      background: s.base,
                      border: avatar.skinTone === s.id ? "3px solid #8b5cf6" : "3px solid transparent",
                      boxShadow: avatar.skinTone === s.id ? "0 0 8px #8b5cf644" : "none",
                    }}
                  />
                ))}
              </div>
            </Section>

            {/* Hair Color */}
            <Section title={ui(13, "Hair Color")}>
              <div style={styles.colorRow}>
                {[...HAIR_COLORS].sort((a,b) => (a.unlockLevel||1) - (b.unlockLevel||1)).map((h) => {
                  const locked = level < (h.unlockLevel || 1);
                  return (
                    <button
                      key={h.id}
                      onClick={() => !locked && update("hairColor", h.id)}
                      onMouseEnter={() => locked ? hover("hairColor", h.id) : undefined}
                      onMouseLeave={unhover}
                      style={{
                        ...styles.colorSwatch,
                        background: h.base,
                        border: avatar.hairColor === h.id ? "3px solid #8b5cf6" : "3px solid transparent",
                        opacity: locked ? 0.3 : 1,
                        cursor: locked ? "not-allowed" : "pointer",
                        position: "relative",
                      }}
                      title={locked ? `Unlocks at Lv ${h.unlockLevel}` : h.label}
                    >
                      {locked && <span style={styles.swatchLock}>🔒</span>}
                    </button>
                  );
                })}
              </div>
            </Section>

            {/* Eye Color */}
            <Section title={ui(14, "Eye Color")}>
              <div style={styles.colorRow}>
                {[...EYE_COLORS].sort((a,b) => (a.unlockLevel||1) - (b.unlockLevel||1)).map((e) => {
                  const locked = level < (e.unlockLevel || 1);
                  return (
                    <button
                      key={e.id}
                      onClick={() => !locked && update("eyeColor", e.id)}
                      onMouseEnter={() => locked ? hover("eyeColor", e.id) : undefined}
                      onMouseLeave={unhover}
                      style={{
                        ...styles.colorSwatch,
                        background: e.iris,
                        border: avatar.eyeColor === e.id ? "3px solid #8b5cf6" : "3px solid transparent",
                        opacity: locked ? 0.3 : 1,
                        cursor: locked ? "not-allowed" : "pointer",
                      }}
                      title={locked ? `Unlocks at Lv ${e.unlockLevel}` : e.label}
                    >
                      {locked && <span style={styles.swatchLock}>🔒</span>}
                    </button>
                  );
                })}
              </div>
            </Section>

            {/* Pet */}
            <Section title={ui(15, "Companion Pet")}>
              <div style={styles.optGrid}>
                {sortedPets.map((p) => {
                  const locked = level < p.unlockLevel;
                  return (
                    <OptionCard
                      key={p.id}
                      selected={avatar.petId === p.id}
                      locked={locked}
                      lockLevel={p.unlockLevel}
                      onClick={() => !locked && update("petId", p.id)}
                      onHover={() => hover("petId", p.id)}
                      onUnhover={unhover}
                    >
                      <div style={styles.optIcon}>{p.icon}</div>
                      <div style={styles.optName} data-translatable>{tPet(p.id)}</div>
                      {locked && <div style={styles.lockBadge}>Lv {p.unlockLevel}</div>}
                    </OptionCard>
                  );
                })}
              </div>
            </Section>

            {/* Back Accessory */}
            <Section title={ui(16, "Accessory")}>
              <div style={styles.optGrid}>
                {sortedAccSlot.map((a) => {
                  const locked = level < a.unlockLevel;
                  return (
                    <OptionCard
                      key={a.id}
                      selected={avatar.accessory === a.id}
                      locked={locked}
                      lockLevel={a.unlockLevel}
                      onClick={() => !locked && update("accessory", a.id)}
                      onHover={() => hover("accessory", a.id)}
                      onUnhover={unhover}
                    >
                      <div style={styles.optIcon}>{a.icon}</div>
                      <div style={styles.optName} data-translatable>{tAcc(a.id)}</div>
                      {locked && <div style={styles.lockBadge}>Lv {a.unlockLevel}</div>}
                    </OptionCard>
                  );
                })}
              </div>
            </Section>

            {/* Special Power */}
            <Section title={ui(17, "Special Power")}>
              <div style={styles.optGrid}>
                {sortedPowerSlot.map((a) => {
                  const locked = level < a.unlockLevel;
                  return (
                    <OptionCard
                      key={a.id}
                      selected={avatar.specialPower === a.id}
                      locked={locked}
                      lockLevel={a.unlockLevel}
                      onClick={() => !locked && update("specialPower", a.id)}
                      onHover={() => hover("specialPower", a.id)}
                      onUnhover={unhover}
                    >
                      <div style={styles.optIcon}>{a.icon}</div>
                      <div style={styles.optName} data-translatable>{tAcc(a.id)}</div>
                      {locked && <div style={styles.lockBadge}>Lv {a.unlockLevel}</div>}
                    </OptionCard>
                  );
                })}
              </div>
            </Section>

            {/* Level Progression Preview */}
            <Section title={ui(18, "Level Progression")}>
              <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8 }}>
                {[1, 6, 11, 16, 21, 26, 31, 35].map((lv) => {
                  const tierName = VISUAL_TIERS.filter((t) => lv >= t.minLevel).pop()?.name;
                  return (
                    <div key={lv} style={styles.progCard}>
                      <div
                        style={{
                          fontSize: 9,
                          fontWeight: 800,
                          color: level >= lv ? "#f39c12" : "#5c5a6e",
                          marginBottom: 6,
                        }}
                      >
                        LV {lv}
                      </div>
                      <PixelAvatar
                        avatar={avatar}
                        level={lv}
                        size={96}
                        animate={false}
                        style={{ opacity: level >= lv ? 1 : 0.35 }}
                      />
                      <div style={{ fontSize: 9, color: "#5c5a6e", marginTop: 4 }} data-translatable>
                        {tTier(tierName)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Subcomponents ───
function Section({ title, children }) {
  return (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle} data-translatable>{title}</h3>
      {children}
    </div>
  );
}

function OptionCard({ children, selected, locked, lockLevel, onClick, accent, onHover, onUnhover }) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={locked && onHover ? onHover : undefined}
      onMouseLeave={onUnhover || undefined}
      style={{
        ...styles.optCard,
        border: selected ? "2px solid #8b5cf6" : "2px solid #2a2e42",
        background: selected ? "rgba(139,92,246,0.1)" : "#1e2235",
        opacity: locked ? 0.5 : 1,
        cursor: locked ? "default" : "pointer",
        boxShadow: selected ? "0 0 12px #8b5cf633" : "none",
        transition: "all 0.15s, opacity 0.15s",
      }}
    >
      {children}
    </button>
  );
}

// ─── Styles ───
const styles = {
  page: {
    minHeight: "100vh",
    background: "transparent",
    color: "#e8e6f0",
    fontFamily: "'Nunito', sans-serif",
    padding: "20px",
  },
  container: { maxWidth: 1100, margin: "0 auto" },
  loading: { textAlign: "center", padding: 60, color: "#5c5a6e" },
  previewBadge: {
    position: "absolute",
    top: -15,
    left: "50%",
    transform: "translateX(-50%)",
    padding: "4px 14px",
    borderRadius: 6,
    background: "rgba(243,156,18,0.2)",
    border: "1px solid rgba(243,156,18,0.4)",
    color: "#f39c12",
    fontSize: 11,
    fontWeight: 800,
    whiteSpace: "nowrap",
    pointerEvents: "none",
  },
  header: { textAlign: "center", marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 900, color: "#8b5cf6", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "#9896a8", marginBottom: 10 },
  xpBarWrap: { maxWidth: 380, margin: "0 auto" },
  xpBarLabels: {
    display: "flex", justifyContent: "space-between", fontSize: 11,
    color: "#9896a8", marginBottom: 4, fontWeight: 700,
  },
  xpBarTrack: {
    height: 10, background: "#1e2235", borderRadius: 5,
    border: "1px solid #2a2e42", overflow: "hidden",
  },
  xpBarFill: {
    height: "100%", borderRadius: 5,
    background: "linear-gradient(90deg, #8b5cf6, #a78bfa)",
    transition: "width 0.4s ease",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "440px 1fr",
    gap: 20,
    alignItems: "start",
    maxWidth: 1200,
    margin: "0 auto",
  },
  preview: {
    background: "rgba(22,25,38,0.85)",
    border: "1px solid #2a2e42",
    borderRadius: 14,
    padding: 20,
    position: "sticky",
    top: 80,
    maxHeight: "calc(100vh - 100px)",
    overflowY: "auto",
    overflowX: "hidden",
  },
  previewStage: {
    display: "flex",
    justifyContent: "center",
    padding: "31px 0 16px 0",
    background: "radial-gradient(ellipse at 50% 80%, #1a153080, transparent)",
    borderRadius: 10,
    marginBottom: 12,
    overflow: "visible",
  },
  previewInfo: { textAlign: "center", fontSize: 14, marginBottom: 12 },
  abilityBox: {
    background: "#1e2235",
    border: "1px solid #2a2e42",
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  abilityLabel: { fontSize: 11, fontWeight: 800, color: "#5c5a6e", marginBottom: 8, textTransform: "uppercase" },
  abilityRow: { display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 },
  abilityTag: {
    padding: "2px 8px",
    borderRadius: 4,
    fontSize: 10,
    fontWeight: 800,
    background: "rgba(46,204,113,0.15)",
    color: "#2ecc71",
    whiteSpace: "nowrap",
    flexShrink: 0,
  },
  abilityText: { fontSize: 12, color: "#9896a8", lineHeight: 1.4 },
  saveBtn: {
    width: "100%",
    padding: 14,
    border: "none",
    borderRadius: 10,
    fontSize: 16,
    fontWeight: 800,
    color: "#fff",
    cursor: "pointer",
    transition: "all 0.2s",
    fontFamily: "'Nunito', sans-serif",
  },
  options: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    minWidth: 0,
  },
  section: {
    background: "rgba(22,25,38,0.85)",
    border: "1px solid #2a2e42",
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 800,
    color: "#8b5cf6",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  optGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
    gap: 6,
  },
  optCard: {
    padding: 10,
    borderRadius: 8,
    textAlign: "center",
    position: "relative",
    fontFamily: "'Nunito', sans-serif",
    transition: "all 0.15s",
  },
  optIcon: { fontSize: 24, marginBottom: 2 },
  optName: { fontSize: 11, fontWeight: 700, color: "#e8e6f0" },
  lockBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    fontSize: 8,
    fontWeight: 800,
    padding: "1px 5px",
    borderRadius: 4,
    background: "rgba(243,156,18,0.2)",
    color: "#f39c12",
  },
  colorRow: { display: "flex", gap: 8, flexWrap: "wrap" },
  colorSwatch: {
    width: 36,
    height: 36,
    borderRadius: 8,
    cursor: "pointer",
    transition: "all 0.15s",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  swatchLock: { fontSize: 10 },
  progCard: {
    textAlign: "center",
    background: "#1e2235",
    border: "1px solid #2a2e42",
    borderRadius: 8,
    padding: 8,
    minWidth: 100,
    flexShrink: 0,
  },
};
