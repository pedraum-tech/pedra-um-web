"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Header } from "@/src/components/Header";
import { ProtectedRoute } from "@/src/components/ProtectedRoute";
import { useAuth } from "@/src/contexts/AuthContext";

// Ferramentas e Ícones
import { collection, doc, getDoc, addDoc, query, where, getDocs, updateDoc, increment } from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { Loader2, FileText, AlertCircle, Info } from "lucide-react";
import { DemandaModel, UsuarioModel } from "@/src/types";

// 1. Criamos um tipo específico para os dados de contato que vão aparecer na tela
interface ContatoLeadProps {
    nome: string;
    telefone: string;
    email: string;
    tipo: string;
}

export default function DetalhesOportunidadePage() {
    const { user } = useAuth() as { user: UsuarioModel | null };
    const params = useParams();
    const demandaId = params.id as string;
    const router = useRouter();

    const [mostrarLead, setMostrarLead] = useState(false);

    // 2. Aplicamos os tipos corretos nos estados
    const [demanda, setDemanda] = useState<DemandaModel | null>(null);
    const [contatoLead, setContatoLead] = useState<ContatoLeadProps | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [fotoAtiva, setFotoAtiva] = useState(0);

    // ESTADOS DA PROPOSTA
    const [valorProp, setValorProp] = useState("");
    const [prazoProp, setPrazoProp] = useState("");
    const [mensagemProp, setMensagemProp] = useState("");

    const [desbloqueandoLead, setDesbloqueandoLead] = useState(false);

    useEffect(() => {
        async function buscarDetalhes() {
            if (!demandaId) return;

            try {
                const docRef = doc(db, "demandas", demandaId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const dadosDemanda = { id: docSnap.id, ...docSnap.data() } as DemandaModel;
                    setDemanda(dadosDemanda);

                    // Busca os dados de contato do Comprador
                    if (dadosDemanda.isGuest) {
                        setContatoLead({
                            nome: dadosDemanda.nomeComprador || "Visitante",
                            telefone: dadosDemanda.telefoneContato || "Não informado",
                            email: dadosDemanda.compradorId || "Não informado",
                            tipo: "Visitante"
                        });
                    } else if (dadosDemanda.compradorId) {
                        const userRef = doc(db, "usuarios", dadosDemanda.compradorId);
                        const userSnap = await getDoc(userRef);

                        if (userSnap.exists()) {
                            const dadosUser = userSnap.data() as UsuarioModel;
                            setContatoLead({
                                nome: dadosUser.razaoSocial || dadosUser.nome || dadosDemanda.nomeComprador,
                                telefone: dadosUser.telefone || "Não informado",
                                email: dadosUser.email || "Não informado",
                                tipo: "Usuário Verificado"
                            });
                        }
                    }

                    // A MÁGICA: Verifica se o fornecedor JÁ liberou esse contato antes!
                    const userId = user?.id || (user as any)?.uid;
                    if (userId) {
                        const q = query(
                            collection(db, "propostas"),
                            where("demandaId", "==", demandaId),
                            where("fornecedorId", "==", userId)
                        );
                        const querySnapshot = await getDocs(q);

                        if (!querySnapshot.empty) {
                            setMostrarLead(true);
                        }
                    }
                }
            } catch (error) {
                console.error("Erro ao buscar oportunidade:", error);
            } finally {
                setCarregando(false);
            }
        }

        buscarDetalhes();
    }, [demandaId, user]);

    const handleLiberarContato = async () => {
        const userId = user?.id || (user as any)?.uid;

        if (!demanda || !userId) {
            alert("Erro de autenticação ou demanda não encontrada.");
            return;
        }

        setDesbloqueandoLead(true);
        try {
            // 1. Salva a proposta/histórico
            await addDoc(collection(db, "propostas"), {
                demandaId: demanda.id,
                fornecedorId: userId,
                nomeFornecedor: user?.razaoSocial || user?.nome || "Fornecedor",
                telefoneFornecedor: user?.telefone || "Não informado",
                valor: "A combinar",
                prazo: "A combinar",
                mensagem: "Lead desbloqueado via plataforma",
                status: "contato_liberado",
                dataCriacao: new Date().toISOString()
            });

            // 2. Atualiza a demanda para Em Negociação
            if (demanda.status === "aberta") {
                const docRef = doc(db, "demandas", demanda.id);
                await updateDoc(docRef, {
                    status: "negociacao"
                });
            }

            // 3. A NOVA MÁGICA: Descontar 1 Lead do Saldo do Fornecedor!
            const userRef = doc(db, "usuarios", userId);
            await updateDoc(userRef, {
                saldoLeads: increment(-1), // O Firebase subtrai 1 de forma segura e atômica!
                leadsDesbloqueados: increment(1)
            });

            setMostrarLead(true);
        } catch (error) {
            console.error("Erro ao liberar contato:", error);
            alert("Erro ao liberar o contato. Tente novamente.");
        } finally {
            setDesbloqueandoLead(false);
        }
    };

    return (
        <ProtectedRoute allowedRoles={["fornecedor"]}>
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Header variant="supplier" />

                <div className="flex-1 max-w-5xl w-full mx-auto p-4 py-10 space-y-6">

                    {carregando ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="w-12 h-12 text-pedraum-orange animate-spin" />
                        </div>
                    ) : !demanda ? (
                        <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
                            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Oportunidade não encontrada</h1>
                            <p className="text-gray-500 mb-8">Esta demanda pode ter sido encerrada pelo comprador.</p>
                            <button onClick={() => router.push("/fornecedor")} className="bg-pedraum-orange hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg">
                                Voltar para o Painel
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* --- CARD 1: DETALHES DA DEMANDA --- */}
                            <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] p-8 md:p-10">
                                <div className="mb-6 flex justify-between items-center">
                                    <button onClick={() => router.back()} className="inline-block px-4 py-1.5 rounded-md border border-pedraum-orange text-pedraum-orange text-sm font-medium hover:bg-orange-50 transition-colors">
                                        Voltar
                                    </button>
                                    <span className={`px-3 py-1 rounded text-xs font-bold uppercase border ${demanda.urgencia === 'critico' ? 'bg-red-50 text-red-600 border-red-200' :
                                        demanda.urgencia === 'urgente' ? 'bg-orange-50 text-pedraum-orange border-orange-200' :
                                            'bg-blue-50 text-blue-600 border-blue-200'
                                        }`}>
                                        {demanda.urgencia}
                                    </span>
                                </div>

                                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                    {demanda.protocolo ? `Solicitação ${demanda.protocolo}` : "Oportunidade de Negócio"}
                                </h1>
                                <p className="text-sm text-gray-500 mb-8">Publicado em: {new Date(demanda.dataCriacao).toLocaleDateString('pt-BR')}</p>

                                <div className="flex flex-col items-center mb-8 gap-4 w-full">
                                    {demanda.fotos && demanda.fotos.length > 0 ? (
                                        <>
                                            <div className="relative w-full max-w-lg h-80 rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-gray-50">
                                                <Image src={demanda.fotos[fotoAtiva]} alt="Foto da demanda" fill className="object-contain" />
                                            </div>
                                            {demanda.fotos.length > 1 && (
                                                <div className="flex gap-3 overflow-x-auto py-2 max-w-lg w-full justify-center scrollbar-hide">
                                                    {demanda.fotos.map((foto: string, index: number) => (
                                                        <button key={index} onClick={() => setFotoAtiva(index)} className={`relative w-20 h-20 rounded-md overflow-hidden border-2 transition-all flex-shrink-0 ${fotoAtiva === index ? 'border-pedraum-orange scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                                                            <Image src={foto} alt={`Miniatura ${index + 1}`} fill className="object-cover" />
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="w-full max-w-lg h-64 bg-gray-50 border-2 border-dashed border-gray-300 text-gray-400 flex flex-col items-center justify-center font-light rounded-lg">
                                            <span className="text-4xl mb-2">📷</span>
                                            <span className="text-sm">Sem fotos anexadas</span>
                                        </div>
                                    )}
                                </div>

                                <div className="mb-8">
                                    <label className="block text-sm font-bold text-gray-900 mb-2">O que o cliente precisa:</label>
                                    <div className="w-full min-h-30 p-5 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
                                        {demanda.descricao}
                                    </div>
                                </div>

                                {demanda.documentoPdf && (
                                    <div className="mb-4">
                                        <label className="block text-sm font-bold text-gray-900 mb-2">Documento Técnico</label>
                                        <a href={demanda.documentoPdf} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all rounded-lg py-3 px-4 shadow-sm">
                                            <div className="bg-red-100 text-red-600 p-2 rounded"><FileText className="w-5 h-5" /></div>
                                            <span className="font-medium text-sm">Visualizar Projeto/PDF</span>
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* --- CARD 2: AÇÃO / DADOS DO LEAD --- */}
                            <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] p-8 md:p-10 transition-all duration-500 ease-in-out">
                                {!mostrarLead ? (
                                    <div className="flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
                                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3 mb-6 max-w-md w-full">
                                            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-blue-800 font-bold mb-1">Atenção ao seu Limite</p>
                                                <p className="text-xs text-blue-700">
                                                    Você possui um limite total de <strong>{user?.saldoLeads || 100} leads</strong>. Liberar este contato consumirá 1 lead da sua cota.
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleLiberarContato}
                                            disabled={desbloqueandoLead || (user?.saldoLeads !== undefined && user.saldoLeads <= 0)}
                                            className="bg-pedraum-dark hover:bg-black text-white font-bold py-4 px-12 rounded-lg transition-colors shadow-lg text-lg flex items-center justify-center min-w-[250px] disabled:opacity-70 disabled:cursor-not-allowed hover:scale-105"
                                        >
                                            {desbloqueandoLead ? <Loader2 className="w-6 h-6 animate-spin" /> : "Liberar Contato do Comprador"}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="animate-in slide-in-from-bottom-4 fade-in duration-500 space-y-8">
                                        <div className="flex items-center gap-3 border-b border-gray-100 pb-6">
                                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                                                <span className="text-2xl">✅</span>
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold text-gray-900">Contato Liberado com Sucesso!</h2>
                                                <p className="text-sm text-green-600 font-medium">1 Lead foi descontado da sua cota. Chame o cliente no WhatsApp abaixo!</p>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6 relative overflow-hidden">
                                            <div>
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Comprador</span>
                                                <strong className="text-gray-900 text-lg">{contatoLead?.nome}</strong>
                                                <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{contatoLead?.tipo}</span>
                                            </div>
                                            <div>
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Telefone / WhatsApp</span>
                                                <a href={`https://wa.me/55${contatoLead?.telefone?.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-pedraum-orange hover:text-orange-700 font-black text-xl flex items-center gap-2">
                                                    {contatoLead?.telefone}
                                                </a>
                                            </div>
                                            <div className="md:col-span-2">
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Email</span>
                                                <strong className="text-gray-700 text-lg">{contatoLead?.email}</strong>
                                            </div>
                                        </div>

                                        <div style={{ display: 'none' }}>
                                            <form className="bg-white border-2 border-gray-100 rounded-xl p-6 space-y-6">
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-900 mb-1">Formalize sua Proposta</h3>
                                                    <p className="text-sm text-gray-500 mb-6">Envie os valores e prazos para o comprador analisar pela plataforma.</p>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-900 mb-2">Valor Estimado (R$)*</label>
                                                        <input type="text" value={valorProp} onChange={(e) => setValorProp(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-900 mb-2">Prazo de Entrega</label>
                                                        <input type="text" value={prazoProp} onChange={(e) => setPrazoProp(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-900 mb-2">Mensagem ou Condições*</label>
                                                    <textarea value={mensagemProp} onChange={(e) => setMensagemProp(e.target.value)} className="w-full min-h-[100px] p-4 rounded-lg border border-gray-300" />
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}