const fs = require('fs');

// We will read i18n.js and use a dirty trick to extract the object.
const content = fs.readFileSync('src/i18n.js', 'utf8');

// Find the start of the resources object
const startIndex = content.indexOf('const resources = {');
// Find the end of the resources object (before i18n.use)
const endIndex = content.indexOf('i18n\n  .use(initReactI18next)');

if (startIndex !== -1 && endIndex !== -1) {
    const resourcesStr = content.substring(startIndex, endIndex).replace('const resources = ', '').trim();
    // It has a trailing semicolon, remove it
    const cleanStr = resourcesStr.replace(/;$/, '');
    
    // Evaluate the object (unsafe but we trust this local file)
    let resources;
    try {
        resources = eval('(' + cleanStr + ')');
    } catch (err) {
        console.error("Eval failed", err);
        process.exit(1);
    }
    
    fs.writeFileSync('src/locales/en.json', JSON.stringify(resources.en.translation, null, 2));
    fs.writeFileSync('src/locales/hi.json', JSON.stringify(resources.hi.translation, null, 2));
    fs.writeFileSync('src/locales/mr.json', JSON.stringify(resources.mr.translation, null, 2));
    
    const newI18n = `import i18n from 'i18next';
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
`;
    fs.writeFileSync('src/i18n.js', newI18n);
    console.log("Successfully extracted translations to JSON files and refactored i18n.js!");
} else {
    console.log("Could not parse i18n.js");
}
