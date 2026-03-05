import { collection, doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/src/lib/firebase";

// Definimos exatamente o que a função precisa receber para funcionar
export interface CriarDemandaProps {
    compradorId: string; // 'visitante' ou o UID do usuário logado
    nomeComprador: string;
    telefoneContato?: string; // Opcional, pois logado não precisa digitar de novo
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

    // Define a pasta base no Storage dependendo se é visitante ou logado
    const basePath = data.isGuest
        ? `visitantes/demandas/${demandaId}`
        : `${data.compradorId}/demandas/${demandaId}`;

    // 3. Upload das Imagens em paralelo para ser mais rápido
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
        status: "curadoria",               // O novo fluxo!
        fornecedoresSelecionados: [],      // O escudo de invisibilidade!
        isGuest: data.isGuest,
        protocolo: protocoloGerado,        // Logados também terão protocolo agora (Fica mais rastreável!)
        fotos: urlsFotos,
        documentoPdf: urlPdf,
        dataCriacao: new Date().toISOString(),
    };

    // Adiciona condicionalmente os campos exclusivos de visitante
    if (data.telefoneContato) demandaData.telefoneContato = data.telefoneContato;
    if (data.termosAceitos !== undefined) demandaData.termosAceitos = data.termosAceitos;

    await setDoc(novaDemandaRef, demandaData);

    // Retornamos os dados gerados caso a tela precise mostrar (como o protocolo)
    return { demandaId, protocolo: protocoloGerado };
}