"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/src/components/Header";
import { ProtectedRoute } from "@/src/components/ProtectedRoute";
import { useAuth } from "@/src/contexts/AuthContext";

// Ferramentas do Firebase
import { collection, addDoc, query, where, onSnapshot, doc, setDoc } from "firebase/firestore";
import { db, storage } from "@/src/lib/firebase";
import { AnexosDemanda } from "@/src/components/AnexosDemanda";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export default function DemandasCompradorPage() {
    const { user } = useAuth();

    // Estados do Formulário de Demanda
    const [descricao, setDescricao] = useState("");
    const [urgencia, setUrgencia] = useState("normal");

    // Estados de Controle
    const [carregando, setCarregando] = useState(false);
    const [mensagem, setMensagem] = useState({ texto: "", tipo: "" });

    // Estado para guardar a lista de demandas do banco
    const [minhasDemandas, setMinhasDemandas] = useState<any[]>([]);
    const [carregandoDemandas, setCarregandoDemandas] = useState(true);

    const [imagensDemanda, setImagensDemanda] = useState<File[]>([]);
    const [pdfDemanda, setPdfDemanda] = useState<File | null>(null);

    // Efeito para buscar as demandas em TEMPO REAL
    useEffect(() => {
        if (!user?.uid) return;

        // Cria a consulta: "Busque na coleção 'demandas' apenas as que o compradorId for igual ao meu UID"
        const q = query(
            collection(db, "demandas"),
            where("compradorId", "==", user.uid)
        );

        // onSnapshot fica "escutando" o banco. Qualquer alteração, ele roda essa função de novo.
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const listaDemandas = querySnapshot.docs.map(doc => ({
                id: doc.id, // O ID único do documento gerado pelo Firebase
                ...doc.data()
            }));

            // Ordenando no JavaScript (Mais novo primeiro) para evitar problemas de Index no Firebase
            listaDemandas.sort((a, b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime());

            setMinhasDemandas(listaDemandas);
            setCarregandoDemandas(false);
        });

        // Limpa o "ouvinte" quando a pessoa sai da página (boa prática de React)
        return () => unsubscribe();
    }, [user?.uid]);

    // Função de Criar Demanda
    const handleCriarDemanda = async (e: React.FormEvent) => {
        e.preventDefault();
        setMensagem({ texto: "", tipo: "" });

        if (descricao.trim().length < 10) {
            return setMensagem({ texto: "A descrição precisa ter pelo menos 10 caracteres.", tipo: "erro" });
        }

        setCarregando(true);

        try {
            // A MÁGICA: Pré-gerar a referência e o ID da nova demanda
            const novaDemandaRef = doc(collection(db, "demandas"));
            const demandaId = novaDemandaRef.id; // Pegamos o ID gerado!

            const urlsFotos: string[] = [];
            let urlPdf: string | null = null;

            // Upload das Imagens (Agora usando o seu caminho perfeito)
            if (imagensDemanda.length > 0) {
                const uploadPromises = imagensDemanda.map(async (imagem) => {
                    // Arquitetura: {UID}/demandas/{DEMANDA_ID}/fotos/arquivo.jpg
                    const imageRef = ref(storage, `${user?.uid}/demandas/${demandaId}/fotos/${Date.now()}_${imagem.name}`);
                    await uploadBytes(imageRef, imagem);
                    return await getDownloadURL(imageRef);
                });

                const urlsResolvidas = await Promise.all(uploadPromises);
                urlsFotos.push(...urlsResolvidas);
            }

            // Upload do PDF
            if (pdfDemanda) {
                // Arquitetura: {UID}/demandas/{DEMANDA_ID}/documentos/arquivo.pdf
                const pdfRef = ref(storage, `${user?.uid}/demandas/${demandaId}/documentos/${Date.now()}_${pdfDemanda.name}`);
                await uploadBytes(pdfRef, pdfDemanda);
                urlPdf = await getDownloadURL(pdfRef);
            }

            // Salvar no banco usando o setDoc no ID que já reservamos
            await setDoc(novaDemandaRef, {
                compradorId: user?.uid,
                nomeComprador: user?.razaoSocial || user?.nome || "Comprador",
                descricao: descricao,
                urgencia: urgencia,
                status: "aberta",
                fotos: urlsFotos,
                documentoPdf: urlPdf,
                dataCriacao: new Date().toISOString(),
            });

            // Limpeza da tela
            setDescricao("");
            setUrgencia("normal");
            setImagensDemanda([]);
            setPdfDemanda(null);

            setMensagem({ texto: "Sua solicitação e anexos foram enviados para o mercado!", tipo: "sucesso" });
            setTimeout(() => setMensagem({ texto: "", tipo: "" }), 5000);

        } catch (error) {
            console.error("Erro ao criar demanda com anexos:", error);
            setMensagem({ texto: "Erro ao cadastrar demanda. Verifique sua conexão e tente novamente.", tipo: "erro" });
        } finally {
            setCarregando(false);
        }
    };

    // Função auxiliar para definir as cores das "etiquetas" de status e urgência
    const renderizarEtiqueta = (texto: string, tipo: 'status' | 'urgencia') => {
        if (tipo === 'status' && texto === 'aberta') {
            return <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold uppercase">Aberta</span>;
        }
        if (tipo === 'urgencia') {
            const cores: any = {
                normal: "bg-gray-100 text-gray-700",
                urgente: "bg-orange-100 text-pedraum-orange",
                critico: "bg-red-100 text-red-700"
            };
            return <span className={`${cores[texto] || cores.normal} px-2 py-1 rounded text-xs font-bold uppercase ml-2`}>{texto}</span>;
        }
        return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold uppercase">{texto}</span>;
    };

    return (
        <ProtectedRoute allowedRoles={["comprador"]}>
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Header variant="buyer" />

                <div className="flex-1 max-w-5xl w-full mx-auto p-4 py-10 space-y-8">

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

                        {mensagem.texto && (
                            <div className={`mb-6 p-4 rounded-lg text-sm font-medium ${mensagem.tipo === "sucesso" ? "bg-green-50 text-green-700 border-l-4 border-green-500" : "bg-red-50 text-red-700 border-l-4 border-red-500"}`}>
                                {mensagem.texto}
                            </div>
                        )}

                        <form onSubmit={handleCriarDemanda} className="space-y-6">
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

                            <AnexosDemanda
                                imagens={imagensDemanda}
                                setImagens={setImagensDemanda}
                                pdf={pdfDemanda}
                                setPdf={setPdfDemanda}
                            />

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

                    {/* --- CARD 2: MEUS PEDIDOS --- */}
                    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] p-8 md:p-10">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-1">Seus Pedidos</h2>
                            <p className="text-gray-500 text-sm">Acompanhe o status das suas solicitações.</p>
                        </div>

                        <div className="overflow-x-auto">
                            {carregandoDemandas ? (
                                <div className="flex justify-center py-10">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pedraum-orange"></div>
                                </div>
                            ) : minhasDemandas.length === 0 ? (
                                <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                    Você ainda não tem nenhuma demanda cadastrada.
                                </div>
                            ) : (
                                <table className="w-full min-w-[600px] text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100 border-b border-gray-300">
                                            <th className="py-4 px-4 font-bold text-gray-800 rounded-tl-lg">Status</th>
                                            <th className="py-4 px-4 font-bold text-gray-800">Descrição</th>
                                            <th className="py-4 px-4 font-bold text-gray-800 text-right rounded-tr-lg">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {minhasDemandas.map((demanda) => (
                                            <tr key={demanda.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                                                <td className="py-4 px-4 text-gray-800 font-medium">
                                                    {renderizarEtiqueta(demanda.status, 'status')}
                                                    {renderizarEtiqueta(demanda.urgencia, 'urgencia')}
                                                </td>
                                                <td className="py-4 px-4 text-gray-600 text-sm max-w-md">
                                                    <p className="line-clamp-2">{demanda.descricao}</p>
                                                    <span className="text-xs text-gray-400 mt-1 block">
                                                        Criado em: {new Date(demanda.dataCriacao).toLocaleDateString('pt-BR')}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-right align-middle">
                                                    {/* O Link para a página de detalhes daquela demanda específica */}
                                                    <Link href={`/comprador/detalhes/${demanda.id}`} className="inline-block">
                                                        <button className="border border-pedraum-orange text-pedraum-orange hover:bg-orange-50 font-bold text-xs py-2 px-4 rounded-md transition-colors whitespace-nowrap">
                                                            Ver Detalhes
                                                        </button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </ProtectedRoute>
    );
}