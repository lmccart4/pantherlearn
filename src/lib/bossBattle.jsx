// src/lib/bossBattle.jsx
// Boss Battle system — CO-OP RAID MODEL (v2: player subcollection)
// All teams fight simultaneously. Shared boss HP. Shared class HP pool.
// Correct = boss takes damage. Wrong = class takes damage.
// Everyone wins or loses together.
//
// v2 Data Model:
//   Battle doc: courses/{courseId}/bossBattles/{battleId}
//     - boss, classHP, status, questions, teamSummaries, log, version: 2
//   Player docs: courses/{courseId}/bossBattles/{battleId}/players/{uid}
//     - Per-student state: questionOrder, currentIndex, abilities, streak, etc.
//
// v1 compat: if battle doc has no `version` field, fall back to single-doc teamProgress logic.

import { doc, getDoc, setDoc, getDocs, writeBatch, collection, deleteDoc, runTransaction, onSnapshot, query, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { getTeams } from "./teams";
import {
  getClassAbilities, applyPassive, applyActive, canUseActive,
  consumeCorrectBuffs, getTeamDamageBuff, decrementBattleBuffs, getShieldCooldown,
} from "./classAbilities";
import { calculateBattleXP, applyClassXPModifiers, generateXPBreakdown } from "./battleRewards";
import { awardXP } from "./gamification";
import { awardMana } from "./mana";
import { shareXPToTeam } from "./teams";

// ─── Strip undefined values (Firestore rejects them) ───
function sanitize(obj) {
  if (Array.isArray(obj)) return obj.map(sanitize);
  if (obj !== null && typeof obj === "object" && !(obj instanceof Date)) {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, sanitize(v)])
    );
  }
  return obj;
}

// Fisher-Yates shuffle
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Boss Monsters ───
export const BOSSES = [
  { id: "dragon", name: "The Review Dragon", icon: "🐉", baseHP: 10, description: "A fearsome dragon that guards the knowledge vault" },
  { id: "golem", name: "The Quiz Golem", icon: "🗿", baseHP: 12, description: "An ancient stone construct powered by unanswered questions" },
  { id: "hydra", name: "The Concept Hydra", icon: "🐍", baseHP: 8, description: "Cut one head, two more grow — unless you answer correctly" },
  { id: "phantom", name: "The Exam Phantom", icon: "👻", baseHP: 10, description: "A ghostly specter that feeds on test anxiety" },
  { id: "kraken", name: "The Knowledge Kraken", icon: "🦑", baseHP: 14, description: "Lurks in the deep, grasping at half-remembered facts" },
  { id: "chimera", name: "The Final Chimera", icon: "🦁", baseHP: 16, description: "Part lion, part eagle, part serpent — all challenge" },
];

// ─── Ability Definitions ───
export const ABILITIES = {
  hint: {
    id: "hint", name: "Hint", icon: "💡",
    description: "Spend 5 mana to eliminate one wrong answer",
    manaCost: 5,
  },
  shield: {
    id: "shield", name: "Shield", icon: "🛡️",
    description: "Block damage to class HP on your next wrong answer",
    cooldownQuestions: 3,
  },
  criticalHit: {
    id: "criticalHit", name: "Critical Hit", icon: "⚔️",
    description: "Double damage on your next correct answer",
    cooldownQuestions: 4,
  },
};

// ─── Counterattack Effects (on wrong answers) ───
export const COUNTERATTACKS = [
  { id: "time-drain", name: "Time Drain", icon: "⏳", description: "Your next answer timer is shorter", classDamage: 1 },
  { id: "confusion", name: "Confusion", icon: "😵", description: "Options shuffled on your next question", classDamage: 1 },
  { id: "rage", name: "Boss Rage", icon: "💢", description: "Boss heals 1 HP", classDamage: 1, bossHeal: 1 },
  { id: "poison", name: "Poison", icon: "☠️", description: "Class takes extra damage", classDamage: 2 },
];

// ─── HP Scaling ───
export function calculateBossHP(boss, teamCount, avgTeamSize = 4) {
  const totalStudents = teamCount * avgTeamSize;
  return Math.max(boss.baseHP, Math.round(totalStudents * 1.5));
}

export function calculateClassHP(teamCount, avgTeamSize = 4) {
  const totalStudents = teamCount * avgTeamSize;
  return Math.max(10, Math.round(totalStudents * 1.2));
}

export function getBaseDamage(difficulty = "normal") {
  return { easy: 1, normal: 2, hard: 3 }[difficulty] || 2;
}

// ═══════════════════════════════════════════════════════
// VERSION CHECK — determines which code path to use
// ═══════════════════════════════════════════════════════
function isV2(battle) {
  return battle?.version === 2;
}

