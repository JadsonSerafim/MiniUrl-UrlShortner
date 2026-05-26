import type { ClickLog } from '../services/url.service'
import { parseUserAgent } from '../utils/userAgent'

interface ClickHistoryModalProps {
    clicks: ClickLog[]
    shortCode: string
    isOpen: boolean
    onClose: () => void
}

export default function ClickHistoryModal({
    clicks,
    shortCode,
    isOpen,
    onClose,
}: ClickHistoryModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
            <div className="absolute inset-0" onClick={onClose} />

            <div className="relative w-full max-w-2xl max-h-[80vh] flex flex-col rounded-2xl border border-hairline bg-surface text-ink shadow-2xl overflow-hidden animate-slide-up">
                <div className="flex items-center justify-between p-6 border-b border-hairline">
                    <div>
                        <span className="text-[10px] uppercase font-semibold tracking-wider text-primary">
                            Histórico de Cliques
                        </span>
                        <h3 className="text-lg font-bold mt-0.5 text-mono text-ink">{shortCode}</h3>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-surface-soft text-muted hover:text-ink transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="rounded-xl border border-hairline bg-surface-soft overflow-hidden">
                        <div className="max-h-96 overflow-x-auto overflow-y-auto">
                            <table className="w-full min-w-[420px] border-collapse text-left text-xs">
                                <thead className="bg-surface-soft text-muted sticky top-0 font-medium">
                                    <tr>
                                        <th className="p-3">Data/Hora</th>
                                        <th className="p-3">IP (Anônimo)</th>
                                        <th className="p-3">Dispositivo / Browser</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-body">
                                    {clicks && clicks.length > 0 ? (
                                        clicks.map((click, i) => {
                                            const { browser, os } = parseUserAgent(click.userAgent)
                                            return (
                                                <tr key={i} className="hover:bg-surface-soft transition-colors">
                                                    <td className="p-3 text-mono">
                                                        {new Date(click.occurredAt).toLocaleString('pt-BR')}
                                                    </td>
                                                    <td className="p-3 text-mono">{click.ipAddress}</td>
                                                    <td className="p-3 truncate max-w-[200px]" title={click.userAgent}>
                                                        {browser} no {os}
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={3} className="p-8 text-center">
                                                <div className="flex flex-col items-center gap-2 text-muted">
                                                    <svg className="w-8 h-8 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    <p className="text-sm text-muted font-medium">Nenhum clique registrado ainda.</p>
                                                    <p className="text-xs text-muted/70">Compartilhe seu link encurtado para começar a receber acessos.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}