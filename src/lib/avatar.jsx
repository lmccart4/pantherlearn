// src/lib/avatar.jsx
// Avatar system — character classes, pets, accessories, XP unlocks
// Data lives at: gamification/{uid}/avatar (subcollection or field)
// Actually stored as a field on the gamification/{uid} doc for simplicity

import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { getLevelInfo } from "./gamification";

// Import hero pack — this registers draw functions and exports class defs
import { HERO_CLASSES } from "./heroPack";
import "./heroPackDraw2"; // registers remaining draw functions on import

// Import villain pack
import { VILLAIN_CLASSES } from "./villainPack";
import "./villainPackDraw2";

// Import pet pack
import { PACK_PETS } from "./petPack";
import "./petPackDraw2";

// ═══════════════════════════════════════════
// CHARACTER CLASSES
// ═══════════════════════════════════════════
export const CLASSES = {
  mage: {
    id: "mage", name: "Mage", icon: "🧙", description: "Masters of arcane knowledge",
    unlockLevel: 1,
    color: { robe: "#5828a8", robeMid: "#6838c0", robeDark: "#3a1878", robeLight: "#7848d8", accent: "#f0c848" },
    abilities: {
      passive: "Arcane Mind — +10% XP from quiz questions",
      active: "Mana Burst — Double damage on next boss battle answer (3 question cooldown)",
    },
  },
  warrior: {
    id: "warrior", name: "Warrior", icon: "⚔️", description: "Stalwart defenders of the class",
    unlockLevel: 1,
    color: { robe: "#808898", robeMid: "#909aa8", robeDark: "#505868", robeLight: "#a0a8b8", accent: "#d4a040" },
    abilities: {
      passive: "Iron Will — Shield blocks +1 extra class HP damage",
      active: "Rally Cry — Give all teammates +1 damage on their next answer (5 question cooldown)",
    },
  },
  ranger: {
    id: "ranger", name: "Ranger", icon: "🏹", description: "Swift scouts and sharpshooters",
    unlockLevel: 1,
    color: { robe: "#2a6838", robeMid: "#308848", robeDark: "#1a4828", robeLight: "#40a058", accent: "#d4a040" },
    abilities: {
      passive: "Keen Eye — Hint ability eliminates 2 wrong answers instead of 1",
      active: "Precision Shot — Guaranteed correct answer counts as crit (4 question cooldown)",
    },
  },
  healer: {
    id: "healer", name: "Healer", icon: "💚", description: "Restorers of hope and health",
    unlockLevel: 1,
    color: { robe: "#d0c8b0", robeMid: "#e0d8c8", robeDark: "#a8a090", robeLight: "#f0ece0", accent: "#40c880" },
    abilities: {
      passive: "Healing Aura — Wrong answers deal 1 less class HP damage (min 0)",
      active: "Restoration — Heal 2 class HP (5 question cooldown)",
    },
  },
  rogue: {
    id: "rogue", name: "Rogue", icon: "🗡️", description: "Masters of stealth and cunning",
    unlockLevel: 1,
    color: { robe: "#303040", robeMid: "#404050", robeDark: "#1a1a28", robeLight: "#484858", accent: "#e04040" },
    abilities: {
      passive: "Evasion — 20% chance to dodge counterattack damage on wrong answer",
      active: "Backstab — Triple damage on next correct answer (5 question cooldown)",
    },
  },
  // ─── Future classes (locked by level) ───
  paladin: {
    id: "paladin", name: "Paladin", icon: "🛡️", description: "Holy knights who protect and inspire",
    unlockLevel: 20,
    color: { robe: "#c0a030", robeMid: "#d4b440", robeDark: "#907020", robeLight: "#e0c850", accent: "#f0e880" },
    abilities: {
      passive: "Divine Shield — Shield ability has 1 less cooldown",
      active: "Consecrate — Heal 1 class HP and deal 1 boss damage (4 question cooldown)",
    },
  },
  necromancer: {
    id: "necromancer", name: "Necromancer", icon: "💀", description: "Dark scholars who harness forbidden power",
    unlockLevel: 28,
    color: { robe: "#2a1a2a", robeMid: "#3a2840", robeDark: "#140e18", robeLight: "#4a3850", accent: "#80ff80" },
    abilities: {
      passive: "Life Drain — Correct answers heal 1 class HP",
      active: "Soul Harvest — Convert team's wrong answers into boss damage (1 per 2 wrong, 6 question cooldown)",
    },
  },
  bard: {
    id: "bard", name: "Bard", icon: "🎵", description: "Charismatic performers who buff allies",
    unlockLevel: 10,
    color: { robe: "#a03050", robeMid: "#c04068", robeDark: "#702038", robeLight: "#e05880", accent: "#f0c848" },
    abilities: {
      passive: "Inspiration — Teammates get +5% XP when you answer correctly",
      active: "Battle Song — All teams get +1 damage for 2 questions (5 question cooldown)",
    },
  },
  // ─── Hero Pack (auto-imported) ───
  ...HERO_CLASSES,
  // ─── Villain Pack (auto-imported) ───
  ...VILLAIN_CLASSES,
};

