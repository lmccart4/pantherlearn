module.exports = {
  printableFilename: null,
  blocks: [
    {
      type: 'callout',
      id: 'co-education-discussion',
      variant: 'teacher-note',
      title: 'Post-activity discussion prompt',
      content: 'After students finish: ask the class which "Install" tool had the most disagreement, and which "Ban" tool the class was most unanimous on. Then: which one would you change your vote on if the bias story from the COMPAS lesson was in your mind?',
    },
  ],
  replacesFinalSortingItems: true,
  newSortingTitle: "Design This Classroom",
  newSortingInstructions: "You're on the student advisory board for our district's AI policy. Swipe each tool to the side you'd vote for. You'll have to defend your picks to the board.",
  newSortingLeftLabel: "Install it",
  newSortingRightLabel: "Ban it",
  newSortingItems: [
    { text: "AI tutor that explains math step-by-step when you get stuck", correct: "left" },
    { text: "Webcam AI that tracks your eye movement during tests and flags you if you look away", correct: "right" },
    { text: "Writing feedback bot that marks up your essay drafts before you turn them in", correct: "left" },
    { text: "Plagiarism/AI-detection scanner that auto-flags assignments, no appeal", correct: "right" },
    { text: "Adaptive quizzes that get harder or easier based on how you're doing", correct: "left" },
    { text: "Behavior-monitoring AI that logs every off-task second and emails parents weekly", correct: "right" },
    { text: "Voice-coach AI that helps English learners practice pronunciation privately", correct: "left" },
    { text: "Attendance AI that identifies each student by face when they walk in the door", correct: "right" },
  ],
};
