import { test, expect } from '@playwright/test';

test.describe('Fluxo de Criação de Demandas', () => {

    test('deve criar uma nova demanda com urgência crítica e arquivo anexado', async ({ page }) => {

        // ==========================================
        // 1. SETUP: CADASTRO RÁPIDO DO COMPRADOR
        // ==========================================
        const timestamp = Date.now();
        const nomeComprador = `Comprador Fast ${timestamp}`;

        await page.goto('http://localhost:3000/cadastro/comprador');
        await page.fill('#nome', nomeComprador);
        await page.type('#telefone', '35999991111', { delay: 50 });
        await page.fill('#email', `comprador_demanda_${timestamp}@roboTeste.com`);
        await page.fill('#senha', 'SenhaForte123!');
        await page.check('#termos');
        await page.click('button:has-text("Criar Conta"), button:has-text("Cadastrar"), button:has-text("Continuar")');

        // Aguarda o redirecionamento para o painel principal
        await page.waitForURL('**/comprador', { timeout: 15000 });

        // Valida que o Painel carregou aguardando o título da solicitação
        await expect(page.locator('text="Nova Solicitação"').first()).toBeVisible({ timeout: 15000 });

        // ==========================================
        // 2. AÇÃO: PREENCHER E CADASTRAR A DEMANDA
        // ==========================================

        // Texto da demanda que vamos procurar na tabela depois
        const textoDemanda = `Preciso de 2 Britadores de Mandíbula urgentes para a obra em Santa Rita do Sapucaí. Orçamento liberado. (Teste ID: ${timestamp})`;

        // Preenche a Textarea baseada no placeholder que você definiu
        await page.fill('textarea[placeholder*="Dica: Especifique"]', textoDemanda);

        // Clica no botão de urgência Crítica (usando o emoji e texto exato do seu código)
        await page.click('button:has-text("🚨 Crítico (48h)")');

        // --- UPLOAD DO ARQUIVO FALSO ---
        const bufferArquivoFalso = Buffer.from('Documento técnico gerado pelo Playwright.');

        // Pega o último input file da tela (Geralmente o de PDF no seu componente AnexosDemanda)
        const fileInputs = page.locator('input[type="file"]');
        if (await fileInputs.count() > 0) {
            await fileInputs.last().setInputFiles({
                name: 'projeto_edital_teste.pdf',
                mimeType: 'application/pdf',
                buffer: bufferArquivoFalso,
            });
        }

        // Clica no botão exato que você criou: "Cadastrar Demanda"
        await page.click('button:has-text("Cadastrar Demanda")');

        // ==========================================
        // 3. VALIDAÇÃO DE SUCESSO E TEMPO REAL
        // ==========================================

        // 1. Verifica se a mensagem verde do seu estado apareceu na tela
        await expect(page.locator('text="Sua solicitação foi enviada para curadoria!"')).toBeVisible({ timeout: 10000 });

        // 2. Verifica se a Textarea foi limpa automaticamente após o envio
        await expect(page.locator('textarea[placeholder*="Dica: Especifique"]')).toHaveValue('');

        // 3. A PROVA DE FOGO: Verifica se a demanda apareceu na tabela lá embaixo!
        // Como você usou onSnapshot, ela deve aparecer instantaneamente sem recarregar a tela
        await expect(page.locator(`text="${textoDemanda}"`).first()).toBeVisible();

        // Verifica se a etiqueta de status "Aberta" ou "Pendente" está na mesma linha da tabela
        // (O seu sistema salva como "pendente" primeiro para ir para curadoria, ou "aberta")
        // Procuramos o valor exato que está no DOM (minúsculo e sem acento)
        await expect(page.locator('table')).toContainText('critico');
    });
});