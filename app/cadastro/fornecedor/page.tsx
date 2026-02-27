"use client"; // Obrigatório porque vamos usar o useState

import { useState } from "react";
import { Header } from "@/src/components/Header";
import { Step1 } from "./components/step1";
import { Step2 } from "./components/step2";

// 1. Definimos o "Molde" de todos os dados que o fornecedor vai preencher
export interface FornecedorFormData {
    razaoSocial: string;
    cnpj: string;
    email: string;
    senha: string;
    especialidades: string;
    regiao: string;
    categorias: string[];
    descricaoItem: string[];
    aceitaTermos: boolean;
}

export default function CadastroFornecedorPage() {
    // Controle de qual tela estamos (1 ou 2)
    const [currentStep, setCurrentStep] = useState(1);

    // O Estado global que guarda os dados das duas telas
    const [formData, setFormData] = useState<FornecedorFormData>({
        razaoSocial: "",
        cnpj: "",
        email: "",
        senha: "",
        especialidades: "",
        regiao: "",
        categorias: [],
        descricaoItem: [],
        aceitaTermos: false,
    });

    // Função para os componentes filhos injetarem dados aqui no Pai
    const updateFormData = (newData: Partial<FornecedorFormData>) => {
        setFormData((prev) => ({ ...prev, ...newData }));
    };

    // Funções de navegação do Wizard
    const nextStep = () => setCurrentStep(2);
    const prevStep = () => setCurrentStep(1);

    // Função final de envio
    const handleSubmit = () => {
        console.log("Dados prontos para o banco:", formData);
        alert("Cadastro finalizado com sucesso!");
        // Aqui no futuro você faz o redirect para o dashboard do fornecedor
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header variant="guest" />

            <div className="flex-1 flex items-center justify-center p-4 py-12">
                {/* O Card Branco Principal (O Pai segura o layout principal) */}
                <div className="bg-white w-full max-w-2xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-8 md:p-10 relative">

                    {/* Lógica de Renderização Condicional */}
                    {currentStep === 1 && (
                        <Step1
                            formData={formData}
                            updateFormData={updateFormData}
                            onNext={nextStep}
                        />
                    )}

                    {currentStep === 2 && (
                        <Step2
                            formData={formData}
                            updateFormData={updateFormData}
                            onBack={prevStep}
                            onSubmit={handleSubmit}
                        />
                    )}

                </div>
            </div>
        </div>
    );
}