import { writeFileSync } from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

// Gera favicon.ico, apple-touch-icon.png e os ícones do manifest a partir da
// mesma marca usada no <link rel="icon"> inline de index.html (retângulo
// #B5743A com "VA" em branco), renderizando o SVG em cada resolução alvo
// via Chrome headless para manter as bordas nítidas em qualquer tamanho.

const svg = (size) => `
  <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32">
    <rect width="32" height="32" rx="8" fill="#B5743A"/>
    <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle"
      font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-weight="700"
      font-size="14" fill="#fff">VA</text>
  </svg>
`;

async function renderPng(page, size) {
  await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
  await page.setContent(
    `<!doctype html><html><body style="margin:0">${svg(size)}</body></html>`
  );
  return page.screenshot({ omitBackground: true });
}

// Monta um .ico válido (contêiner ICONDIR) embutindo PNGs — suportado desde
// o Windows Vista e por todos os navegadores modernos e crawlers.
function buildIco(pngBuffers) {
  const count = pngBuffers.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: ico
  header.writeUInt16LE(count, 4);

  const dirEntries = [];
  const imageDatas = [];
  let offset = 6 + count * 16;

  for (const { size, buffer } of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // width (0 = 256)
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // height (0 = 256)
    entry.writeUInt8(0, 2); // color palette
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(buffer.length, 8); // image size
    entry.writeUInt32LE(offset, 12); // image offset
    dirEntries.push(entry);
    imageDatas.push(buffer);
    offset += buffer.length;
  }

  return Buffer.concat([header, ...dirEntries, ...imageDatas]);
}

async function main() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const png16 = await renderPng(page, 16);
  const png32 = await renderPng(page, 32);
  const png180 = await renderPng(page, 180);
  const png192 = await renderPng(page, 192);
  const png512 = await renderPng(page, 512);

  await browser.close();

  const publicDir = path.resolve('public');
  writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), png180);
  writeFileSync(path.join(publicDir, 'icon-192.png'), png192);
  writeFileSync(path.join(publicDir, 'icon-512.png'), png512);
  writeFileSync(
    path.join(publicDir, 'favicon.ico'),
    buildIco([
      { size: 16, buffer: png16 },
      { size: 32, buffer: png32 },
    ])
  );

  console.log('✔ Ícones gerados em public/: favicon.ico, apple-touch-icon.png, icon-192.png, icon-512.png');
}

main().catch((err) => {
  console.error('✘ Falha ao gerar ícones:', err);
  process.exitCode = 1;
});
