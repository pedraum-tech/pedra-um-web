"use client";

import { useState, useEffect } from "react";
import { Step1Dados } from "./components/Step1Dados";
import { CheckCircle2, Copy } from "lucide-react";
import Link from "next/link";
import { Header } from "@/src/components/Header";
import { Step2Detalhes } from "./components/Step2Detalhes";

// Ferramentas do Firebase
import { collection, doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/src/lib/firebase";

export interface DemandaFormData {
    nome: string;
    telefone: string;
    termosAceitos: boolean;
    descricao: string;
    urgencia: string;
}

export default function NovaDemandaWizard() {
    const [currentStep, setCurrentStep] = useState(1);
    const [enviado, setEnviado] = useState(false);
    const [salvando, setSalvando] = useState(false);

    // Novos estados para os anexos e protocolo
    const [imagensDemanda, setImagensDemanda] = useState<File[]>([]);
    const [pdfDemanda, setPdfDemanda] = useState<File | null>(null);
    const [protocoloGerado, setProtocoloGerado] = useState("");

    const [formData, setFormData] = useState<DemandaFormData>({
        nome: "",
        telefone: "",
        termosAceitos: false,
        descricao: "",
        urgencia: "normal",
    });

    useEffect(() => {
        const demandaSalva = sessionStorage.getItem("demandaPendente");
        if (demandaSalva) {
            setFormData((prev) => ({ ...prev, descricao: demandaSalva }));
        }
    }, []);

    const updateFormData = (newData: Partial<DemandaFormData>) => {
        setFormData((prev) => ({ ...prev, ...newData }));
    };

    const nextStep = () => setCurrentStep((prev) => prev + 1);

    const finalizarCadastro = async () => {
        setSalvando(true);

        try {
            // 1. Pré-gerar a referência e o ID
            const novaDemandaRef = doc(collection(db, "demandas"));
            const demandaId = novaDemandaRef.id;

            // 2. Gerar Número de Protocolo (Ex: PRT-847291)
            const numeroProtocolo = "PRT-" + Math.floor(100000 + Math.random() * 900000);
            setProtocoloGerado(numeroProtocolo);

            const urlsFotos: string[] = [];
            let urlPdf: string | null = null;

            // 3. Upload das Imagens (Pasta de visitantes)
            if (imagensDemanda.length > 0) {
                const uploadPromises = imagensDemanda.map(async (imagem) => {
                    const imageRef = ref(storage, `visitantes/demandas/${demandaId}/fotos/${Date.now()}_${imagem.name}`);
                    await uploadBytes(imageRef, imagem);
                    return await getDownloadURL(imageRef);
                });
                const urlsResolvidas = await Promise.all(uploadPromises);
                urlsFotos.push(...urlsResolvidas);
            }

            // 4. Upload do PDF
            if (pdfDemanda) {
                const pdfRef = ref(storage, `visitantes/demandas/${demandaId}/documentos/${Date.now()}_${pdfDemanda.name}`);
                await uploadBytes(pdfRef, pdfDemanda);
                urlPdf = await getDownloadURL(pdfRef);
            }

            // 5. Salvar no Firestore
            await setDoc(novaDemandaRef, {
                compradorId: "visitante",
                nomeComprador: formData.nome,
                telefoneContato: formData.telefone,
                descricao: formData.descricao,
                urgencia: formData.urgencia,
                termosAceitos: formData.termosAceitos,
                status: "aberta",
                isGuest: true,
                protocolo: numeroProtocolo, // Salvando o protocolo no banco
                fotos: urlsFotos,
                documentoPdf: urlPdf,
                dataCriacao: new Date().toISOString(),
            });

            setEnviado(true);
            sessionStorage.removeItem("demandaPendente");
        } catch (error) {
            console.error("Erro ao salvar demanda de visitante:", error);
            alert("Ocorreu um erro ao enviar sua demanda. Verifique a conexão e tente novamente.");
        } finally {
            setSalvando(false);
        }
    };

    // TELA DE SUCESSO TURBINADA COM O PROTOCOLO
    if (enviado) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Header variant="guest" />
                <div className="flex-1 flex items-center justify-center p-4">
                    <div className="bg-white p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] max-w-lg w-full text-center space-y-6 animate-in zoom-in duration-500">
                        <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto" />
                        <h1 className="text-3xl font-black text-gray-900">Demanda Cadastrada!</h1>
                        <p className="text-gray-600">
                            Nossa equipe já recebeu os detalhes. Os fornecedores ideais entrarão em contato com você via WhatsApp.
                        </p>

                        {/* Box de Protocolo */}
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 my-6">
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Seu Número de Protocolo</p>
                            <div className="flex items-center justify-center gap-3">
                                <span className="text-3xl font-black text-pedraum-orange tracking-widest">{protocoloGerado}</span>
                                <button
                                    onClick={() => navigator.clipboard.writeText(protocoloGerado)}
                                    className="p-2 text-gray-400 hover:text-gray-700 bg-white rounded-md border border-gray-200 shadow-sm transition-colors"
                                    title="Copiar Protocolo"
                                >
                                    <Copy className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="text-xs text-gray-400 mt-3">Anote este número ou tire um print para consultas futuras.</p>
                        </div>

                        <Link href="/">
                            <button className="bg-gray-900 hover:bg-black text-white font-bold py-3 px-8 rounded-lg transition-colors w-full shadow-md">
                                Voltar ao Início
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header variant="guest" />
            <div className="flex-1 flex items-center justify-center p-4 py-12">
                <div className="w-full max-w-2xl transition-all duration-300">
                    {currentStep === 1 && (
                        <Step1Dados
                            formData={formData}
                            updateFormData={updateFormData}
                            onNext={nextStep}
                        />
                    )}

                    {currentStep === 2 && (
                        <Step2Detalhes
                            formData={formData}
                            updateFormData={updateFormData}
                            onFinish={finalizarCadastro}
                            salvando={salvando}
                            // Passando os estados de anexo
                            imagens={imagensDemanda}
                            setImagens={setImagensDemanda}
                            pdf={pdfDemanda}
                            setPdf={setPdfDemanda}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}