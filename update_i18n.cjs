const fs = require('fs');
let code = fs.readFileSync('src/i18n.js', 'utf8');

const newEn = `
      // Shop timings and status
      'shop.open_now': 'Open Now',
      'shop.closed': 'Closed',
      'shop.longitude': 'Longitude (Optional)',
      'shop.contact': 'Contact Number',
      'shop.location': 'Location / Address',
      'shop.opening_time': 'Opening Time',
      'shop.closing_time': 'Closing Time',
      'shop.description': 'Description',
      'landing.smart_recommendation': 'Smart Service Recommendation System',
      'landing.find_best_services': 'Find the Best Services in Your',
      'landing.neighborhood': 'Neighborhood',
      'landing.hero_subtitle': 'Servease helps you discover top-rated tailors, xerox shops, mechanics, and laundry services. We analyze price, distance, and ratings to recommend the absolute best option.',
      'landing.go_to_dashboard': 'Go to Dashboard',
      'landing.get_started_now': 'Get Started Now',
      'landing.login_to_account': 'Login to Account',
      'landing.top_rated_services': 'Top Rated Services',
      'landing.join_today_subtitle': 'Join today to book or review these amazing local shops.',
      'landing.top_pick': 'Top Pick',
      'landing.login_to_view': 'Login to view',
      'user.discover_services': 'Discover Services',
      'user.find_best_rated': 'Find the best-rated shops near you',
      'user.any_price': 'Any Price',
      'user.no_matches_found': 'No matches found',
      'user.no_matches_subtitle': 'We could not find any services matching your specific filters. Try adjusting them.',
`;

const newHi = `
      // Shop timings and status
      'shop.open_now': 'अभी खुला है',
      'shop.closed': 'बंद है',
      'shop.longitude': 'देशांतर (वैकल्पिक)',
      'shop.contact': 'संपर्क नंबर',
      'shop.location': 'स्थान / पता',
      'shop.opening_time': 'खुलने का समय',
      'shop.closing_time': 'बंद होने का समय',
      'shop.description': 'विवरण',
      'landing.smart_recommendation': 'स्मार्ट सेवा अनुशंसा प्रणाली',
      'landing.find_best_services': 'अपने इलाके में सर्वश्रेष्ठ सेवाएं खोजें',
      'landing.neighborhood': 'आस-पड़ोस',
      'landing.hero_subtitle': 'Servease आपको टॉप-रेटेड टेलर्स, ज़ेरॉक्स शॉप्स, मैकेनिक्स और लॉन्ड्री सेवाओं को खोजने में मदद करता है। हम सबसे अच्छा विकल्प सुझाने के लिए कीमत, दूरी और रेटिंग का विश्लेषण करते हैं।',
      'landing.go_to_dashboard': 'डैशबोर्ड पर जाएं',
      'landing.get_started_now': 'अभी शुरू करें',
      'landing.login_to_account': 'खाते में लॉग इन करें',
      'landing.top_rated_services': 'शीर्ष रेटेड सेवाएं',
      'landing.join_today_subtitle': 'इन अद्भुत स्थानीय दुकानों को बुक करने या उनकी समीक्षा करने के लिए आज ही जुड़ें।',
      'landing.top_pick': 'शीर्ष पसंद',
      'landing.login_to_view': 'देखने के लिए लॉग इन करें',
      'user.discover_services': 'सेवाएं खोजें',
      'user.find_best_rated': 'अपने आस-पास की सबसे अच्छी रेटिंग वाली दुकानें खोजें',
      'user.any_price': 'कोई भी कीमत',
      'user.no_matches_found': 'कोई मेल नहीं मिला',
      'user.no_matches_subtitle': 'हम आपके विशिष्ट फ़िल्टर से मेल खाने वाली कोई सेवा नहीं ढूँढ सके। उन्हें समायोजित करने का प्रयास करें।',
`;

const newMr = `
      // Shop timings and status
      'shop.open_now': 'आता उघडे आहे',
      'shop.closed': 'बंद आहे',
      'shop.longitude': 'रेखांश (पर्यायी)',
      'shop.contact': 'संपर्क क्रमांक',
      'shop.location': 'स्थान / पत्ता',
      'shop.opening_time': 'उघडण्याची वेळ',
      'shop.closing_time': 'बंद होण्याची वेळ',
      'shop.description': 'वर्णन',
      'landing.smart_recommendation': 'स्मार्ट सेवा शिफारस प्रणाली',
      'landing.find_best_services': 'तुमच्या परिसरातील सर्वोत्तम सेवा शोधा',
      'landing.neighborhood': 'शेजार',
      'landing.hero_subtitle': 'Servease तुम्हाला टॉप-रेटेड टेलर्स, झेरॉक्स शॉप्स, मेकॅनिक्स आणि लाँड्री सेवा शोधण्यात मदत करते. आम्ही सर्वोत्तम पर्यायाची शिफारस करण्यासाठी किंमत, अंतर आणि रेटिंगचे विश्लेषण करतो.',
      'landing.go_to_dashboard': 'डॅशबोर्डवर जा',
      'landing.get_started_now': 'आता सुरू करा',
      'landing.login_to_account': 'खात्यात लॉग इन करा',
      'landing.top_rated_services': 'शीर्ष रेटेड सेवा',
      'landing.join_today_subtitle': 'या अद्भुत स्थानिक दुकानांची नोंदणी करण्यासाठी किंवा त्यांचे पुनरावलोकन करण्यासाठी आजच सामील व्हा.',
      'landing.top_pick': 'उत्कृष्ट निवड',
      'landing.login_to_view': 'पाहण्यासाठी लॉग इन करा',
      'user.discover_services': 'सेवा शोधा',
      'user.find_best_rated': 'तुमच्या जवळील सर्वोत्तम रेटिंग असलेली दुकाने शोधा',
      'user.any_price': 'कोणतीही किंमत',
      'user.no_matches_found': 'काहीही जुळले नाही',
      'user.no_matches_subtitle': 'आम्हाला तुमच्या विशिष्ट फिल्टरशी जुळणारी कोणतीही सेवा सापडली नाही. ते समायोजित करण्याचा प्रयत्न करा.',
`;

code = code.replace(/"Save Profile": "Save Profile"/, '"Save Profile": "Save Profile",\n' + newEn);
code = code.replace(/"Save Profile": "प्रोफ़ाइल सहेजें"/, '"Save Profile": "प्रोफ़ाइल सहेजें",\n' + newHi);
code = code.replace(/"Save Profile": "प्रोफाइल सेव्ह करा"/, '"Save Profile": "प्रोफाइल सेव्ह करा",\n' + newMr);

fs.writeFileSync('src/i18n.js', code);
