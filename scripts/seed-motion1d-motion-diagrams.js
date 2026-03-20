// seed-motion1d-motion-diagrams.js
// Creates "Motion Diagrams" lesson (Unit 2: Motion in 1D, Lesson 6)
// Run: node scripts/seed-motion1d-motion-diagrams.js
// Modeling/inquiry — connecting all 3 representations: p-t, v-t, motion diagram

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Motion Diagrams",
  questionOfTheDay: "If you took a photo of a moving object every second and laid all the photos in a row, what would the spacing between the object's positions tell you about its speed?",
  course: "Physics",
  unit: "Motion in 1D",
  order: 6,
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
      content: "**Question of the Day:** If you took a photo of a moving object every second and laid all the photos in a row, what would the spacing between the object's positions tell you about its speed?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "You've seen p-t graphs and v-t graphs. Motion diagrams are the third way to represent motion. Before we define them: what do you think a 'motion diagram' might look like based on the question above? Make a prediction.",
      placeholder: "I think a motion diagram shows... because...",
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
        "Describe what a motion diagram shows (dots + velocity arrows at equal time intervals)",
        "Interpret dot spacing as speed: close dots = slow, wide dots = fast",
        "Draw motion diagrams for constant speed, speeding up, slowing down, and direction change",
        "Connect motion diagrams to p-t and v-t graphs for the same motion",
        "Match a motion diagram to its corresponding v-t graph"
      ]
    },

    // ═══════════════════════════════════════════
    // WHAT IS A MOTION DIAGRAM
    // ═══════════════════════════════════════════
    {
      id: "section-intro",
      type: "section_header",
      icon: "📸",
      title: "What is a Motion Diagram?",
      subtitle: "~10 minutes"
    },
    {
      id: "callout-lab-ref",
      type: "callout",
      style: "scenario",
      icon: "🧪",
      content: "**Class Reference:** Motion diagrams were practiced in class on Nov 24 (Practice: Motion Diagrams) and Nov 26 (Physics Classroom Interactives). Think of them as 'stroboscopic photography' — a flash goes off at equal time intervals and you record the object's position each time."
    },
    {
      id: "b-motion-diagram-intro",
      type: "text",
      content: "A **motion diagram** is a visual representation of an object's motion at equal time intervals.\n\n### Components:\n1. **Dots** — each dot marks the object's position at one time interval\n2. **Velocity arrows** — arrows at each dot point in the direction of motion, with length proportional to speed\n3. **Equal time intervals** — the time gap between dots is always the same\n\n### Reading the Dots:\n- **Evenly spaced dots** → constant speed\n- **Dots getting farther apart** → speeding up (accelerating)\n- **Dots getting closer together** → slowing down (decelerating)\n- **Direction of arrows reverses** → object changed direction"
    },
    {
      id: "b-four-examples",
      type: "text",
      content: "### Four Types of Motion Diagrams\n\n**1. Constant speed (moving right):**\n```\n• → • → • → • → • →\n```\nDots evenly spaced. All arrows same length, same direction.\n\n**2. Speeding up (moving right):**\n```\n•→ • →  •  →    •    →\n```\nDots spreading apart. Arrows getting longer.\n\n**3. Slowing down (moving right):**\n```\n•    →    •  →  • →  •→\n```\nDots getting closer. Arrows getting shorter.\n\n**4. Direction change (moves right, turns around, comes back):**\n```\n•→ •→ •→ [stops] ←• ←• ←•\n```\nDots spread right, bunch up at turnaround, then spread left. Arrows flip direction."
    },
    {
      id: "q-reading-dots",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A motion diagram shows 5 dots spaced very close together, then 3 dots spaced very far apart. What does this describe?",
      options: [
        "Object moving slowly, then speeding up",
        "Object moving fast, then slowing down",
        "Object at rest, then moving",
        "Object moving backward, then forward"
      ],
      correctIndex: 0,
      explanation: "Close dots = slow speed (object doesn't move much between time intervals). Wide spacing = fast speed. So: slowly first, then fast = speeding up.",
      difficulty: "understand"
    },
    {
      id: "q-draw-diagram",
      type: "question",
      questionType: "short_answer",
      prompt: "Describe (in words or ASCII) the motion diagram for a car that: starts at rest, accelerates for 3 seconds, cruises at constant speed for 3 seconds, then brakes to a stop in 2 seconds.",
      placeholder: "Phase 1 (accelerating): dots are... arrows are... Phase 2 (constant): dots are... Phase 3 (braking): dots are... arrows are...",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // THREE REPRESENTATIONS
    // ═══════════════════════════════════════════
    {
      id: "section-three-reps",
      type: "section_header",
      icon: "🔗",
      title: "The Three Representations",
      subtitle: "~15 minutes"
    },
    {
      id: "b-three-reps",
      type: "text",
      content: "### P-T Graph, V-T Graph, and Motion Diagram — All Describe the Same Motion\n\nFor the same motion (object moves right slowly, then right faster):\n\n**P-T Graph:**\n- Upward line, then steeper upward line\n- Both segments are straight (constant velocities)\n- The second segment is steeper (faster)\n\n**V-T Graph:**\n- Flat line at low v, then jumps to flat line at higher v\n- Horizontal lines in both segments (constant v)\n- Gap between shows the speed increase\n\n**Motion Diagram:**\n- Evenly spaced dots, then wider-spaced dots\n- Arrows same length in phase 1, longer in phase 2\n\nAll three are showing you the same physical reality — just in different visual languages."
    },
    {
      id: "q-match-diagrams",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A v-t graph shows velocity starting high and decreasing linearly to zero. Which motion diagram matches this?",
      options: [
        "Evenly spaced dots with same-length arrows",
        "Dots getting farther apart with lengthening arrows",
        "Dots getting closer together with shortening arrows",
        "Dots with arrows pointing left, then right"
      ],
      correctIndex: 2,
      explanation: "Decreasing velocity = slowing down. Slowing down = dots getting closer together (less distance per time interval) and arrows getting shorter (smaller velocity vector). The object is decelerating to a stop.",
      difficulty: "apply"
    },
    {
      id: "q-three-reps-apply",
      type: "question",
      questionType: "short_answer",
      prompt: "A motion diagram has 4 dots close together, then 4 dots spaced widely apart (all moving the same direction).\n\n(a) What is this motion in words?\n(b) What does the corresponding p-t graph look like?\n(c) What does the corresponding v-t graph look like?",
      placeholder: "(a) In words: ... (b) P-t graph: ... (c) V-t graph: ...",
      difficulty: "analyze"
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
      content: "Today's key takeaways:\n\n- **Motion diagram** = dots at equal time intervals + velocity arrows\n- **Wide spacing** = fast; **Close spacing** = slow; **Changing spacing** = acceleration\n- All three representations (p-t graph, v-t graph, motion diagram) describe the same motion\n- Being able to translate between all three is a core physics skill\n\n**Next up:** Free Fall — what happens when the only force is gravity?"
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: A motion diagram has 4 dots close together, then 4 dots spaced far apart (same direction throughout). Describe this motion in words. What does the v-t graph look like?",
      placeholder: "Motion in words: ... V-t graph shows: ...",
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
        { term: "Motion Diagram", definition: "A visual representation of motion at equal time intervals. Shows position as dots and velocity as arrows." },
        { term: "Dot Spacing", definition: "The distance between consecutive dots in a motion diagram. Wide spacing = fast; close spacing = slow; changing spacing = acceleration." },
        { term: "Velocity Arrow", definition: "An arrow at each dot in a motion diagram pointing in the direction of motion with length proportional to speed." },
        { term: "Three Representations", definition: "P-T graph, V-T graph, and motion diagram — three different ways to describe the same motion. Being able to translate between them is a key physics skill." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("physics")
      .collection("lessons").doc("motion1d-motion-diagrams")
      .set(lesson);
    console.log('✅ Lesson "Motion Diagrams" seeded successfully!');
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
