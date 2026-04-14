// One-off surgical patch 2026-04-14:
// Neury De La Rosa + Chris Raymond-Castillo (P9 AI Literacy) played content-moderator
// during P9 but didn't finish all 5 rounds (or didn't click through to final results),
// leaving embed.submitted=false and blocking Complete Lesson.
//
// Luke's direction: unlock their embed, grant them the Complete Lesson credit AND
// the Daily Reflection 1-point grade they would have earned from the completion
// modal, mark the lesson as completed. No block IDs touched.

const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
const { FieldValue } = admin.firestore;

const P9 = 'fUw67wFhAtobWFhjwvZ5';
const LESSON = 'content-moderator';
const LESSON_TITLE = 'Content Moderator: You Make the Call (Assessment Grade)';
const BLOCK_ID = 'embed-content-moderator';

const STUDENTS = [
  { uid: 'BjrE0l6EvgdKAAUrtngghwSipzn1', name: 'Neury De La Rosa' },
  { uid: 'MmjkSjKcMwawE59sz0LTu0nViRs2', name: 'Chris Raymond-Castillo' },
];

const TEACHER_GRANTED_NOTE = '(Teacher-granted: student did not reach the reflection modal — ran out of time at end of P9 on 2026-04-14.)';

async function main() {
  for (const s of STUDENTS) {
    console.log('\n=== Patching ' + s.name + ' ===');

    const progRef = db
      .collection('progress').doc(s.uid)
      .collection('courses').doc(P9)
      .collection('lessons').doc(LESSON);

    // 1. Flip embed submitted + mark lesson completed (single update, dotted paths)
    await progRef.update({
      ['answers.' + BLOCK_ID + '.submitted']: true,
      ['answers.' + BLOCK_ID + '.teacherUnlockedAt']: FieldValue.serverTimestamp(),
      completed: true,
      completedAt: FieldValue.serverTimestamp(),
      lastUpdated: FieldValue.serverTimestamp(),
    });
    console.log('  ✓ embed submitted:true + teacherUnlockedAt');
    console.log('  ✓ lesson completed:true');

    // 2. Daily Reflection gradebook entry (100/100 — same shape as LessonCompleteButton.finishLesson)
    const today = new Date().toISOString().slice(0, 10);
    await db.collection('courses').doc(P9).collection('grades').doc('reflection_' + s.uid + '_' + LESSON).set({
      studentId: s.uid,
      studentName: s.name,
      type: 'reflection',
      lessonId: LESSON,
      lessonTitle: LESSON_TITLE,
      response: TEACHER_GRANTED_NOTE,
      score: 100,
      maxScore: 100,
      date: today,
      gradedAt: FieldValue.serverTimestamp(),
      autoGraded: false,
      teacherGranted: true,
      category: 'Daily Reflection',
    });
    console.log('  ✓ Daily Reflection grade: 100/100');

    // 3. Reflections collection (read by MyGrades + StudentProgress)
    await db.collection('courses').doc(P9).collection('reflections').doc(s.uid + '_' + LESSON).set({
      studentId: s.uid,
      lessonId: LESSON,
      response: TEACHER_GRANTED_NOTE,
      valid: true,
      skipped: false,
      teacherGranted: true,
      savedAt: FieldValue.serverTimestamp(),
    });
    console.log('  ✓ Reflection doc (valid:true)');
  }

  // Verify
  console.log('\n=== Verification ===');
  for (const s of STUDENTS) {
    const p = await db.collection('progress').doc(s.uid).collection('courses').doc(P9).collection('lessons').doc(LESSON).get();
    const d = p.data();
    const g = await db.collection('courses').doc(P9).collection('grades').doc('reflection_' + s.uid + '_' + LESSON).get();
    const r = await db.collection('courses').doc(P9).collection('reflections').doc(s.uid + '_' + LESSON).get();
    console.log(s.name + ':');
    console.log('  embed.submitted:', d.answers[BLOCK_ID].submitted);
    console.log('  embed.score:', d.answers[BLOCK_ID].score);
    console.log('  embed.teacherUnlockedAt set:', !!d.answers[BLOCK_ID].teacherUnlockedAt);
    console.log('  lesson.completed:', d.completed);
    console.log('  reflection grade:', g.exists ? g.data().score + '/' + g.data().maxScore : 'MISSING');
    console.log('  reflection doc valid:', r.exists ? r.data().valid : 'MISSING');
  }
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
