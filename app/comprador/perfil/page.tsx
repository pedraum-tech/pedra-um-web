"use client";
import { Header } from "@/src/components/Header";

// Necessário caso você queira adicionar a lógica de upload de imagem depois


export default function PerfilCompradorPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Cabeçalho no modo Comprador */}
            <Header variant="buyer" />

            {/* Conteúdo Principal */}
            <main className="flex-1 max-w-4xl w-full mx-auto p-4 py-10">

                {/* Título fora do card (Igual ao mockup) */}
                <h1 className="text-3xl font-bold text-gray-900 mb-6 px-2">
                    Meu Perfil
                </h1>

                {/* Card Principal */}
                <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] p-8 md:p-12">
                    <form className="space-y-6">

                        {/* Foto de Perfil */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                Foto de Perfil
                            </label>
                            <button
                                type="button"
                                className="px-4 py-2 rounded-lg border border-pedraum-orange text-sm font-medium text-gray-700 hover:bg-orange-50 transition-colors"
                            >
                                Selecionar Imagem
                            </button>
                        </div>

                        {/* Nome */}
                        <div>
                            <label htmlFor="nome" className="block text-sm font-bold text-gray-900 mb-2">
                                Nome
                            </label>
                            <input
                                id="nome"
                                type="text"
                                defaultValue="Lucas" // Um placeholder amigável para a demo
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pedraum-orange focus:ring-2 focus:ring-orange-100 outline-none transition-all bg-white text-gray-700"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                defaultValue="lucas@email.com"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pedraum-orange focus:ring-2 focus:ring-orange-100 outline-none transition-all bg-white text-gray-700"
                            />
                        </div>

                        {/* Telefone/Whatsapp */}
                        <div>
                            <label htmlFor="telefone" className="block text-sm font-bold text-gray-900 mb-2">
                                Telefone/Whatsapp
                            </label>
                            <input
                                id="telefone"
                                type="tel"
                                defaultValue="(31) 99090-3613"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pedraum-orange focus:ring-2 focus:ring-orange-100 outline-none transition-all bg-white text-gray-700"
                            />
                        </div>

                        {/* Botão de Alterar Senha */}
                        <div className="pt-2">
                            <button
                                type="button"
                                className="px-6 py-3 rounded-lg border border-pedraum-orange text-sm font-medium text-gray-800 hover:bg-orange-50 transition-colors"
                            >
                                Alterar a Senha
                            </button>
                        </div>

                        {/* Botão Salvar Centralizado */}
                        <div className="pt-8 flex justify-center">
                            <button
                                type="submit"
                                className="bg-pedraum-orange hover:bg-orange-600 text-white font-bold py-3 px-14 rounded-lg transition-colors shadow-md shadow-orange-500/20 text-lg"
                            >
                                Salvar
                            </button>
                        </div>

                    </form>
                </div>
            </main>
        </div>
    );
}