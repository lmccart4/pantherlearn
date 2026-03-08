import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════════════════════
   AI ETHICS COURTROOM — PantherLearn
   A structured debate/role-play tool for AI ethics dilemmas.
   Solo-playable: students rotate through all roles.
   ═══════════════════════════════════════════════════════════════════════════════ */

// ─── CASE DATA ─────────────────────────────────────────────────────────────────

const CASES = [
  {
    id: "facial-recognition",
    title: "City of Millbrook v. ClearSight Technologies",
    subtitle: "Facial Recognition in Public Schools",
    icon: "👁️",
    summary: "ClearSight Technologies deployed AI-powered facial recognition cameras across all 23 Millbrook public schools to improve campus security. Civil liberties organizations allege the system disproportionately misidentifies students of color, has created a climate of surveillance that harms learning, and was deployed without meaningful parental consent.",
    charge: "Violation of student privacy rights, discriminatory algorithmic impact, and failure to obtain informed consent",
    themes: ["Privacy", "Bias", "Consent", "Surveillance"],
    evidence: [
      { id: "e1", type: "📊 Data", title: "Independent Accuracy Audit", content: "An independent audit by the Algorithmic Justice League found the system achieves 96.2% accuracy for light-skinned male subjects but only 71.8% accuracy for dark-skinned female subjects. Over a 14-month period, 47 false-positive matches led to students being pulled from class and questioned by security staff. Of those 47 students, 41 (87%) were students of color.", side: "prosecution" },
      { id: "e2", type: "🗣️ Testimony", title: "Parent Testimony — Maria Santos", content: "\"My daughter Lucia was pulled out of class three times in a single month because the system said she matched a flagged individual. She is 14 years old and has never been in any trouble. After the third time, she started having panic attacks before school. She told me she feels like a criminal every time she walks through the front door. No child should feel that way in a place of learning.\"", side: "prosecution" },
      { id: "e3", type: "📊 Data", title: "Campus Security Incident Log", content: "In the 14 months since deployment, the facial recognition system successfully identified 12 unauthorized individuals on campus, including 2 individuals with active restraining orders filed by staff members. In the 14 months prior to deployment, there were 3 undetected trespassing incidents, one of which resulted in property damage to a school vehicle.", side: "defense" },
      { id: "e4", type: "🗣️ Testimony", title: "CTO Testimony — Dr. James Harlow", content: "\"We have invested $2.3 million in bias reduction research since these concerns were raised. Our latest model, version 4.2, reduces the accuracy gap between demographic groups to approximately 8 percentage points. We believe strongly that this technology can be made both fair and effective. Abandoning it entirely would leave children less safe.\"", side: "defense" },
      { id: "e5", type: "📄 Document", title: "School Board Consent Policy", content: "Review of the enrollment process reveals the facial recognition consent clause was buried on page 34 of a 47-page annual enrollment packet, written in dense legal language at a 14th-grade reading level. A subsequent parent survey found only 12% of families were aware the program existed. No opt-out mechanism was provided. Families who did not complete enrollment paperwork had their children enrolled in the system by default.", side: "prosecution" },
      { id: "e6", type: "🔬 Expert", title: "Expert Analysis — Dr. Aisha Patel, MIT AI Ethics Lab", content: "Algorithmic bias in facial recognition is extensively documented in peer-reviewed literature. However, a blanket ban on the technology may prevent genuinely beneficial applications. The critical questions are: (1) Do adequate safeguards exist? (2) Is there meaningful transparency? (3) Was informed consent obtained? (4) Do the benefits outweigh the demonstrated harms? In this case, the consent process appears materially deficient.", side: "neutral" },
    ],
    frameworks: [
      { name: "FERPA", desc: "Federal law protecting student educational records and requiring parental consent before disclosure of personally identifiable information." },
      { name: "14th Amendment Equal Protection", desc: "Constitutional guarantee that no state shall deny any person equal protection under the law. Relevant when government-deployed technology has disparate impact on protected classes." },
      { name: "EU AI Act (Reference)", desc: "International framework that classifies real-time biometric identification in educational settings as 'high-risk AI' requiring mandatory impact assessments, human oversight, and transparency obligations." },
    ],
    prompts: {
      prosecution: [
        "How does the accuracy gap between demographic groups constitute discriminatory impact?",
        "What does the consent process reveal about whether families had meaningful choice?",
        "How should we weigh psychological harm to students against security benefits?",
      ],
      defense: [
        "How do the documented security benefits serve a compelling interest?",
        "What weight should the company's investment in bias reduction carry?",
        "Is it fair to hold AI to a higher standard than human security guards, who also have documented biases?",
      ],
      expert: [
        "What conditions would need to be met for this technology to be deployed ethically?",
        "How should policymakers balance innovation with protection of vulnerable populations?",
      ],
    },
  },
  {
    id: "hiring-algorithm",
    title: "Washington State v. HireRight AI",
    subtitle: "Algorithmic Hiring Discrimination",
    icon: "💼",
    summary: "HireRight AI's automated resume screening tool, licensed by 340+ employers across Washington State, has been found to systematically disadvantage candidates who attended Historically Black Colleges and Universities (HBCUs), candidates with employment gaps exceeding 6 months, and candidates with non-Western names — all categories that disproportionately affect protected classes.",
    charge: "Systematic employment discrimination through biased algorithmic screening in violation of Title VII of the Civil Rights Act",
    themes: ["Bias", "Employment", "Accountability", "Transparency"],
    evidence: [
      { id: "e1", type: "📊 Data", title: "Statistical Analysis — 2.1M Applications", content: "Analysis of 2.1 million screened applications reveals: HBCU graduates advanced past initial screening at a rate of 14% versus 38% for graduates of comparably ranked non-HBCU institutions. Applicants with employment gaps exceeding 6 months (67% of whom are women, often due to caregiving responsibilities) were rejected at 4.1x the baseline rate. Applicants with names algorithmically classified as 'non-Western' advanced at 22% versus 41% for 'Western' names.", side: "prosecution" },
      { id: "e2", type: "🗣️ Testimony", title: "Applicant Testimony — Derek Williams", content: "\"I graduated from Howard University with a 3.8 GPA in Computer Science. I completed three internships at Fortune 500 companies. I applied to 87 positions on platforms using HireRight's screening tool and received zero interview invitations. My white roommate from our shared internship, who had a lower GPA and fewer internships, received 12 callbacks through the same platforms. The only meaningful difference was our schools and our names.\"", side: "prosecution" },
      { id: "e3", type: "📄 Document", title: "HireRight Technical Documentation", content: "Internal documentation reveals the model was trained on 10 years of historical hiring data from client companies. The training objective was to predict 'successful hires' as defined by retention beyond 18 months and manager performance ratings. The system was not audited for disparate impact before deployment. No demographic data was included in training, but proxy variables (school name, zip code, activity keywords) correlated strongly with protected characteristics.", side: "prosecution" },
      { id: "e4", type: "🗣️ Testimony", title: "CEO Testimony — Sarah Chen", content: "\"Our system does not use race, gender, or any protected characteristic as an input variable. We optimize purely for job performance prediction. If historical hiring patterns contain bias, that reflects societal problems, not a flaw in our technology. We have since implemented a bias detection dashboard that flags potential disparate impact for our clients to review.\"", side: "defense" },
      { id: "e5", type: "📊 Data", title: "Performance Outcome Analysis", content: "A post-hoc analysis of candidates who were hired through alternate channels (bypassing HireRight screening) shows no statistically significant difference in job performance between HBCU and non-HBCU graduates (p = 0.73), suggesting the screening criteria do not actually predict the outcomes they claim to optimize for.", side: "prosecution" },
      { id: "e6", type: "🔬 Expert", title: "Expert Analysis — Prof. Solon Barocas, Cornell", content: "When an algorithm is trained on historically biased data, it does not merely reflect that bias — it operationalizes and scales it. The legal question is not whether the algorithm 'intends' to discriminate, but whether it produces discriminatory outcomes. Under disparate impact doctrine, intent is not required. The employer bears the burden of demonstrating the practice is job-related and consistent with business necessity.", side: "neutral" },
    ],
    frameworks: [
      { name: "Title VII — Civil Rights Act", desc: "Prohibits employment discrimination based on race, color, religion, sex, or national origin. Includes disparate impact theory: facially neutral practices that disproportionately harm protected groups are unlawful unless justified by business necessity." },
      { name: "EEOC Guidance on AI in Hiring", desc: "The Equal Employment Opportunity Commission has stated that employers may be held liable for discriminatory outcomes produced by algorithmic tools, even when those tools are developed by third-party vendors." },
      { name: "Illinois AI Video Interview Act", desc: "State law requiring employers to notify candidates when AI is used in hiring, obtain consent, and limit data sharing. Referenced as an emerging regulatory model." },
    ],
    prompts: {
      prosecution: [
        "How does the statistical evidence demonstrate disparate impact under Title VII?",
        "If the algorithm doesn't use protected characteristics directly, why is the outcome still discriminatory?",
        "Who bears responsibility — the AI vendor or the employers who use the tool?",
      ],
      defense: [
        "Should AI systems be held to a different legal standard than human decision-makers?",
        "What is the significance of the company's bias detection improvements?",
        "If the training data reflects real societal patterns, is the algorithm at fault?",
      ],
      expert: [
        "What technical interventions could reduce disparate impact while preserving predictive value?",
        "How should liability be allocated across the AI supply chain?",
      ],
    },
  },
  {
    id: "autonomous-vehicle",
    title: "Estate of Chen v. AutoDrive Inc.",
    subtitle: "Autonomous Vehicle Decision-Making",
    icon: "🚗",
    summary: "An AutoDrive Level 4 autonomous vehicle encountered a sudden obstacle — a fallen tree — while traveling at 45 mph on a two-lane road. The vehicle's decision algorithm calculated two options: swerve left into oncoming traffic (risking harm to other drivers) or swerve right onto a sidewalk (risking harm to pedestrians). The system swerved right. Pedestrian Margaret Chen, age 67, was killed. Her estate alleges AutoDrive's algorithm made an impermissible value judgment about human life.",
    charge: "Wrongful death through negligent algorithmic design and impermissible utilitarian calculus applied to human life",
    themes: ["Liability", "Trolley Problem", "Accountability", "Value of Life"],
    evidence: [
      { id: "e1", type: "📄 Document", title: "AutoDrive Decision Algorithm Specification", content: "Internal documentation reveals the system uses a weighted scoring model to evaluate collision scenarios. Variables include: number of potential casualties, probability of fatal vs. non-fatal injury, structural protection available to each party (vehicle occupants rated higher due to seatbelts/airbags), and system confidence level. The algorithm selected the sidewalk option because it calculated a 23% fatality probability vs. 67% for the head-on collision scenario.", side: "prosecution" },
      { id: "e2", type: "🗣️ Testimony", title: "Family Testimony — David Chen", content: "\"My mother walked that sidewalk every afternoon for 30 years. She survived the Cultural Revolution, she built a life in this country, she put three children through college. And a machine — a machine that no one asked her permission to put on the road — decided her life was worth less than a probability calculation. She was not a variable. She was a person.\"", side: "prosecution" },
      { id: "e3", type: "📊 Data", title: "Comparative Safety Statistics", content: "AutoDrive vehicles have been involved in 3 fatal accidents over 847 million miles of autonomous driving. The human driver fatality rate for comparable conditions is approximately 1.13 deaths per 100 million miles. AutoDrive's rate is 0.35 per 100 million miles — roughly 3.2 times safer than human drivers overall.", side: "defense" },
      { id: "e4", type: "🗣️ Testimony", title: "Lead Engineer — Dr. Priya Sharma", content: "\"Every decision framework involves tradeoffs. A human driver in the same situation would have made an instinctive choice in milliseconds — possibly the same choice, possibly worse. Our system evaluated the scenario in 47 milliseconds and selected the option with the lowest probability of total casualties. We did not program it to devalue anyone's life. We programmed it to minimize harm.\"", side: "defense" },
      { id: "e5", type: "📄 Document", title: "AutoDrive Ethics Board Minutes", content: "Meeting minutes from 2022 show the internal ethics board raised concerns about the decision algorithm's utilitarian framework. One member wrote: 'We are comfortable with the math, but the public will not be. If a human swerves onto a sidewalk in panic, that is tragedy. If an algorithm does it by design, that is a policy choice about who lives and who dies.' The concern was noted but no changes were implemented.", side: "prosecution" },
      { id: "e6", type: "🔬 Expert", title: "Expert Analysis — Prof. Patrick Lin, Philosophy of Technology", content: "This case raises a fundamental question: should machines be permitted to make life-and-death decisions using utilitarian calculations that we would find morally repugnant if made explicitly by humans? The algorithm did exactly what it was designed to do. The question is whether that design itself is negligent — whether there are decisions that should never be delegated to machines, regardless of statistical outcomes.", side: "neutral" },
    ],
    frameworks: [
      { name: "Product Liability — Strict Liability", desc: "Manufacturers may be held liable for harm caused by defective products regardless of fault or intent. The question is whether an algorithmic decision framework constitutes a 'design defect.'" },
      { name: "Negligence Standard", desc: "Was AutoDrive's algorithm design reasonable given known risks? Did the company breach its duty of care by deploying a system that makes utilitarian life-death calculations?" },
      { name: "NHTSA AV Guidelines", desc: "Federal guidelines for autonomous vehicles emphasize the importance of ethical decision frameworks but do not mandate specific approaches, leaving a regulatory gap." },
    ],
    prompts: {
      prosecution: [
        "Is it morally permissible for a corporation to pre-program decisions about who lives and who dies?",
        "What does the ethics board's internal concern tell us about the company's state of mind?",
        "Should the 'statistical safety' argument excuse individual deaths caused by algorithmic design choices?",
      ],
      defense: [
        "If the overall fatality rate is 3.2x lower than human drivers, does that justify the technology?",
        "Would a human driver in the same scenario have had a better outcome?",
        "Should we hold algorithms to a standard of perfection we don't apply to humans?",
      ],
      expert: [
        "What ethical framework should govern autonomous vehicle decision-making?",
        "Is there a meaningful moral distinction between a human instinct and an algorithmic calculation?",
      ],
    },
  },
  {
    id: "predictive-policing",
    title: "ACLU v. City of Ashford",
    subtitle: "Predictive Policing and Civil Liberties",
    icon: "🔍",
    summary: "The Ashford Police Department deployed PredictShield, an AI system that analyzes historical crime data, social media activity, and environmental factors to predict where crimes are likely to occur and identify individuals at 'high risk' of criminal involvement. The ACLU alleges the system creates a feedback loop of over-policing in communities of color and violates constitutional protections against unreasonable search and surveillance.",
    charge: "Violation of Fourth Amendment protections against unreasonable search, equal protection violations, and unconstitutional surveillance of protected communities",
    themes: ["Surveillance", "Feedback Loops", "Civil Liberties", "Racial Justice"],
    evidence: [
      { id: "e1", type: "📊 Data", title: "Deployment Pattern Analysis", content: "In the 18 months since PredictShield deployment, police patrols in predominantly Black and Latino neighborhoods increased by 340%. Arrest rates in these neighborhoods rose by 280%, while arrest rates in predominantly white neighborhoods remained flat. Independent analysis suggests the increase in arrests reflects increased police presence, not increased criminal activity — reported crime rates per capita remained statistically constant across all neighborhoods.", side: "prosecution" },
      { id: "e2", type: "🗣️ Testimony", title: "Resident Testimony — James Washington", content: "\"I've lived in the Eastside for 42 years. Since this system went in, I can't walk to the corner store without a patrol car slowing down to look at me. My grandson got stopped three times in one week. He's 16 and on the honor roll. They told him he was in a 'high-risk zone.' What does that even mean? It means he's Black in his own neighborhood.\"", side: "prosecution" },
      { id: "e3", type: "📊 Data", title: "Crime Reduction Statistics", content: "Property crime in PredictShield-targeted areas decreased by 18% year-over-year. Violent crime decreased by 7%. The department's overall case clearance rate improved from 34% to 41%. Two homicide investigations were aided by PredictShield's network analysis capabilities.", side: "defense" },
      { id: "e4", type: "🗣️ Testimony", title: "Police Chief Testimony — Chief Roberto Alvarez", content: "\"PredictShield is a tool, not a decision-maker. Officers still exercise judgment about who to stop and why. The system identifies areas and patterns — it does not tell officers to target individuals based on race. We have a responsibility to allocate limited resources where they will be most effective at protecting communities, including the very communities raising these concerns.\"", side: "defense" },
      { id: "e5", type: "📄 Document", title: "Training Data Provenance Report", content: "PredictShield's model was trained on 15 years of Ashford PD arrest data. Historical analysis reveals that during this period, Black residents were arrested at 5.7x the rate of white residents for marijuana possession, despite comparable usage rates. The training data includes periods during which three Ashford officers were disciplined for racial profiling. These records were not excluded from the training set.", side: "prosecution" },
      { id: "e6", type: "🔬 Expert", title: "Expert Analysis — Dr. Rashida Richardson, Northeastern University", content: "Predictive policing systems trained on biased historical data create what researchers call 'runaway feedback loops.' Over-policing produces more arrests, which generates more data showing 'high crime,' which triggers more policing. The system doesn't predict crime — it predicts policing. This is not a technical bug; it is a structural feature of the approach. The constitutional question is whether the government can use an automated system that systematically directs increased state surveillance toward communities of color.", side: "neutral" },
    ],
    frameworks: [
      { name: "Fourth Amendment", desc: "Protects against unreasonable searches and seizures. The question is whether algorithmically-directed increased patrol and surveillance of specific communities constitutes an 'unreasonable search' or violates reasonable expectations of privacy." },
      { name: "Equal Protection (14th Amendment)", desc: "When government action — including deployment of technology — has a disproportionate impact on protected classes, it may violate equal protection guarantees even without discriminatory intent." },
      { name: "Terry v. Ohio Standard", desc: "Police may briefly stop individuals based on 'reasonable suspicion.' The question is whether living in an algorithmically-designated 'high-risk zone' contributes to reasonable suspicion, effectively lowering the constitutional threshold for entire communities." },
    ],
    prompts: {
      prosecution: [
        "How does biased training data create a self-reinforcing cycle of discriminatory policing?",
        "Can the government constitutionally deploy a system that directs surveillance based on historically biased data?",
        "What does the disparity in patrol increases between neighborhoods reveal about the system's impact?",
      ],
      defense: [
        "How should we weigh documented crime reduction against concerns about over-policing?",
        "Is the AI system meaningfully different from a veteran officer who patrols 'high-crime areas' based on experience?",
        "What responsibility do officers themselves bear for how they use the tool's recommendations?",
      ],
      expert: [
        "What technical and policy interventions could break the feedback loop while preserving public safety benefits?",
        "Should predictive policing be regulated, reformed, or banned?",
      ],
    },
  },
];

