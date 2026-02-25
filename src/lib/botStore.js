// src/lib/botStore.js
// Firestore helpers for the Build-a-Chatbot Workshop.
// 
// Data model:
//   botProjects/{projectId}
//     - ownerId: string (student's uid)
//     - courseId: string
//     - botName: string
//     - botDescription: string
//     - botAvatar: string (emoji)
//     - currentPhase: number (1-4)
//     - published: boolean
//     - publishedAt: Timestamp | null
//     - createdAt: Timestamp
//     - updatedAt: Timestamp
//     - phases: {
//         1: { nodes: [], edges: [] },          // Decision Tree
//         2: { rules: [] },                      // Keyword Matching
//         3: { intents: [], trainingData: [] },   // Intent Classification
//         4: { systemPrompt: "", temperature: 0.7 }  // LLM
//       }
//
//   botRatings/{projectId}/ratings/{raterId}
//     - raterId: string
//     - understanding: number (1-5)
//     - helpfulness: number (1-5)
//     - comment: string
//     - createdAt: Timestamp
//
//   botConversations/{projectId}/sessions/{sessionId}
//     - testerId: string
//     - testerName: string
//     - phase: number
//     - messages: [{ role, content, timestamp }]
//     - createdAt: Timestamp

import {
  collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc,
  query, where, orderBy, serverTimestamp, onSnapshot, addDoc, increment
} from "firebase/firestore";

// ─── Bot Projects ───────────────────────────────────────────────────────────

export async function createBotProject(db, { ownerId, courseId, botName, botAvatar, ownerName }) {
  const ref = doc(collection(db, "botProjects"));
  const project = {
    ownerId,
    courseId,
    ownerName: ownerName || "Anonymous",
    botName: botName || "My Chatbot",
    botDescription: "",
    botAvatar: botAvatar || "🤖",
    currentPhase: 1,
    published: false,
    publishedAt: null,
    stumpCount: 0,
    testCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    phases: {
      1: { nodes: getDefaultNodes(), edges: getDefaultEdges() },
      2: { rules: getDefaultRules() },
      3: { intents: getDefaultIntents(), trainingData: [], fallbackResponse: "I'm not sure what you mean. Can you try rephrasing?", confidenceThreshold: 0.65, trainedAt: null },
      4: { systemPrompt: "", temperature: 0.7 },
    },
  };
  await setDoc(ref, project);
  return { id: ref.id, ...project };
}

