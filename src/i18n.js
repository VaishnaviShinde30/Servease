import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTrans from './locales/en.json';
import hiTrans from './locales/hi.json';
import mrTrans from './locales/mr.json';

const resources = {
  en: { translation: enTrans },
  hi: { translation: hiTrans },
  mr: { translation: mrTrans }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
