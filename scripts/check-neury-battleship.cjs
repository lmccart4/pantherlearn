const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");
const saPath = path.join(__dirname, "..", "serviceAccountKey.json");
if (fs.existsSync(saPath)) {
  admin.initializeApp({ credential: admin.credential.cert(require(saPath)) });
} else {
  admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
}
const db = admin.firestore();

const AI_LITERACY_COURSE_IDS = [
  'Y9Gdhw5MTY8wMFt6Tlvj', // Period 4
  'DacjJ93vUDcwqc260OP3', // Period 5
  'M2MVSXrKuVCD9JQfZZyp', // Period 7
  'fUw67wFhAtobWFhjwvZ5', // Period 9
  'ai-literacy',           // parent course
];

const PERIOD_LABELS = {
  'Y9Gdhw5MTY8wMFt6Tlvj': 'Period 4',
  'DacjJ93vUDcwqc260OP3': 'Period 5',
  'M2MVSXrKuVCD9JQfZZyp': 'Period 7',
  'fUw67wFhAtobWFhjwvZ5': 'Period 9',
  'ai-literacy': 'AI Literacy (parent)',
};

async function main() {
  // Step 1: Find the student in the users collection
  console.log('=== Searching for Neury de la Rosa ===\n');

  let neurydUID = null;
  let neurydData = null;

  // Search by displayName
  const usersSnap = await db.collection('users').get();
  for (const doc of usersSnap.docs) {
    const data = doc.data();
    const name = (data.displayName || '').toLowerCase();
    const email = (data.email || '').toLowerCase();
    if (name.includes('neury') || email.includes('neury')) {
      console.log(`Found user: ${doc.id}`);
      console.log(`  displayName: ${data.displayName}`);
      console.log(`  email: ${data.email}`);
      console.log(`  role: ${data.role}`);
      neurydUID = doc.id;
      neurydData = data;
    }
  }

  // Also check enrollments for neury
  if (!neurydUID) {
    console.log('Not found in users collection, checking enrollments...');
    const enrollSnap = await db.collection('enrollments').get();
    for (const doc of enrollSnap.docs) {
      const data = doc.data();
      const email = (data.email || '').toLowerCase();
      const name = (data.displayName || '').toLowerCase();
      if (email.includes('neury') || name.includes('neury')) {
        console.log(`Found in enrollments: uid=${data.uid}, email=${data.email}, name=${data.displayName}`);
        neurydUID = data.uid;
      }
    }
  }

  if (!neurydUID) {
    console.log('Student not found. Trying partial search...');
    // Try "de la rosa"
    for (const doc of usersSnap.docs) {
      const data = doc.data();
      const name = (data.displayName || '').toLowerCase();
      if (name.includes('de la rosa') || name.includes('delarosa')) {
        console.log(`Found by last name: ${doc.id} - ${data.displayName} - ${data.email}`);
        neurydUID = doc.id;
        neurydData = data;
      }
    }
  }

  if (!neurydUID) {
    console.log('ERROR: Could not find student Neury de la Rosa');
    process.exit(1);
  }

  console.log(`\nUID: ${neurydUID}\n`);

  // Step 2: Check battleship-scores collection (standalone scores)
  console.log('=== Checking battleship-scores collection ===');
  const bsSnap = await db.collection('battleship-scores').where('uid', '==', neurydUID).get();
  if (!bsSnap.empty) {
    bsSnap.forEach(doc => {
      const d = doc.data();
      console.log(`  Doc ${doc.id}:`, JSON.stringify(d));
    });
  } else {
    console.log('  No standalone battleship-scores found for this UID.');
    // Check by displayName in case uid mismatch
    const bsByName = await db.collection('battleship-scores').get();
    bsByName.forEach(doc => {
      const d = doc.data();
      if ((d.displayName || '').toLowerCase().includes('neury')) {
        console.log(`  Found by name in battleship-scores: ${doc.id}:`, JSON.stringify(d));
      }
    });
  }

  // Step 3: Check course-scoped battleshipAI collection for each period
  console.log('\n=== Checking courses/{courseId}/battleshipAI/{uid} ===');
  for (const courseId of AI_LITERACY_COURSE_IDS) {
    const label = PERIOD_LABELS[courseId] || courseId;
    const docRef = db.doc(`courses/${courseId}/battleshipAI/${neurydUID}`);
    const snap = await docRef.get();
    if (snap.exists) {
      console.log(`  [${label}] FOUND:`, JSON.stringify(snap.data()));
    } else {
      console.log(`  [${label}] not found`);
    }
  }

  // Step 4: Check progress/{uid}/courses/{courseId}/activities/battleship-ai
  console.log('\n=== Checking progress/{uid}/courses/{courseId}/activities/battleship-ai ===');
  for (const courseId of AI_LITERACY_COURSE_IDS) {
    const label = PERIOD_LABELS[courseId] || courseId;
    const docRef = db.doc(`progress/${neurydUID}/courses/${courseId}/activities/battleship-ai`);
    const snap = await docRef.get();
    if (snap.exists) {
      console.log(`  [${label}] FOUND:`, JSON.stringify(snap.data()));
    } else {
      console.log(`  [${label}] not found`);
    }
  }

  // Step 5: List ALL activities in progress for this student (for any AI literacy course)
  console.log('\n=== All progress activities for this student ===');
  for (const courseId of AI_LITERACY_COURSE_IDS) {
    const label = PERIOD_LABELS[courseId] || courseId;
    const activitiesSnap = await db.collection(`progress/${neurydUID}/courses/${courseId}/activities`).get();
    if (!activitiesSnap.empty) {
      console.log(`  [${label}] Activities:`);
      activitiesSnap.forEach(doc => {
        const d = doc.data();
        console.log(`    ${doc.id}: score=${d.score}, completed=${d.completed}, pct=${d.pct}`);
      });
    } else {
      console.log(`  [${label}] No activities`);
    }
  }

  // Step 6: Check which period the student is enrolled in
  console.log('\n=== Enrollment check ===');
  const enrollSnap2 = await db.collection('enrollments').where('uid', '==', neurydUID).get();
  if (!enrollSnap2.empty) {
    enrollSnap2.forEach(doc => {
      const d = doc.data();
      console.log(`  Enrolled in courseId: ${d.courseId} (${PERIOD_LABELS[d.courseId] || d.courseId})`);
    });
  } else {
    console.log('  No enrollments found for this UID');
  }
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
