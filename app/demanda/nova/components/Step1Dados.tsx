import { DemandaFormData } from "../page";

interface Step1Props {
    formData: DemandaFormData;
    updateFormData: (data: Partial<DemandaFormData>) => void;
    onNext: () => void;
}

export function Step1Dados({ formData, updateFormData, onNext }: Step1Props) {

    const handleContinue = (e: React.FormEvent) => {
        e.preventDefault();
        onNext();
    };

    return (
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-8 md:p-10 animate-in fade-in duration-300">

            <h1 className="text-2xl font-medium text-gray-900 mb-3">Seus dados</h1>
            <div className="h-1 w-full bg-pedraum-dark mb-8 rounded-full"></div>

            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-6">
                Contato Principal
            </h2>

            <form onSubmit={handleContinue} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="nome" className="block text-sm font-bold text-gray-900 mb-2">Nome*</label>
                        <input
                            id="nome"
                            type="text"
                            required
                            value={formData.nome}
                            onChange={(e) => updateFormData({ nome: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pedraum-orange focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label htmlFor="telefone" className="block text-sm font-bold text-gray-900 mb-2">Telefone*</label>
                        <input
                            id="telefone"
                            type="tel"
                            required
                            value={formData.telefone}
                            onChange={(e) => updateFormData({ telefone: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pedraum-orange focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-5 mt-8">
                    <h3 className="text-sm font-medium text-gray-900 mb-1 uppercase">Benefício Exclusivo</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        Ao cadastrar, você terá acesso ao PAINEL DE ACOMPANHAMENTO onde poderá ver o status de todas suas demandas e os fornecedores indicados.
                    </p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                    <input
                        id="termos"
                        type="checkbox"
                        required
                        checked={formData.termosAceitos}
                        onChange={(e) => updateFormData({ termosAceitos: e.target.checked })}
                        className="w-5 h-5 rounded border-gray-300 text-pedraum-orange focus:ring-pedraum-orange cursor-pointer accent-pedraum-orange"
                    />
                    <label htmlFor="termos" className="text-sm text-gray-700 cursor-pointer select-none">
                        Aceito os termos e política de privacidade
                    </label>
                </div>

                <div className="pt-4 flex justify-end">
                    <button type="submit" className="bg-pedraum-orange hover:bg-orange-600 text-gray-900 font-bold py-3 px-8 rounded-lg transition-colors">
                        Continuar
                    </button>
                </div>
            </form>
        </div>
    );
}