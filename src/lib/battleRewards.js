// src/lib/battleRewards.js
// Boss Battle XP reward engine — Phase 5
// Pure functions: calculate XP from battle performance, apply class modifiers, generate breakdowns.

import { getClassAbilities } from "./classAbilities";

// ═══════════════════════════════════════════════════════
// CALCULATE BASE BATTLE XP
// ═══════════════════════════════════════════════════════

/**
 * Calculate raw XP earned from a boss battle.
 * Pure function — no side effects, fully testable.
 *
 * @param {object} playerDoc - Player subcollection document
 * @param {object} battleDoc - Battle document
 * @returns {number} Total base XP (before class modifiers)
 */
export function calculateBattleXP(playerDoc, battleDoc) {
  let xp = 0;

  // Base participation — you showed up and fought
  xp += 10;

  // Per correct answer (5 XP each)
  xp += (playerDoc.correctCount || 0) * 5;

  // Damage dealt (2 XP per point)
  xp += (playerDoc.damage || 0) * 2;

  // Class ability uses (3 XP each)
  xp += (playerDoc.abilities?.classAbility?.usesCount || 0) * 3;

  // Best streak bonus (streak × 2)
  xp += (playerDoc.bestStreak || playerDoc.streak || 0) * 2;

  // Victory bonus
  if (battleDoc.status === "victory") xp += 25;

  // Perfect run bonus (no wrong answers, at least 1 correct)
  if ((playerDoc.wrongCount || 0) === 0 && (playerDoc.correctCount || 0) > 0) {
    xp += 15;
  }

  return xp;
}

// ═══════════════════════════════════════════════════════
// APPLY CLASS XP MODIFIERS
// ═══════════════════════════════════════════════════════

/**
 * Apply class-based XP modifiers to a base XP amount.
 * Mage passive: +10% XP. Bard inspiration: +5% XP for teammates.
 *
 * @param {number} baseXP - The pre-modifier XP
 * @param {object} playerDoc - The player's doc
 * @param {object} battleDoc - The battle doc (for checking bard inspirations)
 * @param {object} [allPlayers] - All player docs keyed by uid (for bard checks)
 * @returns {{ finalXP: number, modifiers: Array<{ label: string, value: number }> }}
 */
export function applyClassXPModifiers(baseXP, playerDoc, battleDoc, allPlayers) {
  let xp = baseXP;
  const modifiers = [];

  const classId = playerDoc.classId || "mage";
  const abilities = getClassAbilities(classId);

  // Direct XP bonus passives (Mage: +10%, generic focus: +5%)
  if (abilities.passive.type === "xp_bonus") {
    const bonus = Math.round(baseXP * abilities.passive.value);
    if (bonus > 0) {
      xp += bonus;
      modifiers.push({
        label: `${abilities.passive.name} +${Math.round(abilities.passive.value * 100)}%`,
        value: bonus,
      });
    }
  }

  // Bard inspiration: check if any bard on the same team answered correctly
  // Each correct answer by a bard grants +5% XP to teammates
  if (allPlayers) {
    const teamId = playerDoc.teamId;
    let bardBonus = 0;

    for (const [uid, p] of Object.entries(allPlayers)) {
      if (p.teamId !== teamId) continue;
      // Don't apply bard bonus to the bard themselves
      if (uid === playerDoc.uid) continue;

      const pAbilities = getClassAbilities(p.classId || "mage");
      if (pAbilities.passive.type === "team_xp_bonus" && (p.correctCount || 0) > 0) {
        // Each correct answer by the bard gives the team XP bonus
        bardBonus += (p.correctCount || 0) * pAbilities.passive.value;
      }
    }

    if (bardBonus > 0) {
      const bonus = Math.round(baseXP * bardBonus);
      if (bonus > 0) {
        xp += bonus;
        modifiers.push({
          label: `Bard Inspiration +${Math.round(bardBonus * 100)}%`,
          value: bonus,
        });
      }
    }
  }

  return { finalXP: xp, modifiers };
}

// ═══════════════════════════════════════════════════════
// GENERATE XP BREAKDOWN (for results UI)
// ═══════════════════════════════════════════════════════

/**
 * Generate a detailed breakdown of XP earned for display in results.
 *
 * @param {object} playerDoc - Player subcollection document
 * @param {object} battleDoc - Battle document
 * @param {object} [allPlayers] - All player docs keyed by uid (for bard checks)
 * @returns {{ breakdown: Array<{ label: string, value: number }>, total: number }}
 */
export function generateXPBreakdown(playerDoc, battleDoc, allPlayers) {
  const breakdown = [];

  // Participation
  breakdown.push({ label: "Participation", value: 10 });

  // Correct answers
  const correct = playerDoc.correctCount || 0;
  if (correct > 0) {
    breakdown.push({ label: `Correct Answers (${correct} x 5)`, value: correct * 5 });
  }

  // Damage dealt
  const damage = playerDoc.damage || 0;
  if (damage > 0) {
    breakdown.push({ label: `Damage Dealt (${damage} x 2)`, value: damage * 2 });
  }

  // Ability uses
  const abilityUses = playerDoc.abilities?.classAbility?.usesCount || 0;
  if (abilityUses > 0) {
    breakdown.push({ label: `Ability Uses (${abilityUses} x 3)`, value: abilityUses * 3 });
  }

  // Streak bonus
  const streak = playerDoc.bestStreak || playerDoc.streak || 0;
  if (streak > 0) {
    breakdown.push({ label: `Best Streak (${streak} x 2)`, value: streak * 2 });
  }

  // Victory bonus
  if (battleDoc.status === "victory") {
    breakdown.push({ label: "Victory Bonus", value: 25 });
  }

  // Perfect run
  if ((playerDoc.wrongCount || 0) === 0 && correct > 0) {
    breakdown.push({ label: "Perfect Run", value: 15 });
  }

  // Base total
  const baseTotal = breakdown.reduce((sum, b) => sum + b.value, 0);

  // Class modifiers
  const { modifiers } = applyClassXPModifiers(baseTotal, playerDoc, battleDoc, allPlayers);
  for (const mod of modifiers) {
    breakdown.push({ label: mod.label, value: mod.value });
  }

  const total = breakdown.reduce((sum, b) => sum + b.value, 0);

  return { breakdown, total };
}
