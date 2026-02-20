// src/hooks/useAutoSave.jsx
import { useEffect, useRef, useCallback, useState } from "react";

/**
 * useAutoSave — debounced auto-save hook for student inputs.
 *
 * Saves automatically:
 *   - 30 seconds after the last change (configurable)
 *   - Immediately when the browser tab is closed/refreshed (beforeunload)
 *   - Retries with exponential backoff on failure (max 3 attempts)
 *   - Flushes pending saves when the network comes back online
 *
 * Usage:
 *   const { markDirty, saveNow, lastSaved, saving, saveError } = useAutoSave(saveFn, { delay: 30000 });
 *
 *   // Call markDirty() whenever an input changes
 *   // Call saveNow() on blur or explicit save button
 *   // lastSaved is a Date or null for showing "✓ Auto-saved at..."
 *   // saveError is a string or null for showing error feedback
 *
 * @param {Function} saveFn - async function that performs the save
 * @param {Object} options
 * @param {number} options.delay - debounce delay in ms (default 30000 = 30s)
 * @param {number} options.maxRetries - max retry attempts on failure (default 3)
 */
export default function useAutoSave(saveFn, { delay = 30000, maxRetries = 3 } = {}) {
  const [lastSaved, setLastSaved] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const dirtyRef = useRef(false);
  const timerRef = useRef(null);
  const retryTimerRef = useRef(null);
  const retryCountRef = useRef(0);
  const saveFnRef = useRef(saveFn);

  // Keep saveFn ref current without triggering effects
  useEffect(() => {
    saveFnRef.current = saveFn;
  }, [saveFn]);

  const doSave = useCallback(async () => {
    if (!dirtyRef.current) return;
    dirtyRef.current = false;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
    try {
      setSaving(true);
      await saveFnRef.current();
      setLastSaved(new Date());
      setSaveError(null);
      retryCountRef.current = 0;
    } catch (e) {
      console.warn("Auto-save failed:", e);
      // Re-mark dirty so it retries
      dirtyRef.current = true;
      retryCountRef.current += 1;

      if (retryCountRef.current <= maxRetries) {
        // Exponential backoff: 2s, 4s, 8s
        const backoff = Math.min(2000 * Math.pow(2, retryCountRef.current - 1), 30000);
        retryTimerRef.current = setTimeout(doSave, backoff);
      } else {
        // Exhausted retries — show error, but keep dirty so online handler can flush
        setSaveError("Save failed — your work is cached locally and will sync when connection returns.");
      }
    } finally {
      setSaving(false);
    }
  }, [maxRetries]);

  // Mark data as dirty and reset the debounce timer
  const markDirty = useCallback(() => {
    dirtyRef.current = true;
    // Clear any pending retry since new data is coming
    retryCountRef.current = 0;
    setSaveError(null);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    timerRef.current = setTimeout(doSave, delay);
  }, [delay, doSave]);

  // Save immediately (for blur events or explicit save buttons)
  const saveNow = useCallback(() => {
    doSave();
  }, [doSave]);

  // Clear dirty flag without saving (e.g. when a question is officially submitted
  // and the draft auto-save should not fire on unmount)
  const clearDirty = useCallback(() => {
    dirtyRef.current = false;
    retryCountRef.current = 0;
    setSaveError(null);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  }, []);

  // Flush pending saves when the network comes back online
  useEffect(() => {
    const handleOnline = () => {
      if (dirtyRef.current) {
        retryCountRef.current = 0; // Reset retries on reconnect
        doSave();
      }
    };
    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [doSave]);

  // Save on page unload (tab close, refresh, navigate away)
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (dirtyRef.current && saveFnRef.current) {
        // Use sendBeacon-style sync approach — fire and forget
        // With Firestore persistence enabled, writes will be queued in IndexedDB
        try {
          saveFnRef.current();
        } catch (e) {
          // Firestore persistence will replay this write
        }
      }
    };

    // Also save on visibility change (tab switch on mobile)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && dirtyRef.current) {
        doSave();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
      // Save on unmount if dirty (navigating to another lesson)
      if (dirtyRef.current) {
        try { saveFnRef.current(); } catch (e) {}
      }
    };
  }, [doSave]);

  return { markDirty, saveNow, clearDirty, lastSaved, saving, saveError };
}
