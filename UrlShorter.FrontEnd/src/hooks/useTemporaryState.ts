import { useState, useEffect } from 'react'

export function useTemporaryState<T>(initialValue: T, delay = 4000) {
  const [state, setState] = useState<T>(initialValue)

  useEffect(() => {
    if (state === initialValue) return
    const timer = setTimeout(() => {
      setState(initialValue)
    }, delay)

    return () => clearTimeout(timer)
  }, [state, delay, initialValue])
  return [state, setState] as const
}
