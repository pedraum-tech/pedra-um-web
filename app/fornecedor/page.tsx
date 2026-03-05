"use client";

import { useEffect, useState } from "react";
import { Header } from "@/src/components/Header";
import { OportunidadeCard } from "@/src/components/OportunidadeCard";
import { ProtectedRoute } from "@/src/components/ProtectedRoute";
import { useAuth } from "@/src/contexts/AuthContext";
import { Loader2, SearchX } from "lucide-react";
import { DemandaModel } from "@/src/types";

// Ferramentas do Firebase
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/src/lib/firebase";

export default function OportunidadesPage() {
    const { user } = useAuth();

    // 1. Estados para guardar as demandas reais e o carregamento
    const [demandas, setDemandas] = useState<DemandaModel[]>([]);
    const [carregando, setCarregando] = useState(true);

    // 2. Busca em Tempo Real no Banco de Dados (COM BARREIRA DE INVISIBILIDADE)
    useEffect(() => {
        if (!user?.uid) return; // Segurança extra: só roda se o fornecedor estiver logado

        // A MÁGICA ACONTECE AQUI:
        // "Traga as demandas onde o array 'fornecedoresSelecionados' contenha o MEU UID"
        const q = query(
            collection(db, "demandas"),
            where("fornecedoresSelecionados", "array-contains", user.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const demandasBuscadas = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as DemandaModel[];

            // Filtro duplo no JavaScript para garantir que ele só veja o que deve
            // (Ele pode ver se está aberta ou se já está em negociação, mas não vê as fechadas)
            const demandasFiltradas = demandasBuscadas.filter(d =>
                d.status === "aberta" || d.status === "negociacao"
            );

            // Ordena via JavaScript para mostrar as mais recentes primeiro
            demandasFiltradas.sort((a, b) =>
                new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime()
            );

            setDemandas(demandasFiltradas);
            setCarregando(false);
        }, (error) => {
            console.error("Erro ao escutar demandas:", error);
            setCarregando(false);
        });

        return () => unsubscribe();
    }, [user?.uid]); // Adiciona o user.uid nas dependências para recarregar se o login mudar

    return (
        <ProtectedRoute allowedRoles={["fornecedor"]}>
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Header variant="supplier" />

                <main className="flex-1 w-full max-w-6xl mx-auto p-4 py-8">

                    <div className="mb-2">
                        <h1 className="text-3xl font-bold text-pedraum-dark">
                            Olá, {user?.razaoSocial || user?.nome || "Fornecedor"}! 👋
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Acompanhe novas oportunidades de negócio e gerencie suas propostas.
                        </p>
                    </div>

                    <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
                        Suas Oportunidades
                    </h1>

                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Buscar demandas..."
                            className="w-full px-4 py-2 rounded-full border border-gray-300 focus:border-pedraum-orange focus:ring-2 focus:ring-orange-100 outline-none transition-all shadow-sm"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                        <div>
                            <label className="block text-base font-bold text-gray-900 mb-2">Categoria</label>
                            <select className="w-full px-4 py-2.5 rounded-lg bg-[#D9D9D9]/50 border-none outline-none focus:ring-2 focus:ring-pedraum-orange appearance-none cursor-pointer text-gray-700 font-medium">
                                <option value="">Selecione...</option>
                                <option value="britagem">Britagem</option>
                                <option value="transporte">Transporte</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-base font-bold text-gray-900 mb-2">Status</label>
                            <select className="w-full px-4 py-2.5 rounded-lg bg-[#D9D9D9]/50 border-none outline-none focus:ring-2 focus:ring-pedraum-orange appearance-none cursor-pointer text-gray-700 font-medium">
                                <option value="">Selecione...</option>
                                <option value="novo">Novo</option>
                                <option value="urgente">Urgente</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-base font-bold text-gray-900 mb-2">Tempo</label>
                            <input type="date" className="w-full px-4 py-2.5 rounded-lg bg-[#D9D9D9]/50 border-none outline-none focus:ring-2 focus:ring-pedraum-orange text-gray-700 font-medium" />
                            <span className="text-xs text-gray-500 mt-1 block">Inicial</span>
                        </div>
                        <div className="flex flex-col justify-start">
                            <label className="block text-base font-bold text-transparent mb-2 hidden md:block">.</label>
                            <input type="date" className="w-full px-4 py-2.5 rounded-lg bg-[#D9D9D9]/50 border-none outline-none focus:ring-2 focus:ring-pedraum-orange text-gray-700 font-medium" />
                            <span className="text-xs text-gray-500 mt-1 block">Final</span>
                        </div>
                    </div>

                    {/* --- FEED DE OPORTUNIDADES --- */}
                    {carregando ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="w-12 h-12 text-pedraum-orange animate-spin" />
                        </div>
                    ) : demandas.length === 0 ? (
                        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                            <SearchX className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Nenhuma oportunidade no momento</h2>
                            <p className="text-gray-500">
                                Assim que os compradores publicarem novas demandas, elas aparecerão aqui automaticamente.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {demandas.map((demanda) => (
                                <OportunidadeCard
                                    key={demanda.id}
                                    id={demanda.id} // Passa o ID real para o Firebase conseguir buscar
                                    displayId={demanda.protocolo || `#${demanda.id.substring(0, 5).toUpperCase()}`} // Passa o ID bonito para a tela
                                    titulo={demanda.nomeComprador}
                                    descricao={demanda.descricao}
                                    categoria="Geral"
                                    status={demanda.urgencia}
                                />
                            ))}
                        </div>
                    )}

                </main>
            </div>
        </ProtectedRoute>
    );
}