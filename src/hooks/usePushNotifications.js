// src/hooks/usePushNotifications.js
// Manages FCM push notification opt-in state and token refresh.

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { requestPushToken, onForegroundMessage } from "../lib/firebase";

// Scoped per user so one student dismissing doesn't suppress it for another on shared devices
const dismissedKey = (uid) => `pushOptInDismissed_${uid}`;

export default function usePushNotifications() {
  const { user, userRole } = useAuth();
  const [showOptIn, setShowOptIn] = useState(false);

  useEffect(() => {
    if (!user || userRole === "teacher") return;
    if (!("Notification" in window)) return;

    const dismissed = localStorage.getItem(dismissedKey(user.uid));
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
    let mounted = true;
    let unsub = () => {};
    onForegroundMessage(() => {
      // No-op: foreground notifications are handled by NotificationBell
    }).then((u) => {
      if (mounted) unsub = u;
      else u();
    });
    return () => { mounted = false; unsub(); };
  }, [user]);

  const handleEnable = useCallback(async () => {
    if (!user) return;
    const token = await requestPushToken(user.uid);
    setShowOptIn(false);
    if (!token) {
      // Permission denied or error — don't ask again
      localStorage.setItem(dismissedKey(user.uid), "1");
    }
  }, [user]);

  const handleDismiss = useCallback(() => {
    setShowOptIn(false);
    if (user) localStorage.setItem(dismissedKey(user.uid), "1");
  }, [user]);

  return { showOptIn, handleEnable, handleDismiss };
}
