// src/pages/LessonEditor.jsx
import { useState, useEffect, useMemo } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { useNavigate, useSearchParams } from "react-router-dom";
import { db } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth";
import { uid } from "../lib/utils";
import { generateLessonBaselines } from "../lib/aiBaselines";

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
  { type: "sorting", label: "Sorting (Swipe)", icon: "🔀" },
  { type: "external_link", label: "External Link", icon: "🔗" },
  { type: "calculator", label: "Calculator", icon: "🧮" },
  { type: "data_table", label: "Data Table", icon: "📊" },
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
    case "embed": return { ...base, url: "", caption: "", height: 400 };
    case "divider": return { ...base };
    case "chatbot": return { ...base, icon: "🤖", title: "", starterMessage: "Hi! I'm ready to chat.", systemPrompt: "", instructions: "", placeholder: "Type a message..." };
    case "question":
      if (typeInfo.questionType === "multiple_choice") {
        return { ...base, questionType: "multiple_choice", prompt: "", options: ["", "", "", ""], correctIndex: 0, explanation: "" };
      }
      return { ...base, questionType: "short_answer", prompt: "" };
    case "sorting": return { ...base, icon: "🔀", title: "Sort It!", instructions: "", leftLabel: "Category A", rightLabel: "Category B", items: [{ text: "", correct: "left" }] };
    case "external_link": return { ...base, icon: "🔗", title: "", url: "", description: "", buttonLabel: "Open", openInNewTab: true };
    case "calculator": return { ...base, title: "", description: "", formula: "", showFormula: false, inputs: [{ name: "value1", label: "Value 1", unit: "" }], output: { label: "Result", unit: "", decimals: 2 } };
    case "data_table": return { ...base, preset: "momentum", title: "Momentum Data Table", trials: 1, labelA: "", labelB: "" };
    default: return base;
  }
}