export async function getBotProject(db, projectId) {
  const snap = await getDoc(doc(db, "botProjects", projectId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function getStudentBotProjects(db, ownerId, courseId) {
  const q = query(
    collection(db, "botProjects"),
    where("ownerId", "==", ownerId),
    where("courseId", "==", courseId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function updateBotProject(db, projectId, updates) {
  await updateDoc(doc(db, "botProjects", projectId), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

export async function updatePhaseConfig(db, projectId, phase, config) {
  await updateDoc(doc(db, "botProjects", projectId), {
    [`phases.${phase}`]: config,
    updatedAt: serverTimestamp(),
  });
}

export async function publishBot(db, projectId) {
  await updateDoc(doc(db, "botProjects", projectId), {
    published: true,
    publishedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function unpublishBot(db, projectId) {
  await updateDoc(doc(db, "botProjects", projectId), {
    published: false,
    publishedAt: null,
    updatedAt: serverTimestamp(),
  });
}

// ─── Published Bots (Bot Arcade) ────────────────────────────────────────────

export async function getPublishedBots(db, courseId) {
  const q = query(
    collection(db, "botProjects"),
    where("courseId", "==", courseId),
    where("published", "==", true),
    orderBy("publishedAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export function subscribeToPublishedBots(db, courseId, callback) {
  const q = query(
    collection(db, "botProjects"),
    where("courseId", "==", courseId),
    where("published", "==", true)
  );
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}

// ─── Ratings ────────────────────────────────────────────────────────────────

export async function rateBot(db, projectId, { raterId, understanding, helpfulness, comment }) {
  const ref = doc(db, "botRatings", projectId, "ratings", raterId);
  await setDoc(ref, {
    raterId,
    understanding,
    helpfulness,
    comment: comment || "",
    createdAt: serverTimestamp(),
  });
}

export async function getBotRatings(db, projectId) {
  const snap = await getDocs(collection(db, "botRatings", projectId, "ratings"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ─── Conversation Logs ──────────────────────────────────────────────────────

export async function saveConversationLog(db, projectId, { testerId, testerName, phase, messages }) {
  const ref = await addDoc(collection(db, "botConversations", projectId, "sessions"), {
    testerId,
    testerName,
    phase,
    messages,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getConversationLogs(db, projectId) {
  const q = query(
    collection(db, "botConversations", projectId, "sessions"),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}


// ─── Bot Arcade Stats ──────────────────────────────────────────────────────

export async function incrementBotStumps(db, projectId, count) {
  await updateDoc(doc(db, "botProjects", projectId), {
    stumpCount: increment(count),
    updatedAt: serverTimestamp(),
  });
}

export async function incrementBotTestCount(db, projectId) {
  await updateDoc(doc(db, "botProjects", projectId), {
    testCount: increment(1),
    updatedAt: serverTimestamp(),
  });
}

export async function incrementArcadeStat(db, courseId, uid, field, amount = 1) {
  const ref = doc(db, "courses", courseId, "botArcadeStats", uid);
  await setDoc(ref, { [field]: increment(amount), updatedAt: serverTimestamp() }, { merge: true });
}

export async function getArcadeStats(db, courseId) {
  const snap = await getDocs(collection(db, "courses", courseId, "botArcadeStats"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}


// ─── Teacher Dashboard (Course-wide queries) ────────────────────────────────

export async function getCourseBotProjects(db, courseId) {
  const q = query(
    collection(db, "botProjects"),
    where("courseId", "==", courseId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getCourseBotReflections(db, courseId) {
  const snap = await getDocs(collection(db, "courses", courseId, "botReflections"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function saveBotReflection(db, courseId, { studentId, studentName, phase, projectId, response, valid, skipped }) {
  const ref = doc(db, "courses", courseId, "botReflections", `${studentId}_phase${phase}`);
  await setDoc(ref, {
    studentId,
    studentName: studentName || "Anonymous",
    phase,
    projectId: projectId || "",
    response: response || "(skipped)",
    valid: valid ?? false,
    skipped: skipped ?? false,
    savedAt: serverTimestamp(),
  });
}

export async function getBotReflection(db, courseId, studentId, phase) {
  const ref = doc(db, "courses", courseId, "botReflections", `${studentId}_phase${phase}`);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}


// ─── Default Starter Data ───────────────────────────────────────────────────

function getDefaultNodes() {
  return [
    {
      id: "start",
      type: "start",
      data: { message: "Hello! I'm your chatbot. How can I help?" },
      position: { x: 250, y: 50 },
    },
    {
      id: "node-greeting",
      type: "response",
      data: { message: "Nice to meet you! What would you like to talk about?" },
      position: { x: 250, y: 200 },
    },
    {
      id: "node-fallback",
      type: "response",
      data: { message: "I'm not sure about that. Can you try asking something else?" },
      position: { x: 500, y: 200 },
    },
  ];
}

function getDefaultEdges() {
  return [
    {
      id: "edge-1",
      source: "start",
      target: "node-greeting",
      data: { condition: "hi,hello,hey" },
      label: "hi, hello, hey",
    },
    {
      id: "edge-2",
      source: "start",
      target: "node-fallback",
      data: { condition: "default" },
      label: "default",
    },
  ];
}

function getDefaultIntents() {
  return [
    {
      id: "intent-greeting",
      name: "greeting",
      response: "Hello! How can I help you today?",
    },
    {
      id: "intent-farewell",
      name: "farewell",
      response: "Goodbye! Have a great day!",
    },
  ];
}

function getDefaultRules() {
  return [
    {
      id: "rule-1",
      keywords: ["hello", "hi", "hey", "greetings"],
      response: "Hey there! How can I help you today?",
      matchMode: "any",
      priority: 1,
      isFallback: false,
    },
    {
      id: "rule-2",
      keywords: ["bye", "goodbye", "see you", "later"],
      response: "Goodbye! Have a great day! 👋",
      matchMode: "any",
      priority: 1,
      isFallback: false,
    },
    {
      id: "rule-fallback",
      keywords: [],
      response: "Hmm, I don't know how to respond to that yet. Try teaching me more keywords!",
      matchMode: "any",
      priority: 0,
      isFallback: true,
    },
  ];
}
