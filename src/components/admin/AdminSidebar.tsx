"use client";

import Link from "next/link";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation"; // Adicionamos o useRouter

// 1. Importações do Firebase
import { signOut } from "firebase/auth";
import { auth } from "@/src/lib/firebase";

export function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter(); // 2. Inicializando o router

    const menuItems = [
        { label: "Dashboard", href: "/admin/dashboard" },
        { label: "Demandas", href: "/admin/demandas" },
        { label: "Fornecedores", href: "/admin/fornecedores" },
        { label: "Compradores", href: "/admin/compradores" },
        { label: "Patrocinadores", href: "/admin/patrocinadores" },
    ];

    // 3. A função assíncrona que encerra a sessão
    const handleLogout = async () => {
        try {
            await signOut(auth); // Firebase encerra a sessão
            router.push("/login"); // Redirecionamos para a tela de login
        } catch (error) {
            console.error("Erro ao sair do sistema:", error);
        }
    };

    return (
        <aside className="w-64 min-h-screen bg-[#0F172A] text-white flex flex-col py-8 px-6 fixed left-0 top-0 border-r border-gray-800">

            {/* 1. Logo */}
            <div className="relative w-40 h-12 mb-12">
                <Image
                    src="/logos/logo-pedraum-normal.png"
                    alt="PedraUm Admin"
                    fill
                    className="object-contain brightness-0 invert"
                    priority
                />
            </div>

            {/* 2. Menu de Navegação */}
            <nav className="flex-1 flex flex-col gap-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                                text-lg font-medium px-4 py-3 rounded-lg transition-all
                                ${isActive
                                    ? "bg-pedraum-orange text-white"
                                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                                }
                            `}
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* 3. Botão Sair (Agora sem o <Link> e ativando a função handleLogout) */}
            <div className="mt-auto">
                <button
                    className="flex items-center gap-3 text-lg font-medium text-gray-300 hover:text-white px-4 py-3 transition-colors w-full text-left"
                    onClick={handleLogout}
                >
                    <LogOut className="w-5 h-5" />
                    Sair
                </button>
            </div>

        </aside>
    );
}