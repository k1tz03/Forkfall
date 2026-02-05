import { getLocales } from 'expo-localization';

import en from './locales/en';
import fr from './locales/fr';
import es from './locales/es';
import pt from './locales/pt';
import de from './locales/de';
import it from './locales/it';
import zh from './locales/zh';
import ja from './locales/ja';
import ko from './locales/ko';
import ar from './locales/ar';
import ru from './locales/ru';
import hi from './locales/hi';

type TranslationObject = { [key: string]: string | TranslationObject };

const translations: { [locale: string]: TranslationObject } = {
  en,
  fr,
  es,
  pt,
  de,
  it,
  zh,
  ja,
  ko,
  ar,
  ru,
  hi,
};

// Get device locale
const deviceLocale = getLocales()[0]?.languageCode || 'en';

let currentLocale = translations[deviceLocale] ? deviceLocale : 'en';

/**
 * Get nested value from object using dot notation
 */
function getNestedValue(obj: TranslationObject, path: string): string | undefined {
  const keys = path.split('.');
  let current: TranslationObject | string | undefined = obj;

  for (const key of keys) {
    if (current === undefined || typeof current === 'string') {
      return undefined;
    }
    current = current[key];
  }

  return typeof current === 'string' ? current : undefined;
}

/**
 * Translate a key with optional interpolation
 */
export function t(key: string, options?: { [key: string]: string | number }): string {
  const translation = getNestedValue(translations[currentLocale], key)
    ?? getNestedValue(translations.en, key)
    ?? key;

  if (!options) {
    return translation;
  }

  // Simple interpolation: replace {{key}} with value
  return translation.replace(/\{\{(\w+)\}\}/g, (_, k) => {
    return options[k]?.toString() ?? `{{${k}}}`;
  });
}

export function setLocale(locale: string): void {
  if (translations[locale]) {
    currentLocale = locale;
  }
}

export function getLocale(): string {
  return currentLocale;
}

export const availableLocales = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
];
