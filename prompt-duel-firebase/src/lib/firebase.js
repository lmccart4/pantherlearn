// src/lib/firebase.js
// Prompt Duel — Firebase config with Auth for PantherLearn integration
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "pantherlearn-d6f7c.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "pantherlearn-d6f7c",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "pantherlearn-d6f7c.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

// Cloud Function URL — update after deploying
export const GEMINI_PROXY_URL = "https://us-central1-pantherlearn-d6f7c.cloudfunctions.net/geminiProxy";
