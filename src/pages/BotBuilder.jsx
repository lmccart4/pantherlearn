// src/pages/BotBuilder.jsx
// Main page for the Build-a-Chatbot Workshop.
// Split layout: phase editor on the left, ChatPreview on the right.

import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { db } from "../lib/firebase";
import {
  createBotProject, getBotProject, getStudentBotProjects,
  updateBotProject, updatePhaseConfig, publishBot, unpublishBot,
} from "../lib/botStore";
import { awardXP, getXPConfig } from "../lib/gamification";
import ChatPreview from "../components/chatbot-workshop/ChatPreview";
import DecisionTreeEditor from "../components/chatbot-workshop/DecisionTreeEditor";
import KeywordMatchEditor from "../components/chatbot-workshop/KeywordMatchEditor";
import SystemPromptEditor from "../components/chatbot-workshop/SystemPromptEditor";

const BOT_CHAT_URL = import.meta.env.VITE_BOT_CHAT_URL
  || "https://us-central1-pantherlearn-d6f7c.cloudfunctions.net/botChat";

const PHASES = [
  { num: 1, label: "Decision Tree", icon: "🌳", color: "var(--cyan)", description: "Build if/then conversation paths" },
  { num: 2, label: "Keyword Match", icon: "🔑", color: "var(--amber)", description: "Match keywords to responses" },
  { num: 3, label: "Intent Classifier", icon: "🧠", color: "var(--purple)", description: "Train AI to understand intent", locked: true },
  { num: 4, label: "LLM-Powered", icon: "✨", color: "var(--green, #34d399)", description: "Write prompts for an AI brain" },
];

