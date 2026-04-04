import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { querySCVotes } from '../../lib/sc-data'

const searchSchema = z.object({
  page: z.number().int().min(1).catch(1),
  search: z.string().optional(),
  yearFrom: z.number().int().optional(),
  yearTo: z.number().int().optional(),
  result: z.enum(['adopted', 'vetoed', 'not_adopted', 'all']).optional(),
})

type Search = z.infer<typeof searchSchema>

export const Route = createFileRoute('/sc/')({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) =>
    querySCVotes({
      page: deps.page,
      perPage: 50,
      search: deps.search,
      yearFrom: deps.yearFrom,
      yearTo: deps.yearTo,
      result: deps.result,
    }),
  component: SCVotes,
})

const RESULT_LABELS: Record<string, string> = {
  adopted: 'Adopted',
  vetoed: 'Vetoed',
  not_adopted: 'Not adopted',
}

const RESULT_COLORS: Record<string, string> = {
  adopted: '#2a9d2a',
  vetoed: '#d32f2f',
  not_adopted: '#e67e22',
}

function SCVotes() {
  const data = Route.useLoaderData()
  const search = Route.useSearch()
  const navigate = useNavigate({ from: '/sc/' })

  function update(patch: Partial<Search>) {
    void navigate({ search: prev => ({ ...prev, ...patch, page: 1 }) })
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Security Council</h1>
        <span style={{ fontSize: '12px', color: '#888' }}>{data.total.toLocaleString()} votes</span>
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
          placeholder="Search votes…"
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
          value={search.result ?? 'all'}
          onChange={e => update({ result: (e.target.value as Search['result']) || undefined })}
          style={{
            border: '1px solid #ccc',
            padding: '5px 10px',
            fontFamily: 'inherit',
            fontSize: '12px',
            background: '#fff',
          }}
        >
          <option value="all">All results</option>
          <option value="adopted">Adopted</option>
          <option value="vetoed">Vetoed</option>
          <option value="not_adopted">Not adopted</option>
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

        {(search.search || (search.result && search.result !== 'all') || search.yearFrom || search.yearTo) && (
          <button
            onClick={() => void navigate({ search: { page: 1 } })}
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
              <th style={{ textAlign: 'left', padding: '6px 10px', fontWeight: 600, whiteSpace: 'nowrap' }}>Y / N / A</th>
              <th style={{ textAlign: 'left', padding: '6px 10px', fontWeight: 600 }}>Result</th>
              <th style={{ textAlign: 'left', padding: '6px 10px', fontWeight: 600 }}>Vetoed by</th>
            </tr>
          </thead>
          <tbody>
            {data.votes.map((vote, i) => (
              <tr
                key={vote.id}
                style={{
                  borderBottom: '1px solid #e8e8e8',
                  background: i % 2 === 0 ? '#fff' : '#fafafa',
                }}
              >
                <td style={{ padding: '7px 10px 7px 0', whiteSpace: 'nowrap', color: '#555' }}>
                  {vote.date}
                </td>
                <td style={{ padding: '7px 10px', whiteSpace: 'nowrap', fontWeight: 500 }}>
                  {vote.resolution}
                </td>
                <td style={{ padding: '7px 10px', maxWidth: '340px' }}>
                  {vote.subject}
                  {vote.chapter_vii && (
                    <span
                      style={{
                        marginLeft: '6px',
                        fontSize: '10px',
                        border: '1px solid #888',
                        padding: '1px 4px',
                        borderRadius: '2px',
                        color: '#555',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Ch. VII
                    </span>
                  )}
                </td>
                <td style={{ padding: '7px 10px', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                  <span style={{ color: '#2a9d2a' }}>{vote.yes}</span>
                  {' / '}
                  <span style={{ color: '#d32f2f' }}>{vote.no}</span>
                  {' / '}
                  <span style={{ color: '#888' }}>{vote.abstain}</span>
                </td>
                <td style={{ padding: '7px 10px', whiteSpace: 'nowrap' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      color: RESULT_COLORS[vote.result] ?? '#555',
                      fontWeight: 500,
                    }}
                  >
                    {RESULT_LABELS[vote.result] ?? vote.result}
                  </span>
                </td>
                <td style={{ padding: '7px 10px', maxWidth: '200px', color: '#d32f2f', fontSize: '11px' }}>
                  {vote.vetoed_by.join(', ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data.totalPages > 1 && (
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
            Page {data.page} of {data.totalPages}
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
      )}
    </div>
  )
}
