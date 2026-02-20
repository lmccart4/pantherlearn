// src/lib/guessWho.js
// Firestore operations for the Guess Who? game block.
// Games live at courses/{courseId}/guessWhoGames/{gameId}

import {
  collection, doc, addDoc, getDoc, getDocs, updateDoc,
  query, where, orderBy, limit, onSnapshot,
  runTransaction, serverTimestamp, Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { awardXP } from "./gamification";
import { createNotification } from "./notifications";

// ─── Default Characters (40 AI-generated faces) ───
// Images are static assets at /games/guess-who/face-NN.jpg (200×200)
export const DEFAULT_CHARACTERS = [
  { id: "c00", name: "Marcus", imageUrl: "/games/guess-who/face-00.jpg" },
  { id: "c01", name: "Elena", imageUrl: "/games/guess-who/face-01.jpg" },
  { id: "c02", name: "Jun", imageUrl: "/games/guess-who/face-02.jpg" },
  { id: "c03", name: "Kenji", imageUrl: "/games/guess-who/face-03.jpg" },
  { id: "c04", name: "Amara", imageUrl: "/games/guess-who/face-04.jpg" },
  { id: "c05", name: "Devon", imageUrl: "/games/guess-who/face-05.jpg" },
  { id: "c06", name: "Linda", imageUrl: "/games/guess-who/face-06.jpg" },
  { id: "c07", name: "Sofia", imageUrl: "/games/guess-who/face-07.jpg" },
  { id: "c08", name: "Ruby", imageUrl: "/games/guess-who/face-08.jpg" },
  { id: "c09", name: "Claire", imageUrl: "/games/guess-who/face-09.jpg" },
  { id: "c10", name: "Maya", imageUrl: "/games/guess-who/face-10.jpg" },
  { id: "c11", name: "Priya", imageUrl: "/games/guess-who/face-11.jpg" },
  { id: "c12", name: "Victor", imageUrl: "/games/guess-who/face-12.jpg" },
  { id: "c13", name: "Helen", imageUrl: "/games/guess-who/face-13.jpg" },
  { id: "c14", name: "Aisha", imageUrl: "/games/guess-who/face-14.jpg" },
  { id: "c15", name: "Layla", imageUrl: "/games/guess-who/face-15.jpg" },
  { id: "c16", name: "Nadia", imageUrl: "/games/guess-who/face-16.jpg" },
  { id: "c17", name: "Rosa", imageUrl: "/games/guess-who/face-17.jpg" },
  { id: "c18", name: "Grace", imageUrl: "/games/guess-who/face-18.jpg" },
  { id: "c19", name: "Darius", imageUrl: "/games/guess-who/face-19.jpg" },
  { id: "c20", name: "Tyrell", imageUrl: "/games/guess-who/face-20.jpg" },
  { id: "c21", name: "Ava", imageUrl: "/games/guess-who/face-21.jpg" },
  { id: "c22", name: "Jordan", imageUrl: "/games/guess-who/face-22.jpg" },
  { id: "c23", name: "Miguel", imageUrl: "/games/guess-who/face-23.jpg" },
  { id: "c24", name: "Zara", imageUrl: "/games/guess-who/face-24.jpg" },
  { id: "c25", name: "Oliver", imageUrl: "/games/guess-who/face-25.jpg" },
  { id: "c26", name: "Jasmine", imageUrl: "/games/guess-who/face-26.jpg" },
  { id: "c27", name: "Carlos", imageUrl: "/games/guess-who/face-27.jpg" },
  { id: "c28", name: "Curly", imageUrl: "/games/guess-who/face-28.jpg" },
  { id: "c29", name: "Sasha", imageUrl: "/games/guess-who/face-29.jpg" },
  { id: "c30", name: "Bianca", imageUrl: "/games/guess-who/face-30.jpg" },
  { id: "c31", name: "Nathan", imageUrl: "/games/guess-who/face-31.jpg" },
  { id: "c32", name: "Tamara", imageUrl: "/games/guess-who/face-32.jpg" },
  { id: "c33", name: "Derek", imageUrl: "/games/guess-who/face-33.jpg" },
  { id: "c34", name: "Leah", imageUrl: "/games/guess-who/face-34.jpg" },
  { id: "c35", name: "Ahmed", imageUrl: "/games/guess-who/face-35.jpg" },
  { id: "c36", name: "Ryan", imageUrl: "/games/guess-who/face-36.jpg" },
  { id: "c37", name: "Walter", imageUrl: "/games/guess-who/face-37.jpg" },
  { id: "c38", name: "Mei", imageUrl: "/games/guess-who/face-38.jpg" },
  { id: "c39", name: "Corinne", imageUrl: "/games/guess-who/face-39.jpg" },
];

// ─── Helper: pick a random character ID ───
function pickRandom(characters, excludeId) {
  const pool = excludeId
    ? characters.filter((c) => c.id !== excludeId)
    : characters;
  return pool[Math.floor(Math.random() * pool.length)].id;
}

// ─── Create a challenge ───
export async function createChallenge({
  courseId, blockId, lessonId,
  challengerUid, challengerName,
  characters,
  challengeType = "open",       // "open" | "direct"
  targetOpponentUid = null,
  targetOpponentName = null,
  xpForWin = 50,
  xpForPlay = 10,
}) {
  const challengerSecretId = pickRandom(characters);
  const gameRef = await addDoc(collection(db, "courses", courseId, "guessWhoGames"), {
    blockId,
    lessonId,
    status: "waiting",
    challengeType,
    challengerUid,
    challengerName,
    opponentUid: null,
    opponentName: null,
    targetOpponentUid,
    targetOpponentName,
    characters,
    challengerSecretId,
    opponentSecretId: null,
    turn: null,
    challengerEliminated: [],
    opponentEliminated: [],
    moves: [],
    winnerUid: null,
    xpAwarded: false,
    xpForWin,
    xpForPlay,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastActivityAt: serverTimestamp(),
  });

  // Send notification for direct challenges
  if (challengeType === "direct" && targetOpponentUid) {
    createNotification(targetOpponentUid, {
      type: "game_challenge",
      title: "🎭 Guess Who? Challenge!",
      body: `${challengerName} challenged you to Guess Who!`,
      icon: "🎭",
      link: `/course/${courseId}/lesson/${lessonId}`,
      courseId,
    }).catch(() => {});
  }

  return gameRef.id;
}

// ─── Accept a challenge ───
export async function acceptChallenge({ courseId, gameId, opponentUid, opponentName }) {
  const gameRef = doc(db, "courses", courseId, "guessWhoGames", gameId);
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(gameRef);
    if (!snap.exists()) throw new Error("Game not found");
    const game = snap.data();
    if (game.status !== "waiting") throw new Error("Game is no longer waiting");
    if (game.challengerUid === opponentUid) throw new Error("Cannot accept your own challenge");
    if (game.challengeType === "direct" && game.targetOpponentUid !== opponentUid) {
      throw new Error("This challenge is for someone else");
    }

    const opponentSecretId = pickRandom(game.characters, game.challengerSecretId);
    const firstTurn = Math.random() < 0.5 ? "challenger" : "opponent";

    tx.update(gameRef, {
      opponentUid,
      opponentName,
      opponentSecretId,
      turn: firstTurn,
      status: "active",
      updatedAt: serverTimestamp(),
      lastActivityAt: serverTimestamp(),
    });
  });

  // Notify challenger
  const snap = await getDoc(gameRef);
  const game = snap.data();
  createNotification(game.challengerUid, {
    type: "game_challenge",
    title: "🎭 Challenge accepted!",
    body: `${opponentName} accepted your Guess Who? challenge!`,
    icon: "🎭",
    link: `/guess-who/${courseId}/${gameId}`,
    courseId,
  }).catch(() => {});
}

