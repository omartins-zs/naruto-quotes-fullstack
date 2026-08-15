import { expect, test } from '@playwright/test';

const botaoJutsu = /quote no jutsu/i;

test.describe('Naruto Quotes - fluxo principal', () => {
  test('carrega a pagina com titulo, imagem e botao', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/naruto quotes/i);
    await expect(page.getByRole('img', { name: /naruto holding a kunai/i })).toBeVisible();
    await expect(page.getByRole('button', { name: botaoJutsu })).toBeVisible();
  });

  test('exibe uma frase real vinda da API', async ({ page }) => {
    await page.goto('/');

    const frase = page.getByTestId('quote');
    const personagem = page.getByTestId('speaker');

    await expect(frase).toBeVisible();
    await expect(frase).not.toHaveText(/invocando uma frase/i);
    await expect(personagem).not.toHaveText(/carregando personagem/i);

    expect((await frase.textContent()).trim().length).toBeGreaterThan(5);
  });

  test('nao mostra a linha de cabecalho do CSV como frase', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('quote')).not.toHaveText(/invocando/i);

    // Regressao: o CSV era lido com o cabecalho ",0,1" virando a frase "1" do personagem "0".
    await expect(page.getByTestId('speaker')).not.toHaveText(/^-\s*0$/);
  });

  test('troca a frase ao clicar no botao', async ({ page }) => {
    await page.goto('/');

    const frase = page.getByTestId('quote');
    await expect(frase).not.toHaveText(/invocando uma frase/i);

    const vistas = new Set([await frase.textContent()]);
    const botao = page.getByRole('button', { name: botaoJutsu });

    // Com 509 frases, 6 cliques sem nenhuma frase nova seria praticamente impossivel.
    for (let tentativa = 0; tentativa < 6; tentativa += 1) {
      await botao.click();
      await expect(botao).toBeEnabled();
      vistas.add(await frase.textContent());

      if (vistas.size > 1) break;
    }

    expect(vistas.size).toBeGreaterThan(1);
  });

  test('desabilita o botao enquanto carrega', async ({ page }) => {
    await page.route('**/api/', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 700));
      await route.continue();
    });

    await page.goto('/');
    const botao = page.getByRole('button');

    await expect(botao).toBeDisabled();
    await expect(botao).toHaveText(/carregando/i);
    await expect(botao).toBeEnabled({ timeout: 15_000 });
    await expect(botao).toHaveText(botaoJutsu);
  });
});

test.describe('Naruto Quotes - resiliencia', () => {
  test('mostra alerta quando a API falha', async ({ page }) => {
    await page.route('**/api/', (route) => route.fulfill({ status: 503, body: '' }));

    await page.goto('/');

    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByRole('alert')).toContainText(/HTTP 503/);
  });

  test('se recupera quando a API volta', async ({ page }) => {
    let forcarFalha = true;
    await page.route('**/api/', async (route) => {
      if (forcarFalha) {
        await route.fulfill({ status: 503, body: '' });
        return;
      }
      await route.continue();
    });

    await page.goto('/');
    await expect(page.getByRole('alert')).toBeVisible();

    forcarFalha = false;
    await page.getByRole('button').click();

    await expect(page.getByRole('alert')).toBeHidden();
    await expect(page.getByTestId('quote')).not.toHaveText(/invocando uma frase/i);
  });
});

test.describe('Naruto Quotes - API pelo proxy do nginx', () => {
  test('healthcheck responde com o total de frases', async ({ request }) => {
    const response = await request.get('/api/health');

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.status).toBe('ok');
    expect(body.quotes).toBeGreaterThan(500);
  });

  test('a raiz da API devolve speaker e quote', async ({ request }) => {
    const response = await request.get('/api/');

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Object.keys(body).sort()).toEqual(['quote', 'speaker']);
    expect(body.speaker.length).toBeGreaterThan(0);
    expect(body.quote.length).toBeGreaterThan(0);
  });

  test('sorteia frases diferentes em varias chamadas', async ({ request }) => {
    const frases = new Set();

    for (let i = 0; i < 12; i += 1) {
      const response = await request.get('/api/');
      frases.add((await response.json()).quote);
    }

    expect(frases.size).toBeGreaterThan(1);
  });

  test('nunca estoura o indice do CSV em muitas chamadas', async ({ request }) => {
    // Regressao do random.randint(0, len(df)), que gerava HTTP 500 esporadico.
    for (let i = 0; i < 60; i += 1) {
      const response = await request.get('/api/');
      expect(response.status()).toBe(200);
    }
  });

  test('rota inexistente devolve 404 em JSON', async ({ request }) => {
    const response = await request.get('/api/rota-que-nao-existe');

    expect(response.status()).toBe(404);
    expect((await response.json()).error).toBe('not_found');
  });
});
