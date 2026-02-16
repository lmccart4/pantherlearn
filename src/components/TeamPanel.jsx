// src/components/TeamPanel.jsx
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth";
import { getStudentTeam, getTeamLeaderboard, getTeamConfig, joinTeam, leaveTeam, getTeams, updateTeam, TEAM_COLORS } from "../lib/teams";
import { resolveFirstName } from "../lib/displayName";
import { useTranslatedTexts } from "../hooks/useTranslatedText.jsx";

export default function TeamPanel({ courseId, compact = false }) {
  const { user, userRole } = useAuth();
  const isTeacher = userRole === "teacher";
  const [myTeam, setMyTeam] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [config, setConfig] = useState(null);
  const [allTeams, setAllTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState(null);
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState("");

  const uiStrings = useTranslatedTexts([
    "Join a Team",                                   // 0
    "Pick a team to join! Teams earn bonus XP together.", // 1
    "members",                                       // 2
    "Team XP",                                       // 3
    "Teammates",                                     // 4
    "You",                                           // 5
    "Team Rankings",                                 // 6
    "Your team",                                     // 7
    "Leave team",                                    // 8
    "Leave your team?",                              // 9
    "Click to rename your team",                     // 10
  ]);
  const ui = (i, fallback) => uiStrings?.[i] ?? fallback;

  useEffect(() => {
    if (!user || !courseId) return;
    loadTeamData();
  }, [user, courseId]);

  async function loadTeamData() {
    setLoading(true);
    try {
      const cfg = await getTeamConfig(courseId);
      setConfig(cfg);

      if (!cfg.enabled) {
        setLoading(false);
        return;
      }

      const team = await getStudentTeam(courseId, user.uid);
      const lb = await getTeamLeaderboard(courseId);

      const usersSnap = await getDocs(collection(db, "users"));
      const nicknameMap = {};
      usersSnap.forEach((d) => {
        const data = d.data();
        if (data.nickname) nicknameMap[d.id] = data.nickname;
      });

      const enrichMembers = (members) =>
        members.map((m) => ({ ...m, nickname: nicknameMap[m.uid] || null }));

      if (team) {
        team.members = enrichMembers(team.members);
      }
      lb.forEach((t) => { t.members = enrichMembers(t.members); });

      setMyTeam(team);
      setLeaderboard(lb);

      if (cfg.draftMode && !team) {
        const teams = await getTeams(courseId);
        setAllTeams(teams);
      }
    } catch (err) {
      console.error("Error loading team:", err);
    }
    setLoading(false);
  }

  async function handleJoinTeam(teamId) {
    setJoining(true);
    setError(null);
    try {
      await joinTeam(courseId, teamId, {
        uid: user.uid,
        displayName: user.displayName || user.email,
        email: user.email || "",
        photoURL: user.photoURL || "",
      });
      await loadTeamData();
    } catch (err) {
      setError(err.message);
    }
    setJoining(false);
  }

  async function handleLeaveTeam() {
    if (!confirm(ui(9, "Leave your team?"))) return;
    try {
      await leaveTeam(courseId, user.uid);
      await loadTeamData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleRenameTeam() {
    const trimmed = nameValue.trim();
    if (!trimmed || !myTeam) return;
    try {
      await updateTeam(courseId, myTeam.id, { name: trimmed });
      setEditingName(false);
      await loadTeamData();
    } catch (err) {
      console.error("Rename failed:", err);
    }
  }

  function getColorObj(colorId) {
    return TEAM_COLORS.find((c) => c.id === colorId) || TEAM_COLORS[0];
  }

  if (loading) return null;
  if (!config?.enabled) return null;

  // ─── Draft Mode: Student isn't on a team yet ───
  if (!myTeam && config.draftMode) {
    return (
      <div style={{
        background: "var(--surface, #1e1e2e)", borderRadius: 12, padding: "20px",
        border: "1px solid var(--border, #2a2a3a)", marginBottom: 20,
      }}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }} data-translatable>👥 {ui(0, "Join a Team")}</div>
        <p style={{ fontSize: 13, color: "var(--text2)", marginBottom: 14 }} data-translatable>
          {ui(1, "Pick a team to join! Teams earn bonus XP together.")}
        </p>
        {error && <div style={{ fontSize: 12, color: "#e74c3c", marginBottom: 8 }}>{error}</div>}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10 }}>
          {allTeams.map((team) => {
            const color = getColorObj(team.color);
            const isFull = team.members.length >= config.teamSize;
            return (
              <button
                key={team.id}
                onClick={() => !isFull && handleJoinTeam(team.id)}
                disabled={isFull || joining}
                style={{
                  padding: "14px 12px", borderRadius: 10, cursor: isFull ? "not-allowed" : "pointer",
                  background: color.dim, border: `2px solid ${color.hex}44`,
                  color: "var(--text1)", textAlign: "center", opacity: isFull ? 0.5 : 1,
                  transition: "all 0.2s",
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{team.name}</div>
                <div style={{ fontSize: 11, color: "var(--text2)" }}>
                  {team.members.length}/{config.teamSize} {ui(2, "members")}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── No team and no draft mode ───
  if (!myTeam) return null;

  const color = getColorObj(myTeam.color);
  const myTeamRank = leaderboard.findIndex((t) => t.id === myTeam.id) + 1;

  // ─── Compact mode ───
  if (compact) {
    return (
      <div style={{
        background: color.dim, borderRadius: 10, padding: "12px 14px",
        border: `1px solid ${color.hex}44`, marginBottom: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: 3, background: color.hex }} />
          <span style={{ fontWeight: 700, fontSize: 13 }}>{myTeam.name}</span>
          {myTeamRank > 0 && <span style={{ fontSize: 11, color: "var(--text2)", marginLeft: "auto" }}>#{myTeamRank}</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 12, color: color.hex, fontWeight: 600 }}>{myTeam.teamXP || 0} {ui(3, "Team XP")}</span>
          <span style={{ fontSize: 11, color: "var(--text3)" }}>· {myTeam.members.length} {ui(2, "members")}</span>
        </div>
      </div>
    );
  }

  // ─── Full team panel ───
  return (
    <div style={{
      background: "var(--surface, #1e1e2e)", borderRadius: 12, padding: "20px",
      border: `1px solid ${color.hex}44`, borderTop: `3px solid ${color.hex}`,
      marginBottom: 20,
    }}>
      {/* Team Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
          <div style={{ width: 14, height: 14, borderRadius: 4, background: color.hex, flexShrink: 0 }} />
          {editingName ? (
            <input
              type="text" value={nameValue} autoFocus maxLength={30}
              onChange={(e) => setNameValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRenameTeam();
                if (e.key === "Escape") setEditingName(false);
              }}
              onBlur={() => handleRenameTeam()}
              style={{
                fontWeight: 700, fontSize: 18, fontFamily: "var(--font-display)",
                padding: "2px 8px", borderRadius: 6,
                border: `1px solid ${color.hex}`, background: "var(--surface2, #252535)",
                color: "var(--text1)", width: 180,
              }}
            />
          ) : (
            <span
              onClick={() => { setEditingName(true); setNameValue(myTeam.name); }}
              style={{ fontWeight: 700, fontSize: 18, fontFamily: "var(--font-display)", cursor: "text" }}
              title={ui(10, "Click to rename your team")}
            >
              {myTeam.name} <span style={{ fontSize: 12, color: "var(--text3)", fontWeight: 400 }}>✏️</span>
            </span>
          )}
          {myTeamRank > 0 && (
            <span style={{
              background: myTeamRank <= 3 ? color.hex : "var(--surface2)",
              color: myTeamRank <= 3 ? "#fff" : "var(--text2)",
              padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 700,
            }}>
              #{myTeamRank}
            </span>
          )}
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: color.hex, fontFamily: "var(--font-display)" }}>
          {myTeam.teamXP || 0} <span style={{ fontSize: 12, fontWeight: 400 }} data-translatable>{ui(3, "Team XP")}</span>
        </div>
      </div>

      {/* Teammates */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }} data-translatable>
          {ui(4, "Teammates")}
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {myTeam.members.map((m) => {
            const isMe = m.uid === user?.uid;
            return (
              <div key={m.uid} style={{
                display: "flex", alignItems: "center", gap: 8, padding: "8px 12px",
                background: isMe ? color.dim : "var(--surface2, #252535)",
                border: isMe ? `1px solid ${color.hex}44` : "1px solid var(--border, #2a2a3a)",
                borderRadius: 10,
              }}>
                {m.photoURL ? (
                  <img src={m.photoURL} style={{ width: 28, height: 28, borderRadius: "50%", border: isMe ? `2px solid ${color.hex}` : "2px solid var(--border)" }} alt="" referrerPolicy="no-referrer" />
                ) : (
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>👤</div>
                )}
                <div>
                  <div style={{ fontSize: 13, fontWeight: isMe ? 700 : 500 }}>
                    {resolveFirstName({ displayName: m.displayName, nickname: m.nickname, isTeacherViewing: isTeacher })}
                    {isMe && <span style={{ color: color.hex, fontSize: 11, marginLeft: 4 }} data-translatable>{ui(5, "You")}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Team Leaderboard */}
      {leaderboard.length > 1 && (
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }} data-translatable>
            {ui(6, "Team Rankings")}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {leaderboard.map((team, i) => {
              const tc = getColorObj(team.color);
              const isMyTeam = team.id === myTeam.id;
              return (
                <div key={team.id} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "8px 12px",
                  borderRadius: 8,
                  background: isMyTeam ? tc.dim : "transparent",
                  border: isMyTeam ? `1px solid ${tc.hex}33` : "1px solid transparent",
                }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: "50%", fontSize: 11, fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: i < 3 ? tc.hex : "var(--surface2)",
                    color: i < 3 ? "#fff" : "var(--text3)",
                  }}>{i + 1}</span>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: tc.hex }} />
                  <span style={{ flex: 1, fontSize: 13, fontWeight: isMyTeam ? 700 : 400 }}>
                    {team.name}
                    {isMyTeam && <span style={{ color: tc.hex, fontSize: 11, marginLeft: 4 }} data-translatable>{ui(7, "Your team")}</span>}
                  </span>
                  <span style={{ fontSize: 12, color: "var(--text2)" }}>{team.memberCount} {ui(2, "members")}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: tc.hex }}>{team.teamXP} XP</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Leave team (draft mode only) */}
      {config.draftMode && (
        <div style={{ marginTop: 12, textAlign: "center" }}>
          <button onClick={handleLeaveTeam} style={{ fontSize: 11, color: "var(--text3)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }} data-translatable>
            {ui(8, "Leave team")}
          </button>
        </div>
      )}
    </div>
  );
}
