import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import resources from './i18nResources.js';

// O Seraflix+ é sempre em português, independente do idioma da TV.
i18n
  .use(initReactI18next)
  .init({
    lng: 'pt',
    fallbackLng: 'en',
    resources,
    interpolation: {
      escapeValue: false,
    }
  });

export default i18n;
