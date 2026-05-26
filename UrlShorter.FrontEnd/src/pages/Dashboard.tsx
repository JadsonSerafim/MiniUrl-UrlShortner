import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../contexts/AuthContext'
import UrlShortener from '../components/UrlShortener'
import RecentLinksList from '../components/RecentLinksList'
import UserUrlsTable from '../components/UserUrlsTable'
import Card from '../components/Card'
import { getMyUrls, getUrlAnalytics } from '../services/url.service'
import StatsProgressBarList from '../components/StatsProgressBarList'
import { parseUserAgent } from '../utils/userAgent'

type TabType = 'resumo' | 'gerenciar' | 'graficos'

export function Dashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<TabType>('resumo')
  const [selectedAnalyticsCode, setSelectedAnalyticsCode] = useState<string>('')

  const { data: urls = [], isLoading } = useQuery({
    queryKey: ['userUrls'],
    queryFn: () => getMyUrls(),
    enabled: !!user?.id,
  })

  const { data: analyticsData, isLoading: isAnalyticsLoading } = useQuery({
    queryKey: ['urlAnalytics', selectedAnalyticsCode, user?.id],
    queryFn: () => getUrlAnalytics(selectedAnalyticsCode, user!.id),
    enabled: activeTab === 'graficos' && !!selectedAnalyticsCode && !!user?.id,
  })

  const now = useMemo(() => new Date(), [])

  const totalLinks = urls.length
  const totalClicks = useMemo(() => urls.reduce((sum, item) => sum + item.clickCount, 0), [urls])

  const activeLinks = useMemo(() => {
    return urls.filter(u => !u.expiresAt || new Date(u.expiresAt) > now).length
  }, [urls, now])

  const expiredLinks = useMemo(() => {
    return urls.filter(u => u.expiresAt && new Date(u.expiresAt) <= now).length
  }, [urls, now])

  const topLinks = useMemo(() => {
    return [...urls]
      .sort((a, b) => b.clickCount - a.clickCount)
      .slice(0, 5)
      .map(item => ({
        name: `/${item.shortCode} (${item.originalUrl.substring(0, 28)}${item.originalUrl.length > 28 ? '...' : ''})`,
        count: item.clickCount
      }))
  }, [urls])

  const maxTopClicks = useMemo(() => {
    return urls.length > 0 ? Math.max(...urls.map(u => u.clickCount), 1) : 1
  }, [urls])

  const analyticsStats = useMemo(() => {
    if (!analyticsData?.clicks) {
      return {
        browsers: [] as { name: string; count: number }[],
        systems: [] as { name: string; count: number }[],
        uniqueClicksCount: 0,
      }
    }

    const browserMap: Record<string, number> = {}
    const systemMap: Record<string, number> = {}
    const uniqueIps = new Set<string>()

    analyticsData.clicks.forEach((click) => {
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
  }, [analyticsData?.clicks])

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 flex flex-col gap-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium tracking-tight text-ink">Dashboard</h1>
          <p className="text-sm text-body mt-1">
            Bem-vindo de volta, <span className="text-ink font-semibold">{user?.name}</span>.
          </p>
        </div>

        <div className="flex border-b border-hairline/60 gap-6" role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === 'resumo'}
            onClick={() => setActiveTab('resumo')}
            className={`pb-3 text-sm font-semibold transition-colors relative flex items-center ${activeTab === 'resumo' ? 'text-primary' : 'text-muted hover:text-ink'
              }`}
          >
            <span>Resumo</span>
            {activeTab === 'resumo' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full animate-fade-in" />
            )}
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'gerenciar'}
            aria-controls="panel-gerenciar"
            onClick={() => setActiveTab('gerenciar')}
            className={`pb-3 text-sm font-semibold transition-colors relative flex items-center gap-1.5 ${activeTab === 'gerenciar' ? 'text-primary' : 'text-muted hover:text-ink'
              }`}
          >
            <span>Gerenciar Links</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-semibold leading-none ${activeTab === 'gerenciar' ? 'bg-primary/20 text-primary' : 'bg-surface-soft text-muted'
              }`}>
              {totalLinks}
            </span>
            {activeTab === 'gerenciar' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full animate-fade-in" />
            )}
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'graficos'}
            onClick={() => setActiveTab('graficos')}
            className={`pb-3 text-sm font-semibold transition-colors relative flex items-center ${activeTab === 'graficos' ? 'text-primary' : 'text-muted hover:text-ink'
              }`}
          >
            <span>Gráficos & Métricas</span>
            {activeTab === 'graficos' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full animate-fade-in" />
            )}
          </button>
        </div>
      </div>

      {activeTab === 'resumo' && (
        <div id="panel-resumo" role="tabpanel" className="flex flex-col gap-8 animate-fade-in">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card compact className="p-5 bg-surface/20 border-hairline/40 flex flex-col gap-1 text-left">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted">Total de Links</span>
              <span className="text-3xl font-extrabold text-ink leading-tight">{totalLinks}</span>
            </Card>
            <Card compact className="p-5 bg-surface/20 border-hairline/40 flex flex-col gap-1 text-left">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted">Cliques Acumulados</span>
              <span className="text-3xl font-extrabold text-ink leading-tight">{totalClicks}</span>
            </Card>
            <Card compact className="p-5 bg-surface/20 border-hairline/40 flex flex-col gap-1 text-left">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted">Links Ativos</span>
              <span className="text-3xl font-extrabold text-green-400 leading-tight">{activeLinks}</span>
            </Card>
            <Card compact className="p-5 bg-surface/20 border-hairline/40 flex flex-col gap-1 text-left">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted">Links Expirados</span>
              <span className="text-3xl font-extrabold text-red-400 leading-tight">{expiredLinks}</span>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-2 flex flex-col gap-6">
              <UrlShortener
                userId={user?.id}
                label="Encurtar um novo link"
                buttonText="Encurtar"
              />
            </div>

            <div className="flex flex-col gap-6">
              <Card className="border border-white/5 bg-surface/30 p-5 flex flex-col gap-2 text-left">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-ink flex items-center gap-1.5">
                  <span>Sua Conta</span>
                  <span className="text-primary font-normal text-[10px] bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded-full">Ativa</span>
                </h3>
                <p className="text-xs text-muted leading-relaxed">
                  Seus links podem durar até um ano e você possui um limite de até 1.000 URLs ativas.
                </p>
              </Card>

              {isLoading ? (
                <div className="flex flex-col gap-4">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-muted px-1 text-left">
                    Seus links recentes
                  </h2>
                  <div className="flex flex-col gap-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="animate-shimmer rounded-xl h-28 border border-white/5"
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <RecentLinksList urls={urls} />
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'gerenciar' && (
        <div id="panel-gerenciar" role="tabpanel" className="w-full animate-fade-in">
          {isLoading ? (
            <div className="animate-shimmer rounded-xl h-64 border border-white/5" />
          ) : (
            <UserUrlsTable urls={urls} />
          )}
        </div>
      )}

      {activeTab === 'graficos' && (
        <div id="panel-graficos" role="tabpanel" className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start animate-fade-in text-left">
          <div className="md:col-span-1 flex flex-col gap-6">
            <StatsProgressBarList
              title="Top Links mais Clicados"
              items={topLinks}
              total={maxTopClicks}
              barColorClass="bg-primary"
            />
          </div>

          <div className="md:col-span-2 flex flex-col gap-6">
            <Card className="p-6 border border-white/5 bg-surface/30 flex flex-col gap-6">
              <div>
                <h3 className="text-base font-bold text-ink">Análise de Performance Individual</h3>
                <p className="text-xs text-muted">Selecione uma de suas URLs para ver detalhes de acessos, dispositivos e navegadores</p>
              </div>

              <div className="w-full">
                <select
                  value={selectedAnalyticsCode}
                  onChange={(e) => setSelectedAnalyticsCode(e.target.value)}
                  className="w-full bg-surface-soft border border-hairline rounded-lg px-4 py-2.5 text-xs text-ink focus:border-primary outline-none cursor-pointer"
                >
                  <option value="">Selecione um link encurtado...</option>
                  {urls.map(u => (
                    <option key={u.shortCode} value={u.shortCode}>
                      /{u.shortCode} → {u.originalUrl.substring(0, 45)}{u.originalUrl.length > 45 ? '...' : ''} ({u.clickCount} cliques)
                    </option>
                  ))}
                </select>
              </div>

              {!selectedAnalyticsCode ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted border border-dashed border-hairline rounded-xl bg-white/[0.01]">
                  <svg className="w-8 h-8 opacity-40 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                  </svg>
                  <p className="text-xs">Por favor, escolha uma URL acima para carregar a telemetria em tempo real.</p>
                </div>
              ) : isAnalyticsLoading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted">
                  <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  <p className="text-xs">Carregando telemetria...</p>
                </div>
              ) : !analyticsData || analyticsData.clicks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted border border-dashed border-hairline rounded-xl bg-white/[0.01]">
                  <p className="text-xs">Nenhum clique registrado para esta URL ainda.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-6 animate-fade-in">
                  <div className="grid grid-cols-2 gap-4">
                    <Card compact className="bg-primary/5 border border-primary/20 p-4 flex flex-col text-left">
                      <span className="text-[10px] text-primary uppercase font-bold tracking-wider">Cliques Totais</span>
                      <span className="text-3xl font-extrabold text-ink mt-0.5">{analyticsData.totalClicks}</span>
                    </Card>
                    <Card compact className="bg-white/[0.02] border border-white/5 p-4 flex flex-col text-left">
                      <span className="text-[10px] text-muted uppercase font-bold tracking-wider">IPs Únicos</span>
                      <span className="text-3xl font-extrabold text-ink mt-0.5">{analyticsStats.uniqueClicksCount}</span>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <StatsProgressBarList
                      title="Navegadores"
                      items={analyticsStats.browsers}
                      total={analyticsData.totalClicks}
                      barColorClass="bg-primary"
                    />

                    <StatsProgressBarList
                      title="Sistemas Operacionais"
                      items={analyticsStats.systems}
                      total={analyticsData.totalClicks}
                      barColorClass="bg-primary-active"
                    />
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

    </section>
  )
}
