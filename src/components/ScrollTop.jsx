import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function ScrollTop() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label={t('scrollTop')}
      className="fixed right-6 bottom-6 w-10 h-10 flex items-center justify-center rounded-xl border transition-all duration-200 z-50 tap-target"
      style={{
        background:   'var(--bg-card)',
        borderColor:  'var(--border-2)',
        color:        'var(--text-2)',
        boxShadow:    'var(--shadow-sm)',
        opacity:      visible ? '1' : '0',
        visibility:   visible ? 'visible' : 'hidden',
        transform:    visible ? 'translateY(0)' : 'translateY(8px)',
      }}
      onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.borderColor = 'var(--accent-border)'; e.currentTarget.style.background = 'var(--accent-bg)'; }}
      onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-2)'; e.currentTarget.style.borderColor = 'var(--border-2)'; e.currentTarget.style.background = 'var(--bg-card)'; }}
      onFocus={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.borderColor = 'var(--accent-border)'; e.currentTarget.style.background = 'var(--accent-bg)'; }}
      onBlur={e => { e.currentTarget.style.color = 'var(--text-2)'; e.currentTarget.style.borderColor = 'var(--border-2)'; e.currentTarget.style.background = 'var(--bg-card)'; }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 19V5M5 12l7-7 7 7"/>
      </svg>
    </button>
  );
}
