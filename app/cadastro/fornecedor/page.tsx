"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/src/components/Header";
import { Step1 } from "./components/step1";
import { Step2 } from "./components/step2";

// Importações do Firebase Auth e Firestore
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/src/lib/firebase";

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
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);

    // Estados de controle de interface
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

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

    const updateFormData = (newData: Partial<FornecedorFormData>) => {
        setFormData((prev) => ({ ...prev, ...newData }));
    };

    const nextStep = () => setCurrentStep(2);
    const prevStep = () => setCurrentStep(1);

    // Função final de envio conectada ao Firebase
    const handleSubmit = async () => {
        setErro("");

        // Uma última validação de segurança antes de ir para o banco
        if (!formData.aceitaTermos) {
            setErro("Você precisa aceitar os termos na etapa 1.");
            setCurrentStep(1); // Volta para a tela 1 se ele tentou burlar
            return;
        }

        setCarregando(true);

        try {
            // A) Cria o usuário no Auth
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.senha);
            const user = userCredential.user;

            // B) Salva o nome (Razão Social) no perfil do Auth
            await updateProfile(user, {
                displayName: formData.razaoSocial
            });

            // C) Cria o documento completo no Firestore
            const userDocRef = doc(db, "usuarios", user.uid);
            await setDoc(userDocRef, {
                razaoSocial: formData.razaoSocial,
                cnpj: formData.cnpj,
                email: formData.email,
                especialidades: formData.especialidades,
                regiao: formData.regiao,
                categorias: formData.categorias,
                descricaoItem: formData.descricaoItem,
                tipo_usuario: "fornecedor", // Crucial para o controle de acesso!
                status_verificacao: "pendente", // Fornecedores geralmente passam por aprovação de CNPJ
                data_cadastro: new Date().toISOString(),
                status: "ativo"
            });

            // D) Redireciona para o painel do fornecedor
            // Ajuste esta rota para onde o fornecedor deve cair após o login!
            router.push("/fornecedor");

        } catch (error: any) {
            console.error("Erro no cadastro de fornecedor:", error);
            if (error.code === "auth/email-already-in-use") {
                setErro("Este e-mail já está cadastrado. Tente fazer login.");
            } else if (error.code === "auth/weak-password") {
                setErro("A senha deve ter pelo menos 6 caracteres.");
            } else {
                setErro("Ocorreu um erro ao criar a conta. Tente novamente.");
            }
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header variant="guest" />

            <div className="flex-1 flex items-center justify-center p-4 py-12">
                <div className="bg-white w-full max-w-2xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-8 md:p-10 relative">

                    {/* Exibe o erro geral do Firebase no topo do card, independente do Step */}
                    {erro && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium rounded-r-lg">
                            {erro}
                        </div>
                    )}

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
                        // Dica: Seria legal o seu Step2 receber esse 'carregando' via props 
                        // para desativar o botão e mostrar "Enviando..."
                        />
                    )}

                </div>
            </div>
        </div>
    );
}