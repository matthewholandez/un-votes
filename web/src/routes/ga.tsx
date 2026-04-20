import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

import VoteTable from '../components/VoteTable'
import {
  mapGARecordToResolution,
  sortGARecordsByDateDesc,
  type GAArchiveRecord,
} from '../data/gaArchive'

const PAGE_SIZE = 50

let cachedSortedGARecords: GAArchiveRecord[] | null = null

async function getSortedGARecords(): Promise<GAArchiveRecord[]> {
  if (cachedSortedGARecords) {
    return cachedSortedGARecords
  }

  const gaArchiveJson = (await import('../../../data/live/ga_archive.json'))
    .default as GAArchiveRecord[]
  cachedSortedGARecords = sortGARecordsByDateDesc(gaArchiveJson)

  return cachedSortedGARecords
}

const getGAResolutionsPage = createServerFn({ method: 'GET' })
  .inputValidator((input: { page?: number; pageSize?: number }) => input)
  .handler(async ({ data }) => {
    const page = Math.max(1, Math.floor(data?.page ?? 1))
    const pageSize = Math.max(1, Math.floor(data?.pageSize ?? PAGE_SIZE))

    const sorted = await getSortedGARecords()

    const totalCount = sorted.length
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
    const boundedPage = Math.min(page, totalPages)
    const start = (boundedPage - 1) * pageSize
    const end = start + pageSize

    return {
      page: boundedPage,
      pageSize,
      totalCount,
      totalPages,
      resolutions: sorted.slice(start, end).map(mapGARecordToResolution),
    }
  })

export const Route = createFileRoute('/ga')({
  validateSearch: (search: Record<string, unknown>) => {
    const parsed = Number(search.page)
    return {
      page: Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1,
    }
  },
  loaderDeps: ({ search }) => ({ page: search.page }),
  loader: ({ deps }) =>
    getGAResolutionsPage({ data: { page: deps.page, pageSize: PAGE_SIZE } }),
  component: GeneralAssembly,
})

function GeneralAssembly() {
  const navigate = useNavigate({ from: '/ga' })
  const data = Route.useLoaderData()

  const setPage = (page: number) => {
    navigate({
      search: (prev) => ({
        ...prev,
        page: page <= 1 ? 1 : page,
      }),
    })
  }

  return (
    <main className="page-wrap fade-in" style={{ padding: '4rem 0' }}>
      <h1 className="page-title">General Assembly</h1>
      <p className="page-description">
        Voting records for recent United Nations General Assembly resolutions.
        Select a resolution to view the detailed country-by-country voting map.
      </p>

      <VoteTable
        type="GA"
        resolutions={data.resolutions}
        pagination={{
          page: data.page,
          pageSize: data.pageSize,
          totalCount: data.totalCount,
          totalPages: data.totalPages,
          onPageChange: setPage,
        }}
      />
    </main>
  )
}
