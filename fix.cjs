const fs = require('fs');
const glob = require('glob');
const path = require('path');

const recoveredDir = 'C:/Users/vaish/OneDrive/Desktop/servease/recovered_src';
const pagesDir = 'C:/Users/vaish/OneDrive/Desktop/servease/src/pages';
const componentsDir = 'C:/Users/vaish/OneDrive/Desktop/servease/src/components';
const rootDir = 'C:/Users/vaish/OneDrive/Desktop/servease/src';

const files = fs.readdirSync(recoveredDir);
for (const file of files) {
    if (!file.endsWith('.jsx')) continue;
    let destDir = pagesDir;
    if (['Navbar.jsx', 'Footer.jsx'].includes(file)) destDir = componentsDir;
    if (['App.jsx', 'main.jsx'].includes(file)) destDir = rootDir;
    if (file === 'AuthContext.jsx') destDir = path.join(rootDir, 'context');
    
    const content = fs.readFileSync(path.join(recoveredDir, file), 'utf8');
    let fixed = content;
    if (fixed.startsWith('"') && fixed.endsWith('"')) {
        fixed = fixed.substring(1, fixed.length - 1);
    }
    // The previous agent likely escaped newlines
    fixed = fixed.replace(/\\n/g, '\n').replace(/\\"/g, '"');
    
    fs.writeFileSync(path.join(destDir, file), fixed);
    console.log(`Restored ${file}`);
}
