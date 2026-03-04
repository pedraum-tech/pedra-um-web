"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, Loader2 } from "lucide-react";

// Ferramentas reais do Firebase
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db, storage } from "@/src/lib/firebase";

interface AvatarUploaderProps {
    uid: string;
    fotoAtual?: string | null;
    nomeUsuario?: string;
    onUploadSuccess: (novaUrl: string) => void;
}

export function AvatarUploader({ uid, fotoAtual, nomeUsuario, onUploadSuccess }: AvatarUploaderProps) {
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            return setErro("Por favor, selecione uma imagem válida.");
        }
        if (file.size > 5 * 1024 * 1024) {
            return setErro("A imagem deve ter no máximo 5MB.");
        }

        setErro("");
        setCarregando(true);

        try {
            // 1. Cria a referência da pasta no Storage
            const fileRef = ref(storage, `avatars/${uid}/perfil_${Date.now()}`);

            // 2. Faz o upload físico da imagem
            await uploadBytes(fileRef, file);

            // 3. Pega o link público gerado
            const photoURL = await getDownloadURL(fileRef);

            // 4. Salva no Auth do Google
            if (auth.currentUser) {
                await updateProfile(auth.currentUser, { photoURL });
            }

            // 5. Salva no Firestore
            const userDoc = doc(db, "usuarios", uid);
            await updateDoc(userDoc, { fotoPerfil: photoURL });

            // 6. Atualiza a tela
            onUploadSuccess(photoURL);

        } catch (error) {
            console.error("Erro ao processar imagem:", error);
            setErro("Falha ao salvar a imagem no servidor.");
        } finally {
            setCarregando(false);
        }
    };

    const inicial = nomeUsuario ? nomeUsuario.charAt(0).toUpperCase() : "U";

    return (
        <div className="flex flex-col items-start gap-3">
            <div className="relative group cursor-pointer rounded-full">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={carregando}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                />

                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-md flex items-center justify-center relative">
                    {carregando ? (
                        <Loader2 className="w-8 h-8 text-pedraum-orange animate-spin" />
                    ) : fotoAtual ? (
                        <Image src={fotoAtual} alt="Foto de perfil" fill className="object-cover" />
                    ) : (
                        <span className="text-3xl font-bold text-gray-400">{inicial}</span>
                    )}

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