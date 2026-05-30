import { useMemo } from 'react'
import type { ClickLog } from '../services/url.service'

interface DayCount {
  date: string
  count: number
  label: string
}

interface ClickTimelineChartProps {
  clicks: ClickLog[]
  className?: string
}

export default function ClickTimelineChart({ clicks, className = '' }: ClickTimelineChartProps) {
  const days: DayCount[] = useMemo(() => {
    if (!clicks?.length) return []

    const map = new Map<string, number>()
    for (const click of clicks) {
      const key = click.occurredAt.slice(0, 10)
      map.set(key, (map.get(key) || 0) + 1)
    }

    return Array.from(map.entries())
      .map(([date, count]) => {
        const d = new Date(date + 'T12:00:00')
        const label = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
        return { date, count, label }
      })
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [clicks])

  const maxCount = useMemo(() => Math.max(...days.map(d => d.count), 1), [days])

  if (!days.length) return (
    <div className="flex flex-col items-center justify-center py-6 text-muted">
      <svg className="w-6 h-6 opacity-40 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
      </svg>
      <p className="text-xs text-muted/70">Nenhum clique registrado neste período.</p>
    </div>
  )

  return (
    <div className={`flex flex-col gap-1.5 animate-fade-in ${className}`}>
      <div className="relative flex items-end justify-between gap-[1px]" style={{ height: '96px' }}>
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {[0, 1, 2].map(i => (
            <div key={i} className="border-b border-hairline/40 w-full" />
          ))}
        </div>

        {days.map((day) => {
          const barH = Math.max((day.count / maxCount) * 100, 2)
          return (
            <div key={day.date} className="flex-1 flex flex-col items-center justify-end h-full group relative">
              <span className="text-[9px] font-mono text-muted opacity-0 group-hover:opacity-100 transition-opacity absolute -top-4">
                {day.count}
              </span>
              <div
                className="w-full bg-primary/70 rounded-t-sm min-h-[2px]"
                style={{ height: `${barH}%` }}
                title={`${day.label}: ${day.count} clique${day.count !== 1 ? 's' : ''}`}
              />
              <span className="text-[7px] font-mono text-muted/60 text-center leading-tight mt-1">
                {day.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
