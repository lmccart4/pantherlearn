export function getURLParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    studentId: params.get('studentId'),
    courseId: params.get('courseId'),
    blockId: params.get('blockId'),
  };
}

export function sendScoreToPantherLearn(score, maxScore) {
  const params = getURLParams();
  const payload = {
    type: 'activityScore',
    activityId: 'neural-network-lab',
    studentId: params.studentId,
    courseId: params.courseId,
    blockId: params.blockId,
    score,
    maxScore,
    completedAt: new Date().toISOString(),
  };
  try {
    window.parent.postMessage(payload, '*');
  } catch (e) {
    console.log('Not embedded in PantherLearn, skipping postMessage');
  }
  console.log('🧠 Score reported:', payload);
}
