export interface PropostaModel {
    id: string;
    demandaId: string;
    fornecedorId: string;
    nomeFornecedor: string;
    telefoneFornecedor: string;

    valor?: string;
    prazo?: string;
    mensagem?: string;

    status: "contato_liberado" | "negociacao_em_andamento" | "fechado" | string;
    dataCriacao: string;
}