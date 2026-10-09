export const locales = [
  'en', 'hi', 'bn', 'as', 'es', 'pt', 'fr', 'ar', 'ur', 'zh',
  'ja', 'ko', 'ru', 'id', 'de', 'tr', 'it', 'vi', 'th', 'ta',
] as const;

export type Locale = (typeof locales)[number];

export const rtlLocales: Locale[] = ['ar', 'ur'];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  hi: 'हिन्दी',
  bn: 'বাংলা',
  as: 'অসমীয়া',
  es: 'Español',
  pt: 'Português',
  fr: 'Français',
  ar: 'العربية',
  ur: 'اردو',
  zh: '中文',
  ja: '日本語',
  ko: '한국어',
  ru: 'Русский',
  id: 'Bahasa Indonesia',
  de: 'Deutsch',
  tr: 'Türkçe',
  it: 'Italiano',
  vi: 'Tiếng Việt',
  th: 'ไทย',
  ta: 'தமிழ்',
};

export function isRtl(locale: string): boolean {
  return (rtlLocales as string[]).includes(locale);
}

/** "/hi/compress-image" -> { locale: "hi", path: "/compress-image" } ; unknown prefix -> en */
export function parseLocale(url: URL): { locale: Locale; path: string } {
  const seg = url.pathname.split('/').filter(Boolean)[0];
  if ((locales as readonly string[]).includes(seg)) {
    return { locale: seg as Locale, path: '/' + url.pathname.split('/').filter(Boolean).slice(1).join('/') };
  }
  return { locale: 'en', path: url.pathname };
}

/** Build a localized URL, base-aware: l('/compress-image', 'hi') -> '/imglove/hi/compress-image' */
export function l(path: string, locale: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}/${locale}${p === '/' ? '' : p}`;
}

/** Base-aware asset URL: asset('/favicon.svg') -> '/imglove/favicon.svg' */
export function asset(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
  return `${base}${path.replace(/^\//, '')}`;
}

/** Canonical origin for SEO tags (l() already includes the base path) */
export const SITE_ORIGIN = 'https://dusmamud.github.io';
