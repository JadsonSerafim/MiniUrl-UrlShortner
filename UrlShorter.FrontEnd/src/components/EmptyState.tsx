import type { ReactNode } from 'react'
import Card from './Card'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
  compact?: boolean
}

export function EmptyState({ icon, title, description, action, className = '', compact = false }: EmptyStateProps) {
  return (
    <Card compact={compact} className={`flex flex-col items-center justify-center text-center ${compact ? 'p-6' : 'py-16 px-8'} ${className}`}>
      {icon && (
        <div className="mb-3 text-muted opacity-40">
          {icon}
        </div>
      )}
      <p className="text-sm text-muted font-medium">{title}</p>
      {description && (
        <p className="text-xs text-muted/70 mt-1 max-w-xs">{description}</p>
      )}
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-4 text-xs text-primary font-semibold hover:text-primary-active transition-colors"
        >
          {action.label}
        </button>
      )}
    </Card>
  )
}

export function EmptyIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-10 h-10 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
    </svg>
  )
}

export function SearchEmptyIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-10 h-10 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

export function ChartEmptyIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-10 h-10 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
    </svg>
  )
}

export function ClickEmptyIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-10 h-10 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  )
}
