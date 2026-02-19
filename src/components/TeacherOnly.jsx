// src/components/TeacherOnly.jsx
// Wrapper that hides its children from students and during preview mode.
// Use this around any UI that should only be visible to teachers
// (edit buttons, grading links, admin panels, etc.)

import { usePreview } from "../contexts/PreviewContext";
import { useAuth } from "../hooks/useAuth";

export default function TeacherOnly({ children }) {
  const { isPreview } = usePreview();
  const { userRole } = useAuth();

  if (isPreview || userRole !== "teacher") return null;
  return <>{children}</>;
}
