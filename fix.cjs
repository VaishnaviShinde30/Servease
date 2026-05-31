const fs = require('fs');
let content = fs.readFileSync('src/data/dummyShops.js', 'utf8');
content = content.replace(/distance: ([\d.]+),/g, (match, p1) => `openingTime: '09:00', closingTime: '20:00', distance: ${p1},`);
fs.writeFileSync('src/data/dummyShops.js', content);