// ─── Cancel a waiting challenge ───
export async function cancelChallenge(courseId, gameId) {
  const gameRef = doc(db, "courses", courseId, "guessWhoGames", gameId);
  await updateDoc(gameRef, { status: "cancelled", updatedAt: serverTimestamp() });
}

// ─── Decline a direct challenge ───
export async function declineChallenge(courseId, gameId, declinerName) {
  const gameRef = doc(db, "courses", courseId, "guessWhoGames", gameId);
  const snap = await getDoc(gameRef);
  const game = snap.data();
  await updateDoc(gameRef, { status: "declined", updatedAt: serverTimestamp() });

  // Notify challenger
  createNotification(game.challengerUid, {
    type: "game_challenge",
    title: "🎭 Challenge declined",
    body: `${declinerName} declined your Guess Who? challenge.`,
    icon: "🎭",
    link: `/course/${courseId}/lesson/${game.lessonId}`,
    courseId,
  }).catch(() => {});
}

// ─── Ask a question (current player's turn) ───
export async function askQuestion(courseId, gameId, playerUid, questionText) {
  const gameRef = doc(db, "courses", courseId, "guessWhoGames", gameId);
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(gameRef);
    if (!snap.exists()) throw new Error("Game not found");
    const game = snap.data();
    if (game.status !== "active") throw new Error("Game is not active");

    // Determine if this player has the turn
    const isChallenger = game.challengerUid === playerUid;
    const isOpponent = game.opponentUid === playerUid;
    if (!isChallenger && !isOpponent) throw new Error("You are not a player in this game");
    const playerRole = isChallenger ? "challenger" : "opponent";
    if (game.turn !== playerRole) throw new Error("It's not your turn");

    // Last move must not be an unanswered question
    const lastMove = game.moves.length > 0 ? game.moves[game.moves.length - 1] : null;
    if (lastMove && lastMove.type === "question" && lastMove.answer === null) {
      throw new Error("Previous question hasn't been answered yet");
    }

    const moves = [...game.moves, {
      type: "question",
      playerUid,
      text: questionText,
      answer: null,
      timestamp: Timestamp.now(),
    }];

    tx.update(gameRef, {
      moves,
      updatedAt: serverTimestamp(),
      lastActivityAt: serverTimestamp(),
    });
    // Turn stays — waiting for opponent to answer
  });
}

