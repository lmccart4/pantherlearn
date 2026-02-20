// src/components/blocks/ErrorBoundary.jsx
// Block-level error boundary — catches crashes in individual blocks
// without taking down the entire lesson viewer.

import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, retryCount: 0 };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Block ErrorBoundary caught:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState((prev) => ({
      error: null,
      retryCount: prev.retryCount + 1,
    }));
  };

  render() {
    if (this.state.error) {
      const canRetry = this.state.retryCount < 2;

      return (
        <div style={{
          padding: 16,
          background: "rgba(239, 68, 68, 0.06)",
          border: "1px solid rgba(239, 68, 68, 0.2)",
          borderRadius: 10,
          margin: "8px 0",
          color: "var(--text2, #b0b5c9)",
          fontSize: 13,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 16 }}>⚠️</span>
            <strong style={{ color: "var(--red, #f87171)" }}>
              This block had a problem
            </strong>
          </div>
          <p style={{ fontSize: 12, color: "var(--text3, #7a809a)", marginBottom: 10, lineHeight: 1.4 }}>
            Your work on other blocks is safe. {canRetry ? "Try reloading this block:" : "Try refreshing the page."}
          </p>
          {canRetry && (
            <button
              onClick={this.handleRetry}
              style={{
                padding: "6px 14px",
                borderRadius: 6,
                border: "1px solid var(--border, #323952)",
                background: "var(--surface, #161a26)",
                color: "var(--text2, #b0b5c9)",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Retry Block
            </button>
          )}
          <details style={{ marginTop: 10 }}>
            <summary style={{ cursor: "pointer", fontSize: 11, color: "var(--text3, #7a809a)" }}>
              Error details
            </summary>
            <pre style={{
              fontSize: 10,
              marginTop: 6,
              color: "var(--text3, #7a809a)",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}>
              {this.state.error.message}
            </pre>
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}