const PHASES = [
  { id: "select", label: "Case Selection", icon: "📋", roleLabel: null },
  { id: "evidence", label: "Evidence Review", icon: "📁", roleLabel: null },
  { id: "prosecution", label: "Prosecution", icon: "⚖️", roleLabel: "Prosecutor" },
  { id: "defense", label: "Defense", icon: "🛡️", roleLabel: "Defense Attorney" },
  { id: "expert", label: "Expert Witness", icon: "🔬", roleLabel: "Expert Witness" },
  { id: "deliberation", label: "Deliberation", icon: "🤔", roleLabel: "Juror" },
  { id: "verdict", label: "Verdict", icon: "🏛️", roleLabel: "Juror" },
];

const DELIBERATION_QUESTIONS = [
  { id: "q1", question: "Was concrete harm to real people convincingly demonstrated?", weight: "critical" },
  { id: "q2", question: "Did the accused party have reasonable knowledge that harm could occur?", weight: "important" },
  { id: "q3", question: "Were adequate safeguards, transparency, or consent mechanisms in place?", weight: "important" },
  { id: "q4", question: "Do the benefits of the technology outweigh the documented harms?", weight: "critical" },
  { id: "q5", question: "Was a less harmful alternative reasonably available?", weight: "important" },
  { id: "q6", question: "Should the primary responsibility fall on the technology maker, the deployer, or both?", weight: "contextual" },
];

