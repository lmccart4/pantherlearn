// Sync grades from PantherLearn (Firestore) to Google Classroom.
// Run: node scripts/classroom-sync.cjs
// Designed for headless cron execution.

const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");

// ── Config ──────────────────────────────────────────────────────────────────

const TOKEN_PATH = path.join(__dirname, "..", ".classroom-token.json");
const GC_API = "https://classroom.googleapis.com/v1";
const PAGE_SIZE = 30;

let accessToken = null;
let db = null;
const stats = { coursesScanned: 0, coursesSynced: 0, gradesPushed: 0, gradesUnchanged: 0, errors: 0 };

// ── OAuth ───────────────────────────────────────────────────────────────────

async function getAccessToken() {
  const tokenData = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8"));
  const { refresh_token, client_id, client_secret } = tokenData;
  if (!refresh_token || !client_id || !client_secret) throw new Error("Missing fields in .classroom-token.json");

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token, client_id, client_secret }),
  });
  const data = await res.json();
  if (data.error) throw new Error(`Token refresh failed: ${data.error_description || data.error}`);
  return data.access_token;
}

// ── Classroom API helpers ───────────────────────────────────────────────────

async function gcFetch(urlPath, options = {}) {
  const url = urlPath.startsWith("http") ? urlPath : `${GC_API}${urlPath}`;
  const res = await fetch(url, {
    ...options,
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json", ...(options.headers || {}) },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Classroom API ${res.status}: ${body}`);
  }
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

// ── Main sync per course ────────────────────────────────────────────────────

async function syncCourse(courseId, classroomCourseId) {
  console.log(`\nSyncing: ${courseId} → Classroom ${classroomCourseId}`);

  // 1. Get enrollments and match to Classroom students
  const enrollSnap = await db.collection("enrollments").where("courseId", "==", courseId).get();
  const enrollments = enrollSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  const gcStudents = await gcListAll(`/courses/${classroomCourseId}/students`, "students");

  const nameToGcId = {};
  const emailToGcId = {};
  gcStudents.forEach((s) => {
    const name = s.profile?.name?.fullName;
    const email = s.profile?.emailAddress;
    if (name) nameToGcId[name.trim().toLowerCase()] = s.userId;
    if (email) emailToGcId[email.toLowerCase()] = s.userId;
  });

  // Match PL students → GC students
  const uidToGcId = {};
  const studentUids = [];
  for (const e of enrollments) {
    const uid = e.uid || e.studentUid;
    if (!uid) continue;
    studentUids.push(uid);

    const email = e.email?.toLowerCase();
    let name = e.displayName?.trim().toLowerCase() || e.name?.trim().toLowerCase();

    // Fall back to user doc
    if (!name && !email) {
      const userSnap = await db.doc(`users/${uid}`).get();
      if (userSnap.exists) name = (userSnap.data().displayName || "").trim().toLowerCase();
    }

    if (email && emailToGcId[email]) uidToGcId[uid] = emailToGcId[email];
    else if (name && nameToGcId[name]) uidToGcId[uid] = nameToGcId[name];
  }

  const matchCount = Object.keys(uidToGcId).length;
  console.log(`  Matched ${matchCount}/${enrollments.length} students`);
  if (matchCount === 0) { console.log("  Skipping — no matches"); return; }

  // 2. Load lesson definitions
  const lessonSnap = await db.collection("courses").doc(courseId).collection("lessons").get();
  const today = new Date().toISOString().slice(0, 10);
  const lessons = lessonSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
    .filter((l) => l.visible !== false)
    .filter((l) => !l.dueDate || l.dueDate <= today); // skip future due dates

  // 3. Find section courseIds (progress may be stored under section IDs)
  const sectionCourseIds = [courseId];
  const allCoursesSnap = await db.collection("courses").get();
  allCoursesSnap.docs.forEach((d) => {
    if (d.data().migratedFrom === courseId) sectionCourseIds.push(d.id);
  });
  if (sectionCourseIds.length > 1) {
    console.log(`  Checking ${sectionCourseIds.length} course IDs (parent + ${sectionCourseIds.length - 1} sections)`);
  }

  // Helper to load and merge data from all courseIds
  const loadFromAllSections = async (uid, subcollection, merger) => {
    const merged = {};
    for (const cid of sectionCourseIds) {
      const snap = await db.collection("progress").doc(uid).collection("courses").doc(cid).collection(subcollection).get();
      snap.docs.forEach((d) => merger(merged, d));
    }
    return merged;
  };

  // Load all student progress in parallel
  const [progressResults, reflectionResults, activityResults] = await Promise.all([
    Promise.allSettled(studentUids.map(async (uid) => {
      const data = await loadFromAllSections(uid, "lessons", (merged, d) => {
        if (!merged[d.id]) {
          const dd = d.data();
          merged[d.id] = { ...dd.answers, _completed: !!dd.completed };
        }
      });
      return { uid, data };
    })),
    Promise.allSettled(studentUids.map(async (uid) => {
      const data = await loadFromAllSections(uid, "reflections", (merged, d) => {
        if (!merged[d.id]) merged[d.id] = d.data();
      });
      return { uid, data };
    })),
    Promise.allSettled(studentUids.map(async (uid) => {
      const data = await loadFromAllSections(uid, "activities", (merged, d) => {
        if (!merged[d.id] || (d.data().activityScore != null && merged[d.id].activityScore == null)) {
          merged[d.id] = d.data();
        }
      });
      return { uid, data };
    })),
  ]);

  const progress = {}, reflections = {}, activities = {};
  progressResults.forEach((r) => { if (r.status === "fulfilled") progress[r.value.uid] = r.value.data; });
  reflectionResults.forEach((r) => { if (r.status === "fulfilled") reflections[r.value.uid] = r.value.data; });
  activityResults.forEach((r) => { if (r.status === "fulfilled") activities[r.value.uid] = r.value.data; });

  // 4. Compute lesson grades: { lessonId: { uid: grade } }
  const getMC = (lesson) => (lesson.blocks || []).filter((b) => b.type === "question" && b.questionType === "multiple_choice");
  const getSA = (lesson) => (lesson.blocks || []).filter((b) => b.type === "question" && b.questionType === "short_answer");

  const lessonGrades = {};
  for (const lesson of lessons) {
    const mc = getMC(lesson);
    const sa = getSA(lesson);
    if (mc.length === 0 && sa.length === 0) continue;

    for (const uid of studentUids) {
      const answers = progress[uid]?.[lesson.id] || {};
      const completed = answers._completed || false;
      const reflection = reflections[uid]?.[lesson.id];

      let earned = 0, possible = 0;
      mc.forEach((q) => { possible++; const a = answers[q.id]; if (a?.submitted && a.correct) earned++; });
      sa.forEach((q) => { possible++; const a = answers[q.id]; if (a?.submitted && a.writtenScore != null) earned += a.writtenScore; });
      if (completed && reflection) { possible++; if (reflection.valid) earned++; }

      if (possible === 0) continue;
      if (!lessonGrades[lesson.id]) lessonGrades[lesson.id] = {};
      lessonGrades[lesson.id][uid] = Math.round((earned / possible) * 100);
    }
  }

  // 5. Compute activity grades: { actId: { uid: grade } }
  const allActivities = {};
  const activityGrades = {};
  for (const uid of studentUids) {
    const acts = activities[uid] || {};
    for (const [actId, data] of Object.entries(acts)) {
      if (data.activityScore == null) continue;
      if (!allActivities[actId]) allActivities[actId] = data.activityTitle || actId;
      if (!activityGrades[actId]) activityGrades[actId] = {};
      activityGrades[actId][uid] = Math.round(data.activityScore * 100);
    }
  }

  // 6. List existing Classroom assignments once
  const existingCW = await gcListAll(`/courses/${classroomCourseId}/courseWork`, "courseWork");
  const titleToCW = {};
  existingCW.forEach((cw) => { titleToCW[cw.title] = cw; });

  // Helper: get or create assignment by title
  const getOrCreate = async (title, dueDate) => {
    if (titleToCW[title]) return titleToCW[title].id;
    const body = { title, workType: "ASSIGNMENT", state: "PUBLISHED", maxPoints: 100 };
    if (dueDate) {
      const [year, month, day] = dueDate.split("-").map(Number);
      if (year && month && day) {
        body.dueDate = { year, month, day };
        body.dueTime = { hours: 23, minutes: 59 };
      }
    }
    const created = await gcFetch(`/courses/${classroomCourseId}/courseWork`, { method: "POST", body: JSON.stringify(body) });
    titleToCW[title] = created;
    return created.id;
  };

  // Helper: push grades for one assignment
  const pushAssignment = async (title, gradesByUid, dueDate) => {
    let cwId;
    try { cwId = await getOrCreate(title, dueDate); }
    catch (err) { console.error(`  Failed to get/create "${title}": ${err.message}`); stats.errors++; return; }

    const subs = await gcListAll(`/courses/${classroomCourseId}/courseWork/${cwId}/studentSubmissions`, "studentSubmissions");
    const userToSub = {};
    subs.forEach((s) => { userToSub[s.userId] = s; });

    let pushed = 0, unchanged = 0;
    for (const [uid, grade] of Object.entries(gradesByUid)) {
      const gcId = uidToGcId[uid];
      if (!gcId) continue;
      const sub = userToSub[gcId];
      if (!sub) continue;
      if (sub.assignedGrade === grade) { unchanged++; stats.gradesUnchanged++; continue; }
      try {
        await gcFetch(`/courses/${classroomCourseId}/courseWork/${cwId}/studentSubmissions/${sub.id}?updateMask=assignedGrade,draftGrade`, {
          method: "PATCH", body: JSON.stringify({ assignedGrade: grade, draftGrade: grade }),
        });
        pushed++;
        stats.gradesPushed++;
      } catch (err) {
        console.error(`  Grade push failed (uid=${uid}): ${err.message}`);
        stats.errors++;
      }
    }
    console.log(`  ${title}: ${pushed} pushed, ${unchanged} unchanged`);
  };

  // 7. Push lesson grades
  const lessonMap = {};
  lessons.forEach((l) => { lessonMap[l.id] = l; });

  for (const [lessonId, grades] of Object.entries(lessonGrades)) {
    const lesson = lessonMap[lessonId];
    const title = lesson?.title || lessonId;
    const dueDate = lesson?.dueDate || null;
    await pushAssignment(title, grades, dueDate);
  }

  // 8. Push activity grades
  for (const [actId, grades] of Object.entries(activityGrades)) {
    await pushAssignment(allActivities[actId], grades, null);
  }

  // 9. Save snapshot
  const gradeSnapshot = {};
  for (const [lessonId, grades] of Object.entries(lessonGrades)) {
    for (const [uid, grade] of Object.entries(grades)) gradeSnapshot[`lesson_${lessonId}_${uid}`] = grade;
  }
  for (const [actId, grades] of Object.entries(activityGrades)) {
    for (const [uid, grade] of Object.entries(grades)) gradeSnapshot[`activity_${actId}_${uid}`] = grade;
  }
  await db.doc(`classroomSync/${courseId}_${classroomCourseId}`).set({
    courseId, classroomCourseId,
    lastSyncedAt: admin.firestore.FieldValue.serverTimestamp(),
    gradeSnapshot,
  });

  stats.coursesSynced++;
}

// ── Entry point ─────────────────────────────────────────────────────────────

async function main() {
  console.log("Classroom Grade Sync\n");

  // Auth
  try { accessToken = await getAccessToken(); console.log("Access token acquired"); }
  catch (err) { console.error(`Fatal: ${err.message}`); process.exit(1); }

  // Firebase
  if (!admin.apps.length) {
    const saPath = path.join(__dirname, "..", "serviceAccountKey.json");
    if (fs.existsSync(saPath)) {
      admin.initializeApp({ credential: admin.credential.cert(require(saPath)) });
    } else {
      admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
    }
  }
  db = admin.firestore();

  // Get courses with Classroom mappings
  const coursesSnap = await db.collection("courses").get();
  console.log(`Found ${coursesSnap.size} courses`);

  for (const courseDoc of coursesSnap.docs) {
    stats.coursesScanned++;
    // Check for mapping — look for any classroomSync doc with this courseId
    const mappingSnap = await db.collection("classroomSync").where("courseId", "==", courseDoc.id).get();
    let classroomCourseId = null;
    mappingSnap.docs.forEach((d) => {
      if (d.data().classroomCourseId) classroomCourseId = d.data().classroomCourseId;
    });

    if (!classroomCourseId) continue;

    try { await syncCourse(courseDoc.id, classroomCourseId); }
    catch (err) { console.error(`Error syncing ${courseDoc.id}: ${err.message}`); stats.errors++; }
  }

  console.log("\n── Summary ──");
  console.log(`  Courses: ${stats.coursesSynced}/${stats.coursesScanned} synced`);
  console.log(`  Grades: ${stats.gradesPushed} pushed, ${stats.gradesUnchanged} unchanged`);
  if (stats.errors) console.log(`  Errors: ${stats.errors}`);
}

main().then(() => process.exit(0)).catch((err) => { console.error(`Fatal: ${err.message}`); process.exit(1); });
