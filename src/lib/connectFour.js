// src/lib/connectFour.js
// Firestore operations for the Connect Four game block.
// Games live at courses/{courseId}/connectFourGames/{gameId}

import {
  collection, doc, addDoc, getDoc, getDocs, updateDoc,
  query, where, orderBy, limit, onSnapshot,
  runTransaction, serverTimestamp, Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { awardXP } from "./gamification";
import { createNotification } from "./notifications";
import { AI_BOT_UID, AI_BOT_NAME } from "./connectFourAI";
export { AI_BOT_UID };

const ROWS = 6;
const COLS = 7;

// ─── Helper: create empty board (flat array of 42 zeros) ───
function emptyBoard() {
  return new Array(ROWS * COLS).fill(0);
}

// ─── Create a challenge ───
export async function createChallenge({
  courseId, blockId, lessonId,
  challengerUid, challengerName,
  challengeType = "open",       // "open" | "direct"
  targetOpponentUid = null,
  targetOpponentName = null,
}) {
  const firstTurn = null; // set on accept
  const gameRef = await addDoc(collection(db, "courses", courseId, "connectFourGames"), {
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
    board: emptyBoard(),
    currentTurn: firstTurn,  // "challenger" | "opponent" — set on accept
    moves: [],
    winnerUid: null,
    winnerCells: null,
    isDraw: false,
    xpAwarded: false,
    questionsAsked: 0,
    questionsCorrect: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastActivityAt: serverTimestamp(),
  });

  // Send notification for direct challenges
  if (challengeType === "direct" && targetOpponentUid) {
    createNotification(targetOpponentUid, {
      type: "game_challenge",
      title: "🔴 Connect Four Challenge!",
      body: `${challengerName} challenged you to Connect Four!`,
      icon: "🔴",
      link: `/course/${courseId}/lesson/${lessonId}`,
      courseId,
    }).catch(() => {});
  }

  return gameRef.id;
}

// ─── Create an AI game (instant start, no waiting) ───
export async function createAIGame({
  courseId, blockId, lessonId,
  challengerUid, challengerName,
}) {
  const firstTurn = Math.random() < 0.5 ? "challenger" : "opponent";

  const gameRef = await addDoc(collection(db, "courses", courseId, "connectFourGames"), {
    blockId,
    lessonId,
    status: "active",
    challengeType: "ai",
    challengerUid,
    challengerName,
    opponentUid: AI_BOT_UID,
    opponentName: AI_BOT_NAME,
    targetOpponentUid: null,
    targetOpponentName: null,
    board: emptyBoard(),
    currentTurn: firstTurn,
    moves: [],
    winnerUid: null,
    winnerCells: null,
    isDraw: false,
    xpAwarded: false,
    questionsAsked: 0,
    questionsCorrect: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastActivityAt: serverTimestamp(),
  });

  return gameRef.id;
}

// ─── Accept a challenge ───
export async function acceptChallenge({ courseId, gameId, opponentUid, opponentName }) {
  const gameRef = doc(db, "courses", courseId, "connectFourGames", gameId);
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(gameRef);
    if (!snap.exists()) throw new Error("Game not found");
    const game = snap.data();
    if (game.status !== "waiting") throw new Error("Game is no longer waiting");
    if (game.challengerUid === opponentUid) throw new Error("Cannot accept your own challenge");
    if (game.challengeType === "direct" && game.targetOpponentUid !== opponentUid) {
      throw new Error("This challenge is for someone else");
    }

    const firstTurn = Math.random() < 0.5 ? "challenger" : "opponent";

    tx.update(gameRef, {
      opponentUid,
      opponentName,
      currentTurn: firstTurn,
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
    title: "🔴 Challenge accepted!",
    body: `${opponentName} accepted your Connect Four challenge!`,
    icon: "🔴",
    link: `/course/${courseId}/lesson/${game.lessonId}`,
    courseId,
  }).catch(() => {});
}

// ─── Cancel a waiting challenge ───
export async function cancelChallenge(courseId, gameId) {
  const gameRef = doc(db, "courses", courseId, "connectFourGames", gameId);
  await updateDoc(gameRef, { status: "cancelled", updatedAt: serverTimestamp() });
}

// ─── Decline a direct challenge ───
export async function declineChallenge(courseId, gameId, declinerName) {
  const gameRef = doc(db, "courses", courseId, "connectFourGames", gameId);
  const snap = await getDoc(gameRef);
  const game = snap.data();
  await updateDoc(gameRef, { status: "declined", updatedAt: serverTimestamp() });

  // Notify challenger
  createNotification(game.challengerUid, {
    type: "game_challenge",
    title: "🔴 Challenge declined",
    body: `${declinerName} declined your Connect Four challenge.`,
    icon: "🔴",
    link: `/course/${courseId}/lesson/${game.lessonId}`,
    courseId,
  }).catch(() => {});
}

// ─── Make a move (drop piece into column) ───
// Called after a player answers the energy question correctly.
// If answeredCorrectly is false, the turn is skipped (no piece placed).
export async function makeMove({ courseId, gameId, playerUid, column, answeredCorrectly }) {
  const gameRef = doc(db, "courses", courseId, "connectFourGames", gameId);

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
    if (game.currentTurn !== playerRole) throw new Error("It's not your turn");

    const board = [...game.board];
    const moves = [...game.moves];
    const newTurn = playerRole === "challenger" ? "opponent" : "challenger";

    if (!answeredCorrectly) {
      // Wrong answer — turn skipped, no piece placed
      moves.push({
        playerUid,
        column,
        row: -1,
        answeredCorrectly: false,
        timestamp: Timestamp.now(),
      });
      tx.update(gameRef, {
        moves,
        currentTurn: newTurn,
        questionsAsked: (game.questionsAsked || 0) + 1,
        updatedAt: serverTimestamp(),
        lastActivityAt: serverTimestamp(),
      });
      result = { placed: false, gameOver: false };
      return;
    }

    // Find lowest empty row in column
    const playerValue = isChallenger ? 1 : 2;
    let targetRow = -1;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (board[r * COLS + column] === 0) {
        targetRow = r;
        break;
      }
    }
    if (targetRow === -1) throw new Error("Column is full");

    board[targetRow * COLS + column] = playerValue;

    moves.push({
      playerUid,
      column,
      row: targetRow,
      answeredCorrectly: true,
      timestamp: Timestamp.now(),
    });

    // Check for win
    const winCells = checkWin(board, targetRow, column, playerValue);
    // Check for draw
    const isDraw = !winCells && board.every((cell) => cell !== 0);

    if (winCells || isDraw) {
      const winnerUid = winCells ? playerUid : null;
      // Flatten winCells to cell indices (Firestore doesn't support nested arrays)
      const winCellIndices = winCells ? winCells.map(([r, c]) => r * COLS + c) : null;
      tx.update(gameRef, {
        board,
        moves,
        currentTurn: null,
        status: "finished",
        winnerUid,
        winnerCells: winCellIndices,
        isDraw,
        questionsAsked: (game.questionsAsked || 0) + 1,
        questionsCorrect: (game.questionsCorrect || 0) + 1,
        updatedAt: serverTimestamp(),
        lastActivityAt: serverTimestamp(),
      });
      result = {
        placed: true,
        gameOver: true,
        winnerUid,
        isDraw,
        winCells,
        challengerUid: game.challengerUid,
        opponentUid: game.opponentUid,
        challengerName: game.challengerName,
        opponentName: game.opponentName,
      };
    } else {
      tx.update(gameRef, {
        board,
        moves,
        currentTurn: newTurn,
        questionsAsked: (game.questionsAsked || 0) + 1,
        questionsCorrect: (game.questionsCorrect || 0) + 1,
        updatedAt: serverTimestamp(),
        lastActivityAt: serverTimestamp(),
      });
      result = { placed: true, gameOver: false };
    }
  });

  // Award XP outside transaction if game ended
  if (result?.gameOver) {
    try {
      const snap = await getDoc(gameRef);
      const game = snap.data();
      if (!game.xpAwarded) {
        if (result.isDraw) {
          // Both get draw XP
          await awardXP(game.challengerUid, 50, "connect_four_draw", courseId);
          if (game.opponentUid !== AI_BOT_UID) {
            await awardXP(game.opponentUid, 50, "connect_four_draw", courseId);
          }
        } else {
          const loserUid = result.winnerUid === game.challengerUid ? game.opponentUid : game.challengerUid;
          await awardXP(result.winnerUid, 100, "connect_four_win", courseId);
          if (loserUid !== AI_BOT_UID) {
            await awardXP(loserUid, 30, "connect_four_loss", courseId);
          }
        }
        await updateDoc(gameRef, { xpAwarded: true });
      }

      // Notifications
      if (result.isDraw) {
        const notify = (uid, otherName) => {
          if (uid === AI_BOT_UID) return;
          createNotification(uid, {
            type: "game_challenge",
            title: "🔴 Draw!",
            body: `Your Connect Four game vs ${otherName} ended in a draw. +50 XP`,
            icon: "🤝",
            link: `/course/${courseId}/lesson/${game.lessonId}`,
            courseId,
          }).catch(() => {});
        };
        notify(game.challengerUid, game.opponentName);
        notify(game.opponentUid, game.challengerName);
      } else {
        const winnerName = result.winnerUid === game.challengerUid ? game.challengerName : game.opponentName;
        const loserUid = result.winnerUid === game.challengerUid ? game.opponentUid : game.challengerUid;
        const loserName = result.winnerUid === game.challengerUid ? game.opponentName : game.challengerName;

        if (result.winnerUid !== AI_BOT_UID) {
          createNotification(result.winnerUid, {
            type: "game_challenge",
            title: "🔴 You won!",
            body: `You beat ${loserName} at Connect Four! +100 XP`,
            icon: "🏆",
            link: `/course/${courseId}/lesson/${game.lessonId}`,
            courseId,
          }).catch(() => {});
        }
        if (loserUid !== AI_BOT_UID) {
          createNotification(loserUid, {
            type: "game_challenge",
            title: "🔴 Game over",
            body: `${winnerName} won at Connect Four. +30 XP for playing`,
            icon: "🔴",
            link: `/course/${courseId}/lesson/${game.lessonId}`,
            courseId,
          }).catch(() => {});
        }
      }
    } catch (e) {
      console.error("Failed to award Connect Four XP:", e);
    }
  }

  return result;
}

