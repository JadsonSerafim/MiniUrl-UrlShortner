import { useState } from 'react'
import type { UrlItem } from '../types'
import { useClipboard } from '../hooks/useClipboard'
import Card from './Card'
import UrlAnalyticsModal from './UrlAnalyticsModal'
import { EmptyState, EmptyIcon } from './EmptyState'
import { getPublicBaseUrl } from '../utils/runtimeEnv'

interface RecentLinksListProps {
  urls: UrlItem[]
}

export default function RecentLinksList({ urls }: RecentLinksListProps) {
  const { copy } = useClipboard()
  const [selectedShortCode, setSelectedShortCode] = useState<string | null>(null)
  const backendBaseUrl = getPublicBaseUrl()

  const recentUrls = urls.slice(0, 5)

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted px-1">
        Seus links recentes
      </h2>

      <div className="flex flex-col gap-3">
        {recentUrls.length === 0 ? (
          <EmptyState
            compact
            icon={<EmptyIcon />}
            title="Você ainda não possui links encurtados."
            description="Crie seu primeiro link acima para começar a acompanhar os acessos."
          />
        ) : (
          recentUrls.map((item) => {
            const fullUrl = `${backendBaseUrl}/${item.shortCode}`
            const expiresText = item.expiresAt
              ? new Date(item.expiresAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
              : 'Sem expiração'

            const formattedCreatedAt = new Date(item.createdAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })

            return (
              <Card key={item.shortCode} compact className="card-interactive flex flex-col gap-3">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-mono font-medium text-ink truncate">{item.shortCode}</span>
                    <span className="text-[10px] text-muted">{formattedCreatedAt}</span>
                  </div>
                  <div className="text-xs text-body truncate mt-1">
                    {item.name ? (
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="font-semibold text-ink truncate" title={item.name}>{item.name}</span>
                        <span className="text-[10px] text-muted truncate" title={item.originalUrl}>{item.originalUrl}</span>
                      </div>
                    ) : (
                      item.originalUrl
                    )}
                  </div>

                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1 text-[11px] text-muted">
                      <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>
                        {item.clickCount} {item.clickCount === 1 ? 'clique' : 'cliques'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-muted">
                      <svg className="w-3.5 h-3.5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span title={item.expiresAt ? new Date(item.expiresAt).toLocaleString('pt-BR') : undefined}>
                        {expiresText}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 border-t border-hairline pt-2">
                  <div className="flex items-center gap-3">
                    <a
                      href={fullUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-muted hover:text-ink transition-colors"
                    >
                      Acessar link ↗
                    </a>

                    <button
                      type="button"
                      onClick={() => setSelectedShortCode(item.shortCode)}
                      className="text-xs text-muted hover:text-ink transition-colors"
                    >
                      Métricas
                    </button>
                  </div>

                  <button
                    type="button"
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

      {selectedShortCode && (
        <UrlAnalyticsModal
          shortCode={selectedShortCode}
          isOpen={!!selectedShortCode}
          onClose={() => setSelectedShortCode(null)}
        />
      )}
    </div>
  )
}
