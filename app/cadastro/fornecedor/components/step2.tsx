import { CATEGORIAS_PEDRAUM } from "@/src/constants/categorias";
import { FornecedorFormData } from "../page";

interface Step2Props {
    formData: FornecedorFormData;
    updateFormData: (data: Partial<FornecedorFormData>) => void;
    onBack: () => void;
    onSubmit: () => void;
}

export function Step2({ formData, updateFormData, onBack, onSubmit }: Readonly<Step2Props>) {

    // Função para finalizar o cadastro
    const handleFinalSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Verificação de segurança extra para os termos
        if (!formData.aceitaTermos) {
            alert("Por favor, aceite os termos e políticas para continuar.");
            return;
        }

        onSubmit();
    };

    return (
        // Coloquei uma animação leve para ele deslizar da direita, dando sensação de avanço
        <form onSubmit={handleFinalSubmit} className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-500">

            {/* 1. Cabeçalho do Card */}
            <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-3">
                    <h1 className="text-2xl font-medium text-gray-900">Inventário Destacado</h1>
                    <span className="text-2xl text-gray-300 font-light">|</span>
                    <span className="text-xl text-gray-500 font-normal">Passo 2 de 2</span>
                </div>
                {/* Barra de progresso preenchida */}
                <div className="h-0.75 w-full bg-pedraum-dark rounded-full"></div>
            </div>

            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-4">
                Detalhes do Item
            </h2>

            {/* 2. Categorias (Múltipla Escolha com Limite) */}
            <div>
                <div className="flex justify-between items-end mb-3">
                    <label className="block text-sm font-bold text-gray-900">
                        Categorias de Atuação*
                    </label>
                    {/* Contador visual de limite */}
                    <span className={`text-xs font-bold ${formData.categorias.length >= 3 ? 'text-pedraum-orange' : 'text-gray-500'}`}>
                        Selecionadas: {formData.categorias.length}/3
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {CATEGORIAS_PEDRAUM.map((cat) => {
                        const isSelecionado = formData.categorias.includes(cat.valor);
                        // 👇 A grande sacada: verifica se bateu o limite E se a caixa atual NÃO está selecionada
                        const bloqueadoPeloLimite = formData.categorias.length >= 3 && !isSelecionado;

                        return (
                            <label
                                key={cat.valor}
                                className={`flex items-center p-3 rounded-lg border transition-all
                        ${isSelecionado
                                        ? 'border-pedraum-orange bg-orange-50/50 shadow-sm cursor-pointer'
                                        : bloqueadoPeloLimite
                                            ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed' // Visual de bloqueado
                                            : 'border-gray-200 hover:border-pedraum-orange/50 hover:bg-gray-50 cursor-pointer'
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    value={cat.valor}
                                    checked={isSelecionado}
                                    disabled={bloqueadoPeloLimite} // Impede o clique no HTML
                                    onChange={() => {
                                        if (isSelecionado) {
                                            // Se já tava marcado, sempre pode desmarcar
                                            updateFormData({
                                                categorias: formData.categorias.filter(item => item !== cat.valor)
                                            });
                                        } else if (formData.categorias.length < 3) {
                                            // Se não tava marcado, só adiciona se tiver menos de 3
                                            updateFormData({
                                                categorias: [...formData.categorias, cat.valor]
                                            });
                                        }
                                    }}
                                    className={`w-4 h-4 rounded focus:ring-2 
                            ${bloqueadoPeloLimite
                                            ? 'border-gray-200 bg-gray-100 text-gray-400'
                                            : 'text-pedraum-orange border-gray-300 focus:ring-pedraum-orange'}`}
                                />
                                <span className={`ml-3 text-sm font-medium 
                        ${isSelecionado ? 'text-pedraum-orange' : bloqueadoPeloLimite ? 'text-gray-400' : 'text-gray-700'}`}>
                                    {cat.label}
                                </span>
                            </label>
                        );
                    })}
                </div>
                {/* Mensagem de aviso sutil caso bata o limite */}
                {formData.categorias.length >= 3 && (
                    <p className="text-pedraum-orange text-xs font-medium mt-2 animate-in fade-in">
                        Você atingiu o limite máximo de 3 categorias. Desmarque uma para selecionar outra.
                    </p>
                )}
            </div>

            {/* 3. Descrição do Item (Agora como Input de Tags) */}
            <div className="pt-2">
                <label htmlFor="descricaoItem" className="block text-sm font-bold text-gray-900 mb-2">
                    Descrição
                </label>

                {/* Caixa que engloba as tags e o input */}
                <div className="w-full min-h-[120px] p-4 rounded-lg border border-gray-300 bg-white focus-within:border-pedraum-orange focus-within:ring-2 focus-within:ring-orange-100 transition-all flex flex-wrap gap-2 items-start cursor-text">

                    {/* Renderiza as tags que já foram adicionadas */}
                    {/* NOTA: Para isso funcionar perfeito, mude a interface lá no page.tsx 
              para: descricaoItem: string[] e o estado inicial para [] */}
                    {formData.descricaoItem.map((tag, index) => (
                        <span
                            key={index}
                            className="bg-pedraum-dark text-white text-sm px-3 py-1.5 rounded-full flex items-center gap-2 animate-in zoom-in duration-200"
                        >
                            {tag}
                            <button
                                type="button"
                                // Função para remover a tag quando clica no X
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

                    {/* O Input invisível onde o usuário digita */}
                    <input
                        id="descricaoItem"
                        type="text"
                        placeholder={formData.descricaoItem.length === 0 ? "Ex: Britagem (Aperte Enter)" : "Adicionar outra..."}
                        className="flex-1 min-w-[150px] bg-transparent outline-none text-gray-700 placeholder:text-gray-400 py-1"
                        onKeyDown={(e) => {
                            // Quando aperta Enter, previne o envio do formulário e cria a tag
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                const novaTag = e.currentTarget.value.trim();

                                // Só adiciona se tiver texto e se a tag já não existir
                                if (novaTag !== '' && !formData.descricaoItem.includes(novaTag)) {
                                    updateFormData({ descricaoItem: [...formData.descricaoItem, novaTag] });
                                    e.currentTarget.value = ''; // Limpa o input
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

            {/* 5. Botões de Ação (Voltar e Cadastrar) */}
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