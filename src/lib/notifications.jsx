// src/lib/notifications.jsx
// Notification system for PantherLearn — per-user notification subcollection.
// Types: grade_result, level_up, new_lesson, streak_warning, announcement, badge_earned, chat_message

import {
  collection, doc, setDoc, updateDoc, getDocs, query, where,
  orderBy, limit, onSnapshot, writeBatch, serverTimestamp
} from "firebase/firestore";
import { db } from "./firebase";
import { getCourseEnrollments } from "./enrollment";

// ─── Notification Types & Icons ───
export const NOTIF_TYPES = {
  grade_result:    { icon: "📝", color: "var(--green)" },
  level_up:        { icon: "⬆️", color: "var(--amber)" },
  new_lesson:      { icon: "📘", color: "var(--blue)" },
  streak_warning:  { icon: "🔥", color: "var(--red)" },
  announcement:    { icon: "📢", color: "var(--amber)" },
  badge_earned:    { icon: "🏅", color: "var(--purple)" },
  chat_message:    { icon: "💬", color: "var(--cyan)" },
  game_challenge:  { icon: "🎭", color: "var(--purple)" },
  mana_received:   { icon: "✦", color: "#8b5cf6" },
};

// ─── Create a notification for a single user ───
export async function createNotification(uid, {
  type,
  title,
  body,
  icon,
  link,
  courseId,
}) {
  const notifRef = doc(collection(db, "users", uid, "notifications"));
  await setDoc(notifRef, {
    type: type || "announcement",
    title,
    body: body || "",
    icon: icon || NOTIF_TYPES[type]?.icon || "🔔",
    link: link || null,
    courseId: courseId || null,
    read: false,
    createdAt: serverTimestamp(),
  });
  return notifRef.id;
}

// ─── Mark a single notification as read ───
export async function markRead(uid, notifId) {
  const ref = doc(db, "users", uid, "notifications", notifId);
  await updateDoc(ref, { read: true });
}

// ─── Mark all notifications as read ───
export async function markAllRead(uid) {
  const q = query(
    collection(db, "users", uid, "notifications"),
    where("read", "==", false)
  );
  const snap = await getDocs(q);
  if (snap.empty) return;

  const batch = writeBatch(db);
  snap.forEach((d) => batch.update(d.ref, { read: true }));
  await batch.commit();
}

// ─── Fan out a notification to all enrolled students in a course ───
export async function fanOutNotification(courseId, data) {
  const enrollments = await getCourseEnrollments(courseId);
  const promises = enrollments.map((e) => {
    const uid = e.uid || e.studentUid;
    if (!uid) return null;
    return createNotification(uid, { ...data, courseId });
  }).filter(Boolean);
  await Promise.all(promises);
}

// ─── Subscribe to real-time notifications (returns unsubscribe) ───
export function subscribeNotifications(uid, callback, maxCount = 30) {
  const q = query(
    collection(db, "users", uid, "notifications"),
    orderBy("createdAt", "desc"),
    limit(maxCount)
  );
  return onSnapshot(q, (snap) => {
    const notifs = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      createdAt: d.data().createdAt?.toDate?.() || new Date(),
    }));
    callback(notifs);
  });
}
