// src/pages/LessonEditor.jsx
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { collection, getDocs, getDocsFromServer, doc, setDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { useNavigate, useSearchParams } from "react-router-dom";
import { db } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth";
import { uid } from "../lib/utils";
import { generateLessonBaselines } from "../lib/aiBaselines";
import { fanOutNotification } from "../lib/notifications";
import { generateQuestionSuggestion } from "../lib/aiQuestionGenerator";
import useAutoSave from "../hooks/useAutoSave";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";

const BLOCK_TYPES = [
  { type: "section_header", label: "Section Header", icon: "📌" },
  { type: "text", label: "Text", icon: "📝" },
  { type: "video", label: "Video", icon: "🎬" },
  { type: "image", label: "Image", icon: "🖼" },
  { type: "definition", label: "Definition", icon: "📖" },
  { type: "callout", label: "Callout", icon: "💡" },
  { type: "objectives", label: "Objectives", icon: "🎯" },
  { type: "checklist", label: "Checklist", icon: "📋" },
  { type: "activity", label: "Activity", icon: "🔧" },
  { type: "vocab_list", label: "Vocab List", icon: "📚" },
  { type: "embed", label: "Embed", icon: "📊" },
  { type: "divider", label: "Divider", icon: "➗" },
  { type: "chatbot", label: "AI Chatbot", icon: "🤖" },
  { type: "question", label: "Question (MC)", icon: "❓", questionType: "multiple_choice" },
  { type: "question", label: "Question (Written)", icon: "✏️", questionType: "short_answer" },
  { type: "question", label: "Question (Ranking)", icon: "🔢", questionType: "ranking" },
  { type: "question", label: "Question (Linked)", icon: "🔗", questionType: "linked" },
  { type: "sorting", label: "Sorting (Swipe)", icon: "🔀" },
  { type: "external_link", label: "External Link", icon: "🔗" },
  { type: "calculator", label: "Calculator", icon: "🧮" },
  { type: "data_table", label: "Data Table", icon: "📊" },
  { type: "simulation", label: "Simulation", icon: "🧪" },
  { type: "evidence_upload", label: "Evidence Upload", icon: "📷" },
  { type: "bar_chart", label: "Bar Chart", icon: "📊" },
  { type: "sketch", label: "Sketch Canvas", icon: "✏️" },
  { type: "guess_who", label: "Guess Who?", icon: "🎭" },
  { type: "chatbot_workshop", label: "Chatbot Workshop", icon: "🤖" },
  { type: "bias_detective", label: "Bias Detective", icon: "🔍" },
  { type: "prompt_duel", label: "Prompt Duel", icon: "⚔️" },
  { type: "recipe_bot", label: "RecipeBot Curation", icon: "🍳" },
  { type: "ai_training_sim", label: "AI Training Sim", icon: "🧠" },
  { type: "data_labeling_lab", label: "Data Labeling Lab", icon: "🏷️" },
  { type: "ai_ethics_courtroom", label: "AI Ethics Courtroom", icon: "⚖️" },
  { type: "rocket_staging", label: "Rocket Staging", icon: "🚀" },
  { type: "momentum_mystery_lab", label: "Momentum Mystery Lab", icon: "🔭" },
];

const BLOCK_CATEGORIES = [
  { label: "Content", types: ["section_header", "text", "video", "image", "definition", "callout", "objectives", "checklist", "activity", "vocab_list", "embed", "external_link"] },
  { label: "Questions", types: ["question", "sorting"] },
  { label: "Interactive", types: ["chatbot", "calculator", "data_table", "simulation", "evidence_upload", "bar_chart", "sketch", "guess_who", "chatbot_workshop", "bias_detective", "prompt_duel", "recipe_bot", "ai_training_sim", "data_labeling_lab", "ai_ethics_courtroom", "rocket_staging", "momentum_mystery_lab"] },
  { label: "Layout", types: ["divider"] },
];

function defaultBlockData(typeInfo) {
  const base = { id: uid(), type: typeInfo.type };
  switch (typeInfo.type) {
    case "section_header": return { ...base, icon: "📌", title: "", subtitle: "" };
    case "text": return { ...base, content: "" };
    case "video": return { ...base, url: "", caption: "" };
    case "image": return { ...base, url: "", caption: "", alt: "" };
    case "definition": return { ...base, term: "", definition: "" };
    case "callout": return { ...base, icon: "💡", style: "insight", content: "" };
    case "objectives": return { ...base, title: "Learning Objectives", items: [""] };
    case "checklist": return { ...base, title: "", items: [""] };
    case "activity": return { ...base, icon: "🔧", title: "", instructions: "" };
    case "vocab_list": return { ...base, terms: [{ term: "", definition: "" }] };
    case "embed": return { ...base, url: "", caption: "", height: 400, scored: false };
    case "divider": return { ...base };
    case "chatbot": return { ...base, icon: "🤖", title: "", starterMessage: "Hi! I'm ready to chat.", systemPrompt: "", instructions: "", placeholder: "Type a message..." };
    case "question":
      if (typeInfo.questionType === "multiple_choice") {
        return { ...base, questionType: "multiple_choice", prompt: "", difficulty: "understand", options: ["", "", "", ""], correctIndex: 0, explanation: "" };
      }
      if (typeInfo.questionType === "ranking") {
        return { ...base, questionType: "ranking", prompt: "", difficulty: "analyze", items: ["", "", ""] };
      }
      if (typeInfo.questionType === "linked") {
        return { ...base, questionType: "linked", prompt: "", difficulty: "evaluate", linkedBlockId: "" };
      }
      return { ...base, questionType: "short_answer", prompt: "", difficulty: "understand" };
    case "sorting": return { ...base, icon: "🔀", title: "Sort It!", instructions: "", leftLabel: "Category A", rightLabel: "Category B", items: [{ text: "", correct: "left" }] };
    case "external_link": return { ...base, icon: "🔗", title: "", url: "", description: "", buttonLabel: "Open", openInNewTab: true };
    case "calculator": return { ...base, title: "", description: "", formula: "", showFormula: false, inputs: [{ name: "value1", label: "Value 1", unit: "" }], output: { label: "Result", unit: "", decimals: 2 } };
    case "data_table": return { ...base, preset: "momentum", title: "Momentum Data Table", trials: 1, labelA: "", labelB: "" };
    case "simulation": return { ...base, icon: "🧪", title: "Interactive Simulation", url: "", height: 500, observationPrompt: "" };
    case "evidence_upload": return { ...base, icon: "📷", title: "Upload Evidence", instructions: "", reflectionPrompt: "What did you observe? What did you learn?" };
    case "bar_chart": return { ...base, title: "Energy Bar Chart", barCount: 4, initialLabel: "Initial State", finalLabel: "Final State", deltaLabel: "" };
    case "sketch": return { ...base, title: "Sketch", instructions: "", canvasHeight: 400 };
    case "guess_who": return { ...base, icon: "🎭", title: "Guess Who?", instructions: "Challenge a classmate to a game of Guess Who! Take turns asking yes/no questions to identify your opponent's secret character.", characterSet: "default", customCharacters: [], xpForWin: 50, xpForPlay: 10 };
    case "chatbot_workshop": return { ...base, icon: "🤖", title: "Build-a-Chatbot Workshop", instructions: "Design and test your own chatbot! Start with a decision tree, then add keyword matching rules." };
    case "bias_detective": return { ...base, icon: "🔍", title: "AI Bias Detective", instructions: "Investigate AI systems for hidden bias. Examine training data, uncover clues, and write a report." };
    case "prompt_duel": return { ...base, icon: "⚔️", title: "Prompt Duel", instructions: "Write AI prompts to match target outputs, competing against AI opponents across 6 progressive challenges.", url: "https://prompt-duel-paps.firebaseapp.com" };
    case "recipe_bot": return { ...base, icon: "🍳", title: "RecipeBot Data Curation Lab", instructions: "Curate and label training data for a recipe recommendation AI. Learn how data quality affects model performance.", url: "https://recipebot-curation.firebaseapp.com" };
    case "ai_training_sim": return { ...base, icon: "🧠", title: "AI Training Simulator", instructions: "Train your own AI model and see how different data and parameters affect its performance.", url: "https://ai-training-sim-paps.firebaseapp.com" };
    case "data_labeling_lab": return { ...base, icon: "🏷️", title: "Data Labeling Lab", instructions: "Practice labeling data for machine learning. Understand how human decisions shape AI behavior.", url: "https://data-labeling-lab-paps.firebaseapp.com" };
    case "ai_ethics_courtroom": return { ...base, icon: "⚖️", title: "AI Ethics Courtroom", instructions: "Debate AI ethics dilemmas in a structured courtroom role-play. Argue cases from multiple perspectives.", url: "https://ai-ethics-courtroom-paps.firebaseapp.com" };
    case "rocket_staging": return { ...base, icon: "🚀", title: "Rocket Staging Challenge" };
    case "momentum_mystery_lab": return { ...base, icon: "🔭", title: "Momentum Mystery Lab", instructions: "Solve collision mysteries using conservation of momentum. Earn XP and compete for the best grade!" };
    default: return base;
  }
}

// --- Preview snippet for collapsed blocks ---
function getBlockSnippet(block) {
  const text = block.title || block.content || block.prompt || block.term || block.instructions || block.starterMessage || block.description || "";
  const plain = text.replace(/\*\*/g, "").replace(/\*/g, "");
  return plain.length > 50 ? plain.slice(0, 50) + "..." : plain;
}

// --- Block editor forms (sortable + collapsible) ---
function SortableBlockEditor(props) {
  const { block } = props;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: "relative",
    zIndex: isDragging ? 50 : "auto",
  };
  return (
    <div ref={setNodeRef} style={style}>
      <BlockEditor {...props} dragAttributes={attributes} dragListeners={listeners} />
    </div>
  );
}

