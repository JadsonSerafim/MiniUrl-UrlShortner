import React from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: React.ReactNode
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-1 text-left">
      <h1 className="text-3xl font-bold tracking-tight text-ink">{title}</h1>
      {subtitle && (
        <p className="text-sm text-body">
          {subtitle}
        </p>
      )}
    </div>
  )
}
