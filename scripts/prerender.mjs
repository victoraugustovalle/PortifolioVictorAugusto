import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const viteBin = fileURLToPath(new URL('../node_modules/vite/bin/vite.js', import.meta.url));

// Localmente (Windows/Mac) usamos o pacote `puppeteer` normal, que já vem
// com um Chromium para o SO da máquina. Em build containerizado (Vercel
// seta a env VERCEL=1) o Chromium completo do puppeteer costuma travar o
// processo sem log nenhum (falta de /dev/shm, processo zygote sendo morto
// pelo sandbox etc.) — ali usamos @sparticuz/chromium, um binário Linux
// compilado especificamente para rodar em ambientes serverless/containers.
async function launchBrowser() {
  if (process.env.VERCEL) {
    const [{ default: chromium }, { default: puppeteerCore }] = await Promise.all([
      import('@sparticuz/chromium'),
      import('puppeteer-core'),
    ]);
    return puppeteerCore.launch({
      args: [...chromium.args, '--disable-dev-shm-usage'],
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
  }

  const { default: puppeteer } = await import('puppeteer');
  return puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });
}

// Pré-renderiza o build do Vite: sobe o preview local, deixa o React montar
// a página real e grava o HTML já completo de volta em dist/**/index.html.
// Sem isso, crawlers sem suporte a JS (Bing e afins) recebem só <div id="root"></div>.
//
// Uma rota por idioma (/, /en/, /es/) é visitada explicitamente — o idioma
// nunca depende do locale da máquina que roda o build, e cada snapshot
// grava title/description/canonical/hreflang já corretos para aquele idioma
// (LanguageContext deriva o idioma do caminho da URL, não do navegador).

const PORT = 4173;
const baseUrl = `http://localhost:${PORT}`;

const LOCALES = [
  { lang: 'pt', route: '/',    out: 'dist/index.html' },
  { lang: 'en', route: '/en/', out: 'dist/en/index.html' },
  { lang: 'es', route: '/es/', out: 'dist/es/index.html' },
];

function waitForServer(url, timeout = 15000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const attempt = async () => {
      try {
        const res = await fetch(url);
        if (res.ok) return resolve();
      } catch {
        /* servidor ainda subindo */
      }
      if (Date.now() - start > timeout) return reject(new Error('Preview server não respondeu a tempo.'));
      setTimeout(attempt, 300);
    };
    attempt();
  });
}

// Rola a página inteira para disparar o IntersectionObserver do
// RevealOnScroll — sem isso o snapshot fica com as seções em opacity:0.
async function scrollThroughPage(page) {
  await page.evaluate(async () => {
    const step = 400;
    const delay = 80;
    let scrolled = 0;
    const height = document.body.scrollHeight;
    while (scrolled < height) {
      window.scrollBy(0, step);
      scrolled += step;
      await new Promise((r) => setTimeout(r, delay));
    }
    window.scrollTo(0, 0);
  });
  await new Promise((r) => setTimeout(r, 300));
}

async function main() {
  const preview = spawn(
    process.execPath,
    [viteBin, 'preview', '--port', String(PORT), '--strictPort'],
    { stdio: 'inherit' }
  );

  try {
    await waitForServer(`${baseUrl}/`);

    const browser = await launchBrowser();
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 1000 });

    for (const { lang, route, out } of LOCALES) {
      await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle0' });
      await scrollThroughPage(page);

      const html = await page.content();
      const outPath = path.resolve(out);
      mkdirSync(path.dirname(outPath), { recursive: true });
      writeFileSync(outPath, html, 'utf-8');
      console.log(`✔ ${out} pré-renderizado (${lang}).`);
    }

    await browser.close();
  } finally {
    stopServer(preview);
  }
}

function stopServer(child) {
  // No Windows, child.kill() nem sempre encerra o processo do vite —
  // taskkill /t garante que a árvore inteira seja finalizada.
  if (process.platform === 'win32') {
    spawn('taskkill', ['/pid', String(child.pid), '/f', '/t'], { stdio: 'ignore' });
  } else {
    child.kill();
  }
}

main().catch((err) => {
  console.error('✘ Falha ao pré-renderizar:', err);
  process.exitCode = 1;
});