export default function BotBuilder() {
  const { courseId } = useParams();
  const { user, getToken } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [activePhase, setActivePhase] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showProjectPicker, setShowProjectPicker] = useState(false);

  // Load student's bot projects for this course
  useEffect(() => {
    if (!user?.uid || !courseId) return;
    loadProjects();
  }, [user?.uid, courseId]);

  async function loadProjects() {
    setLoading(true);
    try {
      const bots = await getStudentBotProjects(db, user.uid, courseId);
      setProjects(bots);
      if (bots.length === 1) {
        setProject(bots[0]);
        setActivePhase(bots[0].currentPhase || 1);
      } else if (bots.length > 1) {
        setShowProjectPicker(true);
      }
      // If no projects, show create screen
    } catch (err) {
      console.error("Error loading bot projects:", err);
    }
    setLoading(false);
  }

  async function handleCreateProject() {
    try {
      const newProject = await createBotProject(db, {
        ownerId: user.uid,
        courseId,
        botName: "My Chatbot",
        botAvatar: "🤖",
        ownerName: user.displayName || "Anonymous",
      });
      setProject(newProject);
      setActivePhase(1);
      setShowProjectPicker(false);
    } catch (err) {
      console.error("Error creating project:", err);
    }
  }

  async function handleSelectProject(p) {
    setProject(p);
    setActivePhase(p.currentPhase || 1);
    setShowProjectPicker(false);
  }

  // Debounced save for phase config
  const savePhaseConfig = useCallback(async (phaseNum, config) => {
    if (!project?.id) return;
    setSaving(true);
    try {
      await updatePhaseConfig(db, project.id, phaseNum, config);
      setProject(prev => ({
        ...prev,
        phases: { ...prev.phases, [phaseNum]: config },
      }));
    } catch (err) {
      console.error("Error saving phase config:", err);
    }
    setSaving(false);
  }, [project?.id]);

  async function handleUpdateBotInfo(updates) {
    if (!project?.id) return;
    try {
      await updateBotProject(db, project.id, updates);
      setProject(prev => ({ ...prev, ...updates }));
    } catch (err) {
      console.error("Error updating bot info:", err);
    }
  }

  async function handleTogglePublish() {
    if (!project?.id) return;
    try {
      if (project.published) {
        await unpublishBot(db, project.id);
        setProject(prev => ({ ...prev, published: false, publishedAt: null }));
      } else {
        // Validate: must have a bot name
        if (!project.botName?.trim()) {
          alert("Please name your chatbot before publishing!");
          return;
        }
        await publishBot(db, project.id);
        setProject(prev => ({ ...prev, published: true, publishedAt: new Date() }));
        // Award XP on first publish only (check if was previously unpublished)
        if (!project.publishedAt) {
          const xpConfig = await getXPConfig(courseId);
          const xpAmount = xpConfig?.bot_publish ?? 20;
          await awardXP(user.uid, xpAmount, "bot_publish", courseId);
        }
      }
    } catch (err) {
      console.error("Error toggling publish:", err);
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
        <div className="spinner" />
      </div>
    );
  }

  // No project yet — show create screen
  if (!project && !showProjectPicker) {
    return <CreateBotScreen onCreateProject={handleCreateProject} />;
  }

  // Multiple projects — show picker
  if (showProjectPicker) {
    return (
      <ProjectPicker
        projects={projects}
        onSelect={handleSelectProject}
        onCreate={handleCreateProject}
      />
    );
  }

  const currentConfig = project.phases?.[activePhase] || {};

  return (
    <div className="bot-builder">
      <style>{`
        .bot-builder {
          display: flex;
          height: calc(100vh - 56px);
          background: var(--bg);
          overflow: hidden;
        }

        /* Left panel: editor */
        .bb-editor-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          min-width: 0;
        }

        /* Top bar with bot info + phase tabs */
        .bb-top {
          background: var(--surface);
          border-bottom: 1px solid var(--border, rgba(255,255,255,0.08));
          padding: 0;
        }
        .bb-bot-info {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 24px;
        }
        .bb-bot-avatar-btn {
          width: 44px; height: 44px; border-radius: 12px;
          background: var(--surface2, rgba(255,255,255,0.05));
          border: 2px dashed var(--border, rgba(255,255,255,0.12));
          display: flex; align-items: center; justify-content: center;
          font-size: 24px; cursor: pointer; transition: all 0.15s;
        }
        .bb-bot-avatar-btn:hover { border-color: var(--cyan); }
        .bb-bot-name-input {
          background: transparent; border: none;
          font-size: 18px; font-weight: 700; color: var(--text);
          font-family: var(--font-body, inherit);
          padding: 4px 0; width: 250px;
        }
        .bb-bot-name-input:focus { outline: none; }
        .bb-bot-name-input::placeholder { color: var(--text3); }
        .bb-save-badge {
          font-size: 11px; color: var(--text3);
          padding: 4px 10px; border-radius: 6px;
          background: var(--surface2, rgba(255,255,255,0.03));
          margin-left: auto;
        }
        .bb-save-badge.saving { color: var(--amber); }
        .bb-publish-btn {
          padding: 6px 14px; border-radius: 8px; font-size: 12px;
          font-weight: 600; cursor: pointer; transition: all 0.15s;
          border: 1px solid var(--green, #34d399);
          background: transparent; color: var(--green, #34d399);
        }
        .bb-publish-btn:hover { background: var(--green, #34d399); color: white; }
        .bb-publish-btn.published {
          background: var(--green, #34d399)22; border-color: var(--green, #34d399);
          color: var(--green, #34d399);
        }
        .bb-arcade-link {
          padding: 6px 14px; border-radius: 8px; font-size: 12px;
          font-weight: 600; cursor: pointer; transition: all 0.15s;
          border: 1px solid var(--border, rgba(255,255,255,0.12));
          background: transparent; color: var(--text3);
        }
        .bb-arcade-link:hover { border-color: var(--cyan); color: var(--cyan); }

        /* Phase tabs */
        .bb-phase-tabs {
          display: flex; gap: 0;
          padding: 0 24px;
          overflow-x: auto;
        }
        .bb-phase-tab {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 18px;
          font-size: 13px; font-weight: 600;
          color: var(--text3);
          border-bottom: 2px solid transparent;
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
          position: relative;
          background: none; border-top: none; border-left: none; border-right: none;
        }
        .bb-phase-tab:hover:not(.locked) { color: var(--text); }
        .bb-phase-tab.active {
          color: var(--text);
        }
        .bb-phase-tab.locked {
          opacity: 0.35; cursor: default;
        }
        .bb-phase-tab .phase-icon { font-size: 16px; }
        .bb-lock-icon { font-size: 10px; }

        /* Editor content area */
        .bb-editor-content {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
        }

        /* Right panel: chat preview */
        .bb-chat-panel {
          width: 380px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
        }

        @media (max-width: 900px) {
          .bot-builder { flex-direction: column; height: auto; }
          .bb-chat-panel { width: 100%; height: 500px; }
        }
      `}</style>

      {/* Left: Editor */}
      <div className="bb-editor-panel">
        <div className="bb-top">
          {/* Bot info bar */}
          <div className="bb-bot-info">
            <button
              className="bb-bot-avatar-btn"
              onClick={() => {
                const emojis = ["🤖","🐱","🦊","🐶","🦉","🐸","🎮","🎭","🧙","👾","🌟","🎯","🧪","📚","🎨"];
                const next = emojis[(emojis.indexOf(project.botAvatar) + 1) % emojis.length];
                handleUpdateBotInfo({ botAvatar: next });
              }}
              title="Click to change avatar"
            >
              {project.botAvatar || "🤖"}
            </button>
            <input
              className="bb-bot-name-input"
              value={project.botName || ""}
              onChange={e => setProject(prev => ({ ...prev, botName: e.target.value }))}
              onBlur={e => handleUpdateBotInfo({ botName: e.target.value })}
              placeholder="Name your chatbot..."
            />
            <div className={`bb-save-badge ${saving ? "saving" : ""}`}>
              {saving ? "Saving..." : "All changes saved"}
            </div>
            <button
              className={`bb-publish-btn ${project.published ? "published" : ""}`}
              onClick={handleTogglePublish}
            >
              {project.published ? "✓ Published" : "Publish to Arcade"}
            </button>
            <button
              className="bb-arcade-link"
              onClick={() => navigate(`/bot-arcade/${courseId}`)}
            >
              Browse Arcade
            </button>
          </div>

          {/* Phase tabs */}
          <div className="bb-phase-tabs">
            {PHASES.map(p => (
              <button
                key={p.num}
                className={`bb-phase-tab ${activePhase === p.num ? "active" : ""} ${p.locked ? "locked" : ""}`}
                style={activePhase === p.num ? { borderBottomColor: p.color, color: p.color } : {}}
                onClick={() => !p.locked && setActivePhase(p.num)}
                title={p.locked ? "Coming soon!" : p.description}
              >
                <span className="phase-icon">{p.icon}</span>
                {p.label}
                {p.locked && <span className="bb-lock-icon">🔒</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Phase-specific editor */}
        <div className="bb-editor-content">
          {activePhase === 1 && (
            <DecisionTreeEditor
              config={project.phases?.[1] || { nodes: [], edges: [] }}
              onSave={config => savePhaseConfig(1, config)}
            />
          )}
          {activePhase === 2 && (
            <KeywordMatchEditor
              config={project.phases?.[2] || { rules: [] }}
              onSave={config => savePhaseConfig(2, config)}
            />
          )}
          {activePhase === 3 && (
            <div style={{ color: "var(--text3)", textAlign: "center", padding: 60 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🧠</div>
              <div style={{ fontSize: 18, fontWeight: 600 }}>Intent Classification</div>
              <div style={{ fontSize: 14, marginTop: 8 }}>Coming soon! Train your bot to understand user intent.</div>
            </div>
          )}
          {activePhase === 4 && (
            <SystemPromptEditor
              config={project.phases?.[4] || { systemPrompt: "", temperature: 0.7 }}
              onSave={config => savePhaseConfig(4, config)}
            />
          )}
        </div>
      </div>

      {/* Right: Chat Preview */}
      <div className="bb-chat-panel">
        <ChatPreview
          phase={activePhase}
          config={currentConfig}
          botName={project.botName}
          botAvatar={project.botAvatar}
          studentId={user?.uid}
          cloudFunctionUrl={BOT_CHAT_URL}
          getToken={getToken}
          projectId={project?.id}
        />
      </div>
    </div>
  );
}


// ─── Create Bot Screen ──────────────────────────────────────────────────────

function CreateBotScreen({ onCreateProject }) {
  return (
    <div style={{
      minHeight: "calc(100vh - 56px)", background: "var(--bg)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        textAlign: "center", maxWidth: 480, padding: 40,
      }}>
        <div style={{ fontSize: 72, marginBottom: 20 }}>🤖</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--text)", marginBottom: 12 }}>
          Build-a-Chatbot Workshop
        </h1>
        <p style={{ fontSize: 15, color: "var(--text3)", lineHeight: 1.6, marginBottom: 32 }}>
          Design your own chatbot from scratch! Start with simple decision trees,
          then upgrade it with keyword matching, intent classification, and even
          real AI. Your classmates will get to test your bot!
        </p>
        <div style={{
          display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 32,
        }}>
          {PHASES.map(p => (
            <div key={p.num} style={{
              background: "var(--surface)", borderRadius: 12, padding: "14px 16px",
              width: 100, textAlign: "center",
              border: `1px solid var(--border, rgba(255,255,255,0.08))`,
            }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{p.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: p.color }}>{p.label}</div>
            </div>
          ))}
        </div>
        <button
          onClick={onCreateProject}
          style={{
            background: "linear-gradient(135deg, var(--cyan), var(--blue, #3b82f6))",
            color: "white", border: "none", borderRadius: 12,
            padding: "14px 36px", fontSize: 16, fontWeight: 700,
            cursor: "pointer", transition: "transform 0.15s, opacity 0.15s",
          }}
          onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.opacity = "0.9"; }}
          onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.opacity = "1"; }}
        >
          🚀 Create My Chatbot
        </button>
      </div>
    </div>
  );
}


