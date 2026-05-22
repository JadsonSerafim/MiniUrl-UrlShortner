import Card from './Card'

interface StepCardProps {
  stepNumber: number
  title: string
  description: string
}

export default function StepCard({ stepNumber, title, description }: StepCardProps) {
  return (
    <Card compact className="card-interactive flex flex-col gap-4">
      <div className="w-8 h-8 rounded-full bg-surface-soft border border-hairline flex items-center justify-center text-xs font-semibold text-primary">
        {stepNumber}
      </div>
      <div>
        <h3 className="text-sm font-semibold text-ink uppercase tracking-wider mb-2">
          {title}
        </h3>
        <p className="text-sm text-body">
          {description}
        </p>
      </div>
    </Card>
  )
}
