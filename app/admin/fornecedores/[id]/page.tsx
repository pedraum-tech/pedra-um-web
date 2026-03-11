"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Loader2, Save, Coins, Plus } from "lucide-react";
import { doc, getDoc, updateDoc, collection, query, where, getDocs, orderBy, limit, increment } from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { UsuarioModel } from "@/src/types";
import { CATEGORIAS } from "@/src/constants/taxonomia";

// Tipo temporário para mapear as propostas/leads visualizados do banco
interface PropostaAdmin {
    id: string;
    demandaId: string;
    status: string;
    dataCriacao: string;
}

export default function EditarFornecedorAdminPage() {
    const params = useParams();
    const router = useRouter();
    const fornecedorId = params.id as string;

    const [usuario, setUsuario] = useState<UsuarioModel | null>(null);
    const [propostas, setPropostas] = useState<PropostaAdmin[]>([]);

    // Estados de Loading e Salvamento
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [adicionandoSaldo, setAdicionandoSaldo] = useState(false);

    // Estados do Formulário Base
    const [nomeEdit, setNomeEdit] = useState("");
    const [emailEdit, setEmailEdit] = useState("");
    const [telefoneEdit, setTelefoneEdit] = useState("");
    const [statusEdit, setStatusEdit] = useState("");
    const [roleEdit, setRoleEdit] = useState("");

    // Estados Exclusivos do Fornecedor
    const [categoriasEdit, setCategoriasEdit] = useState<string[]>([]);
    const [descricaoEdit, setDescricaoEdit] = useState("");
    const [ufEdit, setUfEdit] = useState("");

    // Estado para Injeção de Saldo
    const [quantidadeAdicionar, setQuantidadeAdicionar] = useState<number | "">("");

    useEffect(() => {
        async function buscarDados() {
            if (!fornecedorId) return;

            try {
                // 1. Busca os Dados do Fornecedor
                const userRef = doc(db, "usuarios", fornecedorId);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const userData = { id: userSnap.id, ...userSnap.data() } as UsuarioModel;
                    setUsuario(userData);

                    setNomeEdit(userData.nome || userData.razaoSocial || "");
                    setEmailEdit(userData.email || "");
                    setTelefoneEdit(userData.telefone || "");
                    setStatusEdit(userData.status || "ativo");
                    setRoleEdit(userData.role || "fornecedor");

                    // Arrays ou Strings dependendo de como você salvou no cadastro
                    setCategoriasEdit(userData.categorias ? userData.categorias : []);
                    setDescricaoEdit(userData.descricaoCategorias || "");
                    setUfEdit(userData.uf || "");
                } else {
                    alert("Fornecedor não encontrado!");
                    router.push("/admin/fornecedores");
                    return;
                }

                // 2. Busca as Propostas (Histórico de Leads Desbloqueados) com Proteção (Limit)
                const propostasQuery = query(
                    collection(db, "propostas"),
                    where("fornecedorId", "==", fornecedorId),
                    orderBy("dataCriacao", "desc"),
                    limit(5) // Traz apenas as 5 mais recentes
                );

                const propostasSnap = await getDocs(propostasQuery);
                const listaPropostas = propostasSnap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as PropostaAdmin[];

                setPropostas(listaPropostas);

            } catch (error) {
                console.error("Erro ao buscar dados do fornecedor:", error);
            } finally {
                setCarregando(false);
            }
        }

        buscarDados();
    }, [fornecedorId, router]);

    const handleSalvar = async () => {
        if (!usuario) return;
        setSalvando(true);

        try {
            const userRef = doc(db, "usuarios", usuario.id);
            await updateDoc(userRef, {
                nome: nomeEdit,
                email: emailEdit,
                telefone: telefoneEdit,
                status: statusEdit,
                role: roleEdit,
                categorias: categoriasEdit,
                descricaoCategorias: descricaoEdit,
                uf: ufEdit
            });

            alert("Dados do fornecedor atualizados com sucesso!");
        } catch (error) {
            console.error("Erro ao salvar alterações:", error);
            alert("Erro ao salvar. Tente novamente.");
        } finally {
            setSalvando(false);
        }
    };

    const toggleCategoria = (categoria: string) => {
        setCategoriasEdit((prev) => {
            if (prev.includes(categoria)) {
                // Se já tem, remove
                return prev.filter((c) => c !== categoria);
            } else {
                // Se não tem, adiciona (mas trava em 3 no máximo)
                if (prev.length >= 3) {
                    alert("Você só pode selecionar no máximo 3 categorias.");
                    return prev;
                }
                return [...prev, categoria];
            }
        });
    };

    const handleAdicionarSaldo = async () => {
        if (!usuario || !quantidadeAdicionar || quantidadeAdicionar <= 0) return;
        setAdicionandoSaldo(true);

        try {
            const userRef = doc(db, "usuarios", usuario.id);
            await updateDoc(userRef, {
                saldoLeads: increment(Number(quantidadeAdicionar))
            });

            // Atualiza o estado na tela instantaneamente (UX Premium)
            setUsuario(prev => prev ? { ...prev, saldoLeads: (prev.saldoLeads || 0) + Number(quantidadeAdicionar) } : prev);
            setQuantidadeAdicionar("");
            alert(`${quantidadeAdicionar} Leads injetados na conta do fornecedor com sucesso!`);

        } catch (error) {
            console.error("Erro ao adicionar saldo:", error);
            alert("Falha ao adicionar saldo.");
        } finally {
            setAdicionandoSaldo(false);
        }
    };

    if (carregando) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <Loader2 className="w-12 h-12 text-pedraum-orange animate-spin" />
            </div>
        );
    }

    if (!usuario) return null;

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 flex flex-col gap-6 max-w-5xl mx-auto">

            {/* Cabeçalho */}
            <div className="flex items-center justify-between mb-4 relative">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-pedraum-orange hover:text-orange-600 font-medium transition-colors z-10"
                >
                    <ChevronLeft className="w-5 h-5" />
                    Voltar
                </button>
                <h1 className="text-3xl font-bold text-gray-900 absolute left-1/2 -translate-x-1/2 w-full text-center pointer-events-none">
                    Editar Fornecedor
                </h1>
            </div>

            {/* --- O PULO DO GATO: GESTÃO DE SALDO DE LEADS --- */}
            <div className="bg-gradient-to-r from-pedraum-dark to-[#04405e] rounded-2xl shadow-lg p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="bg-white/10 p-4 rounded-full">
                        <Coins className="w-10 h-10 text-pedraum-orange" />
                    </div>
                    <div>
                        <p className="text-blue-100 text-sm font-medium uppercase tracking-wider mb-1">Saldo Atual de Leads</p>
                        <h2 className="text-4xl font-black text-white">
                            {usuario.saldoLeads || 0} <span className="text-xl font-medium text-blue-200">Leads</span>
                        </h2>
                    </div>
                </div>

                <div className="bg-white/10 p-1.5 rounded-lg flex items-center w-full md:w-auto">
                    <input
                        type="number"
                        min="1"
                        placeholder="Qtd..."
                        value={quantidadeAdicionar}
                        onChange={(e) => setQuantidadeAdicionar(e.target.value ? Number(e.target.value) : "")}
                        className="bg-transparent border-none text-white placeholder:text-blue-200 px-4 py-2 w-24 outline-none font-bold text-lg text-center"
                    />
                    <button
                        onClick={handleAdicionarSaldo}
                        disabled={adicionandoSaldo || !quantidadeAdicionar}
                        className="bg-pedraum-orange hover:bg-orange-500 text-gray-900 font-bold py-2.5 px-6 rounded-md transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {adicionandoSaldo ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                        Injetar Leads
                    </button>
                </div>
            </div>

            {/* --- SEÇÃO 1: DADOS DO FORNECEDOR --- */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

                <div className="flex justify-between items-start mb-8">
                    <div>
                        <select
                            value={statusEdit}
                            onChange={(e) => setStatusEdit(e.target.value)}
                            className={`text-white text-xs font-bold px-4 py-1.5 rounded-full outline-none cursor-pointer border-r-8 border-transparent appearance-none ${statusEdit === 'ativo' ? 'bg-[#00C853]' : 'bg-red-500'}`}
                        >
                            <option value="ativo">Status: Ativo</option>
                            <option value="inativo">Status: Inativo</option>
                            <option value="bloqueado">Status: Bloqueado</option>
                        </select>
                    </div>
                    <div className="w-48">
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                            Tipo de usuário
                        </label>
                        <select
                            value={roleEdit}
                            onChange={(e) => setRoleEdit(e.target.value)}
                            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:border-pedraum-orange outline-none bg-white text-gray-700 text-sm cursor-pointer"
                        >
                            <option value="fornecedor">Fornecedor</option>
                            <option value="comprador">Comprador</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Foto de Perfil</label>
                        <button type="button" className="px-4 py-2 rounded-lg border border-pedraum-orange text-sm font-medium text-gray-800 hover:bg-orange-50 transition-colors bg-white">
                            Selecionar Imagem
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Nome / Razão Social</label>
                        <input
                            type="text"
                            value={nomeEdit}
                            onChange={(e) => setNomeEdit(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pedraum-orange outline-none transition-all text-gray-700"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Email</label>
                        <input
                            type="email"
                            value={emailEdit}
                            onChange={(e) => setEmailEdit(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pedraum-orange outline-none transition-all text-gray-700"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Telefone/Whatsapp</label>
                        <input
                            type="tel"
                            value={telefoneEdit}
                            onChange={(e) => setTelefoneEdit(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pedraum-orange outline-none transition-all text-gray-700"
                        />
                    </div>

                    {/* --- NOVO GRID DE CATEGORIAS TIPO CHECKBOX --- */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <label className="block text-sm font-bold text-gray-900">
                                Categorias de Atuação*
                            </label>
                            <span className="text-sm font-medium text-gray-500">
                                Selecionadas: <strong className={categoriasEdit.length === 3 ? "text-pedraum-orange" : ""}>{categoriasEdit.length}/3</strong>
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {CATEGORIAS.map((cat) => {
                                const isSelected = categoriasEdit.includes(cat);
                                return (
                                    <label
                                        key={cat}
                                        className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${isSelected
                                            ? 'border-pedraum-orange bg-orange-50/50 shadow-sm'
                                            : 'border-gray-100 hover:border-orange-200 bg-white'
                                            }`}
                                    >
                                        <div className="mt-0.5">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => toggleCategoria(cat)}
                                                className="w-5 h-5 accent-pedraum-orange cursor-pointer rounded border-gray-300"
                                            />
                                        </div>
                                        <span className={`text-sm leading-tight ${isSelected ? 'text-pedraum-orange font-bold' : 'text-gray-700 font-medium'}`}>
                                            {cat}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Descrição das Categorias</label>
                        <textarea
                            value={descricaoEdit}
                            onChange={(e) => setDescricaoEdit(e.target.value)}
                            placeholder="Dica: Ex: Britagem, Transporte, Manutenção de Máquinas..."
                            className="w-full min-h-[120px] p-4 rounded-lg border border-gray-300 focus:border-pedraum-orange outline-none transition-all resize-y text-gray-700"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">UF</label>
                        <select
                            value={ufEdit}
                            onChange={(e) => setUfEdit(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pedraum-orange outline-none transition-all bg-white text-gray-700 cursor-pointer"
                        >
                            <option value="">Selecione o estado...</option>
                            <option value="MG">MG</option>
                            <option value="SP">SP</option>
                            <option value="RJ">RJ</option>
                        </select>
                    </div>

                    <div className="pt-2">
                        <button type="button" className="px-4 py-2 rounded-lg border border-pedraum-orange text-sm font-medium text-gray-800 hover:bg-orange-50 transition-colors bg-white">
                            Alterar a Senha
                        </button>
                    </div>

                </div>
            </div>

            {/* --- SEÇÃO 2: DEMANDAS VISUALIZADAS --- */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    Demandas Visualizadas
                    <span className="bg-pedraum-orange text-gray-900 text-sm font-black py-1 px-3 rounded-full shadow-sm">
                        {usuario.leadsDesbloqueados || propostas.length} Total
                    </span>
                </h2>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="py-4 px-4 font-normal text-gray-600">ID da Demanda</th>
                                <th className="py-4 px-4 font-normal text-gray-600">Status do Contato</th>
                                <th className="py-4 px-4 font-normal text-gray-600 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {propostas.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="py-8 text-center text-gray-500 font-medium">
                                        Este fornecedor ainda não visualizou nenhuma demanda.
                                    </td>
                                </tr>
                            ) : (
                                propostas.map((proposta) => (
                                    <tr key={proposta.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-4 font-medium text-gray-900 text-sm">
                                            {/* O Firebase gera IDs grandes, vamos mostrar só um trecho ou a palavra Demanda */}
                                            Demanda {proposta.demandaId.substring(0, 8)}...
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="px-2 py-1 rounded text-xs font-bold uppercase bg-green-100 text-green-700">
                                                {proposta.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <Link href={`/admin/demandas/${proposta.demandaId}`}>
                                                <button className="border border-pedraum-orange text-pedraum-orange hover:bg-orange-50 font-bold text-xs py-1.5 px-3 rounded transition-colors bg-white">
                                                    Ver Demanda
                                                </button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- BOTÃO SALVAR --- */}
            <div className="flex justify-end mt-2 mb-8">
                <button
                    onClick={handleSalvar}
                    disabled={salvando}
                    className="bg-pedraum-orange hover:bg-orange-600 text-gray-900 font-bold py-3 px-10 rounded-lg shadow-md transition-colors text-lg flex items-center gap-2 disabled:opacity-70"
                >
                    {salvando ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {salvando ? "Salvando..." : "Salvar Alterações"}
                </button>
            </div>

        </div>
    );
}