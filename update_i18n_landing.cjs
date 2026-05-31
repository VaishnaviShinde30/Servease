const fs = require('fs');

const path = 'src/i18n.js';
let content = fs.readFileSync(path, 'utf8');

const newEnKeys = `
      "landing.how_it_works": "How It Works",
      "landing.step1_title": "Search Services",
      "landing.step1_desc": "Find local shops and services around your current location instantly.",
      "landing.step2_title": "Compare & Choose",
      "landing.step2_desc": "Compare prices, distance, and read genuine reviews from neighbors.",
      "landing.step3_title": "Connect Easily",
      "landing.step3_desc": "Get directions or contact the shopkeeper directly to get your work done.",
      "landing.about_title": "Empowering Local Communities",
      "landing.about_desc": "Servease was born out of a simple idea: to bridge the gap between skilled local professionals and people who need them. We believe in strengthening neighborhood economies by making local services accessible, transparent, and completely hassle-free.",
      "landing.stat_shops": "Local Shops",
      "landing.stat_users": "Happy Users",
      "landing.stat_cities": "Cities Active",
      "landing.stat_rating": "App Rating",
`;

const newHiKeys = `
      "landing.how_it_works": "यह कैसे काम करता है",
      "landing.step1_title": "सेवाएं खोजें",
      "landing.step1_desc": "अपने वर्तमान स्थान के आसपास तुरंत स्थानीय दुकानें और सेवाएं खोजें।",
      "landing.step2_title": "तुलना करें और चुनें",
      "landing.step2_desc": "कीमतों, दूरी की तुलना करें और पड़ोसियों की वास्तविक समीक्षाएं पढ़ें।",
      "landing.step3_title": "आसानी से जुड़ें",
      "landing.step3_desc": "दिशा-निर्देश प्राप्त करें या अपना काम करवाने के लिए सीधे दुकानदार से संपर्क करें।",
      "landing.about_title": "स्थानीय समुदायों को सशक्त बनाना",
      "landing.about_desc": "Servease का जन्म एक सरल विचार से हुआ था: कुशल स्थानीय पेशेवरों और उनकी आवश्यकता वाले लोगों के बीच की खाई को पाटना। हम स्थानीय सेवाओं को सुलभ, पारदर्शी और पूरी तरह से परेशानी मुक्त बनाकर पड़ोस की अर्थव्यवस्थाओं को मजबूत करने में विश्वास करते हैं।",
      "landing.stat_shops": "स्थानीय दुकानें",
      "landing.stat_users": "खुश उपयोगकर्ता",
      "landing.stat_cities": "सक्रिय शहर",
      "landing.stat_rating": "ऐप रेटिंग",
`;

const newMrKeys = `
      "landing.how_it_works": "हे कसे कार्य करते",
      "landing.step1_title": "सेवा शोधा",
      "landing.step1_desc": "आपल्या सद्य स्थानाभोवती त्वरित स्थानिक दुकाने आणि सेवा शोधा.",
      "landing.step2_title": "तुलना करा आणि निवडा",
      "landing.step2_desc": "किमती, अंतर यांची तुलना करा आणि शेजाऱ्यांचे अस्सल पुनरावलोकन वाचा.",
      "landing.step3_title": "सहज कनेक्ट व्हा",
      "landing.step3_desc": "दिशानिर्देश मिळवा किंवा आपले काम पूर्ण करण्यासाठी थेट दुकानदाराशी संपर्क साधा.",
      "landing.about_title": "स्थानिक समुदायांचे सक्षमीकरण",
      "landing.about_desc": "Servease चा जन्म एका साध्या कल्पनेतून झाला: कुशल स्थानिक व्यावसायिक आणि ज्यांना त्यांची गरज आहे त्यांच्यातील दरी कमी करणे. स्थानिक सेवा सुलभ, पारदर्शक आणि पूर्णपणे त्रासमुक्त बनवून अतिपरिचित अर्थव्यवस्था मजबूत करण्यावर आमचा विश्वास आहे.",
      "landing.stat_shops": "स्थानिक दुकाने",
      "landing.stat_users": "आनंदी वापरकर्ते",
      "landing.stat_cities": "सक्रिय शहरे",
      "landing.stat_rating": "अॅप रेटिंग",
`;

// Insert keys right after "landing.feature_3_desc": "..."
content = content.replace(/("landing\.feature_3_desc":\s*".*?",)/, '$1' + newEnKeys);
content = content.replace(/("landing\.feature_3_desc":\s*".*?",)/g, (match, p1, offset) => {
    if (offset > 500 && offset < 5000) return p1; // En already replaced, assuming En is first. Let's do it manually.
});

// Since replace with string does first match, let's do it specific to sections.
const blocks = content.split('translation: {');
if(blocks.length === 4) {
    blocks[1] = blocks[1].replace(/("landing\.feature_3_desc":\s*".*?",)/, '$1' + newEnKeys);
    blocks[2] = blocks[2].replace(/("landing\.feature_3_desc":\s*".*?",)/, '$1' + newHiKeys);
    blocks[3] = blocks[3].replace(/("landing\.feature_3_desc":\s*".*?",)/, '$1' + newMrKeys);
}

fs.writeFileSync(path, blocks.join('translation: {'));
console.log('Updated i18n.js');
