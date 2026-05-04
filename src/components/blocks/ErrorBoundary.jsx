// src/components/blocks/ErrorBoundary.jsx
// Block-level error boundary — catches crashes in individual blocks
// without taking down the entire lesson viewer.

import { Component } from "react";
import "./ErrorBoundary.css";

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
        <div className="block-error">
          <div className="block-error-head">
            <span aria-hidden>⚠️</span>
            <strong>This block had a problem</strong>
          </div>
          <p className="block-error-msg">
            Your work on other blocks is safe. {canRetry ? "Try reloading this block:" : "Try refreshing the page."}
          </p>
          {canRetry && (
            <button className="block-error-retry" onClick={this.handleRetry}>
              Retry Block
            </button>
          )}
          <details className="block-error-details">
            <summary>Error details</summary>
            <pre>{this.state.error.message}</pre>
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}
