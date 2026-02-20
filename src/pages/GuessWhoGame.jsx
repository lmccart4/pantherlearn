// src/pages/GuessWhoGame.jsx
// Full-page Guess Who? game — 1v1 turn-based face guessing game

import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  subscribeToGame,
  askQuestion,
  answerQuestion,
  toggleEliminate,
  makeGuess,
  forfeitGame,
} from "../lib/guessWho";

export default function GuessWhoGame() {
  const { courseId, gameId } = useParams();
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [questionInput, setQuestionInput] = useState("");
  const [sending, setSending] = useState(false);
  const [showGuessModal, setShowGuessModal] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [showForfeitConfirm, setShowForfeitConfirm] = useState(false);
  const moveLogRef = useRef(null);

  const isTeacher = userRole === "teacher";

  // Subscribe to game
  useEffect(() => {
    if (!courseId || !gameId) return;
    const unsub = subscribeToGame(courseId, gameId, (data) => {
      setGame(data);
      setLoading(false);
      if (data.status === "finished") setShowGameOver(true);
    });
    return () => unsub();
  }, [courseId, gameId]);

  // Auto-scroll move log
  useEffect(() => {
    if (moveLogRef.current) {
      moveLogRef.current.scrollTop = moveLogRef.current.scrollHeight;
    }
  }, [game?.moves?.length]);

  if (loading) {
    return (
      <div className="page-container" style={{ display: "flex", justifyContent: "center", paddingTop: 120 }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="page-container" style={{ textAlign: "center", paddingTop: 120 }}>
        <h2 style={{ color: "var(--text)" }}>Game not found</h2>
        <button onClick={() => navigate(-1)} style={linkBtnStyle}>← Go back</button>
      </div>
    );
  }

  // Determine player role
  const isChallenger = user?.uid === game.challengerUid;
  const isOpponent = user?.uid === game.opponentUid;
  const isPlayer = isChallenger || isOpponent;
  const isSpectator = !isPlayer;
  const playerRole = isChallenger ? "challenger" : "opponent";
  const myName = isChallenger ? game.challengerName : game.opponentName;
  const opponentName = isChallenger ? game.opponentName : game.challengerName;

  // My secret character
  const mySecretId = isChallenger ? game.challengerSecretId : game.opponentSecretId;
  const mySecret = game.characters?.find((c) => c.id === mySecretId);

  // My eliminated characters
  const myEliminated = isChallenger ? (game.challengerEliminated || []) : (game.opponentEliminated || []);
  const remaining = (game.characters?.length || 0) - myEliminated.length;

  // Turn logic
  const isMyTurn = game.status === "active" && game.turn === playerRole;
  const lastMove = game.moves?.length > 0 ? game.moves[game.moves.length - 1] : null;
  const waitingForAnswer = lastMove?.type === "question" && lastMove?.answer === null;
  const myTurnToAnswer = waitingForAnswer && lastMove.playerUid !== user?.uid;
  const myTurnToAsk = isMyTurn && !waitingForAnswer;

  // Handle ask question
  const handleAsk = async () => {
    if (!questionInput.trim() || sending) return;
    setSending(true);
    try {
      await askQuestion(courseId, gameId, user.uid, questionInput.trim());
      setQuestionInput("");
    } catch (e) {
      console.error("Ask failed:", e);
      alert(e.message || "Failed to ask question");
    }
    setSending(false);
  };

  // Handle answer
  const handleAnswer = async (answer) => {
    if (sending) return;
    setSending(true);
    try {
      await answerQuestion(courseId, gameId, user.uid, answer);
    } catch (e) {
      console.error("Answer failed:", e);
      alert(e.message || "Failed to answer");
    }
    setSending(false);
  };

  // Handle eliminate
  const handleEliminate = async (charId) => {
    if (game.status !== "active" || !isPlayer) return;
    // Don't allow eliminating your own secret
    if (charId === mySecretId) return;
    try {
      await toggleEliminate(courseId, gameId, user.uid, charId);
    } catch (e) {
      console.error("Eliminate failed:", e);
    }
  };

  // Handle final guess
  const handleGuess = async (charId) => {
    setSending(true);
    setShowGuessModal(false);
    try {
      await makeGuess(courseId, gameId, user.uid, charId);
    } catch (e) {
      console.error("Guess failed:", e);
      alert(e.message || "Failed to make guess");
    }
    setSending(false);
  };

  // Handle forfeit
  const handleForfeit = async () => {
    setShowForfeitConfirm(false);
    try {
      await forfeitGame(courseId, gameId, user.uid);
    } catch (e) {
      console.error("Forfeit failed:", e);
    }
  };

  // Get turn status text
  const getTurnStatus = () => {
    if (game.status === "finished") return "Game Over";
    if (isSpectator) {
      const turnName = game.turn === "challenger" ? game.challengerName : game.opponentName;
      return `${turnName}'s turn`;
    }
    if (myTurnToAnswer) return "Answer the question!";
    if (waitingForAnswer && !myTurnToAnswer) return "Waiting for answer...";
    if (myTurnToAsk) return "Your turn — ask a question!";
    return "Opponent's turn...";
  };

  return (
    <div className="page-container" style={{ paddingTop: 80, maxWidth: 1200, margin: "0 auto" }}>
      {/* Top Bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 16, flexWrap: "wrap", gap: 8,
      }}>
        <button onClick={() => navigate(-1)} style={linkBtnStyle}>← Back to lesson</button>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-display)" }}>
          🎭 Guess Who?
        </h2>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {isSpectator && <span style={{ fontSize: 12, color: "var(--amber)", fontWeight: 700 }}>👁 Spectating</span>}
          <span style={{ fontSize: 13, color: "var(--text2)" }}>
            <strong>{game.challengerName}</strong> vs. <strong>{game.opponentName}</strong>
          </span>
        </div>
      </div>

      {/* Turn indicator */}
      <div style={{
        textAlign: "center", padding: "10px 16px", borderRadius: 10, marginBottom: 16,
        background: myTurnToAsk || myTurnToAnswer
          ? "rgba(245,166,35,0.1)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${myTurnToAsk || myTurnToAnswer ? "var(--amber)" : "var(--border)"}`,
        fontWeight: 700, fontSize: 14,
        color: myTurnToAsk || myTurnToAnswer ? "var(--amber)" : "var(--text2)",
      }}>
        {getTurnStatus()}
      </div>

      {/* Main Layout: Grid + Panel side by side */}
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        {/* Character Grid */}
        <div style={{ flex: "1 1 0", minWidth: 0 }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(8, 1fr)",
            gap: 4,
          }}>
            {(game.characters || []).map((char) => {
              const eliminated = myEliminated.includes(char.id);
              const isMySecret = char.id === mySecretId;
              return (
                <div key={char.id}
                  onClick={() => handleEliminate(char.id)}
                  style={{
                    position: "relative", cursor: isPlayer && game.status === "active" ? "pointer" : "default",
                    borderRadius: 8, overflow: "hidden",
                    border: isMySecret ? "2px solid var(--amber)" : "1px solid var(--border)",
                    opacity: eliminated ? 0.2 : 1,
                    transition: "opacity 0.2s, transform 0.1s",
                    transform: eliminated ? "scale(0.95)" : "scale(1)",
                    background: "var(--surface)",
                  }}>
                  <img
                    src={char.imageUrl}
                    alt={char.name}
                    style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }}
                    loading="lazy"
                  />
                  <div style={{
                    padding: "3px 4px", textAlign: "center",
                    fontSize: 10, fontWeight: 600, color: "var(--text)",
                    background: "rgba(0,0,0,0.5)",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>
                    {char.name}
                  </div>
                  {/* X overlay for eliminated */}
                  {eliminated && (
                    <div style={{
                      position: "absolute", inset: 0, display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: 36, color: "var(--red)",
                      fontWeight: 900, textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                      pointerEvents: "none",
                    }}>
                      ✕
                    </div>
                  )}
                  {/* Gold star for my secret */}
                  {isMySecret && !isSpectator && (
                    <div style={{
                      position: "absolute", top: 2, right: 2, fontSize: 12,
                      background: "var(--amber)", borderRadius: "50%", width: 18, height: 18,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                    }}>
                      ⭐
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* My secret + remaining count */}
          {isPlayer && (
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginTop: 12, padding: "8px 12px", borderRadius: 10,
              background: "rgba(245,166,35,0.06)", border: "1px solid var(--border)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, color: "var(--text3)" }}>Your character:</span>
                {mySecret && (
                  <>
                    <img src={mySecret.imageUrl} alt={mySecret.name}
                      style={{ width: 28, height: 28, borderRadius: 6, objectFit: "cover", border: "1px solid var(--amber)" }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--amber)" }}>{mySecret.name}</span>
                  </>
                )}
              </div>
              <span style={{ fontSize: 12, color: "var(--text2)" }}>
                Remaining: <strong>{remaining}</strong>/{game.characters?.length}
              </span>
            </div>
          )}
        </div>

        {/* Q&A Panel */}
        <div style={{
          width: 340, flexShrink: 0,
          background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12,
          display: "flex", flexDirection: "column", maxHeight: "calc(100vh - 200px)",
        }}>
          {/* Move log */}
          <div ref={moveLogRef} style={{
            flex: 1, overflowY: "auto", padding: 12,
            display: "flex", flexDirection: "column", gap: 6,
            minHeight: 200,
          }}>
            {(!game.moves || game.moves.length === 0) && (
              <p style={{ textAlign: "center", color: "var(--text3)", fontSize: 12, padding: 24 }}>
                No moves yet. {myTurnToAsk ? "Ask the first question!" : "Waiting for first question..."}
              </p>
            )}
            {(game.moves || []).map((move, i) => {
              const isMe = move.playerUid === user?.uid;
              const moverName = move.playerUid === game.challengerUid ? game.challengerName : game.opponentName;

              if (move.type === "question") {
                return (
                  <div key={i}>
                    <div style={{
                      padding: "8px 12px", borderRadius: 10,
                      background: isMe ? "rgba(245,166,35,0.1)" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${isMe ? "rgba(245,166,35,0.2)" : "var(--border)"}`,
                    }}>
                      <div style={{ fontSize: 10, color: "var(--text3)", marginBottom: 2 }}>
                        {isSpectator ? moverName : (isMe ? "You" : opponentName)} asked:
                      </div>
                      <div style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>
                        {move.text}
                      </div>
                    </div>
                    {move.answer !== null && (
                      <div style={{
                        margin: "4px 0 0 20px", padding: "4px 10px", borderRadius: 8,
                        display: "inline-block",
                        background: move.answer === "yes" ? "rgba(52,216,168,0.12)" : "rgba(239,68,68,0.12)",
                        color: move.answer === "yes" ? "var(--green)" : "var(--red)",
                        fontSize: 13, fontWeight: 700,
                      }}>
                        {move.answer === "yes" ? "✓ Yes" : "✕ No"}
                      </div>
                    )}
                    {move.answer === null && (
                      <div style={{ margin: "4px 0 0 20px", fontSize: 11, color: "var(--text3)", fontStyle: "italic" }}>
                        Waiting for answer...
                      </div>
                    )}
                  </div>
                );
              }

              if (move.type === "guess") {
                const guessedChar = game.characters?.find((c) => c.id === move.characterId);
                return (
                  <div key={i} style={{
                    padding: "8px 12px", borderRadius: 10, textAlign: "center",
                    background: move.correct ? "rgba(52,216,168,0.1)" : "rgba(239,68,68,0.1)",
                    border: `1px solid ${move.correct ? "var(--green)" : "var(--red)"}`,
                  }}>
                    <div style={{ fontSize: 11, color: "var(--text3)" }}>
                      {isSpectator ? moverName : (isMe ? "You" : opponentName)} guessed:
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: move.correct ? "var(--green)" : "var(--red)", marginTop: 2 }}>
                      {guessedChar?.name || "Unknown"} — {move.correct ? "Correct!" : "Wrong!"}
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>

          {/* Input area */}
          {isPlayer && game.status === "active" && (
            <div style={{ padding: 12, borderTop: "1px solid var(--border)" }}>
              {/* Answering mode */}
              {myTurnToAnswer && lastMove && (
                <div>
                  <p style={{ fontSize: 12, color: "var(--text2)", margin: "0 0 8px" }}>
                    Answer honestly based on your secret character:
                  </p>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => handleAnswer("yes")} disabled={sending}
                      style={{
                        flex: 1, padding: "10px 0", borderRadius: 8, border: "none", cursor: "pointer",
                        background: "var(--green)", color: "#1a1a1a", fontWeight: 700, fontSize: 14,
                        opacity: sending ? 0.5 : 1,
                      }}>
                      ✓ Yes
                    </button>
                    <button onClick={() => handleAnswer("no")} disabled={sending}
                      style={{
                        flex: 1, padding: "10px 0", borderRadius: 8, border: "none", cursor: "pointer",
                        background: "var(--red)", color: "#fff", fontWeight: 700, fontSize: 14,
                        opacity: sending ? 0.5 : 1,
                      }}>
                      ✕ No
                    </button>
                  </div>
                </div>
              )}

              {/* Asking mode */}
              {myTurnToAsk && (
                <div style={{ display: "flex", gap: 6 }}>
                  <input
                    value={questionInput}
                    onChange={(e) => setQuestionInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleAsk()}
                    placeholder="Ask a yes/no question..."
                    style={{
                      flex: 1, padding: "8px 12px", borderRadius: 8,
                      border: "1px solid var(--border)", background: "var(--bg)",
                      color: "var(--text)", fontSize: 13, outline: "none",
                    }}
                  />
                  <button onClick={handleAsk} disabled={!questionInput.trim() || sending}
                    style={{
                      padding: "8px 14px", borderRadius: 8, border: "none", cursor: "pointer",
                      background: "var(--amber)", color: "#1a1a1a", fontWeight: 700, fontSize: 13,
                      opacity: (!questionInput.trim() || sending) ? 0.5 : 1,
                    }}>
                    Ask
                  </button>
                </div>
              )}

              {/* Waiting */}
              {!myTurnToAsk && !myTurnToAnswer && (
                <p style={{ textAlign: "center", color: "var(--text3)", fontSize: 12, margin: 0 }}>
                  Waiting for opponent...
                </p>
              )}

              {/* Final guess — always available when it's your turn */}
              {isMyTurn && (
                <button onClick={() => setShowGuessModal(true)} disabled={sending}
                  style={{
                    width: "100%", marginTop: 8, padding: "8px 0", borderRadius: 8,
                    border: "1px solid var(--purple)", background: "rgba(176,142,255,0.08)",
                    color: "var(--purple)", fontWeight: 700, fontSize: 13, cursor: "pointer",
                  }}>
                  🎯 Make Final Guess
                </button>
              )}

              {/* Forfeit */}
              <button onClick={() => setShowForfeitConfirm(true)}
                style={{
                  width: "100%", marginTop: 8, padding: "6px 0", borderRadius: 6,
                  border: "none", background: "transparent", color: "var(--text3)",
                  fontSize: 11, cursor: "pointer",
                }}>
                Forfeit game
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Guess Modal */}
      {showGuessModal && (
        <Modal onClose={() => setShowGuessModal(false)}>
          <h3 style={{ margin: "0 0 8px", fontSize: 18, color: "var(--text)", fontFamily: "var(--font-display)" }}>
            🎯 Make Your Final Guess
          </h3>
          <p style={{ fontSize: 13, color: "var(--text2)", marginBottom: 12 }}>
            If you guess wrong, <strong>you lose!</strong> Select your opponent's secret character:
          </p>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 4,
            maxHeight: 400, overflowY: "auto",
          }}>
            {(game.characters || []).map((char) => {
              const eliminated = myEliminated.includes(char.id);
              const isMySecret = char.id === mySecretId;
              if (isMySecret || eliminated) return null;
              return (
                <div key={char.id}
                  onClick={() => {
                    if (window.confirm(`Guess ${char.name}? If you're wrong, you LOSE!`)) {
                      handleGuess(char.id);
                    }
                  }}
                  style={{
                    cursor: "pointer", borderRadius: 8, overflow: "hidden",
                    border: "1px solid var(--border)", transition: "border-color 0.15s",
                    background: "var(--surface)",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--amber)"}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border)"}>
                  <img src={char.imageUrl} alt={char.name}
                    style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }} />
                  <div style={{ padding: "2px 4px", textAlign: "center", fontSize: 9, fontWeight: 600, color: "var(--text)", background: "rgba(0,0,0,0.5)" }}>
                    {char.name}
                  </div>
                </div>
              );
            })}
          </div>
        </Modal>
      )}

      {/* Game Over Modal */}
      {showGameOver && game.status === "finished" && (
        <Modal onClose={() => setShowGameOver(false)}>
          <div style={{ textAlign: "center" }}>
            {game.winnerUid === user?.uid ? (
              <>
                <div style={{ fontSize: 48, marginBottom: 8 }}>🏆</div>
                <h3 style={{ margin: 0, fontSize: 22, color: "var(--green)", fontFamily: "var(--font-display)" }}>
                  You Won!
                </h3>
                <p style={{ color: "var(--text2)", fontSize: 14, margin: "8px 0" }}>
                  +{game.xpForWin} XP
                </p>
              </>
            ) : isPlayer ? (
              <>
                <div style={{ fontSize: 48, marginBottom: 8 }}>😞</div>
                <h3 style={{ margin: 0, fontSize: 22, color: "var(--red)", fontFamily: "var(--font-display)" }}>
                  You Lost
                </h3>
                <p style={{ color: "var(--text2)", fontSize: 14, margin: "8px 0" }}>
                  +{game.xpForPlay} XP for playing
                </p>
              </>
            ) : (
              <>
                <div style={{ fontSize: 48, marginBottom: 8 }}>🎭</div>
                <h3 style={{ margin: 0, fontSize: 22, color: "var(--text)", fontFamily: "var(--font-display)" }}>
                  Game Over
                </h3>
              </>
            )}

            {/* Reveal secrets */}
            <div style={{
              display: "flex", justifyContent: "center", gap: 24, marginTop: 16,
              padding: 16, background: "rgba(255,255,255,0.03)", borderRadius: 12,
            }}>
              <SecretReveal
                label={game.challengerName}
                character={game.characters?.find((c) => c.id === game.challengerSecretId)}
                isWinner={game.winnerUid === game.challengerUid}
              />
              <div style={{ fontSize: 24, color: "var(--text3)", alignSelf: "center" }}>vs.</div>
              <SecretReveal
                label={game.opponentName}
                character={game.characters?.find((c) => c.id === game.opponentSecretId)}
                isWinner={game.winnerUid === game.opponentUid}
              />
            </div>

            <button onClick={() => navigate(-1)}
              style={{
                marginTop: 20, padding: "10px 28px", borderRadius: 10, border: "none",
                background: "var(--amber)", color: "#1a1a1a", fontWeight: 700, fontSize: 14, cursor: "pointer",
              }}>
              Back to Lesson
            </button>
          </div>
        </Modal>
      )}

      {/* Forfeit Confirm Modal */}
      {showForfeitConfirm && (
        <Modal onClose={() => setShowForfeitConfirm(false)}>
          <div style={{ textAlign: "center" }}>
            <h3 style={{ margin: "0 0 8px", fontSize: 18, color: "var(--text)" }}>Forfeit Game?</h3>
            <p style={{ color: "var(--text2)", fontSize: 13 }}>
              Your opponent will win. You'll still receive {game.xpForPlay} XP for playing.
            </p>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 16 }}>
              <button onClick={() => setShowForfeitConfirm(false)}
                style={{ padding: "8px 20px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)", cursor: "pointer", fontWeight: 600 }}>
                Cancel
              </button>
              <button onClick={handleForfeit}
                style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: "var(--red)", color: "#fff", cursor: "pointer", fontWeight: 700 }}>
                Forfeit
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Subcomponents ───

function Modal({ children, onClose }) {
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 16,
        padding: 24, maxWidth: 700, width: "100%", maxHeight: "85vh", overflowY: "auto",
        boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
      }}>
        {children}
      </div>
    </div>
  );
}

function SecretReveal({ label, character, isWinner }) {
  return (
    <div style={{ textAlign: "center" }}>
      {character && (
        <img src={character.imageUrl} alt={character.name}
          style={{
            width: 80, height: 80, borderRadius: 12, objectFit: "cover",
            border: `2px solid ${isWinner ? "var(--green)" : "var(--border)"}`,
          }} />
      )}
      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginTop: 4 }}>
        {character?.name || "?"}
      </div>
      <div style={{ fontSize: 11, color: isWinner ? "var(--green)" : "var(--text3)" }}>
        {label} {isWinner ? "🏆" : ""}
      </div>
    </div>
  );
}

const linkBtnStyle = {
  background: "none", border: "none", color: "var(--text2)",
  cursor: "pointer", fontSize: 13, fontWeight: 600,
  padding: "4px 0",
};
