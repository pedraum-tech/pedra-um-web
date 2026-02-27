"use client";

import { Header } from "@/src/components/Header";
import { OportunidadeCard } from "@/src/components/OportunidadeCard";


export default function OportunidadesPage() {

    // Mocks de dados só para a apresentação não ficar vazia
    const demandasMock = [
        { id: "#1", titulo: "Demanda 01", descricao: "Descrição mais detalhada sobre a demanda, com especificações e quantidades...", categoria: "Britagem", status: "Novo" },
        { id: "#2", titulo: "Areia Lavada", descricao: "Precisamos de 50 toneladas de areia lavada entregues na região central.", categoria: "Insumos", status: "Urgente" },
        { id: "#3", titulo: "Manutenção Britador", descricao: "Troca de mandíbulas do britador primário modelo X, necessário equipe com...", categoria: "Manutenção", status: "Aberto" },
        { id: "#4", titulo: "Transporte Carga", descricao: "Carreta basculante para rota diária de 50km durante 30 dias.", categoria: "Transporte", status: "Aberto" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Cabeçalho do Fornecedor */}
            <Header variant="supplier" />

            {/* Conteúdo Central */}
            <main className="flex-1 w-full max-w-6xl mx-auto p-4 py-8">

                {/* Título Centralizado */}
                <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
                    Suas Oportunidades
                </h1>

                {/* Barra de Pesquisa Longa */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Buscar demandas..."
                        className="w-full px-4 py-2 rounded-full border border-gray-300 focus:border-pedraum-orange focus:ring-2 focus:ring-orange-100 outline-none transition-all shadow-sm"
                    />
                </div>

                {/* Filtros */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

                    {/* Categoria */}
                    <div>
                        <label className="block text-base font-bold text-gray-900 mb-2">Categoria</label>
                        <select className="w-full px-4 py-2.5 rounded-lg bg-[#D9D9D9]/50 border-none outline-none focus:ring-2 focus:ring-pedraum-orange appearance-none cursor-pointer text-gray-700 font-medium">
                            <option value="">Selecione...</option>
                            <option value="britagem">Britagem</option>
                            <option value="transporte">Transporte</option>
                        </select>
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-base font-bold text-gray-900 mb-2">Status</label>
                        <select className="w-full px-4 py-2.5 rounded-lg bg-[#D9D9D9]/50 border-none outline-none focus:ring-2 focus:ring-pedraum-orange appearance-none cursor-pointer text-gray-700 font-medium">
                            <option value="">Selecione...</option>
                            <option value="novo">Novo</option>
                            <option value="urgente">Urgente</option>
                        </select>
                    </div>

                    {/* Tempo Inicial */}
                    <div>
                        <label className="block text-base font-bold text-gray-900 mb-2">Tempo</label>
                        <input
                            type="date"
                            className="w-full px-4 py-2.5 rounded-lg bg-[#D9D9D9]/50 border-none outline-none focus:ring-2 focus:ring-pedraum-orange text-gray-700 font-medium"
                        />
                        <span className="text-xs text-gray-500 mt-1 block">Inicial</span>
                    </div>

                    {/* Tempo Final */}
                    <div className="flex flex-col justify-start">
                        <label className="block text-base font-bold text-transparent mb-2 hidden md:block">.</label> {/* Espaçador invisível para alinhar */}
                        <input
                            type="date"
                            className="w-full px-4 py-2.5 rounded-lg bg-[#D9D9D9]/50 border-none outline-none focus:ring-2 focus:ring-pedraum-orange text-gray-700 font-medium"
                        />
                        <span className="text-xs text-gray-500 mt-1 block">Final</span>
                    </div>

                </div>

                {/* Grid de Cards de Oportunidades */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {demandasMock.map((demanda) => (
                        <OportunidadeCard
                            key={demanda.id}
                            id={demanda.id}
                            titulo={demanda.titulo}
                            descricao={demanda.descricao}
                            categoria={demanda.categoria}
                            status={demanda.status}
                        />
                    ))}
                </div>

            </main>
        </div>
    );
}