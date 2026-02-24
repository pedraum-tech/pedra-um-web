import { AdminCard } from "@/src/components/AdminCard";


export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-gray-50/50 p-8">

            {/* 1. Título do Dashboard */}
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-pedraum-dark">
                    Resumo da Semana (últimos 7 dias)
                </h1>
            </div>

            {/* 2. Cards de Métricas (Topo) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                {/* Card 1 */}
                <div className="bg-[#D9D9D9] p-6 rounded-lg text-center shadow-sm">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Demandas Novas</h3>
                    <p className="text-4xl font-normal text-gray-900">12</p>
                </div>

                {/* Card 2 */}
                <div className="bg-[#D9D9D9] p-6 rounded-lg text-center shadow-sm">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Matchs</h3>
                    <p className="text-4xl font-normal text-gray-900">8</p>
                </div>

                {/* Card 3 */}
                <div className="bg-[#D9D9D9] p-6 rounded-lg text-center shadow-sm">
                    <h3 className="text-lg font-medium text-gray-800 leading-tight mb-2">
                        Fornecedores <br /> Online
                    </h3>
                    <p className="text-4xl font-normal text-gray-900">24</p>
                </div>

                {/* Card 4 */}
                <div className="bg-[#D9D9D9] p-6 rounded-lg text-center shadow-sm">
                    <h3 className="text-lg font-medium text-gray-800 leading-tight mb-2">
                        Taxa de <br /> Conversão
                    </h3>
                    <p className="text-4xl font-normal text-gray-900">42%</p>
                </div>
            </div>

            {/* 3. O Kanban (Grid Principal) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start h-full">

                {/* Coluna 1: Em Análise */}
                <div className="flex flex-col gap-4">
                    <h2 className="text-xl font-bold text-black mb-2">Em Análise</h2>
                    <AdminCard
                        id="#203"
                        data="09/02"
                        titulo="Brita 20mm p/ Concretagem"
                        cliente="Construtora Real"
                        uf="UF"
                        urgencia="Normal"
                        status="curadoria"
                    />
                </div>

                {/* Coluna 2: Novas */}
                <div className="flex flex-col gap-4">
                    <h2 className="text-xl font-bold text-black mb-2">Novas</h2>
                    <AdminCard
                        id="#203"
                        data="09/02"
                        titulo="Brita 20mm p/ Concretagem"
                        cliente="Construtora Real"
                        uf="UF"
                        urgencia="Normal"
                        status="aberta"
                    />
                </div>

                {/* Coluna 3: Em Negociação */}
                <div className="flex flex-col gap-4">
                    <h2 className="text-xl font-bold text-black mb-2">Em Negociação</h2>
                    <AdminCard
                        id="#203"
                        data="09/02"
                        titulo="Brita 20mm p/ Concretagem"
                        cliente="Construtora Real"
                        uf="UF"
                        urgencia="Normal"
                        status="negociacao"
                        stats={{ enviados: 5, respostas: 2 }}
                    />
                </div>

                {/* Coluna 4: Concluídas */}
                <div className="flex flex-col gap-4">
                    <h2 className="text-xl font-bold text-black mb-2">Concluídas</h2>

                    {/* Card Fechado com Sucesso */}
                    <AdminCard
                        id="#203"
                        data="09/02"
                        titulo="Brita 20mm p/ Concretagem"
                        cliente="Construtora Real"
                        uf="UF"
                        urgencia="Normal"
                        status="fechada_match"
                    />

                    {/* Card Sem Retorno */}
                    <AdminCard
                        id="#203"
                        data="09/02"
                        titulo="Brita 20mm p/ Concretagem"
                        cliente="Construtora Real"
                        uf="UF"
                        urgencia="Normal"
                        status="fechada_s_ret"
                    />
                </div>

            </div>
        </div>
    );
}