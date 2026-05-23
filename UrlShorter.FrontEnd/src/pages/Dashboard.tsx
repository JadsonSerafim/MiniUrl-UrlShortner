import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../contexts/AuthContext'
import UrlShortener from '../components/UrlShortener'
import RecentLinksList from '../components/RecentLinksList'
import { getUserUrls } from '../services/url.service'

export function Dashboard() {
  const { user } = useAuth()

  const { data: urls = [], isLoading } = useQuery({
    queryKey: ['userUrls', user?.id],
    queryFn: () => getUserUrls(user!.id),
    enabled: !!user?.id,
  })

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 flex flex-col gap-10">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-medium tracking-tight text-ink">Dashboard</h1>
        <p className="text-sm text-body mt-1">
          Bem-vindo de volta, <span className="text-ink font-semibold">{user?.name}</span>. Encurte seus links abaixo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">

        <div className="md:col-span-2 flex flex-col gap-6">
          <UrlShortener
            userId={user?.id}
            label="Encurtar um novo link"
            buttonText="Encurtar"
          />
        </div>

        <div>
          {isLoading ? (
            <div className="flex flex-col gap-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted px-1">
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
    </section>
  )
}
