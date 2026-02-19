// migrate-sections-to-courses.js
//
// One-time migration: splits a multi-section course into independent per-section courses.
//
// What it does:
// 1. Reads the source course and its sections map
// 2. For each section with students, creates a new course (copies lessons + settings)
// 3. Identifies which students belong to each section from enrollment docs
// 4. Copies per-student data: progress, gamification, grades, reflections, chat logs
// 5. Creates new enrollment docs pointing to the new course
// 6. Updates each student's enrolledCourses map in their user doc
//
// Usage:
//   DRY_RUN=true node scripts/migrate-sections-to-courses.js    # Preview only
//   node scripts/migrate-sections-to-courses.js                   # Execute for real
//
// Requires: firebase-admin (uses Functions/node_modules)

import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(resolve(__dirname, "../Functions/") + "/");
const admin = require("firebase-admin");

// ─── Configuration ───
const SOURCE_COURSE_ID = "ai-literacy";
const DRY_RUN = process.env.DRY_RUN === "true";
const PROJECT_ID = "pantherlearn-d6f7c";

// Initialize Admin SDK (bypasses security rules)
admin.initializeApp({ projectId: PROJECT_ID });
const db = admin.firestore();

// Helper: generate a short enrollment code
function generateCode(prefix) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return `${prefix}-${code}`;
}

