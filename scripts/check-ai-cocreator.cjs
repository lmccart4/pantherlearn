const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

async function check() {
  const courseIds = ["ai-literacy", "DacjJ93vUDcwqc260OP3", "M2MVSXrKuVCD9JQfZZyp", "Y9Gdhw5MTY8wMFt6Tlvj", "fUw67wFhAtobWFhjwvZ5"];
  
  for (const courseId of courseIds) {
    const lessons = await db.collection(`courses/${courseId}/lessons`).get();
    for (const l of lessons.docs) {
      const data = l.data();
      if (data.title && data.title.toLowerCase().includes("co-creator")) {
        console.log(`\nCourse: ${courseId} | Lesson: ${l.id} | Title: ${data.title}`);
        data.blocks?.forEach((b, i) => {
          if (b.type === "activity" || b.type === "external_link" || 
              (b.content && b.content.includes("code.org")) ||
              (b.instructions && b.instructions.includes("code.org")) ||
              b.url?.includes("code.org")) {
            console.log(`  Block ${i} (${b.id}, ${b.type}):`);
            console.log("  ", JSON.stringify(b, null, 2).substring(0, 500));
          }
        });
      }
    }
  }
}

check().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
