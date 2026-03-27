// src/lib/classAbilities.js
// Class ability engine — translates avatar class descriptions into executable battle mechanics.
// Pure functions where possible. Used by bossBattle.jsx submitAnswer + useClassAbility.

// ═══════════════════════════════════════════════════════
// ABILITY DEFINITIONS
// ═══════════════════════════════════════════════════════

export const CLASS_ABILITIES = {
  mage: {
    passive: { id: "arcane_mind", name: "Arcane Mind", desc: "+10% XP from quiz questions", icon: "🧠", type: "xp_bonus", value: 0.10, trigger: "on_correct" },
    active: { id: "mana_burst", name: "Mana Burst", desc: "Double damage on next correct answer", icon: "💥", type: "damage_multiplier", value: 2, cooldown: 3, trigger: "on_next_correct" },
  },
  warrior: {
    passive: { id: "iron_will", name: "Iron Will", desc: "Shield blocks +1 extra class HP damage", icon: "🛡️", type: "shield_bonus", value: 1, trigger: "on_shield_block" },
    active: { id: "rally_cry", name: "Rally Cry", desc: "All teammates get +1 damage for 1 question", icon: "📯", type: "team_damage_buff", value: 1, duration: 1, cooldown: 5, trigger: "immediate", affectsBattleDoc: true },
  },
  ranger: {
    passive: { id: "keen_eye", name: "Keen Eye", desc: "Hint eliminates 2 wrong answers instead of 1", icon: "👁️", type: "hint_bonus", value: 1, trigger: "on_hint" },
    active: { id: "precision_shot", name: "Precision Shot", desc: "Guaranteed correct = critical hit", icon: "🎯", type: "auto_crit", cooldown: 4, trigger: "on_next_correct" },
  },
  healer: {
    passive: { id: "healing_aura", name: "Healing Aura", desc: "Wrong answers deal 1 less class HP damage", icon: "💚", type: "damage_reduction", value: 1, trigger: "on_wrong" },
    active: { id: "restoration", name: "Restoration", desc: "Heal 2 class HP", icon: "✨", type: "heal_class", value: 2, cooldown: 5, trigger: "immediate", affectsBattleDoc: true },
  },
  rogue: {
    passive: { id: "evasion", name: "Evasion", desc: "20% chance to dodge counterattack damage", icon: "💨", type: "dodge_chance", value: 0.20, trigger: "on_wrong" },
    active: { id: "backstab", name: "Backstab", desc: "Triple damage on next correct answer", icon: "🗡️", type: "damage_multiplier", value: 3, cooldown: 5, trigger: "on_next_correct" },
  },
  paladin: {
    passive: { id: "divine_shield", name: "Divine Shield", desc: "Shield ability has 1 less cooldown", icon: "✝️", type: "cooldown_reduction", target: "shield", value: 1, trigger: "passive" },
    active: { id: "consecrate", name: "Consecrate", desc: "Heal 1 class HP + deal 1 boss damage", icon: "☀️", type: "heal_and_damage", healValue: 1, damageValue: 1, cooldown: 4, trigger: "immediate", affectsBattleDoc: true },
  },
  necromancer: {
    passive: { id: "life_drain", name: "Life Drain", desc: "Correct answers heal 1 class HP", icon: "💀", type: "heal_on_correct", value: 1, trigger: "on_correct", affectsBattleDoc: true },
    active: { id: "soul_harvest", name: "Soul Harvest", desc: "Convert wrong answers into boss damage (1 per 2 wrong)", icon: "👻", type: "convert_wrong_to_damage", ratio: 2, cooldown: 6, trigger: "immediate", affectsBattleDoc: true },
  },
  bard: {
    passive: { id: "inspiration", name: "Inspiration", desc: "Teammates get +5% XP when you answer correctly", icon: "🎵", type: "team_xp_bonus", value: 0.05, trigger: "on_correct" },
    active: { id: "battle_song", name: "Battle Song", desc: "All teams get +1 damage for 2 questions", icon: "🎶", type: "global_damage_buff", value: 1, duration: 2, cooldown: 5, trigger: "immediate", affectsBattleDoc: true },
  },
};

// Fallback mapping: hero/villain pack classes → closest base class
const PACK_FALLBACK_MAP = {
  // Hero pack
  techforger: "mage",
  stormcaller: "mage",
  razorfang: "rogue",
  titan: "warrior",
  nightprowler: "rogue",
  paragon: "paladin",
  shadowknight: "warrior",
  tempest: "ranger",
  blinker: "rogue",
  webslinger: "ranger",
  shellstrike: "warrior",
  sparkpaw: "mage",
  blazewing: "mage",
  thornbeast: "healer",
  tidalshell: "paladin",
  // Villain pack
  dreadlord: "necromancer",
  jestermind: "bard",
  voidlord: "necromancer",
  ironwarden: "warrior",
  trickster: "rogue",
  symbiote: "healer",
  steeltyrant: "warrior",
  psyborn: "mage",
  hexglider: "bard",
  frostlord: "mage",
  nightclaw: "rogue",
  flameshell: "ranger",
};

