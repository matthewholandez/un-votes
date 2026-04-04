import { createFileRoute, Link } from '@tanstack/react-router'
import { getStats } from '../lib/stats'

export const Route = createFileRoute('/')({
  loader: () => getStats(),
  component: Home,
})

function Home() {
  const stats = Route.useLoaderData()

  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: 600, marginBottom: '8px' }}>UN Votes</h1>
      <p style={{ color: '#555', fontSize: '13px', marginBottom: '32px' }}>
        United Nations voting records — General Assembly and Security Council
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        <div style={{ border: '1px solid #e0e0e0', padding: '20px' }}>
          <div style={{ fontSize: '11px', color: '#888', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            General Assembly
          </div>
          <div style={{ fontSize: '32px', fontWeight: 600, marginBottom: '4px' }}>
            {stats.ga.total.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#555', marginBottom: '12px' }}>
            roll calls · {stats.ga.yearMin}–{stats.ga.yearMax}
          </div>
          <div style={{ fontSize: '12px', color: '#555', marginBottom: '16px' }}>
            {stats.ga.important.toLocaleString()} marked as important votes
          </div>
          <Link
            to="/ga"
            style={{
              display: 'inline-block',
              fontSize: '12px',
              border: '1px solid #111',
              padding: '6px 14px',
              textDecoration: 'none',
              color: '#111',
            }}
          >
            Browse GA Votes →
          </Link>
        </div>

        <div style={{ border: '1px solid #e0e0e0', padding: '20px' }}>
          <div style={{ fontSize: '11px', color: '#888', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Security Council
          </div>
          <div style={{ fontSize: '32px', fontWeight: 600, marginBottom: '4px' }}>
            {stats.sc.total.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#555', marginBottom: '12px' }}>
            notable votes · selected records
          </div>
          <div style={{ fontSize: '12px', color: '#555', marginBottom: '4px' }}>
            {stats.sc.adopted} adopted · {stats.sc.vetoed} vetoed · {stats.sc.chapterVII} Chapter VII
          </div>
          <div style={{ height: '12px' }} />
          <Link
            to="/sc"
            style={{
              display: 'inline-block',
              fontSize: '12px',
              border: '1px solid #111',
              padding: '6px 14px',
              textDecoration: 'none',
              color: '#111',
            }}
          >
            Browse SC Votes →
          </Link>
        </div>
      </div>

      <div style={{ fontSize: '12px', color: '#888', borderTop: '1px solid #e0e0e0', paddingTop: '16px' }}>
        GA data: Erik Voeten, "Data and Analyses of Voting in the UN General Assembly" via{' '}
        <a href="https://github.com/dgrtwo/unvotes" style={{ color: '#555' }}>unvotes</a> R package ·{' '}
        1946–2019 · 193 member states
      </div>
    </div>
  )
}
