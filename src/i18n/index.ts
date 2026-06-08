import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './locales/en.json'
import fr from './locales/fr.json'
import ar from './locales/ar.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, fr: { translation: fr }, ar: { translation: ar } },
    fallbackLng: 'en',
    defaultNS: 'translation',
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'app_language',
      cacheUserLanguage: true,
    },
    interpolation: { escapeValue: false },
  })

const lang = localStorage.getItem('app_language') || 'en'
document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
document.documentElement.lang = lang

export default i18n
