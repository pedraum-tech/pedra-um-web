"use client";

import { X, Image as ImageIcon, FileText, UploadCloud } from "lucide-react";

interface AnexosDemandaProps {
    imagens: File[];
    setImagens: (imagens: File[]) => void;
    pdf: File | null;
    setPdf: (pdf: File | null) => void;
}

export function AnexosDemanda({ imagens, setImagens, pdf, setPdf }: AnexosDemandaProps) {

    // Função para lidar com a seleção de imagens (Max 5)
    const handleImagensChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const arquivosSelecionados = Array.from(e.target.files);
        const novasImagens = [...imagens];

        for (const arquivo of arquivosSelecionados) {
            // Validações
            if (!arquivo.type.startsWith("image/")) {
                alert(`O arquivo ${arquivo.name} não é uma imagem válida.`);
                continue;
            }
            if (arquivo.size > 5 * 1024 * 1024) {
                alert(`A imagem ${arquivo.name} passa do limite de 5MB.`);
                continue;
            }
            if (novasImagens.length >= 5) {
                alert("Você só pode anexar no máximo 5 imagens.");
                break;
            }
            novasImagens.push(arquivo);
        }

        setImagens(novasImagens);
        // Limpa o input para permitir selecionar o mesmo arquivo se o usuário apagou
        e.target.value = '';
    };

    // Função para remover uma imagem da lista
    const removerImagem = (indexParaRemover: number) => {
        setImagens(imagens.filter((_, index) => index !== indexParaRemover));
    };

    // Função para lidar com a seleção do PDF (Max 1)
    const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const arquivo = e.target.files[0];

        if (arquivo.type !== "application/pdf") {
            return alert("Por favor, selecione um arquivo PDF.");
        }
        if (arquivo.size > 10 * 1024 * 1024) {
            return alert("O PDF deve ter no máximo 10MB.");
        }

        setPdf(arquivo);
        e.target.value = '';
    };

    return (
        <div className="space-y-6">
            <label className="block text-sm font-bold text-gray-800 uppercase tracking-wide">
                Anexos da Solicitação
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* --- ÁREA DE IMAGENS --- */}
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-pedraum-orange transition-colors bg-gray-50/50">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2 text-gray-700 font-medium">
                            <ImageIcon className="w-5 h-5 text-pedraum-orange" />
                            Fotos do Item/Local
                        </div>
                        <span className="text-xs font-bold text-gray-400">
                            {imagens.length}/5
                        </span>
                    </div>

                    {/* Botão de Adicionar Imagem */}
                    {imagens.length < 5 && (
                        <label className="cursor-pointer bg-white border border-gray-200 text-gray-600 hover:bg-orange-50 hover:text-pedraum-orange hover:border-orange-200 transition-all rounded-lg py-3 px-4 flex flex-col items-center justify-center gap-2 mb-4 w-full shadow-sm">
                            <UploadCloud className="w-6 h-6" />
                            <span className="text-sm font-medium">Clique para buscar fotos</span>
                            <span className="text-xs text-gray-400">JPG, PNG (Max 5MB)</span>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImagensChange}
                                className="hidden"
                            />
                        </label>
                    )}

                    {/* Galeria de Miniaturas (Previews) */}
                    {imagens.length > 0 && (
                        <div className="grid grid-cols-3 gap-2">
                            {imagens.map((imagem, index) => (
                                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                                    {/* URL.createObjectURL cria um link temporário para mostrar a foto antes do upload */}
                                    <img
                                        src={URL.createObjectURL(imagem)}
                                        alt={`Preview ${index}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removerImagem(index)}
                                        className="absolute top-1 right-1 bg-black/60 hover:bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* --- ÁREA DE PDF --- */}
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-pedraum-orange transition-colors bg-gray-50/50">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2 text-gray-700 font-medium">
                            <FileText className="w-5 h-5 text-pedraum-orange" />
                            Documento Técnico
                        </div>
                        <span className="text-xs font-bold text-gray-400">
                            {pdf ? "1/1" : "0/1"}
                        </span>
                    </div>

                    {!pdf ? (
                        <label className="cursor-pointer bg-white border border-gray-200 text-gray-600 hover:bg-orange-50 hover:text-pedraum-orange hover:border-orange-200 transition-all rounded-lg py-3 px-4 flex flex-col items-center justify-center gap-2 w-full shadow-sm h-32">
                            <UploadCloud className="w-6 h-6" />
                            <span className="text-sm font-medium">Buscar projeto/edital</span>
                            <span className="text-xs text-gray-400">Apenas PDF (Max 10MB)</span>
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={handlePdfChange}
                                className="hidden"
                            />
                        </label>
                    ) : (
                        <div className="bg-white border border-green-200 rounded-lg p-3 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="bg-green-100 p-2 rounded text-green-700">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div className="truncate">
                                    <p className="text-sm font-bold text-gray-800 truncate">{pdf.name}</p>
                                    <p className="text-xs text-gray-500">{(pdf.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setPdf(null)}
                                className="text-gray-400 hover:text-red-500 p-2 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}