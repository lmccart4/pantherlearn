// src/hooks/usePushNotifications.js
// Manages FCM push notification opt-in state and token refresh.

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { requestPushToken, onForegroundMessage } from "../lib/firebase";

const DISMISSED_KEY = "pushOptInDismissed";

export default function usePushNotifications() {
  const { user, userRole } = useAuth();
  const [showOptIn, setShowOptIn] = useState(false);

  useEffect(() => {
    if (!user || userRole === "teacher") return;
    if (!("Notification" in window)) return;

    const dismissed = localStorage.getItem(DISMISSED_KEY);
    const perm = Notification.permission;

    if (perm === "granted") {
      // Already granted — silently refresh token
      requestPushToken(user.uid);
    } else if (perm === "default" && !dismissed) {
      // Not yet asked and not dismissed — show opt-in
      setShowOptIn(true);
    }
    // "denied" — do nothing
  }, [user, userRole]);

  // Suppress browser notification when app is in foreground
  // (NotificationBell already shows it via Firestore listener)
  useEffect(() => {
    if (!user) return;
    let unsub = () => {};
    onForegroundMessage(() => {
      // No-op: foreground notifications are handled by NotificationBell
    }).then((u) => { unsub = u; });
    return () => unsub();
  }, [user]);

  const handleEnable = useCallback(async () => {
    if (!user) return;
    const token = await requestPushToken(user.uid);
    setShowOptIn(false);
    if (!token) {
      // Permission denied or error — don't ask again
      localStorage.setItem(DISMISSED_KEY, "1");
    }
  }, [user]);

  const handleDismiss = useCallback(() => {
    setShowOptIn(false);
    localStorage.setItem(DISMISSED_KEY, "1");
  }, []);

  return { showOptIn, handleEnable, handleDismiss };
}
