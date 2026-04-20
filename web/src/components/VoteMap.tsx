import { useEffect, useMemo, useState } from 'react'

import { geoMercator, geoPath } from 'd3-geo'
import * as topojson from 'topojson-client'
import countriesData from 'world-atlas/countries-110m.json'

import type { Resolution, VoteType } from '../data/mockData'
import { Badge } from './ui/badge'
import { Button } from './ui/button'

interface VoteMapProps {
  resolution: Resolution
  type: 'GA' | 'SC'
  onClose: () => void
}

const VOTE_COLORS: Record<VoteType, string> = {
  yes: '#16a34a',
  no: '#dc2626',
  abstain: '#ca8a04',
  'not-voting': '#e5e5e5',
}

const COUNTRY_NAME_ALIASES: Record<string, string> = {
  'UNITED STATES OF AMERICA': 'UNITED STATES',
  'DEMOCRATIC REPUBLIC OF THE CONGO': 'ZAIRE',
  'REPUBLIC OF THE CONGO': 'CONGO',
  CZECHIA: 'CZECHOSLOVAKIA',
  ESWATINI: 'SWAZILAND',
  'NORTH MACEDONIA': 'YUGOSLAVIA',
  TANZANIA: 'UNITED REPUBLIC OF TANZANIA',
  LAOS: "LAO PEOPLE'S DEMOCRATIC REPUBLIC",
  BOLIVIA: 'BOLIVIA',
  RUSSIA: 'USSR',
  VIETNAM: 'VIET NAM',
  SYRIA: 'SYRIAN ARAB REPUBLIC',
  VENEZUELA: 'VENEZUELA',
};

function normalizeCountryName(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]+/g, ' ').trim();
}

interface CountryPath {
  d: string
  id: string
  name: string
}

export default function VoteMap({ resolution, type, onClose }: VoteMapProps) {
  const [tooltip, setTooltip] = useState<{
    x: number
    y: number
    text: string
  } | null>(null)

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  const bodyName = type === 'GA' ? 'General Assembly' : 'Security Council'

  return (
    <div className="map-overlay" onClick={onClose}>
      <div className="map-panel" onClick={(e) => e.stopPropagation()}>
        <div className="map-panel-header">
          <div>
            <div className="map-panel-title">
              {resolution.id} - {resolution.result}
            </div>
            <div className="map-panel-subtitle">{resolution.title}</div>
            <div className="mt-2 text-xs text-muted-foreground">{bodyName}</div>
          </div>
          <Button
            className="map-close"
            variant="outline"
            size="sm"
            onClick={onClose}
          >
            Close
          </Button>
        </div>

        {resolution.result === 'Vetoed' && (
          <div className="map-veto-banner">
            This resolution was vetoed by one or more permanent members of the
            Security Council.
          </div>
        )}

        <div
          className="map-svg-wrap"
          style={{ position: 'relative', minHeight: '400px' }}
        >
          <MapPaths resolution={resolution} setTooltip={setTooltip} />

          {tooltip && (
            <div
              className="map-tooltip"
              style={{ left: tooltip.x, top: tooltip.y }}
            >
              {tooltip.text}
            </div>
          )}
        </div>

        <div className="map-stats">
          <Badge variant="success">Yes: {resolution.summary.yes}</Badge>
          <Badge variant="destructive">No: {resolution.summary.no}</Badge>
          <Badge variant="warning">Abstain: {resolution.summary.abstain}</Badge>
        </div>

        <div className="map-legend">
          <div className="map-legend-item">
            <div
              className="map-legend-swatch"
              style={{ background: VOTE_COLORS['yes'] }}
            ></div>{' '}
            In Favour
          </div>
          <div className="map-legend-item">
            <div
              className="map-legend-swatch"
              style={{ background: VOTE_COLORS['no'] }}
            ></div>{' '}
            Against
          </div>
          <div className="map-legend-item">
            <div
              className="map-legend-swatch"
              style={{ background: VOTE_COLORS['abstain'] }}
            ></div>{' '}
            Abstaining
          </div>
          <div className="map-legend-item">
            <div
              className="map-legend-swatch"
              style={{ background: VOTE_COLORS['not-voting'] }}
            ></div>{' '}
            Not Voting / Absent
          </div>
        </div>
      </div>
    </div>
  )
}

function MapPaths({
  resolution,
  setTooltip,
}: {
  resolution: Resolution
  setTooltip: React.Dispatch<
    React.SetStateAction<{ x: number; y: number; text: string } | null>
  >
}) {
  const paths = useMemo<CountryPath[]>(() => {
    const geoData = topojson.feature(
      countriesData as never,
      (countriesData as any).objects.countries,
    ) as any

    const projection = geoMercator().scale(130).translate([450, 300])
    const pathGenerator = geoPath().projection(projection)

    return geoData.features.map((feature: any) => ({
      d: pathGenerator(feature) || '',
      id: String(feature.id).padStart(3, '0'),
      name: feature.properties?.name || 'Unknown',
    }))
  }, [])

  return (
    <svg viewBox="0 0 900 600" width="100%" height="100%">
      <g stroke="#ffffff" strokeWidth="0.5">
        {paths.map((path) => {
          const normalizedName = normalizeCountryName(path.name)
          const alias = COUNTRY_NAME_ALIASES[normalizedName]
          const vote =
            resolution.votes[path.id] ||
            resolution.votes[normalizedName] ||
            (alias ? resolution.votes[alias] : undefined) ||
            'not-voting'
          const fill = VOTE_COLORS[vote]

          return (
            <path
              key={path.id}
              d={path.d}
              fill={fill}
              onMouseMove={(e) => {
                setTooltip({
                  x: e.clientX,
                  y: e.clientY,
                  text: `${path.name}: ${vote.toUpperCase()}`,
                })
              }}
              onMouseLeave={() => setTooltip(null)}
              style={{ transition: 'fill 200ms ease' }}
            />
          )
        })}
      </g>
    </svg>
  )
}
