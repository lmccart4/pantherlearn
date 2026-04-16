// Creates qa-student@lachlan.internal — a persistent student-role test account
// for end-to-end QA. Idempotent: re-running updates the user record without
// breaking existing progress.
//
// Login URL pattern (handled by LoginPage agent flow):
//   https://pantherlearn.web.app/login?agent=qa-student&key=qa-student-2026
const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

const EMAIL = "qa-student@lachlan.internal";
const PASSWORD = "qa-student-2026";
const DISPLAY_NAME = "QA Student (Test)";

// Enroll in the same courses real students use
const ENROLL_COURSES = [
  "digital-literacy",
  "physics",
];

(async () => {
  // 1) Create or update auth user
  let userRec;
  try {
    userRec = await admin.auth().getUserByEmail(EMAIL);
    console.log(`Auth user exists: ${userRec.uid}`);
    await admin.auth().updateUser(userRec.uid, { password: PASSWORD, displayName: DISPLAY_NAME });
    console.log(`  Updated password + displayName`);
  } catch (e) {
    if (e.code === "auth/user-not-found") {
      userRec = await admin.auth().createUser({
        email: EMAIL,
        password: PASSWORD,
        displayName: DISPLAY_NAME,
        emailVerified: true,
      });
      console.log(`Created auth user: ${userRec.uid}`);
    } else {
      throw e;
    }
  }

  const uid = userRec.uid;

  // 2) Find AI Literacy section courses (one per period)
  const allCourses = await db.collection("courses").get();
  const aiLitCourses = allCourses.docs
    .filter(d => /ai.?lit|artificial.?intelligence/i.test(d.data().title || d.id))
    .map(d => d.id);
  const enrollMap = {};
  for (const cid of [...ENROLL_COURSES, ...aiLitCourses]) enrollMap[cid] = true;

  // 3) Create or merge users doc
  const userDocRef = db.collection("users").doc(uid);
  const existingDoc = await userDocRef.get();
  await userDocRef.set({
    email: EMAIL,
    displayName: DISPLAY_NAME,
    role: "student",
    isTestStudent: true,
    enrolledCourses: enrollMap,
    updatedAt: new Date(),
    ...(!existingDoc.exists && { createdAt: new Date() }),
  }, { merge: true });
  console.log(`User doc written. role=student, isTestStudent=true`);
  console.log(`Enrolled in ${Object.keys(enrollMap).length} courses: ${Object.keys(enrollMap).join(", ")}`);

  console.log(`\n=== QA Student ready ===`);
  console.log(`UID:      ${uid}`);
  console.log(`Email:    ${EMAIL}`);
  console.log(`Password: ${PASSWORD}`);
  console.log(`Login:    https://pantherlearn.web.app/login?agent=qa-student&key=${PASSWORD}`);
  process.exit(0);
})();
