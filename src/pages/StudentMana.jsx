// src/pages/StudentMana.jsx
// Per-student mana page — balance, level, shop, transaction history.
// Route: /my-mana/:courseId

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { doc, getDoc, collection, getDocs, updateDoc, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import {
  getStudentMana, spendStudentMana, getManaState,
  awardStudentMana, saveManaState,
  getLevel, getNextLevel, getManaTitle,
  submitRewardSuggestion, getManaRequests,
  chargeStudentMana, applyGradeBonus, applyClassworkPass, autoSelectMage,
  MANA_LEVELS, MAGE_DAILY_BUDGET, MAGE_PER_STUDENT_CAP, MAGE_COMPLETION_BONUS, POSITIVE_BEHAVIORS,
  PERIOD_WINDOWS,
} from "../lib/mana";
import { createManaRequest } from "../lib/manaRequests";
import { createNotification } from "../lib/notifications";
import { isPerfMode } from "../lib/perfMode";
import DonationModal from "../components/DonationModal.jsx";

// Lazy-load GSAP — won't block initial render
let gsapModule = null;
const getGsap = () => {
  if (gsapModule) return Promise.resolve(gsapModule);
  return import("gsap").then(m => { gsapModule = m.default || m; return gsapModule; });
};

// ─── PALETTE ─────────────────────────────────────────
const ACCENT = "#ECD06F";           // gold — matches --brand
const ACCENT_PURPLE = "#a78bfa";    // keep purple for mana orb glow
const GOLD = "#ECD06F";
const MANA_BG = "var(--bg, #0a0a0f)";
const MANA_SURFACE = "var(--surface-0, #111116)";
const MANA_SURFACE2 = "var(--surface-1, #18181f)";
const MANA_BORDER = "var(--border, rgba(255,255,255,0.08))";
const MANA_TEXT = "var(--text, #ffffff)";
const MANA_TEXT_MUTED = "var(--text-2, rgba(255,255,255,0.60))";
const MANA_GRAD_MID = "var(--surface-0, #111116)";
const MANA_GRAD_MID2 = "var(--surface-1, #18181f)";

// ─── EASING CURVES ───────────────────────────────────
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

// ─── PARTICLE CANVAS ─────────────────────────────────
function ManaParticleCanvas() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const particlesRef = useRef([]);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    // Initialize particles
    const count = 50;
    const particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        baseX: Math.random() * window.innerWidth,
        vx: 0,
        vy: -(0.15 + Math.random() * 0.35),
        size: 1 + Math.random() * 3,
        opacity: 0.2 + Math.random() * 0.5,
        color: i % 6 === 0 ? GOLD : ACCENT,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.005 + Math.random() * 0.01,
        drift: 15 + Math.random() * 25,
      });
    }
    particlesRef.current = particles;

    function handleMouseMove(e) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    function animate() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (const p of particles) {
        p.phase += p.phaseSpeed;
        p.x = p.baseX + Math.sin(p.phase) * p.drift;
        p.y += p.vy;

        // Mouse repulsion
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150 && dist > 0) {
          const force = (150 - dist) / 150 * 2;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }

        // Reset when off top
        if (p.y < -10) {
          p.y = h + 10;
          p.baseX = Math.random() * w;
          p.x = p.baseX;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();

        // Glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        grad.addColorStop(0, p.color + "44");
        grad.addColorStop(1, p.color + "00");
        ctx.fillStyle = grad;
        ctx.globalAlpha = p.opacity * 0.5;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(animate);
    }
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed", inset: 0, zIndex: 0,
        pointerEvents: "none", willChange: "transform",
      }}
    />
  );
}

// ─── CSS KEYFRAMES ───────────────────────────────────
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
@keyframes smoke-drift-3 {
  0% { transform: translateX(10px) translateY(0) scale(0.9); }
  40% { transform: translateX(50px) translateY(-40px) scale(1.3); }
  100% { transform: translateX(10px) translateY(0) scale(0.9); }
}

/* === ORB ANIMATIONS === */
@keyframes orb-glow-pulse {
  0%, 100% { box-shadow: 0 0 30px rgba(16,185,129,0.3), 0 0 60px rgba(16,185,129,0.15), inset 0 0 20px rgba(16,185,129,0.15); }
  50% { box-shadow: 0 0 50px rgba(16,185,129,0.5), 0 0 90px rgba(16,185,129,0.25), inset 0 0 35px rgba(16,185,129,0.25); }
}
@keyframes orb-rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
@keyframes orb-inner-swirl {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(-360deg); }
}
@keyframes orb-float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
}
@keyframes orb-smoke-wisp {
  0% { transform: translateY(0) scale(1); opacity: 0.3; }
  50% { transform: translateY(-20px) scale(1.5); opacity: 0.15; }
  100% { transform: translateY(-40px) scale(2); opacity: 0; }
}
@keyframes rune-orbit {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* === CARD ANIMATIONS === */
@keyframes sparkle {
  0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
  50% { opacity: 1; transform: scale(1) rotate(180deg); }
}
@keyframes mage-aura-breathe {
  0%, 100% { box-shadow: 0 0 20px rgba(240, 200, 72, 0.15), 0 0 40px rgba(16, 185, 129, 0.1); }
  50% { box-shadow: 0 0 35px rgba(240, 200, 72, 0.3), 0 0 70px rgba(16, 185, 129, 0.2); }
}
@keyframes card-shimmer-sweep {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(300%); }
}
@keyframes mage-smoke-left {
  0%, 100% { transform: translateX(-20px) translateY(0) scale(1); opacity: 0.15; }
  50% { transform: translateX(10px) translateY(-15px) scale(1.2); opacity: 0.25; }
}
@keyframes mage-smoke-right {
  0%, 100% { transform: translateX(20px) translateY(0) scale(1); opacity: 0.12; }
  50% { transform: translateX(-10px) translateY(-20px) scale(1.3); opacity: 0.22; }
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
.mana-card-glow {
  transition: transform 0.3s ${EASE_SNAPPY}, box-shadow 0.3s ${EASE_SNAPPY};
  position: relative; overflow: hidden;
}
.mana-card-glow:hover {
  transform: translateY(-3px) scale(1.01);
  box-shadow: 0 8px 32px rgba(16, 185, 129, 0.15), 0 0 20px rgba(16, 185, 129, 0.08);
}
.mana-card-glow .shimmer-sweep {
  position: absolute; top: 0; left: 0; width: 50%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
  transform: translateX(-100%);
  pointer-events: none;
}
.mana-card-glow:hover .shimmer-sweep {
  animation: card-shimmer-sweep 0.8s ${EASE_ENTRANCE} forwards;
}

/* === SPELL BUTTONS === */
.mana-spell-btn {
  transition: transform 0.2s ${EASE_SNAPPY}, box-shadow 0.2s ${EASE_SNAPPY};
  position: relative; overflow: hidden;
}
.mana-spell-btn:hover {
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.3), 0 0 8px rgba(124, 58, 237, 0.2);
  transform: translateY(-1px);
}
.mana-spell-btn:active {
  transform: translateY(0) scale(0.97);
}
.mana-spell-btn .ripple-circle {
  position: absolute; border-radius: 50%; pointer-events: none;
  background: rgba(16, 185, 129, 0.3);
  transform: scale(0); opacity: 1;
}
.mana-spell-btn .ripple-circle.active {
  animation: ripple-expand 0.5s ${EASE_ENTRANCE} forwards;
}
@keyframes ripple-expand {
  to { transform: scale(2.5); opacity: 0; }
}

/* === ENCHANTMENT LOG === */
.enchantment-log-entry {
  transition: background 0.2s ${EASE_SNAPPY};
}
.enchantment-log-entry:hover {
  background: rgba(16, 185, 129, 0.04);
}

/* === SCROLLBAR === */
.mana-page::-webkit-scrollbar { width: 6px; }
.mana-page::-webkit-scrollbar-track { background: transparent; }
.mana-page::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.10); border-radius: 3px; }
.mana-page::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.18); }

