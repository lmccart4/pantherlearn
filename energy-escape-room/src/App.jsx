import { useState, useEffect, useCallback, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, signInWithGoogle, logOut } from "./lib/firebase";
import { reportScore, courseId } from "./lib/pantherlearn";
import { ROOMS, buildPuzzleSet } from "./rooms";

// ─── Styles ──────────────────────────────────────────────
const fonts = "'Inter', system-ui, sans-serif";
const mono = "'Space Mono', monospace";

const s = {
  page: {
    minHeight: "100vh",
    background: "#0a0a0f",
    color: "#e2e8f0",
    fontFamily: fonts,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  card: {
    background: "#14141f",
    border: "1px solid #1e293b",
    borderRadius: 16,
    padding: "32px",
    maxWidth: 640,
    width: "100%",
    boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
  },
  title: {
    fontFamily: mono,
    fontSize: 28,
    fontWeight: 700,
    margin: "0 0 8px 0",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: 14,
    margin: "0 0 24px 0",
  },
  btn: (color = "#6366f1") => ({
    background: color,
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "14px 28px",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: fonts,
    transition: "opacity 0.15s, transform 0.1s",
  }),
  btnOutline: {
    background: "transparent",
    color: "#94a3b8",
    border: "1px solid #334155",
    borderRadius: 10,
    padding: "12px 24px",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: fonts,
  },
  option: (selected, correct, revealed) => ({
    background: revealed
      ? correct
        ? "rgba(16,185,129,0.15)"
        : selected
          ? "rgba(239,68,68,0.15)"
          : "#1e1e2e"
      : selected
        ? "rgba(99,102,241,0.2)"
        : "#1e1e2e",
    border: `2px solid ${
      revealed
        ? correct
          ? "#10b981"
          : selected
            ? "#ef4444"
            : "#334155"
        : selected
          ? "#6366f1"
          : "#334155"
    }`,
    borderRadius: 10,
    padding: "14px 18px",
    fontSize: 15,
    color: "#e2e8f0",
    cursor: revealed ? "default" : "pointer",
    fontFamily: fonts,
    textAlign: "left",
    width: "100%",
    transition: "all 0.15s",
  }),
  progress: {
    display: "flex",
    gap: 6,
    marginBottom: 24,
  },
  progressDot: (active, complete, color) => ({
    flex: 1,
    height: 6,
    borderRadius: 3,
    background: complete ? color : active ? color + "80" : "#1e293b",
    transition: "background 0.3s",
  }),
  code: {
    fontFamily: mono,
    fontSize: 32,
    letterSpacing: 8,
    color: "#10b981",
    textAlign: "center",
    padding: "16px",
    background: "#0f1a15",
    borderRadius: 10,
    border: "1px solid #10b98140",
  },
  hintBox: {
    background: "#1e1b2e",
    border: "1px solid #6366f140",
    borderRadius: 10,
    padding: "12px 16px",
    fontSize: 14,
    color: "#c4b5fd",
    marginTop: 12,
  },
  timer: {
    fontFamily: mono,
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "right",
  },
  roomHeader: (color) => ({
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
    padding: "12px 16px",
    background: color + "15",
    borderRadius: 10,
    border: `1px solid ${color}30`,
  }),
  roomIcon: { fontSize: 28 },
  roomName: {
    fontFamily: mono,
    fontSize: 18,
    fontWeight: 700,
    margin: 0,
  },
  roomLabel: {
    fontSize: 12,
    color: "#94a3b8",
    margin: 0,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  narrative: {
    fontSize: 14,
    lineHeight: 1.7,
    color: "#cbd5e1",
    marginBottom: 20,
    fontStyle: "italic",
    padding: "12px 16px",
    borderLeft: "3px solid #334155",
    background: "#111119",
    borderRadius: "0 8px 8px 0",
  },
  scoreCard: (color) => ({
    background: color + "10",
    border: `1px solid ${color}30`,
    borderRadius: 10,
    padding: "12px 16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  }),
};

// ─── Sign In Screen ──────────────────────────────────────
function SignIn({ error }) {
  return (
    <div style={s.page}>
      <div style={{ ...s.card, textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔐</div>
        <h1 style={s.title}>Energy Escape Room</h1>
        <p style={s.subtitle}>
          Solve physics puzzles. Crack the code. Escape.
        </p>
        {error && (
          <p style={{ color: "#ef4444", fontSize: 14, marginBottom: 16 }}>
            {error}
          </p>
        )}
        <button
          style={s.btn("#6366f1")}
          onClick={() => signInWithGoogle()}
          onMouseDown={(e) => (e.target.style.transform = "scale(0.97)")}
          onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
        >
          Sign in with Google
        </button>
        <p style={{ color: "#475569", fontSize: 12, marginTop: 16 }}>
          Use your @paps.net school account
        </p>
      </div>
    </div>
  );
}

// ─── Intro Screen ────────────────────────────────────────
function Intro({ user, onStart }) {
  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🔐</div>
        <h1 style={s.title}>Energy Escape Room</h1>
        <p style={{ color: "#94a3b8", fontSize: 15, lineHeight: 1.7, marginBottom: 20 }}>
          You're locked in a research facility. The only way out is through{" "}
          <strong style={{ color: "#e2e8f0" }}>5 rooms</strong>, each sealed
          with a physics-powered lock.
        </p>
        <p style={{ color: "#94a3b8", fontSize: 15, lineHeight: 1.7, marginBottom: 20 }}>
          Solve the energy problem in each room to get a{" "}
          <span style={{ fontFamily: mono, color: "#10b981" }}>code digit</span>.
          All 5 digits unlock the final exit.
        </p>
        <div
          style={{
            background: "#111119",
            borderRadius: 10,
            padding: "16px",
            marginBottom: 24,
          }}
        >
          <p style={{ color: "#94a3b8", fontSize: 13, margin: "0 0 8px 0" }}>
            TOPICS COVERED
          </p>
          {ROOMS.map((r) => (
            <div
              key={r.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 0",
                color: r.color,
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              <span>{r.icon}</span>
              <span>{r.name}</span>
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            gap: 8,
            fontSize: 13,
            color: "#64748b",
            marginBottom: 24,
          }}
        >
          <span>
            ✦ Correct on first try = <strong style={{ color: "#10b981" }}>20 pts</strong>
          </span>
          <span style={{ color: "#334155" }}>|</span>
          <span>
            Hint used = <strong style={{ color: "#f59e0b" }}>-5 pts</strong>
          </span>
          <span style={{ color: "#334155" }}>|</span>
          <span>
            Wrong answer = <strong style={{ color: "#ef4444" }}>-5 pts</strong>
          </span>
        </div>
        <button
          style={s.btn("#6366f1")}
          onClick={onStart}
          onMouseDown={(e) => (e.target.style.transform = "scale(0.97)")}
          onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
        >
          Enter the Facility
        </button>
        <p style={{ color: "#475569", fontSize: 12, marginTop: 12 }}>
          Signed in as {user.displayName || user.email}
        </p>
      </div>
    </div>
  );
}

// ─── Room Screen ─────────────────────────────────────────
function Room({
  roomIndex,
  room,
  puzzle,
  onSolve,
  earnedCodes,
  totalRooms,
}) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleSelect = (idx) => {
    if (revealed) return;
    setSelected(idx);
  };

  const handleSubmit = () => {
    if (selected === null || revealed) return;
    setRevealed(true);
    const correct = selected === puzzle.correctIndex;
    const newAttempts = attempts + (correct ? 0 : 1);
    setAttempts(newAttempts);

    if (correct) {
      // Calculate points: 20 base, -5 per wrong attempt, -5 if hint used
      const points = Math.max(0, 20 - newAttempts * 5 - (hintUsed ? 5 : 0));
      setTimeout(() => onSolve(points, puzzle.codeDigit), 1800);
    } else {
      // Let them try again after seeing the feedback
      setTimeout(() => {
        setSelected(null);
        setRevealed(false);
      }, 2200);
    }
  };

  const handleHint = () => {
    setHintUsed(true);
    setShowHint(true);
  };

  const isCorrect = selected === puzzle.correctIndex;

  return (
    <div style={s.page}>
      <div style={s.card}>
        {/* Progress bar */}
        <div style={s.progress}>
          {Array.from({ length: totalRooms }).map((_, i) => (
            <div
              key={i}
              style={s.progressDot(
                i === roomIndex,
                i < roomIndex,
                ROOMS[i]?.color || "#6366f1"
              )}
            />
          ))}
        </div>

        {/* Room header */}
        <div style={s.roomHeader(room.color)}>
          <span style={s.roomIcon}>{room.icon}</span>
          <div>
            <p style={s.roomLabel}>Room {roomIndex + 1} of {totalRooms}</p>
            <p style={{ ...s.roomName, color: room.color }}>{room.name}</p>
          </div>
        </div>

        {/* Narrative */}
        <div style={s.narrative}>{room.narrative}</div>

        {/* Setup */}
        <p style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.7, marginBottom: 8 }}>
          {puzzle.setup}
        </p>

        {/* Question */}
        <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
          {puzzle.question}
        </p>

        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          {puzzle.options.map((opt, idx) => (
            <button
              key={idx}
              style={s.option(
                selected === idx,
                idx === puzzle.correctIndex,
                revealed
              )}
              onClick={() => handleSelect(idx)}
            >
              <span style={{ fontWeight: 600, marginRight: 8, color: "#64748b" }}>
                {String.fromCharCode(65 + idx)}.
              </span>
              {opt}
            </button>
          ))}
        </div>

        {/* Feedback */}
        {revealed && (
          <div
            style={{
              padding: "12px 16px",
              borderRadius: 10,
              marginBottom: 12,
              background: isCorrect ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
              border: `1px solid ${isCorrect ? "#10b98140" : "#ef444440"}`,
              fontSize: 14,
              lineHeight: 1.6,
              color: isCorrect ? "#6ee7b7" : "#fca5a5",
            }}
          >
            {isCorrect ? (
              <>
                <strong>Correct!</strong> {puzzle.explanation}
                <div
                  style={{
                    marginTop: 12,
                    textAlign: "center",
                    fontFamily: mono,
                    fontSize: 18,
                  }}
                >
                  Code digit revealed:{" "}
                  <span
                    style={{
                      fontSize: 28,
                      color: "#10b981",
                      fontWeight: 700,
                    }}
                  >
                    {puzzle.codeDigit}
                  </span>
                </div>
              </>
            ) : (
              <>
                <strong>Not quite.</strong> Read the explanation and try again.
                <div style={{ marginTop: 8, color: "#cbd5e1" }}>
                  {puzzle.explanation}
                </div>
              </>
            )}
          </div>
        )}

        {/* Hint */}
        {showHint && (
          <div style={s.hintBox}>
            <strong>Hint:</strong> {puzzle.hint}
          </div>
        )}

        {/* Earned codes so far */}
        {earnedCodes.length > 0 && (
          <div style={{ marginTop: 12, marginBottom: 12 }}>
            <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 6px 0", textTransform: "uppercase", letterSpacing: 1 }}>
              Code so far
            </p>
            <div
              style={{
                fontFamily: mono,
                fontSize: 24,
                letterSpacing: 6,
                color: "#10b981",
              }}
            >
              {earnedCodes.join("")}
              {Array.from({ length: totalRooms - earnedCodes.length }).map(
                (_, i) => (
                  <span key={i} style={{ color: "#334155" }}>
                    ?
                  </span>
                )
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          {!revealed && (
            <>
              <button
                style={{
                  ...s.btn(room.color),
                  opacity: selected === null ? 0.4 : 1,
                  flex: 1,
                }}
                disabled={selected === null}
                onClick={handleSubmit}
              >
                Submit Answer
              </button>
              {!hintUsed && (
                <button style={s.btnOutline} onClick={handleHint}>
                  Hint (-5 pts)
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Results Screen ──────────────────────────────────────
function Results({ score, maxScore, codes, roomScores, submitted, onRetry, onSignOut }) {
  const pct = Math.round((score / maxScore) * 100);
  const grade =
    pct >= 90
      ? { label: "A", color: "#10b981" }
      : pct >= 80
        ? { label: "B", color: "#6366f1" }
        : pct >= 70
          ? { label: "C", color: "#f59e0b" }
          : pct >= 60
            ? { label: "D", color: "#f97316" }
            : { label: "F", color: "#ef4444" };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>
            {pct >= 80 ? "🎉" : pct >= 60 ? "🔓" : "🔒"}
          </div>
          <h1 style={{ ...s.title, color: grade.color }}>
            {pct >= 80
              ? "You Escaped!"
              : pct >= 60
                ? "Almost There..."
                : "Locked In"}
          </h1>
          <p style={s.subtitle}>
            {pct >= 80
              ? "The facility doors swing open. Freedom."
              : pct >= 60
                ? "You got out, but barely. Review and try again for a better score."
                : "The locks held. Study up and try again."}
          </p>
        </div>

        {/* Final code */}
        <div style={s.code}>{codes.join("")}</div>
        <p
          style={{
            textAlign: "center",
            fontSize: 12,
            color: "#64748b",
            marginTop: 4,
            marginBottom: 20,
          }}
        >
          YOUR EXIT CODE
        </p>

        {/* Score */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 24,
            padding: "16px",
            background: grade.color + "10",
            borderRadius: 10,
            border: `1px solid ${grade.color}30`,
          }}
        >
          <div
            style={{
              fontFamily: mono,
              fontSize: 48,
              fontWeight: 700,
              color: grade.color,
            }}
          >
            {score}/{maxScore}
          </div>
          <div style={{ fontSize: 14, color: "#94a3b8", marginTop: 4 }}>
            {pct}% — Grade: {grade.label}
          </div>
        </div>

        {/* Room breakdown */}
        <p
          style={{
            fontSize: 12,
            color: "#64748b",
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 8,
          }}
        >
          Room Breakdown
        </p>
        {ROOMS.map((room, i) => (
          <div key={room.id} style={s.scoreCard(room.color)}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span>{room.icon}</span>
              <span style={{ fontSize: 14, fontWeight: 500 }}>{room.name}</span>
            </div>
            <span
              style={{
                fontFamily: mono,
                fontSize: 16,
                fontWeight: 700,
                color: roomScores[i] === 20 ? "#10b981" : roomScores[i] >= 10 ? "#f59e0b" : "#ef4444",
              }}
            >
              {roomScores[i]}/20
            </span>
          </div>
        ))}

        {/* Score submitted badge */}
        {submitted && (
          <div
            style={{
              textAlign: "center",
              marginTop: 16,
              padding: "8px",
              color: "#10b981",
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            ✓ Score Submitted
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
          <button style={{ ...s.btn("#6366f1"), flex: 1 }} onClick={onRetry}>
            Try Again
          </button>
          <button style={s.btnOutline} onClick={onSignOut}>
            Sign Out
          </button>
        </div>
        <p
          style={{
            textAlign: "center",
            fontSize: 12,
            color: "#475569",
            marginTop: 8,
          }}
        >
          Only your highest score is kept.
        </p>
      </div>
    </div>
  );
}

// ─── App ─────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const [screen, setScreen] = useState("signin");
  const [puzzleSet, setPuzzleSet] = useState([]);
  const [roomIndex, setRoomIndex] = useState(0);
  const [earnedCodes, setEarnedCodes] = useState([]);
  const [roomScores, setRoomScores] = useState([]);
  const [usedIds, setUsedIds] = useState([]);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);

  // Auth
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const email = firebaseUser.email || "";
        if (!email.toLowerCase().endsWith("@paps.net")) {
          setAuthError("Please use your @paps.net school account.");
          logOut();
          setUser(null);
        } else {
          setUser(firebaseUser);
          setAuthError(null);
          setScreen("intro");
        }
      } else {
        setUser(null);
        setScreen("signin");
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const startGame = useCallback(() => {
    const set = buildPuzzleSet(usedIds);
    const newUsedIds = [...usedIds, ...set.map((s) => s.puzzle.id)];
    setUsedIds(newUsedIds);
    setPuzzleSet(set);
    setRoomIndex(0);
    setEarnedCodes([]);
    setRoomScores([]);
    setScoreSubmitted(false);
    setScreen("playing");
  }, [usedIds]);

  // Auto-submit score on results screen
  const handleFinish = useCallback(
    async (finalScores, finalCodes) => {
      const totalScore = finalScores.reduce((a, b) => a + b, 0);
      const maxScore = ROOMS.length * 20;

      // Report to PantherLearn parent
      reportScore("energy-escape-room", totalScore, maxScore, {
        rooms: ROOMS.map((r, i) => ({
          name: r.name,
          score: finalScores[i],
          max: 20,
        })),
        code: finalCodes.join(""),
      });

      setScoreSubmitted(true);

      // Save to Firestore
      if (!user) return;
      try {
        const docRef = doc(db, "energyEscapeRoom", user.uid);
        const existing = await getDoc(docRef);
        const existingScore = existing.exists()
          ? existing.data().score ?? -1
          : -1;

        if (totalScore > existingScore) {
          await setDoc(
            docRef,
            {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || "",
              score: totalScore,
              maxScore,
              percent: Math.round((totalScore / maxScore) * 100),
              rooms: ROOMS.map((r, i) => ({
                id: r.id,
                name: r.name,
                score: finalScores[i],
              })),
              code: finalCodes.join(""),
              completedAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          );
        }

        // Auto-grade if embedded with courseId
        if (courseId) {
          const gradeRef = doc(
            db,
            "progress",
            user.uid,
            "courses",
            courseId,
            "activities",
            "energy-escape-room"
          );
          const existingGrade = await getDoc(gradeRef);
          const oldScore = existingGrade.exists()
            ? existingGrade.data().activityScore ?? -1
            : -1;
          const normalized = totalScore / maxScore;

          if (normalized > oldScore) {
            await setDoc(
              gradeRef,
              {
                activityScore: normalized,
                activityLabel: `${totalScore}/${maxScore}`,
                activityType: "energy-escape-room",
                activityTitle: "Energy Escape Room",
                gradedAt: serverTimestamp(),
              },
              { merge: true }
            );
          }
        }
      } catch (err) {
        console.error("Failed to save score:", err);
      }
    },
    [user]
  );

  const handleRoomSolve = useCallback(
    (points, codeDigit) => {
      const newCodes = [...earnedCodes, codeDigit];
      const newScores = [...roomScores, points];
      setEarnedCodes(newCodes);
      setRoomScores(newScores);

      if (roomIndex + 1 >= ROOMS.length) {
        // All rooms done
        setScreen("results");
        handleFinish(newScores, newCodes);
      } else {
        setRoomIndex(roomIndex + 1);
      }
    },
    [roomIndex, earnedCodes, roomScores, handleFinish]
  );

  // ─── Render ────────────────────────────────────────────
  if (loading) {
    return (
      <div style={s.page}>
        <div style={{ fontFamily: mono, color: "#64748b" }}>Loading...</div>
      </div>
    );
  }

  if (screen === "signin" || !user) {
    return <SignIn error={authError} />;
  }

  if (screen === "intro") {
    return <Intro user={user} onStart={startGame} />;
  }

  if (screen === "playing" && puzzleSet.length > 0) {
    const { room, puzzle } = puzzleSet[roomIndex];
    return (
      <Room
        key={`${room.id}-${puzzle.id}`}
        roomIndex={roomIndex}
        room={room}
        puzzle={puzzle}
        onSolve={handleRoomSolve}
        earnedCodes={earnedCodes}
        totalRooms={ROOMS.length}
      />
    );
  }

  if (screen === "results") {
    return (
      <Results
        score={roomScores.reduce((a, b) => a + b, 0)}
        maxScore={ROOMS.length * 20}
        codes={earnedCodes}
        roomScores={roomScores}
        submitted={scoreSubmitted}
        onRetry={startGame}
        onSignOut={() => logOut()}
      />
    );
  }

  return null;
}
