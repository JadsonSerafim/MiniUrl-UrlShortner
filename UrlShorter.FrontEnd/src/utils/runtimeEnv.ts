const normalizeUrl = (value: string | undefined, fallback: string) => {
  const trimmed = value?.trim()

  if (!trimmed) {
    return fallback
  }

  return trimmed.replace(/\/$/, '')
}

export const getApiBaseUrl = () => normalizeUrl(import.meta.env.VITE_API_URL, '/api')

export const getPublicBaseUrl = () => {
  const configuredUrl = normalizeUrl(
    import.meta.env.VITE_PUBLIC_URL || import.meta.env.VITE_APP_URL,
    ''
  )

  if (configuredUrl) {
    return configuredUrl
  }

  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin
  }

  return 'http://localhost:5173'
}
