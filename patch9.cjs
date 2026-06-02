const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'locales');

// We have 19 dummy shops. Let's provide some translated names and descriptions.
const shopData = {
  1: {
    en: { name: 'Sai Digital Print & Xerox', desc: 'High-speed laser printing, thesis spiral binding, and lamination services. Special discount for bulk college assignments.' },
    hi: { name: 'साई डिजिटल प्रिंट और ज़ेरॉक्स', desc: 'हाई-स्पीड लेजर प्रिंटिंग, थीसिस स्पाइरल बाइंडिंग और लेमिनेशन सेवाएं। थोक कॉलेज असाइनमेंट के लिए विशेष छूट।' },
    mr: { name: 'साई डिजिटल प्रिंट आणि झेरॉक्स', desc: 'हाय-स्पीड लेझर प्रिंटिंग, थीसिस स्पायरल बाइंडिंग आणि लॅमिनेशन सेवा. घाऊक कॉलेज असाइनमेंटसाठी विशेष सवलत.' }
  },
  2: {
    en: { name: 'New Bharat Tailoring', desc: 'Expert alteration, custom uniform stitching, and intricate dress materials. 24-hour express delivery available for minor alterations.' },
    hi: { name: 'न्यू भारत टेलरिंग', desc: 'विशेषज्ञ परिवर्तन, कस्टम वर्दी सिलाई, और जटिल ड्रेस सामग्री। मामूली बदलावों के लिए 24 घंटे की एक्सप्रेस डिलीवरी उपलब्ध है।' },
    mr: { name: 'न्यू भारत टेलरिंग', desc: 'तज्ञ फेरफार, सानुकूल युनिफॉर्म शिलाई आणि क्लिष्ट ड्रेस मटेरियल. किरकोळ बदलांसाठी 24 तासांची एक्सप्रेस डिलिव्हरी उपलब्ध आहे.' }
  },
  3: {
    en: { name: 'A-1 Plumbing Solutions', desc: 'Expert plumbing repairs, pipe leak fixes, and water heater installation. Quick response time and reliable service across the city.' },
    hi: { name: 'ए-1 प्लंबिंग सॉल्यूशंस', desc: 'विशेषज्ञ प्लंबिंग मरम्मत, पाइप रिसाव सुधार, और वॉटर हीटर स्थापना। शहर भर में त्वरित प्रतिक्रिया समय और विश्वसनीय सेवा।' },
    mr: { name: 'ए-1 प्लंबिंग सोल्युशन्स', desc: 'तज्ञ प्लंबिंग दुरुस्ती, पाईप गळती दुरुस्ती आणि वॉटर हीटरची स्थापना. जलद प्रतिसाद वेळ आणि संपूर्ण शहरात विश्वसनीय सेवा.' }
  },
  4: {
    en: { name: 'Shree Premium Cleaners', desc: 'Professional deep cleaning for homes and offices. Sofa dry cleaning, bathroom descaling, and floor polishing.' },
    hi: { name: 'श्री प्रीमियम क्लीनर्स', desc: 'घरों और कार्यालयों के लिए पेशेवर गहरी सफाई। सोफा ड्राई क्लीनिंग, बाथरूम डिस्केलिंग और फर्श पॉलिशिंग।' },
    mr: { name: 'श्री प्रीमियम क्लीनर्स', desc: 'घरे आणि कार्यालयांसाठी व्यावसायिक डीप क्लीनिंग. सोफा ड्राय क्लीनिंग, बाथरूम डिस्केलिंग आणि फ्लोर पॉलिशिंग.' }
  },
  5: {
    en: { name: 'Raj Mobile Repair', desc: 'Screen replacement, battery changes, and water damage repair for all smartphone brands.' },
    hi: { name: 'राज मोबाइल मरम्मत', desc: 'सभी स्मार्टफोन ब्रांडों के लिए स्क्रीन प्रतिस्थापन, बैटरी परिवर्तन, और पानी की क्षति की मरम्मत।' },
    mr: { name: 'राज मोबाईल दुरुस्ती', desc: 'सर्व स्मार्टफोन ब्रँडसाठी स्क्रीन बदलणे, बॅटरी बदलणे आणि पाण्याच्या नुकसानाची दुरुस्ती.' }
  },
  6: {
    en: { name: 'Bright Spark Electricals', desc: 'Home appliances repair: AC servicing, Refrigerator repair, and general electrical wiring fixes. Doorstep service.' },
    hi: { name: 'ब्राइट स्पार्क इलेक्ट्रिकल्स', desc: 'घरेलू उपकरणों की मरम्मत: एसी सर्विसिंग, रेफ्रिजरेटर मरम्मत, और सामान्य विद्युत तारों की मरम्मत। डोरस्टेप सेवा।' },
    mr: { name: 'ब्राइट स्पार्क इलेक्ट्रिकल्स', desc: 'घरगुती उपकरणांची दुरुस्ती: एसी सर्व्हिसिंग, रेफ्रिजरेटर दुरुस्ती आणि सामान्य इलेक्ट्रिकल वायरिंग फिक्स. घरपोच सेवा.' }
  },
  7: {
    en: { name: 'Glow Up Beauty Salon', desc: 'Bridal makeup, haircuts, and spa treatments. Book appointments online to skip the waiting line.' },
    hi: { name: 'ग्लो अप ब्यूटी सैलून', desc: 'दुल्हन मेकअप, बाल कटवाने, और स्पा उपचार। प्रतीक्षा लाइन से बचने के लिए ऑनलाइन अपॉइंटमेंट बुक करें।' },
    mr: { name: 'ग्लो अप ब्युटी सलून', desc: 'वधूचा मेकअप, केस कापणे आणि स्पा उपचार. प्रतीक्षा ओळ वगळण्यासाठी ऑनलाइन भेटी बुक करा.' }
  },
  8: {
    en: { name: 'QuickFix Auto Garage', desc: 'Complete car servicing, bike chain lubrication, dent removal, painting, and AC gas refilling.' },
    hi: { name: 'क्विकफिक्स ऑटो गैरेज', desc: 'पूर्ण कार सर्विसिंग, बाइक चेन स्नेहन, डेंट हटाने, पेंटिंग, और एसी गैस रिफिलिंग।' },
    mr: { name: 'क्विकफिक्स ऑटो गॅरेज', desc: 'संपूर्ण कार सर्व्हिसिंग, बाइक चेन स्नेहन, डेंट काढणे, पेंटिंग आणि एसी गॅस रिफिलिंग.' }
  },
  9: {
    en: { name: 'Cyber World Internet Cafe', desc: 'High-speed browsing, government form filling, and printouts. Gaming setups available.' },
    hi: { name: 'साइबर वर्ल्ड इंटरनेट कैफे', desc: 'हाई-स्पीड ब्राउजिंग, सरकारी फॉर्म भरना, और प्रिंटआउट। गेमिंग सेटअप उपलब्ध है।' },
    mr: { name: 'सायबर वर्ल्ड इंटरनेट कॅफे', desc: 'हाय-स्पीड ब्राउझिंग, सरकारी फॉर्म भरणे आणि प्रिंटआउट्स. गेमिंग सेटअप उपलब्ध आहेत.' }
  },
  10: {
    en: { name: 'Techie Bros Laptop Repair', desc: 'Specialized in MacBooks and Gaming Laptops. Thermal paste replacement, SSD upgrades, and hinge repair.' },
    hi: { name: 'टेकी ब्रोस लैपटॉप मरम्मत', desc: 'मैकबुक और गेमिंग लैपटॉप में विशेषज्ञता। थर्मल पेस्ट रिप्लेसमेंट, एसएसडी अपग्रेड और हिंज रिपेयर।' },
    mr: { name: 'टेकी ब्रदर्स लॅपटॉप दुरुस्ती', desc: 'मॅकबुक्स आणि गेमिंग लॅपटॉपमध्ये विशेष. थर्मल पेस्ट रिप्लेसमेंट, SSD अपग्रेड आणि बिजागरी दुरुस्ती.' }
  },
  11: {
    en: { name: 'Mahalaxmi Photocopy & Lamination', desc: 'Cheapest bulk black & white xerox in the area. Ideal for engineering notes and textbooks.' },
    hi: { name: 'महालक्ष्मी फोटोकॉपी और लेमिनेशन', desc: 'क्षेत्र में सबसे सस्ता थोक ब्लैक एंड व्हाइट ज़ेरॉक्स। इंजीनियरिंग नोट्स और पाठ्यपुस्तकों के लिए आदर्श।' },
    mr: { name: 'महालक्ष्मी फोटोकॉपी आणि लॅमिनेशन', desc: 'परिसरातील सर्वात स्वस्त बल्क ब्लॅक अँड व्हाईट झेरॉक्स. इंजिनिअरिंगच्या नोट्स आणि पाठ्यपुस्तकांसाठी आदर्श.' }
  },
  12: {
    en: { name: 'Vidyarthi Coaching Classes', desc: 'Expert coaching for 10th and 12th State Board & CBSE. Regular tests and parent meetings.' },
    hi: { name: 'विद्यार्थी कोचिंग क्लासेस', desc: '10वीं और 12वीं स्टेट बोर्ड और सीबीएसई के लिए विशेषज्ञ कोचिंग। नियमित परीक्षण और अभिभावक बैठकें।' },
    mr: { name: 'विद्यार्थी कोचिंग क्लासेस', desc: '10वी आणि 12वी राज्य मंडळ आणि CBSE साठी तज्ञ कोचिंग. नियमित चाचण्या आणि पालक सभा.' }
  },
  13: {
    en: { name: 'Patil Grocery Store', desc: 'Daily fresh vegetables, household groceries, and dairy products. Free home delivery within 2km.' },
    hi: { name: 'पाटिल किराना स्टोर', desc: 'दैनिक ताजी सब्जियां, घरेलू किराना और डेयरी उत्पाद। 2 किमी के भीतर मुफ्त होम डिलीवरी।' },
    mr: { name: 'पाटील किराणा दुकान', desc: 'रोजच्या ताज्या भाज्या, घरगुती किराणा सामान आणि दुग्धजन्य पदार्थ. २ किमीच्या आत मोफत होम डिलिव्हरी.' }
  },
  14: {
    en: { name: 'FastTrack Courier Services', desc: 'Domestic and international parcel deliveries. Real-time tracking and insured shipments.' },
    hi: { name: 'फास्टट्रैक कूरियर सेवा', desc: 'घरेलू और अंतर्राष्ट्रीय पार्सल डिलीवरी। रियल-टाइम ट्रैकिंग और बीमित शिपमेंट।' },
    mr: { name: 'फास्टट्रॅक कुरिअर सेवा', desc: 'देशांतर्गत आणि आंतरराष्ट्रीय पार्सल वितरण. रिअल-टाइम ट्रॅकिंग आणि विमा उतरवलेले शिपमेंट.' }
  },
  15: {
    en: { name: 'Swift Packers & Movers', desc: 'Local room and apartment shifting for students and families. Safe packaging and careful transport.' },
    hi: { name: 'स्विफ्ट पैकर्स एंड मूवर्स', desc: 'छात्रों और परिवारों के लिए स्थानीय कमरा और अपार्टमेंट शिफ्टिंग। सुरक्षित पैकेजिंग और सावधानीपूर्वक परिवहन।' },
    mr: { name: 'स्विफ्ट पॅकर्स आणि मूव्हर्स', desc: 'विद्यार्थी आणि कुटुंबांसाठी स्थानिक खोली आणि अपार्टमेंट शिफ्टिंग. सुरक्षित पॅकेजिंग आणि काळजीपूर्वक वाहतूक.' }
  },
  16: {
    en: { name: 'Campus Print House', desc: 'Premium 100gsm color printing and spiral binding. ID card lamination and passport photo printing in 5 minutes.' },
    hi: { name: 'कैंपस प्रिंट हाउस', desc: 'प्रीमियम 100gsm कलर प्रिंटिंग और स्पाइरल बाइंडिंग। आईडी कार्ड लेमिनेशन और पासपोर्ट फोटो प्रिंटिंग 5 मिनट में।' },
    mr: { name: 'कॅम्पस प्रिंट हाऊस', desc: 'प्रीमियम 100gsm कलर प्रिंटिंग आणि स्पायरल बाइंडिंग. आयडी कार्ड लॅमिनेशन आणि पासपोर्ट फोटो प्रिंटिंग 5 मिनिटांत.' }
  },
  17: {
    en: { name: 'City Pest Control & Cleaning', desc: 'Effective termination of cockroaches, termites, and bed bugs. Complete home cleaning packages. 1-year guarantee.' },
    hi: { name: 'सिटी पेस्ट कंट्रोल एंड क्लीनिंग', desc: 'तिलचट्टे, दीमक और खटमल की प्रभावी समाप्ति। पूर्ण घर की सफाई पैकेज। 1 साल की गारंटी।' },
    mr: { name: 'सिटी पेस्ट कंट्रोल आणि क्लिनिंग', desc: 'झुरळे, वाळवी आणि ढेकूण प्रभावीपणे संपुष्टात आणणे. संपूर्ण घर साफसफाईचे पॅकेज. 1 वर्षाची हमी.' }
  },
  18: {
    en: { name: 'Elite Gentlemen Tailors', desc: 'Bespoke suits, blazers, and formal trousers. Made-to-measure perfection with premium imported Italian fabrics.' },
    hi: { name: 'एलीट जेंटलमैन टेलर्स', desc: 'बेस्पोक सूट, ब्लेज़र और औपचारिक पतलून। प्रीमियम आयातित इतालवी कपड़ों के साथ माप-के-अनुसार पूर्णता।' },
    mr: { name: 'एलिट जेंटलमेन टेलर्स', desc: 'बेस्पोक सूट, ब्लेझर आणि औपचारिक पँट. प्रीमियम इंपोर्टेड इटालियन फॅब्रिक्ससह मापनासाठी योग्य परिपूर्णता.' }
  },
  19: {
    en: { name: 'Pune Expert Plumbers', desc: 'Emergency home repair services. Leak fixing, tap replacements, and installation of water heaters. Available 24/7.' },
    hi: { name: 'पुणे विशेषज्ञ प्लंबर', desc: 'आपातकालीन गृह मरम्मत सेवाएं। रिसाव फिक्सिंग, नल प्रतिस्थापन, और वॉटर हीटर की स्थापना। 24/7 उपलब्ध है।' },
    mr: { name: 'पुणे एक्सपर्ट प्लंबर', desc: 'आपत्कालीन घर दुरुस्ती सेवा. गळती दुरुस्ती, टॅप बदलणे आणि वॉटर हीटरची स्थापना. 24/7 उपलब्ध.' }
  }
};

