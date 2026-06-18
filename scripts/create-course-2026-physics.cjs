// create-course-2026-physics.cjs — creates the NEW 2026-27 physics course doc.
// GATED: do not run until Luke confirms the courseId. Idempotent (won't clobber if it exists).
// Schema mirrors the live `physics` course doc (verified read 2026-06-18):
//   title (NOT name), description, ownerUid, icon, order, sections{}, evidenceConfig, coTeachers[], updatedAt.
//   A course doc has no `subject`/`visible` field — lessons carry visibility.
//   Enrollment (sections + enrollCodes) is configured by Luke in the teacher UI → seed empty sections.
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();

const COURSE_ID = 'physics-2026'; // CONFIRM id with Luke before running
const OWNER_UID = 'M2sNE8iH1aZ57L8z8Snp1Sj8cFD2'; // Luke (copied from the live `physics` course doc)

const course = {
  title: 'Physics (2026–27)',
  description: 'OpenSciEd-based HS Physics, rebuilt for 2026–27. Unit 1: Energy & the Grid.',
  ownerUid: OWNER_UID,
  icon: '⚡',
  order: 2,
  sections: {},
  coTeachers: [],
  evidenceConfig: { prompt: 'Upload a photo of your work and reflect on what you learned today.', enabled: true },
  updatedAt: admin.firestore.FieldValue.serverTimestamp(),
};

(async () => {
  const ref = db.collection('courses').doc(COURSE_ID);
  const snap = await ref.get();
  if (snap.exists) { console.log(`Course ${COURSE_ID} already exists — leaving as-is.`); process.exit(0); }
  await ref.set(course);
  console.log(`Created course ${COURSE_ID}: "${course.title}" (owner ${OWNER_UID}). Configure sections/enroll codes in the teacher UI.`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
