// src/lib/bossBattle.jsx
// Boss Battle system — CO-OP RAID MODEL
// All teams fight simultaneously. Shared boss HP. Shared class HP pool.
// Correct = boss takes damage. Wrong = class takes damage.
// Everyone wins or loses together.
// Data: courses/{courseId}/bossBattles/{battleId}

import { doc, getDoc, setDoc, getDocs, collection, deleteDoc, runTransaction, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

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

// ─── Create Battle ───
export async function createBattle(courseId, { bossId, questions, teamIds, teamNames, teamColors }) {
  const boss = BOSSES.find((b) => b.id === bossId) || BOSSES[0];
  const bossMaxHP = calculateBossHP(boss, teamIds.length);
  const classMaxHP = calculateClassHP(teamIds.length);

  const battleId = `battle-${Date.now().toString(36)}`;

  // Each team gets a shuffled copy of all questions
  const teamProgress = {};
  teamIds.forEach((id, i) => {
    const indices = questions.map((_, qi) => qi);
    for (let j = indices.length - 1; j > 0; j--) {
      const k = Math.floor(Math.random() * (j + 1));
      [indices[j], indices[k]] = [indices[k], indices[j]];
    }
    teamProgress[id] = {
      name: teamNames?.[i] || `Team ${i + 1}`,
      color: teamColors?.[i] || "#888",
      questionOrder: indices,
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
  });

  const battle = sanitize({
    id: battleId,
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
    teamProgress,
    log: [],
    createdAt: new Date().toISOString(),
  });

  const ref = doc(db, "courses", courseId, "bossBattles", battleId);
  await setDoc(ref, battle);
  return battle;
}

// ─── Real-time Listener ───
export function subscribeToBattle(courseId, battleId, callback) {
  const ref = doc(db, "courses", courseId, "bossBattles", battleId);
  return onSnapshot(ref, (snap) => {
    if (snap.exists()) callback(snap.data());
  });
}

// ─── Submit Answer (atomic transaction) ───
export async function submitAnswer(courseId, battleId, teamId, answerIndex) {
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

    // Advance to next question
    tp.currentIndex++;
    if (tp.currentIndex >= tp.questionOrder.length) {
      tp.finished = true;
    }

    // Reduce cooldowns
    if (tp.shieldCooldown > 0) tp.shieldCooldown--;
    if (tp.critCooldown > 0) tp.critCooldown--;

    // Check win/lose
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

// ─── Use Ability (atomic) ───
export async function useAbilityAction(courseId, battleId, teamId, abilityId) {
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

// ─── End Battle (teacher) ───
export async function endBattle(courseId, battleId, status = "defeat") {
  const ref = doc(db, "courses", courseId, "bossBattles", battleId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const battle = snap.data();
  battle.status = status;
  battle.lastUpdated = new Date().toISOString();
  await setDoc(ref, sanitize(battle));
}

// ─── List / Delete ───
export async function listBattles(courseId) {
  const snapshot = await getDocs(collection(db, "courses", courseId, "bossBattles"));
  return snapshot.docs.map((d) => d.data()).sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
}

export async function deleteBattle(courseId, battleId) {
  await deleteDoc(doc(db, "courses", courseId, "bossBattles", battleId));
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
