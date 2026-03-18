/**
 * seed-tool-embeds.cjs
 * Embeds all 9 deployed student tools into their target lessons across all 3 courses.
 * - Never changes lesson visibility
 * - Skips if embed already present (idempotent by URL)
 * - AI Literacy: adds to all 4 sections (P4/P5/P7/P9)
 * - DL: creates 2 new hidden lessons for digital-footprint + privacy-settings tools
 * - Physics: appends to existing relevant lessons
 */

const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

const { v4: uuidv4 } = require("uuid");
const shortId = () => uuidv4().split("-")[0];

const AI_LIT_COURSES = [
  "Y9Gdhw5MTY8wMFt6Tlvj", // P4
  "DacjJ93vUDcwqc260OP3", // P5
  "M2MVSXrKuVCD9JQfZZyp", // P7
  "fUw67wFhAtobWFhjwvZ5", // P9
];

// ── Embed block definitions ──────────────────────────────────────────────────

const TOOLS = {
  biasDetection: {
    url: "https://bias-detection-paps.web.app",
    caption: "Bias Detection Activities — Spot, analyze, and fix bias in AI systems (34 pts)",
    scored: true,
    height: 820,
  },
  ethicsCards: {
    url: "https://ai-ethics-dilemma-paps.web.app",
    caption: "AI Ethics Dilemma Cards — Explore and discuss real-world AI ethical dilemmas",
    scored: true,
    height: 720,
  },
  decisionTree: {
    url: "https://decision-tree-paps.web.app",
    caption: "Decision Tree Builder — Build and walk through decision trees interactively",
    scored: true,
    height: 700,
  },
  promptSandbox: {
    url: "https://prompt-sandbox-paps.web.app",
    caption: "Prompt Engineering Sandbox — Practice CRAFT and build better AI prompts",
    scored: true,
    height: 800,
  },
  digitalFootprint: {
    url: "https://digital-footprint-paps.web.app",
    caption: "Digital Footprint Simulator — Make choices online and see how they shape your digital identity (10 scenarios)",
    scored: true,
    height: 780,
  },
  privacySettings: {
    url: "https://privacy-settings-paps.web.app",
    caption: "Privacy Settings Walkthrough — Lock down your privacy across 4 real-world apps (34 pts)",
    scored: true,
    height: 760,
  },
  coulombsLaw: {
    url: "https://coulombs-law-paps.web.app",
    caption: "Coulomb's Law Explorer — Drag charges and explore electrostatic force in real time",
    scored: true,
    height: 700,
  },
  equationSolvers: {
    url: "https://equation-solvers-paps.web.app",
    caption: "Interactive Equation Solvers — Step-by-step physics equation practice",
    scored: true,
    height: 720,
  },
  virtualLabs: {
    url: "https://virtual-labs-paps.web.app",
    caption: "Virtual Lab Simulations — Projectile motion, inclined plane, collisions & pendulum",
    scored: true,
    height: 780,
  },
};

function makeBlock(tool) {
  return { type: "embed", id: shortId(), ...tool };
}

// ── Core helpers ─────────────────────────────────────────────────────────────

async function appendEmbedToLesson(courseId, lessonId, tool) {
  const ref = db.collection("courses").doc(courseId).collection("lessons").doc(lessonId);
  const snap = await ref.get();
  if (!snap.exists) {
    console.log(`  ⚠️  SKIP — lesson not found: ${courseId}/${lessonId}`);
    return;
  }
  const data = snap.data();
  const blocks = data.blocks || [];

  // Idempotent: skip if URL already present
  if (blocks.some((b) => b.url === tool.url)) {
    console.log(`  ✓  Already embedded: ${lessonId} ← ${tool.url}`);
    return;
  }

  const newBlock = makeBlock(tool);
  await ref.update({ blocks: [...blocks, newBlock] });
  console.log(`  ✅ Added embed to ${lessonId} (block ${newBlock.id}) — ${tool.url}`);
}

async function createHiddenLessonWithEmbed(courseId, lessonId, title, description, tool, order) {
  const ref = db.collection("courses").doc(courseId).collection("lessons").doc(lessonId);
  const snap = await ref.get();

  if (snap.exists) {
    // Lesson exists — just append embed if missing
    await appendEmbedToLesson(courseId, lessonId, tool);
    return;
  }

  const newBlock = makeBlock(tool);
  const lessonData = {
    id: lessonId,
    title,
    order: order || 999,
    visible: false,
    blocks: [
      {
        type: "section_header",
        id: "section-activity",
        label: "Activity",
      },
      {
        type: "text",
        id: shortId(),
        content: description,
      },
      newBlock,
    ],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  await ref.set(lessonData);
  console.log(`  ✅ Created hidden lesson: ${lessonId} in ${courseId}`);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n=== AI LITERACY — 4 sections ===");

  for (const courseId of AI_LIT_COURSES) {
    console.log(`\n  Course: ${courseId}`);
    await appendEmbedToLesson(courseId, "36da9be4", TOOLS.biasDetection);
    await appendEmbedToLesson(courseId, "ai-ethics-accountability", TOOLS.ethicsCards);
    await appendEmbedToLesson(courseId, "whos-making-choices", TOOLS.decisionTree);
    await appendEmbedToLesson(courseId, "prompt-workshop", TOOLS.promptSandbox);
  }

  console.log("\n=== DIGITAL LITERACY ===");
  await createHiddenLessonWithEmbed(
    "digital-literacy",
    "digital-footprint-activity",
    "Digital Footprint Simulator",
    "Make choices online and see how they shape your digital identity. Complete all 10 scenarios to earn your score.",
    TOOLS.digitalFootprint,
    100
  );
  await createHiddenLessonWithEmbed(
    "digital-literacy",
    "privacy-settings-activity",
    "Privacy Settings Walkthrough",
    "Lock down your privacy across 4 real-world apps — social media, streaming, messaging, and gaming. Configure the safest settings and answer quiz questions about why they matter.",
    TOOLS.privacySettings,
    101
  );

  console.log("\n=== PHYSICS ===");
  await appendEmbedToLesson("physics", "coulombs-law", TOOLS.coulombsLaw);
  await appendEmbedToLesson("physics", "work-energy-discovery", TOOLS.equationSolvers);
  await appendEmbedToLesson("physics", "w20-download-prep", TOOLS.virtualLabs);

  console.log("\n✅ Done.");
  process.exit(0);
}

main().catch((e) => {
  console.error("Error:", e.message);
  process.exit(1);
});
