"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    textoDemanda: string;
}

export function AuthModal({ isOpen, onClose, textoDemanda }: AuthModalProps) {
    const router = useRouter();

    // Se o modal não estiver aberto, não renderiza nada
    if (!isOpen) return null;


    // 👇 Função mágica do Caminho 1
    const handleContinuarSemConta = () => {
        // 1. Salva a demanda no navegador
        sessionStorage.setItem("demandaPendente", textoDemanda);
        // 2. Manda o usuário para a página de contato rápido
        router.push("/demanda/nova");
    };

    return (
        // Fundo escuro desfocado (Overlay)
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">

            {/* Container do Modal */}
            <div className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col relative animate-in zoom-in-95 duration-300">

                {/* Botão de Fechar "X" no canto superior direito */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
                    aria-label="Fechar"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                {/* --- CABEÇALHO ESCURO --- */}
                <div className="bg-[#0B1426] p-8 md:p-12">
                    <span className="bg-pedraum-orange text-gray-900 text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full inline-block mb-4">
                        Atenção Comprador
                    </span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">
                        Inscritos têm atendimento preferencial.
                    </h2>
                    <p className="text-gray-300 text-lg max-w-2xl">
                        Usuários logados possuem prioridade na nossa curadoria e um quadro exclusivo de acompanhamento.
                    </p>
                </div>

                {/* --- CORPO DOS CARDS --- */}
                <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 bg-white">

                    {/* Card 1: Quero me inscrever (Destaque Amarelo) */}
                    <div className="bg-[#FFF9EA] rounded-2xl p-8 border border-[#FDEBCE] flex flex-col h-full">
                        <h3 className="text-2xl font-black text-gray-900 mb-4">
                            Quero me inscrever
                        </h3>
                        <p className="text-gray-700 mb-8 flex-1">
                            Crie sua conta agora para gerenciar esta e futuras demandas em um painel centralizado.
                        </p>

                        <Link href="/cadastro/comprador" className="w-full">
                            <button className="w-full bg-[#D97706] hover:bg-[#B45309] text-white font-black py-4 px-6 rounded-lg transition-colors uppercase tracking-wider mb-4 shadow-md shadow-amber-700/20">
                                Inscrever Agora
                            </button>
                        </Link>

                        <div className="text-center">
                            <Link href="/login" className="text-[#D97706] hover:text-[#B45309] font-bold text-sm uppercase tracking-wide">
                                Já sou inscrito? Entrar
                            </Link>
                        </div>
                    </div>

                    {/* Card 2: Sem inscrição (Neutro) */}
                    <div className="bg-[#F8FAFC] rounded-2xl p-8 border border-gray-100 flex flex-col h-full">
                        <h3 className="text-2xl font-black text-gray-900 mb-4">
                            Registrar sem inscrição
                        </h3>
                        <p className="text-gray-500 mb-8 flex-1">
                            Prosseguir apenas com seus dados de contato básicos (Nome e WhatsApp).
                        </p>

                        {/* <Link href="/cadastro/demanda/rapida" className="w-full mt-auto"> */}
                        {/* 👇 Botão atualizado chamando a nossa nova função */}
                        <button
                            onClick={handleContinuarSemConta}
                            className="w-full mt-auto bg-[#0B1426] hover:bg-gray-800 text-white font-black py-4 px-6 rounded-lg transition-colors uppercase tracking-wider shadow-md"
                        >
                            Continuar Sem Conta
                        </button>
                        {/* </Link> */}
                    </div>

                </div>

            </div>
        </div>
    );
}