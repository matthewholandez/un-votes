import gaVotesRaw from '../data/ga_votes.json'

export interface GAVote {
  rcid: number
  session: number
  date: string
  resolution: string
  important: boolean
  short: string
  description: string
  yes: number
  no: number
  abstain: number
  total: number
  issues: string[]
}

export const gaVotes = gaVotesRaw as GAVote[]

export interface GAVotesParams {
  page: number
  perPage: number
  search?: string
  issue?: string
  yearFrom?: number
  yearTo?: number
  importantOnly?: boolean
}

export interface GAVotesResult {
  votes: GAVote[]
  total: number
  page: number
  perPage: number
  totalPages: number
  allIssues: string[]
  yearMin: number
  yearMax: number
}

function getYear(date: string): number {
  return parseInt(date.split('-')[0] ?? '1946', 10)
}

// Compute metadata once
const allIssuesSet = new Set<string>()
let _yearMin = 9999
let _yearMax = 0
for (const v of gaVotes) {
  for (const issue of v.issues) allIssuesSet.add(issue)
  const y = getYear(v.date)
  if (y < _yearMin) _yearMin = y
  if (y > _yearMax) _yearMax = y
}
export const allIssues = Array.from(allIssuesSet).sort()
export const yearMin = _yearMin
export const yearMax = _yearMax

export function queryGAVotes(params: GAVotesParams): GAVotesResult {
  const { page, perPage, search, issue, yearFrom, yearTo, importantOnly } = params

  let filtered = gaVotes

  if (importantOnly) {
    filtered = filtered.filter(v => v.important)
  }

  if (issue) {
    filtered = filtered.filter(v => v.issues.includes(issue))
  }

  if (yearFrom !== undefined) {
    filtered = filtered.filter(v => getYear(v.date) >= yearFrom)
  }

  if (yearTo !== undefined) {
    filtered = filtered.filter(v => getYear(v.date) <= yearTo)
  }

  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(
      v =>
        v.short.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q) ||
        v.resolution.toLowerCase().includes(q),
    )
  }

  const total = filtered.length
  const totalPages = Math.ceil(total / perPage)
  const start = (page - 1) * perPage
  const votes = filtered.slice(start, start + perPage)

  return {
    votes,
    total,
    page,
    perPage,
    totalPages,
    allIssues,
    yearMin: _yearMin,
    yearMax: _yearMax,
  }
}

export function getGAVote(rcid: number): GAVote | null {
  return gaVotes.find(v => v.rcid === rcid) ?? null
}

