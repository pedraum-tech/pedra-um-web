"use client";
import { Header } from "@/src/components/Header";
import Link from "next/link";

// Necessário para futuros estados (useState) dos botões



export default function DemandasCompradorPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Cabeçalho no modo Comprador */}
            <Header variant="buyer" />

            {/* Container Principal */}
            <div className="flex-1 max-w-5xl w-full mx-auto p-4 py-10 space-y-8">

                {/* --- CARD 1: NOVA SOLICITAÇÃO --- */}
                <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] p-8 md:p-10">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">Nova Solicitação</h1>
                        <p className="text-gray-500 text-sm">Descreva o que você precisa e receba contatos.</p>
                    </div>

                    <form className="space-y-6">
                        {/* Descrição Detalhada */}
                        <div>
                            <label className="block text-sm font-bold text-gray-800 uppercase tracking-wide mb-2">
                                Descrição Detalhada*
                            </label>
                            <textarea
                                className="w-full min-h-[140px] p-4 rounded-lg border border-gray-200 focus:border-pedraum-orange focus:ring-2 focus:ring-orange-100 outline-none transition-all resize-y text-gray-700 placeholder:text-gray-400"
                                placeholder="Dica: Especifique quantidade, especificações técnicas, prazos, localização."
                                maxLength={500}
                            ></textarea>
                            <div className="text-xs text-gray-400 mt-1 font-medium">0/500</div>
                        </div>

                        {/* Anexos */}
                        <div>
                            <label className="block text-sm font-medium text-gray-800 mb-3">
                                Anexos (opcional)
                            </label>
                            <div className="flex flex-wrap gap-3">
                                <button type="button" className="px-4 py-2 rounded-lg border border-pedraum-orange text-sm font-medium text-gray-700 hover:bg-orange-50 transition-colors">
                                    Imagens (5 max.)
                                </button>
                                <button type="button" className="px-4 py-2 rounded-lg border border-pedraum-orange text-sm font-medium text-gray-700 hover:bg-orange-50 transition-colors">
                                    PDF (1 max.)
                                </button>
                            </div>
                        </div>

                        {/* Urgência */}
                        <div>
                            <label className="block text-sm font-medium text-gray-800 mb-3">
                                Urgência
                            </label>
                            <div className="flex flex-wrap gap-3">
                                <button type="button" className="px-4 py-2 rounded-lg border border-pedraum-orange text-sm font-medium text-gray-700 hover:bg-orange-50 transition-colors flex items-center gap-2">
                                    😐 Normal
                                </button>
                                <button type="button" className="px-4 py-2 rounded-lg border border-pedraum-orange text-sm font-medium text-gray-700 hover:bg-orange-50 transition-colors flex items-center gap-2">
                                    😔 Urgente (7 dias)
                                </button>
                                <button type="button" className="px-4 py-2 rounded-lg border border-pedraum-orange text-sm font-medium text-gray-700 hover:bg-orange-50 transition-colors flex items-center gap-2">
                                    🚨 Crítico (48h)
                                </button>
                            </div>
                        </div>

                        {/* Botão Cadastrar Centralizado */}
                        <div className="pt-4 flex justify-center">
                            <button
                                type="submit"
                                className="bg-pedraum-orange hover:bg-orange-600 text-white font-bold py-3 px-10 rounded-lg transition-colors shadow-md shadow-orange-500/20 text-lg"
                            >
                                Cadastrar Demanda
                            </button>
                        </div>
                    </form>
                </div>

                {/* --- CARD 2: MEUS PEDIDOS --- */}
                <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] p-8 md:p-10">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">Seus Pedidos</h2>
                        <p className="text-gray-500 text-sm">Acompanhe o status das suas solicitações.</p>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-4">Fornecedores que visualizaram</h3>

                    {/* Tabela de Pedidos */}
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px] text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="py-4 px-4 font-bold text-gray-800 rounded-tl-lg">Demanda</th>
                                    <th className="py-4 px-4 font-bold text-gray-800">Descrição</th>
                                    <th className="py-4 px-4 font-bold text-gray-800 text-right rounded-tr-lg">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Linha 1 (Exemplo do Mockup) */}
                                <tr className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                                    <td className="py-4 px-4 text-gray-800 font-medium">
                                        Tela de Poliuretano
                                    </td>
                                    <td className="py-4 px-4 text-gray-600 text-sm max-w-md truncate">
                                        Preciso de telas de poliuretano 1.2mm para Metso HP300
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <Link href="/comprador/detalhes" className="inline-block">
                                            <button className="border border-pedraum-orange text-pedraum-orange hover:bg-orange-50 font-bold text-xs py-2 px-4 rounded-md transition-colors">
                                                Ver Demanda
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                                {/* Você pode replicar a linha <tr> acima para adicionar mais exemplos de teste */}
                            </tbody>
                        </table>
                    </div>

                </div>

            </div>
        </div>
    );
}