// app/admin/fornecedor/page.tsx
"use client";

import { FiltroUsuariosAdmin } from "@/src/components/admin/FiltroUsuariosAdmin";
import { AdminFornecedorCard } from "@/src/components/admin/AdminFornecedorCard";

export default function AdminFornecedoresPage() {
    return (
        <FiltroUsuariosAdmin
            titulo="Admin Fornecedores"
            roleFiltro="fornecedor"
            CardComponent={AdminFornecedorCard}
        />
    );
}