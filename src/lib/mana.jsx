// src/lib/mana.jsx
// Class Mana Pool system — shared resource for course-wide powers.
// Data lives at courses/{courseId}/mana/{poolId} (default "pool")

import { doc, getDoc, setDoc, addDoc, collection, getDocs, query, where, orderBy, serverTimestamp, runTransaction } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { db } from "./firebase";
import { createNotification } from "./notifications";

// ─── Period Windows (courseId → [startMin, endMin] in ET) ───
export const PERIOD_WINDOWS = {
  "physics":               [480, 522],   // P1: 8:00–8:42
  "digital-literacy":      [583, 625],   // P3: 9:43–10:25
  "Y9Gdhw5MTY8wMFt6Tlvj": [629, 671],   // P4: 10:29–11:11
  "DacjJ93vUDcwqc260OP3":  [675, 717],   // P5: 11:15–11:57
  "M2MVSXrKuVCD9JQfZZyp":  [767, 809],   // P7: 12:47–1:29
  "fUw67wFhAtobWFhjwvZ5":  [859, 901],   // P9: 2:19–3:01
};

// ─── Constants ───
export const MANA_CAP = 100;
export const DECAY_THRESHOLD = 50;
export const DECAY_RATE = 0.10;
export const MAGE_DAILY_BUDGET = 50;
export const MAGE_PER_STUDENT_CAP = 10;
export const MAGE_COMPLETION_BONUS = 5;

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
  { id: "late-pass", name: "Late Pass", description: "No penalty for being late once (10 min max)", cost: 20, icon: "⏰", category: "privilege" },
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

// ─── Transaction Ledger (unbounded) ───
// Subcollection: courses/{courseId}/studentMana/{uid}/transactions/{autoId}
// Source of truth for per-student mana history. The bounded `history` array
// on the parent doc stays as a cached "last-tx" preview for row displays —
// never trust it as authoritative.

export async function logManaTransaction(courseId, uid, entry) {
  try {
    const colRef = collection(db, "courses", courseId, "studentMana", uid, "transactions");
    await addDoc(colRef, {
      type: entry.type,
      amount: entry.amount,
      reason: entry.reason || "",
      powerId: entry.powerId || null,
      balanceAfter: entry.balanceAfter ?? null,
      timestamp: entry.timestamp || new Date().toISOString(),
      createdAt: serverTimestamp(),
    });
  } catch (e) {
    console.warn("[mana] logManaTransaction failed:", e?.message);
  }
}

export async function getStudentManaTransactions(courseId, uid) {
  const colRef = collection(db, "courses", courseId, "studentMana", uid, "transactions");
  // Prefer ordering by timestamp string (ISO, sortable). createdAt may be null
  // for backfilled rows, so we don't orderBy it.
  const snap = await getDocs(query(colRef, orderBy("timestamp", "desc")));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function awardStudentMana(courseId, uid, amount, reason) {
  const data = await getStudentMana(courseId, uid);
  data.balance += amount;
  data.lifetimeEarned += amount;
  const lvl = getLevel(data.lifetimeEarned);
  data.level = lvl.label;
  const timestamp = new Date().toISOString();
  data.history = [
    { type: "earn", amount, reason, timestamp },
    ...(data.history || []).slice(0, 49),
  ];
  const ref = doc(db, "courses", courseId, "studentMana", uid);
  await setDoc(ref, data);
  await logManaTransaction(courseId, uid, {
    type: "earn", amount, reason, timestamp, balanceAfter: data.balance,
  });

  // Send notification to student
  try {
    await createNotification(uid, {
      type: "mana_received",
      title: `+${amount} Mana`,
      body: reason,
      link: `/my-mana/${courseId}`,
      courseId,
    });
  } catch (e) { /* notification failure shouldn't block mana award */ }

  return data;
}

export async function spendStudentMana(courseId, uid, powerId) {
  const poolState = await getManaState(courseId);
  const power = (poolState.powers || []).find((p) => p.id === powerId);
  if (!power) throw new Error("Power not found");

  const data = await getStudentMana(courseId, uid);
  if (data.balance < power.cost) throw new Error("Not enough mana");

  data.balance -= power.cost;
  const timestamp = new Date().toISOString();
  const reason = `Redeemed: ${power.name}`;
  data.history = [
    { type: "spend", amount: power.cost, reason, powerId, timestamp },
    ...(data.history || []).slice(0, 49),
  ];
  const ref = doc(db, "courses", courseId, "studentMana", uid);
  await setDoc(ref, data);
  await logManaTransaction(courseId, uid, {
    type: "spend", amount: power.cost, reason, powerId, timestamp,
    balanceAfter: data.balance,
  });
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

// ─── Charge Student Mana (strict — throws on insufficient balance) ───
// Use for variable-amount student-initiated charges (custom 3D print quotes,
// lesson-level grade bonuses, classwork passes). Atomic via Firestore
// transaction so concurrent clicks/tabs can't double-spend.
export async function chargeStudentMana(courseId, uid, amount, reason) {
  const ref = doc(db, "courses", courseId, "studentMana", uid);
  const result = await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    const current = snap.exists() ? snap.data() : { balance: 0, lifetimeEarned: 0, history: [] };
    const balance = current.balance || 0;
    if (balance < amount) {
      const err = new Error(`Insufficient mana balance — you need ${amount} ✦ but only have ${balance} ✦.`);
      err.code = "INSUFFICIENT_MANA";
      throw err;
    }
    const newBalance = balance - amount;
    const timestamp = new Date().toISOString();
    const entry = { type: "loss", amount, reason, timestamp };
    tx.set(ref, {
      ...current,
      balance: newBalance,
      history: [entry, ...(current.history || []).slice(0, 49)],
      level: getLevel(current.lifetimeEarned || 0).label,
    });
    return { newBalance, timestamp };
  });
  await logManaTransaction(courseId, uid, {
    type: "loss", amount, reason, timestamp: result.timestamp, balanceAfter: result.newBalance,
  });
  return { newBalance: result.newBalance, actualLoss: amount };
}

