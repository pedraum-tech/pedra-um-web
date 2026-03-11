import { test, expect } from '@playwright/test';

test.describe('Onboarding de Usuários', () => {

    test('deve cadastrar um Comprador com sucesso e redirecionar para o painel', async ({ page }) => {
        // 1. Geração de Dados Dinâmicos
        const timestamp = Date.now();
        const emailTeste = `comprador_${timestamp}@roboTeste.com`;
        const nomeTeste = `Comprador Playwright ${timestamp}`;
        const telefoneTeste = `3599999${timestamp.toString().slice(-4)}`; // Gera um telefone falso mas válido

        // 2. Acessa a página específica de cadastro de comprador
        await page.goto('http://localhost:3000/cadastro/comprador');

        // 3. Preenche os inputs usando os IDs que você definiu no seu código
        await page.fill('#nome', nomeTeste);

        // Como o seu campo de telefone tem máscara formatTelefone, o Playwright digita número por número
        await page.type('#telefone', telefoneTeste, { delay: 50 });

        await page.fill('#email', emailTeste);
        await page.fill('#senha', 'SenhaForte123!');

        // 4. Marca o checkbox dos Termos (usando o id "termos")
        await page.check('#termos');

        // 5. Clica no botão de enviar
        // Assumindo que o texto do seu botão é "Criar Conta" ou "Continuar". Ajuste se for diferente.
        await page.click('button:has-text("Criar Conta"), button:has-text("Continuar")');

        // 6. VALIDAÇÃO DE SUCESSO (Asserção)

        // O uso de '**' (wildcard) ignora se é localhost:3000 ou o domínio de produção.
        // Lembre-se de trocar '/comprador' se a rota exata da sua URL for outra (ex: '/painel')
        await page.waitForURL('**/comprador', { timeout: 10000 });

        // Validação 1: O título da ação principal carregou?
        await expect(page.locator('text="Nova Solicitação"').first()).toBeVisible({ timeout: 15000 });

        // Validação 2 (Master): A saudação puxou o nome que o robô acabou de criar?
        // Usamos a crase ` ` para injetar a variável nomeTeste no texto que o robô vai procurar!
        await expect(page.locator(`text=Olá, ${nomeTeste}!`)).toBeVisible();

        // Validação 3: O botão de Sair está no cabeçalho?
        await expect(page.locator('button:has-text("Sair"), a:has-text("Sair")')).toBeVisible();
    });

    test('deve cadastrar um Fornecedor passando pelos múltiplos passos', async ({ page }) => {
        // 1. Geração de Dados
        const timestamp = Date.now();
        const emailTeste = `fornecedor_${timestamp}@roboTeste.com`;
        const razaoSocialTeste = `Mineradora Playwright ${timestamp}`;
        const telefoneTeste = `3598888${timestamp.toString().slice(-4)}`;

        // CNPJ Matematicamente Válido (Gerador de testes). 
        // Como a sua máscara cuida da formatação, mandamos só os números.
        const cnpjTesteVálido = '54887643000165';

        // CPF Matematicamente Válido para testes E2E (Evita chamar a BrasilAPI)
        const cpfTesteVálido = '71428536973';

        // 2. Acessa a página
        await page.goto('http://localhost:3000/cadastro/fornecedor');

        // ==========================================
        // PASSO 1 DE 2: DADOS DA EMPRESA
        // ==========================================

        // O Playwright vai digitar o CPF lentamente para a sua máscara formatar bonitinho
        await page.type('#cnpj', cpfTesteVálido, { delay: 50 });

        // Como não chamou a API, nós preenchemos a Razão Social/Nome manualmente
        await page.fill('#razaoSocial', razaoSocialTeste);

        await page.fill('#email', emailTeste);
        await page.type('#telefone', telefoneTeste, { delay: 50 });
        await page.fill('#senha', 'SenhaForte123!');

        // Preenche as Especialidades (Textarea)
        await page.fill('#especialidades', 'Somos uma mineradora especializada em britagem e locação de maquinário pesado para o teste E2E.');

        // Seleciona o Estado no Select
        await page.selectOption('#regiao', 'MG');

        // Clica no botão "Continuar"
        await page.click('button:has-text("Continuar")');

        // ==========================================
        // PASSO 2 DE 2: CATEGORIAS E TERMOS
        // ==========================================

        // Espera o formulário do Passo 2 renderizar na tela
        // Baseado na sua taxonomia, procuramos algo como "Categorias" ou "Britagem"
        await expect(page.locator('text="Britagem e Classificação"').first()).toBeVisible();

        // // Clica no checkbox da Categoria
        await page.check('text="Britagem e Classificação"');

        // // Marca os termos 
        await page.check('#termos');

        // // Finaliza! (Ajuste "Finalizar" se o botão do passo 2 tiver outro nome)
        await page.click('button:has-text("Criar Conta"), button:has-text("Cadastrar")');

        // // ==========================================
        // // VALIDAÇÃO FINAL
        // // ==========================================
        await page.waitForURL('**/fornecedor', { timeout: 10000 });

        await expect(page.locator(`text=Olá, ${razaoSocialTeste}!`)).toBeVisible();
    });

});