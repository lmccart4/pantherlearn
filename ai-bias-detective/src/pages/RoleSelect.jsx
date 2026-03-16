import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { GraduationCap, Users } from 'lucide-react'

export default function RoleSelect() {
  const { setRole } = useAuth()
  const navigate = useNavigate()

  const handleRole = async (role) => {
    await setRole(role)
    navigate('/cases')
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-text-primary text-center mb-2">
          Select Your Role
        </h2>
        <p className="text-sm text-text-secondary text-center mb-8">
          How will you be using AI Bias Detective?
        </p>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleRole('student')}
            className="bg-case-dark border border-case-border hover:border-clue-gold/40 rounded-xl p-6 text-center transition-all group"
          >
            <div className="w-12 h-12 bg-case-light group-hover:bg-clue-gold/10 rounded-xl flex items-center justify-center mx-auto mb-4 transition-colors">
              <GraduationCap className="w-6 h-6 text-clue-gold" />
            </div>
            <h3 className="text-text-primary font-semibold mb-1">Student</h3>
            <p className="text-xs text-text-secondary">Investigate cases &amp; uncover bias</p>
          </button>

          <button
            onClick={() => handleRole('teacher')}
            className="bg-case-dark border border-case-border hover:border-info-blue/40 rounded-xl p-6 text-center transition-all group"
          >
            <div className="w-12 h-12 bg-case-light group-hover:bg-info-blue/10 rounded-xl flex items-center justify-center mx-auto mb-4 transition-colors">
              <Users className="w-6 h-6 text-info-blue" />
            </div>
            <h3 className="text-text-primary font-semibold mb-1">Teacher</h3>
            <p className="text-xs text-text-secondary">Manage classrooms &amp; review work</p>
          </button>
        </div>
      </div>
    </div>
  )
}
