import { useEffect } from 'react';
import ImageCarousel from './ImageCarousel';
import { useLanguage } from '../../context/LanguageContext';

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.165 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.604-3.369-1.341-3.369-1.341-.454-1.154-1.11-1.461-1.11-1.461-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.087.636-1.337-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/>
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
      <path d="M15 3h6v6"/><path d="M10 14 21 3"/>
    </svg>
  );
}

export default function ProjectModal({ project, onClose }) {
  const { t } = useLanguage();
  useEffect(() => {
    const onKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  if (!project) return null;

  const { title, longDesc, desc, tags, img, alt, images, gradient, gradientStyle, badge, githubUrl, liveUrl, liveLabel } = project;
  const hasLinks = githubUrl || liveUrl;
  const gallery = images?.length ? images : img ? [{ src: img, alt }] : [];

  return (
    <div
      role="presentation"
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: 400, background: 'rgba(10,9,7,.55)', backdropFilter: 'blur(4px)', animation: 'modal-overlay-in .2s ease-out' }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        className="w-full flex flex-col"
        style={{
          maxWidth: 640,
          maxHeight: '88vh',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 24,
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          animation: 'modal-panel-in .25s cubic-bezier(0,0,.2,1)',
        }}
      >
        {/* Thumb */}
        <div className="modal-thumb relative shrink-0">
          {gallery.length ? (
            <ImageCarousel images={gallery} alt={title} badge={badge} />
          ) : gradient ? (
            <div
              style={{
                width: '100%', height: '100%',
                background: gradientStyle,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '.75rem',
              }}
            >
              <div className="font-display font-extrabold text-white" style={{ fontSize: '2rem', textShadow: '0 2px 12px rgba(0,0,0,.2)' }}>
                {title}
              </div>
              {badge && (
                <div className="text-xs px-3 py-1 rounded-full" style={{ background: 'rgba(0,0,0,.2)', color: 'rgba(255,255,255,.85)' }}>
                  {badge}
                </div>
              )}
            </div>
          ) : (
            <div style={{ width: '100%', height: '100%', background: 'var(--bg-3)' }} />
          )}

          <button
            type="button"
            onClick={onClose}
            aria-label={t('projects.modal.close')}
            className="absolute top-3 right-3 flex items-center justify-center transition-colors duration-150 tap-target"
            style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(0,0,0,.35)', color: '#fff', backdropFilter: 'blur(6px)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,.55)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,.35)'; }}
            onFocus={e => { e.currentTarget.style.background = 'rgba(0,0,0,.55)'; }}
            onBlur={e => { e.currentTarget.style.background = 'rgba(0,0,0,.35)'; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 md:p-7">
          <h3 id="project-modal-title" className="font-display font-bold mb-3" style={{ fontSize: '1.375rem', color: 'var(--text)' }}>
            {title}
          </h3>

          <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-2)', textAlign: 'left' }}>
            {longDesc || desc}
          </p>

          {tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-6">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                  style={{ background: 'var(--accent-bg)', border: '1px solid var(--accent-border)', color: 'var(--accent)' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {hasLinks ? (
            <div className="flex gap-3 flex-wrap">
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200"
                  style={{ color: 'var(--text-2)', borderColor: 'var(--border-2)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.borderColor = 'var(--accent-border)'; e.currentTarget.style.background = 'var(--accent-bg)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-2)'; e.currentTarget.style.borderColor = 'var(--border-2)'; e.currentTarget.style.background = 'transparent'; }}
                  onFocus={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.borderColor = 'var(--accent-border)'; e.currentTarget.style.background = 'var(--accent-bg)'; }}
                  onBlur={e => { e.currentTarget.style.color = 'var(--text-2)'; e.currentTarget.style.borderColor = 'var(--border-2)'; e.currentTarget.style.background = 'transparent'; }}
                >
                  <GitHubIcon />
                  {t('projects.modal.code')}
                </a>
              )}
              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200"
                  style={{ background: 'var(--accent)', boxShadow: 'var(--shadow-accent)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-hover)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent)'; }}
                  onFocus={e => { e.currentTarget.style.background = 'var(--accent-hover)'; }}
                  onBlur={e => { e.currentTarget.style.background = 'var(--accent)'; }}
                >
                  {liveLabel || t('projects.modal.liveDefault')}
                  <ExternalIcon />
                </a>
              )}
            </div>
          ) : (
            <span className="text-xs" style={{ color: 'var(--text-3)' }}>{t('projects.modal.noRepo')}</span>
          )}
        </div>
      </div>
    </div>
  );
}
