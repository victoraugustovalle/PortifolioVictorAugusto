import { useEffect, useRef, useState } from 'react';
import ResponsiveImage from './ResponsiveImage';

const AUTOPLAY_MS = 4200;
const MODAL_SIZES = '(min-width: 640px) 640px, 100vw';

function PlayIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>;
}
function PauseIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></svg>;
}
function ArrowIcon({ dir }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d={dir === 'prev' ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'} />
    </svg>
  );
}

function ArrowButton({ dir, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="absolute top-1/2 flex items-center justify-center transition-colors duration-150 tap-target"
      style={{
        [dir === 'prev' ? 'left' : 'right']: 10,
        transform: 'translateY(-50%)',
        width: 32, height: 32, borderRadius: 10,
        background: 'rgba(0,0,0,.35)', color: '#fff', backdropFilter: 'blur(6px)',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,.55)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,.35)'; }}
      onFocus={e => { e.currentTarget.style.background = 'rgba(0,0,0,.55)'; }}
      onBlur={e => { e.currentTarget.style.background = 'rgba(0,0,0,.35)'; }}
    >
      <ArrowIcon dir={dir} />
    </button>
  );
}

/* Carrossel para a galeria de imagens de um projeto na modal.
   Autoplay pausa no hover e tem um botão explícito (WCAG 2.2.2 — hover
   sozinho não cobre touch/teclado), e respeita prefers-reduced-motion. */
export default function ImageCarousel({ images, alt, badge }) {
  const [index, setIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [manualPause, setManualPause] = useState(false);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion.current) setManualPause(true);
  }, []);

  const paused = hovering || manualPause;

  useEffect(() => {
    if (paused || images.length < 2) return undefined;
    const id = setInterval(() => setIndex(i => (i + 1) % images.length), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, images.length]);

  if (!images?.length) return null;

  if (images.length === 1) {
    return (
      <div className="relative w-full h-full">
        <ResponsiveImage
          src={images[0].src}
          alt={images[0].alt || alt}
          sizes={MODAL_SIZES}
          width={1280}
          height={560}
          style={{ width: '100%', height: '100%' }}
          objectPosition="top"
        />
        {badge && <BadgeOverlay badge={badge} />}
      </div>
    );
  }

  const go = (i) => setIndex(((i % images.length) + images.length) % images.length);

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {images.map((img, i) => (
        <ResponsiveImage
          key={img.src}
          src={img.src}
          alt={img.alt || alt}
          sizes={MODAL_SIZES}
          width={1280}
          height={560}
          className="absolute inset-0 transition-opacity duration-500"
          style={{ width: '100%', height: '100%', opacity: i === index ? 1 : 0 }}
          objectPosition="top"
        />
      ))}

      {badge && <BadgeOverlay badge={badge} />}

      <ArrowButton dir="prev" onClick={() => go(index - 1)} label="Imagem anterior" />
      <ArrowButton dir="next" onClick={() => go(index + 1)} label="Próxima imagem" />

      <div className="absolute bottom-3 right-3 flex items-center gap-1">
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => go(i)}
            aria-label={`Ir para imagem ${i + 1}`}
            aria-current={i === index}
            className="flex items-center justify-center"
            style={{ width: 28, height: 28 }}
          >
            <span
              aria-hidden="true"
              style={{
                display: 'block',
                width: i === index ? 16 : 6, height: 6, borderRadius: 3,
                background: i === index ? '#fff' : 'rgba(255,255,255,.5)',
                transition: 'width .2s ease',
              }}
            />
          </button>
        ))}
        <button
          type="button"
          onClick={() => setManualPause(p => !p)}
          aria-pressed={manualPause}
          aria-label={manualPause ? 'Retomar carrossel de imagens' : 'Pausar carrossel de imagens'}
          className="flex items-center justify-center transition-colors duration-150"
          style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(0,0,0,.35)', color: '#fff', marginLeft: 2 }}
        >
          {manualPause ? <PlayIcon /> : <PauseIcon />}
        </button>
      </div>
    </div>
  );
}

function BadgeOverlay({ badge }) {
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,.55) 0%, transparent 45%)' }}
      />
      <div
        className="absolute left-3 bottom-3 text-xs px-3 py-1 rounded-full"
        style={{ background: 'rgba(0,0,0,.35)', color: 'rgba(255,255,255,.9)', backdropFilter: 'blur(4px)' }}
      >
        {badge}
      </div>
    </>
  );
}