// ─── STYLES ────────────────────────────────────────────────────────────────────

const fonts = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,600&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;1,8..60,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');
`;

const cssVars = {
  "--walnut": "#2C1810",
  "--walnut-light": "#3D261C",
  "--mahogany": "#4A0E0E",
  "--parchment": "#F5F0E8",
  "--parchment-dark": "#E8E0D0",
  "--gold": "#C49A2A",
  "--gold-light": "#D4AA3A",
  "--gold-dim": "rgba(196, 154, 42, 0.15)",
  "--ink": "#1A1209",
  "--ink-light": "#3D3328",
  "--cream": "#FFFDF7",
  "--prosecution-red": "#8B1A1A",
  "--prosecution-bg": "rgba(139, 26, 26, 0.08)",
  "--defense-blue": "#1A3A5C",
  "--defense-bg": "rgba(26, 58, 92, 0.08)",
  "--neutral-green": "#2D5016",
  "--neutral-bg": "rgba(45, 80, 22, 0.08)",
  "--shadow": "0 4px 24px rgba(44, 24, 16, 0.12)",
  "--shadow-lg": "0 8px 40px rgba(44, 24, 16, 0.18)",
};

// ─── COMPONENTS ────────────────────────────────────────────────────────────────

const GavelIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="25" y="20" width="50" height="16" rx="3" fill="var(--gold)" transform="rotate(-30 50 28)" />
    <rect x="44" y="30" width="8" height="40" rx="2" fill="var(--walnut-light)" transform="rotate(-30 48 50)" />
    <rect x="10" y="78" width="80" height="8" rx="4" fill="var(--walnut)" />
    <rect x="20" y="72" width="60" height="8" rx="2" fill="var(--walnut-light)" />
  </svg>
);

const ProgressBar = ({ phase, phases }) => {
  const idx = phases.findIndex((p) => p.id === phase);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, margin: "0 auto", maxWidth: 700, padding: "0 20px" }}>
      {phases.map((p, i) => (
        <div key={p.id} style={{ display: "flex", alignItems: "center", flex: i < phases.length - 1 ? 1 : "none" }}>
          <div
            style={{
              width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
              background: i <= idx ? "var(--gold)" : "var(--parchment-dark)",
              color: i <= idx ? "var(--walnut)" : "var(--ink-light)",
              border: i === idx ? "2px solid var(--walnut)" : "2px solid transparent",
              transition: "all 0.3s ease", cursor: "default", position: "relative",
            }}
            title={p.label}
          >
            {i < idx ? "✓" : i + 1}
          </div>
          {i < phases.length - 1 && (
            <div style={{
              flex: 1, height: 2, margin: "0 4px",
              background: i < idx ? "var(--gold)" : "var(--parchment-dark)",
              transition: "background 0.3s ease",
            }} />
          )}
        </div>
      ))}
    </div>
  );
};

const RoleBadge = ({ role, active }) => {
  const colors = {
    Prosecutor: { bg: "var(--prosecution-bg)", border: "var(--prosecution-red)", text: "var(--prosecution-red)" },
    "Defense Attorney": { bg: "var(--defense-bg)", border: "var(--defense-blue)", text: "var(--defense-blue)" },
    "Expert Witness": { bg: "var(--neutral-bg)", border: "var(--neutral-green)", text: "var(--neutral-green)" },
    Juror: { bg: "var(--gold-dim)", border: "var(--gold)", text: "var(--walnut)" },
  };
  const c = colors[role] || colors.Juror;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px",
      borderRadius: 6, fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, letterSpacing: "0.03em",
      background: c.bg, border: `1.5px solid ${c.border}`, color: c.text,
      textTransform: "uppercase",
      boxShadow: active ? `0 0 0 3px ${c.bg}` : "none",
      transition: "all 0.3s ease",
    }}>
      {active && <span style={{ width: 7, height: 7, borderRadius: "50%", background: c.border, animation: "pulse 2s infinite" }} />}
      {role}
    </span>
  );
};

const EvidenceCard = ({ item, marked, onToggle }) => {
  const sideColors = {
    prosecution: { accent: "var(--prosecution-red)", bg: "var(--prosecution-bg)", label: "Prosecution" },
    defense: { accent: "var(--defense-blue)", bg: "var(--defense-bg)", label: "Defense" },
    neutral: { accent: "var(--neutral-green)", bg: "var(--neutral-bg)", label: "Neutral" },
  };
  const s = sideColors[item.side];
  return (
    <div style={{
      background: "var(--cream)", borderRadius: 10, border: `1px solid ${marked ? s.accent : "var(--parchment-dark)"}`,
      padding: 0, overflow: "hidden", transition: "all 0.3s ease",
      boxShadow: marked ? `0 2px 16px ${s.bg}` : "var(--shadow)",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px", borderBottom: `1px solid var(--parchment-dark)`, background: marked ? s.bg : "var(--parchment)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 16 }}>{item.type}</span>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 14, color: "var(--ink)" }}>{item.title}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{
            fontSize: 11, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, textTransform: "uppercase",
            padding: "3px 10px", borderRadius: 4, background: s.bg, color: s.accent, border: `1px solid ${s.accent}`, letterSpacing: "0.05em",
          }}>{s.label}</span>
        </div>
      </div>
      <div style={{ padding: "16px 18px", fontFamily: "'Source Serif 4', serif", fontSize: 14.5, lineHeight: 1.7, color: "var(--ink-light)" }}>
        {item.content}
      </div>
      <div style={{ padding: "8px 18px 14px", display: "flex", justifyContent: "flex-end" }}>
        <button onClick={() => onToggle(item.id)} style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, padding: "6px 16px", borderRadius: 6,
          border: `1.5px solid ${marked ? s.accent : "var(--parchment-dark)"}`,
          background: marked ? s.bg : "transparent", color: marked ? s.accent : "var(--ink-light)",
          cursor: "pointer", transition: "all 0.2s ease", textTransform: "uppercase", letterSpacing: "0.04em",
        }}>
          {marked ? "★ Key Evidence" : "☆ Mark as Key"}
        </button>
      </div>
    </div>
  );
};

const WritingArea = ({ label, placeholder, value, onChange, prompts, minRows = 6 }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
    <label style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 600, color: "var(--ink)" }}>
      {label}
    </label>
    {prompts && prompts.length > 0 && (
      <div style={{ background: "var(--gold-dim)", borderRadius: 8, padding: "14px 18px", border: "1px solid var(--gold)" }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, textTransform: "uppercase", color: "var(--gold)", letterSpacing: "0.06em", marginBottom: 8 }}>
          Guiding Questions
        </div>
        {prompts.map((p, i) => (
          <div key={i} style={{ fontFamily: "'Source Serif 4', serif", fontSize: 14, color: "var(--ink-light)", lineHeight: 1.6, marginBottom: 4, paddingLeft: 12, borderLeft: "2px solid var(--gold)" }}>
            {p}
          </div>
        ))}
      </div>
    )}
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={minRows}
      style={{
        width: "100%", boxSizing: "border-box", fontFamily: "'Source Serif 4', serif", fontSize: 15, lineHeight: 1.8,
        color: "var(--ink)", background: "var(--cream)", border: "1.5px solid var(--parchment-dark)", borderRadius: 8,
        padding: "16px 18px", resize: "vertical", outline: "none", transition: "border-color 0.2s ease",
      }}
      onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
      onBlur={(e) => (e.target.style.borderColor = "var(--parchment-dark)")}
    />
    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "var(--ink-light)", textAlign: "right" }}>
      {value.split(/\s+/).filter(Boolean).length} words
    </div>
  </div>
);

const Button = ({ children, onClick, variant = "primary", disabled = false, style: extraStyle = {} }) => {
  const styles = {
    primary: {
      background: "var(--walnut)", color: "var(--parchment)", border: "2px solid var(--walnut)",
      hoverBg: "var(--walnut-light)",
    },
    gold: {
      background: "var(--gold)", color: "var(--walnut)", border: "2px solid var(--gold)",
      hoverBg: "var(--gold-light)",
    },
    outline: {
      background: "transparent", color: "var(--walnut)", border: "2px solid var(--walnut)",
      hoverBg: "var(--parchment-dark)",
    },
  };
  const s = styles[variant];
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, padding: "12px 28px",
        borderRadius: 8, border: s.border, cursor: disabled ? "not-allowed" : "pointer",
        background: disabled ? "var(--parchment-dark)" : hovered ? s.hoverBg : s.background,
        color: disabled ? "var(--ink-light)" : s.color,
        transition: "all 0.2s ease", textTransform: "uppercase", letterSpacing: "0.06em",
        opacity: disabled ? 0.5 : 1,
        ...extraStyle,
      }}
    >
      {children}
    </button>
  );
};

// ─── MAIN APP ──────────────────────────────────────────────────────────────────

export default function AIEthicsCourtroom() {
  const [phase, setPhase] = useState("select");
  const [selectedCase, setSelectedCase] = useState(null);
  const [markedEvidence, setMarkedEvidence] = useState(new Set());
  const [prosecutionArg, setProsecutionArg] = useState("");
  const [defenseArg, setDefenseArg] = useState("");
  const [expertAnalysis, setExpertAnalysis] = useState("");
  const [deliberationAnswers, setDeliberationAnswers] = useState({});
  const [deliberationNotes, setDeliberationNotes] = useState("");
  const [verdict, setVerdict] = useState(null);
  const [confidence, setConfidence] = useState(50);
  const [reflection, setReflection] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [animateIn, setAnimateIn] = useState(true);
  const contentRef = useRef(null);

  const currentPhase = PHASES.find((p) => p.id === phase);
  const phaseIdx = PHASES.findIndex((p) => p.id === phase);

  useEffect(() => {
    setAnimateIn(false);
    const t = setTimeout(() => setAnimateIn(true), 50);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [phase]);

  const goNext = () => {
    if (phaseIdx < PHASES.length - 1) setPhase(PHASES[phaseIdx + 1].id);
  };
  const goBack = () => {
    if (phaseIdx > 0) setPhase(PHASES[phaseIdx - 1].id);
  };

  const toggleEvidence = (id) => {
    setMarkedEvidence((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const resetAll = () => {
    setPhase("select");
    setSelectedCase(null);
    setMarkedEvidence(new Set());
    setProsecutionArg("");
    setDefenseArg("");
    setExpertAnalysis("");
    setDeliberationAnswers({});
    setDeliberationNotes("");
    setVerdict(null);
    setConfidence(50);
    setReflection("");
    setSubmitted(false);
  };

  const canAdvance = () => {
    switch (phase) {
      case "select": return selectedCase !== null;
      case "evidence": return true;
      case "prosecution": return prosecutionArg.split(/\s+/).filter(Boolean).length >= 20;
      case "defense": return defenseArg.split(/\s+/).filter(Boolean).length >= 20;
      case "expert": return expertAnalysis.split(/\s+/).filter(Boolean).length >= 20;
      case "deliberation": return Object.keys(deliberationAnswers).length >= DELIBERATION_QUESTIONS.length;
      default: return false;
    }
  };

  const caseData = selectedCase ? CASES.find((c) => c.id === selectedCase) : null;

  // ─── RENDER PHASES ─────────────────────────────────────────────────────────

  const renderCaseSelection = () => (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 700, color: "var(--ink)", margin: 0 }}>
          Select a Case
        </h2>
        <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: 16, color: "var(--ink-light)", marginTop: 10, fontStyle: "italic" }}>
          Choose an AI ethics dilemma to investigate. You will serve as prosecutor, defense attorney, expert witness, and juror.
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {CASES.map((c) => {
          const active = selectedCase === c.id;
          return (
            <div
              key={c.id}
              onClick={() => setSelectedCase(c.id)}
              style={{
                background: active ? "var(--walnut)" : "var(--cream)",
                border: active ? "2px solid var(--gold)" : "2px solid var(--parchment-dark)",
                borderRadius: 12, padding: "24px 22px", cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: active ? "var(--shadow-lg)" : "var(--shadow)",
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 10 }}>{c.icon}</div>
              <h3 style={{
                fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700,
                color: active ? "var(--parchment)" : "var(--ink)", margin: "0 0 4px 0",
              }}>{c.title}</h3>
              <div style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, textTransform: "uppercase",
                color: active ? "var(--gold)" : "var(--gold)", letterSpacing: "0.05em", marginBottom: 10,
              }}>{c.subtitle}</div>
              <p style={{
                fontFamily: "'Source Serif 4', serif", fontSize: 13.5, lineHeight: 1.6,
                color: active ? "var(--parchment-dark)" : "var(--ink-light)", margin: 0,
              }}>
                {c.summary.slice(0, 180)}...
              </p>
              <div style={{ display: "flex", gap: 6, marginTop: 14, flexWrap: "wrap" }}>
                {c.themes.map((t) => (
                  <span key={t} style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 600, textTransform: "uppercase",
                    padding: "3px 10px", borderRadius: 4, letterSpacing: "0.06em",
                    background: active ? "rgba(196, 154, 42, 0.2)" : "var(--parchment-dark)",
                    color: active ? "var(--gold-light)" : "var(--ink-light)",
                  }}>{t}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderEvidence = () => (
    <div style={{ maxWidth: 860, margin: "0 auto" }}>
      <div style={{ background: "var(--walnut)", borderRadius: 12, padding: "28px 30px", marginBottom: 30, color: "var(--parchment)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <span style={{ fontSize: 20 }}>{caseData.icon}</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, margin: 0 }}>{caseData.title}</h2>
        </div>
        <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: 14.5, lineHeight: 1.7, color: "var(--parchment-dark)", marginBottom: 16 }}>
          {caseData.summary}
        </p>
        <div style={{ background: "rgba(196, 154, 42, 0.15)", borderRadius: 8, padding: "12px 16px", border: "1px solid var(--gold)" }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "var(--gold)", letterSpacing: "0.06em" }}>
            Charge
          </span>
          <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: 14, color: "var(--parchment)", marginTop: 4, fontStyle: "italic" }}>
            {caseData.charge}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>
          Applicable Legal Frameworks
        </h3>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {caseData.frameworks.map((f) => (
            <div key={f.name} style={{
              flex: "1 1 220px", background: "var(--cream)", border: "1px solid var(--parchment-dark)", borderRadius: 8, padding: "14px 16px",
            }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, color: "var(--walnut)", marginBottom: 4 }}>
                {f.name}
              </div>
              <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: 13, color: "var(--ink-light)", lineHeight: 1.5 }}>
                {f.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "var(--ink)", marginBottom: 14 }}>
        Evidence Packet
      </h3>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "var(--ink-light)", marginBottom: 18 }}>
        Review all evidence submitted by both sides. Mark pieces you find most compelling — you'll reference these in your arguments.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {caseData.evidence.map((item) => (
          <EvidenceCard key={item.id} item={item} marked={markedEvidence.has(item.id)} onToggle={toggleEvidence} />
        ))}
      </div>
    </div>
  );

  const renderArgumentPhase = (role, value, onChange, phaseKey) => {
    const labels = {
      prosecution: {
        title: "Prosecution's Case",
        instruction: "You are now the Prosecutor. Build the strongest possible case that the accused party violated ethical and legal standards. Reference specific evidence and legal frameworks.",
        placeholder: "Present your opening statement for the prosecution. Reference specific evidence (e.g., the accuracy audit, testimony from affected individuals) and explain how the facts meet the legal standards for the charge...",
      },
      defense: {
        title: "Defense's Response",
        instruction: "You are now the Defense Attorney. Construct the strongest possible defense. Challenge the prosecution's interpretation of evidence, present mitigating factors, and argue why the accused should not be found liable.",
        placeholder: "Present your defense argument. Address the prosecution's key claims, highlight evidence that supports the defense, identify weaknesses in the prosecution's case, and argue why the accused's actions were reasonable...",
      },
      expert: {
        title: "Expert Witness Analysis",
        instruction: "You are now a neutral Expert Witness. Provide an objective analysis that helps the court understand the technical, ethical, and societal dimensions of this case. You are not advocating for either side.",
        placeholder: "Provide your expert analysis. Address the technical realities of the AI system in question, discuss relevant ethical frameworks, identify what a responsible approach would look like, and note important nuances the court should consider...",
      },
    };
    const l = labels[phaseKey];
    return (
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
          <RoleBadge role={role} active />
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: "var(--ink)", margin: 0 }}>
            {l.title}
          </h2>
        </div>
        <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: 15, color: "var(--ink-light)", lineHeight: 1.7, marginBottom: 24, fontStyle: "italic" }}>
          {l.instruction}
        </p>

        {markedEvidence.size > 0 && (
          <div style={{ background: "var(--parchment)", borderRadius: 8, padding: "14px 18px", marginBottom: 24, border: "1px solid var(--parchment-dark)" }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, textTransform: "uppercase", color: "var(--gold)", letterSpacing: "0.06em", marginBottom: 8 }}>
              Your Marked Evidence
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {caseData.evidence.filter((e) => markedEvidence.has(e.id)).map((e) => (
                <div key={e.id} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "var(--ink-light)" }}>
                  <span style={{ fontWeight: 600, color: "var(--ink)" }}>{e.type} {e.title}</span>
                  <span style={{ fontSize: 11, marginLeft: 8, textTransform: "uppercase", color: e.side === "prosecution" ? "var(--prosecution-red)" : e.side === "defense" ? "var(--defense-blue)" : "var(--neutral-green)" }}>
                    [{e.side}]
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <WritingArea
          label="Your Argument"
          placeholder={l.placeholder}
          value={value}
          onChange={onChange}
          prompts={caseData.prompts[phaseKey]}
          minRows={10}
        />
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "var(--ink-light)", marginTop: 8 }}>
          Minimum 20 words to continue. Take your time — thorough arguments make for better deliberation.
        </div>
      </div>
    );
  };

  const renderDeliberation = () => (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
        <RoleBadge role="Juror" active />
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: "var(--ink)", margin: 0 }}>
          Jury Deliberation
        </h2>
      </div>
      <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: 15, color: "var(--ink-light)", lineHeight: 1.7, marginBottom: 10, fontStyle: "italic" }}>
        You are now the Juror. Having heard both sides and the expert witness, carefully weigh the evidence and arguments.
        Work through each question below before reaching your verdict.
      </p>

      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 30,
        background: "var(--parchment)", borderRadius: 10, padding: 20, border: "1px solid var(--parchment-dark)",
      }}>
        <div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "var(--prosecution-red)", letterSpacing: "0.06em", marginBottom: 8 }}>
            Prosecution Argued
          </div>
          <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: 13, color: "var(--ink-light)", lineHeight: 1.6, maxHeight: 120, overflow: "auto" }}>
            {prosecutionArg || "(No argument submitted)"}
          </div>
        </div>
        <div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "var(--defense-blue)", letterSpacing: "0.06em", marginBottom: 8 }}>
            Defense Argued
          </div>
          <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: 13, color: "var(--ink-light)", lineHeight: 1.6, maxHeight: 120, overflow: "auto" }}>
            {defenseArg || "(No argument submitted)"}
          </div>
        </div>
      </div>

      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "var(--ink)", marginBottom: 14 }}>
        Deliberation Checklist
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 30 }}>
        {DELIBERATION_QUESTIONS.map((q) => (
          <div key={q.id} style={{
            background: "var(--cream)", borderRadius: 8, padding: "16px 20px",
            border: deliberationAnswers[q.id] ? "1.5px solid var(--gold)" : "1.5px solid var(--parchment-dark)",
            transition: "border-color 0.2s ease",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: 15, color: "var(--ink)", lineHeight: 1.5, flex: 1 }}>
                {q.question}
              </div>
              <span style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                padding: "2px 8px", borderRadius: 4, marginLeft: 12,
                background: q.weight === "critical" ? "var(--prosecution-bg)" : q.weight === "important" ? "var(--gold-dim)" : "var(--parchment-dark)",
                color: q.weight === "critical" ? "var(--prosecution-red)" : q.weight === "important" ? "var(--gold)" : "var(--ink-light)",
                letterSpacing: "0.06em", whiteSpace: "nowrap",
              }}>{q.weight}</span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {["Yes, clearly", "Partially", "No", "Uncertain"].map((opt) => {
                const active = deliberationAnswers[q.id] === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => setDeliberationAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                    style={{
                      fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500, padding: "7px 16px",
                      borderRadius: 6, border: `1.5px solid ${active ? "var(--gold)" : "var(--parchment-dark)"}`,
                      background: active ? "var(--gold-dim)" : "transparent",
                      color: active ? "var(--walnut)" : "var(--ink-light)",
                      cursor: "pointer", transition: "all 0.2s ease",
                    }}
                  >{opt}</button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <WritingArea
        label="Deliberation Notes"
        placeholder="Record your reasoning. What evidence was most persuasive? What arguments were strongest on each side? What are you still uncertain about?"
        value={deliberationNotes}
        onChange={setDeliberationNotes}
        minRows={5}
      />
    </div>
  );

  const renderVerdict = () => {
    const yesCount = Object.values(deliberationAnswers).filter((v) => v === "Yes, clearly").length;
    const partialCount = Object.values(deliberationAnswers).filter((v) => v === "Partially").length;
    const noCount = Object.values(deliberationAnswers).filter((v) => v === "No").length;

    if (!submitted) {
      return (
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: 8 }}>
            <RoleBadge role="Juror" active />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: "var(--ink)", margin: 0 }}>
              Render Your Verdict
            </h2>
          </div>
          <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: 15, color: "var(--ink-light)", fontStyle: "italic", marginBottom: 30 }}>
            Based on your review of the evidence, the arguments from both sides, expert testimony, and your deliberation,
            how do you find in the case of <strong>{caseData.title}</strong>?
          </p>

          <div style={{ display: "flex", gap: 20, justifyContent: "center", marginBottom: 36 }}>
            {[
              { value: "liable", label: "LIABLE", sub: "The accused is responsible for the harms alleged", color: "var(--prosecution-red)", bg: "var(--prosecution-bg)" },
              { value: "not-liable", label: "NOT LIABLE", sub: "The accused is not responsible for the harms alleged", color: "var(--defense-blue)", bg: "var(--defense-bg)" },
            ].map((opt) => {
              const active = verdict === opt.value;
              return (
                <div
                  key={opt.value}
                  onClick={() => setVerdict(opt.value)}
                  style={{
                    flex: 1, maxWidth: 280, padding: "28px 24px", borderRadius: 12, cursor: "pointer",
                    background: active ? opt.bg : "var(--cream)",
                    border: `2.5px solid ${active ? opt.color : "var(--parchment-dark)"}`,
                    transition: "all 0.3s ease",
                    boxShadow: active ? "var(--shadow-lg)" : "var(--shadow)",
                  }}
                >
                  <div style={{
                    fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 800, color: active ? opt.color : "var(--ink-light)",
                    marginBottom: 8, transition: "color 0.3s ease",
                  }}>{opt.label}</div>
                  <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: 13, color: "var(--ink-light)", lineHeight: 1.5 }}>
                    {opt.sub}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginBottom: 36, textAlign: "left", maxWidth: 500, margin: "0 auto 36px" }}>
            <label style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 600, color: "var(--ink)", display: "block", marginBottom: 12 }}>
              Confidence Level: {confidence}%
            </label>
            <input
              type="range" min={0} max={100} value={confidence}
              onChange={(e) => setConfidence(Number(e.target.value))}
              style={{ width: "100%", accentColor: "var(--gold)" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "var(--ink-light)" }}>
              <span>Very uncertain</span>
              <span>Very confident</span>
            </div>
          </div>

          <div style={{ textAlign: "left", maxWidth: 500, margin: "0 auto 30px" }}>
            <WritingArea
              label="Reflection"
              placeholder="What did this case teach you about AI ethics? What surprised you? How does this connect to real-world AI policy? What was hardest about this exercise — and why?"
              value={reflection}
              onChange={setReflection}
              minRows={5}
            />
          </div>

          <Button variant="gold" onClick={() => setSubmitted(true)} disabled={!verdict || reflection.split(/\s+/).filter(Boolean).length < 10}>
            Submit Verdict & Reflection
          </Button>
          {(!verdict || reflection.split(/\s+/).filter(Boolean).length < 10) && (
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "var(--ink-light)", marginTop: 10 }}>
              Select a verdict and write at least 10 words of reflection to submit.
            </div>
          )}
        </div>
      );
    }

    // SUBMITTED VIEW
    return (
      <div style={{ maxWidth: 750, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>⚖️</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 800, color: "var(--ink)", margin: 0 }}>
            Verdict Rendered
          </h2>
          <div style={{
            fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, marginTop: 12,
            color: verdict === "liable" ? "var(--prosecution-red)" : "var(--defense-blue)",
          }}>
            {verdict === "liable" ? "FOUND LIABLE" : "FOUND NOT LIABLE"}
          </div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "var(--ink-light)", marginTop: 6 }}>
            Confidence: {confidence}%
          </div>
        </div>

        <div style={{ background: "var(--walnut)", borderRadius: 12, padding: "24px 28px", marginBottom: 24, color: "var(--parchment)" }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, margin: "0 0 12px 0", color: "var(--gold)" }}>
            Case Summary — {caseData.title}
          </h3>
          <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: 14, lineHeight: 1.7, color: "var(--parchment-dark)" }}>
            {caseData.summary}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
          <div style={{ background: "var(--prosecution-bg)", borderRadius: 8, padding: 16, textAlign: "center" }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 28, fontWeight: 800, color: "var(--prosecution-red)" }}>{yesCount}</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, textTransform: "uppercase", color: "var(--prosecution-red)", letterSpacing: "0.05em" }}>Clear Yes</div>
          </div>
          <div style={{ background: "var(--gold-dim)", borderRadius: 8, padding: 16, textAlign: "center" }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 28, fontWeight: 800, color: "var(--gold)" }}>{partialCount}</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, textTransform: "uppercase", color: "var(--gold)", letterSpacing: "0.05em" }}>Partially</div>
          </div>
          <div style={{ background: "var(--defense-bg)", borderRadius: 8, padding: 16, textAlign: "center" }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 28, fontWeight: 800, color: "var(--defense-blue)" }}>{noCount}</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, textTransform: "uppercase", color: "var(--defense-blue)", letterSpacing: "0.05em" }}>No</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
          {[
            { title: "Your Prosecution Argument", text: prosecutionArg, color: "var(--prosecution-red)" },
            { title: "Your Defense Argument", text: defenseArg, color: "var(--defense-blue)" },
          ].map((item) => (
            <div key={item.title} style={{ background: "var(--cream)", borderRadius: 8, padding: "16px 18px", border: "1px solid var(--parchment-dark)" }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: item.color, letterSpacing: "0.05em", marginBottom: 8 }}>
                {item.title}
              </div>
              <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: 13, lineHeight: 1.6, color: "var(--ink-light)", maxHeight: 150, overflow: "auto" }}>
                {item.text}
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: "var(--cream)", borderRadius: 8, padding: "16px 18px", border: "1px solid var(--parchment-dark)", marginBottom: 24 }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "var(--neutral-green)", letterSpacing: "0.05em", marginBottom: 8 }}>
            Your Expert Analysis
          </div>
          <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: 13, lineHeight: 1.6, color: "var(--ink-light)", maxHeight: 150, overflow: "auto" }}>
            {expertAnalysis}
          </div>
        </div>

        <div style={{ background: "var(--gold-dim)", borderRadius: 8, padding: "16px 18px", border: "1px solid var(--gold)", marginBottom: 30 }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "var(--gold)", letterSpacing: "0.05em", marginBottom: 8 }}>
            Your Reflection
          </div>
          <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: 14, lineHeight: 1.7, color: "var(--ink)" }}>
            {reflection}
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <Button variant="outline" onClick={resetAll}>
            Try Another Case
          </Button>
        </div>
      </div>
    );
  };

  // ─── MAIN RENDER ─────────────────────────────────────────────────────────────

  return (
    <div style={{
      ...cssVars,
      minHeight: "100vh",
      background: "var(--parchment)",
      fontFamily: "'Source Serif 4', serif",
      display: "flex",
      flexDirection: "column",
    }}>
      <style>{fonts}{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; }
        textarea::placeholder { color: #999; }
        input[type="range"] { height: 6px; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: var(--parchment); }
        ::-webkit-scrollbar-thumb { background: var(--parchment-dark); border-radius: 3px; }
      `}</style>

      {/* HEADER */}
      <header style={{
        background: "var(--walnut)",
        borderBottom: "3px solid var(--gold)",
        padding: "16px 28px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        boxShadow: "0 4px 16px rgba(44, 24, 16, 0.3)",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <GavelIcon size={30} />
          <div>
            <div style={{
              fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 800, color: "var(--parchment)",
              letterSpacing: "0.02em",
            }}>
              AI Ethics Courtroom
            </div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>
              PantherLearn
            </div>
          </div>
        </div>
        {currentPhase.roleLabel && <RoleBadge role={currentPhase.roleLabel} active />}
        {phase !== "select" && (
          <button onClick={resetAll} style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, color: "var(--parchment-dark)",
            background: "none", border: "1px solid rgba(245,240,232,0.2)", padding: "6px 14px", borderRadius: 6,
            cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.06em",
          }}>
            New Case
          </button>
        )}
      </header>

      {/* PROGRESS */}
      {phase !== "select" && (
        <div style={{ background: "var(--parchment)", padding: "16px 0 12px", borderBottom: "1px solid var(--parchment-dark)" }}>
          <ProgressBar phase={phase} phases={PHASES} />
          <div style={{ textAlign: "center", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: "var(--ink-light)", marginTop: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Phase {phaseIdx + 1} of {PHASES.length}: {currentPhase.label}
          </div>
        </div>
      )}

      {/* CONTENT */}
      <main
        ref={contentRef}
        style={{
          flex: 1, padding: "36px 28px 100px", overflowY: "auto",
          animation: animateIn ? "fadeUp 0.4s ease" : "none",
        }}
      >
        {phase === "select" && renderCaseSelection()}
        {phase === "evidence" && renderEvidence()}
        {phase === "prosecution" && renderArgumentPhase("Prosecutor", prosecutionArg, setProsecutionArg, "prosecution")}
        {phase === "defense" && renderArgumentPhase("Defense Attorney", defenseArg, setDefenseArg, "defense")}
        {phase === "expert" && renderArgumentPhase("Expert Witness", expertAnalysis, setExpertAnalysis, "expert")}
        {phase === "deliberation" && renderDeliberation()}
        {phase === "verdict" && renderVerdict()}
      </main>

      {/* FOOTER NAV */}
      {phase !== "verdict" && (
        <footer style={{
          position: "sticky", bottom: 0,
          background: "var(--cream)", borderTop: "2px solid var(--parchment-dark)",
          padding: "14px 28px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          boxShadow: "0 -4px 16px rgba(44, 24, 16, 0.08)",
        }}>
          <div>
            {phaseIdx > 0 && <Button variant="outline" onClick={goBack}>← Back</Button>}
          </div>
          <Button variant={canAdvance() ? "gold" : "primary"} onClick={goNext} disabled={!canAdvance()}>
            {phase === "deliberation" ? "Proceed to Verdict →" : "Continue →"}
          </Button>
        </footer>
      )}
    </div>
  );
}
