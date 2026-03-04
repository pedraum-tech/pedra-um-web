"use client";

import { AuthModal } from "@/src/components/AuthModal";
import { Header } from "@/src/components/Header";
import { ArrowRight, Search, Settings, Truck, BarChart3, Target, ShieldCheck, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
// NOVO: Importando o useRouter
import { useRouter } from "next/navigation";


export default function Home() {
    const router = useRouter(); // NOVO: Iniciando o router

    // Estado que controla o popup (começa fechado)
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Estado para armazenar o texto da demanda (opcional, para mostrar no modal ou enviar para backend)
    const [textoDemanda, setTextoDemanda] = useState("");

    // NOVO: Estado para armazenar o protocolo que o usuário quer buscar
    const [protocoloBusca, setProtocoloBusca] = useState("");

    // Função que valida e abre o modal
    const handleEnviarDemanda = () => {
        // O .trim() remove espaços em branco inúteis. 
        // Se sobrar nada, significa que ele não digitou uma demanda real.
        if (textoDemanda.trim() === "" || textoDemanda.trim().length < 10) {
            alert("Por favor, descreva o que você precisa antes de enviar!");
            return; // Para a execução aqui e não abre o modal
        }

        // Se passou na validação acima, abre o popup!
        setIsModalOpen(true);
    };

    // NOVO: Função para buscar o protocolo
    const handleBuscarProtocolo = (e?: React.FormEvent) => {
        if (e) e.preventDefault(); // Evita recarregar a página se usar o "Enter"

        if (protocoloBusca.trim().length < 5) {
            alert("Por favor, digite um número de protocolo válido.");
            return;
        }

        // Redireciona o visitante para a tela de rastreio dinâmica
        router.push(`/rastrear/${protocoloBusca.trim()}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            {/* --- SEÇÃO 1: HERO (Foco no Comprador) --- */}
            <section className="w-full py-20 px-4 flex flex-col items-center justify-center text-center bg-white relative overflow-hidden">
                {/* Fundo decorativo sutil */}
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-orange-50 via-white to-white opacity-50 z-0"></div>

                <div className="z-10 max-w-4xl w-full">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-pedraum-dark mb-4 leading-tight">
                        O que você precisa <br />
                        <span className="text-pedraum-orange">resolver hoje?</span>
                    </h1>

                    <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                        Descreva sua necessidade técnica, peça ou manutenção. Nossa curadoria conecta você ao fornecedor exato em minutos.
                    </p>

                    {/* O Card Flutuante de Input */}
                    <div className="bg-white p-2 rounded-2xl shadow-2xl shadow-orange-100/50 border border-gray-100 max-w-3xl mx-auto transform hover:scale-[1.01] transition-transform duration-300">
                        <textarea
                            // LIGANDO O TEXTAREA AO ESTADO:
                            value={textoDemanda}
                            onChange={(e) => setTextoDemanda(e.target.value)}
                            className="w-full h-32 p-4 text-lg text-gray-700 placeholder:text-gray-400 border-none outline-none resize-none rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-100 transition-all"
                            placeholder="Ex.: Preciso de telas de poliuretano 1.2mm para Metso HP300 ou mecânico especialista em Caterpillar 938..."
                        ></textarea>

                        <div className="flex justify-end px-2 pb-2">
                            <button
                                className='bg-pedraum-orange hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-orange-500/20 flex items-center gap-2 transition-all hover:-translate-y-0.5'
                                // MUDANDO O ONCLICK PARA A NOSSA NOVA FUNÇÃO DE VALIDAÇÃO:
                                onClick={handleEnviarDemanda}
                            >
                                Enviar Demanda <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* NOVO: Barra de Rastreio Discreta */}
                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <p className="text-gray-500 text-sm font-medium">Já fez uma solicitação?</p>

                        <form onSubmit={handleBuscarProtocolo} className="flex bg-white rounded-full p-1.5 border border-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-pedraum-orange/50 focus-within:border-pedraum-orange transition-all w-full sm:w-auto">
                            <input
                                type="text"
                                placeholder="Digite seu protocolo"
                                value={protocoloBusca}
                                onChange={(e) => setProtocoloBusca(e.target.value.toUpperCase())} // Deixa maiúsculo automático
                                className="bg-transparent border-none outline-none px-4 text-sm text-gray-700 w-full sm:w-48 placeholder:text-gray-400 uppercase font-medium"
                            />
                            <button
                                type="submit"
                                className="bg-pedraum-dark hover:bg-black text-white px-5 py-2 rounded-full text-sm font-bold transition-colors flex items-center gap-2"
                            >
                                <Search className="w-4 h-4" /> Rastrear
                            </button>
                        </form>
                    </div>

                </div>
            </section>

            {/* O Popup escondido no código */}
            <AuthModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                textoDemanda={textoDemanda}
            />

            {/* --- SEÇÃO 2: O "MEIO" (Foco no Fornecedor) --- */}
            <section style={{ display: "none" }} className="py-16 px-4 bg-white border-y border-gray-100">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12">

                        {/* Texto de Venda */}
                        <div className="md:w-1/2 space-y-6">
                            <div className="inline-block px-3 py-1 rounded-full bg-orange-100 text-pedraum-orange text-xs font-bold uppercase tracking-wider">
                                Para Fornecedores
                            </div>
                            <h2 className="text-3xl font-bold text-pedraum-dark">
                                Pare de procurar clientes. <br />
                                <span className="text-gray-500">Deixe que eles venham até você.</span>
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                Na PedraUm, você não compete por preço em listas frias. Nós filtramos a demanda e entregamos o lead pronto para fechar negócio.
                            </p>

                            <ul className="space-y-3">
                                <li className="flex items-center gap-3">
                                    <div className="bg-green-100 p-1 rounded-full"><CheckCircle2 className="w-4 h-4 text-green-600" /></div>
                                    <span className="text-gray-700 font-medium">Demandas qualificadas pela nossa curadoria.</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="bg-green-100 p-1 rounded-full"><CheckCircle2 className="w-4 h-4 text-green-600" /></div>
                                    <span className="text-gray-700 font-medium">Notificação instantânea via WhatsApp.</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="bg-green-100 p-1 rounded-full"><CheckCircle2 className="w-4 h-4 text-green-600" /></div>
                                    <span className="text-gray-700 font-medium">Painel de performance exclusivo.</span>
                                </li>
                            </ul>

                            <Link href="/cadastro/fornecedor">
                                <button className="mt-4 text-pedraum-orange font-bold border-b-2 border-pedraum-orange hover:text-orange-600 transition-colors">
                                    Quero cadastrar minha empresa &rarr;
                                </button>
                            </Link>
                        </div>

                        {/* Ilustração Visual (Simulando Cards de Match) */}
                        <div className="md:w-1/2 relative h-64 w-full flex justify-center items-center">
                            {/* Círculos de Fundo */}
                            <div className="absolute w-64 h-64 bg-orange-50 rounded-full blur-3xl opacity-60"></div>

                            {/* Card Simulado */}
                            <div className="relative bg-white p-6 rounded-2xl shadow-xl border border-gray-100 w-80 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">MATCH ENCONTRADO</span>
                                    <span className="text-gray-400 text-xs">Agora</span>
                                </div>
                                <h3 className="font-bold text-gray-800 mb-1">Brita 19mm - 50 Ton</h3>
                                <p className="text-sm text-gray-500 mb-4">Solicitado por Construtora Real em Betim, MG.</p>
                                <button className="w-full bg-pedraum-dark text-white py-2 rounded-lg text-sm font-bold">Aceitar Oportunidade</button>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* --- SEÇÃO 3: CARDS ESCUROS (Benefícios) --- */}
            <section className="bg-pedraum-dark py-20 px-4 text-white">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Truck className="w-6 h-6 text-pedraum-orange" />
                        <span className="font-bold tracking-widest text-gray-400 text-sm">REDE PEDRA UM</span>
                    </div>
                    <h2 className="text-3xl font-bold mb-16">Expanda seu negócio com inteligência</h2>

                    <div className="grid md:grid-cols-3 gap-8">

                        {/* Card 1 */}
                        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors group text-left relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Search className="w-24 h-24 text-white" />
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center mb-6">
                                <Target className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Demandas Filtradas</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Nosso algoritmo elimina curiosos. Você recebe apenas oportunidades alinhadas com seu estoque e região.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors group text-left relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <BarChart3 className="w-24 h-24 text-white" />
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center mb-6">
                                <BarChart3 className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Painel de Performance</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Acompanhe suas métricas de conversão e saiba exatamente quanto você está faturando pela plataforma.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors group text-left relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <ShieldCheck className="w-24 h-24 text-white" />
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mb-6">
                                <Settings className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Mais Eficiência</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Reduza seu custo comercial. Sua equipe foca em fechar vendas, enquanto nós cuidamos da prospecção.
                            </p>
                        </div>

                    </div>

                    <div className="mt-16">
                        <Link href="/cadastro/comprador">
                            <button className="bg-pedraum-orange hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-full text-lg shadow-lg shadow-orange-500/30 transition-all hover:scale-105">
                                QUERO ME CADASTRAR
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* --- SEÇÃO 4: O ALGORITMO (Visual Final) --- */}
            <section style={{ display: "none" }} className="py-20 px-4 bg-gray-50 overflow-hidden">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-16">

                    {/* Lado Esquerdo: A Animação do Algoritmo (CSS Puro) */}
                    <div className="relative w-80 h-80 flex items-center justify-center">
                        {/* Círculos Orbitais */}
                        <div className="absolute w-full h-full border border-dashed border-gray-300 rounded-full animate-[spin_10s_linear_infinite]"></div>
                        <div className="absolute w-56 h-56 border border-gray-200 rounded-full"></div>

                        {/* Ícone Central */}
                        <div className="relative z-10 bg-pedraum-dark p-6 rounded-full shadow-2xl">
                            <Search className="w-10 h-10 text-pedraum-orange" />
                        </div>

                        {/* Ícones Flutuantes (Satélites) */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 bg-white p-3 rounded-full shadow-md">
                            <Settings className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="absolute bottom-10 right-0 bg-white p-3 rounded-full shadow-md">
                            <Truck className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="absolute bottom-10 left-0 bg-white p-3 rounded-full shadow-md">
                            <Target className="w-6 h-6 text-gray-400" />
                        </div>
                    </div>

                    {/* Lado Direito: Texto */}
                    <div className="md:w-1/2 space-y-6">
                        <h2 className="text-3xl font-bold text-pedraum-dark">
                            Nosso algoritmo trabalha <br />
                            <span className="text-pedraum-orange">por você.</span>
                        </h2>
                        <p className="text-gray-600">
                            Enquanto você cuida da operação, nossa tecnologia cruza dados de geolocalização, especialidade e disponibilidade para encontrar o match perfeito.
                        </p>

                        <div className="bg-white p-6 rounded-xl border-l-4 border-pedraum-orange shadow-sm">
                            <h4 className="font-bold text-pedraum-dark mb-2">VANTAGENS:</h4>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-pedraum-orange" /> Acesso à base qualificada</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-pedraum-orange" /> Match por similaridade técnica</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-pedraum-orange" /> Relatórios de performance</li>
                            </ul>
                        </div>
                    </div>

                </div>
            </section>

        </div>
    );
}