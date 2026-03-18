// fix-audit-findings-2026-03-18.cjs
// Applies all safe Firestore fixes from the 2026-03-18 lesson audit:
//   1. Remove scored:true from 4 Google Drive/Slides embed blocks
//   2. Fix gradeCategory on Momentum Mystery Lab + Bias Detective (all AI Lit sections)
//   3. Fix duplicate block ID b56682d2 in Momentum Conservation
//   4. Fix order values on Disproving a Crazy Idea, AI Is Everywhere, Intro to Generative AI

const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

const saPath = path.join(__dirname, "..", "serviceAccountKey.json");
if (fs.existsSync(saPath)) {
  admin.initializeApp({ credential: admin.credential.cert(require(saPath)) });
} else {
  admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
}
const db = admin.firestore();

// Helper: generate a short uid like the codebase uses
function uid() {
  return require("crypto").randomUUID().slice(0, 8);
}

async function fix1_removeGoogleDriveScoredTrue() {
  console.log("\n── Fix 1: Remove scored:true from Google Drive/Slides embed blocks ──");

  const fixes = [
    {
      course: "physics",
      lesson: "w20-download-prep",
      blockIds: ["b6ff6e1d", "f4ea3432"],
      note: "Momentum Conservation & Crash Investigation",
    },
    {
      course: "physics",
      lesson: "w22-disproving-crazy-idea",
      blockIds: ["cgjefed"],
      note: "Disproving a Crazy Idea",
    },
    {
      course: "digital-literacy",
      lesson: "ai-is-everywhere",
      blockIds: ["vb3gp4e"],
      note: "AI Is Everywhere",
    },
  ];

  for (const fix of fixes) {
    const ref = db.collection("courses").doc(fix.course).collection("lessons").doc(fix.lesson);
    const snap = await ref.get();
    if (!snap.exists) {
      console.log(`  SKIP: ${fix.course}/${fix.lesson} — not found`);
      continue;
    }
    const data = snap.data();
    const blocks = data.blocks || [];
    let changed = 0;
    const updated = blocks.map(b => {
      if (fix.blockIds.includes(b.id) && b.scored === true) {
        changed++;
        return { ...b, scored: false };
      }
      return b;
    });
    if (!changed) {
      console.log(`  SKIP: ${fix.note} — no matching scored:true blocks found`);
      continue;
    }
    await ref.update({ blocks: updated });
    console.log(`  FIXED: ${fix.note} — set scored:false on ${changed} block(s) [${fix.blockIds.join(", ")}]`);
  }
}

async function fix2_gradeCategory() {
  console.log("\n── Fix 2: Set gradeCategory:assessment on miscategorized lessons ──");

  // Physics: Momentum Mystery Lab
  const physicsRef = db.collection("courses").doc("physics").collection("lessons").doc("momentum-mystery-lab");
  const physSnap = await physicsRef.get();
  if (physSnap.exists) {
    await physicsRef.update({ gradeCategory: "assessment" });
    console.log("  FIXED: Physics Momentum Mystery Lab — gradeCategory → assessment");
  } else {
    // Try alternate lesson ID
    const physSearch = await db.collection("courses").doc("physics").collection("lessons")
      .where("title", ">=", "Momentum Mystery Lab").limit(3).get();
    for (const d of physSearch.docs) {
      if (d.data().title?.includes("Momentum Mystery Lab")) {
        await d.ref.update({ gradeCategory: "assessment" });
        console.log(`  FIXED: Physics Momentum Mystery Lab (id: ${d.id}) — gradeCategory → assessment`);
      }
    }
  }

  // AI Literacy: Bias Detective — all 4 sections
  const aiCourseIds = [
    "Y9Gdhw5MTY8wMFt6Tlvj",
    "DacjJ93vUDcwqc260OP3",
    "M2MVSXrKuVCD9JQfZZyp",
    "fUw67wFhAtobWFhjwvZ5",
  ];
  for (const courseId of aiCourseIds) {
    const snap = await db.collection("courses").doc(courseId).collection("lessons")
      .where("title", ">=", "Bias Detective").limit(5).get();
    for (const d of snap.docs) {
      if (d.data().title?.includes("Bias Detective")) {
        await d.ref.update({ gradeCategory: "assessment" });
        console.log(`  FIXED: AI Lit (${courseId.slice(0, 8)}...) Bias Detective (id: ${d.id}) — gradeCategory → assessment`);
      }
    }
  }
}

