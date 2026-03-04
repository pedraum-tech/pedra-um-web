"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/src/lib/firebase";

type HeaderVariant = "guest" | "buyer" | "supplier";

interface HeaderProps {
    variant?: HeaderVariant;
}

export function Header({ variant = "guest" }: Readonly<HeaderProps>) {
    const { user, loading } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push("/login");
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
        }
    };

    // A MÁGICA ACONTECE AQUI:
    // O Header agora decide o que mostrar baseado PRIMEIRO no tipo de usuário logado.
    const getEffectiveMode = () => {
        if (user?.tipo_usuario === "comprador") return "buyer";
        if (user?.tipo_usuario === "fornecedor") return "supplier";

        // Só usa a prop 'variant' original se for um visitante real (deslogado)
        return variant;
    };

    const currentMode = getEffectiveMode();

    const renderNavLinks = () => {
        switch (currentMode) {
            case "buyer":
                return (
                    <>
                        <Link href="/" className="text-gray-600 hover:text-pedraum-orange font-medium">
                            Início
                        </Link>
                        <Link href="/comprador" className="text-gray-600 hover:text-pedraum-orange font-medium">
                            Demanda
                        </Link>
                        <Link href="/comprador/perfil" className="text-gray-600 hover:text-pedraum-orange font-medium">
                            Perfil
                        </Link>
                    </>
                );
            case "supplier":
                return (
                    <>
                        <Link href="/" className="text-gray-600 hover:text-pedraum-orange font-medium">
                            Início
                        </Link>
                        <Link href="/fornecedor" className="text-gray-600 hover:text-pedraum-orange font-medium">
                            Oportunidades
                        </Link>
                        <Link href="/fornecedor/perfil" className="text-gray-600 hover:text-pedraum-orange font-medium">
                            Perfil
                        </Link>
                    </>
                );
            default: // Visitante / Deslogado
                return (
                    <div className="flex items-center gap-8">
                        <Link href="/" className="text-gray-600 hover:text-pedraum-orange font-medium">
                            Início
                        </Link>
                        <Link href="/cadastro/fornecedor" className="text-gray-600 hover:text-pedraum-orange font-medium">
                            Fornecedores
                        </Link>
                    </div>
                );
        }
    };

    const renderActionButton = () => {
        if (user) {
            return (
                <button
                    onClick={handleLogout}
                    className="bg-pedraum-orange hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-md transition-colors"
                >
                    Sair
                </button>
            );
        }

        return (
            <Link
                href="/login"
                className="bg-pedraum-orange hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-md transition-colors"
            >
                Entrar
            </Link>
        );
    };

    return (
        <header className="w-full h-20 bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">

                <Link href="/">
                    <div className="relative w-40 h-10">
                        <Image
                            src="/logos/logo-pedraum-normal.png"
                            alt="PedraUm Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </Link>

                {/* Esconde os links enquanto carrega para evitar "piscar" a tela de visitante */}
                {!loading && (
                    <nav className="flex items-center gap-8 animate-in fade-in duration-300">
                        {renderNavLinks()}
                        {renderActionButton()}
                    </nav>
                )}

            </div>
        </header>
    );
}