// Sync grades from PantherLearn (Firestore) to Google Classroom.
// Run: node scripts/classroom-sync.cjs
// Designed for headless cron execution.

const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");
const { execSync } = require("child_process");

// ── Config ──────────────────────────────────────────────────────────────────

const TOKEN_PATH = path.join(__dirname, "..", ".classroom-token.json");
const GC_API = "https://classroom.googleapis.com/v1";
const PAGE_SIZE = 30;

let accessToken = null;
let db = null;
const stats = { coursesScanned: 0, coursesSynced: 0, gradesPushed: 0, gradesUnchanged: 0, errors: 0 };

// Detailed report data: array of { courseName, newAssignments: [{title, count}], updatedAssignments: [{title, changes: [{name, old, new}]}] }
const reportData = [];

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

  // Get course name from Classroom API
  let courseName = courseId;
  try {
    const gcCourse = await gcFetch(`/courses/${classroomCourseId}`);
    courseName = gcCourse.name || gcCourse.section ? `${gcCourse.name || ""}${gcCourse.section ? ` ${gcCourse.section}` : ""}` : courseId;
  } catch { /* fallback to courseId */ }

  const courseReport = { courseName, newAssignments: [], updatedAssignments: [] };

  // 1. Get enrollments and match to Classroom students
  const enrollSnap = await db.collection("enrollments").where("courseId", "==", courseId).get();
  const enrollments = enrollSnap.docs.map((d) => ({ id: d.id, ...d.data() })).filter((e) => !e.isTestStudent);

  const gcStudents = await gcListAll(`/courses/${classroomCourseId}/students`, "students");

  const nameToGcId = {};
  const emailToGcId = {};
  const gcIdToName = {};
  gcStudents.forEach((s) => {
    const name = s.profile?.name?.fullName;
    const email = s.profile?.emailAddress;
    if (name) {
      nameToGcId[name.trim().toLowerCase()] = s.userId;
      gcIdToName[s.userId] = name;
    }
    if (email) emailToGcId[email.toLowerCase()] = s.userId;
  });

  // Also build uid → display name from enrollments
  const uidToName = {};
  enrollments.forEach((e) => {
    const uid = e.uid || e.studentUid;
    if (uid) uidToName[uid] = e.displayName || e.name || uid.slice(0, 8);
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
    .filter((l) => !l.dueDate || l.dueDate < today); // only sync after due date has fully passed

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
          merged[d.id] = { ...dd.answers, _completed: !!dd.completed, _exempt: !!dd.exempt };
        }
      });
      return { uid, data };
    })),
    // Reflections live at courses/{courseId}/reflections/ (not under progress/)
    (async () => {
      const allRefs = {};
      for (const cid of sectionCourseIds) {
        const refSnap = await db.collection("courses").doc(cid).collection("reflections").get();
        refSnap.docs.forEach((d) => {
          const data = d.data();
          if (!data.studentId || !data.lessonId) return;
          if (!allRefs[data.studentId]) allRefs[data.studentId] = {};
          if (!allRefs[data.studentId][data.lessonId]) {
            allRefs[data.studentId][data.lessonId] = data;
          }
        });
      }
      return allRefs;
    })(),
    Promise.allSettled(studentUids.map(async (uid) => {
      const data = await loadFromAllSections(uid, "activities", (merged, d) => {
        if (!merged[d.id] || (d.data().activityScore != null && merged[d.id].activityScore == null)) {
          merged[d.id] = d.data();
        }
      });
      return { uid, data };
    })),
  ]);

  const progress = {}, activities = {};
  const reflections = reflectionResults; // already a { uid: { lessonId: data } } map
  progressResults.forEach((r) => { if (r.status === "fulfilled") progress[r.value.uid] = r.value.data; });
  activityResults.forEach((r) => { if (r.status === "fulfilled") activities[r.value.uid] = r.value.data; });

  // Build exempt map: { lessonId: Set<uid> }
  const exemptMap = {};
  for (const uid of studentUids) {
    for (const [lessonId, data] of Object.entries(progress[uid] || {})) {
      if (data._exempt) {
        if (!exemptMap[lessonId]) exemptMap[lessonId] = new Set();
        exemptMap[lessonId].add(uid);
      }
    }
  }

  // Manually excluded lessons/activities — these are never synced to Classroom
  const EXCLUDED_LESSONS = new Set([
    'battleship-energy',  // Legacy duplicate — replaced by Energy Connect Four
  ]);
  const EXCLUDED_ACTIVITIES = new Set([
    'battleship-energy',  // Legacy duplicate
  ]);

  // 4. Compute lesson grades: { lessonId: { uid: grade } }
  const getMC = (lesson) => (lesson.blocks || []).filter((b) => b.type === "question" && b.questionType === "multiple_choice");
  const getSA = (lesson) => (lesson.blocks || []).filter((b) => b.type === "question" && b.questionType === "short_answer");
  const getRanking = (lesson) => (lesson.blocks || []).filter((b) => b.type === "question" && b.questionType === "ranking");
  const getLinked = (lesson) => (lesson.blocks || []).filter((b) => b.type === "question" && b.questionType === "linked");
  const getEmbeds = (lesson) => (lesson.blocks || []).filter((b) => (b.type === "embed" || b.type === "connect_four") && b.scored);
  const getSorting = (lesson) => (lesson.blocks || []).filter((b) => b.type === "sorting");
  const getConceptBuilder = (lesson) => (lesson.blocks || []).filter((b) => b.type === "concept_builder");

  const lessonGrades = {};
  for (const lesson of lessons) {
    if (EXCLUDED_LESSONS.has(lesson.id)) continue;
    const mc = getMC(lesson);
    const sa = getSA(lesson);
    const ranking = getRanking(lesson);
    const linked = getLinked(lesson);
    const embeds = getEmbeds(lesson);
    const sorting = getSorting(lesson);
    const conceptBuilder = getConceptBuilder(lesson);
    const allGraded = [...mc, ...sa, ...ranking, ...linked, ...embeds, ...sorting, ...conceptBuilder];
    if (allGraded.length === 0) continue;

    for (const uid of studentUids) {
      // Skip exempt students — they'll be marked as excused on Classroom
      if (exemptMap[lesson.id]?.has(uid)) continue;

      const answers = progress[uid]?.[lesson.id] || {};
      const completed = answers._completed || false;
      const reflection = reflections[uid]?.[lesson.id];

      // Safety: if student completed the lesson but none of their answer IDs match
      // current block IDs, the lesson was rebuilt with new IDs. Skip to avoid false 0s.
      if (completed && Object.keys(answers).filter(k => k !== '_completed').length > 0) {
        const questionIds = new Set(allGraded.map(q => q.id));
        const answerIds = Object.keys(answers).filter(k => k !== '_completed');
        const matched = answerIds.filter(id => questionIds.has(id)).length;
        if (matched === 0) {
          // All answers are orphaned — lesson was rebuilt, skip this student
          continue;
        }
      }

      let earned = 0, possible = 0;

      // MC: always count toward possible (unanswered = wrong)
      mc.forEach((q) => { possible++; const a = answers[q.id]; if (a?.submitted && a.correct) earned++; });

      // SA: only count if student has submitted an answer (skip unanswered)
      sa.forEach((q) => {
        const a = answers[q.id];
        if (!a?.submitted) return; // student hasn't answered — don't penalize
        possible++;
        if (a.writtenScore != null) earned += a.writtenScore;
      });

      // Ranking: uses partialScore (0-1 scale, already normalized)
      ranking.forEach((q) => {
        const a = answers[q.id];
        if (!a?.submitted) return;
        possible++;
        if (a.partialScore != null) earned += a.partialScore;
      });

      // Linked: follows same path as SA (uses writtenScore when graded)
      linked.forEach((q) => {
        const a = answers[q.id];
        if (!a?.submitted) return;
        possible++;
        if (a.writtenScore != null) earned += a.writtenScore;
      });

      // Sorting: uses writtenScore (0-1 normalized) if available
      sorting.forEach((q) => {
        const a = answers[q.id];
        if (!a?.submitted) return;
        possible++;
        if (a.writtenScore != null) earned += a.writtenScore;
        else if (a.score?.correct != null && a.score?.total > 0) earned += a.score.correct / a.score.total;
      });

      // Concept builder: completion-based (1 point if submitted)
      conceptBuilder.forEach((q) => {
        const a = answers[q.id];
        if (!a?.submitted) return;
        possible++;
        earned += 1; // Full credit for completion
      });

      // Scored embeds: use explicit weight if set, otherwise dynamic 50/50 split
      const nonEmbedPts = mc.length + sa.length + ranking.length + linked.length + sorting.length + conceptBuilder.length + ((completed && reflection) ? 1 : 0);
      embeds.forEach((q) => {
        const pts = q.weight != null ? q.weight : ((nonEmbedPts > 0) ? nonEmbedPts / embeds.length : 1);
        const a = answers[q.id];
        if (!a?.submitted) return; // student hasn't done it — don't penalize
        possible += pts;
        if (a.writtenScore != null) earned += a.writtenScore * pts;
      });

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
      if (EXCLUDED_ACTIVITIES.has(actId)) continue;
      const actTitle = (data.activityTitle || actId).toLowerCase();
      if (actTitle.includes('battleship') && actTitle.includes('energy')) continue;
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
      const today = new Date().toISOString().slice(0, 10);
      // Google Classroom rejects past due dates on creation — only set if future
      if (year && month && day && dueDate >= today) {
        body.dueDate = { year, month, day };
        body.dueTime = { hours: 23, minutes: 59 };
      }
    }
    const created = await gcFetch(`/courses/${classroomCourseId}/courseWork`, { method: "POST", body: JSON.stringify(body) });
    titleToCW[title] = created;
    return created.id;
  };

  // Helper: push grades for one assignment
  const pushAssignment = async (title, gradesByUid, dueDate, exemptUids) => {
    const isNew = !titleToCW[title];
    let cwId;
    try { cwId = await getOrCreate(title, dueDate); }
    catch (err) { console.error(`  Failed to get/create "${title}": ${err.message}`); stats.errors++; return; }

    const subs = await gcListAll(`/courses/${classroomCourseId}/courseWork/${cwId}/studentSubmissions`, "studentSubmissions");
    const userToSub = {};
    subs.forEach((s) => { userToSub[s.userId] = s; });

    let pushed = 0, unchanged = 0;
    const changes = []; // { name, oldGrade, newGrade }

    // Mark exempt students as excused on Google Classroom
    if (exemptUids && exemptUids.size > 0) {
      for (const uid of exemptUids) {
        const gcId = uidToGcId[uid];
        if (!gcId) continue;
        const sub = userToSub[gcId];
        if (!sub) continue;
        // Skip if already excused
        if (sub.state === "RETURNED" && sub.assignedGrade == null) continue;
        try {
          await gcFetch(`/courses/${classroomCourseId}/courseWork/${cwId}/studentSubmissions/${sub.id}?updateMask=excused`, {
            method: "PATCH", body: JSON.stringify({ excused: true }),
          });
          const studentName = uidToName[uid] || gcIdToName[gcId] || uid.slice(0, 8);
          console.log(`  ${title}: ${studentName} marked excused`);
        } catch (err) {
          // excused flag may not be supported on all assignment types — log and continue
          console.log(`  ${title}: excused failed for ${uid}: ${err.message.split("\n")[0]}`);
        }
      }
    }

    for (const [uid, grade] of Object.entries(gradesByUid)) {
      const gcId = uidToGcId[uid];
      if (!gcId) continue;
      const sub = userToSub[gcId];
      if (!sub) continue;
      const oldGrade = sub.assignedGrade;
      if (oldGrade === grade) { unchanged++; stats.gradesUnchanged++; continue; }

      // Safety: never overwrite a real grade with zero — almost always a data loading bug
      const studentName = uidToName[uid] || gcIdToName[gcId] || uid.slice(0, 8);
      if (grade === 0 && oldGrade != null && oldGrade > 0) {
        console.log(`  ⚠️  BLOCKED: ${studentName} ${oldGrade} → 0 (refusing to zero out)`);
        stats.gradesUnchanged++;
        continue;
      }

      try {
        await gcFetch(`/courses/${classroomCourseId}/courseWork/${cwId}/studentSubmissions/${sub.id}?updateMask=assignedGrade,draftGrade`, {
          method: "PATCH", body: JSON.stringify({ assignedGrade: grade, draftGrade: grade }),
        });
        pushed++;
        stats.gradesPushed++;
        changes.push({ name: studentName, oldGrade: oldGrade != null ? oldGrade : null, newGrade: grade });
      } catch (err) {
        console.error(`  Grade push failed (uid=${uid}): ${err.message}`);
        stats.errors++;
      }
    }
    console.log(`  ${title}: ${pushed} pushed, ${unchanged} unchanged`);

    // Record for email report
    if (pushed > 0) {
      if (isNew) {
        courseReport.newAssignments.push({ title, count: pushed });
      } else {
        courseReport.updatedAssignments.push({ title, changes });
      }
    }
  };

  // 7. Merge all grades by title (lesson + activity), taking highest per student
  //    This prevents duplicate titles from overwriting each other with lower scores.
  const lessonMap = {};
  lessons.forEach((l) => { lessonMap[l.id] = l; });

  // Use composite key (lessonId) to avoid title collisions (Finding #11).
  // Multiple lessons with the same title get separate Classroom assignments
  // by appending a disambiguator when duplicates are detected.
  const mergedByKey = {}; // { key: { _title, _dueDate, uid: grade } }
  const titleCounts = {}; // track title usage to detect duplicates

  // Count title occurrences first to detect collisions
  for (const [lessonId, grades] of Object.entries(lessonGrades)) {
    const lesson = lessonMap[lessonId];
    const title = lesson?.title || lessonId;
    titleCounts[title] = (titleCounts[title] || 0) + 1;
  }

  // Warn about title collisions
  for (const [title, count] of Object.entries(titleCounts)) {
    if (count > 1) {
      console.log(`  ⚠️  Title collision: "${title}" used by ${count} lessons — disambiguating with unit prefix`);
    }
  }

  const mergedExempt = {}; // { key: Set<uid> }
  const mergeFn = (key, title, gradesByUid, dueDate, exemptUids) => {
    if (!mergedByKey[key]) mergedByKey[key] = { _title: title, _dueDate: dueDate };
    const bucket = mergedByKey[key];
    if (dueDate && !bucket._dueDate) bucket._dueDate = dueDate;
    for (const [uid, grade] of Object.entries(gradesByUid)) {
      if (bucket[uid] == null || grade > bucket[uid]) bucket[uid] = grade;
    }
    if (exemptUids && exemptUids.size > 0) {
      if (!mergedExempt[key]) mergedExempt[key] = new Set();
      for (const uid of exemptUids) mergedExempt[key].add(uid);
    }
  };

  // Add lesson grades — use lessonId as key, disambiguate title if needed
  for (const [lessonId, grades] of Object.entries(lessonGrades)) {
    const lesson = lessonMap[lessonId];
    let title = lesson?.title || lessonId;
    const dueDate = lesson?.dueDate || null;
    // Disambiguate duplicate titles by prepending unit name
    if (titleCounts[title] > 1 && lesson?.unit) {
      title = `${lesson.unit}: ${title}`;
    }
    mergeFn(lessonId, title, grades, dueDate, exemptMap[lessonId]);
  }

  // Add activity grades — use actId as key
  for (const [actId, grades] of Object.entries(activityGrades)) {
    mergeFn(`activity_${actId}`, allActivities[actId], grades, null);
  }

  // 8. Push merged grades (one push per unique key)
  for (const [key, bucket] of Object.entries(mergedByKey)) {
    const title = bucket._title;
    const dueDate = bucket._dueDate;
    const grades = { ...bucket };
    delete grades._title;
    delete grades._dueDate;
    await pushAssignment(title, grades, dueDate, mergedExempt[key]);
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
  reportData.push(courseReport);
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

  // Build and send email report if any grades changed
  if (stats.gradesPushed > 0) {
    const emailBody = buildEmailReport(reportData, stats);
    console.log("\n── Email Report ──");
    console.log(emailBody);
    sendOutlookEmail("Classroom Grade Sync Report", emailBody);
  } else {
    console.log("\nNo grade changes — skipping email.");
  }
}

