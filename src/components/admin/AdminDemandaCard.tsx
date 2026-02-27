import Link from "next/link";

interface AdminDemandaCardProps {
    id: string;
    titulo: string;
    descricao: string;
    categoria: string;
    status: string;
}

export function AdminDemandaCard({ id, titulo, descricao, categoria, status }: AdminDemandaCardProps) {
    return (
        <div className="bg-white rounded-lg border border-pedraum-orange p-5 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">

            {/* Título */}
            <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                {id} - {titulo}
            </h3>

            {/* Descrição com limite de linhas (line-clamp) */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
                {descricao}
            </p>

            {/* Tags Escuras */}
            <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-pedraum-dark text-white text-[11px] px-2.5 py-1 rounded font-medium">
                    {categoria}
                </span>
                <span className="bg-pedraum-dark text-white text-[11px] px-2.5 py-1 rounded font-medium">
                    {status}
                </span>
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-between items-center mt-auto gap-2">
                <Link href={`/admin/demandas/123`} className="flex-1">
                    <button className="w-full border border-pedraum-orange text-pedraum-orange hover:bg-orange-50 font-medium text-xs py-2 px-2 rounded transition-colors text-center">
                        Editar Demanda
                    </button>
                </Link>

                {/* Futuro link para a tela de Matchs da demanda */}
                <Link href={`#`} className="flex-1">
                    <button className="w-full bg-pedraum-orange hover:bg-orange-600 text-gray-900 font-bold text-xs py-2 px-2 rounded transition-colors uppercase text-center">
                        VER MATCHS
                    </button>
                </Link>
            </div>

        </div>
    );
}