// ═══════════════════════════════════════════════════════
// CREATE BATTLE (v2)
// ═══════════════════════════════════════════════════════
export async function createBattle(courseId, { bossId, questions, teamIds, teamNames, teamColors }) {
  const boss = BOSSES.find((b) => b.id === bossId) || BOSSES[0];

  // Resolve team rosters + avatar data
  const allTeams = await getTeams(courseId);
  const battleTeamMap = {};
  for (let i = 0; i < teamIds.length; i++) {
    const team = allTeams.find((t) => t.id === teamIds[i]);
    battleTeamMap[teamIds[i]] = {
      name: teamNames?.[i] || `Team ${i + 1}`,
      color: teamColors?.[i] || "#888",
      members: team?.members || [],
    };
  }

  // Count total students for HP scaling
  const totalStudents = Object.values(battleTeamMap).reduce((sum, t) => sum + t.members.length, 0);
  const avgTeamSize = teamIds.length > 0 ? totalStudents / teamIds.length : 4;
  const bossMaxHP = calculateBossHP(boss, teamIds.length, avgTeamSize);
  const classMaxHP = calculateClassHP(teamIds.length, avgTeamSize);

  const battleId = `battle-${Date.now().toString(36)}`;

  // Build team summaries (lightweight aggregate on battle doc)
  const teamSummaries = {};
  for (const [tid, tData] of Object.entries(battleTeamMap)) {
    teamSummaries[tid] = {
      name: tData.name,
      color: tData.color,
      playerCount: tData.members.length,
      correctCount: 0,
      wrongCount: 0,
      damage: 0,
      finishedCount: 0,
    };
  }

  // Also create the v1-compatible teamProgress so old UI code still works during transition
  const teamProgress = {};
  for (const [tid, tData] of Object.entries(battleTeamMap)) {
    const indices = questions.map((_, qi) => qi);
    teamProgress[tid] = {
      name: tData.name,
      color: tData.color,
      questionOrder: shuffle(indices),
      currentIndex: 0,
      correctCount: 0,
      wrongCount: 0,
      damage: 0,
      shieldActive: false,
      criticalHitActive: false,
      shieldCooldown: 0,
      critCooldown: 0,
      finished: false,
    };
  }

  const battle = sanitize({
    id: battleId,
    version: 2,
    courseId,
    boss: {
      id: boss.id,
      name: boss.name,
      icon: boss.icon,
      description: boss.description || "",
      baseHP: boss.baseHP,
      maxHP: bossMaxHP,
      currentHP: bossMaxHP,
    },
    classHP: { max: classMaxHP, current: classMaxHP },
    status: "active",
    questions: questions.map((q) => ({
      prompt: q.prompt || "",
      options: q.options || [],
      correctIndex: q.correctIndex ?? 0,
      explanation: q.explanation || "",
      difficulty: q.difficulty || "normal",
      source: q.source || "",
    })),
    teamSummaries,
    teamProgress, // v1 compat — kept in sync
    log: [],
    createdAt: new Date().toISOString(),
  });

  // Write battle doc + player docs in a batch
  const batch = writeBatch(db);
  const battleRef = doc(db, "courses", courseId, "bossBattles", battleId);
  batch.set(battleRef, battle);

  // Fetch avatar data for all players
  const allUids = Object.values(battleTeamMap).flatMap((t) => t.members.map((m) => m.uid));
  const avatarSnapshots = {};
  // Read gamification docs in parallel
  const gamDocs = await Promise.all(
    allUids.map((uid) => getDoc(doc(db, "gamification", uid)).catch(() => null))
  );
  allUids.forEach((uid, i) => {
    const snap = gamDocs[i];
    if (snap?.exists()) {
      const data = snap.data();
      avatarSnapshots[uid] = data.avatar || null;
    }
  });

  // Create player docs
  for (const [tid, tData] of Object.entries(battleTeamMap)) {
    for (const member of tData.members) {
      const avatar = avatarSnapshots[member.uid] || null;
      const playerDoc = sanitize({
        teamId: tid,
        displayName: member.displayName || member.email || "Student",
        classId: avatar?.classId || "mage",
        avatar: avatar ? {
          skinTone: avatar.skinTone || "medium",
          hairColor: avatar.hairColor || "black",
          eyeColor: avatar.eyeColor || "brown",
          petId: avatar.petId || "fire_spirit",
          accessory: avatar.accessory || "none",
          specialPower: avatar.specialPower || "none",
        } : null,
        questionOrder: shuffle(questions.map((_, qi) => qi)),
        currentIndex: 0,
        correctCount: 0,
        wrongCount: 0,
        damage: 0,
        abilities: {
          shield: { active: false, cooldownRemaining: 0 },
          criticalHit: { active: false, cooldownRemaining: 0 },
          classAbility: { cooldownRemaining: 0, lastUsed: null },
        },
        buffs: [],
        streak: 0,
        bestStreak: 0,
        finished: false,
        xpAwarded: false,
      });

      const playerRef = doc(db, "courses", courseId, "bossBattles", battleId, "players", member.uid);
      batch.set(playerRef, playerDoc);
    }
  }

  await batch.commit();
  return battle;
}

// ═══════════════════════════════════════════════════════
// REAL-TIME LISTENERS
// ═══════════════════════════════════════════════════════

/** Subscribe to the battle doc (boss HP, class HP, status, log, teamSummaries/teamProgress) */
export function subscribeToBattle(courseId, battleId, callback) {
  const ref = doc(db, "courses", courseId, "bossBattles", battleId);
  return onSnapshot(ref, (snap) => {
    if (snap.exists()) callback(snap.data());
  });
}

/** Subscribe to a single player doc (student's own state) */
export function subscribeToPlayer(courseId, battleId, uid, callback) {
  const ref = doc(db, "courses", courseId, "bossBattles", battleId, "players", uid);
  return onSnapshot(ref, (snap) => {
    if (snap.exists()) callback(snap.data());
    else callback(null);
  });
}

