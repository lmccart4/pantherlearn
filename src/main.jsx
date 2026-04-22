import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./lib/perfMode"; // Apply perf-mode class before React renders
import "./lib/theme"; // Apply saved theme before React renders
import App from "./App";
import "./index.css";
import "./blocks.css";
import "./styles/blocks-savanna.css";
import "./styles/pages-savanna.css";
import "./preview.css";

// Auto-reload if a stale JS chunk fails to load after a deploy
window.addEventListener('vite:preloadError', () => {
  // Only auto-reload once per session to avoid infinite loops
  const reloadKey = 'vite_chunk_reload'
  if (!sessionStorage.getItem(reloadKey)) {
    sessionStorage.setItem(reloadKey, '1')
    window.location.reload()
  }
})

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
