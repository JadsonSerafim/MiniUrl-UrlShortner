import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { exportUserData, deleteAccount, type UserDataExport } from '../services/auth.service'
import { useAuth } from '../contexts/AuthContext'
import Card from '../components/Card'
import Button from '../components/Button'

export function Settings() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')

  const exportQuery = useQuery({
    queryKey: ['userData'],
    queryFn: exportUserData,
    enabled: false,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      logout()
      navigate('/login', { replace: true })
    },
  })

  const handleExport = () => {
    exportQuery.refetch()
  }

  const handleDownloadJson = (data: UserDataExport) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `urlshorter-dados-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDelete = () => {
    if (deleteConfirmText === 'EXCLUIR') {
      deleteMutation.mutate()
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 flex flex-col gap-8 animate-fade-in">
      <header className="flex flex-col gap-2">
        <span className="text-[10px] uppercase font-semibold tracking-wider text-primary">
          Configuracoes
        </span>
        <h1 className="text-2xl font-bold text-ink">Gerenciar Dados</h1>
        <p className="text-sm text-muted">
          Exporte ou exclua seus dados pessoais conforme a LGPD.
        </p>
      </header>

      <Card className="p-6 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-ink">Exportar Meus Dados</h2>
          <p className="text-sm text-muted">
            Baixe uma copia de todos os seus dados armazenados, incluindo perfil e URLs criadas.
          </p>
        </div>

        {exportQuery.data && (
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-sm text-green-600 dark:text-green-400">
            Dados exportados com sucesso! Clique em "Baixar JSON" para salvar.
          </div>
        )}

        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={handleExport}
            loading={exportQuery.isFetching}
          >
            Buscar Dados
          </Button>
          {exportQuery.data && (
            <Button
              variant="primary"
              onClick={() => handleDownloadJson(exportQuery.data!)}
            >
              Baixar JSON
            </Button>
          )}
        </div>

        {exportQuery.data && (
          <div className="mt-2 p-4 rounded-lg bg-surface-soft border border-hairline text-xs text-muted font-mono overflow-auto max-h-60">
            <pre>{JSON.stringify(exportQuery.data, null, 2)}</pre>
          </div>
        )}
      </Card>

      <Card className="p-6 border border-red-500/20 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-red-500">Excluir Minha Conta</h2>
          <p className="text-sm text-muted">
            Esta acao ira anonimizar seus dados pessoais e desativar sua conta permanentemente.
            Suas URLs encurtadas serao mantidas, mas seus dados de identificacao serao removidos.
          </p>
        </div>

        {!showDeleteConfirm ? (
          <Button
            variant="secondary"
            onClick={() => setShowDeleteConfirm(true)}
            className="self-start border-red-500/30 text-red-500 hover:bg-red-500/10"
          >
            Excluir Conta
          </Button>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted">
              Para confirmar, digite <strong className="text-red-500">EXCLUIR</strong> abaixo:
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Digite EXCLUIR"
              className="px-3 py-2 rounded-lg border border-hairline bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30"
            />
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setDeleteConfirmText('')
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleDelete}
                loading={deleteMutation.isPending}
                disabled={deleteConfirmText !== 'EXCLUIR'}
                className="bg-red-500 hover:bg-red-600"
              >
                Confirmar Exclusão
              </Button>
            </div>
            {deleteMutation.isError && (
              <p className="text-sm text-red-500">Erro ao excluir conta. Tente novamente.</p>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}
