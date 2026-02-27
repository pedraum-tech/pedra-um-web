"use client";

import { AdminFornecedorCard } from "@/src/components/admin/AdminFornecedorCard";
import { Download, ChevronDown } from "lucide-react";

export default function AdminFornecedoresPage() {

    // Mocks dos fornecedores baseados no seu design
    const fornecedoresMock = [
        { id: "1", nome: "Marcial Godoi", leadsVistos: 25, email: "marcial@email.com", telefone: "(35) 9 9999-9999", idUsuario: "id-do-usuário-marcial", categoria: "Britagem" },
        { id: "2", nome: "Karen Dias", leadsVistos: 14, email: "karen@email.com", telefone: "(35) 9 9999-9999", idUsuario: "id-do-usuário-karen", categoria: "Britagem" },
        { id: "3", nome: "Beatriz Oliveira", leadsVistos: 10, email: "beatriz@email.com", telefone: "(35) 9 9999-9999", idUsuario: "id-do-usuário-beatriz", categoria: "Britagem" },
        { id: "4", nome: "Lucas David", leadsVistos: 5, email: "lucas@email.com", telefone: "(35) 9 9999-9999", idUsuario: "id-do-usuário-lucas", categoria: "Britagem" },
        { id: "5", nome: "Usuário 01", leadsVistos: 3, email: "usuario01@email.com", telefone: "(35) 9 9999-9999", idUsuario: "id-do-usuário-usuario01", categoria: "Britagem" },
        { id: "6", nome: "Usuário 02", leadsVistos: 0, email: "usuario02@email.com", telefone: "(35) 9 9999-9999", idUsuario: "id-do-usuário-usuario02", categoria: "Britagem" },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 p-8">

            {/* Cabeçalho da Página com Botão de Exportar e Título */}
            <div className="mb-8 relative flex items-center justify-center">
                {/* Botão Exportar (Fixado à esquerda) */}
                <div className="absolute left-0">
                    <button className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors shadow-sm text-sm font-bold group">
                        <Download className="w-4 h-4 text-pedraum-orange group-hover:scale-110 transition-transform" />
                        Exportar (CSV)
                        <ChevronDown className="w-4 h-4 ml-1 text-gray-400" />
                    </button>
                </div>

                {/* Título Centralizado */}
                <h1 className="text-3xl font-bold text-gray-900">
                    Admin Fornecedores
                </h1>
            </div>

            {/* Barra de Pesquisa */}
            <div className="mb-8">
                <input
                    type="text"
                    placeholder="Buscar fornecedor por nome, email ou CNPJ..."
                    className="w-full px-4 py-3 rounded-full border border-gray-300 focus:border-pedraum-orange focus:ring-2 focus:ring-orange-100 outline-none transition-all shadow-sm"
                />
            </div>

            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

                {/* Categoria */}
                <div>
                    <label className="block text-lg font-bold text-gray-900 mb-2">Categoria</label>
                    <select className="w-full px-4 py-3 rounded-lg bg-[#D9D9D9] border-none outline-none focus:ring-2 focus:ring-pedraum-orange appearance-none cursor-pointer text-gray-900 font-medium text-lg">
                        <option value="">Selecione...</option>
                        <option value="britagem">Britagem</option>
                        <option value="transporte">Transporte</option>
                    </select>
                </div>

                {/* Status */}
                <div>
                    <label className="block text-lg font-bold text-gray-900 mb-2">Status</label>
                    <select className="w-full px-4 py-3 rounded-lg bg-[#D9D9D9] border-none outline-none focus:ring-2 focus:ring-pedraum-orange appearance-none cursor-pointer text-gray-900 font-medium text-lg">
                        <option value="">Selecione...</option>
                        <option value="ativo">Ativo</option>
                        <option value="inativo">Inativo</option>
                        <option value="bloqueado">Bloqueado</option>
                    </select>
                </div>

                {/* Tempo Inicial */}
                <div>
                    <label className="block text-lg font-bold text-gray-900 mb-2">Tempo</label>
                    <input
                        type="date"
                        className="w-full px-4 py-3 rounded-lg bg-[#D9D9D9] border-none outline-none focus:ring-2 focus:ring-pedraum-orange text-gray-900 font-medium text-lg"
                    />
                    <span className="text-sm text-gray-900 font-bold mt-1 block">Inicial</span>
                </div>

                {/* Tempo Final */}
                <div className="flex flex-col justify-start">
                    <label className="block text-lg font-bold text-transparent mb-2 hidden md:block">.</label>
                    <input
                        type="date"
                        className="w-full px-4 py-3 rounded-lg bg-[#D9D9D9] border-none outline-none focus:ring-2 focus:ring-pedraum-orange text-gray-900 font-medium text-lg"
                    />
                    <span className="text-sm text-gray-900 font-bold mt-1 block">Final</span>
                </div>

            </div>

            {/* Grid de Cards de Fornecedores */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {fornecedoresMock.map((fornecedor) => (
                    <AdminFornecedorCard
                        key={fornecedor.id}
                        nome={fornecedor.nome}
                        leadsVistos={fornecedor.leadsVistos}
                        email={fornecedor.email}
                        telefone={fornecedor.telefone}
                        idUsuario={fornecedor.idUsuario}
                        categoria={fornecedor.categoria}
                    />
                ))}
            </div>

        </div>
    );
}