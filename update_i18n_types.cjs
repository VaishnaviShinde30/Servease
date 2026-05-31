const fs = require('fs');
let code = fs.readFileSync('src/i18n.js', 'utf8');

const typeEn = `
      'shop_types.printing': 'Printing',
      'shop_types.tailoring': 'Tailoring',
      'shop_types.plumbing': 'Plumbing',
      'shop_types.cleaning': 'Cleaning',
      'shop_types.electrical': 'Electrical',
      'shop_types.mechanic': 'Mechanic',
      'shop_types.other': 'Other',
`;

const typeHi = `
      'shop_types.printing': 'प्रिंटिंग',
      'shop_types.tailoring': 'सिलाई',
      'shop_types.plumbing': 'प्लंबिंग',
      'shop_types.cleaning': 'सफाई',
      'shop_types.electrical': 'इलेक्ट्रिकल',
      'shop_types.mechanic': 'मैकेनिक',
      'shop_types.other': 'अन्य',
`;

const typeMr = `
      'shop_types.printing': 'छपाई',
      'shop_types.tailoring': 'शिंपी',
      'shop_types.plumbing': 'प्लंबिंग',
      'shop_types.cleaning': 'साफसफाई',
      'shop_types.electrical': 'इलेक्ट्रिकल',
      'shop_types.mechanic': 'मेकॅनिक',
      'shop_types.other': 'इतर',
`;

code = code.replace(/'shop.open_now': 'Open Now',/, typeEn + '\n      \'shop.open_now\': \'Open Now\',');
code = code.replace(/'shop.open_now': 'अभी खुला है',/, typeHi + '\n      \'shop.open_now\': \'अभी खुला है\',');
code = code.replace(/'shop.open_now': 'आता उघडे आहे',/, typeMr + '\n      \'shop.open_now\': \'आता उघडे आहे\',');

fs.writeFileSync('src/i18n.js', code);
