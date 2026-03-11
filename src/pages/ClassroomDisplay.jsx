// src/pages/ClassroomDisplay.jsx
// Fullscreen classroom display — auto-shows current period's lesson based on bell schedule.
// No auth required. Access at /display

import { useState, useEffect, useMemo } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

// ── Bell schedule & course map ───────────────────────────────────────────────

const PERIODS = [
  { period: 1, label: "Period 1", course: "Physics",           courseId: "physics",             start: "08:00", end: "08:47" },
  { period: 3, label: "Period 3", course: "Digital Literacy",   courseId: "digital-literacy",     start: "09:43", end: "10:25" },
  { period: 4, label: "Period 4", course: "AI Literacy",        courseId: "Y9Gdhw5MTY8wMFt6Tlvj", start: "10:29", end: "11:11" },
  { period: 5, label: "Period 5", course: "AI Literacy",        courseId: "DacjJ93vUDcwqc260OP3", start: "11:15", end: "11:57" },
  { period: 7, label: "Period 7", course: "AI Literacy",        courseId: "M2MVSXrKuVCD9JQfZZyp", start: "12:01", end: "12:43" },
  { period: 9, label: "Period 9", course: "AI Literacy",        courseId: "fUw67wFhAtobWFhjwvZ5", start: "02:19", end: "03:01" },
];