function BlockEditor({ block, onChange, onDelete, onDuplicate, onMoveUp, onMoveDown, isFirst, isLast, isExpanded, onToggleExpand, dragAttributes, dragListeners }) {
  const update = (field, value) => onChange({ ...block, [field]: value });

  const renderFields = () => {
    switch (block.type) {
      case "section_header":
        return (<>
          <Field label="Icon" value={block.icon} onChange={(v) => update("icon", v)} small />
          <Field label="Title" value={block.title} onChange={(v) => update("title", v)} />
          <Field label="Subtitle (optional)" value={block.subtitle} onChange={(v) => update("subtitle", v)} />
        </>);
      case "text":
        return <Field label="Content (supports **bold** and *italic*)" value={block.content} onChange={(v) => update("content", v)} multiline />;
      case "video":
        return (<>
          <Field label="YouTube URL (any format — watch, share, or embed links all work)" value={block.url} onChange={(v) => update("url", v)} placeholder="https://www.youtube.com/watch?v=..." />
          <Field label="Caption (optional)" value={block.caption} onChange={(v) => update("caption", v)} />
        </>);
      case "image":
        return (<>
          <Field label="Image URL" value={block.url} onChange={(v) => update("url", v)} placeholder="https://example.com/image.png" />
          <Field label="Caption (optional)" value={block.caption} onChange={(v) => update("caption", v)} />
          <Field label="Alt Text (for accessibility)" value={block.alt} onChange={(v) => update("alt", v)} />
        </>);
      case "definition":
        return (<>
          <Field label="Term" value={block.term} onChange={(v) => update("term", v)} />
          <Field label="Definition" value={block.definition} onChange={(v) => update("definition", v)} multiline />
        </>);
      case "callout":
        return (<>
          <Field label="Icon" value={block.icon} onChange={(v) => update("icon", v)} small />
          <div className="editor-field">
            <label>Style</label>
            <select value={block.style} onChange={(e) => update("style", e.target.value)} className="editor-select">
              <option value="insight">💡 Insight</option>
              <option value="warning">⚠️ Warning</option>
              <option value="question">❓ Question</option>
            </select>
          </div>
          <Field label="Content" value={block.content} onChange={(v) => update("content", v)} multiline />
        </>);
      case "objectives":
        return (<>
          <Field label="Title" value={block.title} onChange={(v) => update("title", v)} />
          <div className="editor-field">
            <label>Items</label>
            {(block.items || []).map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                <input className="editor-input" value={item} onChange={(e) => {
                  const items = [...block.items]; items[i] = e.target.value; update("items", items);
                }} />
                <button className="editor-icon-btn" onClick={() => {
                  const items = block.items.filter((_, j) => j !== i); update("items", items);
                }}>✕</button>
              </div>
            ))}
            <button className="editor-add-btn" onClick={() => update("items", [...(block.items || []), ""])}>+ Add item</button>
          </div>
        </>);
      case "activity":
        return (<>
          <Field label="Icon" value={block.icon} onChange={(v) => update("icon", v)} small />
          <Field label="Title" value={block.title} onChange={(v) => update("title", v)} />
          <Field label="Instructions (supports **bold** and *italic*)" value={block.instructions} onChange={(v) => update("instructions", v)} multiline />
        </>);
      case "vocab_list":
        return (<>
          <div className="editor-field">
            <label>Terms</label>
            {(block.terms || []).map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                <input className="editor-input" placeholder="Term" value={t.term} style={{ flex: "0 0 30%" }}
                  onChange={(e) => { const terms = [...block.terms]; terms[i] = { ...terms[i], term: e.target.value }; update("terms", terms); }} />
                <input className="editor-input" placeholder="Definition" value={t.definition}
                  onChange={(e) => { const terms = [...block.terms]; terms[i] = { ...terms[i], definition: e.target.value }; update("terms", terms); }} />
                <button className="editor-icon-btn" onClick={() => { const terms = block.terms.filter((_, j) => j !== i); update("terms", terms); }}>✕</button>
              </div>
            ))}
            <button className="editor-add-btn" onClick={() => update("terms", [...(block.terms || []), { term: "", definition: "" }])}>+ Add term</button>
          </div>
        </>);
      case "chatbot":
        return (<>
          <Field label="Icon" value={block.icon} onChange={(v) => update("icon", v)} small />
          <Field label="Title" value={block.title} onChange={(v) => update("title", v)} />
          <Field label="Starter Message (what the AI says first)" value={block.starterMessage} onChange={(v) => update("starterMessage", v)} multiline />
          <Field label="System Prompt (hidden instructions for the AI)" value={block.systemPrompt} onChange={(v) => update("systemPrompt", v)} multiline rows={6} />
          <Field label="Student Instructions" value={block.instructions} onChange={(v) => update("instructions", v)} multiline />
          <Field label="Input Placeholder" value={block.placeholder} onChange={(v) => update("placeholder", v)} />
        </>);
      case "question": {
        const difficultySelect = (
          <div className="editor-field">
            <label>Difficulty (Bloom's Taxonomy)</label>
            <select value={block.difficulty || "understand"} onChange={(e) => update("difficulty", e.target.value)} className="editor-select">
              <option value="remember">🟢 Remember (0.75× XP)</option>
              <option value="understand">🔵 Understand (1× XP)</option>
              <option value="apply">🔷 Apply (1.25× XP)</option>
              <option value="analyze">🟣 Analyze (1.5× XP)</option>
              <option value="evaluate">🟡 Evaluate (1.75× XP)</option>
              <option value="create">🔴 Create (2× XP)</option>
            </select>
          </div>
        );
        if (block.questionType === "multiple_choice") {
          return (<>
            <Field label="Question Prompt" value={block.prompt} onChange={(v) => update("prompt", v)} multiline />
            {difficultySelect}
            <div className="editor-field">
              <label>Options</label>
              {(block.options || []).map((opt, i) => (
                <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6, alignItems: "center" }}>
                  <input type="radio" name={`correct-${block.id}`} checked={block.correctIndex === i}
                    onChange={() => update("correctIndex", i)} style={{ accentColor: "var(--green)" }} />
                  <input className="editor-input" value={opt} placeholder={`Option ${String.fromCharCode(65 + i)}`}
                    onChange={(e) => { const options = [...block.options]; options[i] = e.target.value; update("options", options); }} />
                </div>
              ))}
              <p style={{ fontSize: 11, color: "var(--text3)", marginTop: 4 }}>Select the radio button next to the correct answer.</p>
            </div>
            <Field label="Explanation (shown after answering)" value={block.explanation} onChange={(v) => update("explanation", v)} multiline />
          </>);
        }
        if (block.questionType === "ranking") {
          return (<>
            <Field label="Question Prompt" value={block.prompt} onChange={(v) => update("prompt", v)} multiline />
            {difficultySelect}
            <div className="editor-field">
              <label>Items (in correct order — students will see them shuffled)</label>
              {(block.items || []).map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6, alignItems: "center" }}>
                  <span style={{ color: "var(--text3)", fontSize: 12, minWidth: 20 }}>{i + 1}.</span>
                  <input className="editor-input" value={item} placeholder={`Item ${i + 1}`}
                    onChange={(e) => { const items = [...block.items]; items[i] = e.target.value; update("items", items); }} />
                  <button className="editor-icon-btn" onClick={() => { const items = block.items.filter((_, j) => j !== i); update("items", items); }}>✕</button>
                </div>
              ))}
              <button className="editor-add-btn" onClick={() => update("items", [...(block.items || []), ""])}>+ Add item</button>
            </div>
          </>);
        }
        if (block.questionType === "linked") {
          return (<>
            <Field label="Question Prompt" value={block.prompt} onChange={(v) => update("prompt", v)} multiline />
            {difficultySelect}
            <Field label="Linked Block ID (ID of a prior question block)" value={block.linkedBlockId || ""} onChange={(v) => update("linkedBlockId", v)} placeholder="Enter the block ID to reference" />
            <p style={{ fontSize: 11, color: "var(--text3)", marginTop: -8, marginBottom: 8 }}>
              Students will see their answer to the linked question as context before answering this follow-up.
            </p>
          </>);
        }
        return (<>
          <Field label="Question Prompt" value={block.prompt} onChange={(v) => update("prompt", v)} multiline />
          {difficultySelect}
        </>);
      }
      case "checklist":
        return (<>
          <Field label="Title (optional)" value={block.title} onChange={(v) => update("title", v)} />
          <div className="editor-field">
            <label>Steps</label>
            {(block.items || []).map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                <span style={{ color: "var(--text3)", fontSize: 13, padding: "6px 0", minWidth: 20 }}>{i + 1}.</span>
                <input className="editor-input" value={item} onChange={(e) => {
                  const items = [...(block.items || [])]; items[i] = e.target.value; update("items", items);
                }} />
                <button className="editor-icon-btn" onClick={() => {
                  const items = (block.items || []).filter((_, j) => j !== i); update("items", items);
                }}>✕</button>
              </div>
            ))}
            <button className="editor-add-btn" onClick={() => update("items", [...(block.items || []), ""])}>+ Add step</button>
          </div>
        </>);
      case "embed":
        return (<>
          <Field label="Embed URL" value={block.url} onChange={(v) => update("url", v)} placeholder="https://docs.google.com/forms/..." />
          <Field label="Caption (optional)" value={block.caption} onChange={(v) => update("caption", v)} />
          <Field label="Height (px)" value={block.height} onChange={(v) => update("height", parseInt(v) || 400)} small />
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
            <input type="checkbox" id={`scored-${block.id}`} checked={!!block.scored} onChange={(e) => update("scored", e.target.checked)} />
            <label htmlFor={`scored-${block.id}`} style={{ fontSize: 13, color: "var(--text2)" }}>Scored activity (worth 5 pts in lesson grade)</label>
          </div>
        </>);
      case "divider":
        return <p style={{ color: "var(--text3)", fontSize: 12, fontStyle: "italic" }}>A horizontal divider line. No settings needed.</p>;
      case "sorting":
        return (<>
          <Field label="Icon" value={block.icon} onChange={(v) => update("icon", v)} small />
          <Field label="Title" value={block.title} onChange={(v) => update("title", v)} />
          <Field label="Instructions (optional)" value={block.instructions} onChange={(v) => update("instructions", v)} multiline />
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <Field label="← Left Category Label" value={block.leftLabel} onChange={(v) => update("leftLabel", v)} />
            </div>
            <div style={{ flex: 1 }}>
              <Field label="→ Right Category Label" value={block.rightLabel} onChange={(v) => update("rightLabel", v)} />
            </div>
          </div>
          <div className="editor-field">
            <label>Items (assign each to left or right)</label>
            {(block.items || []).map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6, alignItems: "center" }}>
                <input className="editor-input" placeholder="Item text" value={item.text} style={{ flex: 1 }}
                  onChange={(e) => { const items = [...block.items]; items[i] = { ...items[i], text: e.target.value }; update("items", items); }} />
                <select value={item.correct} className="editor-select" style={{ width: 120 }}
                  onChange={(e) => { const items = [...block.items]; items[i] = { ...items[i], correct: e.target.value }; update("items", items); }}>
                  <option value="left">← {block.leftLabel || "Left"}</option>
                  <option value="right">→ {block.rightLabel || "Right"}</option>
                </select>
                <button className="editor-icon-btn" onClick={() => { const items = block.items.filter((_, j) => j !== i); update("items", items); }}>✕</button>
              </div>
            ))}
            <button className="editor-add-btn" onClick={() => update("items", [...(block.items || []), { text: "", correct: "left" }])}>+ Add item</button>
          </div>
        </>);
      case "external_link":
        return (<>
          <Field label="Icon" value={block.icon} onChange={(v) => update("icon", v)} small />
          <Field label="Title" value={block.title} onChange={(v) => update("title", v)} placeholder="e.g. Explore Google Gemini" />
          <Field label="URL" value={block.url} onChange={(v) => update("url", v)} placeholder="https://gemini.google.com" />
          <Field label="Description (optional)" value={block.description} onChange={(v) => update("description", v)} multiline />
          <Field label="Button Label" value={block.buttonLabel} onChange={(v) => update("buttonLabel", v)} placeholder="Open" small />
          <div className="editor-field">
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input type="checkbox" checked={block.openInNewTab !== false}
                onChange={(e) => update("openInNewTab", e.target.checked)}
                style={{ accentColor: "var(--cyan)" }} />
              Open in new tab
            </label>
          </div>
        </>);
      case "calculator":
        return (<>
          <Field label="Title" value={block.title} onChange={(v) => update("title", v)} placeholder="e.g. Calculate Momentum" />
          <Field label="Description (optional)" value={block.description} onChange={(v) => update("description", v)} multiline placeholder="Instructions for the student..." />
          <Field label="Formula (use input names as variables)" value={block.formula} onChange={(v) => update("formula", v)} placeholder="e.g. mass * velocity" />
          <div className="editor-field">
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input type="checkbox" checked={block.showFormula || false}
                onChange={(e) => update("showFormula", e.target.checked)}
                style={{ accentColor: "var(--cyan)" }} />
              Show formula to students
            </label>
          </div>
          <div className="editor-field">
            <label>Inputs</label>
            {(block.inputs || []).map((inp, i) => (
              <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6, alignItems: "center" }}>
                <input className="editor-input" placeholder="Variable name" value={inp.name} style={{ flex: "0 0 25%" }}
                  onChange={(e) => { const inputs = [...block.inputs]; inputs[i] = { ...inputs[i], name: e.target.value.replace(/\s/g, "_") }; update("inputs", inputs); }} />
                <input className="editor-input" placeholder="Label (shown to student)" value={inp.label} style={{ flex: 1 }}
                  onChange={(e) => { const inputs = [...block.inputs]; inputs[i] = { ...inputs[i], label: e.target.value }; update("inputs", inputs); }} />
                <input className="editor-input" placeholder="Unit" value={inp.unit} style={{ width: 70 }}
                  onChange={(e) => { const inputs = [...block.inputs]; inputs[i] = { ...inputs[i], unit: e.target.value }; update("inputs", inputs); }} />
                <button className="editor-icon-btn" onClick={() => { const inputs = block.inputs.filter((_, j) => j !== i); update("inputs", inputs); }}>✕</button>
              </div>
            ))}
            <button className="editor-add-btn" onClick={() => update("inputs", [...(block.inputs || []), { name: "", label: "", unit: "" }])}>+ Add input</button>
            <p style={{ fontSize: 11, color: "var(--text3)", marginTop: 4 }}>Variable names must match what you use in the formula (no spaces).</p>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}><Field label="Output Label" value={block.output?.label || ""} onChange={(v) => update("output", { ...block.output, label: v })} placeholder="e.g. Momentum" /></div>
            <div style={{ flex: "0 0 80px" }}><Field label="Unit" value={block.output?.unit || ""} onChange={(v) => update("output", { ...block.output, unit: v })} placeholder="kg·m/s" small /></div>
            <div style={{ flex: "0 0 80px" }}><Field label="Decimals" value={block.output?.decimals ?? 2} onChange={(v) => update("output", { ...block.output, decimals: parseInt(v) || 0 })} small /></div>
          </div>
        </>);
      case "data_table":
        return (<>
          <Field label="Title" value={block.title} onChange={(v) => update("title", v)} placeholder="e.g. Momentum Data Table" />
          <div className="editor-field">
            <label>Preset</label>
            <select value={block.preset || "momentum"} onChange={(e) => update("preset", e.target.value)} className="editor-select">
              <option value="momentum">Momentum (mass, speed, velocity → scalar/vector candidates)</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}><Field label="Object A Label" value={block.labelA || ""} onChange={(v) => update("labelA", v)} placeholder="Cart A" /></div>
            <div style={{ flex: 1 }}><Field label="Object B Label" value={block.labelB || ""} onChange={(v) => update("labelB", v)} placeholder="Cart B" /></div>
          </div>
          <div className="editor-field">
            <label>Computed Columns</label>
            <div style={{ display: "flex", gap: 20, marginTop: 4 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "var(--text)" }}>
                <input type="checkbox" checked={block.showScalar !== false}
                  onChange={(e) => update("showScalar", e.target.checked)}
                  style={{ accentColor: "var(--cyan)" }} />
                Scalar: m|v| (mass × speed)
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "var(--text)" }}>
                <input type="checkbox" checked={block.showVector !== false}
                  onChange={(e) => update("showVector", e.target.checked)}
                  style={{ accentColor: "var(--cyan)" }} />
                Vector: mv (mass × velocity)
              </label>
            </div>
          </div>
          <Field label="Number of Trials" value={block.trials || 1} onChange={(v) => update("trials", Math.max(1, Math.min(5, parseInt(v) || 1)))} small />
          <div className="editor-field">
            <label>Column Labels & Variables</label>
            <p style={{ fontSize: 11, color: "var(--text3)", marginBottom: 8 }}>Customize how columns appear to students. Leave blank for defaults.</p>
            {[
              { key: "mass", defaults: { label: "Mass", unit: "kg", sublabel: "m" } },
              ...(block.showScalar !== false ? [
                { key: "speed", defaults: { label: "Speed", unit: "m/s", sublabel: "|v|" } },
                { key: "scalar", defaults: { label: "Scalar Cand.", unit: "", sublabel: "m|v|" } },
              ] : []),
              ...(block.showVector !== false ? [
                { key: "velocity", defaults: { label: "Velocity", unit: "m/s", sublabel: "v" } },
                { key: "vector", defaults: { label: "Vector Cand.", unit: "", sublabel: "mv" } },
              ] : []),
            ].map(({ key, defaults }) => {
              const ov = (block.columnOverrides || {})[key] || {};
              const updateCol = (field, val) => {
                const prev = block.columnOverrides || {};
                update("columnOverrides", { ...prev, [key]: { ...(prev[key] || {}), [field]: val } });
              };
              return (
                <div key={key} style={{ display: "flex", gap: 6, marginBottom: 6, alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: "var(--text3)", width: 60, flexShrink: 0 }}>{key}</span>
                  <input className="editor-input" placeholder={defaults.label} value={ov.label || ""} style={{ flex: 1 }}
                    onChange={(e) => updateCol("label", e.target.value)} />
                  <input className="editor-input" placeholder={defaults.unit || "unit"} value={ov.unit || ""} style={{ width: 60 }}
                    onChange={(e) => updateCol("unit", e.target.value)} />
                  <input className="editor-input" placeholder={defaults.sublabel} value={ov.sublabel || ""} style={{ width: 60 }}
                    onChange={(e) => updateCol("sublabel", e.target.value)} />
                </div>
              );
            })}
            <div style={{ display: "flex", gap: 6, marginTop: 2 }}>
              <span style={{ width: 60 }} />
              <span style={{ flex: 1, fontSize: 10, color: "var(--text3)" }}>Header label</span>
              <span style={{ width: 60, fontSize: 10, color: "var(--text3)" }}>Unit</span>
              <span style={{ width: 60, fontSize: 10, color: "var(--text3)" }}>Variable</span>
            </div>
          </div>
          <p style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.5 }}>
            Each trial creates a Before/After pair. Checked columns auto-calculate. System Totals auto-sum. Leave labels blank for defaults.
          </p>
        </>);
      case "simulation":
        return (<>
          <Field label="Icon" value={block.icon} onChange={(v) => update("icon", v)} small />
          <Field label="Title" value={block.title} onChange={(v) => update("title", v)} />
          <Field label="Simulation URL (e.g. PhET embed URL)" value={block.url} onChange={(v) => update("url", v)} placeholder="https://phet.colorado.edu/sims/html/..." />
          <Field label="Height (px)" value={block.height} onChange={(v) => update("height", parseInt(v) || 500)} small />
          <Field label="Observation Prompt (optional)" value={block.observationPrompt} onChange={(v) => update("observationPrompt", v)} multiline placeholder="What patterns do you notice?" />
        </>);
      case "evidence_upload":
        return (<>
          <Field label="Icon" value={block.icon} onChange={(v) => update("icon", v)} small />
          <Field label="Title" value={block.title} onChange={(v) => update("title", v)} />
          <Field label="Instructions" value={block.instructions} onChange={(v) => update("instructions", v)} multiline placeholder="Take a photo of your lab setup..." />
          <Field label="Reflection Prompt (optional)" value={block.reflectionPrompt} onChange={(v) => update("reflectionPrompt", v)} multiline placeholder="What did you observe?" />
        </>);
      case "sketch":
        return (<>
          <Field label="Title" value={block.title} onChange={(v) => update("title", v)} placeholder="e.g. Free Body Diagram" />
          <Field label="Instructions (optional)" value={block.instructions} onChange={(v) => update("instructions", v)} multiline placeholder="Draw the forces acting on the block..." />
          <Field label="Canvas Height (px)" value={block.canvasHeight || 400} onChange={(v) => update("canvasHeight", Math.max(200, Math.min(800, parseInt(v) || 400)))} small />
        </>);
      case "bar_chart":
        return (<>
          <Field label="Title" value={block.title} onChange={(v) => update("title", v)} placeholder="e.g. Energy Bar Chart" />
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}><Field label="Initial State Label" value={block.initialLabel || ""} onChange={(v) => update("initialLabel", v)} placeholder="Initial State" /></div>
            <div style={{ flex: 1 }}><Field label="Final State Label" value={block.finalLabel || ""} onChange={(v) => update("finalLabel", v)} placeholder="Final State" /></div>
          </div>
          <p style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.5 }}>
            Students drag bars up or down, and can add/remove bars per section. Each bar has a label + subscript field (e.g. K<sub>E,i</sub>). Ctrl/Cmd+click a bar to type an exact value.
          </p>
        </>);
      case "guess_who":
        return (<>
          <Field label="Title" value={block.title} onChange={(v) => update("title", v)} placeholder="Guess Who?" />
          <Field label="Instructions" value={block.instructions} onChange={(v) => update("instructions", v)} multiline placeholder="Challenge a classmate..." />
          <div style={{ display: "flex", gap: 12, marginBottom: 8 }}>
            <div style={{ flex: 1 }}>
              <Field label="XP for Winning" value={block.xpForWin} onChange={(v) => update("xpForWin", Math.max(0, parseInt(v) || 0))} small />
            </div>
            <div style={{ flex: 1 }}>
              <Field label="XP for Playing" value={block.xpForPlay} onChange={(v) => update("xpForPlay", Math.max(0, parseInt(v) || 0))} small />
            </div>
          </div>
          <div className="editor-field">
            <label>Character Set</label>
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <button onClick={() => { update("characterSet", "default"); update("customCharacters", []); }}
                style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid var(--border)", cursor: "pointer", fontSize: 12, fontWeight: 600, background: block.characterSet === "default" ? "var(--amber)" : "var(--surface)", color: block.characterSet === "default" ? "#1a1a1a" : "var(--text2)" }}>
                Default (40 AI Faces)
              </button>
              <button onClick={() => update("characterSet", "custom")}
                style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid var(--border)", cursor: "pointer", fontSize: 12, fontWeight: 600, background: block.characterSet === "custom" ? "var(--amber)" : "var(--surface)", color: block.characterSet === "custom" ? "#1a1a1a" : "var(--text2)" }}>
                Custom
              </button>
            </div>
          </div>
          {block.characterSet === "custom" && (
            <div className="editor-field">
              <label>Custom Characters</label>
              {(block.customCharacters || []).map((ch, i) => (
                <div key={i} style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4 }}>
                  <input className="editor-input" value={ch.name || ""} onChange={(e) => {
                    const chars = [...(block.customCharacters || [])];
                    chars[i] = { ...chars[i], name: e.target.value };
                    update("customCharacters", chars);
                  }} placeholder="Name" style={{ flex: 1 }} />
                  <input className="editor-input" value={ch.imageUrl || ""} onChange={(e) => {
                    const chars = [...(block.customCharacters || [])];
                    chars[i] = { ...chars[i], imageUrl: e.target.value };
                    update("customCharacters", chars);
                  }} placeholder="Image URL" style={{ flex: 2 }} />
                  <button onClick={() => update("customCharacters", (block.customCharacters || []).filter((_, j) => j !== i))}
                    style={{ background: "none", border: "none", color: "var(--red)", cursor: "pointer", fontSize: 16 }}>✕</button>
                </div>
              ))}
              <button onClick={() => update("customCharacters", [...(block.customCharacters || []), { id: `custom_${Date.now()}`, name: "", imageUrl: "" }])}
                style={{ marginTop: 4, padding: "4px 12px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text2)", cursor: "pointer", fontSize: 12 }}>
                + Add Character
              </button>
              <p style={{ fontSize: 11, color: "var(--text3)", marginTop: 4 }}>Add at least 10 characters with names and image URLs.</p>
            </div>
          )}
        </>);
      case "chatbot_workshop":
        return (<>
          <Field label="Title" value={block.title} onChange={(v) => update("title", v)} placeholder="Build-a-Chatbot Workshop" />
          <Field label="Instructions" value={block.instructions} onChange={(v) => update("instructions", v)} multiline placeholder="Design and test your own chatbot!" />
        </>);
      case "bias_detective":
        return (<>
          <Field label="Title" value={block.title} onChange={(v) => update("title", v)} placeholder="AI Bias Detective" />
          <Field label="Instructions" value={block.instructions} onChange={(v) => update("instructions", v)} multiline placeholder="Investigate AI systems for hidden bias..." />
        </>);
      case "prompt_duel":
      case "recipe_bot":
      case "ai_training_sim":
      case "data_labeling_lab":
      case "ai_ethics_courtroom":
        return (<>
          <Field label="Title" value={block.title} onChange={(v) => update("title", v)} />
          <Field label="Instructions" value={block.instructions} onChange={(v) => update("instructions", v)} multiline />
          <Field label="URL" value={block.url} onChange={(v) => update("url", v)} placeholder="https://..." />
        </>);
      case "momentum_mystery_lab":
        return (<>
          <Field label="Title" value={block.title} onChange={(v) => update("title", v)} placeholder="Momentum Mystery Lab" />
          <Field label="Instructions" value={block.instructions} onChange={(v) => update("instructions", v)} multiline placeholder="Solve collision mysteries using conservation of momentum..." />
        </>);
      default: return <p style={{ color: "var(--text3)" }}>Unknown block type</p>;
    }
  };

  const typeLabel = BLOCK_TYPES.find((t) => t.type === block.type && (!t.questionType || t.questionType === block.questionType))?.label || block.type;
  const snippet = getBlockSnippet(block);

  return (
    <div className="block-editor-card">
      <div className="block-editor-header" onClick={onToggleExpand} style={{ cursor: "pointer", userSelect: "none" }}>
        {/* Drag handle */}
        <button
          className="editor-icon-btn block-drag-handle"
          {...(dragAttributes || {})}
          {...(dragListeners || {})}
          onClick={(e) => e.stopPropagation()}
          title="Drag to reorder"
          style={{ cursor: "grab", marginRight: 6, touchAction: "none" }}
        >
          ⠿
        </button>
        <span className="block-editor-type" style={{ flex: 1 }}>
          {typeLabel}
          {!isExpanded && snippet && (
            <span style={{ fontWeight: 400, color: "var(--text3)", textTransform: "none", letterSpacing: 0, marginLeft: 10, fontSize: 12 }}>
              {snippet}
            </span>
          )}
        </span>
        <div className="block-editor-actions" onClick={(e) => e.stopPropagation()}>
          {!isFirst && <button className="editor-icon-btn" onClick={onMoveUp} title="Move up">↑</button>}
          {!isLast && <button className="editor-icon-btn" onClick={onMoveDown} title="Move down">↓</button>}
          <button className="editor-icon-btn" onClick={onDuplicate} title="Duplicate block">⧉</button>
          <button className="editor-icon-btn delete" onClick={onDelete} title="Delete block">🗑</button>
          <span style={{ fontSize: 12, color: "var(--text3)", marginLeft: 4 }}>{isExpanded ? "▼" : "▶"}</span>
        </div>
      </div>
      {isExpanded && <div className="block-editor-body">{renderFields()}</div>}
    </div>
  );
}

