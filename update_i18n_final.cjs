const fs = require('fs');
let code = fs.readFileSync('src/i18n.js', 'utf8');

const additionalEn = `
      'navbar.subtitle': 'We Recommend, You Decide',
      'navbar.sign_up': 'Sign Up',
      'landing.feature_1_title': 'Smart Discovery',
      'landing.feature_1_desc': 'Our algorithm ranks shops by balancing distance, price, and customer reviews.',
      'landing.feature_2_title': 'Trusted Reviews',
      'landing.feature_2_desc': 'Real reviews from local customers help you make the best decision.',
      'landing.feature_3_title': 'Grow Your Business',
      'landing.feature_3_desc': 'Shopkeepers can easily list their services and attract nearby customers.',
      'Shopkeeper Dashboard': 'Shopkeeper Dashboard',
      'Manage your service listings and business profile.': 'Manage your service listings and business profile.',
`;

const additionalHi = `
      'navbar.subtitle': 'हम सलाह देते हैं, आप तय करें',
      'navbar.sign_up': 'साइन अप करें',
      'landing.feature_1_title': 'स्मार्ट खोज',
      'landing.feature_1_desc': 'हमारा एल्गोरिदम दूरी, कीमत और ग्राहक समीक्षाओं को संतुलित करके दुकानों को रैंक करता है।',
      'landing.feature_2_title': 'विश्वसनीय समीक्षाएं',
      'landing.feature_2_desc': 'स्थानीय ग्राहकों की वास्तविक समीक्षाएं आपको सर्वोत्तम निर्णय लेने में मदद करती हैं।',
      'landing.feature_3_title': 'अपना व्यवसाय बढ़ाएं',
      'landing.feature_3_desc': 'दुकानदार आसानी से अपनी सेवाओं को सूचीबद्ध कर सकते हैं और आस-पास के ग्राहकों को आकर्षित कर सकते हैं।',
      'Shopkeeper Dashboard': 'दुकानदार डैशबोर्ड',
      'Manage your service listings and business profile.': 'अपनी सेवा सूची और व्यावसायिक प्रोफ़ाइल प्रबंधित करें।',
`;

const additionalMr = `
      'navbar.subtitle': 'आम्ही शिफारस करतो, तुम्ही ठरवा',
      'navbar.sign_up': 'साइन अप करा',
      'landing.feature_1_title': 'स्मार्ट शोध',
      'landing.feature_1_desc': 'आमचे अल्गोरिदम अंतर, किंमत आणि ग्राहक पुनरावलोकने संतुलित करून दुकानांना रँक करते.',
      'landing.feature_2_title': 'विश्वसनीय पुनरावलोकने',
      'landing.feature_2_desc': 'स्थानिक ग्राहकांची वास्तविक पुनरावलोकने तुम्हाला सर्वोत्तम निर्णय घेण्यास मदत करतात.',
      'landing.feature_3_title': 'तुमचा व्यवसाय वाढवा',
      'landing.feature_3_desc': 'दुकानदार सहजपणे त्यांच्या सेवा सूचीबद्ध करू शकतात आणि जवळील ग्राहकांना आकर्षित करू शकतात.',
      'Shopkeeper Dashboard': 'दुकानदार डॅशबोर्ड',
      'Manage your service listings and business profile.': 'तुमची सेवा सूची आणि व्यवसाय प्रोफाइल व्यवस्थापित करा.',
`;

code = code.replace(/'shop.open_now': 'Open Now',/, additionalEn + '\n      \'shop.open_now\': \'Open Now\',');
code = code.replace(/'shop.open_now': 'अभी खुला है',/, additionalHi + '\n      \'shop.open_now\': \'अभी खुला है\',');
code = code.replace(/'shop.open_now': 'आता उघडे आहे',/, additionalMr + '\n      \'shop.open_now\': \'आता उघडे आहे\',');

fs.writeFileSync('src/i18n.js', code);
