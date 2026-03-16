import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useInvestigation } from '../contexts/InvestigationContext'
import { CASES } from '../data/cases'
import { calculateScore } from '../utils/scoring'
import {
  FileText, Database, Search, Lock, ClipboardList, Award,
  AlertTriangle, Eye, CheckCircle, BookOpen, ArrowLeft, X,
  ChevronDown, ChevronRight, Sparkles
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'

const PHASES = [
  { id: 'briefing', label: 'Briefing', icon: FileText },
  { id: 'dataroom', label: 'Data Room', icon: Database },
  { id: 'investigation', label: 'Investigation', icon: Search },
  { id: 'evidence', label: 'Evidence Locker', icon: Lock },
  { id: 'report', label: 'Bias Report', icon: ClipboardList },
  { id: 'review', label: 'Case Review', icon: Award },
]

export default function Investigation() {
  const { caseId } = useParams()
  const navigate = useNavigate()
  const {
    activeInvestigation, startInvestigation, updatePhase,
    discoverClue, flagEvidence, updateBiasReport, submitInvestigation
  } = useInvestigation()

  const caseData = useMemo(() => CASES.find(c => c.id === caseId), [caseId])
  const [phase, setPhase] = useState('briefing')
  const [selectedClue, setSelectedClue] = useState(null)
  const [noteText, setNoteText] = useState('')
  const [biases, setBiases] = useState([])
  const [mitigations, setMitigations] = useState({})
  const [summary, setSummary] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!activeInvestigation || activeInvestigation.caseId !== caseId) {
      startInvestigation(caseId)
    }
  }, [caseId])

  useEffect(() => {
    if (activeInvestigation) {
      setPhase(activeInvestigation.currentPhase || 'briefing')
      setBiases(activeInvestigation.biasReport?.identifiedBiases || [])
      const mits = activeInvestigation.biasReport?.mitigations || []
      setMitigations(mits.reduce((acc, m, i) => ({ ...acc, [i]: m }), {}))
      setSummary(activeInvestigation.biasReport?.summary || '')
      if (activeInvestigation.status === 'submitted') setSubmitted(true)
    }
  }, [activeInvestigation])

  if (!caseData) return <div className="text-text-secondary">Case not found.</div>

  const discoveredClues = activeInvestigation?.discoveredClues || []
  const flaggedEvidence = activeInvestigation?.flaggedEvidence || []
  const evidenceNotes = activeInvestigation?.evidenceNotes || {}

  const goToPhase = (p) => { setPhase(p); updatePhase(p) }

  const handleDiscoverClue = (clueId) => {
    discoverClue(clueId)
    setSelectedClue(caseData.clues.find(c => c.id === clueId))
  }

  const handleFlagEvidence = (evidenceId) => {
    flagEvidence(evidenceId, noteText)
    setNoteText('')
  }

  const saveBiasReport = (newBiases, newMits, newSummary) => {
    updateBiasReport({
      identifiedBiases: newBiases,
      mitigations: Object.values(newMits),
      summary: newSummary,
    })
  }

  const handleToggleBias = (biasId) => {
    const next = biases.includes(biasId) ? biases.filter(b => b !== biasId) : [...biases, biasId]
    setBiases(next)
    saveBiasReport(next, mitigations, summary)
  }

  const handleMitigationChange = (idx, text) => {
    const next = { ...mitigations, [idx]: text }
    setMitigations(next)
    saveBiasReport(biases, next, summary)
  }

  const handleSummaryChange = (s) => {
    setSummary(s)
    saveBiasReport(biases, mitigations, s)
  }

  const handleSubmit = () => {
    const score = calculateScore({
      ...activeInvestigation,
      biasReport: { identifiedBiases: biases, mitigations: Object.values(mitigations), summary },
    })
    submitInvestigation(score)
    setSubmitted(true)
    goToPhase('review')
  }

  const currentPhaseIdx = PHASES.findIndex(p => p.id === phase)

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/cases')} className="text-text-dim hover:text-text-secondary transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl text-text-primary">{caseData.title}</h1>
          <p className="text-xs font-[family-name:var(--font-mono)] text-text-dim">{caseData.subtitle}</p>
        </div>
        <div className="ml-auto text-xs font-[family-name:var(--font-mono)] text-text-dim">
          Clues: <span className="text-clue-gold">{discoveredClues.length}</span>/{caseData.totalClues}
        </div>
      </div>

      {/* Phase tabs */}
      <div className="flex gap-1 mb-8 overflow-x-auto pb-2">
        {PHASES.map((p, i) => {
          const isActive = phase === p.id
          const isPast = i < currentPhaseIdx
          return (
            <button key={p.id} onClick={() => goToPhase(p.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                isActive ? 'bg-clue-gold/10 text-clue-gold border border-clue-gold/30'
                : isPast ? 'bg-case-dark text-text-secondary border border-case-border hover:border-clue-gold/20'
                : 'bg-case-dark/50 text-text-dim border border-case-border/50 hover:border-case-border'
              }`}
            >
              <p.icon className="w-3.5 h-3.5" />
              {p.label}
              {isPast && <CheckCircle className="w-3 h-3 text-mitigate-green" />}
            </button>
          )
        })}
      </div>

      {/* Phase content */}
      <div className="animate-fade-in" key={phase}>
        {phase === 'briefing' && <BriefingPhase caseData={caseData} onContinue={() => goToPhase('dataroom')} />}
        {phase === 'dataroom' && <DataRoomPhase caseData={caseData} onContinue={() => goToPhase('investigation')} />}
        {phase === 'investigation' && (
          <InvestigationPhase caseData={caseData} discoveredClues={discoveredClues}
            onDiscoverClue={handleDiscoverClue} selectedClue={selectedClue}
            setSelectedClue={setSelectedClue} onContinue={() => goToPhase('evidence')} />
        )}
        {phase === 'evidence' && (
          <EvidencePhase caseData={caseData} discoveredClues={discoveredClues}
            flaggedEvidence={flaggedEvidence} evidenceNotes={evidenceNotes}
            noteText={noteText} setNoteText={setNoteText}
            onFlag={handleFlagEvidence} onContinue={() => goToPhase('report')} />
        )}
        {phase === 'report' && (
          <ReportPhase caseData={caseData} biases={biases} onToggleBias={handleToggleBias}
            mitigations={mitigations} onMitigationChange={handleMitigationChange}
            summary={summary} setSummary={handleSummaryChange}
            onSubmit={handleSubmit} submitted={submitted} />
        )}
        {phase === 'review' && <ReviewPhase caseData={caseData} investigation={activeInvestigation} />}
      </div>
    </div>
  )
}

/* ===== BRIEFING PHASE ===== */
function BriefingPhase({ caseData, onContinue }) {
  const sys = caseData.aiSystem
  return (
    <div className="space-y-6">
      <div className="bg-case-dark border border-case-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-bias-red rounded-full animate-pulse" />
          <span className="text-xs font-[family-name:var(--font-mono)] text-bias-red uppercase tracking-wider">
            Case Briefing — Classified
          </span>
        </div>
        <p className="text-text-secondary leading-relaxed mb-6">{caseData.description}</p>
        <div className="bg-case-mid border border-case-border rounded-lg p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-3">System Profile</h3>
          <div className="grid grid-cols-2 gap-y-3 gap-x-6">
            {Object.entries(sys).map(([key, val]) => (
              <div key={key}>
                <span className="text-[10px] font-[family-name:var(--font-mono)] text-text-dim uppercase tracking-wider">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <p className="text-sm text-text-primary mt-0.5">{val}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-clue-gold/5 border border-clue-gold/20 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-clue-gold mt-0.5 shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-clue-gold mb-1">Your Mission</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Explore the training data, identify hidden biases, document your evidence, and write a report proposing mitigations.
              The more thorough your investigation, the higher your score.
            </p>
          </div>
        </div>
      </div>

      <button onClick={onContinue}
        className="flex items-center gap-2 bg-clue-gold text-ink px-5 py-3 rounded-lg font-semibold text-sm hover:bg-clue-amber transition-colors">
        Enter Data Room <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}

/* ===== DATA ROOM PHASE ===== */
function DataRoomPhase({ caseData, onContinue }) {
  const td = caseData.trainingData
  const [openChart, setOpenChart] = useState(0)

  return (
    <div className="space-y-6">
      <div className="bg-case-dark border border-case-border rounded-xl p-6">
        <h2 className="text-sm font-semibold text-text-primary mb-1">Training Data Overview</h2>
        <p className="text-xs text-text-secondary mb-5">{td.description}</p>

        {/* Demographics charts */}
        <div className="space-y-3">
          {td.demographics.map((demo, i) => (
            <div key={i} className="bg-case-mid border border-case-border rounded-lg overflow-hidden">
              <button onClick={() => setOpenChart(openChart === i ? -1 : i)}
                className="w-full flex items-center justify-between p-4 text-left">
                <span className="text-sm text-text-primary font-medium">{demo.category}</span>
                <ChevronDown className={`w-4 h-4 text-text-dim transition-transform ${openChart === i ? 'rotate-180' : ''}`} />
              </button>
              {openChart === i && (
                <div className="px-4 pb-4">
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={demo.breakdown} layout="vertical" margin={{ left: 10, right: 20 }}>
                        <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#6b7280' }} tickFormatter={v => `${v}%`} />
                        <YAxis type="category" dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} width={120} />
                        <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: '#1a1e2a', border: '1px solid #2e3444', borderRadius: 8, fontSize: 12 }} />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                          {demo.breakdown.map((entry, j) => (
                            <Cell key={j} fill={entry.color} fillOpacity={0.8} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sample records table */}
      <div className="bg-case-dark border border-case-border rounded-xl p-6">
        <h2 className="text-sm font-semibold text-text-primary mb-4">Sample Records</h2>
        <div className="overflow-x-auto">
          <table className="w-full data-table">
            <thead>
              <tr>
                {caseData.id === 'hireright' && <>
                  <th className="text-left">Name</th><th>Score</th><th>Result</th>
                  <th>College</th><th>Grad Year</th><th>Gap</th><th>Zip</th><th>Skills</th><th>Yrs Exp</th>
                </>}
                {caseData.id === 'loanstar' && <>
                  <th className="text-left">Name</th><th>Score</th><th>Result</th>
                  <th>Income</th><th>Zip</th><th>Credit</th><th>Household</th><th>Loan Amt</th><th>Debt</th>
                </>}
                {caseData.id === 'facecheck' && <>
                  <th className="text-left">Name</th><th>Skin Tone</th><th>Gender</th>
                  <th>Age</th><th>Accuracy</th><th>False Rejects</th><th>False Matches</th>
                </>}
                {caseData.id === 'foryou' && <>
                  <th className="text-left">User</th><th>Tags</th><th>Top Recs</th>
                  <th>Engage %</th><th>Diversity</th>
                </>}
              </tr>
            </thead>
            <tbody>
              {td.sampleResumes.map(row => (
                <tr key={row.id}>
                  {caseData.id === 'hireright' && <>
                    <td className="text-left font-medium">{row.name}</td>
                    <td>{row.score}</td>
                    <td><ResultBadge result={row.result} /></td>
                    <td>{row.college}</td><td>{row.gradYear}</td>
                    <td>{row.gap ? 'Yes' : 'No'}</td><td>{row.zipCode}</td>
                    <td className="max-w-32 truncate">{row.skills}</td><td>{row.yearsExp}</td>
                  </>}
                  {caseData.id === 'loanstar' && <>
                    <td className="text-left font-medium">{row.name}</td>
                    <td>{row.score}</td>
                    <td><ResultBadge result={row.result} /></td>
                    <td>${(row.income/1000).toFixed(0)}k</td><td>{row.zipCode}</td>
                    <td>{row.creditScore}</td><td className="max-w-24 truncate">{row.householdType}</td>
                    <td>${(row.loanAmt/1000).toFixed(0)}k</td><td>${(row.existingDebt/1000).toFixed(0)}k</td>
                  </>}
                  {caseData.id === 'facecheck' && <>
                    <td className="text-left font-medium">{row.name}</td>
                    <td>{row.skinTone}</td><td>{row.gender}</td><td>{row.age}</td>
                    <td className={row.accuracy < 85 ? 'text-bias-red font-semibold' : ''}>{row.accuracy}%</td>
                    <td className={row.falseRejects > 8 ? 'text-bias-red font-semibold' : ''}>{row.falseRejects}%</td>
                    <td>{row.falseMatches}%</td>
                  </>}
                  {caseData.id === 'foryou' && <>
                    <td className="text-left font-medium">{row.user}</td>
                    <td className="max-w-28 truncate">{row.profileTags}</td>
                    <td className="max-w-40 truncate">{row.topRecommendations}</td>
                    <td>{row.engagementRate}%</td>
                    <td className={row.diversityScore < 12 ? 'text-bias-red font-semibold' : ''}>{row.diversityScore}</td>
                  </>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feature weights */}
      <div className="bg-case-dark border border-case-border rounded-xl p-6">
        <h2 className="text-sm font-semibold text-text-primary mb-4">Feature Weights</h2>
        <p className="text-xs text-text-secondary mb-4">How much influence does each factor have on the AI's decision?</p>
        <div className="space-y-2">
          {td.featureWeights.map(fw => (
            <div key={fw.feature} className="flex items-center gap-3">
              <span className="text-xs text-text-secondary w-52 shrink-0 truncate">{fw.feature}</span>
              <div className="flex-1 h-5 bg-case-mid rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${fw.suspicious ? 'bg-clue-amber/70' : 'bg-info-blue/50'}`}
                  style={{ width: `${fw.weight * 100}%` }} />
              </div>
              <span className="text-xs font-[family-name:var(--font-mono)] text-text-dim w-10 text-right">
                {(fw.weight * 100).toFixed(0)}%
              </span>
              {fw.suspicious && <AlertTriangle className="w-3.5 h-3.5 text-clue-amber shrink-0" />}
            </div>
          ))}
        </div>
        <p className="text-[10px] text-clue-amber mt-3 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" /> Items marked may warrant closer investigation
        </p>
      </div>

      {/* Approval rates */}
      <div className="bg-case-dark border border-case-border rounded-xl p-6">
        <h2 className="text-sm font-semibold text-text-primary mb-4">Approval / Accuracy Rates by Group</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={td.approvalRates} layout="vertical" margin={{ left: 20, right: 20 }}>
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#6b7280' }} tickFormatter={v => `${v}%`} />
              <YAxis type="category" dataKey="group" tick={{ fontSize: 10, fill: '#9ca3af' }} width={200} />
              <Tooltip formatter={(v) => `${v}%`}
                contentStyle={{ background: '#1a1e2a', border: '1px solid #2e3444', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="rate" radius={[0, 4, 4, 0]}>
                {td.approvalRates.map((entry, i) => (
                  <Cell key={i} fill={entry.rate < 25 ? '#e84545' : entry.rate < 40 ? '#f5a623' : '#60a5fa'} fillOpacity={0.7} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <button onClick={onContinue}
        className="flex items-center gap-2 bg-clue-gold text-ink px-5 py-3 rounded-lg font-semibold text-sm hover:bg-clue-amber transition-colors">
        Begin Investigation <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}

/* ===== INVESTIGATION PHASE ===== */
function InvestigationPhase({ caseData, discoveredClues, onDiscoverClue, selectedClue, setSelectedClue, onContinue }) {
  return (
    <div className="space-y-6">
      <div className="bg-case-dark border border-case-border rounded-xl p-6">
        <h2 className="text-sm font-semibold text-text-primary mb-1">Investigation Board</h2>
        <p className="text-xs text-text-secondary mb-5">
          Click on each area to investigate. Look for patterns, disparities, and suspicious features.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {caseData.clues.map(clue => {
            const isDiscovered = discoveredClues.includes(clue.id)
            return (
              <button key={clue.id}
                onClick={() => onDiscoverClue(clue.id)}
                className={`clue-item text-left p-4 rounded-lg border transition-all ${
                  isDiscovered
                    ? 'border-clue-gold/50 bg-clue-gold/5'
                    : 'border-case-border bg-case-mid hover:border-clue-gold/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-wider text-text-dim">
                    {clue.category}
                  </span>
                  {isDiscovered ? (
                    <span className="text-[10px] font-[family-name:var(--font-mono)] text-clue-gold uppercase tracking-wider flex items-center gap-1">
                      <Eye className="w-3 h-3" /> Discovered
                    </span>
                  ) : (
                    <span className="text-[10px] font-[family-name:var(--font-mono)] text-text-dim uppercase tracking-wider">
                      +{clue.points} pts
                    </span>
                  )}
                </div>
                <h4 className={`text-sm font-medium mb-1 ${isDiscovered ? 'text-clue-gold' : 'text-text-primary'}`}>
                  {isDiscovered ? clue.title : '🔍 Click to Investigate'}
                </h4>
                {isDiscovered && (
                  <p className="text-xs text-text-secondary leading-relaxed mt-2">{clue.description}</p>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Clue detail modal */}
      {selectedClue && (
        <div className="bg-clue-gold/5 border border-clue-gold/30 rounded-xl p-5 animate-slide-in">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-clue-gold" />
              <h3 className="text-sm font-semibold text-clue-gold">Clue Discovered!</h3>
            </div>
            <button onClick={() => setSelectedClue(null)} className="text-text-dim hover:text-text-secondary">
              <X className="w-4 h-4" />
            </button>
          </div>
          <h4 className="text-text-primary font-medium mb-2">{selectedClue.title}</h4>
          <p className="text-sm text-text-secondary leading-relaxed mb-3">{selectedClue.description}</p>
          <div className="bg-case-dark border border-case-border rounded-lg p-3">
            <span className="text-[10px] font-[family-name:var(--font-mono)] text-text-dim uppercase tracking-wider">Evidence</span>
            <p className="text-xs text-text-secondary mt-1">{selectedClue.evidence}</p>
          </div>
          <div className="flex items-center gap-4 mt-3">
            <span className="text-[10px] font-[family-name:var(--font-mono)] text-text-dim">
              Type: <span className="text-clue-amber">{selectedClue.biasType}</span>
            </span>
            <span className="text-[10px] font-[family-name:var(--font-mono)] text-text-dim">
              Severity: <span className={selectedClue.severity === 'high' ? 'text-bias-red' : 'text-clue-amber'}>
                {selectedClue.severity.toUpperCase()}
              </span>
            </span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-xs text-text-dim">
          {discoveredClues.length}/{caseData.totalClues} clues discovered
        </p>
        <button onClick={onContinue}
          className="flex items-center gap-2 bg-clue-gold text-ink px-5 py-3 rounded-lg font-semibold text-sm hover:bg-clue-amber transition-colors">
          Go to Evidence Locker <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

/* ===== EVIDENCE PHASE ===== */
function EvidencePhase({ caseData, discoveredClues, flaggedEvidence, evidenceNotes, noteText, setNoteText, onFlag, onContinue }) {
  const [activeClueId, setActiveClueId] = useState(null)
  const discovered = caseData.clues.filter(c => discoveredClues.includes(c.id))

  return (
    <div className="space-y-6">
      <div className="bg-case-dark border border-case-border rounded-xl p-6">
        <h2 className="text-sm font-semibold text-text-primary mb-1">Evidence Locker</h2>
        <p className="text-xs text-text-secondary mb-5">
          Review your discovered clues. Add notes explaining the significance of each piece of evidence.
        </p>

        {discovered.length === 0 ? (
          <p className="text-sm text-text-dim py-8 text-center">
            No clues discovered yet. Go back to the Investigation phase to find evidence.
          </p>
        ) : (
          <div className="space-y-3">
            {discovered.map(clue => {
              const isFlagged = flaggedEvidence.includes(clue.id)
              const note = evidenceNotes[clue.id] || ''
              const isActive = activeClueId === clue.id
              return (
                <div key={clue.id} className={`border rounded-lg overflow-hidden transition-all ${
                  isFlagged ? 'border-clue-gold/40 bg-clue-gold/5' : 'border-case-border bg-case-mid'
                }`}>
                  <button onClick={() => setActiveClueId(isActive ? null : clue.id)}
                    className="w-full flex items-center justify-between p-4 text-left">
                    <div className="flex items-center gap-3">
                      {isFlagged && <CheckCircle className="w-4 h-4 text-clue-gold shrink-0" />}
                      <div>
                        <h4 className="text-sm text-text-primary font-medium">{clue.title}</h4>
                        <span className="text-[10px] font-[family-name:var(--font-mono)] text-text-dim">{clue.biasType}</span>
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-text-dim transition-transform ${isActive ? 'rotate-180' : ''}`} />
                  </button>
                  {isActive && (
                    <div className="px-4 pb-4 space-y-3">
                      <p className="text-xs text-text-secondary">{clue.evidence}</p>
                      {note && (
                        <div className="bg-case-dark border border-case-border rounded p-3">
                          <span className="text-[10px] font-[family-name:var(--font-mono)] text-text-dim">Your Note:</span>
                          <p className="text-xs text-text-secondary mt-1">{note}</p>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <input type="text" value={activeClueId === clue.id ? noteText : ''}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="Add your analysis note..."
                          className="flex-1 bg-case-dark border border-case-border rounded-lg px-3 py-2 text-xs text-text-primary placeholder:text-text-dim focus:outline-none focus:border-clue-gold/40" />
                        <button onClick={() => onFlag(clue.id)}
                          className="bg-clue-gold/10 border border-clue-gold/30 text-clue-gold px-3 py-2 rounded-lg text-xs font-medium hover:bg-clue-gold/20 transition-colors">
                          {isFlagged ? 'Update' : 'Flag'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-text-dim">
          {flaggedEvidence.length} pieces of evidence flagged
        </p>
        <button onClick={onContinue}
          className="flex items-center gap-2 bg-clue-gold text-ink px-5 py-3 rounded-lg font-semibold text-sm hover:bg-clue-amber transition-colors">
          Write Bias Report <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

/* ===== REPORT PHASE ===== */
function ReportPhase({ caseData, biases, onToggleBias, mitigations, onMitigationChange, summary, setSummary, onSubmit, submitted }) {
  return (
    <div className="space-y-6">
      <div className="bg-case-dark border border-case-border rounded-xl p-6">
        <h2 className="text-sm font-semibold text-text-primary mb-1">Bias Report</h2>
        <p className="text-xs text-text-secondary mb-5">
          Identify which biases you found and propose mitigations for each.
        </p>

        {/* Bias checklist */}
        <h3 className="text-xs font-[family-name:var(--font-mono)] text-text-dim uppercase tracking-wider mb-3">
          Identified Biases
        </h3>
        <div className="space-y-2 mb-6">
          {caseData.biasesToFind.map(bias => {
            const checked = biases.includes(bias.id)
            return (
              <button key={bias.id} onClick={() => !submitted && onToggleBias(bias.id)}
                disabled={submitted}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  checked ? 'border-bias-red/40 bg-bias-red/5' : 'border-case-border bg-case-mid hover:border-case-border'
                } ${submitted ? 'opacity-70 cursor-default' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${
                    checked ? 'border-bias-red bg-bias-red' : 'border-case-border'
                  }`}>
                    {checked && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>
                  <div>
                    <h4 className="text-sm text-text-primary font-medium">{bias.name}</h4>
                    <p className="text-xs text-text-secondary">{bias.description}</p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Mitigations */}
        <h3 className="text-xs font-[family-name:var(--font-mono)] text-text-dim uppercase tracking-wider mb-3">
          Proposed Mitigations
        </h3>
        <p className="text-xs text-text-secondary mb-3">
          For each bias you identified, propose a specific, actionable fix.
        </p>
        <div className="space-y-3 mb-6">
          {biases.map((biasId, idx) => {
            const bias = caseData.biasesToFind.find(b => b.id === biasId)
            if (!bias) return null
            return (
              <div key={biasId} className="bg-case-mid border border-case-border rounded-lg p-3">
                <label className="text-xs text-bias-red font-medium block mb-2">
                  Mitigation for: {bias.name}
                </label>
                <textarea value={mitigations[idx] || ''} onChange={(e) => onMitigationChange(idx, e.target.value)}
                  disabled={submitted}
                  placeholder="Describe a specific, actionable mitigation strategy..."
                  rows={3}
                  className="w-full bg-case-dark border border-case-border rounded-lg px-3 py-2 text-xs text-text-primary placeholder:text-text-dim focus:outline-none focus:border-clue-gold/40 resize-none" />
              </div>
            )
          })}
          {biases.length === 0 && (
            <p className="text-xs text-text-dim py-4 text-center">Select biases above to write mitigations.</p>
          )}
        </div>

        {/* Summary */}
        <h3 className="text-xs font-[family-name:var(--font-mono)] text-text-dim uppercase tracking-wider mb-3">
          Executive Summary
        </h3>
        <textarea value={summary} onChange={(e) => setSummary(e.target.value)}
          disabled={submitted}
          placeholder="Write a brief summary of your overall findings and recommendations..."
          rows={4}
          className="w-full bg-case-mid border border-case-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-dim focus:outline-none focus:border-clue-gold/40 resize-none mb-4" />
      </div>

      {!submitted ? (
        <button onClick={onSubmit}
          className="flex items-center gap-2 bg-bias-red text-white px-5 py-3 rounded-lg font-semibold text-sm hover:bg-red-500 transition-colors">
          <Lock className="w-4 h-4" />
          Submit Investigation
        </button>
      ) : (
        <div className="text-sm text-mitigate-green flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> Investigation submitted. View your results in Case Review.
        </div>
      )}
    </div>
  )
}

/* ===== REVIEW PHASE ===== */
function ReviewPhase({ caseData, investigation }) {
  const score = investigation?.score
  if (!score) return (
    <div className="bg-case-dark border border-case-border rounded-xl p-8 text-center">
      <p className="text-text-secondary">Submit your investigation to see your results.</p>
    </div>
  )

  const categories = [
    { label: 'Clues Found', value: score.cluesFound, max: 40, color: '#d4a853' },
    { label: 'Bias Identification', value: score.biasIdentification, max: 25, color: '#e84545' },
    { label: 'Evidence Quality', value: score.evidenceQuality, max: 15, color: '#60a5fa' },
    { label: 'Mitigations', value: score.mitigations, max: 20, color: '#34d399' },
  ]

  return (
    <div className="space-y-6">
      {/* Score summary */}
      <div className="bg-case-dark border border-case-border rounded-xl p-6 text-center">
        <div className="inline-block mb-4">
          <div className="stamp text-clue-gold text-lg animate-stamp">Case Closed</div>
        </div>
        <div className="text-5xl font-[family-name:var(--font-display)] text-text-primary mb-1">
          {score.total}<span className="text-2xl text-text-dim">/100</span>
        </div>
        <p className="text-xs font-[family-name:var(--font-mono)] text-clue-gold uppercase tracking-wider">
          +{score.xpEarned} XP Earned
        </p>
      </div>

      {/* Category breakdown */}
      <div className="bg-case-dark border border-case-border rounded-xl p-6">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Score Breakdown</h3>
        <div className="space-y-4">
          {categories.map(cat => (
            <div key={cat.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-text-secondary">{cat.label}</span>
                <span className="text-xs font-[family-name:var(--font-mono)] text-text-dim">{cat.value}/{cat.max}</span>
              </div>
              <div className="h-2 bg-case-mid rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${(cat.value / cat.max) * 100}%`, backgroundColor: cat.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Missed clues */}
      {investigation.discoveredClues?.length < caseData.totalClues && (
        <div className="bg-case-dark border border-case-border rounded-xl p-6">
          <h3 className="text-sm font-semibold text-text-primary mb-3">Clues You Missed</h3>
          <div className="space-y-2">
            {caseData.clues
              .filter(c => !investigation.discoveredClues?.includes(c.id))
              .map(clue => (
                <div key={clue.id} className="bg-case-mid border border-case-border rounded-lg p-3">
                  <h4 className="text-sm text-clue-amber font-medium">{clue.title}</h4>
                  <p className="text-xs text-text-secondary mt-1">{clue.description}</p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ===== HELPERS ===== */
function ResultBadge({ result }) {
  const isApproved = result === 'ACCEPTED' || result === 'APPROVED'
  return (
    <span className={`text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-wider px-2 py-0.5 rounded-full ${
      isApproved ? 'bg-mitigate-green/10 text-mitigate-green' : 'bg-bias-red/10 text-bias-red'
    }`}>
      {result}
    </span>
  )
}
