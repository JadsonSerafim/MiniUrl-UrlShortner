
export interface TabItem<T extends string> {
  key: T
  label: string
  badge?: number | string
}

interface TabsProps<T extends string> {
  tabs: TabItem<T>[]
  activeTab: T
  onChange: (key: T) => void
}

export default function Tabs<T extends string>({ tabs, activeTab, onChange }: TabsProps<T>) {
  return (
    <div className="flex border-b border-hairline gap-6" role="tablist">
      {tabs.map(({ key, label, badge }) => (
        <button
          key={key}
          type="button"
          role="tab"
          aria-selected={activeTab === key}
          aria-controls={`panel-${key}`}
          onClick={() => onChange(key)}
          className={`pb-3 text-sm font-semibold transition-colors relative flex items-center gap-1.5 ${
            activeTab === key ? 'text-primary' : 'text-muted hover:text-ink'
          }`}
        >
          <span>{label}</span>
          {badge !== undefined && (
            <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-semibold leading-none ${
              activeTab === key ? 'bg-primary/20 text-primary' : 'bg-surface-soft text-muted'
            }`}>
              {badge}
            </span>
          )}
          {activeTab === key && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full animate-fade-in" />
          )}
        </button>
      ))}
    </div>
  )
}
