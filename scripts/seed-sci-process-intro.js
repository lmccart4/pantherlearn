// seed-sci-process-intro.js
// Creates "What is Science? The Scientific Process" lesson (Unit 0: Scientific Process, Lesson 1)
// Run: node scripts/seed-sci-process-intro.js
// Inquiry style — what science is/isn't, observation vs. inference, variables

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "What is Science? The Scientific Process",
  questionOfTheDay: "A student notices the cafeteria gets louder on Fridays. Is this a scientific observation? Can it be scientifically investigated? What would that look like?",
  course: "Physics",
  unit: "Scientific Process",
  order: 1,
  visible: false,
  dueDate: null,
  blocks: [

    // ═══════════════════════════════════════════
    // WARM UP
    // ═══════════════════════════════════════════
    {
      id: "section-warmup",
      type: "section_header",
      icon: "🏃",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** A student notices the cafeteria gets louder on Fridays. Is this a scientific observation? Can it be scientifically investigated? What would that look like?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "What do you think 'science' actually is? Write your best definition without looking anything up. What makes something 'scientific'?",
      placeholder: "Science is... A question is scientific if...",
      difficulty: "recall"
    },

    // ═══════════════════════════════════════════
    // OBJECTIVES
    // ═══════════════════════════════════════════
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Define science and distinguish it from opinion, pseudoscience, and other ways of knowing",
        "Explain why science is iterative (not a fixed linear 'method')",
        "Distinguish between an observation and an inference",
        "Identify independent, dependent, and controlled variables",
        "Write an investigable scientific question"
      ]
    },

    // ═══════════════════════════════════════════
    // WHAT IS SCIENCE
    // ═══════════════════════════════════════════
    {
      id: "section-what-is-science",
      type: "section_header",
      icon: "🔭",
      title: "What Science Is (and Isn't)",
      subtitle: "~10 minutes"
    },
    {
      id: "b-science-intro",
      type: "text",
      content: "Science is not a list of facts. Science is a **process** for understanding the natural world through systematic observation and testing.\n\n### What Makes Something Scientific?\n\n- It involves the **natural world** (not the supernatural)\n- It produces **testable predictions** — you can design an experiment to check them\n- It is **falsifiable** — there must be some result that could prove it wrong\n- It is **repeatable** — others can run the same investigation and check your results\n\n### What Science Is NOT:\n\n- **Opinion:** \"This is the best type of pizza.\" (Can't be tested experimentally)\n- **Pseudoscience:** Claims that look scientific but aren't testable or falsifiable (astrology, certain health claims)\n- **Supernatural claims:** Science only investigates natural causes\n- **Absolute truth:** Scientific knowledge is always provisional — better evidence changes our understanding"
    },
    {
      id: "b-iterative",
      type: "text",
      content: "### The Myth of the 'Scientific Method'\n\nYou may have learned a step-by-step 'Scientific Method' in middle school:\n1. Question → 2. Hypothesis → 3. Experiment → 4. Results → 5. Conclusion\n\nReal science is messier. Scientists:\n- Go back and redesign experiments when results are surprising\n- Revise hypotheses many times\n- Build on other people's work\n- Argue and debate before reaching consensus\n\nScience is an **iterative cycle** — not a single pass-through of steps. Each answer leads to more questions."
    },
    {
      id: "q-science-or-not",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Which of the following is a scientific question that could be investigated?",
      options: [
        "Is it wrong to lie?",
        "Does listening to music while studying improve test scores?",
        "Why is the sky beautiful?",
        "Will the Jets ever win the Super Bowl?"
      ],
      correctIndex: 1,
      explanation: "Question B is scientific: it involves the natural world, produces a testable prediction, and you could design an experiment (study group with music vs. without, measure test scores). Questions A and C are value judgments. Question D is a prediction about future events, not a testable scientific claim.",
      difficulty: "apply"
    },
    {
      id: "q-science-or-not-2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A claim says: 'Crystal healing can cure illness.' Is this a scientific claim?",
      options: [
        "Yes — people have tested it and it works",
        "No — it's not about the natural world",
        "It could be scientific if we designed a proper controlled experiment to test it",
        "No — science is only about physics and chemistry"
      ],
      correctIndex: 2,
      explanation: "Whether crystal healing works IS a scientific question — it involves the natural world and is testable. The issue is that controlled studies consistently show no effect beyond placebo. The problem isn't that it can't be studied scientifically — it has been. The problem is that the evidence doesn't support it.",
      difficulty: "analyze"
    },

    // ═══════════════════════════════════════════
    // OBSERVATION VS INFERENCE
    // ═══════════════════════════════════════════
    {
      id: "section-obs-inf",
      type: "section_header",
      icon: "👁️",
      title: "Observation vs. Inference",
      subtitle: "~8 minutes"
    },
    {
      id: "b-obs-inf",
      type: "text",
      content: "Scientists constantly need to distinguish between what they **directly observe** and what they **interpret**.\n\n**Observation:** Something you directly detect with your senses or instruments, with no interpretation.\n- \"The thermometer reads 37°C.\"\n- \"The liquid turned blue.\"\n- \"The ball hit the ground in 2.1 seconds.\"\n\n**Inference:** An interpretation or conclusion you draw from observations. It goes beyond what you directly see.\n- \"The patient has a fever.\" (interpretation of 37°C — is that a fever? Depends on context)\n- \"The substance is basic.\" (inference from color change — you didn't observe the pH directly)\n- \"Gravity is pulling the ball.\" (inference — you observed the motion)\n\nGood science separates these carefully. Observations are more objective. Inferences can be wrong."
    },
    {
      id: "b-def-obs",
      type: "definition",
      term: "Observation",
      definition: "Direct detection of something using the senses or instruments, without interpretation. Observations are as objective as possible."
    },
    {
      id: "b-def-inf",
      type: "definition",
      term: "Inference",
      definition: "An explanation or conclusion drawn from observations. Inferences go beyond the raw data and may be incorrect — they must be tested."
    },
    {
      id: "q-obs-inf",
      type: "question",
      questionType: "multiple_choice",
      prompt: "\"The car's tire tracks in the mud show it was going very fast.\" Is this an observation or an inference?",
      options: [
        "Observation — you can see the tire tracks",
        "Inference — you're interpreting the track depth/spacing to conclude speed",
        "Both equally",
        "Neither — this is an opinion"
      ],
      correctIndex: 1,
      explanation: "Seeing the tire tracks is the observation. Concluding the car was going fast is an inference — you're interpreting the track pattern. The tracks might have been made slowly in thick mud. The 'speed' conclusion goes beyond what you directly see.",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // VARIABLES
    // ═══════════════════════════════════════════
    {
      id: "section-variables",
      type: "section_header",
      icon: "🔬",
      title: "Variables: The Heart of Experimental Design",
      subtitle: "~10 minutes"
    },
    {
      id: "b-variables",
      type: "text",
      content: "To investigate a question scientifically, you change ONE thing at a time and measure what happens. This requires identifying your variables:\n\n**Independent Variable (IV):** The factor you deliberately change.\n- \"What I change on purpose\"\n- Also called the manipulated variable\n\n**Dependent Variable (DV):** The factor you measure to see what happens.\n- \"What I observe/record\"\n- Depends on the independent variable\n- Also called the responding variable\n\n**Controlled Variables:** Everything else that you keep the same.\n- These prevent other factors from affecting your results\n- The more controlled variables, the more valid your experiment\n\n### Example:\n*Investigation: Does more sleep improve test scores?*\n- IV: hours of sleep (what you change)\n- DV: test score (what you measure)\n- Controlled: same subject, same test difficulty, same study time, same day of week..."
    },
    {
      id: "q-variables-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A student investigates whether taller plants produce more fruit. Plants are grown in identical conditions except they are different heights. What is the independent variable?",
      options: [
        "Amount of fruit produced",
        "Height of the plant",
        "Amount of water given",
        "Type of plant"
      ],
      correctIndex: 1,
      explanation: "The independent variable is what the experimenter deliberately selects or changes — plant height. The dependent variable (what is measured) is the amount of fruit produced. Water amount and plant type are controlled variables.",
      difficulty: "apply"
    },
    {
      id: "q-variables-2",
      type: "question",
      questionType: "short_answer",
      prompt: "A student wants to test whether the color of light affects plant growth. Design the experiment. Identify: (a) Independent variable, (b) Dependent variable, (c) Three controlled variables that must be kept constant.",
      placeholder: "(a) IV: ... (b) DV: ... (c) Controlled: 1. ... 2. ... 3. ...",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // WRAP UP
    // ═══════════════════════════════════════════
    {
      id: "section-wrapup",
      type: "section_header",
      icon: "🎯",
      title: "Wrap Up",
      subtitle: "~5 minutes"
    },
    {
      id: "b-summary",
      type: "text",
      content: "Today's key takeaways:\n\n- **Science** investigates the natural world through testable, falsifiable, repeatable methods\n- Science is NOT a rigid linear method — it's iterative\n- **Observation** = direct detection; **Inference** = interpretation beyond the data\n- **IV** = what you change; **DV** = what you measure; **Controlled variables** = everything kept constant\n- Good scientific questions are testable (you can design an experiment)\n\n**Next up:** Measurement and Units — how we collect and report data precisely."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: Write an investigable scientific question about something in your daily life. Identify what would be the independent variable and dependent variable if you studied it.",
      placeholder: "My question: ... IV: ... DV: ...",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // VOCABULARY
    // ═══════════════════════════════════════════
    {
      id: "section-vocab",
      type: "section_header",
      icon: "📖",
      title: "Key Vocabulary",
      subtitle: ""
    },
    {
      id: "vocab",
      type: "vocab_list",
      terms: [
        { term: "Science", definition: "A process for understanding the natural world through systematic observation and testing. Produces knowledge that is testable, falsifiable, and repeatable." },
        { term: "Hypothesis", definition: "A testable, falsifiable prediction about the outcome of an investigation. Must be written so it can be proven wrong." },
        { term: "Observation", definition: "Direct detection of something using senses or instruments, without interpretation." },
        { term: "Inference", definition: "An explanation or conclusion drawn from observations. Goes beyond the data — must be tested." },
        { term: "Independent Variable (IV)", definition: "The variable that is deliberately changed in an experiment. What the experimenter controls." },
        { term: "Dependent Variable (DV)", definition: "The variable that is measured to see the effect of the IV. What changes in response." },
        { term: "Controlled Variables", definition: "Variables held constant during an experiment to prevent them from affecting results." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("physics")
      .collection("lessons").doc("sci-process-intro")
      .set(lesson);
    console.log('✅ Lesson "What is Science? The Scientific Process" seeded successfully!');
    console.log(`   📦 ${lesson.blocks.length} blocks`);
    console.log(`   📘 Course: ${lesson.course}`);
    console.log(`   📂 Unit: ${lesson.unit}`);
    console.log(`   🔢 Order: ${lesson.order}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding lesson:", err);
    process.exit(1);
  }
}

seed();
