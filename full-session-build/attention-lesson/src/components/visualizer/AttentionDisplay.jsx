// src/components/AttentionDisplay.jsx
// The core visual: shows a sentence with the target word highlighted,
// and animated arrows of varying thickness from context words to the target.

import React, { useRef, useEffect, useState } from "react";

export default function AttentionDisplay({ scenario, showWeights, highlightedWords = [] }) {
  const containerRef = useRef(null);
  const wordRefs = useRef([]);
  const [arrows, setArrows] = useState([]);

  const { words, targetIdx, attentionWeights } = scenario;

  // Calculate arrow positions after render
  useEffect(() => {
    if (!showWeights || !containerRef.current) return;

    const container = containerRef.current.getBoundingClientRect();
    const targetEl = wordRefs.current[targetIdx];
    if (!targetEl) return;

    const targetRect = targetEl.getBoundingClientRect();
    const targetCenter = {
      x: targetRect.left + targetRect.width / 2 - container.left,
      y: targetRect.top - container.top - 4,
    };

    const newArrows = [];
    for (let i = 0; i < words.length; i++) {
      if (i === targetIdx || attentionWeights[i] < 0.05) continue;

      const el = wordRefs.current[i];
      if (!el) continue;

      const rect = el.getBoundingClientRect();
      const from = {
        x: rect.left + rect.width / 2 - container.left,
        y: rect.top - container.top - 4,
      };

      newArrows.push({
        from,
        to: targetCenter,
        weight: attentionWeights[i],
        wordIdx: i,
      });
    }

    setArrows(newArrows);
  }, [showWeights, words, targetIdx, attentionWeights]);

  return (
    <div ref={containerRef} style={{ position: "relative", padding: "60px 20px 20px" }}>
      {/* SVG arrows layer */}
      {showWeights && arrows.length > 0 && (
        <svg
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            overflow: "visible",
          }}
        >
          {arrows.map((arrow, i) => {
            const opacity = Math.max(0.2, arrow.weight);
            const strokeWidth = Math.max(1, arrow.weight * 8);
            const color = `rgba(129, 140, 248, ${opacity})`;

            // Curved path
            const midY = Math.min(arrow.from.y, arrow.to.y) - 20 - arrow.weight * 30;
            const midX = (arrow.from.x + arrow.to.x) / 2;

            return (
              <g key={i}>
                <path
                  d={`M ${arrow.from.x} ${arrow.from.y} Q ${midX} ${midY} ${arrow.to.x} ${arrow.to.y}`}
                  fill="none"
                  stroke={color}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  style={{
                    animation: `fadeIn 0.6s ease ${i * 0.1}s both`,
                  }}
                />
                {/* Weight label on arrow */}
                <text
                  x={midX}
                  y={midY - 4}
                  textAnchor="middle"
                  fill="var(--accent)"
                  fontSize="11"
                  fontFamily="var(--font-mono)"
                  fontWeight="600"
                  style={{ animation: `fadeIn 0.6s ease ${i * 0.1 + 0.3}s both` }}
                >
                  {Math.round(arrow.weight * 100)}%
                </text>
              </g>
            );
          })}
        </svg>
      )}

      {/* Words */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        {words.map((word, i) => {
          const isTarget = i === targetIdx;
          const weight = attentionWeights[i];
          const isHighAttender = showWeights && weight >= 0.15;
          const isHighlighted = highlightedWords.includes(i);

          let bg = "var(--surface)";
          let borderColor = "var(--border)";
          let textColor = "var(--text)";

          if (isTarget) {
            bg = "rgba(129,140,248,0.15)";
            borderColor = "var(--accent)";
            textColor = "var(--accent)";
          } else if (isHighlighted) {
            bg = "rgba(52,211,153,0.12)";
            borderColor = "rgba(52,211,153,0.5)";
            textColor = "var(--success)";
          } else if (isHighAttender) {
            bg = `rgba(129,140,248,${weight * 0.15})`;
            borderColor = `rgba(129,140,248,${weight * 0.6})`;
          }

          return (
            <span
              key={`${word}-${i}`}
              ref={(el) => (wordRefs.current[i] = el)}
              style={{
                display: "inline-block",
                padding: "6px 14px",
                borderRadius: "8px",
                background: bg,
                border: `1.5px solid ${borderColor}`,
                fontFamily: "var(--font-mono)",
                fontSize: "16px",
                fontWeight: isTarget ? 700 : isHighAttender ? 600 : 400,
                color: textColor,
                transition: "all 0.3s ease",
                position: "relative",
              }}
            >
              {word}
              {isTarget && (
                <span style={{
                  position: "absolute", top: "-8px", right: "-8px",
                  fontSize: "12px", background: "var(--accent)", color: "var(--bg)",
                  borderRadius: "50%", width: "20px", height: "20px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700,
                }}>
                  ?
                </span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}
