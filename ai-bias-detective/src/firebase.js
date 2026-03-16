import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Replace with your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyBqWVrvTu64KbTyAvnLf-Qm0AGR9MfQ17A",
  authDomain: "ai-bias-detective.firebaseapp.com",
  projectId: "ai-bias-detective",
  storageBucket: "ai-bias-detective.firebasestorage.app",
  messagingSenderId: "141498703037",
  appId: "1:141498703037:web:72ae7b32172a731f83ebd4"
};

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()
export default app
