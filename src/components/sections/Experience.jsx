import RevealOnScroll from '../ui/RevealOnScroll';
import Certifications from './Certifications';
import { useLanguage } from '../../context/LanguageContext';
import { jobs, education } from '../../data/experience';

function Tag({ label, accent = false }) {
  return (
    <span
      className="text-xs font-semibold px-2.5 py-1 rounded-md"
      style={
        accent
          ? { background: 'var(--accent-bg)', color: 'var(--accent)', border: '1px solid var(--accent-border)' }
          : { background: 'var(--bg-3)', color: 'var(--text-2)', border: '1px solid var(--border)' }
      }
    >
      {label}
    </span>
  );
}

function ColumnHeading({ icon, label }) {
  return (
    <div
      className="flex items-center gap-2 mb-6 text-sm font-semibold"
      style={{ color: 'var(--text)' }}
    >
      {icon}
      {label}
    </div>
  );
}

export default function Experience() {
  const { t } = useLanguage();
  const translatedJobs = jobs.map(j => ({
    ...j,
    role:   t(`experience.jobs.${j.id}.role`),
    period: t(`experience.jobs.${j.id}.period`),
    desc:   t(`experience.jobs.${j.id}.desc`),
  }));
  const translatedEducation = education.map(e => ({
    ...e,
    title:  t(`experience.education.${e.id}.title`),
    period: t(`experience.education.${e.id}.period`),
  }));

  return (
    <section id="experience" className="section-pad" style={{ background: 'var(--bg-2)', paddingBottom: 'clamp(2rem, 4vw, 3rem)' }}>
      <div className="max-w-container mx-auto px-6">

        {/* Section header */}
        <RevealOnScroll>
          <div className="mb-12">
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-3.5"
              style={{ background: 'var(--accent-bg)', border: '1px solid var(--accent-border)', color: 'var(--accent)' }}
            >
              {t('experience.kicker')}
            </div>
            <h2
              className="font-display font-bold"
              style={{ fontSize: 'clamp(1.875rem, 4.5vw, 2.5rem)', letterSpacing: '-.04em', lineHeight: 1.15, color: 'var(--text)' }}
            >
              {t('experience.heading')}
            </h2>
          </div>
        </RevealOnScroll>

        {/* Duas colunas — Experiência e Formação lado a lado (empilha no mobile) */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-start">

          {/* Experiência — cards */}
          <div>
            <ColumnHeading
              label={t('experience.experienceColumn')}
              icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>}
            />
            <div className="flex flex-col gap-4">
              {translatedJobs.map((j, i) => (
                <div
                  key={j.id}
                  className="rounded-xl p-7 transition-all duration-200"
                  style={{
                    background: 'var(--bg-card)',
                    border:     '1px solid var(--border)',
                    borderRadius: 20,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow)'; e.currentTarget.style.borderColor = 'var(--border-2)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  onFocus={e => { e.currentTarget.style.boxShadow = 'var(--shadow)'; e.currentTarget.style.borderColor = 'var(--border-2)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onBlur={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  {/* Card header */}
                  <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
                    <div>
                      <div
                        className="font-display font-bold mb-1"
                        style={{ fontSize: '1.1rem', color: 'var(--text)' }}
                      >
                        {j.company}
                      </div>
                      <div className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
                        {j.role}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {i === 0 && (
                        <div
                          className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                          style={{ background: 'var(--accent-bg)', color: 'var(--accent)', border: '1px solid var(--accent-border)' }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: 'var(--accent)', display: 'inline-block', animation: 'pulse-dot 1.8s ease-in-out infinite' }}
                          />
                          {t('experience.currentBadge')}
                        </div>
                      )}
                      <div
                        className="text-xs font-semibold whitespace-nowrap px-3 py-1.5 rounded-full"
                        style={{ background: 'var(--bg-3)', color: 'var(--text-3)' }}
                      >
                        {j.period}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-2)', textAlign: 'left' }}>
                    {j.desc}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {j.tags.map(tag => <Tag key={tag} label={tag} />)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Formação — timeline com pontilhado */}
          <div>
            <ColumnHeading
              label={t('experience.educationColumn')}
              icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>}
            />
            <div
              style={{
                position:    'relative',
                paddingLeft: '1.75rem',
                display:     'flex',
                flexDirection: 'column',
                gap:         0,
              }}
            >
              {/* Linha vertical */}
              <div
                aria-hidden="true"
                style={{
                  position:  'absolute',
                  left:      0,
                  top:       '.5rem',
                  bottom:    '.5rem',
                  width:     '1.5px',
                  background: 'var(--border)',
                }}
              />

              {translatedEducation.map((e, i) => (
                <div
                  key={e.id}
                  style={{
                    position:      'relative',
                    padding:       i === translatedEducation.length - 1 ? '.25rem 0 0' : '.25rem 0 2rem',
                  }}
                >
                  {/* Dot */}
                  <div
                    aria-hidden="true"
                    style={{
                      position:    'absolute',
                      left:        '-1.75rem',
                      top:         '.5rem',
                      width:       9,
                      height:      9,
                      background:  'var(--accent)',
                      border:      '2px solid var(--bg-2)',
                      borderRadius: '50%',
                      transform:   'translateX(-4px)',
                      boxShadow:   '0 0 0 3px var(--accent-bg)',
                    }}
                  />

                  <div
                    className="text-xs font-semibold mb-1"
                    style={{ color: 'var(--accent)' }}
                  >
                    {e.period}
                  </div>
                  <div
                    className="font-semibold mb-0.5"
                    style={{ fontSize: '.975rem', color: 'var(--text)' }}
                  >
                    {e.title}
                  </div>
                  <div className="text-sm" style={{ color: 'var(--text-2)' }}>
                    {e.place}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="mt-14 mb-10 flex items-center gap-4" style={{ color: 'var(--text-3)' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        {/* Certificações — mesma categoria de "qualificações" que Formação */}
        <Certifications />

      </div>
    </section>
  );
}
