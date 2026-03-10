import Link from "next/link";

interface AdminFornecedorCardProps {
    nome: string;
    leadsVistos: number;
    email: string;
    telefone: string;
    idUsuario: string;
    categoria: string;
}

export function AdminFornecedorCard({
    nome,
    leadsVistos,
    email,
    telefone,
    idUsuario,
    categoria
}: AdminFornecedorCardProps) {

    // Abordagem mais moderna do JavaScript para colocar o "0" na frente
    const leadsFormatados = String(leadsVistos).padStart(2, '0');

    return (
        <div className="bg-white rounded-lg border border-pedraum-orange p-5 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">

            {/* Cabeçalho do Card */}
            <div className="flex justify-between items-start mb-4 gap-3">
                <h3 className="text-lg font-bold text-gray-900 leading-tight line-clamp-2">
                    {nome}
                </h3>
                <div
                    className="bg-pedraum-orange text-gray-900 font-bold text-lg flex items-center justify-center rounded-full shrink-0 shadow-sm"
                    style={{ width: '40px', height: '40px' }}
                >
                    {leadsFormatados}
                </div>
            </div>

            {/* Dados do Fornecedor */}
            <div className="text-sm text-gray-800 space-y-1 mb-4 flex-1 overflow-hidden">
                <p className="truncate" title={email}>{email}</p>
                <p className="truncate font-medium text-gray-600" title={telefone}>{telefone}</p>
                <p className="text-gray-400 text-xs mt-2 truncate" title={idUsuario}>ID: {idUsuario}</p>
            </div>

            {/* Tag de Categoria */}
            <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-pedraum-dark text-white text-[10px] uppercase tracking-wider px-2.5 py-1 rounded font-bold">
                    {categoria}
                </span>
            </div>

            {/* Botões de Ação - POLIDOS E RESPONSIVOS */}
            <div className="flex flex-wrap justify-between items-stretch mt-auto gap-2">

                {/* O Link agora usa o ID real do usuário clicado! */}
                <Link href={`/admin/fornecedores/${idUsuario}`} className="flex-1 min-w-25">
                    <button className="w-full h-full min-h-9 border border-pedraum-orange text-pedraum-orange hover:bg-orange-50 font-bold text-[11px] py-1.5 px-2 rounded transition-colors text-center leading-tight">
                        Editar Usuário
                    </button>
                </Link>

                <button className="flex-[1.2] min-w-27.5 min-h-9 bg-pedraum-orange hover:bg-orange-600 text-gray-900 font-bold text-[11px] py-1.5 px-2 rounded transition-colors text-center leading-tight shadow-sm">
                    Demandas Atendidas
                </button>
            </div>

        </div>
    );
}