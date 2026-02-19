// src/hooks/useAutoSave.jsx
import { useEffect, useRef, useCallback, useState } from "react";

/**
 * useAutoSave — debounced auto-save hook for student inputs.
 *
 * Saves automatically:
 *   - 30 seconds after the last change
 *   - Immediately when the browser tab is closed/refreshed (beforeunload)
 *
 * Usage:
 *   const { markDirty, saveNow, lastSaved } = useAutoSave(saveFn, { delay: 30000 });
 *
 *   // Call markDirty() whenever an input changes
 *   // Call saveNow() on blur or explicit save button
 *   // lastSaved is a Date or null for showing "✓ Auto-saved at..."
 *
 * @param {Function} saveFn - async function that performs the save
 * @param {Object} options
 * @param {number} options.delay - debounce delay in ms (default 30000 = 30s)
 */
export default function useAutoSave(saveFn, { delay = 30000 } = {}) {
  const [lastSaved, setLastSaved] = useState(null);
  const [saving, setSaving] = useState(false);
  const dirtyRef = useRef(false);
  const timerRef = useRef(null);
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
    try {
      setSaving(true);
      await saveFnRef.current();
      setLastSaved(new Date());
    } catch (e) {
      console.warn("Auto-save failed:", e);
      // Re-mark dirty so it tries again
      dirtyRef.current = true;
    } finally {
      setSaving(false);
    }
  }, []);

  // Mark data as dirty and reset the debounce timer
  const markDirty = useCallback(() => {
    dirtyRef.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);
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
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Save on page unload (tab close, refresh, navigate away)
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (dirtyRef.current && saveFnRef.current) {
        // Use sendBeacon-style sync approach — fire and forget
        try {
          saveFnRef.current();
        } catch (e) {
          // Can't do much here
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
      // Save on unmount if dirty (navigating to another lesson)
      if (dirtyRef.current) {
        try { saveFnRef.current(); } catch (e) {}
      }
    };
  }, [doSave]);

  return { markDirty, saveNow, clearDirty, lastSaved, saving };
}
