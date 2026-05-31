import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Common translations for all modules
const resources = {
  en: {
    translation: {
      // Navbar
      "Home": "Home",
      "Dashboard": "Dashboard",
      "Manage Services": "Manage Services",
      "Admin Panel": "Admin Panel",
      "Login": "Login",
      "Profile": "Profile",
      "Logout": "Logout",
      
      // Common
      "Loading...": "Loading...",
      "Save": "Save",
      "Cancel": "Cancel",
      "Edit": "Edit",
      "Delete": "Delete",
      
      // User Dashboard
      "Search for services, shops...": "Search for services, shops...",
      "All Categories": "All Categories",
      "Any Price": "Any Price",
      "Under ₹500": "Under ₹500",
      "₹500 - ₹1000": "₹500 - ₹1000",
      "Above ₹1000": "Above ₹1000",
      "Min Rating": "Min Rating",
      "Any Rating": "Any Rating",
      "Stars": "Stars",
      "Top Pick": "Top Pick",
      "Get Directions": "Get Directions",
      "Locate": "Locate",
      "Leave Feedback": "Leave Feedback",
      "Location unavailable": "Location unavailable",
      "km from you": "km from you",
      "km from city center": "km from city center",
      "reviews": "reviews",
      "market": "market",
      "No matches found": "No matches found",
      "Clear All Filters": "Clear All Filters",
      
      // Shopkeeper Dashboard
      "My Shops": "My Shops",
      "Shop Insights": "Shop Insights",
      "Add New Shop": "Add New Shop",
      "Shop Info": "Shop Info",
      "Service Type": "Service Type",
      "Base Price": "Base Price",
      "Actions": "Actions",
      "No shops listed": "No shops listed",
      "Total Views": "Total Views",
      "Search Appearances": "Search Appearances",
      "Avg. Shop Rating": "Avg. Shop Rating",
      
      // Admin Dashboard
      "Manage Users": "Manage Users",
      "Manage Shops": "Manage Shops",
      "Total Users": "Total Users",
      "Total Shops": "Total Shops",
      "Platform Health": "Platform Health",
      "User Details": "User Details",
      "Shop Details": "Shop Details",
      "Owned Shops": "Owned Shops",
      "Reports & Issues": "Reports & Issues",
      "New Users": "New Users",
      "New Shops": "New Shops",
      "Suspend": "Suspend",
      "Resolve": "Resolve",
      "Dismiss": "Dismiss",
      "Active": "Active",
      "Suspended": "Suspended",
      
      // Profile
      "My Profile": "My Profile",
      "Manage your personal information": "Manage your personal information and preferences.",
      "Full Name": "Full Name",
      "Email Address": "Email Address",
      "Contact Number": "Contact Number",
      "Location / Address": "Location / Address",
      "Bio / Description": "Bio / Description",
      "Save Profile": "Save Profile"
    }
  },
  hi: {
    translation: {
      // Navbar
      "Home": "होम",
      "Dashboard": "डैशबोर्ड",
      "Manage Services": "सेवाएं प्रबंधित करें",
      "Admin Panel": "एडमिन पैनल",
      "Login": "लॉग इन",
      "Profile": "प्रोफ़ाइल",
      "Logout": "लॉग आउट",
      
      // Common
      "Loading...": "लोड हो रहा है...",
      "Save": "सेव करें",
      "Cancel": "रद्द करें",
      "Edit": "संपादित करें",
      "Delete": "हटाएं",
      
      // User Dashboard
      "Search for services, shops...": "सेवाएं, दुकानें खोजें...",
      "All Categories": "सभी श्रेणियां",
      "Any Price": "कोई भी कीमत",
      "Under ₹500": "₹500 से कम",
      "₹500 - ₹1000": "₹500 - ₹1000",
      "Above ₹1000": "₹1000 से ऊपर",
      "Min Rating": "न्यूनतम रेटिंग",
      "Any Rating": "कोई भी रेटिंग",
      "Stars": "स्टार्स",
      "Top Pick": "शीर्ष पसंद",
      "Get Directions": "दिशा-निर्देश प्राप्त करें",
      "Locate": "पता लगाएं",
      "Leave Feedback": "फीडबैक दें",
      "Location unavailable": "स्थान अनुपलब्ध",
      "km from you": "किमी दूर (आपसे)",
      "km from city center": "किमी दूर (शहर के केंद्र से)",
      "reviews": "समीक्षाएं",
      "market": "बाजार",
      "No matches found": "कोई मेल नहीं मिला",
      "Clear All Filters": "सभी फ़िल्टर साफ़ करें",
      
      // Shopkeeper Dashboard
      "My Shops": "मेरी दुकानें",
      "Shop Insights": "दुकान की जानकारी",
      "Add New Shop": "नई दुकान जोड़ें",
      "Shop Info": "दुकान की जानकारी",
      "Service Type": "सेवा का प्रकार",
      "Base Price": "मूल कीमत",
      "Actions": "क्रियाएं",
      "No shops listed": "कोई दुकान सूचीबद्ध नहीं है",
      "Total Views": "कुल विचार",
      "Search Appearances": "खोज में दिखावे",
      "Avg. Shop Rating": "औसत दुकान रेटिंग",
      
      // Admin Dashboard
      "Manage Users": "उपयोगकर्ता प्रबंधित करें",
      "Manage Shops": "दुकानें प्रबंधित करें",
      "Total Users": "कुल उपयोगकर्ता",
      "Total Shops": "कुल दुकानें",
      "Platform Health": "प्लेटफ़ॉर्म स्वास्थ्य",
      "User Details": "उपयोगकर्ता विवरण",
      "Shop Details": "दुकान विवरण",
      "Owned Shops": "स्वामित्व वाली दुकानें",
      "Reports & Issues": "रिपोर्ट और समस्याएँ",
      "New Users": "नए उपयोगकर्ता",
      "New Shops": "नई दुकानें",
      "Suspend": "निलंबित करें",
      "Resolve": "समाधान करें",
      "Dismiss": "खारिज करें",
      "Active": "सक्रिय",
      "Suspended": "निलंबित",
      
      // Profile
      "My Profile": "मेरी प्रोफ़ाइल",
      "Manage your personal information": "अपनी व्यक्तिगत जानकारी और प्राथमिकताएं प्रबंधित करें।",
      "Full Name": "पूरा नाम",
      "Email Address": "ईमेल पता",
      "Contact Number": "संपर्क नंबर",
      "Location / Address": "स्थान / पता",
      "Bio / Description": "बायो / विवरण",
      "Save Profile": "प्रोफ़ाइल सहेजें"
    }
  },
  mr: {
    translation: {
      // Navbar
      "Home": "मुख्यपृष्ठ",
      "Dashboard": "डॅशबोर्ड",
      "Manage Services": "सेवा व्यवस्थापित करा",
      "Admin Panel": "अ‍ॅडमिन पॅनेल",
      "Login": "लॉग इन",
      "Profile": "प्रोफाइल",
      "Logout": "लॉग आउट",
      
      // Common
      "Loading...": "लोड होत आहे...",
      "Save": "सेव्ह करा",
      "Cancel": "रद्द करा",
      "Edit": "संपादित करा",
      "Delete": "काढून टाका",
      
      // User Dashboard
      "Search for services, shops...": "सेवा, दुकाने शोधा...",
      "All Categories": "सर्व श्रेणी",
      "Any Price": "कोणतीही किंमत",
      "Under ₹500": "₹500 च्या खाली",
      "₹500 - ₹1000": "₹500 - ₹1000",
      "Above ₹1000": "₹1000 च्या वर",
      "Min Rating": "किमान रेटिंग",
      "Any Rating": "कोणतेही रेटिंग",
      "Stars": "स्टार्स",
      "Top Pick": "उत्कृष्ट निवड",
      "Get Directions": "दिशा मिळवा",
      "Locate": "शोधा",
      "Leave Feedback": "अभिप्राय द्या",
      "Location unavailable": "स्थान अनुपलब्ध",
      "km from you": "किमी दूर (तुमच्यापासून)",
      "km from city center": "किमी दूर (शहराच्या मध्यभागापासून)",
      "reviews": "पुनरावलोकने",
      "market": "बाजार",
      "No matches found": "काहीही जुळले नाही",
      "Clear All Filters": "सर्व फिल्टर काढा",
      
      // Shopkeeper Dashboard
      "My Shops": "माझी दुकाने",
      "Shop Insights": "दुकान अंतर्दृष्टी",
      "Add New Shop": "नवीन दुकान जोडा",
      "Shop Info": "दुकानाची माहिती",
      "Service Type": "सेवेचा प्रकार",
      "Base Price": "मूळ किंमत",
      "Actions": "कृती",
      "No shops listed": "कोणतीही दुकाने सूचीबद्ध नाहीत",
      "Total Views": "एकूण दृश्ये",
      "Search Appearances": "शोध उपस्थिती",
      "Avg. Shop Rating": "सरासरी दुकान रेटिंग",
      
      // Admin Dashboard
      "Manage Users": "वापरकर्ते व्यवस्थापित करा",
      "Manage Shops": "दुकाने व्यवस्थापित करा",
      "Total Users": "एकूण वापरकर्ते",
      "Total Shops": "एकूण दुकाने",
      "Platform Health": "प्लॅटफॉर्म आरोग्य",
      "User Details": "वापरकर्ता तपशील",
      "Shop Details": "दुकान तपशील",
      "Owned Shops": "मालकीची दुकाने",
      "Reports & Issues": "अहवाल आणि समस्या",
      "New Users": "नवीन वापरकर्ते",
      "New Shops": "नवीन दुकाने",
      "Suspend": "निलंबित करा",
      "Resolve": "निराकरण करा",
      "Dismiss": "काढून टाका",
      "Active": "सक्रिय",
      "Suspended": "निलंबित",
      
      // Profile
      "My Profile": "माझे प्रोफाइल",
      "Manage your personal information": "तुमची वैयक्तिक माहिती आणि प्राधान्ये व्यवस्थापित करा.",
      "Full Name": "पूर्ण नाव",
      "Email Address": "ईमेल पत्ता",
      "Contact Number": "संपर्क क्रमांक",
      "Location / Address": "स्थान / पत्ता",
      "Bio / Description": "बायो / वर्णन",
      "Save Profile": "प्रोफाइल सेव्ह करा"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
