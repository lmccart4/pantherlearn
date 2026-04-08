// src/pages/ManaManager.jsx
// Teacher-only page for managing course mana pool.
// Route: /mana/:courseId

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { doc, getDoc, collection, getDocs, updateDoc, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import {
  getManaState, saveManaState, awardMana, deductMana,
  spendMana, applyDecay, startVote, endVote,
  addPower, removePower,
  getStudentManaForClass, awardStudentMana, getLevel,
  awardBehaviorMana, getManaTitle, getManaRequests,
  autoSelectMage, markMageAbsent,
  MANA_CAP, DEFAULT_POWERS, MANA_LEVELS, MAGE_DAILY_BUDGET,
  POSITIVE_BEHAVIORS, NEGATIVE_BEHAVIORS,
} from "../lib/mana";
import { createNotification } from "../lib/notifications";
import { isPerfMode } from "../lib/perfMode";

// Lazy-load GSAP
let gsapModule = null;
const getGsap = () => {
  if (gsapModule) return Promise.resolve(gsapModule);
  return import("gsap").then(m => { gsapModule = m.default || m; return gsapModule; });
};

// ─── PALETTE (matching StudentMana) ──────────────────
const ACCENT = "#10b981";
const ACCENT_PURPLE = "#7c3aed";
const GOLD = "#f0c848";
const MANA_BG = "var(--mana-bg, #0a0612)";
const MANA_SURFACE = "var(--mana-surface, #130d20)";
const MANA_SURFACE2 = "var(--mana-surface2, #1e1435)";
const MANA_BORDER = "var(--mana-border, #2d1f4e)";
const MANA_TEXT = "var(--mana-text, #e8e0f0)";
const MANA_TEXT_MUTED = "var(--mana-text-muted, #8b7fa8)";
const MANA_GRAD_MID = "var(--mana-gradient-mid, #1a1030)";
const MANA_GRAD_MID2 = "var(--mana-gradient-mid2, #1e1435)";
const DANGER = "#ef4444";

// ─── EASING ──────────────────────────────────────────
const EASE_ENTRANCE = "cubic-bezier(0.2, 0, 0, 1)";
const EASE_SNAPPY = "cubic-bezier(0.37, 0.01, 0, 0.98)";
const EASE_HEAVY = "cubic-bezier(0.7, 0, 0.3, 1)";

// ─── CAPABILITY DETECTION ────────────────────────────
function isLowEnd() {
  if (typeof navigator === "undefined") return true;
  const cores = navigator.hardwareConcurrency || 2;
  const mem = navigator.deviceMemory || 4;
  const prefersReduced = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  return cores < 4 || mem < 4 || prefersReduced;
}

const manaStyles = `
/* === SMOKE BACKGROUND === */
@keyframes smoke-drift-1 {
  0% { transform: translateX(0) translateY(0) scale(1); }
  33% { transform: translateX(40px) translateY(-30px) scale(1.15); }
  66% { transform: translateX(-20px) translateY(-15px) scale(1.08); }
  100% { transform: translateX(0) translateY(0) scale(1); }
}
@keyframes smoke-drift-2 {
  0% { transform: translateX(0) translateY(0) scale(1.1); }
  50% { transform: translateX(-35px) translateY(-25px) scale(1.25); }
  100% { transform: translateX(0) translateY(0) scale(1.1); }
}

/* === ORB === */
@keyframes orb-float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
}
@keyframes orb-rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
@keyframes orb-glow-pulse {
  0%, 100% { box-shadow: 0 0 24px rgba(16,185,129,0.3), 0 0 48px rgba(16,185,129,0.15), inset 0 0 16px rgba(16,185,129,0.15); }
  50% { box-shadow: 0 0 40px rgba(16,185,129,0.5), 0 0 72px rgba(16,185,129,0.25), inset 0 0 28px rgba(16,185,129,0.25); }
}

/* === TOAST === */
@keyframes toast-slide-in {
  0% { opacity: 0; transform: translateX(-50%) translateY(20px) scale(0.95); }
  100% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
}

/* === SMOKE WRAPPER === */
.mana-smoke-wrapper {
  position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden;
}
.mana-smoke-layer {
  position: absolute; border-radius: 50%; filter: blur(80px); will-change: transform;
  pointer-events: none;
}

/* === VIGNETTE === */
.mana-vignette {
  position: fixed; inset: 0; pointer-events: none; z-index: 1;
  background: radial-gradient(ellipse at 50% 30%, transparent 30%, rgba(0,0,0,0.5) 80%, rgba(0,0,0,0.7) 100%);
}

/* === CARDS === */
.mgr-card-glow {
  transition: transform 0.3s ${EASE_SNAPPY}, box-shadow 0.3s ${EASE_SNAPPY};
}
.mgr-card-glow:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.12), 0 0 16px rgba(16, 185, 129, 0.06);
}

/* === BUTTONS === */
.mana-spell-btn {
  transition: transform 0.2s ${EASE_SNAPPY}, box-shadow 0.2s ${EASE_SNAPPY};
  position: relative; overflow: hidden;
}
.mana-spell-btn:hover {
  box-shadow: 0 0 16px rgba(16, 185, 129, 0.3);
  transform: translateY(-1px);
}
.mana-spell-btn:active { transform: translateY(0) scale(0.97); }
.mana-award-btn {
  transition: transform 0.15s ${EASE_SNAPPY}, box-shadow 0.15s ${EASE_SNAPPY};
  position: relative; overflow: hidden;
}
.mana-award-btn:hover { transform: translateY(-1px); filter: brightness(1.1); }
.mana-award-btn:active { transform: scale(0.95); }

/* Ripple */
.mana-spell-btn .ripple-circle,
.mana-award-btn .ripple-circle {
  position: absolute; border-radius: 50%; pointer-events: none;
  background: rgba(16, 185, 129, 0.3);
  transform: scale(0); opacity: 1;
}
.ripple-circle.active {
  animation: ripple-expand 0.5s ${EASE_ENTRANCE} forwards;
}
.ripple-circle.ripple-red {
  background: rgba(239, 68, 68, 0.3);
}
@keyframes ripple-expand {
  to { transform: scale(2.5); opacity: 0; }
}

/* === SCROLLBAR === */
.mana-mgr-page::-webkit-scrollbar { width: 6px; }
.mana-mgr-page::-webkit-scrollbar-track { background: transparent; }
.mana-mgr-page::-webkit-scrollbar-thumb { background: #2d1f4e; border-radius: 3px; }

/* === ENCHANTMENT LOG === */
.mgr-log-entry {
  transition: background 0.2s ${EASE_SNAPPY};
}
.mgr-log-entry:hover {
  background: rgba(16, 185, 129, 0.04);
}

/* === PERF MODE === */
.perf-mode .mana-smoke-wrapper,
.perf-mode .mana-vignette { display: none; }
.perf-mode .mgr-card-glow:hover { transform: none; }
`;

export default function ManaManager() {
  const { courseId } = useParams();
  const { userRole } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [state, setState] = useState(null);

  // Award/deduct form
  const [awardAmount, setAwardAmount] = useState(5);
  const [awardReason, setAwardReason] = useState("");
  const [isDeducting, setIsDeducting] = useState(false);

  // New power form
  const [showNewPower, setShowNewPower] = useState(false);
  const [newPower, setNewPower] = useState({ name: "", description: "", cost: 25, icon: "⚡" });

  // Student balances
  const [studentMana, setStudentMana] = useState({});
  const [studentNames, setStudentNames] = useState({});
  const [grantUid, setGrantUid] = useState(null);
  const [historyUid, setHistoryUid] = useState(null);
  const [grantAmount, setGrantAmount] = useState(5);
  const [grantReason, setGrantReason] = useState("");
  const [bulkAmount, setBulkAmount] = useState(5);
  const [bulkReason, setBulkReason] = useState("");
  const [showBulkGrant, setShowBulkGrant] = useState(false);

  // Behavior award
  const [behaviorTarget, setBehaviorTarget] = useState(null);
  const [behaviorToast, setBehaviorToast] = useState(null);

  // Requests
  const [requests, setRequests] = useState([]);
  const [quotePrices, setQuotePrices] = useState({});

  // Mage/Enchantress
  const [studentGenders, setStudentGenders] = useState({});

  // Perf mode
  const [perfMode] = useState(() => isPerfMode() || isLowEnd());
  const [mounted, setMounted] = useState(false);

  // Refs for GSAP
  const orbRef = useRef(null);
  const smokeRef = useRef(null);
  const sectionsRef = useRef([]);

  useEffect(() => {
    if (userRole !== "teacher") { navigate("/"); return; }
    loadCourse();
  }, [courseId, userRole, navigate]);

  async function loadCourse() {
    setLoading(true);
    try {
      const courseDoc = await getDoc(doc(db, "courses", courseId));
      if (courseDoc.exists()) {
        const courseData = { id: courseDoc.id, ...courseDoc.data() };
        setCourse(courseData);
        await Promise.all([loadMana(), loadStudentBalances(), loadRequests()]);

        // Auto-summon mage if no mage for today
        const currentPool = await getManaState(courseId);
        const today = new Date().toISOString().split("T")[0];
        if (currentPool.enabled && (!currentPool.mageDate || currentPool.mageDate !== today)) {
          const result = await autoSelectMage(courseId);
          if (result && typeof result !== 'string') {
            setState(result.poolState);
            const title = getManaTitle(result.gender);
            await createNotification(result.uid, {
              type: "announcement",
              title: `You've been summoned as today's ${title}!`,
              body: "You can award mana to classmates today. Use your power wisely!",
              icon: result.gender === 'F' ? '🧝‍♀️' : '🧙',
              courseId,
            });
          }
        }
      }
    } catch (err) {
      console.error("Error loading course:", err);
    }
    setLoading(false);
    setMounted(true);
  }

  async function loadMana() {
    try {
      const s = await getManaState(courseId);
      setState(s);
    } catch (err) {
      console.error("Error loading mana:", err);
    }
  }

  async function loadStudentBalances() {
    try {
      const manaData = await getStudentManaForClass(courseId);
      setStudentMana(manaData);

      const names = {};
      const genders = {};
      try {
        const enrollSnap = await getDocs(query(collection(db, "enrollments"), where("courseId", "==", courseId)));
        const usersSnap = await getDocs(collection(db, "users"));
        const usersMap = {};
        usersSnap.forEach((d) => { usersMap[d.id] = d.data(); });
        enrollSnap.forEach((d) => {
          const data = d.data();
          if (data.courseId !== courseId || data.isTestStudent) return;
          const uid = data.uid || data.studentUid;
          if (!uid) return;
          const user = usersMap[uid];
          names[uid] = user?.displayName || data.name || data.email || "Unknown";
          if (user?.gender) genders[uid] = user.gender;
        });
        usersSnap.forEach((d) => {
          const data = d.data();
          if (data.role === "teacher") return;
          const enrolled = data.enrolledCourses || {};
          if (enrolled[courseId] && !names[d.id]) {
            names[d.id] = data.displayName || data.email || d.id;
          }
          if (enrolled[courseId] && data.gender) {
            genders[d.id] = data.gender;
          }
        });
      } catch (err) {
        console.warn("Enrollment load failed, falling back to users:", err);
        const usersSnap = await getDocs(collection(db, "users"));
        usersSnap.forEach((d) => {
          const data = d.data();
          if (data.role === "teacher") return;
          const enrolled = data.enrolledCourses || {};
          if (enrolled[courseId]) {
            names[d.id] = data.displayName || data.email || d.id;
            if (data.gender) genders[d.id] = data.gender;
          }
        });
      }
      for (const uid of Object.keys(manaData)) {
        if (!names[uid]) names[uid] = uid;
      }
      setStudentNames(names);
      setStudentGenders(genders);
    } catch (err) {
      console.error("Error loading student balances:", err);
    }
  }

  async function loadRequests() {
    try {
      const all = await getManaRequests(courseId);
      setRequests(all.filter(r => r.status === "pending" || r.status === "priced"));
    } catch (err) {
      console.warn("Error loading requests:", err);
    }
  }

  // ─── GSAP ENTRANCE ────────────────────────────────
  useEffect(() => {
    if (!mounted || loading || perfMode) return;

    getGsap().then(gsap => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (smokeRef.current) {
        gsap.set(smokeRef.current, { opacity: 0.4 });
        tl.to(smokeRef.current, { opacity: 1, duration: 0.6 }, 0);
      }

      if (orbRef.current) {
        gsap.set(orbRef.current, { scale: 0.5, opacity: 0 });
        tl.to(orbRef.current, {
          scale: 1, opacity: 1, duration: 0.8,
          ease: "elastic.out(1, 0.5)",
        }, 0.3);
      }

      const sections = sectionsRef.current.filter(Boolean);
      if (sections.length) {
        gsap.set(sections, { opacity: 0.4, y: 30 });
        tl.to(sections, {
          opacity: 1, y: 0, duration: 0.5,
          stagger: 0.12, ease: "power3.out",
        }, 0.7);
      }
    }).catch(() => {});
  }, [mounted, loading, perfMode]);

  // Ripple handler
  const spawnRipple = useCallback((e, isRed = false) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const circle = document.createElement("span");
    circle.className = `ripple-circle active${isRed ? " ripple-red" : ""}`;
    circle.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px;`;
    btn.appendChild(circle);
    setTimeout(() => circle.remove(), 500);
  }, []);

  // GSAP bounce on click
  const bounceClick = useCallback((e) => {
    getGsap().then(gsap => {
      gsap.fromTo(e.currentTarget,
        { scale: 0.95 },
        { scale: 1, duration: 0.3, ease: "elastic.out(1, 0.4)" }
      );
    }).catch(() => {});
  }, []);

  async function handleGrantStudent(uid) {
    if (!grantReason.trim() || grantAmount <= 0) return;
    await awardStudentMana(courseId, uid, grantAmount, grantReason.trim());
    setGrantUid(null);
    setGrantReason("");
    setGrantAmount(5);
    await loadStudentBalances();
  }

  async function handleBulkGrant() {
    if (!bulkReason.trim() || bulkAmount <= 0) return;
    const uids = Object.keys(studentNames);
    await Promise.all(uids.map((uid) => awardStudentMana(courseId, uid, bulkAmount, bulkReason.trim())));
    setShowBulkGrant(false);
    setBulkReason("");
    setBulkAmount(5);
    await loadStudentBalances();
  }

  async function handleBehaviorAward(uid, behaviorId, isPositive) {
    const behaviors = isPositive ? POSITIVE_BEHAVIORS : NEGATIVE_BEHAVIORS;
    const behavior = behaviors.find(b => b.id === behaviorId);
    if (!behavior) return;
    await awardBehaviorMana(courseId, uid, behaviorId, isPositive);
    const name = studentNames[uid] || "Student";
    const sign = isPositive ? "+" : "";
    setBehaviorToast(`${sign}${behavior.mana} mana to ${name} (${behavior.label})`);
    setTimeout(() => setBehaviorToast(null), 2500);
    await loadStudentBalances();
  }

  async function handleSummonMage() {
    const result = await autoSelectMage(courseId);
    if (!result || typeof result === 'string') return; // already selected or no students
    setState(result.poolState);
    const title = getManaTitle(result.gender);
    await createNotification(result.uid, {
      type: "announcement",
      title: `You've been summoned as today's ${title}!`,
      body: "You can award mana to classmates today. Use your power wisely!",
      icon: result.gender === 'F' ? '🧝‍♀️' : '🧙',
      courseId,
    });
    await loadStudentBalances();
  }

  async function handleMageAbsent() {
    const result = await markMageAbsent(courseId);
    if (!result) return;
    setState(result.poolState);
    const title = getManaTitle(result.gender);
    await createNotification(result.uid, {
      type: "announcement",
      title: `You've been summoned as today's ${title}!`,
      body: "You can award mana to classmates today. Use your power wisely!",
      icon: result.gender === 'F' ? '🧝‍♀️' : '🧙',
      courseId,
    });
    await loadStudentBalances();
  }

  async function handleClearMage() {
    const updated = { ...state };
    delete updated.mageStudentId;
    delete updated.mageStudentName;
    delete updated.mageDate;
    delete updated.mageBudgetUsed;
    setState(updated);
    await saveManaState(courseId, undefined, updated);
  }

  async function handleToggleEnabled() {
    const updated = { ...state, enabled: !state.enabled };
    setState(updated);
    await saveManaState(courseId, undefined, updated);
  }

  async function handleAward() {
    if (!awardReason.trim()) return;
    if (isDeducting) {
      await deductMana(courseId, undefined, awardAmount, awardReason.trim());
    } else {
      await awardMana(courseId, undefined, awardAmount, awardReason.trim(), "teacher");
    }
    setAwardReason("");
    await loadMana();
  }

  async function handleQuickAward(amount, reason) {
    if (amount > 0) {
      await awardMana(courseId, undefined, amount, reason, "teacher");
    } else {
      await deductMana(courseId, undefined, Math.abs(amount), reason);
    }
    await loadMana();
  }

  async function handleActivatePower(powerId) {
    try {
      await spendMana(courseId, undefined, powerId);
      await loadMana();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleStartVote(powerId) {
    await startVote(courseId, undefined, powerId);
    await loadMana();
  }

  async function handleEndVote() {
    await endVote(courseId);
    await loadMana();
  }

  async function handleApplyDecay() {
    const result = await applyDecay(courseId);
    if (result.decayed) {
      alert(`Decayed ${result.decayAmount} MP → ${result.newMP} MP remaining`);
    } else {
      alert("No decay needed (below threshold or already applied this week)");
    }
    await loadMana();
  }

  async function handleAddPower() {
    if (!newPower.name.trim()) return;
    await addPower(courseId, undefined, newPower);
    setNewPower({ name: "", description: "", cost: 25, icon: "⚡" });
    setShowNewPower(false);
    await loadMana();
  }

  async function handleRemovePower(powerId) {
    if (!confirm("Remove this power?")) return;
    await removePower(courseId, undefined, powerId);
    await loadMana();
  }

  async function handleResetToDefaults() {
    if (!confirm("Reset powers to defaults? Custom powers will be lost.")) return;
    const updated = { ...state, powers: DEFAULT_POWERS };
    await saveManaState(courseId, undefined, updated);
    await loadMana();
  }

  const addSectionRef = (el) => {
    if (el && !sectionsRef.current.includes(el)) sectionsRef.current.push(el);
  };

  // ─── BACKGROUND ────────────────────────────────────
  const smokeAndVignette = (
    <>
      <div className="mana-smoke-wrapper" ref={smokeRef}>
        <div className="mana-smoke-layer" style={{
          width: 500, height: 500, top: '5%', left: '-10%',
          background: 'radial-gradient(ellipse, rgba(16,185,129,0.15), transparent 70%)',
          animation: 'smoke-drift-1 15s ease-in-out infinite',
          opacity: 0.15,
        }} />
        <div className="mana-smoke-layer" style={{
          width: 450, height: 450, bottom: '5%', right: '-10%',
          background: 'radial-gradient(ellipse, rgba(124,58,237,0.12), transparent 70%)',
          animation: 'smoke-drift-2 20s ease-in-out infinite',
          opacity: 0.15,
        }} />
      </div>
      <div className="mana-vignette" />
    </>
  );

  if (loading) {
    return (
      <div className="page-wrapper mana-mgr-page" style={{
        display: "flex", justifyContent: "center", paddingTop: 120,
        background: `radial-gradient(ellipse at 50% 30%, ${MANA_SURFACE} 0%, ${MANA_BG} 70%, ${MANA_BG} 100%)`,
        minHeight: "100vh", color: MANA_TEXT,
      }}>
        <style>{manaStyles}</style>
        {smokeAndVignette}
        <div className="spinner" style={{ position: "relative", zIndex: 2 }} />
      </div>
    );
  }

  const pct = state ? Math.min((state.currentMP / MANA_CAP) * 100, 100) : 0;
  const glowColor = ACCENT;

  const cardStyle = {
    background: `linear-gradient(135deg, ${MANA_SURFACE}, ${MANA_GRAD_MID}, ${MANA_SURFACE2})`,
    border: `1px solid ${MANA_BORDER}`,
    borderRadius: 14,
    padding: "18px 22px", marginBottom: 16,
    position: "relative",
  };
  const btnPrimary = {
    padding: "8px 16px", borderRadius: 8, border: "none", fontWeight: 600, fontSize: 13,
    cursor: "pointer", background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_PURPLE})`, color: "#fff",
    boxShadow: `0 0 12px ${ACCENT}33`,
  };
  const btnSecondary = {
    padding: "8px 16px", borderRadius: 8, border: `1px solid ${MANA_BORDER}`, fontWeight: 600,
    fontSize: 13, cursor: "pointer", background: "transparent", color: MANA_TEXT_MUTED,
  };
  const btnDanger = {
    padding: "4px 10px", borderRadius: 6, border: `1px solid ${DANGER}33`, background: `${DANGER}11`,
    color: DANGER, cursor: "pointer", fontSize: 12, fontWeight: 600,
  };
  const inputStyle = {
    padding: "6px 10px", borderRadius: 6,
    border: `1px solid ${MANA_BORDER}`, background: MANA_SURFACE2,
    color: MANA_TEXT, fontSize: 13,
  };

  return (
    <main id="main-content" className="page-wrapper mana-mgr-page" style={{
      background: `radial-gradient(ellipse at 50% 30%, ${MANA_SURFACE} 0%, ${MANA_BG} 70%, ${MANA_BG} 100%)`,
      minHeight: "100vh", position: "relative", color: MANA_TEXT,
    }}>
      <style>{manaStyles}</style>
      {smokeAndVignette}
      <div style={{ maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 2 }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
          <button onClick={() => navigate(`/course/${courseId}`)} className="mana-spell-btn" style={{ ...btnSecondary, padding: "6px 12px" }}>← Back</button>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: MANA_TEXT, margin: 0, textShadow: `0 0 20px ${ACCENT}44` }}>
            <span style={{ color: ACCENT, filter: `drop-shadow(0 0 8px ${ACCENT})` }}>✦</span> Mana Pool
          </h1>
        </div>
        <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${ACCENT}66, ${GOLD}44, ${ACCENT}66, transparent)`, marginBottom: 6 }} />
        <p style={{ marginBottom: 20, color: MANA_TEXT_MUTED, fontSize: 13 }}>
          {course?.title} — Manage course mana pool
        </p>

        {!state ? (
          <div className="empty-state"><div className="empty-state-text" style={{ color: MANA_TEXT }}>Loading mana state...</div></div>
        ) : (
          <>
            {/* ═══ DAILY MAGE / ENCHANTRESS ═══ */}
            <div ref={addSectionRef} style={cardStyle}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: MANA_TEXT }}>🧙 Daily Mage / Enchantress</div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={(e) => { spawnRipple(e); bounceClick(e); handleSummonMage(); }} className="mana-spell-btn" style={btnPrimary}>Summon</button>
                  {state?.mageStudentId && state.mageDate === new Date().toISOString().split("T")[0] && (
                    <button onClick={(e) => { spawnRipple(e); bounceClick(e); handleMageAbsent(); }} className="mana-spell-btn" style={{ ...btnSecondary, color: '#f59e0b', borderColor: '#f59e0b44' }}>Absent</button>
                  )}
                  {state?.mageStudentId && (
                    <button onClick={handleClearMage} style={btnSecondary}>Clear</button>
                  )}
                </div>
              </div>
              {state?.mageStudentId && state.mageDate === new Date().toISOString().split("T")[0] ? (
                <div style={{
                  padding: "14px 18px", borderRadius: 10, background: `${GOLD}08`,
                  border: `1px solid ${GOLD}33`, display: "flex", alignItems: "center", gap: 14,
                }}>
                  <span style={{ fontSize: 28, filter: `drop-shadow(0 0 6px ${GOLD}44)` }}>{studentGenders[state.mageStudentId] === 'F' ? '🧝‍♀️' : '🧙'}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: GOLD, textShadow: `0 0 12px ${GOLD}33` }}>
                      Today's {getManaTitle(studentGenders[state.mageStudentId] || 'M')}: {state.mageStudentName}
                    </div>
                    <div style={{ fontSize: 12, color: MANA_TEXT_MUTED, marginTop: 2 }}>
                      Distributed: {state.mageBudgetUsed || 0} / {MAGE_DAILY_BUDGET} personal mana given out
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ color: MANA_TEXT_MUTED, fontSize: 13 }}>
                  No Mage/Enchantress summoned today. Click "Summon" to pick a student (weighted by low mana).
                </div>
              )}
              {state?.mageHistory && state.mageHistory.length > 0 && (
                <div style={{ marginTop: 8, fontSize: 11, color: MANA_TEXT_MUTED }}>
                  Cycle {state.mageCycleNumber || 1}: {state.mageHistory.length} / {Object.keys(studentNames).length} students have had a turn
                </div>
              )}
            </div>

            {/* ═══ BEHAVIOR AWARDS ═══ */}
            <div ref={addSectionRef} style={cardStyle}>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, color: MANA_TEXT }}>🎯 Behavior Awards</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 8 }}>
                {Object.entries(studentNames)
                  .sort(([, a], [, b]) => a.localeCompare(b))
                  .map(([uid, name]) => {
                    const sm = studentMana[uid] || { balance: 0 };
                    const isOpen = behaviorTarget === uid;
                    return (
                      <div key={uid} style={{ position: "relative" }}>
                        <button
                          onClick={() => setBehaviorTarget(isOpen ? null : uid)}
                          className="mgr-card-glow"
                          style={{
                            width: "100%", padding: "10px 12px", borderRadius: 10,
                            border: isOpen ? `2px solid ${ACCENT}` : `1px solid ${MANA_BORDER}`,
                            background: isOpen ? `${ACCENT}15` : MANA_SURFACE2,
                            cursor: "pointer", textAlign: "left",
                            backdropFilter: "blur(8px)",
                          }}
                        >
                          <div style={{ fontWeight: 600, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: MANA_TEXT }}>
                            {name.split(" ")[0]}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                            {/* Mini mana orb (16px) */}
                            <div style={{
                              width: 16, height: 16, borderRadius: "50%", position: "relative", overflow: "hidden",
                              background: `radial-gradient(ellipse at 35% 30%, ${ACCENT}44, ${MANA_SURFACE2} 65%)`,
                              border: `1px solid ${ACCENT}33`,
                              boxShadow: `0 0 6px ${ACCENT}33`,
                            }}>
                              <div style={{
                                position: "absolute", bottom: 0, left: 0, right: 0,
                                height: `${Math.min((sm.balance || 0) / 200 * 100, 100)}%`,
                                background: `linear-gradient(to top, #064e3b, ${ACCENT}88)`,
                                transition: `height 0.4s ${EASE_HEAVY}`,
                                borderRadius: "0 0 50% 50%",
                              }} />
                            </div>
                            <span style={{ fontSize: 12, color: ACCENT, fontWeight: 700, textShadow: `0 0 6px ${ACCENT}33` }}>{sm.balance}</span>
                          </div>
                        </button>
                      </div>
                    );
                  })}
              </div>

              {/* Behavior flyout */}
              {behaviorTarget && (
                <div style={{
                  marginTop: 14, padding: "16px 18px", borderRadius: 10,
                  background: MANA_SURFACE2, border: `1px solid ${MANA_BORDER}`,
                }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12, color: MANA_TEXT }}>
                    Award to: {studentNames[behaviorTarget]}
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: ACCENT, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      Positive
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {POSITIVE_BEHAVIORS.map(b => (
                        <button
                          key={b.id}
                          onClick={(e) => { spawnRipple(e); bounceClick(e); handleBehaviorAward(behaviorTarget, b.id, true); }}
                          className="mana-award-btn"
                          style={{
                            padding: "6px 12px", borderRadius: 6,
                            border: `1px solid ${ACCENT}33`, background: `${ACCENT}11`,
                            color: ACCENT, fontSize: 12, fontWeight: 600, cursor: "pointer",
                            boxShadow: `0 0 8px ${ACCENT}11`,
                          }}
                        >
                          {b.icon} {b.label} (+{b.mana})
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: DANGER, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      Negative
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {NEGATIVE_BEHAVIORS.map(b => (
                        <button
                          key={b.id}
                          onClick={(e) => { spawnRipple(e, true); bounceClick(e); handleBehaviorAward(behaviorTarget, b.id, false); }}
                          className="mana-award-btn"
                          style={{
                            padding: "6px 12px", borderRadius: 6,
                            border: `1px solid ${DANGER}33`, background: `${DANGER}11`,
                            color: DANGER, fontSize: 12, fontWeight: 600, cursor: "pointer",
                          }}
                        >
                          {b.icon} {b.label} ({b.mana})
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ═══ POOL STATUS + ORB ═══ */}
            <div ref={addSectionRef} style={cardStyle}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15, fontWeight: 600, color: MANA_TEXT }}>
                  <input
                    type="checkbox" checked={state?.enabled || false}
                    onChange={handleToggleEnabled}
                    style={{ accentColor: ACCENT, width: 18, height: 18 }}
                  />
                  Mana Pool Enabled
                </label>
                <div style={{
                  fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700,
                  color: ACCENT, textShadow: `0 0 16px ${ACCENT}44`,
                }}>
                  {state.currentMP}<span style={{ fontSize: 14, color: MANA_TEXT_MUTED, fontWeight: 400 }}>/{MANA_CAP} MP</span>
                </div>
              </div>

              {/* Pool Orb — 120px */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                <div ref={orbRef} style={{
                  width: 120, height: 120, position: "relative",
                  animation: `orb-float 3s ease-in-out infinite`,
                }}>
                  {/* Conic swirl */}
                  <div style={{
                    position: "absolute", inset: -8, borderRadius: "50%",
                    background: `conic-gradient(from 0deg, ${ACCENT}00, ${ACCENT}44, ${ACCENT_PURPLE}22, ${ACCENT}00, ${ACCENT}33, ${ACCENT_PURPLE}18, ${ACCENT}00)`,
                    animation: "orb-rotate 8s linear infinite",
                    opacity: 0.5,
                  }} />
                  {/* Orb body */}
                  <div style={{
                    width: 120, height: 120, borderRadius: "50%",
                    background: `radial-gradient(ellipse at 35% 30%, ${ACCENT}44, ${ACCENT_PURPLE}22, ${MANA_SURFACE2} 65%)`,
                    border: `2px solid ${ACCENT}44`,
                    position: "relative", overflow: "hidden",
                    animation: "orb-glow-pulse 3s ease-in-out infinite",
                    boxShadow: `0 0 40px rgba(16,185,129,0.4), 0 0 80px rgba(16,185,129,0.2)`,
                  }}>
                    {/* Fill level */}
                    <div style={{
                      position: "absolute", bottom: 0, left: 0, right: 0,
                      height: `${pct}%`,
                      background: `linear-gradient(to top, #064e3b, ${ACCENT}88, ${ACCENT}33)`,
                      transition: `height 0.8s ${EASE_HEAVY}`,
                      borderRadius: "0 0 50% 50%",
                      boxShadow: `inset 0 8px 16px ${ACCENT}22`,
                    }} />
                    {/* Glass highlight */}
                    <div style={{
                      position: "absolute", top: 16, left: 28, width: 20, height: 10,
                      borderRadius: "50%", background: "rgba(255,255,255,0.15)",
                      transform: "rotate(-30deg)",
                    }} />
                  </div>
                </div>
              </div>

              {/* Bar */}
              <div style={{
                height: 14, background: MANA_SURFACE2, borderRadius: 7, overflow: "hidden", marginBottom: 16,
                boxShadow: "inset 0 0 6px rgba(0,0,0,0.3)",
              }}>
                <div style={{
                  width: `${pct}%`, height: "100%",
                  background: `linear-gradient(90deg, #064e3b, ${ACCENT})`,
                  borderRadius: 7, transition: `width 0.6s ${EASE_HEAVY}`,
                  boxShadow: `0 0 12px ${ACCENT}44`,
                }} />
              </div>

              {/* Quick Award Buttons */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                {[
                  { label: "+5 Good Behavior", amount: 5, reason: "Good class behavior" },
                  { label: "+5 Good Work", amount: 5, reason: "Good work" },
                  { label: "+5 Attendance", amount: 5, reason: "Perfect attendance day" },
                  { label: "+5 Participation", amount: 5, reason: "Great participation" },
                  { label: "−5 Disruption", amount: -5, reason: "Class disruption" },
                  { label: "−5 Phone", amount: -5, reason: "Phone use" },
                ].map((btn) => (
                  <button
                    key={btn.label}
                    onClick={(e) => {
                      spawnRipple(e, btn.amount < 0);
                      bounceClick(e);
                      handleQuickAward(btn.amount, btn.reason);
                    }}
                    className="mana-award-btn"
                    style={{
                      padding: "6px 12px", borderRadius: 6,
                      border: `1px solid ${btn.amount > 0 ? ACCENT + "33" : DANGER + "33"}`,
                      background: btn.amount > 0 ? `${ACCENT}11` : `${DANGER}11`,
                      color: btn.amount > 0 ? ACCENT : DANGER,
                      fontSize: 12, fontWeight: 600, cursor: "pointer",
                      boxShadow: btn.amount > 0 ? `0 0 8px ${ACCENT}11` : `0 0 8px ${DANGER}11`,
                    }}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>

              {/* Custom award/deduct */}
              <div style={{ display: "flex", gap: 8, alignItems: "flex-end", flexWrap: "wrap" }}>
                <div>
                  <label style={{ fontSize: 11, color: MANA_TEXT_MUTED, display: "block", marginBottom: 3 }}>
                    {isDeducting ? "Deduct" : "Award"} Amount
                  </label>
                  <input
                    type="number" min={1} max={MANA_CAP} value={awardAmount}
                    onChange={(e) => setAwardAmount(parseInt(e.target.value) || 0)}
                    style={{
                      width: 60, ...inputStyle, textAlign: "center",
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, color: MANA_TEXT_MUTED, display: "block", marginBottom: 3 }}>Reason</label>
                  <input
                    type="text" value={awardReason} placeholder="e.g. Great lab behavior"
                    onChange={(e) => setAwardReason(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAward()}
                    style={{ width: "100%", ...inputStyle }}
                  />
                </div>
                <button onClick={(e) => { spawnRipple(e); handleAward(); }} disabled={!awardReason.trim()} className="mana-spell-btn" style={{ ...btnPrimary, opacity: awardReason.trim() ? 1 : 0.5 }}>
                  {isDeducting ? "Deduct" : "Award"}
                </button>
                <button onClick={() => setIsDeducting(!isDeducting)} style={btnSecondary}>
                  {isDeducting ? "Switch to Award" : "Switch to Deduct"}
                </button>
              </div>
            </div>

            {/* ═══ POWERS ═══ */}
            <div ref={addSectionRef} style={cardStyle}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: MANA_TEXT }}>⚡ Powers</div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => setShowNewPower(true)} className="mana-spell-btn" style={btnPrimary}>+ Add Power</button>
                  <button onClick={handleResetToDefaults} style={btnSecondary}>Reset Defaults</button>
                </div>
              </div>

              {showNewPower && (
                <div style={{ background: MANA_SURFACE2, borderRadius: 8, padding: 14, marginBottom: 12 }}>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                    <input type="text" placeholder="Power name" value={newPower.name}
                      onChange={(e) => setNewPower({ ...newPower, name: e.target.value })}
                      style={{ flex: 1, minWidth: 120, ...inputStyle }}
                    />
                    <input type="text" placeholder="Icon" value={newPower.icon} maxLength={4}
                      onChange={(e) => setNewPower({ ...newPower, icon: e.target.value })}
                      style={{ width: 50, ...inputStyle, textAlign: "center" }}
                    />
                    <input type="number" min={5} max={100} value={newPower.cost}
                      onChange={(e) => setNewPower({ ...newPower, cost: parseInt(e.target.value) || 5 })}
                      style={{ width: 60, ...inputStyle, textAlign: "center" }}
                    />
                    <span style={{ fontSize: 12, color: MANA_TEXT_MUTED, alignSelf: "center" }}>MP</span>
                  </div>
                  <input type="text" placeholder="Description" value={newPower.description}
                    onChange={(e) => setNewPower({ ...newPower, description: e.target.value })}
                    style={{ width: "100%", ...inputStyle, marginBottom: 8 }}
                  />
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={handleAddPower} disabled={!newPower.name.trim()} className="mana-spell-btn" style={{ ...btnPrimary, opacity: newPower.name.trim() ? 1 : 0.5 }}>Create</button>
                    <button onClick={() => setShowNewPower(false)} style={btnSecondary}>Cancel</button>
                  </div>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(state?.powers || []).map((power) => {
                  const canAfford = (state?.currentMP || 0) >= power.cost;
                  const isVoting = state?.activeVote === power.id;
                  const votes = state?.votes?.[power.id] || [];
                  const yesCount = votes.filter((v) => v.vote === true).length;
                  const noCount = votes.filter((v) => v.vote === false).length;

                  return (
                    <div key={power.id} style={{
                      display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                      borderRadius: 8, background: isVoting ? `${ACCENT}11` : MANA_SURFACE2,
                      border: isVoting ? `1px solid ${ACCENT}44` : "1px solid transparent",
                    }}>
                      <span style={{ fontSize: 20 }}>{power.icon || "⚡"}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, color: MANA_TEXT }}>{power.name}</div>
                        <div style={{ fontSize: 12, color: MANA_TEXT_MUTED }}>{power.description}</div>
                        {isVoting && (
                          <div style={{ fontSize: 11, color: ACCENT, marginTop: 4 }}>
                            🗳️ Voting: {yesCount} yes, {noCount} no ({yesCount + noCount} total)
                          </div>
                        )}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: canAfford ? GOLD : MANA_TEXT_MUTED, textShadow: canAfford ? `0 0 8px ${GOLD}33` : "none" }}>
                        {power.cost} MP
                      </span>
                      <div style={{ display: "flex", gap: 4 }}>
                        {isVoting ? (
                          <button onClick={handleEndVote} style={btnSecondary}>End Vote</button>
                        ) : (
                          <button onClick={() => handleStartVote(power.id)} style={btnSecondary}>Start Vote</button>
                        )}
                        <button onClick={(e) => { spawnRipple(e); handleActivatePower(power.id); }} disabled={!canAfford}
                          className="mana-spell-btn" style={{ ...btnPrimary, opacity: canAfford ? 1 : 0.4 }}>Activate</button>
                        <button onClick={() => handleRemovePower(power.id)} style={btnDanger}>✕</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ═══ MAINTENANCE ═══ */}
            <div ref={addSectionRef} style={cardStyle}>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, color: MANA_TEXT }}>🛠️ Maintenance</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button onClick={handleApplyDecay} style={btnSecondary}>
                  Apply Weekly Decay (10% above 50 MP)
                </button>
                <button onClick={async () => {
                  if (!confirm("Reset mana to 0? History will be cleared.")) return;
                  await saveManaState(courseId, undefined, { ...state, currentMP: 0, history: [], votes: {}, activeVote: null });
                  await loadMana();
                }} style={{ ...btnSecondary, color: DANGER, borderColor: `${DANGER}44` }}>
                  Reset Pool to 0
                </button>
              </div>
            </div>

            {/* ═══ POOL HISTORY ═══ */}
            {(state?.history || []).length > 0 && (
              <div ref={addSectionRef} style={cardStyle}>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, color: MANA_TEXT }}>📜 Pool History</div>
                <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${ACCENT}33, transparent)`, marginBottom: 10 }} />
                <div style={{
                  display: "flex", flexDirection: "column", gap: 6,
                  maxHeight: 300, overflowY: "auto",
                  maskImage: "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
                  WebkitMaskImage: "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
                }}>
                  {(state.history || []).slice(0, 20).map((entry, i) => (
                    <div key={i} className="mgr-log-entry" style={{
                      display: "flex", gap: 10, alignItems: "center", padding: "6px 0",
                      borderBottom: i < Math.min((state.history || []).length, 20) - 1 ? `1px solid color-mix(in srgb, ${MANA_BORDER} 27%, transparent)` : "none",
                      borderLeft: `2px solid ${entry.type === "gain" ? ACCENT + "44" : entry.type === "decay" ? "#8b7fa844" : DANGER + "33"}`,
                      borderRadius: "0 4px 4px 0",
                      paddingLeft: 8,
                    }}>
                      <span style={{
                        fontSize: 13, fontWeight: 700, minWidth: 60,
                        color: entry.type === "gain" ? ACCENT : entry.type === "decay" ? MANA_TEXT_MUTED : DANGER,
                        textShadow: `0 0 6px ${entry.type === "gain" ? ACCENT + "33" : "transparent"}`,
                      }}>
                        {entry.type === "gain" ? "+" : "−"}{entry.amount} MP
                      </span>
                      <span style={{ fontSize: 13, color: MANA_TEXT_MUTED, flex: 1 }}>{entry.reason}</span>
                      <span style={{ fontSize: 11, color: `${GOLD}66`, fontStyle: "italic" }}>
                        {entry.timestamp ? new Date(entry.timestamp).toLocaleDateString() : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ═══ REQUESTS ═══ */}
            {requests.filter(r => r.status === "pending" || r.status === "priced").length > 0 && (
              <div ref={addSectionRef} style={cardStyle}>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, color: MANA_TEXT }}>📨 Requests</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {requests.filter(r => r.type === "quote" && (r.status === "pending" || r.status === "priced")).map((req) => (
                    <div key={req.id} style={{
                      padding: "14px 16px", borderRadius: 10, background: MANA_SURFACE2,
                      border: `1px solid ${MANA_BORDER}`,
                    }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
                        <span style={{ fontSize: 20 }}>🏗️</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: 14, color: MANA_TEXT }}>
                            {req.studentName} — Custom 3D Print
                          </div>
                          <div style={{ fontSize: 13, color: MANA_TEXT_MUTED, marginTop: 2 }}>
                            "{req.description}"
                          </div>
                          {req.status === "priced" && (
                            <div style={{ fontSize: 12, color: ACCENT, marginTop: 4, fontWeight: 600 }}>
                              Quoted: {req.quotedCost} mana — waiting for student
                            </div>
                          )}
                        </div>
                      </div>
                      {req.status === "pending" && (
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <input
                            type="number" min={1} placeholder="Price"
                            value={quotePrices[req.id] || ""}
                            onChange={(e) => setQuotePrices({ ...quotePrices, [req.id]: parseInt(e.target.value) || "" })}
                            style={{ width: 80, ...inputStyle, textAlign: "center" }}
                          />
                          <span style={{ fontSize: 12, color: MANA_TEXT_MUTED }}>mana</span>
                          <button
                            disabled={!quotePrices[req.id]}
                            onClick={async () => {
                              const price = quotePrices[req.id];
                              if (!price || price <= 0) return;
                              await updateDoc(doc(db, "courses", courseId, "manaRequests", req.id), { status: "priced", quotedCost: price });
                              setQuotePrices({ ...quotePrices, [req.id]: "" });
                              await loadRequests();
                            }}
                            className="mana-spell-btn"
                            style={{ ...btnPrimary, padding: "6px 14px", opacity: quotePrices[req.id] ? 1 : 0.4 }}
                          >
                            Send Quote
                          </button>
                          <button
                            onClick={async () => {
                              await updateDoc(doc(db, "courses", courseId, "manaRequests", req.id), { status: "declined" });
                              await loadRequests();
                            }}
                            style={{ ...btnDanger, padding: "6px 12px" }}
                          >
                            Decline
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  {requests.filter(r => r.type === "suggestion" && r.status === "pending").map((req) => (
                    <div key={req.id} style={{
                      padding: "14px 16px", borderRadius: 10, background: MANA_SURFACE2,
                      border: `1px solid ${MANA_BORDER}`,
                    }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
                        <span style={{ fontSize: 20 }}>💡</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: 14, color: MANA_TEXT }}>
                            {req.studentName} — Reward Suggestion
                          </div>
                          <div style={{ fontSize: 13, color: MANA_TEXT_MUTED, marginTop: 2 }}>
                            "{req.suggestion}"
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={async () => {
                            await updateDoc(doc(db, "courses", courseId, "manaRequests", req.id), { status: "approved" });
                            await loadRequests();
                          }}
                          className="mana-spell-btn"
                          style={{ ...btnPrimary, padding: "6px 14px" }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={async () => {
                            await updateDoc(doc(db, "courses", courseId, "manaRequests", req.id), { status: "rejected" });
                            await loadRequests();
                          }}
                          style={{ ...btnDanger, padding: "6px 12px" }}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ═══ STUDENT BALANCES ═══ */}
            <div ref={addSectionRef} style={cardStyle}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: MANA_TEXT }}>✦ Student Mana Balances</div>
                <button onClick={() => setShowBulkGrant(!showBulkGrant)} className="mana-spell-btn" style={btnPrimary}>
                  Grant to All
                </button>
              </div>

              {showBulkGrant && (
                <div style={{ background: MANA_SURFACE2, borderRadius: 8, padding: 14, marginBottom: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: MANA_TEXT }}>Grant mana to all enrolled students</div>
                  <div style={{ display: "flex", gap: 8, alignItems: "flex-end", flexWrap: "wrap" }}>
                    <div>
                      <label style={{ fontSize: 11, color: MANA_TEXT_MUTED, display: "block", marginBottom: 3 }}>Amount</label>
                      <input
                        type="number" min={1} value={bulkAmount}
                        onChange={(e) => setBulkAmount(parseInt(e.target.value) || 0)}
                        style={{ width: 60, ...inputStyle, textAlign: "center" }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: 11, color: MANA_TEXT_MUTED, display: "block", marginBottom: 3 }}>Reason</label>
                      <input
                        type="text" value={bulkReason} placeholder="e.g. Great class behavior"
                        onChange={(e) => setBulkReason(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleBulkGrant()}
                        style={{ width: "100%", ...inputStyle }}
                      />
                    </div>
                    <button onClick={handleBulkGrant} disabled={!bulkReason.trim()} className="mana-spell-btn" style={{ ...btnPrimary, opacity: bulkReason.trim() ? 1 : 0.5 }}>
                      Grant ({Object.keys(studentNames).length} students)
                    </button>
                    <button onClick={() => setShowBulkGrant(false)} style={btnSecondary}>Cancel</button>
                  </div>
                </div>
              )}

              {Object.keys(studentNames).length === 0 ? (
                <div style={{ color: MANA_TEXT_MUTED, fontSize: 13, padding: "10px 0" }}>
                  No enrolled students found. Sync your roster to see student balances.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {Object.entries(studentNames)
                    .sort(([, a], [, b]) => a.localeCompare(b))
                    .map(([uid, name]) => {
                      const sm = studentMana[uid] || { balance: 0, lifetimeEarned: 0, level: "Newcomer", history: [] };
                      const lvl = getLevel(sm.lifetimeEarned || 0);
                      const txHistory = sm.history || [];
                      const lastTx = txHistory[0];
                      const isGranting = grantUid === uid;
                      const isShowingHistory = historyUid === uid;

                      return (
                        <div key={uid}>
                          <div className="mgr-card-glow" style={{
                            display: "flex", alignItems: "center", gap: 10, padding: "8px 10px",
                            borderRadius: 6, background: (isGranting || isShowingHistory) ? MANA_SURFACE2 : "transparent",
                            cursor: "pointer",
                          }} onClick={() => setGrantUid(isGranting ? null : uid)}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontWeight: 600, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: MANA_TEXT }}>
                                {name}
                              </div>
                              {lastTx && (
                                <div style={{ fontSize: 11, color: MANA_TEXT_MUTED, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                  Last: {lastTx.reason} ({new Date(lastTx.timestamp).toLocaleDateString()})
                                </div>
                              )}
                            </div>
                            {txHistory.length > 0 && (
                              <button
                                onClick={(e) => { e.stopPropagation(); setHistoryUid(isShowingHistory ? null : uid); }}
                                style={{ background: "none", border: `1px solid ${MANA_BORDER}`, borderRadius: 4, padding: "2px 8px", fontSize: 11, color: MANA_TEXT_MUTED, cursor: "pointer" }}
                              >
                                {isShowingHistory ? "Hide" : `${txHistory.length} tx`}
                              </button>
                            )}
                            <span style={{
                              display: "inline-flex", alignItems: "center", gap: 4,
                              padding: "2px 8px", borderRadius: 10,
                              background: `${lvl.color}18`, fontSize: 11, fontWeight: 600, color: lvl.color,
                            }}>
                              {lvl.label}
                            </span>
                            <div style={{ display: "flex", alignItems: "center", gap: 4, minWidth: 50, justifyContent: "flex-end" }}>
                              {/* Mini mana orb */}
                              <div style={{
                                width: 16, height: 16, borderRadius: "50%", position: "relative", overflow: "hidden",
                                background: `radial-gradient(ellipse at 35% 30%, ${ACCENT}44, ${MANA_SURFACE2} 65%)`,
                                border: `1px solid ${ACCENT}33`,
                                boxShadow: `0 0 6px ${ACCENT}33`,
                              }}>
                                <div style={{
                                  position: "absolute", bottom: 0, left: 0, right: 0,
                                  height: `${Math.min((sm.balance || 0) / 200 * 100, 100)}%`,
                                  background: `linear-gradient(to top, #064e3b, ${ACCENT}88)`,
                                  transition: `height 0.4s ${EASE_HEAVY}`,
                                  borderRadius: "0 0 50% 50%",
                                }} />
                              </div>
                              <span style={{
                                fontFamily: "ui-monospace, monospace", fontSize: 15, fontWeight: 700,
                                color: ACCENT, textShadow: `0 0 8px ${ACCENT}33`,
                              }}>
                                {sm.balance}
                              </span>
                            </div>
                          </div>

                          {isShowingHistory && (
                            <div style={{ padding: "4px 10px 10px", maxHeight: 200, overflowY: "auto" }}>
                              {txHistory.map((tx, i) => (
                                <div key={i} style={{
                                  display: "flex", alignItems: "center", gap: 8, padding: "4px 0",
                                  borderBottom: i < txHistory.length - 1 ? `1px solid color-mix(in srgb, ${MANA_BORDER} 27%, transparent)` : "none",
                                  fontSize: 12,
                                }}>
                                  <span style={{
                                    fontWeight: 700, minWidth: 40, textAlign: "right",
                                    color: tx.type === "spend" || tx.type === "deduct" ? DANGER : ACCENT,
                                  }}>
                                    {tx.type === "spend" || tx.type === "deduct" ? "-" : "+"}{tx.amount}
                                  </span>
                                  <span style={{ flex: 1, color: MANA_TEXT_MUTED, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {tx.reason}
                                  </span>
                                  <span style={{ color: MANA_TEXT_MUTED, fontSize: 11, whiteSpace: "nowrap" }}>
                                    {new Date(tx.timestamp).toLocaleDateString()}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          {isGranting && (
                            <div style={{ display: "flex", gap: 8, padding: "6px 10px 10px", alignItems: "flex-end" }}>
                              <div>
                                <label style={{ fontSize: 11, color: MANA_TEXT_MUTED, display: "block", marginBottom: 3 }}>Amount</label>
                                <input
                                  type="number" min={1} value={grantAmount}
                                  onChange={(e) => setGrantAmount(parseInt(e.target.value) || 0)}
                                  style={{ width: 60, ...inputStyle, textAlign: "center" }}
                                />
                              </div>
                              <div style={{ flex: 1 }}>
                                <label style={{ fontSize: 11, color: MANA_TEXT_MUTED, display: "block", marginBottom: 3 }}>Reason</label>
                                <input
                                  type="text" value={grantReason} placeholder="e.g. Extra effort"
                                  onChange={(e) => setGrantReason(e.target.value)}
                                  onKeyDown={(e) => e.key === "Enter" && handleGrantStudent(uid)}
                                  style={{ width: "100%", ...inputStyle }}
                                />
                              </div>
                              <button
                                onClick={() => handleGrantStudent(uid)}
                                disabled={!grantReason.trim()}
                                className="mana-spell-btn"
                                style={{ ...btnPrimary, padding: "6px 14px", opacity: grantReason.trim() ? 1 : 0.5 }}
                              >
                                Grant
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Behavior Toast */}
      {behaviorToast && (
        <div style={{
          position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
          background: `linear-gradient(135deg, ${MANA_SURFACE}, ${MANA_GRAD_MID2})`,
          border: `1px solid ${ACCENT}66`, borderRadius: 10,
          padding: "12px 24px", fontSize: 14, fontWeight: 600, color: ACCENT,
          boxShadow: `0 8px 32px ${ACCENT}44, 0 0 30px ${ACCENT}22`,
          zIndex: 10000,
          animation: `toast-slide-in 0.3s ${EASE_ENTRANCE}`,
          textShadow: `0 0 8px ${ACCENT}44`,
        }}>
          {behaviorToast}
        </div>
      )}
    </main>
  );
}
