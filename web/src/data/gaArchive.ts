import type { Resolution, VoteType } from './mockData'

export interface MemberStateVote {
  ms_code: string
  ms_name: string
}

export interface GAArchiveRecord {
  undl_id: number
  date: string
  session: string | number
  resolution: string
  title: string
  subjects: string
  yes_votes: MemberStateVote[]
  no_votes: MemberStateVote[]
  abstain_votes: MemberStateVote[]
}

function normalizeCountryKey(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]+/g, ' ').trim()
}

function applyVotes(
  votes: Record<string, VoteType>,
  members: MemberStateVote[],
  type: VoteType,
) {
  members.forEach((member) => {
    if (member.ms_code) {
      votes[member.ms_code.toUpperCase()] = type
    }
    if (member.ms_name) {
      votes[normalizeCountryKey(member.ms_name)] = type
    }
  })
}

export function createVoteMap(record: GAArchiveRecord): Record<string, VoteType> {
  const votes: Record<string, VoteType> = {}

  applyVotes(votes, record.yes_votes, 'yes')
  applyVotes(votes, record.no_votes, 'no')
  applyVotes(votes, record.abstain_votes, 'abstain')

  return votes
}

export function mapGARecordToResolution(record: GAArchiveRecord): Resolution {
  const yes = record.yes_votes.length
  const no = record.no_votes.length
  const abstain = record.abstain_votes.length

  return {
    id: record.resolution,
    date: record.date,
    session: String(record.session),
    subjects: record.subjects,
    title: record.title,
    result: yes > no ? 'Adopted' : 'Rejected',
    summary: { yes, no, abstain },
    votes: createVoteMap(record),
  }
}

export function sortGARecordsByDateDesc(
  records: GAArchiveRecord[],
): GAArchiveRecord[] {
  return [...records].sort((a, b) => {
    const dateCompare = b.date.localeCompare(a.date)
    if (dateCompare !== 0) {
      return dateCompare
    }

    const resolutionCompare = b.resolution.localeCompare(a.resolution)
    if (resolutionCompare !== 0) {
      return resolutionCompare
    }

    return b.undl_id - a.undl_id
  })
}
