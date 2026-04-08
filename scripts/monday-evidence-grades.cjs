// scripts/monday-evidence-grades.cjs
// Monday 8:00 AM — Grade last week's evidence logs + create this week's Classroom assignment.
//
// Rubric (based on days with assignments due that were NOT logged):
//   0-1 days missed → 100% Refining
//   2 days missed   → 85%  Developing
//   3 days missed   → 65%  Approaching
//   4 days missed   → 55%  Emerging
//   5 days missed   → 0%   Missing
//
// Days without a lesson due in PantherLearn are omitted (snow days, breaks, etc.)
//
// Usage: node scripts/monday-evidence-grades.cjs [--dry-run] [--week 2026-W12]

const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");
const { execSync } = require("child_process");

// ── Week helpers (duplicated from weekHelpers.js for CJS) ────────────────────

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday"];

function getISOWeekKey(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const yearStart = new Date(d.getFullYear(), 0, 4);
  const weekNum = 1 + Math.round(
    ((d - yearStart) / 86400000 - 3 + ((yearStart.getDay() + 6) % 7)) / 7
  );
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}

function getWeekMonday(weekKey) {
  const [yearStr, wStr] = weekKey.split("-W");
  const year = parseInt(yearStr, 10);
  const week = parseInt(wStr, 10);
  const jan4 = new Date(year, 0, 4);
  const dayOfWeek = (jan4.getDay() + 6) % 7;
  const monday = new Date(jan4);
  monday.setDate(jan4.getDate() - dayOfWeek + (week - 1) * 7);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function getWeekDates(weekKey) {
  const monday = getWeekMonday(weekKey);
  return DAYS.map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().slice(0, 10); // "2026-03-16"
  });
}

function dayHasPhotos(dayData) {
  if (!dayData) return false;
  if (Array.isArray(dayData.images) && dayData.images.length > 0) return true;
  if (dayData.image) return true;
  return false;
}

function formatDateShort(d) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ── Rubric ───────────────────────────────────────────────────────────────────

function gradeFromMissedDays(missed, totalRequired) {
  if (totalRequired === 0) return { score: 1.0, label: "Refining" }; // no days required = auto pass
  const ratio = missed / totalRequired;
  // Scale the rubric proportionally when fewer than 5 days are required
  if (totalRequired >= 5) {
    if (missed <= 1) return { score: 1.0, label: "Refining" };
    if (missed === 2) return { score: 0.85, label: "Developing" };
    if (missed === 3) return { score: 0.65, label: "Approaching" };
    if (missed === 4) return { score: 0.55, label: "Emerging" };
    return { score: 0, label: "Missing" };
  }
  // For weeks with fewer required days (e.g., 3-day week), scale proportionally
  if (ratio <= 0.2) return { score: 1.0, label: "Refining" };
  if (ratio <= 0.4) return { score: 0.85, label: "Developing" };
  if (ratio <= 0.6) return { score: 0.65, label: "Approaching" };
  if (ratio <= 0.8) return { score: 0.55, label: "Emerging" };
  return { score: 0, label: "Missing" };
}

// ── Classroom helpers (same pattern as classroom-sync.cjs) ───────────────────

const TOKEN_PATH = path.join(__dirname, "..", ".classroom-token.json");
const GC_API = "https://classroom.googleapis.com/v1";
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
      ? `${urlPath}${sep}pageSize=30&pageToken=${pageToken}`
      : `${urlPath}${sep}pageSize=30`;
    const data = await gcFetch(url);
    if (data[listKey]) results.push(...data[listKey]);
    pageToken = data.nextPageToken || null;
  } while (pageToken);
  return results;
}

// ── Args ─────────────────────────────────────────────────────────────────────

