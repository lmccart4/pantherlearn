module.exports = {
  printableFilename: 'synthesis-scenario-deck.html',
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
      title: 'Materials (teacher prep ~3 min, reusable)',
      content: '- 4 judge signs (B&W, large type, reusable)\n- Scenario deck (20 cards, B&W, reusable)\n- Open U-shape of desks',
    },
    {
      type: 'text',
      id: 'tx-handson-instructions',
      content: '### How it works\n\nPush desks into a U-shape. 4 students stand at 4 labeled spots around the open space:\n\n- **Judge Benefit** — "Who benefits from this AI deployment?"\n- **Judge Cost** — "Who bears the cost or the risk when it fails?"\n- **Judge Transparency** — "Can anyone see how it works? Who can\'t?"\n- **Judge Contest** — "If it hurts you, can you challenge the outcome? How?"\n\nDraw a scenario card from the deck. The **Proposer** walks to each judge in turn and answers their question out loud.\n\nEach judge says "clear" or "push back" — if push back, the proposer must refine their answer. Rotate proposer after each scenario.\n\n### Debrief\n\n- Which of the four questions was hardest to answer most of the time?\n- Which question did students push back on most?\n- If you had to add a fifth question, what would it be and why?',
    },
    {
      type: 'callout',
      id: 'co-handson-debrief',
      variant: 'reflection',
      title: 'Wrap-up question',
      content: "Pick any AI tool you've used this week (inside or outside school). Run it through all four questions silently. Which question do you not have a good answer for?",
    },
    {
      type: 'external_link',
      id: 'ext-handson-printable-signs',
      url: '/printables/ai-literacy/unit5/synthesis-judge-signs.html',
      title: 'Printable: 4 Judge Signs',
      description: '4 landscape pages, B&W. Reusable — laminate once.',
      buttonLabel: 'Open judge signs',
    },
    {
      type: 'external_link',
      id: 'ext-handson-printable-deck',
      url: '/printables/ai-literacy/unit5/synthesis-scenario-deck.html',
      title: 'Printable: 20-Card Scenario Deck',
      description: '1 page, B&W. Reusable.',
      buttonLabel: 'Open scenario deck',
    },
  ],
};
