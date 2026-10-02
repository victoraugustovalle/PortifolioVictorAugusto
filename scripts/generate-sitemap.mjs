import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { projects } from '../src/data/projects.js';
import { events } from '../src/data/events.js';
import pt from '../src/i18n/translations/pt.js';

// Gera public/sitemap.xml a cada build — lastmod nunca fica parado — e
// declara as três URLs por idioma (pt/en/es) com hreflang cruzado, mais
// as imagens reais do portfólio via sitemap-image, para descoberta via
// Google Imagens. Os títulos das imagens vêm direto de src/data/projects.js
// e das traduções em pt.js, nunca duplicados à mão aqui.

const SITE = 'https://victoraugusto.dev';
const today = new Date().toISOString().slice(0, 10);

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function hreflangBlock(indent) {
  return [
    `${indent}<xhtml:link rel="alternate" hreflang="pt-BR" href="${SITE}/"/>`,
    `${indent}<xhtml:link rel="alternate" hreflang="en" href="${SITE}/en/"/>`,
    `${indent}<xhtml:link rel="alternate" hreflang="es" href="${SITE}/es/"/>`,
    `${indent}<xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/"/>`,
  ].join('\n');
}

// Foto de perfil, screenshots reais de produto e fotos de evento — fotos
// de evento são as que mais aparecem em busca pelo nome no Google Imagens,
// então entram também. Fica de fora só o que é decorativo (ícones, badges
// de certificação). <image:title> foi descontinuado pelo Google em 2022 e é
// ignorado — quem conta é o alt no HTML; fica aqui só como documentação.
function collectImages() {
  const images = [{ loc: '/victor.jpg', title: 'Victor Augusto — Desenvolvedor Full Stack .NET/C#' }];

  for (const project of projects) {
    const tr = pt.projects.items[project.id] ?? {};
    if (project.images?.length) {
      project.images.forEach((img, i) => {
        images.push({ loc: img.src, title: tr.images?.[i] ?? img.alt ?? project.title });
      });
    } else if (project.img) {
      images.push({ loc: project.img, title: tr.alt ?? project.alt ?? project.title });
    }
  }

  for (const event of events) {
    images.push({ loc: event.img, title: pt.events.alt?.[event.id] ?? event.name });
  }
  return images;
}

function imageBlock(images) {
  return images
    .map(
      ({ loc, title }) =>
        `    <image:image>\n      <image:loc>${SITE}${loc}</image:loc>\n      <image:title>${escapeXml(title)}</image:title>\n    </image:image>`
    )
    .join('\n');
}

function urlEntry({ loc, priority, images }) {
  const parts = [
    `  <url>`,
    `    <loc>${SITE}${loc}</loc>`,
    hreflangBlock('    '),
  ];
  if (images?.length) parts.push(imageBlock(images));
  parts.push(`    <lastmod>${today}</lastmod>`, `    <changefreq>monthly</changefreq>`, `    <priority>${priority}</priority>`, `  </url>`);
  return parts.join('\n');
}

const images = collectImages();

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlEntry({ loc: '/', priority: '1.0', images })}
${urlEntry({ loc: '/en/', priority: '0.8' })}
${urlEntry({ loc: '/es/', priority: '0.8' })}
</urlset>
`;

const outPath = path.resolve('public/sitemap.xml');
writeFileSync(outPath, xml, 'utf-8');
console.log(`✔ public/sitemap.xml gerado — ${images.length} imagens, lastmod ${today}.`);