async function main() {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`  Migration: Split "${SOURCE_COURSE_ID}" into per-section courses`);
  console.log(`  Mode: ${DRY_RUN ? "🔍 DRY RUN (no writes)" : "🚀 LIVE EXECUTION"}`);
  console.log(`${"=".repeat(60)}\n`);

  // ─── Step 1: Read source course ───
  console.log("Step 1: Reading source course...");
  const courseDoc = await db.doc(`courses/${SOURCE_COURSE_ID}`).get();
  if (!courseDoc.exists) {
    console.error(`❌ Course "${SOURCE_COURSE_ID}" not found!`);
    process.exit(1);
  }
  const courseData = courseDoc.data();
  const sections = courseData.sections || {};
  const sectionIds = Object.keys(sections);

  if (sectionIds.length === 0) {
    console.error("❌ No sections found on this course!");
    process.exit(1);
  }

  console.log(`  Course: "${courseData.title}" (${courseData.icon || "📚"})`);
  console.log(`  Sections found: ${sectionIds.length}`);
  sectionIds.forEach((sid) => {
    console.log(`    - ${sid}: "${sections[sid].name}" (code: ${sections[sid].enrollCode})`);
  });

  // ─── Step 2: Read all enrollments for this course ───
  console.log("\nStep 2: Reading enrollments...");
  const enrollSnap = await db.collection("enrollments").where("courseId", "==", SOURCE_COURSE_ID).get();
  const enrollments = [];
  enrollSnap.forEach((d) => enrollments.push({ docId: d.id, ...d.data() }));
  console.log(`  Total enrollments: ${enrollments.length}`);

  // Group students by section
  const studentsBySection = {};
  const unassigned = [];
  for (const sid of sectionIds) {
    studentsBySection[sid] = [];
  }

  for (const e of enrollments) {
    let matched = false;

    // Try sectionId first
    if (e.sectionId && studentsBySection[e.sectionId]) {
      studentsBySection[e.sectionId].push(e);
      matched = true;
    }

    // Try section name match
    if (!matched && e.section) {
      const matchedSid = sectionIds.find((s) => sections[s].name === e.section);
      if (matchedSid) {
        studentsBySection[matchedSid].push(e);
        matched = true;
      }
    }

    // Try enrollCode match
    if (!matched && e.enrollCode) {
      const matchedSid = sectionIds.find((s) => sections[s].enrollCode === e.enrollCode);
      if (matchedSid) {
        studentsBySection[matchedSid].push(e);
        matched = true;
      }
    }

    if (!matched) {
      unassigned.push(e);
    }
  }

  console.log("\n  Students per section:");
  for (const sid of sectionIds) {
    console.log(`    ${sections[sid].name}: ${studentsBySection[sid].length} students`);
    studentsBySection[sid].forEach((s) => {
      console.log(`      - ${s.email || s.name || s.uid || s.docId}`);
    });
  }
  if (unassigned.length > 0) {
    console.log(`\n  ⚠️  Unassigned students (no section match): ${unassigned.length}`);
    unassigned.forEach((s) => {
      console.log(`      - ${s.email || s.name || s.uid} (sectionId=${s.sectionId}, section=${s.section}, code=${s.enrollCode})`);
    });
  }

  // ─── Step 3: Read lessons from source course ───
  console.log("\nStep 3: Reading source lessons...");
  const lessonsSnap = await db.collection(`courses/${SOURCE_COURSE_ID}/lessons`).orderBy("order", "asc").get();
  const lessons = [];
  lessonsSnap.forEach((d) => lessons.push({ id: d.id, ...d.data() }));
  console.log(`  Lessons: ${lessons.length}`);

  // ─── Step 4: Read settings from source course ───
  console.log("Step 4: Reading source settings...");
  const settingsSnap = await db.collection(`courses/${SOURCE_COURSE_ID}/settings`).get();
  const settings = [];
  settingsSnap.forEach((d) => settings.push({ id: d.id, data: d.data() }));
  console.log(`  Settings docs: ${settings.length}`);

  // ─── Step 5: Create new courses and migrate data per section ───
  const newCourseMap = {}; // sectionId -> newCourseId

  for (const sectionId of sectionIds) {
    const section = sections[sectionId];
    const students = studentsBySection[sectionId];
    const sectionName = section.name || sectionId;

    console.log(`\n${"─".repeat(50)}`);
    console.log(`Creating course for: ${sectionName} (${students.length} students)`);
    console.log(`${"─".repeat(50)}`);

    if (students.length === 0) {
      console.log("  ⏭️  Skipping — no students in this section");
      continue;
    }

    // 5a: Create new course document
    const newCourseTitle = `${courseData.title} — ${sectionName}`;
    const newEnrollCode = generateCode("AILT");

    let newCourseId;
    if (DRY_RUN) {
      newCourseId = `dry-run-${sectionId}`;
      console.log(`  [DRY] Would create course: "${newCourseTitle}" with code ${newEnrollCode}`);
    } else {
      const ref = await db.collection("courses").add({
        title: newCourseTitle,
        description: courseData.description || "",
        icon: courseData.icon || "🤖",
        order: courseData.order || 0,
        ownerUid: courseData.ownerUid || null,
        ownerEmail: courseData.ownerEmail || null,
        enrollCode: newEnrollCode,
        migratedFrom: SOURCE_COURSE_ID,
        migratedSection: sectionId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      newCourseId = ref.id;
      console.log(`  ✅ Created course: "${newCourseTitle}" → ${newCourseId} (code: ${newEnrollCode})`);
    }
    newCourseMap[sectionId] = newCourseId;

    // 5b: Copy lessons (with per-section due date resolution)
    console.log(`  Copying ${lessons.length} lessons...`);
    for (const lesson of lessons) {
      const lessonData = { ...lesson };
      delete lessonData.id;

      // Resolve per-section due date: use section override if exists
      if (lessonData.dueDates && lessonData.dueDates[sectionId]) {
        lessonData.dueDate = lessonData.dueDates[sectionId];
      }
      // Remove the old dueDates map
      delete lessonData.dueDates;

      if (!DRY_RUN) {
        await db.doc(`courses/${newCourseId}/lessons/${lesson.id}`).set(lessonData);
      }
    }
    console.log(`  ✅ Copied ${lessons.length} lessons`);

    // 5c: Copy settings
    if (settings.length > 0) {
      console.log(`  Copying ${settings.length} settings docs...`);
      for (const setting of settings) {
        if (!DRY_RUN) {
          await db.doc(`courses/${newCourseId}/settings/${setting.id}`).set(setting.data);
        }
      }
      console.log(`  ✅ Copied settings`);
    }

    // 5d: Per-student data migration
    const studentUids = students.map((s) => s.uid || s.studentUid).filter(Boolean);
    console.log(`  Migrating data for ${studentUids.length} students with UIDs...`);

    for (const uid of studentUids) {
      // i. Progress data: progress/{uid}/courses/{courseId}/lessons/*
      let progressCount = 0;
      try {
        const progressSnap = await db.collection(`progress/${uid}/courses/${SOURCE_COURSE_ID}/lessons`).get();
        for (const pDoc of progressSnap.docs) {
          if (!DRY_RUN) {
            await db.doc(`progress/${uid}/courses/${newCourseId}/lessons/${pDoc.id}`).set(pDoc.data());
          }
          progressCount++;
        }
      } catch (e) { /* no progress data */ }

      // ii. Gamification: courses/{courseId}/gamification/{uid}
      let gamCopied = false;
      try {
        const gamDoc = await db.doc(`courses/${SOURCE_COURSE_ID}/gamification/${uid}`).get();
        if (gamDoc.exists) {
          if (!DRY_RUN) {
            await db.doc(`courses/${newCourseId}/gamification/${uid}`).set(gamDoc.data());
          }
          gamCopied = true;
        }
      } catch (e) { /* no gam data */ }

      console.log(`    ${uid.slice(0, 12)}... → progress: ${progressCount} lessons, gam: ${gamCopied ? "✓" : "—"}`);
    }

    // 5e: Copy reflections (filter by student UIDs in this section)
    let reflCount = 0;
    try {
      const reflSnap = await db.collection(`courses/${SOURCE_COURSE_ID}/reflections`).get();
      for (const rDoc of reflSnap.docs) {
        const data = rDoc.data();
        if (studentUids.includes(data.studentId)) {
          if (!DRY_RUN) {
            await db.doc(`courses/${newCourseId}/reflections/${rDoc.id}`).set(data);
          }
          reflCount++;
        }
      }
    } catch (e) { /* no reflections */ }
    if (reflCount > 0) console.log(`  ✅ Copied ${reflCount} reflections`);

    // 5f: Copy grades (filter by student UIDs)
    let gradeCount = 0;
    try {
      const gradesSnap = await db.collection(`courses/${SOURCE_COURSE_ID}/grades`).get();
      for (const gDoc of gradesSnap.docs) {
        const data = gDoc.data();
        if (studentUids.includes(data.studentId)) {
          if (!DRY_RUN) {
            await db.doc(`courses/${newCourseId}/grades/${gDoc.id}`).set(data);
          }
          gradeCount++;
        }
      }
    } catch (e) { /* no grades */ }
    if (gradeCount > 0) console.log(`  ✅ Copied ${gradeCount} grades`);

    // 5g: Copy chat logs: courses/{courseId}/chatLogs/{lessonId}/{blockId}/{studentId}
    let chatCount = 0;
    for (const lesson of lessons) {
      const chatBlocks = (lesson.blocks || []).filter((b) => b.type === "chatbot");
      for (const block of chatBlocks) {
        try {
          const chatSnap = await db.collection(`courses/${SOURCE_COURSE_ID}/chatLogs/${lesson.id}/${block.id}`).get();
          for (const cDoc of chatSnap.docs) {
            if (studentUids.includes(cDoc.id)) {
              if (!DRY_RUN) {
                await db.doc(`courses/${newCourseId}/chatLogs/${lesson.id}/${block.id}/${cDoc.id}`).set(cDoc.data());
              }
              chatCount++;
            }
          }
        } catch (e) { /* no chat logs for this block */ }
      }
    }
    if (chatCount > 0) console.log(`  ✅ Copied ${chatCount} chat logs`);

    // 5h: Create enrollment docs for new course
    console.log(`  Creating ${students.length} enrollment docs...`);
    for (const student of students) {
      const email = (student.email || "").toLowerCase();
      const emailClean = email.replace(/[^a-z0-9]/g, "_");
      const newDocId = `${newCourseId}_${emailClean}`;
      const uid = student.uid || student.studentUid;

      if (!DRY_RUN) {
        await db.doc(`enrollments/${newDocId}`).set({
          courseId: newCourseId,
          email: student.email || "",
          name: student.name || email.split("@")[0],
          firstName: student.firstName || "",
          lastName: student.lastName || "",
          uid: uid || null,
          studentUid: uid || null,
          enrolledAt: admin.firestore.FieldValue.serverTimestamp(),
          migratedFrom: SOURCE_COURSE_ID,
        });
      }
    }
    console.log(`  ✅ Created ${students.length} enrollments`);

    // 5i: Update enrolledCourses on user docs
    console.log(`  Updating enrolledCourses on user docs...`);
    let userUpdateCount = 0;
    for (const uid of studentUids) {
      if (!DRY_RUN) {
        try {
          await db.doc(`users/${uid}`).set(
            { enrolledCourses: { [newCourseId]: true } },
            { merge: true }
          );
          userUpdateCount++;
        } catch (e) {
          console.warn(`    ⚠️  Could not update user ${uid}: ${e.message}`);
        }
      } else {
        userUpdateCount++;
      }
    }
    console.log(`  ✅ Updated ${userUpdateCount} user docs`);
  }

  // ─── Summary ───
  console.log(`\n${"=".repeat(60)}`);
  console.log("  MIGRATION SUMMARY");
  console.log(`${"=".repeat(60)}`);
  console.log(`  Source course: ${SOURCE_COURSE_ID} ("${courseData.title}")`);
  console.log(`  Sections processed: ${Object.keys(newCourseMap).length}`);
  for (const [sid, newId] of Object.entries(newCourseMap)) {
    const count = studentsBySection[sid].length;
    console.log(`    ${sections[sid].name} → ${newId} (${count} students)`);
  }
  if (unassigned.length > 0) {
    console.log(`\n  ⚠️  ${unassigned.length} students had no section assignment and were NOT migrated.`);
    console.log("  These students will remain enrolled in the original course.");
  }

  if (DRY_RUN) {
    console.log(`\n  🔍 DRY RUN — no changes were made.`);
    console.log(`  Run without DRY_RUN=true to execute for real.\n`);
  } else {
    console.log(`\n  🚀 Migration complete!`);
    console.log(`  Note: The original course "${SOURCE_COURSE_ID}" was NOT deleted.`);
    console.log(`  You can delete it manually after verifying the migration.\n`);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error("\n❌ Migration failed:", err);
  process.exit(1);
});
