import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Input from './Input'
import Button from './Button'
import Card from './Card'

type FieldConfig = {
  name: string
  label: string
  type: string
  placeholder: string
  value: string
  onChange: (value: string) => void
}

interface AuthFormProps {
  title: string
  buttonText: string
  fields: FieldConfig[]
  onSubmit: () => void
  loading?: boolean
  error?: string
  footerText?: string
  footerLink?: string
  footerLinkText?: string
  extraLink?: string
  extraLinkText?: string
  children?: ReactNode
}

export function AuthForm({
  title,
  buttonText,
  fields,
  onSubmit,
  loading = false,
  error,
  footerText,
  footerLink,
  footerLinkText,
  extraLink,
  extraLinkText,
  children,
}: AuthFormProps) {
  return (
    <Card>
      <h1 className="mb-8 text-center text-2xl font-semibold text-ink tracking-tight">
        {title}
      </h1>

      <form
        onSubmit={(e) => { e.preventDefault(); onSubmit() }}
        className="flex flex-col gap-4"
        noValidate
      >
        {fields.map((field) => (
          <Input
            key={field.name}
            id={field.name}
            name={field.name}
            type={field.type}
            label={field.label}
            placeholder={field.placeholder}
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
            autoComplete={field.type === 'password' ? 'current-password' : field.type === 'email' ? 'email' : 'name'}
            required
          />
        ))}

        {extraLink && extraLinkText && (
          <div className="flex justify-end">
            <Link
              to={extraLink}
              className="text-xs text-primary hover:text-primary-active transition-colors"
            >
              {extraLinkText}
            </Link>
          </div>
        )}

        {children}

        {error && (
          <p className="text-sm text-red-400 text-center animate-fade-in" role="alert">
            {error}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          loading={loading}
          className="w-full mt-2"
        >
          {buttonText}
        </Button>
      </form>

      {footerText && footerLink && footerLinkText && (
        <p className="mt-6 text-center text-sm text-muted">
          {footerText}{' '}
          <Link
            to={footerLink}
            className="text-primary hover:text-primary-active transition-colors duration-150"
          >
            {footerLinkText}
          </Link>
        </p>
      )}
    </Card>
  )
}