// src/hooks/useUserProfile.js
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

/**
 * Creates or updates the user document in Firestore.
 * Returns the user's nickname (or null).
 */
export async function syncUserProfile(firebaseUser, role, isTestStudent = false) {
  const userRef = doc(db, "users", firebaseUser.uid);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    const data = userDoc.data();
    const updates = {};
    if (data.role !== role && !(data.role === 'teacher' && role === 'student')) updates.role = role;
    if (isTestStudent && !data.isTestStudent) updates.isTestStudent = true;
    if (Object.keys(updates).length > 0) {
      await setDoc(userRef, updates, { merge: true });
    }
    return data.nickname || null;
  } else {
    await setDoc(userRef, {
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      role,
      nickname: null,
      createdAt: new Date(),
      ...(isTestStudent && { isTestStudent: true }),
    });
    return null;
  }
}