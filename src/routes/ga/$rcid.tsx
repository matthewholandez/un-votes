import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { getGAVote } from '../../lib/ga-data'

export const Route = createFileRoute('/ga/$rcid')({
  loader: async ({ params }) => {
    const rcid = parseInt(params.rcid, 10)
    if (isNaN(rcid)) throw notFound()
    const vote = getGAVote(rcid)
    if (!vote) throw notFound()
    return vote
  },
  component: GAVoteDetail,
})

function GAVoteDetail() {
  const vote = Route.useLoaderData()
  const total = vote.yes + vote.no + vote.abstain

  return (
    <div>
      <div style={{ marginBottom: '16px', fontSize: '12px' }}>
        <Link to="/ga" style={{ color: '#555', textDecoration: 'none' }}>
          ← General Assembly
        </Link>
      </div>

      <h1 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>{vote.resolution}</h1>
      <div style={{ fontSize: '13px', color: '#555', marginBottom: '20px' }}>{vote.date} · Session {vote.session}</div>

      <h2 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>{vote.short}</h2>

      {vote.description && (
        <p style={{ fontSize: '12px', color: '#444', lineHeight: '1.6', marginBottom: '24px', maxWidth: '700px' }}>
          {vote.description}
        </p>
      )}

      {vote.issues.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
            Issues
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {vote.issues.map(issue => (
              <Link
                key={issue}
                to="/ga"
                search={{ page: 1, issue }}
                style={{
                  fontSize: '11px',
                  border: '1px solid #ccc',
                  padding: '3px 8px',
                  textDecoration: 'none',
                  color: '#555',
                }}
              >
                {issue}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
          Vote Result
        </div>
        <div style={{ display: 'flex', gap: '24px', marginBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '28px', fontWeight: 600, color: '#2a9d2a' }}>{vote.yes}</div>
            <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase' }}>Yes</div>
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: 600, color: '#d32f2f' }}>{vote.no}</div>
            <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase' }}>No</div>
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: 600, color: '#888' }}>{vote.abstain}</div>
            <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase' }}>Abstain</div>
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: 600 }}>{total}</div>
            <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase' }}>Total</div>
          </div>
        </div>

        {total > 0 && (
          <div style={{ display: 'flex', height: '10px', width: '300px', overflow: 'hidden', borderRadius: '2px' }}>
            <div style={{ width: `${(vote.yes / total) * 100}%`, background: '#2a9d2a' }} />
            <div style={{ width: `${(vote.no / total) * 100}%`, background: '#d32f2f' }} />
            <div style={{ width: `${(vote.abstain / total) * 100}%`, background: '#ccc' }} />
          </div>
        )}
      </div>

      {vote.important && (
        <div
          style={{
            fontSize: '12px',
            border: '1px solid #111',
            padding: '8px 14px',
            display: 'inline-block',
          }}
        >
          ★ Marked as an important vote
        </div>
      )}
    </div>
  )
}
