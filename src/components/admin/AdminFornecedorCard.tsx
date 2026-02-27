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

    // Formatação para garantir que números menores que 10 tenham um zero na frente (ex: 05, 03)
    const leadsFormatados = leadsVistos < 10 ? `0${leadsVistos}` : leadsVistos;

    return (
        <div className="bg-white rounded-lg border border-pedraum-orange p-5 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">

            {/* Cabeçalho do Card (Nome e Círculo de Leads) */}
            <div className="flex justify-between items-start mb-4 gap-2">
                <h3 className="text-xl font-bold text-gray-900 leading-tight">
                    {nome}
                </h3>
                <div
                    className="bg-pedraum-orange text-gray-900 font-bold text-lg flex items-center justify-center rounded-full flex-shrink-0"
                    style={{ width: '40px', height: '40px' }}
                >
                    {leadsFormatados}
                </div>
            </div>

            {/* Dados do Fornecedor */}
            <div className="text-sm text-gray-800 space-y-0.5 mb-4 flex-1">
                <p className="truncate" title={email}>{email}</p>
                <p>{telefone}</p>
                <p className="text-gray-500 text-xs mt-1 truncate" title={idUsuario}>{idUsuario}</p>
            </div>

            {/* Tag de Categoria Escura */}
            <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-pedraum-dark text-white text-[11px] px-2.5 py-1 rounded font-medium">
                    {categoria}
                </span>
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-between items-center mt-auto gap-2">
                <Link href="/admin/fornecedores/123" className="flex-1">
                    <button className="w-full border border-pedraum-orange text-pedraum-orange hover:bg-orange-50 font-medium text-xs py-2 px-1 rounded transition-colors text-center whitespace-nowrap">
                        Editar Usuário
                    </button>
                </Link>
                <button className="flex-[1.5] bg-pedraum-orange hover:bg-orange-600 text-gray-900 font-bold text-xs py-2 px-1 rounded transition-colors text-center whitespace-nowrap">
                    Demandas Atendidas
                </button>
            </div>

        </div>
    );
}