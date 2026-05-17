#!/usr/bin/env node
/**
 * One-shot migration: courses/{cid}/settings/music → playlists/{auto}
 *
 * Each existing per-course track list becomes a playlist named
 * "Unsorted — {course title}" scoped to that single course.
 *
 * Usage:
 *   node scripts/migrate-music-to-playlists.cjs --dry   # print only
 *   node scripts/migrate-music-to-playlists.cjs         # write
 *
 * Old per-course docs are NOT deleted (kept as backup).
 * Idempotent — skips courses where the named playlist already exists.
 */

const admin = require("firebase-admin");
const serviceAccount = require(require("os").homedir() + "/.config/firebase/pantherlearn-admin.json");

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

const dryRun = process.argv.includes("--dry");

function detectType(url) {
  if (!url) return "audio";
  return /youtube\.com|youtu\.be|music\.youtube\.com/i.test(url) ? "youtube" : "audio";
}

async function main() {
  console.log(dryRun ? "DRY RUN — no writes\n" : "LIVE — writing to Firestore\n");

  const coursesSnap = await db.collection("courses").get();
  const courses = coursesSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  console.log(`Found ${courses.length} courses\n`);

  let created = 0, skipped = 0, empty = 0;

  for (const course of courses) {
    const label = `${course.title || course.id}${course.hidden ? " [hidden]" : ""}`;

    const musicDoc = await db.collection("courses").doc(course.id).collection("settings").doc("music").get();
    if (!musicDoc.exists) {
      empty++;
      continue;
    }
    const tracks = musicDoc.data().tracks || [];
    if (tracks.length === 0) {
      empty++;
      continue;
    }

    const expectedName = `Unsorted — ${course.title || course.id}`;
    const existing = await db.collection("playlists").where("name", "==", expectedName).get();
    if (!existing.empty) {
      console.log(`  ⏭  skip (already migrated): ${label}`);
      skipped++;
      continue;
    }

    const normalizedTracks = tracks.map((t, i) => ({
      id: `track-${i + 1}`,
      label: t.label || `Track ${i + 1}`,
      url: t.url || "",
      type: detectType(t.url),
    }));

    const playlistDoc = {
      name: expectedName,
      courseIds: [course.id],
      coverUrl: null,
      tracks: normalizedTracks,
      ownerUid: "system-migration",
      order: 999,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (dryRun) {
      console.log(`  📋 [DRY] would create: "${expectedName}" (${normalizedTracks.length} tracks) for ${label}`);
    } else {
      const ref = await db.collection("playlists").add(playlistDoc);
      console.log(`  ✓ created ${ref.id}: "${expectedName}" (${normalizedTracks.length} tracks) for ${label}`);
    }
    created++;
  }

  console.log(`\nDone. created=${created} skipped=${skipped} empty=${empty}`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
