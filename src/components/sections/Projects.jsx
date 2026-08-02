import { useState } from 'react';
import RevealOnScroll from '../ui/RevealOnScroll';
import ProjectModal from '../ui/ProjectModal';
import ResponsiveImage from '../ui/ResponsiveImage';
import { useLanguage } from '../../context/LanguageContext';
import { projects } from '../../data/projects';

function translateProject(project, t) {
  const tr = t(`projects.items.${project.id}`);
  if (typeof tr !== 'object' || tr === null) return project;
  return {
    ...project,
    desc:      tr.desc ?? project.desc,
    longDesc:  tr.longDesc ?? project.longDesc,
    badge:     tr.badge ?? project.badge,
    alt:       tr.alt ?? project.alt,
    liveLabel: tr.liveLabel ?? project.liveLabel,
    images: project.images
      ? project.images.map((img, i) => ({ ...img, alt: tr.images?.[i] ?? img.alt }))
      : project.images,
  };
}

function ProjectTag({ label }) {
  return (
    <span
      className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
      style={{ background: 'var(--accent-bg)', border: '1px solid var(--accent-border)', color: 'var(--accent)' }}
    >
      {label}
    </span>
  );
}

function ProjectCard({ project, onOpen }) {
  const { t } = useLanguage();
  const { title, desc, longDesc, tags, img, alt, images, badge, gradient, gradientStyle, githubUrl, liveUrl } = project;
  const hasLinks = githubUrl || liveUrl;
  const cardImg = images?.length ? images[0] : img ? { src: img, alt } : null;

  /* Compartilhado entre mouse (hover) e teclado (focus) — sem isso, quem
     navega por Tab só recebe o contorno fino do :focus-visible global,
     sem a elevação/sombra que confirma visualmente "isto está selecionado". */
  const handleActivate = e => {
    e.currentTarget.style.transform   = 'translateY(-5px)';
    e.currentTarget.style.boxShadow   = 'var(--shadow-lg)';
    e.currentTarget.style.borderColor = 'var(--border-2)';
    const img = e.currentTarget.querySelector('.proj-img');
    if (img) img.style.transform = 'scale(1.05)';
    const cta = e.currentTarget.querySelector('.proj-cta');
    if (cta) { cta.style.color = 'var(--accent-hover)'; cta.style.gap = '.625rem'; }
  };
  const handleDeactivate = e => {
    e.currentTarget.style.transform   = 'translateY(0)';
    e.currentTarget.style.boxShadow   = 'none';
    e.currentTarget.style.borderColor = 'var(--border)';
    const img = e.currentTarget.querySelector('.proj-img');
    if (img) img.style.transform = 'scale(1)';
    const cta = e.currentTarget.querySelector('.proj-cta');
    if (cta) { cta.style.color = 'var(--accent)'; cta.style.gap = '.375rem'; }
  };

  return (
    <div
      className="flex flex-col overflow-hidden transition-all duration-300"
      style={{
        background:   'var(--bg-card)',
        border:       '1px solid var(--border)',
        borderRadius: 20,
      }}
      onMouseEnter={handleActivate}
      onMouseLeave={handleDeactivate}
      onFocus={handleActivate}
      onBlur={handleDeactivate}
    >
      {/* Thumb — botão real (abre a modal com galeria/links); a longDesc
          abaixo já mostra o conteúdo denso sem exigir clique nenhum. */}
      <button
        type="button"
        onClick={() => onOpen(project)}
        aria-label={`${t('projects.detailsCta')}: ${title}`}
        className="block w-full text-left"
        style={{ padding: 0, border: 'none', background: 'none', font: 'inherit', cursor: 'pointer' }}
      >
      {cardImg ? (
        <div style={{ aspectRatio: '16/9', overflow: 'hidden', background: 'var(--bg-2)', position: 'relative' }}>
          <ResponsiveImage
            src={cardImg.src}
            alt={cardImg.alt || title}
            loading="lazy"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            width={1280}
            height={720}
            style={{ width: '100%', height: '100%' }}
            imgClassName="proj-img transition-transform duration-500"
            objectPosition="top"
          />
          {badge && (
            <>
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,.55) 0%, transparent 45%)' }}
              />
              <div
                className="absolute left-3 bottom-3 text-xs px-3 py-1 rounded-full"
                style={{ background: 'rgba(0,0,0,.35)', color: 'rgba(255,255,255,.9)' }}
              >
                {badge}
              </div>
            </>
          )}
        </div>
      ) : gradient ? (
        <div
          style={{
            aspectRatio: '16/9',
            background:  gradientStyle,
            display:     'flex',
            flexDirection: 'column',
            alignItems:  'center',
            justifyContent: 'center',
            gap:         '.75rem',
            position:    'relative',
            overflow:    'hidden',
          }}
        >
          {/* subtle circle overlay */}
          <div
            aria-hidden="true"
            style={{
              position:   'absolute', inset: 0,
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='30' cy='30' r='20' fill='%23ffffff' fill-opacity='0.05'/%3E%3C/svg%3E\")",
            }}
          />
          <div
            className="font-display font-extrabold text-white relative"
            style={{ fontSize: '1.75rem', textShadow: '0 2px 12px rgba(0,0,0,.2)' }}
          >
            {title}
          </div>
          {badge && (
            <div
              className="text-xs relative px-3 py-1 rounded-full"
              style={{ background: 'rgba(0,0,0,.2)', color: 'rgba(255,255,255,.8)' }}
            >
              {badge}
            </div>
          )}
        </div>
      ) : (
        <div
          style={{
            aspectRatio: '16/9',
            background:  'var(--bg-3)',
            display:     'flex',
            alignItems:  'center',
            justifyContent: 'center',
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--border-2)" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
            <path d="M21 15l-5-5L5 21"/>
          </svg>
        </div>
      )}
      </button>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        <h3
          className="font-display font-bold mb-2 leading-snug"
          style={{ fontSize: '1rem', color: 'var(--text)' }}
        >
          {title}
        </h3>
        <p
          className="text-sm leading-relaxed flex-1 mb-4"
          style={{ color: 'var(--text-2)', textAlign: 'left' }}
        >
          {desc}
        </p>

        {/* longDesc no HTML normal do card, via <details> nativo — fica
            presente (e indexável) no HTML estático mesmo fechado, sem
            depender de clique via JS para existir no DOM. */}
        {longDesc && (
          <details className="mb-4">
            <summary
              style={{
                cursor: 'pointer',
                fontSize: '.8125rem',
                fontWeight: 600,
                color: 'var(--accent)',
              }}
            >
              {t('projects.readMore')}
            </summary>
            <p
              className="text-sm leading-relaxed mt-2"
              style={{ color: 'var(--text-2)', textAlign: 'left' }}
            >
              {longDesc}
            </p>
          </details>
        )}

        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.map(tag => <ProjectTag key={tag} label={tag} />)}
        </div>

        {hasLinks ? (
          <button
            type="button"
            onClick={() => onOpen(project)}
            className="proj-cta inline-flex items-center gap-1.5 text-sm font-semibold transition-all duration-200 w-fit"
            style={{ color: 'var(--accent)', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
          >
            {t('projects.detailsCta')}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        ) : (
          <span className="text-xs" style={{ color: 'var(--text-3)' }}>{t('projects.privateLabel')}</span>
        )}
      </div>
    </div>
  );
}

