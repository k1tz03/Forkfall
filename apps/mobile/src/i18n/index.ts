import { I18n } from 'i18n-js';
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

const i18n = new I18n({
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
});

// Get device locale
const deviceLocale = getLocales()[0]?.languageCode || 'en';

// Set default and fallback
i18n.locale = deviceLocale;
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

export const t = (key: string, options?: object) => i18n.t(key, options);

export const setLocale = (locale: string) => {
  i18n.locale = locale;
};

export const getLocale = () => i18n.locale;

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

export default i18n;
