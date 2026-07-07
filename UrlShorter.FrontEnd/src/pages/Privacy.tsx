import { Link } from 'react-router-dom'

export function Privacy() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:py-16 flex flex-col gap-8 animate-fade-in">
      <header className="flex flex-col gap-3 text-center">
        <span className="badge self-center bg-primary/10 text-primary border border-primary/20 dark:border-transparent">
          Legal
        </span>
        <h1 className="text-3xl sm:text-display-sm text-ink font-light tracking-tight">
          Politica de Privacidade
        </h1>
        <p className="text-sm text-muted">
          Ultima atualizacao: 06 de julho de 2026
        </p>
      </header>

      <div className="prose prose-sm max-w-none text-body leading-relaxed flex flex-col gap-6">
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-ink">1. Introducao</h2>
          <p>
            Esta Politica de Privacidade descreve como o <strong>UrlShorter</strong> ("servico") coleta, utiliza, armazena e protege dados pessoais de usuarios, em conformidade com a Lei Geral de Protecao de Dados (LGPD - Lei nº 13.709/2018).
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-ink">2. Dados Coletados</h2>
          <p>Coletamos os seguintes dados pessoais:</p>
          <ul className="list-disc list-inside ml-4 flex flex-col gap-1">
            <li><strong>Cadastro:</strong> nome, endereco de e-mail e senha (armazenada em formato hash irrecuperavel via BCrypt).</li>
            <li><strong>Analytics de cliques:</strong> endereco IP (anonimizado - ultimo octeto zerado), user-agent do navegador e data/hora do acesso.</li>
            <li><strong>Sessao:</strong> tokens JWT armazenados em cookies HttpOnly para autenticacao.</li>
          </ul>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-ink">3. Finalidade do Tratamento</h2>
          <p>Os dados sao tratados para as seguintes finalidades:</p>
          <ul className="list-disc list-inside ml-4 flex flex-col gap-1">
            <li><strong>Execucao do servico:</strong> criacao e gerenciamento de contas, encurtamento de URLs e autenticacao.</li>
            <li><strong>Analytics:</strong> fornecer ao proprietario da URL estatisticas de acessos (data, navegador, sistema operacional) para fins de analise.</li>
            <li><strong>Seguranca:</strong> controle de abuso (rate limiting), verificacao de URLs contra dominios maliciosos e protecao contra ataques.</li>
            <li><strong>Comunicacao:</strong> envio de e-mails para redefinicao de senha quando solicitado.</li>
          </ul>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-ink">4. Base Legal</h2>
          <p>O tratamento dos dados e fundamentado em:</p>
          <ul className="list-disc list-inside ml-4 flex flex-col gap-1">
            <li><strong>Execucao de contrato</strong> (Art. 7º, V da LGPD): necessario para prestacao do servico solicitado pelo usuario.</li>
            <li><strong>Consentimento</strong> (Art. 7º, I da LGPD): para comunicacoes de marketing e funcionalidades nao essenciais.</li>
            <li><strong>Legitimo interesse</strong> (Art. 7º, IX da LGPD): para seguranca, prevencao de fraude e melhoria do servico.</li>
          </ul>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-ink">5. Compartilhamento de Dados</h2>
          <p>
            Os dados pessoais <strong>nao sao compartilhados</strong> com terceiros para fins comerciais. Servicos de terceiros utilizados para operacao tecnica incluem:
          </p>
          <ul className="list-disc list-inside ml-4 flex flex-col gap-1">
            <li><strong>Google Safe Browsing:</strong> verificacao de seguranca de URLs (apenas a URL e enviada, sem dados pessoais).</li>
            <li><strong>Servidor SMTP:</strong> envio de e-mails de redefinicao de senha.</li>
          </ul>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-ink">6. Retencao de Dados</h2>
          <p>Os dados sao mantidos pelo tempo necessario para cumprir as finalidades:</p>
          <ul className="list-disc list-inside ml-4 flex flex-col gap-1">
            <li><strong>Conta do usuario:</strong> enquanto a conta estiver ativa, ou ate a solicitacao de exclusao.</li>
            <li><strong>Logs de clique:</strong> por ate 365 dias apos o registro.</li>
            <li><strong>URLs expiradas:</strong> removidas automaticamente apos 30 dias da expiracao.</li>
            <li><strong>Tokens de redefinicao:</strong> expiram em 15 minutos e sao invalidados apos uso.</li>
          </ul>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-ink">7. Direitos do Titular</h2>
          <p>De acordo com o Art. 18 da LGPD, o usuario tem direito a:</p>
          <ul className="list-disc list-inside ml-4 flex flex-col gap-1">
            <li>Confirmar a existencia de tratamento de dados.</li>
            <li>Acessar os dados pessoais tratados.</li>
            <li>Corrigir dados incompletos ou desatualizados.</li>
            <li>Solicitar a anonimizacao, bloqueio ou eliminacao de dados desnecessarios.</li>
            <li>Solicitar a portabilidade dos dados.</li>
            <li>Solicitar a eliminacao dos dados tratados com consentimento.</li>
            <li>Revogar o consentimento a qualquer momento.</li>
          </ul>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-ink">8. Seguranca dos Dados</h2>
          <p>Adotamos medidas tecnicas e administrativas para proteger os dados:</p>
          <ul className="list-disc list-inside ml-4 flex flex-col gap-1">
            <li>Senhas armazenadas com hash BCrypt (irrecuperaveis).</li>
            <li>Tokens de autenticacao em cookies HttpOnly com flag Secure.</li>
            <li>Anonimizacao automatica de enderecos IP.</li>
            <li>Cabecalhos de seguranca (CSP, X-Frame-Options, X-Content-Type-Options).</li>
            <li>Comunicacao criptografada via HTTPS.</li>
          </ul>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-ink">9. Contato</h2>
          <p>
            Para exercer seus direitos ou esclarecer duvidas sobre esta politica, entre em contato atraves do e-mail do responsavel pelo projeto.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-ink">10. Alteracoes</h2>
          <p>
            Esta politica pode ser atualizada a qualquer momento. Recomendamos a consulta periodica desta pagina.
          </p>
        </section>
      </div>

      <div className="flex justify-center gap-4 mt-4">
        <Link to="/" className="text-sm text-muted hover:text-ink transition-colors font-medium">
          Voltar ao Inicio
        </Link>
        <Link to="/terms" className="text-sm text-primary hover:underline font-medium">
          Termos de Uso
        </Link>
      </div>
    </article>
  )
}
