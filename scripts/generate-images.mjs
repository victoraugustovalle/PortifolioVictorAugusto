import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

// Gera variantes WebP + AVIF em 3 larguras para cada imagem realmente
// carregada pelo site (screenshots de projeto + fotos de evento) — em
// public/optimized/. Os componentes montam um <picture> apontando pra cá,
// com o PNG/JPEG original como <img> de fallback. Nada aqui apaga ou
// substitui os arquivos originais.
//
// Cada arquivo gerado leva um hash de conteúdo no nome (mesma lógica que o
// Vite já usa pra JS/CSS) — sem isso, um CDN/navegador com cache agressivo
// podia continuar servindo a versão antiga depois de trocar uma imagem. O
// mapeamento nome-lógico → nome-com-hash vai pra src/generated/image-
// manifest.js, importado por ResponsiveImage.jsx. O diretório de saída é
// limpo a cada build, então hash antigo nunca fica órfão no ar.

const PUBLIC_DIR = path.resolve('public');
const OUT_DIR = path.join(PUBLIC_DIR, 'optimized');
const MANIFEST_PATH = path.resolve('src/generated/image-manifest.js');
const WIDTHS = [480, 800, 1280];

// Screenshots de projeto (src/data/projects.js) + fotos de evento
// (src/data/events.js, também usada em About.jsx). portifolio1-6.png ficam
// de fora por não serem carregadas por nenhuma página.
const SOURCES = [
  '/victor.jpg',
  '/hope-pet.png',
  '/personalpay-1.png',
  '/personalpay-2.png',
  '/live-transcribe.png',
  '/racha-contas.jpeg',
  '/tripflow-1.png',
  '/tripflow-2.png',
  '/tripflow-3.png',
  '/Musicfly.png',
  '/eventos/HackFest 2 lugar 2024.jpeg',
  '/eventos/AWS reInvent Recap 2026.jpeg',
  '/eventos/Dev Fest 2025.jpeg',
  '/eventos/Build with AI.jpeg',
  '/eventos/Feluma Summit 2024.jpeg',
  '/eventos/Dev Fest.jpeg',
  '/eventos/GDG 2025.jpeg',
  '/eventos/GDG.jpeg',
  '/eventos/Google Developers Group.jpeg',
];

const DIACRITICS_RE = new RegExp(
  '[' + String.fromCharCode(0x0300) + '-' + String.fromCharCode(0x036f) + ']',
  'g'
);

// Mesma regra usada em ResponsiveImage.jsx para montar as URLs do srcset —
// nomes de arquivo previsíveis e sem espaço/acento, independente do nome
// original ("AWS reInvent Recap 2026.jpeg" → "aws-reinvent-recap-2026").
export function slugify(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(DIACRITICS_RE, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function hashOf(buffer) {
  return createHash('md5').update(buffer).digest('hex').slice(0, 8);
}

async function processImage(relSrc, manifest) {
  const abs = path.join(PUBLIC_DIR, relSrc);
  if (!existsSync(abs)) {
    console.warn(`✘ não encontrado, pulando: ${relSrc}`);
    return;
  }
  const base = slugify(path.basename(relSrc, path.extname(relSrc)));

  for (const width of WIDTHS) {
    // withoutEnlargement: se a imagem original for menor que o alvo, sai no
    // tamanho nativo em vez de esticar.
    const resize = () => sharp(abs).resize({ width, withoutEnlargement: true });

    const webpBuffer = await resize().webp({ quality: 82 }).toBuffer();
    const avifBuffer = await resize().avif({ quality: 65 }).toBuffer();

    for (const [ext, buffer] of [['webp', webpBuffer], ['avif', avifBuffer]]) {
      const logicalName = `${base}-${width}.${ext}`;
      const hashedName = `${base}-${width}.${hashOf(buffer)}.${ext}`;
      writeFileSync(path.join(OUT_DIR, hashedName), buffer);
      manifest[logicalName] = hashedName;
    }
  }
  console.log(`✔ ${relSrc} → optimized/${base}-{${WIDTHS.join(',')}}.{webp,avif} (com hash)`);
}

async function main() {
  rmSync(OUT_DIR, { recursive: true, force: true });
  mkdirSync(OUT_DIR, { recursive: true });
  mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true });

  const manifest = {};
  for (const src of SOURCES) {
    await processImage(src, manifest);
  }

  const js = `// Gerado automaticamente por scripts/generate-images.mjs — não editar à mão.\nexport default ${JSON.stringify(manifest, null, 2)};\n`;
  writeFileSync(MANIFEST_PATH, js, 'utf-8');
  console.log(`✔ src/generated/image-manifest.js gerado (${Object.keys(manifest).length} entradas).`);
}

main().catch((err) => {
  console.error('✘ Falha ao gerar imagens otimizadas:', err);
  process.exitCode = 1;
});
