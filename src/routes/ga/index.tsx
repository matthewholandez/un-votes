import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { queryGAVotes } from '../../lib/ga-data'

const searchSchema = z.object({
  page: z.number().int().min(1).catch(1),
  search: z.string().optional(),
  issue: z.string().optional(),
  yearFrom: z.number().int().optional(),
  yearTo: z.number().int().optional(),
  importantOnly: z.boolean().optional(),
})

type Search = z.infer<typeof searchSchema>

export const Route = createFileRoute('/ga/')({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) =>
    queryGAVotes({
      page: deps.page,
      perPage: 50,
      search: deps.search,
      issue: deps.issue,
      yearFrom: deps.yearFrom,
      yearTo: deps.yearTo,
      importantOnly: deps.importantOnly,
    }),
  component: GAVotes,
})

function VoteBar({ yes, no, abstain, total }: { yes: number; no: number; abstain: number; total: number }) {
  if (total === 0) return <span style={{ color: '#aaa', fontSize: '12px' }}>—</span>
  const yPct = (yes / total) * 100
  const nPct = (no / total) * 100
  const aPct = (abstain / total) * 100
  return (
    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
      <div
        style={{
          display: 'flex',
          height: '6px',
          width: '60px',
          overflow: 'hidden',
          borderRadius: '2px',
          background: '#f0f0f0',
        }}
      >
        <div style={{ width: `${yPct}%`, background: '#2a9d2a' }} />
        <div style={{ width: `${nPct}%`, background: '#d32f2f' }} />
        <div style={{ width: `${aPct}%`, background: '#bbb' }} />
      </div>
      <span style={{ fontSize: '11px', color: '#555' }}>
        {yes}Y {no}N {abstain}A
      </span>
    </div>
  )
}

