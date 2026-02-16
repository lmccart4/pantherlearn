// src/pages/Dashboard.jsx
import { useAuth } from "../hooks/useAuth";
import StudentDashboard from "./StudentDashboard";
import TeacherDashboard from "./TeacherDashboard";

export default function Dashboard() {
  const { userRole } = useAuth();

  if (userRole === "teacher") return <TeacherDashboard />;
  return <StudentDashboard />;
}