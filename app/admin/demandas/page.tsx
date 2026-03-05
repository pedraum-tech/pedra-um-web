"use client";

import { useState, useEffect } from "react";
import { AdminDemandaCard } from "@/src/components/admin/AdminDemandaCard";
import { Download, ChevronDown, Loader2 } from "lucide-react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/src/lib/firebase";

export default function AdminDemandasPage() {
    const [demandas, setDemandas] = useState<any[]>([]);
    const [carregando, setCarregando] = useState(true);

    // Estados para os Filtros
    const [busca, setBusca] = useState("");
    const [filtroCategoria, setFiltroCategoria] = useState("");
    const [filtroStatus, setFiltroStatus] = useState("");

    useEffect(() => {
        async function buscarDemandas() {
            try {
                // Busca todas as demandas, ordenando das mais novas para as mais velhas
                const q = query(collection(db, "demandas"), orderBy("dataCriacao", "desc"));
                const querySnapshot = await getDocs(q);

                const demandasData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setDemandas(demandasData);
            } catch (error) {
                console.error("Erro ao buscar demandas:", error);
            } finally {
                setCarregando(false);
            }
        }

        buscarDemandas();
    }, []);

    // LÓGICA DE FILTRAGEM (Roda toda vez que os estados acima mudam)
    const demandasFiltradas = demandas.filter(demanda => {
        const termoBusca = busca.toLowerCase();
        const protocoloOuId = (demanda.protocolo || demanda.id).toLowerCase();
        const tituloOuDesc = (demanda.descricao || "").toLowerCase();
        const cliente = (demanda.nomeComprador || "").toLowerCase();

        // 1. Filtro de Texto (Pesquisa)
        const bateuBusca =
            protocoloOuId.includes(termoBusca) ||
            tituloOuDesc.includes(termoBusca) ||
            cliente.includes(termoBusca);

        // 2. Filtro de Categoria (Por enquanto todas são "Geral")
        // const bateuCategoria = filtroCategoria === "" || demanda.categoria === filtroCategoria;
        const bateuCategoria = true; // Desativado até termos categorias reais no BD

        // 3. Filtro de Status
        let bateuStatus = true;
        if (filtroStatus !== "") {
            if (filtroStatus === "nova" && demanda.status !== "aberta") bateuStatus = false;
            // Adicione outras lógicas de status aqui conforme criar no BD
            if (filtroStatus === "concluida" && demanda.status !== "resolvida") bateuStatus = false;
        }

        return bateuBusca && bateuCategoria && bateuStatus;
    });

    // Função bônus para baixar CSV
    const exportarCSV = () => {
        alert("A lógica de montar a string CSV e fazer o download com Blob vai aqui!");
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-8">

            {/* Cabeçalho */}
            <div className="mb-8 relative flex items-center justify-center">
                <div className="absolute left-0">
                    <button onClick={exportarCSV} className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors shadow-sm text-sm font-bold group">
                        <Download className="w-4 h-4 text-pedraum-orange group-hover:scale-110 transition-transform" />
                        Exportar (CSV)
                        <ChevronDown className="w-4 h-4 ml-1 text-gray-400" />
                    </button>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Demandas</h1>
            </div>

            {/* Barra de Pesquisa */}
            <div className="mb-8">
                <input
                    type="text"
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    placeholder="Buscar demanda por ID, descrição ou cliente..."
                    className="w-full px-4 py-3 rounded-full border border-gray-300 focus:border-pedraum-orange focus:ring-2 focus:ring-orange-100 outline-none transition-all shadow-sm"
                />
            </div>

            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <div>
                    <label className="block text-lg font-bold text-gray-900 mb-2">Categoria</label>
                    <select
                        value={filtroCategoria}
                        onChange={(e) => setFiltroCategoria(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-[#D9D9D9] border-none outline-none focus:ring-2 focus:ring-pedraum-orange appearance-none cursor-pointer text-gray-900 font-medium text-lg"
                    >
                        <option value="">Todas...</option>
                        <option value="britagem">Britagem</option>
                        <option value="rolamentos">Rolamentos</option>
                    </select>
                </div>
                <div>
                    <label className="block text-lg font-bold text-gray-900 mb-2">Status</label>
                    <select
                        value={filtroStatus}
                        onChange={(e) => setFiltroStatus(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-[#D9D9D9] border-none outline-none focus:ring-2 focus:ring-pedraum-orange appearance-none cursor-pointer text-gray-900 font-medium text-lg"
                    >
                        <option value="">Todos...</option>
                        <option value="nova">Abertas / Novas</option>
                        <option value="concluida">Concluídas</option>
                    </select>
                </div>
                {/* Tempo Oculto para simplificar */}
                <div className="hidden md:block"></div>
                <div className="hidden md:block"></div>
            </div>

            {/* Grid de Cards */}
            {carregando ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-12 h-12 text-pedraum-orange animate-spin" />
                </div>
            ) : demandasFiltradas.length === 0 ? (
                <div className="text-center py-20 text-gray-500 font-medium">
                    Nenhuma demanda encontrada com estes filtros.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {demandasFiltradas.map((demanda) => (
                        <AdminDemandaCard
                            key={demanda.id}
                            id={demanda.protocolo || `#${demanda.id.substring(0, 5).toUpperCase()}`}
                            titulo={demanda.nomeComprador}
                            descricao={demanda.descricao}
                            categoria="Geral"
                            status={demanda.status}
                            // IMPORTANTE: Adicione essa prop no seu componente AdminDemandaCard para o link funcionar
                            demandaIdReal={demanda.id}
                        />
                    ))}
                </div>
            )}

        </div>
    );
}