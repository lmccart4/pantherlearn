// src/lib/mana.jsx
// Class Mana Pool system — shared resource for course-wide powers.
// Data lives at courses/{courseId}/mana/{poolId} (default "pool")

import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

// ─── Constants ───
export const MANA_CAP = 100;
export const DECAY_THRESHOLD = 50;
export const DECAY_RATE = 0.10;
export const MAGE_DAILY_BUDGET = 10;

// ─── Behavior Categories ───
export const POSITIVE_BEHAVIORS = [
  { id: 'great-question', label: 'Great Question', mana: 2, icon: '❓' },
  { id: 'helped-peer', label: 'Helped a Peer', mana: 3, icon: '🤝' },
  { id: 'on-task', label: 'On Task', mana: 1, icon: '✓' },
  { id: 'participation', label: 'Participation', mana: 2, icon: '🙋' },
  { id: 'leadership', label: 'Leadership', mana: 3, icon: '⭐' },
  { id: 'improvement', label: 'Improvement', mana: 2, icon: '📈' },
];

export const NEGATIVE_BEHAVIORS = [
  { id: 'off-task', label: 'Off Task', mana: -1, icon: '😴' },
  { id: 'disruptive', label: 'Disruptive', mana: -2, icon: '🔊' },
  { id: 'phone-out', label: 'Phone Out', mana: -1, icon: '📱' },
  { id: 'late', label: 'Late', mana: -1, icon: '⏰' },
  { id: 'unprepared', label: 'Unprepared', mana: -1, icon: '📝' },
  { id: 'disrespectful', label: 'Disrespectful', mana: -3, icon: '🚫' },
];

// ─── Gendered Mana Title ───
export function getManaTitle(gender) {
  return gender === 'F' ? 'Enchantress' : 'Mage';
}

// ─── Default Powers ───
export const DEFAULT_POWERS = [
  { id: "add-song", name: "Add Song to Playlist", description: "Pick a song to add to the class playlist (teacher approved)", cost: 10, icon: "🎵", category: "privilege" },
  { id: "late-pass", name: "Late Pass", description: "No penalty for being late once", cost: 20, icon: "⏰", category: "privilege" },
  { id: "partner-choice", name: "Partner Choice", description: "Pick your partner for the next group activity", cost: 20, icon: "🤝", category: "privilege" },
  { id: "extra-credit-classwork", name: "Extra Credit (Classwork)", description: "+30 percentage points on any classwork assignment", cost: 20, icon: "📝", category: "gradeBonus", bonusAmount: 30, gradeFilter: "classwork" },
  { id: "assignment-extension", name: "Assignment Extension", description: "Get 1 extra day on your next assignment", cost: 20, icon: "📅", category: "privilege" },
  { id: "3d-print-box", name: "3D Print (Select from Box)", description: "Pick a pre-made 3D print from the selection box", cost: 25, icon: "🖨️", category: "tangible" },
  { id: "extra-credit-test", name: "Extra Credit (Test/Quiz)", description: "+10 percentage points on any test or quiz", cost: 30, icon: "⭐", category: "gradeBonus", bonusAmount: 10, gradeFilter: "assessment" },
  { id: "custom-avatar", name: "Custom Avatar Unlock", description: "Unlock a special avatar item on PantherLearn", cost: 35, icon: "🎭", category: "digital" },
  { id: "custom-profile-photo", name: "Custom Profile Photo", description: "Get a custom AI-generated profile photo", cost: 35, icon: "📸", category: "digital" },
  { id: "classwork-pass", name: "Classwork Pass", description: "Skip one classwork assignment entirely", cost: 50, icon: "🎫", category: "privilege", requiresInput: true, inputPrompt: "Which assignment do you want to be exempt from?" },
  { id: "3d-print-custom", name: "3D Print (Custom)", description: "Request a custom 3D print job — price set after teacher consultation", cost: 0, icon: "🏗️", category: "quote", isQuoteRequest: true },
];

// ─── Quote Requests (for variable-cost items like custom 3D prints) ───
export async function submitQuoteRequest(courseId, uid, studentName, powerId, description) {
  const colRef = collection(db, "courses", courseId, "manaRequests");
  const { addDoc } = await import("firebase/firestore");
  await addDoc(colRef, {
    type: "quote",
    studentUid: uid,
    studentName,
    powerId,
    description,
    status: "pending", // pending | priced | accepted | declined | cancelled
    quotedCost: null,
    createdAt: new Date().toISOString(),
  });
}

// ─── Grade Bonus (apply percentage points directly to a lesson) ───
export async function applyGradeBonus(courseId, uid, lessonId, bonusAmount) {
  const ref = doc(db, "progress", uid, "courses", courseId, "lessons", lessonId);
  const snap = await getDoc(ref);
  const current = snap.exists() ? (snap.data().gradeBonus || 0) : 0;
  const { setDoc: setDocFn } = await import("firebase/firestore");
  await setDocFn(ref, { gradeBonus: current + bonusAmount }, { merge: true });
  return current + bonusAmount;
}

