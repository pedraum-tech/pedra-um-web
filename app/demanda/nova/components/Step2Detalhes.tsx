import { DemandaFormData } from "../page";
import { AnexosDemanda } from "@/src/components/AnexosDemanda"; // Importando o nosso componente!

interface Step2Props {
    formData: DemandaFormData;
    updateFormData: (data: Partial<DemandaFormData>) => void;
    onFinish: () => void;
    salvando: boolean;
    // Novas props para os arquivos
    imagens: File[];
    setImagens: (imagens: File[]) => void;
    pdf: File | null;
    setPdf: (pdf: File | null) => void;
}

export function Step2Detalhes({ formData, updateFormData, onFinish, salvando, imagens, setImagens, pdf, setPdf }: Step2Props) {

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onFinish();
    };

    return (
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-8 md:p-10 animate-in slide-in-from-right-8 duration-300">

            <h1 className="text-2xl font-medium text-gray-900 mb-3">Detalhe sua necessidade</h1>
            <div className="h-1 w-full bg-pedraum-dark mb-8 rounded-full"></div>

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* Descrição Detalhada */}
                <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                        Descrição Detalhada*
                    </label>
                    <textarea
                        required
                        maxLength={500}
                        value={formData.descricao}
                        onChange={(e) => updateFormData({ descricao: e.target.value })}
                        placeholder="Dica: Especifique quantidade, especificações técnicas, prazos, localização."
                        className="w-full min-h-40 p-4 rounded-lg border border-gray-300 focus:border-pedraum-orange focus:ring-2 focus:ring-orange-100 outline-none transition-all resize-y text-gray-700"
                    ></textarea>
                    <div className="text-xs text-gray-400 mt-1 font-medium text-right">
                        {formData.descricao.length}/500
                    </div>
                </div>

                {/* Usando o Componente de Anexos Real */}
                <div className="pt-2 pb-2">
                    <AnexosDemanda
                        imagens={imagens}
                        setImagens={setImagens}
                        pdf={pdf}
                        setPdf={setPdf}
                    />
                </div>

                {/* Urgência */}
                <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3">Urgência</label>
                    <div className="flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={() => updateFormData({ urgencia: "normal" })}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors
                ${formData.urgencia === "normal" ? 'border-pedraum-orange text-pedraum-orange bg-orange-50/50' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                        >
                            😐 Normal
                        </button>
                        <button
                            type="button"
                            onClick={() => updateFormData({ urgencia: "urgente" })}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors
                ${formData.urgencia === "urgente" ? 'border-pedraum-orange text-pedraum-orange bg-orange-50/50' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                        >
                            😔 Urgente (7 dias)
                        </button>
                        <button
                            type="button"
                            onClick={() => updateFormData({ urgencia: "critico" })}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors
                ${formData.urgencia === "critico" ? 'border-red-500 text-red-600 bg-red-50/50' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                        >
                            🚨 Crítico (48h)
                        </button>
                    </div>
                </div>

                {/* Botão Final Dinâmico */}
                <div className="pt-6 flex justify-end">
                    <button
                        type="submit"
                        disabled={salvando}
                        className="bg-pedraum-orange hover:bg-orange-600 text-gray-900 font-bold py-3 px-8 rounded-lg transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-50"
                    >
                        {salvando ? "Enviando..." : "Cadastrar Demanda"}
                    </button>
                </div>

            </form>
        </div>
    );
}