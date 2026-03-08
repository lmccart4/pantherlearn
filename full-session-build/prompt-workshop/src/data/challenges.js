// src/data/challenges.js
// Each challenge gives students a goal and they must craft a prompt to achieve it.
// The AI responds to their prompt, then a JUDGE prompt evaluates success.

export const CHALLENGES = [
  // ===== STAGE 1: FOUNDATIONS — Clear instructions & formatting =====
  {
    id: "c1",
    stage: 1,
    title: "The Specific Request",
    difficulty: "easy",
    goal: "Get the AI to list exactly 5 fun facts about dolphins, numbered 1-5.",
    failExample: "Tell me about dolphins",
    failWhy: "Too vague — the AI might write paragraphs, give 3 facts or 10, not number them.",
    successHint: "Be explicit about the format (numbered list) and the exact count (5).",
    evaluationPrompt: `The student's goal was to get the AI to list exactly 5 fun facts about dolphins, numbered 1-5. Evaluate the AI's response. Score as follows:
- "perfect" if there are exactly 5 numbered facts about dolphins
- "partial" if there are facts about dolphins but the wrong count or no numbering
- "fail" if the response isn't about dolphins or doesn't contain a list
Respond with ONLY one word: perfect, partial, or fail.`,
    maxPoints: 10,
    concept: "specificity",
  },
  {
    id: "c2",
    stage: 1,
    title: "The Audience Shift",
    difficulty: "easy",
    goal: "Get the AI to explain photosynthesis in a way a 5-year-old would understand. No scientific jargon.",
    failExample: "Explain photosynthesis",
    failWhy: "Without specifying the audience, the AI defaults to a generic explanation full of terms like 'chlorophyll' and 'carbon dioxide.'",
    successHint: "Tell the AI WHO the explanation is for. Mention the age or reading level.",
    evaluationPrompt: `The student's goal was to get the AI to explain photosynthesis for a 5-year-old with no scientific jargon. Evaluate the AI's response. Score:
- "perfect" if the explanation is simple, uses no jargon (no chlorophyll, carbon dioxide, glucose, etc.), and would make sense to a young child
- "partial" if it's simplified but still uses some jargon or is too complex for a 5-year-old
- "fail" if it's a standard scientific explanation
Respond with ONLY one word: perfect, partial, or fail.`,
    maxPoints: 10,
    concept: "audience",
  },
  {
    id: "c3",
    stage: 1,
    title: "The Format Controller",
    difficulty: "easy",
    goal: "Get the AI to compare cats and dogs using a table with exactly 3 columns: Category, Cats, Dogs — with at least 4 rows.",
    failExample: "Compare cats and dogs",
    failWhy: "The AI might write paragraphs, use bullet points, or make a table with the wrong structure.",
    successHint: "Describe the exact table format you want — column names, minimum rows, and that it should be a markdown table.",
    evaluationPrompt: `The student's goal was a comparison table with columns Category/Cats/Dogs and at least 4 rows. Evaluate:
- "perfect" if there's a clear table with those 3 columns and 4+ comparison rows
- "partial" if there's a table but wrong columns or fewer than 4 rows
- "fail" if there's no table or the format is completely wrong
Respond with ONLY one word: perfect, partial, or fail.`,
    maxPoints: 10,
    concept: "formatting",
  },

  // ===== STAGE 2: INTERMEDIATE — Role-setting & constraints =====
  {
    id: "c4",
    stage: 2,
    title: "The Role Player",
    difficulty: "medium",
    goal: "Get the AI to respond as a pirate captain giving advice about doing homework. It should stay in character the entire time and use pirate language.",
    failExample: "Give me homework tips like a pirate would",
    failWhy: "Saying 'like a pirate would' often gets you a normal response with one 'arr' thrown in. The AI doesn't fully commit to the character.",
    successHint: "Tell the AI to BE the character, not just talk like one. Give the character a name, a backstory, and say 'stay in character throughout.'",
    evaluationPrompt: `The goal was for the AI to give homework advice as a pirate captain, fully in character with pirate language throughout. Evaluate:
- "perfect" if the response is fully in pirate character throughout, gives actual homework advice, and uses consistent pirate language/mannerisms
- "partial" if it starts pirate-like but breaks character, or only sprinkles in occasional pirate words
- "fail" if it's mostly a normal response with minimal pirate elements
Respond with ONLY one word: perfect, partial, or fail.`,
    maxPoints: 15,
    concept: "role_setting",
  },
  {
    id: "c5",
    stage: 2,
    title: "The Constraint Master",
    difficulty: "medium",
    goal: "Get the AI to write a short story (3-5 sentences) about a robot that contains ALL of these words: umbrella, telescope, purple, whisper. The story must be exactly 3-5 sentences long.",
    failExample: "Write a story about a robot with an umbrella",
    failWhy: "Missing 3 of the 4 required words, no length constraint, might get a whole page of text.",
    successHint: "List ALL constraints clearly: required words, sentence count range, and the topic.",
    evaluationPrompt: `The goal: a 3-5 sentence story about a robot containing ALL these words: umbrella, telescope, purple, whisper. Evaluate:
- "perfect" if the story is 3-5 sentences, about a robot, and contains all 4 words (umbrella, telescope, purple, whisper)
- "partial" if it's about a robot but missing 1-2 words or wrong length
- "fail" if it's missing 3+ words, wrong topic, or way off on length
Respond with ONLY one word: perfect, partial, or fail.`,
    maxPoints: 15,
    concept: "constraints",
  },
  {
    id: "c6",
    stage: 2,
    title: "The Negative Constraint",
    difficulty: "medium",
    goal: "Get the AI to explain why exercise is important WITHOUT using any of these words: health, body, weight, muscles, or fitness.",
    failExample: "Why is exercise important?",
    failWhy: "Without the constraint, every single one of those banned words will appear in the first sentence.",
    successHint: "Explicitly list the banned words and tell the AI it cannot use them under any circumstances.",
    evaluationPrompt: `The goal: explain why exercise is important without using: health, body, weight, muscles, or fitness. Evaluate:
- "perfect" if it explains exercise benefits without ANY of the 5 banned words (case-insensitive)
- "partial" if it uses 1 of the banned words
- "fail" if it uses 2 or more banned words
Respond with ONLY one word: perfect, partial, or fail.`,
    maxPoints: 15,
    concept: "negative_constraints",
  },

  // ===== STAGE 3: ADVANCED — Chain-of-thought & multi-step =====
  {
    id: "c7",
    stage: 3,
    title: "The Step-by-Step Thinker",
    difficulty: "hard",
    goal: "Get the AI to solve this problem AND show its work step by step: 'A store sells notebooks for $3 each. If you buy 5 or more, you get 20% off. Tax is 8%. How much do you pay for 7 notebooks?'",
    failExample: "How much do 7 notebooks cost if they're $3 each with 20% off for 5+ and 8% tax?",
    failWhy: "The AI might jump straight to the answer, possibly getting it wrong because it didn't think through each step.",
    successHint: "Tell the AI to 'think step by step' and show all calculations. Ask it to label each step clearly.",
    evaluationPrompt: `The goal: solve the notebook problem showing step-by-step work. Correct answer: 7 × $3 = $21, 20% off = $16.80, 8% tax = $1.344, total = $18.144 ≈ $18.14. Evaluate:
- "perfect" if it shows clear labeled steps AND arrives at approximately $18.14
- "partial" if it shows steps but gets a wrong answer, or gets the right answer without showing work
- "fail" if no steps shown and wrong answer
Respond with ONLY one word: perfect, partial, or fail.`,
    maxPoints: 20,
    concept: "chain_of_thought",
  },
  {
    id: "c8",
    stage: 3,
    title: "The Few-Shot Teacher",
    difficulty: "hard",
    goal: "Get the AI to convert sentences from passive voice to active voice. Give it 2 examples first, then have it convert: 'The cake was eaten by the children.'",
    failExample: "Convert this to active voice: The cake was eaten by the children",
    failWhy: "Without examples, the AI might not understand exactly what transformation you want, or might change the sentence in other ways too.",
    successHint: "Give 2 clear input→output examples BEFORE the actual task. This is called 'few-shot prompting' — teaching by example.",
    evaluationPrompt: `The goal: use few-shot examples to get the AI to convert "The cake was eaten by the children" to active voice. Correct: "The children ate the cake." Evaluate:
- "perfect" if the student's prompt included 2+ examples AND the AI correctly converted to "The children ate the cake" (or close equivalent)
- "partial" if it converted correctly but without examples in the prompt, or had examples but wrong conversion
- "fail" if the conversion is wrong or the response doesn't address the task
Respond with ONLY one word: perfect, partial, or fail.`,
    maxPoints: 20,
    concept: "few_shot",
  },
  {
    id: "c9",
    stage: 3,
    title: "The System Prompt Designer",
    difficulty: "hard",
    goal: "Write a prompt that makes the AI act as a strict writing tutor that ONLY gives feedback on grammar and spelling — refusing to help with content, ideas, or doing the writing for the student. Test it by asking it to 'write my essay about dogs.'",
    failExample: "You are a writing tutor. Help students with their writing.",
    failWhy: "Too vague — the AI will happily write the whole essay for the student instead of just giving grammar feedback.",
    successHint: "Define exactly what the tutor SHOULD do (grammar/spelling feedback) AND what it should NOT do (write content, give ideas, complete assignments). Include explicit refusal instructions.",
    evaluationPrompt: `The goal: create a prompt making the AI act as a grammar-only tutor that refuses to write content. When tested with "write my essay about dogs" it should decline and only offer grammar help. Evaluate:
- "perfect" if the AI clearly refuses to write the essay and instead offers to check grammar/spelling on writing the student provides
- "partial" if the AI partially refuses but still gives some content suggestions or ideas
- "fail" if the AI starts writing an essay about dogs
Respond with ONLY one word: perfect, partial, or fail.`,
    maxPoints: 20,
    concept: "system_design",
  },
];

export const STAGE_INTROS = {
  1: {
    title: "Stage 1: Foundations",
    subtitle: "Clarity, specificity, and formatting",
    description: "Good prompts are specific. You'll practice controlling WHAT the AI says, HOW it's formatted, and WHO it's speaking to. Each challenge shows you a bad prompt, explains why it fails, then lets you write a better one.",
    icon: "📝",
  },
  2: {
    title: "Stage 2: Advanced Techniques",
    subtitle: "Roles, constraints, and boundaries",
    description: "Now you'll learn to set roles (make the AI BE a character), apply constraints (required and banned words), and control the boundaries of what the AI will and won't do. These are the techniques that separate casual users from power users.",
    icon: "🎭",
  },
  3: {
    title: "Stage 3: Expert Prompting",
    subtitle: "Chain-of-thought, few-shot, and system design",
    description: "The most powerful prompting techniques: making the AI think step-by-step, teaching by example, and designing AI behavior from scratch. These are the same methods professional AI engineers use.",
    icon: "🧪",
  },
};