// ─── Forfeit a game ───
export async function forfeitGame(courseId, gameId, playerUid) {
  const gameRef = doc(db, "courses", courseId, "connectFourGames", gameId);
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
    if (winnerUid !== AI_BOT_UID) {
      await awardXP(winnerUid, 100, "connect_four_win", courseId);
    }
    await awardXP(playerUid, 30, "connect_four_loss", courseId);
    await updateDoc(gameRef, { xpAwarded: true });
  } catch (e) {
    console.error("Failed to award forfeit XP:", e);
  }
}

// ─── Subscribe to a game (real-time) ───
export function subscribeToGame(courseId, gameId, callback) {
  const gameRef = doc(db, "courses", courseId, "connectFourGames", gameId);
  return onSnapshot(gameRef, (snap) => {
    if (snap.exists()) {
      callback({ id: snap.id, ...snap.data() });
    }
  });
}

// ─── Get games for a specific block (for challenge board) ───
export function subscribeToBlockGames(courseId, blockId, callback, onError) {
  const q = query(
    collection(db, "courses", courseId, "connectFourGames"),
    where("blockId", "==", blockId),
    orderBy("createdAt", "desc"),
    limit(50)
  );
  return onSnapshot(q, (snap) => {
    const games = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(games);
  }, (error) => {
    console.error("Connect Four games listener error:", error);
    if (onError) onError(error);
  });
}

// ─── Win check (operates on flat board array) ───
function checkWin(board, row, col, player) {
  const dirs = [[0, 1], [1, 0], [1, 1], [1, -1]];
  for (const [dr, dc] of dirs) {
    let cells = [[row, col]];
    for (let i = 1; i < 4; i++) {
      const r = row + dr * i, c = col + dc * i;
      if (r < 0 || r >= ROWS || c < 0 || c >= COLS || board[r * COLS + c] !== player) break;
      cells.push([r, c]);
    }
    for (let i = 1; i < 4; i++) {
      const r = row - dr * i, c = col - dc * i;
      if (r < 0 || r >= ROWS || c < 0 || c >= COLS || board[r * COLS + c] !== player) break;
      cells.push([r, c]);
    }
    if (cells.length >= 4) return cells;
  }
  return null;
}
