// src/hooks/useTelemetry.js
// Daily engagement telemetry buckets — accumulates interaction metrics per student
// per course per day. Flushes to Firestore every 30s via atomic increment().
// Runs alongside useEngagementTimer (doesn't replace it).

import { useEffect, useRef, useCallback } from "react";
import { doc, setDoc, increment, Timestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "./useAuth";

const FLUSH_INTERVAL = 30000; // 30s — same cadence as engagement timer
const SESSION_GAP = 1800000;  // 30min of inactivity = new session
const IDLE_TIMEOUT = 60000;   // 60s — same as engagement timer

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function useTelemetry(courseId, lessonId) {
  const { user } = useAuth();
  const uid = user?.uid;

  // ── Local accumulators (flushed periodically) ──
  const deltaRef = useRef({
    activeTime: 0,
    idleTime: 0,
    questionsAnswered: 0,
    questionsCorrect: 0,
    chatMessages: 0,
    reflectionsSubmitted: 0,
    lessonsCompleted: 0,
    // Per-lesson deltas
    lessonActiveTime: 0,
    lessonQuestionsAnswered: 0,
    lessonQuestionsCorrect: 0,
    lessonChatMessages: 0,
    lessonBlocksInteracted: new Set(),
  });

  const lastActivityRef = useRef(Date.now());
  const isActiveRef = useRef(true);
  const lastFlushRef = useRef(Date.now());
  const lessonOpenedRef = useRef(false);
  const sessionTrackedRef = useRef(false);
  const dayRef = useRef(todayKey());

  // ── Bucket document reference ──
  const getBucketRef = useCallback(() => {
    if (!uid || !courseId) return null;
    const day = todayKey();
    dayRef.current = day;
    return doc(db, "telemetry", uid, "courses", courseId, "days", day);
  }, [uid, courseId]);

  // ── Flush accumulated deltas to Firestore ──
  const flush = useCallback(async () => {
    const ref = getBucketRef();
    if (!ref) return;

    const d = deltaRef.current;
    // Only flush if there's something to write
    if (d.activeTime === 0 && d.idleTime === 0 &&
        d.questionsAnswered === 0 && d.chatMessages === 0 &&
        d.reflectionsSubmitted === 0 && d.lessonsCompleted === 0 &&
        d.lessonActiveTime === 0 && d.lessonQuestionsAnswered === 0 &&
        d.lessonChatMessages === 0 && d.lessonBlocksInteracted.size === 0) {
      return;
    }

    // Build the update payload using increment() for atomic counters
    const payload = {
      lastActivity: Timestamp.now(),
    };

    if (d.activeTime > 0) payload.activeTime = increment(d.activeTime);
    if (d.idleTime > 0) payload.idleTime = increment(d.idleTime);
    if (d.questionsAnswered > 0) payload.questionsAnswered = increment(d.questionsAnswered);
    if (d.questionsCorrect > 0) payload.questionsCorrect = increment(d.questionsCorrect);
    if (d.chatMessages > 0) payload.chatMessages = increment(d.chatMessages);
    if (d.reflectionsSubmitted > 0) payload.reflectionsSubmitted = increment(d.reflectionsSubmitted);
    if (d.lessonsCompleted > 0) payload.lessonsCompleted = increment(d.lessonsCompleted);

    // Per-lesson breakdown
    if (lessonId && (d.lessonActiveTime > 0 || d.lessonQuestionsAnswered > 0 ||
        d.lessonChatMessages > 0 || d.lessonBlocksInteracted.size > 0)) {
      const lessonPayload = {};
      if (d.lessonActiveTime > 0) lessonPayload[`lessons.${lessonId}.activeTime`] = increment(d.lessonActiveTime);
      if (d.lessonQuestionsAnswered > 0) lessonPayload[`lessons.${lessonId}.questionsAnswered`] = increment(d.lessonQuestionsAnswered);
      if (d.lessonQuestionsCorrect > 0) lessonPayload[`lessons.${lessonId}.questionsCorrect`] = increment(d.lessonQuestionsCorrect);
      if (d.lessonChatMessages > 0) lessonPayload[`lessons.${lessonId}.chatMessages`] = increment(d.lessonChatMessages);
      if (d.lessonBlocksInteracted.size > 0) lessonPayload[`lessons.${lessonId}.blocksInteracted`] = increment(d.lessonBlocksInteracted.size);
      Object.assign(payload, lessonPayload);
    }

    // Reset deltas
    d.activeTime = 0;
    d.idleTime = 0;
    d.questionsAnswered = 0;
    d.questionsCorrect = 0;
    d.chatMessages = 0;
    d.reflectionsSubmitted = 0;
    d.lessonsCompleted = 0;
    d.lessonActiveTime = 0;
    d.lessonQuestionsAnswered = 0;
    d.lessonQuestionsCorrect = 0;
    d.lessonChatMessages = 0;
    d.lessonBlocksInteracted = new Set();

    try {
      await setDoc(ref, payload, { merge: true });
      lastFlushRef.current = Date.now();
    } catch (err) {
      console.warn("Telemetry flush failed:", err);
    }
  }, [getBucketRef, lessonId]);

  // ── Track lesson open + session detection ──
  useEffect(() => {
    if (!uid || !courseId || !lessonId) return;

    const ref = getBucketRef();
    if (!ref) return;

    // Mark lesson opened (once per mount)
    if (!lessonOpenedRef.current) {
      lessonOpenedRef.current = true;
      setDoc(ref, {
        lessonsOpened: increment(1),
        firstActivity: Timestamp.now(),
        lastActivity: Timestamp.now(),
      }, { merge: true }).catch(() => {});
    }

    // Session tracking — check if this is a new session (gap > 30 min since last activity)
    if (!sessionTrackedRef.current) {
      sessionTrackedRef.current = true;
      setDoc(ref, {
        sessions: increment(1),
      }, { merge: true }).catch(() => {});
    }
  }, [uid, courseId, lessonId, getBucketRef]);

  // ── Activity detection (mirrors useEngagementTimer) ──
  useEffect(() => {
    const markActive = () => {
      lastActivityRef.current = Date.now();
      isActiveRef.current = true;
    };

    const events = ["mousemove", "keydown", "scroll", "touchstart", "click"];
    events.forEach((e) => window.addEventListener(e, markActive, { passive: true }));

    const handleVisibility = () => {
      if (document.hidden) {
        isActiveRef.current = false;
        flush(); // flush when leaving tab
      } else {
        lastActivityRef.current = Date.now();
        isActiveRef.current = true;
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      events.forEach((e) => window.removeEventListener(e, markActive));
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [flush]);

  // ── 1-second tick — accumulate active/idle time ──
  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastActivityRef.current > IDLE_TIMEOUT) {
        isActiveRef.current = false;
      }

      if (isActiveRef.current) {
        deltaRef.current.activeTime += 1;
        deltaRef.current.lessonActiveTime += 1;
      } else {
        deltaRef.current.idleTime += 1;
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ── Periodic flush ──
  useEffect(() => {
    const interval = setInterval(flush, FLUSH_INTERVAL);
    return () => clearInterval(interval);
  }, [flush]);

  // ── Flush on unmount ──
  useEffect(() => {
    return () => { flush(); };
  }, [flush]);

  // ── Flush on page unload (best-effort) ──
  useEffect(() => {
    const handleBeforeUnload = () => { flush(); };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [flush]);

  // ── trackEvent — called by child components ──
  const trackEvent = useCallback((type, meta = {}) => {
    if (!uid || !courseId) return;

    const d = deltaRef.current;

    switch (type) {
      case "question_answered":
        d.questionsAnswered += 1;
        d.lessonQuestionsAnswered += 1;
        if (meta.correct) {
          d.questionsCorrect += 1;
          d.lessonQuestionsCorrect += 1;
        }
        if (meta.blockId) d.lessonBlocksInteracted.add(meta.blockId);
        break;

      case "chat_message":
        d.chatMessages += 1;
        d.lessonChatMessages += 1;
        if (meta.blockId) d.lessonBlocksInteracted.add(meta.blockId);
        break;

      case "lesson_completed":
        d.lessonsCompleted += 1;
        break;

      case "reflection_submitted":
        d.reflectionsSubmitted += 1;
        break;

      case "block_interaction":
        if (meta.blockId) d.lessonBlocksInteracted.add(meta.blockId);
        break;

      default:
        break;
    }
  }, [uid, courseId]);

  return { trackEvent };
}
