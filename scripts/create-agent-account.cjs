// Create a Firebase Auth user for a Lachlan agent account on PantherLearn.
//
// Usage:
//   node scripts/create-agent-account.cjs pixel@lachlan.internal "Pixel (visual QA)"
//
// Behavior:
// - Idempotent. If the auth user already exists, the script just ensures the
//   Firestore users/{uid} doc has role=teacher. No password change.
// - If the auth user doesn't exist, creates it with a random 24-byte password
//   and prints the password ONCE to stdout. Save it immediately.
// - Writes users/{uid} with role="teacher" (PantherLearn has no admin tier —
//   teacher is full access). Marks isAgent=true for future grep-ability.
//
// This is a one-shot admin maintenance script. Firebase Admin SDK bypasses
// Firestore rules, so it works regardless of deploy state.
const admin = require("firebase-admin");
const crypto = require("crypto");

if (!admin.apps.length) {
  admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
}
const auth = admin.auth();
const db = admin.firestore();

const EMAIL = (process.argv[2] || "").trim().toLowerCase();
const DISPLAY_NAME = process.argv[3] || "";

if (!EMAIL) {
  console.error("usage: node scripts/create-agent-account.cjs <email> [displayName]");
  process.exit(2);
}
if (!EMAIL.endsWith("@lachlan.internal") && !EMAIL.endsWith("@paps.net")) {
  console.error("refusing: email must end with @lachlan.internal or @paps.net");
  process.exit(2);
}

(async () => {
  let userRecord;
  let password = null;

  try {
    userRecord = await auth.getUserByEmail(EMAIL);
    console.log(`[auth] user exists: ${EMAIL} (uid: ${userRecord.uid}) — not touching password`);
  } catch (e) {
    if (e.code !== "auth/user-not-found") throw e;
    // 18 bytes → 24-char base64url string, URL/shell safe, no padding
    password = crypto.randomBytes(18).toString("base64url");
    userRecord = await auth.createUser({
      email: EMAIL,
      password,
      displayName: DISPLAY_NAME || EMAIL,
      emailVerified: true,
    });
    console.log(`[auth] created user: ${EMAIL} (uid: ${userRecord.uid})`);
  }

  // Ensure the Firestore users doc exists with role=teacher
  const userRef = db.collection("users").doc(userRecord.uid);
  const snap = await userRef.get();
  if (!snap.exists) {
    await userRef.set({
      email: EMAIL,
      displayName: DISPLAY_NAME || EMAIL,
      role: "teacher",
      isAgent: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log(`[fs]   created users/${userRecord.uid} with role=teacher`);
  } else {
    const data = snap.data();
    const needsUpdate = data.role !== "teacher" || data.isAgent !== true;
    if (needsUpdate) {
      await userRef.set(
        {
          role: "teacher",
          isAgent: true,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
      console.log(`[fs]   updated users/${userRecord.uid} — role=teacher, isAgent=true`);
    } else {
      console.log(`[fs]   users/${userRecord.uid} already correct`);
    }
  }

  if (password) {
    const line = "=".repeat(60);
    console.log("\n" + line);
    console.log("NEW PASSWORD — save this now, it will NOT be shown again:");
    console.log("");
    console.log("  " + password);
    console.log("");
    console.log("Account:  " + EMAIL);
    console.log("Login at: https://pantherlearn.web.app");
    console.log(line);
  }

  process.exit(0);
})().catch((e) => {
  console.error(`error: ${e.message}`);
  process.exit(1);
});
