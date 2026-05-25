interface ExpirationSelectorProps {
  value: '1d' | '7d' | '30d' | '365d' | 'custom'
  onChange: (value: '1d' | '7d' | '30d' | '365d' | 'custom') => void
  customValue: number | ''
  onChangeCustomValue: (value: number | '') => void
  customUnit: 'hours' | 'days'
  onChangeCustomUnit: (unit: 'hours' | 'days') => void
}

export default function ExpirationSelector({
  value,
  onChange,
  customValue,
  onChangeCustomValue,
  customUnit,
  onChangeCustomUnit,
}: ExpirationSelectorProps) {
  return (
    <div className="flex flex-col gap-3 border-t border-hairline/50 pt-4 animate-fade-in">
      <label className="text-xs font-semibold uppercase tracking-wider text-muted">
        Validade do Link
      </label>

      <div className="flex flex-wrap gap-2">
        {(['1d', '7d', '30d', '365d'] as const).map((type) => {
          const labelMap = {
            '1d': '1 dia',
            '7d': '7 dias',
            '30d': '30 dias',
            '365d': '1 ano',
          }
          const isActive = value === type
          return (
            <button
              key={type}
              type="button"
              onClick={() => onChange(type)}
              className={`text-xs px-3 py-1.5 rounded-pill border transition-all duration-150 cursor-pointer outline-none ${
                isActive
                  ? 'bg-primary text-white border-primary font-semibold'
                  : 'bg-surface-soft text-body border-hairline hover:text-ink'
              }`}
            >
              {labelMap[type]}
            </button>
          )
        })}
        <button
          type="button"
          onClick={() => onChange('custom')}
          className={`text-xs px-3 py-1.5 rounded-pill border transition-all duration-150 cursor-pointer outline-none ${
            value === 'custom'
              ? 'bg-primary text-white border-primary font-semibold'
              : 'bg-surface-soft text-body border-hairline hover:text-ink'
          }`}
        >
          Personalizado
        </button>
      </div>

      {value === 'custom' && (
        <div className="flex items-center gap-2 mt-1 animate-fade-in">
          <input
            type="number"
            min="1"
            required
            value={customValue}
            onChange={(e) => {
              const val = e.target.value
              onChangeCustomValue(val === '' ? '' : Math.max(1, parseInt(val) || 1))
            }}
            className="w-20 bg-surface-soft border border-hairline rounded-md px-3 py-1.5 text-xs text-ink focus:border-primary outline-none hide-spinners"
          />
          <select
            value={customUnit}
            onChange={(e) => onChangeCustomUnit(e.target.value as 'hours' | 'days')}
            className="bg-surface-soft border border-hairline rounded-md px-3 py-1.5 text-xs text-ink focus:border-primary outline-none cursor-pointer"
          >
            <option value="days">Dias</option>
            <option value="hours">Horas</option>
          </select>
        </div>
      )}
    </div>
  )
}
