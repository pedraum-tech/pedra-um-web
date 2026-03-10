// src/components/admin/FiltroUsuariosAdmin.tsx
"use client";

import { useState, useEffect } from "react";
import { Download, ChevronDown, Loader2 } from "lucide-react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { UsuarioModel } from "@/src/types";

interface FiltroUsuariosAdminProps {
    titulo: string;
    roleFiltro: "fornecedor" | "comprador";
    // Recebemos o Componente de Card como propriedade!
    CardComponent: React.ComponentType<any>;
}

export function FiltroUsuariosAdmin({ titulo, roleFiltro, CardComponent }: FiltroUsuariosAdminProps) {
    const [usuarios, setUsuarios] = useState<UsuarioModel[]>([]);
    const [carregando, setCarregando] = useState(true);

    // Estados de Filtro
    const [buscaTexto, setBuscaTexto] = useState("");
    const [categoriaBusca, setCategoriaBusca] = useState("");
    const [statusBusca, setStatusBusca] = useState("");

    useEffect(() => {
        async function buscarUsuarios() {
            setCarregando(true);
            try {
                // Busca no banco apenas os usuários da role específica
                const q = query(
                    collection(db, "usuarios"),
                    where("role", "==", roleFiltro), // Certifique-se que no BD está "role" e não "role"
                    orderBy("data_cadastro", "desc")
                );

                const querySnapshot = await getDocs(q);
                const lista = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as UsuarioModel[];

                setUsuarios(lista);
            } catch (error) {
                console.error("Erro ao buscar usuários:", error);
            } finally {
                setCarregando(false);
            }
        }

        buscarUsuarios();
    }, [roleFiltro]);

    // Aplica os filtros no frontend (para não gastar leituras do Firebase a cada tecla)
    const usuariosFiltrados = usuarios.filter(user => {
        const matchTexto = (user.nome?.toLowerCase() || user.razaoSocial?.toLowerCase() || "").includes(buscaTexto.toLowerCase()) ||
            (user.email?.toLowerCase() || "").includes(buscaTexto.toLowerCase()) ||
            user.id?.includes(buscaTexto);

        // Se no futuro você adicionar 'categoria' e 'status' no Model de Usuário, habilite estas linhas:
        // const matchCategoria = categoriaBusca ? user.categorias?.includes(categoriaBusca) : true;
        // const matchStatus = statusBusca ? user.status === statusBusca : true;

        return matchTexto; // && matchCategoria && matchStatus;
    });

    return (
        <div className="min-h-screen bg-gray-50/50 p-8">

            {/* Cabeçalho da Página */}
            <div className="mb-8 relative flex items-center justify-center">
                <div className="absolute left-0">
                    <button className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors shadow-sm text-sm font-bold group">
                        <Download className="w-4 h-4 text-pedraum-orange group-hover:scale-110 transition-transform" />
                        Exportar (CSV)
                        <ChevronDown className="w-4 h-4 ml-1 text-gray-400" />
                    </button>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">{titulo}</h1>
            </div>

            {/* Barra de Pesquisa */}
            <div className="mb-8">
                <input
                    type="text"
                    value={buscaTexto}
                    onChange={(e) => setBuscaTexto(e.target.value)}
                    placeholder={`Buscar ${roleFiltro} por nome, email ou ID...`}
                    className="w-full px-4 py-3 rounded-full border border-gray-300 focus:border-pedraum-orange focus:ring-2 focus:ring-orange-100 outline-none transition-all shadow-sm"
                />
            </div>

            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <div>
                    <label className="block text-lg font-bold text-gray-900 mb-2">Categoria</label>
                    <select value={categoriaBusca} onChange={(e) => setCategoriaBusca(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-[#D9D9D9] border-none outline-none focus:ring-2 focus:ring-pedraum-orange appearance-none cursor-pointer text-gray-900 font-medium text-lg">
                        <option value="">Selecione...</option>
                        <option value="britagem">Britagem</option>
                    </select>
                </div>
                <div>
                    <label className="block text-lg font-bold text-gray-900 mb-2">Status</label>
                    <select value={statusBusca} onChange={(e) => setStatusBusca(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-[#D9D9D9] border-none outline-none focus:ring-2 focus:ring-pedraum-orange appearance-none cursor-pointer text-gray-900 font-medium text-lg">
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

            {/* Feed de Dados */}
            {carregando ? (
                <div className="flex justify-center items-center h-40">
                    <Loader2 className="w-10 h-10 text-pedraum-orange animate-spin" />
                </div>
            ) : usuariosFiltrados.length === 0 ? (
                <div className="text-center text-gray-500 py-10 font-medium">Nenhum registro encontrado.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {usuariosFiltrados.map((usuario) => (
                        <CardComponent
                            key={usuario.id}
                            // Mapeamos os dados do BD para o formato que os seus cards esperam
                            id={usuario.id}
                            nome={usuario.razaoSocial || usuario.nome || "Não informado"}
                            email={usuario.email}
                            telefone={usuario.telefone}
                            idUsuario={usuario.id}
                            categoria={usuario.categorias ? usuario.categorias[0] : "Geral"}

                            // Fornecedor
                            leadsVistos={usuario.leadsDesbloqueados || 0}

                            // COMPRADOR: AQUI ESTÁ A MUDANÇA!
                            metric={usuario.demandasCriadas || 0} // Você pode fazer uma contagem de demandas abertas no futuro
                        />
                    ))}
                </div>
            )}

        </div>
    );
}