// ═══════════════════════════════════════════
// SKIN TONES
// ═══════════════════════════════════════════
export const SKIN_TONES = [
  { id: "medium", label: "🏽", base: "#d4a878", hi: "#e8c4a0", mid: "#c49468", sh: "#a07850", dk: "#805830" },
  { id: "light", label: "🏻", base: "#f5d0a9", hi: "#fff0e0", mid: "#e8c098", sh: "#d0a878", dk: "#b89068" },
  { id: "medium-light", label: "🏼", base: "#c8a07a", hi: "#d8b898", mid: "#b89068", sh: "#987450", dk: "#785838" },
  { id: "medium-dark", label: "🏾", base: "#8d5524", hi: "#a06830", mid: "#7a4820", sh: "#603818", dk: "#482810" },
  { id: "dark", label: "🏿", base: "#4a2c11", hi: "#5a3818", mid: "#3e240e", sh: "#301a08", dk: "#221005" },
];

// ═══════════════════════════════════════════
// HAIR COLORS
// ═══════════════════════════════════════════
export const HAIR_COLORS = [
  { id: "purple", label: "Purple", base: "#2a1848", hi: "#5a3890", mid: "#3a2060", sh: "#1a0e30", br: "#8060b0" },
  { id: "black", label: "Black", base: "#1a1a28", hi: "#3a3a50", mid: "#282838", sh: "#0e0e18", br: "#505068" },
  { id: "blonde", label: "Blonde", base: "#d4a040", hi: "#f0c860", mid: "#c09030", sh: "#a07820", br: "#ffe088" },
  { id: "red", label: "Red", base: "#c03020", hi: "#e04838", mid: "#a02818", sh: "#801810", br: "#ff6858" },
  { id: "white", label: "White", base: "#d0d0e0", hi: "#e8e8f0", mid: "#b8b8c8", sh: "#9898a8", br: "#ffffff" },
  { id: "blue", label: "Blue", base: "#2040a0", hi: "#3868d0", mid: "#2850b8", sh: "#182878", br: "#5888f0" },
  { id: "green", label: "Green", base: "#1a6040", hi: "#30a068", mid: "#208050", sh: "#0e4028", br: "#48c080" },
  { id: "pink", label: "Pink", base: "#c04888", hi: "#e068a8", mid: "#a83870", sh: "#802858", br: "#f088c0" },
  { id: "silver", label: "Silver", base: "#a0a8b8", hi: "#c8d0e0", mid: "#8890a0", sh: "#687080", br: "#e0e8f0" },
];

