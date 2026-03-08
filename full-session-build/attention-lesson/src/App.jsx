import React, { useState, useRef, useEffect, useCallback } from "react";
import { LESSON } from "./lesson-data";
import SectionHeader from "./components/blocks/SectionHeader";
import TextBlock from "./components/blocks/TextBlock";
import QuestionBlock from "./components/blocks/QuestionBlock";
import DefinitionBlock from "./components/blocks/DefinitionBlock";
import CalloutBlock from "./components/blocks/CalloutBlock";
import VocabList from "./components/blocks/VocabList";
import VisualizerBlock from "./components/blocks/VisualizerBlock";

const SECTION_COLORS = {
  warmup: "#fb923c",
  "main-activity": "#818cf8",
  wrapup: "#34d399",
};

function useActiveSection(sectionIds) {
  const [active, setActive] = useState(sectionIds[0]);

  useEffect(() => {
    const observers = sectionIds.map((id) => {
      const el = document.getElementById(`section-${id}`);
      if (!el) return null;

      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: "-20% 0px -60% 0px" }
      );
      obs.observe(el);
      return obs;
    });

    return () => observers.forEach((o) => o?.disconnect());
  }, [sectionIds]);

  return active;
}

export default function App() {
  const [responses, setResponses] = useState({});
  const [vizScore, setVizScore] = useState(null);
  const [showComplete, setShowComplete] = useState(false);

  const sectionIds = LESSON.sections.map((s) => s.id);
  const activeSection = useActiveSection(sectionIds);

  const handleResponse = useCallback((blockId, value) => {
    setResponses((prev) => ({ ...prev, [blockId]: value }));
  }, []);

  const handleVisualizerComplete = useCallback(({ score, maxScore }) => {
    setVizScore(score);
  }, []);

  const totalQuestions = LESSON.sections.flatMap((s) => s.blocks).filter((b) => b.type === "question").length;
  const answeredQuestions = Object.values(responses).filter(Boolean).length;
  const progress = Math.round((answeredQuestions / totalQuestions) * 100);

  function scrollToSection(id) {
    const el = document.getElementById(`section-${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderBlock(block, sectionColor) {
    switch (block.type) {
      case "text":
        return <TextBlock key={block.id} block={block} />;
      case "question":
        return (
          <QuestionBlock
            key={block.id}
            block={block}
            responses={responses}
            onResponse={handleResponse}
          />
        );
      case "definition":
        return <DefinitionBlock key={block.id} block={block} />;
      case "callout":
        return <CalloutBlock key={block.id} block={block} />;
      case "vocab_list":
        return <VocabList key={block.id} block={block} />;
      case "visualizer":
        return (
          <div key={block.id}>
            {block.caption && (
              <p style={{ fontSize: "12px", color: "var(--muted)", marginBottom: "10px", fontFamily: "var(--font-mono)" }}>
                ▸ {block.caption}
              </p>
            )}
            <VisualizerBlock block={block} onComplete={handleVisualizerComplete} />
            {vizScore !== null && (
              <div style={{
                marginTop: "12px", padding: "10px 16px", borderRadius: "8px",
                background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.25)",
                fontSize: "13px", color: "var(--success)", display: "flex", alignItems: "center", gap: "8px",
              }}>
                ✓ Activity complete — you scored <strong>{vizScore}/100</strong>. Scroll down to complete the Wrap Up.
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
      {/* ── Top Bar ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(12,12,18,0.92)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
        padding: "0 24px",
        display: "flex", alignItems: "center", gap: "20px", height: "56px",
      }}>
        {/* Logo / course badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
          <div style={{
            width: "28px", height: "28px", borderRadius: "7px",
            background: "linear-gradient(135deg, var(--accent-dim), var(--accent))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "14px", fontWeight: 700, color: "var(--bg)",
            fontFamily: "var(--font-mono)",
          }}>
            P
          </div>
          <div>
            <div style={{ fontSize: "11px", color: "var(--muted)", lineHeight: 1 }}>PantherLearn</div>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-dim)", lineHeight: 1.3 }}>
              {LESSON.course}
            </div>
          </div>
        </div>

        <div style={{ width: "1px", height: "28px", background: "var(--border)", flexShrink: 0 }} />

        {/* Lesson title */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ fontWeight: 700, fontSize: "14px", fontFamily: "var(--font-mono)" }}>
            {LESSON.unit} — {LESSON.title}
          </span>
          <span style={{ color: "var(--muted)", fontSize: "12px", marginLeft: "8px" }}>
            {LESSON.subtitle}
          </span>
        </div>

        {/* Progress pill */}
        <div style={{
          display: "flex", alignItems: "center", gap: "10px",
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "20px", padding: "5px 12px", flexShrink: 0,
        }}>
          <div style={{ width: "80px", height: "4px", background: "var(--border)", borderRadius: "2px", overflow: "hidden" }}>
            <div style={{
              height: "100%", background: "var(--accent)", borderRadius: "2px",
              width: `${progress}%`, transition: "width 0.4s ease",
            }} />
          </div>
          <span style={{ fontSize: "12px", color: "var(--text-dim)", fontFamily: "var(--font-mono)", fontWeight: 600 }}>
            {progress}%
          </span>
        </div>
      </header>

      {/* ── Body: Sidebar + Content ── */}
      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        <aside style={{
          width: "220px", flexShrink: 0,
          position: "sticky", top: "56px",
          height: "calc(100vh - 56px)",
          overflowY: "auto",
          borderRight: "1px solid var(--border)",
          padding: "24px 16px",
          display: "flex", flexDirection: "column", gap: "4px",
        }}>
          <p style={{ fontSize: "10px", color: "var(--muted)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--font-mono)", marginBottom: "12px" }}>
            Sections
          </p>

          {LESSON.sections.map((section) => {
            const isActive = activeSection === section.id;
            const color = SECTION_COLORS[section.color] || "var(--accent)";
            return (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "9px 12px", borderRadius: "8px",
                  background: isActive ? `rgba(${hexToRgb(color)}, 0.1)` : "transparent",
                  border: `1px solid ${isActive ? `rgba(${hexToRgb(color)}, 0.35)` : "transparent"}`,
                  cursor: "pointer", textAlign: "left",
                  transition: "all 0.2s",
                }}
              >
                <span style={{ fontSize: "16px" }}>{section.icon}</span>
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: isActive ? color : "var(--text-dim)" }}>
                    {section.label}
                  </div>
                  <div style={{ fontSize: "10px", color: "var(--muted)" }}>{section.time}</div>
                </div>
              </button>
            );
          })}

          <div style={{ flex: 1 }} />

          {/* Total time */}
          <div style={{
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: "8px", padding: "10px 12px", marginTop: "16px",
          }}>
            <div style={{ fontSize: "10px", color: "var(--muted)", marginBottom: "2px" }}>Total time</div>
            <div style={{ fontSize: "14px", fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--text)" }}>
              {LESSON.estimatedTime}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, minWidth: 0, padding: "40px 48px", maxWidth: "860px" }}>
          {/* Lesson hero */}
          <div style={{ marginBottom: "48px" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              fontSize: "11px", color: "var(--muted)", fontFamily: "var(--font-mono)",
              marginBottom: "10px",
            }}>
              <span>{LESSON.unit}</span>
              <span>·</span>
              <span>{LESSON.estimatedTime}</span>
            </div>
            <h1 style={{
              fontSize: "36px", fontWeight: 800, fontFamily: "var(--font-mono)",
              letterSpacing: "-1px", lineHeight: 1.2,
              background: "linear-gradient(135deg, var(--text) 60%, var(--accent))",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              marginBottom: "10px",
            }}>
              {LESSON.title}
            </h1>
            <p style={{ fontSize: "18px", color: "var(--text-dim)", marginBottom: "0" }}>
              {LESSON.subtitle}
            </p>
          </div>

          {/* Sections */}
          {LESSON.sections.map((section) => (
            <section key={section.id} id={`section-${section.id}`} style={{ marginBottom: "64px", scrollMarginTop: "80px" }}>
              <SectionHeader section={section} />

              <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
                {section.blocks.map((block) => renderBlock(block, SECTION_COLORS[section.color]))}
              </div>
            </section>
          ))}

          {/* Completion footer */}
          <div style={{
            marginTop: "16px", padding: "32px",
            background: "rgba(129,140,248,0.06)", border: "1px solid rgba(129,140,248,0.2)",
            borderRadius: "16px", textAlign: "center",
          }}>
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>🎓</div>
            <h2 style={{ fontSize: "22px", fontWeight: 700, fontFamily: "var(--font-mono)", marginBottom: "8px" }}>
              Lesson Complete
            </h2>
            <p style={{ color: "var(--text-dim)", fontSize: "14px", lineHeight: 1.6, maxWidth: "480px", margin: "0 auto 24px" }}>
              You've explored how attention mechanisms help AI models understand ambiguous words by weighing
              context. This is one of the key innovations behind modern large language models.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
              {vizScore !== null && (
                <div style={{
                  background: "var(--surface)", border: "1px solid var(--border)",
                  borderRadius: "10px", padding: "12px 20px",
                }}>
                  <div style={{ fontSize: "11px", color: "var(--muted)", marginBottom: "2px" }}>Visualizer Score</div>
                  <div style={{ fontSize: "22px", fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--accent)" }}>
                    {vizScore}/100
                  </div>
                </div>
              )}
              <div style={{
                background: "var(--surface)", border: "1px solid var(--border)",
                borderRadius: "10px", padding: "12px 20px",
              }}>
                <div style={{ fontSize: "11px", color: "var(--muted)", marginBottom: "2px" }}>Questions Answered</div>
                <div style={{ fontSize: "22px", fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--success)" }}>
                  {answeredQuestions}/{totalQuestions}
                </div>
              </div>
            </div>
          </div>

          <div style={{ height: "60px" }} />
        </main>
      </div>
    </div>
  );
}

// Helper: hex color to "r, g, b" string for rgba()
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : "129, 140, 248";
}
