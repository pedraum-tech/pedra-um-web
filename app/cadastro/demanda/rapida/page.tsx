import { Header } from "@/src/components/Header";

export default function CadastroSemSenhaPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Cabeçalho no modo visitante */}
            <Header variant="guest" />

            {/* Container Centralizado */}
            <div className="flex-1 flex items-center justify-center p-4 py-12">

                {/* Card Branco Principal */}
                <div className="bg-white w-full max-w-2xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-8 md:p-10">

                    {/* Título e Linha Divisória */}
                    <h1 className="text-2xl font-medium text-gray-900 mb-3">
                        Seus dados
                    </h1>
                    <div className="h-1 w-full bg-pedraum-dark mb-8 rounded-full"></div>

                    {/* Subtítulo da Seção */}
                    <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-6">
                        Contato Principal
                    </h2>

                    {/* Formulário Enxuto */}
                    <form className="space-y-6">

                        {/* Grid de Campos (2 colunas no desktop, 1 no mobile) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Campo Nome */}
                            <div>
                                <label htmlFor="nome" className="block text-sm font-bold text-gray-900 mb-2">
                                    Nome*
                                </label>
                                <input
                                    id="nome"
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pedraum-orange focus:ring-2 focus:ring-orange-100 outline-none transition-all bg-white text-gray-700"
                                />
                            </div>

                            {/* Campo Telefone */}
                            <div>
                                <label htmlFor="telefone" className="block text-sm font-bold text-gray-900 mb-2">
                                    Telefone*
                                </label>
                                <input
                                    id="telefone"
                                    type="tel"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pedraum-orange focus:ring-2 focus:ring-orange-100 outline-none transition-all bg-white text-gray-700"
                                />
                            </div>

                        </div>

                        {/* Box de Benefício (Incentivo para o sistema) */}
                        <div style={{ display: "none" }} className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-5 mt-8">
                            <h3 className="text-sm font-medium text-gray-900 mb-1 uppercase">
                                Benefício Exclusivo
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Ao cadastrar, você terá acesso ao PAINEL DE ACOMPANHAMENTO onde poderá ver o status de todas suas demandas e os fornecedores indicados.
                            </p>
                        </div>

                        {/* Checkbox de Termos */}
                        <div className="flex items-center gap-3 pt-2">
                            <input
                                id="termos"
                                type="checkbox"
                                required
                                className="w-5 h-5 rounded border-gray-300 text-pedraum-orange focus:ring-pedraum-orange cursor-pointer accent-pedraum-orange"
                            />
                            <label htmlFor="termos" className="text-sm text-gray-700 cursor-pointer select-none">
                                Aceito os termos e política de privacidade
                            </label>
                        </div>

                        {/* Botão de Ação */}
                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                className="bg-pedraum-orange hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-md shadow-orange-500/20"
                            >
                                Continuar
                            </button>
                        </div>

                    </form>

                </div>
            </div>

        </div>
    );
}