import { useState } from 'react'

import type { Resolution } from '../data/mockData'
import VoteMap from './VoteMap'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'

interface VoteTableProps {
  resolutions: Resolution[]
  type: 'GA' | 'SC'
  pagination?: {
    page: number
    pageSize: number
    totalCount: number
    totalPages: number
    onPageChange: (page: number) => void
  }
}

export default function VoteTable({
  resolutions,
  type,
  pagination,
}: VoteTableProps) {
  const [selectedRes, setSelectedRes] = useState<Resolution | null>(null)

  const vetoed = resolutions.filter((res) => res.result === 'Vetoed').length
  const adopted = resolutions.filter((res) => res.result === 'Adopted').length

  return (
    <>
      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Total Resolutions</CardDescription>
            <CardTitle>{resolutions.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Adopted</CardDescription>
            <CardTitle className="text-emerald-700">{adopted}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Vetoed</CardDescription>
            <CardTitle className="text-rose-700">{vetoed}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card className="vote-table-wrap">
        <CardHeader>
          <CardTitle>
            {type === 'GA'
              ? 'General Assembly Votes'
              : 'Security Council Votes'}
          </CardTitle>
          <CardDescription>
            Select a row to open the geographic breakdown of country-level
            votes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table className="vote-table">
            <TableHeader>
              <TableRow>
                <TableHead>Resolution</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Yes</TableHead>
                <TableHead>No</TableHead>
                <TableHead>Abstain</TableHead>
                <TableHead>Result</TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resolutions.map((res) => (
                <TableRow key={res.id}>
                  <TableCell className="font-semibold">{res.id}</TableCell>
                  <TableCell>{res.date}</TableCell>
                  <TableCell className="min-w-[260px] whitespace-normal">
                    {res.title}
                  </TableCell>
                  <TableCell className="col-yes">{res.summary.yes}</TableCell>
                  <TableCell className="col-no">{res.summary.no}</TableCell>
                  <TableCell className="col-abstain">
                    {res.summary.abstain}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        res.result === 'Adopted' ? 'success' : 'destructive'
                      }
                    >
                      {res.result}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedRes(res)}
                    >
                      View map
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {pagination && (
        <div className="pagination-wrap">
          <div className="pagination-meta">
            Showing {(pagination.page - 1) * pagination.pageSize + 1}-
            {Math.min(pagination.page * pagination.pageSize, pagination.totalCount)} of{' '}
            {pagination.totalCount}
          </div>
          <div className="pagination-controls">
            <Button
              size="sm"
              variant="outline"
              disabled={pagination.page <= 1}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
            >
              Previous
            </Button>
            <span className="pagination-page">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => pagination.onPageChange(pagination.page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {selectedRes && (
        <VoteMap
          resolution={selectedRes}
          type={type}
          onClose={() => setSelectedRes(null)}
        />
      )}
    </>
  )
}
