// src/types/demanda.ts

// Define exatamente o formato que a nossa demanda tem no banco de dados
export interface DemandaModel {
    id: string;
    compradorId: string;
    nomeComprador: string;
    descricao: string;
    urgencia: 'normal' | 'urgente' | 'critico' | string;
    status: 'curadoria' | 'aberta' | 'negociacao' | 'resolvida' | string;
    fornecedoresSelecionados: string[];
    isGuest: boolean;
    protocolo: string;
    fotos: string[];
    documentoPdf: string | null;
    dataCriacao: string;

    // Campos opcionais que podem ser preenchidos depois
    telefoneContato?: string;
    termosAceitos?: boolean;
    categoria?: string;
    uf?: string;
    dataFechamento?: string;
    motivoFechamento?: 'na_plataforma' | 'fora_plataforma' | 'sem_retorno' | 'sem_match' | string;
}