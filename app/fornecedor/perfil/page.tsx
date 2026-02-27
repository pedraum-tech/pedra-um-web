"use client";

import { Header } from "@/src/components/Header";


export default function PerfilFornecedorPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Cabeçalho no modo Fornecedor (Mostra "Oportunidades") */}
            <Header variant="supplier" />

            {/* Conteúdo Principal */}
            <main className="flex-1 max-w-4xl w-full mx-auto p-4 py-10">

                {/* Título fora do card */}
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
                                defaultValue="Lucas Mineração"
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
                                defaultValue="contato@lucasmineracao.com.br"
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

                        {/* CNPJ/CPF */}
                        <div>
                            <label htmlFor="cnpj" className="block text-sm font-bold text-gray-900 mb-2">
                                CNPJ/CPF
                            </label>
                            <input
                                id="cnpj"
                                type="text"
                                defaultValue="00.000.000/0001-00"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pedraum-orange focus:ring-2 focus:ring-orange-100 outline-none transition-all bg-white text-gray-700"
                            />
                        </div>

                        {/* Categoria */}
                        <div>
                            <label htmlFor="categoria" className="block text-sm font-bold text-gray-900 mb-2">
                                Categoria
                            </label>
                            <select
                                id="categoria"
                                defaultValue="britagem"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pedraum-orange focus:ring-2 focus:ring-orange-100 outline-none transition-all bg-white text-gray-700 appearance-none cursor-pointer"
                            >
                                <option value="" disabled>Selecione a categoria...</option>
                                <option value="britagem">Britagem</option>
                                <option value="transporte">Transporte e Logística</option>
                                <option value="manutencao">Manutenção de Máquinas</option>
                                <option value="pecas">Peças de Reposição</option>
                                <option value="insumos">Insumos (Areia, Brita, etc)</option>
                            </select>
                        </div>

                        {/* Área de Atuação */}
                        <div>
                            <label htmlFor="areaAtuacao" className="block text-sm font-bold text-gray-900 mb-2">
                                Area de atuação
                            </label>
                            <select
                                id="areaAtuacao"
                                defaultValue="MG"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pedraum-orange focus:ring-2 focus:ring-orange-100 outline-none transition-all bg-white text-gray-700 appearance-none cursor-pointer"
                            >
                                <option value="" disabled>Selecione o estado...</option>
                                <option value="MG">Minas Gerais</option>
                                <option value="SP">São Paulo</option>
                                <option value="RJ">Rio de Janeiro</option>
                                <option value="ES">Espírito Santo</option>
                                <option value="BR">Todo o Brasil</option>
                            </select>
                        </div>

                        {/* Descrição das Categorias */}
                        <div>
                            <label htmlFor="descricao" className="block text-sm font-bold text-gray-900 mb-2">
                                Descrição das Categorias
                            </label>
                            <textarea
                                id="descricao"
                                className="w-full min-h-[140px] p-4 rounded-lg border border-gray-300 focus:border-pedraum-orange focus:ring-2 focus:ring-orange-100 outline-none transition-all resize-y text-gray-700 placeholder:text-gray-400"
                                placeholder="Dica: Ex: Britagem, Transporte, Manutenção de Máquinas..."
                                defaultValue="Especialista em britagem de alta capacidade e fornecimento de rachão para grandes obras."
                            ></textarea>
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
                        <div className="pt-4 flex justify-center">
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