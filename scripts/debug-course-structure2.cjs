const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

async function check() {
  const ids = ["DacjJ93vUDcwqc260OP3", "M2MVSXrKuVCD9JQfZZyp", "Y9Gdhw5MTY8wMFt6Tlvj", "fUw67wFhAtobWFhjwvZ5"];
  for (const id of ids) {
    const doc = await db.doc("courses/" + id).get();
    const data = doc.data();
    console.log(id + ":", { title: data.title, migratedFrom: data.migratedFrom, migratedSection: data.migratedSection });
  }
}

check().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