/** Subscribe to all player docs (teacher view) */
export function subscribeToAllPlayers(courseId, battleId, callback) {
  const col = collection(db, "courses", courseId, "bossBattles", battleId, "players");
  return onSnapshot(query(col), (snap) => {
    const players = {};
    snap.docs.forEach((d) => { players[d.id] = d.data(); });
    callback(players);
  });
}

// ═══════════════════════════════════════════════════════
// SUBMIT ANSWER — v2 (player doc + battle doc transaction)
// ═══════════════════════════════════════════════════════
async function submitAnswerV2(courseId, battleId, uid, answerIndex) {
  const battleRef = doc(db, "courses", courseId, "bossBattles", battleId);
  const playerRef = doc(db, "courses", courseId, "bossBattles", battleId, "players", uid);

  return runTransaction(db, async (transaction) => {
    const [battleSnap, playerSnap] = await Promise.all([
      transaction.get(battleRef),
      transaction.get(playerRef),
    ]);

    if (!battleSnap.exists()) throw new Error("Battle not found");
    if (!playerSnap.exists()) throw new Error("Player not found");

    const battle = battleSnap.data();
    const player = playerSnap.data();

    if (battle.status !== "active" && battle.status !== "paused") return { battle, result: null };
    if (battle.status === "paused") throw new Error("Battle is paused — no answers accepted");
    if (player.finished) return { battle, result: null };

    const qIdx = player.questionOrder[player.currentIndex];
    const question = battle.questions[qIdx];
    if (!question) return { battle, result: null };

    const teamId = player.teamId;
    const teamInfo = battle.teamSummaries?.[teamId] || battle.teamProgress?.[teamId] || {};
    const teamName = teamInfo.name || "Unknown";
    const teamColor = teamInfo.color || "#888";

    const correct = answerIndex === question.correctIndex;
    const classId = player.classId || "mage";
    const classAbilities = getClassAbilities(classId);
    const passiveProcs = [];

    const result = {
      correct,
      team: teamName,
      teamColor,
      teamId,
      playerName: player.displayName,
      uid,
      questionPrompt: question.prompt,
      timestamp: new Date().toISOString(),
      passiveProcs: [],
    };

    // ── Player doc updates ──
    const newStreak = correct ? (player.streak || 0) + 1 : 0;
    const bestStreak = Math.max(newStreak, player.bestStreak || 0);
    const playerUpdates = {
      currentIndex: player.currentIndex + 1,
      streak: newStreak,
      bestStreak,
    };

    // ── Battle doc updates ──
    const battleUpdates = {
      lastUpdated: new Date().toISOString(),
    };

    if (correct) {
      // 1. Base damage by difficulty
      let damage = getBaseDamage(question.difficulty);

      // 2. Check built-in crit ability
      let isCrit = false;
      if (player.abilities?.criticalHit?.active) {
        damage *= 2;
        playerUpdates["abilities.criticalHit.active"] = false;
        isCrit = true;
      }

      // 3. Check class-ability buffs (Mana Burst, Backstab, Precision Shot)
      const { totalMultiplier, isCrit: buffCrit, consumed, remainingBuffs } = consumeCorrectBuffs(player.buffs || []);
      if (totalMultiplier > 1) {
        damage = Math.round(damage * totalMultiplier);
      }
      if (buffCrit) {
        isCrit = true;
      }
      if (consumed.length > 0) {
        playerUpdates.buffs = remainingBuffs;
        result.consumedBuffs = consumed;
      }

      result.criticalHit = isCrit;

      // 4. Team buffs (Rally Cry / Battle Song)
      const teamBonus = getTeamDamageBuff(battle, teamId);
      if (teamBonus > 0) {
        damage += teamBonus;
        passiveProcs.push({ source: "team_buff", description: `Team buff: +${teamBonus} damage` });
      }

      // 5. Cap any single hit at 25% of boss max HP
      const maxHit = Math.max(1, Math.floor(battle.boss.maxHP * 0.25));
      if (damage > maxHit) damage = maxHit;

      // 6. Apply passive procs for correct answer
      const passiveResult = applyPassive(classAbilities.passive, { correct: true });
      if (passiveResult.procced) {
        passiveProcs.push({ source: classAbilities.passive.id, description: passiveResult.description });

        // Necromancer passive: heal class HP on correct
        if (passiveResult.healAmount > 0) {
          const newClassHP = Math.min(battle.classHP.max, battle.classHP.current + passiveResult.healAmount);
          battleUpdates["classHP.current"] = newClassHP;
        }

        // XP bonus flag (Mage, Bard): stored in result for XP system to pick up
        if (passiveResult.xpMultiplier > 0) {
          result.xpBonus = passiveResult.xpMultiplier;
        }
      }

      playerUpdates.correctCount = (player.correctCount || 0) + 1;
      playerUpdates.damage = (player.damage || 0) + damage;
      result.damage = damage;
      result.type = "attack";

      // Apply damage to boss
      const newBossHP = Math.max(0, battle.boss.currentHP - damage);
      battleUpdates["boss.currentHP"] = newBossHP;

      // Update teamSummaries
      const ts = battle.teamSummaries?.[teamId];
      if (ts) {
        battleUpdates[`teamSummaries.${teamId}.correctCount`] = (ts.correctCount || 0) + 1;
        battleUpdates[`teamSummaries.${teamId}.damage`] = (ts.damage || 0) + damage;
      }

      // Also update v1-compat teamProgress
      const tp = battle.teamProgress?.[teamId];
      if (tp) {
        battleUpdates[`teamProgress.${teamId}.correctCount`] = (tp.correctCount || 0) + 1;
        battleUpdates[`teamProgress.${teamId}.damage`] = (tp.damage || 0) + damage;
        battleUpdates[`teamProgress.${teamId}.currentIndex`] = (tp.currentIndex || 0) + 1;
      }

      // Check boss death
      if (newBossHP <= 0) {
        battleUpdates.status = "victory";
        result.victory = true;
      }
    } else {
      // ── WRONG ANSWER ──
      playerUpdates.wrongCount = (player.wrongCount || 0) + 1;
      result.type = "miss";

      const counter = COUNTERATTACKS[Math.floor(Math.random() * COUNTERATTACKS.length)];
      result.counterattack = counter;

      // 1. Check shield
      if (player.abilities?.shield?.active) {
        playerUpdates["abilities.shield.active"] = false;
        result.shielded = true;

        // Warrior passive: shield blocks extra damage (Iron Will)
        const shieldPassive = applyPassive(classAbilities.passive, { correct: false, shielded: true });
        if (shieldPassive.procced && shieldPassive.shieldBonus > 0) {
          result.shieldBonus = shieldPassive.shieldBonus;
          passiveProcs.push({ source: classAbilities.passive.id, description: shieldPassive.description });
        }
      }

      // Update teamSummaries
      const ts = battle.teamSummaries?.[teamId];
      if (ts) {
        battleUpdates[`teamSummaries.${teamId}.wrongCount`] = (ts.wrongCount || 0) + 1;
      }

      const tp = battle.teamProgress?.[teamId];
      if (tp) {
        battleUpdates[`teamProgress.${teamId}.wrongCount`] = (tp.wrongCount || 0) + 1;
        battleUpdates[`teamProgress.${teamId}.currentIndex`] = (tp.currentIndex || 0) + 1;
      }

      if (!result.shielded) {
        // 2. Rogue passive: dodge check (must run before damage reduction)
        const dodgeResult = applyPassive(classAbilities.passive, { correct: false, shielded: false });
        if (dodgeResult.dodged) {
          result.dodged = true;
          passiveProcs.push({ source: classAbilities.passive.id, description: dodgeResult.description });
        } else {
          // 3. Healer passive: damage reduction
          const reductionResult = applyPassive(classAbilities.passive, { correct: false, shielded: false, dodged: false });
          let classDmg = counter.classDamage || 1;
          if (reductionResult.procced && reductionResult.damageBonus < 0) {
            classDmg = Math.max(0, classDmg + reductionResult.damageBonus);
            passiveProcs.push({ source: classAbilities.passive.id, description: reductionResult.description });
          }

          // 3b. Boss rage mode: double counterattack damage
          const bossState = battle.bossState || {};
          if (bossState.rage > 0) {
            classDmg *= 2;
            result.rageActive = true;
            // Decrement rage counter
            const newRage = bossState.rage - 1;
            battleUpdates["bossState.rage"] = newRage;
          }

          // 4. Apply class damage
          const currentClassHP = battleUpdates["classHP.current"] ?? battle.classHP.current;
          const newClassHP = Math.max(0, currentClassHP - classDmg);
          battleUpdates["classHP.current"] = newClassHP;
          result.classDamage = classDmg;

          if (counter.bossHeal) {
            const currentBossHP = battleUpdates["boss.currentHP"] ?? battle.boss.currentHP;
            const healed = Math.min(battle.boss.maxHP, currentBossHP + counter.bossHeal);
            battleUpdates["boss.currentHP"] = healed;
            result.bossHeal = counter.bossHeal;
          }

          // Check class death
          if (newClassHP <= 0) {
            battleUpdates.status = "defeat";
            result.defeat = true;
          }
        }
      }
    }

    // 7. Decrement all active buff durations on battle doc
    const buffUpdates = decrementBattleBuffs(battle, teamId);
    Object.assign(battleUpdates, buffUpdates);

    // 7b. Clear confusion flag after player answers (one-round effect)
    if (battle.bossState?.confusion) {
      battleUpdates["bossState.confusion"] = false;
      result.wasConfused = true;
    }

    // 8. Decrement cooldowns
    const shieldCD = player.abilities?.shield?.cooldownRemaining || 0;
    const critCD = player.abilities?.criticalHit?.cooldownRemaining || 0;
    const classAbilityCD = player.abilities?.classAbility?.cooldownRemaining || 0;
    if (shieldCD > 0) playerUpdates["abilities.shield.cooldownRemaining"] = shieldCD - 1;
    if (critCD > 0) playerUpdates["abilities.criticalHit.cooldownRemaining"] = critCD - 1;
    if (classAbilityCD > 0) playerUpdates["abilities.classAbility.cooldownRemaining"] = classAbilityCD - 1;

    // Check if player is now finished
    if (player.currentIndex + 1 >= player.questionOrder.length) {
      playerUpdates.finished = true;
    }

    // Update teamSummaries finishedCount if this player just finished
    if (playerUpdates.finished) {
      const ts = battle.teamSummaries?.[teamId];
      if (ts) {
        battleUpdates[`teamSummaries.${teamId}.finishedCount`] = (ts.finishedCount || 0) + 1;
      }

      // Check if ALL players across all teams are finished
      if (!battleUpdates.status) {
        let allDone = true;
        for (const [tId, tSum] of Object.entries(battle.teamSummaries || {})) {
          const fc = tId === teamId ? (tSum.finishedCount || 0) + 1 : (tSum.finishedCount || 0);
          if (fc < (tSum.playerCount || 0)) { allDone = false; break; }
        }
        if (allDone) {
          battleUpdates.status = "defeat";
          result.defeat = true;
        }
      }
    }

    // Store passive procs on the result for UI
    result.passiveProcs = passiveProcs;

    // Append to battle log
    const newLog = [result, ...(battle.log || [])].slice(0, 50);
    battleUpdates.log = newLog;

    // Write both docs
    transaction.update(playerRef, sanitize(playerUpdates));
    transaction.update(battleRef, sanitize(battleUpdates));

    // Return merged battle state for UI
    const mergedBattle = { ...battle };
    if (battleUpdates["boss.currentHP"] !== undefined) mergedBattle.boss.currentHP = battleUpdates["boss.currentHP"];
    if (battleUpdates["classHP.current"] !== undefined) mergedBattle.classHP.current = battleUpdates["classHP.current"];
    if (battleUpdates.status) mergedBattle.status = battleUpdates.status;
    mergedBattle.log = newLog;

    return { battle: mergedBattle, result };
  });
}

