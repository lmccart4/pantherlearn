// src/pages/TeamManager.jsx
// Teacher-only page for managing teams per course.
// Route: /teams/:courseId

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import {
  getTeams, createTeam, deleteTeam, updateTeam,
  addMemberToTeam, removeMemberFromTeam,
  getTeamConfig, saveTeamConfig, autoAssignTeams,
  TEAM_COLORS,
} from "../lib/teams";
import { resolveFirstName, resolveDisplayName } from "../lib/displayName";

export default function TeamManager() {
  const { courseId } = useParams();
  const { userRole } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [teams, setTeams] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [config, setConfig] = useState({ enabled: false, teamSize: 4, draftMode: false, xpSharePercent: 25 });
  const [saving, setSaving] = useState(false);

  // New team form
  const [showNewTeam, setShowNewTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamColor, setNewTeamColor] = useState("red");

  // Auto-assign
  const [showAutoAssign, setShowAutoAssign] = useState(false);

  // Section filter
  const [sectionFilter, setSectionFilter] = useState("all");

  // Drag and drop
  const [draggedStudent, setDraggedStudent] = useState(null);
  const [dragSource, setDragSource] = useState(null); // teamId or "unassigned"
  const [dropTarget, setDropTarget] = useState(null);

  // Inline team name editing
  const [editingTeamName, setEditingTeamName] = useState(null); // teamId being edited
  const [editNameValue, setEditNameValue] = useState("");

  useEffect(() => {
    if (userRole !== "teacher") { navigate("/"); return; }
    loadData();
  }, [courseId, userRole]);

  async function loadData() {
    setLoading(true);
    try {
      const courseDoc = await getDoc(doc(db, "courses", courseId));
      if (courseDoc.exists()) setCourse({ id: courseDoc.id, ...courseDoc.data() });

      // Load users first (needed for nickname enrichment)
      const usersSnap = await getDocs(collection(db, "users"));
      const usersById = {};
      const usersByEmail = {};
      usersSnap.forEach((d) => {
        const data = d.data();
        usersById[d.id] = data;
        if (data.email) usersByEmail[data.email.toLowerCase()] = { uid: d.id, ...data };
      });

      const teamsData = await getTeams(courseId);
      // Enrich team members with nicknames from user docs
      for (const team of teamsData) {
        team.members = team.members.map((m) => {
          const userData = usersById[m.uid];
          return { ...m, nickname: userData?.nickname || null };
        });
      }
      setTeams(teamsData);

      const cfg = await getTeamConfig(courseId);
      setConfig(cfg);

      // Load enrolled students for this course
      const enrollSnap = await getDocs(collection(db, "enrollments"));
      const enrolledForCourse = [];
      enrollSnap.forEach((d) => {
        const data = d.data();
        if (data.courseId === courseId) {
          enrolledForCourse.push(data);
        }
      });

      const students = [];
      for (const enrollment of enrolledForCourse) {
        const email = (enrollment.email || "").toLowerCase();
        const matchedUser = (enrollment.uid && usersById[enrollment.uid])
          ? { uid: enrollment.uid, ...usersById[enrollment.uid] }
          : usersByEmail[email] || null;

        students.push({
          uid: matchedUser?.uid || enrollment.uid || email.replace(/[^a-z0-9]/g, "_"),
          displayName: matchedUser?.displayName || enrollment.name || email.split("@")[0],
          email: enrollment.email || matchedUser?.email || "",
          photoURL: matchedUser?.photoURL || "",
          section: enrollment.section || "",
          nickname: matchedUser?.nickname || null,
        });
      }
      setAllStudents(students);
    } catch (err) {
      console.error("Error loading team data:", err);
    }
    setLoading(false);
  }

  // Students not on any team
  const assignedUids = new Set(teams.flatMap((t) => t.members.map((m) => m.uid)));
  const unassigned = allStudents.filter((s) => !assignedUids.has(s.uid));

  // Available sections
  const sections = [...new Set(allStudents.map((s) => s.section).filter(Boolean))].sort();

  // Filtered views based on section filter
  const filteredStudents = sectionFilter === "all" ? allStudents : allStudents.filter((s) => s.section === sectionFilter);
  const filteredTeams = sectionFilter === "all" ? teams : teams.filter((t) =>
    t.section === sectionFilter || (!t.section && t.members.some((m) => {
      const student = allStudents.find((s) => s.uid === m.uid);
      return student?.section === sectionFilter;
    }))
  );
  const filteredUnassigned = sectionFilter === "all" ? unassigned : unassigned.filter((s) => s.section === sectionFilter);

  async function handleCreateTeam() {
    if (!newTeamName.trim()) return;
    const section = sectionFilter !== "all" ? sectionFilter : "";
    await createTeam(courseId, { name: newTeamName.trim(), color: newTeamColor, section });
    setNewTeamName("");
    setShowNewTeam(false);
    await loadData();
  }

  async function handleDeleteTeam(teamId) {
    if (!confirm("Delete this team? Members will become unassigned.")) return;
    await deleteTeam(courseId, teamId);
    await loadData();
  }

  async function handleRenameTeam(teamId) {
    const trimmed = editNameValue.trim();
    if (!trimmed) return;
    await updateTeam(courseId, teamId, { name: trimmed });
    setEditingTeamName(null);
    setEditNameValue("");
    await loadData();
  }

  async function handleAssignStudent(teamId, student) {
    // Remove from current team if on one
    const currentTeam = teams.find((t) => t.members.some((m) => m.uid === student.uid));
    if (currentTeam) {
      await removeMemberFromTeam(courseId, currentTeam.id, student.uid);
    }
    await addMemberToTeam(courseId, teamId, student);
    await loadData();
  }

  async function handleRemoveStudent(teamId, studentUid) {
    await removeMemberFromTeam(courseId, teamId, studentUid);
    await loadData();
  }

  async function handleAutoAssign() {
    const studentsToAssign = sectionFilter === "all" ? allStudents : filteredStudents;
    const teamsToReplace = sectionFilter === "all" ? teams : filteredTeams;
    const section = sectionFilter !== "all" ? sectionFilter : "";

    if (teamsToReplace.length > 0) {
      const msg = sectionFilter === "all"
        ? "This will delete ALL existing teams and create new ones. Continue?"
        : `This will delete existing ${sectionFilter} teams and create new ones. Continue?`;
      if (!confirm(msg)) return;
      for (const team of teamsToReplace) {
        await deleteTeam(courseId, team.id);
      }
    }
    await autoAssignTeams(courseId, studentsToAssign, config.teamSize, null, section);
    setShowAutoAssign(false);
    await loadData();
  }

  async function handleSaveConfig(updates) {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    await saveTeamConfig(courseId, newConfig);
  }

  function getColorObj(colorId) {
    return TEAM_COLORS.find((c) => c.id === colorId) || TEAM_COLORS[0];
  }

  // ─── Drag & Drop Handlers ───
  function handleDragStart(student, sourceId) {
    setDraggedStudent(student);
    setDragSource(sourceId);
  }

  function handleDragEnd() {
    setDraggedStudent(null);
    setDragSource(null);
    setDropTarget(null);
  }

  function handleDragOver(e, targetId) {
    e.preventDefault();
    setDropTarget(targetId);
  }

  function handleDragLeave() {
    setDropTarget(null);
  }

  async function handleDrop(e, targetTeamId) {
    e.preventDefault();
    setDropTarget(null);
    if (!draggedStudent) return;

    if (targetTeamId === "unassigned") {
      // Dropping back to unassigned — remove from current team
      if (dragSource && dragSource !== "unassigned") {
        await handleRemoveStudent(dragSource, draggedStudent.uid);
      }
    } else {
      // Dropping onto a team
      await handleAssignStudent(targetTeamId, draggedStudent);
    }
    setDraggedStudent(null);
    setDragSource(null);
  }

  // ─── Styles ───
  const pageStyle = { padding: "32px 24px", maxWidth: 900, margin: "0 auto", color: "var(--text1, #e8e8e8)" };
  const cardStyle = { background: "var(--surface, #1e1e2e)", borderRadius: 12, padding: "20px", marginBottom: 16, border: "1px solid var(--border, #2a2a3a)" };
  const btnPrimary = { padding: "8px 16px", borderRadius: 8, border: "none", background: "var(--accent, #6c5ce7)", color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 13 };
  const btnSecondary = { padding: "8px 16px", borderRadius: 8, border: "1px solid var(--border, #2a2a3a)", background: "transparent", color: "var(--text2, #aaa)", cursor: "pointer", fontSize: 13 };
  const btnDanger = { padding: "4px 10px", borderRadius: 6, border: "none", background: "#e74c3c33", color: "#e74c3c", cursor: "pointer", fontSize: 12 };
  const chipStyle = { display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 10px", borderRadius: 20, fontSize: 12, background: "var(--surface2, #252535)", border: "1px solid var(--border, #2a2a3a)" };

  if (loading) return <div style={pageStyle}><div style={{ display: "flex", justifyContent: "center", padding: 60 }}><div className="spinner" /></div></div>;

  return (
    <div style={pageStyle}>
      {/* Header */}
      <button onClick={() => navigate(-1)} style={{ ...btnSecondary, marginBottom: 12 }}>← Back</button>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, fontFamily: "var(--font-display)" }}>
            👥 Team Manager
          </h1>
          <p style={{ color: "var(--text2, #aaa)", fontSize: 14, marginTop: 4 }}>
            {course?.title} — {filteredStudents.length} students, {filteredTeams.length} teams
            {sectionFilter !== "all" && ` (${sectionFilter})`}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setShowAutoAssign(true)} style={btnSecondary}>🎲 Auto-Assign</button>
          <button onClick={() => setShowNewTeam(true)} style={btnPrimary}>+ New Team</button>
        </div>
      </div>

      {/* Section Filter */}
      {sections.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <span style={{ fontSize: 13, color: "var(--text2)", fontWeight: 600 }}>Filter by period:</span>
          <select
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
            style={{
              padding: "6px 12px", borderRadius: 8, border: "1px solid var(--border)",
              background: "var(--surface2, #252535)", color: "var(--text1)", fontSize: 13,
              fontFamily: "var(--font-body)",
            }}
          >
            <option value="all">All Students ({allStudents.length}) · {teams.length} teams</option>
            {sections.map((s) => {
              const sectionTeamCount = teams.filter((t) =>
                t.section === s || (!t.section && t.members.some((m) => {
                  const student = allStudents.find((st) => st.uid === m.uid);
                  return student?.section === s;
                }))
              ).length;
              return (
                <option key={s} value={s}>{s} ({allStudents.filter((st) => st.section === s).length} students · {sectionTeamCount} teams)</option>
              );
            })}
          </select>
          {sectionFilter !== "all" && (
            <span style={{ fontSize: 12, color: "var(--text3)" }}>
              {filteredUnassigned.length} unassigned in {sectionFilter}
            </span>
          )}
        </div>
      )}

      {/* Config Panel */}
      <div style={cardStyle}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>⚙️ Team Settings</div>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center" }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={(e) => handleSaveConfig({ enabled: e.target.checked })}
              style={{ accentColor: "var(--accent, #6c5ce7)" }}
            />
            Teams enabled
          </label>
          <label style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
            Team size:
            <select
              value={config.teamSize}
              onChange={(e) => handleSaveConfig({ teamSize: parseInt(e.target.value) })}
              style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--surface2)", color: "var(--text1)", fontSize: 13 }}
            >
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
          </label>
          <label style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
            XP share:
            <select
              value={config.xpSharePercent}
              onChange={(e) => handleSaveConfig({ xpSharePercent: parseInt(e.target.value) })}
              style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--surface2)", color: "var(--text1)", fontSize: 13 }}
            >
              <option value={10}>10%</option>
              <option value={15}>15%</option>
              <option value={20}>20%</option>
              <option value={25}>25%</option>
              <option value={33}>33%</option>
              <option value={50}>50%</option>
            </select>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
            <input
              type="checkbox"
              checked={config.draftMode}
              onChange={(e) => handleSaveConfig({ draftMode: e.target.checked })}
              style={{ accentColor: "var(--accent, #6c5ce7)" }}
            />
            Student draft mode
          </label>
        </div>
      </div>

      {/* Auto-Assign Modal */}
      {showAutoAssign && (
        <div style={cardStyle}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>🎲 Auto-Assign Teams</div>
          <p style={{ fontSize: 13, color: "var(--text2)", marginBottom: 12 }}>
            Randomly shuffle {sectionFilter === "all" ? `all ${allStudents.length}` : `${filteredStudents.length} ${sectionFilter}`} students into balanced teams of {config.teamSize}.
            {teams.length > 0 && <span style={{ color: "#e74c3c" }}> This will replace existing teams.</span>}
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handleAutoAssign} style={btnPrimary}>Shuffle & Create</button>
            <button onClick={() => setShowAutoAssign(false)} style={btnSecondary}>Cancel</button>
          </div>
        </div>
      )}

      {/* New Team Form */}
      {showNewTeam && (
        <div style={cardStyle}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>
            + New Team{sectionFilter !== "all" && <span style={{ fontWeight: 400, fontSize: 13, color: "var(--text2)" }}> — {sectionFilter}</span>}
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
            <div>
              <label style={{ fontSize: 12, color: "var(--text2)", display: "block", marginBottom: 4 }}>Team Name</label>
              <input
                type="text" value={newTeamName} placeholder="e.g. Alpha, Bravo..."
                onChange={(e) => setNewTeamName(e.target.value)}
                style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface2)", color: "var(--text1)", fontSize: 14, width: 180 }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--text2)", display: "block", marginBottom: 4 }}>Color</label>
              <div style={{ display: "flex", gap: 4 }}>
                {TEAM_COLORS.map((c) => (
                  <button key={c.id} onClick={() => setNewTeamColor(c.id)} style={{
                    width: 28, height: 28, borderRadius: 6, border: newTeamColor === c.id ? "2px solid #fff" : "2px solid transparent",
                    background: c.hex, cursor: "pointer",
                  }} title={c.label} />
                ))}
              </div>
            </div>
            <button onClick={handleCreateTeam} disabled={!newTeamName.trim()} style={{ ...btnPrimary, opacity: newTeamName.trim() ? 1 : 0.5 }}>Create</button>
            <button onClick={() => setShowNewTeam(false)} style={btnSecondary}>Cancel</button>
          </div>
        </div>
      )}

      {/* Teams Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginBottom: 24 }}>
        {filteredTeams.map((team) => {
          const color = getColorObj(team.color);
          const isOver = dropTarget === team.id;
          const overCap = team.members.length > config.teamSize;
          return (
            <div
              key={team.id}
              onDragOver={(e) => handleDragOver(e, team.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, team.id)}
              style={{
                ...cardStyle, marginBottom: 0,
                borderColor: isOver ? color.hex : color.hex + "44",
                borderTop: `3px solid ${color.hex}`,
                boxShadow: isOver ? `0 0 16px ${color.hex}33` : "none",
                transition: "box-shadow 0.2s, border-color 0.2s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: color.hex, flexShrink: 0 }} />
                  {editingTeamName === team.id ? (
                    <input
                      type="text" value={editNameValue} autoFocus
                      onChange={(e) => setEditNameValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleRenameTeam(team.id);
                        if (e.key === "Escape") setEditingTeamName(null);
                      }}
                      onBlur={() => handleRenameTeam(team.id)}
                      style={{
                        fontWeight: 700, fontSize: 16, padding: "2px 6px", borderRadius: 4,
                        border: `1px solid ${color.hex}`, background: "var(--surface2)",
                        color: "var(--text1)", width: 120, fontFamily: "inherit",
                      }}
                    />
                  ) : (
                    <span
                      onDoubleClick={() => { setEditingTeamName(team.id); setEditNameValue(team.name); }}
                      style={{ fontWeight: 700, fontSize: 16, cursor: "text" }}
                      title="Double-click to rename"
                    >{team.name}</span>
                  )}
                  <span style={{ fontSize: 11, color: overCap ? "var(--amber)" : "var(--text3)" }}>
                    {team.members.length}/{config.teamSize}
                  </span>
                  {team.section && sectionFilter === "all" && (
                    <span style={{
                      fontSize: 10, padding: "1px 6px", borderRadius: 4,
                      background: "var(--surface2)", color: "var(--text3)",
                      border: "1px solid var(--border)", whiteSpace: "nowrap",
                    }}>{team.section}</span>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, color: "var(--amber)", fontWeight: 600 }}>
                    {team.teamXP || 0} XP
                  </span>
                  <button onClick={() => handleDeleteTeam(team.id)} style={btnDanger} title="Delete team">✕</button>
                </div>
              </div>

              {/* Members */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12, minHeight: 40 }}>
                {team.members.length === 0 && !isOver && (
                  <div style={{ fontSize: 12, color: "var(--text3)", fontStyle: "italic", padding: 8, textAlign: "center" }}>
                    Drop students here
                  </div>
                )}
                {isOver && team.members.length === 0 && (
                  <div style={{ fontSize: 12, color: color.hex, fontStyle: "italic", padding: 8, textAlign: "center", background: color.dim, borderRadius: 8 }}>
                    Drop to add to {team.name}
                  </div>
                )}
                {team.members.map((m) => (
                  <div
                    key={m.uid}
                    draggable
                    onDragStart={() => handleDragStart(m, team.id)}
                    onDragEnd={handleDragEnd}
                    style={{
                      display: "flex", alignItems: "center", gap: 8, padding: "6px 8px",
                      background: "var(--surface2, #252535)", borderRadius: 8,
                      cursor: "grab", userSelect: "none",
                    }}
                  >
                    <span style={{ fontSize: 10, color: "var(--text3)", cursor: "grab" }}>⠿</span>
                    {m.photoURL ? (
                      <img src={m.photoURL} style={{ width: 24, height: 24, borderRadius: "50%" }} alt="" referrerPolicy="no-referrer" />
                    ) : (
                      <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>👤</div>
                    )}
                    <span style={{ fontSize: 13, flex: 1 }}>{resolveFirstName({ displayName: m.displayName, nickname: m.nickname, isTeacherViewing: true })}</span>
                    <button onClick={() => handleRemoveStudent(team.id, m.uid)} style={{ ...btnDanger, padding: "2px 6px", fontSize: 10 }}>✕</button>
                  </div>
                ))}
              </div>

              {/* Over-cap warning */}
              {overCap && (
                <div style={{ fontSize: 10, color: "var(--amber)", textAlign: "center", marginBottom: 6 }}>
                  ⚠️ Over team size ({team.members.length}/{config.teamSize})
                </div>
              )}

              {/* Add student dropdown — always available */}
              {filteredUnassigned.length > 0 && (
                <select
                  defaultValue=""
                  onChange={(e) => {
                    const student = filteredUnassigned.find((s) => s.uid === e.target.value);
                    if (student) handleAssignStudent(team.id, student);
                    e.target.value = "";
                  }}
                  style={{
                    width: "100%", padding: "6px 10px", borderRadius: 8,
                    border: "1px dashed var(--border)", background: "transparent",
                    color: "var(--text2)", fontSize: 12, cursor: "pointer",
                  }}
                >
                  <option value="" disabled>+ Add student...</option>
                  {filteredUnassigned.map((s) => (
                    <option key={s.uid} value={s.uid}>{resolveDisplayName({ displayName: s.displayName, nickname: s.nickname, isTeacherViewing: true })}{s.section ? ` (${s.section})` : ""}</option>
                  ))}
                </select>
              )}
            </div>
          );
        })}
      </div>

      {/* Unassigned Students */}
      {filteredUnassigned.length > 0 && (
        <div
          onDragOver={(e) => handleDragOver(e, "unassigned")}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, "unassigned")}
          style={{
            ...cardStyle,
            borderColor: dropTarget === "unassigned" ? "var(--amber)" : "var(--border)",
            boxShadow: dropTarget === "unassigned" ? "0 0 16px rgba(245,166,35,0.15)" : "none",
            transition: "box-shadow 0.2s, border-color 0.2s",
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>
            🚫 Unassigned ({filteredUnassigned.length}{sectionFilter !== "all" ? ` in ${sectionFilter}` : ""})
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {filteredUnassigned.map((s) => (
              <div
                key={s.uid}
                draggable
                onDragStart={() => handleDragStart(s, "unassigned")}
                onDragEnd={handleDragEnd}
                style={{
                  ...chipStyle,
                  cursor: "grab", userSelect: "none",
                }}
              >
                <span style={{ fontSize: 10, color: "var(--text3)", cursor: "grab" }}>⠿</span>
                {s.photoURL ? (
                  <img src={s.photoURL} style={{ width: 18, height: 18, borderRadius: "50%" }} alt="" referrerPolicy="no-referrer" />
                ) : (
                  <span style={{ fontSize: 12 }}>👤</span>
                )}
                <span>{resolveFirstName({ displayName: s.displayName, nickname: s.nickname, isTeacherViewing: true })}{s.section && sectionFilter === "all" ? ` · ${s.section}` : ""}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
