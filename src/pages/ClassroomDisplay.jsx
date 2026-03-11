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
  { period: 4, label: "Period 4", course: "AI Literacy",        courseId: "Y9Gdhw5MTY8wMFt6Tlvj", start: "10:29", end: "11:11", accent: "#2dd4bf" },
  { period: 5, label: "Period 5", course: "AI Literacy",        courseId: "DacjJ93vUDcwqc260OP3", start: "11:15", end: "11:57", accent: "#2dd4bf" },
  { period: 7, label: "Period 7", course: "AI Literacy",        courseId: "M2MVSXrKuVCD9JQfZZyp", start: "12:47", end: "13:29", accent: "#2dd4bf" },
  { period: 9, label: "Period 9", course: "AI Literacy",        courseId: "fUw67wFhAtobWFhjwvZ5", start: "02:19", end: "03:01", accent: "#2dd4bf" },
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

// Turns a learning objective into an answerable exit-ticket style question
function objectiveToQuestion(objective) {
  const clean = objective.replace(/\.$/, "").trim();

  // Pattern: "Identify X" → "What is X?"
  const identify = clean.match(/^Identify\s+(.+)/i);
  if (identify) return `What is ${identify[1]}?`;

  // Pattern: "Explain X" → "How would you explain X?"
  const explain = clean.match(/^Explain\s+(.+)/i);
  if (explain) return `How would you explain ${explain[1]}?`;

  // Pattern: "Analyze X" → "What do you notice when you analyze X?"
  const analyze = clean.match(/^Analyze\s+(.+)/i);
  if (analyze) return `What did you notice when analyzing ${analyze[1]}?`;

  // Pattern: "Compare X" → "What are the key differences when you compare X?"
  const compare = clean.match(/^Compare\s+(.+)/i);
  if (compare) return `What are the key differences when you compare ${compare[1]}?`;

  // Pattern: "Determine X" → "How do you determine X?"
  const determine = clean.match(/^Determine\s+(.+)/i);
  if (determine) return `How do you determine ${determine[1]}?`;

  // Pattern: "Describe X" → "How would you describe X?"
  const describe = clean.match(/^Describe\s+(.+)/i);
  if (describe) return `How would you describe ${describe[1]}?`;

  // Pattern: "Define X" → "What is the definition of X?"
  const define = clean.match(/^Define\s+(.+)/i);
  if (define) return `What is the definition of ${define[1]}?`;

  // Pattern: "Understand X" / "Learn X" → "What did you learn about X?"
  const understand = clean.match(/^(Understand|Learn)\s+(.+)/i);
  if (understand) return `What did you learn about ${understand[2]}?`;

  // Pattern: "Evaluate X" → "How would you evaluate X?"
  const evaluate = clean.match(/^Evaluate\s+(.+)/i);
  if (evaluate) return `How would you evaluate ${evaluate[1]}?`;

  // Pattern: "Select X" → "How do you select X?"
  const select = clean.match(/^Select\s+(.+)/i);
  if (select) return `How do you select ${select[1]}?`;

  // Default: turn statement into "Can you explain..." question
  const lc = clean.charAt(0).toLowerCase() + clean.slice(1);
  return `Can you explain ${lc}?`;
}

function generateQuestion(lesson) {
  if (!lesson) return null;
  const objectives = lesson.blocks?.find((b) => b.type === "objectives");
  const items = objectives?.items?.filter(Boolean) || [];
  if (items.length === 0) return null;
  // Use day as seed so question is consistent all day but changes daily
  const seed = new Date().getDate() * 7 + new Date().getMonth() * 31;
  const objective = items[seed % items.length];
  return objectiveToQuestion(objective);
}

// ── Stylesheet (injected once) ───────────────────────────────────────────────

const STYLE_ID = "classroom-display-styles";

function injectStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,700;1,9..40,400;1,9..40,700&family=JetBrains+Mono:wght@300;400;700&display=swap');

    @keyframes cd-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
    @keyframes cd-fadeUp {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes cd-progressGlow {
      0%, 100% { filter: brightness(1); }
      50% { filter: brightness(1.4); }
    }
    @keyframes cd-gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    .cd-root {
      min-height: 100vh;
      background: #09090b;
      color: #fafafa;
      display: flex;
      flex-direction: column;
      font-family: 'DM Sans', system-ui, sans-serif;
      overflow: hidden;
      cursor: none;
      position: relative;
    }

    .cd-root::before {
      content: '';
      position: fixed;
      inset: 0;
      background: radial-gradient(ellipse 80% 60% at 50% 0%, var(--cd-accent-glow, rgba(45,212,191,0.04)) 0%, transparent 70%);
      pointer-events: none;
      z-index: 0;
      transition: background 1.5s ease;
    }

    .cd-topbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 40px;
      position: relative;
      z-index: 1;
    }

    .cd-topbar::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 40px;
      right: 40px;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.06) 80%, transparent);
    }

    .cd-brand {
      display: flex;
      align-items: baseline;
      gap: 16px;
    }

    .cd-logo {
      font-family: 'JetBrains Mono', monospace;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 4px;
      color: var(--cd-accent, #2dd4bf);
      transition: color 1.5s ease;
    }

    .cd-teacher {
      font-size: 14px;
      font-weight: 400;
      letter-spacing: 2px;
      color: #52525b;
      text-transform: uppercase;
    }

    .cd-clock {
      font-family: 'JetBrains Mono', monospace;
      font-size: 36px;
      font-weight: 300;
      font-variant-numeric: tabular-nums;
      color: #a1a1aa;
      letter-spacing: 2px;
    }

    .cd-period-bar {
      padding: 20px 40px 16px;
      position: relative;
      z-index: 1;
    }

    .cd-period-info {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 12px;
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
      font-family: 'JetBrains Mono', monospace;
      font-size: 20px;
      font-weight: 700;
      color: #fafafa;
      letter-spacing: 0.5px;
    }

    .cd-course-name {
      font-size: 20px;
      font-weight: 400;
      color: var(--cd-accent, #2dd4bf);
      transition: color 1.5s ease;
    }

    .cd-time-left {
      font-family: 'JetBrains Mono', monospace;
      font-size: 15px;
      color: #52525b;
      margin-left: auto;
      font-variant-numeric: tabular-nums;
    }

    .cd-progress-track {
      height: 3px;
      background: rgba(255,255,255,0.04);
      border-radius: 2px;
      overflow: hidden;
    }

    .cd-progress-fill {
      height: 100%;
      border-radius: 2px;
      background: var(--cd-accent, #2dd4bf);
      transition: width 1s linear;
      animation: cd-progressGlow 3s ease-in-out infinite;
    }

    .cd-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px 60px 20px;
      gap: 28px;
      position: relative;
      z-index: 1;
    }

    .cd-content-enter {
      animation: cd-fadeUp 0.8s ease-out both;
    }

    .cd-unit {
      font-family: 'JetBrains Mono', monospace;
      font-size: 15px;
      font-weight: 700;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: #52525b;
    }

    .cd-lesson-title {
      font-size: clamp(36px, 5.5vw, 64px);
      font-weight: 700;
      text-align: center;
      line-height: 1.15;
      color: #fafafa;
      max-width: 1000px;
      letter-spacing: -0.5px;
    }

    .cd-divider {
      width: 80px;
      height: 2px;
      background: var(--cd-accent, #2dd4bf);
      opacity: 0.4;
      transition: background 1.5s ease;
    }

    .cd-objectives {
      display: flex;
      flex-direction: column;
      gap: 16px;
      max-width: 860px;
      width: 100%;
    }

    .cd-objective {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      animation: cd-fadeUp 0.6s ease-out both;
    }

    .cd-objective:nth-child(1) { animation-delay: 0.1s; }
    .cd-objective:nth-child(2) { animation-delay: 0.2s; }
    .cd-objective:nth-child(3) { animation-delay: 0.3s; }
    .cd-objective:nth-child(4) { animation-delay: 0.4s; }

    .cd-obj-marker {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--cd-accent, #2dd4bf);
      flex-shrink: 0;
      margin-top: 14px;
      opacity: 0.6;
      transition: background 1.5s ease;
    }

    .cd-obj-text {
      font-size: clamp(18px, 2.8vw, 28px);
      line-height: 1.55;
      color: #d4d4d8;
      font-weight: 400;
    }

    .cd-question-block {
      max-width: 860px;
      width: 100%;
      padding: 28px 0;
      border-top: 1px solid rgba(255,255,255,0.04);
      animation: cd-fadeUp 0.8s ease-out 0.4s both;
    }

    .cd-question-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: var(--cd-accent, #2dd4bf);
      opacity: 0.7;
      margin-bottom: 12px;
      transition: color 1.5s ease;
    }

    .cd-question-text {
      font-size: clamp(20px, 3vw, 32px);
      font-style: italic;
      font-weight: 400;
      line-height: 1.5;
      color: #a1a1aa;
    }

    .cd-off-icon {
      font-size: 56px;
      margin-bottom: 20px;
    }
    .cd-off-title {
      font-size: clamp(28px, 4vw, 44px);
      font-weight: 700;
      color: #e4e4e7;
    }
    .cd-off-sub {
      font-size: 18px;
      color: #52525b;
      margin-top: 8px;
    }

    .cd-schedule {
      display: flex;
      justify-content: center;
      gap: 2px;
      padding: 14px 40px 18px;
      position: relative;
      z-index: 1;
    }

    .cd-schedule::before {
      content: '';
      position: absolute;
      top: 0;
      left: 40px;
      right: 40px;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.04) 20%, rgba(255,255,255,0.04) 80%, transparent);
    }

    .cd-sched-item {
      padding: 10px 20px;
      border-radius: 8px;
      text-align: center;
      min-width: 90px;
      transition: all 0.6s ease;
      border: 1px solid transparent;
    }

    .cd-sched-item[data-active="true"] {
      background: rgba(255,255,255,0.03);
      border-color: rgba(255,255,255,0.06);
    }

    .cd-sched-period {
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.5px;
      margin-bottom: 2px;
    }

    .cd-sched-course {
      font-size: 12px;
      font-weight: 500;
      margin-bottom: 1px;
    }


    .cd-url {
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      color: #27272a;
      letter-spacing: 0.5px;
      position: relative;
      z-index: 1;
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

  // Update clock every second
  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Re-check period every 15 seconds
  useEffect(() => {
    const t = setInterval(() => {
      const next = getCurrentPeriod();
      setPeriod((prev) => {
        if (prev.period !== next.period || prev.status !== next.status) {
          setContentKey((k) => k + 1); // trigger re-animation
        }
        return next;
      });
    }, 15000);
    return () => clearInterval(t);
  }, []);

  // Track period changes for animation
  useEffect(() => {
    if (prevPeriodRef.current !== period.period) {
      setContentKey((k) => k + 1);
      prevPeriodRef.current = period.period;
    }
  }, [period.period]);

  // Fetch lessons for all courses on mount
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

  // Find today's lesson
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
  const accent = period.accent || "#2dd4bf";

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
  const nowMins = clock.getHours() * 60 + clock.getMinutes();

  return (
    <div className="cd-root" style={{ "--cd-accent": accent, "--cd-accent-glow": accent + "0a" }}>

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
              background: period.status === "active" ? accent : period.status === "upcoming" ? "#eab308" : "#3f3f46",
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
            <div className="cd-off-icon">&#9737;</div>
            <div className="cd-off-title">Weekend</div>
            <div className="cd-off-sub">See you Monday.</div>
          </div>
        ) : !currentLesson ? (
          <div style={{ textAlign: "center" }}>
            <div className="cd-off-title" style={{ color: "#71717a" }}>No lesson scheduled</div>
            <div className="cd-off-sub">Check pantherlearn.com</div>
          </div>
        ) : (
          <div key={contentKey} className="cd-content-enter" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px", width: "100%" }}>
            {currentLesson.unit && <div className="cd-unit">{currentLesson.unit}</div>}
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

            <div className="cd-url">pantherlearn.com</div>
          </div>
        )}
      </div>

      {/* ── Schedule strip ── */}
      <div className="cd-schedule">
        {PERIODS.map((p) => {
          const isNow = p.period === period.period && period.status === "active";
          const isPast = timeToMinutes(p.end) < nowMins;
          return (
            <div
              key={p.period}
              className="cd-sched-item"
              data-active={isNow}
              style={{ opacity: isPast && !isNow ? 0.25 : 1 }}
            >
              <div className="cd-sched-period" style={{ color: isNow ? accent : "#71717a" }}>
                P{p.period}
              </div>
              <div className="cd-sched-course" style={{ color: isNow ? "#d4d4d8" : "#52525b" }}>
                {p.course.replace(" Literacy", "").replace("AI", "AI Lit")}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
