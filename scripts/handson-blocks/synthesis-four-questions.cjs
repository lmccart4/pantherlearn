module.exports = {
  obsoleteBlockIds: ['ext-handson-printable-signs', 'ext-handson-printable-deck'],
  blocks: [
    {
      type: 'section_header',
      id: 'sh-handson',
      label: 'Hands-On Activity',
      title: 'Four Questions Courtroom',
    },
    {
      type: 'callout',
      id: 'co-handson-materials',
      variant: 'teacher-note',
      title: 'How to set up (groups of 4, ~2 min)',
      content: '- Form groups of 4. **Each group needs one device** (Chromebook or laptop) running the activity below.\n- Each student claims one of the four judge roles for the whole round — Benefit, Cost, Transparency, Contest.\n- The group draws 5 scenarios. Every student answers their question on every scenario, then the group decides a verdict together.\n- No standing, no walking, no rotation — every student is a judge the entire round.',
    },
    {
      type: 'text',
      id: 'tx-handson-instructions',
      content: '### How it works\n\nIn your group of 4, each person owns **one of the four questions** for the whole round:\n\n- **Judge Benefit** — Who benefits from this AI deployment?\n- **Judge Cost** — Who bears the cost or the risk when it fails?\n- **Judge Transparency** — Can anyone see how it works? Who can\'t?\n- **Judge Contest** — If it hurts you, can you challenge the outcome? How?\n\nThe activity deals you a scenario card. Each judge writes a short answer to their question. Then the group decides together: **Deploy as-is, Deploy with limits, or Don\'t deploy** — and writes one sentence explaining why.\n\nDo this for 5 scenarios. The activity scores you on completion (5/5).\n\n### While you play\n\n- Push back on each other. If a judge\'s answer feels too easy, say so — make them refine it.\n- The verdict is the *group\'s* call. You won\'t always agree. Argue it out.\n- Don\'t skip Transparency or Contest just because they\'re harder. They\'re harder for a reason.',
    },
    {
      type: 'embed',
      id: 'embed-synthesis-courtroom',
      url: 'https://pantherlearn.com/tools/synthesis-four-questions.html',
      caption: 'Pick your 4 judge roles, draw 5 scenarios, deliver verdicts together. Bilingual EN/ES. Submit when finished to complete the lesson.',
      height: 1100,
      scored: true,
      weight: 5,
    },
    {
      type: 'callout',
      id: 'co-handson-debrief',
      variant: 'reflection',
      title: 'After the round — talk it out',
      content: 'As a group, decide together: which of the four questions was hardest to answer, and why? Then on your own, pick any AI tool you\'ve used this week (inside or outside school) and run it through all four questions silently. Which question do you not have a good answer for?',
    },
  ],
};
