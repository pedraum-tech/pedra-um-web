import { FornecedorFormData } from "../page";
import { CATEGORIAS, SUBCATS_BY_CAT } from "@/src/constants/taxonomia";

interface Step2Props {
    formData: FornecedorFormData;
    updateFormData: (data: Partial<FornecedorFormData>) => void;
    onBack: () => void;
    onSubmit: () => void;
}

export function Step2({ formData, updateFormData, onBack, onSubmit }: Readonly<Step2Props>) {

    // 1. A Função que gerencia o clique na categoria e salva no formData
    const toggleCategoria = (categoria: string) => {
        const categoriasAtuais = formData.categorias || [];

        if (categoriasAtuais.includes(categoria)) {
            // Se já tem, remove
            updateFormData({ categorias: categoriasAtuais.filter((c) => c !== categoria) });
        } else {
            // Se não tem, adiciona (mas trava em 3 no máximo)
            if (categoriasAtuais.length >= 3) {
                alert("Você só pode selecionar no máximo 3 categorias.");
                return;
            }
            updateFormData({ categorias: [...categoriasAtuais, categoria] });
        }
    };

    // Função para finalizar o cadastro
    const handleFinalSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Verificação de segurança extra para os termos
        if (!formData.aceitaTermos) {
            alert("Por favor, aceite os termos e políticas para continuar.");
            return;
        }

        // Verificação para obrigar pelo menos 1 categoria
        if (formData.categorias.length === 0) {
            alert("Por favor, selecione pelo menos uma categoria de atuação.");
            return;
        }

        onSubmit();
    };

    // --- LÓGICA DA SUGESTÃO INTELIGENTE ---
    // 1. Junta todas as subcategorias das categorias que o fornecedor marcou
    const todasSubcategoriasPossiveis = formData.categorias.flatMap(cat => SUBCATS_BY_CAT[cat] || []);

    // 2. Acha a primeira subcategoria que ele AINDA NÃO adicionou nas tags
    const proximaSugestao = todasSubcategoriasPossiveis.find(sub => !formData.descricaoItem.includes(sub));

    // 3. Define o texto do placeholder
    const placeholderDinamico = proximaSugestao
        ? `Ex: ${proximaSugestao} (Aperte Enter)`
        : (formData.descricaoItem.length === 0 ? "Ex: Britador de Mandíbula (Aperte Enter)" : "Adicionar outra...");

    return (
        <form onSubmit={handleFinalSubmit} className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-500">

            {/* 1. Cabeçalho do Card */}
            <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-3">
                    <h1 className="text-2xl font-medium text-gray-900">Inventário Destacado</h1>
                    <span className="text-2xl text-gray-300 font-light">|</span>
                    <span className="text-xl text-gray-500 font-normal">Passo 2 de 2</span>
                </div>
                {/* Barra de progresso preenchida */}
                <div className="h-1 w-full bg-pedraum-dark rounded-full"></div>
            </div>

            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-4">
                Detalhes do Item
            </h2>

            {/* --- GRID DE CATEGORIAS OFICIAL (TAXONOMIA) --- */}
            <div>
                <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-bold text-gray-900">
                        Categorias de Atuação*
                    </label>
                    <span className="text-sm font-medium text-gray-500">
                        Selecionadas: <strong className={formData.categorias.length === 3 ? "text-pedraum-orange" : ""}>{formData.categorias.length}/3</strong>
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {CATEGORIAS.map((cat) => {
                        // Verifica direto no formData se a categoria está marcada
                        const isSelected = formData.categorias.includes(cat);
                        return (
                            <label
                                key={cat}
                                className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${isSelected
                                    ? 'border-pedraum-orange bg-orange-50/50 shadow-sm'
                                    : 'border-gray-100 hover:border-orange-200 bg-white'
                                    }`}
                            >
                                <div className="mt-0.5">
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => toggleCategoria(cat)}
                                        className="w-5 h-5 accent-pedraum-orange cursor-pointer rounded border-gray-300"
                                    />
                                </div>
                                <span className={`text-sm leading-tight ${isSelected ? 'text-pedraum-orange font-bold' : 'text-gray-700 font-medium'}`}>
                                    {cat}
                                </span>
                            </label>
                        );
                    })}
                </div>
            </div>

            {/* 3. Descrição do Item (Input de Tags) */}
            <div className="pt-2">
                <label htmlFor="descricaoItem" className="block text-sm font-bold text-gray-900 mb-2">
                    Descrição Detalhada / Tags
                </label>

                <div className="w-full min-h-[120px] p-4 rounded-lg border border-gray-300 bg-white focus-within:border-pedraum-orange focus-within:ring-2 focus-within:ring-orange-100 transition-all flex flex-wrap gap-2 items-start cursor-text">
                    {formData.descricaoItem.map((tag, index) => (
                        <span
                            key={index}
                            className="bg-pedraum-dark text-white text-sm px-3 py-1.5 rounded-full flex items-center gap-2 animate-in zoom-in duration-200"
                        >
                            {tag}
                            <button
                                type="button"
                                onClick={() => {
                                    const novasTags = formData.descricaoItem.filter((_, i) => i !== index);
                                    updateFormData({ descricaoItem: novasTags });
                                }}
                                className="text-gray-300 hover:text-pedraum-orange transition-colors font-bold"
                            >
                                &times;
                            </button>
                        </span>
                    ))}

                    <input
                        id="descricaoItem"
                        type="text"
                        // Substitua a linha antiga por esta:
                        placeholder={placeholderDinamico}
                        className="flex-1 min-w-37.5 bg-transparent outline-none text-gray-700 placeholder:text-gray-400 py-1" onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                const novaTag = e.currentTarget.value.trim();
                                if (novaTag !== '' && !formData.descricaoItem.includes(novaTag)) {
                                    updateFormData({ descricaoItem: [...formData.descricaoItem, novaTag] });
                                    e.currentTarget.value = '';
                                }
                            }
                        }}
                    />
                </div>
                <div className="text-xs text-gray-400 mt-1 font-medium">
                    Aperte "Enter" após cada especialidade para adicionar.
                </div>
            </div>

            {/* 4. Checkbox de Termos */}
            <div className="flex items-center gap-3 pt-4">
                <input
                    id="termos"
                    type="checkbox"
                    required
                    checked={formData.aceitaTermos}
                    onChange={(e) => updateFormData({ aceitaTermos: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-pedraum-orange focus:ring-pedraum-orange cursor-pointer accent-pedraum-orange"
                />
                <label htmlFor="termos" className="text-sm text-gray-700 cursor-pointer select-none">
                    Aceito os termos e política de privacidade
                </label>
            </div>

            {/* 5. Botões de Ação */}
            <div className="pt-6 flex justify-between items-center border-t border-gray-100 mt-6">
                <button
                    type="button"
                    onClick={onBack}
                    className="text-gray-500 hover:text-pedraum-orange font-medium transition-colors px-4 py-2"
                >
                    &larr; Voltar
                </button>

                <button
                    type="submit"
                    className="bg-pedraum-orange hover:bg-orange-600 text-white font-bold py-3 px-10 rounded-lg transition-colors shadow-md shadow-orange-500/20"
                >
                    Cadastrar
                </button>
            </div>

        </form>
    );
}