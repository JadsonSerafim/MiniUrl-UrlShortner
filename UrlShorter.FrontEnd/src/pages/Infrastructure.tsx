import { useState } from 'react'
import LinkButton from '../components/LinkButton'
import Card from '../components/Card'

interface InfrastructureProps {
  showHeader?: boolean
}

export function Infrastructure({ showHeader = true }: InfrastructureProps) {
  const [activeImage, setActiveImage] = useState<string | null>(null)
  const containers = [
    {
      name: 'PostgreSQL',
      description: 'Banco de dados relacional que atua armazenando os dados de forma persistente, garantindo a consistência e integridade referencial das informações.',
      type: 'Database',
      logo: (
        <svg className="w-5 h-5 text-[#4169E1]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.5594 14.7228a.5269.5269 0 0 0-.0563-.1191c-.139-.2632-.4768-.3418-1.0074-.2321-1.6533.3411-2.2935.1312-2.5256-.0191 1.342-2.0482 2.445-4.522 3.0411-6.8297.2714-1.0507.7982-3.5237.1222-4.7316a1.5641 1.5641 0 0 0-.1509-.235C21.6931.9086 19.8007.0248 17.5099.0005c-1.4947-.0158-2.7705.3461-3.1161.4794a9.449 9.449 0 0 0-.5159-.0816 8.044 8.044 0 0 0-1.3114-.1278c-1.1822-.0184-2.2038.2642-3.0498.8406-.8573-.3211-4.7888-1.645-7.2219.0788C.9359 2.1526.3086 3.8733.4302 6.3043c.0409.818.5069 3.334 1.2423 5.7436.4598 1.5065.9387 2.7019 1.4334 3.582.553.9942 1.1259 1.5933 1.7143 1.7895.4474.1491 1.1327.1441 1.8581-.7279.8012-.9635 1.5903-1.8258 1.9446-2.2069.4351.2355.9064.3625 1.39.3772a.0569.0569 0 0 0 .0004.0041 11.0312 11.0312 0 0 0-.2472.3054c-.3389.4302-.4094.5197-1.5002.7443-.3102.064-1.1344.2339-1.1464.8115-.0025.1224.0329.2309.0919.3268.2269.4231.9216.6097 1.015.6331 1.3345.3335 2.5044.092 3.3714-.6787-.017 2.231.0775 4.4174.3454 5.0874.2212.5529.7618 1.9045 2.4692 1.9043.2505 0 .5263-.0291.8296-.0941 1.7819-.3821 2.5557-1.1696 2.855-2.9059.1503-.8707.4016-2.8753.5388-4.1012.0169-.0703.0357-.1207.057-.1362.0007-.0005.0697-.0471.4272.0307a.3673.3673 0 0 0 .0443.0068l.2539.0223.0149.001c.8468.0384 1.9114-.1426 2.5312-.4308.6438-.2988 1.8057-1.0323 1.5951-1.6698zM2.371 11.8765c-.7435-2.4358-1.1779-4.8851-1.2123-5.5719-.1086-2.1714.4171-3.6829 1.5623-4.4927 1.8367-1.2986 4.8398-.5408 6.108-.13-.0032.0032-.0066.0061-.0098.0094-2.0238 2.044-1.9758 5.536-1.9708 5.7495-.0002.0823.0066.1989.0162.3593.0348.5873.0996 1.6804-.0735 2.9184-.1609 1.1504.1937 2.2764.9728 3.0892.0806.0841.1648.1631.2518.2374-.3468.3714-1.1004 1.1926-1.9025 2.1576-.5677.6825-.9597.5517-1.0886.5087-.3919-.1307-.813-.5871-1.2381-1.3223-.4796-.839-.9635-2.0317-1.4155-3.5126zm6.0072 5.0871c-.1711-.0428-.3271-.1132-.4322-.1772.0889-.0394.2374-.0902.4833-.1409 1.2833-.2641 1.4815-.4506 1.9143-1.0002.0992-.126.2116-.2687.3673-.4426a.3549.3549 0 0 0 .0737-.1298c.1708-.1513.2724-.1099.4369-.0417.156.0646.3078.26.3695.4752.0291.1016.0619.2945-.0452.4444-.9043 1.2658-2.2216 1.2494-3.1676 1.0128zm2.094-3.988-.0525.141c-.133.3566-.2567.6881-.3334 1.003-.6674-.0021-1.3168-.2872-1.8105-.8024-.6279-.6551-.9131-1.5664-.7825-2.5004.1828-1.3079.1153-2.4468.079-3.0586-.005-.0857-.0095-.1607-.0122-.2199.2957-.2621 1.6659-.9962 2.6429-.7724.4459.1022.7176.4057.8305.928.5846 2.7038.0774 3.8307-.3302 4.7363-.084.1866-.1633.3629-.2311.5454zm7.3637 4.5725c-.0169.1768-.0358.376-.0618.5959l-.146.4383a.3547.3547 0 0 0-.0182.1077c-.0059.4747-.054.6489-.115.8693-.0634.2292-.1353.4891-.1794 1.0575-.11 1.4143-.8782 2.2267-2.4172 2.5565-1.5155.3251-1.7843-.4968-2.0212-1.2217a6.5824 6.5824 0 0 0-.0769-.2266c-.2154-.5858-.1911-1.4119-.1574-2.5551.0165-.5612-.0249-1.9013-.3302-2.6462.0044-.2932.0106-.5909.019-.8918a.3529.3529 0 0 0-.0153-.1126 1.4927 1.4927 0 0 0-.0439-.208c-.1226-.4283-.4213-.7866-.7797-.9351-.1424-.059-.4038-.1672-.7178-.0869.067-.276.1831-.5875.309-.9249l.0529-.142c.0595-.16.134-.3257.213-.5012.4265-.9476 1.0106-2.2453.3766-5.1772-.2374-1.0981-1.0304-1.6343-2.2324-1.5098-.7207.0746-1.3799.3654-1.7088.5321a5.6716 5.6716 0 0 0-.1958.1041c.0918-1.1064.4386-3.1741 1.7357-4.4823a4.0306 4.0306 0 0 1 .3033-.276.3532.3532 0 0 0 .1447-.0644c.7524-.5706 1.6945-.8506 2.802-.8325.4091.0067.8017.0339 1.1742.081 1.939.3544 3.2439 1.4468 4.0359 2.3827.8143.9623 1.2552 1.9315 1.4312 2.4543-1.3232-.1346-2.2234.1268-2.6797.779-.9926 1.4189.543 4.1729 1.2811 5.4964.1353.2426.2522.4522.2889.5413.2403.5825.5515.9713.7787 1.2552.0696.087.1372.1714.1885.245-.4008.1155-1.1208.3825-1.0552 1.717-.0123.1563-.0423.4469-.0834.8148-.0461.2077-.0702.4603-.0994.7662zm.8905-1.6211c-.0405-.8316.2691-.9185.5967-1.0105a2.8566 2.8566 0 0 0 .135-.0406 1.202 1.202 0 0 0 .1342.103c.5703.3765 1.5823.4213 3.0068.1344-.2016.1769-.5189.3994-.9533.6011-.4098.1903-1.0957.333-1.7473.3636-.7197.0336-1.0859-.0807-1.1721-.151zm.5695-9.2712c-.0059.3508-.0542.6692-.1054 1.0017-.055.3576-.112.7274-.1264 1.1762-.0142.4368.0404.8909.0932 1.3301.1066.887.216 1.8003-.2075 2.7014a3.5272 3.5272 0 0 1-.1876-.3856c-.0527-.1276-.1669-.3326-.3251-.6162-.6156-1.1041-2.0574-3.6896-1.3193-4.7446.3795-.5427 1.3408-.5661 2.1781-.463zm.2284 7.0137a12.3762 12.3762 0 0 0-.0853-.1074l-.0355-.0444c.7262-1.1995.5842-2.3862.4578-3.4385-.0519-.4318-.1009-.8396-.0885-1.2226.0129-.4061.0666-.7543.1185-1.0911.0639-.415.1288-.8443.1109-1.3505.0134-.0531.0188-.1158.0118-.1902-.0457-.4855-.5999-1.938-1.7294-3.253-.6076-.7073-1.4896-1.4972-2.6889-2.0395.5251-.1066 1.2328-.2035 2.0244-.1859 2.0515.0456 3.6746.8135 4.8242 2.2824a.908.908 0 0 1 .0667.1002c.7231 1.3556-.2762 6.2751-2.9867 10.5405zm-8.8166-6.1162c-.025.1794-.3089.4225-.6211.4225a.5821.5821 0 0 1-.0809-.0056c-.1873-.026-.3765-.144-.5059-.3156-.0458-.0605-.1203-.178-.1055-.2844.0055-.0401.0261-.0985.0925-.1488.1182-.0894.3518-.1226.6096-.0867.3163.0441.6426.1938.6113.4186zm7.9305-.4114c.0111.0792-.049.201-.1531.3102-.0683.0717-.212.1961-.4079.2232a.5456.5456 0 0 1-.075.0052c-.2935 0-.5414-.2344-.5607-.3717-.024-.1765.2641-.3106.5611-.352.297-.0414.6111.0088.6356.1851z" />
        </svg>
      )
    },
    {
      name: 'Redis',
      description: 'Banco de dados em memória de alta performance, utilizado para cache rápido, controle de sessões, rate limiting e gerenciamento de filas.',
      type: 'Cache / Memory Store / Queues',
      logo: (
        <svg className="w-5 h-5 text-[#FF4438]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22.71 13.145c-1.66 2.092-3.452 4.483-7.038 4.483-3.203 0-4.397-2.825-4.48-5.12.701 1.484 2.073 2.685 4.214 2.63 4.117-.133 6.94-3.852 6.94-7.239 0-4.05-3.022-6.972-8.268-6.972-3.752 0-8.4 1.428-11.455 3.685C2.59 6.937 3.885 9.958 4.35 9.626c2.648-1.904 4.748-3.13 6.784-3.744C8.12 9.244.886 17.05 0 18.425c.1 1.261 1.66 4.648 2.424 4.648.232 0 .431-.133.664-.365a100.49 100.49 0 0 0 5.54-6.765c.222 3.104 1.748 6.898 6.014 6.898 3.819 0 7.604-2.756 9.33-8.965.2-.764-.73-1.361-1.261-.73zm-4.349-5.013c0 1.959-1.926 2.922-3.685 2.922-.941 0-1.664-.247-2.235-.568 1.051-1.592 2.092-3.225 3.21-4.973 1.972.334 2.71 1.43 2.71 2.619z" />
        </svg>
      )
    },
    {
      name: 'Nginx',
      description: 'Proxy reverso principal que gerencia o tráfego HTTP/HTTPS, faz a terminação SSL e direciona as requisições para a API e o Frontend.',
      type: 'Web Server / Proxy',
      logo: (
        <svg className="w-5 h-5 text-[#009639]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0L1.605 6v12L12 24l10.395-6V6L12 0zm6 16.59c0 .705-.646 1.29-1.529 1.29-.631 0-1.351-.255-1.801-.81l-6-7.141v6.66c0 .721-.57 1.29-1.274 1.29H7.32c-.721 0-1.29-.6-1.29-1.29V7.41c0-.705.63-1.29 1.5-1.29.646 0 1.38.255 1.83.81l5.97 7.141V7.41c0-.721.6-1.29 1.29-1.29h.075c.72 0 1.29.6 1.29 1.29v9.18H18z" />
        </svg>
      )
    },
    {
      name: 'Mailpit',
      description: 'Ferramenta de testes de e-mail e servidor SMTP fictício, capturando e-mails de recuperação de senha gerados pela aplicação.',
      type: 'SMTP Testing',
      logo: (
        <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      name: 'MiniUrl (API & Frontend)',
      description: 'Esta própria aplicação encurtadora de URLs rodando em containers Docker dedicados integrados à rede interna.',
      type: 'Application Container',
      logo: (
        <svg className="w-5 h-5 text-[#6366F1] fill-none" viewBox="0 0 72 72" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M31.7356,42.1428c-.869,2.5155-1.12,4.3475-1.7985,5.5912a2.1933,2.1933,0,0,1-2.582,1.0226,47.1968,47.1968,0,0,0-6.2064-1.455,2.15,2.15,0,0,1-.6908-.2417c-4.0951-2.2435-8.509-3.4083-9.4579-2.4594a2.3467,2.3467,0,0,0-.7764,2.9644c.7646,2.2938,7.2284,5.2139,8.5651,6.728l5.849,5.8491S31.61,65.0583,35.435,65.0372C47.4984,64.9708,54.9871,49.2418,55,45.4723a21.652,21.652,0,0,0-.2793-3.2872,19.0358,19.0358,0,0,0-.7777-3.0063" />
          <path d="M24.5042,35.6935l-8.5093,2.0318a3.4311,3.4311,0,0,1-4.429-2.0319c-.1935-1.8834.4621-2.4049,1.8585-3.39a6.0112,6.0112,0,0,1,1.1023-.4777l9.6243-3.05a3.6991,3.6991,0,0,1,1.8252-.0553" />
          <line x1="31.7356" x2="24.6377" y1="42.1428" y2="35.7709" />
          <path d="M25.01,28.6125a4.3334,4.3334,0,0,1,2.349.6306,3.4038,3.4038,0,0,1,.787.6513l8.3294,6.694" />
          <path d="M32.4365,29.9218,25.01,15.2084c-.875-2.0782-1.511-3.5464,0-4.687,1.511-1.15,2.9907-.3613,4.141,1.15.156.2047,8.5493,13.0158,11.0839,17.2661v.01" />
          <path d="M48.0929,31.395C46.7086,25.8774,42.0178,10.1967,41.93,9.9724a2.7784,2.7784,0,0,0-3.4342-2.0532c-1.7839.6727-2.02,2.6907-1.7391,4.4594l.9758,6.6879" />
          <path d="M47.4,18.5064c.1188-1.9068.6442-3.596,2.2763-3.7827a2.4638,2.4638,0,0,1,2.5623,1.4977,5.272,5.272,0,0,1,.5568,2.1762c.2324,3.92,1.1653,20.2393,1.1653,20.2393a3.2433,3.2433,0,0,1-.0292.5362" />
          <line x1="39.6751" x2="43.1657" y1="28.0814" y2="33.5938" />
          <circle cx="18" cy="24" r="5.5" fill="currentColor" stroke="none" />
        </svg>
      )
    },
    {
      name: 'Portainer',
      description: 'Interface gráfica de gerenciamento de containers Docker que simplifica a implantação, monitoramento e administração dos serviços e volumes no homelab.',
      type: 'Container Management',
      logo: (
        <svg className="w-5 h-5 text-[#13BEF9]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0L24 6.945v13.89L12 24L0 20.835V6.945L12 0zm0 3.472L3.473 8.334v7.332L12 20.528l8.527-4.862V8.334L12 3.472z" />
        </svg>
      )
    }
  ]

  const content = (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Hardware Card */}
        <Card className="lg:col-span-5 border border-hairline bg-surface/40 p-6 flex flex-col gap-6 rounded-xl">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold text-ink">O Hardware: Orange Pi Zero 3</h2>
            <p className="text-sm text-muted">Single-board computer de baixo consumo usado como servidor doméstico.</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div
              onClick={() => setActiveImage('/orangepi.jpg')}
              className="rounded-lg overflow-hidden border border-hairline bg-canvas aspect-square flex items-center justify-center cursor-zoom-in"
              title="Clique para ampliar a foto da frente"
            >
              <img
                src="/orangepi.jpg"
                alt="Orange Pi Zero 3 - Frente"
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div
              onClick={() => setActiveImage('/orangepi2.jpg')}
              className="rounded-lg overflow-hidden border border-hairline bg-canvas aspect-square flex items-center justify-center cursor-zoom-in"
              title="Clique para ampliar a foto das conexões"
            >
              <img
                src="/orangepi2.jpg"
                alt="Orange Pi Zero 3 - Conexões"
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Especificações</h3>
            <ul className="flex flex-col gap-3 text-sm text-body">
              <li className="flex justify-between border-b border-hairline/50 pb-2">
                <span className="text-muted">Processador</span>
                <span className="font-medium text-ink">Allwinner H618 Quad-core A53</span>
              </li>
              <li className="flex justify-between border-b border-hairline/50 pb-2">
                <span className="text-muted">Memória RAM</span>
                <span className="font-medium text-ink">4GB LPDDR4</span>
              </li>
              <li className="flex justify-between border-b border-hairline/50 pb-2">
                <span className="text-muted">Armazenamento</span>
                <span className="font-medium text-ink">64GB MicroSD + 256GB SSD SATA</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted">Sistema Operacional</span>
                <span className="font-medium text-ink">Debian (Armbian Linux)</span>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-lg bg-primary/5 border border-primary/15 text-xs text-body leading-relaxed">
            Utilizado para hospedar aplicações e estudar infraestrutura. Além de executar serviços como Nginx, GitHub Actions Runner, PostgreSQL, Redis, Mailpit e Cloudflare Tunnel em containers Docker, ele também hospeda aplicações próprias. O ambiente serve como plataforma para experimentação, automação, proxy reverso, integração contínua e aprendizado de tecnologias voltadas à infraestrutura e DevOps.
          </div>
        </Card>

        {/* Containers/Services List */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-ink">Containers Ativos</h2>
            <span className="text-xs text-muted font-medium">{containers.length} containers em execução</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {containers.map((container, i) => (
              <Card key={i} className="border border-hairline bg-surface/30 p-5 flex flex-col gap-3 rounded-lg hover:border-primary/45 transition-colors group">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col">
                    <h3 className="font-semibold text-ink group-hover:text-primary transition-colors">{container.name}</h3>
                    <span className="text-[10px] text-muted font-medium uppercase tracking-wider">{container.type}</span>
                  </div>
                  <div className="w-8 h-8 rounded-lg border border-hairline flex items-center justify-center bg-surface/50 group-hover:bg-primary/5 transition-colors shrink-0">
                    {container.logo}
                  </div>
                </div>
                <p className="text-xs text-body leading-relaxed flex-1">
                  {container.description}
                </p>
              </Card>
            ))}
          </div>


        </div>

      </div>

      {activeImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-canvas/80 backdrop-blur-md animate-fade-in p-4 sm:p-6 cursor-zoom-out"
          onClick={() => setActiveImage(null)}
        >
          <div className="relative max-w-4xl max-h-[85vh] rounded-xl overflow-hidden border border-hairline bg-surface shadow-lg flex items-center justify-center animate-scale-up" onClick={(e) => e.stopPropagation()}>
            <img
              src={activeImage}
              alt="Orange Pi Zero 3 Grande"
              className="max-w-full max-h-[80vh] object-contain"
            />
            <button
              type="button"
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-canvas/80 hover:bg-canvas border border-hairline flex items-center justify-center text-ink hover:text-primary transition-colors cursor-pointer"
              aria-label="Fechar visualização"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )

  if (!showHeader) {
    return content
  }

  return (
    <article className="mx-auto max-w-5xl px-4 py-12 sm:py-16 flex flex-col gap-10 animate-fade-in">

      <header className="flex flex-col gap-4 text-center max-w-3xl mx-auto">
        <span className="badge self-center bg-primary/10 text-primary border border-primary/20 dark:border-transparent">
          Infraestrutura & Homelab
        </span>
        <h1 className="text-3xl sm:text-display-sm text-ink font-light tracking-tight">
          Como o MiniUrl é Hospedado?
        </h1>
        <p className="text-base sm:text-body-md text-body leading-relaxed">
          Um overview do hardware físico próprio e dos containers gerenciados por trás deste projeto de estudos.
        </p>
      </header>

      {content}

      <footer className="flex justify-center mt-6">
        <LinkButton to="/" variant="ghost" size="md">
          ← Voltar para a página inicial
        </LinkButton>
      </footer>

    </article>
  )
}
