"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Loader2, Save } from "lucide-react";
import { doc, getDoc, updateDoc, collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { UsuarioModel, DemandaModel } from "@/src/types";

export default function EditarCompradorAdminPage() {
    const params = useParams();
    const router = useRouter();
    const compradorId = params.id as string;

    const [usuario, setUsuario] = useState<UsuarioModel | null>(null);
    const [demandas, setDemandas] = useState<DemandaModel[]>([]);

    // Estados de Loading e Salvamento
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);

    // Estados do Formulário
    const [nomeEdit, setNomeEdit] = useState("");
    const [emailEdit, setEmailEdit] = useState("");
    const [telefoneEdit, setTelefoneEdit] = useState("");
    const [statusEdit, setStatusEdit] = useState("");
    const [roleEdit, setRoleEdit] = useState("");

    useEffect(() => {
        async function buscarDados() {
            if (!compradorId) return;

            try {
                // 1. Busca os Dados do Comprador
                const userRef = doc(db, "usuarios", compradorId);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const userData = { id: userSnap.id, ...userSnap.data() } as UsuarioModel;
                    setUsuario(userData);

                    // Preenche os inputs com os dados do banco
                    setNomeEdit(userData.nome || userData.razaoSocial || "");
                    setEmailEdit(userData.email || "");
                    setTelefoneEdit(userData.telefone || "");
                    setStatusEdit(userData.status || "ativo");
                    setRoleEdit(userData.role || "comprador");
                } else {
                    alert("Comprador não encontrado!");
                    router.push("/admin/compradores");
                    return;
                }

                // 2. Busca as Demandas que este Comprador criou
                const demandasQuery = query(
                    collection(db, "demandas"),
                    where("compradorId", "==", compradorId),
                    orderBy("dataCriacao", "desc"), // Traz as mais novas primeiro
                    limit(5) // Protege o seu Firebase e o layout!
                );
                const demandasSnap = await getDocs(demandasQuery);
                const listaDemandas = demandasSnap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as DemandaModel[];

                setDemandas(listaDemandas);

            } catch (error) {
                console.error("Erro ao buscar dados do comprador:", error);
            } finally {
                setCarregando(false);
            }
        }

        buscarDados();
    }, [compradorId, router]);

    const handleSalvar = async () => {
        if (!usuario) return;
        setSalvando(true);

        try {
            const userRef = doc(db, "usuarios", usuario.id);
            await updateDoc(userRef, {
                nome: nomeEdit,
                email: emailEdit,
                telefone: telefoneEdit,
                status: statusEdit,
                role: roleEdit
            });

            alert("Dados do comprador atualizados com sucesso!");
        } catch (error) {
            console.error("Erro ao salvar alterações:", error);
            alert("Erro ao salvar. Tente novamente.");
        } finally {
            setSalvando(false);
        }
    };

    if (carregando) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <Loader2 className="w-12 h-12 text-pedraum-orange animate-spin" />
            </div>
        );
    }

    if (!usuario) return null; // Tratado no useEffect

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 flex flex-col gap-6 max-w-5xl mx-auto">

            {/* Cabeçalho */}
            <div className="flex items-center justify-between mb-4 relative">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-pedraum-orange hover:text-orange-600 font-medium transition-colors z-10"
                >
                    <ChevronLeft className="w-5 h-5" />
                    Voltar
                </button>
                <h1 className="text-3xl font-bold text-gray-900 absolute left-1/2 -translate-x-1/2 w-full text-center pointer-events-none">
                    Editar Comprador
                </h1>
            </div>

            {/* --- SEÇÃO 1: DADOS DO COMPRADOR --- */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

                {/* Status e Tipo de Usuário */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <select
                            value={statusEdit}
                            onChange={(e) => setStatusEdit(e.target.value)}
                            className={`text-white text-xs font-bold px-4 py-1.5 rounded-full outline-none cursor-pointer border-r-8 border-transparent appearance-none ${statusEdit === 'ativo' ? 'bg-[#00C853]' : 'bg-red-500'}`}
                        >
                            <option value="ativo">Status: Ativo</option>
                            <option value="inativo">Status: Inativo</option>
                            <option value="bloqueado">Status: Bloqueado</option>
                        </select>
                    </div>
                    <div className="w-48">
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                            Tipo de usuário
                        </label>
                        <select
                            value={roleEdit}
                            onChange={(e) => setRoleEdit(e.target.value)}
                            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:border-pedraum-orange outline-none bg-white text-gray-700 text-sm cursor-pointer"
                        >
                            <option value="comprador">Comprador</option>
                            <option value="fornecedor">Fornecedor</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                </div>

                {/* Formulário */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Foto de Perfil</label>
                        <button type="button" className="px-4 py-2 rounded-lg border border-pedraum-orange text-sm font-medium text-gray-800 hover:bg-orange-50 transition-colors bg-white">
                            Selecionar Imagem
                        </button>
                        <span className="text-xs text-gray-400 ml-3">Funcionalidade de upload em breve</span>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Nome</label>
                        <input
                            type="text"
                            value={nomeEdit}
                            onChange={(e) => setNomeEdit(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pedraum-orange outline-none transition-all text-gray-700"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Email</label>
                        <input
                            type="email"
                            value={emailEdit}
                            onChange={(e) => setEmailEdit(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pedraum-orange outline-none transition-all text-gray-700"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Telefone/Whatsapp</label>
                        <input
                            type="tel"
                            value={telefoneEdit}
                            onChange={(e) => setTelefoneEdit(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pedraum-orange outline-none transition-all text-gray-700"
                        />
                    </div>

                    <div className="pt-2">
                        <button type="button" className="px-4 py-2 rounded-lg border border-pedraum-orange text-sm font-medium text-gray-800 hover:bg-orange-50 transition-colors bg-white">
                            Alterar a Senha
                        </button>
                    </div>
                </div>
            </div>

            {/* --- SEÇÃO 2: DEMANDAS INSCRITAS --- */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    Demandas Inscritas
                    {/* AQUI ENTRA A SUA IDEIA BRILHANTE */}
                    <span className="bg-pedraum-orange text-gray-900 text-sm font-black py-1 px-3 rounded-full shadow-sm">
                        {usuario.demandasCriadas || demandas.length} Total
                    </span>
                </h2>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="py-4 px-4 font-normal text-gray-600">Demanda</th>
                                <th className="py-4 px-4 font-normal text-gray-600">Status</th>
                                <th className="py-4 px-4 font-normal text-gray-600 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {demandas.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="py-8 text-center text-gray-500 font-medium">
                                        Este usuário ainda não criou nenhuma demanda.
                                    </td>
                                </tr>
                            ) : (
                                demandas.map((demanda) => (
                                    <tr key={demanda.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-4 font-medium text-gray-900">
                                            {/* Usa o protocolo se existir, ou pega um pedaço da descrição */}
                                            {demanda.protocolo || (demanda.descricao?.substring(0, 30) + '...')}
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${demanda.status === 'aberta' ? 'bg-blue-100 text-blue-700' :
                                                demanda.status === 'curadoria' ? 'bg-purple-100 text-purple-700' :
                                                    'bg-green-100 text-green-700'
                                                }`}>
                                                {demanda.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <Link href={`/admin/demandas/${demanda.id}`}>
                                                <button className="border border-pedraum-orange text-pedraum-orange hover:bg-orange-50 font-bold text-xs py-1.5 px-3 rounded transition-colors bg-white">
                                                    Ver Demanda
                                                </button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- BOTÃO SALVAR --- */}
            <div className="flex justify-end mt-2 mb-8">
                <button
                    onClick={handleSalvar}
                    disabled={salvando}
                    className="bg-pedraum-orange hover:bg-orange-600 text-gray-900 font-bold py-3 px-10 rounded-lg shadow-md transition-colors text-lg flex items-center gap-2 disabled:opacity-70"
                >
                    {salvando ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {salvando ? "Salvando..." : "Salvar Alterações"}
                </button>
            </div>

        </div>
    );
}