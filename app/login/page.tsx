"use client"; // 1. Obrigatório para usar states e funções de clique

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/src/components/Header";
import Image from "next/image";
import Link from "next/link";

// 2. Importações do Firebase
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/src/lib/firebase";
// Lembre-se de verificar se o caminho da pasta lib está correto!

export default function LoginPage() {
    // 3. Estados para guardar o que o usuário digita e controlar a tela
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    const router = useRouter();

    // 4. A função que conversa com o Google/Firebase
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault(); // Impede a página de recarregar
        setErro(""); // Limpa erros antigos
        setCarregando(true); // Ativa o botão de "carregando"

        try {
            // A mágica acontece aqui: tenta logar com os dados
            await signInWithEmailAndPassword(auth, email, password);

            // Se deu certo, manda para o painel
            router.push("/comprador/");
        } catch (error: unknown) {
            // Se deu erro (senha errada, usuário não existe), avisa o usuário
            console.error("Erro na autenticação:", error);
            setErro("E-mail ou senha inválidos. Verifique seus dados e tente novamente.");
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            <div className="flex-1 flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-150">

                    {/* LADO ESQUERDO: Imagem (Trator/Caminhão) */}
                    <div className="w-full md:w-1/2 relative bg-gray-900 hidden md:block">
                        <Image
                            src="/hero-bg.jpg"
                            alt="Equipamento de Mineração"
                            fill
                            className="object-cover opacity-90"
                            priority
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent"></div>
                    </div>

                    {/* LADO DIREITO: Formulário */}
                    <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-gray-50/50">
                        <div className="max-w-md mx-auto w-full">
                            <h2 className="text-3xl font-bold text-pedraum-dark mb-2">Bem-vindo de volta</h2>
                            <p className="text-gray-500 mb-8">Acesse sua conta para gerenciar demandas.</p>

                            {/* Aviso de Erro Visual */}
                            {erro && (
                                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium rounded-r-lg animate-in fade-in">
                                    {erro}
                                </div>
                            )}

                            {/* 5. Conectando a função handleLogin ao formulário */}
                            <form onSubmit={handleLogin} className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="seu@email.com"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pedraum-orange focus:ring-2 focus:ring-orange-100 outline-none transition-all bg-white"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">
                                        Senha
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pedraum-orange focus:ring-2 focus:ring-orange-100 outline-none transition-all bg-white"
                                    />
                                    <div className="flex justify-end mt-2">
                                        <Link href="#" className="text-sm text-blue-500 hover:text-blue-700 font-medium">
                                            Esqueceu a senha?
                                        </Link>
                                    </div>
                                </div>

                                <div className="pt-4 flex flex-col sm:flex-row gap-4">
                                    {/* 6. Botão de Submit Dinâmico */}
                                    <button
                                        type="submit"
                                        disabled={carregando}
                                        className="flex-1 bg-pedraum-orange hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg shadow-orange-500/20 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                                    >
                                        {carregando ? "Entrando..." : "Entrar"}
                                    </button>

                                    <Link href="/cadastro/comprador" className="flex-1">
                                        <button type="button" className="w-full bg-white border-2 border-orange-200 text-pedraum-orange hover:bg-orange-50 font-bold py-3 px-6 rounded-lg transition-colors">
                                            Cadastre-se
                                        </button>
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}