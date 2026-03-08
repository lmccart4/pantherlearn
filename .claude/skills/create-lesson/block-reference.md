# PantherLearn Block Reference

Complete schema reference for all available block types. Every block requires `id` (unique string) and `type`.

## Content Blocks (no student data)

### section_header
```json
{ "id": "...", "type": "section_header", "icon": "📌", "title": "Section Title", "subtitle": "~10 minutes" }
```

### text
Supports markdown (`**bold**`, `*italic*`, `\n` for newlines).
```json
{ "id": "...", "type": "text", "content": "Markdown content here" }
```

### video
YouTube URLs (any format — watch, share, embed).
```json
{ "id": "...", "type": "video", "url": "https://www.youtube.com/embed/...", "caption": "Optional caption" }
```

### image
```json
{ "id": "...", "type": "image", "url": "https://...", "caption": "Optional", "alt": "Accessibility text" }
```

### definition
```json
{ "id": "...", "type": "definition", "term": "Term", "definition": "Definition text" }
```

### callout
Styles: `insight` (💡), `warning` (⚠️), `question` (❓)
```json
{ "id": "...", "type": "callout", "style": "insight", "icon": "💡", "content": "Callout text" }
```

### objectives
```json
{ "id": "...", "type": "objectives", "title": "Learning Objectives", "items": ["Objective 1", "Objective 2"] }
```

### activity
Instructions card for unplugged/group activities.
```json
{ "id": "...", "type": "activity", "icon": "🎭", "title": "Activity Name", "instructions": "Step-by-step instructions" }
```

### vocab_list
```json
{ "id": "...", "type": "vocab_list", "terms": [{ "term": "Word", "definition": "Meaning" }] }
```

### embed
For Google Forms, external iframes.
```json
{ "id": "...", "type": "embed", "url": "https://...", "caption": "", "height": 400 }
```

### divider
```json
{ "id": "...", "type": "divider" }
```

### external_link
```json
{ "id": "...", "type": "external_link", "icon": "🔗", "title": "Link Title", "url": "https://...", "description": "What this links to", "buttonLabel": "Open", "openInNewTab": true }
```

## Interactive Blocks (save student data)

