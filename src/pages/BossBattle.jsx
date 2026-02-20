// src/pages/BossBattle.jsx
// CO-OP RAID Boss Battle — all teams fight simultaneously
// Teacher: setup + spectator dashboard (English only)
// Students: answer questions at own pace, shared boss/class HP (translated)

import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { doc, getDoc, collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";
import { getTeams, TEAM_COLORS } from "../lib/teams";
import { deductMana, getManaState } from "../lib/mana";
import {
  BOSSES, ABILITIES, COUNTERATTACKS,
  createBattle, subscribeToBattle, submitAnswer, useAbilityAction,
  endBattle, listBattles, extractQuestionsFromLesson,
} from "../lib/bossBattle";
import {
  TEAM_AVATARS, BOSS_THEMES, BATTLE_CSS,
  DamageNumber, ParticleField, HitExplosion, ScreenFlash, ShieldBubble, BossArt,
} from "../components/BattleEffects";
import { useTranslatedTexts } from "../hooks/useTranslatedText.jsx";

// ─── Styles ───
const card = { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "18px 22px", marginBottom: 16 };
const btnP = (bg = "#e74c3c") => ({ padding: "8px 16px", borderRadius: 8, border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer", background: bg, color: "#fff" });
const btnS = { padding: "8px 16px", borderRadius: 8, border: "1px solid var(--border)", fontWeight: 600, fontSize: 13, cursor: "pointer", background: "transparent", color: "var(--text2)" };

export default function BossBattle() {
  const { courseId } = useParams();
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const isTeacher = userRole === "teacher";

  // ─── Translation (student-facing strings only) ───
  const uiStrings = useTranslatedTexts(isTeacher ? [] : [
    "BOSS HP",                                           // 0
    "CLASS HP",                                          // 1
    "Attack!",                                           // 2
    "Hint",                                              // 3
    "Shield",                                            // 4
    "Crit",                                              // 5
    "Shield Active",                                     // 6
    "Crit Ready",                                        // 7
    "Damage!",                                           // 8
    "Shield Blocked!",                                   // 9
    "Miss!",                                             // 10
    "Class takes",                                       // 11
    "damage!",                                           // 12
    "Correct:",                                          // 13
    "Next Question →",                                   // 14
    "All Questions Answered!",                           // 15
    "You dealt",                                         // 16
    "total damage.",                                     // 17
    "Watching your classmates finish the fight...",      // 18
    "Spectating",                                        // 19
    "You're not on a team in this battle. Watch the action unfold!", // 20
    "Team Damage",                                       // 21
    "Live",                                              // 22
    "VICTORY!",                                          // 23
    "DEFEATED",                                          // 24
    "The class united to slay",                          // 25
    "overwhelmed the class...",                          // 26
    "survives with",                                     // 27
    "HP...",                                             // 28
    "Team Rankings",                                     // 29
    "Total Damage",                                      // 30
    "Correct",                                           // 31
    "Class HP Left",                                     // 32
    "Back to Course",                                    // 33
    "No Active Battle",                                  // 34
    "Your teacher hasn't started a boss battle yet.",    // 35
    "Not enough class mana (need 5 MP)",                 // 36
  ]);
  const ui = (i, fallback) => uiStrings?.[i] ?? fallback;

  // ─── State ───
  const [phase, setPhase] = useState("setup");
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [teams, setTeams] = useState([]);
  const [battle, setBattle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pastBattles, setPastBattles] = useState([]);

  // Setup
  const [selectedBoss, setSelectedBoss] = useState(BOSSES[0].id);
  const [selectedLessons, setSelectedLessons] = useState([]);
  const [customQuestions, setCustomQuestions] = useState([]);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [newQ, setNewQ] = useState({ prompt: "", options: ["", "", "", ""], correctIndex: 0 });
  const [sectionFilter, setSectionFilter] = useState("all");

  // Battle (student-side)
  const [myTeamId, setMyTeamId] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [hintUsed, setHintUsed] = useState(false);
  const [eliminatedOption, setEliminatedOption] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [manaState, setManaState] = useState(null);

  // Effects
  const [animatingDamage, setAnimatingDamage] = useState(false);
  const [shakeScreen, setShakeScreen] = useState(false);
  const [damageNumbers, setDamageNumbers] = useState([]);
  const [showFlash, setShowFlash] = useState(false);
  const [flashColor, setFlashColor] = useState("#e74c3c");
  const [showExplosion, setShowExplosion] = useState(false);

  const prevBossHP = useRef(null);
  const prevClassHP = useRef(null);
  const unsubRef = useRef(null);

  // ─── Load Data ───
  useEffect(() => {
    loadData();
    return () => { if (unsubRef.current) unsubRef.current(); };
  }, [courseId]);

  async function loadData() {
    setLoading(true);
    try {
      const courseDoc = await getDoc(doc(db, "courses", courseId));
      if (courseDoc.exists()) setCourse({ id: courseDoc.id, ...courseDoc.data() });

      const lessonsSnap = await getDocs(query(collection(db, "courses", courseId, "lessons"), orderBy("order", "asc")));
      setLessons(lessonsSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

      const t = await getTeams(courseId);
      setTeams(t);

      if (user && !isTeacher) {
        for (const team of t) {
          if ((team.members || []).some((m) => m.uid === user.uid)) {
            setMyTeamId(team.id);
            break;
          }
        }
      }

      const battles = await listBattles(courseId);
      setPastBattles(battles);

      const active = battles.find((b) => b.status === "active");
      if (active) {
        startListening(active.id);
        setPhase("battle");
      }

      try { setManaState(await getManaState(courseId)); } catch (e) {}
    } catch (err) {
      console.error("Error loading boss battle data:", err);
    }
    setLoading(false);
  }

  function startListening(battleId) {
    if (unsubRef.current) unsubRef.current();
    unsubRef.current = subscribeToBattle(courseId, battleId, (data) => {
      if (prevBossHP.current !== null && data.boss.currentHP < prevBossHP.current) {
        setAnimatingDamage(true);
        setShowExplosion(true);
        const dmg = prevBossHP.current - data.boss.currentHP;
        setDamageNumbers((prev) => [...prev, {
          id: Date.now(), amount: dmg, isCrit: dmg >= 4,
          x: `${40 + Math.random() * 20}%`, y: `${15 + Math.random() * 10}%`,
        }]);
        setTimeout(() => { setAnimatingDamage(false); setShowExplosion(false); }, 700);
        setTimeout(() => setDamageNumbers((prev) => prev.filter((d) => Date.now() - d.id < 1500)), 2000);
      }
      if (prevClassHP.current !== null && data.classHP.current < prevClassHP.current) {
        setShakeScreen(true);
        setTimeout(() => setShakeScreen(false), 600);
      }
      prevBossHP.current = data.boss.currentHP;
      prevClassHP.current = data.classHP.current;

      setBattle(data);
      if (data.status === "victory" || data.status === "defeat") {
        setPhase("results");
      }
    });
  }

  // ─── Start Battle (teacher) ───
  async function handleStartBattle() {
    try {
      let questions = [];
      for (const lessonId of selectedLessons) {
        const lesson = lessons.find((l) => l.id === lessonId);
        if (lesson) questions.push(...extractQuestionsFromLesson(lesson));
      }
      questions.push(...customQuestions);
      if (questions.length < 3) { alert(`Need at least 3 MC questions (found ${questions.length})`); return; }

      const battleTeams = sectionFilter === "all" ? teams : teams.filter((t) => t.section === sectionFilter);
      if (battleTeams.length < 2) { alert(`Need at least 2 teams (found ${battleTeams.length})`); return; }

      questions = questions.sort(() => Math.random() - 0.5);
      const teamColors = battleTeams.map((t) => {
        const tc = TEAM_COLORS.find((c) => c.id === t.color);
        return tc?.hex || "#888";
      });
      const teamNames = battleTeams.map((t) =>
        sectionFilter === "all" && t.section ? `${t.name} (${t.section})` : t.name
      );

      const b = await createBattle(courseId, {
        bossId: selectedBoss,
        questions,
        teamIds: battleTeams.map((t) => t.id),
        teamNames,
        teamColors,
      });

      startListening(b.id);
      setPhase("battle");
    } catch (err) {
      console.error("Boss battle launch error:", err);
      alert("Error launching battle: " + err.message);
    }
  }

  // ─── Submit Answer (student) ───
  async function handleSubmitAnswer() {
    if (!battle || !myTeamId || selectedAnswer === null || submitting) return;
    setSubmitting(true);
    try {
      const { result } = await submitAnswer(courseId, battle.id, myTeamId, selectedAnswer);
      if (result) {
        setLastResult(result);
        setShowResult(true);

        if (result.correct) {
          setShowFlash(true);
          setFlashColor(result.criticalHit ? "#ffed4a" : "#e74c3c");
          setTimeout(() => setShowFlash(false), 400);
        } else if (result.counterattack && !result.shielded) {
          setShowFlash(true);
          setFlashColor("#8b1a1a");
          setTimeout(() => setShowFlash(false), 400);
        }
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Error submitting answer: " + err.message);
    }
    setSubmitting(false);
  }

  function handleNextQuestion() {
    setSelectedAnswer(null);
    setShowResult(false);
    setLastResult(null);
    setHintUsed(false);
    setEliminatedOption(null);
  }

  async function handleAbility(abilityId) {
    if (!battle || !myTeamId) return;
    if (abilityId === "hint") {
      if (!manaState?.enabled || (manaState?.currentMP || 0) < 5) { alert(ui(36, "Not enough class mana (need 5 MP)")); return; }
      await deductMana(courseId, 5, "Boss Battle: Hint used");
      setManaState({ ...manaState, currentMP: manaState.currentMP - 5 });
      const tp = battle.teamProgress[myTeamId];
      if (tp) {
        const qIdx = tp.questionOrder[tp.currentIndex];
        const q = battle.questions[qIdx];
        if (q) {
          const wrong = q.options.map((_, i) => i).filter((i) => i !== q.correctIndex && i !== eliminatedOption);
          if (wrong.length > 0) {
            setEliminatedOption(wrong[Math.floor(Math.random() * wrong.length)]);
            setHintUsed(true);
          }
        }
      }
      return;
    }
    const { error } = await useAbilityAction(courseId, battle.id, myTeamId, abilityId);
    if (error) alert(error);
  }

  if (loading) {
    return <div className="page-container" style={{ display: "flex", justifyContent: "center", paddingTop: 120 }}><div className="spinner" /></div>;
  }

  // ═══════════════════════════════════════════════
  // SETUP PHASE (teacher only — English)
  // ═══════════════════════════════════════════════
  if (phase === "setup" && isTeacher) {
    const totalQuestions = selectedLessons.reduce((sum, lid) => {
      const l = lessons.find((ls) => ls.id === lid);
      return sum + (l ? extractQuestionsFromLesson(l).length : 0);
    }, 0) + customQuestions.length;

    return (
      <main id="main-content" className="page-container" style={{ padding: "48px 40px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
            <button onClick={() => navigate(`/course/${courseId}`)} style={btnS}>← Back</button>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700 }}>⚔️ Boss Battle Setup</h1>
          </div>
          <p style={{ color: "var(--text2)", fontSize: 14, marginBottom: 28 }}>
            {course?.title} — Co-op raid: all teams fight simultaneously!
          </p>

          {/* Boss Selection */}
          <div style={card}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Choose a Boss</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
              {BOSSES.map((boss) => (
                <button key={boss.id} onClick={() => setSelectedBoss(boss.id)} style={{
                  ...card, marginBottom: 0, cursor: "pointer", textAlign: "left",
                  border: selectedBoss === boss.id ? "2px solid var(--red)" : "1px solid var(--border)",
                  background: selectedBoss === boss.id ? "rgba(231,76,60,0.08)" : "var(--surface)",
                }}>
                  <div style={{ fontSize: 32, marginBottom: 6 }}>{boss.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text)" }}>{boss.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>{boss.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Question Source */}
          <div style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>Questions ({totalQuestions})</div>
              <button onClick={() => setShowCustomForm(true)} style={btnP("#8b5cf6")}>+ Custom Question</button>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text3)", marginBottom: 8 }}>Pull from lessons:</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
              {lessons.map((lesson) => {
                const qCount = extractQuestionsFromLesson(lesson).length;
                if (qCount === 0) return null;
                const selected = selectedLessons.includes(lesson.id);
                return (
                  <label key={lesson.id} style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 8,
                    background: selected ? "rgba(231,76,60,0.08)" : "var(--surface2)",
                    border: selected ? "1px solid var(--red)" : "1px solid transparent", cursor: "pointer", fontSize: 14,
                  }}>
                    <input type="checkbox" checked={selected}
                      onChange={() => setSelectedLessons(selected ? selectedLessons.filter((id) => id !== lesson.id) : [...selectedLessons, lesson.id])}
                      style={{ accentColor: "var(--red)" }} />
                    <span style={{ fontWeight: 500 }}>{lesson.title}</span>
                    <span style={{ color: "var(--text3)", fontSize: 12, marginLeft: "auto" }}>{qCount} MC questions</span>
                  </label>
                );
              })}
            </div>
            {customQuestions.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text3)", marginBottom: 6 }}>Custom questions:</div>
                {customQuestions.map((q, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, padding: "4px 0" }}>
                    <span>📝</span>
                    <span style={{ flex: 1 }}>{q.prompt.substring(0, 60)}{q.prompt.length > 60 ? "..." : ""}</span>
                    <button onClick={() => setCustomQuestions(customQuestions.filter((_, j) => j !== i))}
                      style={{ background: "none", border: "none", color: "var(--red)", cursor: "pointer", fontSize: 13 }}>✕</button>
                  </div>
                ))}
              </div>
            )}
            {showCustomForm && (
              <div style={{ background: "var(--surface2)", borderRadius: 8, padding: 14, marginTop: 12 }}>
                <input type="text" placeholder="Question prompt" value={newQ.prompt}
                  onChange={(e) => setNewQ({ ...newQ, prompt: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 14, marginBottom: 8 }} />
                {newQ.options.map((opt, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "center" }}>
                    <input type="radio" name="correct" checked={newQ.correctIndex === i}
                      onChange={() => setNewQ({ ...newQ, correctIndex: i })} style={{ accentColor: "var(--green)" }} />
                    <input type="text" placeholder={`Option ${String.fromCharCode(65 + i)}`} value={opt}
                      onChange={(e) => { const opts = [...newQ.options]; opts[i] = e.target.value; setNewQ({ ...newQ, options: opts }); }}
                      style={{ flex: 1, padding: "6px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 13 }} />
                  </div>
                ))}
                <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                  <button onClick={() => {
                    if (!newQ.prompt.trim() || newQ.options.some((o) => !o.trim())) return;
                    setCustomQuestions([...customQuestions, { ...newQ, difficulty: "normal", source: "Custom" }]);
                    setNewQ({ prompt: "", options: ["", "", "", ""], correctIndex: 0 });
                    setShowCustomForm(false);
                  }} style={btnP("#8b5cf6")}>Add</button>
                  <button onClick={() => setShowCustomForm(false)} style={btnS}>Cancel</button>
                </div>
              </div>
            )}
          </div>

          {/* Teams */}
          <div style={card}>
            {(() => {
              const sections = [...new Set(teams.map((t) => t.section).filter(Boolean))].sort();
              const isGlobal = sectionFilter === "all";
              const filteredTeams = isGlobal ? teams : teams.filter((t) => t.section === sectionFilter);
              return (<>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>Teams ({filteredTeams.length}){isGlobal && filteredTeams.length > 0 && <span style={{ fontSize: 12, fontWeight: 400, color: "var(--text3)", marginLeft: 8 }}>🌍 Global</span>}</div>
                  {sections.length > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <label style={{ fontSize: 12, color: "var(--text3)", fontWeight: 600 }}>Period:</label>
                      <select value={sectionFilter} onChange={(e) => setSectionFilter(e.target.value)}
                        style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface2)", color: "var(--text)", fontSize: 13, cursor: "pointer" }}>
                        <option value="all">🌍 Global (All Periods)</option>
                        {sections.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  )}
                </div>
                {filteredTeams.length < 2 ? (
                  <p style={{ color: "var(--text3)", fontSize: 13 }}>Need at least 2 teams. <a href={`/teams/${courseId}`} style={{ color: "var(--amber)" }}>Set up teams →</a></p>
                ) : (
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {filteredTeams.map((team) => {
                      const tc = TEAM_COLORS.find((c) => c.id === team.color);
                      return (
                        <div key={team.id} style={{ padding: "6px 14px", borderRadius: 8, background: tc?.dim || "#88888822", border: `1px solid ${tc?.hex || "#888"}44`, fontSize: 13, fontWeight: 600, color: tc?.hex || "#888", display: "flex", alignItems: "center", gap: 6 }}>
                          {team.name} ({(team.members || []).length})
                          {isGlobal && team.section && <span style={{ fontSize: 10, fontWeight: 400, color: "var(--text3)", background: "var(--surface2)", padding: "1px 6px", borderRadius: 4 }}>{team.section}</span>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </>);
            })()}
          </div>

          {/* Launch */}
          {(() => {
            const ft = sectionFilter === "all" ? teams : teams.filter((t) => t.section === sectionFilter);
            return (
              <button onClick={handleStartBattle} disabled={totalQuestions < 3 || ft.length < 2}
                style={{ ...btnP(), width: "100%", padding: "14px", fontSize: 18, opacity: (totalQuestions >= 3 && ft.length >= 2) ? 1 : 0.4 }}>
                ⚔️ Launch {sectionFilter === "all" ? "Global " : ""}Raid ({totalQuestions} questions, {ft.length} teams)
              </button>
            );
          })()}

          {/* Past Battles */}
          {pastBattles.filter((b) => b.status === "victory" || b.status === "defeat").length > 0 && (
            <div style={{ ...card, marginTop: 24 }}>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Past Battles</div>
              {pastBattles.filter((b) => b.status === "victory" || b.status === "defeat").slice(0, 5).map((b) => (
                <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", fontSize: 13 }}>
                  <span>{b.boss?.icon}</span>
                  <span style={{ fontWeight: 600, color: "var(--text)" }}>{b.boss?.name}</span>
                  <span style={{ color: b.status === "victory" ? "var(--green)" : "var(--red)", fontWeight: 700 }}>{b.status === "victory" ? "✓ Victory" : "✗ Defeat"}</span>
                  <span style={{ color: "var(--text3)", marginLeft: "auto" }}>{b.createdAt ? new Date(b.createdAt).toLocaleDateString() : ""}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════
  // BATTLE PHASE — CO-OP RAID
  // ═══════════════════════════════════════════════
  if (phase === "battle" && battle) {
    const boss = battle.boss;
    const bossHpPct = (boss.currentHP / boss.maxHP) * 100;
    const classHpPct = (battle.classHP.current / battle.classHP.max) * 100;
    const theme = BOSS_THEMES[boss.id] || BOSS_THEMES.dragon;
    const allTeams = Object.entries(battle.teamProgress || {}).map(([id, tp]) => ({ id, ...tp })).sort((a, b) => b.damage - a.damage);

    const myTP = myTeamId ? battle.teamProgress[myTeamId] : null;
    const myQuestion = myTP && !myTP.finished ? battle.questions[myTP.questionOrder[myTP.currentIndex]] : null;
    const myQNum = myTP ? myTP.currentIndex + 1 : 0;
    const totalQs = myTP ? myTP.questionOrder.length : 0;

    return (
      <div style={{
        minHeight: "100vh", background: theme.bg,
        animation: shakeScreen ? "screenShake 0.6s ease" : "none",
        position: "relative", overflow: "hidden",
      }}>
        <ScreenFlash active={showFlash} color={flashColor} />
        <ParticleField particles={theme.particles} count={18} speed={0.6} color={theme.particleColor} />
        <style>{BATTLE_CSS}</style>
        {damageNumbers.map((d) => <DamageNumber key={d.id} amount={d.amount} x={d.x} y={d.y} isCrit={d.isCrit} />)}

        <div style={{ maxWidth: 900, margin: "0 auto", padding: "74px 30px 24px", position: "relative", zIndex: 5 }}>

          {/* ── Boss Arena ── */}
          <div style={{
            textAlign: "center", marginBottom: 16, padding: "22px 20px 16px",
            background: "rgba(0,0,0,0.45)", border: `1px solid ${theme.glowColor}33`,
            borderRadius: 16, position: "relative", backdropFilter: "blur(10px)",
          }}>
            <HitExplosion active={showExplosion} color={theme.glowColor} />
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
              <BossArt bossId={boss.id} size={320} hit={animatingDamage} lowHP={bossHpPct < 25} />
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, color: "#fff", textShadow: `0 0 16px ${theme.glowColor}88`, marginBottom: 10 }}>
              {boss.name}
            </div>

            {/* Boss HP */}
            <div style={{ maxWidth: 460, margin: "0 auto 10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 700, marginBottom: 3 }}>
                <span style={{ color: "#e74c3c" }} data-translatable>❤️ {ui(0, "BOSS HP")}</span>
                <span style={{ color: bossHpPct < 25 ? "#e74c3c" : "rgba(255,255,255,0.6)" }}>{boss.currentHP}/{boss.maxHP}</span>
              </div>
              <div style={{ height: 18, background: "rgba(0,0,0,0.5)", borderRadius: 9, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{
                  width: `${bossHpPct}%`, height: "100%",
                  background: bossHpPct > 50 ? "linear-gradient(90deg, #e74c3c, #c0392b)" : bossHpPct > 25 ? "linear-gradient(90deg, #f39c12, #e74c3c)" : "linear-gradient(90deg, #c0392b, #7f1d1d)",
                  borderRadius: 9, transition: "width 0.6s ease",
                  boxShadow: animatingDamage ? `0 0 16px #e74c3c88` : "none",
                }}><div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 50%)", borderRadius: 9 }} /></div>
              </div>
            </div>

            {/* Class HP */}
            <div style={{ maxWidth: 460, margin: "0 auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 700, marginBottom: 3 }}>
                <span style={{ color: "#2ecc71" }} data-translatable>💚 {ui(1, "CLASS HP")}</span>
                <span style={{ color: classHpPct < 25 ? "#e74c3c" : "rgba(255,255,255,0.6)" }}>{battle.classHP.current}/{battle.classHP.max}</span>
              </div>
              <div style={{ height: 14, background: "rgba(0,0,0,0.5)", borderRadius: 7, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{
                  width: `${classHpPct}%`, height: "100%",
                  background: classHpPct > 50 ? "linear-gradient(90deg, #2ecc71, #27ae60)" : classHpPct > 25 ? "linear-gradient(90deg, #f39c12, #e67e22)" : "linear-gradient(90deg, #e74c3c, #c0392b)",
                  borderRadius: 7, transition: "width 0.6s ease",
                }} />
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isTeacher ? "1fr" : "1fr 280px", gap: 14 }}>

            {/* ── LEFT: Question Area (student) or Live Feed (teacher) ── */}
            <div>
              {/* Student: their question */}
              {!isTeacher && myTP && !myTP.finished && myQuestion && !showResult && (
                <div style={{
                  background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 14, padding: "20px 24px", marginBottom: 14, backdropFilter: "blur(10px)",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>Q {myQNum}/{totalQs}</span>
                    {myQuestion.source && <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{myQuestion.source}</span>}
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 18, lineHeight: 1.65, color: "#fff" }}>
                    {myQuestion.prompt}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                    {myQuestion.options.map((opt, i) => {
                      const isElim = eliminatedOption === i;
                      const isSel = selectedAnswer === i;
                      const tc = myTP.color || "#888";
                      return (
                        <button key={i} onClick={() => !isElim && setSelectedAnswer(i)} disabled={isElim}
                          style={{
                            display: "flex", alignItems: "center", gap: 14, padding: "13px 16px",
                            background: isElim ? "rgba(255,255,255,0.02)" : isSel ? `${tc}33` : "rgba(255,255,255,0.06)",
                            border: isSel ? `2px solid ${tc}` : "1.5px solid rgba(255,255,255,0.1)",
                            borderRadius: 10, cursor: isElim ? "default" : "pointer",
                            fontSize: 15, textAlign: "left", color: isElim ? "rgba(255,255,255,0.2)" : "#fff",
                            opacity: isElim ? 0.3 : 1, textDecoration: isElim ? "line-through" : "none",
                            transition: "all 0.2s",
                          }}>
                          <span style={{
                            width: 32, height: 32, borderRadius: 8,
                            background: isSel ? tc : "rgba(255,255,255,0.08)",
                            color: isSel ? "#fff" : "rgba(255,255,255,0.5)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontWeight: 700, fontSize: 13, flexShrink: 0,
                            boxShadow: isSel ? `0 0 12px ${tc}66` : "none",
                          }}>{String.fromCharCode(65 + i)}</span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
                    <button onClick={handleSubmitAnswer} disabled={selectedAnswer === null || submitting}
                      style={{ ...btnP(), padding: "10px 24px", fontSize: 15, opacity: selectedAnswer !== null ? 1 : 0.4, boxShadow: selectedAnswer !== null ? "0 0 16px rgba(231,76,60,0.4)" : "none" }}
                      data-translatable>
                      ⚔️ {submitting ? "..." : ui(2, "Attack!")}
                    </button>

                    <button onClick={() => handleAbility("hint")} disabled={hintUsed || !manaState?.enabled}
                      style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid rgba(139,92,246,0.4)", background: "rgba(139,92,246,0.15)", color: "#bb88ee", fontWeight: 700, fontSize: 12, cursor: (hintUsed || !manaState?.enabled) ? "default" : "pointer", opacity: (hintUsed || !manaState?.enabled) ? 0.3 : 1 }}
                      data-translatable>
                      💡 {ui(3, "Hint")} {manaState?.enabled ? "(5MP)" : ""}
                    </button>
                    <button onClick={() => handleAbility("shield")} disabled={myTP.shieldActive || myTP.shieldCooldown > 0}
                      style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid rgba(52,152,219,0.4)", background: "rgba(52,152,219,0.15)", color: "#66b3ff", fontWeight: 700, fontSize: 12, cursor: (myTP.shieldActive || myTP.shieldCooldown > 0) ? "default" : "pointer", opacity: (myTP.shieldActive || myTP.shieldCooldown > 0) ? 0.3 : 1 }}
                      data-translatable>
                      🛡️ {ui(4, "Shield")} {myTP.shieldCooldown > 0 ? `(${myTP.shieldCooldown})` : ""}
                    </button>
                    <button onClick={() => handleAbility("criticalHit")} disabled={myTP.criticalHitActive || myTP.critCooldown > 0}
                      style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid rgba(231,76,60,0.4)", background: "rgba(231,76,60,0.15)", color: "#ff8888", fontWeight: 700, fontSize: 12, cursor: (myTP.criticalHitActive || myTP.critCooldown > 0) ? "default" : "pointer", opacity: (myTP.criticalHitActive || myTP.critCooldown > 0) ? 0.3 : 1 }}
                      data-translatable>
                      ⚔️ {ui(5, "Crit")} {myTP.critCooldown > 0 ? `(${myTP.critCooldown})` : ""}
                    </button>
                  </div>

                  {(myTP.shieldActive || myTP.criticalHitActive) && (
                    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                      {myTP.shieldActive && <span style={{ fontSize: 12, color: "#66b3ff", background: "rgba(52,152,219,0.15)", padding: "3px 10px", borderRadius: 6 }} data-translatable>🛡️ {ui(6, "Shield Active")}</span>}
                      {myTP.criticalHitActive && <span style={{ fontSize: 12, color: "#ffed4a", background: "rgba(255,237,74,0.1)", padding: "3px 10px", borderRadius: 6 }} data-translatable>⚔️ {ui(7, "Crit Ready")}</span>}
                    </div>
                  )}
                </div>
              )}

              {/* Student: result */}
              {!isTeacher && showResult && lastResult && (
                <div style={{
                  background: lastResult.correct ? "rgba(46,204,113,0.15)" : "rgba(231,76,60,0.15)",
                  border: lastResult.correct ? "2px solid rgba(46,204,113,0.5)" : "2px solid rgba(231,76,60,0.5)",
                  borderRadius: 14, padding: "24px 26px", marginBottom: 14, textAlign: "center", backdropFilter: "blur(10px)",
                }}>
                  <div style={{ fontSize: 52, marginBottom: 8, animation: lastResult.correct ? "victoryBurst 0.5s ease-out" : "defeatSink 0.4s ease" }}>
                    {lastResult.correct ? (lastResult.criticalHit ? "💥" : "⚔️") : lastResult.shielded ? "🛡️" : "😈"}
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 900, color: "#fff", marginBottom: 8 }} data-translatable>
                    {lastResult.correct ? `${lastResult.criticalHit ? "CRIT! " : ""}${lastResult.damage} ${ui(8, "Damage!")}` : lastResult.shielded ? ui(9, "Shield Blocked!") : ui(10, "Miss!")}
                  </div>
                  {!lastResult.correct && lastResult.counterattack && !lastResult.shielded && (
                    <div style={{ padding: "8px 14px", borderRadius: 8, background: "rgba(139,26,26,0.3)", border: "1px solid rgba(231,76,60,0.3)", marginBottom: 10, fontSize: 13, color: "#ff8888" }} data-translatable>
                      {lastResult.counterattack.icon} <strong>{lastResult.counterattack.name}</strong> — {ui(11, "Class takes")} {lastResult.classDamage} {ui(12, "damage!")}
                    </div>
                  )}
                  {!lastResult.correct && myQuestion && (
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 10 }} data-translatable>
                      {ui(13, "Correct:")} <strong style={{ color: "#2ecc71" }}>{myQuestion.options[myQuestion.correctIndex]}</strong>
                    </div>
                  )}
                  {myQuestion?.explanation && (
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", padding: "8px 12px", background: "rgba(255,255,255,0.05)", borderRadius: 8, marginBottom: 12, textAlign: "left" }}>
                      💡 {myQuestion.explanation}
                    </div>
                  )}
                  {myTP && !myTP.finished && battle.status === "active" && (
                    <button onClick={handleNextQuestion} style={{ ...btnP("#2ecc71"), padding: "10px 24px", fontSize: 15 }} data-translatable>{ui(14, "Next Question →")}</button>
                  )}
                  {myTP?.finished && battle.status === "active" && (
                    <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginTop: 8 }} data-translatable>
                      ✅ {ui(15, "All Questions Answered!")}
                    </div>
                  )}
                </div>
              )}

              {/* Student: finished */}
              {!isTeacher && myTP?.finished && !showResult && battle.status === "active" && (
                <div style={{
                  background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 14, padding: "30px 24px", textAlign: "center", backdropFilter: "blur(10px)",
                }}>
                  <div style={{ fontSize: 48, marginBottom: 10 }}>⏳</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 6 }} data-translatable>{ui(15, "All Questions Answered!")}</div>
                  <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }} data-translatable>
                    {ui(16, "You dealt")} <strong style={{ color: myTP.color }}>{myTP.damage}</strong> {ui(17, "total damage.")}
                    {" "}{ui(18, "Watching your classmates finish the fight...")}
                  </div>
                </div>
              )}

              {/* Student: no team */}
              {!isTeacher && !myTeamId && (
                <div style={{
                  background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 14, padding: "30px 24px", textAlign: "center", backdropFilter: "blur(10px)",
                }}>
                  <div style={{ fontSize: 48, marginBottom: 10 }}>👀</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 6 }} data-translatable>{ui(19, "Spectating")}</div>
                  <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }} data-translatable>{ui(20, "You're not on a team in this battle. Watch the action unfold!")}</div>
                </div>
              )}

              {/* Teacher: live activity feed */}
              {isTeacher && (
                <div style={{
                  background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 14, padding: "18px 22px", backdropFilter: "blur(10px)",
                }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 10 }}>📜 Live Battle Feed</div>
                  <div style={{ maxHeight: 300, overflowY: "auto" }}>
                    {(battle.log || []).slice(0, 20).map((entry, i) => (
                      <div key={i} style={{
                        fontSize: 12, padding: "4px 0", borderBottom: "1px solid rgba(255,255,255,0.04)",
                        display: "flex", gap: 8, color: "rgba(255,255,255,0.6)",
                      }}>
                        <span style={{ color: entry.teamColor, fontWeight: 700, minWidth: 80 }}>{entry.team}</span>
                        {entry.type === "attack" && <span>⚔️ <strong style={{ color: "#e74c3c" }}>{entry.damage}</strong> dmg{entry.criticalHit ? " 💥 CRIT" : ""}</span>}
                        {entry.type === "miss" && <span>❌ Miss{entry.shielded ? " 🛡️" : ""}{entry.counterattack && !entry.shielded ? ` ${entry.counterattack.icon} -${entry.classDamage} class HP` : ""}</span>}
                        {entry.type === "ability" && <span>{entry.abilityIcon} {entry.ability}</span>}
                      </div>
                    ))}
                    {(battle.log || []).length === 0 && <div style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", textAlign: "center", padding: 16 }}>Waiting for teams to start answering...</div>}
                  </div>
                </div>
              )}
            </div>

            {/* ── RIGHT: Team Leaderboard (students) ── */}
            {!isTeacher && (
              <div>
                <div style={{
                  background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 12, padding: "14px 16px", backdropFilter: "blur(5px)",
                }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.4)", marginBottom: 10 }} data-translatable>🏆 {ui(21, "Team Damage")}</div>
                  {allTeams.map((team) => {
                    const isMine = team.id === myTeamId;
                    const avatar = TEAM_AVATARS[Object.keys(TEAM_AVATARS).find((k) => TEAM_AVATARS[k].color === team.color)] || TEAM_AVATARS.red;
                    return (
                      <div key={team.id} style={{
                        display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", marginBottom: 4,
                        borderRadius: 8, background: isMine ? `${team.color}22` : "transparent",
                        border: isMine ? `1px solid ${team.color}44` : "1px solid transparent",
                      }}>
                        <span style={{ fontSize: 16 }}>{avatar.sprite}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: team.color }}>{team.name}{isMine ? " ★" : ""}</div>
                          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{team.correctCount}✓ {team.wrongCount}✗{team.finished ? " ✅" : ""}</div>
                        </div>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 900, color: "#fff" }}>{team.damage}</div>
                      </div>
                    );
                  })}
                </div>

                <div style={{
                  background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.04)",
                  borderRadius: 12, padding: "12px 14px", marginTop: 10, backdropFilter: "blur(5px)",
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", marginBottom: 6 }} data-translatable>📜 {ui(22, "Live")}</div>
                  <div style={{ maxHeight: 140, overflowY: "auto" }}>
                    {(battle.log || []).slice(0, 8).map((entry, i) => (
                      <div key={i} style={{ fontSize: 11, padding: "2px 0", color: "rgba(255,255,255,0.5)" }}>
                        <span style={{ color: entry.teamColor, fontWeight: 700 }}>{entry.team}</span>{" "}
                        {entry.type === "attack" ? `⚔️ ${entry.damage}${entry.criticalHit ? "💥" : ""}` : entry.type === "miss" ? `❌${entry.shielded ? "🛡️" : ""}` : `${entry.abilityIcon || ""}`}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Teacher: team progress + controls */}
          {isTeacher && (
            <>
              <div style={{
                display: "grid", gridTemplateColumns: `repeat(${Math.min(allTeams.length, 6)}, 1fr)`,
                gap: 8, marginTop: 14,
              }}>
                {allTeams.map((team) => {
                  const avatar = TEAM_AVATARS[Object.keys(TEAM_AVATARS).find((k) => TEAM_AVATARS[k].color === team.color)] || TEAM_AVATARS.red;
                  const pct = totalQs > 0 ? Math.round((team.currentIndex / (team.questionOrder?.length || 1)) * 100) : 0;
                  return (
                    <div key={team.id} style={{
                      padding: "10px 12px", borderRadius: 10, textAlign: "center",
                      background: "rgba(0,0,0,0.3)", border: `1px solid ${team.color}44`,
                      backdropFilter: "blur(5px)", position: "relative",
                    }}>
                      <div style={{ fontSize: 20, marginBottom: 2 }}>{avatar.sprite}</div>
                      <div style={{ fontWeight: 700, fontSize: 11, color: team.color }}>{team.name}</div>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 900, color: "#fff" }}>{team.damage}</div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{team.correctCount}✓ {team.wrongCount}✗</div>
                      <div style={{ height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 2, marginTop: 6 }}>
                        <div style={{ width: `${pct}%`, height: "100%", background: team.color, borderRadius: 2, transition: "width 0.5s" }} />
                      </div>
                      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>
                        {team.finished ? "✅ Done" : `${pct}%`}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 14 }}>
                <button onClick={() => endBattle(courseId, battle.id, "victory")} style={{ ...btnP("#2ecc71"), opacity: 0.7 }}>Force Victory</button>
                <button onClick={() => endBattle(courseId, battle.id, "defeat")} style={{ ...btnP("#e74c3c"), opacity: 0.7 }}>End Battle</button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════
  // RESULTS PHASE
  // ═══════════════════════════════════════════════
  if (phase === "results" && battle) {
    const isVictory = battle.status === "victory";
    const allTeams = Object.entries(battle.teamProgress || {}).map(([id, tp]) => ({ id, ...tp })).sort((a, b) => b.damage - a.damage);
    const theme = BOSS_THEMES[battle.boss?.id] || BOSS_THEMES.dragon;

    return (
      <div style={{
        minHeight: "100vh",
        background: isVictory ? "radial-gradient(ellipse at 50% 80%, #1a3a1a 0%, #0a150a 50%, #0a0a0f 100%)" : theme.bg,
        position: "relative", overflow: "hidden",
      }}>
        <ParticleField particles={isVictory ? ["🏆", "⭐", "✨", "🎉"] : ["💀", "😈", "💨"]} count={25} speed={0.5} color={isVictory ? "#ffed4a" : "#e74c3c"} />
        <style>{BATTLE_CSS}</style>

        <div style={{ maxWidth: 600, margin: "0 auto", padding: "60px 40px", position: "relative", zIndex: 5, textAlign: "center" }}>
          <div style={{ marginBottom: 20, animation: isVictory ? "victoryBurst 1s ease-out" : "bossIdle 3s ease-in-out infinite", filter: isVictory ? "grayscale(0.6) opacity(0.5)" : "none" }}>
            {isVictory ? <div style={{ fontSize: 90 }}>🏆</div> : <div style={{ display: "flex", justifyContent: "center" }}><BossArt bossId={battle.boss?.id || "dragon"} size={320} /></div>}
          </div>

          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: 44, fontWeight: 900, marginBottom: 8,
            color: isVictory ? "#2ecc71" : "#e74c3c",
            textShadow: isVictory ? "0 0 30px rgba(46,204,113,0.5)" : "0 0 30px rgba(231,76,60,0.5)",
          }} data-translatable>
            {isVictory ? ui(23, "VICTORY!") : ui(24, "DEFEATED")}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 16, marginBottom: 32 }} data-translatable>
            {isVictory
              ? `${ui(25, "The class united to slay")} ${battle.boss?.name}!`
              : battle.classHP?.current <= 0
              ? `${battle.boss?.name} ${ui(26, "overwhelmed the class...")}`
              : `${battle.boss?.name} ${ui(27, "survives with")} ${battle.boss?.currentHP} ${ui(28, "HP...")}`}
          </p>

          {/* Rankings */}
          <div style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "20px 22px", marginBottom: 20, backdropFilter: "blur(10px)" }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 16 }} data-translatable>🏅 {ui(29, "Team Rankings")}</div>
            {allTeams.map((team, i) => {
              const avatar = TEAM_AVATARS[Object.keys(TEAM_AVATARS).find((k) => TEAM_AVATARS[k].color === team.color)] || TEAM_AVATARS.red;
              const medals = ["🥇", "🥈", "🥉"];
              return (
                <div key={team.id} style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", borderRadius: 10, marginBottom: 8,
                  background: i === 0 ? `${team.color}22` : "rgba(255,255,255,0.03)",
                  border: i === 0 ? `2px solid ${team.color}66` : "1px solid rgba(255,255,255,0.05)",
                }}>
                  <span style={{ fontSize: 22 }}>{medals[i] || `${i + 1}.`}</span>
                  <span style={{ fontSize: 20 }}>{avatar.sprite}</span>
                  <div style={{ flex: 1, textAlign: "left" }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: team.color }}>{team.name}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{team.correctCount}✓ · {team.wrongCount}✗</div>
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 900, color: "#fff", textShadow: `0 0 8px ${team.color}44` }}>
                    {team.damage} <span style={{ fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.4)" }}>dmg</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 28 }}>
            {[
              { label: ui(30, "Total Damage"), value: allTeams.reduce((s, t) => s + t.damage, 0), color: "#e74c3c" },
              { label: ui(31, "Correct"), value: allTeams.reduce((s, t) => s + t.correctCount, 0), color: "#2ecc71" },
              { label: ui(32, "Class HP Left"), value: `${battle.classHP?.current || 0}/${battle.classHP?.max || 0}`, color: "#3498db" },
            ].map((s) => (
              <div key={s.label} style={{ padding: "14px 10px", borderRadius: 10, textAlign: "center", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 900, color: s.color, textShadow: `0 0 12px ${s.color}44` }}>{s.value}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }} data-translatable>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            {isTeacher && (
              <button onClick={() => { setPhase("setup"); setBattle(null); if (unsubRef.current) unsubRef.current(); }}
                style={{ ...btnP("#8b5cf6"), padding: "12px 24px", boxShadow: "0 0 16px rgba(139,92,246,0.3)" }}>
                ⚔️ New Battle
              </button>
            )}
            <button onClick={() => navigate(`/course/${courseId}`)} style={{ ...btnS, color: "rgba(255,255,255,0.6)", borderColor: "rgba(255,255,255,0.2)" }} data-translatable>{ui(33, "Back to Course")}</button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Fallback ───
  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at 50% 80%, #1a1a2a, #0a0a0f)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", maxWidth: 400 }}>
        <div style={{ fontSize: 80, marginBottom: 16, animation: "bossIdle 3s ease-in-out infinite" }}>⚔️</div>
        <h2 style={{ fontFamily: "var(--font-display)", color: "#fff", marginBottom: 8 }} data-translatable>{ui(34, "No Active Battle")}</h2>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, marginBottom: 20 }} data-translatable>
          {isTeacher ? "Set up a boss battle to begin!" : ui(35, "Your teacher hasn't started a boss battle yet.")}
        </p>
        {isTeacher
          ? <button onClick={() => setPhase("setup")} style={btnP("#8b5cf6")}>⚔️ Set Up Battle</button>
          : <button onClick={() => navigate(`/course/${courseId}`)} style={{ ...btnS, color: "rgba(255,255,255,0.6)", borderColor: "rgba(255,255,255,0.2)" }} data-translatable>← {ui(33, "Back to Course")}</button>
        }
      </main>
      <style>{BATTLE_CSS}</style>
    </div>
  );
}
