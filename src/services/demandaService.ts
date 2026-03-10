import { collection, doc, setDoc, updateDoc, increment } from "firebase/firestore"; // <-- Adicionado updateDoc e increment
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/src/lib/firebase";

export interface CriarDemandaProps {
    compradorId: string; // 'visitante' ou o UID do usuário logado
    nomeComprador: string;
    telefoneContato?: string;
    descricao: string;
    urgencia: string;
    termosAceitos?: boolean;
    isGuest: boolean;
    imagens: File[];
    pdf: File | null;
}

export async function criarNovaDemandaCentralizada(data: CriarDemandaProps) {
    // 1. Pré-gerar a referência e o ID
    const novaDemandaRef = doc(collection(db, "demandas"));
    const demandaId = novaDemandaRef.id;

    // 2. Gerar Número de Protocolo
    const protocoloGerado = "PRT-" + Math.floor(100000 + Math.random() * 900000);

    const urlsFotos: string[] = [];
    let urlPdf: string | null = null;

    // Define a pasta base no Storage
    const basePath = data.isGuest
        ? `visitantes/demandas/${demandaId}`
        : `${data.compradorId}/demandas/${demandaId}`;

    // 3. Upload das Imagens em paralelo
    if (data.imagens && data.imagens.length > 0) {
        const uploadPromises = data.imagens.map(async (imagem) => {
            const imageRef = ref(storage, `${basePath}/fotos/${Date.now()}_${imagem.name}`);
            await uploadBytes(imageRef, imagem);
            return await getDownloadURL(imageRef);
        });
        const urlsResolvidas = await Promise.all(uploadPromises);
        urlsFotos.push(...urlsResolvidas);
    }

    // 4. Upload do PDF
    if (data.pdf) {
        const pdfRef = ref(storage, `${basePath}/documentos/${Date.now()}_${data.pdf.name}`);
        await uploadBytes(pdfRef, data.pdf);
        urlPdf = await getDownloadURL(pdfRef);
    }

    // 5. Salvar no Firestore
    const demandaData: any = {
        compradorId: data.compradorId,
        nomeComprador: data.nomeComprador,
        descricao: data.descricao,
        urgencia: data.urgencia,
        status: "curadoria",
        fornecedoresSelecionados: [],
        isGuest: data.isGuest,
        protocolo: protocoloGerado,
        fotos: urlsFotos,
        documentoPdf: urlPdf,
        dataCriacao: new Date().toISOString(),
    };

    if (data.telefoneContato) demandaData.telefoneContato = data.telefoneContato;
    if (data.termosAceitos !== undefined) demandaData.termosAceitos = data.termosAceitos;

    await setDoc(novaDemandaRef, demandaData);

    // ==========================================
    // A MÁGICA: ATUALIZAR CONTADOR DO COMPRADOR
    // ==========================================
    if (!data.isGuest && data.compradorId && data.compradorId !== "visitante") {
        try {
            const userRef = doc(db, "usuarios", data.compradorId);
            await updateDoc(userRef, {
                demandasCriadas: increment(1) // Adiciona +1 ao contador do usuário no banco!
            });
        } catch (error) {
            console.error("Aviso: Falha ao incrementar contador de demandas do usuário:", error);
            // Obs: Colocamos num try/catch para que se der erro nisso, a demanda não deixe de ser criada.
        }
    }
    // ==========================================

    return { demandaId, protocolo: protocoloGerado };
}

export async function processarDemandaPendente(userId: string, nomeUsuario: string) {
    const demandaSalva = sessionStorage.getItem("demandaPendente");

    if (demandaSalva) {
        try {
            await criarNovaDemandaCentralizada({
                compradorId: userId,
                nomeComprador: nomeUsuario,
                descricao: demandaSalva,
                urgencia: "normal",
                isGuest: false,
                imagens: [],
                pdf: null
            });

            sessionStorage.removeItem("demandaPendente");
            return true;
        } catch (error) {
            console.error("Erro ao processar demanda pendente:", error);
            return false;
        }
    }

    return false;
}