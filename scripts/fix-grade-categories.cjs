/**
 * Bulk gradeCategory fix across all visible lessons
 *
 * Rules:
 *   - title contains "assessment" or "quiz" (case-insensitive) → gradeCategory: 'assessment'
 *   - everything else → gradeCategory: 'classwork' (only if currently missing/null)
 *
 * Safe: touches lesson-level metadata only. No block IDs changed.
 *
 * Usage:
 *   node scripts/fix-grade-categories.cjs --dry-run   # Preview only
 *   node scripts/fix-grade-categories.cjs             # Apply fixes
 */

const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();

const COURSES = [
  { id: 'Y9Gdhw5MTY8wMFt6Tlvj', label: 'AI Literacy P4' },
  { id: 'DacjJ93vUDcwqc260OP3', label: 'AI Literacy P5' },
  { id: 'M2MVSXrKuVCD9JQfZZyp', label: 'AI Literacy P7' },
  { id: 'fUw67wFhAtobWFhjwvZ5', label: 'AI Literacy P9' },
  { id: 'physics', label: 'Physics' },
  { id: 'digital-literacy', label: 'Digital Literacy' },
];

const dryRun = process.argv.includes('--dry-run');

function expectedCategory(title) {
  const lower = title.toLowerCase();
  if (lower.includes('assessment') || lower.includes('quiz')) return 'assessment';
  return 'classwork';
}

async function main() {
  console.log(dryRun ? 'DRY RUN — no changes will be made\n' : 'LIVE RUN — patching Firestore\n');

  let totalChanged = 0;
  let totalSkipped = 0;

  for (const course of COURSES) {
    const snap = await db.collection('courses').doc(course.id).collection('lessons')
      .where('visible', '==', true).get();

    let courseChanged = 0;

    for (const doc of snap.docs) {
      const d = doc.data();
      const title = d.title || '';
      const current = d.gradeCategory || null;
      const expected = expectedCategory(title);

      // Rules:
      //   - If title matches assessment/quiz → always set to 'assessment'
      //   - Otherwise → set to 'classwork' only if currently missing/null
      let shouldUpdate = false;
      if (expected === 'assessment' && current !== 'assessment') {
        shouldUpdate = true;
      } else if (expected === 'classwork' && (current === null || current === undefined || current === '')) {
        shouldUpdate = true;
      }

      if (shouldUpdate) {
        console.log(`  [${course.label}] "${title}" | ${current || 'null'} → ${expected}`);
        if (!dryRun) {
          await db.collection('courses').doc(course.id).collection('lessons').doc(doc.id)
            .update({ gradeCategory: expected });
        }
        courseChanged++;
        totalChanged++;
      } else {
        totalSkipped++;
      }
    }

    if (courseChanged > 0) {
      console.log(`  → ${courseChanged} change(s) in ${course.label}\n`);
    }
  }

  console.log(`\nSummary: ${totalChanged} updated, ${totalSkipped} already correct / skipped`);
}

main()
  .then(() => process.exit(0))
  .catch(e => { console.error(e); process.exit(1); });
