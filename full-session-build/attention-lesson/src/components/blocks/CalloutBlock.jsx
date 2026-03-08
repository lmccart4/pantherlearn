import React from "react";
import { renderText } from "./TextBlock";

const STYLES = {
  insight: {
    bg: "rgba(129,140,248,0.07)",
    border: "rgba(129,140,248,0.25)",
    iconBg: "rgba(129,140,248,0.15)",
  },
  warning: {
    bg: "rgba(251,191,36,0.07)",
    border: "rgba(251,191,36,0.25)",
    iconBg: "rgba(251,191,36,0.15)",
  },
  success: {
    bg: "rgba(52,211,153,0.07)",
    border: "rgba(52,211,153,0.25)",
    iconBg: "rgba(52,211,153,0.15)",
  },
};

export default function CalloutBlock({ block }) {
  const style = STYLES[block.style] || STYLES.insight;

  return (
    <div style={{
      background: style.bg,
      border: `1px solid ${style.border}`,
      borderRadius: "12px",
      padding: "18px 20px",
      display: "flex",
      gap: "14px",
      alignItems: "flex-start",
    }}>
      {block.icon && (
        <div style={{
          fontSize: "22px",
          background: style.iconBg,
          width: "44px", height: "44px",
          borderRadius: "10px",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          {block.icon}
        </div>
      )}
      <div style={{ fontSize: "14px", color: "var(--text)", lineHeight: 1.7, flex: 1 }}>
        {renderText(block.content)}
      </div>
    </div>
  );
}
