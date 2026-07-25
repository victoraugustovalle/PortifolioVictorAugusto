import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const OPTIONS = [
  { code: 'pt', name: 'Português' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
];

export default function LanguageSwitcher({ variant = 'desktop' }) {
  const { lang, setLang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const onKeyDown = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const current = OPTIONS.find(o => o.code === lang) ?? OPTIONS[0];
  const isMobile = variant === 'mobile';

  return (
    <div ref={rootRef} className="relative" style={{ width: isMobile ? '100%' : 'auto' }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('header.langSwitcherLabel')}
        className={`flex items-center gap-1.5 font-semibold transition-all duration-200 ${isMobile ? 'w-full justify-between px-4 py-3.5 rounded-xl text-base' : 'px-2 min-[360px]:px-3 h-9 rounded-lg text-sm'}`}
        style={{
          color:      'var(--text-2)',
          background: isMobile ? 'var(--bg-2)' : 'transparent',
          border:     isMobile ? '1px solid var(--border)' : 'none',
        }}
        onMouseEnter={e => { if (!isMobile) { e.currentTarget.style.background = 'var(--bg-3)'; e.currentTarget.style.color = 'var(--text)'; } }}
        onMouseLeave={e => { if (!isMobile) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-2)'; } }}
        onFocus={e => { if (!isMobile) { e.currentTarget.style.background = 'var(--bg-3)'; e.currentTarget.style.color = 'var(--text)'; } }}
        onBlur={e => { if (!isMobile) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-2)'; } }}
      >
        <span className="flex items-center gap-1.5">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
          <span className={isMobile ? '' : 'hidden min-[360px]:inline'}>{current.code.toUpperCase()}</span>
        </span>
        <svg
          width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s ease' }}
        >
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t('header.langSwitcherLabel')}
          className={isMobile ? 'mt-1.5 flex flex-col gap-1' : 'absolute right-0 mt-2 py-1.5 z-10'}
          style={isMobile ? {} : {
            minWidth:     150,
            background:   'var(--bg-card)',
            border:       '1px solid var(--border)',
            borderRadius: 14,
            boxShadow:    'var(--shadow-lg)',
          }}
        >
          {OPTIONS.map(({ code, name }) => {
            const selected = code === lang;
            return (
              <li key={code} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => { setLang(code); setOpen(false); }}
                  className={`flex items-center justify-between gap-3 w-full text-left text-sm font-medium transition-colors duration-150 ${isMobile ? 'px-4 py-3 rounded-xl' : 'px-3.5 py-2'}`}
                  style={{
                    color:      selected ? 'var(--accent)' : 'var(--text-2)',
                    background: selected ? 'var(--accent-bg)' : 'transparent',
                  }}
                  onMouseEnter={e => { if (!selected) e.currentTarget.style.background = 'var(--bg-3)'; }}
                  onMouseLeave={e => { if (!selected) e.currentTarget.style.background = 'transparent'; }}
                  onFocus={e => { if (!selected) e.currentTarget.style.background = 'var(--bg-3)'; }}
                  onBlur={e => { if (!selected) e.currentTarget.style.background = 'transparent'; }}
                >
                  <span>{name}</span>
                  <span className="text-xs font-semibold uppercase" style={{ color: 'var(--text-3)' }}>{code}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
