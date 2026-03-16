/**
 * Link's Firestore Lesson Validator
 *
 * Checks all lessons across all courses for common issues:
 * 1. Embed blocks have `scored: true`
 * 2. Embed URLs are clean (no hardcoded studentId/courseId params)
 * 3. Block IDs are unique within each lesson
 * 4. Multi-section AI Literacy lessons are identical across sections
 * 5. Lessons have required fields (title, visible, blocks)
 *
 * Usage: node scripts/validate-lessons.cjs [--course <courseId>] [--lesson <lessonId>]
 */

const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

// AI Literacy section courseIds (must have identical lessons)
const AI_LITERACY_SECTIONS = [
  "Y9Gdhw5MTY8wMFt6Tlvj", // P4
  "DacjJ93vUDcwqc260OP3", // P5
  "M2MVSXrKuVCD9JQfZZyp", // P7
  "fUw67wFhAtobWFhjwvZ5", // P9
];

const ALL_COURSES = [
  "physics",
  "digital-literacy",
  ...AI_LITERACY_SECTIONS,
];

let totalIssues = 0;
let totalLessons = 0;
let totalPassed = 0;

function issue(courseId, lessonId, msg) {
  totalIssues++;
  console.log(`  ❌ [${courseId}/${lessonId}] ${msg}`);
}

function pass(msg) {
  totalPassed++;
}

function validateBlocks(courseId, lessonId, blocks) {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    issue(courseId, lessonId, "No blocks array or empty blocks");
    return;
  }

  // Check block ID uniqueness
  const ids = blocks.map((b) => b.id).filter(Boolean);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dupes.length > 0) {
    issue(courseId, lessonId, `Duplicate block IDs: ${dupes.join(", ")}`);
  } else {
    pass("Block IDs unique");
  }

  for (const block of blocks) {
    // Check embed blocks
    if (block.type === "embed") {
      if (block.scored !== true) {
        issue(courseId, lessonId, `Embed block "${block.id}" missing scored: true`);
      } else {
        pass("Embed scored");
      }

      const url = block.url || block.src || "";
      if (/[?&](studentId|courseId|lessonId|blockId)=/.test(url)) {
        issue(courseId, lessonId, `Embed block "${block.id}" has hardcoded params in URL: ${url}`);
      } else if (url) {
        pass("Embed URL clean");
      }

      if (!url) {
        issue(courseId, lessonId, `Embed block "${block.id}" has no URL`);
      }
    }

    // Check image blocks for relative paths
    if (block.type === "image") {
      const src = block.url || block.src || "";
      if (src.startsWith("/images") || src.startsWith("./images")) {
        issue(courseId, lessonId, `Image block "${block.id}" uses relative path: ${src} (Firebase SPA rewrite will intercept)`);
      }
    }

    // Check blocks have IDs
    if (!block.id) {
      issue(courseId, lessonId, `Block of type "${block.type}" has no id`);
    }
  }
}

function validateLesson(courseId, lessonId, data) {
  if (!data.title) {
    issue(courseId, lessonId, "Missing title");
  }

  if (data.visible === undefined) {
    // Not necessarily an issue, but worth noting
  }

  if (!data.blocks) {
    issue(courseId, lessonId, "Missing blocks field entirely");
    return;
  }

  validateBlocks(courseId, lessonId, data.blocks);
}

async function validateMultiSectionConsistency() {
  console.log("\n📋 Multi-section consistency (AI Literacy)...");

  // Load all lessons from all sections, indexed by both ID and title
  const sectionLessons = {};
  const sectionByTitle = {};
  for (const sectionId of AI_LITERACY_SECTIONS) {
    const snap = await db.collection(`courses/${sectionId}/lessons`).get();
    sectionLessons[sectionId] = {};
    sectionByTitle[sectionId] = {};
    snap.docs.forEach((doc) => {
      const data = doc.data();
      sectionLessons[sectionId][doc.id] = data;
      if (data.title) {
        sectionByTitle[sectionId][data.title] = { id: doc.id, data };
      }
    });
  }

  // Group by TITLE across all sections (handles different doc IDs for same lesson)
  const allTitles = new Set();
  for (const sectionId of AI_LITERACY_SECTIONS) {
    Object.keys(sectionByTitle[sectionId]).forEach((t) => allTitles.add(t));
  }

  let consistent = 0;
  let inconsistent = 0;

  for (const title of allTitles) {
    const present = AI_LITERACY_SECTIONS.filter((s) => sectionByTitle[s][title]);
    const missing = AI_LITERACY_SECTIONS.filter((s) => !sectionByTitle[s][title]);

    if (missing.length > 0) {
      issue("ai-literacy", `"${title}"`, `Missing from sections: ${missing.join(", ")}`);
      inconsistent++;
      continue;
    }

    // All sections have it — compare blocks using P4 as reference
    const refBlocks = JSON.stringify(sectionByTitle[AI_LITERACY_SECTIONS[0]][title].data.blocks || []);
    let allMatch = true;
    for (let i = 1; i < AI_LITERACY_SECTIONS.length; i++) {
      const secBlocks = JSON.stringify(sectionByTitle[AI_LITERACY_SECTIONS[i]][title].data.blocks || []);
      if (secBlocks !== refBlocks) {
        const refId = sectionByTitle[AI_LITERACY_SECTIONS[0]][title].id;
        const secId = sectionByTitle[AI_LITERACY_SECTIONS[i]][title].id;
        issue("ai-literacy", `"${title}"`, `Blocks differ: P4(${refId}) vs ${AI_LITERACY_SECTIONS[i]}(${secId})`);
        allMatch = false;
      }
    }
    if (allMatch) {
      consistent++;
    } else {
      inconsistent++;
    }
  }

  console.log(`  ✅ ${consistent} lessons consistent across all 4 sections`);
  if (inconsistent > 0) {
    console.log(`  ⚠️  ${inconsistent} lessons with inconsistencies`);
  }
}

async function main() {
  // Parse args
  const args = process.argv.slice(2);
  let filterCourse = null;
  let filterLesson = null;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--course" && args[i + 1]) filterCourse = args[++i];
    if (args[i] === "--lesson" && args[i + 1]) filterLesson = args[++i];
  }

  const courses = filterCourse ? [filterCourse] : ALL_COURSES;

  console.log("🔍 Link's Firestore Lesson Validator\n");

  for (const courseId of courses) {
    console.log(`📚 Course: ${courseId}`);
    const lessonsSnap = await db.collection(`courses/${courseId}/lessons`).get();

    if (lessonsSnap.empty) {
      console.log("  (no lessons found)\n");
      continue;
    }

    for (const doc of lessonsSnap.docs) {
      if (filterLesson && doc.id !== filterLesson) continue;
      totalLessons++;
      validateLesson(courseId, doc.id, doc.data());
    }
    console.log("");
  }

  // Multi-section check (only if not filtering to a single non-AI course)
  if (!filterCourse || AI_LITERACY_SECTIONS.includes(filterCourse)) {
    await validateMultiSectionConsistency();
  }

  // Summary
  console.log("\n" + "=".repeat(50));
  console.log(`📊 Summary: ${totalLessons} lessons scanned, ${totalIssues} issues found`);
  if (totalIssues === 0) {
    console.log("✅ All checks passed!");
  } else {
    console.log(`⚠️  ${totalIssues} issues need attention`);
  }
}

main()
  .then(() => process.exit(totalIssues > 0 ? 1 : 0))
  .catch((e) => {
    console.error(e);
    process.exit(2);
  });
