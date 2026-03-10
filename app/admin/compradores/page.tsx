// app/admin/compradores/page.tsx
"use client";

import { FiltroUsuariosAdmin } from "@/src/components/admin/FiltroUsuariosAdmin";
import { AdminCompradorCard } from "@/src/components/admin/AdminCompradorCard";

export default function AdminCompradoresPage() {
    return (
        <FiltroUsuariosAdmin
            titulo="Admin Compradores"
            roleFiltro="comprador"
            CardComponent={AdminCompradorCard}
        />
    );
}