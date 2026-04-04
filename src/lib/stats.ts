import gaVotesRaw from '../data/ga_votes.json'
import scVotesRaw from '../data/sc_votes.json'

const gaVotes = gaVotesRaw as Array<{ yes: number; no: number; abstain: number; total: number; date: string; important: boolean; issues: string[] }>
const scVotes = scVotesRaw as Array<{ result: string; chapter_vii: boolean }>

export function getStats() {
  const gaTotal = gaVotes.length
  const scTotal = scVotes.length
  const gaImportant = gaVotes.filter(v => v.important).length
  const gaYearMin = gaVotes.reduce((m, v) => Math.min(m, parseInt(v.date.split('-')[0] ?? '1946')), 9999)
  const gaYearMax = gaVotes.reduce((m, v) => Math.max(m, parseInt(v.date.split('-')[0] ?? '1946')), 0)
  const scAdopted = scVotes.filter(v => v.result === 'adopted').length
  const scVetoed = scVotes.filter(v => v.result === 'vetoed').length
  const scChapterVII = scVotes.filter(v => v.chapter_vii).length

  return {
    ga: { total: gaTotal, important: gaImportant, yearMin: gaYearMin, yearMax: gaYearMax },
    sc: { total: scTotal, adopted: scAdopted, vetoed: scVetoed, chapterVII: scChapterVII },
  }
}

