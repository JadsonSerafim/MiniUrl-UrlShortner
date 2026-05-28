import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../contexts/AuthContext'
import UrlShortener from '../components/UrlShortener'
import RecentLinksList from '../components/RecentLinksList'
import UserUrlsTable from '../components/UserUrlsTable'
import Card from '../components/Card'
import Skeleton from '../components/Skeleton'
import { getMyUrls, getUrlAnalytics } from '../services/url.service'
import StatsProgressBarList from '../components/StatsProgressBarList'
import DonutChart from '../charts/DonutChart'
import ClickTimelineChart from '../charts/ClickTimelineChart'
import { parseUserAgent } from '../utils/userAgent'
import UrlSearchCombobox from '../components/UrlSearchCombobox'
import PageHeader from '../components/PageHeader'
import Tabs, { type TabItem } from '../components/Tabs'
import StatCards, { type StatCard } from '../components/StatCards'
import { LinkIcon, BarChartIcon, CheckCircleIcon, XCircleIcon } from '../components/icons/DashboardIcons'

type TabType = 'resumo' | 'links' | 'graficos'

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
  const totalClicks = useMemo(() => urls.reduce((sum, u) => sum + u.clickCount, 0), [urls])
  const activeLinks = useMemo(() => urls.filter(u => !u.expiresAt || new Date(u.expiresAt) > now).length, [urls, now])
  const expiredLinks = useMemo(() => urls.filter(u => u.expiresAt && new Date(u.expiresAt) <= now).length, [urls, now])

  const topLinks = useMemo(() =>
    [...urls]
      .sort((a, b) => b.clickCount - a.clickCount)
      .slice(0, 5)
      .map(u => ({
        name: `/${u.shortCode} (${u.originalUrl.substring(0, 28)}${u.originalUrl.length > 28 ? '...' : ''})`,
        count: u.clickCount,
      })),
    [urls])

  const maxTopClicks = useMemo(() =>
    urls.length > 0 ? Math.max(...urls.map(u => u.clickCount), 1) : 1,
    [urls])

  const analyticsStats = useMemo(() => {
    if (!analyticsData?.clicks) return { browsers: [], systems: [], uniqueClicksCount: 0 } as {
      browsers: { name: string; count: number }[]
      systems: { name: string; count: number }[]
      uniqueClicksCount: number
    }
    const browserMap: Record<string, number> = {}
    const systemMap: Record<string, number> = {}
    const uniqueIps = new Set<string>()
    analyticsData.clicks.forEach(click => {
      const { browser, os } = parseUserAgent(click.userAgent)
      browserMap[browser] = (browserMap[browser] || 0) + 1
      systemMap[os] = (systemMap[os] || 0) + 1
      if (click.ipAddress) uniqueIps.add(click.ipAddress)
    })
    return {
      browsers: Object.entries(browserMap).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
      systems: Object.entries(systemMap).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
      uniqueClicksCount: uniqueIps.size,
    }
  }, [analyticsData])

  const statCards: StatCard[] = [
    { label: 'Total de Links', value: totalLinks, valueColor: 'text-ink', icon: <LinkIcon />, iconBg: 'bg-indigo-500/10', iconColor: 'text-indigo-400', borderColor: 'border-indigo-500/20' },
    { label: 'Cliques Acumulados', value: totalClicks, valueColor: 'text-ink', icon: <BarChartIcon />, iconBg: 'bg-blue-500/10', iconColor: 'text-blue-400', borderColor: 'border-blue-500/20' },
    { label: 'Links Ativos', value: activeLinks, valueColor: 'text-emerald-400', icon: <CheckCircleIcon />, iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-400', borderColor: 'border-emerald-500/20' },
    { label: 'Links Expirados', value: expiredLinks, valueColor: 'text-red-400', icon: <XCircleIcon />, iconBg: 'bg-red-500/10', iconColor: 'text-red-400', borderColor: 'border-red-500/20' },
  ]

  const tabs: TabItem<TabType>[] = [
    { key: 'resumo', label: 'Resumo' },
    { key: 'links', label: 'Meus Links', badge: totalLinks },
    { key: 'graficos', label: 'Gráficos & Métricas' },
  ]

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 flex flex-col gap-8">
      <PageHeader
        title="Painel de Controle"
        subtitle={<>Bem-vindo de volta, <span className="text-ink font-semibold">{user?.name}</span>.</>}
      />

      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={(key) => setActiveTab(key as TabType)}
      />

      {activeTab === 'resumo' && (
        <div id="panel-resumo" role="tabpanel" className="flex flex-col gap-6 animate-fade-in">
          <StatCards cards={statCards} isLoading={isLoading} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div className="md:col-span-2">
              <UrlShortener userId={user?.id} label="Encurtar um novo link" buttonText="Encurtar Agora" />
            </div>
            <div>
              {isLoading ? (
                <div className="flex flex-col gap-3">
                  {[1, 2].map(i => (
                    <div key={i} className="animate-shimmer rounded-xl h-24 border border-hairline" />
                  ))}
                </div>
              ) : (
                <RecentLinksList urls={urls} />
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'links' && (
        <div id="panel-links" role="tabpanel" className="animate-fade-in">
          {isLoading ? (
            <div className="flex flex-col gap-4">
              <div className="rounded-lg border border-hairline overflow-hidden">
                <Skeleton className="h-10 rounded-none" />
                {[1, 2, 3, 4, 5].map(i => (
                  <Skeleton key={i} className="h-12 rounded-none border-t border-hairline" />
                ))}
              </div>
            </div>
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
            <Card className="p-6 border border-hairline bg-surface-soft flex flex-col gap-6">
              <div>
                <h3 className="text-base font-bold text-ink">Análise de Performance Individual</h3>
                <p className="text-xs text-muted">Selecione uma de suas URLs para ver detalhes de acessos, dispositivos e navegadores</p>
              </div>

              <UrlSearchCombobox
                urls={urls}
                value={selectedAnalyticsCode}
                onChange={setSelectedAnalyticsCode}
              />

              {!selectedAnalyticsCode ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted border border-dashed border-hairline rounded-xl gap-2">
                  <svg className="w-8 h-8 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                  </svg>
                  <p className="text-xs font-medium">Escolha uma URL para análise</p>
                  <p className="text-xs text-muted/70">Selecione um link encurtado acima para ver métricas detalhadas de acesso.</p>
                </div>
              ) : isAnalyticsLoading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted">
                  <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  <p className="text-xs font-medium">Carregando telemetria...</p>
                </div>
              ) : !analyticsData || analyticsData.clicks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted border border-dashed border-hairline rounded-xl gap-2">
                  <svg className="w-8 h-8 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <p className="text-xs font-medium">Nenhum clique registrado</p>
                  <p className="text-xs text-muted/70">Compartilhe seu link para começar a receber acessos e métricas.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-6 animate-fade-in">
                  <div className="grid grid-cols-2 gap-4">
                    <Card compact className="bg-primary/5 border border-primary/20 p-4 flex flex-col text-left">
                      <span className="text-[10px] text-primary uppercase font-bold tracking-wider">Cliques Totais</span>
                      <span className="text-3xl font-extrabold text-ink mt-0.5">{analyticsData.totalClicks}</span>
                    </Card>
                    <Card compact className="bg-surface-soft border border-hairline p-4 flex flex-col text-left">
                      <span className="text-[10px] text-muted uppercase font-bold tracking-wider">IPs Únicos</span>
                      <span className="text-3xl font-extrabold text-ink mt-0.5">{analyticsStats.uniqueClicksCount}</span>
                    </Card>
                  </div>

                  <Card compact className="bg-surface-soft border border-hairline p-4 flex flex-col gap-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">Cliques ao Longo do Tempo</h4>
                    <ClickTimelineChart clicks={analyticsData.clicks} />
                  </Card>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Card compact className="bg-surface-soft border border-hairline p-4 flex flex-col gap-3">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted px-1">Navegadores</h4>
                      <DonutChart segments={analyticsStats.browsers.map(b => ({ name: b.name, count: b.count }))} size={140} />
                    </Card>
                    <Card compact className="bg-surface-soft border border-hairline p-4 flex flex-col gap-3">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted px-1">Sistemas Operacionais</h4>
                      <DonutChart segments={analyticsStats.systems.map(s => ({ name: s.name, count: s.count }))} size={140} />
                    </Card>
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
