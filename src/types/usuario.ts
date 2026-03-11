export type UserRole = "comprador" | "fornecedor" | "admin";

export interface UsuarioModel {
    demandasCriadas: number;
    status: string;
    id: string; // O UID do Firebase Auth
    nome?: string;
    razaoSocial?: string;
    email: string;
    telefone?: string;
    role: UserRole;
    cnpj?: string;
    cpf?: string;
    saldoLeads?: number;
    dataCadastro: string;
}