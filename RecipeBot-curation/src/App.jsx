// ============================================================
// RecipeBot Data Curation Dashboard - Main App
// ============================================================
// React SPA with 4 stages + Firebase integration
// Deploy to Firebase Hosting alongside PantherLearn

import React, { useState, useEffect, useCallback } from "react";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import StageOne from "./stages/StageOne";
import StageTwo from "./stages/StageTwo";
import StageThree from "./stages/StageThree";
import StageFour from "./stages/StageFour";
import Summary from "./stages/Summary";
import LoginGate from "./components/LoginGate";
import { DATA_SOURCES, TOTAL_BUDGET } from "./data/sources";
import "./styles/App.css";

const STAGES = [
  { id: 1, title: "Source Selection", icon: "📂", subtitle: "Choose your training data" },
  { id: 2, title: "Bias Detection", icon: "🔍", subtitle: "Analyze your dataset" },
  { id: 3, title: "Data Cleaning", icon: "🧹", subtitle: "Flag problematic entries" },
  { id: 4, title: "Model Testing", icon: "🤖", subtitle: "See the impact" },
  { id: 5, title: "Summary", icon: "📊", subtitle: "Review & submit" }
];

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStage, setCurrentStage] = useState(1);
  const [stageCompleted, setStageCompleted] = useState({});

  // Student curation state
  const [selectedSources, setSelectedSources] = useState([]);
  const [budgetUsed, setBudgetUsed] = useState(0);
  const [biasNotes, setBiasNotes] = useState("");
  const [cleaningDecisions, setCleaningDecisions] = useState({});
  const [testResults, setTestResults] = useState([]);
  const [reflections, setReflections] = useState({});

  // Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  // Load saved progress
  useEffect(() => {
    if (!user) return;
    const loadProgress = async () => {
      try {
        const snap = await getDoc(doc(db, "recipebot_curation", user.uid));
        if (snap.exists()) {
          const data = snap.data();
          if (data.selectedSources) setSelectedSources(data.selectedSources);
          if (data.budgetUsed) setBudgetUsed(data.budgetUsed);
          if (data.biasNotes) setBiasNotes(data.biasNotes);
          if (data.cleaningDecisions) setCleaningDecisions(data.cleaningDecisions);
          if (data.testResults) setTestResults(data.testResults);
          if (data.reflections) setReflections(data.reflections);
          if (data.currentStage) setCurrentStage(data.currentStage);
          if (data.stageCompleted) setStageCompleted(data.stageCompleted);
        }
      } catch (err) {
        console.error("Error loading progress:", err);
      }
    };
    loadProgress();
  }, [user]);

  // Auto-save progress
  const saveProgress = useCallback(async () => {
    if (!user) return;
    try {
      await setDoc(doc(db, "recipebot_curation", user.uid), {
        userId: user.uid,
        email: user.email,
        displayName: user.displayName || "",
        selectedSources,
        budgetUsed,
        biasNotes,
        cleaningDecisions,
        testResults,
        reflections,
        currentStage,
        stageCompleted,
        lastUpdated: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.error("Error saving progress:", err);
    }
  }, [user, selectedSources, budgetUsed, biasNotes, cleaningDecisions, testResults, reflections, currentStage, stageCompleted]);

  // Debounced auto-save
  useEffect(() => {
    const timer = setTimeout(() => saveProgress(), 2000);
    return () => clearTimeout(timer);
  }, [saveProgress]);

  // Source selection handlers
  const toggleSource = (source) => {
    setSelectedSources(prev => {
      const exists = prev.find(s => s.id === source.id);
      if (exists) {
        setBudgetUsed(b => b - source.cost);
        return prev.filter(s => s.id !== source.id);
      } else {
        if (budgetUsed + source.cost > TOTAL_BUDGET) return prev; // Over budget
        setBudgetUsed(b => b + source.cost);
        return [...prev, source];
      }
    });
  };

  const completeStage = (stageId) => {
    setStageCompleted(prev => ({ ...prev, [stageId]: true }));
    if (stageId < 5) setCurrentStage(stageId + 1);
    saveProgress();
  };

  const goToStage = (stageId) => {
    // Can go back to any completed stage, or forward to next uncompleted
    if (stageId <= currentStage || stageCompleted[stageId - 1]) {
      setCurrentStage(stageId);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p>Loading RecipeBot Curation Lab...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginGate />;
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-left">
          <span className="header-logo">🤖🍳</span>
          <div>
            <h1>RecipeBot Data Curation Lab</h1>
            <p className="header-subtitle">Build the training dataset for a recipe chatbot</p>
          </div>
        </div>
        <div className="header-right">
          <span className="user-badge">{user.displayName || user.email}</span>
        </div>
      </header>

      {/* Stage Navigation */}
      <nav className="stage-nav">
        {STAGES.map((stage, i) => (
          <button
            key={stage.id}
            className={`stage-tab ${currentStage === stage.id ? "active" : ""} ${stageCompleted[stage.id] ? "completed" : ""} ${stage.id > currentStage && !stageCompleted[stage.id - 1] ? "locked" : ""}`}
            onClick={() => goToStage(stage.id)}
            disabled={stage.id > currentStage && !stageCompleted[stage.id - 1]}
          >
            <span className="stage-icon">
              {stageCompleted[stage.id] ? "✅" : stage.icon}
            </span>
            <span className="stage-label">{stage.title}</span>
            <span className="stage-subtitle">{stage.subtitle}</span>
          </button>
        ))}
      </nav>

      {/* Stage Content */}
      <main className="stage-content">
        {currentStage === 1 && (
          <StageOne
            sources={DATA_SOURCES}
            selectedSources={selectedSources}
            budgetUsed={budgetUsed}
            totalBudget={TOTAL_BUDGET}
            onToggleSource={toggleSource}
            onComplete={() => completeStage(1)}
          />
        )}
        {currentStage === 2 && (
          <StageTwo
            selectedSources={selectedSources}
            biasNotes={biasNotes}
            onBiasNotesChange={setBiasNotes}
            onComplete={() => completeStage(2)}
          />
        )}
        {currentStage === 3 && (
          <StageThree
            cleaningDecisions={cleaningDecisions}
            onUpdateDecisions={setCleaningDecisions}
            onComplete={() => completeStage(3)}
          />
        )}
        {currentStage === 4 && (
          <StageFour
            selectedSources={selectedSources}
            cleaningDecisions={cleaningDecisions}
            testResults={testResults}
            onUpdateResults={setTestResults}
            reflections={reflections}
            onUpdateReflections={setReflections}
            onComplete={() => completeStage(4)}
          />
        )}
        {currentStage === 5 && (
          <Summary
            selectedSources={selectedSources}
            budgetUsed={budgetUsed}
            biasNotes={biasNotes}
            cleaningDecisions={cleaningDecisions}
            testResults={testResults}
            reflections={reflections}
            onComplete={() => completeStage(5)}
          />
        )}
      </main>
    </div>
  );
}
