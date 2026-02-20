// src/components/blocks/GuessWhoBlock.jsx
// In-lesson challenge board for Guess Who? — shows challenges, lets students create/accept games

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import {
  DEFAULT_CHARACTERS,
  createChallenge,
  acceptChallenge,
  cancelChallenge,
  declineChallenge,
  subscribeToBlockGames,
} from "../../lib/guessWho";

export default function GuessWhoBlock({ block, courseId, lessonId }) {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [classmates, setClassmates] = useState([]);
  const [showDirectPicker, setShowDirectPicker] = useState(false);
  const [creating, setCreating] = useState(false);

  const isTeacher = userRole === "teacher";

  // Get characters for this block
  const characters = block.characterSet === "custom" && block.customCharacters?.length >= 2
    ? block.customCharacters.map((c, i) => ({ id: c.id || `custom_${i}`, name: c.name, imageUrl: c.imageUrl }))
    : DEFAULT_CHARACTERS;

  // Subscribe to games for this block
  useEffect(() => {
    if (!courseId || !block.id) return;
    const unsub = subscribeToBlockGames(courseId, block.id, setGames);
    return () => unsub();
  }, [courseId, block.id]);

  // Fetch classmates for direct challenge picker
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
        setClassmates(enrolled);
      } catch (e) {
        console.error("Failed to fetch classmates:", e);
      }
    };
    fetchClassmates();
  }, [courseId, user]);

  // Categorize games
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
    try {
      const gameId = await createChallenge({
        courseId, blockId: block.id, lessonId,
        challengerUid: user.uid, challengerName: user.displayName || "Anonymous",
        characters,
        challengeType: "open",
        xpForWin: block.xpForWin || 50,
        xpForPlay: block.xpForPlay || 10,
      });
      console.log("Created open challenge:", gameId);
    } catch (e) {
      console.error("Failed to create challenge:", e);
    }
    setCreating(false);
  };

  const handleCreateDirect = async (target) => {
    if (creating || !user) return;
    setCreating(true);
    setShowDirectPicker(false);
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
      background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16,
      padding: 24, marginBottom: 16,
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <span style={{ fontSize: 28 }}>{block.icon || "🎭"}</span>
        <div>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-display)" }}>
            {block.title || "Guess Who?"}
          </h3>
          {block.instructions && (
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--text2)", lineHeight: 1.5 }}>
              {block.instructions}
            </p>
          )}
        </div>
      </div>

      {/* XP Info */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16, fontSize: 12, color: "var(--text3)" }}>
        <span>🏆 Win: +{block.xpForWin || 50} XP</span>
        <span>🎮 Play: +{block.xpForPlay || 10} XP</span>
        <span>👥 {characters.length} characters</span>
      </div>

      {/* Challenge Buttons (students only) */}
      {!isTeacher && (
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          <button onClick={handleCreateOpen} disabled={creating}
            style={{
              padding: "10px 20px", borderRadius: 10, border: "none", cursor: "pointer",
              background: "var(--amber)", color: "#1a1a1a", fontWeight: 700, fontSize: 14,
              opacity: creating ? 0.5 : 1,
            }}>
            ⚔️ Challenge Anyone
          </button>
          <div style={{ position: "relative" }}>
            <button onClick={() => setShowDirectPicker(!showDirectPicker)} disabled={creating}
              style={{
                padding: "10px 20px", borderRadius: 10, border: "1px solid var(--border)",
                cursor: "pointer", background: "var(--bg)", color: "var(--text)", fontWeight: 600, fontSize: 14,
                opacity: creating ? 0.5 : 1,
              }}>
              🎯 Challenge Classmate
            </button>
            {showDirectPicker && (
              <div style={{
                position: "absolute", top: "100%", left: 0, marginTop: 4, zIndex: 20,
                background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12,
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)", maxHeight: 240, overflowY: "auto",
                minWidth: 220, padding: 4,
              }}>
                {classmates.length === 0 && (
                  <p style={{ padding: 12, fontSize: 12, color: "var(--text3)", textAlign: "center" }}>No classmates found</p>
                )}
                {classmates.map((c) => (
                  <button key={c.uid} onClick={() => handleCreateDirect(c)}
                    style={{
                      display: "block", width: "100%", padding: "8px 12px", border: "none",
                      background: "transparent", color: "var(--text)", cursor: "pointer",
                      textAlign: "left", borderRadius: 8, fontSize: 13,
                    }}
                    onMouseEnter={(e) => e.target.style.background = "rgba(245,166,35,0.08)"}
                    onMouseLeave={(e) => e.target.style.background = "transparent"}>
                    {c.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Direct Challenges to Me */}
      {directToMe.length > 0 && (
        <Section title="🎯 Challenges for You" color="var(--amber)">
          {directToMe.map((g) => (
            <GameRow key={g.id} style={{ background: "rgba(245,166,35,0.06)" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>
                {g.challengerName} challenged you!
              </span>
              <div style={{ display: "flex", gap: 6 }}>
                <SmallBtn color="var(--green)" onClick={() => handleAccept(g.id)}>Accept</SmallBtn>
                <SmallBtn color="var(--red)" onClick={() => handleDecline(g.id)}>Decline</SmallBtn>
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
              <span style={{ fontSize: 13, color: "var(--text)" }}>
                <strong>{g.challengerName}</strong> is looking for an opponent
                <span style={{ color: "var(--text3)", fontSize: 11, marginLeft: 6 }}>{timeAgo(g.createdAt)}</span>
              </span>
              {!isTeacher && (
                <SmallBtn color="var(--amber)" onClick={() => handleAccept(g.id)}>Accept</SmallBtn>
              )}
            </GameRow>
          ))}
        </Section>
      )}

      {/* My Waiting Challenges */}
      {myWaiting.length > 0 && (
        <Section title="⏳ Your Pending Challenges">
          {myWaiting.map((g) => (
            <GameRow key={g.id}>
              <span style={{ fontSize: 13, color: "var(--text2)" }}>
                {g.challengeType === "direct" ? `Waiting for ${g.targetOpponentName}...` : "Waiting for opponent..."}
                <span style={{ color: "var(--text3)", fontSize: 11, marginLeft: 6 }}>{timeAgo(g.createdAt)}</span>
              </span>
              <SmallBtn color="var(--red)" onClick={() => handleCancel(g.id)}>Cancel</SmallBtn>
            </GameRow>
          ))}
        </Section>
      )}

      {/* Active Games */}
      {activeGames.length > 0 && (
        <Section title="🎮 Active Games" color="var(--green)">
          {activeGames.map((g) => {
            const opponent = g.challengerUid === user?.uid ? g.opponentName : g.challengerName;
            const isMyTurn = (g.challengerUid === user?.uid && g.turn === "challenger")
              || (g.opponentUid === user?.uid && g.turn === "opponent");
            // Check if there's an unanswered question
            const lastMove = g.moves?.length > 0 ? g.moves[g.moves.length - 1] : null;
            const waitingForAnswer = lastMove?.type === "question" && lastMove?.answer === null;
            const myTurnToAnswer = waitingForAnswer && lastMove.playerUid !== user?.uid;

            return (
              <GameRow key={g.id} style={{ cursor: "pointer" }}
                onClick={() => navigate(`/guess-who/${courseId}/${g.id}`)}>
                <span style={{ fontSize: 13, color: "var(--text)" }}>
                  vs. <strong>{opponent}</strong>
                  {myTurnToAnswer
                    ? <span style={{ color: "var(--amber)", fontWeight: 700, marginLeft: 8 }}>Answer their question!</span>
                    : isMyTurn
                      ? <span style={{ color: "var(--green)", fontWeight: 700, marginLeft: 8 }}>Your turn!</span>
                      : <span style={{ color: "var(--text3)", marginLeft: 8 }}>Waiting...</span>
                  }
                </span>
                <span style={{ color: "var(--text3)", fontSize: 18 }}>→</span>
              </GameRow>
            );
          })}
        </Section>
      )}

      {/* Recent Results */}
      {recentFinished.length > 0 && (
        <Section title="📊 Recent Results">
          {recentFinished.map((g) => {
            const opponent = g.challengerUid === user?.uid ? g.opponentName : g.challengerName;
            const won = g.winnerUid === user?.uid;
            return (
              <GameRow key={g.id} style={{ cursor: "pointer" }}
                onClick={() => navigate(`/guess-who/${courseId}/${g.id}`)}>
                <span style={{ fontSize: 13, color: "var(--text)" }}>
                  vs. <strong>{opponent}</strong>
                  <span style={{ marginLeft: 8, fontWeight: 700, color: won ? "var(--green)" : "var(--red)" }}>
                    {won ? "Won!" : "Lost"}
                  </span>
                  <span style={{ color: "var(--text3)", fontSize: 11, marginLeft: 6 }}>{timeAgo(g.updatedAt || g.createdAt)}</span>
                </span>
              </GameRow>
            );
          })}
        </Section>
      )}

      {/* Teacher spectating view */}
      {isTeacher && games.filter((g) => g.status === "active").length > 0 && (
        <Section title="👁 Active Games (Spectate)">
          {games.filter((g) => g.status === "active").map((g) => (
            <GameRow key={g.id} style={{ cursor: "pointer" }}
              onClick={() => navigate(`/guess-who/${courseId}/${g.id}`)}>
              <span style={{ fontSize: 13, color: "var(--text)" }}>
                <strong>{g.challengerName}</strong> vs. <strong>{g.opponentName}</strong>
                <span style={{ color: "var(--text3)", fontSize: 11, marginLeft: 6 }}>
                  {g.moves?.length || 0} moves
                </span>
              </span>
              <span style={{ color: "var(--text3)", fontSize: 12 }}>Spectate →</span>
            </GameRow>
          ))}
        </Section>
      )}

      {/* Empty state */}
      {games.length === 0 && !isTeacher && (
        <p style={{ textAlign: "center", color: "var(--text3)", fontSize: 13, padding: 16 }}>
          No games yet. Be the first to issue a challenge!
        </p>
      )}
    </div>
  );
}

// ─── Subcomponents ───

function Section({ title, color, children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <h4 style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 700, color: color || "var(--text2)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
        {title}
      </h4>
      {children}
    </div>
  );
}

function GameRow({ children, style, onClick }) {
  return (
    <div onClick={onClick} style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)",
      marginBottom: 4, transition: "background 0.15s",
      ...(onClick ? { cursor: "pointer" } : {}),
      ...style,
    }}
      onMouseEnter={(e) => { if (onClick) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
      onMouseLeave={(e) => { if (onClick) e.currentTarget.style.background = style?.background || "transparent"; }}>
      {children}
    </div>
  );
}

function SmallBtn({ children, color, onClick }) {
  return (
    <button onClick={(e) => { e.stopPropagation(); onClick(); }}
      style={{
        padding: "4px 12px", borderRadius: 6, border: "none",
        background: color || "var(--amber)", color: "#1a1a1a",
        fontWeight: 700, fontSize: 11, cursor: "pointer",
      }}>
      {children}
    </button>
  );
}
