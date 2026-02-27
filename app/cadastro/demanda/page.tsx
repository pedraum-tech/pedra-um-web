"use client";
import { Header } from "@/src/components/Header";

// Necessário se formos colocar interatividade nos botões de anexo/urgência depois


export default function CadastroDemandaPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Cabeçalho */}
            {/* Usei o variant "guest" para ficar igual ao seu mockup (Início, Fornecedor, Entrar) */}
            <Header variant="guest" />

            {/* Container Centralizado */}
            <div className="flex-1 flex items-center justify-center p-4 py-12">

                {/* Card Branco */}
                <div className="bg-white w-full max-w-2xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-8 md:p-10">

                    {/* Título e Linha Divisória */}
                    <h1 className="text-2xl font-medium text-gray-900 mb-3">
                        Detalhe sua necessidade
                    </h1>
                    <div className="h-1 w-full bg-pedraum-dark mb-8 rounded-full"></div>

                    {/* Formulário */}
                    <form className="space-y-6">

                        {/* 1. Descrição Detalhada */}
                        <div>
                            <label className="block text-sm font-bold text-gray-800 uppercase tracking-wide mb-2">
                                Descrição Detalhada*
                            </label>
                            <textarea
                                className="w-full min-h-[160px] p-4 rounded-lg border border-gray-200 focus:border-pedraum-orange focus:ring-2 focus:ring-orange-100 outline-none transition-all resize-y text-gray-700 placeholder:text-gray-400"
                                placeholder="Dica: Especifique quantidade, especificações técnicas, prazos, localização."
                                maxLength={500}
                            ></textarea>
                            <div className="text-xs text-gray-400 mt-1 font-medium">
                                0/500
                            </div>
                        </div>

                        {/* 2. Anexos */}
                        <div>
                            <label className="block text-sm font-medium text-gray-800 mb-3">
                                Anexos (opcional)
                            </label>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    className="px-4 py-2 rounded-lg border border-pedraum-orange text-sm font-medium text-gray-700 hover:bg-orange-50 transition-colors"
                                >
                                    Imagens (5 max.)
                                </button>
                                <button
                                    type="button"
                                    className="px-4 py-2 rounded-lg border border-pedraum-orange text-sm font-medium text-gray-700 hover:bg-orange-50 transition-colors"
                                >
                                    PDF (1 max.)
                                </button>
                            </div>
                        </div>

                        {/* 3. Urgência */}
                        <div>
                            <label className="block text-sm font-medium text-gray-800 mb-3">
                                Urgência
                            </label>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    className="px-4 py-2 rounded-lg border border-pedraum-orange text-sm font-medium text-gray-700 hover:bg-orange-50 transition-colors flex items-center gap-2"
                                >
                                    😐 Normal
                                </button>
                                <button
                                    type="button"
                                    className="px-4 py-2 rounded-lg border border-pedraum-orange text-sm font-medium text-gray-700 hover:bg-orange-50 transition-colors flex items-center gap-2"
                                >
                                    😔 Urgente (7 dias)
                                </button>
                                <button
                                    type="button"
                                    className="px-4 py-2 rounded-lg border border-pedraum-orange text-sm font-medium text-gray-700 hover:bg-orange-50 transition-colors flex items-center gap-2"
                                >
                                    🚨 Crítico (48h)
                                </button>
                            </div>
                        </div>

                        {/* 4. Botão de Ação */}
                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                className="bg-pedraum-orange hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-md shadow-orange-500/20"
                            >
                                Cadastrar Demanda
                            </button>
                        </div>

                    </form>

                </div>
            </div>

            {/* O Footer já deve aparecer automaticamente devido ao seu layout.tsx global */}
        </div>
    );
}