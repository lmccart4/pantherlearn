// Seed physics enrollments from Google Classroom roster.
// Pulls students from GC, matches to PantherLearn users by email, and creates enrollment docs.
// Run: node scripts/seed-physics-enrollments.cjs

const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");

const TOKEN_PATH = path.join(__dirname, "..", ".classroom-token.json");
const GC_API = "https://classroom.googleapis.com/v1";
const PAGE_SIZE = 30;

const COURSE_ID = "physics";
const CLASSROOM_COURSE_ID = "795674299830";

let accessToken = null;

async function getAccessToken() {
  const tokenData = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8"));
  const { refresh_token, client_id } = tokenData;
  // Load client_secret from .env.classroom (not stored in token file)
  const envPath = path.join(__dirname, "..", ".env.classroom");
  const envVars = {};
  fs.readFileSync(envPath, "utf8").split("\n").forEach((line) => {
    const [key, ...val] = line.split("=");
    if (key && val.length) envVars[key.trim()] = val.join("=").trim();
  });
  const client_secret = envVars.CLASSROOM_CLIENT_SECRET;
  if (!refresh_token || !client_id || !client_secret) throw new Error("Missing refresh_token/client_id in .classroom-token.json or CLASSROOM_CLIENT_SECRET in .env.classroom");
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token, client_id, client_secret }),
  });
  const data = await res.json();
  if (data.error) throw new Error(`Token refresh failed: ${data.error_description || data.error}`);
  return data.access_token;
}

async function gcFetch(urlPath) {
  const url = urlPath.startsWith("http") ? urlPath : `${GC_API}${urlPath}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`Classroom API ${res.status}: ${await res.text()}`);
  return res.json();
}

async function gcListAll(urlPath, listKey) {
  const results = [];
  let pageToken = null;
  do {
    const sep = urlPath.includes("?") ? "&" : "?";
    const url = pageToken
      ? `${urlPath}${sep}pageSize=${PAGE_SIZE}&pageToken=${pageToken}`
      : `${urlPath}${sep}pageSize=${PAGE_SIZE}`;
    const data = await gcFetch(url);
    if (data[listKey]) results.push(...data[listKey]);
    pageToken = data.nextPageToken || null;
  } while (pageToken);
  return results;
}

async function main() {
  // Init Firebase
  const saPath = path.join(__dirname, "..", "serviceAccountKey.json");
  if (fs.existsSync(saPath)) {
    admin.initializeApp({ credential: admin.credential.cert(require(saPath)) });
  } else {
    admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
  }
  const db = admin.firestore();

  // Auth
  accessToken = await getAccessToken();
  console.log("Access token acquired");

  // Pull GC roster
  const gcStudents = await gcListAll(`/courses/${CLASSROOM_COURSE_ID}/students`, "students");
  console.log(`Found ${gcStudents.length} students in Google Classroom`);

  // Get existing PantherLearn users by email AND name
  const usersSnap = await db.collection("users").get();
  const emailToUser = {};
  const nameToUser = {};
  usersSnap.docs.forEach((d) => {
    const data = d.data();
    const email = (data.email || "").toLowerCase();
    const name = (data.displayName || "").trim().toLowerCase();
    if (email) emailToUser[email] = { uid: d.id, ...data };
    if (name) nameToUser[name] = { uid: d.id, ...data };
  });
  console.log(`Found ${Object.keys(emailToUser).length} PantherLearn users (${Object.keys(nameToUser).length} with names)`);

  // Match and create enrollments
  let created = 0, matched = 0, unmatched = 0;
  const batch = db.batch();

  for (const s of gcStudents) {
    const email = (s.profile?.emailAddress || "").toLowerCase();
    const name = s.profile?.name?.fullName || "";
    const nameLower = name.trim().toLowerCase();

    // Try email match first, then name match
    const plUser = (email && emailToUser[email]) || nameToUser[nameLower];

    if (!plUser) {
      console.log(`  ⚠ No PL account: ${name} (${email || "no email"})`);
      unmatched++;
      continue;
    }

    matched++;
    const userEmail = (plUser.email || email || "").toLowerCase();
    const emailClean = userEmail ? userEmail.replace(/[^a-z0-9]/g, "_") : plUser.uid;
    const enrollKey = `${COURSE_ID}_${emailClean}`;
    const enrollRef = db.collection("enrollments").doc(enrollKey);

    batch.set(enrollRef, {
      courseId: COURSE_ID,
      studentUid: plUser.uid,
      uid: plUser.uid,
      email: userEmail,
      displayName: plUser.displayName || name,
      enrolledAt: admin.firestore.FieldValue.serverTimestamp(),
      source: "classroom-roster-seed",
    }, { merge: true });
    created++;
    console.log(`  ✅ ${name} → ${plUser.uid} (${userEmail})`);
  }

  if (created > 0) {
    await batch.commit();
  }

  console.log(`\nDone: ${created} enrollments created, ${matched} matched, ${unmatched} unmatched`);
  process.exit(0);
}

main().catch((err) => { console.error(err); process.exit(1); });
