const { addTranslations } = require('./addTranslations.cjs');

const en = {
  "login.welcome": "Welcome Back",
  "login.subtitle": "Sign in to Servease to continue",
  "login.username": "Username",
  "Password": "Password",
  "login.forgot_password": "Forgot Password?",
  "login.authenticating": "Authenticating...",
  "login.sign_in": "Sign In",
  "login.no_account": "Don't have an account?",
  "signup.title": "Create Account",
  "signup.subtitle": "Join Servease today",
  "signup.full_name": "Full Name",
  "signup.email_address": "Email Address",
  "signup.iam": "I am a...",
  "signup.user": "User",
  "signup.shopkeeper": "Shopkeeper",
  "signup.creating": "Creating Account...",
  "signup.have_account": "Already have an account?"
};

const hi = {
  "login.welcome": "वापसी पर स्वागत है",
  "login.subtitle": "जारी रखने के लिए सर्वीज़ में साइन इन करें",
  "login.username": "उपयोगकर्ता नाम",
  "Password": "पासवर्ड",
  "login.forgot_password": "पासवर्ड भूल गए?",
  "login.authenticating": "प्रमाणीकरण हो रहा है...",
  "login.sign_in": "साइन इन करें",
  "login.no_account": "क्या आपका खाता नहीं है?",
  "signup.title": "खाता बनाएं",
  "signup.subtitle": "आज ही सर्वीज़ से जुड़ें",
  "signup.full_name": "पूरा नाम",
  "signup.email_address": "ईमेल पता",
  "signup.iam": "मैं एक...",
  "signup.user": "उपयोगकर्ता",
  "signup.shopkeeper": "दुकानदार",
  "signup.creating": "खाता बनाया जा रहा है...",
  "signup.have_account": "क्या आपके पास पहले से ही एक खाता है?"
};

const mr = {
  "login.welcome": "परत स्वागत आहे",
  "login.subtitle": "पुढे जाण्यासाठी सर्व्हिजमध्ये साइन इन करा",
  "login.username": "वापरकर्तानाव",
  "Password": "पासवर्ड",
  "login.forgot_password": "पासवर्ड विसरलात?",
  "login.authenticating": "प्रमाणीकरण करत आहे...",
  "login.sign_in": "साइन इन करा",
  "login.no_account": "खाते नाही?",
  "signup.title": "खाते तयार करा",
  "signup.subtitle": "आजच सर्व्हिजमध्ये सामील व्हा",
  "signup.full_name": "पूर्ण नाव",
  "signup.email_address": "ईमेल पत्ता",
  "signup.iam": "मी एक...",
  "signup.user": "वापरकर्ता",
  "signup.shopkeeper": "दुकानदार",
  "signup.creating": "खाते तयार करत आहे...",
  "signup.have_account": "आधीपासून खाते आहे का?"
};

addTranslations(en, hi, mr);
