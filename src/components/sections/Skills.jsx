import RevealOnScroll from '../ui/RevealOnScroll';
import TechIcon from '../icons/TechIcon';
import { useLanguage } from '../../context/LanguageContext';
import { skillCategories } from '../../data/skills';

function SkillChip({ icon, label, featured }) {
  return (
    <div
      className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium ${featured ? 'border-2 font-semibold' : ''}`}
      style={
        // Destaque com 3 sinais reforçando um ao outro (fundo mais saturado,
        // borda sólida — não só mais grossa — e texto na cor de destaque, não
        // mais a mesma cor do texto normal), pra registrar num scan rápido em
        // vez de depender só da espessura da borda.
        featured
          ? { background: 'var(--accent-border)', borderColor: 'var(--accent)', color: 'var(--accent)' }
          : { background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-2)' }
      }
    >
      <TechIcon name={icon} className="w-5 h-5 shrink-0" />
      {label}
    </div>
  );
}

export default function Skills() {
  const { t } = useLanguage();
  return (
    <section id="skills" className="section-pad" style={{ background: 'var(--bg)', paddingBottom: 'clamp(0.5rem, 1.5vw, 1rem)' }}>
      <div className="max-w-container mx-auto px-6">

        {/* Heading */}
        <RevealOnScroll>
          <div className="mb-12">
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-3.5"
              style={{ background: 'var(--accent-bg)', border: '1px solid var(--accent-border)', color: 'var(--accent)' }}
            >
              {t('skills.kicker')}
            </div>
            <h2
              className="font-display font-bold"
              style={{ fontSize: 'clamp(1.875rem, 4.5vw, 2.5rem)', letterSpacing: '-.04em', lineHeight: 1.15, color: 'var(--text)' }}
            >
              {t('skills.heading')}
            </h2>
            <p className="mt-3 text-sm" style={{ color: 'var(--text-2)' }}>
              {t('skills.subtitle')}
            </p>
          </div>
        </RevealOnScroll>

        {/* Tecnologias por área */}
        <div className="flex flex-col gap-7">
          {skillCategories.map(({ label, items }) => (
            <div key={label}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-3)' }}>
                {t(`skills.categories.${label}`)}
              </p>
              <div className="flex flex-wrap gap-2.5">
                {items.map(({ icon, label: skillLabel, featured }) => (
                  <SkillChip key={skillLabel} icon={icon} label={skillLabel} featured={featured} />
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
