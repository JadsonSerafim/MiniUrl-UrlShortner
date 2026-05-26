import { useMemo } from 'react'

interface Segment {
  name: string
  count: number
  color?: string
}

interface DonutChartProps {
  segments: Segment[]
  size?: number
  thickness?: number
  showLegend?: boolean
  className?: string
}

const PALETTE = [
  '#6366F1', '#10B981', '#F59E0B', '#EF4444',
  '#8B5CF6', '#EC4899', '#06B6D4', '#F97316',
  '#84CC16', '#14B8A6',
]

export default function DonutChart({
  segments,
  size = 120,
  thickness = 20,
  showLegend = true,
  className = '',
}: DonutChartProps) {
  const total = useMemo(() => segments.reduce((s, seg) => s + seg.count, 0), [segments])
  const radius = (size - thickness) / 2
  const circumference = 2 * Math.PI * radius
  const center = size / 2

  const colored = useMemo(() =>
    segments
      .filter(s => s.count > 0)
      .map((seg, i) => ({
        ...seg,
        color: seg.color || PALETTE[i % PALETTE.length],
        percent: seg.count / total,
      })),
    [segments, total]
  )

  let cumulative = 0

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="animate-fade-in">
        {total === 0 && (
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="var(--color-hairline)"
            strokeWidth={thickness}
            strokeDasharray={`${circumference}`}
          />
        )}
        {colored.map((seg, i) => {
          const rotation = -90 + cumulative * 360
          cumulative += seg.percent
          return (
            <circle
              key={i}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={thickness}
              strokeLinecap="round"
              strokeDasharray={`${seg.percent * circumference} ${circumference}`}
              transform={`rotate(${rotation} ${center} ${center})`}
              className="transition-all duration-700 ease-out"
            />
          )
        })}
        {total > 0 && (
          <text
            x={center}
            y={center}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-ink font-semibold"
            fontSize={size * 0.16}
          >
            {total}
          </text>
        )}
      </svg>

      {showLegend && colored.length > 0 && (
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5">
          {colored.map((seg, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs">
              <span
                className="w-2.5 h-2.5 rounded-sm shrink-0"
                style={{ backgroundColor: seg.color }}
              />
              <span className="text-body">{seg.name}</span>
              <span className="text-muted">
                {Math.round(seg.percent * 100)}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
