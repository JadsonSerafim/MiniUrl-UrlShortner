import React from 'react'
import Skeleton from './Skeleton'

export interface StatCard {
  label: string
  value: number
  valueColor: string
  icon: React.ReactNode
  iconBg: string
  iconColor: string
  borderColor: string
}

interface StatCardsProps {
  cards: StatCard[]
  isLoading: boolean
}

export default function StatCards({ cards, isLoading }: StatCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-[90px] rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map(card => (
        <div
          key={card.label}
          className={`bg-surface rounded-xl p-5 border flex flex-col gap-3 text-left ${card.borderColor}`}
        >
          <div className="flex items-start justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted leading-tight">
              {card.label}
            </span>
            <div className={`${card.iconBg} ${card.iconColor} p-1.5 rounded-lg`}>
              {card.icon}
            </div>
          </div>
          <span className={`text-3xl font-extrabold leading-tight ${card.valueColor}`}>
            {card.value}
          </span>
        </div>
      ))}
    </div>
  )
}
