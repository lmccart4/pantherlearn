// src/hooks/useUserProfile.js
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

/**
 * Creates or updates the user document in Firestore.
 * Returns the user's nickname (or null).
 */
export async function syncUserProfile(firebaseUser, role) {
  const userRef = doc(db, "users", firebaseUser.uid);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    const data = userDoc.data();
    // Update role if it changed
    if (data.role !== role) {
      await setDoc(userRef, { role }, { merge: true });
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
    });
    return null;
  }
}