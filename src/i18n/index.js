import pt from './translations/pt';
import en from './translations/en';
import es from './translations/es';

export const SUPPORTED_LANGS = ['pt', 'en', 'es'];
export const DEFAULT_LANG = 'pt';

export const dictionaries = { pt, en, es };

export function isSupportedLang(value) {
  return SUPPORTED_LANGS.includes(value);
}

/* 'pt-BR' → 'pt', 'en-US' → 'en', 'es-419' → 'es' */
export function normalizeBrowserLang(value) {
  if (!value) return null;
  const code = value.slice(0, 2).toLowerCase();
  return isSupportedLang(code) ? code : null;
}
