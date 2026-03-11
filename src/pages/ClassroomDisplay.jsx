// src/pages/ClassroomDisplay.jsx
// Fullscreen classroom display — auto-shows current period's lesson based on bell schedule.
// No auth required. Access at /display

import { useState, useEffect, useMemo, useRef } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

// ── Bell schedule & course map ───────────────────────────────────────────────

const PERIODS = [
  { period: 1, label: "Period 1", course: "Physics",           courseId: "physics",             start: "08:00", end: "08:47", accent: "#f97316" },
  { period: 3, label: "Period 3", course: "Digital Literacy",   courseId: "digital-literacy",     start: "09:43", end: "10:25", accent: "#06b6d4" },
  { period: 4, label: "Period 4", course: "AI Literacy",        courseId: "Y9Gdhw5MTY8wMFt6Tlvj", start: "10:29", end: "11:11", accent: "#e8a838" },
  { period: 5, label: "Period 5", course: "AI Literacy",        courseId: "DacjJ93vUDcwqc260OP3", start: "11:15", end: "11:57", accent: "#e8a838" },
  { period: 7, label: "Period 7", course: "AI Literacy",        courseId: "M2MVSXrKuVCD9JQfZZyp", start: "12:47", end: "13:29", accent: "#e8a838" },
  { period: 9, label: "Period 9", course: "AI Literacy",        courseId: "fUw67wFhAtobWFhjwvZ5", start: "02:19", end: "03:01", accent: "#e8a838" },
];

