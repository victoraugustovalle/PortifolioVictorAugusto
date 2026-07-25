/* Tecnologias agrupadas por área — itens com featured:true são as
 * especialidades principais, destacadas visualmente dentro da própria
 * categoria (sem repetir o item numa lista separada).
 * `icon` referencia uma chave de src/components/icons/TechIcon.jsx. */
export const skillCategories = [
  {
    label: 'Frontend',
    items: [
      { icon: 'html5',      label: 'HTML5' },
      { icon: 'css3',       label: 'CSS3' },
      { icon: 'javascript', label: 'JavaScript' },
      { icon: 'typescript', label: 'TypeScript' },
      { icon: 'react',      label: 'React' },
      { icon: 'angularjs',  label: 'Angular' },
    ],
  },
  {
    label: 'Backend',
    items: [
      { icon: 'csharp',      label: 'C#',  featured: true },
      { icon: 'dotnet',      label: '.NET', featured: true },
      { icon: 'nodejs',      label: 'Node.js' },
      { icon: 'express',     label: 'Express' },
      { icon: 'java',        label: 'Java' },
      { icon: 'php',         label: 'PHP' },
      { icon: 'visualbasic', label: 'Visual Basic' },
    ],
  },
  {
    label: 'Banco de Dados',
    items: [
      { icon: 'mysql', label: 'MySQL',      featured: true },
      { icon: 'mssql', label: 'SQL Server', featured: true },
      { icon: 'oracle', label: 'Oracle SQL' },
    ],
  },
  {
    label: 'Design & Ferramentas',
    items: [
      { icon: 'git',   label: 'Git' },
      { icon: 'figma', label: 'Figma' },
    ],
  },
];
