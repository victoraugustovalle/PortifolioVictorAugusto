import { useState } from 'react';
import RevealOnScroll from '../ui/RevealOnScroll';
import ResponsiveImage from '../ui/ResponsiveImage';
import { useLanguage } from '../../context/LanguageContext';
import { events } from '../../data/events';

const track = [...events, ...events]; // duplicado para loop sem corte

/*
 * Seção de fechamento, depois de Contato — prova social de comunidade,
 * não argumento central. Sem entrada de menu dedicada: vem depois do
 * conteúdo que sustenta a decisão de contratar (stack, projetos, experiência).
 */
export default function Events() {
  const { t } = useLanguage();
  const [hovering, setHovering] = useState(false);
  const [manualPause, setManualPause] = useState(false);
  const paused = hovering || manualPause;

  return (
    <section id="community" className="section-pad" style={{ background: 'var(--bg)' }}>

      {/* Heading dentro do container */}
      <div className="max-w-container mx-auto px-6">
        <RevealOnScroll>
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-3)' }}>
              {t('events.kicker')}
            </p>
            <h2
              className="font-display font-bold"
              style={{ fontSize: '1.25rem', letterSpacing: '-.02em', lineHeight: 1.25, color: 'var(--text)' }}
            >
              {t('events.heading')}
            </h2>
          </div>
        </RevealOnScroll>
      </div>

      {/* Carrossel — full width, sem container */}
      <div
        style={{
          overflow: 'hidden',
          position: 'relative',
          padding: '4px 0',
        }}
      >
        {/* Fade esquerda */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: 120,
            background: 'linear-gradient(to right, var(--bg), transparent)',
            zIndex: 2, pointerEvents: 'none',
          }}
        />
        {/* Fade direita */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', right: 0, top: 0, bottom: 0, width: 120,
            background: 'linear-gradient(to left, var(--bg), transparent)',
            zIndex: 2, pointerEvents: 'none',
          }}
        />

        {/* Pausar/retomar — WCAG 2.2.2: movimento automático precisa de controle acessível,
            não só de pausa no hover (que não existe em touch/teclado) */}
        <button
          type="button"
          onClick={() => setManualPause(p => !p)}
          aria-pressed={manualPause}
          aria-label={manualPause ? t('events.resume') : t('events.pause')}
          className="flex items-center justify-center w-9 h-9 rounded-lg border transition-all duration-200 tap-target"
          style={{
            position:    'absolute',
            right:       12,
            bottom:      12,
            zIndex:      3,
            background:  'var(--bg-card)',
            borderColor: 'var(--border-2)',
            color:       'var(--text-2)',
            boxShadow:   'var(--shadow-sm)',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.borderColor = 'var(--accent-border)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-2)'; e.currentTarget.style.borderColor = 'var(--border-2)'; }}
          onFocus={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.borderColor = 'var(--accent-border)'; }}
          onBlur={e => { e.currentTarget.style.color = 'var(--text-2)'; e.currentTarget.style.borderColor = 'var(--border-2)'; }}
        >
          {manualPause ? (
            /* Play */
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          ) : (
            /* Pause */
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></svg>
          )}
        </button>

        {/* Track */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            width: 'max-content',
            animation: 'marquee 22s linear infinite',
            animationPlayState: paused ? 'paused' : 'running',
          }}
          /* pointerType: no touch, o navegador simula hover ao tocar — sem
             checar 'mouse', um toque na imagem pausava o carrossel sozinho.
             No mobile, só o botão explícito de pausa (abaixo) deve pausar. */
          onPointerEnter={e => { if (e.pointerType === 'mouse') setHovering(true); }}
          onPointerLeave={e => { if (e.pointerType === 'mouse') setHovering(false); }}
        >
          {track.map(({ id, name, org, tag, img }, i) => (
            <div
              key={`${id}-${i}`}
              style={{
                position:     'relative',
                width:        300,
                height:       210,
                flexShrink:   0,
                borderRadius: 16,
                overflow:     'hidden',
                background:   'var(--bg-3)',
                border:       '1px solid var(--border)',
              }}
            >
              <ResponsiveImage
                src={img}
                alt={name}
                loading="lazy"
                sizes="300px"
                width={300}
                height={210}
                style={{ width: '100%', height: '100%' }}
              />

              {/* Gradient overlay */}
              <div
                style={{
                  position:   'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,.75) 0%, rgba(0,0,0,.05) 55%, transparent 100%)',
                }}
              />

              {/* Text */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1rem' }}>
                {tag && (
                  <span
                    style={{
                      display:       'inline-block',
                      fontSize:      '.7rem',
                      fontWeight:    700,
                      padding:       '2px 8px',
                      borderRadius:  6,
                      marginBottom:  6,
                      background:    'var(--accent)',
                      color:         '#fff',
                      letterSpacing: '.01em',
                    }}
                  >
                    {t(`events.tags.${tag}`)}
                  </span>
                )}
                <div style={{ fontSize: '.85rem', fontWeight: 600, color: '#fff', lineHeight: 1.3 }}>
                  {name}
                </div>
                <div style={{ fontSize: '.72rem', marginTop: 3, color: 'rgba(255,255,255,.65)' }}>
                  {org}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
