// src/components/ErrorBoundary.jsx
import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorCount: 0 };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState((prev) => ({
      hasError: false,
      error: null,
      errorCount: prev.errorCount + 1,
    }));
  };

  render() {
    if (this.state.hasError) {
      const canRetry = this.state.errorCount < 3;

      return (
        <div style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg, #0a0c12)",
          color: "var(--text, #f0f0f4)",
          padding: "2rem",
          textAlign: "center",
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>
            {canRetry ? "⚡" : "😵"}
          </div>
          <h1 style={{
            fontSize: "1.5rem",
            marginBottom: "0.75rem",
            fontFamily: "var(--font-display, serif)",
          }}>
            {canRetry ? "Something went wrong" : "This page keeps crashing"}
          </h1>
          <p style={{ marginBottom: "1.5rem", opacity: 0.7, maxWidth: 400, lineHeight: 1.5 }}>
            {canRetry
              ? "Don't worry — your work is saved locally. Try again or refresh the page."
              : "Your work is saved locally and will sync when you come back. Try refreshing or come back later."}
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            {canRetry && (
              <button
                onClick={this.handleRetry}
                style={{
                  padding: "0.6rem 1.5rem",
                  borderRadius: "8px",
                  border: "none",
                  background: "var(--amber, #f5a623)",
                  color: "#1a1a1a",
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontWeight: 700,
                }}
              >
                Try Again
              </button>
            )}
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "0.6rem 1.5rem",
                borderRadius: "8px",
                border: canRetry ? "1px solid var(--border, #323952)" : "none",
                background: canRetry ? "transparent" : "var(--amber, #f5a623)",
                color: canRetry ? "var(--text2, #b0b5c9)" : "#1a1a1a",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: canRetry ? 500 : 700,
              }}
            >
              Refresh Page
            </button>
          </div>
          {this.state.error && (
            <details style={{ marginTop: 24, maxWidth: 500, textAlign: "left" }}>
              <summary style={{ cursor: "pointer", fontSize: 12, color: "var(--text3, #7a809a)" }}>
                Error details
              </summary>
              <pre style={{
                marginTop: 8,
                fontSize: 11,
                color: "var(--text3, #7a809a)",
                background: "var(--surface, #161a26)",
                padding: 12,
                borderRadius: 8,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                maxHeight: 200,
                overflow: "auto",
              }}>
                {this.state.error.message}
                {"\n\n"}
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
