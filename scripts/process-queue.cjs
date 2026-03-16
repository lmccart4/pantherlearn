/**
 * Mack's Assignment Queue Processor
 *
 * Processes the assignmentQueue collection:
 * 1. Finds all "approved" items → seeds them to Firestore → marks "seeded"
 * 2. Finds all "seeded" items → posts to Google Classroom → marks "posted"
 *
 * Guardrails:
 * - Checks if lesson already exists before seeding (idempotent by title)
 * - Seeds to ALL sections for multi-section courses
 * - Logs every action to statusHistory
 * - Never overwrites existing lessons
 * - Never deletes anything
 *
 * Usage:
 *   node scripts/process-queue.cjs                  # Process all ready items
 *   node scripts/process-queue.cjs --dry-run        # Preview only
 *   node scripts/process-queue.cjs --status          # Show queue status
 */

const admin = require("firebase-admin");
const { execSync } = require("child_process");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

const dryRun = process.argv.includes("--dry-run");
const statusOnly = process.argv.includes("--status");

// Course → section mapping
const COURSE_SECTIONS = {
  "ai-literacy": [
    { courseId: "Y9Gdhw5MTY8wMFt6Tlvj", label: "P4" },
    { courseId: "DacjJ93vUDcwqc260OP3", label: "P5" },
    { courseId: "M2MVSXrKuVCD9JQfZZyp", label: "P7" },
    { courseId: "fUw67wFhAtobWFhjwvZ5", label: "P9" },
  ],
  "physics": [{ courseId: "physics", label: "Physics" }],
  "digital-literacy": [{ courseId: "digital-literacy", label: "Digital Literacy" }],
};

// Google Classroom course IDs for posting assignments
const CLASSROOM_IDS = {
  "Y9Gdhw5MTY8wMFt6Tlvj": "839169797174",  // AI Lit P4
  "DacjJ93vUDcwqc260OP3": "839168450089",  // AI Lit P5
  "M2MVSXrKuVCD9JQfZZyp": "839170474992",  // AI Lit P7
  "fUw67wFhAtobWFhjwvZ5": "839169932383",  // AI Lit P9
  "digital-literacy": "795674326979",
  "physics": "795674299830",
};

async function updateStatus(docRef, newStatus, agent) {
  if (dryRun) return;
  await docRef.update({
    status: newStatus,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    statusHistory: admin.firestore.FieldValue.arrayUnion({
      status: newStatus,
      at: new Date().toISOString(),
      by: agent,
    }),
  });
}

async function checkLessonExists(courseId, title) {
  const snap = await db.collection(`courses/${courseId}/lessons`)
    .where("title", "==", title)
    .limit(1)
    .get();
  return !snap.empty ? snap.docs[0] : null;
}

async function seedLesson(queueItem, docRef) {
  const { title, course, seedScript } = queueItem;
  const sections = COURSE_SECTIONS[course];

  if (!sections) {
    console.log(`  ⚠️  Unknown course: ${course}`);
    return false;
  }

  if (!seedScript) {
    console.log(`  ⚠️  No seed script specified for "${title}"`);
    return false;
  }

  // Check if lesson already exists in first section
  const existing = await checkLessonExists(sections[0].courseId, title);
  if (existing) {
    console.log(`  ⏭️  "${title}" already exists in ${sections[0].label} (${existing.id}) — marking as seeded`);
    // Update sections tracking
    if (!dryRun) {
      const sectionUpdates = {};
      for (const sec of sections) {
        const secDoc = await checkLessonExists(sec.courseId, title);
        if (secDoc) {
          sectionUpdates[`sections.${sec.courseId}`] = { seeded: true, lessonDocId: secDoc.id };
        }
      }
      await docRef.update(sectionUpdates);
    }
    await updateStatus(docRef, "seeded", "mack");
    return true;
  }

  // Run the seed script
  const scriptPath = `/Users/lukemccarthy/pantherlearn/${seedScript}`;
  console.log(`  🌱 Running: node ${scriptPath}`);

  if (!dryRun) {
    try {
      const output = execSync(`node "${scriptPath}"`, {
        cwd: "/Users/lukemccarthy/pantherlearn",
        timeout: 60000,
        encoding: "utf-8",
      });
      console.log(`  ${output.trim()}`);
    } catch (e) {
      console.log(`  ❌ Seed script failed: ${e.message}`);
      return false;
    }

    // Verify seeding worked — check all sections
    const sectionUpdates = {};
    for (const sec of sections) {
      const doc = await checkLessonExists(sec.courseId, title);
      if (doc) {
        sectionUpdates[`sections.${sec.courseId}`] = { seeded: true, lessonDocId: doc.id };
        console.log(`  ✅ ${sec.label}: seeded as ${doc.id}`);
      } else {
        console.log(`  ⚠️  ${sec.label}: NOT found after seeding`);
      }
    }
    await docRef.update(sectionUpdates);
  }

  await updateStatus(docRef, "seeded", "mack");
  return true;
}

