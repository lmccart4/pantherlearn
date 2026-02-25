# 🤖🍳 RecipeBot Data Curation Lab

An interactive 4-stage educational tool where students act as data curators for "RecipeBot" — a fictional recipe chatbot. Students make real decisions about training data and see firsthand how those choices affect AI model behavior.

## 🎯 Learning Objectives

- Understand how training data shapes AI model behavior
- Identify bias, gaps, and representation issues in datasets
- Practice data cleaning and quality control
- Connect upstream data decisions to downstream model outputs
- Think critically about ethical data sourcing

---

## 📋 The 4 Stages

### Stage 1: Source Selection
Students browse a catalog of 13 data sources (recipe sites, social media, specialized databases, problematic sources) and choose which to include — constrained by a 100-credit budget that forces tradeoffs.

### Stage 2: Bias Detection
Interactive visualizations show cuisine representation, dietary coverage, and language distribution across their selected dataset. Students compare against world population benchmarks and write a bias analysis.

### Stage 3: Data Cleaning
Students review 12 sample data entries and classify each as clean or flagged with specific issues (medical misinfo, personal data, toxic content, hidden ads, food safety hazards, cultural misrepresentation, copyright violations, duplicates, eating disorder promotion).

### Stage 4: Model Testing
Students "test" their curated RecipeBot with 8 preset prompts (plus custom prompts) that probe different aspects — diversity, safety, cultural accuracy, commercial bias, health claims. RecipeBot's responses dynamically reflect the student's curation choices via the Gemini API.

### Summary
Automated scoring, decision review, key takeaways, and a final reflection.

---

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+
- Firebase CLI (`npm install -g firebase-tools`)
- A Firebase project (can use your existing PantherLearn project)
- A Google Gemini API key

### 1. Install Dependencies

```bash
# Frontend
cd recipebot-curation
npm install

# Cloud Functions
cd functions
npm install
cd ..
```

### 2. Configure Firebase

Edit `src/firebase.js` and replace the config with your Firebase project details:

```javascript
const firebaseConfig = {
  apiKey: "your-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  // etc.
};
```

### 3. Set Up the Gemini API Key (Cloud Function)

```bash
# Set the secret in Firebase
firebase functions:secrets:set GEMINI_API_KEY
# Paste your Gemini API key when prompted
```

### 4. Deploy Cloud Function

```bash
firebase deploy --only functions
```

### 5. Deploy Firestore Rules

Edit `firestore.rules` to add your teacher email, then:

```bash
firebase deploy --only firestore:rules
```

### 6. Run Locally (Development)

```bash
npm run dev
```

### 7. Build & Deploy to Firebase Hosting

```bash
npm run build
firebase deploy --only hosting
```

---

## 🔧 Configuration Options

### Adding Teacher Emails for Grade Review
In `firestore.rules`, add teacher emails to the allow list:
```
request.auth.token.email in ['teacher1@school.edu', 'teacher2@school.edu']
```

### Adjusting the Budget
In `src/data/sources.js`, change `TOTAL_BUDGET` (default: 100).

### Adding More Data Sources
Add entries to the `DATA_SOURCES` array in `src/data/sources.js`. Each source needs:
- `id`, `name`, `type`, `icon`, `description`
- `volume`, `cost` (budget credits)
- `cuisineBreakdown` (percentages summing to ~100)
- `dietaryTags`, `languages`, `biasNotes`
- `qualityScore`, `diversityScore`, `reliabilityScore` (1-10)
- `risks` (array of strings)
- `category` ("structured" | "social" | "specialized" | "problematic")

### Adding More Cleaning Samples
Add entries to `CLEANING_SAMPLES` in `src/data/sources.js`.

### Adding More Test Prompts
Add entries to `TEST_PROMPTS` in `src/data/sources.js`.

---

## 📊 Grading

Student submissions are saved to Firestore at `recipebot_curation/{userId}` with:
- All selected sources and budget usage
- Written bias analysis
- Every cleaning decision with correct/incorrect status
- All RecipeBot test results and student reflections
- Automated scores (out of 100)

You can query Firestore directly or build a teacher dashboard to review submissions.

---

## 🏗️ Project Structure

```
recipebot-curation/
├── src/
│   ├── App.jsx              # Main app with stage routing
│   ├── main.jsx             # React entry point
│   ├── firebase.js          # Firebase config
│   ├── components/
│   │   └── LoginGate.jsx    # Google auth login
│   ├── stages/
│   │   ├── StageOne.jsx     # Source selection
│   │   ├── StageTwo.jsx     # Bias detection
│   │   ├── StageThree.jsx   # Data cleaning
│   │   ├── StageFour.jsx    # Model testing (Gemini)
│   │   └── Summary.jsx      # Score & reflection
│   ├── data/
│   │   └── sources.js       # All game data
│   └── styles/
│       └── App.css          # Full stylesheet
├── functions/
│   ├── index.js             # Gemini proxy Cloud Function
│   └── package.json
├── firestore.rules
├── package.json
├── vite.config.js
└── index.html
```

---

## 💡 Teaching Tips

1. **Run Stage 1 as a class discussion** — project the source catalog and have students debate which sources to include before they make individual choices.

2. **Stage 3 is great for Socratic discussion** — the "golden turmeric latte" entry (clean) vs. the "miracle cancer juice" (dangerous) teaches nuance in health claims.

3. **Compare student RecipeBots** — have students test the same prompts and compare responses. Different data = different behavior is a powerful moment.

4. **The sponsored source (MegaFoods™)** is free and tempting — students who include it will see RecipeBot recommend brand products, which sparks great conversation about commercial influence in AI.

5. **The scraped personal blogs** source raises consent and privacy issues that parallel real AI training controversies.