export default function Projects() {
  const { t } = useLanguage();
  const [selected, setSelected] = useState(null);
  const translatedProjects = projects.map(p => translateProject(p, t));

  return (
    <section id="projects" className="section-pad" style={{ background: 'var(--bg)', paddingTop: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
      <div className="max-w-container mx-auto px-6">

        {/* Section header */}
        <RevealOnScroll>
          <div className="mb-14">
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-3.5"
              style={{ background: 'var(--accent-bg)', border: '1px solid var(--accent-border)', color: 'var(--accent)' }}
            >
              {t('projects.kicker')}
            </div>
            <h2
              className="font-display font-bold"
              style={{ fontSize: 'clamp(1.875rem, 4.5vw, 2.5rem)', letterSpacing: '-.04em', lineHeight: 1.15, color: 'var(--text)' }}
            >
              {t('projects.heading')}
            </h2>
            <p className="mt-3 text-base" style={{ color: 'var(--text-2)', maxWidth: 500, lineHeight: 1.7 }}>
              {t('projects.subtitle')}
            </p>
          </div>
        </RevealOnScroll>

        {/* Grid 3-col */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {translatedProjects.map((p) => (
            <ProjectCard key={p.id} project={p} onOpen={setSelected} />
          ))}
        </div>

        {/* GitHub CTA */}
        <div className="text-center">
          <a
            href="https://github.com/victoraugustovalle"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border transition-all duration-200"
            style={{
              color:       'var(--text-2)',
              borderColor: 'var(--border-2)',
              background:  'transparent',
              borderRadius: 14,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color       = 'var(--accent)';
              e.currentTarget.style.borderColor = 'var(--accent-border)';
              e.currentTarget.style.background  = 'var(--accent-bg)';
              e.currentTarget.style.transform   = 'translateY(-2px)';
            }}
            onFocus={e => {
              e.currentTarget.style.color       = 'var(--accent)';
              e.currentTarget.style.borderColor = 'var(--accent-border)';
              e.currentTarget.style.background  = 'var(--accent-bg)';
              e.currentTarget.style.transform   = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color       = 'var(--text-2)';
              e.currentTarget.style.borderColor = 'var(--border-2)';
              e.currentTarget.style.background  = 'transparent';
              e.currentTarget.style.transform   = 'translateY(0)';
            }}
            onBlur={e => {
              e.currentTarget.style.color       = 'var(--text-2)';
              e.currentTarget.style.borderColor = 'var(--border-2)';
              e.currentTarget.style.background  = 'transparent';
              e.currentTarget.style.transform   = 'translateY(0)';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.165 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.604-3.369-1.341-3.369-1.341-.454-1.154-1.11-1.461-1.11-1.461-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.087.636-1.337-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/>
            </svg>
            {t('projects.githubCta')}
          </a>
        </div>

      </div>

      {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
