"use client";


import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Se já terminou de carregar e não há utilizador, recambiamos para o login!
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    // Enquanto o Firebase pensa, mostramos um ecrã de carregamento elegante
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pedraum-orange"></div>
            </div>
        );
    }

    // Se tiver utilizador, renderizamos a página protegida
    return user ? <>{children}</> : null;
};