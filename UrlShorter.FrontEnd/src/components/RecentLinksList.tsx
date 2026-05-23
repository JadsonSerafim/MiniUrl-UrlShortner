import type { UrlItem } from '../types'
import { useClipboard } from '../hooks/useClipboard'
import Card from './Card'

interface RecentLinksListProps {
  urls: UrlItem[]
}

export default function RecentLinksList({ urls }: RecentLinksListProps) {
  const { copy } = useClipboard()
  const backendBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted px-1">
        Seus links recentes
      </h2>

      <div className="flex flex-col gap-3">
        {urls.length === 0 ? (
          <div className="rounded-xl border border-hairline/50 p-6 bg-surface text-center">
            <p className="text-sm text-muted">
              Você ainda não possui links encurtados.
            </p>
          </div>
        ) : (
          urls.map((item) => {
            const fullUrl = `${backendBaseUrl}/${item.shortCode}`
            return (
              <Card key={item.shortCode} compact className="card-interactive flex flex-col gap-3">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-mono truncate">{item.shortCode}</span>
                    <span className="text-xs text-muted">{item.createdAt}</span>
                  </div>
                  <p className="text-xs text-body truncate mt-1">
                    {item.originalUrl}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-2 border-t border-hairline/50 pt-2">
                  <a
                    href={fullUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-muted hover:text-ink transition-colors"
                  >
                    Acessar link ↗
                  </a>

                  <button
                    onClick={() => copy(fullUrl)}
                    className="text-xs text-primary font-semibold hover:text-primary-active transition-colors"
                  >
                    Copiar
                  </button>
                </div>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
