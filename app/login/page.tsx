
import { Header } from "@/src/components/Header";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Cabeçalho */}
            <Header />

            {/* Conteúdo Centralizado */}
            <div className="flex-1 flex items-center justify-center p-4">

                {/* O Card Principal (Box Branco com Sombra) */}
                <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">

                    {/* LADO ESQUERDO: Imagem (Trator/Caminhão) */}
                    <div className="w-full md:w-1/2 relative bg-gray-900">
                        {/* Lembre-se de colocar a imagem na pasta public */}
                        <Image
                            src="/hero-bg.jpg" // Nome da sua imagem na pasta public
                            alt="Equipamento de Mineração"
                            fill
                            className="object-cover opacity-90"
                            priority
                        />
                        {/* Overlay sutil para garantir que não fique "estourado" */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    </div>

                    {/* LADO DIREITO: Formulário */}
                    <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-gray-50/50">

                        <div className="max-w-md mx-auto w-full">
                            <h2 className="text-3xl font-bold text-pedraum-dark mb-2">Bem-vindo de volta</h2>
                            <p className="text-gray-500 mb-8">Acesse sua conta para gerenciar demandas.</p>

                            <form className="space-y-6">

                                {/* Campo Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="seu@email.com"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pedraum-orange focus:ring-2 focus:ring-orange-100 outline-none transition-all bg-white"
                                    />
                                </div>

                                {/* Campo Senha */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">
                                        Senha
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pedraum-orange focus:ring-2 focus:ring-orange-100 outline-none transition-all bg-white"
                                    />
                                    <div className="flex justify-end mt-2">
                                        <Link href="#" className="text-sm text-blue-500 hover:text-blue-700 font-medium">
                                            Esqueceu a senha?
                                        </Link>
                                    </div>
                                </div>

                                {/* Botões de Ação */}
                                <div className="pt-4 flex flex-col sm:flex-row gap-4">
                                    <button className="flex-1 bg-pedraum-orange hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg shadow-orange-500/20">
                                        Entrar
                                    </button>

                                    <Link href="/cadastro/comprador" className="flex-1">
                                        <button className="w-full bg-white border-2 border-orange-200 text-pedraum-orange hover:bg-orange-50 font-bold py-3 px-6 rounded-lg transition-colors">
                                            Cadastre-se
                                        </button>
                                    </Link>
                                </div>

                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}