// ═══════════════════════════════════════════
// EYE COLORS
// ═══════════════════════════════════════════
export const EYE_COLORS = [
  { id: "purple", label: "Purple", iris: "#5030a0", irisLight: "#6040b8", pupil: "#100818" },
  { id: "brown", label: "Brown", iris: "#6a4020", irisLight: "#8a5830", pupil: "#2a1808" },
  { id: "blue", label: "Blue", iris: "#2050a0", irisLight: "#3868c0", pupil: "#081028" },
  { id: "green", label: "Green", iris: "#207040", irisLight: "#309858", pupil: "#082010" },
  { id: "amber", label: "Amber", iris: "#a07020", irisLight: "#c09030", pupil: "#281808" },
  { id: "red", label: "Red", iris: "#a02030", irisLight: "#c03848", pupil: "#280810" },
  { id: "gold", label: "Gold", iris: "#b09020", irisLight: "#d4b030", pupil: "#282008" },
];

// ═══════════════════════════════════════════
// PETS
// ═══════════════════════════════════════════
export const PETS = [
  { id: "fire_spirit", name: "Fire Spirit", icon: "🔥", unlockLevel: 1 },
  { id: "wolf", name: "Wolf", icon: "🐺", unlockLevel: 1 },
  { id: "owl", name: "Owl", icon: "🦉", unlockLevel: 1 },
  { id: "drake", name: "Drake", icon: "🐉", unlockLevel: 1 },
  { id: "cat", name: "Shadow Cat", icon: "🐈‍⬛", unlockLevel: 7 },
  { id: "phoenix", name: "Phoenix", icon: "🦅", unlockLevel: 18 },
  { id: "slime", name: "Slime", icon: "🫠", unlockLevel: 9 },
  { id: "fairy", name: "Fairy", icon: "🧚", unlockLevel: 24 },
  { id: "dragon", name: "Elder Dragon", icon: "🐲", unlockLevel: 35 },
  // ─── Pet Pack (auto-imported) ───
  ...PACK_PETS,
];

