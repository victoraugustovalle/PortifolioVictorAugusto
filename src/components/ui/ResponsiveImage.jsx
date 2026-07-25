import imageManifest from '../../generated/image-manifest';

const WIDTHS = [480, 800, 1280];

// U+0300–U+036F (marcas diacríticas combinantes), via código explícito para
// não depender de caracteres literais soltos no arquivo-fonte.
const DIACRITICS_RE = new RegExp(
  '[' + String.fromCharCode(0x0300) + '-' + String.fromCharCode(0x036f) + ']',
  'g'
);

/* Mesma regra de scripts/generate-images.mjs — precisa gerar exatamente os
   mesmos nomes de arquivo que o script grava em public/optimized/. */
function slugify(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(DIACRITICS_RE, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/* Os arquivos em public/optimized/ levam hash de conteúdo no nome (cache-
   busting, como o Vite já faz com JS/CSS) — o nome lógico aqui é só a chave
   de busca no manifesto gerado em build; ?? logicalName é um fallback caso
   o manifesto esteja desatualizado (ex.: rodou `vite` direto, sem passar
   por `predev`/`prebuild`, que é quem gera o manifesto). */
function buildSrcSet(src, ext, widths) {
  const filename = src.slice(src.lastIndexOf('/') + 1);
  const base = slugify(filename.replace(/\.[^.]+$/, ''));
  return widths
    .map((w) => {
      const logicalName = `${base}-${w}.${ext}`;
      const actualName = imageManifest[logicalName] ?? logicalName;
      return `/optimized/${actualName} ${w}w`;
    })
    .join(', ');
}

/* <picture> com AVIF + WebP responsivos e o arquivo original (PNG/JPEG)
   como <img> de fallback — nunca quebra se a variante otimizada faltar.
   `className`/`style` vão pro <picture> (a caixa real); `imgClassName` é
   só para quem precisa selecionar o <img> em si (ex.: efeito de hover). */
export default function ResponsiveImage({
  src,
  alt,
  sizes,
  widths = WIDTHS,
  loading = 'lazy',
  fetchPriority,
  className,
  style,
  imgClassName,
  objectFit = 'cover',
  objectPosition,
  width,
  height,
}) {
  return (
    <picture className={className} style={style}>
      <source type="image/avif" srcSet={buildSrcSet(src, 'avif', widths)} sizes={sizes} />
      <source type="image/webp" srcSet={buildSrcSet(src, 'webp', widths)} sizes={sizes} />
      <img
        src={src}
        alt={alt}
        loading={loading}
        fetchPriority={fetchPriority}
        className={imgClassName}
        width={width}
        height={height}
        style={{ width: '100%', height: '100%', objectFit, objectPosition, display: 'block' }}
      />
    </picture>
  );
}
