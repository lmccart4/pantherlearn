// src/hooks/useEngagementTimer.jsx
// Tracks active engagement time during lesson viewing.
// Pauses after 60s of inactivity, saves every 30s + on unmount.

import { useState, useEffect, useRef, useCallback } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "./useAuth";

const IDLE_TIMEOUT = 60000;  // 60s — pause timer after this much inactivity
const SAVE_INTERVAL = 30000; // 30s — save to Firestore periodically

export function useEngagementTimer(courseId, lessonId) {
  const { user } = useAuth();
  const [seconds, setSeconds] = useState(0);
  const activeRef = useRef(true);
  const lastActivityRef = useRef(Date.now());
  const accumulatedRef = useRef(0);
  const savedRef = useRef(0); // last value we persisted
  const intervalRef = useRef(null);

  // Save engagement time to Firestore
  const saveTime = useCallback(async () => {
    if (!user?.uid || !courseId || !lessonId) return;
    const total = accumulatedRef.current;
    if (total <= savedRef.current) return; // nothing new to save

    try {
      const ref = doc(db, "progress", user.uid, "courses", courseId, "lessons", lessonId);
      await setDoc(ref, { engagementTime: total }, { merge: true });
      savedRef.current = total;
    } catch (err) {
      console.warn("Failed to save engagement time:", err);
    }
  }, [user?.uid, courseId, lessonId]);

  // Load initial engagement time
  useEffect(() => {
    if (!user?.uid || !courseId || !lessonId) return;
    const load = async () => {
      try {
        const ref = doc(db, "progress", user.uid, "courses", courseId, "lessons", lessonId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const existing = snap.data().engagementTime || 0;
          accumulatedRef.current = existing;
          savedRef.current = existing;
          setSeconds(existing);
        }
      } catch (err) {
        console.warn("Could not load engagement time:", err);
      }
    };
    load();
  }, [user?.uid, courseId, lessonId]);

  // Activity detection — reset idle timer
  useEffect(() => {
    const markActive = () => {
      lastActivityRef.current = Date.now();
      activeRef.current = true;
    };

    const events = ["mousemove", "keydown", "scroll", "touchstart", "click"];
    events.forEach((e) => window.addEventListener(e, markActive, { passive: true }));

    // Pause when tab is hidden
    const handleVisibility = () => {
      if (document.hidden) {
        activeRef.current = false;
        saveTime(); // save when leaving tab
      } else {
        lastActivityRef.current = Date.now();
        activeRef.current = true;
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      events.forEach((e) => window.removeEventListener(e, markActive));
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [saveTime]);

  // Tick every second while active
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      // Check for idle timeout
      if (Date.now() - lastActivityRef.current > IDLE_TIMEOUT) {
        activeRef.current = false;
      }

      if (activeRef.current) {
        accumulatedRef.current += 1;
        setSeconds(accumulatedRef.current);
      }
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, []);

  // Periodic save
  useEffect(() => {
    const saveInterval = setInterval(saveTime, SAVE_INTERVAL);
    return () => clearInterval(saveInterval);
  }, [saveTime]);

  // Save on unmount
  useEffect(() => {
    return () => { saveTime(); };
  }, [saveTime]);

  return { seconds, isActive: activeRef.current };
}

// Format seconds into "Xm Ys" display
export function formatEngagementTime(totalSeconds) {
  if (!totalSeconds || totalSeconds < 1) return "0s";
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${s}s`;
}
