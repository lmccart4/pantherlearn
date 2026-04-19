module.exports = {
  printableFilename: null,
  blocks: [
    {
      type: 'callout',
      id: 'co-climate-physical-option',
      variant: 'teacher-note',
      title: 'Optional physical version (prep ~5 min)',
      content: 'Hand each student 20 chips/pennies/beans. For each scenario the class reads aloud, students drop a chip in the "Benefit" or "Cost" container at the front. Great when you want a big visible class vote on a close call.',
    },
  ],
  replacesFinalSortingItems: true,
  newSortingTitle: "The Carbon Ledger",
  newSortingInstructions: "Every AI use has a carbon ledger — energy spent (cost) and emissions avoided (benefit). Swipe each scenario to its net column. Not every 'green' use is actually green.",
  newSortingLeftLabel: "Net climate BENEFIT",
  newSortingRightLabel: "Net climate COST",
  newSortingItems: [
    { text: "AI adjusting 50,000 wind turbine angles to squeeze 20% more power from existing turbines", correct: "left" },
    { text: "A data center burning 1.2 GWh to train a model that writes wedding speeches", correct: "right" },
    { text: "AI spotting illegal logging in rainforests from satellite photos", correct: "left" },
    { text: "Crypto-mining-adjacent AI models running 24/7 on coal power in West Texas", correct: "right" },
    { text: "AI optimizing routes for 200,000 delivery trucks, cutting fuel burn 8%", correct: "left" },
    { text: "A model generating throwaway images for social media ads at 3W per image", correct: "right" },
    { text: "AI forecasting peak electricity demand so utilities can ramp renewables first", correct: "left" },
    { text: "A chatbot doing homework shortcuts on 200M queries per day", correct: "right" },
  ],
};
