import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

// Gera public/og-image.<hash>.jpg (1200x630, proporção 1.91:1) para
// og:image / twitter:image — victor.jpg é retrato (960x1280) e fica cortado
// de forma estranha se usado direto num card de compartilhamento em
// paisagem. Aqui a foto é recomposta: recortada e ancorada à direita, com
// nome/cargo em texto sobre um degradê nas cores de marca do site (mesmo
// tom de --accent-vivid → --accent usado no anel da foto da Hero).
//
// O nome do arquivo leva hash de conteúdo (cache-busting, como o Vite já
// faz com JS/CSS) — o script reescreve as duas tags og:image/twitter:image
// em index.html com o nome atual e apaga qualquer og-image.*.jpg antigo.

const WIDTH = 1200;
const HEIGHT = 630;
const SOURCE_PHOTO = path.resolve('public/victor.jpg');
const PUBLIC_DIR = path.resolve('public');
const INDEX_HTML_PATH = path.resolve('index.html');

// Largura da foto na composição, preservando a proporção nativa (960x1280).
const PHOTO_WIDTH = Math.round(HEIGHT * (960 / 1280));

const OG_IMAGE_RE = /og-image(?:\.[0-9a-f]{8})?\.jpg/g;

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildBackgroundSvg() {
  const title = 'Victor Augusto';
  const role = 'Desenvolvedor Full Stack .NET/C#';
  const tags = 'ERP · APIs bancárias · Gateways de pagamento';

  return Buffer.from(`
    <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#B5743A"/>
          <stop offset="100%" stop-color="#5E3514"/>
        </linearGradient>
        <linearGradient id="fade" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#000000" stop-opacity="0"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0.35"/>
        </linearGradient>
      </defs>
      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
      <text x="72" y="268" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="78" fill="#ffffff" letter-spacing="-1">${escapeXml(title)}</text>
      <text x="72" y="326" font-family="Arial, Helvetica, sans-serif" font-weight="600" font-size="36" fill="rgba(255,255,255,0.94)">${escapeXml(role)}</text>
      <text x="72" y="372" font-family="Arial, Helvetica, sans-serif" font-weight="400" font-size="25" fill="rgba(255,255,255,0.72)">${escapeXml(tags)}</text>
      <rect x="72" y="404" width="76" height="6" rx="3" fill="rgba(255,255,255,0.85)"/>
    </svg>
  `);
}

async function main() {
  const photo = await sharp(SOURCE_PHOTO)
    .resize({ width: PHOTO_WIDTH, height: HEIGHT, fit: 'cover', position: 'top' })
    .toBuffer();

  // Sombra suave na costura entre texto e foto, pra legibilidade do texto
  // não depender só do contraste contra o degradê de fundo.
  const seamFade = Buffer.from(
    `<svg width="180" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="f" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#000000" stop-opacity="0.28"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <rect width="180" height="${HEIGHT}" fill="url(#f)"/>
    </svg>`
  );

  const buffer = await sharp(buildBackgroundSvg())
    .composite([
      { input: photo, left: WIDTH - PHOTO_WIDTH, top: 0 },
      { input: seamFade, left: WIDTH - PHOTO_WIDTH, top: 0 },
    ])
    .jpeg({ quality: 88 })
    .toBuffer();

  const hash = createHash('md5').update(buffer).digest('hex').slice(0, 8);
  const filename = `og-image.${hash}.jpg`;

  for (const f of readdirSync(PUBLIC_DIR)) {
    if (OG_IMAGE_RE.test(f) && f !== filename) unlinkSync(path.join(PUBLIC_DIR, f));
    OG_IMAGE_RE.lastIndex = 0; // regex global com .test() precisa disso pra não pular entradas
  }
  writeFileSync(path.join(PUBLIC_DIR, filename), buffer);

  const html = readFileSync(INDEX_HTML_PATH, 'utf-8');
  const updated = html.replace(OG_IMAGE_RE, filename);
  if (updated !== html) writeFileSync(INDEX_HTML_PATH, updated, 'utf-8');

  console.log(`✔ public/${filename} gerado (${WIDTH}x${HEIGHT}) e index.html atualizado.`);
}

main().catch((err) => {
  console.error('✘ Falha ao gerar og-image:', err);
  process.exitCode = 1;
});
