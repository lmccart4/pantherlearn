/**
 * Audit AI Literacy sections by TITLE (not doc ID)
 * Shows which lessons are truly missing vs just have different IDs
 */

const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

const SECTIONS = [
  { id: "Y9Gdhw5MTY8wMFt6Tlvj", label: "P4" },
  { id: "DacjJ93vUDcwqc260OP3", label: "P5" },
  { id: "M2MVSXrKuVCD9JQfZZyp", label: "P7" },
  { id: "fUw67wFhAtobWFhjwvZ5", label: "P9" },
];

async function main() {
  const sectionData = {};
  for (const sec of SECTIONS) {
    const snap = await db.collection(`courses/${sec.id}/lessons`).get();
    sectionData[sec.id] = [];
    snap.docs.forEach((doc) => {
      const d = doc.data();
      sectionData[sec.id].push({ id: doc.id, title: d.title || "(no title)", blockCount: (d.blocks || []).length });
    });
  }

  // Group by title across all sections
  const byTitle = {};
  for (const sec of SECTIONS) {
    for (const lesson of sectionData[sec.id]) {
      if (!byTitle[lesson.title]) byTitle[lesson.title] = {};
      byTitle[lesson.title][sec.label] = { id: lesson.id, blocks: lesson.blockCount };
    }
  }

  console.log("📋 AI Literacy Lessons by Title\n");
  console.log("Title".padEnd(55) + "P4".padEnd(15) + "P5".padEnd(15) + "P7".padEnd(15) + "P9".padEnd(15));
  console.log("-".repeat(115));

  const titles = Object.keys(byTitle).sort();
  let allPresent = 0;
  let someMissing = 0;

  for (const title of titles) {
    const row = byTitle[title];
    const cols = SECTIONS.map((s) => {
      if (row[s.label]) {
        return `${row[s.label].id.substring(0, 8)}(${row[s.label].blocks})`;
      }
      return "—";
    });

    const present = SECTIONS.filter((s) => row[s.label]).length;
    const marker = present === 4 ? "✅" : "❌";
    if (present === 4) allPresent++;
    else someMissing++;

    console.log(`${marker} ${title.substring(0, 53).padEnd(53)} ${cols[0].padEnd(15)}${cols[1].padEnd(15)}${cols[2].padEnd(15)}${cols[3].padEnd(15)}`);
  }

  console.log(`\n✅ Present in all 4: ${allPresent}`);
  console.log(`❌ Missing from 1+:  ${someMissing}`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => { console.error(e); process.exit(1); });
