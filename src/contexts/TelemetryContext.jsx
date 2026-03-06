// src/contexts/TelemetryContext.jsx
// Provides trackEvent() to any descendant block/component without prop drilling.
// Wraps useTelemetry and distributes it via React context.

import { createContext, useContext, useMemo } from "react";
import { useTelemetry } from "../hooks/useTelemetry";

const TelemetryContext = createContext({ trackEvent: () => {} });

export function TelemetryProvider({ courseId, lessonId, children }) {
  const { trackEvent } = useTelemetry(courseId, lessonId);
  const value = useMemo(() => ({ trackEvent }), [trackEvent]);
  return (
    <TelemetryContext.Provider value={value}>
      {children}
    </TelemetryContext.Provider>
  );
}

export function useTelemetryContext() {
  return useContext(TelemetryContext);
}