// ─── Answer a question (opponent answers the asker's question) ───
export async function answerQuestion(courseId, gameId, playerUid, answer) {
  const gameRef = doc(db, "courses", courseId, "guessWhoGames", gameId);
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(gameRef);
    if (!snap.exists()) throw new Error("Game not found");
    const game = snap.data();
    if (game.status !== "active") throw new Error("Game is not active");

    const isChallenger = game.challengerUid === playerUid;
    const isOpponent = game.opponentUid === playerUid;
    if (!isChallenger && !isOpponent) throw new Error("You are not a player in this game");

    // The last move must be an unanswered question from the OTHER player
    const lastMove = game.moves.length > 0 ? game.moves[game.moves.length - 1] : null;
    if (!lastMove || lastMove.type !== "question" || lastMove.answer !== null) {
      throw new Error("No pending question to answer");
    }
    if (lastMove.playerUid === playerUid) {
      throw new Error("You cannot answer your own question");
    }

    const moves = [...game.moves];
    moves[moves.length - 1] = { ...moves[moves.length - 1], answer };

    // Switch turn to the OTHER player (the one who just asked the question,
    // so the asker can now see the answer and the turn moves to the other side)
    const newTurn = game.turn === "challenger" ? "opponent" : "challenger";

    tx.update(gameRef, {
      moves,
      turn: newTurn,
      updatedAt: serverTimestamp(),
      lastActivityAt: serverTimestamp(),
    });
  });
}

// ─── Toggle character elimination (not turn-gated) ───
export async function toggleEliminate(courseId, gameId, playerUid, characterId) {
  const gameRef = doc(db, "courses", courseId, "guessWhoGames", gameId);
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(gameRef);
    if (!snap.exists()) throw new Error("Game not found");
    const game = snap.data();
    if (game.status !== "active") return;

    const isChallenger = game.challengerUid === playerUid;
    const field = isChallenger ? "challengerEliminated" : "opponentEliminated";
    const current = game[field] || [];

    const updated = current.includes(characterId)
      ? current.filter((id) => id !== characterId)
      : [...current, characterId];

    tx.update(gameRef, {
      [field]: updated,
      updatedAt: serverTimestamp(),
    });
  });
}