// ─── Project Picker ─────────────────────────────────────────────────────────

function ProjectPicker({ projects, onSelect, onCreate }) {
  return (
    <div style={{
      minHeight: "calc(100vh - 56px)", background: "var(--bg)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{ textAlign: "center", maxWidth: 500, padding: 40 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--text)", marginBottom: 20 }}>
          Your Chatbot Projects
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
          {projects.map(p => (
            <button
              key={p.id}
              onClick={() => onSelect(p)}
              style={{
                display: "flex", alignItems: "center", gap: 14,
                background: "var(--surface)", border: "1px solid var(--border, rgba(255,255,255,0.08))",
                borderRadius: 12, padding: "14px 20px", cursor: "pointer",
                transition: "border-color 0.15s", textAlign: "left",
                color: "var(--text)", width: "100%",
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "var(--cyan)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border, rgba(255,255,255,0.08))"}
            >
              <span style={{ fontSize: 28 }}>{p.botAvatar || "🤖"}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{p.botName || "Untitled Bot"}</div>
                <div style={{ fontSize: 12, color: "var(--text3)" }}>
                  Phase {p.currentPhase || 1} · {p.published ? "Published ✓" : "Draft"}
                </div>
              </div>
            </button>
          ))}
        </div>
        <button
          onClick={onCreate}
          style={{
            background: "none", border: "1px dashed var(--border, rgba(255,255,255,0.15))",
            color: "var(--text3)", borderRadius: 12, padding: "12px 24px",
            fontSize: 14, cursor: "pointer", fontWeight: 600,
          }}
        >
          + Create New Bot
        </button>
      </div>
    </div>
  );
}
