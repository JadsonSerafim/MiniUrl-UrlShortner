import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

interface LinkButtonProps {
  to: string
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  children: ReactNode
}

const variantClass = {
  primary:   'btn-primary',
  secondary: 'btn-secondary',
  ghost:     'btn-ghost',
}

const sizeClass = {
  sm: 'text-sm h-9 px-4',
  md: 'text-base h-11 px-5',
  lg: 'text-base h-14 px-8',
}

export default function LinkButton({
  to,
  variant = 'primary',
  size = 'md',
  className = '',
  children,
}: LinkButtonProps) {
  return (
    <Link
      to={to}
      className={`${variantClass[variant]} ${sizeClass[size]} ${className}`}
    >
      {children}
    </Link>
  )
}