import RevealOnScroll from '../ui/RevealOnScroll';
import ResponsiveImage from '../ui/ResponsiveImage';
import { useLanguage } from '../../context/LanguageContext';

export default function About() {
  const { t } = useLanguage();
  const stats = t('about.stats');
  return (
    <section id="about" className="section-pad" style={{ background: 'var(--bg-2)' }}>
      <div className="max-w-container mx-auto px-6">

        {/* Heading */}
        <RevealOnScroll>
          <div className="mb-10">
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-3.5"
              style={{ background: 'var(--accent-bg)', border: '1px solid var(--accent-border)', color: 'var(--accent)' }}
            >
              {t('about.kicker')}
            </div>
            <h2
              className="font-display font-bold"
              style={{ fontSize: 'clamp(1.875rem, 4.5vw, 2.5rem)', letterSpacing: '-.04em', lineHeight: 1.15, color: 'var(--text)' }}
            >
              {t('about.heading')}
            </h2>
          </div>
        </RevealOnScroll>

        {/* Card */}
        <div
          className="about-card"
          style={{
            background:   'var(--bg-card)',
            border:       '1px solid var(--border)',
            borderRadius: 24,
            overflow:     'hidden',
            boxShadow:    'var(--shadow-sm)',
          }}
        >
          {/* Photo */}
          <div className="about-card-photo">
            <ResponsiveImage
              src="/eventos/GDG.jpeg"
              alt={t('about.photoAlt')}
              loading="lazy"
              sizes="(min-width: 700px) 50vw, 100vw"
              width={800}
              height={460}
              style={{ width: '100%', height: '100%' }}
            />
          </div>

          {/* Content */}
          <div className="about-card-content">
            <p
              className="text-sm md:text-base leading-relaxed"
              style={{ color: 'var(--text-2)', textAlign: 'left' }}
            >
              {t('about.bio')}
            </p>

            <div className="about-card-stats">
              {stats.map(({ n, label }) => (
                <div key={n}>
                  <div className="about-card-stat-n">{n}</div>
                  <div className="about-card-stat-l">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </section>
  );
}
