#!/usr/bin/env node
/**
 * Create or update the "Steady — McCarthy" playlist.
 * Scoped to all 4 AI Literacy sections (P4, P5, P7, P9).
 * Tracks point to MP3s on Firebase Storage and embed lyrics from drafts/suno-songs/luke/*.md.
 *
 * Idempotent: if a playlist named "Steady — McCarthy" exists, it updates it.
 *
 * Usage:
 *   node scripts/seed-steady-playlist.cjs --dry
 *   node scripts/seed-steady-playlist.cjs
 */

const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");
const os = require("os");

const serviceAccount = require(os.homedir() + "/.config/firebase/pantherlearn-admin.json");
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

const dryRun = process.argv.includes("--dry");

const PLAYLIST_NAME = "Steady — McCarthy";

const AI_LIT_COURSE_IDS = [
  "Y9Gdhw5MTY8wMFt6Tlvj", // P4
  "DacjJ93vUDcwqc260OP3", // P5
  "M2MVSXrKuVCD9JQfZZyp", // P7
  "fUw67wFhAtobWFhjwvZ5", // P9
];

const STORAGE_BASE = "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/playlists/steady-mccarthy";
const COVER_URL = `${STORAGE_BASE}/cover.jpg`;

const LYRICS_DIR = path.join(os.homedir(), "Lachlan", "drafts", "suno-songs", "luke");

// Track order (album sequence) — title + mp3 filename + matching lyrics .md slug
const ALBUM = [
  { n: 1,  title: "Your CTO",            mp3: "1-your-cto.mp3",            lyricsSlug: null },
  { n: 2,  title: "Lights On",           mp3: "2-lights-on.mp3",           lyricsSlug: "lights-on" },
  { n: 3,  title: "Belonging",           mp3: "3-belonging.mp3",           lyricsSlug: "backstory" },
  { n: 4,  title: "Eight Rounds",        mp3: "4-eight-rounds.mp3",        lyricsSlug: "warhammer" },
  { n: 5,  title: "Already Here",        mp3: "5-already-here.mp3",        lyricsSlug: "photography" },
  { n: 6,  title: "The Sound",           mp3: "6-the-sound.mp3",           lyricsSlug: "physics" },
  { n: 7,  title: "Anchor",              mp3: "7-anchor.mp3",              lyricsSlug: "faith" },
  { n: 8,  title: "Edge of the Night",   mp3: "8-edge-of-the-night.mp3",   lyricsSlug: "space" },
  { n: 9,  title: "I, Robot",            mp3: "9-i-robot.mp3",             lyricsSlug: "i-robot" },
  { n: 10, title: "Threshold",           mp3: "10-threshold.mp3",          lyricsSlug: "the-moment" },
  { n: 11, title: "Stay Sharp",          mp3: "11-stay-sharp.mp3",         lyricsSlug: "use-your-brain" },
  { n: 12, title: "Get Up",              mp3: "12-get-up.mp3",             lyricsSlug: "get-up" },
  { n: 13, title: "Beautiful Surrender", mp3: "13-beautiful-surrender.mp3", lyricsSlug: "rest" },
];

function loadLyrics(slug) {
  if (!slug) return null;
  const filePath = path.join(LYRICS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const md = fs.readFileSync(filePath, "utf8");
  const match = md.match(/## Lyrics\s*\n([\s\S]+)$/);
  if (!match) return null;
  return match[1].trim();
}

function buildTracks() {
  return ALBUM.map((entry) => ({
    id: `steady-${entry.n}`,
    label: `${entry.n}. ${entry.title}`,
    artist: "Luke McCarthy",
    type: "audio",
    url: `${STORAGE_BASE}/${entry.mp3}`,
    coverUrl: COVER_URL,
    lyrics: loadLyrics(entry.lyricsSlug),
  }));
}

async function main() {
  console.log(dryRun ? "DRY RUN — no writes\n" : "LIVE — writing to Firestore\n");

  const tracks = buildTracks();
  console.log(`Built ${tracks.length} tracks. Lyrics included on ${tracks.filter((t) => t.lyrics).length}.\n`);

  const existing = await db.collection("playlists").where("name", "==", PLAYLIST_NAME).get();

  const doc = {
    name: PLAYLIST_NAME,
    courseIds: AI_LIT_COURSE_IDS,
    coverUrl: COVER_URL,
    tracks,
    artist: "Luke McCarthy",
    description: "A 13-track self-portrait album. One person standing in the AI year, grounded by faith, family, wonder, and craft.",
    ownerUid: "luke-mccarthy",
    order: 0,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  if (existing.empty) {
    doc.createdAt = admin.firestore.FieldValue.serverTimestamp();
    if (dryRun) {
      console.log(`[DRY] would CREATE playlist "${PLAYLIST_NAME}" scoped to ${AI_LIT_COURSE_IDS.length} courses`);
    } else {
      const ref = await db.collection("playlists").add(doc);
      console.log(`✓ Created playlist ${ref.id}: "${PLAYLIST_NAME}"`);
    }
  } else {
    const existingDoc = existing.docs[0];
    if (dryRun) {
      console.log(`[DRY] would UPDATE existing playlist ${existingDoc.id}: "${PLAYLIST_NAME}"`);
    } else {
      await existingDoc.ref.set(doc, { merge: true });
      console.log(`✓ Updated playlist ${existingDoc.id}: "${PLAYLIST_NAME}"`);
    }
  }

  console.log(`\nDone. Visible to courseIds: ${AI_LIT_COURSE_IDS.join(", ")}`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
