"use client";

import { useState, useEffect } from "react";
import { Step1Dados } from "./components/Step1Dados";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Header } from "@/src/components/Header";
import { Step2Detalhes } from "./components/Step2Detalhes";

// A interface que junta todos os dados do formulário
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

    const [formData, setFormData] = useState<DemandaFormData>({
        nome: "",
        telefone: "",
        termosAceitos: false,
        descricao: "",
        urgencia: "normal",
    });

    // 👇 2. ADICIONE ESTE BLOCO AQUI!
    // Ele roda assim que a página abre, pega o texto do navegador e joga na descrição
    useEffect(() => {
        const demandaSalva = sessionStorage.getItem("demandaPendente");
        if (demandaSalva) {
            setFormData((prev) => ({ ...prev, descricao: demandaSalva }));
        }
    }, []);
    // 👆 Fim da adição

    const updateFormData = (newData: Partial<DemandaFormData>) => {
        setFormData((prev) => ({ ...prev, ...newData }));
    };

    const nextStep = () => setCurrentStep((prev) => prev + 1);

    const finalizarCadastro = () => {
        setEnviado(true);
        // Limpa a memória após o envio com sucesso
        sessionStorage.removeItem("demandaPendente");
    };

    // TELA DE SUCESSO
    if (enviado) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Header variant="guest" />
                <div className="flex-1 flex items-center justify-center p-4">
                    <div className="bg-white p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] max-w-lg w-full text-center space-y-6 animate-in zoom-in duration-500">
                        <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto" />
                        <h1 className="text-3xl font-black text-gray-900">Demanda Cadastrada!</h1>
                        <p className="text-gray-600">
                            Nossa equipe já recebeu os detalhes da sua necessidade. Os fornecedores ideais entrarão em contato em breve.
                        </p>
                        <Link href="/">
                            <button className="mt-4 bg-pedraum-orange hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-colors w-full shadow-md">
                                Voltar ao Início
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // TELA DO WIZARD (Mostra o passo 1 ou o passo 2)
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
                        />
                    )}

                </div>
            </div>
        </div>
    );
}
