"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/src/components/Header";

export default function DetalhesOportunidadePage() {
    // Estado que controla se o fornecedor já clicou em "Atender"
    const [mostrarLead, setMostrarLead] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Cabeçalho do Fornecedor */}
            <Header variant="supplier" />

            {/* Container Principal */}
            <div className="flex-1 max-w-5xl w-full mx-auto p-4 py-10 space-y-6">

                {/* --- CARD 1: DETALHES DA DEMANDA --- */}
                <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] p-8 md:p-10">

                    {/* Botão Voltar */}
                    <div className="mb-6">
                        <Link
                            href="/fornecedor"
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
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                            Descrição
                        </label>
                        <div className="w-full min-h-[120px] p-4 rounded-lg border border-gray-300 bg-white text-gray-500 text-sm">
                            Dica: Especifique quantidade, especificações técnicas, prazos, localização.
                        </div>
                    </div>

                </div>

                {/* --- CARD 2: AÇÃO / DADOS DO LEAD --- */}
                {/* Usamos uma animação suave para revelar os dados */}
                <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] p-8 md:p-10 transition-all duration-500 ease-in-out">

                    {!mostrarLead ? (
                        // ESTADO 1: Botão "Atender Demanda"
                        <div className="flex justify-center animate-in fade-in zoom-in duration-300">
                            <button
                                onClick={() => setMostrarLead(true)}
                                className="bg-pedraum-orange hover:bg-orange-500 text-gray-900 font-medium py-3 px-10 rounded-md transition-colors shadow-sm text-lg"
                            >
                                Atender Demanda
                            </button>
                        </div>
                    ) : (
                        // ESTADO 2: Dados do Comprador (Lead) Revelados
                        <div className="flex flex-col gap-4 animate-in slide-in-from-bottom-4 fade-in duration-500">
                            <div className="text-xl">
                                <span className="text-gray-700 font-normal mr-2">Nome:</span>
                                <strong className="text-gray-900">Lucas David</strong>
                            </div>

                            <div className="text-xl">
                                <span className="text-gray-700 font-normal mr-2">Email:</span>
                                <strong className="text-gray-900">lucas@email.com</strong>
                            </div>

                            <div className="text-xl">
                                <span className="text-gray-700 font-normal mr-2">Telefone:</span>
                                <strong className="text-gray-900">(35) 99999-9999</strong>
                            </div>
                        </div>
                    )}

                </div>

            </div>
        </div>
    );
}