function GAVotes() {
  const data = Route.useLoaderData()
  const search = Route.useSearch()
  const navigate = useNavigate({ from: '/ga/' })

  function update(patch: Partial<Search>) {
    void navigate({ search: prev => ({ ...prev, ...patch, page: 1 }) })
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>General Assembly</h1>
        <span style={{ fontSize: '12px', color: '#888' }}>{data.total.toLocaleString()} roll calls</span>
      </div>

      {/* Filters */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: '16px',
          fontSize: '12px',
        }}
      >
        <input
          type="text"
          placeholder="Search resolutions…"
          defaultValue={search.search ?? ''}
          onKeyDown={e => {
            if (e.key === 'Enter') update({ search: (e.target as HTMLInputElement).value || undefined })
          }}
          onBlur={e => update({ search: e.target.value || undefined })}
          style={{
            border: '1px solid #ccc',
            padding: '5px 10px',
            fontFamily: 'inherit',
            fontSize: '12px',
            width: '220px',
          }}
        />

        <select
          value={search.issue ?? ''}
          onChange={e => update({ issue: e.target.value || undefined })}
          style={{
            border: '1px solid #ccc',
            padding: '5px 10px',
            fontFamily: 'inherit',
            fontSize: '12px',
            background: '#fff',
          }}
        >
          <option value="">All issues</option>
          {data.allIssues.map(issue => (
            <option key={issue} value={issue}>
              {issue}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="From year"
          defaultValue={search.yearFrom ?? ''}
          min={data.yearMin}
          max={data.yearMax}
          onBlur={e => update({ yearFrom: e.target.value ? parseInt(e.target.value) : undefined })}
          style={{
            border: '1px solid #ccc',
            padding: '5px 10px',
            fontFamily: 'inherit',
            fontSize: '12px',
            width: '100px',
          }}
        />

        <input
          type="number"
          placeholder="To year"
          defaultValue={search.yearTo ?? ''}
          min={data.yearMin}
          max={data.yearMax}
          onBlur={e => update({ yearTo: e.target.value ? parseInt(e.target.value) : undefined })}
          style={{
            border: '1px solid #ccc',
            padding: '5px 10px',
            fontFamily: 'inherit',
            fontSize: '12px',
            width: '100px',
          }}
        />

        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={search.importantOnly ?? false}
            onChange={e => update({ importantOnly: e.target.checked || undefined })}
          />
          Important only
        </label>

        {(search.search || search.issue || search.yearFrom || search.yearTo || search.importantOnly) && (
          <button
            onClick={() =>
              void navigate({
                search: { page: 1 },
              })
            }
            style={{
              border: '1px solid #ccc',
              background: 'none',
              padding: '5px 10px',
              fontFamily: 'inherit',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '12px',
          }}
        >
          <thead>
            <tr style={{ borderBottom: '2px solid #111' }}>
              <th style={{ textAlign: 'left', padding: '6px 10px 6px 0', fontWeight: 600, whiteSpace: 'nowrap' }}>Date</th>
              <th style={{ textAlign: 'left', padding: '6px 10px', fontWeight: 600, whiteSpace: 'nowrap' }}>Resolution</th>
              <th style={{ textAlign: 'left', padding: '6px 10px', fontWeight: 600 }}>Subject</th>
              <th style={{ textAlign: 'left', padding: '6px 10px', fontWeight: 600, whiteSpace: 'nowrap' }}>Vote</th>
              <th style={{ textAlign: 'left', padding: '6px 10px', fontWeight: 600 }}>Issues</th>
            </tr>
          </thead>
          <tbody>
            {data.votes.map((vote, i) => (
              <tr
                key={vote.rcid}
                style={{
                  borderBottom: '1px solid #e8e8e8',
                  background: i % 2 === 0 ? '#fff' : '#fafafa',
                }}
              >
                <td style={{ padding: '7px 10px 7px 0', whiteSpace: 'nowrap', color: '#555' }}>
                  {vote.date}
                </td>
                <td style={{ padding: '7px 10px', whiteSpace: 'nowrap' }}>
                  <Link
                    to="/ga/$rcid"
                    params={{ rcid: String(vote.rcid) }}
                    style={{ textDecoration: 'none', color: '#111', borderBottom: '1px solid #aaa' }}
                  >
                    {vote.resolution}
                  </Link>
                  {vote.important && (
                    <span
                      style={{
                        marginLeft: '6px',
                        fontSize: '10px',
                        background: '#111',
                        color: '#fff',
                        padding: '1px 4px',
                        borderRadius: '2px',
                      }}
                    >
                      ★
                    </span>
                  )}
                </td>
                <td style={{ padding: '7px 10px', maxWidth: '340px' }}>
                  <span title={vote.description}>{vote.short}</span>
                </td>
                <td style={{ padding: '7px 10px', whiteSpace: 'nowrap' }}>
                  <VoteBar yes={vote.yes} no={vote.no} abstain={vote.abstain} total={vote.total} />
                </td>
                <td style={{ padding: '7px 10px', color: '#666', maxWidth: '180px' }}>
                  {vote.issues.join(', ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginTop: '16px',
          fontSize: '12px',
        }}
      >
        <button
          disabled={data.page <= 1}
          onClick={() => void navigate({ search: prev => ({ ...prev, page: prev.page - 1 }) })}
          style={{
            border: '1px solid #ccc',
            background: 'none',
            padding: '5px 10px',
            fontFamily: 'inherit',
            fontSize: '12px',
            cursor: data.page <= 1 ? 'default' : 'pointer',
            opacity: data.page <= 1 ? 0.4 : 1,
          }}
        >
          ← Prev
        </button>
        <span style={{ color: '#555' }}>
          Page {data.page} of {data.totalPages} ({data.total.toLocaleString()} results)
        </span>
        <button
          disabled={data.page >= data.totalPages}
          onClick={() => void navigate({ search: prev => ({ ...prev, page: prev.page + 1 }) })}
          style={{
            border: '1px solid #ccc',
            background: 'none',
            padding: '5px 10px',
            fontFamily: 'inherit',
            fontSize: '12px',
            cursor: data.page >= data.totalPages ? 'default' : 'pointer',
            opacity: data.page >= data.totalPages ? 0.4 : 1,
          }}
        >
          Next →
        </button>
      </div>
    </div>
  )
}
