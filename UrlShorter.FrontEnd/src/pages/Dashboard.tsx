import { useAuth } from '../contexts/AuthContext'
import type { UrlItem } from '../types'
import UrlShortener from '../components/UrlShortener'
import RecentLinksList from '../components/RecentLinksList'

// URLs Fictícias (Mock) para o histórico
const MOCK_URLS: UrlItem[] = [
  {
    shortCode: 'xK92f',
    originalUrl: 'https://github.com/JadsonSerafim/UrlShorter/blob/main/DESIGN.md',
    createdAt: '22 de mai. de 2026',
  },
  {
    shortCode: 'yT41p',
    originalUrl: 'https://developer.coinbase.com/docs/cloud/styling-specifications',
    createdAt: '21 de mai. de 2026',
  },
  {
    shortCode: 'aB88z',
    originalUrl: 'https://tailwindcss.com/docs/customizing-colors-and-spacing',
    createdAt: '19 de mai. de 2026',
  },
]

export function Dashboard() {
  const { user } = useAuth()

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
        
        {/* Lado Esquerdo/Centro: Encurtador (2/3 colunas) */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <UrlShortener
            userId={user?.id}
            label="Encurtar um novo link"
            buttonText="Encurtar Link"
          />
        </div>

        {/* Lado Direito: Histórico Mockado (1/3 coluna) */}
        <div>
          <RecentLinksList urls={MOCK_URLS} />
        </div>

      </div>
    </section>
  )
}
