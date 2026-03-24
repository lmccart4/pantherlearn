// src/components/blocks/ConnectFourBlock.jsx
// In-lesson Connect Four challenge board — lobby + game play with energy questions.
// Players answer physics energy questions to earn the right to drop a piece.

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useAuth } from "../../hooks/useAuth";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import {
  createChallenge,
  createAIGame,
  acceptChallenge,
  cancelChallenge,
  declineChallenge,
  makeMove,
  forfeitGame,
  subscribeToGame,
  subscribeToBlockGames,
  AI_BOT_UID,
} from "../../lib/connectFour";
import { findBestMove, AI_BOT_UID as AI_UID } from "../../lib/connectFourAI";

// ─── Energy Questions (60 questions from the standalone tool) ───
const QUESTIONS = [
  {q:"What type of energy does a moving car have?",opts:["Kinetic energy","Potential energy","Chemical energy","Nuclear energy"],ans:0},
  {q:"A book sitting on a high shelf has what type of energy?",opts:["Kinetic energy","Gravitational potential energy","Thermal energy","Sound energy"],ans:1},
  {q:"What happens to the total energy in a closed system?",opts:["It increases over time","It decreases over time","It stays the same","It disappears"],ans:2},
  {q:"A stretched rubber band stores what kind of energy?",opts:["Thermal energy","Kinetic energy","Elastic potential energy","Nuclear energy"],ans:2},
  {q:"When you rub your hands together, kinetic energy transforms into…",opts:["Sound energy","Thermal energy","Light energy","Chemical energy"],ans:1},
  {q:"A battery stores what type of energy?",opts:["Kinetic energy","Thermal energy","Chemical energy","Sound energy"],ans:2},
  {q:"What energy transformation happens in a solar panel?",opts:["Light → electrical","Chemical → thermal","Nuclear → kinetic","Sound → light"],ans:0},
  {q:"At the top of a roller coaster hill, a car has maximum…",opts:["Kinetic energy","Speed","Gravitational potential energy","Thermal energy"],ans:2},
  {q:"At the bottom of a roller coaster hill, a car has maximum…",opts:["Potential energy","Kinetic energy","Chemical energy","Elastic energy"],ans:1},
  {q:"Which is NOT a form of energy?",opts:["Thermal","Kinetic","Force","Nuclear"],ans:2},
  {q:"What energy does food contain?",opts:["Kinetic energy","Chemical energy","Elastic energy","Electrical energy"],ans:1},
  {q:"A campfire converts chemical energy into…",opts:["Only light","Only thermal","Thermal and light","Nuclear energy"],ans:2},
  {q:"What is the unit of energy?",opts:["Newton","Watt","Joule","Meter"],ans:2},
  {q:"A wind turbine converts what type of energy into electrical energy?",opts:["Chemical","Solar","Kinetic","Nuclear"],ans:2},
  {q:"When a ball is thrown upward, kinetic energy converts to…",opts:["Chemical energy","Thermal energy","Gravitational potential energy","Sound energy"],ans:2},
  {q:"What type of energy does a vibrating guitar string produce?",opts:["Chemical energy","Sound energy","Nuclear energy","Gravitational energy"],ans:1},
  {q:"The law of conservation of energy states that energy cannot be…",opts:["Transferred","Transformed","Created or destroyed","Measured"],ans:2},
  {q:"A toaster converts electrical energy into…",opts:["Chemical energy","Sound energy","Thermal energy","Nuclear energy"],ans:2},
  {q:"Which has more gravitational potential energy?",opts:["A 5 kg rock at 2m high","A 5 kg rock at 10m high","They're the same","Cannot be determined"],ans:1},
  {q:"What energy transformation occurs in a microphone?",opts:["Electrical → sound","Sound → electrical","Light → sound","Chemical → sound"],ans:1},
  {q:"A compressed spring has what type of energy?",opts:["Kinetic","Thermal","Elastic potential","Gravitational potential"],ans:2},
  {q:"Thermal energy is related to the motion of…",opts:["Planets","Particles/atoms","Light waves","Electrons only"],ans:1},
  {q:"What type of energy does the sun primarily emit?",opts:["Chemical","Nuclear and radiant","Kinetic","Elastic"],ans:1},
  {q:"In a hydroelectric dam, what energy transformation occurs?",opts:["Chemical → electrical","Gravitational potential → kinetic → electrical","Nuclear → thermal","Sound → electrical"],ans:1},
  {q:"When you turn on a flashlight, electrical energy becomes…",opts:["Only light","Light and thermal","Chemical and sound","Nuclear and kinetic"],ans:1},
  {q:"An object at rest on the ground has zero…",opts:["Mass","Gravitational potential energy relative to the ground","Chemical energy","All energy"],ans:1},
  {q:"What energy does a moving bowling ball have?",opts:["Only potential","Only kinetic","Kinetic and thermal","Chemical"],ans:1},
  {q:"A photovoltaic cell converts…",opts:["Wind to electricity","Sound to electricity","Light to electricity","Heat to electricity"],ans:2},
  {q:"Which object has kinetic energy?",opts:["A book on a table","A parked car","A flying bird","A stretched spring"],ans:2},
  {q:"Energy that comes from the nucleus of an atom is called…",opts:["Chemical energy","Thermal energy","Nuclear energy","Electrical energy"],ans:2},
  {q:"What happens to energy when a car brakes?",opts:["It disappears","Kinetic → thermal (friction)","It stays kinetic","Kinetic → chemical"],ans:1},
  {q:"Potential energy depends on an object's…",opts:["Speed and color","Position or condition","Temperature only","Sound level"],ans:1},
  {q:"A pendulum at its highest point has maximum…",opts:["Kinetic energy","Speed","Potential energy","Momentum"],ans:2},
  {q:"Which energy source is renewable?",opts:["Coal","Natural gas","Solar","Petroleum"],ans:2},
  {q:"A car engine converts chemical energy from gasoline into…",opts:["Kinetic and thermal","Only kinetic","Only thermal","Nuclear"],ans:0},
  {q:"What happens to gravitational PE as an object falls?",opts:["It increases","It stays the same","It decreases","It doubles"],ans:2},
  {q:"Electrical energy in your home comes from…",opts:["Batteries only","Power plants that transform other energy types","The sun directly","Chemical reactions in the walls"],ans:1},
  {q:"A bouncing ball loses height each bounce because energy is lost to…",opts:["Space","Thermal energy from deformation","It just disappears","Gravity absorbs it"],ans:1},
  {q:"What type of energy does a lightning bolt carry?",opts:["Chemical","Elastic","Electrical","Nuclear"],ans:2},
  {q:"When ice melts, it absorbs…",opts:["Kinetic energy","Thermal energy","Electrical energy","Sound energy"],ans:1},
  {q:"What energy transformation happens when you eat food and run?",opts:["Thermal → kinetic","Chemical → kinetic and thermal","Electrical → chemical","Nuclear → kinetic"],ans:1},
  {q:"A skydiver falling at constant speed has…",opts:["Increasing kinetic energy","Decreasing potential energy","Both kinetic and gravitational PE","No energy at all"],ans:2},
  {q:"Which has the most kinetic energy?",opts:["A parked truck","A sprinting cheetah","A sleeping cat","A rock on the ground"],ans:1},
  {q:"What type of energy is stored in a gallon of gasoline?",opts:["Kinetic","Elastic potential","Chemical potential","Gravitational potential"],ans:2},
  {q:"A microwave oven converts electrical energy into…",opts:["Sound energy","Kinetic energy","Electromagnetic (radiant) energy","Nuclear energy"],ans:2},
  {q:"What energy transformation happens in a speaker?",opts:["Light → sound","Electrical → sound","Chemical → light","Thermal → electrical"],ans:1},
  {q:"Why does a hot cup of coffee eventually cool down?",opts:["It loses mass","Thermal energy transfers to the surroundings","Chemical energy is used up","Gravity pulls the heat down"],ans:1},
  {q:"A roller coaster at the very bottom of a loop has mostly…",opts:["Potential energy","Thermal energy","Kinetic energy","Chemical energy"],ans:2},
  {q:"What type of energy does a spinning fan blade have?",opts:["Chemical","Gravitational potential","Kinetic","Nuclear"],ans:2},
  {q:"A student lifts a textbook from the floor to a desk. What increases?",opts:["The book's kinetic energy","The book's gravitational potential energy","The book's chemical energy","The book's thermal energy"],ans:1},
  {q:"What energy does a glow stick use?",opts:["Electrical → light","Chemical → light","Nuclear → light","Thermal → light"],ans:1},
  {q:"Energy from the sun reaches Earth as…",opts:["Sound waves","Kinetic energy of particles","Electromagnetic radiation (radiant energy)","Chemical energy in air"],ans:2},
  {q:"A swinging pendulum at the midpoint (lowest position) has maximum…",opts:["Potential energy","Kinetic energy","Elastic energy","Chemical energy"],ans:1},
  {q:"What happens to kinetic energy when a moving car hits the brakes?",opts:["It's destroyed","It converts to thermal energy through friction","It becomes potential energy","It stays the same"],ans:1},
  {q:"Which is an example of gravitational potential energy?",opts:["A moving bicycle","Water held behind a dam","A burning candle","A charged battery"],ans:1},
  {q:"A trampoline stores energy when you push it down. What kind?",opts:["Gravitational potential","Chemical","Elastic potential","Thermal"],ans:2},
  {q:"What energy transformation occurs in a hand-crank flashlight?",opts:["Chemical → light","Kinetic → electrical → light","Nuclear → light","Thermal → electrical"],ans:1},
  {q:"Why do your hands get warm when you clap?",opts:["Chemical reactions in your skin","Kinetic energy converts to thermal energy","Sound energy heats your hands","Electrical energy from your nerves"],ans:1},
  {q:"An arrow pulled back on a bowstring has what energy?",opts:["Kinetic","Gravitational potential","Elastic potential","Thermal"],ans:2},
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const ROWS = 6;
const COLS = 7;

// ─── Fonts ───
const FONT_DISPLAY = "'Orbitron', 'Inter', sans-serif";
const FONT_BODY = "'Space Grotesk', 'Inter', sans-serif";

// ─── Colors ───
const C = {
  bg: "#0a0e27",
  surface: "#111638",
  border: "#1e2452",
  p1: "#00e5ff",   // cyan — challenger
  p2: "#ff6d00",   // orange — opponent
  p1glow: "rgba(0,229,255,0.3)",
  p2glow: "rgba(255,109,0,0.3)",
  correct: "#00e676",
  wrong: "#ff1744",
  text: "#e8eaed",
  text2: "#9aa0b8",
  text3: "#5c6380",
  boardBg: "#0d1233",
  cellBg: "#161b48",
  win: "#ffd600",
};

// ─── Score calculation ───
function getScore(gamesCompleted) {
  if (gamesCompleted >= 3) return { earned: 5, total: 5, pct: 100 };
  if (gamesCompleted === 2) return { earned: 4.25, total: 5, pct: 85 };
  if (gamesCompleted === 1) return { earned: 3.25, total: 5, pct: 65 };
  return { earned: 2.75, total: 5, pct: 55 }; // started but not finished
}

export default function ConnectFourBlock({ block, courseId, lessonId, studentData, onAnswer }) {
  const { user, userRole } = useAuth();
  const isTeacher = userRole === "teacher";

  // ─── Lobby state ───
  const [games, setGames] = useState([]);
  const [classmates, setClassmates] = useState([]);
  const [showDirectPicker, setShowDirectPicker] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  // ─── Active game state ───
  const [activeGameId, setActiveGameId] = useState(null);
  const [gameData, setGameData] = useState(null);

  // ─── Question overlay state ───
  const [questionQueue, setQuestionQueue] = useState(() => shuffle(QUESTIONS));
  const [qIndex, setQIndex] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const [pendingCol, setPendingCol] = useState(-1);
  const [questionLocked, setQuestionLocked] = useState(false);
  const [questionFeedback, setQuestionFeedback] = useState(null);
  const [shuffledOpts, setShuffledOpts] = useState([]);
  const [correctShuffledIdx, setCorrectShuffledIdx] = useState(-1);
  const [selectedIdx, setSelectedIdx] = useState(-1);

  // ─── Score tracking ───
  const savedData = studentData?.[block.id];
  const [gamesCompleted, setGamesCompleted] = useState(savedData?.gamesCompleted || 0);
  const [gamesStarted, setGamesStarted] = useState(savedData?.gamesStarted || 0);
  const [scoreSent, setScoreSent] = useState(false);
  const aiMoveTimeoutRef = useRef(null);

  // Restore from saved data
  useEffect(() => {
    if (savedData) {
      if (savedData.gamesCompleted > gamesCompleted) setGamesCompleted(savedData.gamesCompleted);
      if (savedData.gamesStarted > gamesStarted) setGamesStarted(savedData.gamesStarted);
    }
  }, [savedData]);

  // ─── Send score via onAnswer ───
  const sendScore = useCallback((completed, started) => {
    if (!onAnswer || !block.id) return;
    const hasStarted = started > 0 || completed > 0;
    if (!hasStarted) return;
    const s = getScore(completed);
    onAnswer(block.id, {
      gamesCompleted: completed,
      gamesStarted: started,
      score: s.earned,
      maxScore: s.total,
      writtenScore: s.total > 0 ? s.earned / s.total : 0,
      pct: s.pct,
      submitted: true,
      savedAt: new Date().toISOString(),
    });
  }, [onAnswer, block.id]);

  // ─── Subscribe to block games ───
  useEffect(() => {
    if (!courseId || !block.id) return;
    const unsub = subscribeToBlockGames(courseId, block.id, (data) => {
      setGames(data);
      setError(null);
    }, (err) => {
      console.error("Connect Four games error:", err);
      if (err.message?.includes("index")) {
        setError("Firestore index needed — check browser console for a link to create it.");
      } else {
        setError(err.message || "Failed to load games");
      }
    });
    return () => unsub();
  }, [courseId, block.id]);

  // ─── Subscribe to active game ───
  useEffect(() => {
    if (!courseId || !activeGameId) return;
    const unsub = subscribeToGame(courseId, activeGameId, (data) => {
      setGameData(data);
    });
    return () => unsub();
  }, [courseId, activeGameId]);

  // ─── AI move logic ───
  useEffect(() => {
    if (!gameData || !activeGameId || !user) return;
    if (gameData.status !== "active") return;
    if (gameData.challengeType !== "ai") return;

    // AI is always the opponent
    const isAITurn = gameData.currentTurn === "opponent";
    if (!isAITurn) return;

    // Don't trigger if question overlay is showing
    if (showQuestion) return;

    const delay = 500 + Math.random() * 300; // 500-800ms
    aiMoveTimeoutRef.current = setTimeout(async () => {
      try {
        const aiPlayer = 2; // opponent is always 2
        const col = findBestMove(gameData.board, aiPlayer);
        if (col === -1) return;

        const result = await makeMove({
          courseId,
          gameId: activeGameId,
          playerUid: AI_UID,
          column: col,
          answeredCorrectly: true, // AI always answers correctly
        });

        if (result?.gameOver) {
          handleGameEnd(result);
        }
      } catch (e) {
        console.error("AI move failed:", e);
      }
    }, delay);

    return () => {
      if (aiMoveTimeoutRef.current) clearTimeout(aiMoveTimeoutRef.current);
    };
  }, [gameData?.currentTurn, gameData?.status, gameData?.moves?.length, activeGameId, showQuestion]);

  // ─── Fetch classmates ───
  useEffect(() => {
    if (!courseId || !user) return;
    const fetchClassmates = async () => {
      try {
        const enrollSnap = await getDocs(
          query(collection(db, "enrollments"), where("courseId", "==", courseId))
        );
        const enrolled = enrollSnap.docs
          .map((d) => d.data())
          .filter((e) => {
            const uid = e.uid || e.studentUid;
            return uid && uid !== user.uid;
          })
          .map((e) => ({ uid: e.uid || e.studentUid, name: e.displayName || e.name || "Student" }));

        if (!isTeacher) {
          try {
            const courseDoc = await getDoc(doc(db, "courses", courseId));
            if (courseDoc.exists()) {
              const ownerUid = courseDoc.data().ownerUid;
              if (ownerUid && ownerUid !== user.uid && !enrolled.some((c) => c.uid === ownerUid)) {
                const ownerDoc = await getDoc(doc(db, "users", ownerUid));
                if (ownerDoc.exists()) {
                  enrolled.unshift({ uid: ownerUid, name: ownerDoc.data().displayName || "Teacher" });
                }
              }
            }
          } catch (_) { /* best-effort */ }
        }
        setClassmates(enrolled);
      } catch (e) {
        console.error("Failed to fetch classmates:", e);
      }
    };
    fetchClassmates();
  }, [courseId, user, isTeacher]);

  // ─── Game end handler ───
  const handleGameEnd = useCallback((result) => {
    const newCompleted = gamesCompleted + 1;
    setGamesCompleted(newCompleted);
    sendScore(newCompleted, gamesStarted);
  }, [gamesCompleted, gamesStarted, sendScore]);

  // ─── Detect game finished from real-time data ───
  const lastCountedGameRef = useRef(null);
  useEffect(() => {
    if (!gameData || gameData.status !== "finished") return;
    if (!activeGameId) return;
    // Only count once per game ID
    if (lastCountedGameRef.current === activeGameId) return;
    lastCountedGameRef.current = activeGameId;
    handleGameEnd(gameData);
  }, [gameData?.status, activeGameId, handleGameEnd]);

  // ─── Categorize games ───
  const openChallenges = games.filter((g) =>
    g.status === "waiting" && g.challengeType === "open" && g.challengerUid !== user?.uid
  );
  const directToMe = games.filter((g) =>
    g.status === "waiting" && g.challengeType === "direct" && g.targetOpponentUid === user?.uid
  );
  const myWaiting = games.filter((g) =>
    g.status === "waiting" && g.challengerUid === user?.uid
  );
  const activeGames = games.filter((g) =>
    g.status === "active" && (g.challengerUid === user?.uid || g.opponentUid === user?.uid)
  );
  const recentFinished = games
    .filter((g) => g.status === "finished" && (g.challengerUid === user?.uid || g.opponentUid === user?.uid))
    .slice(0, 5);

  // ─── Challenge handlers ───
  const handleCreateOpen = async () => {
    if (creating || !user) return;
    setCreating(true);
    setError(null);
    try {
      await createChallenge({
        courseId, blockId: block.id, lessonId,
        challengerUid: user.uid, challengerName: user.displayName || "Anonymous",
        challengeType: "open",
      });
    } catch (e) {
      setError(e.message || "Failed to create challenge.");
    }
    setCreating(false);
  };

  const handleCreateDirect = async (target) => {
    if (creating || !user) return;
    setCreating(true);
    setShowDirectPicker(false);
    setError(null);
    try {
      await createChallenge({
        courseId, blockId: block.id, lessonId,
        challengerUid: user.uid, challengerName: user.displayName || "Anonymous",
        challengeType: "direct",
        targetOpponentUid: target.uid,
        targetOpponentName: target.name,
      });
    } catch (e) {
      setError(e.message || "Failed to create challenge.");
    }
    setCreating(false);
  };

  const handleAccept = async (gameId) => {
    try {
      await acceptChallenge({
        courseId, gameId,
        opponentUid: user.uid,
        opponentName: user.displayName || "Anonymous",
      });
      setActiveGameId(gameId);
    } catch (e) {
      alert(e.message || "Failed to accept challenge");
    }
  };

  const handleCancel = async (gameId) => {
    try { await cancelChallenge(courseId, gameId); } catch (e) { console.error(e); }
  };

  const handleDecline = async (gameId) => {
    try { await declineChallenge(courseId, gameId, user?.displayName || "Anonymous"); } catch (e) { console.error(e); }
  };

  const handlePlayAI = async () => {
    if (creating || !user) return;
    setCreating(true);
    setError(null);
    try {
      const gameId = await createAIGame({
        courseId, blockId: block.id, lessonId,
        challengerUid: user.uid, challengerName: user.displayName || "Anonymous",
      });
      const newStarted = gamesStarted + 1;
      setGamesStarted(newStarted);
      if (gamesCompleted === 0 && !scoreSent) {
        sendScore(0, newStarted);
        setScoreSent(true);
      }
      setActiveGameId(gameId);
    } catch (e) {
      setError(e.message || "Failed to start AI game.");
    }
    setCreating(false);
  };

  const handleOpenGame = (gameId) => {
    setActiveGameId(gameId);
  };

  const handleBackToLobby = () => {
    setActiveGameId(null);
    setGameData(null);
    setShowQuestion(false);
    if (aiMoveTimeoutRef.current) clearTimeout(aiMoveTimeoutRef.current);
  };

  const handleForfeit = async () => {
    if (!activeGameId || !user) return;
    try {
      await forfeitGame(courseId, activeGameId, user.uid);
    } catch (e) {
      console.error("Forfeit failed:", e);
    }
  };

  // ─── Column click → show question ───
  const handleColumnClick = (col) => {
    if (!gameData || gameData.status !== "active" || showQuestion) return;
    // Check it's my turn
    const isChallenger = gameData.challengerUid === user?.uid;
    const myRole = isChallenger ? "challenger" : "opponent";
    if (gameData.currentTurn !== myRole) return;
    // Check column not full
    if (gameData.board[col] !== 0) return; // top cell of column

    // Track first game start
    if (gamesCompleted === 0 && !scoreSent) {
      const newStarted = gamesStarted + 1;
      setGamesStarted(newStarted);
      sendScore(0, newStarted);
      setScoreSent(true);
    }

    setPendingCol(col);
    // Get next question
    let qi = qIndex;
    if (qi >= questionQueue.length) {
      setQuestionQueue(shuffle(QUESTIONS));
      qi = 0;
    }
    const q = questionQueue[qi];
    setQIndex(qi + 1);

    // Shuffle options
    const indices = shuffle([0, 1, 2, 3]);
    setShuffledOpts(indices.map((i) => q.opts[i]));
    setCorrectShuffledIdx(indices.indexOf(q.ans));
    setSelectedIdx(-1);
    setQuestionLocked(false);
    setQuestionFeedback(null);
    setShowQuestion(true);
  };

  // ─── Answer a question ───
  const handleAnswerQuestion = async (chosenIdx) => {
    if (questionLocked) return;
    setQuestionLocked(true);
    setSelectedIdx(chosenIdx);

    const correct = chosenIdx === correctShuffledIdx;
    setQuestionFeedback(correct ? "correct" : "wrong");

    setTimeout(async () => {
      setShowQuestion(false);
      setQuestionLocked(false);
      setSelectedIdx(null);
      setQuestionFeedback(null);
      try {
        const result = await makeMove({
          courseId,
          gameId: activeGameId,
          playerUid: user.uid,
          column: pendingCol,
          answeredCorrectly: correct,
        });
        // Backup: handle game end directly if subscription is slow
        if (result?.gameOver && lastCountedGameRef.current !== activeGameId) {
          lastCountedGameRef.current = activeGameId;
          handleGameEnd(result);
        }
      } catch (e) {
        console.error("Move failed:", e);
        setError(e.message);
      }
    }, correct ? 800 : 1000);
  };

  // ─── Render ───

  // If viewing an active game, show the game board
  if (activeGameId && gameData) {
    return (
      <GameView
        game={gameData}
        user={user}
        isTeacher={isTeacher}
        onColumnClick={handleColumnClick}
        onBack={handleBackToLobby}
        onForfeit={handleForfeit}
        showQuestion={showQuestion}
        shuffledOpts={shuffledOpts}
        correctShuffledIdx={correctShuffledIdx}
        selectedIdx={selectedIdx}
        questionLocked={questionLocked}
        questionFeedback={questionFeedback}
        onAnswer={handleAnswerQuestion}
        gamesCompleted={gamesCompleted}
        block={block}
      />
    );
  }

  const timeAgo = (ts) => {
    if (!ts) return "";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    const s = Math.floor((Date.now() - d.getTime()) / 1000);
    if (s < 60) return "just now";
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return `${Math.floor(s / 86400)}d ago`;
  };

  return (
    <div style={{
      background: C.bg, border: `1px solid ${C.border}`, borderRadius: 16,
      padding: 24, marginBottom: 16, fontFamily: FONT_BODY, color: C.text,
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <span style={{ fontSize: 28 }}>{block.icon || "🔴"}</span>
        <div>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: C.text, fontFamily: FONT_DISPLAY }}>
            {block.title || "Connect Four: Energy Challenge"}
          </h3>
          {block.instructions && (
            <p style={{ margin: "4px 0 0", fontSize: 13, color: C.text2, lineHeight: 1.5 }}>
              {block.instructions}
            </p>
          )}
        </div>
      </div>

      {/* XP / Score Info */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16, fontSize: 12, color: C.text3, flexWrap: "wrap" }}>
        <span>🏆 Win: +100 XP</span>
        <span>🤝 Draw: +50 XP</span>
        <span>🎮 Loss: +30 XP</span>
        <span>📊 {gamesCompleted}/3 games for full credit</span>
      </div>

      {/* Challenge Buttons */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <button onClick={handlePlayAI} disabled={creating}
          style={{
            padding: "10px 20px", borderRadius: 10, border: "none", cursor: "pointer",
            background: C.p1, color: C.bg, fontWeight: 700, fontSize: 14, fontFamily: FONT_BODY,
            opacity: creating ? 0.5 : 1,
          }}>
          🤖 Play vs AI
        </button>
        <button onClick={handleCreateOpen} disabled={creating}
          style={{
            padding: "10px 20px", borderRadius: 10, border: "none", cursor: "pointer",
            background: C.p2, color: C.bg, fontWeight: 700, fontSize: 14, fontFamily: FONT_BODY,
            opacity: creating ? 0.5 : 1,
          }}>
          ⚔️ Challenge Anyone
        </button>
        <div style={{ position: "relative" }}>
          <button onClick={() => setShowDirectPicker(!showDirectPicker)} disabled={creating}
            style={{
              padding: "10px 20px", borderRadius: 10, border: `1px solid ${C.border}`,
              cursor: "pointer", background: C.surface, color: C.text, fontWeight: 600, fontSize: 14,
              fontFamily: FONT_BODY, opacity: creating ? 0.5 : 1,
            }}>
            🎯 {isTeacher ? "Challenge Student" : "Challenge Classmate"}
          </button>
          {showDirectPicker && (
            <div style={{
              position: "absolute", top: "100%", left: 0, marginTop: 4, zIndex: 20,
              background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12,
              boxShadow: "0 8px 32px rgba(0,0,0,0.6)", maxHeight: 240, overflowY: "auto",
              minWidth: 220, padding: 4,
            }}>
              {classmates.length === 0 && (
                <p style={{ padding: 12, fontSize: 12, color: C.text3, textAlign: "center" }}>
                  {isTeacher ? "No students found" : "No classmates found"}
                </p>
              )}
              {classmates.map((c) => (
                <button key={c.uid} onClick={() => handleCreateDirect(c)}
                  style={{
                    display: "block", width: "100%", padding: "8px 12px", border: "none",
                    background: "transparent", color: C.text, cursor: "pointer",
                    textAlign: "left", borderRadius: 8, fontSize: 13, fontFamily: FONT_BODY,
                  }}
                  onMouseEnter={(e) => e.target.style.background = "rgba(0,229,255,0.08)"}
                  onMouseLeave={(e) => e.target.style.background = "transparent"}>
                  {c.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          marginBottom: 12, padding: "8px 12px", borderRadius: 8,
          background: "rgba(255,23,68,0.1)", border: "1px solid rgba(255,23,68,0.3)",
          color: C.wrong, fontSize: 12,
        }}>
          {error}
        </div>
      )}

      {/* Direct Challenges to Me */}
      {directToMe.length > 0 && (
        <Section title="🎯 Challenges for You" color={C.p2}>
          {directToMe.map((g) => (
            <GameRow key={g.id} bg="rgba(255,109,0,0.06)">
              <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>
                {g.challengerName} challenged you!
              </span>
              <div style={{ display: "flex", gap: 6 }}>
                <SmallBtn color={C.correct} onClick={() => handleAccept(g.id)}>Accept</SmallBtn>
                <SmallBtn color={C.wrong} onClick={() => handleDecline(g.id)}>Decline</SmallBtn>
              </div>
            </GameRow>
          ))}
        </Section>
      )}

      {/* Open Challenges */}
      {openChallenges.length > 0 && (
        <Section title="⚔️ Open Challenges">
          {openChallenges.map((g) => (
            <GameRow key={g.id}>
              <span style={{ fontSize: 13, color: C.text }}>
                <strong>{g.challengerName}</strong> is looking for an opponent
                <span style={{ color: C.text3, fontSize: 11, marginLeft: 6 }}>{timeAgo(g.createdAt)}</span>
              </span>
              <SmallBtn color={C.p2} onClick={() => handleAccept(g.id)}>Accept</SmallBtn>
            </GameRow>
          ))}
        </Section>
      )}

      {/* My Waiting */}
      {myWaiting.length > 0 && (
        <Section title="⏳ Your Pending Challenges">
          {myWaiting.map((g) => (
            <GameRow key={g.id}>
              <span style={{ fontSize: 13, color: C.text2 }}>
                {g.challengeType === "direct" ? `Waiting for ${g.targetOpponentName}...` : "Waiting for opponent..."}
                <span style={{ color: C.text3, fontSize: 11, marginLeft: 6 }}>{timeAgo(g.createdAt)}</span>
              </span>
              <SmallBtn color={C.wrong} onClick={() => handleCancel(g.id)}>Cancel</SmallBtn>
            </GameRow>
          ))}
        </Section>
      )}

      {/* Active Games */}
      {activeGames.length > 0 && (
        <Section title="🎮 Active Games" color={C.correct}>
          {activeGames.map((g) => {
            const isAI = g.opponentUid === AI_BOT_UID || g.challengerUid === AI_BOT_UID;
            const opponent = (g.challengerUid === user?.uid ? g.opponentName : g.challengerName) + (isAI ? " 🤖" : "");
            const isMyTurn = (g.challengerUid === user?.uid && g.currentTurn === "challenger")
              || (g.opponentUid === user?.uid && g.currentTurn === "opponent");
            return (
              <GameRow key={g.id} onClick={() => handleOpenGame(g.id)}>
                <span style={{ fontSize: 13, color: C.text }}>
                  vs. <strong>{opponent}</strong>
                  {isMyTurn
                    ? <span style={{ color: C.correct, fontWeight: 700, marginLeft: 8 }}>Your turn!</span>
                    : <span style={{ color: C.text3, marginLeft: 8 }}>Waiting...</span>
                  }
                </span>
                <span style={{ color: C.text3, fontSize: 18 }}>→</span>
              </GameRow>
            );
          })}
        </Section>
      )}

      {/* Recent Results */}
      {recentFinished.length > 0 && (
        <Section title="📊 Recent Results">
          {recentFinished.map((g) => {
            const isAI = g.opponentUid === AI_BOT_UID || g.challengerUid === AI_BOT_UID;
            const opponent = (g.challengerUid === user?.uid ? g.opponentName : g.challengerName) + (isAI ? " 🤖" : "");
            const won = g.winnerUid === user?.uid;
            const draw = g.isDraw;
            return (
              <GameRow key={g.id} onClick={() => handleOpenGame(g.id)}>
                <span style={{ fontSize: 13, color: C.text }}>
                  vs. <strong>{opponent}</strong>
                  <span style={{ marginLeft: 8, fontWeight: 700, color: draw ? C.p1 : won ? C.correct : C.wrong }}>
                    {draw ? "Draw" : won ? "Won!" : "Lost"}
                  </span>
                  <span style={{ color: C.text3, fontSize: 11, marginLeft: 6 }}>{timeAgo(g.updatedAt || g.createdAt)}</span>
                </span>
              </GameRow>
            );
          })}
        </Section>
      )}

      {/* Teacher spectating */}
      {isTeacher && (() => {
        const spectatableGames = games.filter((g) =>
          g.status === "active" && g.challengerUid !== user?.uid && g.opponentUid !== user?.uid
        );
        return spectatableGames.length > 0 ? (
          <Section title="👁 Active Games (Spectate)">
            {spectatableGames.map((g) => (
              <GameRow key={g.id} onClick={() => handleOpenGame(g.id)}>
                <span style={{ fontSize: 13, color: C.text }}>
                  <strong>{g.challengerName}</strong> vs. <strong>{g.opponentName}</strong>
                  <span style={{ color: C.text3, fontSize: 11, marginLeft: 6 }}>
                    {g.moves?.length || 0} moves
                  </span>
                </span>
                <span style={{ color: C.text3, fontSize: 12 }}>Spectate →</span>
              </GameRow>
            ))}
          </Section>
        ) : null;
      })()}

      {/* Empty state */}
      {games.length === 0 && (
        <p style={{ textAlign: "center", color: C.text3, fontSize: 13, padding: 16 }}>
          No games yet. Be the first to issue a challenge!
        </p>
      )}

      {/* Score tracker */}
      {gamesCompleted > 0 && (
        <ScoreTracker gamesCompleted={gamesCompleted} />
      )}
    </div>
  );
}

// ═══════════════════════════════════════
// GAME VIEW
// ═══════════════════════════════════════

function GameView({
  game, user, isTeacher, onColumnClick, onBack, onForfeit,
  showQuestion, shuffledOpts, correctShuffledIdx, selectedIdx,
  questionLocked, questionFeedback, onAnswer,
  gamesCompleted, block,
}) {
  const board = game.board || new Array(42).fill(0);
  const isChallenger = game.challengerUid === user?.uid;
  const isOpponent = game.opponentUid === user?.uid;
  const isPlayer = isChallenger || isOpponent;
  const myRole = isChallenger ? "challenger" : "opponent";
  const isMyTurn = game.status === "active" && game.currentTurn === myRole;
  const isFinished = game.status === "finished";
  const isAI = game.challengeType === "ai";
  const winCells = game.winnerCells || [];

  // Build a set of winning cell indices for highlighting
  // winCells is already stored as flat indices (e.g. [3, 10, 17, 24])
  const winSet = useMemo(() => new Set(winCells), [winCells]);

  // Status text
  let statusText = "";
  let statusColor = C.text2;
  if (isFinished) {
    if (game.isDraw) {
      statusText = "Draw! +50 XP";
      statusColor = C.p1;
    } else if (game.winnerUid === user?.uid) {
      statusText = "You won! +100 XP";
      statusColor = C.correct;
    } else {
      const winnerName = game.winnerUid === game.challengerUid ? game.challengerName : game.opponentName;
      statusText = isPlayer ? "You lost. +30 XP" : `${winnerName} wins!`;
      statusColor = isPlayer ? C.wrong : C.p1;
    }
  } else if (isMyTurn) {
    statusText = "Your turn — pick a column!";
    statusColor = C.correct;
  } else if (isPlayer) {
    statusText = "Opponent's turn...";
    statusColor = C.text3;
  }

  const p1Name = game.challengerName || "Player 1";
  const p2Name = game.opponentName || "Player 2";

  return (
    <div style={{
      background: C.bg, border: `1px solid ${C.border}`, borderRadius: 16,
      padding: 20, marginBottom: 16, fontFamily: FONT_BODY, color: C.text,
      position: "relative", overflow: "hidden",
    }}>
      {/* Google Fonts link for Orbitron + Space Grotesk */}
      <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Space+Grotesk:wght@400;600;700&display=swap" rel="stylesheet" />

      {/* Top bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <button onClick={onBack} style={{
          background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8,
          color: C.text2, padding: "6px 14px", cursor: "pointer", fontSize: 13, fontFamily: FONT_BODY,
        }}>
          ← Back
        </button>
        <span style={{ fontSize: 14, fontWeight: 700, color: statusColor, fontFamily: FONT_DISPLAY }}>
          {statusText}
        </span>
        {isPlayer && !isFinished && (
          <button onClick={onForfeit} style={{
            background: "transparent", border: `1px solid rgba(255,23,68,0.3)`, borderRadius: 8,
            color: C.wrong, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: FONT_BODY,
          }}>
            Forfeit
          </button>
        )}
        {(!isPlayer || isFinished) && <div />}
      </div>

      {/* Player indicators */}
      <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 16 }}>
        <PlayerTag
          name={p1Name}
          color={C.p1}
          glow={C.p1glow}
          active={game.status === "active" && game.currentTurn === "challenger"}
          isAI={false}
        />
        <span style={{ color: C.text3, fontWeight: 700, fontSize: 16, alignSelf: "center" }}>vs</span>
        <PlayerTag
          name={p2Name + (isAI ? " 🤖" : "")}
          color={C.p2}
          glow={C.p2glow}
          active={game.status === "active" && game.currentTurn === "opponent"}
          isAI={isAI}
        />
      </div>

      {/* Board */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative" }}>
          {/* Column click targets (top row) */}
          {isMyTurn && !showQuestion && !isFinished && (
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: 4, marginBottom: 4 }}>
              {Array.from({ length: COLS }).map((_, c) => (
                <button key={c} onClick={() => onColumnClick(c)}
                  style={{
                    width: "100%", height: 20, background: "transparent", border: "none",
                    cursor: board[c] === 0 ? "pointer" : "not-allowed",
                    borderRadius: "8px 8px 0 0", transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => { if (board[c] === 0) e.target.style.background = isChallenger ? C.p1glow : C.p2glow; }}
                  onMouseLeave={(e) => { e.target.style.background = "transparent"; }}>
                  {board[c] === 0 && <span style={{ color: C.text3, fontSize: 14 }}>▼</span>}
                </button>
              ))}
            </div>
          )}

          {/* Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
            gap: 4,
            padding: 8,
            background: C.boardBg,
            borderRadius: 12,
            border: `2px solid ${C.border}`,
          }}>
            {Array.from({ length: ROWS * COLS }).map((_, idx) => {
              const val = board[idx];
              const isWin = winSet.has(idx);
              let bg = C.cellBg;
              let shadow = "none";
              let border = "none";

              if (val === 1) {
                bg = C.p1;
                shadow = `0 0 12px ${C.p1glow}`;
                if (isWin) {
                  shadow = `0 0 20px ${C.p1}, 0 0 40px ${C.p1glow}`;
                  border = `2px solid ${C.win}`;
                }
              } else if (val === 2) {
                bg = C.p2;
                shadow = `0 0 12px ${C.p2glow}`;
                if (isWin) {
                  shadow = `0 0 20px ${C.p2}, 0 0 40px ${C.p2glow}`;
                  border = `2px solid ${C.win}`;
                }
              }

              const col = idx % COLS;

              return (
                <div
                  key={idx}
                  onClick={() => { if (isMyTurn && !showQuestion && !isFinished && val === 0) onColumnClick(col); }}
                  style={{
                    width: "clamp(36px, 10vw, 52px)",
                    height: "clamp(36px, 10vw, 52px)",
                    borderRadius: "50%",
                    background: bg,
                    boxShadow: shadow,
                    border,
                    cursor: isMyTurn && !showQuestion && val === 0 ? "pointer" : "default",
                    transition: "all 0.3s ease",
                    minWidth: 36,
                    minHeight: 36,
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Question Overlay */}
      {showQuestion && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(10,14,39,0.92)", display: "flex", alignItems: "center",
          justifyContent: "center", zIndex: 30, backdropFilter: "blur(4px)",
        }}>
          <div style={{
            background: C.surface, borderRadius: 16, padding: 24,
            border: `1px solid ${C.border}`, maxWidth: 420, width: "90%",
            boxShadow: `0 0 40px rgba(0,229,255,0.15)`,
          }}>
            <div style={{
              fontSize: 12, fontWeight: 700, color: C.p1, textTransform: "uppercase",
              letterSpacing: "0.1em", marginBottom: 8, fontFamily: FONT_DISPLAY,
            }}>
              ⚡ Energy Question
            </div>
            <p style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.5, marginBottom: 16, color: C.text }}>
              {/* Current question text from shuffled queue */}
              {(() => {
                // We don't store the question text in state directly,
                // but the parent has shuffledOpts ready — reconstruct from QUESTIONS
                // Actually, we'll find the question from the opts
                return QUESTIONS.find((q) => {
                  const optSet = new Set(q.opts);
                  return shuffledOpts.every((o) => optSet.has(o));
                })?.q || "Answer the question to place your piece!";
              })()}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {shuffledOpts.map((opt, i) => {
                let btnBg = C.cellBg;
                let btnBorder = `1px solid ${C.border}`;
                let btnColor = C.text;

                if (questionLocked) {
                  if (i === correctShuffledIdx) {
                    btnBg = "rgba(0,230,118,0.15)";
                    btnBorder = `2px solid ${C.correct}`;
                    btnColor = C.correct;
                  } else if (i === selectedIdx && questionFeedback === "wrong") {
                    btnBg = "rgba(255,23,68,0.15)";
                    btnBorder = `2px solid ${C.wrong}`;
                    btnColor = C.wrong;
                  }
                }

                return (
                  <button key={i} onClick={() => onAnswer(i)}
                    disabled={questionLocked}
                    style={{
                      padding: "12px 16px", borderRadius: 10, border: btnBorder,
                      background: btnBg, color: btnColor, cursor: questionLocked ? "default" : "pointer",
                      fontSize: 14, fontWeight: 600, textAlign: "left", fontFamily: FONT_BODY,
                      transition: "all 0.15s", minHeight: 44,
                      opacity: questionLocked && i !== correctShuffledIdx && i !== selectedIdx ? 0.5 : 1,
                    }}
                    onMouseEnter={(e) => { if (!questionLocked) e.target.style.background = "rgba(0,229,255,0.08)"; }}
                    onMouseLeave={(e) => { if (!questionLocked) e.target.style.background = C.cellBg; }}>
                    {opt}
                  </button>
                );
              })}
            </div>
            {questionFeedback && (
              <p style={{
                marginTop: 12, fontSize: 14, fontWeight: 700, textAlign: "center",
                color: questionFeedback === "correct" ? C.correct : C.wrong,
              }}>
                {questionFeedback === "correct" ? "✓ Correct! Dropping your piece..." : "✗ Wrong — turn skipped!"}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Finished overlay */}
      {isFinished && (
        <div style={{
          marginTop: 16, padding: 16, borderRadius: 12, textAlign: "center",
          background: C.surface, border: `1px solid ${C.border}`,
        }}>
          <div style={{
            fontSize: 20, fontWeight: 900, fontFamily: FONT_DISPLAY, marginBottom: 8,
            color: game.isDraw ? C.p1 : game.winnerUid === user?.uid ? C.correct : C.wrong,
          }}>
            {game.isDraw ? "🤝 Draw!" : game.winnerUid === user?.uid ? "🏆 You Won!" : "Game Over"}
          </div>
          <button onClick={onBack} style={{
            padding: "10px 24px", borderRadius: 10, border: "none",
            background: C.p1, color: C.bg, fontWeight: 700, fontSize: 14,
            cursor: "pointer", fontFamily: FONT_BODY,
          }}>
            Play Again
          </button>
        </div>
      )}

      {/* Score tracker (bottom-right) */}
      <ScoreTracker gamesCompleted={gamesCompleted} />
    </div>
  );
}

