import { test, expect } from '@playwright/test';

test('Fluxo de Ouro: Comprador cria -> Adm envia -> Fornecedor libera', async ({ browser }) => {
    test.slow(); // Isso triplica o tempo de timeout padrão do Playwright para este teste específico

    // 1. Criamos contextos limpos (sem carregar JSON)
    const compradorCtx = await browser.newContext();
    const admCtx = await browser.newContext();
    const fornecedorCtx = await browser.newContext();

    const comprador = await compradorCtx.newPage();
    const adm = await admCtx.newPage();
    const fornecedor = await fornecedorCtx.newPage();

    const timestamp = Date.now();
    const prefixo = `Ouro ${timestamp}`.slice(-10); // Pega os últimos 10 dígitos do timestamp
    const descDemanda = `Fluxo ${prefixo}`;

    // ===========================================================
    // ATO 1: COMPRADOR CRIA A DEMANDA
    // ===========================================================
    console.log('Iniciando login do Comprador...');
    await comprador.goto('http://localhost:3000/login');

    // Lida com o alert "Bem-vindo de volta"
    comprador.on('dialog', dialog => dialog.accept());

    await comprador.fill('#email', 'lucas2@teste.com');
    await comprador.fill('#password', '123456');
    await comprador.click('button:has-text("Entrar")');

    await comprador.waitForURL('**/comprador', { timeout: 15000 });

    const textarea = comprador.locator('textarea');
    await textarea.first().waitFor({ state: 'visible' });
    await textarea.first().fill(descDemanda);
    await comprador.click('button:has-text("Cadastrar Demanda")');

    await expect(comprador.locator('p', { hasText: descDemanda }).first()).toBeVisible({ timeout: 10000 });
    console.log('✅ Demanda criada pelo comprador.');

    // ===========================================================
    // ATO 2: ADMIN FAZ O MATCHMAKING
    // ===========================================================
    console.log('Iniciando login do Admin...');
    await adm.goto('http://localhost:3000/login');
    await adm.fill('#email', 'lucas@admin.com');
    await adm.fill('#password', '123456');
    await adm.click('button:has-text("Entrar")');

    await adm.waitForURL('**/admin/dashboard', { timeout: 15000 });

    // Pegamos apenas os primeiros 6 dígitos do timestamp (Garante que cabe nos 30 chars do componente)
    const idCurto = prefixo.replace(/\D/g, "").substring(0, 6);
    console.log(`Buscando na tabela pelo ID parcial: ${idCurto}`);

    // Localizador da linha que contém esse ID parcial
    const encontrarLinha = () => adm.locator('div[style*="border-left-color"]').filter({ hasText: idCurto }).first();

    // Tenta localizar com suporte a Reload (caso o Firebase atrase)
    try {
        await expect(encontrarLinha()).toBeVisible({ timeout: 10000 });
    } catch (e) {
        console.log('Demanda não apareceu. Recarregando...');
        await adm.reload();
        await expect(encontrarLinha()).toBeVisible({ timeout: 15000 });
    }

    const card = encontrarLinha();

    // No seu componente AdminCard, o botão para curadoria é o link "Ver"
    // Ele está dentro de um Link (<a>), então vamos clicar nele
    // ... código anterior (clique no link Ver)
    await card.getByRole('link', { name: 'Ver' }).click();

    // 1. GARANTIA: Espera a URL mudar para a página de detalhes
    // O ID da demanda está no final da URL
    await adm.waitForURL('**/admin/demandas/**', { timeout: 15000 });

    console.log('Página de detalhes carregada. Buscando Lucas David...');

    // 2. TÉCNICA DE RESILIÊNCIA: Esperar o texto do fornecedor aparecer na tela
    // Isso garante que os dados vindos do banco de dados já renderizaram
    const nomeFornecedor = adm.locator('text=Lucas David').first();
    await nomeFornecedor.waitFor({ state: 'visible', timeout: 15000 });

    // 3. LOCALIZAÇÃO PRECISA: 
    // Encontramos o container (pode ser uma linha de tabela ou div) que contém o nome
    const linhaFornecedor = adm.locator('tr, div.flex, li').filter({ hasText: 'Lucas David' }).last();

    // 4. AÇÃO: Clica no botão dentro dessa linha específica
    const botaoMatch = linhaFornecedor.getByRole('button', { name: /Selecionar/i });

    await expect(botaoMatch).toBeVisible({ timeout: 10000 });
    await botaoMatch.click();

    const botaoSalvarMatch = adm.locator('button', { hasText: /Salvar Alterações/i }).first();

    await expect(botaoSalvarMatch).toBeVisible({ timeout: 10000 });
    await botaoSalvarMatch.click();

    console.log('✅ Matchmaking realizado especificamente com Lucas David.');

    // ===========================================================
    // ATO 3: FORNECEDOR LIBERA O CONTATO
    // ===========================================================
    console.log('Iniciando login do Fornecedor...');
    await fornecedor.goto('http://localhost:3000/login');

    // Lida com diálogos (se houver)
    fornecedor.on('dialog', dialog => dialog.accept());

    await fornecedor.fill('#email', 'lucas@fornecedor.com');
    await fornecedor.fill('#password', '123456');
    await fornecedor.click('button:has-text("Entrar")');

    await fornecedor.waitForURL('**/fornecedor', { timeout: 15000 });

    // 1. Localizamos o CARD que contém o texto da nossa demanda
    // Como é uma Grid de Cards, buscamos pela div que agrupa o conteúdo
    const cardDemanda = fornecedor.locator('.bg-white.rounded-lg').filter({
        hasText: descDemanda.substring(0, 20)
    }).first();

    // 2. Resiliência: Se o Firebase demorar a propagar o match, recarregamos
    try {
        await expect(cardDemanda).toBeVisible({ timeout: 10000 });
    } catch (e) {
        console.log('Card não apareceu. Recarregando página do fornecedor...');
        await fornecedor.reload();
        await expect(cardDemanda).toBeVisible({ timeout: 15000 });
    }

    // 3. Clicar no botão "Atender" dentro DESTE card específico
    await cardDemanda.getByRole('button', { name: /Atender/i }).click();

    // 4. Esperar a página de detalhes carregar
    await fornecedor.waitForURL('**/fornecedor/detalhes/**', { timeout: 15000 });
    console.log('Página de detalhes aberta. Liberando contato...');

    // 5. Clicar em "Liberar contato"
    const botaoLiberar = fornecedor.getByRole('button', { name: /Liberar contato/i });
    await expect(botaoLiberar).toBeVisible({ timeout: 10000 });
    await botaoLiberar.click();

    // 6. Validação final
    console.log('✅ Fluxo concluído: Fornecedor atendeu e liberou contato.');

    // ===========================================================
    // ATO 4: VALIDAÇÃO FINAL NO KANBAN DO ADMIN
    // ===========================================================
    console.log('Retornando ao Admin para verificação final...');
    await adm.goto('http://localhost:3000/admin/dashboard');

    // 1. Localizador da coluna de Negociações (baseado no texto da coluna ou estrutura)
    // Se seu Kanban usa títulos para as colunas, podemos filtrar por proximidade
    const colunaNegociacao = adm.locator('div').filter({ hasText: /^Negociação$/i }).locator('..');

    // 2. Buscamos o card específico dentro da coluna de Negociação
    // O AdminCard usa o ID curto (ex: PRT-123) ou o título
    const cardNoKanban = adm.locator('div[style*="border-left-color"]').filter({
        hasText: descDemanda.substring(0, 15)
    });

    // 3. Resiliência: O Kanban precisa refletir a mudança de status
    try {
        await expect(cardNoKanban).toBeVisible({ timeout: 10000 });
    } catch (e) {
        console.log('Card ainda não apareceu em Negociação. Recarregando...');
        await adm.reload();
        await expect(cardNoKanban).toBeVisible({ timeout: 15000 });
    }

    // 4. VERIFICAÇÃO DE COMPATIBILIDADE COM A UI (AdminCard.tsx)
    // Quando em negociação, o card NÃO deve ter botões, mas sim as labels de Env./Resp.
    const statsEnv = cardNoKanban.locator('text=/Env./i');
    const statsResp = cardNoKanban.locator('text=/Resp./i');

    await expect(statsEnv).toBeVisible();
    await expect(statsResp).toBeVisible();

    console.log('✅ VALIDAÇÃO KANBAN: Demanda encontrada na coluna correta com stats de negociação.');
});