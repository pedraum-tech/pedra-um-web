"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/src/components/Header";
import { ProtectedRoute } from "@/src/components/ProtectedRoute";
import { useAuth } from "@/src/contexts/AuthContext";

// Ferramentas do Firebase para adicionar dados
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/src/lib/firebase";

export default function DemandasCompradorPage() {
    const { user } = useAuth();

    // 1. Estados do Formulário de Demanda
    const [descricao, setDescricao] = useState("");
    const [urgencia, setUrgencia] = useState("normal"); // 'normal', 'urgente', 'critico'

    // 2. Estados de Controle (Loading e Feedback)
    const [carregando, setCarregando] = useState(false);
    const [mensagem, setMensagem] = useState({ texto: "", tipo: "" });

    // 3. Função que dispara quando clica em "Cadastrar Demanda"
    const handleCriarDemanda = async (e: React.FormEvent) => {
        e.preventDefault();
        setMensagem({ texto: "", tipo: "" });

        if (descricao.trim().length < 10) {
            return setMensagem({ texto: "A descrição precisa ter pelo menos 10 caracteres.", tipo: "erro" });
        }

        setCarregando(true);

        try {
            // Cria um novo documento na coleção "demandas"
            await addDoc(collection(db, "demandas"), {
                compradorId: user?.uid, // ID de quem criou (fundamental para segurança depois)
                nomeComprador: user?.razaoSocial || user?.nome || "Comprador",
                descricao: descricao,
                urgencia: urgencia,
                status: "aberta", // Toda demanda nasce 'aberta' para os fornecedores verem
                dataCriacao: new Date().toISOString(),
            });

            // Sucesso! Limpa o formulário e avisa o usuário
            setDescricao("");
            setUrgencia("normal");
            setMensagem({ texto: "Sua solicitação foi enviada para o mercado!", tipo: "sucesso" });

            // Remove a mensagem de sucesso após 5 segundos
            setTimeout(() => setMensagem({ texto: "", tipo: "" }), 5000);

        } catch (error) {
            console.error("Erro ao criar demanda:", error);
            setMensagem({ texto: "Erro ao cadastrar demanda. Tente novamente.", tipo: "erro" });
        } finally {
            setCarregando(false);
        }
    };

    return (
        <ProtectedRoute allowedRoles={["comprador"]}>
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Header variant="buyer" />

                <div className="flex-1 max-w-5xl w-full mx-auto p-4 py-10 space-y-8">

                    {/* MENSAGEM DE ACOLHIDA DINÂMICA */}
                    <div className="mb-2">
                        <h1 className="text-3xl font-bold text-pedraum-dark">
                            Olá, {user?.razaoSocial || user?.nome || "visitante"}! 👋
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Aqui você pode gerenciar todas as suas necessidades de mineração.
                        </p>
                    </div>

                    {/* --- CARD 1: NOVA SOLICITAÇÃO --- */}
                    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] p-8 md:p-10">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-1">Nova Solicitação</h2>
                            <p className="text-gray-500 text-sm">Descreva o que você precisa e receba contatos.</p>
                        </div>

                        {/* Exibe erro ou sucesso */}
                        {mensagem.texto && (
                            <div className={`mb-6 p-4 rounded-lg text-sm font-medium ${mensagem.tipo === "sucesso" ? "bg-green-50 text-green-700 border-l-4 border-green-500" : "bg-red-50 text-red-700 border-l-4 border-red-500"}`}>
                                {mensagem.texto}
                            </div>
                        )}

                        <form onSubmit={handleCriarDemanda} className="space-y-6">
                            {/* Descrição Detalhada */}
                            <div>
                                <label className="block text-sm font-bold text-gray-800 uppercase tracking-wide mb-2">
                                    Descrição Detalhada*
                                </label>
                                <textarea
                                    required
                                    value={descricao}
                                    onChange={(e) => setDescricao(e.target.value)}
                                    className="w-full min-h-[140px] p-4 rounded-lg border border-gray-200 focus:border-pedraum-orange focus:ring-2 focus:ring-orange-100 outline-none transition-all resize-y text-gray-700 placeholder:text-gray-400"
                                    placeholder="Dica: Especifique quantidade, especificações técnicas, prazos, localização."
                                    maxLength={500}
                                ></textarea>
                                <div className="text-xs text-gray-400 mt-1 font-medium text-right">
                                    {descricao.length}/500
                                </div>
                            </div>

                            {/* Anexos (Visual apenas por enquanto) */}
                            <div className="opacity-50 cursor-not-allowed">
                                <label className="block text-sm font-medium text-gray-800 mb-3">
                                    Anexos (Em breve)
                                </label>
                                <div className="flex flex-wrap gap-3 pointer-events-none">
                                    <button type="button" className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-500">
                                        Imagens (5 max.)
                                    </button>
                                    <button type="button" className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-500">
                                        PDF (1 max.)
                                    </button>
                                </div>
                            </div>

                            {/* Urgência */}
                            <div>
                                <label className="block text-sm font-medium text-gray-800 mb-3">
                                    Urgência
                                </label>
                                <div className="flex flex-wrap gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setUrgencia("normal")}
                                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors flex items-center gap-2 ${urgencia === "normal" ? "border-pedraum-orange bg-orange-50 text-pedraum-orange shadow-sm" : "border-gray-200 text-gray-600 hover:bg-gray-50"
                                            }`}
                                    >
                                        😐 Normal
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setUrgencia("urgente")}
                                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors flex items-center gap-2 ${urgencia === "urgente" ? "border-pedraum-orange bg-orange-50 text-pedraum-orange shadow-sm" : "border-gray-200 text-gray-600 hover:bg-gray-50"
                                            }`}
                                    >
                                        😔 Urgente (7 dias)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setUrgencia("critico")}
                                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors flex items-center gap-2 ${urgencia === "critico" ? "border-pedraum-orange bg-orange-50 text-pedraum-orange shadow-sm" : "border-gray-200 text-gray-600 hover:bg-gray-50"
                                            }`}
                                    >
                                        🚨 Crítico (48h)
                                    </button>
                                </div>
                            </div>

                            {/* Botão Cadastrar */}
                            <div className="pt-4 flex justify-center">
                                <button
                                    type="submit"
                                    disabled={carregando}
                                    className="bg-pedraum-orange hover:bg-orange-600 text-white font-bold py-3 px-10 rounded-lg transition-colors shadow-md shadow-orange-500/20 text-lg disabled:opacity-70 flex items-center justify-center min-w-[240px]"
                                >
                                    {carregando ? (
                                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        "Cadastrar Demanda"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* --- CARD 2: MEUS PEDIDOS (Por enquanto estático) --- */}
                    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] p-8 md:p-10">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-1">Seus Pedidos</h2>
                            <p className="text-gray-500 text-sm">Acompanhe o status das suas solicitações.</p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[600px] text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="py-4 px-4 font-bold text-gray-800 rounded-tl-lg">Status</th>
                                        <th className="py-4 px-4 font-bold text-gray-800">Descrição</th>
                                        <th className="py-4 px-4 font-bold text-gray-800 text-right rounded-tr-lg">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 px-4 text-gray-800 font-medium">
                                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold uppercase">Aberta</span>
                                        </td>
                                        <td className="py-4 px-4 text-gray-600 text-sm max-w-md truncate">
                                            Exemplo de demanda (Em breve buscando do banco)
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <Link href="#" className="inline-block">
                                                <button className="border border-pedraum-orange text-pedraum-orange hover:bg-orange-50 font-bold text-xs py-2 px-4 rounded-md transition-colors">
                                                    Ver Detalhes
                                                </button>
                                            </Link>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                    </div>

                </div>
            </div>
        </ProtectedRoute>
    );
}