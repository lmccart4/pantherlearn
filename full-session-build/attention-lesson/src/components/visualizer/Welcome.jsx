// src/components/Welcome.jsx
import React from "react";

export default function Welcome({ onStart }) {
  return (
    <div className="fade-in" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "24px" }}>
      <div style={{ maxWidth: "560px", textAlign: "center" }}>
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>🧠</div>
        <h1 style={{ fontSize: "36px", fontWeight: 700, marginBottom: "8px", fontFamily: "var(--font-mono)", letterSpacing: "-1px" }}>
          Attention Visualizer
        </h1>
        <p style={{ color: "var(--text-dim)", fontSize: "16px", lineHeight: 1.7, marginBottom: "32px" }}>
          The word <strong style={{ color: "var(--accent)" }}>"bat"</strong> can mean a flying animal OR sports equipment.
          How does an AI figure out which one you mean?
          <br /><br />
          The answer is <strong style={{ color: "var(--accent)" }}>attention</strong> — the AI looks at the surrounding words and
          decides which ones matter most. In this activity, you'll see attention in action and learn to predict it yourself.
        </p>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginBottom: "32px", flexWrap: "wrap" }}>
          {[
            { icon: "👀", label: "Observe", desc: "Watch attention arrows" },
            { icon: "🎯", label: "Predict", desc: "Guess which words matter" },
            { icon: "⚡", label: "Challenge", desc: "Tackle tricky sentences" },
          ].map((item) => (
            <div key={item.label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "10px", padding: "14px 18px", minWidth: "150px" }}>
              <div style={{ fontSize: "24px", marginBottom: "6px" }}>{item.icon}</div>
              <div style={{ fontWeight: 600, fontSize: "13px", marginBottom: "2px" }}>{item.label}</div>
              <div style={{ color: "var(--muted)", fontSize: "11px" }}>{item.desc}</div>
            </div>
          ))}
        </div>

        <button
          onClick={onStart}
          style={{
            background: "linear-gradient(135deg, var(--accent-dim), var(--accent))", color: "var(--bg)", border: "none",
            padding: "14px 40px", borderRadius: "10px", fontSize: "16px", fontWeight: 700,
            boxShadow: "0 4px 20px rgba(129,140,248,0.25)", transition: "transform 0.2s",
          }}
          onMouseEnter={(e) => (e.target.style.transform = "translateY(-2px)")}
          onMouseLeave={(e) => (e.target.style.transform = "translateY(0)")}
        >
          ▶ Start Exploring
        </button>
        <p style={{ color: "var(--muted)", fontSize: "12px", marginTop: "20px" }}>
          9 scenarios • ~20 minutes • 100 points possible
        </p>
      </div>
    </div>
  );
}
