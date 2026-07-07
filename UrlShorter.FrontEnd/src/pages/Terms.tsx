import { Link } from 'react-router-dom'

export function Terms() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:py-16 flex flex-col gap-8 animate-fade-in">
      <header className="flex flex-col gap-3 text-center">
        <span className="badge self-center bg-primary/10 text-primary border border-primary/20 dark:border-transparent">
          Legal
        </span>
        <h1 className="text-3xl sm:text-display-sm text-ink font-light tracking-tight">
          Termos de Uso
        </h1>
        <p className="text-sm text-muted">
          Ultima atualizacao: 06 de julho de 2026
        </p>
      </header>

      <div className="prose prose-sm max-w-none text-body leading-relaxed flex flex-col gap-6">
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-ink">1. Aceitacao dos Termos</h2>
          <p>
            Ao acessar ou utilizar o servico <strong>UrlShorter</strong>, voce concorda com estes Termos de Uso. Se nao concordar com algum termo, nao utilize o servico.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-ink">2. Descricao do Servico</h2>
          <p>
            O UrlShorter e um encurtador de URLs que permite criar links curtos a partir de enderecos web. O servico oferece autenticacao, analytics de cliques e verificacao de seguranca contra dominios maliciosos.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-ink">3. Cadastro</h2>
          <p>
            Para utilizar funcionalidades completas, e necessario criar uma conta com nome, e-mail valido e senha. Voce e responsavel pela seguranca da sua conta e por todas as atividades realizadas nela.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-ink">4. Uso Aceitavel</h2>
          <p>Ao utilizar o servico, voce concorda em NAO:</p>
          <ul className="list-disc list-inside ml-4 flex flex-col gap-1">
            <li>Encurtar URLs que contenham malware, phishing, ou conteudo ilegal.</li>
            <li>Utilizar o servico para spam ou propagacao de conteudo nao solicitado.</li>
            <li>Tentar contornar limites de uso ou controles de seguranca.</li>
            <li>Utilizar o servico para atividades que violem leis ou regulamentos aplicaveis.</li>
            <li>Compartilhar credenciais de acesso com terceiros.</li>
          </ul>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-ink">5. Propriedade Intelectual</h2>
          <p>
            O codigo-fonte do servico e disponibilizado como projeto aberto. O servico em si e fornecido "como esta", sem garantias de disponibilidade ininterrupta.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-ink">6. Disponibilidade e Limitacoes</h2>
          <p>
            O servico e hospedado em infraestrutura pessoal (self-hosted). Nao garantimos disponibilidade de 100% do tempo. URLs criadas como visitante (sem conta) possuem expiracao automatica de 1 dia. Usuarios autenticados podem configurar expiracao de ate 365 dias.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-ink">7. Protecao de Dados</h2>
          <p>
            O tratamento dos seus dados pessoais e regido pela nossa{' '}
            <Link to="/privacy" className="text-primary hover:underline font-medium">
              Politica de Privacidade
            </Link>
            , que integra estes Termos de Uso.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-ink">8. Exclusao de Conta</h2>
          <p>
            Voce pode solicitar a exclusao da sua conta e dados pessoais a qualquer momento. Apos a exclusao, seus dados serao anonimizados e nao poderao ser recuperados.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-ink">9. Alteracoes nos Termos</h2>
          <p>
            Reservamo-nos o direito de alterar estes Termos a qualquer momento. O uso continuado do servico apos alteracoes constitui aceitacao das mudancas.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-ink">10. Contato</h2>
          <p>
            Em caso de duvidas sobre estes Termos, entre em contato com o responsavel pelo projeto.
          </p>
        </section>
      </div>

      <div className="flex justify-center gap-4 mt-4">
        <Link to="/" className="text-sm text-muted hover:text-ink transition-colors font-medium">
          Voltar ao Inicio
        </Link>
        <Link to="/privacy" className="text-sm text-primary hover:underline font-medium">
          Politica de Privacidade
        </Link>
      </div>
    </article>
  )
}
