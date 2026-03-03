"use client";

import { X, HardHat, Factory } from "lucide-react";
import { useRouter } from "next/navigation";

interface TipoCadastroModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function TipoCadastroModal({ isOpen, onClose }: TipoCadastroModalProps) {
    const router = useRouter();

    if (!isOpen) return null;

    const handleNavegar = (rota: string) => {
        onClose(); // Fecha o modal primeiro
        router.push(rota); // Depois redireciona para a página correta
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">

            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl relative animate-in fade-in zoom-in duration-200 overflow-hidden">

                {/* Botão Fechar */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors z-10 bg-white rounded-full p-1"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="p-8 md:p-10 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Como você deseja usar a PedraUm?</h2>
                    <p className="text-gray-500 mb-10">Escolha o perfil que melhor se encaixa nas suas necessidades.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Opção 1: Comprador */}
                        <button
                            onClick={() => handleNavegar("/cadastro/comprador")}
                            className="group relative p-8 rounded-2xl border-2 border-gray-100 hover:border-pedraum-orange bg-white hover:bg-orange-50/30 transition-all text-left flex flex-col items-center text-center shadow-sm hover:shadow-md"
                        >
                            <div className="w-16 h-16 bg-orange-100 text-pedraum-orange rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <HardHat className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Quero Comprar</h3>
                            <p className="text-sm text-gray-500">
                                Preciso de materiais, insumos ou serviços para minha obra ou empresa.
                            </p>
                        </button>

                        {/* Opção 2: Fornecedor */}
                        <button
                            onClick={() => handleNavegar("/cadastro/fornecedor")}
                            className="group relative p-8 rounded-2xl border-2 border-gray-100 hover:border-pedraum-dark bg-white hover:bg-gray-50 transition-all text-left flex flex-col items-center text-center shadow-sm hover:shadow-md"
                        >
                            <div className="w-16 h-16 bg-gray-100 text-pedraum-dark rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Factory className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Quero Vender</h3>
                            <p className="text-sm text-gray-500">
                                Sou fornecedor e quero oferecer meus materiais e serviços na plataforma.
                            </p>
                        </button>

                    </div>
                </div>

                {/* Faixa decorativa no rodapé do modal */}
                <div className="h-2 w-full bg-linear-to-r from-pedraum-orange to-pedraum-dark"></div>
            </div>
        </div>
    );
}