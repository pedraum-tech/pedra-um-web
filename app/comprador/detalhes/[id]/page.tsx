"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Header } from "@/src/components/Header";
import { ProtectedRoute } from "@/src/components/ProtectedRoute";

// Adicionamos query, where e onSnapshot para a busca em tempo real
import { doc, getDoc, updateDoc, collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { FileText, Loader2, Users } from "lucide-react";

export default function DetalhesDemandaPage() {
    const params = useParams();
    const demandaId = params.id as string;
    const router = useRouter();

    const [demanda, setDemanda] = useState<any>(null);
    const [carregando, setCarregando] = useState(true);
    const [fotoAtiva, setFotoAtiva] = useState(0);

    // ESTADOS PARA OS FORNECEDORES
    const [fornecedores, setFornecedores] = useState<any[]>([]);
    const [carregandoFornecedores, setCarregandoFornecedores] = useState(true);

    const [isModalFinalizarOpen, setIsModalFinalizarOpen] = useState(false);
    const [salvandoStatus, setSalvandoStatus] = useState(false);

    // 1. Busca os detalhes principais da demanda
    useEffect(() => {
        async function buscarDemanda() {
            if (!demandaId) {
                setCarregando(false);
                return;
            }
            try {
                const docRef = doc(db, "demandas", demandaId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setDemanda({ id: docSnap.id, ...docSnap.data() });
                }
            } catch (error) {
                console.error("Erro ao buscar demanda:", error);
            } finally {
                setCarregando(false);
            }
        }
        buscarDemanda();
    }, [demandaId]);

    // 2. Busca os fornecedores interessados em TEMPO REAL
    useEffect(() => {
        if (!demandaId) return;

        // Procura na coleção "propostas" quem liberou contato para ESTA demanda
        const q = query(
            collection(db, "propostas"),
            where("demandaId", "==", demandaId)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const listaFornecedores = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setFornecedores(listaFornecedores);
            setCarregandoFornecedores(false);
        }, (error) => {
            console.error("Erro ao escutar fornecedores:", error);
            setCarregandoFornecedores(false);
        });

        return () => unsubscribe();
    }, [demandaId]);

    const handleFinalizarDemanda = async (motivo: "na_plataforma" | "fora_plataforma") => {
        setSalvandoStatus(true);
        try {
            const docRef = doc(db, "demandas", demandaId);
            await updateDoc(docRef, {
                status: "resolvida",
                motivoFechamento: motivo,
                dataFechamento: new Date().toISOString()
            });

            setDemanda((prev: any) => ({
                ...prev,
                status: "resolvida",
                motivoFechamento: motivo
            }));

            setIsModalFinalizarOpen(false);
        } catch (error) {
            console.error("Erro ao finalizar demanda:", error);
            alert("Erro ao finalizar a demanda. Tente novamente.");
        } finally {
            setSalvandoStatus(false);
        }
    };

    return (
        <ProtectedRoute allowedRoles={["comprador"]}>
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Header variant="buyer" />

                <div className="flex-1 max-w-5xl w-full mx-auto p-4 py-10 space-y-6">
                    {carregando ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="w-12 h-12 text-pedraum-orange animate-spin" />
                        </div>
                    ) : !demanda ? (
                        <div className="text-center py-20 text-gray-500">
                            <p className="text-xl font-bold">Demanda não encontrada.</p>
                            <button onClick={() => router.push("/comprador")} className="mt-4 text-pedraum-orange hover:underline">
                                Voltar para o Início
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* --- CARD 1: DETALHES --- */}
                            <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] p-8 md:p-10">
                                <div className="mb-6 flex justify-between items-center">
                                    <button onClick={() => router.back()} className="inline-block px-4 py-1.5 rounded-md border border-pedraum-orange text-pedraum-orange text-sm font-medium hover:bg-orange-50 transition-colors">
                                        Voltar
                                    </button>
                                    <div className="flex gap-2">
                                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-xs font-bold uppercase border border-gray-200">
                                            {demanda.status}
                                        </span>
                                        <span className={`px-3 py-1 rounded text-xs font-bold uppercase border ${demanda.urgencia === 'critico' ? 'bg-red-50 text-red-600 border-red-200' :
                                                demanda.urgencia === 'urgente' ? 'bg-orange-50 text-pedraum-orange border-orange-200' :
                                                    'bg-blue-50 text-blue-600 border-blue-200'
                                            }`}>
                                            {demanda.urgencia}
                                        </span>
                                    </div>
                                </div>

                                <h1 className="text-2xl font-bold text-gray-900 mb-8 line-clamp-2">
                                    {demanda.descricao}
                                </h1>

                                <div className="flex flex-col items-center mb-8 gap-4 w-full">
                                    {demanda.fotos && demanda.fotos.length > 0 ? (
                                        <>
                                            <div className="relative w-full max-w-lg h-80 rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-gray-50 transition-all">
                                                <Image src={demanda.fotos[fotoAtiva]} alt={`Foto ${fotoAtiva + 1}`} fill className="object-contain" />
                                            </div>
                                            {demanda.fotos.length > 1 && (
                                                <div className="flex gap-3 overflow-x-auto py-2 max-w-lg w-full justify-center scrollbar-hide">
                                                    {demanda.fotos.map((foto: string, index: number) => (
                                                        <button key={index} onClick={() => setFotoAtiva(index)} className={`relative w-20 h-20 rounded-md overflow-hidden border-2 transition-all flex-shrink-0 ${fotoAtiva === index ? 'border-pedraum-orange scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'}`}>
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
                                    <label className="block text-sm font-bold text-gray-900 mb-2">Descrição Completa</label>
                                    <div className="w-full min-h-[120px] p-5 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
                                        {demanda.descricao}
                                    </div>
                                </div>

                                {demanda.documentoPdf && (
                                    <div className="mb-8">
                                        <label className="block text-sm font-bold text-gray-900 mb-2">Documento Técnico</label>
                                        <a href={demanda.documentoPdf} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all rounded-lg py-3 px-4 shadow-sm">
                                            <div className="bg-red-100 text-red-600 p-2 rounded"><FileText className="w-5 h-5" /></div>
                                            <span className="font-medium text-sm">Visualizar PDF Anexado</span>
                                        </a>
                                    </div>
                                )}

                                <div className="flex justify-center pt-6 border-t border-gray-100 mt-8">
                                    {demanda.status === "aberta" ? (
                                        <button onClick={() => setIsModalFinalizarOpen(true)} className="bg-gray-900 hover:bg-black text-white font-medium py-3 px-10 rounded-lg transition-colors shadow-md">
                                            Marcar como Resolvida
                                        </button>
                                    ) : (
                                        <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-3 rounded-lg flex items-center gap-2 font-medium w-full justify-center">
                                            ✅ Esta demanda foi finalizada ({demanda.motivoFechamento === 'na_plataforma' ? 'Na plataforma' : 'Fora da plataforma'})
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* --- CARD 2: FORNECEDORES INTERESSADOS --- */}
                            <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] p-8 md:p-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="bg-pedraum-orange/10 p-2 rounded-lg">
                                        <Users className="w-6 h-6 text-pedraum-orange" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900">Fornecedores Interessados</h2>
                                </div>

                                {carregandoFornecedores ? (
                                    <div className="flex justify-center py-8">
                                        <Loader2 className="w-8 h-8 text-pedraum-orange animate-spin" />
                                    </div>
                                ) : fornecedores.length === 0 ? (
                                    <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                        <p className="text-gray-500 font-medium">Nenhum fornecedor liberou o contato ainda.</p>
                                        <p className="text-xs text-gray-400 mt-1">Fique tranquilo, nós notificaremos os melhores parceiros da rede.</p>
                                    </div>
                                ) : (
                                    <div className="w-full bg-pedraum-dark rounded-xl overflow-hidden shadow-lg animate-in fade-in duration-500">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse min-w-[600px]">
                                                <thead>
                                                    <tr className="border-b border-gray-700/50 bg-black/20">
                                                        <th className="py-4 px-6 font-medium text-gray-400 text-sm uppercase tracking-wider">Empresa / Nome</th>
                                                        <th className="py-4 px-6 font-medium text-gray-400 text-sm uppercase tracking-wider">WhatsApp</th>
                                                        <th className="py-4 px-6 font-medium text-gray-400 text-sm uppercase tracking-wider">Ação</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-gray-100">
                                                    {fornecedores.map((fornecedor) => (
                                                        <tr key={fornecedor.id} className="border-b border-gray-700/50 hover:bg-white/5 transition-colors">
                                                            <td className="py-4 px-6 font-medium">
                                                                {fornecedor.nomeFornecedor}
                                                            </td>
                                                            <td className="py-4 px-6 text-gray-300">
                                                                {fornecedor.telefoneFornecedor}
                                                            </td>
                                                            <td className="py-4 px-6">
                                                                {/* Botão para o Comprador chamar o Fornecedor de volta */}
                                                                <a
                                                                    href={`https://wa.me/55${fornecedor.telefoneFornecedor?.replace(/\D/g, '')}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-xs bg-pedraum-orange hover:bg-orange-600 text-white font-bold py-1.5 px-3 rounded transition-colors uppercase inline-block"
                                                                >
                                                                    Conversar
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* --- MODAL DE FINALIZAÇÃO --- */}
            {isModalFinalizarOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 md:p-8 animate-in fade-in zoom-in duration-200">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Finalizar Solicitação</h2>
                        <p className="text-gray-500 mb-8 text-sm">
                            Ficamos felizes que você resolveu sua demanda! Conta pra gente como o negócio foi fechado:
                        </p>
                        <div className="space-y-3 mb-8">
                            <button onClick={() => handleFinalizarDemanda("na_plataforma")} disabled={salvandoStatus} className="w-full text-left p-4 rounded-xl border-2 border-gray-100 hover:border-pedraum-orange hover:bg-orange-50 transition-all group disabled:opacity-50">
                                <p className="font-bold text-gray-900 group-hover:text-pedraum-orange">🤝 Fechei na PedraUm</p>
                                <p className="text-xs text-gray-500 mt-1">Encontrei o fornecedor ideal por aqui.</p>
                            </button>
                            <button onClick={() => handleFinalizarDemanda("fora_plataforma")} disabled={salvandoStatus} className="w-full text-left p-4 rounded-xl border-2 border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-all disabled:opacity-50">
                                <p className="font-bold text-gray-900">🏢 Fechei por fora</p>
                                <p className="text-xs text-gray-500 mt-1">Resolvi com contatos externos ou outra forma.</p>
                            </button>
                        </div>
                        <div className="flex justify-center">
                            <button onClick={() => setIsModalFinalizarOpen(false)} disabled={salvandoStatus} className="text-gray-500 hover:text-gray-800 font-medium text-sm transition-colors">
                                Cancelar e manter demanda aberta
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ProtectedRoute>
    );
}