function Field({ label, value, onChange, multiline, rows, placeholder, small }) {
  return (
    <div className="editor-field">
      <label>{label}</label>
      {multiline ? (
        <textarea className="editor-input" rows={rows || 3} value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      ) : (
        <input className="editor-input" value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          style={small ? { maxWidth: 80 } : undefined} />
      )}
    </div>
  );
}

// --- Inline "+" button between blocks (with search + categories) ---
function AddBlockInline({ onInsert }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const searchRef = useRef(null);

  useEffect(() => {
    if (open && searchRef.current) searchRef.current.focus();
  }, [open]);

  const filteredCategories = useMemo(() => {
    const q = search.toLowerCase().trim();
    return BLOCK_CATEGORIES.map((cat) => ({
      ...cat,
      items: BLOCK_TYPES.filter(
        (t) => cat.types.includes(t.type) && (!q || t.label.toLowerCase().includes(q))
      ),
    })).filter((cat) => cat.items.length > 0);
  }, [search]);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, margin: "2px 0" }}>
      <div style={{ flex: 1, height: 1, background: open ? "var(--amber)" : "transparent" }} />
      <div style={{ position: "relative" }}>
        <button
          onClick={() => { setOpen(!open); setSearch(""); }}
          style={{
            width: 26, height: 26, borderRadius: "50%", border: "1px solid var(--border)",
            background: open ? "var(--amber)" : "var(--surface)", color: open ? "#1a1a1a" : "var(--text3)",
            cursor: "pointer", fontSize: 16, lineHeight: 1, display: "flex", alignItems: "center",
            justifyContent: "center", transition: "all 0.15s",
          }}
          title="Insert block here"
        >
          {open ? "×" : "+"}
        </button>
        {open && (
          <div style={{
            position: "absolute", top: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)",
            background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10,
            boxShadow: "0 8px 30px rgba(0,0,0,0.4)", padding: 8, zIndex: 50, width: 280,
            maxHeight: 360, overflowY: "auto",
          }}>
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search blocks..."
              className="editor-input"
              style={{ fontSize: 12, padding: "6px 10px", marginBottom: 6, width: "100%", boxSizing: "border-box" }}
            />
            {filteredCategories.map((cat) => (
              <div key={cat.label}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.06em", padding: "6px 4px 2px", marginTop: 2 }}>
                  {cat.label}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {cat.items.map((t, i) => (
                    <button key={`${t.type}-${t.questionType || ""}-${i}`} className="btn btn-secondary" style={{ fontSize: 11, padding: "4px 8px", flex: "0 0 auto" }}
                      onClick={() => { onInsert(t); setOpen(false); setSearch(""); }}>
                      {t.icon} {t.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {filteredCategories.length === 0 && (
              <p style={{ fontSize: 12, color: "var(--text3)", textAlign: "center", padding: 12 }}>No blocks match "{search}"</p>
            )}
          </div>
        )}
      </div>
      <div style={{ flex: 1, height: 1, background: open ? "var(--amber)" : "transparent" }} />
    </div>
  );
}

// --- Sortable lesson item for sidebar drag-and-drop ---
function SortableLessonItem({ lesson, isSelected, onSelect }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: lesson.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : "auto",
  };
  const isHidden = lesson.visible === false;
  const isPastDue = lesson.dueDate && new Date(lesson.dueDate + "T23:59:59") < new Date();
  const blockCount = lesson.blocks?.length || 0;

  return (
    <div ref={setNodeRef} style={style} className={`sidebar-lesson-item${isSelected ? " active" : ""}${isHidden ? " hidden-lesson" : ""}`}>
      <div className="sidebar-drag-handle" {...attributes} {...listeners} title="Drag to reorder">
        <svg width="8" height="14" viewBox="0 0 8 14" fill="currentColor">
          <circle cx="2" cy="2" r="1.2"/><circle cx="6" cy="2" r="1.2"/>
          <circle cx="2" cy="7" r="1.2"/><circle cx="6" cy="7" r="1.2"/>
          <circle cx="2" cy="12" r="1.2"/><circle cx="6" cy="12" r="1.2"/>
        </svg>
      </div>
      <button className="sidebar-lesson-btn" onClick={onSelect}>
        <span className="sidebar-lesson-title">{lesson.title || "Untitled"}</span>
        <span className="sidebar-lesson-meta">
          {isHidden && <span className="sidebar-tag hidden-tag">Hidden</span>}
          {blockCount > 0 && <span className="sidebar-tag">{blockCount} blocks</span>}
          {lesson.dueDate && (
            <span className={`sidebar-tag${isPastDue ? " past-due" : ""}`}>
              {new Date(lesson.dueDate + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" })}
            </span>
          )}
        </span>
      </button>
    </div>
  );
}

// --- Main Editor ---
export default function LessonEditor() {
  const { user, userRole, getToken } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(searchParams.get("course") || null);
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [pendingLesson, setPendingLesson] = useState(searchParams.get("lesson") || null);
  const [blocks, setBlocks] = useState([]);
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonUnit, setLessonUnit] = useState("");
  const [lessonDueDate, setLessonDueDate] = useState("");
  const [lessonGradeCategory, setLessonGradeCategory] = useState("classwork");
  const [lessonVisible, setLessonVisible] = useState(true);
  const [prevVisible, setPrevVisible] = useState(null); // track saved visibility for notification
  const [lessonOrder, setLessonOrder] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [collapsedUnits, setCollapsedUnits] = useState(null); // null = not yet initialized
  const [showJsonImport, setShowJsonImport] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null); // { block, rationale }
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicating, setDuplicating] = useState(false);
  const [lessonSearch, setLessonSearch] = useState("");
  const [expandedBlockId, setExpandedBlockId] = useState(null); // accordion: only one block expanded

  // dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  // Fetch courses (owned or co-teaching)
  useEffect(() => {
    const fetch = async () => {
      const snapshot = await getDocs(query(collection(db, "courses"), orderBy("order", "asc")));
      const owned = snapshot.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((c) => !c.hidden && (c.ownerUid === user?.uid || (c.coTeachers || []).includes(user?.uid)));
      setCourses(owned);
      setLoading(false);
    };
    fetch();
  }, [user]);

  // Fetch lessons when course selected
  useEffect(() => {
    if (!selectedCourse) { setLessons([]); return; }
    const fetch = async () => {
      const snapshot = await getDocsFromServer(query(collection(db, "courses", selectedCourse, "lessons"), orderBy("order", "asc")));
      setLessons(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    fetch();
  }, [selectedCourse]);

  // Auto-load lesson when returning from preview (once lessons are fetched)
  useEffect(() => {
    if (!pendingLesson || lessons.length === 0) return;
    const match = lessons.find((l) => l.id === pendingLesson);
    if (match) {
      setSelectedLesson(match.id);
      setLessonTitle(match.title || "");
      setLessonUnit(match.unit || "");
      setLessonDueDate(match.dueDate || "");
      setLessonVisible(match.visible !== false);
      setPrevVisible(match.visible !== false);
      setBlocks(match.blocks || []);
      setSaved(false);
    }
    setPendingLesson(null);
    setSearchParams({}, { replace: true });
  }, [lessons, pendingLesson]);

  // Load lesson into editor
  const loadLesson = (lesson) => {
    setSelectedLesson(lesson.id);
    setLessonTitle(lesson.title || "");
    setLessonUnit(lesson.unit || "");
    setLessonDueDate(lesson.dueDate || "");
    setLessonGradeCategory(lesson.gradeCategory || "classwork");
    setLessonVisible(lesson.visible !== false);
    setPrevVisible(lesson.visible !== false);
    setLessonOrder(lesson.order ?? null);
    setBlocks(lesson.blocks || []);
    setSaved(false);
  };

  const createNewLesson = () => {
    setSelectedLesson("new-" + uid());
    setLessonTitle("New Lesson");
    setLessonUnit("");
    setLessonDueDate("");
    setLessonGradeCategory("classwork");
    setLessonVisible(true);
    setPrevVisible(null); // new lesson, no prior state
    setLessonOrder(null); // will be set to lessons.length on save
    setBlocks([]);
    setSaved(false);
  };

  // Block operations
  const addBlock = (typeInfo) => {
    setBlocks([...blocks, defaultBlockData(typeInfo)]);
    setSaved(false);
  };
  const insertBlockAt = (typeInfo, index) => {
    const newBlocks = [...blocks];
    newBlocks.splice(index, 0, defaultBlockData(typeInfo));
    setBlocks(newBlocks);
    setSaved(false);
  };
  const updateBlock = (index, data) => { const b = [...blocks]; b[index] = data; setBlocks(b); setSaved(false); };
  const deleteBlock = (index) => { setBlocks(blocks.filter((_, i) => i !== index)); setSaved(false); };
  const duplicateBlock = (index) => {
    const original = blocks[index];
    const clone = JSON.parse(JSON.stringify(original));
    clone.id = uid();
    const b = [...blocks];
    b.splice(index + 1, 0, clone);
    setBlocks(b);
    setSaved(false);
  };
  const moveBlock = (index, dir) => {
    const b = [...blocks]; const t = b[index]; b[index] = b[index + dir]; b[index + dir] = t; setBlocks(b); setSaved(false);
  };

  // Drag-and-drop reorder handler
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = blocks.findIndex((b) => b.id === active.id);
    const newIndex = blocks.findIndex((b) => b.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    setBlocks(arrayMove(blocks, oldIndex, newIndex));
    setSaved(false);
  };

  // FIX #36: Shared helper — refreshes the lesson list from Firestore
  const refreshLessons = async () => {
    const snapshot = await getDocsFromServer(query(collection(db, "courses", selectedCourse, "lessons"), orderBy("order", "asc")));
    setLessons(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  // Refs for auto-save (so the save callback always reads latest state)
  const blocksRef = useRef(blocks);
  const lessonTitleRef = useRef(lessonTitle);
  const lessonUnitRef = useRef(lessonUnit);
  const lessonDueDateRef = useRef(lessonDueDate);
  const lessonGradeCategoryRef = useRef(lessonGradeCategory);
  const lessonVisibleRef = useRef(lessonVisible);
  const selectedCourseRef = useRef(selectedCourse);
  const selectedLessonRef = useRef(selectedLesson);
  const prevVisibleRef = useRef(prevVisible);
  const coursesRef = useRef(courses);
  const lessonsRef = useRef(lessons);

  useEffect(() => { blocksRef.current = blocks; }, [blocks]);
  useEffect(() => { lessonTitleRef.current = lessonTitle; }, [lessonTitle]);
  useEffect(() => { lessonUnitRef.current = lessonUnit; }, [lessonUnit]);
  useEffect(() => { lessonDueDateRef.current = lessonDueDate; }, [lessonDueDate]);
  useEffect(() => { lessonGradeCategoryRef.current = lessonGradeCategory; }, [lessonGradeCategory]);
  useEffect(() => { lessonVisibleRef.current = lessonVisible; }, [lessonVisible]);
  useEffect(() => { selectedCourseRef.current = selectedCourse; }, [selectedCourse]);
  useEffect(() => { selectedLessonRef.current = selectedLesson; }, [selectedLesson]);
  useEffect(() => { prevVisibleRef.current = prevVisible; }, [prevVisible]);
  useEffect(() => { coursesRef.current = courses; }, [courses]);
  useEffect(() => { lessonsRef.current = lessons; }, [lessons]);

  // Core save logic, usable by both manual save button and auto-save
  const performSave = useCallback(async () => {
    const sc = selectedCourseRef.current;
    const sl = selectedLessonRef.current;
    if (!sc || !sl) return;
    const isNew = sl.startsWith("new-");
    const curBlocks = blocksRef.current;
    const curTitle = lessonTitleRef.current;
    const curUnit = lessonUnitRef.current;
    const curDueDate = lessonDueDateRef.current;
    const curGradeCategory = lessonGradeCategoryRef.current;
    const curVisible = lessonVisibleRef.current;
    const curPrevVisible = prevVisibleRef.current;

    const lessonId = isNew ? uid() : sl;
    const lessonRef = doc(db, "courses", sc, "lessons", lessonId);
    const data = {
      title: curTitle,
      unit: curUnit,
      dueDate: curDueDate || null,
      gradeCategory: curGradeCategory || "classwork",
      visible: curVisible,
      blocks: curBlocks,
      updatedAt: new Date(),
    };
    if (isNew) {
      data.order = lessonsRef.current.length;
    }
    await setDoc(lessonRef, data, { merge: true });
    if (isNew) setSelectedLesson(lessonId);
    setSaved(true);

    // Refresh sidebar silently
    try {
      const snapshot = await getDocsFromServer(query(collection(db, "courses", sc, "lessons"), orderBy("order", "asc")));
      setLessons(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (_) {}

    // Notify students when a lesson becomes visible (hidden->visible)
    if (curVisible && curPrevVisible === false) {
      try {
        const courseName = coursesRef.current.find((c) => c.id === sc)?.title || "Course";
        await fanOutNotification(sc, {
          type: "new_lesson",
          title: `New lesson: ${curTitle || "Untitled"}`,
          body: `A new lesson is available in ${courseName}`,
          icon: "📘",
          link: `/course/${sc}/lesson/${lessonId}`,
        });
      } catch (notifErr) {
        console.warn("Could not send new-lesson notification:", notifErr);
      }
    }
    setPrevVisible(curVisible);

    // Generate AI baselines for short-answer questions (runs in background)
    const hasWrittenQuestions = curBlocks.some(
      (b) => b.type === "question" && b.questionType === "short_answer" && b.prompt && (!b.aiBaselines || b.aiBaselines.length === 0)
    );
    if (hasWrittenQuestions) {
      generateLessonBaselines(sc, lessonId, curBlocks, getToken)
        .then((updatedBlocks) => {
          if (updatedBlocks !== curBlocks) setBlocks(updatedBlocks);
        })
        .catch((err) => console.warn("Baseline generation failed (non-critical):", err));
    }
  }, [getToken]);

  // Auto-save hook (15s delay for teacher edits)
  const { markDirty, saveNow: autoSaveNow, lastSaved: autoLastSaved, saving: autoSaving, saveError: autoSaveError } = useAutoSave(performSave, { delay: 15000 });

  // Mark dirty whenever saved becomes false (any edit)
  useEffect(() => {
    if (!saved && selectedLesson) {
      markDirty();
    }
  }, [saved, selectedLesson, markDirty]);

  // Save lesson (manual button — calls performSave directly)
  const save = async () => {
    if (!selectedCourse || !selectedLesson) return;
    setSaving(true);
    try {
      await performSave();
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save. Check the console for details.");
    }
    setSaving(false);
  };

  // Open lesson in preview mode (navigates to the lesson viewer)
  const openPreview = () => {
    if (!selectedCourse || !selectedLesson || selectedLesson.startsWith("new-")) return;
    window.scrollTo(0, 0);
    navigate(`/course/${selectedCourse}/lesson/${selectedLesson}`);
  };

  // Delete lesson from Firestore
  const deleteLesson = async () => {
    if (!selectedCourse || !selectedLesson || selectedLesson.startsWith("new-")) return;
    if (!confirm(`Delete "${lessonTitle}"? This cannot be undone.`)) return;
    try {
      await deleteDoc(doc(db, "courses", selectedCourse, "lessons", selectedLesson));
      setSelectedLesson(null);
      setBlocks([]);
      setLessonTitle("");
      setLessonUnit("");
      setLessonDueDate("");
      setLessonVisible(true);
      await refreshLessons();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete. Check the console for details.");
    }
  };

  // Import blocks from JSON
  const handleJsonImport = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      let importedBlocks;
      if (Array.isArray(parsed)) {
        importedBlocks = parsed;
      } else if (parsed.blocks && Array.isArray(parsed.blocks)) {
        importedBlocks = parsed.blocks;
        if (parsed.title && !lessonTitle) setLessonTitle(parsed.title);
        if (parsed.unit && !lessonUnit) setLessonUnit(parsed.unit);
        if (parsed.gradeCategory) setLessonGradeCategory(parsed.gradeCategory);
      } else {
        alert("Invalid format. Paste a JSON array of blocks, or an object with a \"blocks\" array.");
        return;
      }
      if (importedBlocks.length === 0) {
        alert("No blocks found in the JSON.");
        return;
      }
      importedBlocks = importedBlocks.map(b => ({ ...b, id: b.id || uid() }));
      const action = blocks.length > 0
        ? confirm(`This will replace the current ${blocks.length} blocks with ${importedBlocks.length} imported blocks. Continue?`)
        : true;
      if (!action) return;
      setBlocks(importedBlocks);
      setSaved(false);
      setShowJsonImport(false);
      setJsonInput("");
    } catch (err) {
      alert("Invalid JSON: " + err.message);
    }
  };

  // Duplicate lesson to another course
  const duplicateToCourse = async (targetCourseId) => {
    if (!targetCourseId || !selectedLesson) return;
    setDuplicating(true);
    try {
      // Count existing lessons in target course to set order
      const targetLessonsSnap = await getDocs(collection(db, "courses", targetCourseId, "lessons"));
      const newLessonId = uid();
      // Copy blocks with fresh IDs so progress data stays separate
      const freshBlocks = blocks.map((b) => ({ ...b, id: uid() }));
      await setDoc(doc(db, "courses", targetCourseId, "lessons", newLessonId), {
        title: lessonTitle,
        unit: lessonUnit,
        dueDate: null, // don't copy due date — different class may have different schedule
        gradeCategory: lessonGradeCategory || "classwork",
        visible: false, // start hidden so teacher can review before publishing
        blocks: freshBlocks,
        order: targetLessonsSnap.size,
        updatedAt: new Date(),
      });
      const targetCourse = courses.find((c) => c.id === targetCourseId);
      alert(`✓ Duplicated "${lessonTitle}" to ${targetCourse?.title || targetCourseId}.\n\nThe copy is hidden by default — toggle it visible when ready.`);
      setShowDuplicateModal(false);
    } catch (err) {
      console.error("Duplicate failed:", err);
      alert("Failed to duplicate. Check the console for details.");
    }
    setDuplicating(false);
  };

  // Drag-and-drop lesson reorder handler (sidebar)
  const handleLessonDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = lessons.findIndex((l) => l.id === active.id);
    const newIndex = lessons.findIndex((l) => l.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    // Optimistic local reorder
    const reordered = arrayMove(lessons, oldIndex, newIndex);
    setLessons(reordered);
    // Persist sequential order values to Firestore
    try {
      const updates = reordered.map((l, i) =>
        l.order !== i ? setDoc(doc(db, "courses", selectedCourse, "lessons", l.id), { order: i }, { merge: true }) : null
      ).filter(Boolean);
      if (updates.length) await Promise.all(updates);
    } catch (err) {
      console.error("Reorder failed:", err);
      await refreshLessons(); // revert on failure
    }
  };

  // Initialize all units as collapsed on first load
  useEffect(() => {
    if (collapsedUnits !== null || groupedLessons.length === 0) return;
    const initial = {};
    groupedLessons.forEach((g) => { if (g.unit.trim()) initial[g.unit] = true; });
    setCollapsedUnits(initial);
  }, [groupedLessons, collapsedUnits]);

  // Toggle unit collapse
  const toggleUnit = (unit) => {
    setCollapsedUnits((prev) => ({ ...prev || {}, [unit]: !(prev || {})[unit] }));
  };

  // Group lessons by unit, sort within each unit by dueDate (if set) then order
  const groupedLessons = useMemo(() => {
    const q = lessonSearch.toLowerCase().trim();
    const filtered = q ? lessons.filter((l) => l.title?.toLowerCase().includes(q)) : lessons;

    // Group by unit
    const unitMap = {};
    for (const lesson of filtered) {
      const unit = lesson.unit || "";
      if (!unitMap[unit]) unitMap[unit] = [];
      unitMap[unit].push(lesson);
    }

    // Sort within each unit: lessons with dueDates sorted by dueDate, then by order
    const groups = Object.entries(unitMap).map(([unit, unitLessons]) => {
      unitLessons.sort((a, b) => {
        // Both have due dates — sort by date
        if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
        // One has a due date, it comes first
        if (a.dueDate && !b.dueDate) return -1;
        if (!a.dueDate && b.dueDate) return 1;
        // Neither has due date — sort by order
        return (a.order || 0) - (b.order || 0);
      });
      return { unit, lessons: unitLessons };
    });

    // Sort groups: units with due-dated lessons first (by earliest date), then alphabetical
    groups.sort((a, b) => {
      const aFirst = a.lessons.find((l) => l.dueDate)?.dueDate || "zzzz";
      const bFirst = b.lessons.find((l) => l.dueDate)?.dueDate || "zzzz";
      if (aFirst !== bFirst) return aFirst.localeCompare(bFirst);
      return a.unit.localeCompare(b.unit);
    });

    return groups;
  }, [lessons, lessonSearch]);

  if (userRole !== "teacher") {
    return (
      <div className="page-wrapper" style={{ textAlign: "center", paddingTop: 120 }}>
        <h2 style={{ fontFamily: "var(--font-display)" }}>Teacher access only</h2>
      </div>
    );
  }

  return (
    <main id="main-content" className="page-container" style={{ display: "flex", height: "calc(100vh - 62px)" }}>
      {/* Left sidebar: course/lesson picker */}
      <div className="editor-sidebar">
        {/* Course selector */}
        <div className="sidebar-section">
          <label className="sidebar-label">Course</label>
          {loading ? <div className="spinner" /> : (
            <select
              className="sidebar-course-select"
              value={selectedCourse || ""}
              onChange={(e) => { setSelectedCourse(e.target.value || null); setSelectedLesson(null); setLessonSearch(""); }}
            >
              <option value="">Select a course...</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.icon || "📚"} {c.title}</option>
              ))}
            </select>
          )}
        </div>

        {selectedCourse && (
          <>
            {/* Lesson search + count */}
            <div className="sidebar-section" style={{ paddingBottom: 0 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <label className="sidebar-label" style={{ margin: 0 }}>Lessons</label>
                <span style={{ fontSize: 11, color: "var(--text3)" }}>{lessons.length} total</span>
              </div>
              <input
                type="text"
                className="sidebar-search"
                placeholder="Search lessons..."
                value={lessonSearch}
                onChange={(e) => setLessonSearch(e.target.value)}
              />
            </div>

            {/* Lesson list with drag-and-drop */}
            <div className="sidebar-lessons-list">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                modifiers={[restrictToVerticalAxis]}
                onDragEnd={handleLessonDragEnd}
              >
                {groupedLessons.map((group) => {
                  const hasUnit = group.unit.trim() !== "";
                  const isCollapsed = hasUnit && (collapsedUnits || {})[group.unit];

                  return (
                    <div key={group.unit || "__no_unit__"} className="sidebar-unit-group">
                      {hasUnit && (
                        <button className="sidebar-unit-header" onClick={() => toggleUnit(group.unit)}>
                          <span className={`sidebar-unit-chevron${isCollapsed ? " collapsed" : ""}`}>▾</span>
                          <span className="sidebar-unit-name">{group.unit}</span>
                          <span className="sidebar-unit-count">{group.lessons.length}</span>
                        </button>
                      )}

                      {!isCollapsed && (
                        <SortableContext items={group.lessons.map((l) => l.id)} strategy={verticalListSortingStrategy}>
                          <div style={{ paddingLeft: hasUnit ? 8 : 0 }}>
                            {group.lessons.map((l) => (
                              <SortableLessonItem
                                key={l.id}
                                lesson={l}
                                isSelected={selectedLesson === l.id}
                                onSelect={() => loadLesson(l)}
                              />
                            ))}
                          </div>
                        </SortableContext>
                      )}
                    </div>
                  );
                })}
              </DndContext>

              {groupedLessons.length === 0 && lessonSearch && (
                <p style={{ fontSize: 12, color: "var(--text3)", textAlign: "center", padding: "16px 0" }}>
                  No lessons match "{lessonSearch}"
                </p>
              )}
            </div>

            {/* New lesson button */}
            <div className="sidebar-footer">
              <button className="sidebar-new-lesson-btn" onClick={createNewLesson}>
                + New Lesson
              </button>
            </div>
          </>
        )}
      </div>

      {/* Main editor area */}
      <div style={{ flex: 1, overflowY: "auto", padding: "32px 40px" }}>
        {!selectedLesson ? (
          <div style={{ textAlign: "center", paddingTop: 100, color: "var(--text3)" }}>
            <p style={{ fontSize: 18 }}>Select a course and lesson to edit, or create a new one.</p>
          </div>
        ) : (
          <>
            {/* Lesson meta — row 1 */}
            <div style={{ marginBottom: 16, display: "flex", gap: 12, alignItems: "flex-end" }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 12, color: "var(--text3)", display: "block", marginBottom: 4 }}>Lesson Title</label>
                <input className="editor-input" value={lessonTitle} onChange={(e) => { setLessonTitle(e.target.value); setSaved(false); }}
                  style={{ fontSize: 22, fontFamily: "var(--font-display)", fontWeight: 700, padding: "8px 12px", border: "1.5px solid var(--amber)" }} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "var(--text3)", display: "block", marginBottom: 4 }}>Unit / Section</label>
                <input className="editor-input" value={lessonUnit} onChange={(e) => { setLessonUnit(e.target.value); setSaved(false); }}
                  style={{ width: 200, border: "1.5px solid var(--amber)" }} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "var(--text3)", display: "block", marginBottom: 4 }}>Due Date</label>
                <input type="date" className="editor-input" value={lessonDueDate} onChange={(e) => { setLessonDueDate(e.target.value); setSaved(false); }}
                  style={{ width: 150, border: "1.5px solid var(--amber)" }} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "var(--text3)", display: "block", marginBottom: 4 }}>Grade Category</label>
                <select className="editor-input" value={lessonGradeCategory}
                  onChange={(e) => { setLessonGradeCategory(e.target.value); setSaved(false); }}
                  style={{ width: 170, border: "1.5px solid var(--amber)" }}>
                  <option value="classwork">Classwork (35%)</option>
                  <option value="assessment">Assessment (60%)</option>
                  <option value="homework">Homework (5%)</option>
                </select>
              </div>
            </div>

            {/* Actions — row 2 */}
            <div style={{ marginBottom: 32, display: "flex", gap: 10, alignItems: "center" }}>
              <button className="btn btn-primary" onClick={save} disabled={saving || autoSaving}>
                {saving || autoSaving ? "Saving..." : saved ? "Saved" : "Save Lesson"}
              </button>
              {/* Auto-save status */}
              <span style={{ fontSize: 12, color: autoSaveError ? "var(--red)" : "var(--text3)" }}>
                {autoSaveError ? "Save failed" : autoSaving ? "Auto-saving..." : autoLastSaved
                  ? `Auto-saved ${autoLastSaved.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`
                  : ""}
              </span>
              <button
                className="btn btn-secondary"
                onClick={() => { setLessonVisible(!lessonVisible); setSaved(false); }}
                title={lessonVisible ? "Lesson is visible to students — click to hide" : "Lesson is hidden from students — click to show"}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  color: lessonVisible ? "var(--green)" : "var(--text3)",
                  borderColor: lessonVisible ? "var(--green)" : "var(--border)",
                }}
              >
                {lessonVisible ? "👁 Visible" : "🙈 Hidden"}
              </button>
              {selectedLesson && !selectedLesson.startsWith("new-") && (
                <button
                  className="btn btn-secondary"
                  onClick={openPreview}
                  title="Preview this lesson as a student"
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  👁 Preview
                </button>
              )}
              <button
                className="btn btn-secondary"
                onClick={() => setShowJsonImport(true)}
                title="Import blocks from a JSON array"
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                📋 Paste JSON
              </button>
              {selectedLesson && !selectedLesson.startsWith("new-") && courses.length > 1 && (
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowDuplicateModal(true)}
                  title="Copy this lesson to another course"
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  📑 Duplicate to...
                </button>
              )}
              <button
                className="btn btn-secondary"
                disabled={aiGenerating || blocks.length === 0}
                onClick={async () => {
                  setAiGenerating(true);
                  try {
                    const result = await generateQuestionSuggestion(lessonTitle, lessonUnit, blocks, getToken);
                    setAiSuggestion({ block: result, rationale: result._aiRationale });
                  } catch (err) {
                    console.error("AI question generation failed:", err);
                    alert("Failed to generate question: " + err.message);
                  }
                  setAiGenerating(false);
                }}
                title="Use AI to suggest a new question based on lesson content"
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: aiGenerating ? "var(--surface2)" : "linear-gradient(135deg, rgba(245,166,35,0.12), rgba(245,166,35,0.06))",
                  borderColor: "rgba(245,166,35,0.3)", color: "var(--amber)",
                }}
              >
                {aiGenerating ? "⏳ Analyzing..." : "✨ Suggest Question"}
              </button>
              <div style={{ flex: 1 }} />
              {selectedLesson && !selectedLesson.startsWith("new-") && (
                <button
                  className="btn btn-secondary"
                  onClick={deleteLesson}
                  title="Delete this lesson"
                  style={{ color: "var(--red)", borderColor: "var(--red)" }}
                >
                  🗑 Delete
                </button>
              )}
            </div>

            {/* Blocks with inline inserters + drag-and-drop */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <AddBlockInline onInsert={(t) => insertBlockAt(t, 0)} />
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis, restrictToParentElement]}>
                <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
                  {blocks.map((block, i) => (
                    <div key={block.id}>
                      <SortableBlockEditor
                        block={block}
                        onChange={(data) => updateBlock(i, data)}
                        onDelete={() => deleteBlock(i)}
                        onDuplicate={() => duplicateBlock(i)}
                        onMoveUp={() => moveBlock(i, -1)}
                        onMoveDown={() => moveBlock(i, 1)}
                        isFirst={i === 0}
                        isLast={i === blocks.length - 1}
                        isExpanded={expandedBlockId === block.id}
                        onToggleExpand={() => setExpandedBlockId(expandedBlockId === block.id ? null : block.id)}
                      />
                      <AddBlockInline onInsert={(t) => insertBlockAt(t, i + 1)} />
                    </div>
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          </>
        )}
      </div>

      {/* AI Question Suggestion Modal */}
      {aiSuggestion && (
        <div
          onClick={() => setAiSuggestion(null)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--surface)", borderRadius: 16, padding: 28,
              width: "100%", maxWidth: 560, border: "1px solid var(--border)",
            }}
          >
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              ✨ AI-Suggested Question
            </h2>

            {/* Preview the question */}
            <div style={{
              background: "var(--bg)", borderRadius: 12, padding: 18, marginBottom: 16,
              border: "1px solid var(--border)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 4,
                  background: "rgba(245,166,35,0.12)", color: "var(--amber)", textTransform: "uppercase",
                }}>
                  {aiSuggestion.block.questionType === "multiple_choice" ? "MC" : aiSuggestion.block.questionType === "ranking" ? "Ranking" : "Written"}
                </span>
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 4,
                  background: "rgba(96,165,250,0.12)", color: "var(--blue)", textTransform: "uppercase",
                }}>
                  {aiSuggestion.block.difficulty}
                </span>
              </div>
              <p style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.5, marginBottom: 10 }}>
                {aiSuggestion.block.prompt}
              </p>
              {aiSuggestion.block.questionType === "multiple_choice" && aiSuggestion.block.options && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {aiSuggestion.block.options.map((opt, i) => (
                    <div key={i} style={{
                      padding: "8px 14px", borderRadius: 8, fontSize: 14,
                      background: i === aiSuggestion.block.correctIndex ? "rgba(52,216,168,0.1)" : "var(--surface2)",
                      border: `1px solid ${i === aiSuggestion.block.correctIndex ? "var(--green)" : "var(--border)"}`,
                      display: "flex", alignItems: "center", gap: 8,
                    }}>
                      <span style={{ fontWeight: 700, color: "var(--text3)" }}>{String.fromCharCode(65 + i)}</span>
                      <span>{opt}</span>
                      {i === aiSuggestion.block.correctIndex && <span style={{ marginLeft: "auto", color: "var(--green)" }}>✓</span>}
                    </div>
                  ))}
                </div>
              )}
              {aiSuggestion.block.questionType === "ranking" && aiSuggestion.block.items && (
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {aiSuggestion.block.items.map((item, i) => (
                    <div key={i} style={{ padding: "6px 14px", borderRadius: 8, background: "var(--surface2)", border: "1px solid var(--border)", fontSize: 14 }}>
                      <span style={{ fontWeight: 700, color: "var(--text3)", marginRight: 8 }}>{i + 1}.</span> {item}
                    </div>
                  ))}
                </div>
              )}
              {aiSuggestion.block.explanation && (
                <div style={{ marginTop: 10, fontSize: 13, color: "var(--text2)", fontStyle: "italic" }}>
                  💡 {aiSuggestion.block.explanation}
                </div>
              )}
            </div>

            {/* AI rationale */}
            {aiSuggestion.rationale && (
              <div style={{
                background: "rgba(245,166,35,0.06)", borderRadius: 10, padding: "12px 16px", marginBottom: 16,
                border: "1px dashed rgba(245,166,35,0.2)", fontSize: 13, color: "var(--text2)",
              }}>
                <span style={{ fontWeight: 700, color: "var(--amber)", fontSize: 11 }}>🤖 AI RATIONALE:</span>{" "}
                {aiSuggestion.rationale}
              </div>
            )}

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button className="btn btn-secondary" onClick={() => setAiSuggestion(null)} style={{ fontSize: 14 }}>
                Cancel
              </button>
              <button
                className="btn btn-secondary"
                onClick={async () => {
                  setAiSuggestion(null);
                  setAiGenerating(true);
                  try {
                    const result = await generateQuestionSuggestion(lessonTitle, lessonUnit, blocks, getToken);
                    setAiSuggestion({ block: result, rationale: result._aiRationale });
                  } catch (err) {
                    alert("Failed: " + err.message);
                  }
                  setAiGenerating(false);
                }}
                style={{ fontSize: 14 }}
              >
                🔄 Regenerate
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  const newBlock = { ...aiSuggestion.block };
                  delete newBlock._aiRationale;
                  setBlocks([...blocks, newBlock]);
                  setSaved(false);
                  setAiSuggestion(null);
                }}
                style={{ fontSize: 14 }}
              >
                ✅ Insert Question
              </button>
            </div>
          </div>
        </div>
      )}

      {/* JSON Import Modal */}
      {showJsonImport && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 999,
          display: "flex", alignItems: "center", justifyContent: "center",
        }} onClick={() => setShowJsonImport(false)}>
          <div style={{
            background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16,
            padding: 28, width: 600, maxHeight: "80vh", display: "flex", flexDirection: "column", gap: 16,
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: "var(--font-display)", margin: 0 }}>📋 Import Blocks from JSON</h3>
            <p style={{ color: "var(--text2)", fontSize: 13, margin: 0 }}>
              Paste a JSON array of blocks, or an object with <code style={{ background: "var(--surface2)", padding: "2px 6px", borderRadius: 4 }}>{"{"} "title", "unit", "blocks": [...] {"}"}</code>. 
              The title and unit will auto-fill if the current fields are empty.
            </p>
            <textarea
              value={jsonInput}
              onChange={e => setJsonInput(e.target.value)}
              placeholder='[{"type":"section_header","icon":"📥","title":"My Section"}, ...]'
              style={{
                flex: 1, minHeight: 260, fontFamily: "monospace", fontSize: 12,
                background: "var(--surface2)", color: "var(--text)", border: "1.5px solid var(--border)",
                borderRadius: 10, padding: 14, resize: "vertical",
              }}
            />
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button className="btn btn-secondary" onClick={() => { setShowJsonImport(false); setJsonInput(""); }}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleJsonImport} disabled={!jsonInput.trim()}>
                Import {jsonInput.trim() ? (() => { try { const p = JSON.parse(jsonInput); const b = Array.isArray(p) ? p : p.blocks; return b ? `(${b.length} blocks)` : ""; } catch { return ""; } })() : ""}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Duplicate to Course Modal */}
      {showDuplicateModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 999,
          display: "flex", alignItems: "center", justifyContent: "center",
        }} onClick={() => setShowDuplicateModal(false)}>
          <div style={{
            background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16,
            padding: 28, width: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: "var(--font-display)", margin: "0 0 8px" }}>📑 Duplicate Lesson</h3>
            <p style={{ color: "var(--text2)", fontSize: 13, margin: "0 0 20px" }}>
              Copy <strong>"{lessonTitle}"</strong> to another course. The duplicate starts hidden so you can review it first.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {courses.filter((c) => c.id !== selectedCourse).map((c) => (
                <button
                  key={c.id}
                  className="btn btn-secondary"
                  disabled={duplicating}
                  onClick={() => duplicateToCourse(c.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "12px 16px",
                    fontSize: 14, justifyContent: "flex-start",
                  }}
                >
                  <span style={{ fontSize: 20 }}>{c.icon || "📚"}</span>
                  <span>{c.title}</span>
                </button>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
              <button className="btn btn-secondary" onClick={() => setShowDuplicateModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}