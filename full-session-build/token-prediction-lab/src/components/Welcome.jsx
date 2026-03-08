// src/components/Welcome.jsx
import React from "react";

export default function Welcome({ onStart }) {
  return (
    <div
      className="fade-in"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "24px",
      }}
    >
      <div style={{ maxWidth: "560px", textAlign: "center" }}>
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>🔮</div>
        <h1
          style={{
            fontSize: "36px",
            fontWeight: 700,
            marginBottom: "8px",
            fontFamily: "var(--font-mono)",
            letterSpacing: "-1px",
          }}
        >
          Token Prediction Lab
        </h1>
        <p
          style={{
            color: "var(--text-dim)",
            fontSize: "16px",
            lineHeight: 1.7,
            marginBottom: "32px",
          }}
        >
          How does a language model decide what word comes next?
          <br />
          <br />
          In this activity, you'll see partial sentences and try to predict the
          next word — just like an AI does. After each guess, you'll see the
          actual probabilities a model would assign and learn{" "}
          <strong style={{ color: "var(--accent)" }}>why</strong> certain words
          are more likely than others.
        </p>

        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            marginBottom: "32px",
            flexWrap: "wrap",
          }}
        >
          {[
            { icon: "📊", label: "Probability", desc: "See real token probabilities" },
            { icon: "🧠", label: "Attention", desc: "How context changes meaning" },
            { icon: "🌡️", label: "Temperature", desc: "Control AI creativity" },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                padding: "14px 18px",
                minWidth: "150px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "24px", marginBottom: "6px" }}>{item.icon}</div>
              <div style={{ fontWeight: 600, fontSize: "13px", marginBottom: "2px" }}>
                {item.label}
              </div>
              <div style={{ color: "var(--muted)", fontSize: "11px" }}>{item.desc}</div>
            </div>
          ))}
        </div>

        <button
          onClick={onStart}
          style={{
            background: "linear-gradient(135deg, var(--accent-dim), var(--accent))",
            color: "var(--bg)",
            border: "none",
            padding: "14px 40px",
            borderRadius: "10px",
            fontSize: "16px",
            fontWeight: 700,
            letterSpacing: "0.5px",
            transition: "transform 0.2s, box-shadow 0.2s",
            boxShadow: "0 4px 20px rgba(129,140,248,0.25)",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 6px 28px rgba(129,140,248,0.35)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 4px 20px rgba(129,140,248,0.25)";
          }}
        >
          ▶ Start the Lab
        </button>

        <p style={{ color: "var(--muted)", fontSize: "12px", marginTop: "20px" }}>
          14 rounds • ~20 minutes • 100 points possible
        </p>
      </div>
    </div>
  );
}
