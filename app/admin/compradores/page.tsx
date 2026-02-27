"use client";

import { AdminCompradorCard } from "@/src/components/admin/AdminCompradorCard";
import { Download, ChevronDown } from "lucide-react";

export default function AdminCompradoresPage() {

    // Mocks dos compradores baseados no seu design
    const compradoresMock = [
        { id: "123", nome: "Marcial Godoi", metric: 25, email: "marcial@email.com", telefone: "(35) 9 9999-9999", idUsuario: "id-do-usuario-marcial", categoria: "Britagem" },
        { id: "124", nome: "Karen Dias", metric: 14, email: "karen@email.com", telefone: "(35) 9 9999-9999", idUsuario: "id-do-usuario-karen", categoria: "Britagem" },
        { id: "125", nome: "Beatriz Oliveira", metric: 10, email: "beatriz@email.com", telefone: "(35) 9 9999-9999", idUsuario: "id-do-usuario-beatriz", categoria: "Britagem" },
        { id: "126", nome: "Lucas David", metric: 5, email: "lucas@email.com", telefone: "(35) 9 9999-9999", idUsuario: "id-do-usuario-lucas", categoria: "Britagem" },
        { id: "127", nome: "Usuário 01", metric: 3, email: "usuario01@email.com", telefone: "(35) 9 9999-9999", idUsuario: "id-do-usuario-01", categoria: "Britagem" },
        { id: "128", nome: "Usuário 02", metric: 0, email: "usuario02@email.com", telefone: "(35) 9 9999-9999", idUsuario: "id-do-usuario-02", categoria: "Britagem" },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 p-8">

            {/* Cabeçalho */}
            <div className="mb-8 relative flex items-center justify-center">
                <div className="absolute left-0">
                    <button className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors shadow-sm text-sm font-bold group">
                        <Download className="w-4 h-4 text-pedraum-orange group-hover:scale-110 transition-transform" />
                        Exportar (CSV)
                        <ChevronDown className="w-4 h-4 ml-1 text-gray-400" />
                    </button>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">
                    Admin Compradores
                </h1>
            </div>

            {/* Barra de Pesquisa */}
            <div className="mb-8">
                <input
                    type="text"
                    placeholder="Buscar comprador por nome, email ou ID..."
                    className="w-full px-4 py-3 rounded-full border border-gray-300 focus:border-pedraum-orange focus:ring-2 focus:ring-orange-100 outline-none transition-all shadow-sm"
                />
            </div>

            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <div>
                    <label className="block text-lg font-bold text-gray-900 mb-2">Categoria</label>
                    <select className="w-full px-4 py-3 rounded-lg bg-[#D9D9D9] border-none outline-none focus:ring-2 focus:ring-pedraum-orange appearance-none cursor-pointer text-gray-900 font-medium text-lg">
                        <option value="">Selecione...</option>
                        <option value="britagem">Britagem</option>
                    </select>
                </div>
                <div>
                    <label className="block text-lg font-bold text-gray-900 mb-2">Status</label>
                    <select className="w-full px-4 py-3 rounded-lg bg-[#D9D9D9] border-none outline-none focus:ring-2 focus:ring-pedraum-orange appearance-none cursor-pointer text-gray-900 font-medium text-lg">
                        <option value="">Selecione...</option>
                        <option value="ativo">Ativo</option>
                        <option value="inativo">Inativo</option>
                    </select>
                </div>
                <div>
                    <label className="block text-lg font-bold text-gray-900 mb-2">Tempo</label>
                    <input type="date" className="w-full px-4 py-3 rounded-lg bg-[#D9D9D9] border-none outline-none focus:ring-2 focus:ring-pedraum-orange text-gray-900 font-medium text-lg" />
                    <span className="text-sm text-gray-900 font-bold mt-1 block">Inicial</span>
                </div>
                <div className="flex flex-col justify-start">
                    <label className="block text-lg font-bold text-transparent mb-2 hidden md:block">.</label>
                    <input type="date" className="w-full px-4 py-3 rounded-lg bg-[#D9D9D9] border-none outline-none focus:ring-2 focus:ring-pedraum-orange text-gray-900 font-medium text-lg" />
                    <span className="text-sm text-gray-900 font-bold mt-1 block">Final</span>
                </div>
            </div>

            {/* Grid de Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {compradoresMock.map((comprador) => (
                    <AdminCompradorCard
                        key={comprador.id}
                        id={comprador.id}
                        nome={comprador.nome}
                        metric={comprador.metric}
                        email={comprador.email}
                        telefone={comprador.telefone}
                        idUsuario={comprador.idUsuario}
                        categoria={comprador.categoria}
                    />
                ))}
            </div>

        </div>
    );
}