// ─── Fulfillment Requests (for powers that need teacher action) ───
export async function submitFulfillmentRequest(courseId, uid, studentName, powerId, powerName, cost, details) {
  const colRef = collection(db, "courses", courseId, "manaRequests");
  const { addDoc } = await import("firebase/firestore");
  await addDoc(colRef, {
    type: "fulfillment",
    studentUid: uid,
    studentName,
    powerId,
    powerName,
    cost,
    details,
    status: "pending",
    createdAt: new Date().toISOString(),
  });
}

// ─── Reward Suggestions (students propose new rewards) ───
export async function submitRewardSuggestion(courseId, uid, studentName, suggestion) {
  const colRef = collection(db, "courses", courseId, "manaRequests");
  const { addDoc } = await import("firebase/firestore");
  await addDoc(colRef, {
    type: "suggestion",
    studentUid: uid,
    studentName,
    suggestion,
    status: "pending", // pending | approved | rejected
    createdAt: new Date().toISOString(),
  });
}

// ─── Get all requests for teacher view ───
export async function getManaRequests(courseId) {
  const colRef = collection(db, "courses", courseId, "manaRequests");
  const snap = await getDocs(colRef);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

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

// ─── Per-Student Mana System ───

export const MANA_LEVELS = [
  { threshold: 0, label: "Newcomer", color: "#6b7280" },
  { threshold: 10, label: "Apprentice", color: "#3b82f6" },
  { threshold: 25, label: "Journeyman", color: "#8b5cf6" },
  { threshold: 50, label: "Adept", color: "#a855f7" },
  { threshold: 100, label: "Expert", color: "#ec4899" },
  { threshold: 200, label: "Master", color: "#f59e0b" },
  { threshold: 500, label: "Legend", color: "#ef4444" },
];

export function getLevel(lifetimeEarned) {
  let level = MANA_LEVELS[0];
  for (const l of MANA_LEVELS) {
    if (lifetimeEarned >= l.threshold) level = l;
  }
  return level;
}

export function getNextLevel(lifetimeEarned) {
  for (const l of MANA_LEVELS) {
    if (lifetimeEarned < l.threshold) return l;
  }
  return null; // maxed out
}

function defaultStudentMana() {
  return { balance: 0, lifetimeEarned: 0, level: "Newcomer", history: [] };
}

export async function getStudentMana(courseId, uid) {
  const ref = doc(db, "courses", courseId, "studentMana", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return defaultStudentMana();
  return snap.data();
}

export async function awardStudentMana(courseId, uid, amount, reason) {
  const data = await getStudentMana(courseId, uid);
  data.balance += amount;
  data.lifetimeEarned += amount;
  const lvl = getLevel(data.lifetimeEarned);
  data.level = lvl.label;
  data.history = [
    { type: "earn", amount, reason, timestamp: new Date().toISOString() },
    ...(data.history || []).slice(0, 49),
  ];
  const ref = doc(db, "courses", courseId, "studentMana", uid);
  await setDoc(ref, data);
  return data;
}

export async function spendStudentMana(courseId, uid, powerId) {
  const poolState = await getManaState(courseId);
  const power = (poolState.powers || []).find((p) => p.id === powerId);
  if (!power) throw new Error("Power not found");

  const data = await getStudentMana(courseId, uid);
  if (data.balance < power.cost) throw new Error("Not enough mana");

  data.balance -= power.cost;
  data.history = [
    { type: "spend", amount: power.cost, reason: `Redeemed: ${power.name}`, powerId, timestamp: new Date().toISOString() },
    ...(data.history || []).slice(0, 49),
  ];
  const ref = doc(db, "courses", courseId, "studentMana", uid);
  await setDoc(ref, data);
  return { newBalance: data.balance, power };
}

export async function getStudentManaForClass(courseId) {
  const colRef = collection(db, "courses", courseId, "studentMana");
  const snap = await getDocs(colRef);
  const results = {};
  snap.forEach((d) => {
    results[d.id] = d.data();
  });
  return results;
}

// ─── Deduct Student Mana ───
export async function deductStudentMana(courseId, uid, amount, reason) {
  const ref = doc(db, "courses", courseId, "studentMana", uid);
  const snap = await getDoc(ref);
  const current = snap.exists() ? snap.data() : { balance: 0, lifetimeEarned: 0, history: [] };
  const newBalance = Math.max(0, current.balance - amount);
  const actualLoss = current.balance - newBalance;
  const entry = { type: "loss", amount: actualLoss, reason, timestamp: new Date().toISOString() };
  await setDoc(ref, {
    ...current,
    balance: newBalance,
    history: [entry, ...(current.history || []).slice(0, 49)],
    level: getLevel(current.lifetimeEarned || 0).label,
  });
  return { newBalance, actualLoss };
}

// ─── Award Behavior-Based Mana ───
export async function awardBehaviorMana(courseId, uid, behaviorId, isPositive) {
  const behaviors = isPositive ? POSITIVE_BEHAVIORS : NEGATIVE_BEHAVIORS;
  const behavior = behaviors.find(b => b.id === behaviorId);
  if (!behavior) return;
  const amount = Math.abs(behavior.mana);
  if (isPositive) {
    return awardStudentMana(courseId, uid, amount, `${behavior.label} (${behavior.icon})`);
  } else {
    return deductStudentMana(courseId, uid, amount, `${behavior.label} (${behavior.icon})`);
  }
}
