const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'locales');

const categoryTranslations = {
  en: {
    "Xerox & Printing": "Xerox & Printing",
    "Tailoring": "Tailoring",
    "Mobile Repair": "Mobile Repair",
    "Computer/Laptop Repair": "Computer/Laptop Repair",
    "Electrical Services": "Electrical Services",
    "Plumbing Services": "Plumbing Services",
    "Beauty Salon": "Beauty Salon",
    "Car/Bike Service": "Car/Bike Service",
    "Home Cleaning": "Home Cleaning",
    "Internet/Cyber Cafe": "Internet/Cyber Cafe",
    "Photocopy & Lamination": "Photocopy & Lamination",
    "Tuition/Coaching": "Tuition/Coaching",
    "Grocery Store": "Grocery Store",
    "Courier Services": "Courier Services",
    "Other": "Other",
    "settings.language_updated": "Language updated",
    "settings.notif_updated": "Notification preferences updated",
    "user.filter_all": "All Services"
  },
  hi: {
    "Xerox & Printing": "ज़ेरॉक्स और प्रिंटिंग",
    "Tailoring": "सिलाई (टेलरिंग)",
    "Mobile Repair": "मोबाइल मरम्मत",
    "Computer/Laptop Repair": "कंप्यूटर/लैपटॉप मरम्मत",
    "Electrical Services": "इलेक्ट्रिकल सेवाएँ",
    "Plumbing Services": "प्लंबिंग सेवाएँ",
    "Beauty Salon": "ब्यूटी सैलून",
    "Car/Bike Service": "कार/बाइक सर्विस",
    "Home Cleaning": "घर की सफाई",
    "Internet/Cyber Cafe": "इंटरनेट/साइबर कैफे",
    "Photocopy & Lamination": "फोटोकॉपी और लेमिनेशन",
    "Tuition/Coaching": "ट्यूशन/कोचिंग",
    "Grocery Store": "किराना दुकान",
    "Courier Services": "कूरियर सेवाएँ",
    "Other": "अन्य",
    "settings.language_updated": "भाषा अपडेट हो गई",
    "settings.notif_updated": "अधिसूचना प्राथमिकताएँ अपडेट हो गईं",
    "user.filter_all": "सभी सेवाएँ"
  },
  mr: {
    "Xerox & Printing": "झेरॉक्स आणि प्रिंटिंग",
    "Tailoring": "शिंपी (टेलरिंग)",
    "Mobile Repair": "मोबाईल दुरुस्ती",
    "Computer/Laptop Repair": "संगणक/लॅपटॉप दुरुस्ती",
    "Electrical Services": "इलेक्ट्रिकल सेवा",
    "Plumbing Services": "प्लंबिंग सेवा",
    "Beauty Salon": "ब्युटी सलून",
    "Car/Bike Service": "कार/बाईक सर्व्हिस",
    "Home Cleaning": "घर साफसफाई",
    "Internet/Cyber Cafe": "इंटरनेट/सायबर कॅफे",
    "Photocopy & Lamination": "फोटोकॉपी आणि लॅमिनेशन",
    "Tuition/Coaching": "क्लासेस/कोचिंग",
    "Grocery Store": "किराणा दुकान",
    "Courier Services": "कुरिअर सेवा",
    "Other": "इतर",
    "settings.language_updated": "भाषा अद्यतनित केली",
    "settings.notif_updated": "सूचना प्राधान्ये अद्यतनित केली",
    "user.filter_all": "सर्व सेवा"
  }
};

['en', 'hi', 'mr'].forEach(lang => {
  const filePath = path.join(localesDir, `${lang}.json`);
  let data = {};
  if (fs.existsSync(filePath)) {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  
  // Merge translations
  Object.assign(data, categoryTranslations[lang]);
  
  // Also merge nested ones for settings and user
  if (categoryTranslations[lang]["settings.language_updated"]) {
    if (!data.settings) data.settings = {};
    data.settings.language_updated = categoryTranslations[lang]["settings.language_updated"];
    data.settings.notif_updated = categoryTranslations[lang]["settings.notif_updated"];
    
    if (!data.user) data.user = {};
    data.user.filter_all = categoryTranslations[lang]["user.filter_all"];
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Updated ${lang}.json`);
});
