"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore"; // <-- 1. Mudamos para onSnapshot!
import { auth, db } from "@/src/lib/firebase";

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
        let unsubscribeFirestore: () => void; // Variável para guardar o ouvinte do banco

        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                // Em vez de ir buscar e voltar (getDoc), nós deixamos um "espião" (onSnapshot)
                // Se o documento for criado 1 segundo depois, o espião avisa e atualiza o state!
                unsubscribeFirestore = onSnapshot(doc(db, "usuarios", currentUser.uid), (docSnap) => {
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
                        // O documento ainda não existe (está no meio do cadastro)
                        setUser({ uid: currentUser.uid, email: currentUser.email });
                    }
                    setLoading(false); // Libera a tela
                }, (error) => {
                    console.error("Erro no espião do Firestore:", error);
                    setUser(null);
                    setLoading(false);
                });

            } else {
                // Ninguém logado, limpa tudo
                setUser(null);
                setLoading(false);
                if (unsubscribeFirestore) unsubscribeFirestore(); // Desliga o espião
            }
        });

        // Quando o componente morrer, desliga o Auth e o Espião
        return () => {
            unsubscribeAuth();
            if (unsubscribeFirestore) unsubscribeFirestore();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);