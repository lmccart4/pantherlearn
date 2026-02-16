// src/components/ErrorBoundary.jsx
import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg)",
          color: "var(--text)",
          padding: "2rem",
          textAlign: "center",
        }}>
          <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Something went wrong</h1>
          <p style={{ marginBottom: "1.5rem", opacity: 0.7 }}>
            An unexpected error occurred. Try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "0.6rem 1.5rem",
              borderRadius: "8px",
              border: "none",
              background: "var(--accent, #4f46e5)",
              color: "#fff",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}