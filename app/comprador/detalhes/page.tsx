
import { Header } from "@/src/components/Header";
import Link from "next/link";

export default function DetalhesDemandaPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Cabeçalho do Comprador */}
            <Header variant="buyer" />

            {/* Container Principal */}
            <div className="flex-1 max-w-5xl w-full mx-auto p-4 py-10 space-y-6">

                {/* --- CARD 1: DETALHES DA DEMANDA --- */}
                <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] p-8 md:p-10">

                    {/* Botão Voltar */}
                    <div className="mb-6">
                        <Link
                            href="/comprador"
                            className="inline-block px-4 py-1.5 rounded-md border border-pedraum-orange text-pedraum-orange text-sm font-medium hover:bg-orange-50 transition-colors"
                        >
                            Voltar
                        </Link>
                    </div>

                    {/* Título */}
                    <h1 className="text-2xl font-normal text-gray-900 mb-8">
                        Aqui fica o Título da Demanda
                    </h1>

                    {/* Placeholder de Foto Centralizado */}
                    <div className="flex justify-center mb-8">
                        <div className="w-64 h-64 bg-pedraum-dark text-white flex items-center justify-center text-4xl font-light rounded-sm">
                            Foto
                        </div>
                    </div>

                    {/* Descrição */}
                    <div className="mb-8">
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                            Descrição
                        </label>
                        <div className="w-full min-h-[120px] p-4 rounded-lg border border-gray-300 bg-white text-gray-500 text-sm">
                            Dica: Especifique quantidade, especificações técnicas, prazos, localização.
                        </div>
                    </div>

                    {/* Botão Fechar Demanda */}
                    <div className="flex justify-center">
                        <button className="bg-pedraum-orange hover:bg-orange-600 text-gray-900 font-medium py-2.5 px-8 rounded-md transition-colors shadow-sm">
                            Fechar Demanda
                        </button>
                    </div>

                </div>

                {/* --- CARD 2: FORNECEDORES INTERESSADOS --- */}
                <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] p-8 md:p-10">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                        Fornecedores que visualizaram
                    </h2>

                    {/* Tabela Escura (Estilo do Mockup) */}
                    <div className="w-full bg-pedraum-dark rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[600px]">
                                <thead>
                                    <tr className="border-b border-gray-700/50">
                                        <th className="py-4 px-6 font-normal text-gray-300">Nome</th>
                                        <th className="py-4 px-6 font-normal text-gray-300">Email</th>
                                        <th className="py-4 px-6 font-normal text-gray-300">Telefone</th>
                                    </tr>
                                </thead>
                                <tbody className="text-white">
                                    {/* Linha 1 */}
                                    <tr className="border-b border-gray-700/50 hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-6 font-bold">Lucas David</td>
                                        <td className="py-4 px-6 font-bold">lucas@email.com</td>
                                        <td className="py-4 px-6 font-bold">(35) 99999-9999</td>
                                    </tr>

                                    {/* Linha 2 */}
                                    <tr className="hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-6 font-bold">Lucas David</td>
                                        <td className="py-4 px-6 font-bold">lucas@email.com</td>
                                        <td className="py-4 px-6 font-bold">(35) 99999-9999</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}