function timeToMinutes(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function getCurrentPeriod() {
  const now = new Date();
  const mins = now.getHours() * 60 + now.getMinutes();

  // During a period
  for (const p of PERIODS) {
    if (mins >= timeToMinutes(p.start) && mins <= timeToMinutes(p.end)) {
      return { ...p, status: "active" };
    }
  }

  // Between periods — show next upcoming
  for (const p of PERIODS) {
    if (mins < timeToMinutes(p.start)) {
      return { ...p, status: "upcoming" };
    }
  }

  // After school — show last period
  return { ...PERIODS[PERIODS.length - 1], status: "after" };
}

function getTodayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatTime(date) {
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

// ── Main component ───────────────────────────────────────────────────────────

export default function ClassroomDisplay() {
  const [period, setPeriod] = useState(getCurrentPeriod);
  const [lessons, setLessons] = useState({});
  const [clock, setClock] = useState(new Date());

  // Update clock every second
  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Re-check period every 15 seconds
  useEffect(() => {
    const t = setInterval(() => setPeriod(getCurrentPeriod()), 15000);
    return () => clearInterval(t);
  }, []);

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

  // Find today's lesson for the current period
  const todayStr = getTodayStr();
  const currentLesson = useMemo(() => {
    const courseLessons = lessons[period.courseId] || [];
    // First try exact dueDate match
    const exact = courseLessons.find((l) => l.dueDate === todayStr && l.visible !== false);
    if (exact) return exact;
    // Fallback: last visible lesson with dueDate <= today
    const past = courseLessons
      .filter((l) => l.visible !== false && l.dueDate && l.dueDate <= todayStr)
      .sort((a, b) => (a.dueDate > b.dueDate ? -1 : 1));
    return past[0] || null;
  }, [lessons, period.courseId, todayStr]);

  const objectives = currentLesson?.blocks?.find((b) => b.type === "objectives");
  const isWeekend = [0, 6].includes(new Date().getDay());

  // Period progress bar
  const progressPct = useMemo(() => {
    if (period.status !== "active") return 0;
    const now = new Date();
    const mins = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
    const start = timeToMinutes(period.start);
    const end = timeToMinutes(period.end);
    return Math.min(100, Math.max(0, ((mins - start) / (end - start)) * 100));
  }, [period, clock]);

  // Minutes remaining
  const minsLeft = useMemo(() => {
    if (period.status !== "active") return null;
    const now = new Date();
    const mins = now.getHours() * 60 + now.getMinutes();
    return timeToMinutes(period.end) - mins;
  }, [period, clock]);

  return (
    <div style={styles.container}>
      {/* Top bar */}
      <div style={styles.topBar}>
        <div style={styles.branding}>
          <span style={styles.logo}>PANTHERLEARN</span>
          <span style={styles.dot}>·</span>
          <span style={styles.classroom}>MR. McCARTHY</span>
        </div>
        <div style={styles.clock}>{formatTime(clock)}</div>
      </div>

      {/* Period indicator */}
      <div style={styles.periodBar}>
        <div style={styles.periodInfo}>
          <span style={{
            ...styles.statusDot,
            background: period.status === "active" ? "#34d399" : period.status === "upcoming" ? "#fbbf24" : "#6b7280",
          }} />
          <span style={styles.periodLabel}>{period.label}</span>
          <span style={styles.courseName}>{period.course}</span>
          {period.status === "active" && minsLeft != null && (
            <span style={styles.timeLeft}>{minsLeft} min left</span>
          )}
          {period.status === "upcoming" && (
            <span style={styles.timeLeft}>starts at {period.start.replace(/^0/, "")}</span>
          )}
        </div>
        {period.status === "active" && (
          <div style={styles.progressTrack}>
            <div style={{ ...styles.progressFill, width: `${progressPct}%` }} />
          </div>
        )}
      </div>

      {/* Main content */}
      <div style={styles.main}>
        {isWeekend ? (
          <div style={styles.offCard}>
            <div style={styles.offIcon}>📚</div>
            <div style={styles.offTitle}>Weekend</div>
            <div style={styles.offSub}>See you Monday!</div>
          </div>
        ) : !currentLesson ? (
          <div style={styles.offCard}>
            <div style={styles.offIcon}>🎯</div>
            <div style={styles.offTitle}>No lesson scheduled</div>
            <div style={styles.offSub}>Check pantherlearn.com for updates</div>
          </div>
        ) : (
          <>
            {/* Lesson title */}
            <div style={styles.lessonTitle}>{currentLesson.title}</div>
            {currentLesson.unit && (
              <div style={styles.unitLabel}>{currentLesson.unit}</div>
            )}

            {/* Learning objectives */}
            {objectives && objectives.items?.length > 0 && (
              <div style={styles.objectivesCard}>
                <div style={styles.objectivesHeader}>
                  <span style={styles.objectivesIcon}>🎯</span>
                  <span style={styles.objectivesTitle}>Today's Learning Goals</span>
                </div>
                <div style={styles.objectivesList}>
                  {objectives.items.map((item, i) => (
                    <div key={i} style={styles.objectiveItem}>
                      <span style={styles.objectiveNum}>{i + 1}</span>
                      <span style={styles.objectiveText}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* URL hint */}
            <div style={styles.urlHint}>
              pantherlearn.com → {period.course} → {currentLesson.title}
            </div>
          </>
        )}
      </div>

      {/* Bottom schedule strip */}
      <div style={styles.scheduleStrip}>
        {PERIODS.map((p) => {
          const isNow = p.period === period.period && period.status === "active";
          const isPast = timeToMinutes(p.end) < (new Date().getHours() * 60 + new Date().getMinutes());
          return (
            <div
              key={p.period}
              style={{
                ...styles.scheduleItem,
                opacity: isPast && !isNow ? 0.35 : 1,
                background: isNow ? "rgba(129, 140, 248, 0.12)" : "transparent",
                borderColor: isNow ? "rgba(129, 140, 248, 0.3)" : "transparent",
              }}
            >
              <div style={{ fontSize: "11px", fontWeight: 700, color: isNow ? "#818cf8" : "#9ca3af", letterSpacing: "0.5px" }}>
                P{p.period}
              </div>
              <div style={{ fontSize: "12px", color: isNow ? "#e0e7ff" : "#6b7280", fontWeight: 500 }}>
                {p.course.split(" ")[0]}
              </div>
              <div style={{ fontSize: "10px", color: "#4b5563" }}>
                {p.start.replace(/^0/, "")}–{p.end.replace(/^0/, "")}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────

const styles = {
  container: {
    minHeight: "100vh",
    background: "#0a0a0f",
    color: "#f1f5f9",
    display: "flex",
    flexDirection: "column",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    overflow: "hidden",
    cursor: "none",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 32px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  branding: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logo: {
    fontSize: "13px",
    fontWeight: 800,
    letterSpacing: "3px",
    color: "#818cf8",
  },
  dot: { color: "#374151", fontSize: "18px" },
  classroom: {
    fontSize: "13px",
    fontWeight: 600,
    letterSpacing: "2px",
    color: "#6b7280",
  },
  clock: {
    fontSize: "28px",
    fontWeight: 300,
    fontVariantNumeric: "tabular-nums",
    color: "#94a3b8",
    letterSpacing: "1px",
  },
  periodBar: {
    padding: "16px 32px",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
  },
  periodInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "8px",
  },
  statusDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    flexShrink: 0,
  },
  periodLabel: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#f1f5f9",
  },
  courseName: {
    fontSize: "16px",
    fontWeight: 400,
    color: "#818cf8",
  },
  timeLeft: {
    fontSize: "13px",
    color: "#6b7280",
    marginLeft: "auto",
    fontVariantNumeric: "tabular-nums",
  },
  progressTrack: {
    height: "3px",
    background: "rgba(255,255,255,0.06)",
    borderRadius: "2px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #818cf8, #34d399)",
    borderRadius: "2px",
    transition: "width 1s linear",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 48px",
    gap: "24px",
  },
  lessonTitle: {
    fontSize: "clamp(32px, 5vw, 56px)",
    fontWeight: 700,
    textAlign: "center",
    lineHeight: 1.2,
    color: "#f1f5f9",
    maxWidth: "900px",
  },
  unitLabel: {
    fontSize: "14px",
    fontWeight: 600,
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    color: "#6b7280",
    marginTop: "-8px",
  },
  objectivesCard: {
    background: "rgba(129, 140, 248, 0.06)",
    border: "1px solid rgba(129, 140, 248, 0.12)",
    borderRadius: "16px",
    padding: "28px 36px",
    maxWidth: "720px",
    width: "100%",
    marginTop: "8px",
  },
  objectivesHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
  },
  objectivesIcon: { fontSize: "20px" },
  objectivesTitle: {
    fontSize: "15px",
    fontWeight: 700,
    letterSpacing: "1px",
    textTransform: "uppercase",
    color: "#818cf8",
  },
  objectivesList: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  objectiveItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "14px",
  },
  objectiveNum: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background: "rgba(129, 140, 248, 0.15)",
    color: "#818cf8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: 700,
    flexShrink: 0,
  },
  objectiveText: {
    fontSize: "clamp(16px, 2.5vw, 22px)",
    lineHeight: 1.5,
    color: "#e2e8f0",
    paddingTop: "2px",
  },
  urlHint: {
    fontSize: "13px",
    color: "#4b5563",
    fontFamily: "monospace",
    marginTop: "16px",
  },
  offCard: {
    textAlign: "center",
  },
  offIcon: { fontSize: "48px", marginBottom: "16px" },
  offTitle: { fontSize: "32px", fontWeight: 700, color: "#e2e8f0" },
  offSub: { fontSize: "16px", color: "#6b7280", marginTop: "8px" },
  scheduleStrip: {
    display: "flex",
    justifyContent: "center",
    gap: "4px",
    padding: "12px 32px 16px",
    borderTop: "1px solid rgba(255,255,255,0.04)",
  },
  scheduleItem: {
    padding: "8px 16px",
    borderRadius: "8px",
    textAlign: "center",
    border: "1px solid transparent",
    minWidth: "80px",
  },
};
