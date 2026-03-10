"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Importação nova!
import { auth, db } from "@/src/lib/firebase"; // Ajuste o caminho se necessário

// 1. Criamos um tipo de usuário mais robusto, unindo Auth e Firestore
export interface UserData {
    uid: string;
    email: string | null;
    role?: string;
    razaoSocial?: string;
    nome?: string;
}

interface AuthContextType {
    user: UserData | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                // Se o Google Auth disse que logou, nós vamos lá no Firestore buscar os detalhes dele
                try {
                    const docRef = doc(db, "usuarios", currentUser.uid);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const dadosBanco = docSnap.data();
                        setUser({
                            uid: currentUser.uid,
                            email: currentUser.email,
                            role: dadosBanco.role,
                            nome: dadosBanco.nome,
                            razaoSocial: dadosBanco.razaoSocial,
                        });
                    } else {
                        // Se por acaso não achar o documento (fallback de segurança)
                        setUser({ uid: currentUser.uid, email: currentUser.email });
                    }
                } catch (error) {
                    console.error("Erro ao buscar dados do usuário no Firestore:", error);
                    setUser(null);
                }
            } else {
                // Ninguém logado
                setUser(null);
            }
            setLoading(false); // Só tira o loading DEPOIS de ir no banco de dados
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);