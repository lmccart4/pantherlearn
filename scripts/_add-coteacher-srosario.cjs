/**
 * Silently add SROSARIO@paps.net as co-teacher on every PantherLearn
 * course owned by lucamccarthy@paps.net. No emails, no notifications —
 * just a Firestore write that grants Stacy Rosario teacher-level access
 * for the 2025-2026 summative evaluation.
 *
 * Usage: cd ~/pantherlearn && node scripts/_add-coteacher-srosario.cjs
 *
 * Prereqs: Firebase ADC fresh. If "invalid_grant" run:
 *   gcloud auth application-default login
 *
 * Reversible — to remove later, change `arrayUnion` to `arrayRemove`.
 */

const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();
const auth = admin.auth();

const TARGET_EMAIL = "SROSARIO@paps.net";
const OWNER_EMAIL  = "lucamccarthy@paps.net";

async function getOrCreateUid(email) {
  // 1) Try to find by email in Firebase Auth
  try {
    const u = await auth.getUserByEmail(email);
    console.log(`  ✓ Auth user exists: ${u.uid}`);
    return u.uid;
  } catch (e) {
    if (e.code !== "auth/user-not-found") throw e;
  }
  // 2) Create silently — emailVerified false, no welcome email triggered
  const created = await auth.createUser({
    email,
    emailVerified: false,
    displayName: "S. Rosario",
    disabled: false,
  });
  console.log(`  ✓ Auth user created: ${created.uid}`);
  // 3) Seed minimal user doc so PantherLearn UI can resolve display name
  await db.collection("users").doc(created.uid).set({
    email,
    displayName: "S. Rosario",
    role: "teacher",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    note: "Added as evaluator co-teacher for 2025-2026 summative review",
  }, { merge: true });
  return created.uid;
}

async function ownerUid(email) {
  const u = await auth.getUserByEmail(email);
  return u.uid;
}

async function main() {
  console.log(`▸ Resolving UIDs`);
  const targetUid = await getOrCreateUid(TARGET_EMAIL);
  const lukeUid   = await ownerUid(OWNER_EMAIL);
  console.log(`  Luke uid: ${lukeUid}`);
  console.log(`  Stacy uid: ${targetUid}`);

  console.log(`\n▸ Finding Luke's courses`);
  const snap = await db.collection("courses").where("ownerUid", "==", lukeUid).get();
  console.log(`  Found ${snap.size} courses owned by Luke`);

  if (snap.empty) {
    console.log("  No courses found. Aborting.");
    process.exit(1);
  }

  const updates = [];
  for (const d of snap.docs) {
    const data = d.data();
    const already = (data.coTeachers || []).includes(targetUid);
    updates.push({
      id: d.id,
      title: data.title || data.name || "(untitled)",
      already,
    });
    if (!already) {
      await d.ref.update({
        coTeachers: admin.firestore.FieldValue.arrayUnion(targetUid),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
  }

  console.log(`\n▸ Result`);
  for (const u of updates) {
    console.log(`  ${u.already ? "·" : "+"} ${u.id}  ${u.title}${u.already ? "  (already a co-teacher)" : ""}`);
  }
  console.log(`\n✅ Stacy Rosario added to ${updates.filter(u => !u.already).length} courses (${updates.filter(u => u.already).length} already had her).`);
  console.log(`   No emails sent. Reversible by replacing arrayUnion with arrayRemove.`);
  process.exit(0);
}

main().catch(err => {
  console.error("❌ Error:", err.message || err);
  if (err.code === "16" || /invalid_grant/.test(String(err))) {
    console.error("\n  Auth expired. Run: gcloud auth application-default login");
  }
  process.exit(1);
});