// ─── Deduct Student Mana (lenient — clamps to zero) ───
// Use for teacher-initiated deductions (behavior penalties) where the action
// must land even if the student is already at 0. Never use for student-initiated
// spending — use spendStudentMana instead.
export async function deductStudentMana(courseId, uid, amount, reason) {
  const ref = doc(db, "courses", courseId, "studentMana", uid);
  const snap = await getDoc(ref);
  const current = snap.exists() ? snap.data() : { balance: 0, lifetimeEarned: 0, history: [] };
  const newBalance = Math.max(0, current.balance - amount);
  const actualLoss = current.balance - newBalance;
  const timestamp = new Date().toISOString();
  const entry = { type: "loss", amount: actualLoss, reason, timestamp };
  await setDoc(ref, {
    ...current,
    balance: newBalance,
    history: [entry, ...(current.history || []).slice(0, 49)],
    level: getLevel(current.lifetimeEarned || 0).label,
  });
  await logManaTransaction(courseId, uid, {
    type: "loss", amount: actualLoss, reason, timestamp, balanceAfter: newBalance,
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

// ─── Fair Rotation Mage Selection ───

/**
 * Get all enrolled student UIDs for a course, excluding test students.
 * Returns { uid: displayName } map and { uid: gender } map.
 */
export async function getEnrolledStudents(courseId) {
  const names = {};
  const genders = {};
  try {
    const enrollSnap = await getDocs(collection(db, "enrollments"));
    const usersSnap = await getDocs(collection(db, "users"));
    const usersMap = {};
    usersSnap.forEach((d) => { usersMap[d.id] = d.data(); });
    enrollSnap.forEach((d) => {
      const data = d.data();
      if (data.courseId !== courseId || data.isTestStudent) return;
      const uid = data.uid || data.studentUid;
      if (!uid) return;
      const user = usersMap[uid];
      // Skip test student by email
      if (user?.email === "lmccart4@gmail.com") return;
      if (user?.isTestStudent) return;
      names[uid] = user?.displayName || data.name || data.email || "Unknown";
      if (user?.gender) genders[uid] = user.gender;
    });
    usersSnap.forEach((d) => {
      const data = d.data();
      if (data.role === "teacher") return;
      if (data.email === "lmccart4@gmail.com") return;
      if (data.isTestStudent) return;
      const enrolled = data.enrolledCourses || {};
      if (enrolled[courseId] && !names[d.id]) {
        names[d.id] = data.displayName || data.email || d.id;
      }
      if (enrolled[courseId] && data.gender) {
        genders[d.id] = data.gender;
      }
    });
  } catch (err) {
    console.warn("getEnrolledStudents failed:", err);
  }
  return { names, genders };
}

/**
 * Weighted random selection from eligible pool.
 * Students with lower mana balance get higher weight.
 */
function weightedRandomSelect(eligibleUids, studentManaMap) {
  if (eligibleUids.length === 0) return null;
  if (eligibleUids.length === 1) return eligibleUids[0];

  // Find max balance among eligible
  let maxBalance = 0;
  for (const uid of eligibleUids) {
    const bal = (studentManaMap[uid]?.balance) || 0;
    if (bal > maxBalance) maxBalance = bal;
  }

  // Build weights: weight = max(1, maxBalance - studentBalance + 1)
  const weights = eligibleUids.map(uid => {
    const bal = (studentManaMap[uid]?.balance) || 0;
    return Math.max(1, maxBalance - bal + 1);
  });

  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let rand = Math.random() * totalWeight;
  for (let i = 0; i < eligibleUids.length; i++) {
    rand -= weights[i];
    if (rand <= 0) return eligibleUids[i];
  }
  return eligibleUids[eligibleUids.length - 1];
}

/**
 * Auto-select a new mage for today using fair rotation.
 * Checks if yesterday's mage used any budget and updates history accordingly.
 * Returns the selected UID or null if no eligible students.
 */
export async function autoSelectMage(courseId) {
  const pool = await getManaState(courseId);
  const today = new Date().toISOString().split("T")[0];

  // Already have a mage for today
  if (pool.mageDate === today && pool.mageStudentId) {
    return pool.mageStudentId;
  }

  // Check if previous mage used any budget — if so, add to history
  let mageHistory = pool.mageHistory || [];
  let mageCycleNumber = pool.mageCycleNumber || 1;

  if (pool.mageStudentId && pool.mageDate && pool.mageDate !== today) {
    const prevBudgetUsed = pool.mageBudgetUsed || 0;
    if (prevBudgetUsed > 0 && !mageHistory.includes(pool.mageStudentId)) {
      mageHistory = [...mageHistory, pool.mageStudentId];
    }
    // If budget was 0, skip — their turn doesn't count
  }

  // Get enrolled students (excludes test students)
  const { names, genders } = await getEnrolledStudents(courseId);
  const allUids = Object.keys(names);
  if (allUids.length === 0) return null;

  // Get student mana balances for weighting
  const studentManaMap = await getStudentManaForClass(courseId);

  // Build eligible pool = all enrolled MINUS those in mageHistory
  let eligible = allUids.filter(uid => !mageHistory.includes(uid));

  // If eligible pool is empty, reset cycle
  if (eligible.length === 0) {
    mageHistory = [];
    mageCycleNumber += 1;
    eligible = allUids;
  }

  // Weighted random selection
  const selectedUid = weightedRandomSelect(eligible, studentManaMap);
  if (!selectedUid) return null;

  // Save to pool doc
  const updated = {
    ...pool,
    mageStudentId: selectedUid,
    mageStudentName: names[selectedUid] || "Unknown",
    mageDate: today,
    mageBudgetUsed: 0,
    magePerStudent: {},
    mageHistory,
    mageCycleNumber,
  };
  await saveManaState(courseId, undefined, updated);

  return { uid: selectedUid, name: names[selectedUid], gender: genders[selectedUid] || 'M', poolState: updated };
}

/**
 * Mark mage as absent — pick a new mage without adding current to history.
 * Resets budget for the new mage.
 */
export async function markMageAbsent(courseId) {
  const pool = await getManaState(courseId);
  const { names, genders } = await getEnrolledStudents(courseId);
  const allUids = Object.keys(names);
  if (allUids.length === 0) return null;

  const mageHistory = pool.mageHistory || [];
  const mageCycleNumber = pool.mageCycleNumber || 1;
  const studentManaMap = await getStudentManaForClass(courseId);

  // Current mage is NOT added to history (absent = turn preserved)
  const currentMageId = pool.mageStudentId;

  // Build eligible pool excluding history AND the absent mage
  let eligible = allUids.filter(uid => !mageHistory.includes(uid) && uid !== currentMageId);
  if (eligible.length === 0) {
    eligible = allUids.filter(uid => uid !== currentMageId);
  }
  if (eligible.length === 0) return null;

  const selectedUid = weightedRandomSelect(eligible, studentManaMap);
  if (!selectedUid) return null;

  const today = new Date().toISOString().split("T")[0];
  const updated = {
    ...pool,
    mageStudentId: selectedUid,
    mageStudentName: names[selectedUid] || "Unknown",
    mageDate: today,
    mageBudgetUsed: 0,
    magePerStudent: {},
    mageHistory,
    mageCycleNumber,
  };
  await saveManaState(courseId, undefined, updated);

  return { uid: selectedUid, name: names[selectedUid], gender: genders[selectedUid] || 'M', poolState: updated };
}

// ─── Donation: student-to-student mana transfer ───
// Calls the donateMana Cloud Function. Returns { success, newSenderBalance }
// on success, or throws an Error with the human-readable message from the
// function's HttpsError (FirebaseError.message preserves it).
export async function donateMana(courseId, recipientUid, amount) {
  const fn = httpsCallable(getFunctions(), "donateMana");
  const result = await fn({ courseId, recipientUid, amount });
  return result.data;
}
