import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FornecedorFormData } from "../page";
import { formatCpfCnpj, isValidCnpj, isValidCpf } from "@/src/utils/documentos";
import { ESTADOS_BRASILEIROS } from "@/src/constants/estados";
import { formatTelefone } from "@/src/utils/formatters";

// Tipamos as propriedades que o Pai (page.tsx) está enviando para cá
interface Step1Props {
    formData: FornecedorFormData;
    updateFormData: (data: Partial<FornecedorFormData>) => void;
    onNext: () => void;
}

export function Step1({ formData, updateFormData, onNext }: Readonly<Step1Props>) {
    // Estado para dar feedback visual enquanto busca os dados
    const [buscandoCnpj, setBuscandoCnpj] = useState(false);
    const [docError, setDocError] = useState(""); // Novo estado para mostrar erro no input
    const [mostrarSenha, setMostrarSenha] = useState(false);

    const handleDocumentChange = async (valorDigitado: string) => {
        // 1. Aplica a máscara e atualiza o estado global
        const valorFormatado = formatCpfCnpj(valorDigitado);
        updateFormData({ cnpj: valorFormatado });
        setDocError(""); // Limpa o erro ao voltar a digitar

        const numeros = valorFormatado.replace(/\D/g, '');

        // 2. Valida CPF
        if (numeros.length === 11) {
            if (!isValidCpf(numeros)) {
                setDocError("CPF inválido.");
            }
        }
        // 3. Valida CNPJ e busca na Receita
        else if (numeros.length === 14) {
            if (!isValidCnpj(numeros)) {
                setDocError("CNPJ inválido.");
            } else {
                // Se for um CNPJ válido, busca os dados da empresa!
                setBuscandoCnpj(true);
                try {
                    const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${numeros}`);
                    if (response.ok) {
                        const dados = await response.json();
                        updateFormData({ razaoSocial: dados.razao_social });
                    }
                } catch (error) {
                    console.error("Erro na busca de CNPJ", error);
                } finally {
                    setBuscandoCnpj(false);
                }
            }
        }
    };

    const handleContinue = (e: React.FormEvent) => {
        e.preventDefault();

        // Barreira de segurança: Não deixa avançar se o documento estiver inválido
        if (docError) {
            alert("Por favor, corrija os erros no formulário antes de continuar.");
            return;
        }

        const numeros = formData.cnpj.replace(/\D/g, '');
        if (numeros.length !== 11 && numeros.length !== 14) {
            setDocError("Digite um CPF (11) ou CNPJ (14) completo.");
            return;
        }

        onNext();
    };

    return (
        <form onSubmit={handleContinue} className="space-y-6 animate-in fade-in duration-500">

            {/* 1. Cabeçalho do Card */}
            <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-3">
                    <h1 className="text-2xl font-medium text-gray-900">Cadastro de Fornecedor</h1>
                    <span className="text-2xl text-gray-300 font-light">|</span>
                    <span className="text-xl text-gray-500 font-normal">Passo 1 de 2</span>
                </div>
                <div className="h-0.5 w-full bg-gray-200"></div>
            </div>

            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-4">
                Dados da Empresa
            </h2>

            {/* 2. Grid de Inputs (2 colunas) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* INPUT DE CPF/CNPJ (Com máscara e Validação) */}
                <div>
                    <label htmlFor="cnpj" className="block text-sm font-bold text-gray-900 mb-2">
                        CNPJ/CPF* {buscandoCnpj && <span className="text-pedraum-orange text-xs font-normal ml-2 animate-pulse">Buscando na Receita...</span>}
                    </label>
                    <input
                        id="cnpj"
                        type="text"
                        required
                        maxLength={18} // Trava o tamanho máximo formatado "00.000.000/0001-00"
                        value={formData.cnpj}
                        onChange={(e) => handleDocumentChange(e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border outline-none transition-all bg-white text-gray-700
              ${docError
                                ? 'border-red-500 focus:ring-2 focus:ring-red-100 bg-red-50/50'
                                : 'border-gray-300 focus:border-pedraum-orange focus:ring-2 focus:ring-orange-100'}`}
                        placeholder="000.000.000-00 ou 00.000.000/0001-00"
                    />
                    {/* Mensagem de Erro Vermelha embaixado do input */}
                    {docError && <p className="text-red-500 text-xs font-bold mt-1">{docError}</p>}
                </div>

                {/* INPUT DE RAZÃO SOCIAL (Se preenche sozinho no CNPJ) */}
                <div>
                    <label htmlFor="razaoSocial" className="block text-sm font-bold text-gray-900 mb-2">
                        Nome/Razão Social*
                    </label>
                    <input
                        id="razaoSocial"
                        type="text"
                        required
                        value={formData.razaoSocial}
                        onChange={(e) => updateFormData({ razaoSocial: e.target.value })}
                        className={`w-full px-4 py-3 rounded-lg border focus:ring-2 outline-none transition-all bg-white text-gray-700
              ${buscandoCnpj ? 'border-pedraum-orange/50 bg-orange-50/30' : 'border-gray-300 focus:border-pedraum-orange focus:ring-orange-100'}`}
                    />
                </div>

                {/* INPUT DE EMAIL */}
                <div>
                    <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-2">
                        Email corporativo*
                    </label>
                    <input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => updateFormData({ email: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pedraum-orange focus:ring-2 focus:ring-orange-100 outline-none transition-all bg-white text-gray-700"
                    />
                </div>

                {/* INPUT DE TELEFONE */}
                <div>
                    <label htmlFor="telefone" className="block text-sm font-bold text-gray-900 mb-2">
                        Telefone / WhatsApp*
                    </label>
                    <input
                        id="telefone"
                        type="text"
                        required
                        placeholder="(00) 00000-0000"
                        value={formData.telefone}
                        // Olha como ficou lindo e semântico:
                        onChange={(e) => updateFormData({ telefone: formatTelefone(e.target.value) })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pedraum-orange focus:ring-2 focus:ring-orange-100 outline-none transition-all bg-white text-gray-700"
                    />
                </div>

                {/* INPUT DE SENHA (Ocupando a linha inteira para ficar elegante) */}
                <div className="md:col-span-2">
                    <label htmlFor="senha" className="block text-sm font-bold text-gray-900 mb-2">Crie uma Senha*</label>
                    <div className="relative">
                        <input
                            id="senha"
                            type={mostrarSenha ? "text" : "password"}
                            required
                            value={formData.senha}
                            onChange={(e) => updateFormData({ senha: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pedraum-orange focus:ring-2 focus:ring-orange-100 outline-none transition-all bg-white text-gray-700 pr-12"
                        />
                        <button
                            type="button"
                            onClick={() => setMostrarSenha(!mostrarSenha)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-pedraum-orange transition-colors"
                        >
                            {mostrarSenha ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

            </div>

            {/* --- ESPECIALIDADES (Texto Livre) --- */}
            <div className="pt-2">
                <label htmlFor="especialidades" className="block text-sm font-medium text-gray-900 mb-2">
                    Visão Geral das Especialidades
                </label>
                <textarea
                    id="especialidades"
                    maxLength={500}
                    value={formData.especialidades}
                    onChange={(e) => updateFormData({ especialidades: e.target.value })}
                    placeholder="Conte um pouco sobre a empresa e suas principais áreas de atuação..."
                    className="w-full min-h-30 p-4 rounded-lg border border-gray-300 focus:border-pedraum-orange focus:ring-2 focus:ring-orange-100 outline-none transition-all resize-y text-gray-700"
                ></textarea>
            </div>

            {/* 4. Regiões de Atuação (Select) */}
            <div>
                <label htmlFor="regiao" className="block text-sm font-medium text-gray-900 mb-2">
                    Regiões de Atuação
                </label>
                <select
                    id="regiao"
                    value={formData.regiao}
                    onChange={(e) => updateFormData({ regiao: e.target.value })}
                    className="w-full md:w-1/2 px-4 py-3 rounded-lg border border-gray-300 focus:border-pedraum-orange focus:ring-2 focus:ring-orange-100 outline-none transition-all bg-white text-gray-700 appearance-none cursor-pointer"
                >
                    <option value="" disabled>Selecione o estado...</option>

                    {/* O React faz um loop automático criando uma tag <option> para cada estado! */}
                    {ESTADOS_BRASILEIROS.map((estado) => (
                        <option key={estado.sigla} value={estado.sigla}>
                            {estado.nome}
                        </option>
                    ))}

                </select>
            </div>

            {/* 5. Botão de Ação */}
            <div className="pt-4 flex justify-end">
                <button
                    type="submit"
                    className="bg-pedraum-orange hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-md shadow-orange-500/20"
                >
                    Continuar
                </button>
            </div>

        </form>
    );
}