### question — Multiple Choice
```json
{
  "id": "...", "type": "question", "questionType": "multiple_choice",
  "prompt": "Question text?",
  "difficulty": "understand",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctIndex": 1,
  "explanation": "Why this answer is correct"
}
```
Difficulty levels (Bloom's): `remember` (0.75x XP), `understand` (1x), `apply` (1.25x), `analyze` (1.5x), `evaluate` (1.75x), `create` (2x)

### question — Short Answer
```json
{
  "id": "...", "type": "question", "questionType": "short_answer",
  "prompt": "Open-ended question?",
  "difficulty": "evaluate"
}
```

### question — Ranking
```json
{
  "id": "...", "type": "question", "questionType": "ranking",
  "prompt": "Put these in order...",
  "difficulty": "analyze",
  "items": ["First", "Second", "Third"]
}
```
Items array is the CORRECT order. Students rearrange to match.

### question — Linked
References a prior block's answer for follow-up.
```json
{
  "id": "...", "type": "question", "questionType": "linked",
  "prompt": "Based on your previous answer...",
  "difficulty": "evaluate",
  "linkedBlockId": "id-of-prior-question"
}
```

### chatbot
AI conversation with Gemini backend.
```json
{
  "id": "...", "type": "chatbot",
  "icon": "🤖",
  "title": "Chatbot Title",
  "starterMessage": "What the AI says first",
  "systemPrompt": "Hidden instructions: role, boundaries, response length, age-appropriate behavior",
  "instructions": "Visible instructions for the student",
  "placeholder": "Input placeholder text..."
}
```
**System prompt must include:** role/persona, topic boundaries, response length guidance (e.g., "3-5 sentences"), age-appropriate behavior note.

### checklist
```json
{
  "id": "...", "type": "checklist",
  "title": "Steps to Complete",
  "items": ["Step 1", "Step 2", "Step 3"]
}
```
Student data: `{ checked: { 0: true, 1: false, ... }, savedAt: "..." }`

### sorting (Tinder-style swipe)
```json
{
  "id": "...", "type": "sorting",
  "icon": "🔀",
  "title": "Sort It!",
  "instructions": "Swipe instructions",
  "leftLabel": "Category A",
  "rightLabel": "Category B",
  "items": [
    { "text": "Item text", "correct": "left" },
    { "text": "Item text", "correct": "right" }
  ]
}
```

### simulation (PhET or other iframes)
```json
{
  "id": "...", "type": "simulation",
  "icon": "🧪",
  "title": "Simulation Title",
  "url": "https://phet.colorado.edu/sims/html/...",
  "height": 500,
  "observationPrompt": "What did you observe?"
}
```

### evidence_upload
```json
{
  "id": "...", "type": "evidence_upload",
  "icon": "📷",
  "title": "Upload Evidence",
  "instructions": "What to photograph/capture",
  "reflectionPrompt": "What did you observe?"
}
```

### sketch
```json
{
  "id": "...", "type": "sketch",
  "title": "Draw It",
  "instructions": "What to sketch",
  "canvasHeight": 400
}
```

### bar_chart (physics energy bars)
```json
{
  "id": "...", "type": "bar_chart",
  "title": "Energy Bar Chart",
  "barCount": 4,
  "initialLabel": "Initial State",
  "finalLabel": "Final State",
  "deltaLabel": "Change"
}
```

### calculator
```json
{
  "id": "...", "type": "calculator",
  "title": "Calculator Title",
  "description": "What this calculates",
  "formula": "value1 * value2",
  "showFormula": false,
  "inputs": [{ "name": "value1", "label": "Value 1", "unit": "m/s" }],
  "output": { "label": "Result", "unit": "N", "decimals": 2 }
}
```

### data_table
```json
{
  "id": "...", "type": "data_table",
  "preset": "momentum",
  "title": "Data Table",
  "trials": 1,
  "labelA": "",
  "labelB": ""
}
```

## Activity Blocks (in-app interactives)

### guess_who
```json
{
  "id": "...", "type": "guess_who",
  "icon": "🎭", "title": "Guess Who?",
  "instructions": "Game instructions",
  "characterSet": "default",
  "customCharacters": [],
  "xpForWin": 50, "xpForPlay": 10
}
```

### chatbot_workshop
```json
{
  "id": "...", "type": "chatbot_workshop",
  "icon": "🤖", "title": "Build-a-Chatbot Workshop",
  "instructions": "Workshop instructions"
}
```

### bias_detective
```json
{
  "id": "...", "type": "bias_detective",
  "icon": "🔍", "title": "AI Bias Detective",
  "instructions": "Investigation instructions"
}
```

### embedding_explorer
```json
{
  "id": "...", "type": "embedding_explorer",
  "icon": "🧭", "title": "Embedding Explorer",
  "instructions": "Exploration instructions"
}
```

### space_rescue
```json
{
  "id": "...", "type": "space_rescue",
  "icon": "🚀", "title": "Space Rescue Mission",
  "instructions": "Mission instructions"
}
```

### rocket_staging
```json
{ "id": "...", "type": "rocket_staging", "icon": "🚀", "title": "Rocket Staging Challenge" }
```

### concept_builder
```json
{ "id": "...", "type": "concept_builder", "icon": "🧱", "title": "Concept Builder" }
```

## External Activity Blocks (link to separate Firebase apps)

### prompt_duel
```json
{
  "id": "...", "type": "prompt_duel",
  "icon": "⚔️", "title": "Prompt Duel",
  "instructions": "Activity instructions",
  "url": "https://prompt-duel-paps.firebaseapp.com"
}
```

### recipe_bot
```json
{
  "id": "...", "type": "recipe_bot",
  "icon": "🍳", "title": "RecipeBot Data Curation Lab",
  "instructions": "Activity instructions",
  "url": "https://recipebot-curation.firebaseapp.com"
}
```

### ai_training_sim
```json
{
  "id": "...", "type": "ai_training_sim",
  "icon": "🧠", "title": "AI Training Simulator",
  "instructions": "Activity instructions",
  "url": "https://ai-training-sim-paps.firebaseapp.com"
}
```

### data_labeling_lab
```json
{
  "id": "...", "type": "data_labeling_lab",
  "icon": "🏷️", "title": "Data Labeling Lab",
  "instructions": "Activity instructions",
  "url": "https://data-labeling-lab-paps.firebaseapp.com"
}
```

### ai_ethics_courtroom
```json
{
  "id": "...", "type": "ai_ethics_courtroom",
  "icon": "⚖️", "title": "AI Ethics Courtroom",
  "instructions": "Activity instructions",
  "url": "https://ai-ethics-courtroom-paps.firebaseapp.com"
}
```

## Block Component Pattern (for custom blocks)

```jsx
export default function CustomBlock({ block, studentData, onAnswer }) {
  const data = studentData?.[block.id] || {};
  const [state, setState] = useState(data.savedField || "");
  const hydrated = useRef(false);

  // Sync from Firestore snapshot / handle teacher reset
  useEffect(() => {
    const saved = studentData?.[block.id];
    if (!saved) {
      if (hydrated.current) setState(""); // Teacher reset
      return;
    }
    if (hydrated.current) return;
    hydrated.current = true;
    if (saved.savedField) setState(saved.savedField);
  }, [studentData, block.id]);

  const handleSave = () => {
    onAnswer(block.id, { savedField: state, savedAt: new Date().toISOString() });
  };

  return <div>...</div>;
}
```

## Seed Script Pattern

Uses Firebase Admin SDK (bypasses Firestore security rules):

```javascript
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = { title, course, unit, order, visible: false, blocks: [...] };

async function seed() {
  try {
    await db.collection('courses').doc('<course-id>')
      .collection('lessons').doc('<lesson-slug>')
      .set(lesson);
    console.log('Lesson seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

seed();
```

Run with: `node scripts/seed-<name>.js`