// --- Block editor forms ---
function BlockEditor({ block, onChange, onDelete, onDuplicate, onMoveUp, onMoveDown, isFirst, isLast }) {
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
      case "question":
        if (block.questionType === "multiple_choice") {
          return (<>
            <Field label="Question Prompt" value={block.prompt} onChange={(v) => update("prompt", v)} multiline />
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
        return <Field label="Question Prompt" value={block.prompt} onChange={(v) => update("prompt", v)} multiline />;
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
      default: return <p style={{ color: "var(--text3)" }}>Unknown block type</p>;
    }
  };

  const typeLabel = BLOCK_TYPES.find((t) => t.type === block.type && (!t.questionType || t.questionType === block.questionType))?.label || block.type;

  return (
    <div className="block-editor-card">
      <div className="block-editor-header">
        <span className="block-editor-type">{typeLabel}</span>
        <div className="block-editor-actions">
          {!isFirst && <button className="editor-icon-btn" onClick={onMoveUp} title="Move up">↑</button>}
          {!isLast && <button className="editor-icon-btn" onClick={onMoveDown} title="Move down">↓</button>}
          <button className="editor-icon-btn" onClick={onDuplicate} title="Duplicate block">⧉</button>
          <button className="editor-icon-btn delete" onClick={onDelete} title="Delete block">🗑</button>
        </div>
      </div>
      <div className="block-editor-body">{renderFields()}</div>
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

// --- Inline "+" button between blocks ---
function AddBlockInline({ onInsert }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, margin: "2px 0" }}>
      <div style={{ flex: 1, height: 1, background: open ? "var(--amber)" : "transparent" }} />
      <div style={{ position: "relative" }}>
        <button
          onClick={() => setOpen(!open)}
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
            boxShadow: "0 8px 30px rgba(0,0,0,0.4)", padding: 8, zIndex: 50, width: 220,
            display: "flex", flexWrap: "wrap", gap: 4,
          }}>
            {BLOCK_TYPES.map((t, i) => (
              <button key={i} className="btn btn-secondary" style={{ fontSize: 11, padding: "4px 8px", flex: "0 0 auto" }}
                onClick={() => { onInsert(t); setOpen(false); }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div style={{ flex: 1, height: 1, background: open ? "var(--amber)" : "transparent" }} />
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
  const [lessonVisible, setLessonVisible] = useState(true);
  const [lessonOrder, setLessonOrder] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [collapsedUnits, setCollapsedUnits] = useState({});
  const [showJsonImport, setShowJsonImport] = useState(false);
  const [jsonInput, setJsonInput] = useState("");

  // Fetch courses (only owned by current teacher)
  useEffect(() => {
    const fetch = async () => {
      const snapshot = await getDocs(query(collection(db, "courses"), orderBy("order", "asc")));
      const owned = snapshot.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((c) => c.ownerUid === user?.uid);
      setCourses(owned);
      setLoading(false);
    };
    fetch();
  }, [user]);

  // Fetch lessons when course selected
  useEffect(() => {
    if (!selectedCourse) { setLessons([]); return; }
    const fetch = async () => {
      const snapshot = await getDocs(query(collection(db, "courses", selectedCourse, "lessons"), orderBy("order", "asc")));
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
    setLessonVisible(lesson.visible !== false);
    setLessonOrder(lesson.order ?? null);
    setBlocks(lesson.blocks || []);
    setSaved(false);
  };

  const createNewLesson = () => {
    setSelectedLesson("new-" + uid());
    setLessonTitle("New Lesson");
    setLessonUnit("");
    setLessonDueDate("");
    setLessonVisible(true);
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

  // FIX #36: Shared helper — refreshes the lesson list from Firestore
  const refreshLessons = async () => {
    const snapshot = await getDocs(query(collection(db, "courses", selectedCourse, "lessons"), orderBy("order", "asc")));
    setLessons(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  // Save lesson
  const save = async () => {
    if (!selectedCourse || !selectedLesson) return;
    setSaving(true);
    const isNew = selectedLesson.startsWith("new-");
    try {
      const lessonId = isNew ? uid() : selectedLesson;
      const lessonRef = doc(db, "courses", selectedCourse, "lessons", lessonId);
      const data = {
        title: lessonTitle,
        unit: lessonUnit,
        dueDate: lessonDueDate || null,
        visible: lessonVisible,
        blocks,
        updatedAt: new Date(),
      };
      // Only set order for new lessons (append to end); existing lessons keep their order
      if (isNew) {
        data.order = lessons.length;
      }
      await setDoc(lessonRef, data, { merge: true });
      if (isNew) setSelectedLesson(lessonId);
      setSaved(true);
      await refreshLessons();

      // Generate AI baselines for short-answer questions (runs in background)
      const hasWrittenQuestions = blocks.some(
        (b) => b.type === "question" && b.questionType === "short_answer" && b.prompt && (!b.aiBaselines || b.aiBaselines.length === 0)
      );
      if (hasWrittenQuestions) {
        generateLessonBaselines(selectedCourse, lessonId, blocks, getToken)
          .then((updatedBlocks) => {
            if (updatedBlocks !== blocks) setBlocks(updatedBlocks);
          })
          .catch((err) => console.warn("Baseline generation failed (non-critical):", err));
      }
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

  // Swap lesson order in sidebar and persist to Firestore
  const swapLessonOrder = async (indexA, indexB) => {
    const a = lessons[indexA];
    const b = lessons[indexB];
    if (!a || !b) return;
    try {
      // Build the new order: swap the two lessons in the array
      const reordered = [...lessons];
      reordered[indexA] = b;
      reordered[indexB] = a;

      // Assign clean sequential order values to ALL lessons
      const updates = [];
      for (let i = 0; i < reordered.length; i++) {
        if (reordered[i].order !== i) {
          updates.push(
            setDoc(doc(db, "courses", selectedCourse, "lessons", reordered[i].id), { order: i }, { merge: true })
          );
        }
      }
      // Always update the two swapped lessons (in case they had the same order value)
      if (!updates.length) {
        await setDoc(doc(db, "courses", selectedCourse, "lessons", a.id), { order: indexB }, { merge: true });
        await setDoc(doc(db, "courses", selectedCourse, "lessons", b.id), { order: indexA }, { merge: true });
      } else {
        await Promise.all(updates);
      }

      await refreshLessons();
    } catch (err) {
      console.error("Reorder failed:", err);
    }
  };

  // Toggle unit collapse
  const toggleUnit = (unit) => {
    setCollapsedUnits((prev) => ({ ...prev, [unit]: !prev[unit] }));
  };

  // FIX #37: Group lessons by unit for sidebar display (memoized)
  const groupedLessons = useMemo(() => {
    const groups = [];
    let currentUnit = null;
    let currentGroup = null;
    for (const lesson of lessons) {
      const unit = lesson.unit || "";
      if (unit !== currentUnit) {
        currentUnit = unit;
        currentGroup = { unit, lessons: [] };
        groups.push(currentGroup);
      }
      currentGroup.lessons.push(lesson);
    }
    return groups;
  }, [lessons]);

  if (userRole !== "teacher") {
    return (
      <div className="page-container" style={{ textAlign: "center", paddingTop: 120 }}>
        <h2 style={{ fontFamily: "var(--font-display)" }}>Teacher access only</h2>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ display: "flex", height: "calc(100vh - 62px)" }}>
      {/* Left sidebar: course/lesson picker */}
      <div style={{
        width: 260, borderRight: "1px solid var(--border)", padding: 20,
        overflowY: "auto", background: "var(--surface)", flexShrink: 0,
      }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, marginBottom: 16 }}>Courses</h3>
        {loading ? <div className="spinner" /> : courses.length === 0 ? (
          <p style={{ color: "var(--text3)", fontSize: 13 }}>No courses yet. Create one in Firestore to get started.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {courses.map((c) => (
              <button key={c.id} className={`top-nav-link ${selectedCourse === c.id ? "active" : ""}`}
                style={{ textAlign: "left" }} onClick={() => { setSelectedCourse(c.id); setSelectedLesson(null); }}>
                {c.icon || "📚"} {c.title}
              </button>
            ))}
          </div>
        )}

        {selectedCourse && (
          <>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, marginTop: 28, marginBottom: 12 }}>Lessons</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {groupedLessons.map((group) => {
                const hasUnit = group.unit.trim() !== "";
                const isCollapsed = hasUnit && collapsedUnits[group.unit];

                return (
                  <div key={group.unit || "__no_unit__"}>
                    {/* Unit header — only show if lessons have a unit */}
                    {hasUnit && (
                      <button
                        onClick={() => toggleUnit(group.unit)}
                        style={{
                          display: "flex", alignItems: "center", gap: 6, width: "100%",
                          padding: "6px 8px", marginTop: 8, marginBottom: 2,
                          background: "none", border: "none", cursor: "pointer",
                          fontSize: 11, fontWeight: 700, color: "var(--amber)",
                          textTransform: "uppercase", letterSpacing: "0.06em",
                          textAlign: "left",
                        }}
                      >
                        <span style={{
                          transition: "transform 0.15s",
                          transform: isCollapsed ? "rotate(-90deg)" : "rotate(0deg)",
                          display: "inline-block", fontSize: 10,
                        }}>▼</span>
                        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {group.unit}
                        </span>
                        <span style={{ color: "var(--text3)", fontWeight: 400, fontSize: 10 }}>
                          {group.lessons.length}
                        </span>
                      </button>
                    )}

                    {/* Lessons in this unit */}
                    {!isCollapsed && group.lessons.map((l) => {
                      const globalIndex = lessons.indexOf(l);
                      const isPastDue = l.dueDate && new Date(l.dueDate + "T23:59:59") < new Date();
                      const isHidden = l.visible === false;
                      return (
                        <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 2, paddingLeft: hasUnit ? 12 : 0, opacity: isHidden ? 0.5 : 1 }}>
                          <button className={`top-nav-link ${selectedLesson === l.id ? "active" : ""}`}
                            style={{ textAlign: "left", fontSize: 12, flex: 1 }} onClick={() => loadLesson(l)}>
                            <span>{isHidden ? "🙈 " : ""}{l.title}</span>
                            {l.dueDate && (
                              <span style={{
                                display: "block", fontSize: 10, marginTop: 1,
                                color: isPastDue ? "var(--red)" : "var(--text3)",
                              }}>
                                Due {new Date(l.dueDate + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                              </span>
                            )}
                          </button>
                          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                            {globalIndex > 0 && (
                              <button className="editor-icon-btn" style={{ fontSize: 9, padding: "0 3px", lineHeight: 1 }}
                                title="Move up" onClick={() => swapLessonOrder(globalIndex, globalIndex - 1)}>▲</button>
                            )}
                            {globalIndex < lessons.length - 1 && (
                              <button className="editor-icon-btn" style={{ fontSize: 9, padding: "0 3px", lineHeight: 1 }}
                                title="Move down" onClick={() => swapLessonOrder(globalIndex, globalIndex + 1)}>▼</button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
              <button className="editor-add-btn" style={{ marginTop: 8 }} onClick={createNewLesson}>
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
            </div>

            {/* Actions — row 2 */}
            <div style={{ marginBottom: 32, display: "flex", gap: 10, alignItems: "center" }}>
              <button className="btn btn-primary" onClick={save} disabled={saving}>
                {saving ? "Saving..." : saved ? "✓ Saved" : "Save Lesson"}
              </button>
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

            {/* Blocks with inline inserters */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <AddBlockInline onInsert={(t) => insertBlockAt(t, 0)} />
              {blocks.map((block, i) => (
                <div key={block.id}>
                  <BlockEditor block={block}
                    onChange={(data) => updateBlock(i, data)}
                    onDelete={() => deleteBlock(i)}
                    onDuplicate={() => duplicateBlock(i)}
                    onMoveUp={() => moveBlock(i, -1)}
                    onMoveDown={() => moveBlock(i, 1)}
                    isFirst={i === 0} isLast={i === blocks.length - 1} />
                  <AddBlockInline onInsert={(t) => insertBlockAt(t, i + 1)} />
                </div>
              ))}
            </div>

            {/* Add block */}
          </>
        )}
      </div>

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
    </div>
  );
}