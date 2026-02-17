// src/components/blocks/ErrorBoundary.jsx
// Temporary error boundary to catch and display block-level crashes
// instead of crashing the entire page.

import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          padding: 16,
          background: "#3a1a1a",
          border: "1px solid #e74c3c",
          borderRadius: 8,
          margin: "8px 0",
          color: "#e74c3c",
          fontSize: 13,
        }}>
          <strong>⚠️ Block crashed:</strong> {this.state.error.message}
          <pre style={{
            fontSize: 11,
            marginTop: 8,
            color: "#aaa",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}>
            {this.state.error.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
