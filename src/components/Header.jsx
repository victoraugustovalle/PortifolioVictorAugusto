import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from './ui/LanguageSwitcher';

const navKeys = [
  { href: '#home',       key: 'home' },
  { href: '#about',      key: 'about' },
  { href: '#skills',     key: 'skills' },
  { href: '#projects',   key: 'projects' },
  { href: '#experience', key: 'experience' },
  { href: '#contact',    key: 'contact' },
];

export default function Header() {
  const { dark, toggle } = useTheme();
  const { t } = useLanguage();
  const navLinks = navKeys.map(({ href, key }) => ({ href, label: t(`header.nav.${key}`) }));
  const [scrolled,     setScrolled]     = useState(false);
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [activeLink,   setActiveLink]   = useState('home');
  const panelRef     = useRef(null);
  const hamburgerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);

      const scrollY = window.scrollY + 90;
      const sections = document.querySelectorAll('section[id]');
      sections.forEach(s => {
        if (scrollY >= s.offsetTop && scrollY < s.offsetTop + s.offsetHeight)
          setActiveLink(s.id);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
    hamburgerRef.current?.focus();
  };

  // Esc fecha o painel e Tab fica preso dentro dele enquanto estiver aberto (WCAG 2.4.3 / 4.1.2)
  useEffect(() => {
    if (!menuOpen) return;

    const focusables = Array.from(
      panelRef.current?.querySelectorAll('a[href], button:not([disabled])') ?? []
    );
    focusables[0]?.focus();

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeMenu();
        return;
      }
      if (e.key === 'Tab' && focusables.length) {
        const first = focusables[0];
        const last  = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  const headerBg = scrolled
    ? 'shadow-sm'
    : '';

  return (
    <>
      <header
        style={{ background: 'var(--nav-bg)', borderBottom: '1px solid var(--border)', height: 'var(--nav-h)' }}
        className={`fixed top-0 left-0 w-full z-50 backdrop-blur-md transition-shadow ${headerBg}`}
      >
        <div className="max-w-container mx-auto px-6 h-full flex items-center justify-between gap-8">

          {/* Logo */}
          <a href="#home" className="font-display text-[.95rem] font-bold shrink-0 tracking-tight" style={{ color: 'var(--text)' }}>
            Victor <span style={{ color: 'var(--accent)' }}>Augusto</span>
          </a>

          {/* Desktop nav */}
          <ul className="hidden lg:flex items-center ml-auto">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  className="px-3.5 py-1.5 text-sm font-medium rounded-lg transition-all duration-200"
                  style={{
                    color: activeLink === href.slice(1) ? 'var(--accent)' : 'var(--text-2)',
                    background: activeLink === href.slice(1) ? 'var(--accent-bg)' : 'transparent',
                  }}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-1 min-[360px]:gap-2 shrink-0">
            {/* Language switcher */}
            <LanguageSwitcher />

            {/* Theme toggle */}
            <button
              onClick={toggle}
              aria-label={t('header.themeToggle')}
              className="relative flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 tap-target-40"
              style={{ color: 'var(--text-2)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-3)'; e.currentTarget.style.color = 'var(--text)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-2)'; }}
              onFocus={e => { e.currentTarget.style.background = 'var(--bg-3)'; e.currentTarget.style.color = 'var(--text)'; }}
              onBlur={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-2)'; }}
            >
              {dark ? (
                /* Sun */
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                /* Moon */
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>

            {/* CV download */}
            <a
              href="/pdf/curriculo.pdf"
              download
              className="hidden lg:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200"
              style={{ background: 'var(--accent)', boxShadow: 'var(--shadow-accent)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-hover)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              onFocus={e => { e.currentTarget.style.background = 'var(--accent-hover)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onBlur={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {t('header.cvDownload')}
            </a>

            {/* Hamburger (mobile) */}
            <button
              ref={hamburgerRef}
              className="relative flex lg:hidden items-center justify-center w-9 h-9 rounded-lg tap-target-40"
              style={{ color: 'var(--text-2)' }}
              onClick={() => setMenuOpen(true)}
              aria-label={t('header.openMenu')}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6"  x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        aria-hidden="true"
        className={`fixed inset-0 z-[200] transition-all duration-300 ${menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        style={{ background: 'rgba(15,23,42,0.5)' }}
        onClick={closeMenu}
      />

      {/* Mobile panel */}
      <div
        ref={panelRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label={t('header.navMenuLabel')}
        inert={menuOpen ? undefined : true}
        className={`fixed top-0 right-0 h-dvh z-[300] flex flex-col p-5 transition-transform duration-300 ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ width: 'min(300px, 90vw)', background: 'var(--bg)', borderLeft: '1px solid var(--border)' }}
      >
        <div className="flex justify-between items-center mb-8">
          <span className="font-display text-sm font-bold" style={{ color: 'var(--text)' }}>
            Victor <span style={{ color: 'var(--accent)' }}>Augusto</span>
          </span>
          <button onClick={closeMenu} aria-label={t('header.closeMenu')} style={{ color: 'var(--text-2)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6"  y2="18"/>
              <line x1="6"  y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* CV download — destaque, primeira ação do painel mobile */}
        <a
          href="/pdf/curriculo.pdf"
          download
          onClick={closeMenu}
          className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-base font-semibold text-white mb-5 transition-all duration-200"
          style={{ background: 'var(--accent)', boxShadow: 'var(--shadow-accent)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          {t('header.cvDownload')}
        </a>

        <div className="mb-4">
          <LanguageSwitcher variant="mobile" />
        </div>

        <ul className="flex flex-col gap-1">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                onClick={closeMenu}
                className="block px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-200"
                style={{ color: 'var(--text-2)' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-bg)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-2)'; e.currentTarget.style.background = 'transparent'; }}
                onFocus={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-bg)'; }}
                onBlur={e => { e.currentTarget.style.color = 'var(--text-2)'; e.currentTarget.style.background = 'transparent'; }}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
