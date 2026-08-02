# Portfólio — Victor Augusto

[![CI](https://github.com/victoraugustovalle/PortifolioVictorAugusto/actions/workflows/ci.yml/badge.svg)](https://github.com/victoraugustovalle/PortifolioVictorAugusto/actions/workflows/ci.yml)

Código-fonte do meu portfólio pessoal: quem eu sou, onde já trabalhei, o que já construí e como falar comigo. Site em português, inglês e espanhol, com tema claro/escuro e SEO pensado desde a estrutura, não como retrofit.

**Produção:** [victoraugusto.dev](https://victoraugusto.dev)

## Stack

- [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Puppeteer](https://pptr.dev/) para pré-renderização (cada idioma vira HTML estático real no build, não só um `<div id="root">` vazio para quem não roda JS)
- [Sharp](https://sharp.pixelplumbing.com/) para gerar imagens responsivas (WebP/AVIF em múltiplos tamanhos)

Sem framework de rota nem backend: é uma SPA de página única, com o build de produção servido como arquivos estáticos.

## Funcionalidades

- **Três idiomas** (pt-BR, en, es), com detecção automática pelo navegador e troca manual persistida via parâmetro de URL (`?lang=`)
- **Tema claro/escuro**, com preferência salva localmente
- **Projetos como produtos reais**: cada card abre uma modal com descrição, tags, link de código e link ao vivo (quando existem)
- **Carrossel de imagens acessível** (autoplay pausável, navegação por teclado, respeita `prefers-reduced-motion`)
- **SEO técnico completo**: dados estruturados (`schema.org` Person/WebSite), `hreflang` cruzado entre os três idiomas, sitemap com imagens, Open Graph e Twitter Card, e pré-renderização real por rota

## Estrutura

```
src/
  components/
    sections/    Hero, Sobre, Skills, Experiência, Certificações, Projetos, Eventos, Contato
    ui/          Modal de projeto, carrossel, seletor de idioma, animações de scroll
  context/       Tema (claro/escuro) e idioma
  data/          Conteúdo estruturado (projetos, experiência, skills, certificações, eventos)
  i18n/          Dicionários de tradução (pt/en/es)
scripts/         Geração de imagens otimizadas, OG image, sitemap e pré-renderização
public/          Assets estáticos, manifest, robots.txt
```

## Rodando localmente

```bash
npm install
npm run dev
```

Build de produção (gera imagens otimizadas, sitemap e o pré-render de cada idioma):

```bash
npm run build
npm run preview
```

## Sobre mim

Analista de Sistemas / Desenvolvedor Full Stack em Belo Horizonte, atualmente na Attime, trabalhando com .NET, C# e integrações bancárias. Formando em Sistemas de Informação pela COTEMIG.

- [LinkedIn](https://www.linkedin.com/in/victor-augusto-developer/)
- [GitHub](https://github.com/victoraugustovalle)
