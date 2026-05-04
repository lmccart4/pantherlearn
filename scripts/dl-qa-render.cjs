// Pixel — render DL May 2026 lessons to markdown previews for QA
const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const KEY_PATH = `${process.env.HOME}/.config/firebase/pantherlearn-admin.json`;
admin.initializeApp({
  credential: admin.credential.cert(require(KEY_PATH)),
  projectId: "pantherlearn-d6f7c",
});
const db = admin.firestore();

const LESSONS = [
  "brand-kit-day1-vibe-check",
  "brand-kit-day2-logo-color-font",
  "brand-kit-day3-instagram-guide-showcase",
  "photo-essay-day1-theme-composition",
  "photo-essay-day2-curate-sequence",
  "photo-essay-day3-layout-showcase",
  "infographic-day1-topic-data",
  "infographic-day2-design",
  "infographic-day3-polish-showcase",
  "short-form-video-day1-deconstruction",
  "short-form-video-day2-script-shoot",
  "short-form-video-day3-edit-capcut",
  "short-form-video-day4-polish-showcase",
  "psa-day1-topic-research",
  "psa-day2-storyboard-design",
  "psa-day3-production",
  "psa-day4-polish-showcase",
];

const OUT_DIR = "/Users/lukemccarthy/Lachlan/drafts/qa-reports/pixel-screenshots";

function shortVal(v, max = 220) {
  if (v == null) return "";
  if (typeof v === "string") return v.length > max ? v.slice(0, max) + "…" : v;
  return JSON.stringify(v).slice(0, max);
}

function renderBlock(b, idx) {
  const t = b.type || "?";
  const lines = [];
  lines.push(`### ${idx + 1}. \`${t}\`${b.scored ? " (scored, weight=" + (b.weight || "?") + ")" : ""}`);
  if (b.title) lines.push(`**Title:** ${b.title}`);
  if (b.heading) lines.push(`**Heading:** ${b.heading}`);
  if (b.content) lines.push(`**Content:** ${shortVal(b.content, 600)}`);
  if (b.text) lines.push(`**Text:** ${shortVal(b.text, 600)}`);
  if (b.url) lines.push(`**URL:** ${b.url}`);
  if (b.src) lines.push(`**Src:** ${b.src}`);
  if (b.image) lines.push(`**Image:** ${b.image}`);
  if (b.imageUrl) lines.push(`**ImageURL:** ${b.imageUrl}`);
  if (b.alt) lines.push(`**Alt:** ${b.alt}`);
  if (b.caption) lines.push(`**Caption:** ${shortVal(b.caption, 200)}`);
  if (b.questionType) lines.push(`**QType:** ${b.questionType}`);
  if (b.prompt) lines.push(`**Prompt:** ${shortVal(b.prompt, 300)}`);
  if (b.options) lines.push(`**Options:** ${JSON.stringify(b.options).slice(0, 400)}`);
  if (b.correctAnswer != null) lines.push(`**Correct:** ${shortVal(b.correctAnswer, 100)}`);
  if (b.items) lines.push(`**Items:** ${JSON.stringify(b.items).slice(0, 400)}`);
  if (b.objectives) lines.push(`**Objectives:** ${JSON.stringify(b.objectives).slice(0, 300)}`);
  return lines.join("\n");
}

function findImageUrls(blocks) {
  const urls = [];
  for (const b of blocks || []) {
    for (const k of ["image", "imageUrl", "src", "url"]) {
      if (b[k] && typeof b[k] === "string" && /\.(jpg|png|jpeg|webp|gif)/i.test(b[k])) urls.push({ key: k, url: b[k], type: b.type });
    }
    // Nested check (e.g. carousel items)
    if (Array.isArray(b.items)) {
      for (const it of b.items) {
        for (const k of ["image", "imageUrl", "src"]) {
          if (it[k] && typeof it[k] === "string" && /\.(jpg|png|jpeg|webp|gif)/i.test(it[k])) urls.push({ key: k, url: it[k], type: b.type + "/item" });
        }
      }
    }
  }
  return urls;
}

(async () => {
  const summary = [];
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const id of LESSONS) {
    const ref = db.doc("courses/digital-literacy/lessons/" + id);
    const snap = await ref.get();
    if (!snap.exists) {
      summary.push({ id, exists: false });
      continue;
    }
    const data = snap.data();
    const blocks = data.blocks || [];
    const types = blocks.map(b => b.type);
    const counts = {};
    types.forEach(t => counts[t] = (counts[t] || 0) + 1);
    const imageUrls = findImageUrls(blocks);
    const blockCount = blocks.length;

    // Check for sketchy URL formats
    const badUrlFormat = imageUrls.filter(({ url }) => url.includes("firebasestorage.googleapis.com/v0/b/"));
    const goodFormat = imageUrls.filter(({ url }) => url.includes("storage.googleapis.com/"));

    summary.push({
      id,
      exists: true,
      visible: data.visible,
      gradesReleased: data.gradesReleased,
      title: data.title,
      blockCount,
      typeCounts: counts,
      imageCount: imageUrls.length,
      badUrlFormat: badUrlFormat.length,
      imageUrls: imageUrls.map(u => u.url),
      hasObjectives: types.includes("objectives") || types.includes("learning_objectives"),
      hasScoredEmbed: blocks.some(b => b.scored === true),
    });

    // Render preview MD
    const md = [];
    md.push(`# ${data.title || id}`);
    md.push(`**Lesson ID:** \`${id}\``);
    md.push(`**Visible:** ${data.visible} | **gradesReleased:** ${data.gradesReleased} | **Blocks:** ${blockCount}`);
    md.push(`**Block types:** ${Object.entries(counts).map(([t, n]) => `${t}×${n}`).join(", ")}`);
    md.push(`**Images referenced:** ${imageUrls.length} (bad URL format: ${badUrlFormat.length})`);
    md.push("");
    md.push("---");
    md.push("");
    blocks.forEach((b, i) => {
      md.push(renderBlock(b, i));
      md.push("");
    });
    fs.writeFileSync(path.join(OUT_DIR, id + ".md"), md.join("\n"));
  }

  fs.writeFileSync(path.join(OUT_DIR, "_summary.json"), JSON.stringify(summary, null, 2));
  console.log(JSON.stringify(summary, null, 2));
})().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
