// Lesson content for "Seeing Attention in Action: The Attention Visualizer"
// AI Literacy — Foundations of Generative AI, Lesson 11

export const LESSON = {
  title: "Seeing Attention in Action",
  subtitle: "The Attention Visualizer",
  course: "Foundations of Generative AI",
  unit: "Lesson 11",
  estimatedTime: "~40 minutes",

  sections: [
    {
      id: "warmup",
      label: "Warm Up",
      icon: "🔥",
      color: "warmup",
      time: "~10 min",
      blocks: [
        {
          id: "b1",
          type: "text",
          content: "Read these two sentences:\n\n1. **\"I need to go to the bank to deposit my check.\"**\n2. **\"We sat on the bank and watched the ducks swim by.\"**\n\nThe word **\"bank\"** appears in both sentences — but it means something completely different each time.",
        },
        {
          id: "b2",
          type: "question",
          questionType: "short_answer",
          prompt: "Which SPECIFIC words in each sentence tell you what \"bank\" means? List at least 2 words for each sentence.",
          placeholder: "In sentence 1, the words ___ and ___ tell me bank means...\nIn sentence 2, the words ___ and ___ tell me bank means...",
        },
        {
          id: "b3",
          type: "callout",
          icon: "🧠",
          style: "insight",
          content: "**You just did what the attention mechanism does!** You looked at the OTHER words in each sentence and used them to figure out the meaning of an ambiguous word. The attention mechanism does the same thing — it assigns \"weights\" to each word showing how much it matters for understanding the target word.",
        },
        {
          id: "b4",
          type: "text",
          content: "Remember from our previous lessons:\n\n- **Embeddings** give each word a set of numbers representing its meanings\n- **Neural networks** process the relationships between words\n- **Attention** is the specific process that updates a word's meaning by looking at context\n\nToday, you'll actually SEE attention in action — with arrows showing which words the model focuses on.",
        },
      ],
    },

    {
      id: "main",
      label: "Main Activity",
      icon: "📚",
      color: "main-activity",
      time: "~25 min",
      blocks: [
        {
          id: "b5",
          type: "definition",
          term: "Attention Weight",
          definition: "A number (0% to 100%) showing how much one word \"pays attention to\" another word when determining meaning. Higher weight = that word matters more for understanding the target word.",
        },
        {
          id: "b6",
          type: "text",
          content: "In this activity, you'll work through **9 scenarios** across **3 stages**:\n\n**Stage 1 — Observe:** Watch attention arrows show you which words matter most.\n**Stage 2 — Predict:** Click which words YOU think the attention mechanism will focus on, then check your answer.\n**Stage 3 — Challenge:** Tackle tricky sentences with idioms, repeated words, and competing meanings.",
        },
        {
          id: "b7",
          type: "visualizer",
          caption: "Attention Visualizer — 9 scenarios across 3 stages",
        },
      ],
    },

    {
      id: "wrapup",
      label: "Socratic Wrap Up",
      icon: "🎯",
      color: "wrapup",
      time: "~5 min",
      blocks: [
        {
          id: "b8",
          type: "question",
          questionType: "short_answer",
          prompt: "In the activity, you saw sentences where the same word (\"bat,\" \"bank,\" \"spring\") had completely different attention patterns. In your own words, explain WHY the attention weights changed — what was different between the sentences?",
          placeholder: "The attention weights changed because...",
        },
        {
          id: "b9",
          type: "question",
          questionType: "short_answer",
          prompt: "The Challenge stage included the sentence \"The patient doctor treated the patient with care.\" The word \"patient\" appeared twice with different meanings. Why is this especially hard for an AI, and how does attention help solve it?",
          placeholder: "This is hard because...",
        },
        {
          id: "b10",
          type: "question",
          questionType: "multiple_choice",
          prompt: "Consider the sentence: \"She saw the man with the telescope.\" This sentence is ambiguous — did she use a telescope to see the man, or did she see a man who had a telescope? How would the attention mechanism handle this?",
          options: [
            "It can't — the sentence is too ambiguous for any AI",
            "It would look at surrounding context (previous sentences, the topic) to assign higher weight to one interpretation",
            "It would randomly pick one meaning",
            "It would refuse to process the sentence",
          ],
          correctIndex: 1,
          explanation: "This is exactly the kind of ambiguity that attention handles! In a real text, there would be surrounding context — previous sentences, the topic, other details — that the attention mechanism would use to determine the more likely interpretation. Without that context, even AI struggles with sentences like this.",
        },
        {
          id: "b11",
          type: "vocab_list",
          title: "Key Vocabulary",
          terms: [
            {
              term: "Attention Weight",
              definition: "A number (0%–100%) showing how much one word \"pays attention to\" another when determining meaning.",
            },
            {
              term: "Context Window",
              definition: "All the words the model can \"see\" at once when making predictions. Longer windows let the model consider more surrounding text.",
            },
            {
              term: "Disambiguation",
              definition: "The process of determining which meaning of a word is intended based on context. Example: \"bank\" → financial institution vs. edge of a river.",
            },
            {
              term: "Positional Encoding",
              definition: "How the model tracks word ORDER in a sentence. \"The patient doctor\" is different from \"the doctor's patient\" because position matters.",
            },
          ],
        },
      ],
    },
  ],
};
