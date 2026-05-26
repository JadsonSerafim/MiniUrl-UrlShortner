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
      <Card compact className="bg-white/[0.02] border border-white/5 p-4 flex flex-col gap-2.5">
        {items.length === 0 ? (
          <p className="text-xs text-muted py-2">Nenhum dado disponível ainda.</p>
        ) : (
          items.map((item) => (
            <div key={item.name} className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span className="text-body font-medium">{item.name}</span>
                <span className="text-ink font-semibold">{item.count}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className={`h-full rounded-full ${barColorClass}`}
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
