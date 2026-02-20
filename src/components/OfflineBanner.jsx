// src/components/OfflineBanner.jsx
// Shows a non-intrusive banner when the user loses network connectivity.
// Auto-dismisses when the connection returns.

import { useState, useEffect } from "react";
import useNetworkStatus from "../hooks/useNetworkStatus";

export default function OfflineBanner() {
  const { online, reconnectedAt } = useNetworkStatus();
  const [showReconnected, setShowReconnected] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  // Track if we were ever offline this session
  useEffect(() => {
    if (!online) setWasOffline(true);
  }, [online]);

  // Show "Back online" briefly when reconnected
  useEffect(() => {
    if (reconnectedAt && wasOffline) {
      setShowReconnected(true);
      const t = setTimeout(() => setShowReconnected(false), 3000);
      return () => clearTimeout(t);
    }
  }, [reconnectedAt, wasOffline]);

  if (online && !showReconnected) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        bottom: 16,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        padding: "10px 20px",
        borderRadius: 10,
        fontSize: 13,
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        gap: 8,
        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
        animation: "offlineBannerSlide 0.3s ease-out",
        ...(online
          ? {
              background: "rgba(16,185,129,0.15)",
              border: "1px solid rgba(16,185,129,0.3)",
              color: "#10b981",
            }
          : {
              background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.3)",
              color: "#ef4444",
            }),
      }}
    >
      <span style={{ fontSize: 16 }}>{online ? "✅" : "📡"}</span>
      <span>
        {online
          ? "Back online — your work is syncing."
          : "You're offline — your work is saved locally and will sync when you reconnect."}
      </span>
    </div>
  );
}
