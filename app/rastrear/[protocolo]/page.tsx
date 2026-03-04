"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/src/components/Header";

// Ícones
import { FileText, Loader2, MessageCircle, AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react";

// Ferramentas do Firebase
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/src/lib/firebase";

export default function RastreioProtocoloPage() {
    const params = useParams();
    const router = useRouter();
    // Decodifica o protocolo caso a URL tenha caracteres especiais
    const protocoloUrl = decodeURIComponent(params.protocolo as string).toUpperCase();

    const [demanda, setDemanda] = useState<any>(null);
    const [carregando, setCarregando] = useState(true);
    const [fotoAtiva, setFotoAtiva] = useState(0);

    useEffect(() => {
        async function buscarProtocolo() {
            if (!protocoloUrl) {
                setCarregando(false);
                return;
            }

            try {
                // Monta a busca: Coleção "demandas" ONDE "protocolo" == protocoloUrl
                const q = query(collection(db, "demandas"), where("protocolo", "==", protocoloUrl));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    // Pega o primeiro documento que bateu com a busca (pois o protocolo é único)
                    setDemanda({ id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() });
                } else {
                    console.error("Protocolo não encontrado.");
                }
            } catch (error) {
                console.error("Erro ao buscar protocolo:", error);
            } finally {
                setCarregando(false);
            }
        }

        buscarProtocolo();
    }, [protocoloUrl]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header variant="guest" />

            <main className="flex-1 max-w-4xl w-full mx-auto p-4 py-10 space-y-6">

                {/* Botão de Voltar Simples */}
                <button
                    onClick={() => router.push("/")}
                    className="text-gray-500 hover:text-pedraum-orange font-medium text-sm flex items-center gap-2 mb-2 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Voltar para o Início
                </button>

                {carregando ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-12 h-12 text-pedraum-orange animate-spin" />
                    </div>
                ) : !demanda ? (
                    <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
                        <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Protocolo não encontrado</h1>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">
                            Não encontramos nenhuma solicitação com o número <strong>{protocoloUrl}</strong>. Verifique se digitou corretamente.
                        </p>
                        <button
                            onClick={() => router.push("/")}
                            className="bg-pedraum-orange hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
                        >
                            Tentar Novamente
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] overflow-hidden">

                        {/* CABEÇALHO DO PROTOCOLO */}
                        <div className="bg-pedraum-dark p-8 md:p-10 text-white relative overflow-hidden">
                            <div className="relative z-10 flex flex-col md:flex-row md:justify-between md:items-center gap-6">
                                <div>
                                    <p className="text-orange-400 font-bold tracking-widest text-sm mb-2 uppercase">Acompanhamento de Solicitação</p>
                                    <h1 className="text-3xl md:text-4xl font-black tracking-wider">
                                        {demanda.protocolo}
                                    </h1>
                                </div>
                                <div className="flex flex-col gap-2 items-start md:items-end">
                                    <span className={`px-4 py-2 rounded-lg text-sm font-bold uppercase flex items-center gap-2 ${demanda.status === 'aberta' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                                        'bg-green-500/20 text-green-400 border border-green-500/30'
                                        }`}>
                                        {demanda.status === 'aberta' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                        Status: {demanda.status}
                                    </span>
                                    <span className="text-gray-400 text-sm">
                                        Data: {new Date(demanda.dataCriacao).toLocaleDateString('pt-BR')}
                                    </span>
                                </div>
                            </div>
                            {/* Efeito visual de fundo */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                        </div>

                        {/* AVISO IMPORTANTE (O Pulo do Gato) */}
                        <div className="bg-orange-50 border-b border-orange-100 p-4 px-8 flex items-start gap-4">
                            <MessageCircle className="w-6 h-6 text-pedraum-orange shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-orange-800 font-bold text-sm">Fique atento ao seu WhatsApp!</h3>
                                <p className="text-orange-700/80 text-sm mt-1">
                                    Os fornecedores interessados na sua demanda entrarão em contato diretamente no número cadastrado <strong>({demanda.telefoneContato})</strong>.
                                </p>
                            </div>
                        </div>

                        {/* CORPO DA DEMANDA */}
                        <div className="p-8 md:p-10 space-y-8">

                            {/* --- GALERIA DE FOTOS (CARROSSEL) --- */}
                            {demanda.fotos && demanda.fotos.length > 0 && (
                                <div className="flex flex-col items-center mb-8 gap-4 w-full">
                                    {/* Imagem Principal */}
                                    <div className="relative w-full max-w-lg h-80 rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-gray-50 transition-all">
                                        <Image
                                            src={demanda.fotos[fotoAtiva]}
                                            alt={`Foto ${fotoAtiva + 1} da demanda`}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>

                                    {/* Miniaturas */}
                                    {demanda.fotos.length > 1 && (
                                        <div className="flex gap-3 overflow-x-auto py-2 max-w-lg w-full justify-center scrollbar-hide">
                                            {demanda.fotos.map((foto: string, index: number) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setFotoAtiva(index)}
                                                    className={`relative w-20 h-20 rounded-md overflow-hidden border-2 transition-all shrink-0 ${fotoAtiva === index
                                                        ? 'border-pedraum-orange scale-105 shadow-md'
                                                        : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'
                                                        }`}
                                                >
                                                    <Image src={foto} alt={`Miniatura ${index + 1}`} fill className="object-cover" />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Descrição */}
                            <div>
                                <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">
                                    O que foi solicitado
                                </label>
                                <div className="w-full p-5 rounded-xl border border-gray-100 bg-gray-50/50 text-gray-700 text-sm whitespace-pre-wrap leading-relaxed shadow-inner">
                                    {demanda.descricao}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                {/* Urgência */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Nível de Urgência</label>
                                    <div className="inline-block px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-bold uppercase text-sm border border-gray-200">
                                        {demanda.urgencia}
                                    </div>
                                </div>

                                {/* PDF (Se existir) */}
                                {demanda.documentoPdf && (
                                    <div>
                                        <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Documento Técnico</label>
                                        <a
                                            href={demanda.documentoPdf}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-3 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-pedraum-orange transition-all rounded-lg py-2.5 px-4 shadow-sm"
                                        >
                                            <div className="bg-red-50 text-red-500 p-1.5 rounded">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <span className="font-medium text-sm">Visualizar Arquivo</span>
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* CTA PARA CRIAR CONTA (Growth Marketing) */}
                        <div className="bg-gray-900 p-8 text-center flex flex-col items-center justify-center">
                            <h3 className="text-xl font-bold text-white mb-2">Quer receber as propostas pela plataforma?</h3>
                            <p className="text-gray-400 text-sm mb-6 max-w-md">
                                Crie uma conta gratuita para gerenciar todos os seus pedidos, comparar orçamentos e aprovar fornecedores em um só lugar.
                            </p>
                            <Link href="/cadastro/comprador">
                                <button className="bg-pedraum-orange hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-lg">
                                    Criar Conta Grátis
                                </button>
                            </Link>
                        </div>

                    </div>
                )}
            </main>
        </div>
    );
}