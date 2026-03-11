import { test as setup, expect } from '@playwright/test';

const adminFile = '.auth/admin.json';
const compradorFile = '.auth/comprador.json';
const fornecedorFile = '.auth/fornecedor.json';

// SETUP DO ADMIN
setup('login como admin', async ({ page }) => {
    await page.goto('http://localhost:3000/login');

    // 1. Preenche e clica
    await page.fill('#email', 'lucas@admin.com');
    await page.fill('#password', '123456');
    await page.click('button:has-text("Entrar")');

    // 2. Espera chegar na URL de destino
    await page.waitForURL('**/admin/dashboard', { timeout: 20000 });

    // 3. O TRUQUE DE MESTRE: 
    // Vamos forçar o browser a esperar o Firebase terminar de escrever no disco.
    // Vamos verificar se existe algo no LocalStorage ou se um elemento do Firebase carregou.
    await page.waitForFunction(() => {
        // Espera até que o Firebase crie a chave de autenticação no LocalStorage ou IndexedDB
        return window.localStorage.length > 0 || document.cookie.length > 0;
    }, { timeout: 10000 }).catch(() => console.log("Aguardando persistência..."));

    // 4. Pausa de segurança (O Firebase é pesado no login)
    await page.waitForTimeout(5000);

    // 5. Salva o estado
    await page.context().storageState({ path: adminFile });
});

// SETUP DO COMPRADOR
setup('login como comprador', async ({ page }) => {
    // Escuta e aceita o alert "Bem-vindo de volta" que você tem no código
    page.on('dialog', dialog => dialog.accept());

    await page.goto('http://localhost:3000/login');
    await page.fill('#email', 'lucas2@teste.com');
    await page.fill('#password', '123456');
    await page.click('button:has-text("Entrar")');

    // 1. Espera a URL mudar
    await page.waitForURL('**/comprador', { timeout: 20000 });

    // 2. Em vez de networkidle, espera o seletor da textarea (ou qualquer elemento do painel)
    // Isso confirma que a página carregou o conteúdo logado
    await page.locator('textarea').first().waitFor({ state: 'visible', timeout: 15000 });

    // 3. Pequena pausa técnica apenas para o browser descarregar o cache no disco
    await page.waitForTimeout(2000);

    // 4. Salva o estado
    await page.context().storageState({ path: compradorFile });
});

// SETUP DO FORNECEDOR
setup('login como fornecedor', async ({ page }) => {
    // Escuta e aceita qualquer alert automaticamente
    page.on('dialog', dialog => dialog.accept());

    await page.goto('http://localhost:3000/login');
    await page.fill('#email', 'lucas@fornecedor.com');
    await page.fill('#password', '123456');
    await page.click('button:has-text("Entrar")');

    // Espera o redirecionamento com um timeout maior
    await page.waitForURL('**/fornecedor', { timeout: 15000 });
    await page.context().storageState({ path: fornecedorFile });
});