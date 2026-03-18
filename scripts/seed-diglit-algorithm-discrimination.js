// seed-diglit-algorithm-discrimination.js
// Creates "Algorithmic Discrimination: When the Machine Decides Your Opportunities" (Dig Lit, Algorithm Economy, Lesson 48)
// Run: node scripts/seed-diglit-algorithm-discrimination.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Algorithmic Discrimination: When the Machine Decides Your Opportunities",
  course: "Digital Literacy",
  unit: "The Algorithm Economy",
  order: 48,
  visible: false,
  blocks: [

    {
      id: "section-warmup",
      type: "section_header",
      icon: "⚖️",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "b-warmup",
      type: "text",
      content: "Algorithms don't just decide what content you see. They decide:\n\n- Whether you get a loan\n- What price you see for a product or insurance\n- Whether you get called back after a job application\n- What ads you see for housing, jobs, and education\n- Whether a parole board recommends your release\n\nThese decisions used to be made by people. Now they're increasingly made by algorithms. And algorithms can discriminate — sometimes accidentally, sometimes by inheriting the biases of the data they were trained on.\n\n\"The machine just does math\" is not a defense. Math built on biased data produces biased results."
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** If an algorithm was trained on historical data that reflects past discrimination, and it makes decisions based on that data — is the algorithm discriminating? Who is responsible?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Think of a decision that affects someone's life (job, loan, housing, medical care, criminal justice). What information would you want a decision-maker to consider? What information would you NOT want them to use?",
      placeholder: "Decision: ...\nShould consider: ...\nShould NOT use: ...",
      difficulty: "remember"
    },
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Define algorithmic bias and explain how it emerges from training data",
        "Identify real cases where algorithmic systems produced discriminatory outcomes",
        "Evaluate who bears responsibility when an algorithm causes harm"
      ]
    },

    {
      id: "section-main",
      type: "section_header",
      icon: "🔬",
      title: "When Algorithms Harm",
      subtitle: "~20 minutes"
    },
    {
      id: "b-how-bias",
      type: "text",
      content: "**How algorithmic bias happens**\n\nAlgorithms learn from historical data. If that historical data reflects past discrimination, the algorithm learns those patterns and replicates them — often at larger scale and faster speed than any human could.\n\n**Three sources of algorithmic bias:**\n\n1. **Biased training data** — The data used to train the algorithm reflects historical inequalities. Example: if past hiring data shows fewer women in senior roles, an algorithm trained on that data may deprioritize female applicants.\n\n2. **Proxy variables** — The algorithm doesn't use race directly, but uses factors (zip code, school name, browsing behavior) that strongly correlate with race. The discrimination still occurs, just one step removed.\n\n3. **Feedback loops** — A biased algorithm produces biased outcomes → those outcomes become training data → next version of algorithm is more biased. The loop amplifies over time."
    },
    {
      id: "b-cases",
      type: "text",
      content: "**Real cases of algorithmic discrimination:**\n\n**COMPAS (Criminal Justice)**\nA risk-assessment algorithm used by courts to predict recidivism (likelihood of reoffending). A ProPublica investigation found COMPAS was twice as likely to incorrectly flag Black defendants as high-risk and twice as likely to incorrectly flag white defendants as low-risk. The algorithm's developers disputed the methodology but couldn't fully explain the disparity.\n\n**Amazon Hiring Algorithm (2018)**\nAmazon built an AI resume screener trained on 10 years of hiring data. The data was mostly male applicants (reflecting the tech industry's gender imbalance). The algorithm learned to penalize resumes that included the word \"women's\" (as in \"women's chess club\") and downgraded graduates of all-women's colleges. Amazon scrapped the system.\n\n**Facebook Ad Targeting (Housing/Jobs)**\nThe Department of Housing and Urban Development sued Facebook for allowing housing advertisers to exclude users from seeing ads based on race, religion, and national origin. The \"audience selection\" tools allowed advertisers to effectively redline — the digital version of the practice that denied mortgages to Black Americans in the 20th century.\n\n**Pulse Oximeters (Medical)**\nPulse oximeters (the clip on your finger that measures blood oxygen) were calibrated primarily on lighter skin tones. During COVID-19, studies showed they systematically overestimated oxygen levels in patients with darker skin — leading to delayed treatment. Not a software algorithm, but the same principle: biased data in a measurement system creates biased and dangerous outputs."
    },
    {
      id: "callout-audit",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**Algorithmic auditing:** One response to algorithmic bias is mandatory auditing — requiring companies to test their algorithms for disparate impact across racial, gender, and other groups. New York City passed a law in 2023 requiring employers to audit AI hiring tools. The EU's AI Act includes risk assessments for high-stakes AI systems. But most algorithms in use today have never been independently audited."
    },
    {
      id: "q-identify",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A lending algorithm doesn't use race as a variable. But it uses zip code, and certain zip codes in the city are historically 90% Black or Latino. The algorithm approves loans at lower rates for these zip codes. This is an example of:",
      options: [
        "No discrimination — the algorithm isn't using race",
        "Proxy discrimination — zip code functions as a stand-in for race, producing the same discriminatory outcome",
        "Statistical discrimination — justified because zip codes have different economic conditions",
        "Algorithmic error — the algorithm must have a bug"
      ],
      correctIndex: 1,
      explanation: "Proxy discrimination occurs when a variable that isn't race itself is strongly correlated with race — producing discriminatory outcomes even without explicit racial targeting. Courts have found proxy discrimination legally actionable under the Fair Housing Act. \"We didn't use race\" is not a complete defense if the effect is the same as if you had.",
      difficulty: "analyze"
    },
    {
      id: "q-responsibility",
      type: "question",
      questionType: "short_answer",
      prompt: "The COMPAS algorithm incorrectly flagged a Black defendant as high-risk, and the judge gave a longer sentence partly based on that score. Who bears responsibility for the unjust sentence?\n\n- The algorithm's developers?\n- The company that sold it?\n- The judge who used it?\n- The court system that adopted it?\n\nMake an argument — it doesn't have to be one person.",
      placeholder: "Responsible party (or parties): ...\nReasoning: ...",
      difficulty: "evaluate"
    },

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
      content: "Algorithms are not neutral. They are built by humans, trained on human-generated data, and deployed in systems designed by humans — which means they inherit human biases, often at unprecedented scale.\n\nThe question isn't just \"is the algorithm accurate?\" — it's \"accurate for whom?\" An algorithm that's 95% accurate overall but wrong for a specific group at twice the rate of everyone else isn't equally accurate.\n\nAs algorithms make more consequential decisions about people's lives, the ability to question them — to ask *who built this, what data trained it, who does it work well for, and who does it harm* — is a fundamental digital literacy skill.\n\n**Up next:** Lesson 49 — Breaking the Loop. You've learned what algorithms do to you. Now: what can you actually do about it?"
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: Identify one algorithm that makes consequential decisions in people's lives (not from the lesson). What biases might it have? What data was it probably trained on? Who might be harmed?",
      placeholder: "Algorithm: ...\nPossible biases: ...\nTraining data concerns: ...\nWho might be harmed: ...",
      difficulty: "analyze"
    },

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
        { term: "Algorithmic bias", definition: "Systematic and unfair discrimination produced by an algorithm — typically resulting from biased training data or flawed design choices." },
        { term: "Training data", definition: "The historical dataset used to teach a machine learning algorithm — if this data reflects past discrimination, the algorithm learns and replicates those patterns." },
        { term: "Proxy variable", definition: "A factor that isn't itself a protected characteristic (like race) but is strongly correlated with it — allowing discrimination to occur without explicitly using the protected category." },
        { term: "Disparate impact", definition: "When a policy or algorithm has a discriminatory effect on a protected group, even if it was not designed with discriminatory intent — legally actionable in the US." },
        { term: "Recidivism algorithm", definition: "A risk-assessment tool used in criminal justice to predict the likelihood someone will reoffend — controversial for documented racial disparities in predictions." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("digital-literacy")
      .collection("lessons").doc("algorithm-discrimination")
      .set(lesson);
    console.log('✅ Lesson "Algorithmic Discrimination" seeded!');
    console.log("   Path: courses/digital-literacy/lessons/algorithm-discrimination");
    console.log("   Blocks:", lesson.blocks.length);
    console.log("   Order:", lesson.order);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}
seed();
