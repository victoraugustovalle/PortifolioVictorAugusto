import RevealOnScroll from '../ui/RevealOnScroll';
import { useLanguage } from '../../context/LanguageContext';

export default function Hero() {
  const { t } = useLanguage();
  return (
    <section
      id="home"
      className="hero-section flex items-center relative overflow-hidden"
      style={{ background: 'var(--bg)', paddingTop: 'var(--nav-h)' }}
    >
      <div className="hero-dot-grid" aria-hidden="true" />
      <div className="hero-glow" aria-hidden="true" />

      <div className="max-w-container mx-auto px-6 w-full relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] gap-16 md:gap-20 items-center py-16 md:py-20">

          {/* Text — cabeçalho da página, único elemento com reveal */}
          <RevealOnScroll>
            <div>
              <h1 className="hero-name mb-5">
                <span className="hero-name-pre">Victor</span>{' '}
                <span className="hero-name-main">Augusto</span>
                {/* Visível só para leitores de tela e crawlers — carrega a
                    palavra-chave principal no H1 sem alterar o layout visual. */}
                <span className="sr-only">{t('hero.srTitle')}</span>
              </h1>

              <p
                className="text-base leading-relaxed mb-9 max-w-[500px]"
                style={{ color: 'var(--text-2)' }}
              >
                {t('hero.subtitle')}
              </p>

              <div className="flex gap-3 flex-wrap mb-8">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200"
                  style={{ background: 'var(--accent)', boxShadow: 'var(--shadow-accent)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-hover)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  onFocus={e => { e.currentTarget.style.background = 'var(--accent-hover)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onBlur={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  {t('hero.ctaContact')}
                </a>
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200"
                  style={{ color: 'var(--text-2)', borderColor: 'var(--border-2)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.borderColor = 'var(--accent-border)'; e.currentTarget.style.background = 'var(--accent-bg)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-2)'; e.currentTarget.style.borderColor = 'var(--border-2)'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  onFocus={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.borderColor = 'var(--accent-border)'; e.currentTarget.style.background = 'var(--accent-bg)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onBlur={e => { e.currentTarget.style.color = 'var(--text-2)'; e.currentTarget.style.borderColor = 'var(--border-2)'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  {t('hero.ctaProjects')}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
              </div>
            </div>
          </RevealOnScroll>

          {/* Photo — entra junto, sem fade próprio (já tem a animação de flutuação) */}
          <div className="flex justify-center md:justify-end order-first md:order-last">
            <div
              className="relative"
              style={{ width: 300, height: 340, animation: 'float-y 6s ease-in-out infinite' }}
            >
              <div className="hero-photo-ring" />
              <div
                className="relative z-10 w-full h-full overflow-hidden border-[3px]"
                style={{ borderRadius: 28, borderColor: 'var(--bg)', background: 'var(--bg-2)' }}
              >
                <img
                  src="/victor.jpg"
                  alt="Victor Augusto"
                  fetchPriority="high"
                  width={300}
                  height={340}
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