// ═══════════════════════════════════════════════════════
// SUBMIT ANSWER — v1 (original single-doc logic)
// ═══════════════════════════════════════════════════════
async function submitAnswerV1(courseId, battleId, teamId, answerIndex) {
  const ref = doc(db, "courses", courseId, "bossBattles", battleId);

  return runTransaction(db, async (transaction) => {
    const snap = await transaction.get(ref);
    if (!snap.exists()) throw new Error("Battle not found");
    const battle = snap.data();

    if (battle.status !== "active") return { battle, result: null };

    const tp = battle.teamProgress[teamId];
    if (!tp || tp.finished) return { battle, result: null };

    const qIdx = tp.questionOrder[tp.currentIndex];
    const question = battle.questions[qIdx];
    if (!question) return { battle, result: null };

    const correct = answerIndex === question.correctIndex;
    const result = {
      correct,
      team: tp.name,
      teamColor: tp.color,
      teamId,
      questionPrompt: question.prompt,
      timestamp: new Date().toISOString(),
    };

    if (correct) {
      let damage = getBaseDamage(question.difficulty);
      if (tp.criticalHitActive) {
        damage *= 2;
        tp.criticalHitActive = false;
        result.criticalHit = true;
      }
      battle.boss.currentHP = Math.max(0, battle.boss.currentHP - damage);
      tp.damage += damage;
      tp.correctCount++;
      result.damage = damage;
      result.type = "attack";
    } else {
      tp.wrongCount++;
      result.type = "miss";

      const counter = COUNTERATTACKS[Math.floor(Math.random() * COUNTERATTACKS.length)];
      result.counterattack = counter;

      if (tp.shieldActive) {
        tp.shieldActive = false;
        result.shielded = true;
      } else {
        const classDmg = counter.classDamage || 1;
        battle.classHP.current = Math.max(0, battle.classHP.current - classDmg);
        result.classDamage = classDmg;

        if (counter.bossHeal) {
          battle.boss.currentHP = Math.min(battle.boss.maxHP, battle.boss.currentHP + counter.bossHeal);
          result.bossHeal = counter.bossHeal;
        }
      }
    }

    tp.currentIndex++;
    if (tp.currentIndex >= tp.questionOrder.length) {
      tp.finished = true;
    }

    if (tp.shieldCooldown > 0) tp.shieldCooldown--;
    if (tp.critCooldown > 0) tp.critCooldown--;

    if (battle.boss.currentHP <= 0) {
      battle.status = "victory";
      result.victory = true;
    } else if (battle.classHP.current <= 0) {
      battle.status = "defeat";
      result.defeat = true;
    } else {
      const allDone = Object.values(battle.teamProgress).every((t) => t.finished);
      if (allDone) {
        battle.status = "defeat";
        result.defeat = true;
      }
    }

    battle.log = [result, ...(battle.log || [])].slice(0, 50);
    battle.teamProgress[teamId] = tp;
    battle.lastUpdated = new Date().toISOString();

    transaction.set(ref, sanitize(battle));
    return { battle, result };
  });
}

