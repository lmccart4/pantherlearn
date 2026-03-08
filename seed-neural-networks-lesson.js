// seed-neural-networks-lesson.js
// Run from your pantherlearn directory: node seed-neural-networks-lesson.js
// Goes right after the Embeddings lesson in Foundations of Generative AI

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "How AI Learns: Intro to Neural Networks",
  course: "AI Literacy",
  unit: "Foundations of Generative AI",
  order: 8,
  visible: false,
  blocks: [
    // ═══════════════════════════════════════════════════════
    // WARM UP
    // ═══════════════════════════════════════════════════════
    {
      id: "section-warmup",
      type: "section_header",
      title: "Warm Up",
      subtitle: "~10 minutes",
      icon: "🔥"
    },
    {
      id: "b0",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Explain how a neural network processes information through layers of connected neurons",
        "Demonstrate that a network's knowledge lives in its weights (connection strengths)",
        "Describe how training works: the network adjusts weights by learning from mistakes",
        "Identify real-world applications and limitations of neural networks (including bias and fragility)"
      ]
    },
    {
      id: "b1",
      type: "text",
      content: "Yesterday, you learned how AI turns words into numbers using **embeddings**. But once AI has those numbers... what does it actually *do* with them?\n\nToday you'll find out. You're going to **build a brain** — well, an artificial one. You'll wire up neurons, set connection strengths, and train it to learn from its mistakes. Welcome to the Neural Network Lab. 🧠⚡"
    },
    {
      id: "b2",
      type: "callout",
      icon: "🤔",
      style: "insight",
      content: "**Think About This:**\n\nYour brain has about 86 billion neurons, each connected to thousands of others. When you learn something new — like recognizing a friend's face — your brain doesn't download new code. Instead, it strengthens certain connections between neurons. AI neural networks work the same way."
    },
    {
      id: "q1",
      type: "question",
      questionType: "short_answer",
      prompt: "How do you think your brain 'learns' something new — like recognizing a friend's face in a crowd? What changes inside your head?",
      placeholder: "I think when we learn something new, our brain..."
    },

    // ═══════════════════════════════════════════════════════
    // MAIN INSTRUCTION
    // ═══════════════════════════════════════════════════════
    {
      id: "section-main",
      type: "section_header",
      title: "Main Instruction",
      subtitle: "~25 minutes",
      icon: "📚"
    },
    {
      id: "b3",
      type: "text",
      content: "Here's the big idea: a **neural network** is a system of connected nodes (\"neurons\") organized in **layers**. Information flows in from one side, gets transformed at each layer, and produces a decision on the other side.\n\nThe secret sauce? The **weights** — the strength of each connection. A strong connection means \"this input matters a lot.\" A weak connection means \"ignore this.\" When the network makes a mistake, it adjusts the weights to do better next time. That's learning."
    },
    {
      id: "d1",
      type: "definition",
      term: "Neural Network",
      definition: "A computing system inspired by the brain, made up of layers of connected nodes (neurons). Each connection has a weight that determines how much influence one neuron has on another. The network learns by adjusting these weights based on examples."
    },
    {
      id: "b4",
      type: "callout",
      icon: "🧪",
      style: "insight",
      content: "**Today's Lab:** You'll run 4 experiments. First, you'll BE a neuron. Then you'll build a network, train it, and see how real AI systems use neural networks in the wild. Points are earned at each stage — your final score reports to PantherLearn."
    },

    // ── THE NEURAL NETWORK LAB ACTIVITY ──────────────────
    {
      id: "embed-nn-lab",
      type: "embed",
      url: "https://neural-network-lab-paps.firebaseapp.com",
      caption: "🧠 The Neural Network Lab — Interactive Activity",
      height: 850
    },

    // ═══════════════════════════════════════════════════════
    // WRAP UP
    // ═══════════════════════════════════════════════════════
    {
      id: "section-wrapup",
      type: "section_header",
      title: "Wrap Up",
      subtitle: "~5 minutes",
      icon: "🎯"
    },
    {
      id: "q2",
      type: "question",
      questionType: "short_answer",
      prompt: "You built and trained a neural network that classifies creatures. The network figured out on its own that teeth and eye position are the most important features — you never told it that. How is this different from regular programming?",
      placeholder: "In regular programming... but with neural networks..."
    },
    {
      id: "q3",
      type: "question",
      questionType: "multiple_choice",
      prompt: "In a neural network, where does the 'knowledge' live?",
      options: [
        "In the code the programmer writes",
        "In the input data that gets fed in",
        "In the weights — the strength of connections between neurons",
        "In the output layer"
      ],
      correctIndex: 2,
      explanation: "The weights ARE the knowledge. When a network learns, it's adjusting weights. Nobody programs the answer — the network discovers patterns by strengthening connections that lead to correct outputs and weakening ones that don't."
    },
    {
      id: "q4",
      type: "question",
      questionType: "short_answer",
      prompt: "Yesterday we learned about embeddings (turning meaning into numbers). Today we learned about neural networks (systems that learn from those numbers). How do these two concepts connect? How might they work together in a real AI system?",
      placeholder: "Embeddings and neural networks connect because..."
    },
    {
      id: "vocab1",
      type: "vocab_list",
      title: "Key Vocabulary",
      terms: [
        {
          term: "Neural Network",
          definition: "A computing system made of layers of connected nodes that learns patterns from data by adjusting connection strengths."
        },
        {
          term: "Neuron (Node)",
          definition: "A single unit in a neural network that receives inputs, processes them, and passes a signal to the next layer."
        },
        {
          term: "Weight",
          definition: "The strength of a connection between neurons. Higher weight = more influence. The network's 'knowledge' is stored in its weights."
        },
        {
          term: "Layer",
          definition: "A group of neurons at the same stage. Networks typically have input layers, hidden layers (in the middle), and output layers."
        },
        {
          term: "Training / Epoch",
          definition: "The process of showing examples to the network and adjusting weights based on mistakes. One epoch = one pass through all training examples."
        },
        {
          term: "Backpropagation",
          definition: "The algorithm that calculates how much each weight contributed to an error, then adjusts the weights to reduce future errors."
        }
      ]
    }
  ]
};

async function seed() {
  const courses = [
    { courseId: "Y9Gdhw5MTY8wMFt6Tlvj", label: "Period 4" },
    { courseId: "DacjJ93vUDcwqc260OP3", label: "Period 5" },
    { courseId: "M2MVSXrKuVCD9JQfZZyp", label: "Period 7" },
  ];

  const lessonId = "neural-networks-intro";

  for (const course of courses) {
    await db.collection('courses').doc(course.courseId)
      .collection('lessons').doc(lessonId)
      .set(lesson);
    console.log(`✅ Seeded "${lesson.title}" → ${course.label} (${course.courseId})`);
  }

  console.log(`\n   Lesson ID: ${lessonId}`);
  console.log(`   Order: ${lesson.order} (after Embeddings at order 7)`);
  console.log(`   Blocks: ${lesson.blocks.length}`);
  console.log(`   Embed URL: https://neural-network-lab-paps.web.app`);
  console.log(`   Visible: false (publish via Lesson Editor)`);
  process.exit(0);
}

seed().catch(err => { console.error('❌ Error seeding lesson:', err); process.exit(1); });