// Default abilities for classes with no mapping at all
const DEFAULT_ABILITIES = {
  passive: { id: "generic_focus", name: "Focus", desc: "+5% XP from quiz questions", icon: "🔹", type: "xp_bonus", value: 0.05, trigger: "on_correct" },
  active: { id: "generic_strike", name: "Power Strike", desc: "Double damage on next correct answer", icon: "⚡", type: "damage_multiplier", value: 2, cooldown: 4, trigger: "on_next_correct" },
};

// ═══════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════

/**
 * Get abilities for a classId, with fallback for pack classes and unknowns.
 * @param {string} classId
 * @returns {{ passive: object, active: object }}
 */
export function getClassAbilities(classId) {
  if (CLASS_ABILITIES[classId]) return CLASS_ABILITIES[classId];
  const mapped = PACK_FALLBACK_MAP[classId];
  if (mapped && CLASS_ABILITIES[mapped]) return CLASS_ABILITIES[mapped];
  return DEFAULT_ABILITIES;
}

/**
 * Apply a passive ability given the battle context.
 * Returns an object describing what the passive did (if anything).
 *
 * @param {object} passiveDef - The passive definition from CLASS_ABILITIES
 * @param {object} context - { correct, baseDamage, classDamage, shielded, wrongCount }
 * @returns {object} { damageBonus, xpMultiplier, healAmount, dodged, hintExtra, shieldBonus, description }
 */
export function applyPassive(passiveDef, context) {
  const result = {
    damageBonus: 0,
    xpMultiplier: 0,
    healAmount: 0,
    dodged: false,
    hintExtra: 0,
    shieldBonus: 0,
    procced: false,
    description: null,
  };

  if (!passiveDef) return result;

  switch (passiveDef.type) {
    case "xp_bonus":
      // on_correct: grant XP multiplier bonus
      if (context.correct) {
        result.xpMultiplier = passiveDef.value;
        result.procced = true;
        result.description = `${passiveDef.name}: +${Math.round(passiveDef.value * 100)}% XP`;
      }
      break;

    case "shield_bonus":
      // on_shield_block: extra HP blocked when shield absorbs
      if (!context.correct && context.shielded) {
        result.shieldBonus = passiveDef.value;
        result.procced = true;
        result.description = `${passiveDef.name}: Shield blocked +${passiveDef.value} extra damage`;
      }
      break;

    case "hint_bonus":
      // on_hint: eliminate extra wrong answers
      if (context.usingHint) {
        result.hintExtra = passiveDef.value;
        result.procced = true;
        result.description = `${passiveDef.name}: Hint eliminates ${1 + passiveDef.value} wrong answers`;
      }
      break;

    case "damage_reduction":
      // on_wrong: reduce counterattack damage
      if (!context.correct && !context.shielded && !context.dodged) {
        result.damageBonus = -(passiveDef.value); // negative = reduces damage
        result.procced = true;
        result.description = `${passiveDef.name}: Reduced counterattack by ${passiveDef.value}`;
      }
      break;

    case "dodge_chance":
      // on_wrong: chance to dodge
      if (!context.correct && !context.shielded) {
        if (Math.random() < passiveDef.value) {
          result.dodged = true;
          result.procced = true;
          result.description = `${passiveDef.name}: Dodged the counterattack!`;
        }
      }
      break;

    case "cooldown_reduction":
      // passive: always active, handled at cooldown-set time (not here)
      // Just mark as procced for UI display
      result.procced = false; // This is structural, not per-action
      break;

    case "heal_on_correct":
      // on_correct: heal class HP
      if (context.correct) {
        result.healAmount = passiveDef.value;
        result.procced = true;
        result.description = `${passiveDef.name}: Healed ${passiveDef.value} class HP`;
      }
      break;

    case "team_xp_bonus":
      // on_correct: XP bonus for teammates (flagged for processing)
      if (context.correct) {
        result.xpMultiplier = passiveDef.value;
        result.procced = true;
        result.description = `${passiveDef.name}: Teammates get +${Math.round(passiveDef.value * 100)}% XP`;
      }
      break;

    default:
      break;
  }

  return result;
}

