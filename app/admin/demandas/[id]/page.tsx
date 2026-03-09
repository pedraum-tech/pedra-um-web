"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, Loader2 } from "lucide-react";

// Firebase
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/src/lib/firebase";

// 1. A Importação correta e completa do Barril
import { DemandaModel, UsuarioModel, PropostaModel } from "@/src/types";

export default function EditarDemandaAdminPage() {
    const params = useParams();
    const demandaId = params.id as string;
    const router = useRouter();

    const [demanda, setDemanda] = useState<DemandaModel | null>(null);

    // 2. Estados tipados rigorosamente
    const [todosFornecedores, setTodosFornecedores] = useState<UsuarioModel[]>([]);
    const [fornecedoresSelecionados, setFornecedoresSelecionados] = useState<string[]>([]);
    // CORREÇÃO AQUI: As propostas (quem clicou em liberar contato) usam a PropostaModel
    const [fornecedoresMatch, setFornecedoresMatch] = useState<PropostaModel[]>([]);

    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);

    // Estados do Formulário
    const [tituloEdit, setTituloEdit] = useState("");
    const [descricaoEdit, setDescricaoEdit] = useState("");
    const [categoriaEdit, setCategoriaEdit] = useState("");
    const [ufEdit, setUfEdit] = useState("");
    const [urgenciaEdit, setUrgenciaEdit] = useState("");
    const [statusEdit, setStatusEdit] = useState("");

    useEffect(() => {
        async function buscarDados() {
            if (!demandaId) return;

            try {
                // 1. Busca a Demanda
                const docRef = doc(db, "demandas", demandaId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    // Tipamos o retorno explicitamente como DemandaModel
                    const dados = { id: docSnap.id, ...docSnap.data() } as DemandaModel;
                    setDemanda(dados);

                    setTituloEdit(dados.nomeComprador || "Título da Demanda"); // Ajustado para usar o nome do comprador como título temporário ou crie o campo título na model se quiser
                    setDescricaoEdit(dados.descricao || "");
                    setCategoriaEdit(dados.categoria || "Britagem");
                    setUfEdit(dados.uf || "MG");
                    setUrgenciaEdit(dados.urgencia || "normal");
                    setStatusEdit(dados.status || "curadoria");

                    setFornecedoresSelecionados(dados.fornecedoresSelecionados || []);
                }

                // 2. Busca TODOS os fornecedores (CORRIGIDO: where("role", "==", "fornecedor"))
                const qFornecedores = query(collection(db, "usuarios"), where("tipo_usuario", "==", "fornecedor"));
                const snapFornecedores = await getDocs(qFornecedores);
                const listaFornecedores = snapFornecedores.docs.map(d => ({
                    id: d.id,
                    ...d.data()
                })) as UsuarioModel[];

                setTodosFornecedores(listaFornecedores);

                // 3. Busca as PROPOSTAS geradas (Matchs reais)
                const qPropostas = query(collection(db, "propostas"), where("demandaId", "==", demandaId));
                const snapPropostas = await getDocs(qPropostas);
                const listaMatches = snapPropostas.docs.map(d => ({
                    id: d.id,
                    ...d.data()
                })) as PropostaModel[];

                setFornecedoresMatch(listaMatches);

            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            } finally {
                setCarregando(false);
            }
        }
        buscarDados();
    }, [demandaId]);

    const toggleFornecedor = (fornecedorId: string) => {
        setFornecedoresSelecionados(prev => {
            if (prev.includes(fornecedorId)) {
                return prev.filter(id => id !== fornecedorId);
            } else {
                return [...prev, fornecedorId];
            }
        });
    };

    const handleSalvarAlteracoes = async () => {
        // --- NOVA TRAVA DE SEGURANÇA ---
        const novoStatus = (statusEdit === "curadoria" && fornecedoresSelecionados.length > 0)
            ? "aberta"
            : statusEdit;

        // Se a demanda vai ficar "aberta", ELA PRECISA ter alguém selecionado!
        if (novoStatus === "aberta" && fornecedoresSelecionados.length === 0) {
            alert("⚠️ Atenção: Para deixar a demanda 'Aberta', você precisa selecionar pelo menos 1 fornecedor na Interface de Matchmaking!");
            return; // Interrompe o salvamento
        }
        // ---------------------------------

        setSalvando(true);
        try {
            const docRef = doc(db, "demandas", demandaId);

            await updateDoc(docRef, {
                descricao: descricaoEdit,
                categoria: categoriaEdit,
                uf: ufEdit,
                urgencia: urgenciaEdit,
                status: novoStatus,
                fornecedoresSelecionados: fornecedoresSelecionados
            });

            setStatusEdit(novoStatus);
            alert("Alterações salvas com sucesso! Os fornecedores selecionados já podem ver a demanda.");
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert("Erro ao salvar.");
        } finally {
            setSalvando(false);
        }
    };

    if (carregando) return <div className="min-h-screen flex justify-center items-center"><Loader2 className="w-12 h-12 text-pedraum-orange animate-spin" /></div>;
    if (!demanda) return <div className="p-8 text-center font-bold text-gray-500">Demanda não encontrada.</div>;

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 flex flex-col gap-6 max-w-6xl mx-auto">

            <div className="flex items-center justify-between mb-4 relative">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-pedraum-orange hover:text-orange-600 font-medium transition-colors">
                    <ChevronLeft className="w-5 h-5" /> Voltar
                </button>
                <h1 className="text-3xl font-bold text-gray-900 absolute left-1/2 -translate-x-1/2 w-max">
                    Editar Demanda
                </h1>
                <div className="w-20"></div>
            </div>

            {/* --- SEÇÃO 1: DADOS DA DEMANDA --- */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

                <div className="mb-6 flex gap-4 items-center">
                    <span className={`text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide ${statusEdit === 'resolvida' || statusEdit.startsWith('fechada') ? 'bg-emerald-500' : statusEdit === 'curadoria' ? 'bg-purple-500' : 'bg-blue-500'}`}>
                        Status: {statusEdit}
                    </span>

                    <select
                        value={statusEdit}
                        onChange={(e) => setStatusEdit(e.target.value)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded bg-white text-gray-700 outline-none"
                    >
                        <option value="curadoria">Em Curadoria</option>
                        <option value="aberta">Aberta (Mercado)</option>
                        <option value="negociacao">Em Negociação</option>
                        <option value="resolvida">Resolvida / Fechada</option>
                    </select>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Cliente Solicitante</label>
                        <input type="text" readOnly value={demanda.nomeComprador || 'Cliente não identificado'} className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-600 outline-none cursor-not-allowed" />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2 uppercase">Descrição Detalhada</label>
                        <textarea value={descricaoEdit} onChange={(e) => setDescricaoEdit(e.target.value)} className="w-full min-h-[120px] p-4 rounded-lg border border-gray-300 focus:border-pedraum-orange outline-none transition-all resize-y text-gray-700"></textarea>
                        <div className="text-xs text-gray-400 mt-1 font-medium">{descricaoEdit.length}/500</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">Categoria</label>
                            <select value={categoriaEdit} onChange={(e) => setCategoriaEdit(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pedraum-orange outline-none transition-all bg-white text-gray-700 appearance-none cursor-pointer">
                                <option value="Britagem">Britagem</option>
                                <option value="Rolamentos">Rolamentos</option>
                                <option value="Transporte">Transporte</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">UF</label>
                            <select value={ufEdit} onChange={(e) => setUfEdit(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pedraum-orange outline-none transition-all bg-white text-gray-700 appearance-none cursor-pointer">
                                <option value="MG">MG</option>
                                <option value="SP">SP</option>
                                <option value="RJ">RJ</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-3">Urgência</label>
                        <div className="flex gap-3">
                            <button onClick={() => setUrgenciaEdit("normal")} type="button" className={`px-4 py-2 rounded-lg border text-sm font-medium flex items-center gap-2 transition-colors ${urgenciaEdit.toLowerCase() === 'normal' ? 'border-pedraum-orange text-pedraum-orange bg-orange-50/50' : 'border-gray-300 text-gray-500'}`}>😐 Normal</button>
                            <button onClick={() => setUrgenciaEdit("urgente")} type="button" className={`px-4 py-2 rounded-lg border text-sm font-medium flex items-center gap-2 transition-colors ${urgenciaEdit.toLowerCase() === 'urgente' ? 'border-pedraum-orange text-pedraum-orange bg-orange-50/50' : 'border-gray-300 text-gray-500'}`}>😔 Urgente (7 dias)</button>
                            <button onClick={() => setUrgenciaEdit("critico")} type="button" className={`px-4 py-2 rounded-lg border text-sm font-medium flex items-center gap-2 transition-colors ${urgenciaEdit.toLowerCase() === 'critico' ? 'border-red-500 text-red-500 bg-red-50/50' : 'border-gray-300 text-gray-500'}`}>🚨 Crítico (48h)</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- SEÇÃO 2: INTERFACE DE MATCHMAKING (Disparo de Leads) --- */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 uppercase">INTERFACE DE MATCHMAKING</h2>
                <p className="text-gray-500 text-sm font-medium mb-6 uppercase">
                    SELECIONE OS FORNECEDORES QUE RECEBERÃO ESTE LEAD:
                </p>

                {todosFornecedores.length === 0 ? (
                    <div className="text-center text-gray-500 py-6 border border-dashed rounded-lg">Nenhum fornecedor cadastrado no banco de dados.</div>
                ) : (
                    <div className="space-y-4">
                        {todosFornecedores.map((fornecedor) => {
                            const isSelected = fornecedoresSelecionados.includes(fornecedor.id);

                            return (
                                <div key={fornecedor.id} className={`border rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all ${isSelected ? 'border-pedraum-orange bg-orange-50/30' : 'border-gray-200 bg-[#F8FAFC]/50'}`}>
                                    <div className="space-y-3">
                                        <h4 className="text-xl font-bold text-gray-900">{fornecedor.razaoSocial || fornecedor.nome || 'Fornecedor sem nome'}</h4>
                                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-800">
                                            <span className="font-medium">Telefone:</span>
                                            <span className="border border-gray-300 px-2 py-0.5 rounded text-xs bg-white">{fornecedor.telefone || 'N/A'}</span>
                                            <span className="mx-1 text-gray-300">|</span>
                                            <span className="font-medium">Atuação:</span>
                                            <span className="border border-gray-300 px-2 py-0.5 rounded text-xs bg-white">Nacional</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-3 min-w-[200px]">
                                        <div className="bg-pedraum-orange text-gray-900 font-black text-xl px-6 py-2 rounded-lg">
                                            {isSelected ? 'SELECIONADO' : '98%'}
                                        </div>
                                        <div className="flex flex-col w-full gap-2">
                                            <button className="w-full border border-pedraum-orange text-pedraum-orange hover:bg-orange-50 text-xs font-bold py-2 rounded transition-colors">
                                                Visualizar Perfil
                                            </button>
                                            <button
                                                onClick={() => toggleFornecedor(fornecedor.id)}
                                                className={`w-full text-xs font-bold py-2 rounded transition-colors shadow-sm ${isSelected ? 'bg-gray-900 text-white hover:bg-black' : 'bg-pedraum-orange text-gray-900 hover:bg-orange-600'}`}
                                            >
                                                {isSelected ? 'Remover Contato' : 'Selecionar Para Contato'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* --- SEÇÃO 3: FORNECEDORES QUE VISUALIZARAM (Propostas reais) --- */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Fornecedores que visualizaram (Gastaram Lead)</h2>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="py-4 px-4 font-normal text-gray-600">Nome / Empresa</th>
                                <th className="py-4 px-4 font-normal text-gray-600">Status do Lead</th>
                                <th className="py-4 px-4 font-normal text-gray-600 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fornecedoresMatch.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="py-8 text-center text-gray-500 text-sm">
                                        Nenhum fornecedor destrancou este contato ainda.
                                    </td>
                                </tr>
                            ) : (
                                fornecedoresMatch.map((match) => (
                                    <tr key={match.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-4 font-medium text-gray-900">{match.nomeFornecedor}</td>
                                        <td className="py-4 px-4 text-green-600 font-bold text-sm">✓ Contato Liberado</td>
                                        <td className="py-4 px-4 text-right">
                                            <button className="border border-pedraum-orange text-pedraum-orange hover:bg-orange-50 font-bold text-xs py-1.5 px-3 rounded transition-colors">
                                                Ver Proposta
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- BOTÃO FLUTUANTE DE SALVAR --- */}
            <div className="flex justify-end mt-4 mb-8">
                <button
                    onClick={handleSalvarAlteracoes}
                    disabled={salvando}
                    className="bg-pedraum-orange hover:bg-orange-600 text-gray-900 font-bold py-3 px-10 rounded-lg shadow-md transition-colors text-lg flex items-center justify-center min-w-[200px] disabled:opacity-70 hover:-translate-y-0.5"
                >
                    {salvando ? <Loader2 className="w-6 h-6 animate-spin" /> : "Salvar Alterações & Disparar"}
                </button>
            </div>

        </div>
    );
}