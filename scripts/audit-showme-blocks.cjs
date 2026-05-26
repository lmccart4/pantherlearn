const admin = require("firebase-admin");
const key = require("/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json");
admin.initializeApp({ credential: admin.credential.cert(key) });
const db = admin.firestore();

const COURSE = process.argv[2] || "physics";

(async () => {
  const snap = await db.collection("courses").doc(COURSE).collection("lessons").get();
  const rows = [];
  snap.forEach((d) => {
    const l = d.data();
    const blocks = l.blocks || [];
    const checkpoints = blocks.filter((b) => b.type === "teacher_checkpoint");
    // other "show me" representations: any block text/title/prompt mentioning "show me"
    const textHits = blocks.filter((b) => {
      if (b.type === "teacher_checkpoint") return false;
      const s = JSON.stringify([b.title, b.prompt, b.content, b.text, b.label, b.caption]).toLowerCase();
      return s.includes("show me") || s.includes("show mr") || s.includes("show your teacher") || s.includes("show the teacher");
    });
    const mc = blocks.filter((b) => b.type === "question" && b.questionType === "multiple_choice").length;
    const sa = blocks.filter((b) => b.type === "question" && b.questionType === "short_answer").length;
    const embeds = blocks.filter((b) => (b.type === "embed" || b.type === "connect_four") && b.scored).length;
    if (checkpoints.length || textHits.length) {
      rows.push({
        id: d.id,
        title: l.title || "(untitled)",
        visible: l.visible !== false,
        dueDate: l.dueDate || "",
        gradedReleased: l.gradesReleased === true,
        otherGraded: mc + sa + embeds,
        mc, sa, embeds,
        checkpoints: checkpoints.map((b) => ({ id: b.id, title: b.title || "", weight: b.weight ?? null, scored: b.scored })),
        textHits: textHits.map((b) => ({ id: b.id, type: b.type, snippet: (b.title || b.prompt || b.content || b.text || "").slice(0, 60) })),
      });
    }
  });

  console.log(`\n=== ${COURSE}: ${snap.size} lessons scanned ===`);
  console.log(`Lessons with teacher_checkpoint ("Show Me") blocks: ${rows.filter(r => r.checkpoints.length).length}`);
  console.log(`Lessons with other "show me" text references: ${rows.filter(r => r.textHits.length).length}\n`);

  const cpRows = rows.filter((r) => r.checkpoints.length);
  console.log("MyGrades breakdown gating — checkpoint-only lessons hide the WHOLE breakdown row:");
  console.log("  (MyGrades renders detail only if mc/sa/embed > 0; checkpoints are never shown as line items either way)\n");
  cpRows.forEach((r) => {
    const vis = r.visible ? "VISIBLE" : "hidden ";
    const onlyCp = r.otherGraded === 0 ? "  ⚠️ CHECKPOINT-ONLY (no breakdown row at all)" : `  (also ${r.mc}MC/${r.sa}SA/${r.embeds}embed)`;
    console.log(`• [${vis}] ${r.id}  —  ${r.title}  ${r.dueDate ? "(due " + r.dueDate + ")" : "(unscheduled)"}${onlyCp}`);
    r.checkpoints.forEach((c) => console.log(`     ↳ "${c.title}" weight=${c.weight} scored=${c.scored} id=${c.id}`));
  });
  const textOnly = rows.filter((r) => !r.checkpoints.length && r.textHits.length);
  if (textOnly.length) {
    console.log("\nText-only 'show me' references (likely false positives — no checkpoint block):");
    textOnly.forEach((r) => {
      console.log(`• ${r.id} — ${r.title}`);
      r.textHits.forEach((t) => console.log(`     ↳ text[${t.type}]: "${t.snippet}"`));
    });
  }
  console.log("");
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