// ═══════════════════════════════════════════════════════
// PUBLIC: submitAnswer — routes to v1 or v2
// ═══════════════════════════════════════════════════════
/**
 * Submit an answer. For v2 battles, pass uid as teamId (the player's UID).
 * For v1 battles, pass the team doc ID as teamId.
 * The caller (BossBattle.jsx) determines which to pass based on battle.version.
 */
export async function submitAnswer(courseId, battleId, teamIdOrUid, answerIndex, { version, uid } = {}) {
  if (version === 2 && uid) {
    return submitAnswerV2(courseId, battleId, uid, answerIndex);
  }
  // v1 fallback
  return submitAnswerV1(courseId, battleId, teamIdOrUid, answerIndex);
}

// ═══════════════════════════════════════════════════════
// USE ABILITY — v2 (player-doc only for shield/crit)
// ═══════════════════════════════════════════════════════
async function useAbilityV2(courseId, battleId, uid, abilityId) {
  const battleRef = doc(db, "courses", courseId, "bossBattles", battleId);
  const playerRef = doc(db, "courses", courseId, "bossBattles", battleId, "players", uid);

  return runTransaction(db, async (transaction) => {
    const [battleSnap, playerSnap] = await Promise.all([
      transaction.get(battleRef),
      transaction.get(playerRef),
    ]);

    if (!battleSnap.exists()) throw new Error("Battle not found");
    if (!playerSnap.exists()) throw new Error("Player not found");

    const battle = battleSnap.data();
    const player = playerSnap.data();
    const ability = ABILITIES[abilityId];
    if (!ability) return { error: "Unknown ability" };

    const teamInfo = battle.teamSummaries?.[player.teamId] || battle.teamProgress?.[player.teamId] || {};
    const teamName = teamInfo.name || "Unknown";
    const teamColor = teamInfo.color || "#888";

    if (abilityId === "shield") {
      if (player.abilities?.shield?.active) return { error: "Shield already active" };
      if ((player.abilities?.shield?.cooldownRemaining || 0) > 0) return { error: `Shield on cooldown (${player.abilities.shield.cooldownRemaining} questions)` };
      // Paladin passive: shield has reduced cooldown
      const classId = player.classId || "mage";
      const shieldCD = getShieldCooldown(classId, ability.cooldownQuestions);
      transaction.update(playerRef, {
        "abilities.shield.active": true,
        "abilities.shield.cooldownRemaining": shieldCD,
      });
    } else if (abilityId === "criticalHit") {
      if (player.abilities?.criticalHit?.active) return { error: "Critical hit already charged" };
      if ((player.abilities?.criticalHit?.cooldownRemaining || 0) > 0) return { error: `Crit on cooldown (${player.abilities.criticalHit.cooldownRemaining} questions)` };
      transaction.update(playerRef, {
        "abilities.criticalHit.active": true,
        "abilities.criticalHit.cooldownRemaining": ability.cooldownQuestions,
      });
    }

    // Log to battle doc
    const logEntry = {
      type: "ability",
      team: teamName,
      teamColor,
      teamId: player.teamId,
      playerName: player.displayName,
      uid,
      ability: ability.name,
      abilityIcon: ability.icon,
      timestamp: new Date().toISOString(),
    };
    const newLog = [logEntry, ...(battle.log || [])].slice(0, 50);
    transaction.update(battleRef, {
      log: newLog,
      lastUpdated: new Date().toISOString(),
    });

    return { error: null };
  });
}

