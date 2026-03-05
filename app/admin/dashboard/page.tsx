"use client";

import { useEffect, useState } from "react";
import { AdminCard } from "@/src/components/admin/AdminCard";
import { collection, query, onSnapshot, where, getDocs } from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { Loader2 } from "lucide-react";
// 1. A Importação mágica do nosso "Barril"!
import { DemandaModel } from "@/src/types";

export default function DashboardPage() {
    // 2. Agora o estado não é mais 'any', ele obedece ao contrato da DemandaModel
    const [demandas, setDemandas] = useState<DemandaModel[]>([]);
    const [carregando, setCarregando] = useState(true);

    // Estados para as Métricas
    const [metricas, setMetricas] = useState({
        novasSemana: 0,
        matchsSemana: 0,
        fornecedoresAtivos: 0,
        taxaConversao: 0
    });

    useEffect(() => {
        // 1. OUVINTE DE DEMANDAS (Tempo Real)
        const qDemandas = query(collection(db, "demandas"));

        const unsubscribeDemandas = onSnapshot(qDemandas, (snapshot) => {
            // 3. Avisamos ao TypeScript: "O que vem do banco é uma lista de DemandaModel"
            const demandasData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as DemandaModel[];

            // Ordenar por data mais recente
            demandasData.sort((a, b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime());

            setDemandas(demandasData);
            calcularMetricas(demandasData);
            setCarregando(false);
        });

        // 4. Tipamos o parâmetro da função para aceitar apenas DemandaModel
        const calcularMetricas = async (todasDemandas: DemandaModel[]) => {
            const seteDiasAtras = new Date();
            seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);

            // Filtra demandas criadas nos últimos 7 dias
            const demandasRecentes = todasDemandas.filter(d => new Date(d.dataCriacao) >= seteDiasAtras);

            const novasSemana = demandasRecentes.length;

            // Conta quantos matchs (resolvidas) houveram nos últimos 7 dias
            const matchsSemana = todasDemandas.filter(d =>
                d.status === "resolvida" &&
                d.dataFechamento &&
                new Date(d.dataFechamento) >= seteDiasAtras
            ).length;

            let taxaConversao = 0;
            if (novasSemana > 0) {
                taxaConversao = Math.round((matchsSemana / novasSemana) * 100);
            }

            // Conta fornecedores na coleção usuários (que tenham role fornecedor)
            let qtdFornecedores = 0;
            try {
                const qFornecedores = query(collection(db, "usuarios"), where("role", "==", "fornecedor"));
                const snapFornecedores = await getDocs(qFornecedores);
                qtdFornecedores = snapFornecedores.size;
            } catch (error) {
                console.error("Erro ao contar fornecedores:", error);
            }

            setMetricas({
                novasSemana,
                matchsSemana,
                fornecedoresAtivos: qtdFornecedores, // Usando total de cadastrados como placeholder para "Online"
                taxaConversao
            });
        };

        return () => unsubscribeDemandas();
    }, []);

    // 3. SEPARANDO AS DEMANDAS NAS COLUNAS OFICIAIS DO FLUXO
    const demandasCuradoria = demandas.filter(d => d.status === "curadoria");
    const demandasAbertas = demandas.filter(d => d.status === "aberta");
    const demandasNegociacao = demandas.filter(d => d.status === "negociacao");
    // Verifica se o status começa com "fechada" ou é "resolvida" (por garantia)
    const demandasConcluidas = demandas.filter(d => d.status === "resolvida" || d.status.startsWith("fechada"));

    return (
        <div className="min-h-screen bg-gray-50/50 p-8">

            {/* 1. Título do Dashboard */}
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-pedraum-dark">
                    Resumo da Semana (últimos 7 dias)
                </h1>
            </div>

            {/* 2. Cards de Métricas (Topo) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <div className="bg-[#D9D9D9] p-6 rounded-lg text-center shadow-sm">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Demandas Novas</h3>
                    <p className="text-4xl font-normal text-gray-900">{carregando ? "..." : metricas.novasSemana}</p>
                </div>
                <div className="bg-[#D9D9D9] p-6 rounded-lg text-center shadow-sm">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Matchs</h3>
                    <p className="text-4xl font-normal text-gray-900">{carregando ? "..." : metricas.matchsSemana}</p>
                </div>
                <div className="bg-[#D9D9D9] p-6 rounded-lg text-center shadow-sm">
                    <h3 className="text-lg font-medium text-gray-800 leading-tight mb-2">
                        Fornecedores <br /> Cadastrados
                    </h3>
                    <p className="text-4xl font-normal text-gray-900">{carregando ? "..." : metricas.fornecedoresAtivos}</p>
                </div>
                <div className="bg-[#D9D9D9] p-6 rounded-lg text-center shadow-sm">
                    <h3 className="text-lg font-medium text-gray-800 leading-tight mb-2">
                        Taxa de <br /> Conversão
                    </h3>
                    <p className="text-4xl font-normal text-gray-900">{carregando ? "..." : `${metricas.taxaConversao}%`}</p>
                </div>
            </div>

            {carregando ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-12 h-12 text-pedraum-orange animate-spin" />
                </div>
            ) : (
                /* 3. O Kanban (Grid Principal) */
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start h-full">

                    {/* Coluna 1: Em Análise (Curadoria) */}
                    <div className="flex flex-col gap-4">
                        <h2 className="text-xl font-bold text-black mb-2">Em Análise ({demandasCuradoria.length})</h2>
                        {demandasCuradoria.map(demanda => (
                            <AdminCard
                                key={demanda.id}
                                id={demanda.protocolo || `#${demanda.id.substring(0, 5).toUpperCase()}`}
                                demandaIdReal={demanda.id}
                                data={new Date(demanda.dataCriacao).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                                titulo={demanda.descricao.substring(0, 30) + '...'}
                                cliente={demanda.nomeComprador}
                                uf={demanda.uf || "MG"}
                                urgencia={demanda.urgencia as "Normal"}
                                status={demanda.status}
                            />
                        ))}
                    </div>

                    {/* Coluna 2: Novas (Abertas pro mercado) */}
                    <div className="flex flex-col gap-4">
                        <h2 className="text-xl font-bold text-black mb-2">Novas ({demandasAbertas.length})</h2>
                        {demandasAbertas.map(demanda => (
                            <AdminCard
                                key={demanda.id}
                                id={demanda.protocolo || `#${demanda.id.substring(0, 5).toUpperCase()}`}
                                demandaIdReal={demanda.id}
                                data={new Date(demanda.dataCriacao).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                                titulo={demanda.descricao.substring(0, 30) + '...'}
                                cliente={demanda.nomeComprador}
                                uf={demanda.uf || "MG"}
                                urgencia={demanda.urgencia as "Normal"}
                                status={demanda.status}
                            />
                        ))}
                    </div>

                    {/* Coluna 3: Em Negociação */}
                    <div className="flex flex-col gap-4">
                        <h2 className="text-xl font-bold text-black mb-2">Em Negociação ({demandasNegociacao.length})</h2>
                        {demandasNegociacao.map(demanda => (
                            <AdminCard
                                key={demanda.id}
                                id={demanda.protocolo || `#${demanda.id.substring(0, 5).toUpperCase()}`}
                                demandaIdReal={demanda.id}
                                data={new Date(demanda.dataCriacao).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                                titulo={demanda.descricao.substring(0, 30) + '...'}
                                cliente={demanda.nomeComprador}
                                uf={demanda.uf || "MG"}
                                urgencia={demanda.urgencia as "Normal"}
                                status={demanda.status}
                                stats={{ enviados: 1, respostas: 1 }} // Mockado por enquanto para o visual
                            />
                        ))}
                    </div>

                    {/* Coluna 4: Concluídas */}
                    <div className="flex flex-col gap-4">
                        <h2 className="text-xl font-bold text-black mb-2">Concluídas ({demandasConcluidas.length})</h2>
                        {demandasConcluidas.map(demanda => (
                            <AdminCard
                                key={demanda.id}
                                id={demanda.protocolo || `#${demanda.id.substring(0, 5).toUpperCase()}`}
                                demandaIdReal={demanda.id}
                                data={new Date(demanda.dataFechamento || demanda.dataCriacao).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                                titulo={demanda.descricao.substring(0, 30) + '...'}
                                cliente={demanda.nomeComprador}
                                uf={demanda.uf || "MG"}
                                urgencia={demanda.urgencia as "Normal"}
                                status={demanda.motivoFechamento === 'na_plataforma' ? 'fechada_match' : 'fechada_s_ret'}
                            />
                        ))}
                    </div>

                </div>
            )}
        </div>
    );
}