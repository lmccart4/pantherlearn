// src/lib/firebase.jsx
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAlxvGxLIBUrVO3WWmEcslFpSygeYVeHpY",
  authDomain: "pantherlearn-d6f7c.firebaseapp.com",
  projectId: "pantherlearn-d6f7c",
  storageBucket: "pantherlearn-d6f7c.firebasestorage.app",
  messagingSenderId: "293205883325",
  appId: "1:293205883325:web:c0c21ece0b4fc26f673ad4",
  measurementId: "G-5Y6BKF09HF"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
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
