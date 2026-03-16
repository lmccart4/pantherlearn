import { CASES, RANKS } from '../data/cases'

export function calculateScore(investigation) {
  const caseData = CASES.find(c => c.id === investigation.caseId)
  if (!caseData) return { cluesFound: 0, biasId: 0, evidenceQuality: 0, mitigations: 0, total: 0, percentage: 0 }

  // Clues found (0-40 points)
  const totalCluePoints = caseData.clues.reduce((sum, c) => sum + c.points, 0)
  const foundCluePoints = (investigation.discoveredClues || []).reduce((sum, clueId) => {
    const clue = caseData.clues.find(c => c.id === clueId)
    return sum + (clue ? clue.points : 0)
  }, 0)
  const cluesScore = Math.round((foundCluePoints / totalCluePoints) * 40)

  // Bias identification (0-25 points)
  const identifiedBiases = investigation.biasReport?.identifiedBiases || []
  const biasScore = Math.round((identifiedBiases.length / caseData.biasesToFind.length) * 25)

  // Evidence quality (0-15 points) — based on notes written
  const notes = investigation.evidenceNotes || {}
  const notesWithContent = Object.values(notes).filter(n => n && n.length > 20).length
  const evidenceScore = Math.min(15, Math.round((notesWithContent / Math.max(1, caseData.clues.length)) * 15))

  // Mitigations (0-20 points)
  const mitigations = investigation.biasReport?.mitigations || []
  const mitigationsWithContent = mitigations.filter(m => m && m.length > 30).length
  const mitigationScore = Math.round((mitigationsWithContent / caseData.biasesToFind.length) * 20)

  const total = cluesScore + biasScore + evidenceScore + mitigationScore
  
  return {
    cluesFound: cluesScore,
    biasIdentification: biasScore,
    evidenceQuality: evidenceScore,
    mitigations: mitigationScore,
    total,
    percentage: total,
    xpEarned: total,
  }
}

export function getRank(totalXP) {
  let currentRank = RANKS[0]
  for (const rank of RANKS) {
    if (totalXP >= rank.minXP) currentRank = rank
  }
  return currentRank
}

export function getNextRank(totalXP) {
  for (const rank of RANKS) {
    if (totalXP < rank.minXP) return rank
  }
  return null
}

export function generateClassCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}
