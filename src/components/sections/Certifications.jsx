import { useState } from 'react';
import RevealOnScroll from '../ui/RevealOnScroll';
import { useLanguage } from '../../context/LanguageContext';
import { certifications } from '../../data/certifications';

function BadgePlaceholder() {
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center gap-2"
      style={{ background: 'var(--bg-3)' }}
    >
      <svg
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--border-2)"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M8 8H4l2 8h12l2-8h-4" />
        <path d="M9 16l1 4h4l1-4" />
      </svg>
      <span className="text-xs" style={{ color: 'var(--text-3)' }}>
        badge
      </span>
    </div>
  );
}

function CertCard({ cert }) {
  const { t } = useLanguage();
  const { name, issuer, year, img, link } = cert;
  const [imgError, setImgError] = useState(false);

  const Card = link ? 'a' : 'div';
  const linkProps = link
    ? { href: link, target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <Card
      {...linkProps}
      className="flex flex-col items-center text-center rounded-2xl p-5 h-full w-full transition-all duration-200 group"
      style={{
        background:   'var(--bg-card)',
        border:       '1px solid var(--border)',
        cursor:       link ? 'pointer' : 'default',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--accent-border)';
        e.currentTarget.style.boxShadow   = 'var(--shadow)';
        e.currentTarget.style.transform   = 'translateY(-4px)';
      }}
      onFocus={e => {
        e.currentTarget.style.borderColor = 'var(--accent-border)';
        e.currentTarget.style.boxShadow   = 'var(--shadow)';
        e.currentTarget.style.transform   = 'translateY(-4px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.boxShadow   = 'none';
        e.currentTarget.style.transform   = 'translateY(0)';
      }}
      onBlur={e => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.boxShadow   = 'none';
        e.currentTarget.style.transform   = 'translateY(0)';
      }}
    >
      {/* Badge image */}
      <div
        className="overflow-hidden rounded-xl mb-4 shrink-0"
        style={{ width: 120, height: 120 }}
      >
        {!imgError ? (
          <img
            src={img}
            alt={name}
            loading="lazy"
            width={120}
            height={120}
            className="w-full h-full object-contain"
            onError={(e) => { console.warn('Badge não carregou:', e.currentTarget.src); setImgError(true); }}
          />
        ) : (
          <BadgePlaceholder />
        )}
      </div>

      {/* Text */}
      <div className="flex flex-col gap-1 flex-1">
        <p
          className="font-semibold text-sm leading-snug"
          style={{ color: 'var(--text)' }}
        >
          {name}
        </p>
        <p
          className="text-xs"
          style={{ color: 'var(--accent)', fontWeight: 500 }}
        >
          {issuer}
        </p>
        <p
          className="text-xs mt-0.5"
          style={{ color: 'var(--text-3)' }}
        >
          {year}
        </p>
      </div>

      {/* Link indicator */}
      {link && (
        <div
          className="mt-3 flex items-center gap-1 text-xs font-medium"
          style={{ color: 'var(--accent)' }}
        >
          {t('certifications.verify')}
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3"/>
          </svg>
        </div>
      )}
    </Card>
  );
}

/*
 * Subseção embutida em Experience — certificações são "qualificações",
 * mesma categoria de Formação. Não é uma <section> própria: sem entrada
 * de menu dedicada, o conteúdo vive dentro do item de nav "Experiência".
 */
export default function Certifications() {
  const { t } = useLanguage();
  return (
    <div id="certifications">
      <RevealOnScroll>
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-3)' }}>
            {t('certifications.kicker')}
          </p>
          <h3
            className="font-display font-bold"
            style={{ fontSize: '1.25rem', letterSpacing: '-.02em', lineHeight: 1.25, color: 'var(--text)' }}
          >
            {t('certifications.heading')}
          </h3>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-2)', maxWidth: 480, lineHeight: 1.6 }}>
            {t('certifications.subtitle')}
          </p>
        </div>
      </RevealOnScroll>

      {/* Grid de badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {certifications.map((cert) => (
          <CertCard key={cert.id} cert={cert} />
        ))}
      </div>
    </div>
  );
}
