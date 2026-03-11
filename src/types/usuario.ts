// src/types/index.ts (ou src/types/usuario.ts)

export type UserRole = "comprador" | "fornecedor" | "admin";

export interface UsuarioModel {
    id: string; // O UID do Firebase Auth
    email: string;
    role: UserRole;
    dataCadastro: string;

    // Opcionais (Variam entre Comprador/Fornecedor ou podem faltar em testes antigos)
    nome?: string;
    razaoSocial?: string;
    telefone?: string;
    status?: string;
    cnpj?: string;
    cpf?: string;

    // Contadores e Limites
    saldoLeads?: number;
    leadsDesbloqueados?: number;
    demandasCriadas?: number;

    // Específicos do Fornecedor
    uf?: string;
    descricaoCategorias?: string;
    categorias?: any; // No futuro, podemos mudar para string[]
}