['en', 'hi', 'mr'].forEach(lang => {
  const filePath = path.join(localesDir, `${lang}.json`);
  let data = {};
  if (fs.existsSync(filePath)) {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  
  if (!data.shop_names) data.shop_names = {};
  if (!data.shop_desc) data.shop_desc = {};

  for (let id = 1; id <= 19; id++) {
    if (shopData[id] && shopData[id][lang]) {
      data.shop_names[String(id)] = shopData[id][lang].name;
      data.shop_desc[String(id)] = shopData[id][lang].desc;
    }
  }

  // Also add some general translations for Settings page missing parts
  if (lang === 'en') {
    if (!data.settings) data.settings = {};
    data.settings.security = "Security";
    data.settings.security_desc = "Manage your password and authentication";
    data.settings.change_password = "Change Password";
    data.settings.change_password_desc = "Update your account password";
    data.settings.privacy_policy = "Privacy & Data";
    data.settings.privacy_policy_desc = "Manage data collection and account deletion";
    data.settings.data_collection = "Allow Data Collection";
    data.settings.data_collection_desc = "We collect anonymous usage data to improve Servease";
    data.settings.delete_account = "Delete Account";
    data.settings.delete_account_desc = "Permanently remove your account and all data";
  } else if (lang === 'hi') {
    if (!data.settings) data.settings = {};
    data.settings.security = "सुरक्षा";
    data.settings.security_desc = "अपना पासवर्ड और प्रमाणीकरण प्रबंधित करें";
    data.settings.change_password = "पासवर्ड बदलें";
    data.settings.change_password_desc = "अपना खाता पासवर्ड अपडेट करें";
    data.settings.privacy_policy = "गोपनीयता और डेटा";
    data.settings.privacy_policy_desc = "डेटा संग्रह और खाता हटाने का प्रबंधन करें";
    data.settings.data_collection = "डेटा संग्रह की अनुमति दें";
    data.settings.data_collection_desc = "हम Servease को बेहतर बनाने के लिए अनाम उपयोग डेटा एकत्र करते हैं";
    data.settings.delete_account = "खाता हटाएं";
    data.settings.delete_account_desc = "अपना खाता और सभी डेटा स्थायी रूप से हटा दें";
  } else if (lang === 'mr') {
    if (!data.settings) data.settings = {};
    data.settings.security = "सुरक्षा";
    data.settings.security_desc = "तुमचा पासवर्ड आणि प्रमाणीकरण व्यवस्थापित करा";
    data.settings.change_password = "पासवर्ड बदला";
    data.settings.change_password_desc = "तुमचा खाते पासवर्ड अद्यतनित करा";
    data.settings.privacy_policy = "गोपनीयता आणि डेटा";
    data.settings.privacy_policy_desc = "डेटा संकलन आणि खाते हटविणे व्यवस्थापित करा";
    data.settings.data_collection = "डेटा संकलनास अनुमती द्या";
    data.settings.data_collection_desc = "आम्ही Servease सुधारण्यासाठी निनावी वापर डेटा गोळा करतो";
    data.settings.delete_account = "खाते हटवा";
    data.settings.delete_account_desc = "तुमचे खाते आणि सर्व डेटा कायमचा काढून टाका";
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Updated ${lang}.json`);
});
