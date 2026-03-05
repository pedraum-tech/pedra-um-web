import Link from "next/link";

interface OportunidadeCardProps {
    id: string;        // ID verdadeiro do Firebase (usado para o Link)
    displayId: string; // ID encurtado ou Protocolo (usado para aparecer no Título)
    titulo: string;
    descricao: string;
    categoria: string;
    status: string;
}

export function OportunidadeCard({ id, displayId, titulo, descricao, categoria, status }: OportunidadeCardProps) {
    return (
        <div className="bg-white rounded-lg border border-pedraum-orange p-4 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">

            {/* Título usando o ID formatado para ficar visualmente limpo */}
            <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight">
                {displayId} - {titulo}
            </h3>

            {/* Descrição com limite de linhas (line-clamp) */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
                {descricao}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-pedraum-dark text-white text-[10px] px-2 py-1 rounded font-medium">
                    {categoria}
                </span>
                <span className="bg-pedraum-dark text-white text-[10px] px-2 py-1 rounded font-medium">
                    {status}
                </span>
            </div>

            {/* Botão de Ação alinhado à direita */}
            <div className="flex justify-end mt-auto">
                {/* A CORREÇÃO: Usando chaves e crases para injetar a variável na URL */}
                <Link href={`/fornecedor/detalhes/${id}`}>
                    <button className="bg-pedraum-orange hover:bg-orange-600 text-white font-bold text-xs py-1.5 px-4 rounded transition-colors uppercase">
                        Atender
                    </button>
                </Link>
            </div>

        </div>
    );
}