/**
 * Compute what an active ability does when activated.
 * Does NOT write to Firestore — returns mutations for the caller to apply.
 *
 * @param {object} activeDef - The active definition from CLASS_ABILITIES
 * @param {object} playerDoc - The player's current Firestore doc
 * @param {object} battleDoc - The battle doc (needed for heal/damage abilities)
 * @returns {object} { playerUpdates, battleUpdates, logEntry, error }
 */
export function applyActive(activeDef, playerDoc, battleDoc) {
  if (!activeDef) return { error: "No ability defined" };

  const result = {
    playerUpdates: {},
    battleUpdates: {},
    logEntry: null,
    error: null,
    description: null,
  };

  switch (activeDef.type) {
    case "damage_multiplier": {
      // Mana Burst, Backstab: buff stored on player doc, consumed on next correct
      result.playerUpdates["buffs"] = [
        ...(playerDoc.buffs || []),
        { type: "damage_multiplier", value: activeDef.value, source: activeDef.id, remaining: 1 },
      ];
      result.description = `${activeDef.name}: x${activeDef.value} damage on next correct answer`;
      break;
    }

    case "auto_crit": {
      // Precision Shot: next correct = guaranteed crit
      result.playerUpdates["buffs"] = [
        ...(playerDoc.buffs || []),
        { type: "auto_crit", source: activeDef.id, remaining: 1 },
      ];
      result.description = `${activeDef.name}: Next correct answer is a critical hit`;
      break;
    }

    case "team_damage_buff": {
      // Rally Cry: +damage for all teammates for N questions
      // Stored on battle doc as a team buff
      const teamId = playerDoc.teamId;
      const existing = battleDoc.teamBuffs || {};
      const teamBuffs = existing[teamId] || [];
      teamBuffs.push({ type: "damage_bonus", value: activeDef.value, remaining: activeDef.duration, source: activeDef.id });
      result.battleUpdates[`teamBuffs.${teamId}`] = teamBuffs;
      result.description = `${activeDef.name}: Team gets +${activeDef.value} damage for ${activeDef.duration} question(s)`;
      break;
    }

    case "heal_class": {
      // Restoration: heal class HP
      const newHP = Math.min(battleDoc.classHP.max, battleDoc.classHP.current + activeDef.value);
      const healed = newHP - battleDoc.classHP.current;
      if (healed <= 0) {
        result.description = "Class HP already full";
        break;
      }
      result.battleUpdates["classHP.current"] = newHP;
      result.description = `${activeDef.name}: Healed ${healed} class HP`;
      break;
    }

    case "heal_and_damage": {
      // Consecrate: heal + damage
      const healedHP = Math.min(battleDoc.classHP.max, battleDoc.classHP.current + activeDef.healValue);
      const actualHeal = healedHP - battleDoc.classHP.current;
      result.battleUpdates["classHP.current"] = healedHP;

      // Cap damage at 25% of boss max HP
      const dmg = Math.min(activeDef.damageValue, Math.floor(battleDoc.boss.maxHP * 0.25) || 1);
      const newBossHP = Math.max(0, battleDoc.boss.currentHP - dmg);
      result.battleUpdates["boss.currentHP"] = newBossHP;

      if (newBossHP <= 0) {
        result.battleUpdates.status = "victory";
      }
      result.description = `${activeDef.name}: Healed ${actualHeal} class HP, dealt ${dmg} boss damage`;
      break;
    }

    case "convert_wrong_to_damage": {
      // Soul Harvest: convert wrong answers into boss damage
      const wrongs = playerDoc.wrongCount || 0;
      const dmg = Math.floor(wrongs / activeDef.ratio);
      if (dmg <= 0) {
        result.description = "Not enough wrong answers to convert";
        break;
      }
      // Cap damage at 25% of boss max HP
      const cappedDmg = Math.min(dmg, Math.floor(battleDoc.boss.maxHP * 0.25) || 1);
      const newHP = Math.max(0, battleDoc.boss.currentHP - cappedDmg);
      result.battleUpdates["boss.currentHP"] = newHP;

      if (newHP <= 0) {
        result.battleUpdates.status = "victory";
      }
      result.description = `${activeDef.name}: Converted ${wrongs} wrong answers into ${cappedDmg} boss damage`;
      break;
    }

    case "global_damage_buff": {
      // Battle Song: +damage for ALL teams
      const existing = battleDoc.globalBuffs || [];
      existing.push({ type: "damage_bonus", value: activeDef.value, remaining: activeDef.duration, source: activeDef.id });
      result.battleUpdates["globalBuffs"] = existing;
      result.description = `${activeDef.name}: All teams get +${activeDef.value} damage for ${activeDef.duration} questions`;
      break;
    }

    default:
      result.error = `Unknown ability type: ${activeDef.type}`;
      break;
  }

  // Set cooldown on player doc
  if (!result.error) {
    result.playerUpdates["abilities.classAbility.cooldownRemaining"] = activeDef.cooldown;
    result.playerUpdates["abilities.classAbility.lastUsed"] = new Date().toISOString();
  }

  return result;
}

