"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/src/components/Header";

// 1. Importações do Firebase Auth E do Firestore
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/src/lib/firebase"; // <-- db adicionado aqui

export default function CadastroCompradorPage() {
    const router = useRouter();

    const [nome, setNome] = useState("");
    const [telefone, setTelefone] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [termos, setTermos] = useState(false);

    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    const handleCadastro = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro("");

        if (!termos) {
            setErro("Você precisa aceitar os termos de uso para continuar.");
            return;
        }
        if (senha.length < 6) {
            setErro("A senha deve ter pelo menos 6 caracteres.");
            return;
        }

        setCarregando(true);

        try {
            // A) Cria a credencial de login
            const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
            const user = userCredential.user;

            // B) Salva o nome básico no perfil
            await updateProfile(user, {
                displayName: nome
            });

            // C) A MÁGICA DO FIRESTORE (A parte que estava faltando!)
            const userDocRef = doc(db, "usuarios", user.uid);
            await setDoc(userDocRef, {
                nome: nome,
                email: email,
                telefone: telefone,
                tipo_usuario: "comprador",
                data_cadastro: new Date().toISOString(),
                status: "ativo"
            });

            // D) Redireciona para o painel exclusivo do cliente
            router.push("/comprador");

        } catch (error: any) {
            console.error("Erro no cadastro:", error);
            if (error.code === "auth/email-already-in-use") {
                setErro("Este e-mail já está cadastrado. Tente fazer login.");
            } else if (error.code === "auth/invalid-email") {
                setErro("Formato de e-mail inválido.");
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
                <div className="bg-white w-full max-w-2xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-8 md:p-10">

                    <h1 className="text-2xl font-medium text-gray-900 mb-3">
                        Seus dados
                    </h1>
                    <div className="h-1 w-full bg-pedraum-dark mb-8 rounded-full"></div>

                    <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-6">
                        Contato Principal
                    </h2>

                    {erro && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium rounded-r-lg">
                            {erro}
                        </div>
                    )}

                    <form onSubmit={handleCadastro} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <div>
                                <label htmlFor="nome" className="block text-sm font-bold text-gray-900 mb-2">Nome</label>
                                <input
                                    id="nome"
                                    type="text"
                                    required
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pedraum-orange focus:ring-2 focus:ring-orange-100 outline-none transition-all bg-white text-gray-700"
                                />
                            </div>

                            <div>
                                <label htmlFor="telefone" className="block text-sm font-bold text-gray-900 mb-2">Telefone</label>
                                <input
                                    id="telefone"
                                    type="tel"
                                    required
                                    value={telefone}
                                    onChange={(e) => setTelefone(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pedraum-orange focus:ring-2 focus:ring-orange-100 outline-none transition-all bg-white text-gray-700"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-2">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pedraum-orange focus:ring-2 focus:ring-orange-100 outline-none transition-all bg-white text-gray-700"
                                />
                            </div>

                            <div>
                                <label htmlFor="senha" className="block text-sm font-bold text-gray-900 mb-2">Senha</label>
                                <input
                                    id="senha"
                                    type="password"
                                    required
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pedraum-orange focus:ring-2 focus:ring-orange-100 outline-none transition-all bg-white text-gray-700"
                                />
                            </div>

                        </div>

                        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-5 mt-8">
                            <h3 className="text-sm font-medium text-gray-900 mb-1">
                                BENEFÍCIO EXCLUSIVO
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Ao cadastrar, você terá acesso ao PAINEL DE ACOMPANHAMENTO onde poderá ver o status de todas suas demandas e os fornecedores indicados.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <input
                                id="termos"
                                type="checkbox"
                                checked={termos}
                                onChange={(e) => setTermos(e.target.checked)}
                                className="w-5 h-5 rounded border-gray-300 text-pedraum-orange focus:ring-pedraum-orange cursor-pointer accent-pedraum-orange"
                            />
                            <label htmlFor="termos" className="text-sm text-gray-700 cursor-pointer select-none">
                                Aceito os termos e política de privacidade
                            </label>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={carregando}
                                className="bg-pedraum-orange hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-md shadow-orange-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {carregando ? "Criando conta..." : "Continuar"}
                            </button>
                        </div>

                    </form>

                </div>
            </div>
        </div>
    );
}