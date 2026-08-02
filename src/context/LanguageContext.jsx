import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { dictionaries, DEFAULT_LANG, SUPPORTED_LANGS, isSupportedLang } from '../i18n';

const LanguageContext = createContext();

const SITE_ORIGIN = 'https://victoraugusto.dev';
const HTML_LANG  = { pt: 'pt-BR', en: 'en', es: 'es' };
const OG_LOCALE  = { pt: 'pt_BR', en: 'en_US', es: 'es_419' };
const MANIFEST_HREF = { pt: '/site.webmanifest', en: '/site.en.webmanifest', es: '/site.es.webmanifest' };

const FULL_NAME = 'Victor Augusto Dias Mendes do Valle';
const SOCIAL_LINKS = [
  'https://github.com/victoraugustovalle',
  'https://www.linkedin.com/in/victor-augusto-developer/',
];

/* Idioma sem prefixo mora em '/'; os demais moram em '/en/', '/es/' —
   URL própria e crawlável por idioma, sem depender de query string. */
function pathForLang(lang) {
  return lang === DEFAULT_LANG ? '/' : `/${lang}/`;
}

function getPathLang() {
  const first = window.location.pathname.split('/').filter(Boolean)[0];
  return first && first !== DEFAULT_LANG && isSupportedLang(first) ? first : DEFAULT_LANG;
}

/* Compat com links antigos no formato ?lang=en salvos antes da migração
   para rota por idioma. */
function getLegacyQueryLang() {
  const value = new URLSearchParams(window.location.search).get('lang');
  return isSupportedLang(value) && value !== DEFAULT_LANG ? value : null;
}

function resolve(dict, path) {
  return path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), dict);
}

function setMetaTag(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLinkTag(selector, attrs) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('link');
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    document.head.appendChild(el);
  }
  el.setAttribute('href', attrs.href);
}

/* Person + WebSite — mesmo <script id="ld-json"> declarado como baseline
   estático em index.html, com jobTitle/name/url/inLanguage atualizados
   para o idioma ativo. */
function setJsonLd(lang) {
  const dict = dictionaries[lang];
  const url = SITE_ORIGIN + pathForLang(lang);

  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${SITE_ORIGIN}/#person`,
        name: 'Victor Augusto',
        alternateName: FULL_NAME,
        jobTitle: dict.meta.jobTitle,
        url,
        image: `${SITE_ORIGIN}/victor.jpg`,
        email: 'mailto:victoraugusto3215@gmail.com',
        worksFor: { '@type': 'Organization', name: 'Attime' },
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Belo Horizonte',
          addressRegion: 'MG',
          addressCountry: 'BR',
        },
        sameAs: SOCIAL_LINKS,
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_ORIGIN}/#website`,
        url,
        name: dict.meta.title,
        inLanguage: HTML_LANG[lang],
        author: { '@id': `${SITE_ORIGIN}/#person` },
      },
    ],
  };

  let el = document.getElementById('ld-json');
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = 'ld-json';
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

/* Atualiza title, description, canonical, OG e hreflang para o idioma
   ativo — sem isso, buscadores viam sempre os mesmos metadados em
   português independente da URL/idioma servido. */
function applySeoTags(lang) {
  const dict = dictionaries[lang];
  const url = SITE_ORIGIN + pathForLang(lang);

  document.title = dict.meta.title;
  setMetaTag('name', 'description', dict.meta.description);
  setMetaTag('property', 'og:locale', OG_LOCALE[lang]);
  setMetaTag('property', 'og:url', url);
  setMetaTag('property', 'og:title', dict.meta.ogTitle);
  setMetaTag('property', 'og:description', dict.meta.description);
  setMetaTag('name', 'twitter:title', dict.meta.ogTitle);
  setMetaTag('name', 'twitter:description', dict.meta.description);

  setLinkTag('link[rel="canonical"]', { rel: 'canonical', href: url });
  SUPPORTED_LANGS.forEach((code) => {
    setLinkTag(`link[rel="alternate"][hreflang="${HTML_LANG[code]}"]`, {
      rel: 'alternate', hreflang: HTML_LANG[code], href: SITE_ORIGIN + pathForLang(code),
    });
  });
  setLinkTag('link[rel="alternate"][hreflang="x-default"]', {
    rel: 'alternate', hreflang: 'x-default', href: SITE_ORIGIN + pathForLang(DEFAULT_LANG),
  });

  // Manifest do PWA também muda por idioma — nome, start_url e lang
  // corretos para quem instalar a partir de /en/ ou /es/.
  setLinkTag('link[rel="manifest"]', { rel: 'manifest', href: MANIFEST_HREF[lang] });

  setJsonLd(lang);
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(getPathLang);

  useEffect(() => {
    document.documentElement.lang = HTML_LANG[lang] ?? 'pt-BR';
    applySeoTags(lang);
  }, [lang]);

  /* Migra links antigos com ?lang= para a rota por idioma, uma vez, no mount. */
  useEffect(() => {
    if (getPathLang() !== DEFAULT_LANG) return;
    const legacy = getLegacyQueryLang();
    if (legacy) setLang(legacy);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onPopState = () => setLangState(getPathLang());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const setLang = (newLang) => {
    if (!isSupportedLang(newLang) || newLang === lang) return;
    const url = new URL(window.location.href);
    url.pathname = pathForLang(newLang);
    url.search = '';
    window.history.pushState({}, '', url);
    setLangState(newLang);
  };

  const t = useMemo(() => {
    return (path) => {
      const value = resolve(dictionaries[lang], path);
      if (value !== undefined) return value;
      const fallback = resolve(dictionaries[DEFAULT_LANG], path);
      return fallback !== undefined ? fallback : path;
    };
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
