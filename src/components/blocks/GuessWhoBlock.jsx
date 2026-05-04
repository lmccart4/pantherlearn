// src/components/blocks/GuessWhoBlock.jsx
// In-lesson challenge board for Guess Who? — shows challenges, lets students create/accept games

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import {
  DEFAULT_CHARACTERS,
  createChallenge,
  createAIGame,
  acceptChallenge,
  cancelChallenge,
  declineChallenge,
  subscribeToBlockGames,
  AI_BOT_UID,
} from "../../lib/guessWho";
import { supportsAI } from "../../lib/guessWhoAI";
import "./GuessWhoBlock.css";

export default function GuessWhoBlock({ block, courseId, lessonId }) {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [classmates, setClassmates] = useState([]);
  const [showDirectPicker, setShowDirectPicker] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  const isTeacher = userRole === "teacher";

  const characters = block.characterSet === "custom" && block.customCharacters?.length >= 2
    ? block.customCharacters.map((c, i) => ({ id: c.id || `custom_${i}`, name: c.name, imageUrl: c.imageUrl }))
    : DEFAULT_CHARACTERS;

  useEffect(() => {
    if (!courseId || !block.id) return;
    const unsub = subscribeToBlockGames(courseId, block.id, (data) => {
      setGames(data);
      setError(null);
    }, (err) => {
      console.error("Games subscription error:", err);
      if (err.message?.includes("index")) {
        setError("Firestore index needed — check browser console for a link to create it.");
      } else {
        setError(err.message || "Failed to load games");
      }
    });
    return () => unsub();
  }, [courseId, block.id]);

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
          } catch (_) {}
        }

        setClassmates(enrolled);
      } catch (e) {
        console.error("Failed to fetch classmates:", e);
      }
    };
    fetchClassmates();
  }, [courseId, user, isTeacher]);

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

  const handleCreateOpen = async () => {
    if (creating || !user) return;
    setCreating(true);
    setError(null);
    try {
      await createChallenge({
        courseId, blockId: block.id, lessonId,
        challengerUid: user.uid, challengerName: user.displayName || "Anonymous",
        characters,
        challengeType: "open",
        xpForWin: block.xpForWin || 50,
        xpForPlay: block.xpForPlay || 10,
      });
    } catch (e) {
      console.error("Failed to create challenge:", e);
      setError(e.message || "Failed to create challenge. Check console for details.");
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
        characters,
        challengeType: "direct",
        targetOpponentUid: target.uid,
        targetOpponentName: target.name,
        xpForWin: block.xpForWin || 50,
        xpForPlay: block.xpForPlay || 10,
      });
    } catch (e) {
      console.error("Failed to create direct challenge:", e);
      setError(e.message || "Failed to create challenge. Check console for details.");
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
      navigate(`/guess-who/${courseId}/${gameId}`);
    } catch (e) {
      console.error("Failed to accept challenge:", e);
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
        characters,
        xpForWin: block.xpForWin || 50,
        xpForPlay: block.xpForPlay || 10,
      });
      navigate(`/guess-who/${courseId}/${gameId}`);
    } catch (e) {
      console.error("Failed to create AI game:", e);
      setError(e.message || "Failed to start AI game.");
    }
    setCreating(false);
  };

  const canPlayAI = supportsAI(characters);

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
    <div className="gw-block">
      <div className="gw-head">
        <span className="gw-icon" aria-hidden>{block.icon || "🎭"}</span>
        <div>
          <h3 className="gw-title">{block.title || "Guess Who?"}</h3>
          {block.instructions && <p className="gw-instructions">{block.instructions}</p>}
        </div>
      </div>

      <div className="gw-meta">
        <span>🏆 Win: +{block.xpForWin || 50} XP</span>
        <span>🎮 Play: +{block.xpForPlay || 10} XP</span>
        <span>👥 {characters.length} characters</span>
      </div>

      <div className="gw-actions">
        {canPlayAI && (
          <button onClick={handlePlayAI} disabled={creating} className="gw-btn gw-btn-ai">
            🤖 Play vs AI
          </button>
        )}
        <button onClick={handleCreateOpen} disabled={creating} className="gw-btn gw-btn-open">
          ⚔️ Challenge Anyone
        </button>
        <div className="gw-direct-wrap">
          <button onClick={() => setShowDirectPicker(!showDirectPicker)} disabled={creating} className="gw-btn gw-btn-direct">
            🎯 {isTeacher ? "Challenge Student" : "Challenge Classmate"}
          </button>
          {showDirectPicker && (
            <div className="gw-picker">
              {classmates.length === 0 && (
                <p className="gw-picker-empty">
                  {isTeacher ? "No students found" : "No classmates found"}
                </p>
              )}
              {classmates.map((c) => (
                <button key={c.uid} onClick={() => handleCreateDirect(c)} className="gw-picker-row">
                  {c.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {error && <div className="gw-error">⚠️ {error}</div>}

      {directToMe.length > 0 && (
        <Section title="🎯 Challenges for You" tone="warn">
          {directToMe.map((g) => (
            <GameRow key={g.id} highlight="warn">
              <span className="gw-row-text">
                {g.challengerName} challenged you!
              </span>
              <div className="gw-row-actions">
                <SmallBtn tone="success" onClick={() => handleAccept(g.id)}>Accept</SmallBtn>
                <SmallBtn tone="danger" onClick={() => handleDecline(g.id)}>Decline</SmallBtn>
              </div>
            </GameRow>
          ))}
        </Section>
      )}

      {openChallenges.length > 0 && (
        <Section title="⚔️ Open Challenges">
          {openChallenges.map((g) => (
            <GameRow key={g.id}>
              <span className="gw-row-text">
                <strong>{g.challengerName}</strong> is looking for an opponent
                <span className="gw-row-time">{timeAgo(g.createdAt)}</span>
              </span>
              <SmallBtn tone="warn" onClick={() => handleAccept(g.id)}>Accept</SmallBtn>
            </GameRow>
          ))}
        </Section>
      )}

      {myWaiting.length > 0 && (
        <Section title="⏳ Your Pending Challenges">
          {myWaiting.map((g) => (
            <GameRow key={g.id}>
              <span className="gw-row-muted">
                {g.challengeType === "direct" ? `Waiting for ${g.targetOpponentName}...` : "Waiting for opponent..."}
                <span className="gw-row-time">{timeAgo(g.createdAt)}</span>
              </span>
              <SmallBtn tone="danger" onClick={() => handleCancel(g.id)}>Cancel</SmallBtn>
            </GameRow>
          ))}
        </Section>
      )}

      {activeGames.length > 0 && (
        <Section title="🎮 Active Games" tone="success">
          {activeGames.map((g) => {
            const isAI = g.opponentUid === AI_BOT_UID || g.challengerUid === AI_BOT_UID;
            const opponent = (g.challengerUid === user?.uid ? g.opponentName : g.challengerName) + (isAI ? " 🤖" : "");
            const isMyTurn = (g.challengerUid === user?.uid && g.turn === "challenger")
              || (g.opponentUid === user?.uid && g.turn === "opponent");
            const lastMove = g.moves?.length > 0 ? g.moves[g.moves.length - 1] : null;
            const waitingForAnswer = lastMove?.type === "question" && lastMove?.answer === null;
            const myTurnToAnswer = waitingForAnswer && lastMove.playerUid !== user?.uid;

            return (
              <GameRow key={g.id} clickable onClick={() => navigate(`/guess-who/${courseId}/${g.id}`)}>
                <span className="gw-row-text">
                  vs. <strong>{opponent}</strong>
                  {myTurnToAnswer
                    ? <span className="gw-turn-warn">Answer their question!</span>
                    : isMyTurn
                      ? <span className="gw-turn-go">Your turn!</span>
                      : <span className="gw-turn-wait">Waiting...</span>
                  }
                </span>
                <span className="gw-arrow">→</span>
              </GameRow>
            );
          })}
        </Section>
      )}

      {recentFinished.length > 0 && (
        <Section title="📊 Recent Results">
          {recentFinished.map((g) => {
            const isAI = g.opponentUid === AI_BOT_UID || g.challengerUid === AI_BOT_UID;
            const opponent = (g.challengerUid === user?.uid ? g.opponentName : g.challengerName) + (isAI ? " 🤖" : "");
            const won = g.winnerUid === user?.uid;
            return (
              <GameRow key={g.id} clickable onClick={() => navigate(`/guess-who/${courseId}/${g.id}`)}>
                <span className="gw-row-text">
                  vs. <strong>{opponent}</strong>
                  <span className={`gw-result ${won ? "is-win" : "is-loss"}`}>
                    {won ? "Won!" : "Lost"}
                  </span>
                  <span className="gw-row-time">{timeAgo(g.updatedAt || g.createdAt)}</span>
                </span>
              </GameRow>
            );
          })}
        </Section>
      )}

      {isTeacher && (() => {
        const spectatableGames = games.filter((g) =>
          g.status === "active" && g.challengerUid !== user?.uid && g.opponentUid !== user?.uid
        );
        return spectatableGames.length > 0 ? (
          <Section title="👁 Active Games (Spectate)">
            {spectatableGames.map((g) => (
              <GameRow key={g.id} clickable onClick={() => navigate(`/guess-who/${courseId}/${g.id}`)}>
                <span className="gw-row-text">
                  <strong>{g.challengerName}</strong> vs. <strong>{g.opponentName}</strong>
                  <span className="gw-row-time">
                    {g.moves?.length || 0} moves
                  </span>
                </span>
                <span className="gw-spectate">Spectate →</span>
              </GameRow>
            ))}
          </Section>
        ) : null;
      })()}

      {games.length === 0 && (
        <p className="gw-empty">No games yet. Be the first to issue a challenge!</p>
      )}
    </div>
  );
}

function Section({ title, tone, children }) {
  return (
    <div className="gw-section">
      <h4 className={`gw-section-title ${tone ? `gw-tone-${tone}` : ""}`}>{title}</h4>
      {children}
    </div>
  );
}

function GameRow({ children, highlight, clickable, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`gw-row ${clickable ? "is-clickable" : ""} ${highlight ? `gw-row-${highlight}` : ""}`}
    >
      {children}
    </div>
  );
}

function SmallBtn({ children, tone = "warn", onClick }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`gw-small-btn gw-small-${tone}`}
    >
      {children}
    </button>
  );
}
