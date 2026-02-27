"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function EditarDemandaAdminPage() {
    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 flex flex-col gap-6 max-w-6xl mx-auto">

            {/* Cabeçalho de Navegação e Título */}
            <div className="flex items-center justify-between mb-4">
                <Link
                    href="/admin/demandas"
                    className="flex items-center gap-2 text-pedraum-orange hover:text-orange-600 font-medium transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                    Voltar
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 absolute left-1/2 -translate-x-1/2">
                    Editar Demanda
                </h1>
                <div className="w-20"></div> {/* Espaçador invisível para centralizar o título */}
            </div>

            {/* --- SEÇÃO 1: DADOS DA DEMANDA --- */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

                {/* Status Badge */}
                <div className="mb-6">
                    <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                        Status: Fechada
                    </span>
                </div>

                <form className="space-y-6">
                    {/* Título */}
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                            Título da Demanda
                        </label>
                        <input
                            type="text"
                            defaultValue="Brita 20mm p/ Concretagem"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pedraum-orange outline-none transition-all text-gray-700"
                        />
                    </div>

                    {/* Descrição Detalhada */}
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2 uppercase">
                            Descrição Detalhada
                        </label>
                        <textarea
                            defaultValue="Dica: Especifique quantidade, especificações técnicas, prazos, localização."
                            className="w-full min-h-[120px] p-4 rounded-lg border border-gray-300 focus:border-pedraum-orange outline-none transition-all resize-y text-gray-700"
                        ></textarea>
                        <div className="text-xs text-gray-400 mt-1 font-medium">0/500</div>
                    </div>

                    {/* Categoria e UF (Grid 2 colunas) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">Categoria</label>
                            <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pedraum-orange outline-none transition-all bg-white text-gray-700 appearance-none cursor-pointer">
                                <option>Selecione a categoria...</option>
                                <option selected>Britagem</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">UF</label>
                            <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pedraum-orange outline-none transition-all bg-white text-gray-700 appearance-none cursor-pointer">
                                <option>Selecione o estado...</option>
                                <option selected>MG</option>
                            </select>
                        </div>
                    </div>

                    {/* Botões de Anexo */}
                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-3">
                            Anexos (opcional)
                        </label>
                        <div className="flex gap-3">
                            <button type="button" className="px-4 py-2 rounded-lg border border-pedraum-orange text-sm font-medium text-pedraum-orange bg-orange-50/50">
                                Imagens (5 max.)
                            </button>
                            <button type="button" className="px-4 py-2 rounded-lg border border-pedraum-orange text-sm font-medium text-pedraum-orange bg-orange-50/50">
                                PDF (1 max.)
                            </button>
                        </div>
                    </div>

                    {/* Imagens Anexadas (Grid Escuro) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-3">Imagens Anexadas</label>
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {[1, 2, 3, 4, 5].map((item) => (
                                <div key={item} className="w-32 h-32 flex-shrink-0 bg-pedraum-dark flex items-center justify-center rounded text-white text-2xl font-light">
                                    Foto
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* PDF Anexado */}
                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-3">PDF Anexado</label>
                        <div className="w-32 h-32 bg-pedraum-dark flex items-center justify-center rounded text-white text-2xl font-light">
                            PDF
                        </div>
                    </div>

                    {/* Urgência */}
                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-3">Urgência</label>
                        <div className="flex gap-3">
                            <button type="button" className="px-4 py-2 rounded-lg border border-pedraum-orange text-sm font-medium text-pedraum-orange bg-orange-50/50 flex items-center gap-2">
                                😐 Normal
                            </button>
                            <button type="button" className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-500 flex items-center gap-2">
                                😔 Urgente (7 dias)
                            </button>
                            <button type="button" className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-500 flex items-center gap-2">
                                🚨 Crítico (48h)
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* --- SEÇÃO 2: INTERFACE DE MATCHMAKING --- */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 uppercase">INTERFACE DE MATCHMAKING</h2>
                <p className="text-gray-500 text-sm font-medium mb-6 uppercase">
                    FORNECEDORES COMPATÍVEIS (ordenados por % match):
                </p>

                <h3 className="text-lg font-bold text-gray-900 mb-4">Fornecedores:</h3>

                {/* Card do Fornecedor Compatível */}
                <div className="border border-gray-200 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#F8FAFC]/50">

                    {/* Lado Esquerdo: Dados */}
                    <div className="space-y-3">
                        <h4 className="text-xl font-bold text-gray-900">Nome do Fornecedor</h4>

                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-800">
                            <span className="font-medium">Especialidade:</span>
                            <span className="border border-gray-300 px-2 py-0.5 rounded text-xs bg-white">Normal</span>
                            <span className="mx-1 text-gray-300">|</span>
                            <span className="font-medium">Atuação:</span>
                            <span className="border border-gray-300 px-2 py-0.5 rounded text-xs bg-white">Normal</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-800">
                            <span className="font-medium">Itens Compatíveis:</span>
                            <span className="border border-gray-300 px-2 py-0.5 rounded text-xs bg-white">Normal</span>
                            <span className="border border-gray-300 px-2 py-0.5 rounded text-xs bg-white">Normal</span>
                        </div>
                    </div>

                    {/* Lado Direito: Ações e Match */}
                    <div className="flex flex-col items-end gap-3 min-w-[200px]">
                        <div className="bg-pedraum-orange text-gray-900 font-black text-xl px-6 py-2 rounded-lg">
                            100%
                        </div>
                        <div className="flex flex-col w-full gap-2">
                            <button className="w-full border border-pedraum-orange text-pedraum-orange hover:bg-orange-50 text-xs font-bold py-2 rounded transition-colors">
                                Visualizar Perfil
                            </button>
                            <button className="w-full bg-pedraum-orange hover:bg-orange-600 text-gray-900 text-xs font-bold py-2 rounded transition-colors">
                                Selecionar Para Contato
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- SEÇÃO 3: FORNECEDORES QUE VISUALIZARAM --- */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Fornecedores que visualizaram</h2>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="py-4 px-4 font-normal text-gray-600">Nome</th>
                                <th className="py-4 px-4 font-normal text-gray-600">Status</th>
                                <th className="py-4 px-4 font-normal text-gray-600 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Linha 1 */}
                            <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                <td className="py-4 px-4 font-medium text-gray-900">Lucas David Oliveira</td>
                                <td className="py-4 px-4 text-gray-700">Ativo</td>
                                <td className="py-4 px-4 text-right">
                                    <button className="border border-pedraum-orange text-pedraum-orange hover:bg-orange-50 font-bold text-xs py-1.5 px-3 rounded transition-colors">
                                        Ver Perfil
                                    </button>
                                </td>
                            </tr>
                            {/* Linha 2 */}
                            <tr className="hover:bg-gray-50 transition-colors">
                                <td className="py-4 px-4 font-medium text-gray-900">Lucas David Oliveira</td>
                                <td className="py-4 px-4 text-gray-700">Ativo</td>
                                <td className="py-4 px-4 text-right">
                                    <button className="border border-pedraum-orange text-pedraum-orange hover:bg-orange-50 font-bold text-xs py-1.5 px-3 rounded transition-colors">
                                        Ver Perfil
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- BOTÃO FLUTUANTE DE SALVAR (RODAPÉ) --- */}
            <div className="flex justify-end mt-4 mb-8">
                <button className="bg-pedraum-orange hover:bg-orange-600 text-gray-900 font-bold py-3 px-10 rounded-lg shadow-md transition-colors text-lg">
                    Salvar Alterações
                </button>
            </div>

        </div>
    );
}