// ═══════════════════════════════════════════════════════
// USE CLASS ABILITY — v2 (class-specific active ability)
// ═══════════════════════════════════════════════════════
export async function useClassAbility(courseId, battleId, uid) {
  const battleRef = doc(db, "courses", courseId, "bossBattles", battleId);
  const playerRef = doc(db, "courses", courseId, "bossBattles", battleId, "players", uid);

  return runTransaction(db, async (transaction) => {
    const [battleSnap, playerSnap] = await Promise.all([
      transaction.get(battleRef),
      transaction.get(playerRef),
    ]);

    if (!battleSnap.exists()) throw new Error("Battle not found");
    if (!playerSnap.exists()) throw new Error("Player not found");

    const battle = battleSnap.data();
    const player = playerSnap.data();

    if (battle.status !== "active") return { error: "Battle not active" };
    if (player.finished) return { error: "Already finished" };

    // Check cooldown
    const { canUse, reason } = canUseActive(player);
    if (!canUse) return { error: reason };

    const classId = player.classId || "mage";
    const classAbilities = getClassAbilities(classId);
    const activeDef = classAbilities.active;

    // Compute mutations
    const { playerUpdates, battleUpdates, description, error } = applyActive(activeDef, player, battle);
    if (error) return { error };

    const teamInfo = battle.teamSummaries?.[player.teamId] || battle.teamProgress?.[player.teamId] || {};
    const teamName = teamInfo.name || "Unknown";
    const teamColor = teamInfo.color || "#888";

    // Build log entry
    const logEntry = {
      type: "ability",
      team: teamName,
      teamColor,
      teamId: player.teamId,
      playerName: player.displayName,
      uid,
      ability: activeDef.name,
      abilityIcon: activeDef.icon,
      classAbility: true,
      description,
      timestamp: new Date().toISOString(),
    };

    // Track ability use count for XP rewards
    playerUpdates["abilities.classAbility.usesCount"] = (player.abilities?.classAbility?.usesCount || 0) + 1;

    // Merge battle updates
    const finalBattleUpdates = {
      ...battleUpdates,
      log: [logEntry, ...(battle.log || [])].slice(0, 50),
      lastUpdated: new Date().toISOString(),
    };

    // Write updates
    transaction.update(playerRef, sanitize(playerUpdates));
    transaction.update(battleRef, sanitize(finalBattleUpdates));

    return { error: null, description, abilityName: activeDef.name, abilityIcon: activeDef.icon };
  });
}

