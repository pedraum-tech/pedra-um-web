export type StatusDemanda = 'curadoria' | 'aberta' | 'negociacao' | 'resolvida';
export type UrgenciaDemanda = 'normal' | 'urgente' | 'critico';

export interface DemandaModel {
    id: string;
    protocolo: string;
    compradorId: string;
    nomeComprador: string;
    descricao: string;
    urgencia: UrgenciaDemanda | string;
    status: StatusDemanda | string;
    fornecedoresSelecionados: string[];
    isGuest: boolean;
    fotos: string[];
    documentoPdf: string | null;
    dataCriacao: string;

    telefoneContato?: string;
    termosAceitos?: boolean;
    categoria?: string;
    uf?: string;

    dataFechamento?: string;
    motivoFechamento?: 'na_plataforma' | 'fora_plataforma' | 'sem_retorno' | 'sem_match' | string;
}