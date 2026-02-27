"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function EditarFornecedorAdminPage() {
    // 1. Os dados viriam do seu banco de dados (API)
    const demandasDoUsuario = [
        { id: "123", titulo: "Telas de Poliuretano", status: "Aberta" },
        { id: "124", titulo: "Britador XYZ", status: "Em Negociação" },
        { id: "125", titulo: "Correia Transportadora", status: "Fechada" }
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 flex flex-col gap-6 max-w-5xl mx-auto">

            {/* Cabeçalho com Botão Voltar e Título Centralizado */}
            <div className="flex items-center justify-between mb-4 relative">
                <Link
                    href="/admin/fornecedores"
                    className="flex items-center gap-2 text-pedraum-orange hover:text-orange-600 font-medium transition-colors z-10"
                >
                    <ChevronLeft className="w-5 h-5" />
                    Voltar
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 absolute left-1/2 -translate-x-1/2 w-full text-center pointer-events-none">
                    Editar Fornecedor
                </h1>
            </div>

            {/* --- SEÇÃO 1: DADOS DO FORNECEDOR --- */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

                {/* Topo do Card: Status e Tipo de Usuário */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <span className="bg-[#00C853] text-white text-xs font-bold px-4 py-1.5 rounded-full">
                            Status: Ativo
                        </span>
                    </div>
                    <div className="w-48">
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                            Tipo de usuário
                        </label>
                        <select className="w-full px-3 py-2 rounded-md border border-gray-300 focus:border-pedraum-orange outline-none bg-white text-gray-700 text-sm appearance-none cursor-pointer">
                            <option selected>Fornecedor</option>
                            <option>Comprador</option>
                            <option>Admin</option>
                        </select>
                    </div>
                </div>

                {/* Formulário Principal */}
                <form className="space-y-6">

                    {/* Foto de Perfil */}
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                            Foto de Perfil
                        </label>
                        <button
                            type="button"
                            className="px-4 py-2 rounded-lg border border-pedraum-orange text-sm font-medium text-gray-800 hover:bg-orange-50 transition-colors bg-white"
                        >
                            Selecionar Imagem
                        </button>
                    </div>

                    {/* Nome */}
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Nome</label>
                        <input
                            type="text"
                            defaultValue="Lucas David Oliveira"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pedraum-orange outline-none transition-all text-gray-700"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Email</label>
                        <input
                            type="email"
                            defaultValue="lucas@email.com"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pedraum-orange outline-none transition-all text-gray-700"
                        />
                    </div>

                    {/* Telefone */}
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Telefone/Whatsapp</label>
                        <input
                            type="tel"
                            defaultValue="(35) 9 9999-9999"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pedraum-orange outline-none transition-all text-gray-700"
                        />
                    </div>

                    {/* Categoria */}
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Categoria</label>
                        <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pedraum-orange outline-none transition-all bg-white text-gray-700 appearance-none cursor-pointer">
                            <option>Selecione a categoria...</option>
                            <option selected>Britagem</option>
                        </select>
                    </div>

                    {/* Descrição das Categorias */}
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Descrição das Categorias</label>
                        <textarea
                            defaultValue="Dica: Ex: Britagem, Transporte, Manutenção de Máquinas..."
                            className="w-full min-h-[120px] p-4 rounded-lg border border-gray-300 focus:border-pedraum-orange outline-none transition-all resize-y text-gray-700"
                        ></textarea>
                    </div>

                    {/* UF */}
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">UF</label>
                        <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pedraum-orange outline-none transition-all bg-white text-gray-700 appearance-none cursor-pointer">
                            <option>Selecione o estado...</option>
                            <option selected>MG</option>
                        </select>
                    </div>

                    {/* Botão Alterar Senha */}
                    <div className="pt-2">
                        <button
                            type="button"
                            className="px-4 py-2 rounded-lg border border-pedraum-orange text-sm font-medium text-gray-800 hover:bg-orange-50 transition-colors bg-white"
                        >
                            Alterar a Senha
                        </button>
                    </div>

                </form>
            </div>

            {/* --- SEÇÃO 2: DEMANDAS VISUALIZADAS --- */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Demandas Visualizadas</h2>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="py-4 px-4 font-normal text-gray-600">Demanda</th>
                                <th className="py-4 px-4 font-normal text-gray-600">Status</th>
                                <th className="py-4 px-4 font-normal text-gray-600 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* 2. O React faz um loop automático para cada demanda do array */}
                            {demandasDoUsuario.map((demanda) => (
                                <tr key={demanda.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">

                                    <td className="py-4 px-4 font-medium text-gray-900">
                                        {demanda.titulo} {/* Título dinâmico */}
                                    </td>

                                    <td className="py-4 px-4 text-gray-700">
                                        {demanda.status} {/* Status dinâmico */}
                                    </td>

                                    <td className="py-4 px-4 text-right">
                                        {/* Link dinâmico com o ID real da demanda */}
                                        <Link href={`/admin/demandas/${demanda.id}`}>
                                            <button className="border border-pedraum-orange text-pedraum-orange hover:bg-orange-50 font-bold text-xs py-1.5 px-3 rounded transition-colors bg-white">
                                                Ver Demanda
                                            </button>
                                        </Link>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- BOTÃO FLUTUANTE DE SALVAR (RODAPÉ) --- */}
            <div className="flex justify-end mt-2 mb-8">
                <button className="bg-pedraum-orange hover:bg-orange-600 text-gray-900 font-bold py-3 px-10 rounded-lg shadow-md transition-colors text-lg">
                    Salvar Alterações
                </button>
            </div>

        </div>
    );
}