// ═══════════════════════════════════════════
// ACCESSORIES (cosmetic unlocks by level)
// ═══════════════════════════════════════════
export const ACCESSORIES = [
  // Back slot
  // Accessory slot
  { id: "none", name: "None", icon: "❌", slot: "accessory", unlockLevel: 1 },
  { id: "scarf_red", name: "Red Scarf", icon: "🧣", slot: "accessory", unlockLevel: 1 },
  { id: "shield_wood", name: "Wooden Shield", icon: "🛡️", slot: "accessory", unlockLevel: 1 },
  { id: "halo_basic", name: "Halo", icon: "😇", slot: "accessory", unlockLevel: 5 },
  { id: "shoulder_pads", name: "Shoulder Pads", icon: "🦾", slot: "accessory", unlockLevel: 7 },
  { id: "floating_book", name: "Arcane Tome", icon: "📖", slot: "accessory", unlockLevel: 9 },
  { id: "cape_basic", name: "Basic Cape", icon: "🧥", slot: "accessory", unlockLevel: 11 },
  { id: "wings_small", name: "Fairy Wings", icon: "🧚", slot: "accessory", unlockLevel: 13 },
  { id: "shield_iron", name: "Iron Shield", icon: "⚔️", slot: "accessory", unlockLevel: 15 },
  { id: "floating_orbs", name: "Orbit Orbs", icon: "🔮", slot: "accessory", unlockLevel: 17 },
  { id: "chain_wrap", name: "Ghost Chains", icon: "⛓️", slot: "accessory", unlockLevel: 19 },
  { id: "wings_bat", name: "Bat Wings", icon: "🦇", slot: "accessory", unlockLevel: 21 },
  { id: "cape_royal", name: "Royal Cape", icon: "👑", slot: "accessory", unlockLevel: 23 },
  { id: "floating_swords", name: "Phantom Blades", icon: "🗡️", slot: "accessory", unlockLevel: 25 },
  { id: "halo_fire", name: "Fire Halo", icon: "🔥", slot: "accessory", unlockLevel: 27 },
  { id: "tech_drones", name: "Nano Drones", icon: "🤖", slot: "accessory", unlockLevel: 29 },
  { id: "wings_angel", name: "Angel Wings", icon: "👼", slot: "accessory", unlockLevel: 31 },
  { id: "shield_energy", name: "Quantum Barrier", icon: "💠", slot: "accessory", unlockLevel: 32 },
  { id: "wings_dragon", name: "Dragon Wings", icon: "🐲", slot: "accessory", unlockLevel: 34 },
  { id: "crown_divine", name: "Crown of the Pantheon", icon: "✨", slot: "accessory", unlockLevel: 35 },
  // Special Power slot
  { id: "aura_none", name: "None", icon: "❌", slot: "power", unlockLevel: 1 },
  { id: "power_sparkle", name: "Sparkle Trail", icon: "💫", slot: "power", unlockLevel: 1 },
  { id: "power_leaves", name: "Leaf Storm", icon: "🍃", slot: "power", unlockLevel: 1 },
  { id: "power_bubbles", name: "Bubble Shield", icon: "🫧", slot: "power", unlockLevel: 5 },
  { id: "power_music", name: "Battle Anthem", icon: "🎵", slot: "power", unlockLevel: 7 },
  { id: "power_snowflake", name: "Frost Aura", icon: "❄️", slot: "power", unlockLevel: 9 },
  { id: "aura_basic", name: "Starfield", icon: "✨", slot: "power", unlockLevel: 11 },
  { id: "power_hearts", name: "Heart Pulse", icon: "💖", slot: "power", unlockLevel: 13 },
  { id: "power_matrix", name: "Data Stream", icon: "💻", slot: "power", unlockLevel: 15 },
  { id: "power_shadow", name: "Shadow Cloak", icon: "🌑", slot: "power", unlockLevel: 17 },
  { id: "power_vortex", name: "Arcane Vortex", icon: "🌀", slot: "power", unlockLevel: 21 },
  { id: "power_sakura", name: "Cherry Blossom", icon: "🌸", slot: "power", unlockLevel: 23 },
  { id: "aura_fire", name: "Inferno", icon: "🔥", slot: "power", unlockLevel: 25 },
  { id: "aura_lightning", name: "Lightning Storm", icon: "⚡", slot: "power", unlockLevel: 27 },
  { id: "power_galaxy", name: "Galaxy Swirl", icon: "🌌", slot: "power", unlockLevel: 29 },
  { id: "power_phoenix", name: "Phoenix Flame", icon: "🐦‍🔥", slot: "power", unlockLevel: 31 },
  { id: "power_glitch", name: "Glitch Field", icon: "📡", slot: "power", unlockLevel: 32 },
  { id: "aura_holy", name: "Divine Radiance", icon: "☀️", slot: "power", unlockLevel: 33 },
  { id: "power_void", name: "Void Rift", icon: "🕳️", slot: "power", unlockLevel: 34 },
  { id: "power_rainbow", name: "Prismatic", icon: "🌈", slot: "power", unlockLevel: 35 },
];

// ═══════════════════════════════════════════
// LEVEL → VISUAL TIER MAPPING
// ═══════════════════════════════════════════
export const VISUAL_TIERS = [
  { minLevel: 1,  name: "Novice",            features: ["Base outfit", "Basic weapon"] },
  { minLevel: 6,  name: "Apprentice",        features: ["Class headgear", "Gold trim", "Weapon upgrade"] },
  { minLevel: 11, name: "Adept",             features: ["Pauldrons/bracers", "Belt gems", "Weapon glow", "Class emblem"] },
  { minLevel: 16, name: "Veteran",           features: ["Cape", "Advanced headgear", "Rune patterns", "Special powers"] },
  { minLevel: 21, name: "Champion",          features: ["Enhanced armor", "Weapon effects", "Ambient particles"] },
  { minLevel: 26, name: "Legend",            features: ["Full aura", "Legendary weapon", "Elite cosmetics"] },
  { minLevel: 31, name: "Mythic",            features: ["Mythic glow", "Max effects", "Prestige cosmetics"] },
  { minLevel: 35, name: "Panther Ascendant", features: ["Divine crown", "Ascendant aura", "Ultimate form", "Legendary title"] },
];

