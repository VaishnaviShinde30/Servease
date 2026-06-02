const fs = require('fs');

function addTranslations(newEn, newHi, newMr) {
    const en = JSON.parse(fs.readFileSync('src/locales/en.json', 'utf8'));
    const hi = JSON.parse(fs.readFileSync('src/locales/hi.json', 'utf8'));
    const mr = JSON.parse(fs.readFileSync('src/locales/mr.json', 'utf8'));

    Object.assign(en, newEn);
    Object.assign(hi, newHi);
    Object.assign(mr, newMr);

    fs.writeFileSync('src/locales/en.json', JSON.stringify(en, null, 2));
    fs.writeFileSync('src/locales/hi.json', JSON.stringify(hi, null, 2));
    fs.writeFileSync('src/locales/mr.json', JSON.stringify(mr, null, 2));
    console.log("Translations updated!");
}

module.exports = { addTranslations };

