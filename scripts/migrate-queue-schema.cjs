#!/usr/bin/env node
// One-off migration: backfill missing `updatedAt` and `statusHistory` fields
// on legacy assignmentQueue documents that pre-date the schema update.
// Safe to run multiple times — uses merge and only patches missing fields.
//
// Run: node ~/pantherlearn/scripts/migrate-queue-schema.cjs

const admin = require('/Users/lukemccarthy/pantherlearn/node_modules/firebase-admin');
if (!admin.apps.length) admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();

async function migrate() {
  const snap = await db.collection('assignmentQueue').get();
  let patched = 0;
  let skipped = 0;

  for (const doc of snap.docs) {
    const data = doc.data();
    const needsUpdatedAt = data.updatedAt === undefined;
    const needsStatusHistory = data.statusHistory === undefined;

    if (!needsUpdatedAt && !needsStatusHistory) {
      skipped++;
      continue;
    }

    const patch = {};
    if (needsUpdatedAt) {
      // Use createdAt as fallback; if also missing, use server timestamp
      patch.updatedAt = data.createdAt || admin.firestore.FieldValue.serverTimestamp();
    }
    if (needsStatusHistory) {
      patch.statusHistory = [];
    }

    await doc.ref.set(patch, { merge: true });
    console.log(`  ✓ Patched: ${doc.id} (${data.title || 'untitled'})`);
    patched++;
  }

  console.log(`\nDone. ${patched} docs patched, ${skipped} already up to date.`);
  process.exit(0);
}

migrate().catch(err => { console.error(err.message); process.exit(1); });
