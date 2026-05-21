// Leaderboard backend (Firestore on pantherlearn-1f970). Loaded lazily by game.js
// via dynamic import so a CDN/offline failure can never break the game itself.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getFirestore, collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const cfg = {
  apiKey: 'AIzaSyDhDVHEWv8uZZq8u2Iuf9J2xkjKXVAlPoQ',
  authDomain: 'pantherlearn-1f970.firebaseapp.com',
  projectId: 'pantherlearn-1f970',
  storageBucket: 'pantherlearn-1f970.firebasestorage.app',
  messagingSenderId: '745767902310',
  appId: '1:745767902310:web:ac1de8ec59e42d480de1a7'
};

const db = getFirestore(initializeApp(cfg));
const scores = () => collection(db, 'scores');

// Write a result. Returns the saved entry (without id) or throws on failure.
export async function submitScore({ name, period, score, pct, mode, correct, total }) {
  const entry = {
    name: String(name).slice(0, 30),
    period: period | 0,
    score: Math.round(score),
    pct: Math.round(pct),
    mode: String(mode || ''),
    correct: correct | 0,
    total: total | 0,
    ts: serverTimestamp()
  };
  await addDoc(scores(), entry);
  return entry;
}

// Top N. If `period` is given (1-9), filter to that period; otherwise all-time.
export async function topScores(period, n = 15) {
  const cap = period ? 300 : n;
  const snap = await getDocs(query(scores(), orderBy('score', 'desc'), limit(cap)));
  let rows = snap.docs.map((d) => d.data());
  if (period) rows = rows.filter((r) => (r.period | 0) === (period | 0));
  return rows.slice(0, n);
}
