// src/components/TeacherOnly.jsx
// Wrapper that hides its children when the teacher is in preview mode.
// Use this around any UI that should only be visible to teachers
// (edit buttons, grading links, admin panels, etc.)

import { usePreview } from "../contexts/PreviewContext";

export default function TeacherOnly({ children }) {
  const { isPreview } = usePreview();

  if (isPreview) return null;
  return <>{children}</>;
}
