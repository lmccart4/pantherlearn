// src/lib/mana.jsx
// Class Mana Pool system — shared resource for course-wide powers.
// Data lives at courses/{courseId}/mana/{poolId} (default "pool")

import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

// ─── Constants ───
export const MANA_CAP = 100;
export const DECAY_THRESHOLD = 50;
export const DECAY_RATE = 0.10;

// ─── Default Powers ───
export const DEFAULT_POWERS = [
  { id: "drop-lowest", name: "Drop Lowest Quiz", description: "Drop the lowest quiz score for everyone", cost: 40, icon: "🗑️" },
  { id: "free-time", name: "5-Min Free Time", description: "Earn 5 minutes of free time in class", cost: 20, icon: "⏰" },
  { id: "choose-topic", name: "Choose Next Topic", description: "The class votes on the next lesson topic", cost: 35, icon: "🎯" },
  { id: "extension", name: "Assignment Extension", description: "Extend the next assignment deadline by 1 day", cost: 30, icon: "📅" },
];

// ─── Default State ───
function defaultState() {
  return {
    currentMP: 0,
    powers: DEFAULT_POWERS,
    history: [],
    votes: {},
    activeVote: null,
    lastDecay: null,
    enabled: false,
  };
}

// ─── Get Mana State ───
export async function getManaState(courseId, sectionId = "pool") {
  const ref = doc(db, "courses", courseId, "mana", sectionId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return defaultState();
  return snap.data();
}

// ─── Save Mana State ───
export async function saveManaState(courseId, sectionId = "pool", state) {
  const ref = doc(db, "courses", courseId, "mana", sectionId);
  await setDoc(ref, { ...state, lastUpdated: new Date() });
}

// ─── Award Mana ───
export async function awardMana(courseId, sectionId = "pool", amount, reason, awardedBy = "system") {
  const state = await getManaState(courseId, sectionId);
  const newMP = Math.min(state.currentMP + amount, MANA_CAP);
  const actualGain = newMP - state.currentMP;

  state.currentMP = newMP;
  state.history = [{
    type: "gain", amount: actualGain, reason, awardedBy,
    timestamp: new Date().toISOString(),
  }, ...(state.history || []).slice(0, 49)];

  await saveManaState(courseId, sectionId, state);
  return { newMP, actualGain };
}

// ─── Spend Mana (activate a power) ───
export async function spendMana(courseId, sectionId = "pool", powerId) {
  const state = await getManaState(courseId, sectionId);
  const power = (state.powers || []).find((p) => p.id === powerId);
  if (!power) throw new Error("Power not found");
  if (state.currentMP < power.cost) throw new Error("Not enough mana");

  state.currentMP -= power.cost;
  state.history = [{
    type: "spend", amount: power.cost, reason: `Activated: ${power.name}`,
    powerId, timestamp: new Date().toISOString(),
  }, ...(state.history || []).slice(0, 49)];
  state.votes = {};
  state.activeVote = null;

  await saveManaState(courseId, sectionId, state);
  return { newMP: state.currentMP, power };
}

// ─── Deduct Mana (teacher penalty) ───
export async function deductMana(courseId, sectionId = "pool", amount, reason) {
  const state = await getManaState(courseId, sectionId);
  const newMP = Math.max(state.currentMP - amount, 0);
  const actualLoss = state.currentMP - newMP;

  state.currentMP = newMP;
  state.history = [{
    type: "loss", amount: actualLoss, reason,
    timestamp: new Date().toISOString(),
  }, ...(state.history || []).slice(0, 49)];

  await saveManaState(courseId, sectionId, state);
  return { newMP, actualLoss };
}

// ─── Apply Weekly Decay ───
export async function applyDecay(courseId, sectionId = "pool") {
  const state = await getManaState(courseId, sectionId);
  const now = new Date();

  if (state.lastDecay) {
    const daysSince = (now - new Date(state.lastDecay)) / (1000 * 60 * 60 * 24);
    if (daysSince < 6) return { decayed: false };
  }

  if (state.currentMP <= DECAY_THRESHOLD) {
    state.lastDecay = now.toISOString();
    await saveManaState(courseId, sectionId, state);
    return { decayed: false };
  }

  const excessMP = state.currentMP - DECAY_THRESHOLD;
  const decayAmount = Math.ceil(excessMP * DECAY_RATE);
  state.currentMP -= decayAmount;
  state.history = [{
    type: "decay", amount: decayAmount,
    reason: `Weekly decay (${DECAY_RATE * 100}% of ${excessMP} MP above ${DECAY_THRESHOLD})`,
    timestamp: now.toISOString(),
  }, ...(state.history || []).slice(0, 49)];
  state.lastDecay = now.toISOString();

  await saveManaState(courseId, sectionId, state);
  return { decayed: true, decayAmount, newMP: state.currentMP };
}

// ─── Voting ───

export async function startVote(courseId, sectionId = "pool", powerId) {
  const state = await getManaState(courseId, sectionId);
  state.activeVote = powerId;
  state.votes = { [powerId]: [] };
  await saveManaState(courseId, sectionId, state);
}

export async function castVote(courseId, sectionId = "pool", powerId, uid, vote) {
  const state = await getManaState(courseId, sectionId);
  if (state.activeVote !== powerId) throw new Error("No active vote for this power");

  const voters = state.votes?.[powerId] || [];
  const filtered = voters.filter((v) => v.uid !== uid);
  filtered.push({ uid, vote, timestamp: new Date().toISOString() });
  state.votes = { ...state.votes, [powerId]: filtered };
  await saveManaState(courseId, sectionId, state);
  return state.votes[powerId];
}

export async function endVote(courseId, sectionId = "pool") {
  const state = await getManaState(courseId, sectionId);
  state.activeVote = null;
  await saveManaState(courseId, sectionId, state);
}

// ─── Power Management ───

export async function addPower(courseId, sectionId = "pool", power) {
  const state = await getManaState(courseId, sectionId);
  const id = power.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") + "-" + Date.now().toString(36);
  const newPower = { id, ...power };
  state.powers = [...(state.powers || []), newPower];
  await saveManaState(courseId, sectionId, state);
  return newPower;
}

export async function removePower(courseId, sectionId = "pool", powerId) {
  const state = await getManaState(courseId, sectionId);
  state.powers = (state.powers || []).filter((p) => p.id !== powerId);
  if (state.activeVote === powerId) state.activeVote = null;
  await saveManaState(courseId, sectionId, state);
}

export async function updatePower(courseId, sectionId = "pool", powerId, updates) {
  const state = await getManaState(courseId, sectionId);
  state.powers = (state.powers || []).map((p) =>
    p.id === powerId ? { ...p, ...updates } : p
  );
  await saveManaState(courseId, sectionId, state);
}
