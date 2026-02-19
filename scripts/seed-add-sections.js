// seed-add-sections.js
// Adds per-section enroll codes to existing courses.
// Run: node seed-add-sections.js

import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase-config.js';

function generateCodeSuffix() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 4; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

async function migrate() {
  console.log("═══════════════════════════════════════");
  console.log("  Adding Per-Section Enroll Codes");
  console.log("═══════════════════════════════════════\n");

  const courseId = "ai-literacy";
  const courseRef = doc(db, "courses", courseId);
  const courseDoc = await getDoc(courseRef);

  if (!courseDoc.exists()) {
    console.error("❌ Course 'ai-literacy' not found");
    process.exit(1);
  }

  // Define your sections
  const sectionNames = ["Period 4", "Period 5", "Period 7", "Period 9"];

  const sections = {};
  for (const name of sectionNames) {
    const id = name.toLowerCase().replace(/\s+/g, "-");
    const code = `AILT-${generateCodeSuffix()}`;
    sections[id] = { name, enrollCode: code };
  }

  await updateDoc(courseRef, { sections });

  console.log(`✅ Added ${sectionNames.length} sections to ${courseId}:\n`);
  for (const [id, sec] of Object.entries(sections)) {
    console.log(`   ${sec.name}: ${sec.enrollCode}`);
  }

  console.log("\n  Share these codes with each period's students.");
  console.log("  Students who enter the code will auto-join the correct section.\n");

  process.exit(0);
}

migrate().catch((err) => {
  console.error("❌ Failed:", err);
  process.exit(1);
});
