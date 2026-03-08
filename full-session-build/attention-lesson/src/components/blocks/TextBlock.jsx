// Renders markdown-ish text: **bold**, *italic*, bullet lists, numbered lists, newlines
import React from "react";

export function renderText(content) {
  const lines = content.split("\n");

  return lines.map((line, lineIdx) => {
    if (!line.trim()) return <div key={lineIdx} style={{ height: "8px" }} />;

    // Detect bullet list items
    const bulletMatch = line.match(/^[-•]\s+(.+)/);
    if (bulletMatch) {
      return (
        <div key={lineIdx} style={{ display: "flex", gap: "10px", marginBottom: "6px" }}>
          <span style={{ color: "var(--accent)", flexShrink: 0, marginTop: "2px" }}>▸</span>
          <span style={{ color: "var(--text-dim)", lineHeight: 1.6 }}>{parseInline(bulletMatch[1])}</span>
        </div>
      );
    }

    // Detect numbered list
    const numberedMatch = line.match(/^(\d+)\.\s+(.+)/);
    if (numberedMatch) {
      return (
        <div key={lineIdx} style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
          <span style={{
            color: "var(--bg)", background: "var(--accent)", flexShrink: 0,
            width: "22px", height: "22px", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "12px", fontWeight: 700, marginTop: "1px",
          }}>
            {numberedMatch[1]}
          </span>
          <span style={{ lineHeight: 1.6 }}>{parseInline(numberedMatch[2])}</span>
        </div>
      );
    }

    return <p key={lineIdx} style={{ marginBottom: "4px", lineHeight: 1.7 }}>{parseInline(line)}</p>;
  });
}

function parseInline(text) {
  // Parse **bold** and *italic*
  const parts = [];
  const regex = /\*\*(.+?)\*\*|\*(.+?)\*/g;
  let lastIdx = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIdx) {
      parts.push(text.slice(lastIdx, match.index));
    }
    if (match[1] !== undefined) {
      parts.push(<strong key={match.index} style={{ color: "var(--text)", fontWeight: 700 }}>{match[1]}</strong>);
    } else {
      parts.push(<em key={match.index} style={{ color: "var(--text-dim)" }}>{match[2]}</em>);
    }
    lastIdx = match.index + match[0].length;
  }

  if (lastIdx < text.length) parts.push(text.slice(lastIdx));
  return parts;
}

export default function TextBlock({ block }) {
  return (
    <div style={{ fontSize: "15px", lineHeight: 1.7, color: "var(--text)" }}>
      {renderText(block.content)}
    </div>
  );
}
