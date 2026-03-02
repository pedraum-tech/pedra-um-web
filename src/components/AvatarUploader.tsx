"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, Loader2 } from "lucide-react"; // Lembre-se de instalar: npm install lucide-react

interface AvatarUploaderProps {
    uid: string;
    fotoAtual?: string | null;
    nomeUsuario?: string;
    onUploadSuccess: (novaUrl: string) => void;
}

export function AvatarUploader({ uid, fotoAtual, nomeUsuario, onUploadSuccess }: AvatarUploaderProps) {
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");
    const [preview, setPreview] = useState<string | null>(fotoAtual || null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validações básicas de segurança
        if (!file.type.startsWith("image/")) {
            return setErro("Por favor, selecione uma imagem válida.");
        }
        if (file.size > 5 * 1024 * 1024) {
            return setErro("A imagem deve ter no máximo 5MB.");
        }

        setErro("");
        setCarregando(true);

        try {
            // --- SIMULAÇÃO DE UPLOAD (PREVIEW LOCAL) ---
            // Como o Storage do Firebase está pendente, criamos um URL temporário no navegador
            const tempUrl = URL.createObjectURL(file);

            // Simulamos o tempo de carregamento da internet (1,5 segundos)
            await new Promise((resolve) => setTimeout(resolve, 1500));

            setPreview(tempUrl);
            onUploadSuccess(tempUrl); // Avisa o componente Pai da alteração

            /* ===================================================================
            TODO: QUANDO O CLIENTE ATIVAR O PLANO BLAZE, DESCOMENTE ESTE BLOCO 
            E APAGUE A SIMULAÇÃO ACIMA:
            ===================================================================
            
            import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
            import { updateProfile } from "firebase/auth";
            import { doc, updateDoc } from "firebase/firestore";
            import { auth, db, storage } from "@/src/lib/firebase";

            const fileRef = ref(storage, `avatars/${uid}/perfil_${Date.now()}`);
            await uploadBytes(fileRef, file);
            const photoURL = await getDownloadURL(fileRef);
            
            if (auth.currentUser) {
                await updateProfile(auth.currentUser, { photoURL });
            }
            
            const userDoc = doc(db, "usuarios", uid);
            await updateDoc(userDoc, { fotoPerfil: photoURL });
            
            setPreview(photoURL);
            onUploadSuccess(photoURL);
            ===================================================================
            */

        } catch (error) {
            console.error("Erro ao processar imagem:", error);
            setErro("Falha ao carregar a imagem.");
        } finally {
            setCarregando(false);
        }
    };

    // Pega a primeira letra do nome para fazer um "Avatar Falso" caso não tenha foto
    const inicial = nomeUsuario ? nomeUsuario.charAt(0).toUpperCase() : "U";

    return (
        <div className="flex flex-col items-start gap-3">
            <div className="relative group cursor-pointer rounded-full">
                {/* O input de ficheiro fica invisível, cobrindo o avatar */}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={carregando}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                />

                {/* Círculo do Avatar */}
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-md flex items-center justify-center relative">
                    {carregando ? (
                        <Loader2 className="w-8 h-8 text-pedraum-orange animate-spin" />
                    ) : preview ? (
                        <Image src={preview} alt="Foto de perfil" fill className="object-cover" />
                    ) : (
                        <span className="text-3xl font-bold text-gray-400">{inicial}</span>
                    )}

                    {/* Efeito visual de hover */}
                    {!carregando && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                            <Camera className="w-8 h-8 text-white" />
                        </div>
                    )}
                </div>
            </div>

            {erro && <p className="text-sm text-red-500 font-medium">{erro}</p>}
        </div>
    );
}