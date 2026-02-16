// src/lib/teams.jsx
// Team system for Panther Learn
// Data model: courses/{courseId}/teams/{teamId}
// Each team doc has: name, color, members[], teamXP, createdAt
// Team formation: teacher assigns manually OR opens student drafting

import { doc, getDoc, setDoc, getDocs, collection, query, where, deleteDoc, updateDoc, arrayUnion, arrayRemove, increment } from "firebase/firestore";
import { db } from "./firebase";

// ─── Default Team Colors ───
export const TEAM_COLORS = [
  { id: "red", label: "Crimson", hex: "#e74c3c", dim: "#e74c3c22" },
  { id: "blue", label: "Sapphire", hex: "#3498db", dim: "#3498db22" },
  { id: "green", label: "Emerald", hex: "#2ecc71", dim: "#2ecc7122" },
  { id: "purple", label: "Amethyst", hex: "#9b59b6", dim: "#9b59b622" },
  { id: "orange", label: "Amber", hex: "#f39c12", dim: "#f39c1222" },
  { id: "cyan", label: "Aqua", hex: "#00cec9", dim: "#00cec922" },
  { id: "pink", label: "Rose", hex: "#fd79a8", dim: "#fd79a822" },
  { id: "yellow", label: "Gold", hex: "#fdcb6e", dim: "#fdcb6e22" },
];

// ─── Team Config (stored on course doc) ───
export async function getTeamConfig(courseId) {
  try {
    const ref = doc(db, "courses", courseId, "settings", "teamConfig");
    const snap = await getDoc(ref);
    if (snap.exists()) return snap.data();
  } catch (e) {
    console.error("Error loading team config:", e);
  }
  return {
    enabled: false,
    teamSize: 4,
    draftMode: false, // false = teacher assigns, true = students can join
    xpSharePercent: 25, // % of individual XP that goes to team pool
  };
}

export async function saveTeamConfig(courseId, config) {
  const ref = doc(db, "courses", courseId, "settings", "teamConfig");
  await setDoc(ref, { ...config, lastUpdated: new Date() }, { merge: true });
}

// ─── CRUD Operations ───

export async function getTeams(courseId) {
  const snapshot = await getDocs(collection(db, "courses", courseId, "teams"));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getTeam(courseId, teamId) {
  const ref = doc(db, "courses", courseId, "teams", teamId);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function createTeam(courseId, { name, color, members = [], section = "" }) {
  const teamId = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") + "-" + Date.now().toString(36);
  const ref = doc(db, "courses", courseId, "teams", teamId);
  const teamData = {
    name,
    color: color || TEAM_COLORS[0].id,
    members, // array of { uid, displayName, email, photoURL }
    section, // period/section this team belongs to (empty = unassigned)
    teamXP: 0,
    createdAt: new Date(),
  };
  await setDoc(ref, teamData);
  return { id: teamId, ...teamData };
}

export async function updateTeam(courseId, teamId, updates) {
  const ref = doc(db, "courses", courseId, "teams", teamId);
  await updateDoc(ref, { ...updates, lastUpdated: new Date() });
}

export async function deleteTeam(courseId, teamId) {
  const ref = doc(db, "courses", courseId, "teams", teamId);
  await deleteDoc(ref);
}

// ─── Member Management ───

export async function addMemberToTeam(courseId, teamId, member) {
  // member: { uid, displayName, email, photoURL }
  const ref = doc(db, "courses", courseId, "teams", teamId);
  await updateDoc(ref, {
    members: arrayUnion(member),
  });
}

export async function removeMemberFromTeam(courseId, teamId, memberUid) {
  const team = await getTeam(courseId, teamId);
  if (!team) return;
  const updatedMembers = team.members.filter((m) => m.uid !== memberUid);
  await updateDoc(doc(db, "courses", courseId, "teams", teamId), {
    members: updatedMembers,
  });
}

// Move a student from one team to another
export async function moveMember(courseId, fromTeamId, toTeamId, memberUid) {
  const fromTeam = await getTeam(courseId, fromTeamId);
  if (!fromTeam) return;
  const member = fromTeam.members.find((m) => m.uid === memberUid);
  if (!member) return;
  await removeMemberFromTeam(courseId, fromTeamId, memberUid);
  await addMemberToTeam(courseId, toTeamId, member);
}

// ─── Team XP ───

export async function awardTeamXP(courseId, teamId, amount) {
  const ref = doc(db, "courses", courseId, "teams", teamId);
  await updateDoc(ref, {
    teamXP: increment(amount),
  });
}

// Called when a student earns individual XP — shares a percentage to their team
export async function shareXPToTeam(courseId, studentUid, individualXP) {
  const config = await getTeamConfig(courseId);
  if (!config.enabled || config.xpSharePercent <= 0) return null;

  // Find which team this student is on
  const teams = await getTeams(courseId);
  const studentTeam = teams.find((t) => t.members.some((m) => m.uid === studentUid));
  if (!studentTeam) return null;

  const teamBonus = Math.round(individualXP * (config.xpSharePercent / 100));
  if (teamBonus > 0) {
    await awardTeamXP(courseId, studentTeam.id, teamBonus);
  }

  return { teamId: studentTeam.id, teamName: studentTeam.name, teamBonus };
}

// ─── Find Student's Team ───

export async function getStudentTeam(courseId, studentUid) {
  const teams = await getTeams(courseId);
  return teams.find((t) => t.members.some((m) => m.uid === studentUid)) || null;
}

// ─── Team Leaderboard ───

export async function getTeamLeaderboard(courseId) {
  const teams = await getTeams(courseId);
  return teams
    .map((t) => ({
      id: t.id,
      name: t.name,
      color: t.color,
      teamXP: t.teamXP || 0,
      memberCount: t.members.length,
      members: t.members,
    }))
    .sort((a, b) => b.teamXP - a.teamXP);
}

// ─── Auto-generate balanced teams ───

export async function autoAssignTeams(courseId, students, teamSize = 4, teamNames = null, section = "") {
  // Shuffle students randomly
  const shuffled = [...students].sort(() => Math.random() - 0.5);

  const numTeams = Math.ceil(shuffled.length / teamSize);
  const defaultNames = ["Alpha", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot", "Golf", "Hotel", "India", "Juliet"];

  const teams = [];
  for (let i = 0; i < numTeams; i++) {
    const members = shuffled.slice(i * teamSize, (i + 1) * teamSize);
    const name = teamNames?.[i] || defaultNames[i] || `Team ${i + 1}`;
    const color = TEAM_COLORS[i % TEAM_COLORS.length].id;

    const team = await createTeam(courseId, { name, color, members, section });
    teams.push(team);
  }

  return teams;
}

// ─── Student Draft Mode ───

export async function joinTeam(courseId, teamId, student) {
  const config = await getTeamConfig(courseId);
  if (!config.draftMode) throw new Error("Draft mode is not enabled");

  const team = await getTeam(courseId, teamId);
  if (!team) throw new Error("Team not found");

  // Soft cap — students in draft mode still can't exceed, but teachers can via TeamManager
  if (team.members.length >= config.teamSize) throw new Error("Team is full — ask your teacher to add you");

  // Check student isn't already on a team
  const existingTeam = await getStudentTeam(courseId, student.uid);
  if (existingTeam) throw new Error("Already on a team");

  await addMemberToTeam(courseId, teamId, student);
}

export async function leaveTeam(courseId, studentUid) {
  const team = await getStudentTeam(courseId, studentUid);
  if (!team) throw new Error("Not on a team");
  await removeMemberFromTeam(courseId, team.id, studentUid);
}
