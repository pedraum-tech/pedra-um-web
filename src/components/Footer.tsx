"use client"; // <--- Adicione isso na primeira linha (obrigatório para usar hooks)

import Link from "next/link";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react"; // Importando ícones
import { usePathname } from "next/navigation"; // <--- Importe isso
// import { FaWhatsapp } from "react-icons/fa"; // Opcional: Se quiser o logo oficial do Whats, mas vou usar o MessageCircle do Lucide para manter padrão por enquanto.

export function Footer() {
    const pathname = usePathname();

    // SEGREDO: Se estivermos em qualquer página de admin, o footer não renderiza
    if (pathname?.startsWith("/admin")) {
        return null;
    }
    return (
        <>
            {/* 1. O Rodapé Principal (Estático) */}
            <footer className="w-full bg-[#0F172A] text-gray-300 py-12 border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">

                        {/* Coluna 1: Contato */}
                        <div className="space-y-4">
                            <h3 className="text-pedraum-orange text-lg font-bold mb-2">Contato</h3>

                            <div className="flex items-center gap-3">
                                <MessageCircle className="w-5 h-5 text-white" />
                                <span className="font-medium text-white">WhatsApp: 31 99090-3613</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5" />
                                <a href="mailto:contato@pedraum.com.br" className="hover:text-white transition-colors">
                                    contato@pedraum.com.br
                                </a>
                            </div>

                            <div className="flex items-center gap-3">
                                <Phone className="w-5 h-5" />
                                <span>(31) 99090-3613</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <MapPin className="w-5 h-5" />
                                <span>Belo Horizonte, MG</span>
                            </div>
                        </div>

                        {/* Coluna 2: Links Legais (Centralizados/Direita no Desktop) */}
                        <div className="flex gap-12 text-sm font-medium">
                            <Link href="/termos" className="hover:text-pedraum-orange transition-colors">
                                Termos de Uso
                            </Link>
                            <Link href="/lgpd" className="hover:text-pedraum-orange transition-colors">
                                LGPD
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>

            {/* 2. O Botão Flutuante (FAB) do WhatsApp */}
            <a
                href="https://wa.me/5531990903613" // Link direto para o Whats
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20bd5a] text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center"
                aria-label="Fale conosco no WhatsApp"
            >
                {/* Ícone do Whats (simulado com Lucide ou use react-icons se preferir o logo exato) */}
                <MessageCircle className="w-8 h-8 fill-current" />
            </a>
        </>
    );
}