/**
 * Check if a player can use their class active ability.
 * @param {object} playerDoc - The player's Firestore doc
 * @returns {{ canUse: boolean, reason: string|null }}
 */
export function canUseActive(playerDoc) {
  if (!playerDoc) return { canUse: false, reason: "No player data" };
  const cd = playerDoc.abilities?.classAbility?.cooldownRemaining || 0;
  if (cd > 0) return { canUse: false, reason: `On cooldown (${cd} questions)` };
  if (playerDoc.finished) return { canUse: false, reason: "Battle finished" };
  return { canUse: true, reason: null };
}

/**
 * Consume on-correct player buffs (damage multiplier, auto_crit).
 * Returns { totalMultiplier, isCrit, consumed[] } and the updated buffs array.
 *
 * @param {Array} buffs - Current player buffs array
 * @returns {{ totalMultiplier: number, isCrit: boolean, consumed: string[], remainingBuffs: Array }}
 */
export function consumeCorrectBuffs(buffs = []) {
  let totalMultiplier = 1;
  let isCrit = false;
  const consumed = [];
  const remaining = [];

  for (const buff of buffs) {
    if (buff.type === "damage_multiplier" && buff.remaining > 0) {
      totalMultiplier = Math.max(totalMultiplier, buff.value); // take highest multiplier, don't stack
      consumed.push(buff.source);
      // Decrement remaining
      if (buff.remaining - 1 > 0) {
        remaining.push({ ...buff, remaining: buff.remaining - 1 });
      }
    } else if (buff.type === "auto_crit" && buff.remaining > 0) {
      isCrit = true;
      consumed.push(buff.source);
      if (buff.remaining - 1 > 0) {
        remaining.push({ ...buff, remaining: buff.remaining - 1 });
      }
    } else {
      remaining.push(buff);
    }
  }

  return { totalMultiplier, isCrit, consumed, remainingBuffs: remaining };
}

/**
 * Get the team damage buff total from battle-level buffs.
 * @param {object} battleDoc
 * @param {string} teamId
 * @returns {number} bonus damage
 */
export function getTeamDamageBuff(battleDoc, teamId) {
  let bonus = 0;

  // Team-specific buffs (Rally Cry)
  const teamBuffs = battleDoc?.teamBuffs?.[teamId] || [];
  for (const buff of teamBuffs) {
    if (buff.type === "damage_bonus" && buff.remaining > 0) {
      bonus += buff.value;
    }
  }

  // Global buffs (Battle Song)
  const globalBuffs = battleDoc?.globalBuffs || [];
  for (const buff of globalBuffs) {
    if (buff.type === "damage_bonus" && buff.remaining > 0) {
      bonus += buff.value;
    }
  }

  return bonus;
}

/**
 * Decrement team/global buff durations after a player answers.
 * Returns updated fields for the battle doc.
 * @param {object} battleDoc
 * @param {string} teamId - The team whose member just answered
 * @returns {object} battleUpdates to merge
 */
export function decrementBattleBuffs(battleDoc, teamId) {
  const updates = {};

  // Team buffs
  const teamBuffs = battleDoc?.teamBuffs?.[teamId] || [];
  if (teamBuffs.length > 0) {
    const decremented = teamBuffs
      .map((b) => ({ ...b, remaining: b.remaining - 1 }))
      .filter((b) => b.remaining > 0);
    updates[`teamBuffs.${teamId}`] = decremented;
  }

  // Global buffs decrement per answer from any team
  const globalBuffs = battleDoc?.globalBuffs || [];
  if (globalBuffs.length > 0) {
    const decremented = globalBuffs
      .map((b) => ({ ...b, remaining: b.remaining - 1 }))
      .filter((b) => b.remaining > 0);
    updates["globalBuffs"] = decremented;
  }

  return updates;
}

/**
 * Get the shield cooldown, accounting for paladin passive.
 * @param {string} classId
 * @param {number} baseCooldown
 * @returns {number}
 */
export function getShieldCooldown(classId, baseCooldown) {
  const abilities = getClassAbilities(classId);
  if (abilities.passive.type === "cooldown_reduction" && abilities.passive.target === "shield") {
    return Math.max(1, baseCooldown - abilities.passive.value);
  }
  return baseCooldown;
}