export function getVisualTier(level) {
  let tier = VISUAL_TIERS[0];
  for (const t of VISUAL_TIERS) {
    if (level >= t.minLevel) tier = t;
  }
  return tier;
}

// ═══════════════════════════════════════════
// AVATAR STATE — what gets saved to Firestore
// ═══════════════════════════════════════════
export const DEFAULT_AVATAR = {
  classId: "mage",
  skinTone: "medium",
  hairColor: "black",
  eyeColor: "brown",
  petId: "fire_spirit",
  accessory: "none",
  specialPower: "none",
  createdAt: null,
  updatedAt: null,
};

// ═══════════════════════════════════════════
// FIRESTORE CRUD
// ═══════════════════════════════════════════

/** Pick a random element from an array */
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generate a random avatar from unlocked options for a given XP level.
 * Used to show a preview before the student customizes for the first time.
 */
export function generateRandomAvatar(totalXP = 0) {
  const unlocked = getUnlockedItems(totalXP);
  const cls = pickRandom(unlocked.classes) || Object.values(CLASSES)[0];
  const skin = pickRandom(SKIN_TONES);
  const hair = pickRandom(unlocked.hairColors.length ? unlocked.hairColors : HAIR_COLORS);
  const eye = pickRandom(unlocked.eyeColors.length ? unlocked.eyeColors : EYE_COLORS);
  const pet = pickRandom(unlocked.pets) || PETS[0];

  return {
    classId: cls.id,
    skinTone: skin.id,
    hairColor: hair.id,
    eyeColor: eye.id,
    petId: pet.id,
    accessory: "none",
    specialPower: "none",
    createdAt: null,
    updatedAt: null,
  };
}

export async function getAvatar(uid) {
  const ref = doc(db, "gamification", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data().avatar || null;
}

export async function saveAvatar(uid, avatarState) {
  const ref = doc(db, "gamification", uid);
  const data = {
    avatar: {
      ...avatarState,
      updatedAt: new Date().toISOString(),
      createdAt: avatarState.createdAt || new Date().toISOString(),
    },
  };
  await setDoc(ref, data, { merge: true });
  return data.avatar;
}

// ═══════════════════════════════════════════
// UNLOCK CHECKS
// ═══════════════════════════════════════════
export function getUnlockedItems(totalXP) {
  const { current } = getLevelInfo(totalXP);
  const level = current.level;

  return {
    classes: Object.values(CLASSES).filter((c) => level >= c.unlockLevel),
    lockedClasses: Object.values(CLASSES).filter((c) => level < c.unlockLevel),
    hairColors: HAIR_COLORS.filter((h) => level >= (h.unlockLevel || 1)),
    lockedHairColors: HAIR_COLORS.filter((h) => level < (h.unlockLevel || 1)),
    eyeColors: EYE_COLORS.filter((e) => level >= (e.unlockLevel || 1)),
    lockedEyeColors: EYE_COLORS.filter((e) => level < (e.unlockLevel || 1)),
    pets: PETS.filter((p) => level >= p.unlockLevel),
    lockedPets: PETS.filter((p) => level < p.unlockLevel),
    accessories: ACCESSORIES.filter((a) => level >= a.unlockLevel),
    lockedAccessories: ACCESSORIES.filter((a) => level < a.unlockLevel),
    level,
    visualTier: getVisualTier(level),
  };
}

// ═══════════════════════════════════════════
// AVATAR SUMMARY (for display in team panels, leaderboards, etc)
// ═══════════════════════════════════════════
export function getAvatarSummary(avatar, totalXP) {
  if (!avatar) return null;
  const cls = CLASSES[avatar.classId] || CLASSES.mage;
  const { current } = getLevelInfo(totalXP);
  const tier = getVisualTier(current.level);
  const pet = PETS.find((p) => p.id === avatar.petId) || PETS[0];

  return {
    className: cls.name,
    classIcon: cls.icon,
    level: current.level,
    tierName: tier.name,
    petName: pet.name,
    petIcon: pet.icon,
    color: cls.color,
  };
}
