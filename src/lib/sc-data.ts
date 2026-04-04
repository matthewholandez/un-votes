import scVotesRaw from '../data/sc_votes.json'

export interface SCVote {
  id: number
  date: string
  resolution: string
  subject: string
  yes: number
  no: number
  abstain: number
  result: 'adopted' | 'vetoed' | 'not_adopted'
  vetoed_by: string[]
  chapter_vii: boolean
}

export const scVotes = scVotesRaw as SCVote[]

export interface SCVotesParams {
  page: number
  perPage: number
  search?: string
  yearFrom?: number
  yearTo?: number
  result?: 'adopted' | 'vetoed' | 'not_adopted' | 'all'
}

export interface SCVotesResult {
  votes: SCVote[]
  total: number
  page: number
  perPage: number
  totalPages: number
  yearMin: number
  yearMax: number
}

function getYear(date: string): number {
  return parseInt(date.split('-')[0] ?? '1946', 10)
}

let _yearMin = 9999
let _yearMax = 0
for (const v of scVotes) {
  const y = getYear(v.date)
  if (y < _yearMin) _yearMin = y
  if (y > _yearMax) _yearMax = y
}
export const yearMin = _yearMin
export const yearMax = _yearMax

export function querySCVotes(params: SCVotesParams): SCVotesResult {
  const { page, perPage, search, yearFrom, yearTo, result } = params

  let filtered = scVotes

  if (result && result !== 'all') {
    filtered = filtered.filter(v => v.result === result)
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
        v.subject.toLowerCase().includes(q) ||
        v.resolution.toLowerCase().includes(q),
    )
  }

  // Sort by date descending
  filtered = [...filtered].sort((a, b) => b.date.localeCompare(a.date))

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
    yearMin: _yearMin,
    yearMax: _yearMax,
  }
}