// ─── Make a final guess ───
export async function makeGuess(courseId, gameId, playerUid, characterId) {
  const gameRef = doc(db, "courses", courseId, "guessWhoGames", gameId);

  let result = null;
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(gameRef);
    if (!snap.exists()) throw new Error("Game not found");
    const game = snap.data();
    if (game.status !== "active") throw new Error("Game is not active");

    const isChallenger = game.challengerUid === playerUid;
    const isOpponent = game.opponentUid === playerUid;
    if (!isChallenger && !isOpponent) throw new Error("You are not a player in this game");
    const playerRole = isChallenger ? "challenger" : "opponent";
    if (game.turn !== playerRole) throw new Error("It's not your turn");

    // Check if the last move is an unanswered question — can't guess while waiting
    const lastMove = game.moves.length > 0 ? game.moves[game.moves.length - 1] : null;
    if (lastMove && lastMove.type === "question" && lastMove.answer === null) {
      throw new Error("Wait for the answer before guessing");
    }

    // Check if the guess is correct
    const opponentSecret = isChallenger ? game.opponentSecretId : game.challengerSecretId;
    const correct = characterId === opponentSecret;

    const winnerUid = correct ? playerUid : (isChallenger ? game.opponentUid : game.challengerUid);
    const loserUid = correct ? (isChallenger ? game.opponentUid : game.challengerUid) : playerUid;

    const moves = [...game.moves, {
      type: "guess",
      playerUid,
      characterId,
      correct,
      timestamp: Timestamp.now(),
    }];

    tx.update(gameRef, {
      moves,
      status: "finished",
      winnerUid,
      updatedAt: serverTimestamp(),
      lastActivityAt: serverTimestamp(),
    });

    result = { correct, winnerUid, loserUid, xpForWin: game.xpForWin, xpForPlay: game.xpForPlay };
  });

  // Award XP outside transaction
  if (result && !result.xpAwarded) {
    try {
      await awardXP(result.winnerUid, result.xpForWin, "guess_who_win", courseId);
      await awardXP(result.loserUid, result.xpForPlay, "guess_who_play", courseId);
      await updateDoc(gameRef, { xpAwarded: true });
    } catch (e) {
      console.error("Failed to award Guess Who XP:", e);
    }

    // Notify both players
    const snap = await getDoc(gameRef);
    const game = snap.data();
    const winnerName = game.challengerUid === result.winnerUid ? game.challengerName : game.opponentName;
    const loserName = game.challengerUid === result.loserUid ? game.challengerName : game.opponentName;

    createNotification(result.winnerUid, {
      type: "game_challenge",
      title: "🎭 You won!",
      body: `You beat ${loserName} at Guess Who! +${result.xpForWin} XP`,
      icon: "🏆",
      link: `/guess-who/${courseId}/${gameId}`,
      courseId,
    }).catch(() => {});
    createNotification(result.loserUid, {
      type: "game_challenge",
      title: "🎭 Game over",
      body: `${winnerName} won at Guess Who. +${result.xpForPlay} XP for playing`,
      icon: "🎭",
      link: `/guess-who/${courseId}/${gameId}`,
      courseId,
    }).catch(() => {});
  }

  return result;
}

// ─── Forfeit a game ───
export async function forfeitGame(courseId, gameId, playerUid) {
  const gameRef = doc(db, "courses", courseId, "guessWhoGames", gameId);
  const snap = await getDoc(gameRef);
  if (!snap.exists()) throw new Error("Game not found");
  const game = snap.data();
  if (game.status !== "active") throw new Error("Game is not active");

  const isChallenger = game.challengerUid === playerUid;
  const winnerUid = isChallenger ? game.opponentUid : game.challengerUid;

  await updateDoc(gameRef, {
    status: "finished",
    winnerUid,
    updatedAt: serverTimestamp(),
    lastActivityAt: serverTimestamp(),
  });

  // Award XP
  try {
    await awardXP(winnerUid, game.xpForWin, "guess_who_win", courseId);
    await awardXP(playerUid, game.xpForPlay, "guess_who_play", courseId);
    await updateDoc(gameRef, { xpAwarded: true });
  } catch (e) {
    console.error("Failed to award forfeit XP:", e);
  }
}

// ─── Subscribe to a game (real-time) ───
export function subscribeToGame(courseId, gameId, callback) {
  const gameRef = doc(db, "courses", courseId, "guessWhoGames", gameId);
  return onSnapshot(gameRef, (snap) => {
    if (snap.exists()) {
      callback({ id: snap.id, ...snap.data() });
    }
  });
}

// ─── Get games for a specific block (for challenge board) ───
export function subscribeToBlockGames(courseId, blockId, callback, onError) {
  const q = query(
    collection(db, "courses", courseId, "guessWhoGames"),
    where("blockId", "==", blockId),
    orderBy("createdAt", "desc"),
    limit(50)
  );
  return onSnapshot(q, (snap) => {
    const games = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(games);
  }, (error) => {
    console.error("Guess Who games listener error:", error);
    if (onError) onError(error);
  });
}
