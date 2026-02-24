import Link from "next/link";
import Image from "next/image";

// Definimos os 3 tipos possíveis de cabeçalho
type HeaderVariant = "guest" | "buyer" | "supplier";

interface HeaderProps {
    variant?: HeaderVariant; // O '?' diz que é opcional (padrão 'guest')
}

export function Header({ variant = "guest" }: Readonly<HeaderProps>) {

    // Função auxiliar para renderizar os links certos
    const renderNavLinks = () => {
        switch (variant) {
            case "buyer":
                return (
                    <>
                        <Link href="/" className="text-gray-600 hover:text-pedraum-orange font-medium">
                            Início
                        </Link>
                        <Link href="/comprador/" className="text-gray-600 hover:text-pedraum-orange font-medium">
                            Demanda
                        </Link>
                        <Link href="/comprador/perfil" className="text-gray-600 hover:text-pedraum-orange font-medium">
                            Perfil
                        </Link>
                    </>
                );
            case "supplier":
                return (
                    <>
                        <Link href="/dashboard" className="text-gray-600 hover:text-pedraum-orange font-medium">
                            Início
                        </Link>
                        <Link href="/fornecedor/" className="text-gray-600 hover:text-pedraum-orange font-medium">
                            Oportunidades
                        </Link>
                        <Link href="/fornecedor/perfil" className="text-gray-600 hover:text-pedraum-orange font-medium">
                            Perfil
                        </Link>
                    </>
                );
            default: // 'guest' (Home)
                return (
                    <div className="flex items-center gap-8">
                        <Link href="/" className="text-gray-600 hover:text-pedraum-orange font-medium">
                            Início
                        </Link>
                        <Link href="/cadastro/fornecedor" className="text-gray-600 hover:text-pedraum-orange font-medium">
                            Fornecedores
                        </Link>
                    </div>
                );
        }
    };

    // Função auxiliar para o botão de ação final (Entrar ou Sair)
    const renderActionButton = () => {
        if (variant === "guest") {
            return (
                <Link
                    href="/login"
                    className="bg-pedraum-orange hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-md transition-colors"
                >
                    Entrar
                </Link>
            );
        }

        // Se for buyer ou supplier, mostra botão Sair
        return (
            <button
                className="bg-pedraum-orange hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-md transition-colors"
                onClick={() => console.log("Fazendo logout...")}
            >
                Sair
            </button>
        );
    };

    return (
        <header className="w-full h-20 bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">

                {/* Lado Esquerdo: Logo */}
                <Link href="/">
                    {/* Lembre-se de colocar o logo preto na pasta public/logo-pedraum.png */}
                    <div className="relative w-40 h-10">
                        <Image
                            src="/logos/logo-pedraum-normal.png"
                            alt="PedraUm Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </Link>

                {/* Lado Direito: Links e Botão */}
                <nav className="flex items-center gap-8">
                    {renderNavLinks()}
                    {renderActionButton()}
                </nav>

            </div>
        </header>
    );
}