async function fix3_duplicateBlockId() {
  console.log("\n── Fix 3: Fix duplicate block ID b56682d2 in Momentum Conservation ──");

  const ref = db.collection("courses").doc("physics").collection("lessons").doc("w20-download-prep");
  const snap = await ref.get();
  if (!snap.exists) {
    console.log("  SKIP: w20-download-prep — not found");
    return;
  }
  const data = snap.data();
  const blocks = data.blocks || [];
  const seen = new Set();
  let fixed = 0;
  const updated = blocks.map(b => {
    if (!b.id) return b;
    if (seen.has(b.id)) {
      // This is the duplicate — assign a new ID
      const newId = uid();
      console.log(`  Reassigning duplicate id ${b.id} → ${newId} on block type=${b.type} (index in array)`);
      fixed++;
      return { ...b, id: newId };
    }
    seen.add(b.id);
    return b;
  });
  if (!fixed) {
    console.log("  SKIP: No duplicate IDs found (may have already been fixed)");
    return;
  }
  await ref.update({ blocks: updated });
  console.log(`  FIXED: Momentum Conservation — resolved ${fixed} duplicate block ID(s)`);
}

async function fix4_orderValues() {
  console.log("\n── Fix 4: Fix order values on stray lessons ──");

  // Physics: Disproving a Crazy Idea — order:null → infer from position in unit
  // Based on audit: lesson IDs and unit, set to a reasonable value
  const physicsLessons = [
    { id: "w22-disproving-crazy-idea", order: 22, note: "Disproving a Crazy Idea (Physics)" },
  ];
  for (const l of physicsLessons) {
    const ref = db.collection("courses").doc("physics").collection("lessons").doc(l.id);
    const snap = await ref.get();
    if (!snap.exists) { console.log(`  SKIP: ${l.note} — not found`); continue; }
    await ref.update({ order: l.order });
    console.log(`  FIXED: ${l.note} — order → ${l.order}`);
  }

  // Digital Literacy: AI Is Everywhere — order:0 → should be later in sequence
  // Audit: order:0 causes it to render before all lessons. Set to a reasonable value.
  const dlRef = db.collection("courses").doc("digital-literacy").collection("lessons").doc("ai-is-everywhere");
  const dlSnap = await dlRef.get();
  if (dlSnap.exists) {
    // Get all visible lessons (no orderBy to avoid index requirement)
    const allDL = await db.collection("courses").doc("digital-literacy").collection("lessons")
      .where("visible", "==", true).get();
    const orders = allDL.docs
      .filter(doc => doc.id !== "ai-is-everywhere")
      .map(doc => doc.data().order || 0)
      .filter(o => o > 0)
      .sort((a, b) => a - b);
    const maxOrder = orders.length ? orders[orders.length - 1] : 10;
    const newOrder = maxOrder + 1;
    await dlRef.update({ order: newOrder });
    console.log(`  FIXED: AI Is Everywhere (Digital Literacy) — order: 0 → ${newOrder}`);
  } else {
    console.log("  SKIP: AI Is Everywhere — not found");
  }

  // AI Literacy: Introduction to Generative AI — order:null → set to reasonable value
  // Apply across all 4 AI Literacy sections
  const aiCourseIds = [
    "Y9Gdhw5MTY8wMFt6Tlvj",
    "DacjJ93vUDcwqc260OP3",
    "M2MVSXrKuVCD9JQfZZyp",
    "fUw67wFhAtobWFhjwvZ5",
  ];
  for (const courseId of aiCourseIds) {
    const snap = await db.collection("courses").doc(courseId).collection("lessons")
      .where("title", ">=", "Introduction to Generative AI").limit(5).get();
    for (const d of snap.docs) {
      if (d.data().title?.includes("Introduction to Generative AI") && !d.data().order) {
        // Get all visible lessons without orderBy (avoids composite index requirement)
        const allSnap = await db.collection("courses").doc(courseId).collection("lessons")
          .where("visible", "==", true).get();
        const orders = allSnap.docs.map(x => x.data().order || 0).filter(o => o > 0).sort((a, b) => a - b);
        const maxOrder = orders.length ? orders[orders.length - 1] : 10;
        await d.ref.update({ order: maxOrder + 1 });
        console.log(`  FIXED: AI Lit (${courseId.slice(0, 8)}...) Intro to Generative AI — order → ${maxOrder + 1}`);
      }
    }
  }
}

async function main() {
  console.log("Starting audit fix script — 2026-03-18");
  try {
    await fix1_removeGoogleDriveScoredTrue();
    await fix2_gradeCategory();
    await fix3_duplicateBlockId();
    await fix4_orderValues();
    console.log("\n✓ All fixes applied.");
  } catch (err) {
    console.error("\nERROR:", err);
    process.exit(1);
  }
}

main();
