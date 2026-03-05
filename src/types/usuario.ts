export type UserRole = "comprador" | "fornecedor" | "admin";

export interface UsuarioModel {
    id: string; // O UID do Firebase Auth
    nome?: string;
    razaoSocial?: string;
    email: string;
    telefone?: string;
    tipo_usuario: UserRole;
    cnpj?: string;
    cpf?: string;
    saldoLeads?: number;
    dataCadastro: string;
}