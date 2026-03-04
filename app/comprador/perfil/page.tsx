"use client";

import { useState, useEffect } from "react";
import { Header } from "@/src/components/Header";
import { ProtectedRoute } from "@/src/components/ProtectedRoute";
import { useAuth } from "@/src/contexts/AuthContext";

// Importações do Firebase
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { ChangePasswordModal } from "@/src/components/ChangePasswordModal";
import { AvatarUploader } from "@/src/components/AvatarUploader";

export default function PerfilCompradorPage() {
    const { user } = useAuth();
    const [isModalSenhaOpen, setIsModalSenhaOpen] = useState(false);

    // 1. Estados para os campos do formulário
    const [nome, setNome] = useState("");
    const [telefone, setTelefone] = useState("");
    const [email, setEmail] = useState(""); // Ficará bloqueado para edição
    const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);

    // 2. Estados de controle de interface
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [mensagem, setMensagem] = useState({ texto: "", tipo: "" });

    // 3. Efeito que busca os dados do banco assim que a página abre
    useEffect(() => {
        async function carregarDados() {
            if (user?.uid) {
                try {
                    const docRef = doc(db, "usuarios", user.uid);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const dados = docSnap.data();
                        setNome(dados.nome || "");
                        setTelefone(dados.telefone || "");
                        setEmail(dados.email || "");
                        setFotoPerfil(dados.fotoPerfil || null);
                    }
                } catch (error) {
                    console.error("Erro ao buscar perfil:", error);
                    setMensagem({ texto: "Erro ao carregar seus dados.", tipo: "erro" });
                } finally {
                    setCarregando(false);
                }
            }
        }

        carregarDados();
    }, [user]);

    // 4. Função que salva as alterações
    const handleSalvar = async (e: React.FormEvent) => {
        e.preventDefault();
        setMensagem({ texto: "", tipo: "" });
        setSalvando(true);

        try {
            if (user?.uid) {
                const docRef = doc(db, "usuarios", user.uid);
                // updateDoc atualiza apenas os campos especificados, sem apagar o resto do documento
                await updateDoc(docRef, {
                    nome: nome,
                    telefone: telefone
                });

                setMensagem({ texto: "Perfil atualizado com sucesso!", tipo: "sucesso" });
            }
        } catch (error) {
            console.error("Erro ao atualizar:", error);
            setMensagem({ texto: "Erro ao salvar as alterações.", tipo: "erro" });
        } finally {
            setSalvando(false);
        }
    };

    return (
        <ProtectedRoute allowedRoles={["comprador"]}>
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Header variant="buyer" />

                <main className="flex-1 max-w-4xl w-full mx-auto p-4 py-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6 px-2">
                        Meu Perfil
                    </h1>

                    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] p-8 md:p-12 relative">

                        {/* Se ainda estiver buscando os dados, mostra um aviso de carregamento */}
                        {carregando ? (
                            <div className="flex justify-center items-center h-40">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pedraum-orange"></div>
                            </div>
                        ) : (
                            <form onSubmit={handleSalvar} className="space-y-6">

                                {/* Feedback Visual de Sucesso/Erro */}
                                {mensagem.texto && (
                                    <div className={`p-4 rounded-lg text-sm font-medium ${mensagem.tipo === "sucesso" ? "bg-green-50 text-green-700 border-l-4 border-green-500" : "bg-red-50 text-red-700 border-l-4 border-red-500"
                                        }`}>
                                        {mensagem.texto}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-4">
                                        Foto de Perfil
                                    </label>

                                    {user?.uid && (
                                        <AvatarUploader
                                            uid={user.uid}
                                            fotoAtual={fotoPerfil}
                                            nomeUsuario={nome}
                                            onUploadSuccess={(novaUrl) => setFotoPerfil(novaUrl)}
                                        />
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="nome" className="block text-sm font-bold text-gray-900 mb-2">
                                        Nome
                                    </label>
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
                                    <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-2">
                                        Email <span className="text-xs text-gray-400 font-normal">(Não pode ser alterado)</span>
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        disabled
                                        value={email}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="telefone" className="block text-sm font-bold text-gray-900 mb-2">
                                        Telefone/Whatsapp
                                    </label>
                                    <input
                                        id="telefone"
                                        type="tel"
                                        required
                                        value={telefone}
                                        onChange={(e) => setTelefone(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pedraum-orange focus:ring-2 focus:ring-orange-100 outline-none transition-all bg-white text-gray-700"
                                    />
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalSenhaOpen(true)} // Quando clicar, abre o modal!
                                        className="px-6 py-3 rounded-lg border border-pedraum-orange text-sm font-medium text-gray-800 hover:bg-orange-50 transition-colors"
                                    >
                                        Alterar a Senha
                                    </button>
                                </div>

                                <div className="pt-8 flex justify-center">
                                    <button
                                        type="submit"
                                        disabled={salvando}
                                        className="bg-pedraum-orange hover:bg-orange-600 text-white font-bold py-3 px-14 rounded-lg transition-colors shadow-md shadow-orange-500/20 text-lg disabled:opacity-70"
                                    >
                                        {salvando ? "Salvando..." : "Salvar"}
                                    </button>
                                </div>

                            </form>
                        )}
                    </div>
                </main>
                {/* Modal Injetado aqui embaixo */}
                <ChangePasswordModal
                    isOpen={isModalSenhaOpen}
                    onClose={() => setIsModalSenhaOpen(false)}
                />
            </div>
        </ProtectedRoute>
    );
}