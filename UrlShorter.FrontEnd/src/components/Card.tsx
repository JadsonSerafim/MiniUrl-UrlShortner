import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  compact?: boolean
}

export default function Card({ children, className = '', compact = false }: CardProps) {
  return (
    <div className={`${compact ? 'card-sm' : 'card'} ${className}`}>
      {children}
    </div>
  )
}
