"use client";

import { AvatarUploader } from "@/src/components/AvatarUploader";
import { ChangePasswordModal } from "@/src/components/ChangePasswordModal";
import { Header } from "@/src/components/Header";
import { ProtectedRoute } from "@/src/components/ProtectedRoute";
import { CATEGORIAS_PEDRAUM } from "@/src/constants/categorias";
import { ESTADOS_BRASILEIROS } from "@/src/constants/estados";
import { useAuth } from "@/src/contexts/AuthContext";
import { db } from "@/src/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function PerfilFornecedorPage() {
    const { user } = useAuth();
    const [isModalSenhaOpen, setIsModalSenhaOpen] = useState(false);

    // 1. Estados para os campos do formulário
    const [razaoSocial, setRazaoSocial] = useState("");
    const [cnpj, setCnpj] = useState("");
    const [especialidades, setEspecialidades] = useState("");
    const [regiao, setRegiao] = useState("");
    const [categorias, setCategorias] = useState<string[]>([]);
    const [descricaoItem, setDescricaoItem] = useState<string[]>([]);
    const [telefone, setTelefone] = useState("");
    const [email, setEmail] = useState("");
    const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);

    // 2. Estados de controle de interface
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [mensagem, setMensagem] = useState({ texto: "", tipo: "" });

    // 3. Efeito que busca os dados do banco assim que a página abre
    useEffect(() => {
        async function carregarDados() {
            if (user?.uid) {
                try {
                    const docRef = doc(db, "usuarios", user.uid);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const dados = docSnap.data();

                        setRazaoSocial(dados.razaoSocial || "");
                        setCnpj(dados.cnpj || "");
                        setEspecialidades(dados.especialidades || "");
                        setRegiao(dados.regiao || "");
                        setCategorias(dados.categorias || []);
                        setDescricaoItem(dados.descricaoItem || []);
                        setTelefone(dados.telefone || "");
                        setEmail(dados.email || "");
                        setFotoPerfil(dados.fotoPerfil || null); // Adicionado para puxar a foto
                    }
                } catch (error) {
                    console.error("Erro ao buscar perfil:", error);
                    setMensagem({ texto: "Erro ao carregar seus dados.", tipo: "erro" });
                } finally {
                    setCarregando(false);
                }
            }
        }

        carregarDados();
    }, [user]);

    // 4. Função que salva as alterações
    const handleSalvar = async (e: React.FormEvent) => {
        e.preventDefault();
        setMensagem({ texto: "", tipo: "" });
        setSalvando(true);

        try {
            if (user?.uid) {
                const docRef = doc(db, "usuarios", user.uid);
                await updateDoc(docRef, {
                    razaoSocial: razaoSocial,
                    cnpj: cnpj,
                    especialidades: especialidades,
                    regiao: regiao,
                    categorias: categorias,
                    descricaoItem: descricaoItem,
                    telefone: telefone
                });

                setMensagem({ texto: "Perfil atualizado com sucesso!", tipo: "sucesso" });
            }
        } catch (error) {
            console.error("Erro ao atualizar:", error);
            setMensagem({ texto: "Erro ao salvar as alterações.", tipo: "erro" });
        } finally {
            setSalvando(false);
        }
    };

    return (
        <ProtectedRoute allowedRoles={["fornecedor"]}>
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Header variant="supplier" />

                <main className="flex-1 max-w-4xl w-full mx-auto p-4 py-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6 px-2">
                        Meu Perfil
                    </h1>

                    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] p-8 md:p-12">
                        {carregando ? (
                            <div className="flex justify-center items-center h-40">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pedraum-orange"></div>
                            </div>
                        ) : (
                            <form onSubmit={handleSalvar} className="space-y-6">

                                {mensagem.texto && (
                                    <div className={`p-4 rounded-lg text-sm font-medium ${mensagem.tipo === "sucesso" ? "bg-green-50 text-green-700 border-l-4 border-green-500" : "bg-red-50 text-red-700 border-l-4 border-red-500"
                                        }`}>
                                        {mensagem.texto}
                                    </div>
                                )}

                                {/* Foto de Perfil */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-4">
                                        Foto de Perfil
                                    </label>

                                    {user?.uid && (
                                        <AvatarUploader
                                            uid={user.uid}
                                            fotoAtual={fotoPerfil}
                                            nomeUsuario={razaoSocial}
                                            onUploadSuccess={(novaUrl) => setFotoPerfil(novaUrl)}
                                        />
                                    )}
                                </div>

                                {/* Nome */}
                                <div>
                                    <label htmlFor="nome" className="block text-sm font-bold text-gray-900 mb-2">
                                        Nome/Razão Social
                                    </label>
                                    <input
                                        id="nome"
                                        type="text"
                                        required
                                        value={razaoSocial}
                                        onChange={(e) => setRazaoSocial(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pedraum-orange focus:ring-2 focus:ring-orange-100 outline-none transition-all bg-white text-gray-700"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-2">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        disabled
                                        value={email}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 focus:border-pedraum-orange focus:ring-2 focus:ring-orange-100 outline-none transition-all text-gray-500 cursor-not-allowed"
                                    />
                                </div>

                                {/* Telefone/Whatsapp */}
                                <div>
                                    <label htmlFor="telefone" className="block text-sm font-bold text-gray-900 mb-2">
                                        Telefone/Whatsapp
                                    </label>
                                    <input
                                        id="telefone"
                                        type="tel"
                                        required
                                        value={telefone}
                                        onChange={(e) => setTelefone(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pedraum-orange focus:ring-2 focus:ring-orange-100 outline-none transition-all bg-white text-gray-700"
                                    />
                                </div>

                                {/* CNPJ/CPF */}
                                <div>
                                    <label htmlFor="cnpj" className="block text-sm font-bold text-gray-900 mb-2">
                                        CNPJ/CPF
                                    </label>
                                    <input
                                        id="cnpj"
                                        type="text"
                                        required
                                        value={cnpj}
                                        onChange={(e) => setCnpj(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pedraum-orange focus:ring-2 focus:ring-orange-100 outline-none transition-all bg-white text-gray-700"
                                    />
                                </div>


                                {/* Área de Atuação (Conectado a regiao) */}
                                <div>
                                    <label htmlFor="areaAtuacao" className="block text-sm font-bold text-gray-900 mb-2">
                                        Área de atuação
                                    </label>
                                    <select
                                        id="regiao"
                                        value={regiao}
                                        onChange={(e) => setRegiao(e.target.value)}
                                        className="w-full  px-4 py-3 rounded-lg border border-gray-300 focus:border-pedraum-orange focus:ring-2 focus:ring-orange-100 outline-none transition-all bg-white text-gray-700 appearance-none cursor-pointer"
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
                                {/* Categorias (Múltipla Escolha com Limite) */}
                                <div>
                                    <div className="flex justify-between items-end mb-3">
                                        <label className="block text-sm font-bold text-gray-900">
                                            Categorias de Atuação
                                        </label>
                                        <span className={`text-xs font-bold ${categorias.length >= 3 ? 'text-pedraum-orange' : 'text-gray-500'}`}>
                                            Selecionadas: {categorias.length}/3
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                        {CATEGORIAS_PEDRAUM.map((cat) => {
                                            const isSelecionado = categorias.includes(cat.valor);
                                            const bloqueadoPeloLimite = categorias.length >= 3 && !isSelecionado;

                                            return (
                                                <label
                                                    key={cat.valor}
                                                    className={`flex items-center p-3 rounded-lg border transition-all
                                                        ${isSelecionado
                                                            ? 'border-pedraum-orange bg-orange-50/50 shadow-sm cursor-pointer'
                                                            : bloqueadoPeloLimite
                                                                ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                                                                : 'border-gray-200 hover:border-pedraum-orange/50 hover:bg-gray-50 cursor-pointer'
                                                        }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        value={cat.valor}
                                                        checked={isSelecionado}
                                                        disabled={bloqueadoPeloLimite}
                                                        onChange={() => {
                                                            if (isSelecionado) {
                                                                setCategorias(categorias.filter(item => item !== cat.valor));
                                                            } else if (categorias.length < 3) {
                                                                setCategorias([...categorias, cat.valor]);
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
                                    {categorias.length >= 3 && (
                                        <p className="text-pedraum-orange text-xs font-medium mt-2 animate-in fade-in">
                                            Você atingiu o limite máximo de 3 categorias. Desmarque uma para selecionar outra.
                                        </p>
                                    )}
                                </div>

                                {/* Descrição do Item (Input de Tags) */}
                                <div className="pt-2">
                                    <label htmlFor="descricaoItem" className="block text-sm font-bold text-gray-900 mb-2">
                                        Descrição (Tags)
                                    </label>

                                    <div className="w-full min-h-30 p-4 rounded-lg border border-gray-300 bg-white focus-within:border-pedraum-orange focus-within:ring-2 focus-within:ring-orange-100 transition-all flex flex-wrap gap-2 items-start cursor-text">
                                        {descricaoItem.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="bg-pedraum-dark text-white text-sm px-3 py-1.5 rounded-full flex items-center gap-2 animate-in zoom-in duration-200"
                                            >
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() => setDescricaoItem(descricaoItem.filter((_, i) => i !== index))}
                                                    className="text-gray-300 hover:text-pedraum-orange transition-colors font-bold"
                                                >
                                                    &times;
                                                </button>
                                            </span>
                                        ))}

                                        <input
                                            id="descricaoItem"
                                            type="text"
                                            placeholder={descricaoItem.length === 0 ? "Ex: Britagem (Aperte Enter)" : "Adicionar outra..."}
                                            className="flex-1 min-w-[150px] bg-transparent outline-none text-gray-700 placeholder:text-gray-400 py-1"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    const novaTag = e.currentTarget.value.trim();

                                                    if (novaTag !== '' && !descricaoItem.includes(novaTag)) {
                                                        setDescricaoItem([...descricaoItem, novaTag]);
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

                                {/* Botão de Alterar Senha (Com evento onClick) */}
                                <div className="pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalSenhaOpen(true)}
                                        className="px-6 py-3 rounded-lg border border-pedraum-orange text-sm font-medium text-gray-800 hover:bg-orange-50 transition-colors"
                                    >
                                        Alterar a Senha
                                    </button>
                                </div>

                                {/* Botão Salvar Centralizado (Com estado de carregamento) */}
                                <div className="pt-4 flex justify-center">
                                    <button
                                        type="submit"
                                        disabled={salvando}
                                        className="bg-pedraum-orange hover:bg-orange-600 text-white font-bold py-3 px-14 rounded-lg transition-colors shadow-md shadow-orange-500/20 text-lg disabled:opacity-70"
                                    >
                                        {salvando ? "Salvando..." : "Salvar"}
                                    </button>
                                </div>

                            </form>
                        )}
                    </div>
                </main>
                <ChangePasswordModal
                    isOpen={isModalSenhaOpen}
                    onClose={() => setIsModalSenhaOpen(false)}
                />
            </div>
        </ProtectedRoute>
    );
}