async function postToClassroom(queueItem, docRef) {
  const { title, course, dueDate } = queueItem;
  const sections = COURSE_SECTIONS[course];

  if (!sections) {
    console.log(`  ⚠️  Unknown course: ${course}`);
    return false;
  }

  // Guard: only post if the lesson is visible in Firestore
  const lessonDoc = await checkLessonExists(sections[0].courseId, title);
  if (lessonDoc) {
    const lessonData = lessonDoc.data();
    if (lessonData.visible === false) {
      console.log(`  ⏸️  "${title}" is not visible in PantherLearn — skipping Classroom post`);
      console.log(`     Set visible: true in the Lesson Editor first, then re-run the queue.`);
      return false;
    }
  }

  for (const sec of sections) {
    const classroomId = CLASSROOM_IDS[sec.courseId];
    if (!classroomId) {
      console.log(`  ⚠️  No Classroom ID for ${sec.label}`);
      continue;
    }

    // Check if assignment already exists in Classroom (idempotent by title)
    console.log(`  📋 ${sec.label}: Checking Classroom for existing assignment...`);

    if (!dryRun) {
      try {
        const listOutput = execSync(
          `gws classroom courses courseWork list --params '{"courseId": "${classroomId}"}' --format json 2>/dev/null`,
          { encoding: "utf-8", timeout: 30000 }
        );
        const assignments = JSON.parse(listOutput);
        const existing = (assignments.courseWork || []).find((a) => a.title === title);
        if (existing) {
          console.log(`  ⏭️  "${title}" already exists in ${sec.label} Classroom (${existing.id})`);
          continue;
        }
      } catch (e) {
        // If list fails, proceed with create (will fail if duplicate)
        console.log(`  ⚠️  Could not check existing assignments: ${e.message}`);
      }

      // Build assignment JSON
      const assignment = {
        title,
        description: `Complete on PantherLearn: https://pantherlearn.web.app`,
        workType: "ASSIGNMENT",
        state: "PUBLISHED",
        maxPoints: 100,
      };

      // Only add due date if it's in the future
      if (dueDate) {
        const due = new Date(dueDate);
        if (due > new Date()) {
          assignment.dueDate = {
            year: due.getFullYear(),
            month: due.getMonth() + 1,
            day: due.getDate(),
          };
          assignment.dueTime = { hours: 23, minutes: 59 };
        } else {
          console.log(`  ⚠️  Due date ${dueDate} is in the past — creating without due date`);
        }
      }

      try {
        // Write JSON to temp files to avoid shell escaping issues (apostrophes in titles, etc.)
        const fs = require("fs");
        fs.writeFileSync("/tmp/gws-params.json", JSON.stringify({ courseId: classroomId }));
        fs.writeFileSync("/tmp/gws-body.json", JSON.stringify(assignment));
        const createOutput = execSync(
          `gws classroom courses courseWork create --params "$(cat /tmp/gws-params.json)" --json "$(cat /tmp/gws-body.json)" --format json 2>/dev/null`,
          { encoding: "utf-8", timeout: 30000 }
        );
        console.log(`  ✅ ${sec.label}: Posted to Classroom`);
      } catch (e) {
        console.log(`  ❌ ${sec.label}: Failed to post — ${e.message}`);
        return false;
      }
    } else {
      console.log(`  Would post "${title}" to ${sec.label} Classroom (${classroomId})`);
    }
  }

  await updateStatus(docRef, "posted", "mack");
  return true;
}

async function showStatus() {
  const snap = await db.collection("assignmentQueue")
    .where("status", "!=", "_schema")
    .orderBy("status")
    .get();

  if (snap.empty) {
    console.log("📋 Assignment queue is empty.");
    return;
  }

  const byStatus = {};
  snap.docs.forEach((doc) => {
    const data = doc.data();
    if (doc.id === "_schema_example") return;
    const status = data.status || "unknown";
    if (!byStatus[status]) byStatus[status] = [];
    byStatus[status].push({ id: doc.id, ...data });
  });

  console.log("📋 Assignment Queue Status\n");
  for (const [status, items] of Object.entries(byStatus)) {
    const icon = { drafted: "📝", approved: "✅", seeded: "🌱", posted: "📋", synced: "🔄" }[status] || "❓";
    console.log(`${icon} ${status.toUpperCase()} (${items.length})`);
    items.forEach((item) => {
      console.log(`  ${item.id}: ${item.title} [${item.course}]${item.dueDate ? ` due ${item.dueDate}` : ""}`);
    });
    console.log("");
  }
}

async function main() {
  if (statusOnly) {
    await showStatus();
    return;
  }

  if (dryRun) console.log("🔍 DRY RUN — no changes will be made\n");
  else console.log("🔧 Processing assignment queue...\n");

  // Step 1: Seed approved items
  const approved = await db.collection("assignmentQueue")
    .where("status", "==", "approved")
    .get();

  if (approved.empty) {
    console.log("📝 No approved items to seed.");
  } else {
    console.log(`📝 ${approved.size} approved item(s) to seed:\n`);
    for (const doc of approved.docs) {
      const data = doc.data();
      console.log(`🌱 Seeding: "${data.title}" [${data.course}]`);
      await seedLesson(data, doc.ref);
      console.log("");
    }
  }

  // Step 2: Post seeded items to Classroom
  const seeded = await db.collection("assignmentQueue")
    .where("status", "==", "seeded")
    .get();

  if (seeded.empty) {
    console.log("📋 No seeded items to post to Classroom.");
  } else {
    console.log(`\n📋 ${seeded.size} seeded item(s) to post to Classroom:\n`);
    for (const doc of seeded.docs) {
      const data = doc.data();
      console.log(`📋 Posting: "${data.title}" [${data.course}]`);
      await postToClassroom(data, doc.ref);
      console.log("");
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log("✅ Queue processing complete.");
}

main()
  .then(() => process.exit(0))
  .catch((e) => { console.error(e); process.exit(1); });
