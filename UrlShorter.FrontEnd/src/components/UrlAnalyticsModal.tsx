import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getUrlAnalytics } from '../services/url.service'
import { parseUserAgent } from '../utils/userAgent'
import Card from './Card'
import ClickHistoryModal from './ClickHistoryModal'
import StatsProgressBarList from './StatsProgressBarList'

interface UrlAnalyticsModalProps {
  shortCode: string
  isOpen: boolean
  onClose: () => void
}

export default function UrlAnalyticsModal({ shortCode, isOpen, onClose }: UrlAnalyticsModalProps) {
  const { user } = useAuth()
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  const { data, isLoading, error } = useQuery({
    queryKey: ['urlAnalytics', shortCode, user?.id],
    queryFn: () => getUrlAnalytics(shortCode, user!.id),
    enabled: isOpen && !!user?.id && !!shortCode,
  })

  const stats = useMemo(() => {
    if (!data?.clicks) {
      return {
        browsers: [] as { name: string; count: number }[],
        systems: [] as { name: string; count: number }[],
        uniqueClicksCount: 0,
      }
    }

    const browserMap: Record<string, number> = {}
    const systemMap: Record<string, number> = {}
    const uniqueIps = new Set<string>()

    data.clicks.forEach((click) => {
      const { browser, os } = parseUserAgent(click.userAgent)
      browserMap[browser] = (browserMap[browser] || 0) + 1
      systemMap[os] = (systemMap[os] || 0) + 1
      if (click.ipAddress) {
        uniqueIps.add(click.ipAddress)
      }
    })

    const browsers = Object.entries(browserMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)

    const systems = Object.entries(systemMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)

    return { browsers, systems, uniqueClicksCount: uniqueIps.size }
  }, [data?.clicks])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">

      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-hairline bg-surface text-ink shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-hairline">
          <div>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-primary">Métricas de Acesso</span>
            <h3 className="text-xl font-bold mt-0.5 text-mono text-ink">{shortCode}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-soft text-muted hover:text-ink transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted">
              <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <p className="text-sm">Carregando dados da API...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-sm text-red-400">
              Falha ao carregar as métricas detalhadas.
            </div>
          ) : (
            <>
              <div className="p-4 rounded-xl bg-surface-soft border border-hairline">
                <span className="text-[10px] text-muted uppercase font-semibold">URL de Destino</span>
                <p className="text-sm text-body truncate mt-0.5" title={data?.originalUrl}>
                  {data?.originalUrl}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card compact className="bg-primary/5 border border-primary/20 p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-primary font-medium">Cliques Totais</span>
                    {data?.clicks && data.clicks.length > 0 && (
                      <button
                        onClick={() => setIsHistoryOpen(true)}
                        className="p-1 rounded-lg hover:bg-primary/10 text-primary transition-colors duration-150"
                        title="Ver histórico de cliques"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <span className="text-3xl font-extrabold tracking-tight mt-1 text-ink">
                    {data?.totalClicks}
                  </span>
                </Card>

                <Card compact className="bg-surface-soft border border-hairline p-4 flex flex-col justify-between">
                  <span className="text-xs text-muted font-medium">Cliques Únicos (IPs)</span>
                  <span className="text-3xl font-extrabold tracking-tight mt-1 text-ink">
                    {stats.uniqueClicksCount}
                  </span>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StatsProgressBarList
                  title="Navegadores"
                  items={stats.browsers}
                  total={data?.totalClicks || 0}
                  barColorClass="bg-primary"
                />

                <StatsProgressBarList
                  title="Sistemas Operacionais"
                  items={stats.systems}
                  total={data?.totalClicks || 0}
                  barColorClass="bg-primary-active"
                />
              </div>

            </>
          )}
        </div>
      </div>

      <ClickHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        shortCode={shortCode}
        clicks={data?.clicks || []}
      />
    </div>
  )
}