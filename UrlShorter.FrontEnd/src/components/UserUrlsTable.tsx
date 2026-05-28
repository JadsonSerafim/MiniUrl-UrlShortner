import { useState, useMemo } from 'react'
import type { UrlItem } from '../types'
import { useClipboard } from '../hooks/useClipboard'
import Card from './Card'
import UrlAnalyticsModal from './UrlAnalyticsModal'

interface UserUrlsTableProps {
  urls: UrlItem[]
}

export default function UserUrlsTable({ urls }: UserUrlsTableProps) {
  const { copy } = useClipboard()
  const [selectedShortCode, setSelectedShortCode] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'most-clicked' | 'least-clicked'>('newest')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired'>('all')

  const backendBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  const filteredAndSortedUrls = useMemo(() => {
    let result = urls.filter((url) => {
      const term = searchQuery.toLowerCase()
      const matchesSearch =
        url.shortCode.toLowerCase().includes(term) ||
        url.originalUrl.toLowerCase().includes(term) ||
        (url.name && url.name.toLowerCase().includes(term))

      if (!matchesSearch) return false

      const now = new Date()
      const isExpired = url.expiresAt ? new Date(url.expiresAt) < now : false

      if (statusFilter === 'active') {
        return !isExpired
      }
      if (statusFilter === 'expired') {
        return isExpired
      }

      return true
    })

    result = [...result].sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
      if (sortBy === 'most-clicked') {
        return b.clickCount - a.clickCount
      }
      if (sortBy === 'least-clicked') {
        return a.clickCount - b.clickCount
      }
      return 0
    })

    return result
  }, [urls, searchQuery, sortBy, statusFilter])

  return (
    <Card className="w-full text-left">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-hairline">
        <div>
            <h2 className="text-base font-bold text-ink">Gerenciar seus links</h2>
            <p className="text-xs text-muted">Acompanhe, filtre e analise o desempenho de seus links</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">

            <div className="relative">
              <input
                type="text"
                placeholder="Buscar links..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 bg-surface border border-hairline rounded-md pl-8 pr-3 py-1.5 text-xs text-ink placeholder:text-muted/60 focus:border-primary outline-none"
              />
              <svg className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-muted/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>


            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'expired')}
              className="bg-surface border border-hairline rounded-md px-3 py-1.5 text-xs text-ink focus:border-primary outline-none cursor-pointer"
              >
              <option value="all">Todos os Status</option>
              <option value="active">Ativos</option>
              <option value="expired">Expirados</option>
              </select>

              <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'most-clicked' | 'least-clicked')}

              className="bg-surface border border-hairline rounded-md px-3 py-1.5 text-xs text-ink focus:border-primary outline-none cursor-pointer"
            >
              <option value="newest">Mais recentes</option>
              <option value="oldest">Mais antigos</option>
              <option value="most-clicked">Mais clicados</option>
              <option value="least-clicked">Menos clicados</option>
            </select>
          </div>
        </div>


        <div className="w-full overflow-x-auto rounded-lg border border-hairline">
          <table className="w-full min-w-[640px] text-left border-collapse">
            <thead>
              <tr className="bg-surface-soft border-b border-hairline text-[11px] font-semibold text-muted uppercase tracking-wider">
                <th className="px-4 py-3">Link Curto</th>
                <th className="px-4 py-3">Destino</th>
                <th className="px-4 py-3">Criado em</th>
                <th className="px-4 py-3">Expiração</th>
                <th className="px-4 py-3 text-center">Cliques</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline/40 text-xs">
              {filteredAndSortedUrls.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted">
                      {urls.length === 0 ? (
                        <>
                          <svg className="w-8 h-8 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                          </svg>
                          <p className="text-sm text-muted font-medium">Você ainda não possui links encurtados.</p>
                          <p className="text-xs text-muted/70">Crie seu primeiro link no painel Resumo.</p>
                        </>
                      ) : (
                        <>
                          <svg className="w-8 h-8 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <p className="text-sm text-muted font-medium">Nenhum link corresponde aos filtros aplicados.</p>
                          <p className="text-xs text-muted/70">Tente ajustar sua busca ou limpar os filtros.</p>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAndSortedUrls.map((item) => {
                  const fullUrl = `${backendBaseUrl}/${item.shortCode}`
                  const isExpired = item.expiresAt ? new Date(item.expiresAt) < new Date() : false
                  const expiresText = item.expiresAt
                    ? new Date(item.expiresAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })
                    : 'Sem expiração'

                  const formattedCreatedAt = new Date(item.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })

                  return (
                    <tr key={item.shortCode} className="hover:bg-surface-soft/10 transition-colors">
                      <td className="px-4 py-3.5 font-mono font-medium text-primary whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span>{item.shortCode}</span>
                          <button
                            type="button"
                            onClick={() => copy(fullUrl)}
                            className="p-1 hover:bg-surface rounded text-muted hover:text-ink transition-colors animate-fade-in"
                            title="Copiar link"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 max-w-[200px] truncate text-body" title={item.originalUrl}>
                        {item.name ? (
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <span className="font-semibold text-ink truncate" title={item.name}>{item.name}</span>
                            <span className="text-[10px] text-muted truncate" title={item.originalUrl}>{item.originalUrl}</span>
                          </div>
                        ) : (
                          item.originalUrl
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-muted whitespace-nowrap">
                        {formattedCreatedAt}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {isExpired ? (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-400/10 text-red-400">
                            Expirado
                          </span>
                        ) : (
                          <span className="text-muted" title={item.expiresAt ? new Date(item.expiresAt).toLocaleString('pt-BR') : undefined}>
                            {expiresText}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-center font-semibold text-ink">
                        {item.clickCount}
                      </td>
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-3">
                          <a
                            href={fullUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-muted hover:text-ink transition-colors"
                          >
                            Acessar ↗
                          </a>
                          <button
                            type="button"
                            onClick={() => setSelectedShortCode(item.shortCode)}
                            className="text-xs text-primary font-semibold hover:text-primary-active transition-colors flex items-center gap-1"
                          >
                            <span>Métricas</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedShortCode && (
        <UrlAnalyticsModal
          shortCode={selectedShortCode}
          isOpen={!!selectedShortCode}
          onClose={() => setSelectedShortCode(null)}
        />
      )}
    </Card>
  )
}
