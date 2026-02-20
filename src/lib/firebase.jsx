// src/lib/firebase.jsx
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Enable IndexedDB persistence so student work survives offline / flaky WiFi.
// Multi-tab manager allows multiple tabs to share the same cache.
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
});

export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logOut = () => signOut(auth);

// Sign in with additional Classroom scopes (for teacher roster sync)
export const signInWithClassroom = async () => {
  const classroomProvider = new GoogleAuthProvider();
  classroomProvider.addScope("https://www.googleapis.com/auth/classroom.courses.readonly");
  classroomProvider.addScope("https://www.googleapis.com/auth/classroom.rosters.readonly");
  classroomProvider.setCustomParameters({ prompt: "consent" });
  const result = await signInWithPopup(auth, classroomProvider);
  const credential = GoogleAuthProvider.credentialFromResult(result);
  return credential.accessToken;
};
