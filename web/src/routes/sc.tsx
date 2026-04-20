import { createFileRoute } from '@tanstack/react-router'
import VoteTable from '../components/VoteTable'
import { scMockData } from '../data/mockData'

export const Route = createFileRoute('/sc')({
  component: SecurityCouncil,
})

function SecurityCouncil() {
  return (
    <main className="page-wrap fade-in" style={{ padding: '4rem 0' }}>
      <h1 className="page-title">Security Council</h1>
      <p className="page-description">
        Voting records for United Nations Security Council resolutions, including highlights for vetoes.
        Select a resolution to view the voting map.
      </p>

      <VoteTable type="SC" resolutions={scMockData} />
    </main>
  )
}
