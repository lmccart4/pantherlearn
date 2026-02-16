// src/hooks/useAutoEnrollment.js
import { doc, getDoc, setDoc, collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

/**
 * Normalizes enrolledCourses data into a consistent { courseId: true } map.
 * Handles both legacy array format and current object format.
 */
function normalizeEnrolledCourses(ec) {
  const ecMap = {};
  if (Array.isArray(ec)) {
    ec.forEach((id) => {
      if (typeof id === "string" && id) ecMap[id] = true;
    });
  } else if (typeof ec === "object" && ec !== null) {
    for (const [key, value] of Object.entries(ec)) {
      if (value === true && isNaN(key)) ecMap[key] = true;
      else if (typeof value === "string" && value) ecMap[value] = true;
    }
  }
  return ecMap;
}

/**
 * Finds enrollment docs matching this student's email and:
 * 1. Links the student's UID to each enrollment doc
 * 2. Adds any new courseIds to the user's enrolledCourses map
 */
export async function autoLinkEnrollments(firebaseUser) {
  try {
    const email = firebaseUser.email.toLowerCase();
    const userRef = doc(db, "users", firebaseUser.uid);

    const enrollSnap = await getDocs(
      query(collection(db, "enrollments"), where("email", "==", email))
    );

    if (enrollSnap.empty) return;

    const freshUserDoc = await getDoc(userRef);
    const ec = freshUserDoc.exists() ? (freshUserDoc.data().enrolledCourses || {}) : {};
    const ecMap = normalizeEnrolledCourses(ec);
    let needsUpdate = false;

    for (const enrollDoc of enrollSnap.docs) {
      const data = enrollDoc.data();

      // Link UID to enrollment doc if not already set
      if (!data.uid || data.uid !== firebaseUser.uid) {
        await updateDoc(enrollDoc.ref, {
          uid: firebaseUser.uid,
          studentUid: firebaseUser.uid,
          displayName: firebaseUser.displayName || data.name || null,
        });
      }

      // Add course to enrolledCourses map
      if (data.courseId && !ecMap[data.courseId]) {
        ecMap[data.courseId] = true;
        needsUpdate = true;
      }
    }

    if (needsUpdate) {
      await setDoc(userRef, { enrolledCourses: ecMap }, { merge: true });
    }
  } catch (err) {
    console.warn("Auto-link enrollments failed:", err);
  }
}