function timeToMinutes(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function getCurrentPeriod() {
  const now = new Date();
  const mins = now.getHours() * 60 + now.getMinutes();
  for (const p of PERIODS) {
    if (mins >= timeToMinutes(p.start) && mins <= timeToMinutes(p.end)) return { ...p, status: "active" };
  }
  for (const p of PERIODS) {
    if (mins < timeToMinutes(p.start)) return { ...p, status: "upcoming" };
  }
  return { ...PERIODS[PERIODS.length - 1], status: "after" };
}

function getTodayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// ── Question of the Day generator ────────────────────────────────────────────
// Priority: 1) Author-written QOTD in callouts, 2) Lesson questions,
// 3) Definitions/vocab, 4) Objectives, 5) Title fallback

function seededPick(arr, seed) {
  return arr[seed % arr.length];
}

function generateQuestion(lesson) {
  if (!lesson) return null;
  const blocks = lesson.blocks || [];
  const seed = new Date().getDate() * 7 + new Date().getMonth() * 31;

  // 1. Check for an author-written "Question of the Day" in callout blocks
  const callouts = blocks.filter((b) => b.type === "callout" && b.content);
  for (const c of callouts) {
    const match = c.content.match(/\*\*Question of the Day[:\s]*\*\*\s*\n*(.+)/i);
    if (match) {
      return match[1].replace(/\*\*/g, "").replace(/\n.*/s, "").trim();
    }
  }

  // 2. Pull from actual lesson questions (short-answer / open-ended prompts)
  const questions = blocks
    .filter((b) => b.type === "question" && b.prompt && b.prompt.length > 20 && b.prompt.length < 200)
    .map((b) => b.prompt.replace(/\*\*/g, "").trim());
  if (questions.length > 0) {
    return seededPick(questions, seed);
  }

  // 3. Use definitions
  const definitions = blocks.filter((b) => b.type === "definition" && b.term);
  if (definitions.length > 0) {
    const def = seededPick(definitions, seed);
    return `In your own words, what is ${def.term}?`;
  }

  // 4. Use vocab list items
  const vocabBlock = blocks.find((b) => b.type === "vocab_list" && b.items?.length > 0);
  if (vocabBlock) {
    const term = seededPick(vocabBlock.items.filter((v) => v.term), seed);
    if (term) return `What does "${term.term}" mean in the context of today's lesson?`;
  }

  // 5. Objectives
  const objectives = blocks.find((b) => b.type === "objectives");
  const items = objectives?.items?.filter(Boolean) || [];
  if (items.length > 0) {
    const obj = seededPick(items, seed);
    const clean = obj.replace(/\.$/, "").trim();
    const stripped = clean.replace(/^(Identify|Explain|Analyze|Compare|Determine|Describe|Define|Understand|Learn|Evaluate|Select|Apply|Use|Create|Predict|Write|Record|Complete|Submit|Navigate|Share|Gather|Start|Draw)\s+/i, "");
    const lc = stripped.charAt(0).toLowerCase() + stripped.slice(1);
    return `Based on today's lesson, how would you explain ${lc}?`;
  }

  // 6. Title fallback
  if (lesson.title) {
    return `After today's lesson, what is one key takeaway about ${lesson.title.toLowerCase()}?`;
  }

  return null;
}

// ── Stylesheet ───────────────────────────────────────────────────────────────

const STYLE_ID = "classroom-display-styles";

function injectStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400;1,6..72,500&family=JetBrains+Mono:wght@300;400;600&display=swap');

    @keyframes cd-pulse {
      0%, 100% { opacity: 1; box-shadow: 0 0 8px var(--cd-accent); }
      50% { opacity: 0.5; box-shadow: 0 0 2px var(--cd-accent); }
    }
    @keyframes cd-fadeUp {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .cd-root {
      min-height: 100vh;
      background: #0b1526;
      color: #f4efe6;
      display: flex;
      flex-direction: column;
      font-family: 'Newsreader', Georgia, serif;
      overflow: hidden;
      cursor: none;
      position: relative;
    }

    /* Dot grid background */
    .cd-dot-grid {
      position: fixed;
      inset: 0;
      background-image: radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px);
      background-size: 24px 24px;
      pointer-events: none;
      z-index: 0;
    }

    /* Film grain */
    .cd-root::before {
      content: '';
      position: fixed;
      inset: 0;
      z-index: 10;
      pointer-events: none;
      opacity: 0.03;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
      background-size: 200px;
    }

    /* Ambient glow */
    .cd-root::after {
      content: '';
      position: fixed;
      inset: 0;
      background: radial-gradient(ellipse 70% 50% at 50% 10%, var(--cd-accent-glow, rgba(232,168,56,0.06)) 0%, transparent 70%);
      pointer-events: none;
      z-index: 0;
      transition: background 2s ease;
    }

    .cd-topbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 48px;
      position: relative;
      z-index: 2;
    }

    .cd-topbar::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 48px;
      right: 48px;
      height: 1px;
      background: rgba(255,255,255,0.08);
    }

    .cd-brand {
      display: flex;
      align-items: baseline;
      gap: 20px;
    }

    .cd-logo {
      font-family: 'Syne', sans-serif;
      font-size: 15px;
      font-weight: 800;
      letter-spacing: 4px;
      color: var(--cd-accent, #e8a838);
      transition: color 2s ease;
    }

    .cd-teacher {
      font-family: 'Syne', sans-serif;
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 2px;
      color: #a8a29e;
      text-transform: uppercase;
    }

    .cd-clock {
      font-family: 'JetBrains Mono', monospace;
      font-size: 40px;
      font-weight: 300;
      font-variant-numeric: tabular-nums;
      color: #f4efe6;
      letter-spacing: 2px;
    }

    .cd-period-bar {
      padding: 16px 48px 14px;
      position: relative;
      z-index: 2;
    }

    .cd-period-info {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 14px;
    }

    .cd-status-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      flex-shrink: 0;
      transition: background 0.8s ease;
    }

    .cd-status-dot[data-active="true"] {
      animation: cd-pulse 2s ease-in-out infinite;
    }

    .cd-period-label {
      font-family: 'Syne', sans-serif;
      font-size: 22px;
      font-weight: 700;
      color: #f4efe6;
      letter-spacing: 0.5px;
    }

    .cd-course-name {
      font-family: 'Syne', sans-serif;
      font-size: 22px;
      font-weight: 600;
      color: var(--cd-accent, #e8a838);
      transition: color 2s ease;
    }

    .cd-time-left {
      font-family: 'JetBrains Mono', monospace;
      font-size: 16px;
      color: #a8a29e;
      margin-left: auto;
      font-variant-numeric: tabular-nums;
    }

    .cd-progress-track {
      height: 3px;
      background: rgba(255,255,255,0.06);
      border-radius: 2px;
      overflow: hidden;
    }

    .cd-progress-fill {
      height: 100%;
      border-radius: 2px;
      background: var(--cd-accent, #e8a838);
      transition: width 1s linear;
    }

    .cd-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px 72px;
      gap: 24px;
      position: relative;
      z-index: 2;
    }

    .cd-content-enter {
      animation: cd-fadeUp 0.8s ease-out both;
    }

    .cd-lesson-title {
      font-family: 'Syne', sans-serif;
      font-size: clamp(40px, 6vw, 72px);
      font-weight: 800;
      text-align: center;
      line-height: 1.1;
      color: #f4efe6;
      max-width: 1000px;
      letter-spacing: -1px;
    }

    .cd-divider {
      width: 60px;
      height: 2px;
      background: var(--cd-accent, #e8a838);
      opacity: 0.5;
      transition: background 2s ease;
    }

    .cd-objectives {
      display: flex;
      flex-direction: column;
      gap: 14px;
      max-width: 900px;
      width: 100%;
    }

    .cd-objective {
      display: flex;
      align-items: flex-start;
      gap: 18px;
      animation: cd-fadeUp 0.6s ease-out both;
    }

    .cd-objective:nth-child(1) { animation-delay: 0.15s; }
    .cd-objective:nth-child(2) { animation-delay: 0.25s; }
    .cd-objective:nth-child(3) { animation-delay: 0.35s; }
    .cd-objective:nth-child(4) { animation-delay: 0.45s; }
    .cd-objective:nth-child(5) { animation-delay: 0.55s; }
    .cd-objective:nth-child(6) { animation-delay: 0.65s; }

    .cd-obj-marker {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--cd-accent, #e8a838);
      flex-shrink: 0;
      margin-top: 16px;
      transition: background 2s ease;
    }

    .cd-obj-text {
      font-family: 'Newsreader', Georgia, serif;
      font-size: clamp(20px, 3vw, 30px);
      line-height: 1.5;
      color: #f4efe6;
      font-weight: 400;
    }

    .cd-question-block {
      max-width: 900px;
      width: 100%;
      padding: 24px 0 0;
      border-top: 1px solid rgba(255,255,255,0.08);
      animation: cd-fadeUp 0.8s ease-out 0.5s both;
    }

    .cd-question-label {
      font-family: 'Syne', sans-serif;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 4px;
      text-transform: uppercase;
      color: var(--cd-accent, #e8a838);
      margin-bottom: 10px;
      transition: color 2s ease;
    }

    .cd-question-text {
      font-family: 'Newsreader', Georgia, serif;
      font-size: clamp(20px, 2.8vw, 32px);
      font-style: italic;
      font-weight: 400;
      line-height: 1.45;
      color: #d6d3cd;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .cd-off-title {
      font-family: 'Syne', sans-serif;
      font-size: clamp(32px, 5vw, 52px);
      font-weight: 800;
      color: #f4efe6;
    }
    .cd-off-sub {
      font-size: 20px;
      color: #a8a29e;
      margin-top: 12px;
    }
  `;
  document.head.appendChild(style);
}

// ── Main component ───────────────────────────────────────────────────────────

export default function ClassroomDisplay() {
  const [period, setPeriod] = useState(getCurrentPeriod);
  const [lessons, setLessons] = useState({});
  const [clock, setClock] = useState(new Date());
  const [contentKey, setContentKey] = useState(0);
  const prevPeriodRef = useRef(period.period);

  useEffect(() => { injectStyles(); }, []);

  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      const next = getCurrentPeriod();
      setPeriod((prev) => {
        if (prev.period !== next.period || prev.status !== next.status) {
          setContentKey((k) => k + 1);
        }
        return next;
      });
    }, 15000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (prevPeriodRef.current !== period.period) {
      setContentKey((k) => k + 1);
      prevPeriodRef.current = period.period;
    }
  }, [period.period]);

  useEffect(() => {
    const uniqueCourses = [...new Set(PERIODS.map((p) => p.courseId))];
    Promise.all(
      uniqueCourses.map(async (cid) => {
        const q = query(collection(db, "courses", cid, "lessons"), orderBy("order", "asc"));
        const snap = await getDocs(q);
        return [cid, snap.docs.map((d) => ({ id: d.id, ...d.data() }))];
      })
    ).then((results) => {
      const map = {};
      results.forEach(([cid, data]) => { map[cid] = data; });
      setLessons(map);
    });
  }, []);

  const todayStr = getTodayStr();
  const currentLesson = useMemo(() => {
    const courseLessons = lessons[period.courseId] || [];
    const exact = courseLessons.find((l) => l.dueDate === todayStr && l.visible !== false);
    if (exact) return exact;
    const past = courseLessons
      .filter((l) => l.visible !== false && l.dueDate && l.dueDate <= todayStr)
      .sort((a, b) => (a.dueDate > b.dueDate ? -1 : 1));
    return past[0] || null;
  }, [lessons, period.courseId, todayStr]);

  const objectives = currentLesson?.blocks?.find((b) => b.type === "objectives");
  const question = useMemo(() => generateQuestion(currentLesson), [currentLesson]);
  const isWeekend = [0, 6].includes(new Date().getDay());
  const accent = period.accent || "#e8a838";

  const progressPct = useMemo(() => {
    if (period.status !== "active") return 0;
    const now = new Date();
    const mins = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
    const start = timeToMinutes(period.start);
    const end = timeToMinutes(period.end);
    return Math.min(100, Math.max(0, ((mins - start) / (end - start)) * 100));
  }, [period, clock]);

  const minsLeft = useMemo(() => {
    if (period.status !== "active") return null;
    const now = new Date();
    const mins = now.getHours() * 60 + now.getMinutes();
    return timeToMinutes(period.end) - mins;
  }, [period, clock]);

  const formatTime = (date) => date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  return (
    <div className="cd-root" style={{ "--cd-accent": accent, "--cd-accent-glow": accent + "10" }}>
      <div className="cd-dot-grid" />

      {/* ── Top bar ── */}
      <div className="cd-topbar">
        <div className="cd-brand">
          <span className="cd-logo">PANTHERLEARN</span>
          <span className="cd-teacher">Mr. McCarthy</span>
        </div>
        <div className="cd-clock">{formatTime(clock)}</div>
      </div>

      {/* ── Period bar ── */}
      <div className="cd-period-bar">
        <div className="cd-period-info">
          <span
            className="cd-status-dot"
            data-active={period.status === "active"}
            style={{
              background: period.status === "active" ? accent : period.status === "upcoming" ? "#eab308" : "#6b6560",
            }}
          />
          <span className="cd-period-label">{period.label}</span>
          <span className="cd-course-name">{period.course}</span>
          {period.status === "active" && minsLeft != null && (
            <span className="cd-time-left">{minsLeft} min remaining</span>
          )}
          {period.status === "upcoming" && (
            <span className="cd-time-left">begins {period.start.replace(/^0/, "")}</span>
          )}
          {period.status === "after" && (
            <span className="cd-time-left">school day complete</span>
          )}
        </div>
        {period.status === "active" && (
          <div className="cd-progress-track">
            <div className="cd-progress-fill" style={{ width: `${progressPct}%`, background: accent }} />
          </div>
        )}
      </div>

      {/* ── Main content ── */}
      <div className="cd-main">
        {isWeekend ? (
          <div style={{ textAlign: "center" }}>
            <div className="cd-off-title">Weekend</div>
            <div className="cd-off-sub">See you Monday.</div>
          </div>
        ) : !currentLesson ? (
          <div style={{ textAlign: "center" }}>
            <div className="cd-off-title">No lesson scheduled</div>
            <div className="cd-off-sub">Check pantherlearn.com</div>
          </div>
        ) : (
          <div key={contentKey} className="cd-content-enter" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px", width: "100%" }}>
            <div className="cd-lesson-title">{currentLesson.title}</div>

            {objectives && objectives.items?.length > 0 && (
              <>
                <div className="cd-divider" style={{ background: accent }} />
                <div className="cd-objectives">
                  {objectives.items.filter(Boolean).map((item, i) => (
                    <div key={i} className="cd-objective">
                      <div className="cd-obj-marker" style={{ background: accent }} />
                      <div className="cd-obj-text">{item}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {question && (
              <div className="cd-question-block">
                <div className="cd-question-label" style={{ color: accent }}>Question of the Day</div>
                <div className="cd-question-text">{question}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
