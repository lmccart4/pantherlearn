/**
 * Clean up the duplicate "Forgery Detective (Quiz Grade)" Classroom
 * assignment in P5/P7/P9 (not P4 — P4 uses it legitimately).
 *
 * Safety: before deletion, verifies that EVERY student with a grade
 * on the Quiz Grade assignment ALSO has a grade on the plain
 * "Forgery Detective" assignment. If any student would lose a grade,
 * the script aborts without deleting.
 *
 * Run:
 *   node scripts/cleanup-forgery-dupes-classroom.cjs --dry     (default — no writes)
 *   node scripts/cleanup-forgery-dupes-classroom.cjs --execute (actually delete)
 */
const fs = require("fs");
const path = require("path");

const DRY = !process.argv.includes("--execute");

const SECTIONS = [
  { label: "P5", plCourseId: "DacjJ93vUDcwqc260OP3" },
  { label: "P7", plCourseId: "M2MVSXrKuVCD9JQfZZyp" },
  { label: "P9", plCourseId: "fUw67wFhAtobWFhjwvZ5" },
];
const DUPE_TITLE = "Forgery Detective (Quiz Grade)";
const KEEPER_TITLE = "Forgery Detective";

const TOKEN_PATH = path.join(__dirname, "..", ".classroom-token.json");
const GC_API = "https://classroom.googleapis.com/v1";
let accessToken = null;

async function getAccessToken() {
  const tokenData = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8"));
  const envPath = path.join(__dirname, "..", ".env.classroom");
  const envVars = {};
  fs.readFileSync(envPath, "utf8").split("\n").forEach((line) => {
    const [key, ...val] = line.split("=");
    if (key && val.length) envVars[key.trim()] = val.join("=").trim();
  });
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: tokenData.refresh_token,
      client_id: tokenData.client_id,
      client_secret: envVars.CLASSROOM_CLIENT_SECRET,
    }),
  });
  return (await res.json()).access_token;
}

async function gc(method, urlPath, body) {
  const res = await fetch(`${GC_API}${urlPath}`, {
    method,
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (method === "DELETE" && res.ok) return {};
  const text = await res.text();
  if (!res.ok) throw new Error(`${res.status}: ${text}`);
  return text ? JSON.parse(text) : {};
}

async function listAll(urlPath, listKey) {
  const out = [];
  let pt = null;
  do {
    const sep = urlPath.includes("?") ? "&" : "?";
    const url = `${urlPath}${sep}pageSize=50${pt ? "&pageToken=" + pt : ""}`;
    const data = await gc("GET", url);
    if (data[listKey]) out.push(...data[listKey]);
    pt = data.nextPageToken || null;
  } while (pt);
  return out;
}

async function main() {
  accessToken = await getAccessToken();
  console.log(`Auth ✓  ${DRY ? "(DRY RUN — no deletions)" : "(LIVE — will delete)"}\n`);

  const admin = require("firebase-admin");
  if (!admin.apps.length) admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
  const db = admin.firestore();

  for (const section of SECTIONS) {
    console.log(`════ ${section.label} ════`);

    // Look up Classroom course id
    const mapSnap = await db.collection("classroomSync").where("courseId", "==", section.plCourseId).get();
    const classroomId = mapSnap.docs[0]?.data()?.classroomCourseId;
    if (!classroomId) { console.log("  No classroomSync mapping, skipping"); continue; }

    // List courseWork
    const cwList = await listAll(`/courses/${classroomId}/courseWork`, "courseWork");
    const dupe = cwList.find(cw => cw.title === DUPE_TITLE);
    const keeper = cwList.find(cw => cw.title === KEEPER_TITLE);

    if (!dupe) { console.log(`  No "${DUPE_TITLE}" courseWork found — nothing to clean up`); continue; }
    console.log(`  Found dupe: "${dupe.title}" (id=${dupe.id})`);
    console.log(`  Found keeper: "${keeper?.title || 'MISSING'}" ${keeper ? `(id=${keeper.id})` : ""}`);

    if (!keeper) {
      console.log(`  ⚠️  Keeper missing — would leave students with no Forgery grade at all. SKIPPING this section.`);
      continue;
    }

    // Get all submissions on the dupe
    const dupeSubs = await listAll(
      `/courses/${classroomId}/courseWork/${dupe.id}/studentSubmissions`,
      "studentSubmissions"
    );
    const dupeSubsWithGrade = dupeSubs.filter(s => (s.assignedGrade != null || s.draftGrade != null));
    console.log(`  Dupe submissions: ${dupeSubs.length} total, ${dupeSubsWithGrade.length} with a grade`);

    // Safety check: every dupe-grade holder must ALSO have a keeper grade
    const keeperSubs = await listAll(
      `/courses/${classroomId}/courseWork/${keeper.id}/studentSubmissions`,
      "studentSubmissions"
    );
    const keeperGraded = new Set(
      keeperSubs.filter(s => s.assignedGrade != null || s.draftGrade != null).map(s => s.userId)
    );
    const atRisk = dupeSubsWithGrade.filter(s => !keeperGraded.has(s.userId));
    if (atRisk.length > 0) {
      console.log(`  🛑 ABORT: ${atRisk.length} student(s) would lose their grade:`);
      for (const s of atRisk) {
        console.log(`      userId=${s.userId}  dupe grade=${s.assignedGrade ?? s.draftGrade}`);
      }
      console.log(`      Not deleting — investigate manually.`);
      continue;
    }

    console.log(`  ✓ Safety check passed. All ${dupeSubsWithGrade.length} graded dupe submissions have matching keeper grades.`);

    if (DRY) {
      console.log(`  [dry] Would DELETE courseWork ${dupe.id} ("${dupe.title}")`);
    } else {
      try {
        await gc("DELETE", `/courses/${classroomId}/courseWork/${dupe.id}`);
        console.log(`  ✅ DELETED courseWork ${dupe.id}`);
      } catch (err) {
        console.log(`  ❌ Delete failed: ${err.message}`);
      }
    }
  }

  console.log(`\n${DRY ? "[DRY RUN] run with --execute to apply changes." : "Done."}`);
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