// ═══════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════

function PlayerTag({ name, color, glow, active, isAI }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8, padding: "6px 14px",
      borderRadius: 10, background: active ? glow : "transparent",
      border: `2px solid ${active ? color : C.border}`,
      transition: "all 0.3s",
    }}>
      <div style={{
        width: 16, height: 16, borderRadius: "50%", background: color,
        boxShadow: active ? `0 0 10px ${color}` : "none",
      }} />
      <span style={{
        fontSize: 13, fontWeight: 700, color: active ? color : C.text2,
        fontFamily: FONT_DISPLAY,
      }}>
        {name}
      </span>
    </div>
  );
}

function ScoreTracker({ gamesCompleted }) {
  const s = getScore(gamesCompleted);
  return (
    <div style={{
      position: "absolute", bottom: 12, right: 12,
      background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10,
      padding: "6px 12px", fontSize: 11, color: C.text2, fontFamily: FONT_BODY,
      display: "flex", alignItems: "center", gap: 6, zIndex: 10,
    }}>
      <span>📊</span>
      <span>{gamesCompleted}/3 games</span>
      <span style={{ color: C.p1, fontWeight: 700 }}>{s.pct}%</span>
    </div>
  );
}

function Section({ title, color, children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <h4 style={{
        margin: "0 0 6px", fontSize: 13, fontWeight: 700,
        color: color || C.text2, textTransform: "uppercase",
        letterSpacing: "0.04em", fontFamily: FONT_DISPLAY,
      }}>
        {title}
      </h4>
      {children}
    </div>
  );
}

function GameRow({ children, bg, onClick }) {
  return (
    <div onClick={onClick} style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "8px 12px", borderRadius: 8, border: `1px solid ${C.border}`,
      marginBottom: 4, transition: "background 0.15s",
      background: bg || "transparent",
      cursor: onClick ? "pointer" : "default",
    }}
      onMouseEnter={(e) => { if (onClick) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
      onMouseLeave={(e) => { if (onClick) e.currentTarget.style.background = bg || "transparent"; }}>
      {children}
    </div>
  );
}

function SmallBtn({ children, color, onClick }) {
  return (
    <button onClick={(e) => { e.stopPropagation(); onClick(); }}
      style={{
        padding: "4px 12px", borderRadius: 6, border: "none",
        background: color || C.p2, color: C.bg,
        fontWeight: 700, fontSize: 11, cursor: "pointer", fontFamily: FONT_BODY,
      }}>
      {children}
    </button>
  );
}
