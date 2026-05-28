import Card from './Card'

interface StatItem {
  name: string
  count: number
}

interface StatsProgressBarListProps {
  title: string
  items: StatItem[]
  total: number
  barColorClass?: string
}

export default function StatsProgressBarList({
  title,
  items,
  total,
  barColorClass = 'bg-primary',
}: StatsProgressBarListProps) {
  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted px-1">
        {title}
      </h4>
      <Card compact className="bg-surface-soft border border-hairline p-4 flex flex-col gap-2.5">
        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-1.5 py-4 text-muted">
            <svg className="w-6 h-6 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
            </svg>
            <p className="text-xs text-muted">Nenhum dado disponível ainda.</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.name} className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span className="text-body font-medium">{item.name}</span>
                <span className="text-ink font-semibold">{item.count}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-hairline overflow-hidden">
                <div
                  className={`h-full rounded-full ${barColorClass} transition-[width] duration-700 ease-out`}
                  style={{ width: `${(item.count / (total || 1)) * 100}%` }}
                />
              </div>
            </div>
          ))
        )}
      </Card>
    </div>
  )
}