function parseArgs() {
  const args = { dryRun: false, weekKey: null };
  for (let i = 2; i < process.argv.length; i++) {
    if (process.argv[i] === "--dry-run") args.dryRun = true;
    if (process.argv[i] === "--week" && process.argv[i + 1]) args.weekKey = process.argv[++i];
  }
  return args;
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs();
  const today = new Date();

  // Grade LAST week, create assignment for THIS week
  const lastWeekKey = args.weekKey || getISOWeekKey(new Date(today.getTime() - 7 * 86400000));
  const thisWeekKey = getISOWeekKey(today);
  const lastWeekDates = getWeekDates(lastWeekKey);
  const thisWeekMonday = getWeekMonday(thisWeekKey);
  const thisWeekFriday = new Date(thisWeekMonday);
  thisWeekFriday.setDate(thisWeekMonday.getDate() + 4);

  const lastWeekLabel = `Week of ${formatDateShort(getWeekMonday(lastWeekKey))}`;
  const thisWeekLabel = `Week of ${formatDateShort(thisWeekMonday)}`;

  console.log(`Evidence Log Grading — Monday Pipeline`);
  console.log(`  Grading: ${lastWeekKey} (${lastWeekLabel})`);
  console.log(`  Creating assignment: ${thisWeekKey} (${thisWeekLabel})`);
  if (args.dryRun) console.log("  ** DRY RUN — no writes **\n");
  else console.log("");

  // Firebase
  if (!admin.apps.length) {
    const saPath = path.join(__dirname, "..", "serviceAccountKey.json");
    if (fs.existsSync(saPath)) {
      admin.initializeApp({ credential: admin.credential.cert(require(saPath)) });
    } else {
      admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
    }
  }
  const db = admin.firestore();

  // Classroom auth
  let classroomEnabled = false;
  try {
    if (fs.existsSync(TOKEN_PATH)) {
      accessToken = await getAccessToken();
      classroomEnabled = true;
      console.log("Classroom API: connected");
    }
  } catch (err) {
    console.log(`Classroom API: skipped (${err.message})`);
  }

  // Load all courses
  const coursesSnap = await db.collection("courses").get();
  const allCourses = coursesSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  // Find section courses (the ones students are enrolled in)
  const sectionCourses = allCourses.filter((c) => c.migratedFrom || c.enrollCode);

  const stats = { coursesProcessed: 0, studentsGraded: 0, assignmentsCreated: 0, errors: 0 };
  const reportLines = [];

  for (const course of sectionCourses) {
    const courseId = course.id;
    const parentCourseId = course.migratedFrom || courseId;
    console.log(`\n── ${course.title || courseId} ──`);

    // 1. Find which days last week had a lesson due in this course
    const lessonSnap = await db.collection("courses").doc(courseId).collection("lessons").get();
    const lessons = lessonSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

    // Also check parent course lessons (content may live there)
    let parentLessons = [];
    if (parentCourseId !== courseId) {
      const parentLessonSnap = await db.collection("courses").doc(parentCourseId).collection("lessons").get();
      parentLessons = parentLessonSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    }
    const allLessons = [...lessons, ...parentLessons];

    // Build set of dates that had a visible lesson due
    const dueDates = new Set();
    for (const l of allLessons) {
      if (l.visible === false) continue;
      if (l.dueDate && lastWeekDates.includes(l.dueDate)) {
        dueDates.add(l.dueDate);
      }
    }

    // Map dates to day names for evidence lookup
    const requiredDays = [];
    lastWeekDates.forEach((dateStr, i) => {
      if (dueDates.has(dateStr)) requiredDays.push(DAYS[i]);
    });

    console.log(`  Required days (had assignments): ${requiredDays.length}/5 — ${requiredDays.join(", ") || "none"}`);

    if (requiredDays.length === 0) {
      console.log("  No assignments due last week — skipping evidence grading");
      reportLines.push(`**${course.title}**: No assignments due — evidence grading skipped`);
      continue;
    }

    // 2. Get enrolled students
    const enrollSnap = await db.collection("enrollments").where("courseId", "==", courseId).get();
    const enrollments = enrollSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const studentUids = enrollments.map((e) => e.uid || e.studentUid).filter(Boolean);

    if (studentUids.length === 0) {
      console.log("  No students enrolled — skipping");
      continue;
    }

    console.log(`  Students: ${studentUids.length}`);

    // 3. For each student, check evidence and compute grade
    const courseGrades = {}; // { uid: grade (0-100) }
    let graded = 0;
    const breakdown = { Refining: 0, Developing: 0, Approaching: 0, Emerging: 0, Missing: 0 };

    for (const uid of studentUids) {
      // Load evidence doc for last week
      let weekData = null;
      try {
        const evDoc = await db.doc(`evidence/${uid}/courses/${courseId}/weeks/${lastWeekKey}`).get();
        if (evDoc.exists()) weekData = evDoc.data();
      } catch { /* no evidence */ }

      // Also check parent course evidence (in case student logged under parent ID)
      if (!weekData && parentCourseId !== courseId) {
        try {
          const evDoc = await db.doc(`evidence/${uid}/courses/${parentCourseId}/weeks/${lastWeekKey}`).get();
          if (evDoc.exists()) weekData = evDoc.data();
        } catch { /* no evidence */ }
      }

      // Count missed days (only among required days)
      let missed = 0;
      for (const day of requiredDays) {
        if (!dayHasPhotos(weekData?.[day])) missed++;
      }

      const { score, label } = gradeFromMissedDays(missed, requiredDays.length);
      const grade100 = Math.round(score * 100);
      courseGrades[uid] = grade100;
      breakdown[label]++;

      // Write grade to Firestore
      const activityId = `weekly-evidence-${lastWeekKey}`;
      const gradeData = {
        activityScore: score,
        activityLabel: label,
        activityTitle: `Evidence Log — ${lastWeekLabel}`,
        activityType: "weekly-evidence",
        weekKey: lastWeekKey,
        gradedAt: admin.firestore.FieldValue.serverTimestamp(),
        gradedBy: "evidence-auto",
        requiredDays,
        daysLogged: requiredDays.length - missed,
        daysMissed: missed,
      };

      if (!args.dryRun) {
        await db.doc(`progress/${uid}/courses/${courseId}/activities/${activityId}`).set(gradeData, { merge: true });
      }
      graded++;
    }

    console.log(`  Graded: ${graded} students`);
    console.log(`  Distribution: ${Object.entries(breakdown).filter(([,n]) => n > 0).map(([l,n]) => `${l}: ${n}`).join(", ")}`);

    stats.coursesProcessed++;
    stats.studentsGraded += graded;

    reportLines.push(`**${course.title}** (${lastWeekLabel}): ${graded} students graded — ${Object.entries(breakdown).filter(([,n]) => n > 0).map(([l,n]) => `${l}: ${n}`).join(", ")}`);

    // 4. Create this week's Classroom assignment
    if (classroomEnabled) {
      // Find Classroom mapping
      const mappingSnap = await db.collection("classroomSync").where("courseId", "==", courseId).get();
      let classroomCourseId = null;
      mappingSnap.docs.forEach((d) => {
        if (d.data().classroomCourseId) classroomCourseId = d.data().classroomCourseId;
      });

      if (classroomCourseId) {
        const assignmentTitle = `Evidence Log — ${thisWeekLabel}`;
        const dueDate = thisWeekFriday.toISOString().slice(0, 10);

        try {
          // Check if assignment already exists
          const existingCW = await gcListAll(`/courses/${classroomCourseId}/courseWork`, "courseWork");
          const existing = existingCW.find((cw) => cw.title === assignmentTitle);

          if (existing) {
            console.log(`  Classroom: "${assignmentTitle}" already exists — skipping`);
          } else if (!args.dryRun) {
            const [year, month, day] = dueDate.split("-").map(Number);
            await gcFetch(`/courses/${classroomCourseId}/courseWork`, {
              method: "POST",
              body: JSON.stringify({
                title: assignmentTitle,
                description: "Upload daily photos of your work and a brief reflection for each day this week. Due Friday.",
                workType: "ASSIGNMENT",
                state: "PUBLISHED",
                maxPoints: 100,
                dueDate: { year, month, day },
                dueTime: { hours: 23, minutes: 59 },
              }),
            });
            console.log(`  Classroom: Created "${assignmentTitle}" (due ${dueDate})`);
            stats.assignmentsCreated++;
          } else {
            console.log(`  Classroom: Would create "${assignmentTitle}" (due ${dueDate}) [dry run]`);
          }

          // Push LAST week's grades to Classroom
          if (Object.keys(courseGrades).length > 0) {
            const lastWeekTitle = `Evidence Log — ${lastWeekLabel}`;
            const lastWeekExisting = existingCW.find((cw) => cw.title === lastWeekTitle);

            let cwId;
            if (lastWeekExisting) {
              cwId = lastWeekExisting.id;
            } else if (!args.dryRun) {
              // Create the assignment for last week too (without future due date)
              const created = await gcFetch(`/courses/${classroomCourseId}/courseWork`, {
                method: "POST",
                body: JSON.stringify({
                  title: lastWeekTitle,
                  workType: "ASSIGNMENT",
                  state: "PUBLISHED",
                  maxPoints: 100,
                }),
              });
              cwId = created.id;
              console.log(`  Classroom: Created "${lastWeekTitle}" for grade push`);
            }

            if (cwId && !args.dryRun) {
              // Match students to Classroom
              const gcStudents = await gcListAll(`/courses/${classroomCourseId}/students`, "students");
              const nameToGcId = {};
              const emailToGcId = {};
              gcStudents.forEach((s) => {
                const name = s.profile?.name?.fullName;
                const email = s.profile?.emailAddress;
                if (name) nameToGcId[name.trim().toLowerCase()] = s.userId;
                if (email) emailToGcId[email.toLowerCase()] = s.userId;
              });

              const uidToGcId = {};
              for (const e of enrollments) {
                const uid = e.uid || e.studentUid;
                if (!uid) continue;
                const email = e.email?.toLowerCase();
                const name = (e.displayName || e.name || "").trim().toLowerCase();
                if (email && emailToGcId[email]) uidToGcId[uid] = emailToGcId[email];
                else if (name && nameToGcId[name]) uidToGcId[uid] = nameToGcId[name];
              }

              const subs = await gcListAll(`/courses/${classroomCourseId}/courseWork/${cwId}/studentSubmissions`, "studentSubmissions");
              const userToSub = {};
              subs.forEach((s) => { userToSub[s.userId] = s; });

              let pushed = 0;
              for (const [uid, grade] of Object.entries(courseGrades)) {
                const gcId = uidToGcId[uid];
                if (!gcId) continue;
                const sub = userToSub[gcId];
                if (!sub) continue;
                if (sub.assignedGrade === grade) continue;

                try {
                  await gcFetch(`/courses/${classroomCourseId}/courseWork/${cwId}/studentSubmissions/${sub.id}?updateMask=assignedGrade,draftGrade`, {
                    method: "PATCH",
                    body: JSON.stringify({ assignedGrade: grade, draftGrade: grade }),
                  });
                  pushed++;
                } catch (err) {
                  console.error(`  Grade push failed (uid=${uid}): ${err.message}`);
                  stats.errors++;
                }
              }
              console.log(`  Classroom: ${pushed} grades pushed for "${lastWeekTitle}"`);
            }
          }
        } catch (err) {
          console.error(`  Classroom error: ${err.message}`);
          stats.errors++;
        }
      } else {
        console.log("  No Classroom mapping found — skipping assignment creation");
      }
    }
  }

  // Summary
  console.log("\n── Summary ──");
  console.log(`  Courses: ${stats.coursesProcessed}`);
  console.log(`  Students graded: ${stats.studentsGraded}`);
  console.log(`  Classroom assignments created: ${stats.assignmentsCreated}`);
  if (stats.errors) console.log(`  Errors: ${stats.errors}`);
  if (args.dryRun) console.log("  (DRY RUN — no changes written)");

  // Send email report
  if (stats.studentsGraded > 0 && !args.dryRun) {
    const emailBody = [
      "# Evidence Log — Weekly Grade Report",
      "",
      `**${new Date().toLocaleDateString("en-US", { timeZone: "America/New_York", dateStyle: "full" })}**`,
      `Grading: ${lastWeekKey} (${lastWeekLabel})`,
      "",
      ...reportLines,
      "",
      stats.assignmentsCreated > 0 ? `**${stats.assignmentsCreated} new Classroom assignment(s) created for ${thisWeekLabel}**` : "",
      stats.errors > 0 ? `**Errors: ${stats.errors}**` : "",
    ].filter(Boolean).join("\n");

    console.log("\n── Email Report ──");
    console.log(emailBody);

    const sendScript = path.join(__dirname, "..", "..", "Lachlan", ".claude", "skills", "morning-coffee", "scripts", "send-outlook.sh");
    if (fs.existsSync(sendScript)) {
      const tmpFile = path.join(require("os").tmpdir(), `evidence-grade-${Date.now()}.md`);
      try {
        fs.writeFileSync(tmpFile, `Evidence Log Grades — ${lastWeekLabel}\n\n${emailBody}`, "utf8");
        execSync(`bash "${sendScript}" "${tmpFile}"`, { stdio: ["pipe", "pipe", "pipe"], timeout: 30000 });
        console.log("Email sent via Outlook.");
      } catch (err) {
        console.log(`Email delivery skipped: ${err.message.split("\n")[0]}`);
      } finally {
        try { fs.unlinkSync(tmpFile); } catch { /* ignore */ }
      }
    }
  }
}

main().then(() => process.exit(0)).catch((err) => { console.error(`Fatal: ${err.message}`); process.exit(1); });
