import { User, MapPin } from "lucide-react";
import Link from "next/link";
import { StatusDemanda, UrgenciaDemanda } from "@/src/types";

// Vamos estender o StatusDemanda do nosso barril com os "status fantasmas" de fechamento
type CardStatus = StatusDemanda | 'fechada_match' | 'fechada_fora' | 'fechada_s_ret' | 'fechada_s_mat' | string;

interface AdminCardProps {
    id: string; // O ID bonito (ex: PRT-123)
    demandaIdReal: string; // O ID feio do Firebase para a URL
    data: string;
    titulo: string;
    cliente: string;
    uf: string;
    urgencia?: UrgenciaDemanda | string;
    status: CardStatus;
    stats?: { enviados: number; respostas: number };
}

export function AdminCard({
    id,
    demandaIdReal,
    data,
    titulo,
    cliente,
    uf,
    urgencia = 'normal',
    status,
    stats
}: AdminCardProps) {

    // 1. Tratamento seguro do status para evitar erro de string undefined
    const safeStatus = status ? status.toString().toLowerCase() : '';
    const isClosed = safeStatus.startsWith('fechada') || safeStatus === 'resolvida';

    // 2. Configuração Visual dos Status "Fechados"
    const getVisualConfig = () => {
        switch (safeStatus) {
            case 'fechada_match':
                return { borderColor: '#10B981', label: 'MATCH REALIZADO', dotColor: '#10B981', bgColor: '#ECFDF5' };
            case 'fechada_fora':
                return { borderColor: '#FF9900', label: 'COMPROU FORA', dotColor: '#FF9900', bgColor: '#FFF7ED' };
            case 'fechada_s_ret':
                return { borderColor: '#EF4444', label: 'SEM RETORNO', dotColor: '#EF4444', bgColor: '#FEF2F2' };
            case 'fechada_s_mat':
                return { borderColor: '#F6FF00', label: 'SEM MATCH', dotColor: '#F6FF00', bgColor: '#FEFCE8' };
            default:
                return { borderColor: '#E2E8F0', label: 'FINALIZADA', dotColor: '#9ca3af', bgColor: '#F3F4F6' };
        }
    };

    const config = getVisualConfig();

    // 3. Renderização do Rodapé (Ações)
    const renderFooter = () => {
        if (isClosed) {
            return (
                <div
                    className="mt-3 w-full py-2 rounded-md flex items-center justify-center gap-2 font-bold text-[10px] uppercase tracking-wide border border-transparent"
                    style={{ backgroundColor: config.bgColor, color: config.dotColor, borderColor: config.borderColor }}
                >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.dotColor }} />
                    {config.label}
                </div>
            );
        }

        switch (safeStatus) {
            case 'curadoria':
                return (
                    <div className="mt-3 flex gap-2">
                        <Link
                            href={`/admin/demandas/${demandaIdReal}`}
                            className="flex-1 border border-gray-200 text-gray-500 hover:bg-gray-50 py-1.5 rounded text-xs font-bold uppercase transition-colors text-center inline-block leading-tight align-middle"
                        >
                            Ver
                        </Link>
                        <button className="flex-1 bg-pedraum-orange text-white hover:bg-orange-600 py-1.5 rounded text-xs font-bold uppercase transition-colors shadow-sm">
                            Aprovar
                        </button>
                    </div>
                );
            case 'aberta':
                return (
                    <div className="mt-3 flex gap-2">
                        <Link
                            href={`/admin/demandas/${demandaIdReal}`}
                            className="flex-1 border border-orange-200 text-orange-500 hover:bg-orange-50 py-1.5 rounded text-xs font-bold uppercase transition-colors text-center inline-block leading-tight align-middle"
                        >
                            Editar
                        </Link>
                        <button className="flex-1 bg-pedraum-dark text-white hover:bg-slate-800 py-1.5 rounded text-xs font-bold uppercase transition-colors shadow-sm">
                            Match
                        </button>
                    </div>
                );
            case 'negociacao':
                return (
                    <div className="mt-3 flex justify-between items-center text-xs font-medium text-gray-600 bg-gray-50 px-3 py-2 rounded">
                        <span className="flex items-center gap-1">
                            📨 <b>{stats?.enviados || 0}</b> Env.
                        </span>
                        <div className="h-3 w-px bg-gray-300"></div>
                        <span className="flex items-center gap-1 text-pedraum-dark">
                            💬 <b>{stats?.respostas || 0}</b> Resp.
                        </span>
                    </div>
                );
            default:
                return null;
        }
    };

    // 4. Tratamento seguro da Urgência
    const isUrgente = urgencia?.toString().toLowerCase() === 'urgente';
    const isCritico = urgencia?.toString().toLowerCase() === 'critico';

    return (
        <div
            className="bg-white rounded-xl p-4 shadow-sm border-l-4 w-full transition-shadow hover:shadow-md"
            style={{ borderLeftColor: isClosed ? config.borderColor : '#E2E8F0' }}
        >
            {/* Cabeçalho */}
            <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-gray-400">{id}</span>
                <span className="text-[10px] font-medium text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
                    {data}
                </span>
            </div>

            {/* Título e Cliente */}
            <div className="mb-3">
                <h3 className="font-bold text-gray-800 text-sm leading-tight mb-1">
                    {titulo}
                </h3>
                <div className="flex items-center gap-1.5">
                    <User className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500 truncate">{cliente}</span>
                </div>
            </div>

            {/* Tags (UF e Urgência) */}
            <div className="flex gap-2 mb-3">
                <span className="px-1.5 py-0.5 rounded border border-gray-100 bg-gray-50 text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5" /> {uf}
                </span>

                {(isUrgente || isCritico) && (
                    <span className="px-1.5 py-0.5 rounded bg-red-50 text-[10px] font-bold text-red-500 uppercase border border-red-100">
                        {isCritico ? '🚨 Crítico' : '🚨 Urgente'}
                    </span>
                )}
            </div>

            {/* Rodapé Dinâmico */}
            {renderFooter()}

        </div>
    );
}