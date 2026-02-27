import { User, MapPin } from "lucide-react";

// 1. Definição exata dos seus status e sub-status
export type CardStatus =
    | 'curadoria'       // Coluna 1: Chegou agora
    | 'aberta'          // Coluna 2: Aprovada, esperando fornecedores
    | 'negociacao'      // Coluna 3: Já tem match (pelo menos 1)
    | 'fechada_match'   // Coluna 4 (Verde): Sucesso
    | 'fechada_fora'    // Coluna 4 (Laranja): Comprou fora
    | 'fechada_s_ret'   // Coluna 4 (Vermelho): Sem retorno
    | 'fechada_s_mat';  // Coluna 4 (Amarelo): Sem match encontrado

interface AdminCardProps {
    id: string;
    data: string;
    titulo: string;
    cliente: string;
    uf: string;
    urgencia?: 'Normal' | 'Urgente'; // Opcional
    status: CardStatus;
    stats?: { enviados: number; respostas: number }; // Só usado na 'negociacao'
}

export function AdminCard({
    id,
    data,
    titulo,
    cliente,
    uf,
    urgencia = 'Normal',
    status,
    stats
}: AdminCardProps) {

    // 2. Configuração Visual dos Status "Fechados"
    const getVisualConfig = () => {
        switch (status) {
            case 'fechada_match':
                return { borderColor: '#10B981', label: 'MATCH REALIZADO', dotColor: '#10B981', bgColor: '#ECFDF5' }; // Verde
            case 'fechada_fora':
                return { borderColor: '#FF9900', label: 'COMPROU FORA', dotColor: '#FF9900', bgColor: '#FFF7ED' }; // Laranja
            case 'fechada_s_ret':
                return { borderColor: '#EF4444', label: 'SEM RETORNO', dotColor: '#EF4444', bgColor: '#FEF2F2' }; // Vermelho
            case 'fechada_s_mat':
                return { borderColor: '#F6FF00', label: 'SEM MATCH', dotColor: '#F6FF00', bgColor: '#FEFCE8' }; // Amarelo
            default:
                return { borderColor: '#E2E8F0', label: '', dotColor: '', bgColor: 'white' }; // Padrão (Cinza)
        }
    };

    const config = getVisualConfig();
    const isClosed = status.startsWith('fechada');

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

        switch (status) {
            case 'curadoria':
                return (
                    <div className="mt-3 flex gap-2">
                        <button className="flex-1 border border-gray-200 text-gray-500 hover:bg-gray-50 py-1.5 rounded text-xs font-bold uppercase transition-colors">
                            Ver
                        </button>
                        <button className="flex-1 bg-pedraum-orange text-white hover:bg-orange-600 py-1.5 rounded text-xs font-bold uppercase transition-colors shadow-sm">
                            Aprovar
                        </button>
                    </div>
                );
            case 'aberta':
                return (
                    <div className="mt-3 flex gap-2">
                        <button className="flex-1 border border-orange-200 text-orange-500 hover:bg-orange-50 py-1.5 rounded text-xs font-bold uppercase transition-colors">
                            Editar
                        </button>
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

                {urgencia === 'Urgente' && (
                    <span className="px-1.5 py-0.5 rounded bg-red-50 text-[10px] font-bold text-red-500 uppercase border border-red-100">
                        🚨 Urgente
                    </span>
                )}
            </div>

            {/* Rodapé Dinâmico */}
            {renderFooter()}

        </div>
    );
}