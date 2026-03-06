// src/hooks/useUserProfile.js
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

/**
 * Creates or updates the user document in Firestore.
 * Returns the user's nickname (or null).
 */
export async function syncUserProfile(firebaseUser, role) {
  try {
    const userRef = doc(db, "users", firebaseUser.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const data = userDoc.data();
      // Update display info if changed (role is set on creation only, protected by security rules)
      if (data.displayName !== firebaseUser.displayName || data.photoURL !== firebaseUser.photoURL) {
        await setDoc(userRef, {
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        }, { merge: true });
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
  } catch (err) {
    console.error("syncUserProfile failed:", err);
    return null;
  }
}