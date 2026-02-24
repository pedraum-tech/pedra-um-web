import { AdminSidebar } from "@/src/components/AdminSidebar";


export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* A Sidebar fica fixa na esquerda */}
            <AdminSidebar />

            <div className="flex-1 ml-64 flex flex-col"> {/* flex-col para empilhar conteúdo e footer */}
                <main className="flex-1 p-8">
                    {children}
                </main>

                {/* Rodapé exclusivo do Admin (Opcional) */}
                <footer className="p-6 text-center text-gray-400 text-sm border-t border-gray-200">
                    © 2026 PedraUm. Todos os direitos reservados.
                </footer>
            </div>
        </div>
    );
}