async function useAbilityV1(courseId, battleId, teamId, abilityId) {
  const ref = doc(db, "courses", courseId, "bossBattles", battleId);

  return runTransaction(db, async (transaction) => {
    const snap = await transaction.get(ref);
    if (!snap.exists()) throw new Error("Battle not found");
    const battle = snap.data();
    const tp = battle.teamProgress[teamId];
    if (!tp) return { error: "Team not found" };

    const ability = ABILITIES[abilityId];
    if (!ability) return { error: "Unknown ability" };

    if (abilityId === "shield") {
      if (tp.shieldActive) return { error: "Shield already active" };
      if (tp.shieldCooldown > 0) return { error: `Shield on cooldown (${tp.shieldCooldown} questions)` };
      tp.shieldActive = true;
      tp.shieldCooldown = ability.cooldownQuestions;
    } else if (abilityId === "criticalHit") {
      if (tp.criticalHitActive) return { error: "Critical hit already charged" };
      if (tp.critCooldown > 0) return { error: `Crit on cooldown (${tp.critCooldown} questions)` };
      tp.criticalHitActive = true;
      tp.critCooldown = ability.cooldownQuestions;
    }

    const logEntry = {
      type: "ability",
      team: tp.name,
      teamColor: tp.color,
      teamId,
      ability: ability.name,
      abilityIcon: ability.icon,
      timestamp: new Date().toISOString(),
    };
    battle.log = [logEntry, ...(battle.log || [])].slice(0, 50);
    battle.teamProgress[teamId] = tp;
    battle.lastUpdated = new Date().toISOString();

    transaction.set(ref, sanitize(battle));
    return { error: null };
  });
}

/** Public: use ability — routes to v1 or v2 */
export async function useAbilityAction(courseId, battleId, teamIdOrUid, abilityId, { version, uid } = {}) {
  if (version === 2 && uid) {
    return useAbilityV2(courseId, battleId, uid, abilityId);
  }
  return useAbilityV1(courseId, battleId, teamIdOrUid, abilityId);
}

// ─── End Battle (teacher) ───
export async function endBattle(courseId, battleId, status = "defeat", reason) {
  const ref = doc(db, "courses", courseId, "bossBattles", battleId);
  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(ref);
    if (!snap.exists()) return;
    const battle = snap.data();
    battle.status = status;
    battle.lastUpdated = new Date().toISOString();
    if (reason) battle.endReason = reason;
    // Log the end event
    const logEntry = {
      type: "boss_event",
      eventType: `force_${status}`,
      description: `Battle ended as ${status}${reason ? `: ${reason}` : ""}`,
      timestamp: new Date().toISOString(),
    };
    battle.log = [logEntry, ...(battle.log || [])].slice(0, 50);
    transaction.set(ref, sanitize(battle));
  });
}

// ═══════════════════════════════════════════════════════
// AWARD BATTLE XP — Phase 5
// Called once when battle ends (victory or defeat).
// Reads all player docs, calculates XP, awards via gamification system.
// Double-award guard: checks xpAwarded on each player doc AND on battle doc.
// ═══════════════════════════════════════════════════════

export async function awardBattleXP(courseId, battleId) {
  const battleRef = doc(db, "courses", courseId, "bossBattles", battleId);
  const battleSnap = await getDoc(battleRef);
  if (!battleSnap.exists()) return null;

  const battleDoc = battleSnap.data();

  // Guard: don't double-award
  if (battleDoc.xpAwarded) return null;

  // Must be ended
  if (battleDoc.status !== "victory" && battleDoc.status !== "defeat") return null;

  // Read all player docs
  const playersCol = collection(db, "courses", courseId, "bossBattles", battleId, "players");
  const playersSnap = await getDocs(playersCol);
  const allPlayers = {};
  playersSnap.docs.forEach((d) => { allPlayers[d.id] = d.data(); });

  const results = {};

  // Process each player
  for (const [uid, playerDoc] of Object.entries(allPlayers)) {
    // Skip already-awarded players (safety net)
    if (playerDoc.xpAwarded) continue;

    // Attach uid for bard teammate checks
    const playerWithUid = { ...playerDoc, uid };

    // Calculate XP
    const baseXP = calculateBattleXP(playerWithUid, battleDoc);
    const { finalXP, modifiers } = applyClassXPModifiers(baseXP, playerWithUid, battleDoc, allPlayers);
    const { breakdown, total } = generateXPBreakdown(playerWithUid, battleDoc, allPlayers);

    // Award XP via gamification system
    try {
      const xpResult = await awardXP(uid, total, "boss_battle", courseId);

      // Share XP to team
      try {
        await shareXPToTeam(courseId, uid, total);
      } catch (teamErr) {
        console.warn("Could not share XP to team:", teamErr);
      }

      // Update player doc with XP data
      const playerRef = doc(db, "courses", courseId, "bossBattles", battleId, "players", uid);
      await updateDoc(playerRef, {
        xpAwarded: true,
        xpEarned: total,
        xpBreakdown: breakdown,
        leveledUp: xpResult?.leveledUp || false,
        newLevel: xpResult?.newLevel || null,
      });

      results[uid] = { xpEarned: total, breakdown, leveledUp: xpResult?.leveledUp || false, newLevel: xpResult?.newLevel || null };
    } catch (err) {
      console.error(`Failed to award XP to ${uid}:`, err);
      results[uid] = { xpEarned: 0, error: err.message };
    }
  }

  // Award class mana based on battle outcome
  try {
    const manaAmount = battleDoc.status === "victory" ? 5 : 2;
    const reason = battleDoc.status === "victory"
      ? `Boss Battle victory (${battleDoc.boss?.name || "boss"})`
      : `Boss Battle participation (${battleDoc.boss?.name || "boss"})`;
    await awardMana(courseId, "pool", manaAmount, reason, "boss_battle");
  } catch (manaErr) {
    console.warn("Could not award mana:", manaErr);
  }

  // Mark battle doc as XP-awarded
  await updateDoc(battleRef, {
    xpAwarded: true,
    xpAwardedAt: new Date().toISOString(),
  });

  return results;
}