// ── Email report builder ────────────────────────────────────────────────────

function buildEmailReport(data, stats) {
  const lines = ["# Classroom Grade Sync Report", ""];
  const now = new Date().toLocaleString("en-US", { timeZone: "America/New_York", dateStyle: "medium", timeStyle: "short" });
  lines.push(`**${now}** — ${stats.gradesPushed} grades synced across ${stats.coursesSynced} course(s)`, "");

  for (const course of data) {
    const hasChanges = course.newAssignments.length > 0 || course.updatedAssignments.length > 0;
    if (!hasChanges) continue;

    lines.push(`## ${course.courseName}`, "");

    for (const a of course.newAssignments) {
      lines.push(`**New assignment:** ${a.title} — ${a.count} student(s) graded`, "");
    }

    for (const a of course.updatedAssignments) {
      lines.push(`**${a.title}**`);
      for (const c of a.changes) {
        if (c.oldGrade != null) {
          lines.push(`- ${c.name}: ${c.oldGrade} → ${c.newGrade}`);
        } else {
          lines.push(`- ${c.name}: new grade ${c.newGrade}`);
        }
      }
      lines.push("");
    }
  }

  if (stats.errors > 0) {
    lines.push(`**Errors:** ${stats.errors}`, "");
  }

  return lines.join("\n");
}

// ── Outlook email sender ────────────────────────────────────────────────────

function sendOutlookEmail(subject, markdownBody) {
  const sendScript = path.join(__dirname, "..", "..", "Lachlan", ".claude", "skills", "morning-coffee", "scripts", "send-outlook.sh");
  if (!fs.existsSync(sendScript)) {
    console.log("Send script not found, skipping email delivery.");
    return;
  }
  // Write content to temp file to avoid shell escaping issues
  const tmpFile = path.join(require("os").tmpdir(), `grade-sync-email-${Date.now()}.md`);
  try {
    fs.writeFileSync(tmpFile, `${subject}\n\n${markdownBody}`, "utf8");
    execSync(`bash "${sendScript}" "${tmpFile}"`, {
      stdio: ["pipe", "pipe", "pipe"],
      timeout: 30000,
    });
    console.log("Email sent via Outlook.");
  } catch (err) {
    console.log(`Email delivery skipped: ${err.message.split("\n")[0]}`);
  } finally {
    try { fs.unlinkSync(tmpFile); } catch { /* ignore */ }
  }
}

main().then(() => process.exit(0)).catch((err) => { console.error(`Fatal: ${err.message}`); process.exit(1); });
