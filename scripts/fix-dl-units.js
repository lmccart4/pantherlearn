// fix-dl-units.js
// Updates Digital Literacy lesson unit fields to "Lesson 1", "Lesson 2", etc.
// Run: node fix-dl-units.js

import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase-config.js';

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
