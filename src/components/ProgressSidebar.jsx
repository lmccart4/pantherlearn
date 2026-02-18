// src/components/ProgressSidebar.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { getStudentGamification, getLevelInfo, getXPConfig } from "../lib/gamification";
import { useTranslatedTexts, useTranslatedText } from "../hooks/useTranslatedText.jsx";
import MultiplierBanner from "./MultiplierBanner";
import StreakDisplay from "./StreakDisplay";

export default function ProgressSidebar({ lesson, studentData, chatLogs, courseId }) {
  const { user } = useAuth();
  const [gamification, setGamification] = useState(null);
  const [activeMultiplier, setActiveMultiplierState] = useState(null);

  const questions = (lesson.blocks || []).filter((b) => b.type === "question");
  const sections = (lesson.blocks || []).filter((b) => b.type === "section_header");
  const answered = questions.filter((b) => studentData[b.id]?.submitted).length;
  const mcAnswered = questions.filter((b) => b.questionType === "multiple_choice" && studentData[b.id]?.submitted);
  const mcCorrect = mcAnswered.filter((b) => studentData[b.id]?.correct).length;
  const chatInteractions = Object.values(chatLogs || {}).reduce(
    (sum, log) => sum + log.filter((m) => m.role === "user").length, 0
  );

  // Translate section titles
  const sectionTitles = sections.map((s) => s.title);
  const translatedSectionTitles = useTranslatedTexts(sectionTitles);

  // Translate UI labels
  const uiStrings = useTranslatedTexts([
    "Questions",      // 0
    "Accuracy",       // 1
    "AI Chats",       // 2
    "messages sent",  // 3
    "Sections",       // 4
  ]);
  const ui = (i, fallback) => uiStrings?.[i] ?? fallback;

  useEffect(() => {
    if (!user) return;
    getStudentGamification(user.uid).then(setGamification);

    if (courseId) {
      getXPConfig(courseId).then((config) => {
        if (config.activeMultiplier) {
          const expires = config.activeMultiplier.expiresAt?.toDate?.()
            ? config.activeMultiplier.expiresAt.toDate()
            : new Date(config.activeMultiplier.expiresAt);
          if (expires > new Date()) {
            setActiveMultiplierState(config.activeMultiplier);
          }
        }
      }).catch(() => {});
    }
  }, [user, studentData, courseId]);

  const level = gamification ? getLevelInfo(gamification.totalXP) : null;
  const translatedLevelName = useTranslatedText(level?.current?.name);

  return (
    <div className="progress-sidebar">
      <MultiplierBanner activeMultiplier={activeMultiplier} compact />

      {/* Level & XP */}
      {level && (
        <div className="sidebar-section">
          <div style={{
            display: "flex", alignItems: "center", gap: 10, marginBottom: 8,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: "50%",
              background: `${level.current.tierColor || "var(--amber)"}18`,
              border: `2px solid ${level.current.tierColor || "var(--amber)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14,
              color: level.current.tierColor || "var(--amber)",
            }}>
              {level.current.tierIcon || level.current.level}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: level.current.tierColor || "var(--amber)" }} data-translatable>
                {translatedLevelName || level.current.name}
              </div>
              <div style={{ fontSize: 11, color: "var(--text3)" }}>
                {gamification.totalXP} XP
              </div>
            </div>
          </div>
          {level.next ? (
            <>
              <div style={{ width: "100%", height: 6, background: "var(--surface2)", borderRadius: 3 }}>
                <div style={{
                  width: `${level.progress * 100}%`, height: "100%",
                  background: `linear-gradient(90deg, ${level.current.tierColor || "var(--amber)"}, ${level.next.tierColor || "var(--amber)"})`,
                  borderRadius: 3, transition: "width 0.3s",
                }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 10, color: "var(--text3)" }}>
                <span>Lv {level.current.level}</span>
                <span>{level.xpInLevel} / {level.xpForNext} XP</span>
                <span>Lv {level.next.level}</span>
              </div>
            </>
          ) : (
            <div style={{ fontSize: 10, color: "var(--text3)", textAlign: "center", marginTop: 2 }}>
              Max level reached!
            </div>
          )}
        </div>
      )}

      {/* Streak (compact) */}
      {gamification && (
        <div className="sidebar-section">
          <StreakDisplay
            currentStreak={gamification.currentStreak || 0}
            longestStreak={gamification.longestStreak || 0}
            streakFreezes={gamification.streakFreezes || 0}
            compact
          />
        </div>
      )}

      {/* Questions */}
      <div className="sidebar-section">
        <div className="sidebar-label" data-translatable>{ui(0, "Questions")}</div>
        <div className="sidebar-progress-ring">
          <svg viewBox="0 0 36 36" className="progress-ring-svg">
            <path className="ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path className="ring-fill" strokeDasharray={`${questions.length ? (answered / questions.length) * 100 : 0}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          </svg>
          <div className="ring-text">{answered}/{questions.length}</div>
        </div>
      </div>

      {/* Accuracy */}
      {mcAnswered.length > 0 && (
        <div className="sidebar-section">
          <div className="sidebar-label" data-translatable>{ui(1, "Accuracy")}</div>
          <div className="sidebar-stat" style={{
            color: (mcCorrect / mcAnswered.length) >= 0.7 ? "var(--green)" : "var(--amber)",
          }}>
            {Math.round((mcCorrect / mcAnswered.length) * 100)}%
          </div>
        </div>
      )}

      {/* AI Chats */}
      <div className="sidebar-section">
        <div className="sidebar-label" data-translatable>{ui(2, "AI Chats")}</div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, color: "var(--cyan)" }}>{chatInteractions}</div>
          <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }} data-translatable>{ui(3, "messages sent")}</div>
        </div>
      </div>

      {/* Sections nav */}
      <div className="sidebar-section">
        <div className="sidebar-label" data-translatable>{ui(4, "Sections")}</div>
        <div className="sidebar-nav">
          {sections.map((s, i) => (
            <a key={s.id} className="sidebar-nav-item" href={`#${s.id}`}>
              <span>{s.icon}</span>
              <span data-translatable>{(translatedSectionTitles || sectionTitles)[i]}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
