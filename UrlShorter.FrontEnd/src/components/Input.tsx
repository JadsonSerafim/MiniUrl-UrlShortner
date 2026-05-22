import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  mono?: boolean
}

export default function Input({
  label,
  error,
  mono = false,
  id,
  className = '',
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-body"
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        className={`${mono ? 'input-mono' : 'input-base'} ${error ? 'border-red-500 focus:border-red-500' : ''} ${className}`}
        {...props}
      />

      {error && (
        <p className="text-xs text-red-400 animate-fade-in" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
