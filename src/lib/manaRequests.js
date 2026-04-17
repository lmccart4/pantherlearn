// src/lib/manaRequests.js
// Unified writer for all mana redemptions. Every spend path calls this so
// (a) the launchd notifier sees every redemption, and (b) Luke has a single
// audit trail.
import { collection, addDoc, updateDoc, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Write a manaRequests doc. Called after every mana spend.
 *
 * @param {object} params
 * @param {string} params.courseId
 * @param {string} params.studentUid
 * @param {string} params.studentName
 * @param {string} params.powerId
 * @param {string} params.powerName
 * @param {number} params.cost
 * @param {string} [params.details]        - e.g. "Applied +30% to: Forces Lesson 4"
 * @param {boolean} [params.autoFulfilled] - true for grade bonuses
 * @param {"fulfillment"|"quote"|"suggestion"|"auto-applied"} [params.type]
 */
export async function createManaRequest({
  courseId, studentUid, studentName, powerId, powerName, cost,
  details = "", autoFulfilled = false, type,
}) {
  const resolvedType = type || (autoFulfilled ? "auto-applied" : "fulfillment");
  const colRef = collection(db, "courses", courseId, "manaRequests");
  const docRef = await addDoc(colRef, {
    type: resolvedType,
    studentUid,
    studentName,
    powerId,
    powerName,
    cost,
    details,
    autoFulfilled,
    status: autoFulfilled ? "fulfilled" : "pending",
    notified: false,
    notifiedAt: null,
    fulfilledAt: autoFulfilled ? new Date().toISOString() : null,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
}

export async function markRequestFulfilled(courseId, requestId, note = "") {
  const ref = doc(db, "courses", courseId, "manaRequests", requestId);
  await updateDoc(ref, {
    status: "fulfilled",
    fulfilledAt: new Date().toISOString(),
    fulfillmentNote: note,
  });
}

export async function getPendingRequests(courseId) {
  const colRef = collection(db, "courses", courseId, "manaRequests");
  const q = query(colRef, where("status", "==", "pending"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
