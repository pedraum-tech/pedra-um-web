"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/contexts/AuthContext";

// Agora ele pode receber um array de cargos permitidos!
interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[]; // Ex: ["admin", "comprador"]
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            // 1. Se não tiver logado, chuta pro login
            if (!user) {
                router.push("/login");
                return;
            }

            // 2. Se a rota exigir um cargo específico, e o usuário não tiver esse cargo...
            if (allowedRoles && user.tipo_usuario && !allowedRoles.includes(user.tipo_usuario)) {

                // Redireciona a pessoa de volta para a casa correta dela
                if (user.tipo_usuario === "comprador") {
                    router.push("/comprador");
                } else if (user.tipo_usuario === "fornecedor") {
                    router.push("/fornecedor");
                } else {
                    router.push("/");
                }
            }
        }
    }, [user, loading, router, allowedRoles]);

    // Tela de carregamento enquanto o Firebase decide o que fazer
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pedraum-orange"></div>
            </div>
        );
    }

    // Se passou por todas as barreiras, renderiza a página!
    return user ? <>{children}</> : null;
};