"use client";

import { useState } from "react";
import { X } from "lucide-react"; // Ícone de fechar (lembre-se de instalar: npm install lucide-react)

// Ferramentas de segurança do Firebase
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { auth } from "@/src/lib/firebase";

// Definimos o que o Modal precisa receber do "Pai" para funcionar
interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
    const [senhaAtual, setSenhaAtual] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");
    const [carregando, setCarregando] = useState(false);

    // Se o modal estiver fechado, não renderizamos nada
    if (!isOpen) return null;

    const handleTrocarSenha = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro("");
        setSucesso("");

        // 1. Validações básicas de segurança
        if (novaSenha.length < 6) {
            return setErro("A nova senha deve ter pelo menos 6 caracteres.");
        }
        if (novaSenha !== confirmarSenha) {
            return setErro("As novas senhas não coincidem.");
        }

        const user = auth.currentUser;
        if (!user?.email) {
            return setErro("Usuário não encontrado. Tente fazer login novamente.");
        }

        setCarregando(true);

        try {
            // 2. Reautenticação (A exigência de segurança do Google)
            // Criamos a credencial usando o email atual e a senha antiga que ele digitou
            const credential = EmailAuthProvider.credential(user.email, senhaAtual);

            // Reautenticamos silenciosamente
            await reauthenticateWithCredential(user, credential);

            // 3. Tudo certo! Agora podemos atualizar a senha
            await updatePassword(user, novaSenha);

            // 4. Feedback de sucesso e limpeza dos campos
            setSucesso("Senha alterada com sucesso!");
            setSenhaAtual("");
            setNovaSenha("");
            setConfirmarSenha("");

            // Opcional: Fechar o modal automaticamente após alguns segundos
            setTimeout(() => {
                onClose();
                setSucesso("");
            }, 2000);

        } catch (error: any) {
            console.error("Erro ao alterar senha:", error);
            if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password") {
                setErro("A senha atual está incorreta.");
            } else {
                setErro("Ocorreu um erro ao atualizar a senha. Tente novamente.");
            }
        } finally {
            setCarregando(false);
        }
    };

    return (
        // Overlay escuro de fundo (cobre a tela toda)
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">

            {/*  A Caixa do Modal Branca */}
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-200">

                {/* Botão Fechar no canto superior direito */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Alterar Senha</h2>

                    {erro && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg">{erro}</div>}
                    {sucesso && <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-lg">{sucesso}</div>}

                    <form onSubmit={handleTrocarSenha} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Senha Atual</label>
                            <input
                                type="password"
                                required
                                value={senhaAtual}
                                onChange={(e) => setSenhaAtual(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-pedraum-orange focus:ring-1 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Nova Senha</label>
                            <input
                                type="password"
                                required
                                value={novaSenha}
                                onChange={(e) => setNovaSenha(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-pedraum-orange focus:ring-1 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Confirmar Nova Senha</label>
                            <input
                                type="password"
                                required
                                value={confirmarSenha}
                                onChange={(e) => setConfirmarSenha(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-pedraum-orange focus:ring-1 outline-none"
                            />
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2 rounded-lg text-gray-600 font-medium hover:bg-gray-100 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={carregando}
                                className="px-5 py-2 rounded-lg bg-pedraum-orange text-white font-bold hover:bg-orange-600 transition-colors disabled:opacity-70"
                            >
                                {carregando ? "Salvando..." : "Atualizar Senha"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}