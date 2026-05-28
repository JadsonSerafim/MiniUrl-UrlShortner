import { useState, useRef, useEffect, useCallback } from 'react'
import type { UrlItem } from '../types'

interface UrlSearchComboboxProps {
  urls: UrlItem[]
  value: string
  onChange: (shortCode: string) => void
}

function getDomain(url: string): string {
  try { return new URL(url).hostname.replace(/^www\./, '') }
  catch { return url.substring(0, 30) }
}

export default function UrlSearchCombobox({ urls, value, onChange }: UrlSearchComboboxProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(0)

  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const selected = urls.find(u => u.shortCode === value)

  const filtered = urls.filter(u => {
    const q = query.toLowerCase()
    return (
      u.shortCode.toLowerCase().includes(q) ||
      u.originalUrl.toLowerCase().includes(q)
    )
  })

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Scroll focused item into view
  useEffect(() => {
    if (!open) return
    const item = listRef.current?.children[focused] as HTMLElement | undefined
    item?.scrollIntoView({ block: 'nearest' })
  }, [focused, open])

  const select = useCallback((shortCode: string) => {
    onChange(shortCode)
    setOpen(false)
    setQuery('')
    setFocused(0)
  }, [onChange])

  const clear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onChange('')
    setQuery('')
    setFocused(0)
  }, [onChange])

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') setOpen(true)
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setFocused(f => Math.min(f + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setFocused(f => Math.max(f - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filtered[focused]) select(filtered[focused].shortCode)
    } else if (e.key === 'Escape') {
      setOpen(false)
      setQuery('')
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input trigger */}
      <div
        className={`flex items-center gap-2 w-full bg-surface border rounded-xl px-4 h-11 cursor-text transition-all duration-200 ${
          open
            ? 'border-primary shadow-[0_0_0_3px_rgba(99,102,241,0.12)]'
            : 'border-hairline hover:border-muted'
        }`}
        onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 0) }}
      >
        {/* Search icon */}
        <svg className="w-4 h-4 text-muted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>

        {/* Show selected pill or search input */}
        {selected && !open ? (
          <div className="flex-1 flex items-center gap-2 min-w-0">
            <span className="font-mono text-sm text-primary font-semibold shrink-0">
              /{selected.shortCode}
            </span>
            <span className="text-xs text-muted truncate">{getDomain(selected.originalUrl)}</span>
            <span className="ml-auto text-[11px] text-muted shrink-0">{selected.clickCount} cliques</span>
          </div>
        ) : (
          <input
            ref={inputRef}
            type="text"
            value={query}
            placeholder={selected ? `/${selected.shortCode}` : 'Buscar por código ou URL…'}
            onChange={e => { setQuery(e.target.value); setOpen(true); setFocused(0) }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            className="flex-1 bg-transparent text-sm text-ink placeholder:text-muted outline-none min-w-0"
          />
        )}

        {/* Clear / chevron */}
        {selected ? (
          <button
            type="button"
            onClick={clear}
            className="text-muted hover:text-ink transition-colors shrink-0 p-0.5 rounded"
            aria-label="Limpar seleção"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        ) : (
          <svg className={`w-4 h-4 text-muted shrink-0 transition-transform duration-150 ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </div>

      {/* Dropdown list */}
      {open && (
        <div className="absolute z-50 top-[calc(100%+6px)] left-0 right-0 bg-surface border border-hairline rounded-xl shadow-xl overflow-hidden animate-fade-in">
          {/* Count info */}
          {query && (
            <div className="px-4 py-2 border-b border-hairline">
              <span className="text-[11px] text-muted">
                {filtered.length === 0
                  ? 'Nenhum resultado encontrado'
                  : `${filtered.length} resultado${filtered.length !== 1 ? 's' : ''}`}
              </span>
            </div>
          )}

          <ul
            ref={listRef}
            className="max-h-60 overflow-y-auto py-1"
            role="listbox"
          >
            {filtered.length === 0 ? (
              <li className="px-4 py-8 text-center text-xs text-muted">
                Nenhuma URL encontrada para "{query}"
              </li>
            ) : (
              filtered.map((u, idx) => {
                const domain = getDomain(u.originalUrl)
                const isActive = idx === focused
                const isSelected = u.shortCode === value

                return (
                  <li
                    key={u.shortCode}
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setFocused(idx)}
                    onClick={() => select(u.shortCode)}
                    className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors duration-100 ${
                      isActive ? 'bg-surface-soft' : ''
                    } ${isSelected ? 'bg-primary/5' : ''}`}
                  >
                    {/* Shortcode */}
                    <span className="font-mono text-sm font-semibold text-primary shrink-0 w-20 truncate">
                      /{u.shortCode}
                    </span>

                    {/* Domain */}
                    <span className="flex-1 text-xs text-muted truncate">{domain}</span>

                    {/* Click count badge */}
                    <span className="shrink-0 inline-flex items-center gap-1 bg-surface text-muted text-[11px] px-2 py-0.5 rounded-full border border-hairline">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                      </svg>
                      {u.clickCount}
                    </span>

                    {/* Check for selected */}
                    {isSelected && (
                      <svg className="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </li>
                )
              })
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
