const fs = require('fs');
let code = fs.readFileSync('src/i18n.js', 'utf8');

const missingEn = `
      // Login
      'login.welcome': 'Welcome Back',
      'login.subtitle': 'Sign in to Servease to continue',
      'login.authenticating': 'Authenticating...',
      'login.sign_in': 'Sign In',
      'login.no_account': 'Don\\'t have an account?',
      
      // Signup
      'signup.title': 'Create Account',
      'signup.subtitle': 'Join Servease today',
      'signup.iam': 'I am a...',
      'signup.user': 'User',
      'signup.shopkeeper': 'Shopkeeper',
      'signup.creating': 'Creating Account...',
      'signup.have_account': 'Already have an account?',
      
      // Footer
      'footer.desc': 'Smart service recommendation platform. Connecting students and locals with the best-rated shops based on price, distance, and reviews.',
      'footer.platform': 'Platform',
      'footer.find_services': 'Find Services',
      'footer.list_shop': 'List Your Shop',
      'footer.how_it_works': 'How it Works',
      'footer.pricing': 'Pricing',
      'footer.legal': 'Legal',
      'footer.terms': 'Terms of Service',
      'footer.privacy': 'Privacy Policy',
      'footer.cookie': 'Cookie Policy',
      'footer.disclaimer': 'Disclaimer',
      'footer.contact': 'Contact Us',
      'footer.address': '123 University Road, Tech Park, Pune, MH 411001',
      'footer.designed': 'Designed for Final Year Demonstration',
`;

const missingHi = `
      // Login
      'login.welcome': 'वापसी पर स्वागत है',
      'login.subtitle': 'जारी रखने के लिए Servease में साइन इन करें',
      'login.authenticating': 'प्रमाणीकरण हो रहा है...',
      'login.sign_in': 'साइन इन करें',
      'login.no_account': 'क्या आपके पास खाता नहीं है?',
      
      // Signup
      'signup.title': 'खाता बनाएँ',
      'signup.subtitle': 'आज ही Servease से जुड़ें',
      'signup.iam': 'मैं हूँ एक...',
      'signup.user': 'उपयोगकर्ता',
      'signup.shopkeeper': 'दुकानदार',
      'signup.creating': 'खाता बनाया जा रहा है...',
      'signup.have_account': 'क्या आपके पास पहले से खाता है?',
      
      // Footer
      'footer.desc': 'स्मार्ट सेवा अनुशंसा मंच। छात्रों और स्थानीय लोगों को कीमत, दूरी और समीक्षाओं के आधार पर सर्वोत्तम रेटेड दुकानों से जोड़ना।',
      'footer.platform': 'प्लेटफ़ॉर्म',
      'footer.find_services': 'सेवाएँ खोजें',
      'footer.list_shop': 'अपनी दुकान सूचीबद्ध करें',
      'footer.how_it_works': 'यह कैसे काम करता है',
      'footer.pricing': 'मूल्य निर्धारण',
      'footer.legal': 'कानूनी',
      'footer.terms': 'सेवा की शर्तें',
      'footer.privacy': 'गोपनीयता नीति',
      'footer.cookie': 'कुकी नीति',
      'footer.disclaimer': 'अस्वीकरण',
      'footer.contact': 'संपर्क करें',
      'footer.address': '१२३ यूनिवर्सिटी रोड, टेक पार्क, पुणे, MH ४११००१',
      'footer.designed': 'अंतिम वर्ष के प्रदर्शन के लिए डिज़ाइन किया गया',
`;

const missingMr = `
      // Login
      'login.welcome': 'परत स्वागत आहे',
      'login.subtitle': 'सुरू ठेवण्यासाठी Servease मध्ये साइन इन करा',
      'login.authenticating': 'प्रमाणीकरण करत आहे...',
      'login.sign_in': 'साइन इन करा',
      'login.no_account': 'खाते नाहीये का?',
      
      // Signup
      'signup.title': 'खाते तयार करा',
      'signup.subtitle': 'आजच Servease मध्ये सामील व्हा',
      'signup.iam': 'मी आहे एक...',
      'signup.user': 'वापरकर्ता',
      'signup.shopkeeper': 'दुकानदार',
      'signup.creating': 'खाते तयार करत आहे...',
      'signup.have_account': 'आधीच खाते आहे का?',
      
      // Footer
      'footer.desc': 'स्मार्ट सेवा शिफारस प्लॅटफॉर्म. किंमत, अंतर आणि पुनरावलोकनांवर आधारित सर्वोत्तम रेट केलेल्या दुकानांशी विद्यार्थी आणि स्थानिकांना जोडत आहे.',
      'footer.platform': 'प्लॅटफॉर्म',
      'footer.find_services': 'सेवा शोधा',
      'footer.list_shop': 'तुमचे दुकान सूचीबद्ध करा',
      'footer.how_it_works': 'हे कसे काम करते',
      'footer.pricing': 'किंमत',
      'footer.legal': 'कायदेशीर',
      'footer.terms': 'सेवा अटी',
      'footer.privacy': 'गोपनीयता धोरण',
      'footer.cookie': 'कुकी धोरण',
      'footer.disclaimer': 'अस्वीकरण',
      'footer.contact': 'संपर्क साधा',
      'footer.address': '१२३ युनिव्हर्सिटी रोड, टेक पार्क, पुणे, MH ४११००१',
      'footer.designed': 'अंतिम वर्षाच्या प्रात्यक्षिकासाठी डिझाइन केलेले',
`;

code = code.replace(/'shop.open_now': 'Open Now',/, missingEn + '\n      \'shop.open_now\': \'Open Now\',');
code = code.replace(/'shop.open_now': 'अभी खुला है',/, missingHi + '\n      \'shop.open_now\': \'अभी खुला है\',');
code = code.replace(/'shop.open_now': 'आता उघडे आहे',/, missingMr + '\n      \'shop.open_now\': \'आता उघडे आहे\',');

fs.writeFileSync('src/i18n.js', code);
