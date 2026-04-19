module.exports = {
  printableFilename: 'healthcare-case-cards.html',
  blocks: [
    {
      type: 'section_header',
      id: 'sh-handson',
      label: 'Hands-On Activity',
      title: 'Triage Line',
    },
    {
      type: 'callout',
      id: 'co-handson-materials',
      variant: 'teacher-note',
      title: 'Materials (teacher prep ~5 min)',
      content: '- Floor tape or masking tape (~10 ft strip)\n- Printed case card deck (B&W, 1 set for the room — see printable packet)\n- Open floor space at the front of the room',
    },
    {
      type: 'text',
      id: 'tx-handson-instructions',
      content: '### How it works\n\nTape a line on the floor. One end = **AI decides alone**. Other end = **Human doctor decides alone**.\n\nIn teams, draw a case card, read it aloud, then place the card on the line where the team thinks the decision should sit. Before releasing the card, the team must defend the placement in one sentence.\n\n### Debrief\n\n- Which cases clustered at the "AI" end? Why?\n- Which cases clustered at the "human" end? Why?\n- Which case had the biggest team disagreement? What was the hidden tension?',
    },
    {
      type: 'callout',
      id: 'co-handson-debrief',
      variant: 'reflection',
      title: 'Wrap-up question',
      content: 'When you placed a card toward the "AI" end, what would have to be true for you to move it toward "human"? When you placed it toward "human," what would move it toward "AI"?',
    },
    {
      type: 'callout',
      id: 'co-handson-printable',
      variant: 'teacher-note',
      title: 'Printable packet',
      content: 'File: `lesson-plans-public/ai-literacy/unit5-printables/healthcare-case-cards.html` — Open in Chrome, Cmd+P to print. 1 page, B&W, 1 set for the room.',
    },
  ],
};
