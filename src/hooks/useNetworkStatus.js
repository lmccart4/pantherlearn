// src/hooks/useNetworkStatus.js
// Detects online/offline state and exposes it to components.
// Uses navigator.onLine + event listeners for real-time updates.

import { useState, useEffect, useCallback } from "react";

export default function useNetworkStatus() {
  const [online, setOnline] = useState(navigator.onLine);
  // Track when we came back online so components can react
  const [reconnectedAt, setReconnectedAt] = useState(null);

  const handleOnline = useCallback(() => {
    setOnline(true);
    setReconnectedAt(new Date());
  }, []);

  const handleOffline = useCallback(() => {
    setOnline(false);
  }, []);

  useEffect(() => {
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [handleOnline, handleOffline]);

  return { online, reconnectedAt };
}
