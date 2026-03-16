import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useInvestigation } from '../contexts/InvestigationContext'
import { CASES } from '../data/cases'
import { Briefcase, Landmark, ScanFace, Radio, Clock, Search, Star, ArrowRight, Plus, Copy, Check } from 'lucide-react'

const ICON_MAP = { Briefcase, Landmark, ScanFace, Radio }
const DIFF_COLORS = {
  1: 'text-diff-easy bg-diff-easy/10 border-diff-easy/30',
  2: 'text-diff-medium bg-diff-medium/10 border-diff-medium/30',
  3: 'text-diff-hard bg-diff-hard/10 border-diff-hard/30',
}

export default function CaseBoard() {
  const { userProfile, joinClassroom } = useAuth()
  const { startInvestigation } = useInvestigation()
  const navigate = useNavigate()
  const [classCode, setClassCode] = useState('')
  const [joinError, setJoinError] = useState('')
  const [joinSuccess, setJoinSuccess] = useState(false)
  const [joining, setJoining] = useState(false)

  const handleStartCase = async (caseId) => {
    await startInvestigation(caseId)
    navigate(`/investigate/${caseId}`)
  }

  const handleJoinClass = async (e) => {
    e.preventDefault()
    if (!classCode.trim()) return
    setJoining(true)
    setJoinError('')
    try {
      await joinClassroom(classCode.trim().toUpperCase())
      setJoinSuccess(true)
      setClassCode('')
      setTimeout(() => setJoinSuccess(false), 3000)
    } catch (err) {
      setJoinError(err.message)
    }
    setJoining(false)
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-text-primary mb-2">
          Case Files
        </h1>
        <p className="text-text-secondary text-sm">
          Select a case to begin your investigation. Each case contains an AI system with hidden biases for you to uncover.
        </p>
      </div>

      {/* Join classroom (students) */}
      {userProfile?.role === 'student' && (
        <div className="bg-case-dark border border-case-border rounded-xl p-4 mb-8 flex items-center gap-4">
          <div className="text-xs font-[family-name:var(--font-mono)] text-text-dim uppercase tracking-wider whitespace-nowrap">
            Join Classroom:
          </div>
          <form onSubmit={handleJoinClass} className="flex items-center gap-2 flex-1">
            <input
              type="text"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value.toUpperCase())}
              placeholder="Enter code..."
              maxLength={6}
              className="bg-case-light border border-case-border rounded-lg px-3 py-2 text-sm font-[family-name:var(--font-mono)] text-text-primary placeholder:text-text-dim w-32 focus:outline-none focus:border-clue-gold/40"
            />
            <button
              type="submit"
              disabled={joining}
              className="bg-case-light border border-case-border hover:border-clue-gold/40 text-text-secondary hover:text-clue-gold px-3 py-2 rounded-lg text-sm transition-colors"
            >
              {joining ? '...' : 'Join'}
            </button>
          </form>
          {joinError && <span className="text-xs text-bias-red">{joinError}</span>}
          {joinSuccess && <span className="text-xs text-mitigate-green flex items-center gap-1"><Check className="w-3 h-3" /> Joined!</span>}
        </div>
      )}

      {/* Case cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {CASES.map((caseData, i) => {
          const Icon = ICON_MAP[caseData.icon] || Briefcase
          const diffClass = DIFF_COLORS[caseData.difficulty]
          
          return (
            <div
              key={caseData.id}
              className={`group bg-case-dark border border-case-border hover:border-clue-gold/30 rounded-xl overflow-hidden transition-all animate-fade-in stagger-${i + 1}`}
            >
              {/* Case header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 bg-case-light group-hover:bg-clue-gold/10 rounded-xl flex items-center justify-center transition-colors">
                    <Icon className="w-5 h-5 text-clue-gold" />
                  </div>
                  <span className={`text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-wider border rounded-full px-2.5 py-1 ${diffClass}`}>
                    {caseData.difficultyLabel}
                  </span>
                </div>

                <h3 className="text-text-primary font-semibold text-lg mb-1">
                  {caseData.title}
                </h3>
                <p className="text-xs font-[family-name:var(--font-mono)] text-text-dim mb-3">
                  {caseData.subtitle}
                </p>
                <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">
                  {caseData.description}
                </p>
              </div>

              {/* Case footer */}
              <div className="px-6 pb-5 pt-2 flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-text-dim">
                  <span className="flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5" />
                    {caseData.totalClues} clues
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {caseData.estimatedTime}
                  </span>
                </div>
                <button
                  onClick={() => handleStartCase(caseData.id)}
                  className="flex items-center gap-2 text-sm text-clue-gold hover:text-clue-amber font-medium transition-colors group/btn"
                >
                  Investigate
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
