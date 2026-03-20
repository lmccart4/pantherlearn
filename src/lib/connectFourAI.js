// src/lib/connectFourAI.js
// AI opponent for Connect Four — heuristic move selection, zero API cost.

export const AI_BOT_UID = "ai-bot";
export const AI_BOT_NAME = "AI Opponent";

const ROWS = 6;
const COLS = 7;

// ─── Get the lowest empty row in a column (flat board) ───
function getDropRow(board, col) {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r * COLS + col] === 0) return r;
  }
  return -1;
}

// ─── Check if placing `player` at (row, col) wins ───
function checkWinAt(board, row, col, player) {
  const dirs = [[0, 1], [1, 0], [1, 1], [1, -1]];
  for (const [dr, dc] of dirs) {
    let count = 1;
    for (let i = 1; i < 4; i++) {
      const r = row + dr * i, c = col + dc * i;
      if (r < 0 || r >= ROWS || c < 0 || c >= COLS || board[r * COLS + c] !== player) break;
      count++;
    }
    for (let i = 1; i < 4; i++) {
      const r = row - dr * i, c = col - dc * i;
      if (r < 0 || r >= ROWS || c < 0 || c >= COLS || board[r * COLS + c] !== player) break;
      count++;
    }
    if (count >= 4) return true;
  }
  return false;
}

// ─── Find the best move for the AI ───
// aiPlayer = 1 or 2 (the value the AI uses on the board)
// humanPlayer = the other value
export function findBestMove(board, aiPlayer) {
  const humanPlayer = aiPlayer === 1 ? 2 : 1;

  // 1. Can AI win?
  for (let c = 0; c < COLS; c++) {
    const r = getDropRow(board, c);
    if (r === -1) continue;
    const testBoard = [...board];
    testBoard[r * COLS + c] = aiPlayer;
    if (checkWinAt(testBoard, r, c, aiPlayer)) return c;
  }

  // 2. Must AI block opponent win?
  for (let c = 0; c < COLS; c++) {
    const r = getDropRow(board, c);
    if (r === -1) continue;
    const testBoard = [...board];
    testBoard[r * COLS + c] = humanPlayer;
    if (checkWinAt(testBoard, r, c, humanPlayer)) return c;
  }

  // 3. Avoid giving opponent a win on the row above
  const safe = [];
  for (let c = 0; c < COLS; c++) {
    const r = getDropRow(board, c);
    if (r === -1) continue;
    // Check if placing here gives opponent a winning move above
    const testBoard = [...board];
    testBoard[r * COLS + c] = aiPlayer;
    const rowAbove = r - 1;
    if (rowAbove >= 0 && testBoard[rowAbove * COLS + c] === 0) {
      testBoard[rowAbove * COLS + c] = humanPlayer;
      if (checkWinAt(testBoard, rowAbove, c, humanPlayer)) continue; // skip — gifts opponent a win
    }
    safe.push(c);
  }

  // 4. Center preference with randomness among safe columns
  const available = safe.length > 0 ? safe : [];
  // Fallback: if no safe columns, use any available
  if (available.length === 0) {
    for (let c = 0; c < COLS; c++) {
      if (getDropRow(board, c) !== -1) available.push(c);
    }
  }
  if (available.length === 0) return -1;

  // Weighted random favoring center columns
  const weights = available.map((c) => 4 - Math.abs(c - 3));
  const totalW = weights.reduce((a, b) => a + b, 0);
  let rand = Math.random() * totalW;
  for (let i = 0; i < available.length; i++) {
    rand -= weights[i];
    if (rand <= 0) return available[i];
  }
  return available[0];
}
