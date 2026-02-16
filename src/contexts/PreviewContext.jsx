// src/contexts/PreviewContext.jsx
// Provides preview mode state to all child components.
// When a teacher enters "Preview as Student" mode, this context
// tells every component to hide teacher-only UI and simulate student behavior.

import { createContext, useContext, useState, useCallback } from "react";

const PreviewContext = createContext(null);

const STUDENT_SCENARIOS = {
  new: {
    label: "New Student",
    description: "No progress — first time opening the lesson",
    icon: "🆕",
    studentData: {},
    chatLogs: {},
    totalXP: 0,
    level: 1,
    lessonsCompleted: 0,
  },
  midway: {
    label: "Mid-Lesson",
    description: "Some questions answered, partial progress",
    icon: "📝",
    studentData: null, // null = generate mock based on lesson blocks
    chatLogs: null,
    totalXP: 350,
    level: 4,
    lessonsCompleted: 3,
  },
  complete: {
    label: "Completed",
    description: "All questions answered, all chats used",
    icon: "✅",
    studentData: null, // null = generate mock based on lesson blocks
    chatLogs: null,
    totalXP: 1200,
    level: 8,
    lessonsCompleted: 7,
  },
};

export function PreviewProvider({ children }) {
  const [isPreview, setIsPreview] = useState(false);
  const [scenario, setScenario] = useState("new");
  const [sourceLocation, setSourceLocation] = useState(null);

  const enterPreview = useCallback((scenarioKey = "new", source = null) => {
    setScenario(scenarioKey);
    setSourceLocation(source);
    setIsPreview(true);
  }, []);

  const exitPreview = useCallback(() => {
    setIsPreview(false);
    setScenario("new");
    setSourceLocation(null);
  }, []);

  const switchScenario = useCallback((scenarioKey) => {
    setScenario(scenarioKey);
  }, []);

  const value = {
    isPreview,
    scenario,
    scenarioConfig: STUDENT_SCENARIOS[scenario],
    scenarios: STUDENT_SCENARIOS,
    sourceLocation,
    enterPreview,
    exitPreview,
    switchScenario,
  };

  return (
    <PreviewContext.Provider value={value}>
      {children}
    </PreviewContext.Provider>
  );
}

export const usePreview = () => {
  const ctx = useContext(PreviewContext);
  if (!ctx) {
    // Return safe defaults if used outside provider
    return {
      isPreview: false,
      scenario: "new",
      scenarioConfig: STUDENT_SCENARIOS.new,
      scenarios: STUDENT_SCENARIOS,
      sourceLocation: null,
      enterPreview: () => {},
      exitPreview: () => {},
      switchScenario: () => {},
    };
  }
  return ctx;
};
