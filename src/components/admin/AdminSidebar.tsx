"use client"; // Necessário porque pode ter interações (como logout)

import Link from "next/link";
import Image from "next/image";
import { LogOut } from "lucide-react"; // Certifique-se de ter instalado: npm install lucide-react
import { usePathname } from "next/navigation";

export function AdminSidebar() {
    const pathname = usePathname(); // Para saber em qual página estamos e destacar o link ativo

    const menuItems = [
        { label: "Dashboard", href: "/admin/dashboard" },
        { label: "Demandas", href: "/admin/demandas" },
        { label: "Fornecedores", href: "/admin/fornecedores" },
        { label: "Compradores", href: "/admin/compradores" },
        { label: "Patrocinadores", href: "/admin/patrocinadores" },
    ];

    return (
        <aside className="w-64 min-h-screen bg-[#0F172A] text-white flex flex-col py-8 px-6 fixed left-0 top-0 border-r border-gray-800">

            {/* 1. Logo (Com filtro para ficar branco) */}
            <div className="relative w-40 h-12 mb-12">
                <Image
                    src="/logos/logo-pedraum-normal.png" // O mesmo logo preto que você já tem
                    alt="PedraUm Admin"
                    fill
                    className="object-contain brightness-0 invert" // O segredo: inverte a cor para branco
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
                                    ? "bg-pedraum-orange text-white" // Estilo quando está Ativo
                                    : "text-gray-300 hover:bg-white/10 hover:text-white" // Estilo Inativo
                                }
              `}
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* 3. Botão Sair (Rodapé) */}
            <Link href="/" className="mt-auto">
                <button
                    className="mt-auto flex items-center gap-3 text-lg font-medium text-gray-300 hover:text-white px-4 py-3 transition-colors"
                    onClick={() => console.log("Sair do sistema...")}
                >
                    Sair
                    <LogOut className="w-5 h-5" />
                </button>
            </Link>

        </aside>
    );
}