// src/components/Welcome.jsx
import React from "react";

export default function Welcome({ onStart }) {
  return (
    <div className="fade-in" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "24px" }}>
      <div style={{ maxWidth: "580px", textAlign: "center" }}>
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>🧪</div>
        <h1 style={{ fontSize: "36px", fontWeight: 700, marginBottom: "8px", fontFamily: "var(--font-mono)", letterSpacing: "-1px" }}>
          Prompt Engineering Workshop
        </h1>
        <p style={{ color: "var(--text-dim)", fontSize: "16px", lineHeight: 1.7, marginBottom: "24px" }}>
          The difference between a bad AI response and a great one? <strong style={{ color: "var(--success)" }}>The prompt.</strong>
          <br /><br />
          In this workshop, you'll tackle 9 challenges that teach you how to control AI output through better prompting.
          Each challenge shows you a <span style={{ color: "var(--danger)" }}>bad prompt</span> and why it fails,
          then challenges you to write a <span style={{ color: "var(--success)" }}>better one</span>.
        </p>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginBottom: "32px", flexWrap: "wrap" }}>
          {[
            { icon: "📝", label: "Foundations", desc: "Clarity & formatting" },
            { icon: "🎭", label: "Techniques", desc: "Roles & constraints" },
            { icon: "🧪", label: "Expert", desc: "Chain-of-thought & few-shot" },
          ].map((item) => (
            <div key={item.label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "10px", padding: "14px 18px", minWidth: "150px" }}>
              <div style={{ fontSize: "24px", marginBottom: "6px" }}>{item.icon}</div>
              <div style={{ fontWeight: 600, fontSize: "13px", marginBottom: "2px" }}>{item.label}</div>
              <div style={{ color: "var(--muted)", fontSize: "11px" }}>{item.desc}</div>
            </div>
          ))}
        </div>

        <button onClick={onStart} style={{
          background: "linear-gradient(135deg, #059669, #34d399)", color: "#fff", border: "none",
          padding: "14px 40px", borderRadius: "10px", fontSize: "16px", fontWeight: 700,
          boxShadow: "0 4px 20px rgba(52,211,153,0.3)", transition: "transform 0.2s",
        }}
          onMouseEnter={(e) => (e.target.style.transform = "translateY(-2px)")}
          onMouseLeave={(e) => (e.target.style.transform = "translateY(0)")}
        >
          🚀 Start Workshop
        </button>
        <p style={{ color: "var(--muted)", fontSize: "12px", marginTop: "20px" }}>9 challenges • ~25 minutes • 100 points possible</p>
      </div>
    </div>
  );
}
