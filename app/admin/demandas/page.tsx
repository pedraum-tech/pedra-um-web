"use client";

import { AdminDemandaCard } from "@/src/components/admin/AdminDemandaCard";
import { Download, ChevronDown } from "lucide-react"; // Importando os ícones

export default function AdminDemandasPage() {

    // Mocks de dados para preencher a tela na apresentação
    const demandasMock = [
        { id: "#1", titulo: "Demanda 01", descricao: "Descrição mais detalhada sobre a demanda, com especificações e quantidades...", categoria: "Britagem", status: "Status" },
        { id: "#2", titulo: "Demanda 02", descricao: "Descrição mais detalhada sobre a demanda, com especificações e quantidades...", categoria: "Rolamentos", status: "Status" },
        { id: "#3", titulo: "Demanda 03", descricao: "Descrição mais detalhada sobre a demanda, com especificações e quantidades...", categoria: "Britagem", status: "Status" },
        { id: "#4", titulo: "Demanda 04", descricao: "Descrição mais detalhada sobre a demanda, com especificações e quantidades...", categoria: "Britagem", status: "Status" },
        { id: "#5", titulo: "Demanda 05", descricao: "Descrição mais detalhada sobre a demanda, com especificações e quantidades...", categoria: "Britagem", status: "Status" },
        { id: "#6", titulo: "Demanda 06", descricao: "Descrição mais detalhada sobre a demanda, com especificações e quantidades...", categoria: "Britagem", status: "Status" },
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
                    Admin Demandas
                </h1>
            </div>

            {/* Barra de Pesquisa Longa */}
            <div className="mb-8">
                <input
                    type="text"
                    placeholder="Buscar demanda por ID, título ou cliente..."
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
                        <option value="rolamentos">Rolamentos</option>
                        <option value="transporte">Transporte</option>
                    </select>
                </div>

                {/* Status */}
                <div>
                    <label className="block text-lg font-bold text-gray-900 mb-2">Status</label>
                    <select className="w-full px-4 py-3 rounded-lg bg-[#D9D9D9] border-none outline-none focus:ring-2 focus:ring-pedraum-orange appearance-none cursor-pointer text-gray-900 font-medium text-lg">
                        <option value="">Selecione...</option>
                        <option value="nova">Nova</option>
                        <option value="analise">Em Análise</option>
                        <option value="negociacao">Em Negociação</option>
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

            {/* Grid de Cards de Demandas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {demandasMock.map((demanda) => (
                    <AdminDemandaCard
                        key={demanda.id}
                        id={demanda.id}
                        titulo={demanda.titulo}
                        descricao={demanda.descricao}
                        categoria={demanda.categoria}
                        status={demanda.status}
                    />
                ))}
            </div>

        </div>
    );
}