/* === PERF MODE OVERRIDES === */
.perf-mode .mana-smoke-wrapper,
.perf-mode .mana-vignette { display: none; }
.perf-mode .mana-card-glow:hover { transform: none; }
`;

export default function StudentMana() {
  const { courseId: routeCourseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(routeCourseId || null);
  const courseId = selectedCourse;

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [mana, setMana] = useState(null);
  const [powers, setPowers] = useState([]);
  const [confirmPower, setConfirmPower] = useState(null);
  const [toast, setToast] = useState(null);
  const [historyExpanded, setHistoryExpanded] = useState(false);

  // Quote request modal
  const [quoteModal, setQuoteModal] = useState(null);
  const [quoteDescription, setQuoteDescription] = useState("");
  const [quoteModelUrl, setQuoteModelUrl] = useState("");

  // Suggest a reward modal
  const [showSuggestModal, setShowSuggestModal] = useState(false);
  const [suggestionText, setSuggestionText] = useState("");

  // Input-required power modal
  const [inputModal, setInputModal] = useState(null);
  const [inputText, setInputText] = useState("");

  // Grade bonus modal
  const [bonusModal, setBonusModal] = useState(null);
  const [bonusLessons, setBonusLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);

  // Pending priced requests
  const [pricedRequests, setPricedRequests] = useState([]);

  // Mage/Enchantress state
  const [poolState, setPoolState] = useState(null);
  const [isMage, setIsMage] = useState(false);
  const [mageGender, setMageGender] = useState('M');
  const [classmates, setClassmates] = useState({});
  const [mageBudgetUsed, setMageBudgetUsed] = useState(0);

  // Donation modal — separate classmate list (always loaded, not gated on mage status)
  const [donationOpen, setDonationOpen] = useState(false);
  const [donationClassmates, setDonationClassmates] = useState([]);

  // Load classmates for the donation modal whenever course changes.
  // Uses enrollments → user docs (NOT a full users-collection scan) — see ManaPool.jsx for the same pattern.
  useEffect(() => {
    let alive = true;
    if (!user?.uid || !courseId) return;
    (async () => {
      try {
        const enrollSnap = await getDocs(query(collection(db, "enrollments"), where("courseId", "==", courseId)));
        const peerUids = enrollSnap.docs
          .map((d) => d.data().uid || d.data().studentUid)
          .filter((uid) => uid && uid !== user.uid);
        const userDocs = await Promise.allSettled(peerUids.map((uid) => getDoc(doc(db, "users", uid))));
        const peers = [];
        for (let i = 0; i < userDocs.length; i++) {
          const r = userDocs[i];
          if (r.status !== "fulfilled" || !r.value.exists()) continue;
          const data = r.value.data();
          if (data.role === "teacher" || data.isTestStudent) continue;
          peers.push({ uid: peerUids[i], displayName: data.displayName || data.email || peerUids[i] });
        }
        if (alive) setDonationClassmates(peers);
      } catch (e) {
        console.warn("[StudentMana] Failed to load donation classmates:", e);
      }
    })();
    return () => { alive = false; };
  }, [courseId, user?.uid]);

  // Perf & capability
  const [perfMode] = useState(() => isPerfMode() || isLowEnd());
  const [mounted, setMounted] = useState(false);

  // Refs for GSAP entrance
  const orbRef = useRef(null);
  const balanceRef = useRef(null);
  const levelBadgeRef = useRef(null);
  const sectionsRef = useRef([]);
  const smokeWrapRef = useRef(null);
  const mageTitleRef = useRef(null);

  // Load enrolled courses for selector
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const userSnap = await getDoc(doc(db, "users", user.uid));
        const enrolled = userSnap.exists() ? userSnap.data().enrolledCourses || {} : {};
        const courseIds = Object.keys(enrolled).filter(id => enrolled[id]);
        const courseDocs = await Promise.all(courseIds.map(id => getDoc(doc(db, "courses", id))));
        const list = courseDocs.filter(d => d.exists() && !d.data().hidden).map(d => ({ id: d.id, title: d.data().title }));
        setCourses(list);
        if (!selectedCourse && list.length > 0) setSelectedCourse(list[0].id);
      } catch (e) { console.warn("Course fetch error:", e); }
    })();
  }, [user]);

  useEffect(() => {
    if (!user || !courseId) return;
    load();
  }, [courseId, user]);

  async function load() {
    setLoading(true);
    try {
      const [courseSnap, studentData, pool] = await Promise.all([
        getDoc(doc(db, "courses", courseId)),
        getStudentMana(courseId, user.uid),
        getManaState(courseId),
      ]);
      if (courseSnap.exists()) setCourse({ id: courseSnap.id, ...courseSnap.data() });
      setMana(studentData);
      setPowers(pool.powers || []);

      let activePool = pool;

      // Auto-summon if no mage for today and pool is enabled
      const today = new Date().toISOString().split("T")[0];
      if (pool.enabled && (!pool.mageDate || pool.mageDate !== today)) {
        try {
          const result = await autoSelectMage(courseId);
          if (result && typeof result !== 'string') {
            activePool = result.poolState;
            const title = getManaTitle(result.gender);
            await createNotification(result.uid, {
              type: "announcement",
              title: `You've been summoned as today's ${title}!`,
              body: "You can award mana to classmates today. Use your power wisely!",
              icon: result.gender === 'F' ? '🧝‍♀️' : '🧙',
              courseId,
            });
          }
        } catch (e) {
          console.warn("Auto-summon failed:", e);
        }
      }

      setPoolState(activePool);

      try {
        const allRequests = await getManaRequests(courseId);
        const priced = allRequests.filter(r => r.studentUid === user.uid && r.status === "priced");
        setPricedRequests(priced);
      } catch (e) { console.warn("Failed to load requests:", e); }

      const isTestStudent = user.email === "lmccart4@gmail.com";
      const isTodaysMage = isTestStudent || (activePool.mageStudentId === user.uid && activePool.mageDate === today);
      setIsMage(isTodaysMage);
      setMageBudgetUsed(activePool.mageBudgetUsed || 0);

      if (isTodaysMage) {
        try {
          const userSnap = await getDoc(doc(db, "users", user.uid));
          if (userSnap.exists()) setMageGender(userSnap.data().gender || 'M');
        } catch (e) { /* ignore */ }

        try {
          const usersSnap = await getDocs(collection(db, "users"));
          const names = {};
          usersSnap.forEach((d) => {
            const data = d.data();
            if (data.role === "teacher" || d.id === user.uid) return;
            const enrolled = data.enrolledCourses || {};
            if (enrolled[courseId]) names[d.id] = data.displayName || data.email || d.id;
          });
          setClassmates(names);
        } catch (e) {
          console.warn("Failed to load classmates:", e);
        }
      }
    } catch (err) {
      console.error("Error loading student mana:", err);
    }
    setLoading(false);
    setMounted(true);
  }

  // ─── GSAP ENTRANCE SEQUENCE ──────────────────────────
  useEffect(() => {
    if (!mounted || loading || perfMode) return;

    getGsap().then(gsap => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Smoke fade in
      if (smokeWrapRef.current) {
        gsap.set(smokeWrapRef.current, { opacity: 0.4 });
        tl.to(smokeWrapRef.current, { opacity: 1, duration: 0.6 }, 0);
      }

      // Orb scales in with elastic bounce
      if (orbRef.current) {
        gsap.set(orbRef.current, { scale: 0.5, opacity: 0 });
        tl.to(orbRef.current, {
          scale: 1, opacity: 1, duration: 0.8,
          ease: "elastic.out(1, 0.5)",
        }, 0.3);
      }

      // Balance counts up from 0
      if (balanceRef.current && mana) {
        const target = mana.balance || 0;
        const obj = { val: 0 };
        tl.to(obj, {
          val: target, duration: 0.6,
          ease: "power2.out",
          snap: { val: 1 },
          onUpdate: () => {
            if (balanceRef.current) balanceRef.current.textContent = Math.round(obj.val);
          },
        }, 0.5);
      }

      // Level badge
      if (levelBadgeRef.current) {
        gsap.set(levelBadgeRef.current, { opacity: 0.4, y: 20 });
        tl.to(levelBadgeRef.current, { opacity: 1, y: 0, duration: 0.4 }, 0.7);
      }

      // Mage title text reveal
      if (mageTitleRef.current) {
        const chars = mageTitleRef.current.querySelectorAll(".mage-char");
        if (chars.length) {
          gsap.set(chars, { opacity: 0, y: 10 });
          tl.to(chars, {
            opacity: 1, y: 0, duration: 0.3,
            stagger: 0.02, ease: "power2.out",
          }, 0.4);
        }
      }

      // Section cards stagger in
      const sections = sectionsRef.current.filter(Boolean);
      if (sections.length) {
        gsap.set(sections, { opacity: 0.4, y: 30 });
        tl.to(sections, {
          opacity: 1, y: 0, duration: 0.5,
          stagger: 0.12, ease: "power3.out",
        }, 0.9);
      }
    }).catch(() => { /* GSAP not available, CSS fallback */ });
  }, [mounted, loading, perfMode, mana]);

  async function handleMageAward(targetUid, behaviorId) {
    if (!poolState) { setToast("Loading... try again in a moment."); setTimeout(() => setToast(null), 2500); return; }
    if (targetUid === user.uid) {
      setToast("You can't award mana to yourself!");
      setTimeout(() => setToast(null), 2500);
      return;
    }
    const behavior = POSITIVE_BEHAVIORS.find(b => b.id === behaviorId);
    if (!behavior) return;
    const newUsed = (poolState.mageBudgetUsed || 0) + behavior.mana;
    if (newUsed > MAGE_DAILY_BUDGET) {
      setToast("Not enough budget remaining!");
      setTimeout(() => setToast(null), 2500);
      return;
    }
    const perStudent = poolState.magePerStudent || {};
    const givenToTarget = (perStudent[targetUid] || 0) + behavior.mana;
    if (givenToTarget > MAGE_PER_STUDENT_CAP) {
      setToast(`Max ${MAGE_PER_STUDENT_CAP} mana per student per day!`);
      setTimeout(() => setToast(null), 2500);
      return;
    }
    try {
      await awardStudentMana(courseId, targetUid, behavior.mana, `${behavior.label} (from ${getManaTitle(mageGender)})`);
      const updatedPerStudent = { ...perStudent, [targetUid]: givenToTarget };
      const updatedPool = { ...poolState, mageBudgetUsed: newUsed, magePerStudent: updatedPerStudent };
      setPoolState(updatedPool);
      setMageBudgetUsed(newUsed);
      await saveManaState(courseId, undefined, updatedPool);
      const name = classmates[targetUid] || "Classmate";
      setToast(`+${behavior.mana} mana to ${name} (${behavior.label})`);
      setTimeout(() => setToast(null), 2500);

      if (newUsed >= MAGE_DAILY_BUDGET && (poolState.mageBudgetUsed || 0) < MAGE_DAILY_BUDGET) {
        await awardStudentMana(courseId, user.uid, MAGE_COMPLETION_BONUS, `${getManaTitle(mageGender)} bonus — used full daily budget`);
        setToast(`+${MAGE_COMPLETION_BONUS} mana for using your full budget! Great leadership!`);
        setTimeout(() => setToast(null), 3000);
      }
    } catch (err) {
      console.error("Mage award failed:", err);
      setToast("Failed to award mana — try again.");
      setTimeout(() => setToast(null), 3000);
    }
  }

  async function handleRedeem(power) {
    try {
      await spendStudentMana(courseId, user.uid, power.id);
      await createManaRequest({
        courseId,
        studentUid: user.uid,
        studentName: user.displayName || user.email || "Student",
        powerId: power.id,
        powerName: power.name,
        cost: power.cost,
      });
      setConfirmPower(null);
      setToast(`${power.icon || "✦"} ${power.name} activated! Mr. McCarthy has been notified.`);
      setTimeout(() => setToast(null), 3500);
      await load();
    } catch (err) {
      alert(err.message);
      setConfirmPower(null);
    }
  }

  // Ripple handler for buttons
  const spawnRipple = useCallback((e) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const circle = document.createElement("span");
    circle.className = "ripple-circle active";
    circle.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px;`;
    btn.appendChild(circle);
    setTimeout(() => circle.remove(), 500);
  }, []);

  // ─── EARLY RETURNS ─────────────────────────────────
  const smokeAndParticles = (
    <>
      <div className="mana-smoke-wrapper" ref={smokeWrapRef}>
        <div className="mana-smoke-layer" style={{
          width: 500, height: 500, top: '5%', left: '-10%',
          background: 'radial-gradient(ellipse, rgba(16,185,129,0.18), transparent 70%)',
          animation: 'smoke-drift-1 15s ease-in-out infinite',
          opacity: 0.15,
        }} />
        <div className="mana-smoke-layer" style={{
          width: 450, height: 450, bottom: '5%', right: '-10%',
          background: 'radial-gradient(ellipse, rgba(124,58,237,0.15), transparent 70%)',
          animation: 'smoke-drift-2 20s ease-in-out infinite',
          opacity: 0.15,
        }} />
        <div className="mana-smoke-layer" style={{
          width: 300, height: 300, top: '15%', left: '30%',
          background: 'radial-gradient(ellipse, rgba(240,200,72,0.12), transparent 70%)',
          animation: 'smoke-drift-3 12s ease-in-out infinite',
          opacity: 0.15,
        }} />
      </div>
      {!perfMode && <ManaParticleCanvas />}
      <div className="mana-vignette" />
    </>
  );

  if (loading) {
    return (
      <main id="main-content" className="page-wrapper mana-page" style={{
        display: "flex", justifyContent: "center", paddingTop: 120,
        background: `radial-gradient(ellipse at 50% 30%, ${MANA_SURFACE} 0%, ${MANA_BG} 70%, ${MANA_BG} 100%)`,
        minHeight: "100vh", position: "relative", color: MANA_TEXT,
      }}>
        <style>{manaStyles}</style>
        {smokeAndParticles}
        <div className="spinner" style={{ position: "relative", zIndex: 2 }} />
      </main>
    );
  }

  if (!course) {
    return (
      <main id="main-content" className="page-wrapper mana-page" style={{
        background: `radial-gradient(ellipse at 50% 30%, ${MANA_SURFACE} 0%, ${MANA_BG} 70%, ${MANA_BG} 100%)`,
        minHeight: "100vh", position: "relative", color: MANA_TEXT,
      }}>
        <style>{manaStyles}</style>
        {smokeAndParticles}
        <div className="empty-state" style={{ position: "relative", zIndex: 2 }}><div className="empty-state-text" style={{ color: MANA_TEXT }}>Course not found</div></div>
      </main>
    );
  }

  const level = getLevel(mana?.lifetimeEarned || 0);
  const nextLevel = getNextLevel(mana?.lifetimeEarned || 0);
  const progressPct = nextLevel
    ? Math.min(((mana?.lifetimeEarned || 0) - level.threshold) / (nextLevel.threshold - level.threshold) * 100, 100)
    : 100;
  const history = mana?.history || [];
  const displayHistory = historyExpanded ? history : history.slice(0, 5);
  const orbFillPct = Math.min((mana?.balance || 0) / 200 * 100, 100);

  // Helper: stagger char spans for mage title
  function charSpans(text) {
    return text.split("").map((ch, i) => (
      <span key={i} className="mage-char" style={{ display: "inline-block" }}>
        {ch === " " ? "\u00A0" : ch}
      </span>
    ));
  }

  const addSectionRef = (el) => {
    if (el && !sectionsRef.current.includes(el)) sectionsRef.current.push(el);
  };

  return (
    <main id="main-content" className="page-wrapper mana-page" style={{
      background: `radial-gradient(ellipse at 50% 30%, ${MANA_SURFACE} 0%, ${MANA_BG} 70%, ${MANA_BG} 100%)`,
      minHeight: "100vh", position: "relative", color: MANA_TEXT,
    }}>
      <style>{manaStyles}</style>
      {smokeAndParticles}
      <div style={{ maxWidth: 640, margin: "0 auto", position: "relative", zIndex: 2 }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
          <button
            onClick={() => navigate(`/course/${courseId}`)}
            className="mana-spell-btn"
            style={{
              padding: "6px 12px", borderRadius: 8, border: `1px solid ${MANA_BORDER}`,
              background: "transparent", color: MANA_TEXT_MUTED, fontWeight: 600, fontSize: 13, cursor: "pointer",
            }}
          >
            ← Back
          </button>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: MANA_TEXT, margin: 0, textShadow: `0 0 20px ${ACCENT}44` }}>
            <span style={{ color: ACCENT, filter: `drop-shadow(0 0 8px ${ACCENT})` }}>✦</span> My Mana
          </h1>
        </div>

        {/* Decorative rune line */}
        <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${ACCENT}66, ${GOLD}44, ${ACCENT}66, transparent)`, marginBottom: 16 }} />

        {courses.length > 1 && (
          <select
            value={courseId}
            onChange={(e) => setSelectedCourse(e.target.value)}
            style={{
              marginBottom: 16, padding: "8px 12px", borderRadius: 8,
              border: `1px solid ${MANA_BORDER}`, background: MANA_SURFACE,
              color: MANA_TEXT, fontSize: 14, fontWeight: 500, cursor: "pointer", width: "100%",
            }}
          >
            {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        )}
        {courses.length <= 1 && (
          <p style={{ marginBottom: 20, color: MANA_TEXT_MUTED, fontSize: 13 }}>
            {course.title}
          </p>
        )}

        {/* ═══ MAGE / ENCHANTRESS SECTION ═══ */}
        {isMage && (
          <div ref={addSectionRef} style={{
            background: `linear-gradient(135deg, ${MANA_SURFACE}, ${MANA_GRAD_MID}, ${MANA_GRAD_MID2})`,
            border: `2px solid ${GOLD}44`,
            outline: `1px solid ${GOLD}22`,
            outlineOffset: 3,
            borderRadius: 16,
            padding: "20px 24px", marginBottom: 20, position: "relative", overflow: "hidden",
            animation: `mage-aura-breathe 2s ease-in-out infinite`,
          }}>
            {/* Corner flourishes */}
            {[
              { top: 0, left: 0, bT: true, bL: true, br: "4px 0 0 0" },
              { top: 0, right: 0, bT: true, bR: true, br: "0 4px 0 0" },
              { bottom: 0, left: 0, bB: true, bL: true, br: "0 0 0 4px" },
              { bottom: 0, right: 0, bB: true, bR: true, br: "0 0 4px 0" },
            ].map((c, i) => (
              <div key={i} style={{
                position: "absolute", width: 28, height: 28, pointerEvents: "none",
                ...(c.top !== undefined ? { top: c.top } : {}),
                ...(c.bottom !== undefined ? { bottom: c.bottom } : {}),
                ...(c.left !== undefined ? { left: c.left } : {}),
                ...(c.right !== undefined ? { right: c.right } : {}),
                borderTop: c.bT ? `2px solid ${GOLD}66` : "none",
                borderBottom: c.bB ? `2px solid ${GOLD}66` : "none",
                borderLeft: c.bL ? `2px solid ${GOLD}66` : "none",
                borderRight: c.bR ? `2px solid ${GOLD}66` : "none",
                borderRadius: c.br,
              }}>
                {/* Rotated gold square at corner */}
                <div style={{
                  position: "absolute",
                  top: c.bT ? -3 : "auto", bottom: c.bB ? -3 : "auto",
                  left: c.bL ? -3 : "auto", right: c.bR ? -3 : "auto",
                  width: 6, height: 6, background: GOLD,
                  transform: "rotate(45deg)", opacity: 0.6,
                }} />
              </div>
            ))}

            {/* Animated smoke at edges */}
            <div style={{
              position: "absolute", top: "20%", left: -30, width: 120, height: 120,
              borderRadius: "50%", background: `radial-gradient(ellipse, rgba(240,200,72,0.15), transparent 70%)`,
              filter: "blur(25px)", pointerEvents: "none",
              animation: "mage-smoke-left 8s ease-in-out infinite",
            }} />
            <div style={{
              position: "absolute", top: "30%", right: -30, width: 100, height: 100,
              borderRadius: "50%", background: `radial-gradient(ellipse, rgba(240,200,72,0.12), transparent 70%)`,
              filter: "blur(20px)", pointerEvents: "none",
              animation: "mage-smoke-right 10s ease-in-out infinite",
            }} />

            {/* Golden particles */}
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{
                position: "absolute",
                top: `${10 + (i * 13) % 80}%`, left: `${5 + (i * 17) % 90}%`,
                width: 3 + (i % 2), height: 3 + (i % 2), borderRadius: "50%",
                background: GOLD, opacity: 0.7,
                boxShadow: `0 0 4px ${GOLD}, 0 0 8px ${GOLD}88`,
                animation: `sparkle ${2 + i * 0.4}s ease-in-out ${i * 0.25}s infinite`,
                pointerEvents: "none",
              }} />
            ))}

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, position: "relative" }}>
              <span style={{ fontSize: 32, filter: `drop-shadow(0 0 12px ${GOLD}88)` }}>{mageGender === 'F' ? '🧝‍♀️' : '🧙'}</span>
              <div>
                <div ref={mageTitleRef} style={{ fontWeight: 700, fontSize: 16, color: GOLD, textShadow: `0 0 16px ${GOLD}55` }}>
                  {charSpans(`You are today's ${getManaTitle(mageGender)}!`)}
                </div>
                <div style={{ fontSize: 12, color: MANA_TEXT_MUTED, marginTop: 2 }}>
                  You have {MAGE_DAILY_BUDGET - mageBudgetUsed} mana left to give out today
                </div>
              </div>
            </div>

            {/* Budget bar */}
            <div style={{
              height: 6, background: MANA_SURFACE2, borderRadius: 3, overflow: "hidden", marginBottom: 14,
              boxShadow: `inset 0 0 4px rgba(0,0,0,0.4)`,
            }}>
              <div style={{
                width: `${Math.min((mageBudgetUsed / MAGE_DAILY_BUDGET) * 100, 100)}%`, height: "100%",
                background: `linear-gradient(90deg, ${GOLD}, ${ACCENT})`,
                borderRadius: 3, transition: `width 0.4s ${EASE_HEAVY}`,
                boxShadow: `0 0 8px ${GOLD}66`,
              }} />
            </div>

            {mageBudgetUsed >= MAGE_DAILY_BUDGET ? (
              <div style={{ color: GOLD, fontSize: 13, fontStyle: "italic" }}>
                You've given out all your mana for today. Great leadership!
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 8 }}>
                {Object.entries(classmates)
                  .filter(([uid]) => uid !== user.uid)
                  .sort(([, a], [, b]) => a.localeCompare(b))
                  .map(([uid, name]) => {
                    const givenToThis = (poolState?.magePerStudent || {})[uid] || 0;
                    const remainingForThis = MAGE_PER_STUDENT_CAP - givenToThis;
                    const remainingBudget = MAGE_DAILY_BUDGET - mageBudgetUsed;
                    const maxCanGive = Math.min(remainingForThis, remainingBudget);
                    return (
                      <div key={uid} className="mana-card-glow" style={{
                        padding: "10px 12px", borderRadius: 10, background: MANA_SURFACE2,
                        border: `1px solid ${ACCENT}33`,
                        opacity: maxCanGive <= 0 ? 0.4 : 1,
                      }}>
                        <div className="shimmer-sweep" />
                        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: MANA_TEXT }}>
                          {name.split(" ")[0]}
                        </div>
                        <div style={{ fontSize: 10, color: MANA_TEXT_MUTED, marginBottom: 6 }}>
                          {givenToThis}/{MAGE_PER_STUDENT_CAP} given
                        </div>
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                          {maxCanGive > 0 && POSITIVE_BEHAVIORS.filter(b => b.mana <= maxCanGive).map(b => (
                            <button
                              key={b.id}
                              onClick={() => {
                                console.log("MAGE CLICK:", uid, b.id);
                                handleMageAward(uid, b.id);
                              }}
                              title={`${b.label} (+${b.mana})`}
                              style={{
                                padding: "6px 10px", borderRadius: 6, border: `1px solid ${MANA_BORDER}`,
                                background: MANA_SURFACE, cursor: "pointer", fontSize: 14,
                                color: MANA_TEXT, position: "relative", zIndex: 5,
                              }}
                            >
                              {b.icon}
                            </button>
                          ))}
                          {maxCanGive <= 0 && <span style={{ fontSize: 11, color: MANA_TEXT_MUTED }}>Maxed</span>}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

        {/* ═══ MANA ORB BALANCE CARD ═══ */}
        <div ref={addSectionRef} style={{
          background: `linear-gradient(135deg, ${MANA_SURFACE}, ${MANA_GRAD_MID}, ${MANA_GRAD_MID2})`,
          border: `1px solid ${MANA_BORDER}`,
          borderRadius: 16,
          padding: "28px 28px 24px", marginBottom: 20, position: "relative", overflow: "hidden",
        }}>
          {/* Sparkle particles */}
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{
              position: "absolute",
              top: `${15 + (i * 15) % 70}%`, right: `${8 + (i * 18) % 80}%`,
              width: 2 + (i % 2), height: 2 + (i % 2), borderRadius: "50%",
              background: i % 2 === 0 ? ACCENT : GOLD, opacity: 0.5,
              boxShadow: `0 0 4px ${i % 2 === 0 ? ACCENT : GOLD}`,
              animation: `sparkle ${2.5 + i * 0.6}s ease-in-out ${i * 0.35}s infinite`,
              pointerEvents: "none",
            }} />
          ))}

          <div style={{ textAlign: "center", position: "relative" }}>
            {/* Animated Mana Orb — Full Mystical Treatment */}
            <div ref={orbRef} style={{
              width: 140, height: 140, margin: "0 auto 16px",
              position: "relative",
              animation: `orb-float 3s ease-in-out infinite`,
            }}>
              {/* Smoke wisps from orb */}
              {[...Array(3)].map((_, i) => (
                <div key={`wisp-${i}`} style={{
                  position: "absolute", top: -10, left: 25 + i * 30, width: 30, height: 30,
                  borderRadius: "50%",
                  background: `radial-gradient(ellipse, ${ACCENT}${Math.round(15 + orbFillPct * 0.2).toString(16).padStart(2, '0')}, transparent 70%)`,
                  filter: "blur(8px)", pointerEvents: "none",
                  animation: `orb-smoke-wisp ${3 + i * 0.8}s ease-in-out ${i * 1.2}s infinite`,
                  opacity: Math.min(orbFillPct / 100, 0.8),
                }} />
              ))}

              {/* Rotating rune ring */}
              <div style={{
                position: "absolute", inset: -25,
                animation: "rune-orbit 30s linear infinite",
                pointerEvents: "none",
              }}>
                {['ᚱ', 'ᛃ', 'ᚨ', 'ᛊ', 'ᛞ', 'ᚹ'].map((rune, i) => (
                  <span key={i} style={{
                    position: "absolute", top: "50%", left: "50%",
                    fontSize: 12, color: `${ACCENT}55`,
                    textShadow: `0 0 8px ${ACCENT}44, 0 0 16px ${ACCENT}22`,
                    transform: `rotate(${i * 60}deg) translateX(85px) rotate(-${i * 60}deg)`,
                    transformOrigin: "0 0",
                  }}>{rune}</span>
                ))}
              </div>

              {/* Conic-gradient energy swirl */}
              <div style={{
                position: "absolute", inset: -10,
                borderRadius: "50%",
                background: `conic-gradient(from 0deg, ${ACCENT}00, ${ACCENT}55, ${ACCENT_PURPLE}33, ${ACCENT}00, ${ACCENT}44, ${ACCENT_PURPLE}22, ${ACCENT}00)`,
                animation: "orb-rotate 8s linear infinite",
                opacity: 0.6 + orbFillPct * 0.004,
              }} />

              {/* Orb body */}
              <div style={{
                width: 140, height: 140, borderRadius: "50%",
                background: `radial-gradient(ellipse at 35% 30%, ${ACCENT}44, ${ACCENT_PURPLE}22, ${MANA_SURFACE2} 65%)`,
                border: `2px solid ${ACCENT}44`,
                position: "relative", overflow: "hidden",
                animation: "orb-glow-pulse 3s ease-in-out infinite",
                boxShadow: `0 0 40px rgba(16,185,129,0.4), 0 0 80px rgba(16,185,129,0.2)`,
              }}>
                {/* Inner swirling energy */}
                <div style={{
                  position: "absolute", inset: 10, borderRadius: "50%",
                  background: `conic-gradient(from 45deg, ${ACCENT}22, ${ACCENT_PURPLE}18, transparent, ${ACCENT}15, transparent, ${ACCENT_PURPLE}12, ${ACCENT}18)`,
                  animation: "orb-inner-swirl 8s linear infinite",
                  opacity: 0.7,
                }} />
                {/* Fill level */}
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  height: `${orbFillPct}%`,
                  background: `linear-gradient(to top, #064e3b, ${ACCENT}88, ${ACCENT}33)`,
                  transition: `height 0.8s ${EASE_HEAVY}`,
                  borderRadius: "0 0 50% 50%",
                  boxShadow: `inset 0 10px 20px ${ACCENT}22`,
                }} />
                {/* Glass highlight */}
                <div style={{
                  position: "absolute", top: 22, left: 36, width: 28, height: 16,
                  borderRadius: "50%", background: "rgba(255,255,255,0.15)",
                  transform: "rotate(-30deg)",
                }} />
              </div>
            </div>

            {/* Balance number */}
            <div
              ref={balanceRef}
              style={{
                fontFamily: "var(--font-display), ui-monospace, monospace", fontSize: 48, fontWeight: 800,
                color: MANA_TEXT, lineHeight: 1,
                textShadow: `0 0 20px rgba(16,185,129,0.6), 0 0 48px ${ACCENT}33, 0 0 80px ${ACCENT_PURPLE}22`,
              }}
            >
              {mana?.balance || 0}
            </div>
            <div style={{
              fontSize: 13, color: GOLD, fontWeight: 600, marginTop: 4,
              letterSpacing: "0.2em", textTransform: "uppercase",
              fontVariant: "small-caps",
              textShadow: `0 0 8px ${GOLD}33`,
            }}>
              mana crystals
            </div>

            {/* Level badge */}
            <div ref={levelBadgeRef} style={{
              display: "inline-flex", alignItems: "center", gap: 6, marginTop: 12,
              padding: "4px 14px", borderRadius: 20,
              background: `${level.color}18`, border: `1px solid ${level.color}44`,
            }}>
              <span style={{ fontSize: 12, color: level.color, fontWeight: 700 }}>{level.label}</span>
            </div>

            {/* XP Progress bar */}
            {nextLevel && (
              <div style={{ marginTop: 10 }}>
                <div style={{
                  height: 4, background: MANA_SURFACE2, borderRadius: 2, overflow: "hidden",
                }}>
                  <div style={{
                    width: `${progressPct}%`, height: "100%",
                    background: `linear-gradient(90deg, ${ACCENT}, #06b6d4)`,
                    borderRadius: 2, transition: `width 0.6s ${EASE_HEAVY}`,
                    boxShadow: `0 0 6px ${ACCENT}44`,
                  }} />
                </div>
                <div style={{ fontSize: 10, color: MANA_TEXT_MUTED, marginTop: 4 }}>
                  {mana?.lifetimeEarned || 0} / {nextLevel.threshold} XP to {nextLevel.label}
                </div>
              </div>
            )}

            {/* ═══ SEND MANA ═══ */}
            <button
              onClick={() => setDonationOpen(true)}
              style={{
                marginTop: 16,
                padding: "10px 20px",
                borderRadius: 10,
                border: "none",
                background: `linear-gradient(135deg, ${ACCENT}, #c9a020)`,
                color: "#0a0a0f",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.04em",
                cursor: "pointer",
                boxShadow: `0 4px 16px ${ACCENT}33`,
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `0 6px 20px ${ACCENT}55`; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 4px 16px ${ACCENT}33`; }}
            >
              ✨ Send mana to a classmate
            </button>
          </div>
        </div>

        {/* ═══ SPELLBOOK ═══ */}
        <div ref={addSectionRef} style={{
          background: `linear-gradient(135deg, ${MANA_SURFACE}, ${MANA_GRAD_MID}, ${MANA_GRAD_MID2})`,
          border: `1px solid ${MANA_BORDER}`,
          borderRadius: 14,
          padding: "18px 22px", marginBottom: 20,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 18, filter: `drop-shadow(0 0 6px ${ACCENT}66)` }}>📖</span>
            <div style={{ fontSize: 16, fontWeight: 700, color: MANA_TEXT, textShadow: `0 0 12px ${ACCENT}22` }}>Spellbook</div>
          </div>
          <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${ACCENT}55, ${GOLD}33, ${ACCENT}55, transparent)`, marginBottom: 14 }} />

          {powers.length === 0 ? (
            <div style={{ color: MANA_TEXT_MUTED, fontSize: 13 }}>No spells available yet.</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10 }}>
              {powers.map((power) => {
                const canAfford = (mana?.balance || 0) >= power.cost;
                return (
                  <div key={power.id} className="mana-card-glow" style={{
                    padding: "14px 16px", borderRadius: 10,
                    background: canAfford
                      ? `linear-gradient(135deg, ${MANA_SURFACE2}, ${MANA_GRAD_MID2}, ${MANA_SURFACE2})`
                      : MANA_SURFACE2,
                    border: canAfford ? `1px solid ${ACCENT}33` : `1px solid ${MANA_BORDER}`,
                    outline: canAfford ? `1px solid ${GOLD}15` : "none",
                    outlineOffset: 2,
                    opacity: canAfford ? 1 : 0.45,
                    cursor: canAfford ? "pointer" : "default",
                    backdropFilter: "blur(8px)",
                    boxShadow: canAfford
                      ? `0 0 16px ${ACCENT}15, inset 0 0 20px ${ACCENT}05, 0 1px 0 ${GOLD}11`
                      : "none",
                  }}>
                    <div className="shimmer-sweep" />

                    {/* Icon with radial glow */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <div style={{ position: "relative" }}>
                        <div style={{
                          position: "absolute", inset: -8, borderRadius: "50%",
                          background: canAfford ? `radial-gradient(${ACCENT}22, transparent 70%)` : "none",
                          pointerEvents: "none",
                        }} />
                        <span style={{
                          fontSize: 22, position: "relative",
                          filter: canAfford ? `drop-shadow(0 0 8px ${ACCENT}66)` : "none",
                        }}>{power.icon || "⚡"}</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, color: MANA_TEXT }}>{power.name}</div>
                        <div style={{ fontSize: 11, color: MANA_TEXT_MUTED }}>{power.description}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                      <span style={{
                        fontSize: 13, fontWeight: 700,
                        color: power.isQuoteRequest ? MANA_TEXT_MUTED : canAfford ? GOLD : MANA_TEXT_MUTED,
                        textShadow: canAfford && !power.isQuoteRequest ? `0 0 8px ${GOLD}44` : "none",
                      }}>
                        {power.isQuoteRequest ? "Quote" : `${power.cost} ✦`}
                      </span>
                      <button
                        disabled={power.isQuoteRequest ? false : !canAfford}
                        onClick={async (e) => {
                          spawnRipple(e);
                          if (power.isQuoteRequest) { setQuoteModal(power); }
                          else if (power.id === "classwork-pass" || power.category === "gradeBonus") {
                            try {
                              const lessonsSnap = await getDocs(collection(db, "courses", courseId, "lessons"));
                              const visible = lessonsSnap.docs
                                .map(d => ({ id: d.id, ...d.data() }))
                                .filter(l => l.visible !== false)
                                .filter(l => !power.gradeFilter || (l.gradeCategory || "classwork") === power.gradeFilter)
                                .sort((a, b) => (b.dueDate || "").localeCompare(a.dueDate || ""));
                              setBonusLessons(visible);
                              setBonusModal(power);
                              setSelectedLesson(null);
                            } catch (e) { console.error(e); }
                          }
                          else if (power.requiresInput) { setInputModal(power); }
                          else { setConfirmPower(power); }
                        }}
                        className="mana-spell-btn"
                        style={{
                          padding: "6px 14px", borderRadius: 7, border: "none", fontWeight: 600, fontSize: 12,
                          cursor: power.isQuoteRequest || canAfford ? "pointer" : "default",
                          background: power.isQuoteRequest || canAfford ? `linear-gradient(135deg, ${ACCENT}, ${ACCENT_PURPLE})` : MANA_SURFACE,
                          color: power.isQuoteRequest || canAfford ? "#fff" : MANA_TEXT_MUTED,
                          boxShadow: power.isQuoteRequest || canAfford ? `0 0 12px ${ACCENT}44` : "none",
                        }}
                      >
                        {power.isQuoteRequest ? "Request" : "Cast"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <button
            onClick={() => setShowSuggestModal(true)}
            className="mana-spell-btn"
            style={{
              marginTop: 14, padding: "10px 18px", borderRadius: 8,
              border: `1px dashed ${MANA_BORDER}`, background: "transparent",
              color: MANA_TEXT_MUTED, fontWeight: 600, fontSize: 13,
              cursor: "pointer", width: "100%", textAlign: "center",
            }}
          >
            💡 Suggest a Spell
          </button>
        </div>

        {/* Priced Quote Banners */}
        {pricedRequests.map((req) => (
          <div key={req.id} style={{
            background: `${GOLD}08`, border: `1px solid ${GOLD}44`, borderRadius: 12,
            padding: "14px 18px", marginBottom: 16, display: "flex", alignItems: "center",
            gap: 12, flexWrap: "wrap",
          }}>
            <span style={{ fontSize: 22 }}>🏗️</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: MANA_TEXT }}>
                Your custom 3D print has been quoted at <span style={{ color: GOLD }}>{req.quotedCost} ✦</span>
              </div>
              <div style={{ fontSize: 12, color: MANA_TEXT_MUTED, marginTop: 2 }}>
                "{req.description}"
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                disabled={(mana?.balance || 0) < req.quotedCost}
                onClick={async () => {
                  try {
                    // Status-first: the Firestore rule only allows priced→accepted once,
                    // so a stale-state double-click fails here before any mana moves.
                    await updateDoc(doc(db, "courses", courseId, "manaRequests", req.id), { status: "accepted", acceptedAt: new Date().toISOString() });
                    await chargeStudentMana(courseId, user.uid, req.quotedCost, `Custom 3D Print: ${req.description}`);
                    setToast("Accepted! Your print is on the way.");
                    setTimeout(() => setToast(null), 3000);
                    await load();
                  } catch (err) { alert(err.message); await load(); }
                }}
                className="mana-spell-btn"
                style={{
                  padding: "8px 16px", borderRadius: 8, border: "none", fontWeight: 600, fontSize: 13,
                  cursor: (mana?.balance || 0) >= req.quotedCost ? "pointer" : "default",
                  background: (mana?.balance || 0) >= req.quotedCost ? `linear-gradient(135deg, ${ACCENT}, #c9a020)` : MANA_SURFACE,
                  color: (mana?.balance || 0) >= req.quotedCost ? "#fff" : MANA_TEXT_MUTED,
                  opacity: (mana?.balance || 0) >= req.quotedCost ? 1 : 0.5,
                }}
              >
                Accept ({req.quotedCost} ✦)
              </button>
              <button
                onClick={async () => {
                  await updateDoc(doc(db, "courses", courseId, "manaRequests", req.id), { status: "cancelled" });
                  setToast("Quote declined.");
                  setTimeout(() => setToast(null), 2500);
                  await load();
                }}
                style={{
                  padding: "8px 16px", borderRadius: 8, border: `1px solid ${MANA_BORDER}`,
                  background: "transparent", color: MANA_TEXT_MUTED, fontWeight: 600, fontSize: 13, cursor: "pointer",
                }}
              >
                Decline
              </button>
            </div>
          </div>
        ))}

        {/* ═══ ENCHANTMENT LOG ═══ */}
        {history.length > 0 && (
          <div ref={addSectionRef} style={{
            background: `linear-gradient(135deg, ${MANA_SURFACE}, ${MANA_GRAD_MID}, ${MANA_GRAD_MID2})`,
            border: `1px solid ${MANA_BORDER}`,
            borderRadius: 14,
            padding: "18px 22px", position: "relative",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 16, filter: `drop-shadow(0 0 4px ${ACCENT}44)` }}>📜</span>
                <div style={{ fontSize: 16, fontWeight: 700, color: MANA_TEXT }}>Enchantment Log</div>
              </div>
              {history.length > 5 && (
                <button
                  onClick={() => setHistoryExpanded(!historyExpanded)}
                  className="mana-spell-btn"
                  style={{
                    padding: "4px 10px", borderRadius: 6, border: `1px solid ${MANA_BORDER}`,
                    background: "transparent", color: MANA_TEXT_MUTED, fontSize: 12, cursor: "pointer",
                  }}
                >
                  {historyExpanded ? "Show less" : `Show all (${history.length})`}
                </button>
              )}
            </div>
            <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${ACCENT}44, ${GOLD}22, ${ACCENT}44, transparent)`, marginBottom: 10 }} />
            <div style={{
              display: "flex", flexDirection: "column", gap: 0,
              maxHeight: historyExpanded ? "none" : 300, overflowY: historyExpanded ? "visible" : "auto",
              position: "relative",
              maskImage: !historyExpanded && history.length > 5 ? "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)" : "none",
              WebkitMaskImage: !historyExpanded && history.length > 5 ? "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)" : "none",
            }}>
              {displayHistory.map((entry, i) => {
                const isEarn = entry.type === "earn" || entry.type === "refund";
                const isMageAward = entry.reason && (entry.reason.includes("Mage") || entry.reason.includes("Enchantress"));
                return (
                  <div key={i} className="enchantment-log-entry" style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "8px 6px",
                    borderBottom: i < displayHistory.length - 1 ? `1px solid color-mix(in srgb, ${MANA_BORDER} 20%, transparent)` : "none",
                    borderLeft: `2px solid ${isMageAward ? GOLD + "55" : isEarn ? ACCENT + "44" : "#f8717133"}`,
                    borderRadius: "0 4px 4px 0",
                  }}>
                    <span style={{
                      fontSize: 13, fontWeight: 700, minWidth: 55, textAlign: "right",
                      color: isEarn ? ACCENT : "#f87171",
                      fontFamily: "ui-monospace, monospace",
                      textShadow: `0 0 8px ${isEarn ? ACCENT + '44' : '#f8717144'}`,
                    }}>
                      {isEarn ? "+" : "−"}{entry.amount}
                    </span>
                    <span style={{ fontSize: 13, color: MANA_TEXT_MUTED, flex: 1 }}>{entry.reason}</span>
                    <span style={{ fontSize: 10, color: `${GOLD}88`, whiteSpace: "nowrap", fontStyle: "italic" }}>
                      {entry.timestamp ? new Date(entry.timestamp).toLocaleDateString() : ""}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ CONFIRM MODAL ═══ */}
        {confirmPower && (
          <div style={{
            position: "fixed", inset: 0, background: "rgba(5,2,15,0.8)", zIndex: 9999,
            display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
            backdropFilter: "blur(4px)",
          }} onClick={() => setConfirmPower(null)}>
            <div onClick={(e) => e.stopPropagation()} style={{
              background: `linear-gradient(135deg, ${MANA_SURFACE}, ${MANA_GRAD_MID}, ${MANA_GRAD_MID2})`,
              borderRadius: 14, padding: "28px 32px",
              maxWidth: 360, width: "100%", border: `1px solid ${ACCENT}33`,
              boxShadow: `0 20px 60px rgba(0,0,0,0.7), 0 0 60px ${ACCENT}22, 0 0 120px ${ACCENT_PURPLE}11`,
            }}>
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <div style={{ fontSize: 36, marginBottom: 8, filter: `drop-shadow(0 0 12px ${ACCENT}66)` }}>{confirmPower.icon || "⚡"}</div>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, color: MANA_TEXT }}>{confirmPower.name}</div>
                <div style={{ fontSize: 13, color: MANA_TEXT_MUTED, marginBottom: 12 }}>{confirmPower.description}</div>
                <div style={{ fontSize: 14, color: GOLD, fontWeight: 700 }}>
                  Cost: {confirmPower.cost} ✦
                </div>
                <div style={{ fontSize: 12, color: MANA_TEXT_MUTED, marginTop: 4 }}>
                  Balance after: {(mana?.balance || 0) - confirmPower.cost} ✦
                </div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => setConfirmPower(null)}
                  style={{
                    flex: 1, padding: "10px 0", borderRadius: 8, border: `1px solid ${MANA_BORDER}`,
                    background: "transparent", color: MANA_TEXT_MUTED, fontWeight: 600, fontSize: 14, cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={(e) => { spawnRipple(e); handleRedeem(confirmPower); }}
                  className="mana-spell-btn"
                  style={{
                    flex: 1, padding: "10px 0", borderRadius: 8, border: "none",
                    background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_PURPLE})`, color: "#fff",
                    fontWeight: 600, fontSize: 14, cursor: "pointer",
                    boxShadow: `0 0 16px ${ACCENT}33`,
                  }}
                >
                  Cast Spell
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══ GRADE BONUS MODAL ═══ */}
        {bonusModal && (
          <div style={{
            position: "fixed", inset: 0, background: "rgba(5,2,15,0.8)", zIndex: 1000,
            display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
            backdropFilter: "blur(4px)",
          }} onClick={() => setBonusModal(null)}>
            <div style={{
              background: `linear-gradient(135deg, ${MANA_SURFACE}, ${MANA_GRAD_MID2})`,
              border: `1px solid ${MANA_BORDER}`, borderRadius: 14,
              padding: "24px 28px", maxWidth: 480, width: "100%", maxHeight: "80vh", overflow: "auto",
              boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 40px ${ACCENT}22`,
            }} onClick={(e) => e.stopPropagation()}>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, color: MANA_TEXT }}>{bonusModal.icon} {bonusModal.name}</div>
              <div style={{ fontSize: 13, color: MANA_TEXT_MUTED, marginBottom: 16 }}>
                {bonusModal.id === "classwork-pass"
                  ? `Skip one classwork assignment — choose which one (${bonusModal.cost} ✦)`
                  : `+${bonusModal.bonusAmount} percentage points — choose an assignment (${bonusModal.cost} ✦)`}
              </div>
              {bonusLessons.length === 0 ? (
                <div style={{ color: MANA_TEXT_MUTED, fontSize: 13, padding: "10px 0" }}>No eligible assignments found.</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 16 }}>
                  {bonusLessons.map(l => (
                    <button key={l.id} onClick={() => setSelectedLesson(l)} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "10px 14px", borderRadius: 8, cursor: "pointer", textAlign: "left",
                      border: selectedLesson?.id === l.id ? `2px solid ${ACCENT}` : `1px solid ${MANA_BORDER}`,
                      background: selectedLesson?.id === l.id ? `${ACCENT}15` : MANA_SURFACE2,
                      color: MANA_TEXT, fontSize: 13, fontWeight: 500,
                    }}>
                      <span>{l.title}</span>
                      {l.dueDate && <span style={{ fontSize: 11, color: MANA_TEXT_MUTED }}>{l.dueDate}</span>}
                    </button>
                  ))}
                </div>
              )}
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button onClick={() => setBonusModal(null)} style={{
                  padding: "8px 16px", borderRadius: 8, border: `1px solid ${MANA_BORDER}`,
                  background: "transparent", color: MANA_TEXT_MUTED, fontWeight: 600, fontSize: 13, cursor: "pointer",
                }}>Cancel</button>
                <button
                  disabled={!selectedLesson}
                  onClick={async () => {
                    if (!selectedLesson) return;
                    try {
                      await chargeStudentMana(courseId, user.uid, bonusModal.cost, `${bonusModal.name}: ${selectedLesson.title}`);
                      if (bonusModal.id === "classwork-pass") {
                        await applyClassworkPass(courseId, user.uid, selectedLesson.id, selectedLesson.title);
                        await createManaRequest({
                          courseId,
                          studentUid: user.uid,
                          studentName: user.displayName || user.email || "Student",
                          powerId: bonusModal.id,
                          powerName: bonusModal.name,
                          cost: bonusModal.cost,
                          details: `Auto-applied exemption to "${selectedLesson.title}"`,
                          lessonId: selectedLesson.id,
                          autoFulfilled: true,
                        });
                        setToast(`"${selectedLesson.title}" marked exempt ✨`);
                      } else {
                        await applyGradeBonus(courseId, user.uid, selectedLesson.id, bonusModal.bonusAmount);
                        await createManaRequest({
                          courseId,
                          studentUid: user.uid,
                          studentName: user.displayName || user.email || "Student",
                          powerId: bonusModal.id,
                          powerName: bonusModal.name,
                          cost: bonusModal.cost,
                          details: `Auto-applied +${bonusModal.bonusAmount}% to "${selectedLesson.title}"`,
                          autoFulfilled: true,
                        });
                        setToast(`+${bonusModal.bonusAmount}% applied to "${selectedLesson.title}"!`);
                      }
                      setTimeout(() => setToast(null), 4000);
                      setBonusModal(null);
                      setSelectedLesson(null);
                      await load();
                    } catch (err) { alert(err.message); }
                  }}
                  className="mana-spell-btn"
                  style={{
                    padding: "8px 16px", borderRadius: 8, border: "none", fontWeight: 600, fontSize: 13,
                    cursor: selectedLesson ? "pointer" : "default",
                    background: selectedLesson ? `linear-gradient(135deg, ${ACCENT}, #c9a020)` : MANA_SURFACE,
                    color: selectedLesson ? "#fff" : MANA_TEXT_MUTED,
                  }}
                >{bonusModal.id === "classwork-pass" ? "Mark Exempt" : `Apply +${bonusModal.bonusAmount}%`}</button>
              </div>
            </div>
          </div>
        )}

        {/* ═══ INPUT MODAL ═══ */}
        {inputModal && (
          <div style={{
            position: "fixed", inset: 0, background: "rgba(5,2,15,0.8)", zIndex: 1000,
            display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
            backdropFilter: "blur(4px)",
          }} onClick={() => setInputModal(null)}>
            <div style={{
              background: `linear-gradient(135deg, ${MANA_SURFACE}, ${MANA_GRAD_MID2})`,
              border: `1px solid ${MANA_BORDER}`, borderRadius: 14,
              padding: "24px 28px", maxWidth: 420, width: "100%",
              boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 40px ${ACCENT}22`,
            }} onClick={(e) => e.stopPropagation()}>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, color: MANA_TEXT }}>{inputModal.icon} {inputModal.name}</div>
              <div style={{ fontSize: 13, color: MANA_TEXT_MUTED, marginBottom: 16 }}>{inputModal.cost} ✦ will be deducted</div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, color: MANA_TEXT }}>{inputModal.inputPrompt}</div>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="e.g., Momentum Mystery Lab"
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: 8,
                  border: `1px solid ${MANA_BORDER}`, background: MANA_SURFACE2,
                  color: MANA_TEXT, fontSize: 14, marginBottom: 16,
                }}
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && inputText.trim() && document.getElementById("inputModalSubmit")?.click()}
              />
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button onClick={() => { setInputModal(null); setInputText(""); }} style={{
                  padding: "8px 16px", borderRadius: 8, border: `1px solid ${MANA_BORDER}`,
                  background: "transparent", color: MANA_TEXT_MUTED, fontWeight: 600, fontSize: 13, cursor: "pointer",
                }}>Cancel</button>
                <button
                  id="inputModalSubmit"
                  disabled={!inputText.trim()}
                  onClick={async () => {
                    try {
                      await chargeStudentMana(courseId, user.uid, inputModal.cost, `${inputModal.name}: ${inputText.trim()}`);
                      await createManaRequest({
                        courseId,
                        studentUid: user.uid,
                        studentName: user.displayName || "Student",
                        powerId: inputModal.id,
                        powerName: inputModal.name,
                        cost: inputModal.cost,
                        details: inputText.trim(),
                      });
                      setToast(`${inputModal.name} redeemed! Mr. McCarthy has been notified.`);
                      setTimeout(() => setToast(null), 3000);
                      setInputModal(null);
                      setInputText("");
                      await load();
                    } catch (err) { alert(err.message); }
                  }}
                  className="mana-spell-btn"
                  style={{
                    padding: "8px 16px", borderRadius: 8, border: "none", fontWeight: 600, fontSize: 13,
                    cursor: inputText.trim() ? "pointer" : "default",
                    background: inputText.trim() ? `linear-gradient(135deg, ${ACCENT}, #c9a020)` : MANA_SURFACE,
                    color: inputText.trim() ? "#fff" : MANA_TEXT_MUTED,
                  }}
                >Cast</button>
              </div>
            </div>
          </div>
        )}

        {/* ═══ QUOTE REQUEST MODAL ═══ */}
        {quoteModal && (
          <div style={{
            position: "fixed", inset: 0, background: "rgba(5,2,15,0.8)", zIndex: 9999,
            display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
            backdropFilter: "blur(4px)",
          }} onClick={() => { setQuoteModal(null); setQuoteDescription(""); setQuoteModelUrl(""); }}>
            {(() => {
              const isValidUrl = (() => {
                const u = quoteModelUrl.trim();
                if (!u) return false;
                try {
                  const parsed = new URL(u);
                  return parsed.protocol === "http:" || parsed.protocol === "https:";
                } catch { return false; }
              })();
              const canSubmit = quoteDescription.trim() && isValidUrl;
              const submit = async () => {
                if (!canSubmit) return;
                try {
                  await createManaRequest({
                    courseId,
                    studentUid: user.uid,
                    studentName: user.displayName || user.email || "Student",
                    powerId: quoteModal.id,
                    powerName: quoteModal.name || "Custom 3D Print",
                    cost: 0,
                    details: quoteDescription.trim(),
                    type: "quote",
                    modelUrl: quoteModelUrl.trim(),
                  });
                  setQuoteModal(null); setQuoteDescription(""); setQuoteModelUrl("");
                  setToast("Request sent! Mr. McCarthy will set the price.");
                  setTimeout(() => setToast(null), 3000);
                } catch (err) { alert(err.message); }
              };
              return (
            <div onClick={(e) => e.stopPropagation()} style={{
              background: `linear-gradient(135deg, ${MANA_SURFACE}, ${MANA_GRAD_MID2})`,
              borderRadius: 14, padding: "28px 32px",
              maxWidth: 440, width: "100%", border: `1px solid ${MANA_BORDER}`,
              boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 40px ${ACCENT}22`,
            }}>
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>🏗️</div>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, color: MANA_TEXT }}>Request a Custom 3D Print</div>
                <div style={{ fontSize: 13, color: MANA_TEXT_MUTED, marginBottom: 16 }}>
                  Describe what you want printed and paste a link to the model. Mr. McCarthy will set the price.
                </div>
              </div>
              <input
                type="text"
                placeholder="Describe what you want printed"
                value={quoteDescription}
                onChange={(e) => setQuoteDescription(e.target.value)}
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: 8,
                  border: `1px solid ${MANA_BORDER}`, background: MANA_SURFACE2,
                  color: MANA_TEXT, fontSize: 14, marginBottom: 10,
                }}
              />
              <input
                type="url"
                placeholder="Link to the model (Thingiverse, Printables, etc.)"
                value={quoteModelUrl}
                onChange={(e) => setQuoteModelUrl(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: 8,
                  border: `1px solid ${quoteModelUrl.trim() && !isValidUrl ? "#ef4444" : MANA_BORDER}`,
                  background: MANA_SURFACE2,
                  color: MANA_TEXT, fontSize: 14, marginBottom: 6,
                }}
              />
              <div style={{ fontSize: 11, color: quoteModelUrl.trim() && !isValidUrl ? "#ef4444" : MANA_TEXT_MUTED, marginBottom: 14, minHeight: 16 }}>
                {quoteModelUrl.trim() && !isValidUrl
                  ? "Must be a valid http:// or https:// link"
                  : "Required — the exact model you want printed"}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => { setQuoteModal(null); setQuoteDescription(""); setQuoteModelUrl(""); }}
                  style={{
                    flex: 1, padding: "10px 0", borderRadius: 8, border: `1px solid ${MANA_BORDER}`,
                    background: "transparent", color: MANA_TEXT_MUTED, fontWeight: 600, fontSize: 14, cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  disabled={!canSubmit}
                  onClick={submit}
                  className="mana-spell-btn"
                  style={{
                    flex: 1, padding: "10px 0", borderRadius: 8, border: "none",
                    background: canSubmit ? `linear-gradient(135deg, ${ACCENT}, #c9a020)` : MANA_SURFACE,
                    color: canSubmit ? "#fff" : MANA_TEXT_MUTED,
                    fontWeight: 600, fontSize: 14, cursor: canSubmit ? "pointer" : "default",
                  }}
                >
                  Send Request
                </button>
              </div>
            </div>
              );
            })()}
          </div>
        )}

        {/* ═══ SUGGEST MODAL ═══ */}
        {showSuggestModal && (
          <div style={{
            position: "fixed", inset: 0, background: "rgba(5,2,15,0.8)", zIndex: 9999,
            display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
            backdropFilter: "blur(4px)",
          }} onClick={() => { setShowSuggestModal(false); setSuggestionText(""); }}>
            <div onClick={(e) => e.stopPropagation()} style={{
              background: `linear-gradient(135deg, ${MANA_SURFACE}, ${MANA_GRAD_MID2})`,
              borderRadius: 14, padding: "28px 32px",
              maxWidth: 400, width: "100%", border: `1px solid ${MANA_BORDER}`,
              boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 40px ${ACCENT}22`,
            }}>
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>💡</div>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, color: MANA_TEXT }}>Suggest a Spell</div>
                <div style={{ fontSize: 13, color: MANA_TEXT_MUTED, marginBottom: 16 }}>
                  What spell would you like to see in the spellbook?
                </div>
              </div>
              <input
                type="text"
                placeholder="What reward would you like to see?"
                value={suggestionText}
                onChange={(e) => setSuggestionText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && suggestionText.trim()) {
                    (async () => {
                      await submitRewardSuggestion(courseId, user.uid, user.displayName || user.email, suggestionText.trim());
                      setShowSuggestModal(false); setSuggestionText("");
                      setToast("Suggestion sent!");
                      setTimeout(() => setToast(null), 2500);
                    })();
                  }
                }}
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: 8,
                  border: `1px solid ${MANA_BORDER}`, background: MANA_SURFACE2,
                  color: MANA_TEXT, fontSize: 14, marginBottom: 16,
                }}
              />
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => { setShowSuggestModal(false); setSuggestionText(""); }}
                  style={{
                    flex: 1, padding: "10px 0", borderRadius: 8, border: `1px solid ${MANA_BORDER}`,
                    background: "transparent", color: MANA_TEXT_MUTED, fontWeight: 600, fontSize: 14, cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  disabled={!suggestionText.trim()}
                  onClick={async () => {
                    await submitRewardSuggestion(courseId, user.uid, user.displayName || user.email, suggestionText.trim());
                    setShowSuggestModal(false); setSuggestionText("");
                    setToast("Suggestion sent!");
                    setTimeout(() => setToast(null), 2500);
                  }}
                  className="mana-spell-btn"
                  style={{
                    flex: 1, padding: "10px 0", borderRadius: 8, border: "none",
                    background: suggestionText.trim() ? `linear-gradient(135deg, ${ACCENT}, #c9a020)` : MANA_SURFACE,
                    color: suggestionText.trim() ? "#fff" : MANA_TEXT_MUTED,
                    fontWeight: 600, fontSize: 14, cursor: suggestionText.trim() ? "pointer" : "default",
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div style={{
            position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
            background: `linear-gradient(135deg, ${MANA_SURFACE}, ${MANA_GRAD_MID2})`,
            border: `1px solid ${ACCENT}66`, borderRadius: 10,
            padding: "12px 24px", fontSize: 14, fontWeight: 600, color: ACCENT,
            boxShadow: `0 8px 32px ${ACCENT}44, 0 0 30px ${ACCENT}22, inset 0 0 20px ${ACCENT}08`,
            zIndex: 10000,
            animation: `toast-slide-in 0.3s ${EASE_ENTRANCE}`,
            textShadow: `0 0 8px ${ACCENT}44`,
          }}>
            {toast}
          </div>
        )}

        {/* Donation modal */}
        <DonationModal
          isOpen={donationOpen}
          onClose={() => setDonationOpen(false)}
          courseId={courseId}
          senderBalance={mana?.balance || 0}
          classmates={donationClassmates}
          onSuccess={(newBalance, recipientName, amount) => {
            setMana((prev) => prev ? { ...prev, balance: newBalance } : prev);
            setToast(`Sent ${amount} mana to ${recipientName} ✨`);
            setTimeout(() => setToast(null), 3000);
          }}
        />
      </div>
    </main>
  );
}