// ═══════════════════════════════════════════════════════
// TRIGGER BOSS EVENT — teacher Game Master actions (v2)
// ═══════════════════════════════════════════════════════
/**
 * Trigger a boss event during an active v2 battle.
 * Event types: rage_mode, boss_heal, confusion_wave, enrage, pause, resume
 * Modifies the battle doc and appends to the log.
 */
export async function triggerBossEvent(courseId, battleId, eventType, params = {}) {
  const ref = doc(db, "courses", courseId, "bossBattles", battleId);

  return runTransaction(db, async (transaction) => {
    const snap = await transaction.get(ref);
    if (!snap.exists()) throw new Error("Battle not found");
    const battle = snap.data();

    // Pause/resume allowed even when paused; others require active/paused
    if (eventType !== "resume" && battle.status !== "active" && battle.status !== "paused") {
      throw new Error("Battle is not active");
    }

    const battleUpdates = { lastUpdated: new Date().toISOString() };
    let description = "";

    // Ensure bossState exists
    const bossState = battle.bossState || {};

    switch (eventType) {
      case "rage_mode": {
        bossState.rage = 5;
        battleUpdates.bossState = bossState;
        description = "Boss enters RAGE MODE! Counterattack damage doubles for 5 wrong answers.";
        break;
      }
      case "boss_heal": {
        const amount = params.amount || 3;
        const newHP = Math.min(battle.boss.maxHP, battle.boss.currentHP + amount);
        const healed = newHP - battle.boss.currentHP;
        battleUpdates["boss.currentHP"] = newHP;
        description = `Boss heals ${healed} HP! (${newHP}/${battle.boss.maxHP})`;
        break;
      }
      case "confusion_wave": {
        bossState.confusion = true;
        battleUpdates.bossState = bossState;
        description = "Confusion Wave! All students' next answer options are scrambled.";
        break;
      }
      case "enrage": {
        const damage = params.damage || 2;
        const newClassHP = Math.max(0, battle.classHP.current - damage);
        battleUpdates["classHP.current"] = newClassHP;
        description = `Boss strikes the class for ${damage} HP! (${newClassHP}/${battle.classHP.max})`;
        // Check for defeat
        if (newClassHP <= 0) {
          battleUpdates.status = "defeat";
          description += " The class has fallen!";
        }
        break;
      }
      case "pause": {
        battleUpdates.status = "paused";
        description = "Battle PAUSED by teacher.";
        break;
      }
      case "resume": {
        if (battle.status !== "paused") return; // no-op if not paused
        battleUpdates.status = "active";
        description = "Battle RESUMED!";
        break;
      }
      default:
        throw new Error(`Unknown boss event type: ${eventType}`);
    }

    // Build log entry
    const logEntry = {
      type: "boss_event",
      eventType,
      description,
      timestamp: new Date().toISOString(),
    };

    // Merge updates
    const newLog = [logEntry, ...(battle.log || [])].slice(0, 50);
    battleUpdates.log = newLog;

    transaction.update(ref, sanitize(battleUpdates));
    return { description };
  });
}

// ─── List / Delete ───
export async function listBattles(courseId) {
  const snapshot = await getDocs(collection(db, "courses", courseId, "bossBattles"));
  return snapshot.docs.map((d) => d.data()).sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
}

export async function deleteBattle(courseId, battleId) {
  // Delete player subcollection first, then battle doc
  const playersSnap = await getDocs(collection(db, "courses", courseId, "bossBattles", battleId, "players"));
  const batch = writeBatch(db);
  playersSnap.docs.forEach((d) => batch.delete(d.ref));
  batch.delete(doc(db, "courses", courseId, "bossBattles", battleId));
  await batch.commit();
}

// ─── Extract questions from lesson blocks ───
export function extractQuestionsFromLesson(lesson) {
  return (lesson.blocks || [])
    .filter((b) => {
      if (b.type !== "question") return false;
      if (b.questionType === "multiple_choice") return true;
      if (Array.isArray(b.options) && b.options.length >= 2 && b.correctIndex != null) return true;
      return false;
    })
    .map((b) => ({
      prompt: b.prompt || "",
      options: b.options || [],
      correctIndex: b.correctIndex ?? 0,
      explanation: b.explanation || "",
      difficulty: "normal",
      source: lesson.title || "",
    }));
}
