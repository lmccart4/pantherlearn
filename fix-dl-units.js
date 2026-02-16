// fix-dl-units.js
// Updates Digital Literacy lesson unit fields to "Lesson 1", "Lesson 2", etc.
// Run: node fix-dl-units.js

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

// ⬇️ PASTE YOUR FIREBASE CONFIG HERE ⬇️
const firebaseConfig = {
  apiKey: "AIzaSyAlxvGxLIBUrVO3WWmEcslFpSygeYVeHpY",
  authDomain: "pantherlearn-d6f7c.firebaseapp.com",
  projectId: "pantherlearn-d6f7c",
  storageBucket: "pantherlearn-d6f7c.firebasestorage.app",
  messagingSenderId: "293205883325",
  appId: "1:293205883325:web:c0c21ece0b4fc26f673ad4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const updates = [
  { slug: "ai-is-everywhere", unit: "Lesson 1" },
  { slug: "wevideo-basics", unit: "Lesson 2" },
  { slug: "storytelling-structure", unit: "Lesson 3" },
  { slug: "production-day-1", unit: "Lesson 4" },
  { slug: "finish-and-share", unit: "Lesson 5" },
];

async function fix() {
  for (const { slug, unit } of updates) {
    await updateDoc(
      doc(db, 'courses', 'digital-literacy', 'lessons', slug),
      { unit }
    );
    console.log(`✅ ${slug} → ${unit}`);
  }
  console.log("\n🎉 Done!");
  process.exit(0);
}

fix();
